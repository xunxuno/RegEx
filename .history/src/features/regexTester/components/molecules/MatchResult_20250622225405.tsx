import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface Props {
  text: string;
  matches: number[][];
}

export const MatchResult: React.FC<Props> = ({ text, matches }) => {
  if (!matches.length) {
    return <Text style={styles.normal}>{text}</Text>;
  }

  const result: React.ReactNode[] = [];
  let lastIndex = 0;

  matches.forEach(([start, end], index) => {
    if (start > lastIndex) {
      result.push(<Text key={`before-${index}`} style={styles.normal}>{text.slice(lastIndex, start)}</Text>);
    }
    result.push(<Text key={`match-${index}`} style={styles.match}>{text.slice(start, end)}</Text>);
    lastIndex = end;
  });

  if (lastIndex < text.length) {
    result.push(<Text key="after" style={styles.normal}>{text.slice(lastIndex)}</Text>);
  }

  return <View style={styles.container}><Text>{result}</Text></View>;
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  normal: {
    color: '#000',
  },
  match: {
    backgroundColor: '#ffdf80',
    color: '#000',
    fontWeight: 'bold',
  },
});
