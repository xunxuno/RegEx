import React from 'react';
import { VerticalRail, VerticalRailNode } from './VerticalRail';

interface Props {
  regex: string;
  testText: string;
}

export const MatchedRailDiagram: React.FC<Props> = ({ regex, testText }) => {
  const nodes: VerticalRailNode[] = [];

  try {
    const reg = new RegExp(regex, 'g');
    const matches = [...testText.matchAll(reg)];

    matches.forEach((match, i) => {
      nodes.push({
        id: `match-${i}`,
        label: `Match ${i + 1}`,
        value: match[0],
        color: '#64b5f6',
      });

      for (let j = 1; j < match.length; j++) {
        if (match[j] !== undefined) {
          nodes.push({
            id: `match-${i}-group-${j}`,
            label: `Grupo ${j}`,
            value: match[j],
            color: '#a5d6a7',
          });
        }
      }
    });
  } catch (err) {
    console.warn('Regex inválida:', err);
  }

  return <VerticalRail nodes={nodes} />;
};
