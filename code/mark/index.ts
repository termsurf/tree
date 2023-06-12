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
  FallText = 'mark-fall-text',
  Link = 'mark-link',
  Note = 'mark-note',
  Comb = 'mark-comb',
  Code = 'mark-code',
  RiseCull = 'mark-rise-cull',
  RiseNick = 'mark-rise-nick',
  RiseHold = 'mark-rise-hold',
  RiseText = 'mark-rise-text',
  LineSlot = 'mark-line-slot',
  Text = 'mark-text',
  Size = 'mark-size',
  Slot = 'mark-slot',
  RiseSlot = 'mark-rise-slot',
  FallSlot = 'mark-fall-slot',
  Line = 'mark-line',
  Knit = 'mark-knit',
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

export const MARK_LINE_TEST_LIST: Array<MarkName> = [MarkName.RiseNick]

export const MARK_NICK_TEST_LIST: Array<MarkName> = [
  MarkName.FallNick,
  MarkName.LineSlot,
  MarkName.Size,
  MarkName.Comb,
  MarkName.Code,
  MarkName.Link,
  MarkName.RiseText,
  MarkName.RiseNick,
  MarkName.RiseCull,
  MarkName.Knit,
  MarkName.Slot,
  MarkName.FallSlot,
]

export const MARK_TEXT_TEST_LIST: Array<MarkName> = [
  MarkName.RiseNick,
  MarkName.FallText,
  MarkName.Text,
]

export const MARK_TERM_TEST_LIST: Array<MarkName> = [
  MarkName.RiseNick,
  MarkName.RiseCull,
  MarkName.Knit,
  MarkName.Line,
  MarkName.FallSlot,
]

export const MARK_CULL_TEST_LIST: Array<MarkName> = [
  MarkName.Size,
  MarkName.Comb,
  MarkName.Code,
  MarkName.FallCull,
  MarkName.RiseNick,
  MarkName.RiseCull,
  MarkName.LineSlot,
  MarkName.Knit,
  MarkName.Slot,
  MarkName.FallSlot,
]

export const MARK_NAME: Array<MarkName> = [
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
  MarkName.RiseNick,
  MarkName.RiseHold,
  MarkName.RiseText,
  MarkName.Text,
  MarkName.Size,
  MarkName.RiseSlot,
  MarkName.Line,
  MarkName.Knit,
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
  MarkName.RiseNick,
  MarkName.RiseHold,
  MarkName.RiseText,
  MarkName.Size,
  MarkName.FallSlot,
  MarkName.Slot,
  MarkName.Knit,
  MarkName.Line,
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

export type MarkComb = MarkBase & {
  form: MarkName.Comb
}

export type MarkSize = MarkBase & {
  form: MarkName.Size
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

export type MarkSlot = MarkBase & {
  form: MarkName.Slot
}

export type MarkRiseSlot = MarkBase & {
  form: MarkName.RiseSlot
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

export type MarkFallSlot = MarkBase & {
  form: MarkName.FallSlot
}

export type MarkLineSlot = MarkBase & {
  form: MarkName.LineSlot
}

export type MarkText = MarkBase & {
  form: MarkName.Text
}

export type MarkKnit = MarkBase & {
  form: MarkName.Knit
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
  // what comes before
  base?: Array<MarkName>
  // what comes after
  head?: Array<MarkName>
  test: RegExp
  // whether or not we consume token
  take?: boolean
  link?: MarkName
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
    test: /^\}+/,
  },
  [MarkName.FallHold]: {
    test: /^\)/,
  },
  [MarkName.FallText]: {
    test: /^>/,
  },
  [MarkName.Link]: {
    test: /^, */,
  },
  [MarkName.Note]: {
    test: /^# +[^\n]+/,
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
    test: /^\{+/,
  },
  [MarkName.RiseHold]: {
    test: /^\(/,
  },
  [MarkName.RiseText]: {
    test: /^</,
  },
  [MarkName.FallSlot]: {
    test: /^ +$/,
  },
  [MarkName.Slot]: {
    test: /^ +/,
  },
  [MarkName.RiseSlot]: {
    test: /^ +/,
  },
  [MarkName.Line]: {
    test: /^[@~$%^&\w:\-\*'"\/\.,_]+/,
  },
  [MarkName.Knit]: {
    test: /^[a-z0-0A-Z_\-\?]+/,
  },
  [MarkName.Size]: {
    test: /^-?\d+(?=\b)/,
  },
  [MarkName.Text]: {
    test: /^(?:\\[<>\{\}])+|[^\{>\\]+/,
  },
}

export type Mark =
  | MarkFallCull
  | MarkFallNick
  | MarkFallHold
  | MarkFallText
  | MarkLink
  | MarkNote
  | MarkComb
  | MarkCode
  | MarkRiseCull
  | MarkRiseNick
  | MarkRiseHold
  | MarkRiseText
  | MarkLineSlot
  | MarkText
  | MarkSize
  | MarkSlot
  | MarkRiseSlot
  | MarkFallSlot
  | MarkKnit

/**
 * This module is ideally very lenient with what it accepts so it can throw
 * helpful error messages if you forget the proper case and such.
 */

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

  const nickList: Array<string> = []

  walkBase: for (let textLine of cast.lineText) {
    // apphead `\n` so test matching works as expected
    textLine = `${textLine}\n`

    const slotTest = TEST[MarkName.RiseSlot].test
    const slotText = textLine.match(slotTest)
    if (slotText) {
      const slotTextFind = slotText[0]
      const slotTextSize = slotTextFind.length

      const stem: Mark = {
        rank: {
          head: {
            mark: mark + slotTextSize,
            line,
          },
          base: {
            mark,
            line,
          },
        },
        text: slotTextFind,
        form: MarkName.RiseSlot as Mark['form'],
      }
      cast.list.push(stem)

      move += slotTextSize
      mark += slotTextSize

      textLine = textLine.slice(slotTextSize)

      if (!textLine) {
        break walkBase
      }
    }

    while (textLine) {
      const textForm: Form = formList[formList.length - 1] || Form.Base

      const testList = MARK_TEST[textForm]

      let walk = false

      walk: for (const form of testList) {
        if (form === MarkName.RiseSlot) {
          continue
        }

        const seed = TEST[form]

        haveMesh(seed, 'seed')

        let find = textLine.match(seed.test)

        // console.log(form, textForm, find)

        if (!find) {
          continue
        }

        walk = true

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
          let findSize = find[0].length
          let findText = textLine.slice(0, findSize)

          if (form === MarkName.FallNick) {
            const last = nickList[nickList.length - 1]
            if (last) {
              findSize = last.length
              findText = findText.slice(0, last.length)
            }
          }

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

          if (form === MarkName.RiseNick) {
            nickList.push(findText)
          } else if (form === MarkName.FallNick) {
            nickList.pop()
          }
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
          default:
            break
        }

        break walk
      }

      if (!walk) {
        const last = cast.list[cast.list.length - 1]
        haveMesh(last, 'last')
        console.log(cast.list)
        throw generateSyntaxTokenError(cast, last)
      }
    }

    if (textLine.length) {
      const last = cast.list[cast.list.length - 1]
      console.log(cast.list)
      haveMesh(last, 'last')
      throw generateSyntaxTokenError(cast, last)
    }
  }

  // console.log(JSON.stringify(cast.list, null, 2))

  return cast
}
