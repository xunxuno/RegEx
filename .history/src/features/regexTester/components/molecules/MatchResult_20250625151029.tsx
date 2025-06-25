import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  text: string;
  matches: number[][];
}

export const MatchResult: React.FC<Props> = ({ text, matches }) => {
  if (!text) return null;

  const result: React.ReactElement[] = [];
  let lastIndex = 0;

  matches.forEach(([start, end], index) => {
    if (start > lastIndex) {
      result.push(
        <View key={`before-${index}`} style={styles.word}>
          <Text style={styles.normal}>{text.slice(lastIndex, start)}</Text>
        </View>
      );
    }

    result.push(
      <View key={`match-${index}`} style={styles.word}>
        <View style={styles.highlightBox}>
          <Text style={styles.highlight}>{text.slice(start, end)}</Text>
        </View>
      </View>
    );

    lastIndex = end;
  });

  if (lastIndex < text.length) {
    result.push(
      <View key="after" style={styles.word}>
        <Text style={styles.normal}>{text.slice(lastIndex)}</Text>
      </View>
    );
  }

  return <View style={styles.container}>{result}</View>;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  word: {
    flexDirection: 'row',
    marginRight: 2,
  },
  normal: {
    color: '#000',
    fontSize: 16,
  },
  highlightBox: {
    backgroundColor: '#ffeb3b', // visible en móviles
    borderRadius: 2,
    paddingHorizontal: 2,
  },
  highlight: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
