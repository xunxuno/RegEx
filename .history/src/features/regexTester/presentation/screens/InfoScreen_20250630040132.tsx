import React from 'react';
import { ScrollView, Text, StyleSheet, View, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../../regexTester/app/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export const InfoScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const ejemplo = '\\b\\d{3}-\\d{2}-\\d{4}\\b';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>¿Qué es una expresión regular?</Text>
      <Text style={styles.text}>
        Una expresión regular (regex) es una secuencia de caracteres que define un patrón de búsqueda.
        Se utilizan para validar, buscar o reemplazar texto de forma flexible.
      </Text>
      <Text style={styles.text}>Imagínala como un patrón que describe cómo debe ser una cadena de texto, ya sea un correo electrónico, un número de teléfono 
        o incluso una contraseña segura.
        </Text>

      <Text style={styles.subtitle}>Ejemplo:</Text>
      <Text style={styles.text}>Este patrón busca números de seguro social con el formato 000-00-0000.</Text>
      <Text style={styles.code}>{ejemplo}</Text>
      <Text style={styles.text}>\d{3}: 3 dígitos seguidos.</Text>
      <Text style={styles.text}>-: Un guión literal.</Text>
      <Text style={styles.text}>\d{2}: 2 dígitos más.</Text>
      <Text style={styles.text}>\d{4}: 4 dígitos al final.</Text>

      <Button title="Probar este ejemplo" onPress={() =>
        navigation.navigate('RegexTester', {
          pattern: ejemplo,
          testText: 'Mi número es 123-45-6789 y debe ser validado.',
        })
      } />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 12,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 16,
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
});
