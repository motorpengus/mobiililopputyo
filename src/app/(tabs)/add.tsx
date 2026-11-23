import { Ionicons } from '@expo/vector-icons';
import { File, Paths } from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { addTransaction } from '../../db/database';

const CATEGORIES = ['Ruoka', 'Asuminen', 'Liikkuminen', 'Vapaa-aika', 'Muu'];

export default function AddScreen() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tempImageUri, setTempImageUri] = useState<string | null>(null);

  // Kuvan ottaminen kameralla
  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Lupa vaaditaan', 'Sovellus tarvitsee kameran käyttöoikeuden kuitin kuvaamiseen.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7, // Pakataan hieman, jotta tilaa säästyy
    });

    if (!result.canceled) {
      setTempImageUri(result.assets[0].uri);
    }
  };

  // Kuvan valinta galleriasta (hyödyllinen myös emulaattorilla testatessa)
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
    });

    if (!result.canceled) {
      setTempImageUri(result.assets[0].uri);
    }
  };

  // Kuvan kopiointi sovelluksen pysyvään kansioon
  const saveImagePermanently = (uri: string): string => {
    const fileName = `receipt_${Date.now()}.jpg`;
    const sourceFile = new File(uri);
    const destinationFile = new File(Paths.document, fileName);
    
    sourceFile.copy(destinationFile);
    return destinationFile.uri;
  };

  const handleSave = async () => {
    const parsedAmount = parseFloat(amount.replace(',', '.'));

    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Virheellinen syöte', 'Syötä kululle nimi ja kelvollinen summa.');
      return;
    }

    let savedReceiptUri: string | undefined = undefined;
    if (tempImageUri) {
      savedReceiptUri = await saveImagePermanently(tempImageUri);
    }

    addTransaction({
      title: title.trim(),
      amount: parsedAmount,
      type: 'expense',
      category,
      date: new Date().toISOString().split('T')[0],
      receiptUri: savedReceiptUri,
    });

    // Nollataan lomake
    setTitle('');
    setAmount('');
    setTempImageUri(null);
    router.push('/(tabs)/transactions');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.label}>Kulun nimi</Text>
      <TextInput
        style={styles.input}
        placeholder="Esim. Ruokaostokset Prisma"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Summa (€)</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Kategoria</Text>
      <View style={styles.categoryRow}>
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setCategory(cat)}
            style={[styles.chip, category === cat && styles.chipSelected]}
          >
            <Text style={[styles.chipText, category === cat && styles.chipTextSelected]}>
              {cat}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Kuitti (valinnainen)</Text>
      <View style={styles.imageButtonRow}>
        <Pressable style={styles.mediaButton} onPress={takePhoto}>
          <Ionicons name="camera" size={20} color="#2563eb" />
          <Text style={styles.mediaButtonText}>Ota kuva</Text>
        </Pressable>

        <Pressable style={styles.mediaButton} onPress={pickImage}>
          <Ionicons name="images" size={20} color="#2563eb" />
          <Text style={styles.mediaButtonText}>Galleria</Text>
        </Pressable>
      </View>

      {tempImageUri && (
        <View style={styles.previewContainer}>
          <Image source={{ uri: tempImageUri }} style={styles.previewImage} />
          <Pressable style={styles.removeImageBtn} onPress={() => setTempImageUri(null)}>
            <Text style={styles.removeImageText}>Poista kuva</Text>
          </Pressable>
        </View>
      )}

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Tallenna kulu</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 6, marginTop: 14 },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  chipSelected: { backgroundColor: '#2563eb' },
  chipText: { color: '#374151', fontWeight: '500' },
  chipTextSelected: { color: '#fff' },
  imageButtonRow: { flexDirection: 'row', gap: 12, marginTop: 4 },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#2563eb',
    borderRadius: 8,
    backgroundColor: '#eff6ff',
  },
  mediaButtonText: { color: '#2563eb', fontWeight: '600' },
  previewContainer: { marginTop: 14, alignItems: 'center' },
  previewImage: { width: '100%', height: 220, borderRadius: 10, resizeMode: 'cover' },
  removeImageBtn: { marginTop: 8, padding: 6 },
  removeImageText: { color: '#dc2626', fontWeight: '600' },
  saveButton: {
    marginTop: 28,
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});