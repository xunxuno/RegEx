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
      <Text key={`match-${index}`} style={styles.match}>
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
      {result.map((el, idx) => (
        <View key={idx} style={styles.block}>
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
  },
  normal: {
    color: '#000',
    fontSize: 16,
  },
  match: {
    backgroundColor: '#ffd700', // más intenso que "yellow"
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 2,
    borderRadius: 2,
  },
});
