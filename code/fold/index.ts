import _ from 'lodash'

import type {
  TextCallCast,
  TextText,
  TextLine,
  TextTermSlot,
} from '../text/index.js'
import { TextName } from '../text/index.js'

import { FoldName, Fold } from './form.js'
import type { FoldCallCast, FoldTermSlot } from './form.js'
import { generateInvalidWhitespaceError } from 'code/halt.js'

export * from './form.js'

export type FoldStateHandleType = (link: FoldCallLink) => void

export type FoldCallLink = TextCallCast

export type FoldStateType = {
  base: <T extends FoldName>(form: T) => { id: number; form: T }
  count: (form: FoldName) => number
  slot: number
  foldList: Array<FoldName>
  stack: Array<FoldName>
}

export default function makeFoldList(link: TextCallCast): FoldCallCast {
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

  while (slot < link.list.length) {
    const seed = link.list[slot]
    if (seed) {
      switch (seed.form) {
        case TextName.TermSlot: {
          lineHost = false
          foldList.push(...castTermSlot(link))
          break
        }
        case TextName.RiseSlot: {
          if (!lineHost) {
            throw generateInvalidWhitespaceError(link, slot)
          }
          textSlot++
          foldList.push(fold(FoldName.RiseNest))
          slot++
          break
        }
        case TextName.RiseNest: {
          code.throwError(code.generateInvalidWhitespaceError(link))
          break
        }
        case TextName.Line: {
          while (textSlot > 0) {
            foldList.push(fold(FoldName.FallNest))
            textSlot--
          }
          lineHost = true
          slot++
          break
        }
        case TextName.RiseNick:
          lineHost = false
          foldList.push(...castTermSlot(link, 0, true))
          break
        case TextName.FallCull:
        case TextName.FallNick:
        case TextName.FallHold:
        case TextName.FallText:
        case TextName.RiseCull:
        case TextName.RiseNest:
        case TextName.RiseHold:
        case TextName.RiseText:
        case TextName.Link: {
          code.throwError(
            code.generateInvalidCompilerStateError(
              `Uncastd text type ${seed.form}.`,
              link.path,
            ),
          )
        }
        case TextName.Note: {
          slot++
          lineHost = false
          break
        }

        case TextName.Size: {
          lineHost = false
          foldList.push({
            ...seed,
            bond: parseInt(seed.text, 10),
            ...fold(FoldName.Size),
          })
          slot++
          break
        }
        case TextName.SideSize: {
          lineHost = false
          foldList.push({
            ...seed,
            bond: parseInt(seed.text, 10),
            ...fold(FoldName.SideSize),
          })
          slot++
          break
        }
        case TextName.Comb: {
          lineHost = false
          foldList.push({
            ...seed,
            bond: parseFloat(seed.text),
            ...fold(FoldName.Comb),
          })
          slot++
          break
        }
        case TextName.RiseLine: {
          lineHost = false
          foldList.push(...castLine(link))
          break
        }
        case TextName.Code: {
          lineHost = false
          const [hash, base = '', ...bond] = seed.text
          foldList.push({
            ...seed,
            bond: bond.join(''),
            base,
            ...fold(FoldName.Code),
          })
          slot++
          break
        }
        default:
          lineHost = false
          slot++
          break
      }
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
    let list: Array<Fold> = []
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
          const list: Array<Fold> = []

          slotList.forEach((slot, i) => {
            if (slot.bond) {
              list.push(slot)
            }

            if (i < slotList.length - 1) {
              hasSeparator = true
              list.push(fold(FoldName.FallTerm))
              list.push(fold(FoldName.RiseTerm))
            }
          })

          list.push(...list)

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

          const list: Array<Fold> = []

          list.push(fold(FoldName.RiseTerm))
          slotList.forEach((slot, i) => {
            if (slot.bond) {
              list.push(slot)
            }

            if (i < slotList.length - 1) {
              hasSeparator = true
              list.push(fold(FoldName.FallTerm))
              list.push(fold(FoldName.RiseTerm))
            }
          })

          list.push(fold(FoldName.FallTerm))

          list.push(...list)
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

    // if (size === 0) {
    //   console.log(foldList)
    // }

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

  // console.log(foldList.map(x => `${x.form} => ${x.value}`))

  return {
    ...link,
    foldList,
  }
}
