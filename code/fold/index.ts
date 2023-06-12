import _ from 'lodash'

import type {
  Mark,
  MarkCallCast,
  MarkFallHold,
  MarkFallNick,
  MarkFallText,
  MarkKnit,
  MarkLink,
  MarkRiseNick,
} from '../mark/index.js'
import { MarkName } from '../mark/index.js'
import { FoldName } from './form.js'
import type { FoldCallCast, Fold } from './form.js'
import { haveMesh, haveWave } from '@tunebond/have'

export * from './form.js'

export type FoldCallLink = MarkCallCast

enum Form {
  Card = 'card',
  Knit = 'knit',
  Text = 'text',
  Nick = 'nick',
  Cull = 'cull',
  Nest = 'nest',
  Line = 'line',
  Tree = 'tree',
}

type Head = {
  form: Form
  nest: number
}

export default function makeFoldList(link: FoldCallLink): FoldCallCast {
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

  const foldList: Array<Fold | Mark> = [fold(FoldName.RiseTree)]

  const cast = {
    ...link,
    foldList,
  }

  function head(form: Form, nest = 0) {
    return { form, nest }
  }

  let slot = 0

  const line: Array<Head> = [head(Form.Card)]

  let textSlot = 0
  let needSlot = true
  // how far the start of the previous line is indented
  let baseLastTextSlot = 0

  const haltList = []

  while (slot < link.list.length) {
    const seed = link.list[slot++]
    haveMesh(seed, 'seed')

    switch (seed.form) {
      case MarkName.RiseCull:
        headTextSlot()
        line.push(head(Form.Cull))
        break
      case MarkName.FallCull:
        line.pop()
        break
      case MarkName.RiseNick:
        castRiseNick(seed)
        break
      case MarkName.FallNick:
        castFallNick(seed)
        break
      case MarkName.RiseText:
        headTextSlot()
        line.push(head(Form.Text))
        break
      case MarkName.FallText:
        castFallText(seed)
        break
      case MarkName.RiseHold:
        line.push(head(Form.Nest))
        break
      case MarkName.FallHold:
        castFallHold(seed)
        break
      case MarkName.Link: {
        castLink(seed)
        break
      }
      case MarkName.Note:
        break
      case MarkName.Comb:
        break
      case MarkName.Code:
        break
      case MarkName.Slot:
        if (seed.text.length !== 1) {
          haltList.push(new Error('Invalid spacing'))
        }
        break
      case MarkName.RiseSlot: {
        textSlot = seed.text.length / 2
        if (textSlot % 2 !== 0) {
          haltList.push(new Error('Invalid spacing'))
        }
        break
      }
      case MarkName.FallSlot: {
        // lint warning, trailing whitepsace
        break
      }
      case MarkName.LineSlot:
        textSlot = 0
        needSlot = true
        break
      case MarkName.Text:
        break
      // term templates
      case MarkName.Knit:
        castKnit(seed)
        break
      case MarkName.Size:
        break
      default:
        break
    }
  }

  function castLink(seed: MarkLink) {
    const headMark = readMark()
    if (headMark) {
      if (headMark.form === MarkName.Slot) {
        if (headMark.text.length !== 1) {
          haltList.push(new Error('Invalid spacing'))
        }

        slot++
      }
    }
  }

  function castKnit(seed: MarkKnit) {
    headTextSlot()

    if (seed.text.match(/\/{2,}/)) {
      haltList.push(new Error('Invalid path'))
    }
    if (!seed.text.match(/^[0-9a-z-\/]+$/)) {
      haltList.push(new Error('Invalid term characters'))
    }
    if (!seed.text.match(/^[a-z]/)) {
      haltList.push(new Error('Term must start with a-z'))
    }

    foldList.push({
      text: seed.text,
      rank: seed.rank,
      form: FoldName.Knit,
    })
  }

  function castRiseNick(seed: MarkRiseNick) {
    headTextSlot()
    line.push(head(Form.Nick))
  }

  function castFallText(seed: MarkFallText) {
    foldList.push({
      text: seed.text,
      rank: seed.rank,
      ...fold(FoldName.FallText),
    })
    line.pop()
  }

  function castFallHold(seed: MarkFallHold) {
    walk: while (true) {
      const head = readHead()
      switch (head?.form) {
        case Form.Nest:
          foldList.push(fold(FoldName.FallNest))
          line.pop()
          break
        default:
          break walk
      }
    }
  }

  return cast

  function readMark() {
    return link.list[slot + 1]
  }

  function readHead() {
    return line[line.length - 1]
  }

  function castFallNick(seed: MarkFallNick) {
    walk: while (true) {
      const head = readHead()
      switch (head?.form) {
        case Form.Nick:
          foldList.push({
            text: seed.text,
            rank: seed.rank,
            ...fold(FoldName.FallNick),
          })
          line.pop()
          break
        case Form.Knit:
          foldList.push({
            text: seed.text,
            rank: seed.rank,
            ...fold(FoldName.Knit),
          })
          line.pop()
          break
        case Form.Tree:
          foldList.push(fold(FoldName.FallTree))
          line.pop()
          break
        default:
          break walk
      }
    }
  }

  // close the parentheses
  function haltBond() {
    const last = line[line.length - 1]
    switch (last?.form) {
      case Form.Nick:
        foldList.push(fold(FoldName.FallNick))
        break
      default:
        break
    }
  }

  function haltBondLine() {}

  function headTextSlot() {
    if (needSlot) {
      needSlot = false

      if (textSlot > baseLastTextSlot) {
        if (textSlot > baseLastTextSlot + 1) {
          haltList.push(new Error(`Too much indentation`))
        } else {
          // don't have to do anything
        }
      } else {
        let diff = baseLastTextSlot - textSlot - 1
        while (diff) {
          foldList.push(fold(FoldName.FallNest))
          diff--
        }
      }
    }
  }
}

function makeTextMove(move: number) {
  return new Array(move + 1).join('  ')
}
