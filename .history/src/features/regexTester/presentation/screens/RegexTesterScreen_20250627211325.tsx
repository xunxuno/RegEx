import React from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, Button} from 'react-native';
import { RegexInput } from '../../components/atoms/RegexInput';
import { TestTextInput } from '../../components/atoms/TestTextInput';
import { MatchResult } from '../../components/molecules/MatchResult';
import { useRegexTesterViewModel } from '../viewmodel/useRegexTesterViewModel';
import { ASTViewer } from '../../components/molecules/ASTViewer';
import { RailDiagram } from '../../components/organisms/RailDiagram';
import { useRef, useEffect } from 'react';

import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';

import { useRegexStore } from '../../store/useRegexStore';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/AppNavigator';
import { useRoute } from '@react-navigation/native';
import { RouteProp } from '@react-navigation/native';

export const RegexTesterScreen: React.FC = () => {
  const {
    regex,
    testText,
    setRegex,
    setTestText,
    matches,
    ast,
  } = useRegexTesterViewModel();


const { loadEntries, addEntry, entries } = useRegexStore();
const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
const route = useRoute<RouteProp<RootStackParamList, 'RegexTester'>>();

useEffect(() => {
  if (route.params?.pattern) {
    setRegex(route.params.pattern);
    navigation.setParams({ pattern: undefined });
  }
}, [route.params]);

const handleGoToHistory = () => {
  navigation.navigate('RegexHistory');
};



  useEffect(() => {
    loadEntries();
  }, []);

  const diagramRef = useRef<ViewShot>(null);

  const handleCapture = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permiso requerido',
          'Necesitamos acceso a la galería para guardar la imagen.'
        );
        return;
      }

      const uri = await diagramRef.current?.capture?.();
      if (!uri) throw new Error('No se pudo capturar la imagen.');

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Diagramas Regex', asset, false);

      Alert.alert('Éxito', 'Diagrama guardado en la galería ');
    } catch (error) {
      console.error('Error al guardar imagen:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar la imagen.');
    }
  };


    useEffect(() => {
    if (regex.trim().length > 0 && testText.trim().length > 0) {
      addEntry(regex, testText);
    }
  }, [regex]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <RegexInput value={regex} onChange={setRegex} />
      <TestTextInput value={testText} onChange={setTestText} />

      <View style={styles.result}>
        <MatchResult text={testText} matches={matches} />
      </View>

      {ast && <ASTViewer ast={ast} />}

      {ast && (
        <>
          <Text style={styles.diagramLabel}>Diagrama de Ferrocarril:</Text>

          <ViewShot
            ref={diagramRef}
            options={{ format: 'png', quality: 1 }}
            style={styles.diagramWrapper}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <RailDiagram ast={ast} />
            </ScrollView>
          </ViewShot>
          <View style={styles.buttonContainer}>
            <Button title="Ver historial" onPress={handleGoToHistory} />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Guardar diagrama como imagen" onPress={handleCapture} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

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
});