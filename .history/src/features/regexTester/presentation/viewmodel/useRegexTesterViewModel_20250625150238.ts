import { useState, useEffect } from 'react';

export const useRegexTesterViewModel = () => {
  const [regex, setRegex] = useState<string>('');
  const [testText, setTestText] = useState<string>('');
  const [matches, setMatches] = useState<number[][]>([]);

  useEffect(() => {
    if (!regex || !testText) {
      setMatches([]);
      return;
    }

    try {
      const expression = new RegExp(regex, 'g');
      const result: number[][] = [];
      let match: RegExpExecArray | null;

      while ((match = expression.exec(testText)) !== null) {
        result.push([match.index, match.index + match[0].length]);
      }

      setMatches(result);
    } catch (err) {
      setMatches([]);
    }
  }, [regex, testText]);

  return {
    regex,
    testText,
    setRegex,
    setTestText,
    matches,
  };
};
