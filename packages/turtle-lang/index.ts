// Based on https://github.com/BruJu/shacled-turtle/blob/master/lang-turtle
import { LRLanguage, LanguageSupport } from '@codemirror/language'
import { styleTags, tags as t } from '@lezer/highlight'
import { parser } from './generated/turtle.grammar.ts'

export const TurtleLanguage = LRLanguage.define({
  parser: parser.configure({
    props: [
      styleTags({
        IRIREF: t.atom,
        LineComment: t.lineComment,
        '_:': t.operator,
        ':': t.operator,
        PN_PREFIX: t.namespace,
        a: t.meta,
        '@prefix': t.meta,
        BASE: t.meta,
        PREFIX: t.meta,
        base: t.meta,
        prefix: t.meta,
        '@base': t.meta,
        BlankNodeLabel: t.variableName,
        NumericLiteral: t.unit,
        BooleanLiteral: t.unit,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: '#' },
  },
})

export function turtle() {
  return new LanguageSupport(TurtleLanguage, [])
}
