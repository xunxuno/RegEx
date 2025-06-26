import React from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, Button} from 'react-native';
import { RegexInput } from '../../components/atoms/RegexInput';
import { TestTextInput } from '../../components/atoms/TestTextInput';
import { MatchResult } from '../../components/molecules/MatchResult';
import { useRegexTesterViewModel } from '../viewmodel/useRegexTesterViewModel';
import { ASTViewer } from '../../components/molecules/ASTViewer';
import { RailDiagram } from '../../components/organisms/RailDiagram';
import { captureRef } from 'react-native-view-shot';
import { useRef } from 'react';
import * as MediaLibrary from 'expo-media-library';

export const RegexTesterScreen: React.FC = () => {
  const {
    regex,
    testText,
    setRegex,
    setTestText,
    matches,
    ast,
  } = useRegexTesterViewModel();

  const diagramRef = useRef<View>(null);

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

      const uri = await captureRef(diagramRef, {
        format: 'png',
        quality: 1,
      });

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync('Diagramas Regex', asset, false);

      Alert.alert('Éxito', '✅ Diagrama guardado en la galería 📁');
    } catch (error) {
      console.error('❌ Error al guardar imagen:', error);
      Alert.alert('Error', 'Ocurrió un error al guardar la imagen.');
    }
  };

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
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
            <View ref={diagramRef}>
              <RailDiagram ast={ast} />
            </View>
          </ScrollView>

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
  buttonContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
});