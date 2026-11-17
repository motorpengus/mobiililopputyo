export interface Transaction {
  id: number;
  title: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  date: string;         // ISO-muoto: YYYY-MM-DD
  receiptUri?: string;  // Paikallinen polku kuittikuvaan
}