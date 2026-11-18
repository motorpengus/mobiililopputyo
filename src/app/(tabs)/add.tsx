import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { addTransaction } from '../../db/database';

const CATEGORIES = ['Ruoka', 'Asuminen', 'Liikkuminen', 'Vapaa-aika', 'Muu'];

export default function AddScreen() {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);

  const handleSave = () => {
    const parsedAmount = parseFloat(amount.replace(',', '.'));

    if (!title.trim() || isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert('Virheellinen syöte', 'Syötä kululle nimi ja kelvollinen summa.');
      return;
    }

    addTransaction({
      title: title.trim(),
      amount: parsedAmount,
      type: 'expense',
      category,
      date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
    });

    // Tyhjennetään kentät ja siirrytään historiapuolelle
    setTitle('');
    setAmount('');
    router.push('/(tabs)/transactions');
  };

  return (
    <View style={styles.container}>
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

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Tallenna kulu</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 6, marginTop: 12 },
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
  saveButton: {
    marginTop: 28,
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});