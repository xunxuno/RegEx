import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

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

  return (
    <View style={styles.container}>
      {result.map((textBlock, index) => (
        <View key={index}>{textBlock}</View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  normal: {
    color: '#000',
  },
  highlight: {
    backgroundColor: 'yellow',
    color: '#000',
    fontWeight: 'bold',
  },
});
