import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Pattern, Node } from 'regexpp/ast';

interface Props {
  ast: Pattern | null;
}

export const ASTViewer: React.FC<Props> = ({ ast }) => {
  if (!ast) {
    return <Text style={styles.info}>AST no disponible (regex inválida).</Text>;
  }

  const renderNode = (node: Node, depth = 0): React.ReactNode => {
    const indent = '│  '.repeat(depth);

    const label = `${indent}└─ ${node.type}`;

    const children: Node[] =
      'elements' in node && Array.isArray((node as any).elements)
        ? (node as any).elements
        : 'expression' in node && node.expression
        ? [node.expression]
        : [];

    return (
      <View key={`${node.type}-${node.start}`} style={styles.node}>
        <Text style={styles.text}>{label}</Text>
        {children.map((child) => renderNode(child, depth + 1))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Árbol de Sintaxis Abstracta (AST):</Text>
      {renderNode(ast)}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#eef',
    borderRadius: 6,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  node: {
    marginVertical: 2,
  },
  text: {
    fontSize: 14,
    color: '#222',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
  info: {
    color: 'gray',
    fontStyle: 'italic',
  },
});
