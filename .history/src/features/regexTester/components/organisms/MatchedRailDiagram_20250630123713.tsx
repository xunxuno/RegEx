/**
 * Componente tipo Organism que renderiza un diagrama vertical para visualizar
 * las coincidencias (matches) de una expresión regular sobre un texto de prueba.
 * 
 * Para cada coincidencia, se representa:
 * - El texto que coincide con la expresión completa.
 * - Los grupos capturados (si existen) dentro de dicha coincidencia.
 * 
 * Este componente está diseñado para complementar la visualización del AST.
 */
import React from 'react';
import { Svg, Rect, Text as SvgText, Line } from 'react-native-svg';

interface Props {
  regex: string; //expresión regular ingresada por el usuario
  testText: string; //texto de entrada para evaluar la expresión
}
//Representa un grupo capturado por la expresión regular.
interface GroupMatch {
  groupIndex: number;
  value: string;
}
//Representa una coincidencia completa y sus grupos capturados.
interface MatchBlock {
  matchIndex: number;
  fullMatch: string;
  groups: GroupMatch[];
}

export const MatchedRailDiagram: React.FC<Props> = ({ regex, testText }) => {
  const matches: MatchBlock[] = [];
 // Ejecuta la expresión regular sobre el texto, obteniendo coincidencias y grupos
  try {
    const reg = new RegExp(regex, 'g');
    const allMatches = [...testText.matchAll(reg)];

    allMatches.forEach((match, matchIndex) => {
      const fullMatch = match[0];
      const groups: GroupMatch[] = [];
// Extraer grupos capturados (del índice 1 en adelante)
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
// Layout del SVG
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
                y={y + 18}
                fontSize="13"
                textAnchor="middle"
                fill="#000"
                fontWeight="bold"
              >
                Grupo {group.groupIndex}
              </SvgText>

              <SvgText
                x={startX + boxWidth / 2}
                y={y + 35}
                fontSize="12"
                textAnchor="middle"
                fill="#333"
              >
                {group.value}
              </SvgText>

            </React.Fragment>
          );
        });

        return <React.Fragment key={`block-${i}`}>{elements}</React.Fragment>;
      })}
    </Svg>
  );
};
