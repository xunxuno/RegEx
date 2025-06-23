import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const RegexInput: React.FC<Props> = ({ value, onChange }) => (
  <TextInput
    style={styles.input}
    placeholder="Ingresa una expresión regular"
    value={value}
    onChangeText={onChange}
    autoCapitalize="none"
    autoCorrect={false}
  />
);

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#888',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
  },
});
