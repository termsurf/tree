import _ from 'lodash'

import type {
  CallCast,
  Code,
  Comb,
  FallCull,
  FallHold,
  FallNick,
  FallText,
  Hunk,
  Knit,
  Line,
  Link,
  RiseNick,
  Text,
} from '../list/form.js'
import { Name } from '../list/form.js'
import { SiftName } from './form.js'
import type { SiftCallCast, Sift } from './form.js'
import { haveMesh } from '@tunebond/have'
import show from './show.js'

export * from './form.js'

export type SiftCallLink = CallCast

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
  seed?: Hunk
}

export default function makeSiftList(link: SiftCallLink): SiftCallCast {
  const siftList: Array<Sift> = [{ form: SiftName.RiseTree }]

  const cast = {
    ...link,
    siftList,
  }

  // console.log(link.list)

  function head(form: Form, seed?: Hunk) {
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

  let hunk: Hunk | undefined = link.head

  const line: Array<Array<Head>> = [[head(Form.Card)]]

  let textSlot = 0
  let needSlot = true
  // how far the start of the previous line is indented
  let baseLastTextSlot = 0

  const haltList = []

  if (hunk) {
    do {
      console.log(hunk.form, hunk.text)

      switch (hunk.form) {
        case Name.RiseCull:
          headTextSlot()
          siftList.push({
            form: SiftName.RiseCull,
            text: hunk.text,
            band: hunk.band,
          })
          saveHead(head(Form.Cull, hunk), true)
          break
        case Name.FallCull:
          castFallCull(hunk)
          break
        case Name.RiseNick:
          castRiseNick(hunk)
          break
        case Name.FallNick:
          castFallNick(hunk)
          break
        case Name.RiseText:
          headTextSlot()
          saveHead(head(Form.Text), true)
          break
        case Name.FallText:
          castFallText(hunk)
          break
        case Name.RiseHold:
          saveHead(head(Form.Nest))
          siftList.push({
            form: SiftName.RiseNest,
          })
          break
        case Name.FallHold:
          castFallHold(hunk)
          break
        case Name.Link: {
          castLink(hunk)
          break
        }
        case Name.Note:
          break
        case Name.Comb:
          headTextSlot()
          castComb(hunk)
          break
        case Name.Code:
          headTextSlot()
          castCode(hunk)
          break
        case Name.Slot:
          // if (hunk.text.length !== 1) {
          //   haltList.push(new Error('Invalid spacing'))
          // }
          break
        // case Name.RiseSlot: {
        //   textSlot = hunk.text.length / 2
        //   if (textSlot % 2 !== 0) {
        //     haltList.push(new Error('Invalid spacing'))
        //     textSlot = Math.floor(textSlot)
        //   }
        //   break
        // }
        // case Name.FallSlot: {
        //   // lint warning, trailing whitepsace
        //   break
        // }
        case Name.SlotLine:
          textSlot = 0
          needSlot = true
          fallBond()
          break
        case Name.Text:
          castText(hunk)
          break
        case Name.Line:
          castLine(hunk)
          break
        // term templates
        case Name.Knit:
          castKnit(hunk)
          break
        case Name.Size:
          break
        default:
          break
      }
    } while ((hunk = hunk.head))
  }

  fallBond()

  function castCode(seed: Code) {
    if (seed.text.match(/#(xbo)([0-9a-f]+)/i)) {
      const mold = RegExp.$1
      const bond = readCode(RegExp.$2)
      siftList.push({
        form: SiftName.Code,
        bond,
        mold,
        band: seed.band,
      })
    } else if (seed.text.match(/#(\d+)n(\w+)/)) {
      const mold = RegExp.$1
      const bond = parseInt(RegExp.$2, parseInt(mold, 10))
      siftList.push({
        form: SiftName.Code,
        bond,
        mold,
        band: seed.band,
      })
    } else {
      haltList.push(new Error('Invalid code'))
    }
  }

  function castComb(seed: Comb) {
    const bond = parseFloat(seed.text)
    if (Number.isNaN(bond)) {
      haltList.push(new Error('Invalid size'))
    }
    siftList.push({
      form: SiftName.Size,
      bond,
      band: seed.band,
    })
  }

  function castText(seed: Text) {
    siftList.push({
      form: SiftName.Text,
      bond: seed.text,
      band: seed.band,
    })
  }

  function castLine(seed: Line) {
    siftList.push({
      form: SiftName.Text,
      bond: seed.text,
      band: seed.band,
    })
  }

  function castFallCull(seed: FallCull) {
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
          siftList.push({ form: SiftName.FallTree })
          tossHead()
          break
        case Form.Cull:
          siftList.push({
            text: seed.text,
            band: seed.band,
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

  console.log(siftList.slice(50))

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

  function castLink(seed: Link) {
    const head = seed.head
    if (head) {
      if (head.form === Name.Slot) {
        if (head.text.length !== 1) {
          haltList.push(new Error('Invalid spacing'))
        }

        hunk = head
      }
    }
  }

  function castKnit(seed: Knit) {
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
      case Name.Slot:
      case Name.SlotLine:
      case Name.Link:
      case Name.RiseCull:
      case Name.RiseNick:
      case undefined: {
        siftList.push({
          form: SiftName.RiseTree,
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
      form: SiftName.Text,
      bond: seed.text,
      band: seed.band,
    })
  }

  console.log(show(cast.siftList))

  return cast

  function castRiseNick(seed: RiseNick) {
    headTextSlot()
    saveHead(head(Form.Nick, seed), true)
    siftList.push({
      form: SiftName.RiseNick,
      text: seed.text,
      band: seed.band,
      size: seed.text.length,
    })
  }

  function castFallText(seed: FallText) {
    siftList.push({
      text: seed.text,
      band: seed.band,
      form: SiftName.FallText,
    })
    tossHead()
  }

  function castFallHold(seed: FallHold) {
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

  function castFallNick(seed: FallNick) {
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
          siftList.push({ form: SiftName.FallTree })
          tossHead()
          break
        case Form.Nick:
          siftList.push({
            text: seed.text,
            band: seed.band,
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
            form: SiftName.FallTree,
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
          siftList.push({
            form: SiftName.FallNick,
            band: head.seed.band,
            text: head.seed.text,
          })
          tossHead(true)
          break
        case Form.Cull:
          haveMesh(head.seed, 'seed')
          siftList.push({
            form: SiftName.FallCull,
            band: head.seed.band,
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
          siftList.push({ form: SiftName.FallNest })
          diff--
        }
      }
    }
  }
}

function makeTextMove(move: number) {
  return new Array(move + 1).join('  ')
}
