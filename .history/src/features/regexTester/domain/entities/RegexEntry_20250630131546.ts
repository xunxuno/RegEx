export interface RegexEntry { //Interfaz que representa una entrada de expresión regular
  id?: number; //Identificador único
  pattern: string; //La expresión regular
  testText: string; //El texto utilizado para probar la expresión regular
  createdAt: number; //Timestamp de creación
}