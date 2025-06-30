import React from 'react';
import { Pattern, Node } from 'regexpp/ast';
import { VerticalRail, VerticalRailNode } from './VerticalRail';

interface Props {
  ast: Pattern;
  matchIndices: number[][] | null;
}

const translateNodeType = (type: string): string => {
  const map: Record<string, string> = {
    Pattern: 'Patrón',
    CapturingGroup: 'Grupo',
    Group: 'Grupo',
    CharacterClass: 'Clase',
    CharacterSet: 'Conjunto',
    Character: 'Carácter',
    Literal: 'Literal',
    Quantifier: 'Cuantificador',
    Alternative: 'Alternativa',
  };
  return map[type] || type;
};

const getNodeValue = (node: Node): string => {
  if ('raw' in node && typeof node.raw === 'string') return node.raw;
  if ('value' in node && typeof node.value === 'string') return node.value;
  if ('kind' in node && typeof node.kind === 'string') return node.kind;
  return '';
};

const isNodeMatched = (node: Node, matchIndices: number[][] | null): boolean => {
  if (!matchIndices) return false;
  return matchIndices.some(([start, end]) => {
    return node.start !== undefined &&
           node.end !== undefined &&
           start >= node.start && end <= node.end;
  });
};

const flattenNodes = (node: Node): Node[] => {
  const result: Node[] = [node];
  if ('expression' in node && typeof node.expression === 'object') {
    result.push(...flattenNodes(node.expression));
  }
  if ('elements' in node && Array.isArray((node as any).elements)) {
    for (const child of (node as any).elements) {
      result.push(...flattenNodes(child));
    }
  }
  return result;
};

export const RailDiagram: React.FC<Props> = ({ ast, matchIndices }) => {
  const nodes: VerticalRailNode[] = [];

  if ('alternatives' in ast) {
    ast.alternatives.forEach((alt) => {
      alt.elements.forEach((el) => {
        flattenNodes(el).forEach((n, i) => {
          const label = translateNodeType(n.type);
          const value = getNodeValue(n);
          const matched = isNodeMatched(n, matchIndices);

          nodes.push({
            id: `${n.type}-${i}`,
            label,
            value,
            color: matched ? '#81c784' : undefined,
          });
        });
      });
    });
  }

  return <VerticalRail nodes={nodes} />;
};
