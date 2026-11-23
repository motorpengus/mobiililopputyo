import { Ionicons } from '@expo/vector-icons';
import { File } from 'expo-file-system';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Alert, FlatList, Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { deleteTransaction, getTransactions } from '../../db/database';
import { Transaction } from '../../types/transaction';

export default function TransactionsScreen() {
  const [items, setItems] = useState<Transaction[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<string | null>(null);

  const loadData = () => {
    setItems(getTransactions());
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleDelete = (item: Transaction) => {
    Alert.alert('Poista kulu', `Haluatko varmasti poistaa kulun "${item.title}"?`, [
      { text: 'Peruuta', style: 'cancel' },
      {
        text: 'Poista',
        style: 'destructive',
        onPress: () => {
          // Poistetaan kuvatiedosto laitteelta uudella File-rajapinnalla
          if (item.receiptUri) {
            const file = new File(item.receiptUri);
            if (file.exists) {
              file.delete();
            }
          }
          deleteTransaction(item.id);
          loadData();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Ei vielä tallennettuja kuluja.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Pressable
              style={styles.cardLeft}
              onPress={() => item.receiptUri && setSelectedReceipt(item.receiptUri)}
            >
              <View style={styles.titleRow}>
                <Text style={styles.title}>{item.title}</Text>
                {item.receiptUri && (
                  <Ionicons name="receipt-outline" size={18} color="#2563eb" style={{ marginLeft: 6 }} />
                )}
              </View>
              <Text style={styles.meta}>
                {item.category} • {item.date}
              </Text>
            </Pressable>

            <View style={styles.cardRight}>
              <Text style={styles.amount}>-{item.amount.toFixed(2)} €</Text>
              <Pressable onPress={() => handleDelete(item)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={20} color="#9ca3af" />
              </Pressable>
            </View>
          </View>
        )}
      />

      {/* Modaali kuittikuvan katseluun */}
      <Modal visible={!!selectedReceipt} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            {selectedReceipt && (
              <Image source={{ uri: selectedReceipt }} style={styles.fullReceipt} />
            )}
            <Pressable style={styles.closeBtn} onPress={() => setSelectedReceipt(null)}>
              <Text style={styles.closeBtnText}>Sulje kuitti</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9fafb' },
  empty: { textAlign: 'center', marginTop: 40, color: '#6b7280', fontSize: 16 },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cardLeft: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '600', color: '#111827' },
  meta: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  cardRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  amount: { fontSize: 16, fontWeight: '700', color: '#dc2626' },
  deleteBtn: { padding: 4 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: { width: '100%', alignItems: 'center' },
  fullReceipt: { width: '100%', height: '75%', borderRadius: 12, resizeMode: 'contain' },
  closeBtn: {
    marginTop: 20,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 25,
  },
  closeBtnText: { fontWeight: '700', fontSize: 16, color: '#111827' },
});