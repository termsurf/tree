import _ from 'lodash'

import type {
  MarkCallCast,
  MarkCode,
  MarkComb,
  MarkFallHold,
  MarkFallNick,
  MarkFallText,
  MarkKnit,
  MarkLink,
  MarkRiseNick,
  MarkText,
} from '../mark/index.js'
import { MarkName } from '../mark/index.js'
import { FoldName } from './form.js'
import type { FoldCallCast, Fold } from './form.js'
import { haveMesh } from '@tunebond/have'

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
  const foldList: Array<Fold> = [{ form: FoldName.RiseTree }]

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
        headTextSlot()
        castComb(seed)
        break
      case MarkName.Code:
        headTextSlot()
        castCode(seed)
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
          textSlot = Math.floor(textSlot)
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
        castText(seed)
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

  function castCode(seed: MarkCode) {
    if (seed.text.match(/#(xbo)([0-9a-f]+)/i)) {
      const mold = RegExp.$1
      const bond = readCode(RegExp.$2)
      foldList.push({
        form: FoldName.Code,
        bond,
        mold,
        rank: seed.rank,
      })
    } else if (seed.text.match(/#(\d+)n(\w+)/)) {
      const mold = RegExp.$1
      const bond = parseInt(RegExp.$2, parseInt(mold, 10))
      foldList.push({
        form: FoldName.Code,
        bond,
        mold,
        rank: seed.rank,
      })
    } else {
      haltList.push(new Error('Invalid code'))
    }
  }

  function castComb(seed: MarkComb) {
    const bond = parseFloat(seed.text)
    if (Number.isNaN(bond)) {
      haltList.push(new Error('Invalid size'))
    }
    foldList.push({
      form: FoldName.Size,
      bond,
      rank: seed.rank,
    })
  }

  function castText(seed: MarkText) {
    foldList.push({
      form: FoldName.Text,
      bond: seed.text,
      rank: seed.rank,
    })
  }

  function readCode(mold: string) {
    switch (mold) {
      case 'b':
        return parseInt(mold, 2)
      case 'o':
        return parseInt(mold, 8)
      case 'x':
      default:
        return parseInt(mold, 16)
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

    const last = readMark(-1)
    switch (last?.form) {
      case MarkName.Slot:
      case undefined: {
        foldList.push({
          form: FoldName.RiseTree,
        })
        foldList.push({
          form: FoldName.Knit,
        })
        break
      }
      default:
        break
    }

    foldList.push({
      form: FoldName.Text,
      bond: seed.text,
      rank: seed.rank,
    })
  }

  return cast

  function castRiseNick(seed: MarkRiseNick) {
    headTextSlot()
    line.push(head(Form.Nick))
  }

  function castFallText(seed: MarkFallText) {
    foldList.push({
      text: seed.text,
      rank: seed.rank,
      form: FoldName.FallText,
    })
    line.pop()
  }

  function castFallHold(seed: MarkFallHold) {
    walk: while (true) {
      const head = readHead()
      switch (head?.form) {
        case Form.Nest:
          foldList.push({ form: FoldName.FallNest })
          line.pop()
          break
        default:
          break walk
      }
    }
  }

  function readMark(move = 1) {
    return link.list[slot + move]
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
            form: FoldName.FallNick,
          })
          line.pop()
          break
        case Form.Knit:
          foldList.push({
            form: FoldName.FallTree,
          })
          line.pop()
          break
        case Form.Tree:
          foldList.push({ form: FoldName.FallTree })
          line.pop()
          break
        default:
          break walk
      }
    }
  }

  // // close the parentheses
  // function haltBond() {
  //   const last = line[line.length - 1]
  //   switch (last?.form) {
  //     case Form.Nick:
  //       foldList.push({
  //         form: FoldName.FallNick,
  //       })
  //       break
  //     default:
  //       break
  //   }
  // }

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
          foldList.push({ form: FoldName.FallNest })
          diff--
        }
      }
    }
  }
}

function makeTextMove(move: number) {
  return new Array(move + 1).join('  ')
}
