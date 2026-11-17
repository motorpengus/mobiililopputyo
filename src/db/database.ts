import * as SQLite from 'expo-sqlite';
import { Transaction } from '../types/transaction';

// Avataan tai luodaan tietokantatiedosto
const db = SQLite.openDatabaseSync('budget.db');

export const initDatabase = () => {
  db.execSync(`
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      date TEXT NOT NULL,
      receiptUri TEXT
    );
  `);
};

export const addTransaction = (item: Omit<Transaction, 'id'>) => {
  const result = db.runSync(
    'INSERT INTO transactions (title, amount, type, category, date, receiptUri) VALUES (?, ?, ?, ?, ?, ?)',
    [item.title, item.amount, item.type, item.category, item.date, item.receiptUri ?? null]
  );
  return result.lastInsertRowId;
};

export const getTransactions = (): Transaction[] => {
  return db.getAllSync<Transaction>('SELECT * FROM transactions ORDER BY date DESC, id DESC');
};