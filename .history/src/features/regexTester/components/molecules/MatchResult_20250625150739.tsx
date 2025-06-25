import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
  text: string;
  matches: number[][];
}

export const MatchResult: React.FC<Props> = ({ text, matches }) => {
  if (!text) return null;

  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach(([start, end], index) => {
    if (start > lastIndex) {
      result.push(
        <Text key={`before-${index}`} style={styles.normal}>
          {text.slice(lastIndex, start)}
        </Text>
      );
    }

    result.push(
      <Text key={`match-${index}`} style={styles.highlight}>
        {text.slice(start, end)}
      </Text>
    );

    lastIndex = end;
  });

  if (lastIndex < text.length) {
    result.push(
      <Text key="after" style={styles.normal}>
        {text.slice(lastIndex)}
      </Text>
    );
  }

  // 👇 Esta parte es crucial: un solo <Text> como contenedor de todos
  return <Text style={styles.container}>{result}</Text>;
};

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
    backgroundColor: '#ffeb3b', // amarillo fuerte visible
    color: '#000',
    fontWeight: 'bold',
  },
});
