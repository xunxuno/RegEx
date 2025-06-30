import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, Text, Button } from 'react-native';
import { RegexInput } from '../../components/atoms/RegexInput';
import { TestTextInput } from '../../components/atoms/TestTextInput';
import { MatchResult } from '../../components/molecules/MatchResult';
import { useRegexTesterViewModel } from '../viewmodel/useRegexTesterViewModel';
import { ASTViewer } from '../../components/molecules/ASTViewer';
import { RailDiagram } from '../../components/organisms/RailDiagram';
import { MatchedRailDiagram } from '../../components/organisms/MatchedRailDiagram';

import * as MediaLibrary from 'expo-media-library';
import ViewShot from 'react-native-view-shot';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

import { useRegexStore } from '../../store/useRegexStore';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../app/AppNavigator';
import { useRoute, RouteProp } from '@react-navigation/native';
import { Node } from 'regexpp/ast';

const renderAstToText = (node: Node, indent = 0): string => {
  const padding = '│  '.repeat(indent);
  let result = `${padding}└─ ${node.type}\n`;

  if ('elements' in node && Array.isArray((node as any).elements)) {
    for (const child of (node as any).elements) {
      result += renderAstToText(child, indent + 1);
    }
  }

  if ('expression' in node && typeof (node as any).expression === 'object') {
    result += renderAstToText((node as any).expression, indent + 1);
  }

  return result;
};

const generatePdfContent = (
  regex: string,
  testText: string,
  matches: string[],
  ast: Node | null,
  matchDiagramUri: string,
  patternDiagramUri: string
) => {
  const astText = ast ? renderAstToText(ast) : 'No disponible';

  return `
    <html>
      <body style="font-family: sans-serif; padding: 20px;">
        <h1>Reporte de Expresión Regular</h1>
        <p><strong>Expresión:</strong> ${regex}</p>
        <p><strong>Texto de prueba:</strong> ${testText}</p>

        <h2>Resultados:</h2>
        <ul>
          ${matches.map((m, i) => `<li>Match ${i + 1}: ${m}</li>`).join('')}
        </ul>

        <h2>AST Pattern:</h2>
        <pre style="font-size: 13px; background: #eee; padding: 10px;">${astText}</pre>

        <h2>Diagrama de coincidencias:</h2>
        <img src="${matchDiagramUri}" style="width: 100%; max-width: 600px; max-height: 400px; object-fit: contain;" />

        <h2>Diagrama de la expresión:</h2>
        <img src="${patternDiagramUri}" style="width: 100%; max-width: 600px; max-height: 400px; object-fit: contain;" />
      </body>
    </html>
  `;
};

export const RegexTesterScreen: React.FC = () => {
  const {
    regex,
    testText,
    setRegex,
    setTestText,
    matches,
    ast,
  } = useRegexTesterViewModel();

  const { loadEntries, addEntry } = useRegexStore();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'RegexTester'>>();
  const lastSavedRef = useRef<{ pattern: string; testText: string } | null>(null);

  let regexObj: RegExp | null = null;
  let result: RegExpExecArray | null = null;
  let matchIndices: number[][] | null = null;

  try {
    regexObj = new RegExp(regex, 'gd');
    result = regexObj.exec(testText);
    matchIndices = result?.indices ?? null;
  } catch (err) {
    console.warn('Expresión regular inválida:', err);
    matchIndices = null;
  }

  useEffect(() => {
    const { pattern, testText } = route.params || {};

    if (pattern) setRegex(pattern);
    if (testText) setTestText(testText);
    if (pattern || testText) {
      navigation.setParams({ pattern: undefined, testText: undefined });
    }
  }, [route.params?.pattern, route.params?.testText]);

  const handleGoToHistory = () => {
    navigation.navigate('RegexHistory');
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const diagramRef = useRef<ViewShot>(null);
  const matchDiagramRef = useRef<ViewShot>(null);

  const handleCapture = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Otorga permisos para guardar la imagen.');
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

  const handleExportToPdf = async () => {
    try {
      const [patternBase64, matchBase64] = await Promise.all([
        diagramRef.current?.capture?.(),
        matchDiagramRef.current?.capture?.(),
      ]);

      if (!patternBase64 || !matchBase64) {
        Alert.alert('Error', 'No se pudieron capturar los diagramas.');
        return;
      }

      const patternUri = `data:image/png;base64,${patternBase64}`;
      const matchUri = `data:image/png;base64,${matchBase64}`;
      const matchTexts = matches.map(([start, end]) => testText.slice(start, end));

      const html = generatePdfContent(regex, testText, matchTexts, ast, matchUri, patternUri);
      const { uri: pdfUri } = await Print.printToFileAsync({ html });

      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartir reporte PDF',
      });
    } catch (err) {
      console.error('Error al exportar PDF:', err);
      Alert.alert('Error', 'No se pudo exportar el PDF.');
    }
  };

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
        <Button title="Limpiar" color="#f44336" onPress={() => {
          setRegex('');
          setTestText('');
        }} />
      </View>

      {ast && <ASTViewer ast={ast} />}

      {regex && testText && (
        <>
          <Text style={styles.diagramLabel}>Coincidencias en texto:</Text>
          <ViewShot
            ref={matchDiagramRef}
            options={{ format: 'png', quality: 1, result: 'base64' }}
            style={{ ...styles.diagramWrapper, alignSelf: 'center' }}
          >
            <MatchedRailDiagram regex={regex} testText={testText} />
          </ViewShot>
        </>
      )}

      {ast && (
        <>
          <Text style={styles.diagramLabel}>Diagrama de Ferrocarril de la Expresión Regular:</Text>

          <ViewShot
            ref={diagramRef}
            options={{ format: 'png', quality: 1, result: 'base64' }}
            style={{ ...styles.diagramWrapper, alignSelf: 'center' }}
          >
            <RailDiagram ast={ast} matchIndices={matchIndices} />
          </ViewShot>

          <View style={styles.buttonContainer}>
            <Button title="Guardar diagrama como imagen" onPress={handleCapture} />
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Exportar a PDF" onPress={handleExportToPdf} />
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
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 20,
  },
});
