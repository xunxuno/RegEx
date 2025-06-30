import { openDatabaseSync } from 'expo-sqlite';
import { RegexEntry } from '../../domain/entities/RegexEntry';

const db = openDatabaseSync('regex.db');

export const initRegexDB = () => {
  db.execAsync(
    `CREATE TABLE IF NOT EXISTS regex_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pattern TEXT NOT NULL,
      testText TEXT NOT NULL,
      createdAt INTEGER
    );`
  );
};

export const insertRegexEntry = async (entry: RegexEntry): Promise<void> => {
  await db.runAsync(
    'INSERT INTO regex_entries (pattern, testText, createdAt) VALUES (?, ?, ?)',
    [entry.pattern, entry.testText, entry.createdAt]
  );
};

export const getRegexEntries = async (): Promise<RegexEntry[]> => {
  const result = await db.getAllAsync<RegexEntry>(
    'SELECT * FROM regex_entries ORDER BY createdAt DESC'
  );
  return result;
};
