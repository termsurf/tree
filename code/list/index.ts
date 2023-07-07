import { HaltMesh } from '@tunebond/halt'
import { haveMesh } from '@tunebond/have'
import halt from '../halt.js'
import {
  Form,
  Hunk,
  CallCast,
  CallLink,
  Name,
  Seed,
} from './form.js'

export const LINE_TEST_LIST: Array<Name> = [Name.RiseNick]

export const NICK_TEST_LIST: Array<Name> = [
  Name.FallNick,
  Name.SlotLine,
  Name.Size,
  Name.Comb,
  Name.Code,
  Name.Link,
  Name.RiseText,
  Name.RiseNick,
  Name.RiseCull,
  Name.Knit,
  Name.Slot,
]

export const TEXT_TEST_LIST: Array<Name> = [
  Name.RiseNick,
  Name.FallText,
  Name.Text,
]

export const TERM_TEST_LIST: Array<Name> = [
  Name.RiseNick,
  Name.RiseCull,
  Name.Knit,
  Name.Line,
]

export const CULL_TEST_LIST: Array<Name> = [
  Name.Size,
  Name.Comb,
  Name.Code,
  Name.FallCull,
  Name.RiseNick,
  Name.RiseCull,
  Name.SlotLine,
  Name.Knit,
  Name.Slot,
]

export const NAME: Array<Name> = [
  Name.FallCull,
  Name.FallNick,
  Name.FallHold,
  Name.FallText,
  Name.Link,
  Name.Note,
  Name.Comb,
  Name.Code,
  Name.SlotLine,
  Name.RiseCull,
  Name.RiseNick,
  Name.RiseHold,
  Name.RiseText,
  Name.Text,
  Name.Size,
  Name.Line,
  Name.Knit,
]

export const BASE_TEST_LIST: Array<Name> = [
  Name.FallCull,
  Name.FallNick,
  Name.FallHold,
  Name.FallText,
  Name.Link,
  Name.Note,
  Name.Comb,
  Name.Code,
  Name.SlotLine,
  Name.RiseCull,
  Name.RiseNick,
  Name.RiseHold,
  Name.RiseText,
  Name.Size,
  Name.Slot,
  Name.Knit,
  Name.Line,
]

export const FORM: Record<Form, Array<Name>> = {
  [Form.Line]: LINE_TEST_LIST,
  [Form.Text]: TEXT_TEST_LIST,
  [Form.Nick]: NICK_TEST_LIST,
  [Form.Cull]: CULL_TEST_LIST,
  [Form.Term]: TERM_TEST_LIST,
  [Form.Base]: BASE_TEST_LIST,
}

/**
 * These are _flexible_ matchers, so that
 * you can get error handling that the thing
 * was incorrect, rather than it just not matching
 * at all.
 */

const TEST: Record<Name, Seed> = {
  [Name.FallCull]: {
    test: /^\]/,
  },
  [Name.FallNick]: {
    test: /^\}+/,
  },
  [Name.FallHold]: {
    test: /^\)/,
  },
  [Name.FallText]: {
    test: /^>/,
  },
  [Name.Link]: {
    test: /^, */,
  },
  [Name.Note]: {
    test: /^# +[^\n]+/,
  },
  [Name.Comb]: {
    test: /^-?\d+\.\d+/,
  },
  [Name.Code]: {
    test: /^#\w+/,
  },
  [Name.SlotLine]: {
    test: /^\n/,
  },
  [Name.RiseCull]: {
    test: /^\[/,
  },
  [Name.RiseNick]: {
    test: /^\{+/,
  },
  [Name.RiseHold]: {
    test: /^\(/,
  },
  [Name.RiseText]: {
    test: /^</,
  },
  [Name.Slot]: {
    test: /^ +/,
  },
  [Name.Line]: {
    test: /^[@~$%^&\w:\-\*'"\/\.,_]+/,
  },
  [Name.Knit]: {
    test: /^[a-z0-0A-Z_\-\?]+/,
  },
  [Name.Size]: {
    test: /^-?\d+(?=\b)/,
  },
  [Name.Text]: {
    test: /^(?:\\[<>\{\}])+|[^\{>\\]+/,
  },
}

/**
 * This module is ideally very lenient with what it accepts so it can throw
 * helpful error messages if you forget the proper case and such.
 */

export default function makeTextList(link: CallLink): CallCast | Array<HaltMesh> {
  const cast: CallCast = {
    ...link,
    lineText: link.text.split('\n'),
  }

  let formList = [Form.Base]

  let line = 0
  let mark = 0

  let back: Hunk | undefined = undefined

  function save(hunk: Hunk) {
    if (!cast.head) {
      cast.head = hunk
    } else if (back) {
      hunk.back = back
      back.head = hunk
      back = hunk
    }
  }

  for (let textLine of cast.lineText) {
    // append `\n` so test matching works as expected
    textLine = `${textLine}\n`

    while (textLine) {
      const textForm: Form = formList[formList.length - 1] || Form.Base

      const testList = FORM[textForm]

      let move = false

      walk: for (const form of testList) {
        const seed = TEST[form]

        haveMesh(seed, 'seed')

        let find = textLine.match(seed.test)

        // console.log(form, textForm, find)

        if (!find) {
          continue
        }

        move = true

        const findSize = find[0].length
        const findText = textLine.slice(0, findSize)

        const stem: Hunk = {
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
          form: form as Hunk['form'],
        }
        save(stem)

        textLine = textLine.slice(findSize)
        mark += findSize

        switch (form) {
          case Name.SlotLine: {
            line++
            mark = 0
            break
          }
          case Name.RiseNick: {
            formList.push(Form.Nick)
            break
          }
          case Name.FallNick: {
            formList.pop()
            break
          }
          case Name.RiseCull: {
            formList.push(Form.Cull)
            break
          }
          case Name.FallCull: {
            formList.pop()
            break
          }
          case Name.RiseText: {
            formList.push(Form.Text)
            break
          }
          case Name.FallText: {
            formList.pop()
            break
          }
          default:
            break
        }

        break walk
      }

      if (!move) {
        haveMesh(back, 'back')
        return [halt('text', { cast, back }).toJSON()]
      }
    }

    if (textLine.length) {
      haveMesh(back, 'back')
      return [halt('text', { cast, back }).toJSON()]
    }
  }

  return cast
}
