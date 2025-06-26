import React from 'react';
import { Svg, Line, Rect, Text as SvgText } from 'react-native-svg';
import { Pattern, Node, Alternative } from 'regexpp/ast';

interface Props {
  ast: Pattern;
}

interface RailNodeProps {
  label: string;
  x: number;
  y: number;
}

const RailNode: React.FC<RailNodeProps> = ({ label, x, y }) => {
  return (
    <>
      <Rect x={x} y={y} width={100} height={40} fill="#fff" stroke="#333" rx={6} />
      <SvgText
        x={x + 50}
        y={y + 25}
        fontSize="12"
        fill="#000"
        fontWeight="bold"
        textAnchor="middle"
      >
        {label}
      </SvgText>
    </>
  );
};

export const RailDiagram: React.FC<Props> = ({ ast }) => {
  const nodes: string[] = [];

  if ('alternatives' in ast) {
    const alts = ast.alternatives as Alternative[];
    for (const alt of alts) {
      alt.elements.forEach((el: Node) => {
        nodes.push(el.type);
      });
    }
  }

  const spacing = 120;

  return (
    <Svg width="100%" height={80}>
      {nodes.map((label, i) => {
        const x = i * spacing + 10;
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <Line
                x1={x - spacing + 100}
                y1={40}
                x2={x}
                y2={40}
                stroke="#444"
                strokeWidth={2}
              />
            )}
            <RailNode label={label} x={x} y={20} />
          </React.Fragment>
        );
      })}
    </Svg>
  );
};
