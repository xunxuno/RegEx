//Pantalla para visualizar el historial de expresiones regulares probadas.
//Permite seleccionar entradas pasadas para reutilizarlas en la pantalla principal.
import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegexStore } from '../../data/store/useRegexStore';
import { RootStackParamList } from '../../../regexTester/app/AppNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// Callback opcional para manejar la selección desde otro componente en lugar de navegar directamente (uso reusable).
interface Props {
  onSelect?: (pattern: string, testText: string) => void;
}

export const RegexHistoryScreen: React.FC<Props> = ({ onSelect }) => {
  const { entries, loadEntries } = useRegexStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();  // Hook de navegación para ir a RegexTester
// Cargar historial al montar la pantalla
  useEffect(() => {
    loadEntries();
  }, []);
//Maneja la selección de un item del historial. Si se provee `onSelect`, lo usa; si no, navega con parámetros
  const handleSelect = (pattern: string, testText: string) => {
    if (onSelect) {
      onSelect(pattern, testText);
    } else {
      navigation.navigate('RegexTester', { pattern, testText });
    }
  };
  // Renderiza cada ítem del historial como una tarjeta tocable.
  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => 
              navigation.navigate('RegexTester', {
        pattern: item.pattern,
        testText: item.testText,
      })
    }
    >
      <Text style={styles.pattern}>{item.pattern}</Text>
      <Text style={styles.testText}>Texto: {item.testText}</Text>
      <Text style={styles.date}>
        {new Date(item.createdAt).toLocaleString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Historial de expresiones</Text>
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No hay expresiones guardadas.</Text>}
      />
    </View>
  );
};
// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  list: {
    paddingBottom: 40,
  },
  item: {
    backgroundColor: '#eee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  pattern: {
    fontSize: 16,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  testText: {
  fontSize: 14,
  color: '#333',
  marginTop: 4,
},
});
