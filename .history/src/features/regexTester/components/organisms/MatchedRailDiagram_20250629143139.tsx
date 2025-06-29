import React from 'react';
import { Svg, Rect, Text as SvgText, Line } from 'react-native-svg';

interface Props {
  regex: string;
  testText: string;
}

interface MatchBox {
  text: string;
  index: number;
}

export const MatchedRailDiagram: React.FC<Props> = ({ regex, testText }) => {
  let matches: MatchBox[] = [];

  try {
    const reg = new RegExp(regex, 'g');
    const allMatches = [...testText.matchAll(reg)];

    matches = allMatches.map((m) => ({
      text: m[0],
      index: m.index ?? 0,
    }));
  } catch (err) {
    console.warn('Expresión inválida:', err);
    matches = [];
  }

  const spacing = 60;
  const boxWidth = 200;
  const boxHeight = 40;
  const startX = 20;
  const startY = 20;

  const totalHeight = matches.length * spacing + startY * 2;

  return (
    <Svg width={boxWidth + 40} height={totalHeight}>
      {matches.map((match, i) => {
        const y = startY + i * spacing;

        return (
          <React.Fragment key={i}>
            <Rect
              x={startX}
              y={y}
              width={boxWidth}
              height={boxHeight}
              rx={6}
              fill="#81c784"
              stroke="#333"
              strokeWidth={1}
            />
            <SvgText
              x={startX + boxWidth / 2}
              y={y + 25}
              fontSize="14"
              textAnchor="middle"
              fill="#000"
              fontWeight="bold"
            >
              {match.text}
            </SvgText>

            {i < matches.length - 1 && (
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
