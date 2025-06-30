import { useState, useEffect } from 'react';
import { Pattern } from 'regexpp/ast';
import { parseRegexAst } from '../../utils/parseRegexAst';

export const useRegexTesterViewModel = () => {
  /**
   * Estado de la expresión regular escrita por el usuario.
   */
  const [regex, setRegex] = useState<string>('');

  /**
   * Estado del texto donde se prueba la expresión regular.
   */
  const [testText, setTestText] = useState<string>('');

  /**
   * Resultado de coincidencias: pares de índices [inicio, fin].
   */
  const [matches, setMatches] = useState<number[][]>([]);

  /**
   * Árbol de sintaxis abstracta generado a partir de la expresión.
   */
  const [ast, setAst] = useState<Pattern | null>(null);

  /**
   * Efecto que se ejecuta cada vez que cambia la expresión o el texto.
   * Realiza:
   * - Cálculo de matches usando RegExp.exec en modo global e insensible a mayúsculas
   * - Generación del AST usando `regexpp`
   * - Manejo de errores de sintaxis
   */
  useEffect(() => {
    if (!regex || !testText) {
      setMatches([]);
      setAst(null);
      return;
    }

    try {
      const expression = new RegExp(regex, 'gi');
      const result: number[][] = [];
      let match: RegExpExecArray | null;

      // Ejecutar todas las coincidencias
      while ((match = expression.exec(testText)) !== null) {
        result.push([match.index, match.index + match[0].length]);
      }

      setMatches(result);

      // Generar AST usando utilidad personalizada
      const astResult = parseRegexAst(regex, 'g');
      setAst(astResult);
    } catch (err) {
      setMatches([]);
      setAst(null);
    }
  }, [regex, testText]);

  // Retorno del ViewModel para usar en la vista (componente)
  return {
    regex,
    testText,
    setRegex,
    setTestText,
    matches,
    ast,
  };
};
