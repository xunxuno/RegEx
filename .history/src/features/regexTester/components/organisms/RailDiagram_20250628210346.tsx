import React, { useState } from 'react';
import { Svg, Rect, Line, Text as SvgText } from 'react-native-svg';
import { Pattern, Node, Alternative, Element } from 'regexpp/ast';

interface Props {
  ast: Pattern;
}

interface RailNodeProps {
  label: string;
  value?: string;
  x: number;
  y: number;
  type: string;
}

interface AlternativeSeparator {
  type: 'AlternativeSeparator';
}

type DiagramElement = { alt: number; node: Node | AlternativeSeparator };


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

const getNodeColor = (type: string): string => {
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

const RailNode: React.FC<RailNodeProps> = ({ label, value, x, y, type }) => {
  const color = getNodeColor(type);

  return (
    <>
      <Rect x={x} y={y} width={100} height={40} rx={6} fill={color} stroke="#333" />
      <SvgText
        x={x + 50}
        y={y + 18}
        fontSize="11"
        fontWeight="bold"
        textAnchor="middle"
        fill="#000"
      >
        {label}
      </SvgText>
      {value && (
        <SvgText
          x={x + 50}
          y={y + 34}
          fontSize="10"
          textAnchor="middle"
          fill="#333"
        >
          {value}
        </SvgText>
      )}
    </>
  );
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

export const RailDiagram: React.FC<Props> = ({ ast }) => {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    label: string;
    type: string;
    value?: string;
  } | null>(null);

  const elements: DiagramElement[] = [];

  if ('alternatives' in ast) {
    ast.alternatives.forEach((alt, i) => {
      alt.elements.forEach((el) => {
        flattenNodes(el).forEach((flatNode) => {
          elements.push({ alt: i, node: flatNode });
        });
      });
      if (i < ast.alternatives.length - 1) {
        elements.push({
          alt: i,
          node: { type: 'AlternativeSeparator' } as AlternativeSeparator,
        });
      }
    });
  }

  const spacing = 120;
  const startX = 20;
  const startY = 20;
  const totalWidth = elements.length * spacing + startX * 2;

  return (
    <Svg
      width={totalWidth}
      height={100}
      onPressOut={() => setTooltip(null)}
    >

      <Line x1={0} y1={40} x2={startX} y2={40} stroke="#333" strokeWidth={2} />

      {elements.map(({ alt, node }, i) => {
        const x = startX + i * spacing;

        if (node.type === 'AlternativeSeparator') {
          return (
            <SvgText
              key={`alt-${i}`}
              x={x + 50}
              y={40}
              fontSize="18"
              textAnchor="middle"
              fill="#f44336"
              fontWeight="bold"
            >
              |
            </SvgText>
          );
        }

        const label = translateNodeType(node.type);
        const value = getNodeValue(node);
        const hasNext =
          i < elements.length - 1 &&
          elements[i + 1].node.type !== 'AlternativeSeparator';

        return (
          <React.Fragment key={`${node.type}-${i}-${alt}`}>
            <RailNode
              label={label}
              value={value}
              x={x}
              y={startY}
              type={node.type}
            />
            <Rect
              x={x}
              y={startY}
              width={100}
              height={40}
              fill="transparent"
              onPress={() =>
                setTooltip({
                  x: x + 100,
                  y: startY - 50,
                  label,
                  type: node.type,
                  value,
                })
              }
            />
            {hasNext && (
              <Line
                x1={x + 100}
                y1={40}
                x2={x + spacing}
                y2={40}
                stroke="#333"
                strokeWidth={2}
              />
            )}
          </React.Fragment>
        );
      })}


      {tooltip && (
        <>
          <Rect
            x={tooltip.x}
            y={tooltip.y}
            width={140}
            height={60}
            rx={6}
            fill="#000"
            opacity={0.8}
          />
          <SvgText
            x={tooltip.x + 70}
            y={tooltip.y + 20}
            fontSize="12"
            fill="#fff"
            textAnchor="middle"
          >
            {tooltip.label} ({tooltip.type})
          </SvgText>
          {tooltip.value && (
            <SvgText
              x={tooltip.x + 70}
              y={tooltip.y + 40}
              fontSize="11"
              fill="#ccc"
              textAnchor="middle"
            >
              Valor: {tooltip.value}
            </SvgText>
          )}
        </>
      )}


      <Line
        x1={startX + elements.length * spacing - 20}
        y1={40}
        x2={startX + elements.length * spacing + 10}
        y2={40}
        stroke="#333"
        strokeWidth={2}
      />
    </Svg>
  );
};