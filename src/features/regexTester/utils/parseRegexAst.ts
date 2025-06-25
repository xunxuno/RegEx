import { RegExpParser } from 'regexpp';
import { Pattern } from 'regexpp/ast';

export function parseRegexAst(pattern: string, flags: string = 'g'): Pattern | null {
  try {
    const parser = new RegExpParser({
      ecmaVersion: 2020,
    });

    const ast = parser.parsePattern(pattern, 0, pattern.length, flags.includes('u'));
    return ast;
  } catch (error) {
    console.warn('Error al generar el AST:', error);
    return null;
  }
}
