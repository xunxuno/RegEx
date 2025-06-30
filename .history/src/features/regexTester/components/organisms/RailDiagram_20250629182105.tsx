import React from 'react';
import { Svg, Rect, Text as SvgText, Line } from 'react-native-svg';
import { Pattern, Node } from 'regexpp/ast';

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
  const translations: Record<string, string> = {
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
  return translations[type] || type;
};

const getNodeValue = (node: Node): string => {
  if ('raw' in node && typeof node.raw === 'string') return node.raw;
  if ('value' in node && typeof node.value === 'string') return node.value;
  if ('kind' in node && typeof node.kind === 'string') return node.kind;
  return '';
};

const getNodeColor = (type: string, isMatched: boolean): string => {
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
};

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

export const VerticalRailDiagram: React.FC<Props> = ({ ast, matchIndices }) => {
  const nodes: DiagramNode[] = [];

  if ('alternatives' in ast) {
    ast.alternatives.forEach((alt) => {
      alt.elements.forEach((el) => {
        flattenNodes(el).forEach((flat) => {
          const label = translateNodeType(flat.type);
          const value = getNodeValue(flat);
          const matched = nodeIsMatched(flat, matchIndices);
          nodes.push({ node: flat, label, value, isMatched: matched });
        });
      });
    });
  }

  const boxWidth = 200;
  const boxHeight = 40;
  const spacing = 60;
  const startX = 20;
  const startY = 20;
  const totalHeight = nodes.length * spacing + startY * 2;

  return (
    <Svg width={boxWidth + 40} height={totalHeight}>
      {nodes.map((n, i) => {
        const y = startY + i * spacing;
        const isLast = i === nodes.length - 1;

        return (
          <React.Fragment key={`${n.node.type}-${i}`}>
            <Rect
              x={startX}
              y={y}
              width={boxWidth}
              height={boxHeight}
              rx={6}
              fill={getNodeColor(n.node.type, n.isMatched)}
              stroke="#333"
              strokeWidth={1}
            />
            <SvgText
              x={startX + boxWidth / 2}
              y={y + 18}
              fontSize="13"
              textAnchor="middle"
              fill="#000"
              fontWeight="bold"
            >
              {n.label}
            </SvgText>
            {n.value && (
              <SvgText
                x={startX + boxWidth / 2}
                y={y + 34}
                fontSize="11"
                textAnchor="middle"
                fill="#333"
              >
                {n.value}
              </SvgText>
            )}
            {!isLast && (
              <Line
                x1={startX + boxWidth / 2}
                y1={y + boxHeight}
                x2={startX + boxWidth / 2}
                y2={y + spacing}
                stroke="#333"
                strokeWidth={2}
              />
            )}
          </React.Fragment>
        );
      })}
    </Svg>
  );
};
