import React from 'react';
import { Svg, Rect, Text as SvgText, Line } from 'react-native-svg';

export interface VerticalRailNode {
  id: string;
  label: string;
  value?: string;
  color?: string;
}

interface Props {
  nodes: VerticalRailNode[];
  width?: number;
  boxHeight?: number;
}

export const VerticalRail: React.FC<Props> = ({
  nodes,
  width = 220,
  boxHeight = 50,
}) => {
  const spacing = 60;
  const startX = 20;
  const startY = 20;
  const totalHeight = nodes.length * spacing + startY * 2;

  return (
    <Svg width={width} height={totalHeight}>
      {nodes.map((n, i) => {
        const y = startY + i * spacing;
        const isLast = i === nodes.length - 1;

        return (
          <React.Fragment key={n.id}>
            <Rect
              x={startX}
              y={y}
              width={width - 40}
              height={boxHeight}
              rx={6}
              fill={n.color ?? '#eeeeee'}
              stroke="#333"
              strokeWidth={1}
            />
            <SvgText
              x={startX + (width - 40) / 2}
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
                x={startX + (width - 40) / 2}
                y={y + 35}
                fontSize="12"
                textAnchor="middle"
                fill="#333"
              >
                {n.value}
              </SvgText>
            )}
            {!isLast && (
              <Line
                x1={startX + (width - 40) / 2}
                y1={y + boxHeight}
                x2={startX + (width - 40) / 2}
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
