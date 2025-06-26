import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Pattern, Node, Alternative } from 'regexpp/ast';

interface Props {
  ast: Pattern | null;
}

const translateNodeType = (type: string): string => {
  const translations: Record<string, string> = {
    Pattern: 'Patrón',
    Alternative: 'Alternativa',
    CapturingGroup: 'Grupo de captura',
    Group: 'Grupo',
    Quantifier: 'Cuantificador',
    CharacterClass: 'Clase de caracteres',
    Character: 'Carácter',
    CharacterSet: 'Conjunto de caracteres',
    Assertion: 'Aserción',
    Backreference: 'Retroreferencia',
    Literal: 'Literal',
    ExpressionCharacterClass: 'Clase de caracteres (Expresión)',
    // Agrega más si quieres cubrir más tipos
  };

  return translations[type] ?? type;
};

export const ASTViewer: React.FC<Props> = ({ ast }) => {
  if (!ast) {
    return <Text style={styles.info}>AST no disponible (regex inválida).</Text>;
  }

  const renderNode = (node: Node, depth = 0): React.ReactNode => {
    const indent = '│  '.repeat(depth);
    const label = `${indent}└─ ${translateNodeType(node.type)}`;

    const children: Node[] = [];

    // Alternatives → elements
    if ('alternatives' in node && Array.isArray(node.alternatives)) {
      for (const alt of node.alternatives as Alternative[]) {
        children.push(...alt.elements);
      }
    }
    // Elements directos
    else if ('elements' in node && Array.isArray((node as any).elements)) {
      children.push(...(node as any).elements);
    }
    // Expression único
    else if (
      'expression' in node &&
      node.expression &&
      typeof node.expression === 'object' &&
      'type' in node.expression
    ) {
      children.push(node.expression as Node);
    }

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
