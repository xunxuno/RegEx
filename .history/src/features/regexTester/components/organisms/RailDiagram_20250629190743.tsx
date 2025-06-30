import React from 'react';
import { Svg, Rect, Text as SvgText, Line } from 'react-native-svg';
import { Pattern, Node } from 'regexpp/ast';
import { VerticalRail, VerticalRailNode } from './VerticalRail';

interface Props {
  ast: Pattern;
  matchIndices: number[][] | null;
}

interface DiagramNode {
  node: Node;
  label: string;
  value: string;
  isMatched: boolean;
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

/*const getNodeColor = (type: string, isMatched: boolean): string => {
  if (isMatched) return '#81c784';
  switch (type) {
    case 'CapturingGroup':
    case 'Group':
      return '#d1c4e9';
    case 'CharacterClass':
    case 'CharacterSet':
      return '#b2dfdb';
    case 'Quantifier':
      return '#90caf9';
    case 'Literal':
    case 'Character':
      return '#ffe082';
    default:
      return '#eeeeee';
  }
};*/

const isNode = (value: any): value is Node => {
  return typeof value === 'object' && value !== null && 'type' in value;
};

const flattenNodes = (node: Node): Node[] => {
  const result: Node[] = [node];

  if ('expression' in node && isNode(node.expression)) {
    result.push(...flattenNodes(node.expression));
  }

  if ('elements' in node && Array.isArray((node as any).elements)) {
    for (const child of (node as any).elements) {
      result.push(...flattenNodes(child));
    }
  }

  return result;
};

const nodeIsMatched = (node: Node, matchIndices: number[][] | null): boolean => {
  if (!matchIndices) return false;
  return matchIndices.some(([start, end]) => {
    return start >= 0 && end >= 0 && start >= node.start && end <= node.end;
  });
};

export const RailDiagram: React.FC<Props> = ({ ast, matchIndices }) => {
  const nodes: VerticalRailNode [] = [];

  if ('alternatives' in ast) {
    ast.alternatives.forEach((alt) => {
      alt.elements.forEach((el) => {
        flattenNodes(el).forEach((n, i) => {
          const label = translateNodeType(n.type);
          const value = getNodeValue(n);
          const matched = nodeIsMatched(n, matchIndices);

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