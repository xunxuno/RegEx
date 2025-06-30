/**
 * Componente tipo Molecule que renderiza el Árbol de Sintaxis Abstracta (AST)
 * generado a partir de una expresión regular. Utiliza recursividad para visualizar
 * jerárquicamente la estructura del patrón.
 *
 * Este componente muestra el tipo de cada nodo y su relación estructural.
 * Es una representación textual con indentación al estilo de árbol.
 */
import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Pattern, Node, Alternative } from 'regexpp/ast';

interface Props {
  ast: Pattern | null; //Pattern | null - nodo raíz del AST generado por `regexpp`
}
// Traduce los tipos de nodos del AST a etiquetas más comprensibles en español
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
  };

  return translations[type] ?? type;
};
/**
 * Componente que muestra una representación textual en forma de árbol del AST
 * generado por una expresión regular.
 *
 * Se considera un componente tipo Molecule dentro del diseño atómico.
 * Es útil para depuración y entendimiento de la estructura interna del patrón RegEx.
 */
export const ASTViewer: React.FC<Props> = ({ ast }) => {
  if (!ast) {
    return <Text style={styles.info}>AST no disponible (regex inválida).</Text>;// Si el AST no es válido (regex inválida), mostrar un aviso
  }
  //Función recursiva que renderiza un nodo del AST y sus hijos.
  const renderNode = (node: Node, depth = 0): React.ReactNode => {
    const indent = '│  '.repeat(depth); // Indentación visual
    const label = `${indent}└─ ${translateNodeType(node.type)}`; // Etiqueta del nodo

    const children: Node[] = [];
// Detecta y agrega nodos hijos según el tipo
    if ('alternatives' in node && Array.isArray(node.alternatives)) {
      for (const alt of node.alternatives as Alternative[]) {
        children.push(...alt.elements);
      }
    }
    else if ('elements' in node && Array.isArray((node as any).elements)) {
      children.push(...(node as any).elements);
    }
    else if (
      'expression' in node &&
      node.expression &&
      typeof node.expression === 'object' &&
      'type' in node.expression
    ) {
      children.push(node.expression as Node);
    }
// Renderiza el nodo actual y recursivamente sus hijos
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
// Estilos visuales del componente
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
