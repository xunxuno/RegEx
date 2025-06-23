import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  text: string;
  matches: number[][];
}

export const MatchResult: React.FC<Props> = ({ text, matches }) => {
  if (!text) {
    return <Text style={styles.normal}>Sin texto de prueba.</Text>;
  }

  const result: React.ReactElement[] = [];
  let lastIndex = 0;

  matches.forEach(([start, end], index) => {
    if (start > lastIndex) {
      const before = text.slice(lastIndex, start);
      result.push(
        <Text key={`before-${index}`} style={styles.normal}>
          {before}
        </Text>
      );
    }

    const match = text.slice(start, end);
    result.push(
      <Text key={`match-${index}`} style={styles.match}>
        {match}
      </Text>
    );

    lastIndex = end;
  });

  if (lastIndex < text.length) {
    const after = text.slice(lastIndex);
    result.push(
      <Text key="after" style={styles.normal}>
        {after}
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {/* 👇 Esta parte es CLAVE: cada <Text> va en su propio View */}
      {result.map((el, index) => (
        <View key={index} style={styles.block}>
          {el}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  block: {
    flexDirection: 'row',
    flexShrink: 0,
  },
  normal: {
    color: '#000',
    fontSize: 16,
  },
  match: {
    backgroundColor: 'yellow',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
