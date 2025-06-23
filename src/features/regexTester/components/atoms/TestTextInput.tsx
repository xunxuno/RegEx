import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const TestTextInput: React.FC<Props> = ({ value, onChange }) => (
  <TextInput
    style={[styles.input, { height: 120 }]}
    placeholder="Texto de prueba"
    multiline
    value={value}
    onChangeText={onChange}
  />
);

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
