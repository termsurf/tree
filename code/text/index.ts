import { haveMesh } from '@tunebond/have'
import { generateSyntaxTokenError } from '../halt.js'

enum Form {
  Base = 'base',
  Line = 'line',
  Text = 'text',
  Nick = 'nick',
  Cull = 'cull',
  Term = 'term',
}

export enum TextName {
  FallCull = 'text-fall-cull',
  FallNick = 'text-fall-nick',
  FallHold = 'text-fall-hold',
  FallLineText = 'text-fall-line',
  FallText = 'text-fall-text',
  Link = 'text-link',
  Note = 'text-note',
  Comb = 'text-comb',
  Code = 'text-code',
  RiseCull = 'text-rise-cull',
  RiseSlot = 'text-rise-slot',
  RiseNick = 'text-rise-nick',
  RiseNest = 'text-rise-nest',
  RiseHold = 'text-rise-hold',
  RiseLineText = 'text-rise-line',
  RiseText = 'text-rise-text',
  LineSlot = 'text-line-slot',
  SideSize = 'text-side-size',
  Text = 'text-text',
  TermText = 'text-term-text',
  RiseTerm = 'text-rise-term',
  FallTerm = 'text-fall-term',
  Size = 'text-size',
  LineTextLink = 'text-line-text-link',
  LineTextSlot = 'text-line-text-slot',
}

// rank
export type TextRankLink = {
  mark: number
  line: number
}

export type TextRank = {
  base: TextRankLink
  head: TextRankLink
}

export const TEXT_LINE_TEST_LIST: Array<TextName> = [
  TextName.FallLineText,
  TextName.RiseNick,
  TextName.LineTextLink,
  TextName.LineTextSlot,
]

export const TEXT_NICK_TEST_LIST: Array<TextName> = [
  TextName.RiseTerm,
  TextName.FallNick,
]

export const TEXT_TEXT_TEST_LIST: Array<TextName> = [
  TextName.RiseNick,
  TextName.FallText,
  TextName.Text,
]

export const TEXT_TERM_TEST_LIST: Array<TextName> = [
  TextName.RiseNick,
  TextName.TermText,
  TextName.FallTerm,
  TextName.RiseCull,
]

export const TEXT_CULL_TEST_LIST: Array<TextName> = [
  TextName.RiseTerm,
  TextName.Size,
  TextName.SideSize,
  TextName.Comb,
  TextName.Code,
  TextName.FallCull,
]

export const TEXT_NAME: Array<TextName> = [
  TextName.FallLineText,
  TextName.FallCull,
  TextName.FallNick,
  TextName.FallHold,
  TextName.FallText,
  TextName.Link,
  TextName.Note,
  TextName.Comb,
  TextName.Code,
  TextName.LineSlot,
  TextName.RiseCull,
  TextName.RiseSlot,
  TextName.RiseNick,
  TextName.RiseNest,
  TextName.RiseHold,
  TextName.RiseText,
  TextName.RiseLineText,
  TextName.SideSize,
  TextName.Text,
  TextName.TermText,
  TextName.Size,
]

export const TEXT_BASE_TEST_LIST: Array<TextName> = [
  TextName.FallCull,
  TextName.FallNick,
  TextName.FallHold,
  TextName.FallText,
  TextName.Link,
  TextName.Note,
  TextName.Comb,
  TextName.Code,
  TextName.LineSlot,
  TextName.RiseCull,
  TextName.RiseSlot,
  TextName.RiseNick,
  TextName.RiseNest,
  TextName.RiseHold,
  TextName.RiseText,
  TextName.RiseLineText,
  TextName.SideSize,
  TextName.RiseTerm,
  TextName.Size,
]

export const TEXT_TEST: Record<Form, Array<TextName>> = {
  [Form.Line]: TEXT_LINE_TEST_LIST,
  [Form.Text]: TEXT_TEXT_TEST_LIST,
  [Form.Nick]: TEXT_NICK_TEST_LIST,
  [Form.Cull]: TEXT_CULL_TEST_LIST,
  [Form.Term]: TEXT_TERM_TEST_LIST,
  [Form.Base]: TEXT_BASE_TEST_LIST,
}

export type TextRiseTerm = TextBase & {
  form: TextName.RiseTerm
}

export type TextFallTerm = TextBase & {
  form: TextName.FallTerm
}

export type TextFallCull = TextBase & {
  form: TextName.FallCull
}

export type TextFallLineText = TextBase & {
  form: TextName.FallLineText
}

export type TextRiseSlot = TextBase & {
  form: TextName.RiseSlot
}

export type TextLineTextLink = TextBase & {
  form: TextName.LineTextLink
}

export type TextLineTextSlot = TextBase & {
  form: TextName.LineTextSlot
}

export type TextComb = TextBase & {
  form: TextName.Comb
}

export type TextSideSize = TextBase & {
  form: TextName.SideSize
}

export type TextSize = TextBase & {
  form: TextName.Size
}

export type TextRiseNest = TextBase & {
  form: TextName.RiseNest
}

export type TextRiseHold = TextBase & {
  form: TextName.RiseHold
}

export type TextFallHold = TextBase & {
  form: TextName.FallHold
}

export type TextRiseText = TextBase & {
  form: TextName.RiseText
}

export type TextFallText = TextBase & {
  form: TextName.FallText
}

export type TextRiseNick = TextBase & {
  form: TextName.RiseNick
}

export type TextFallNick = TextBase & {
  form: TextName.FallNick
}

export type TextRiseCull = TextBase & {
  form: TextName.RiseCull
}

export type TextLink = TextBase & {
  form: TextName.Link
}

export type TextCode = TextBase & {
  form: TextName.Code
}

export type TextNote = TextBase & {
  form: TextName.Note
}

export type TextRiseLineText = TextBase & {
  form: TextName.RiseLineText
}

export type TextLineSlot = TextBase & {
  form: TextName.LineSlot
}

export type TextText = TextBase & {
  form: TextName.Text
}

export type TextTermText = TextBase & {
  form: TextName.TermText
}

export type TextCallLink = {
  link: string
  text: string
}

export type TextLineRange = {
  mark: number
  line: number
}

export type TextBase = {
  rank: TextRank
  text: string
}

export type TextSeed = {
  base?: Array<TextName>
  test: RegExp
  take?: boolean
}

export type TextCallCast = TextCallLink & {
  list: Array<Text>
  lineText: Array<string>
}

const TEST: Record<TextName, TextSeed> = {
  [TextName.FallCull]: {
    test: /^\]/,
  },
  [TextName.FallNick]: {
    test: /^\}/,
  },
  [TextName.FallHold]: {
    test: /^\)/,
  },
  [TextName.FallText]: {
    test: /^>/,
  },
  [TextName.Link]: {
    test: /^, /,
  },
  [TextName.Note]: {
    test: /^# [^\n]+/,
  },
  [TextName.Comb]: {
    test: /^-?\d+\.\d+/,
  },
  [TextName.Code]: {
    test: /^#\w+/,
  },
  [TextName.LineSlot]: {
    test: /^\n/,
  },
  [TextName.RiseCull]: {
    test: /^\[/,
  },
  [TextName.RiseNick]: {
    test: /^\{/,
  },
  [TextName.RiseHold]: {
    test: /^\(/,
  },
  [TextName.RiseText]: {
    test: /^</,
  },
  [TextName.RiseSlot]: {
    test: /^  /,
  },
  [TextName.RiseNest]: {
    test: /^ /,
  },
  [TextName.RiseLineText]: {
    base: [TextName.RiseSlot, TextName.RiseNest, TextName.Link],
    test: /^@[\w:\-\*]+\/|\.{1,2}\/|\*{1,2}\/|\//,
  },
  [TextName.LineTextLink]: {
    test: /^\//,
  },
  [TextName.LineTextSlot]: {
    test: /^[\w:\-\*]+|\.{1,2}/,
  },
  [TextName.FallLineText]: {
    test: /^[\n, ]/,
    take: false,
  },
  [TextName.SideSize]: {
    test: /^-\d+(?=\b)/,
  },
  [TextName.RiseTerm]: {
    test: /^[*~]?[a-z]/,
    take: false,
  },
  [TextName.TermText]: {
    test: /^[a-z][a-z0-9]*\??(?:\/[a-z][a-z0-9]*\??)*/,
  },
  [TextName.FallTerm]: {
    test: /^[\n, \]\[]/,
    take: false,
  },
  [TextName.Size]: {
    test: /^\d+(?=\b)/,
  },
  [TextName.Text]: {
    test: /^(?:\\[<>\{\}])+|[^\{>\\]+/,
  },
}

export type Text =
  | TextFallCull
  | TextLineSlot
  | TextRiseSlot
  | TextComb
  | TextSideSize
  | TextSize
  | TextRiseNest
  | TextRiseHold
  | TextFallHold
  | TextRiseText
  | TextFallText
  | TextRiseNick
  | TextFallNick
  | TextLink
  | TextCode
  | TextNote
  | TextRiseCull
  | TextText
  | TextTermText
  | TextRiseLineText
  | TextFallLineText
  | TextRiseTerm
  | TextFallTerm
  | TextLineTextLink
  | TextLineTextSlot

export default function makeTextList(link: TextCallLink): TextCallCast {
  const cast: TextCallCast = {
    ...link,
    list: [],
    lineText: link.text.split('\n'),
  }

  let formList = [Form.Base]

  let line = 0
  let mark = 0
  let move = 0

  for (let textLine of cast.lineText) {
    // apphead `\n` so test matching works as expected
    textLine = `${textLine}\n`

    while (textLine) {
      const textForm: Form = formList[formList.length - 1] || Form.Base

      const testList = TEXT_TEST[textForm]

      let progressed = false

      testLoop: for (const form of testList) {
        const seed = TEST[form]

        haveMesh(seed, 'seed')

        let find = textLine.match(seed.test)
        console.log(find, form, textLine)

        if (find) {
          if (seed.base) {
            const stem = cast.list[cast.list.length - 1]
            if (!stem) {
              continue
            }
            if (!seed.base.includes(stem.form)) {
              continue
            }
          }

          progressed = true

          if (seed.take === false) {
            const stem: Text = {
              rank: {
                head: {
                  mark,
                  line,
                },
                base: {
                  mark,
                  line,
                },
              },
              text: '',
              form: form as Text['form'],
            }
            cast.list.push(stem)
          } else {
            const findSize = find[0].length
            const findText = textLine.slice(0, findSize)
            const stem: Text = {
              rank: {
                head: {
                  mark: mark + findSize,
                  line,
                },
                base: {
                  mark,
                  line,
                },
              },
              text: findText,
              form: form as Text['form'],
            }
            cast.list.push(stem)

            textLine = textLine.slice(findSize)
            move += findSize
            mark += findSize
          }

          switch (form) {
            case TextName.LineSlot: {
              line++
              mark = 0
            }
            case TextName.RiseNick: {
              formList.push(Form.Nick)
              break
            }
            case TextName.FallNick: {
              formList.pop()
              break
            }
            case TextName.RiseCull: {
              formList.push(Form.Cull)
              break
            }
            case TextName.FallCull: {
              formList.pop()
              break
            }
            case TextName.RiseTerm: {
              formList.push(Form.Term)
              break
            }
            case TextName.FallTerm: {
              formList.pop()
              break
            }
            case TextName.RiseText: {
              formList.push(Form.Text)
              break
            }
            case TextName.FallText: {
              formList.pop()
              break
            }
            case TextName.RiseLineText: {
              formList.push(Form.Line)
              break
            }
            case TextName.FallLineText: {
              formList.pop()
              break
            }
            default:
              break
          }

          break testLoop
        }
      }

      if (!progressed) {
        const last = cast.list[cast.list.length - 1]
        haveMesh(last, 'last')
        console.log(cast.list)
        throw generateSyntaxTokenError(cast, last)
      }
    }

    if (textLine.length) {
      const last = cast.list[cast.list.length - 1]
      haveMesh(last, 'last')
      throw generateSyntaxTokenError(cast, last)
    }
  }

  console.log(JSON.stringify(cast.list, null, 2))

  process.exit()

  return cast
}
