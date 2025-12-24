import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api.js'

// Based on: https://www.w3.org/TR/turtle/#sec-grammar-grammar
export const turtleLang: monaco.languages.IMonarchLanguage = {
  defaultToken: 'invalid',
  tokenPostfix: '.ttl',

  escapes: /\\(?:[tbnrf"'\\]|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,

  tokenizer: {
    root: [
      // Comments - must come first
      [/#.*$/, 'comment'],

      { include: '@whitespace' },

      // Keywords
      [/[@]prefix\b/, 'keyword'],
      [/[@]base\b/, 'keyword'],
      [/\ba\b/, 'keyword'],
      [/\btrue\b/, 'keyword'],
      [/\bfalse\b/, 'keyword'],
      [/\bBASE\b/i, 'keyword'],
      [/\bPREFIX\b/i, 'keyword'],

      // IRI references
      [/<([^<>"{}|^`\\\x00-\x20]|\\u[0-9A-Fa-f]{4}|\\U[0-9A-Fa-f]{8})*>/, 'string'],

      // Prefixed names (prefix:local)
      [/:(?=[A-Za-z0-9_])/, 'identifier', '@prefixed_local'],

      // Blank nodes
      [/_:[A-Za-z0-9_\-\.]+/, 'variable.name'],
      [/\[\s*\]/, 'variable.name'],

      // Language tags
      [/[@](?!prefix|base)[a-zA-Z]+(?:-[a-zA-Z0-9]+)*/, 'keyword'],

      // Type annotation
      [/\^\^/, 'operator'],

      // String literals - long triple quotes first (longest match)
      [/"""/, 'string', '@string_long_double'],
      [/'''/, 'string', '@string_long_single'],
      [/"/, 'string', '@string_double'],
      [/'/, 'string', '@string_single'],

      // Numbers - must match before other tokens
      [/[+-]?(\d+\.\d*|\.\d+|\d+)[eE][+-]?\d+/, 'number.float'],
      [/[+-]?(\d+\.\d*|\.\d+)/, 'number.float'],
      [/[+-]?\d+/, 'number'],

      [/[{}]/, 'delimiter.curly'],
      [/[\[\]]/, 'delimiter.square'],
      [/[()]/, 'delimiter.parenthesis'],
      [/[.;,]/, 'delimiter'],

      [/./, 'identifier'],
    ],

    whitespace: [[/[ \t\r\n]+/, '']],

    prefixed_local: [
      // Match the local part of prefixed name as type, then pop back to root
      [/[A-Za-z0-9_\-\.:]+/, 'type', '@pop'],
      // If we hit whitespace or any other character, pop back to root
      [/./, '@pop'],
    ],

    string_double: [
      [/[^"\\\n\r]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop'],
    ],

    string_single: [
      [/[^'\\\n\r]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'string', '@pop'],
    ],

    string_long_double: [
      [/[^"\\]+/, 'string'],
      [/""/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"""/, 'string', '@pop'],
    ],

    string_long_single: [
      [/[^'\\]+/, 'string'],
      [/''/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'''/, 'string', '@pop'],
    ],
  },
}
