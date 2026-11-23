import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { CategorySummary, getMonthlySummary } from '../../db/database';

const CATEGORY_COLORS: Record<string, string> = {
  Ruoka: '#10b981',
  Asuminen: '#3b82f6',
  Liikkuminen: '#f59e0b',
  'Vapaa-aika': '#8b5cf6',
  Muu: '#6b7280',
};

export default function SummaryScreen() {
  const [summary, setSummary] = useState<CategorySummary[]>([]);
  const [totalSpent, setTotalSpent] = useState(0);

  // Haetaan kuluva kuukausi muodossa "YYYY-MM"
  const currentMonth = new Date().toISOString().slice(0, 7);

  useFocusEffect(
    useCallback(() => {
      const data = getMonthlySummary(currentMonth);
      setSummary(data);

      const sum = data.reduce((acc, item) => acc + item.total, 0);
      setTotalSpent(sum);
    }, [currentMonth])
  );

  return (
    <ScrollView style={styles.container}>
      {/* Kokonaiskulujen pääkortti */}
      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Kulut yhteensä ({currentMonth})</Text>
        <Text style={styles.heroAmount}>{totalSpent.toFixed(2)} €</Text>
      </View>

      {/* Kategorioiden jakauma */}
      <Text style={styles.sectionTitle}>Kulutus kategorioittain</Text>

      {summary.length === 0 ? (
        <Text style={styles.emptyText}>Ei vielä kirjattuja kuluja tälle kuukaudelle.</Text>
      ) : (
        <View style={styles.card}>
          {summary.map((item) => {
            const percentage = totalSpent > 0 ? (item.total / totalSpent) * 100 : 0;
            const barColor = CATEGORY_COLORS[item.category] || '#2563eb';

            return (
              <View key={item.category} style={styles.rowContainer}>
                <View style={styles.rowHeader}>
                  <Text style={styles.categoryName}>{item.category}</Text>
                  <Text style={styles.categoryAmount}>
                    {item.total.toFixed(2)} € ({percentage.toFixed(0)} %)
                  </Text>
                </View>

                {/* Visuaalinen edistymispalkki */}
                <View style={styles.barBackground}>
                  <View
                    style={[
                      styles.barFill,
                      { width: `${percentage}%`, backgroundColor: barColor },
                    ]}
                  />
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f9fafb' },
  heroCard: {
    backgroundColor: '#2563eb',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  heroLabel: { color: '#dbeafe', fontSize: 15, fontWeight: '500' },
  heroAmount: { color: '#fff', fontSize: 34, fontWeight: '800', marginTop: 6 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 12 },
  emptyText: { color: '#6b7280', textAlign: 'center', marginTop: 20, fontSize: 15 },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    gap: 16,
  },
  rowContainer: { gap: 6 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  categoryName: { fontSize: 15, fontWeight: '600', color: '#1f2937' },
  categoryAmount: { fontSize: 14, fontWeight: '600', color: '#4b5563' },
  barBackground: {
    height: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: { height: '100%', borderRadius: 5 },
});