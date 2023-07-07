import _ from 'lodash'

import type {
  Mark,
  MarkCallCast,
  MarkCode,
  MarkComb,
  MarkFallCull,
  MarkFallHold,
  MarkFallNick,
  MarkFallText,
  MarkKnit,
  MarkLine,
  MarkLink,
  MarkRiseNick,
  MarkText,
} from '../list/form.js'
import { MarkName } from '../list/form.js'
import { FoldName } from './form.js'
import type { FoldCallCast, Fold } from './form.js'
import { haveMesh } from '@tunebond/have'
import show from './show.js'

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
  seed?: Mark
}

export default function makeFoldList(link: FoldCallLink): FoldCallCast {
  const foldList: Array<Fold> = [{ form: FoldName.RiseTree }]

  const cast = {
    ...link,
    foldList,
  }

  // console.log(link.list)

  function head(form: Form, seed?: Mark) {
    return { form, seed }
  }

  function saveHead(head: Head, list = false) {
    if (list) {
      line.push([head])
    } else {
      const last = line[line.length - 1]
      last?.push(head)
    }
  }

  let slot = 0

  const line: Array<Array<Head>> = [[head(Form.Card)]]

  let textSlot = 0
  let needSlot = true
  // how far the start of the previous line is indented
  let baseLastTextSlot = 0

  const haltList = []

  while (slot < link.list.length) {
    const seed = link.list[slot++]
    haveMesh(seed, 'seed')

    console.log(seed.form, seed.text)

    switch (seed.form) {
      case MarkName.RiseCull:
        headTextSlot()
        foldList.push({
          form: FoldName.RiseCull,
          text: seed.text,
          rank: seed.rank,
        })
        saveHead(head(Form.Cull, seed), true)
        break
      case MarkName.FallCull:
        castFallCull(seed)
        break
      case MarkName.RiseNick:
        castRiseNick(seed)
        break
      case MarkName.FallNick:
        castFallNick(seed)
        break
      case MarkName.RiseText:
        headTextSlot()
        saveHead(head(Form.Text), true)
        break
      case MarkName.FallText:
        castFallText(seed)
        break
      case MarkName.RiseHold:
        saveHead(head(Form.Nest))
        foldList.push({
          form: FoldName.RiseNest,
        })
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
        // if (seed.text.length !== 1) {
        //   haltList.push(new Error('Invalid spacing'))
        // }
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
        fallBond()
        break
      case MarkName.Text:
        castText(seed)
        break
      case MarkName.Line:
        castLine(seed)
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

  fallBond()

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

  function castLine(seed: MarkLine) {
    foldList.push({
      form: FoldName.Text,
      bond: seed.text,
      rank: seed.rank,
    })
  }

  function castFallCull(seed: MarkFallCull) {
    walk: while (true) {
      const { head, find } = readHead()
      // console.log('fall cull', head)
      switch (head?.form) {
        case Form.Knit:
          foldList.push({
            form: FoldName.FallKnit,
          })
          tossHead()
          break
        case Form.Tree:
          foldList.push({ form: FoldName.FallTree })
          tossHead()
          break
        case Form.Cull:
          foldList.push({
            text: seed.text,
            rank: seed.rank,
            form: FoldName.FallCull,
          })
          tossHead()
          break
        default:
          break walk
      }

      if (!find) {
        break walk
      }
    }

    tossHead()
  }

  if (haltList.length) {
    // console.log(haltList)
  }

  console.log(foldList.slice(50))

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
      case MarkName.LineSlot:
      case MarkName.RiseSlot:
      case MarkName.Link:
      case MarkName.RiseCull:
      case MarkName.RiseNick:
      case undefined: {
        foldList.push({
          form: FoldName.RiseTree,
        })
        saveHead(head(Form.Tree))
        foldList.push({
          form: FoldName.RiseKnit,
        })
        saveHead(head(Form.Knit))
        break
      }
      default:
        // console.log(last)
        break
    }

    foldList.push({
      form: FoldName.Text,
      bond: seed.text,
      rank: seed.rank,
    })
  }

  console.log(show(cast.foldList))

  return cast

  function castRiseNick(seed: MarkRiseNick) {
    headTextSlot()
    saveHead(head(Form.Nick, seed), true)
    foldList.push({
      form: FoldName.RiseNick,
      text: seed.text,
      rank: seed.rank,
      size: seed.text.length,
    })
  }

  function castFallText(seed: MarkFallText) {
    foldList.push({
      text: seed.text,
      rank: seed.rank,
      form: FoldName.FallText,
    })
    tossHead()
  }

  function castFallHold(seed: MarkFallHold) {
    walk: while (true) {
      const { head, find } = readHead()
      switch (head?.form) {
        case Form.Nest:
          foldList.push({ form: FoldName.FallNest })
          tossHead()
          break
        default:
          break walk
      }

      if (!find) {
        break walk
      }
    }
  }

  function readMark(move = 1) {
    return link.list[slot + move - 1]
  }

  function readHead(fill = false) {
    const list = line[line.length - 1]
    if (list) {
      const head = list[list.length - 1]
      const find = list.length > 1
      if (!head) {
        line.pop()
      }
      if (!head && fill) {
        const list = line[line.length - 1]
        if (list) {
          const head = list[list.length - 1]
          const find = list.length > 1
          return { head, find }
        }
      }
      return { head, find }
    }
    return {}
  }

  function tossHead(fill = false) {
    const list = line[line.length - 1]
    // console.log(fill,line)
    if (list) {
      const last = list[list.length - 1]
      if (last) {
        list.pop()
      } else if (!last && fill) {
        line.pop()
        const list = line[line.length - 1]
        if (list) {
          list.pop()
          if (!list.length) {
            line.pop()
          }
        }
      } else {
        list.pop()
        if (!list.length) {
          line.pop()
        }
      }
    }
  }

  function castFallNick(seed: MarkFallNick) {
    walk: while (true) {
      const { head, find } = readHead()
      switch (head?.form) {
        case Form.Knit:
          foldList.push({
            form: FoldName.FallKnit,
          })
          tossHead()
          break
        case Form.Tree:
          foldList.push({ form: FoldName.FallTree })
          tossHead()
          break
        case Form.Nick:
          foldList.push({
            text: seed.text,
            rank: seed.rank,
            form: FoldName.FallNick,
          })
          tossHead()
          break
        default:
          break walk
      }
      if (!find) {
        break walk
      }
    }

    tossHead()
  }

  // // close the parentheses
  function fallBond() {
    walk: while (true) {
      const { head, find } = readHead(true)
      switch (head?.form) {
        case Form.Tree:
          foldList.push({
            form: FoldName.FallTree,
          })
          tossHead(true)
          break
        case Form.Knit:
          foldList.push({
            form: FoldName.FallKnit,
          })
          tossHead(true)
          break
        case Form.Nick:
          haveMesh(head.seed, 'seed')
          foldList.push({
            form: FoldName.FallNick,
            rank: head.seed.rank,
            text: head.seed.text,
          })
          tossHead(true)
          break
        case Form.Cull:
          haveMesh(head.seed, 'seed')
          foldList.push({
            form: FoldName.FallCull,
            rank: head.seed.rank,
            text: head.seed.text,
          })
          tossHead(true)
          break
        case Form.Card:
          break walk
        default:
          break
      }
      if (!find) {
        break walk
      }
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
        while (diff > 0) {
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
