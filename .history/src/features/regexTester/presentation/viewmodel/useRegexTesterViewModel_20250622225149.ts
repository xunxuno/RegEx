import { useState, useEffect } from 'react';

export const useRegexTesterViewModel = () => {
  const [regex, setRegex] = useState<string>('');
  const [testText, setTestText] = useState<string>('');
  const [matches, setMatches] = useState<number[][]>([]);

  useEffect(() => {
    try {
      const expression = new RegExp(regex, 'g');
      const result: number[][] = [];
      let match: RegExpExecArray | null;

      while ((match = expression.exec(testText)) !== null) {
        result.push([match.index, match.index + match[0].length]);
      }

      setMatches(result);
    } catch (error) {
      setMatches([]);
    }
  }, [regex, testText]);

  return {
    regex,
    testText,
    matches,
    setRegex,
    setTestText
  };
};
