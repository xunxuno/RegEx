import { create } from 'zustand';
import { RegexEntry } from '../domain/entities/RegexEntry';
import { insertRegexEntry, getRegexEntries, initRegexDB, } from './regexStorage';

interface RegexState {
  entries: RegexEntry[];
  initialized: boolean;
  loadEntries: () => Promise<void>;
  addEntry: (pattern: string, testText: string) => Promise<void>;
  initDatabase: () => void;
}

export const useRegexStore = create<RegexState>((set, get) => ({
  entries: [],
  initialized: false,

  initDatabase: () => {
    if (!get().initialized) {
      initRegexDB();
      set({ initialized: true });
    }
  },

  loadEntries: async () => {
    const list = await getRegexEntries();
    set({ entries: list });
  },

  addEntry: async (pattern: string, testText: string) => {
    const newEntry: RegexEntry = {
      pattern,
      testText,
      createdAt: Date.now(),
    };
    await insertRegexEntry(newEntry);
    const updated = await getRegexEntries();
    set({ entries: updated });
  },
}));
