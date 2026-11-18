import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { getTransactions } from '../../db/database';
import { Transaction } from '../../types/transaction';

export default function TransactionsScreen() {
  const [items, setItems] = useState<Transaction[]>([]);

  useFocusEffect(
    useCallback(() => {
      const data = getTransactions();
      setItems(data);
    }, [])
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={<Text style={styles.empty}>Ei vielä tallennettuja kuluja.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.meta}>
                {item.category} • {item.date}
              </Text>
            </View>
            <Text style={styles.amount}>-{item.amount.toFixed(2)} €</Text>
          </View>
        )}
      />
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
  title: { fontSize: 16, fontWeight: '600', color: '#111827' },
  meta: { fontSize: 13, color: '#6b7280', marginTop: 4 },
  amount: { fontSize: 16, fontWeight: '700', color: '#dc2626' },
});