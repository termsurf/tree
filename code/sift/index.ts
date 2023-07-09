import _ from 'lodash'

import type {
  LeafCallCast,
  LeafCode,
  LeafComb,
  LeafFallCull,
  LeafFallHold,
  LeafFallNick,
  LeafFallText,
  Leaf,
  LeafKnit,
  LeafLine,
  LeafLink,
  LeafRiseNick,
  LeafCord,
} from '../leaf/form.js'
import { LeafName } from '../leaf/form.js'
import { SiftName } from './form.js'
import type { SiftCallCast, Sift } from './form.js'
import { haveMesh } from '@tunebond/have'

export * from './form.js'

export type SiftCallLink = LeafCallCast

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
  seed?: Leaf
}

export default function makeSiftList(link: SiftCallLink): SiftCallCast {
  const siftList: Array<Sift> = [{ form: SiftName.RiseFork }]

  const cast = {
    ...link,
    siftList,
  }

  // console.log(link.list)

  function head(form: Form, seed?: Leaf) {
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

  let leaf: Leaf | undefined = link.head

  const line: Array<Array<Head>> = [[head(Form.Card)]]

  let textSlot = 0
  let needSlot = true
  // how far the start of the previous line is indented
  let baseLastTextSlot = 0

  const haltList = []

  if (leaf) {
    do {
      // console.log(leaf.form, leaf.text)

      switch (leaf.form) {
        case LeafName.RiseCull:
          headTextSlot()
          siftList.push({
            form: SiftName.RiseCull,
            leaf: leaf,
          })
          saveHead(head(Form.Cull, leaf), true)
          break
        case LeafName.FallCull:
          castFallCull(leaf)
          break
        case LeafName.RiseNick:
          castRiseNick(leaf)
          break
        case LeafName.FallNick:
          castFallNick(leaf)
          break
        case LeafName.RiseText:
          headTextSlot()
          saveHead(head(Form.Text), true)
          break
        case LeafName.FallText:
          castFallText(leaf)
          break
        case LeafName.RiseHold:
          saveHead(head(Form.Nest))
          siftList.push({
            form: SiftName.RiseNest,
          })
          break
        case LeafName.FallHold:
          castFallHold(leaf)
          break
        case LeafName.Link: {
          castLink(leaf)
          break
        }
        case LeafName.Note:
          break
        case LeafName.Comb:
          headTextSlot()
          castComb(leaf)
          break
        case LeafName.Code:
          headTextSlot()
          castCode(leaf)
          break
        case LeafName.Slot:
          // if (leaf.text.length !== 1) {
          //   haltList.push(new Error('Invalid spacing'))
          // }
          break
        // case LeafName.RiseSlot: {
        //   textSlot = leaf.text.length / 2
        //   if (textSlot % 2 !== 0) {
        //     haltList.push(new Error('Invalid spacing'))
        //     textSlot = Math.floor(textSlot)
        //   }
        //   break
        // }
        // case LeafName.FallSlot: {
        //   // lint warning, trailing whitepsace
        //   break
        // }
        case LeafName.SlotLine:
          textSlot = 0
          needSlot = true
          fallBond()
          break
        case LeafName.Cord:
          castCord(leaf)
          break
        case LeafName.Line:
          castLine(leaf)
          break
        // term templates
        case LeafName.Knit:
          castKnit(leaf)
          break
        case LeafName.Size:
          break
        default:
          break
      }
    } while ((leaf = leaf.head))
  }

  fallBond()

  function castCode(seed: LeafCode) {
    if (seed.text.match(/#(xbo)([0-9a-f]+)/i)) {
      const mold = RegExp.$1
      const bond = readCode(RegExp.$2)
      siftList.push({
        form: SiftName.Code,
        bond,
        mold,
        leaf: seed,
      })
    } else if (seed.text.match(/#(\d+)n(\w+)/)) {
      const mold = RegExp.$1
      const bond = parseInt(RegExp.$2, parseInt(mold, 10))
      siftList.push({
        form: SiftName.Code,
        bond,
        mold,
        leaf: seed,
      })
    } else {
      haltList.push(new Error('Invalid code'))
    }
  }

  function castComb(seed: LeafComb) {
    const bond = parseFloat(seed.text)
    if (Number.isNaN(bond)) {
      haltList.push(new Error('Invalid size'))
    }
    siftList.push({
      form: SiftName.Comb,
      bond,
      leaf: seed,
    })
  }

  function castCord(seed: LeafCord) {
    siftList.push({
      form: SiftName.Cord,
      leaf: seed,
    })
  }

  function castLine(seed: LeafLine) {
    siftList.push({
      form: SiftName.Cord,
      leaf: {
        form: LeafName.Cord,
        band: seed.band,
        text: seed.text,
        back: seed.back,
        head: seed.head,
      },
    })
  }

  function castFallCull(seed: LeafFallCull) {
    walk: while (true) {
      const { head, find } = readHead()
      // console.log('fall cull', head)
      switch (head?.form) {
        case Form.Knit:
          siftList.push({
            form: SiftName.FallKnit,
          })
          tossHead()
          break
        case Form.Tree:
          siftList.push({ form: SiftName.FallFork })
          tossHead()
          break
        case Form.Cull:
          siftList.push({
            leaf: seed,
            form: SiftName.FallCull,
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

  // console.log(siftList.slice(50))

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

  function castLink(seed: LeafLink) {
    const head = seed.head
    if (head) {
      if (head.form === LeafName.Slot) {
        if (head.text.length !== 1) {
          haltList.push(new Error('Invalid spacing'))
        }

        leaf = head
      }
    }
  }

  function castKnit(seed: LeafKnit) {
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

    const last = seed.back
    switch (last?.form) {
      case LeafName.Slot:
      case LeafName.SlotLine:
      case LeafName.Link:
      case LeafName.RiseCull:
      case LeafName.RiseNick:
      case undefined: {
        siftList.push({
          form: SiftName.RiseFork,
        })
        saveHead(head(Form.Tree))
        siftList.push({
          form: SiftName.RiseKnit,
        })
        saveHead(head(Form.Knit))
        break
      }
      default:
        // console.log(last)
        break
    }

    siftList.push({
      form: SiftName.Cord,
      leaf: {
        form: LeafName.Cord,
        band: seed.band,
        text: seed.text,
        back: seed.back,
        head: seed.head,
      },
    })
  }

  // console.log(show(cast.siftList))

  return cast

  function castRiseNick(seed: LeafRiseNick) {
    headTextSlot()
    saveHead(head(Form.Nick, seed), true)
    siftList.push({
      form: SiftName.RiseNick,
      leaf: seed,
      size: seed.text.length,
    })
  }

  function castFallText(seed: LeafFallText) {
    siftList.push({
      leaf: seed,
      form: SiftName.FallText,
    })
    tossHead()
  }

  function castFallHold(seed: LeafFallHold) {
    walk: while (true) {
      const { head, find } = readHead()
      switch (head?.form) {
        case Form.Nest:
          siftList.push({ form: SiftName.FallNest })
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

  function castFallNick(seed: LeafFallNick) {
    walk: while (true) {
      const { head, find } = readHead()
      switch (head?.form) {
        case Form.Knit:
          siftList.push({
            form: SiftName.FallKnit,
          })
          tossHead()
          break
        case Form.Tree:
          siftList.push({ form: SiftName.FallFork })
          tossHead()
          break
        case Form.Nick:
          siftList.push({
            leaf: seed,
            form: SiftName.FallNick,
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
          siftList.push({
            form: SiftName.FallFork,
          })
          tossHead(true)
          break
        case Form.Knit:
          siftList.push({
            form: SiftName.FallKnit,
          })
          tossHead(true)
          break
        case Form.Nick:
          haveMesh(head.seed, 'seed')
          if (head.seed.form === LeafName.FallNick) {
            siftList.push({
              form: SiftName.FallNick,
              leaf: head.seed,
            })
          }
          tossHead(true)
          break
        case Form.Cull:
          haveMesh(head.seed, 'seed')
          if (head.seed.form === LeafName.FallCull) {
            siftList.push({
              form: SiftName.FallCull,
              leaf: head.seed,
            })
          }
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
          siftList.push({ form: SiftName.FallNest })
          diff--
        }
      }
    }
  }
}
