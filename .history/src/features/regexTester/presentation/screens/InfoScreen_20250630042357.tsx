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
      <Text style={styles.code}>{ejemplo}</Text>
      <Text style={styles.text}>Este patrón busca números de seguro social con el formato 000-00-0000.</Text>
       <View style={styles.codeExplanation}>
            <Text style={styles.subtitle}>Desglose de la Expresión Regular:</Text>
            <View style={styles.codeLine}>
              <Text style={styles.codeSymbol}>\b</Text>
              <Text style={styles.text}>Límite de palabra</Text>
              <Text style={styles.codeSymbol}>\d{3}</Text>
              <Text style={styles.text}>3 dígitos seguidos</Text>
            </View>
            <View style={styles.codeLine}>
              <Text style={styles.codeSymbol}> -</Text>
              <Text style={styles.text}>    Un guión literal</Text>
            </View>
            <View style={styles.codeLine}>
              <Text style={styles.codeSymbol}>\d{2}</Text>
              <Text style={styles.text}>2 dígitos más</Text>
            </View>
            <View style={styles.codeLine}>
              <Text style={styles.codeSymbol}>\d{4}</Text>
              <Text style={styles.text}>4 dígitos al final</Text>
            </View>
          </View>


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
    marginBottom: 20,
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
    codeExplanation: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'flex-start',
  },
  codeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeSymbol: {
    fontFamily: 'Courier New',
    backgroundColor: '#f1f3f5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginRight: 10,
    color: '#d6336c',
  },
});
