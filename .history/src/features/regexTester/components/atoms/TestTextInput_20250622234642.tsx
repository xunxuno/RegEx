import React from 'react';
import { View, TextInput, StyleSheet, Text } from 'react-native';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const TestTextInput: React.FC<Props> = ({ value, onChange }) => {
  return (
    <View>
      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Texto de prueba"
        multiline
        value={value}
        onChangeText={(text) => {
          console.log('Texto actualizado:', text);
          onChange(text);
        }}
        editable={true}
      />
      <Text style={{ fontSize: 12, color: 'gray' }}>DEBUG: {value}</Text>
    </View>
  );
};

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
