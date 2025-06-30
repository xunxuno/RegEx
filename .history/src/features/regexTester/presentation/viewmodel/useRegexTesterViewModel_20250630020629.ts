import { useState, useEffect } from 'react';
import { Pattern } from 'regexpp/ast';
import {parseRegexAst} from '../../utils/parseRegexAst';

export const useRegexTesterViewModel = () => {
  const [regex, setRegex] = useState<string>('');
  const [testText, setTestText] = useState<string>('');
  const [matches, setMatches] = useState<number[][]>([]);
  const [ast, setAst] = useState<Pattern | null>(null);

  useEffect(() => {
    if (!regex || !testText) {
      setMatches([]);
      return;
    }

    try {
      const expression = new RegExp(regex, 'gi');
      const result: number[][] = [];
      let match: RegExpExecArray | null;

      while ((match = expression.exec(testText)) !== null) {
        result.push([match.index, match.index + match[0].length]);
      }

      setMatches(result);
      const astResult = parseRegexAst(regex, 'g');
      setAst(astResult);
    } catch (err) {
      setMatches([]);
      setAst(null);
    }
  }, [regex, testText]);

  return {
    regex,
    testText,
    setRegex,
    setTestText,
    matches,
    ast,
  };
};
