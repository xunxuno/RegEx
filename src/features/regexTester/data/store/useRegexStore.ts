 //Estado global para la gestión del historial de expresiones regulares.
 //Implementado con Zustand y persistencia usando SQLite.
import { create } from 'zustand';
import { RegexEntry } from '../../domain/entities/RegexEntry';
import { insertRegexEntry, getRegexEntries, initRegexDB, } from './regexStorage';
//Definición del estado global relacionado a expresiones regulares.
interface RegexState {
  entries: RegexEntry[];// Lista de entradas almacenadas (historial)
  initialized: boolean;// Bandera para evitar inicializar DB más de una vez
  loadEntries: () => Promise<void>;// Acción: Cargar entradas desde la base de datos
  addEntry: (pattern: string, testText: string) => Promise<void>; // Acción: Agregar una nueva entrada a la base de datos y actualizar el store
  initDatabase: () => void;// Acción: Inicializar la base de datos si aún no se ha hecho
}
/**
 * Hook Zustand que expone el estado y acciones para el historial Regex.
 * Se usa dentro de features (como RegexTesterScreen) para manejar y persistir registros.
 */
export const useRegexStore = create<RegexState>((set, get) => ({
  entries: [],
  initialized: false,
  /**
   * Inicializa la base de datos (solo una vez).
   */
  initDatabase: () => {
    if (!get().initialized) {
      initRegexDB();
      set({ initialized: true });
    }
  },
//Carga todas las entradas ordenadas desde SQLite.
  loadEntries: async () => {
    const list = await getRegexEntries();
    set({ entries: list });
  },
//Inserta una nueva expresión con su texto de prueba y recarga el historial actualizado.
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
