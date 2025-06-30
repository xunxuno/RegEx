import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface Props {
  value: string; //El valor actual de la expresión regular en el campo de texto
  onChange: (value: string) => void; //unción callback que se ejecuta cuando el texto cambia
}
// Componente de entrada de texto para trabajar con expresiones regulares.
export const RegexInput: React.FC<Props> = ({ value, onChange }) => (
  <TextInput
    style={styles.input}
    placeholder="Ingresa una expresión regular"
    value={value}
    onChangeText={onChange}
    autoCapitalize="none" // Desactivado para no interferir con caracteres especiales
    autoCorrect={false} // Desactivado para evitar correcciones no deseadas
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
  },
});
