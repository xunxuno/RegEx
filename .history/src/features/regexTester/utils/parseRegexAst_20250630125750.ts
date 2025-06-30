import { RegExpParser } from 'regexpp';
import { Pattern } from 'regexpp/ast';
/** 
 * * Parsea una expresión regular y devuelve su representación como
 * Árbol de Sintaxis Abstracta (AST).
 */

 //Esta función utiliza la librería `regexpp`, que permite analizare xpresiones regulares y generar un AST detallado compatible con ECMAScript. 
export function parseRegexAst(pattern: string, flags: string = 'g'): Pattern | null {
  try {// Crea un parser con soporte para ES2020
    const parser = new RegExpParser({
      ecmaVersion: 2020,
    });
// Parsea el patrón y devuelve el nodo raíz del AST
    const ast = parser.parsePattern(pattern, 0, pattern.length, flags.includes('u')); // activa soporte para Unicode si la bandera 'u' está presente
    return ast;
  } catch (error) { // Si hay un error de sintaxis, devuelve null
    console.warn('Error al generar el AST:', error);
    return null;
  }
}
