import React from 'react';
import { Svg, Rect, Text as SvgText, Line } from 'react-native-svg';

interface Props {
  regex: string;
  testText: string;
}

interface GroupMatch {
  groupIndex: number;
  value: string;
}

interface MatchBlock {
  matchIndex: number;
  fullMatch: string;
  groups: GroupMatch[];
}

export const MatchedRailDiagram: React.FC<Props> = ({ regex, testText }) => {
  const matches: MatchBlock[] = [];

  try {
    const reg = new RegExp(regex, 'g');
    const allMatches = [...testText.matchAll(reg)];

    allMatches.forEach((match, matchIndex) => {
      const fullMatch = match[0];
      const groups: GroupMatch[] = [];

      for (let i = 1; i < match.length; i++) {
        if (match[i] !== undefined) {
          groups.push({ groupIndex: i, value: match[i] });
        }
      }

      matches.push({ matchIndex, fullMatch, groups });
    });
  } catch (err) {
    console.warn('Regex inválida:', err);
  }

  const spacing = 80;
  const boxWidth = 200;
  const boxHeight = 40;
  const startX = 20;
  const startY = 20;
  const groupSpacing = 10;

  const totalHeight =
    matches.reduce((acc, m) => acc + (m.groups.length + 1) * (boxHeight + groupSpacing), 0) +
    startY * 2;

  return (
    <Svg width={boxWidth + 40} height={totalHeight}>
      {matches.map((match, i) => {
        const baseY =
          startY +
          matches
            .slice(0, i)
            .reduce((acc, m) => acc + (m.groups.length + 1) * (boxHeight + groupSpacing), 0);

        const elements = [];

        elements.push(
          <React.Fragment key={`match-${i}`}>
            <Rect
              x={startX}
              y={baseY}
              width={boxWidth}
              height={boxHeight}
              rx={6}
              fill="#64b5f6"
              stroke="#333"
              strokeWidth={1}
            />
            <SvgText
              x={startX + boxWidth / 2}
              y={baseY + 25}
              fontSize="14"
              textAnchor="middle"
              fill="#000"
              fontWeight="bold"
            >
              {match.fullMatch}
            </SvgText>
          </React.Fragment>
        );

        match.groups.forEach((group, j) => {
          const y = baseY + (j + 1) * (boxHeight + groupSpacing);

          elements.push(
            <React.Fragment key={`group-${i}-${j}`}>
              <Rect
                x={startX + 20}
                y={y}
                width={boxWidth - 40}
                height={boxHeight}
                rx={6}
                fill="#a5d6a7"
                stroke="#333"
                strokeWidth={1}
              />
              <SvgText
                x={startX + boxWidth / 2}
                y={y + 25}
                fontSize="13"
                textAnchor="middle"
                fill="#000"
              >
                Grupo {group.groupIndex}: {group.value}
              </SvgText>
            </React.Fragment>
          );
        });

        return <React.Fragment key={`block-${i}`}>{elements}</React.Fragment>;
      })}
    </Svg>
  );
};
