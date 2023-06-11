import _ from 'lodash'

import type {
  TextCallCast,
  TextText,
  TextLine,
  TextTermSlot,
} from '../text/index.js'
import { TextName } from '../text/index.js'

import { FoldName } from './form.js'
import type { FoldCallCast, FoldTermSlot, Fold } from './form.js'
import {
  generateInvalidCompilerStateError,
  generateInvalidWhitespaceError,
  generateSyntaxTokenError,
} from 'code/halt.js'
import { haveMesh } from '@tunebond/have'

export * from './form.js'

export type FoldCallLink = TextCallCast

enum Form {
  Card = 'card',
  Text = 'text',
  Term = 'term',
  TermLine = 'term-line',
  Nick = 'nick',
  Cull = 'cull',
  Nest = 'nest',
}

export default function makeFoldList(link: FoldCallLink): FoldCallCast {
  const foldList: Array<Fold> = []

  const sizeList: Record<string, number> = {}

  function size(form: FoldName): number {
    sizeList[form] = sizeList[form] || 1
    return sizeList[form]++
  }

  function fold<T extends FoldName>(form: T) {
    return {
      code: size(form),
      form,
    }
  }

  let slot = 0

  let textSlot = 0 // indent
  let lineHost = false

  const cast = {
    ...link,
    foldList,
  }

  const formList: Array<Form> = []

  while (slot < link.list.length) {
    const seed = link.list[slot]
    haveMesh(seed, 'seed')

    switch (formList[formList.length - 1]) {
      case Form.Text:
        break
      case Form.Term:
        switch (seed.form) {
          case TextName.RiseNick:
            foldList.push({
              size: seed.text.length,
              ...fold(FoldName.RiseNick),
            })
            formList.push(Form.Nick)
            slot++
            break
          case TextName.TermSlot:
            break
          default:
            break
        }
        break
      case Form.Nick:
        switch (seed.form) {
          case TextName.FallNick:
            foldList.push(fold(FoldName.FallNick))
            formList.pop()
            break
          default:
            break
        }
      case Form.Cull:
        break
      case Form.Card:
        switch (seed.form) {
          case TextName.Note: {
            slot++
            lineHost = false
            break
          }
          case TextName.LineSlot: {
            while (textSlot > 0) {
              foldList.push(fold(FoldName.FallNest))
              textSlot--
            }
            lineHost = true
            slot++
            break
          }
          case TextName.RiseSlot: {
            if (!lineHost) {
              throw generateInvalidWhitespaceError(cast, slot)
            }
            textSlot++
            foldList.push(fold(FoldName.RiseNest))
            slot++
            break
          }
          case TextName.TermSlot: {
            lineHost = false
            formList.push(Form.Term)
            break
          }
          case TextName.RiseNick:
            lineHost = false
            foldList.push(fold(FoldName.RiseTerm))
            formList.push(Form.Term)
            break
          case TextName.RiseNest:
            throw syntaxError('Incorrectly placed space')
            break
          case TextName.FallNick:
            throw syntaxError('Incorrectly placed }')
            break
          default:
            break
        }
        break
      default:
        throw syntaxError('not found')
    }
  }

  // foldList.push(fold(FoldName.CloseModule))

  function castLine(link: FoldCallLink): Array<Fold> {
    const foldList: Array<Fold> = []
    foldList.push(fold(FoldName.RiseText))

    let nickSize = 0

    loop: while (slot < link.list.length) {
      const seed = link.list[slot++]
      check: switch (seed?.form) {
        case TextName.Text:
        case TextName.Line: {
          foldList.push({
            ...seed,
            bond: seed.text,
            ...fold(FoldName.Text),
          })
          break check
        }
        case TextName.RiseLine: {
          foldList.push({
            ...seed,
            bond: seed.text,
            ...fold(FoldName.Text),
          })
          break check
        }
        case TextName.FallLine: {
          break loop
        }
        case TextName.RiseNick: {
          nickSize++
          foldList.push({
            size: seed.text.length,
            ...fold(FoldName.RiseNick),
          })
          foldList.push(...castTermSlot(link))
          break check
        }
        case TextName.FallNick: {
          if (nickSize > 0) {
            foldList.push(fold(FoldName.FallNick))
            nickSize--
          } else {
            slot--
            break loop
          }
          break check
        }
        case TextName.TermSlot: {
          slot--
          foldList.push(...castTermSlot(link))
          break
        }
        default:
          // slot--
          break loop
      }
    }

    foldList.push(fold(FoldName.FallText))
    return foldList
  }

  function castText(link: FoldCallLink): Array<Fold> {
    const foldList: Array<Fold> = []
    foldList.push(fold(FoldName.RiseText))

    let nickSize = 0

    loop: while (slot < link.list.length) {
      const seed = link.list[slot++]
      check: switch (seed?.form) {
        case TextName.Text: {
          foldList.push({
            ...seed,
            bond: seed.text,
            ...fold(FoldName.Text),
          })
          break check
        }
        case TextName.RiseNick: {
          nickSize++
          foldList.push({
            size: seed.text.length,
            ...fold(FoldName.RiseNick),
          })
          foldList.push(...castTermSlot(link))
          break check
        }
        case TextName.FallNick: {
          if (nickSize > 0) {
            foldList.push(fold(FoldName.FallNick))
            nickSize--
          } else {
            slot--
            break loop
          }
          break check
        }
        default:
          break loop
      }
    }

    foldList.push(fold(FoldName.FallText))
    return foldList
  }

  function castNest(
    link: FoldCallLink,
    foldList: Array<Fold> = [],
  ): Array<Fold> {
    foldList.push(fold(FoldName.RiseNest))
    castNestHead(link, foldList)
    foldList.push(fold(FoldName.FallNest))
    return foldList
  }

  function castNestHead(
    link: FoldCallLink,
    foldList: Array<Fold> = [],
  ): Array<Fold> {
    loop: while (slot < link.list.length) {
      const seed = link.list[slot++]
      check: switch (seed?.form) {
        case TextName.TermSlot: {
          slot--
          foldList.push(...castTermSlot(link))
          break
        }
        case TextName.Link: {
          break
        }
        case TextName.Size: {
          foldList.push({
            ...seed,
            bond: parseInt(seed.text, 10),
            ...fold(FoldName.Size),
          })
          break
        }
        case TextName.SideSize: {
          foldList.push({
            ...seed,
            bond: parseInt(seed.text, 10),
            ...fold(FoldName.SideSize),
          })
          break
        }
        case TextName.RiseLine: {
          slot--
          foldList.push(...castLine(link))
          break
        }
        case TextName.Comb: {
          foldList.push({
            ...seed,
            bond: parseFloat(seed.text),
            ...fold(FoldName.Comb),
          })
          break
        }
        case TextName.Code: {
          const [hashtag, base = '', ...bond] = seed.text
          foldList.push({
            ...seed,
            bond: bond.join(''),
            base,
            ...fold(FoldName.Code),
          })
          break
        }
        case TextName.RiseText: {
          foldList.push(...castText(link))
          break
        }
        case TextName.RiseNick: {
          slot--
          foldList.push(...castTermSlot(link))
          break
        }
        default:
          slot--
          break loop
      }
    }

    return foldList
  }

  function castHold(
    link: FoldCallLink,
    foldList: Array<Fold> = [],
  ): Array<Fold> {
    let cullSize = 0
    loop: while (slot < link.list.length) {
      const seed = link.list[slot++]

      switch (seed?.form) {
        case TextName.RiseHold: {
          cullSize++
          foldList.push(fold(FoldName.RiseNest))
          castNestHead(link, foldList)
          break
        }
        case TextName.FallHold: {
          if (cullSize > 0) {
            foldList.push(fold(FoldName.FallNest))
            cullSize--
          } else {
            slot--
            break loop
          }
          break
        }
        // case TextName.TermSlot:
        // case TextName.Link:
        // case TextName.Size:
        // case TextName.SideSize:
        // case TextName.RiseLine:
        // case TextName.Comb:
        // case TextName.Code:
        // case TextName.RiseText:
        //   castNestHead(link, foldList)
        //   console.log('nest', link.list[slot])
        //   break
        default:
          slot--
          break loop
      }
    }
    return foldList
  }

  function castTermSlot(
    link: FoldCallLink,
    size = 0,
    fall = false,
  ): Array<Fold> {
    const list: Array<Fold> = []
    const tail: Array<Fold> = []

    let cullSize = 0
    let hasSeparator = false
    let hasIndex = false
    loop: while (slot < link.list.length) {
      const seed = link.list[slot++]
      check: switch (seed?.form) {
        case TextName.RiseHold: {
          slot--
          tail.push(...castHold(link))
          break
        }
        case TextName.TermSlot: {
          const slotList = makeTermSlotList(seed)
          const listNest: Array<Fold> = []

          slotList.forEach((slot, i) => {
            if (slot.bond) {
              listNest.push(slot)
            }

            if (i < slotList.length - 1) {
              hasSeparator = true
              listNest.push(fold(FoldName.FallTerm))
              listNest.push(fold(FoldName.RiseTerm))
            }
          })

          list.push(...listNest)

          break check
        }
        case TextName.RiseCull: {
          cullSize++
          hasIndex = true
          list.push(fold(FoldName.RiseCull))
          list.push(...castTermSlot(link, size + 1))
          break
        }
        case TextName.FallCull: {
          if (cullSize > 0) {
            list.push(fold(FoldName.FallCull))
            cullSize--
          } else {
            slot--
            break loop
          }
          break check
        }
        case TextName.RiseNick: {
          cullSize++
          list.push({
            size: seed.text.length,
            ...fold(FoldName.RiseNick),
          })
          list.push(...castTermSlot(link, size + 1))
          break check
        }
        case TextName.FallNick: {
          if (cullSize > 0) {
            list.push(fold(FoldName.FallNick))
            cullSize--
          } else {
            if (!fall) {
              slot--
              break loop
            }
          }
          break check
        }
        case TextName.RiseNest: {
          tail.push(...castNest(link))
          break loop
        }
        case TextName.Line: {
          const slotList = makeTermSlotList(seed)

          const listNest: Array<Fold> = []

          listNest.push(fold(FoldName.RiseTerm))
          slotList.forEach((slot, i) => {
            if (slot.bond) {
              listNest.push(slot)
            }

            if (i < slotList.length - 1) {
              hasSeparator = true
              listNest.push(fold(FoldName.FallTerm))
              listNest.push(fold(FoldName.RiseTerm))
            }
          })

          listNest.push(fold(FoldName.FallTerm))

          list.push(...listNest)
          break check
        }
        default:
          slot--
          break loop
      }
    }

    if (list[list.length - 1]?.form === FoldName.TermSlotLink) {
      list.pop()
    }

    const foldList: Array<Fold> = []

    if (hasIndex) {
      foldList.push(fold(FoldName.RiseTermLine))
      foldList.push(fold(FoldName.RiseTerm))

      list.forEach(x => {
        if (x.form === FoldName.RiseCull) {
          foldList.push(fold(FoldName.FallTerm))
        }
        foldList.push(x)
      })

      foldList.push(fold(FoldName.FallTermLine))
    } else if (hasSeparator) {
      foldList.push(fold(FoldName.RiseTermLine))
      foldList.push(fold(FoldName.RiseTerm))

      list.forEach(x => {
        foldList.push(x)
      })

      foldList.push(fold(FoldName.FallTerm))
      foldList.push(fold(FoldName.FallTermLine))
    } else {
      if (tail.length) {
        foldList.push(fold(FoldName.RiseHook))
      }
      foldList.push(fold(FoldName.RiseTerm))
      list.forEach(x => {
        foldList.push(x)
      })
      foldList.push(fold(FoldName.FallTerm))

      if (tail.length) {
        foldList.push(fold(FoldName.FallHook))
      }
    }

    foldList.push(...tail)

    return foldList
  }

  function makeTermSlotList(
    seed: TextText | TextLine | TextTermSlot,
  ): Array<FoldTermSlot> {
    const slotList = seed.text.split('/')

    return slotList.map((slot, i) => {
      const dive = Boolean(slot.match(/\*/))
      const soak = Boolean(slot.match(/\?/))
      const cull = Boolean(slot.match(/~/))
      const name = slot.replace(/[\*\~\?]/g, '')
      const upto = slotList.slice(0, i).join('').length
      const head = {
        mark: seed.rank.base.mark + upto + slot.length + i,
        line: seed.rank.base.line,
      }
      const base = {
        mark: seed.rank.base.mark + upto + i,
        line: seed.rank.base.line,
      }
      return {
        dive,
        soak,
        cull,
        rank: {
          head,
          base,
        },
        base: i > 0,
        bond: name,
        ...fold(FoldName.TermSlot),
        form: FoldName.TermSlot,
      }
    })
  }

  // console.log(logDirectionList(foldList))

  return cast
}
