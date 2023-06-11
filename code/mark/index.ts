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

export enum MarkName {
  FallCull = 'mark-fall-cull',
  FallNick = 'mark-fall-nick',
  FallHold = 'mark-fall-hold',
  FallLineText = 'mark-fall-line-text',
  FallText = 'mark-fall-text',
  Link = 'mark-link',
  Note = 'mark-note',
  Comb = 'mark-comb',
  Code = 'mark-code',
  RiseCull = 'mark-rise-cull',
  RiseSlot = 'mark-rise-slot',
  RiseNick = 'mark-rise-nick',
  RiseNest = 'mark-rise-nest',
  RiseHold = 'mark-rise-hold',
  RiseLineText = 'mark-rise-line-text',
  RiseText = 'mark-rise-text',
  LineSlot = 'mark-line-slot',
  SideSize = 'mark-side-size',
  Text = 'mark-text',
  TermText = 'mark-term-text',
  Size = 'mark-size',
  LineTextLink = 'mark-line-text-link',
  LineTextSlot = 'mark-line-text-slot',
}

// rank
export type RankLink = {
  mark: number
  line: number
}

export type Rank = {
  base: RankLink
  head: RankLink
}

export const MARK_LINE_TEST_LIST: Array<MarkName> = [
  MarkName.FallLineText,
  MarkName.RiseNick,
  MarkName.LineTextLink,
  MarkName.LineTextSlot,
]

export const MARK_NICK_TEST_LIST: Array<MarkName> = [
  MarkName.TermText,
  MarkName.FallNick,
  MarkName.RiseNest,
  MarkName.Size,
  MarkName.SideSize,
  MarkName.Comb,
  MarkName.Code,
  MarkName.Link,
]

export const MARK_TEXT_TEST_LIST: Array<MarkName> = [
  MarkName.RiseNick,
  MarkName.FallText,
  MarkName.Text,
]

export const MARK_TERM_TEST_LIST: Array<MarkName> = [
  MarkName.RiseNick,
  MarkName.TermText,
  MarkName.RiseCull,
  MarkName.RiseNest,
]

export const MARK_CULL_TEST_LIST: Array<MarkName> = [
  MarkName.TermText,
  MarkName.Size,
  MarkName.SideSize,
  MarkName.Comb,
  MarkName.Code,
  MarkName.FallCull,
]

export const MARK_NAME: Array<MarkName> = [
  MarkName.FallLineText,
  MarkName.FallCull,
  MarkName.FallNick,
  MarkName.FallHold,
  MarkName.FallText,
  MarkName.Link,
  MarkName.Note,
  MarkName.Comb,
  MarkName.Code,
  MarkName.LineSlot,
  MarkName.RiseCull,
  MarkName.RiseSlot,
  MarkName.RiseNick,
  MarkName.RiseNest,
  MarkName.RiseHold,
  MarkName.RiseText,
  MarkName.RiseLineText,
  MarkName.SideSize,
  MarkName.Text,
  MarkName.TermText,
  MarkName.Size,
]

export const MARK_BASE_TEST_LIST: Array<MarkName> = [
  MarkName.FallCull,
  MarkName.FallNick,
  MarkName.FallHold,
  MarkName.FallText,
  MarkName.Link,
  MarkName.Note,
  MarkName.Comb,
  MarkName.Code,
  MarkName.LineSlot,
  MarkName.RiseCull,
  MarkName.RiseSlot,
  MarkName.RiseNick,
  MarkName.RiseNest,
  MarkName.RiseHold,
  MarkName.RiseText,
  MarkName.RiseLineText,
  MarkName.SideSize,
  MarkName.TermText,
  MarkName.Size,
]

export const MARK_TEST: Record<Form, Array<MarkName>> = {
  [Form.Line]: MARK_LINE_TEST_LIST,
  [Form.Text]: MARK_TEXT_TEST_LIST,
  [Form.Nick]: MARK_NICK_TEST_LIST,
  [Form.Cull]: MARK_CULL_TEST_LIST,
  [Form.Term]: MARK_TERM_TEST_LIST,
  [Form.Base]: MARK_BASE_TEST_LIST,
}

export type MarkFallCull = MarkBase & {
  form: MarkName.FallCull
}

export type MarkFallLineText = MarkBase & {
  form: MarkName.FallLineText
}

export type MarkRiseSlot = MarkBase & {
  form: MarkName.RiseSlot
}

export type MarkLineTextLink = MarkBase & {
  form: MarkName.LineTextLink
}

export type MarkLineTextSlot = MarkBase & {
  form: MarkName.LineTextSlot
}

export type MarkComb = MarkBase & {
  form: MarkName.Comb
}

export type MarkSideSize = MarkBase & {
  form: MarkName.SideSize
}

export type MarkSize = MarkBase & {
  form: MarkName.Size
}

export type MarkRiseNest = MarkBase & {
  form: MarkName.RiseNest
}

export type MarkRiseHold = MarkBase & {
  form: MarkName.RiseHold
}

export type MarkFallHold = MarkBase & {
  form: MarkName.FallHold
}

export type MarkRiseText = MarkBase & {
  form: MarkName.RiseText
}

export type MarkFallText = MarkBase & {
  form: MarkName.FallText
}

export type MarkRiseNick = MarkBase & {
  form: MarkName.RiseNick
}

export type MarkFallNick = MarkBase & {
  form: MarkName.FallNick
}

export type MarkRiseCull = MarkBase & {
  form: MarkName.RiseCull
}

export type MarkLink = MarkBase & {
  form: MarkName.Link
}

export type MarkCode = MarkBase & {
  form: MarkName.Code
}

export type MarkNote = MarkBase & {
  form: MarkName.Note
}

export type MarkRiseLineText = MarkBase & {
  form: MarkName.RiseLineText
}

export type MarkLineSlot = MarkBase & {
  form: MarkName.LineSlot
}

export type MarkText = MarkBase & {
  form: MarkName.Text
}

export type MarkTermText = MarkBase & {
  form: MarkName.TermText
}

export type MarkCallLink = {
  link: string
  text: string
}

export type MarkLineRange = {
  mark: number
  line: number
}

export type MarkBase = {
  rank: Rank
  text: string
}

export type MarkSeed = {
  base?: Array<MarkName>
  test: RegExp
  take?: boolean
}

export type MarkCallCast = MarkCallLink & {
  list: Array<Mark>
  lineText: Array<string>
}

const TEST: Record<MarkName, MarkSeed> = {
  [MarkName.FallCull]: {
    test: /^\]/,
  },
  [MarkName.FallNick]: {
    test: /^\}/,
  },
  [MarkName.FallHold]: {
    test: /^\)/,
  },
  [MarkName.FallText]: {
    test: /^>/,
  },
  [MarkName.Link]: {
    test: /^, /,
  },
  [MarkName.Note]: {
    test: /^# [^\n]+/,
  },
  [MarkName.Comb]: {
    test: /^-?\d+\.\d+/,
  },
  [MarkName.Code]: {
    test: /^#\w+/,
  },
  [MarkName.LineSlot]: {
    test: /^\n/,
  },
  [MarkName.RiseCull]: {
    test: /^\[/,
  },
  [MarkName.RiseNick]: {
    test: /^\{/,
  },
  [MarkName.RiseHold]: {
    test: /^\(/,
  },
  [MarkName.RiseText]: {
    test: /^</,
  },
  [MarkName.RiseSlot]: {
    test: /^  /,
  },
  [MarkName.RiseNest]: {
    test: /^ /,
  },
  [MarkName.RiseLineText]: {
    base: [MarkName.RiseSlot, MarkName.RiseNest, MarkName.Link],
    test: /^(@[\w:\-\*]+\/|\.{1,2}\/|\*{1,2}\/|\/)/,
  },
  [MarkName.LineTextLink]: {
    test: /^\//,
  },
  [MarkName.LineTextSlot]: {
    test: /^[\w:\-\*\.]+|\.{1,2}/,
  },
  [MarkName.FallLineText]: {
    test: /^[\n, ]/,
    take: false,
  },
  [MarkName.SideSize]: {
    test: /^-?\d+(?=\b)/,
  },
  [MarkName.TermText]: {
    test: /^[a-z0-9\/\-]+/,
  },
  [MarkName.Size]: {
    test: /^\d+(?=\b)/,
  },
  [MarkName.Text]: {
    test: /^(?:\\[<>\{\}])+|[^\{>\\]+/,
  },
}

export type Mark =
  | MarkFallCull
  | MarkLineSlot
  | MarkRiseSlot
  | MarkComb
  | MarkSideSize
  | MarkSize
  | MarkRiseNest
  | MarkRiseHold
  | MarkFallHold
  | MarkRiseText
  | MarkFallText
  | MarkRiseNick
  | MarkFallNick
  | MarkLink
  | MarkCode
  | MarkNote
  | MarkRiseCull
  | MarkText
  | MarkTermText
  | MarkRiseLineText
  | MarkFallLineText
  | MarkLineTextLink
  | MarkLineTextSlot

export default function makeTextList(link: MarkCallLink): MarkCallCast {
  const cast: MarkCallCast = {
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

      const testList = MARK_TEST[textForm]

      let progressed = false

      testLoop: for (const form of testList) {
        const seed = TEST[form]

        haveMesh(seed, 'seed')

        let find = textLine.match(seed.test)
        console.log(find, textForm, form, textLine)

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
            const stem: Mark = {
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
              form: form as Mark['form'],
            }
            cast.list.push(stem)
          } else {
            const findSize = find[0].length
            const findText = textLine.slice(0, findSize)
            const stem: Mark = {
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
              form: form as Mark['form'],
            }
            cast.list.push(stem)

            textLine = textLine.slice(findSize)
            move += findSize
            mark += findSize
          }

          switch (form) {
            case MarkName.LineSlot: {
              line++
              mark = 0
              break
            }
            case MarkName.RiseNick: {
              formList.push(Form.Nick)
              break
            }
            case MarkName.FallNick: {
              formList.pop()
              break
            }
            case MarkName.RiseCull: {
              formList.push(Form.Cull)
              break
            }
            case MarkName.FallCull: {
              formList.pop()
              break
            }
            case MarkName.RiseText: {
              formList.push(Form.Text)
              break
            }
            case MarkName.FallText: {
              formList.pop()
              break
            }
            case MarkName.RiseLineText: {
              formList.push(Form.Line)
              break
            }
            case MarkName.FallLineText: {
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

  return cast
}
