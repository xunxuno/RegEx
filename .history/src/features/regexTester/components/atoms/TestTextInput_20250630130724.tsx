import React from 'react';
import { TextInput, StyleSheet } from 'react-native';
//Interface que define las propiedades del componente TestTextInput
interface Props {
  value: string; //Valor actual del texto de prueba
  onChange: (value: string) => void; //Función callback para manejar cambios en el texto
}
//Componente de entrada de texto para pruebas de expresiones regulares.
export const TestTextInput: React.FC<Props> = ({ value, onChange }) => (
  <TextInput
    style={[styles.input, { height: 120 }]}
    placeholder="Texto de prueba"
    multiline // Habilita múltiples líneas
    value={value} // Valor controlado
    onChangeText={onChange} // Manejador de cambios
  />
);
// estilos
const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    textAlignVertical: 'top',
  },
});
