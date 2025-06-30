import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
  text: string; // Texto de entrada donde se buscarán coincidencias
  matches: number[][];  // Lista de rangos [start, end] que representan los índices de coincidencias encontradas
}
/**
 * Componente Molecule que muestra el texto original con las coincidencias resaltadas.
 *
 * Las coincidencias se pasan como una lista de rangos (índices), y se muestran con fondo
 * amarillo y texto en negrita. Los fragmentos que no hacen match se muestran con estilo normal.
 *
 * Este componente es útil para visualizar visualmente cómo la expresión regular afecta al texto.
 */
export const MatchResult: React.FC<Props> = ({ text, matches }) => {
  if (!text) return null; // Si no hay texto, no se renderiza nada

  const result: React.ReactNode[] = []; // Fragmentos de texto para renderizar
  let lastIndex = 0; // Marca el índice final de la última coincidencia
// Recorre cada coincidencia para construir el resultado visual
  matches.forEach(([start, end], index) => {
    if (start > lastIndex) { // Agrega el texto entre la última coincidencia y el inicio de la actual (si hay)
      result.push(
        <Text key={`before-${index}`} style={styles.normal}>
          {text.slice(lastIndex, start)}
        </Text>
      );
    }
// Agrega el texto que hizo match con estilo destacado
    result.push(
      <Text key={`match-${index}`} style={styles.highlight}>
        {text.slice(start, end)}
      </Text>
    );

    lastIndex = end; // Actualiza el último índice
  });
// Agrega el texto restante después del último match
  if (lastIndex < text.length) {
    result.push(
      <Text key="after" style={styles.normal}>
        {text.slice(lastIndex)}
      </Text>
    );
  }

  return <Text style={styles.container}>{result}</Text>; // Devuelve todos los fragmentos de texto, con y sin resaltar
};
// Estilos para los fragmentos de texto
const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    fontSize: 16,
  },
  normal: {
    color: '#000',
  },
  highlight: {
    backgroundColor: '#ffeb3b',
    color: '#000',
    fontWeight: 'bold',
  },
});
