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
        <View key={`before-${index}`} style={styles.textWrapper}>
          <Text style={styles.normal}>{text.slice(lastIndex, start)}</Text>
        </View>
      );
    }

    result.push(
      <View key={`match-${index}`} style={styles.textWrapper}>
        <Text style={styles.highlight}>{text.slice(start, end)}</Text>
      </View>
    );

    lastIndex = end;
  });

  if (lastIndex < text.length) {
    result.push(
      <View key="after" style={styles.textWrapper}>
        <Text style={styles.normal}>{text.slice(lastIndex)}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {result}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  textWrapper: {
    flexDirection: 'row',
    flexShrink: 0,
  },
  normal: {
    color: '#000',
    fontSize: 16,
  },
  highlight: {
    backgroundColor: 'yellow',
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
