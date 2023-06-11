import { haveMesh } from '@tunebond/have'
import { generateSyntaxTokenError } from '../halt.js'

export enum TextName {
  FallCull = 'text-fall-cull',
  FallNick = 'text-fall-nick',
  FallHold = 'text-fall-hold',
  FallLine = 'text-fall-line',
  FallText = 'text-fall-text',
  Link = 'text-link',
  Note = 'text-note',
  Comb = 'text-comb',
  Code = 'text-code',
  Line = 'text-line',
  RiseCull = 'text-rise-cull',
  RiseSlot = 'text-rise-slot',
  RiseNick = 'text-rise-nick',
  RiseNest = 'text-rise-nest',
  RiseHold = 'text-rise-hold',
  RiseLine = 'text-rise-line',
  RiseText = 'text-rise-text',
  LineSlot = 'text-line-slot',
  SideSize = 'text-signed-integer',
  Text = 'text-text',
  TermSlot = 'text-term-fragment',
  Size = 'text-unsigned-integer',
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
  TextName.FallLine,
  TextName.RiseNick,
  TextName.FallNick,
  TextName.Line,
]

export const TEXT_TEXT_TEST_LIST: Array<TextName> = [
  TextName.RiseNick,
  TextName.FallNick,
  TextName.FallText,
  TextName.Text,
]

export const TEXT_NAME: Array<TextName> = [
  TextName.FallLine,
  TextName.FallCull,
  TextName.FallNick,
  TextName.FallHold,
  TextName.FallText,
  TextName.Link,
  TextName.Note,
  TextName.Comb,
  TextName.Code,
  TextName.Line,
  TextName.RiseCull,
  TextName.RiseSlot,
  TextName.RiseNick,
  TextName.RiseNest,
  TextName.RiseHold,
  TextName.RiseText,
  TextName.RiseLine,
  TextName.LineSlot,
  TextName.SideSize,
  TextName.Text,
  TextName.TermSlot,
  TextName.Size,
]

export const TEXT_TEST_LIST: Array<TextName> = [
  TextName.FallCull,
  TextName.FallNick,
  TextName.FallHold,
  TextName.FallText,
  TextName.Link,
  TextName.Note,
  TextName.Comb,
  TextName.Code,
  TextName.Line,
  TextName.RiseCull,
  TextName.RiseSlot,
  TextName.RiseNick,
  TextName.RiseNest,
  TextName.RiseHold,
  TextName.RiseText,
  TextName.RiseLine,
  TextName.SideSize,
  TextName.TermSlot,
  TextName.Size,
]

export type TextFallCull = TextBase & {
  form: TextName.FallCull
}

export type TextFallLine = TextBase & {
  form: TextName.FallLine
}

export type TextLine = TextBase & {
  form: TextName.Line
}

export type TextRiseSlot = TextBase & {
  form: TextName.RiseSlot
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

export type TextRiseLine = TextBase & {
  form: TextName.RiseLine
}

export type TextLineSlot = TextBase & {
  form: TextName.LineSlot
}

export type TextText = TextBase & {
  form: TextName.Text
}

export type TextTermSlot = TextBase & {
  form: TextName.TermSlot
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
  head?: Array<TextName>
  test: RegExp
  take?: boolean
}

export type TextCallCast = TextCallLink & {
  list: Array<Text>
  lineText: Array<string>
}

enum Form {
  Line = 'line',
  Text = 'text',
  Tree = 'tree',
}

const TEST: Record<TextName, TextSeed> = {
  [TextName.FallCull]: {
    test: /^ *\] */,
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
    test: /^ *\[ */,
  },
  [TextName.RiseSlot]: {
    test: /^  /,
  },
  [TextName.RiseNick]: {
    test: /^\{/,
  },
  [TextName.RiseNest]: {
    test: /^ /,
  },
  [TextName.RiseHold]: {
    test: /^\(/,
  },
  [TextName.RiseText]: {
    test: /^</,
  },
  [TextName.RiseLine]: {
    head: [TextName.RiseSlot, TextName.RiseNest, TextName.Link],
    test: /^(?:(?:@[\w:\-\.]+\/)|(?:\.{1,2}\/)|\*{1,2}\/|(?:\/))/,
  },
  [TextName.Line]: {
    test: /^[\w:\-\.\*]*(\/[\w:\-\.\*]*)*/,
  },
  [TextName.FallLine]: {
    test: /^[\n, ]/,
    take: false,
  },
  [TextName.SideSize]: {
    test: /^-\d+(?=\b)/,
  },
  [TextName.TermSlot]: {
    test: /^-?(?:[*~]?[a-z0-9]*(?:-[a-z0-9]+)*\??)(?:\/[a-z0-9]*(?:-[a-z0-9]+)*\??)*-?|-|\//,
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
  | TextLine
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
  | TextTermSlot
  | TextRiseLine
  | TextFallLine
  | TextLine

export default function makeTextList(link: TextCallLink): TextCallCast {
  const cast: TextCallCast = {
    ...link,
    list: [],
    lineText: link.text.split('\n'),
  }

  let formList = [Form.Tree]

  let line = 0
  let mark = 0
  let move = 0

  for (let textLine of cast.lineText) {
    // apphead `\n` so test matching works as expected
    textLine = `${textLine}\n`

    while (textLine) {
      const textForm: Form = formList[formList.length - 1] || Form.Tree

      let testList = TEXT_TEST_LIST

      switch (textForm) {
        case Form.Tree:
          testList = TEXT_TEST_LIST
          break
        case Form.Text:
          testList = TEXT_TEXT_TEST_LIST
          break
        case Form.Line:
          testList = TEXT_LINE_TEST_LIST
          break
        default:
          testList = TEXT_TEST_LIST
          break
      }

      let progressed = false

      testLoop: for (const form of testList) {
        const seed = TEST[form]

        if (seed && seed.test instanceof RegExp) {
          let find = textLine.match(seed.test)

          if (find) {
            // console.log(
            //   textForm,
            //   form,
            //   match?.[0],
            //   textLine,
            //   seed.test,
            // )
            if (seed.head) {
              const stem = cast.list[cast.list.length - 1]
              if (!stem) {
                continue
              }
              if (!seed.head.includes(stem.form)) {
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
              case TextName.Line: {
                line++
                mark = 0
              }
              case TextName.RiseNick: {
                formList.push(Form.Tree)
                break
              }
              case TextName.FallNick: {
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
              case TextName.RiseLine: {
                formList.push(Form.Line)
                break
              }
              case TextName.FallLine: {
                formList.pop()
                break
              }
              default:
                break
            }

            break testLoop
          }
        }
      }

      if (!progressed) {
        const last = cast.list[cast.list.length - 1]
        haveMesh(last, 'last')
        throw generateSyntaxTokenError(cast, last)
      }
    }

    if (textLine.length) {
      const last = cast.list[cast.list.length - 1]
      haveMesh(last, 'last')
      throw generateSyntaxTokenError(cast, last)
    }
  }

  // console.log(JSON.stringify(cast.list, null, 2))

  return cast
}
