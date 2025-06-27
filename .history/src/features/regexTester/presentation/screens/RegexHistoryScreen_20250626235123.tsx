import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useRegexStore } from '../../store/useRegexStore';
import { RootStackParamList } from '../../../regexTester/app/AppNavigator';

interface Props {
  onSelect?: (pattern: string) => void;
}

export const RegexHistoryScreen: React.FC<Props> = ({ onSelect }) => {
  const { entries, loadEntries } = useRegexStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadEntries();
  }, []);

  const handleSelect = (pattern: string) => {
    if (onSelect) {
      onSelect(pattern);
    } else {
      navigation.navigate('RegexTester' as never, { pattern } as never);
    }
  };

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelect(item.pattern)}
    >
      <Text style={styles.pattern}>{item.pattern}</Text>
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
});
