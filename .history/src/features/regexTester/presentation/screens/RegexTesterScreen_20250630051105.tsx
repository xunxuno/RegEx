import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, Button } from 'react-native';

// Atoms
import { RegexInput } from '../../components/atoms/RegexInput';
import { TestTextInput } from '../../components/atoms/TestTextInput';

// Molecules
import { MatchResult } from '../../components/molecules/MatchResult';
import { ASTViewer } from '../../components/molecules/ASTViewer';

// Organisms
import { RailDiagram } from '../../components/organisms/RailDiagram';
import { MatchedRailDiagram } from '../../components/organisms/MatchedRailDiagram';

// Hooks y almacenamiento
import { useRegexTesterViewModel } from '../viewmodel/useRegexTesterViewModel';
import { useRegexStore } from '../../store/useRegexStore';

// Navegación
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/AppNavigator';
import { useRoute, RouteProp } from '@react-navigation/native';

// Herramientas del sistema
import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';


// Componente principal
export const RegexTesterScreen: React.FC = () => {
  // ViewModel que maneja el estado de la vista (MVVM)
  const {
    regex,
    testText,
    setRegex,
    setTestText,
    matches,
    ast,
  } = useRegexTesterViewModel();

  // Store global con persistencia
  const { loadEntries, addEntry, entries } = useRegexStore();

  // Navegación y parámetros recibidos
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'RegexTester'>>();

  // Refs
  const lastSavedRef = useRef<{ pattern: string; testText: string } | null>(null);
  const diagramRef = useRef<ViewShot>(null);

  // Cálculo de coincidencias para el diagrama
  let regexObj: RegExp | null = null;
  let result: RegExpExecArray | null = null;
  let matchIndices: number[][] | null = null;

  try {
    regexObj = new RegExp(regex, 'gd'); // 'd' activa match.indices
    result = regexObj.exec(testText);
    matchIndices = result?.indices ?? null;
  } catch (err) {
    console.warn('Expresión regular inválida:', err);
    matchIndices = null;
  }

  // Si viene una expresión desde el historial, la establece
  useEffect(() => {
    const { pattern, testText } = route.params || {};
    if (pattern) setRegex(pattern);
    if (testText) setTestText(testText);

    // Limpieza de parámetros
    if (pattern || testText) {
      navigation.setParams({ pattern: undefined, testText: undefined });
    }
  }, [route.params?.pattern, route.params?.testText]);

  const handleGoToHistory = () => {
    navigation.navigate('RegexHistory');
  };

  useEffect(() => {
    loadEntries(); // Carga desde SQLite al iniciar
  }, []);

  /**
   * Captura el diagrama como imagen y lo guarda en la galería
   */
  const handleCapture = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido');
        return;
      }

      const uri = await diagramRef.current?.capture?.();
      if (!uri) throw new Error('No se pudo capturar la imagen.');

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Diagramas Regex', asset, false);

      Alert.alert('Éxito', 'Diagrama guardado en la galería');
    } catch (error) {
      console.error('Error al guardar imagen:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar la imagen.');
    }
  };

  /**
   * Agrega una entrada al historial luego de un retraso si no hay duplicados
   */
  useEffect(() => {
    if (regex.trim().length === 0 || testText.trim().length === 0) return;

    const delay = setTimeout(() => {
      const last = lastSavedRef.current;
      const isDuplicate =
        last &&
        last.pattern === regex.trim() &&
        last.testText === testText.trim();

      if (!isDuplicate) {
        addEntry(regex.trim(), testText.trim());
        lastSavedRef.current = {
          pattern: regex.trim(),
          testText: testText.trim(),
        };
      }
    }, 6000);

    return () => clearTimeout(delay);
  }, [regex, testText]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <RegexInput value={regex} onChange={setRegex} />
      <TestTextInput value={testText} onChange={setTestText} />

      <Text style={styles.diagramLabel}>Coincidencias:</Text>
      <View style={styles.result}>
        <MatchResult text={testText} matches={matches} />
      </View>

      <View style={styles.buttonRow}>
        <Button title="Ver historial" onPress={handleGoToHistory} />
        <Button
          title="Limpiar"
          color="#f44336"
          onPress={() => {
            setRegex('');
            setTestText('');
          }}
        />
      </View>

      {ast && <ASTViewer ast={ast} />}

      {regex && testText && (
        <>
          <Text style={styles.diagramLabel}>Coincidencias en texto:</Text>
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <MatchedRailDiagram regex={regex} testText={testText} />
          </View>
        </>
      )}

      {ast && (
        <>
          <Text style={styles.diagramLabel}>Diagrama de Ferrocarril de la Expresión Regular:</Text>

          <ViewShot
            ref={diagramRef}
            options={{ format: 'png', quality: 1 }}
            style={{ ...styles.diagramWrapper, alignSelf: 'center' }}
          >
            <RailDiagram ast={ast} matchIndices={matchIndices} />
          </ViewShot>

          <View style={styles.buttonContainer}>
            <Button title="Guardar diagrama como imagen" onPress={handleCapture} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  result: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 10,
  },
  diagramLabel: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    fontSize: 16,
  },
  diagramWrapper: {
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  buttonContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
  },
});
