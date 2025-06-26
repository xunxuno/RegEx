import React from 'react';
import { Svg, Rect, Line, Text as SvgText } from 'react-native-svg';
import { Pattern, Node, Alternative } from 'regexpp/ast';

interface Props {
  ast: Pattern;
}

interface RailNodeProps {
  label: string;
  value?: string;
  x: number;
  y: number;
}

const translateNodeType = (type: string): string => {
  const translations: Record<string, string> = {
    Pattern: 'Patrón',
    CapturingGroup: 'Grupo',
    CharacterClass: 'Clase',
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
  return '';
};

const RailNode: React.FC<RailNodeProps> = ({ label, value, x, y }) => (
  <>
    <Rect x={x} y={y} width={100} height={40} rx={6} fill="#fff" stroke="#333" />
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
        fill="#555"
      >
        {value}
      </SvgText>
    )}
  </>
);

export const RailDiagram: React.FC<Props> = ({ ast }) => {
  const elements: Node[] = [];

  if ('alternatives' in ast) {
    for (const alt of ast.alternatives as Alternative[]) {
      elements.push(...alt.elements);
    }
  }

  const spacing = 120;
  const startX = 20;
  const startY = 20;
  const totalWidth = elements.length * spacing + startX * 2;

  return (
    <Svg width={totalWidth} height={80}>
      {/* Línea inicial */}
      <Line x1={0} y1={40} x2={startX} y2={40} stroke="#333" strokeWidth={2} />
      {elements.map((el, i) => {
        const x = startX + i * spacing;
        const label = translateNodeType(el.type);
        const value = getNodeValue(el);
        const hasNext = i < elements.length - 1;

        return (
          <React.Fragment key={`${el.type}-${i}`}>
            <RailNode label={label} value={value} x={x} y={startY} />
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
      {/* Línea final */}
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
