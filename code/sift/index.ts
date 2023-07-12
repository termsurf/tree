import _ from 'lodash'

import type {
  LeafCallCast,
  LeafCode,
  LeafComb,
  LeafFallHold,
  LeafFallNick,
  LeafFallText,
  Leaf,
  LeafKnit,
  LeafLink,
  LeafRiseNick,
  LeafCord,
  LeafRiseText,
  LeafSlot,
  LeafSize,
  LeafRiseHold,
} from '../leaf/form.js'
import { LeafName } from '../leaf/form.js'
import { SiftName } from './form.js'
import type { SiftCallCast, Sift } from './form.js'
import show from './show.js'

export * from './form.js'

export type SiftCallLink = LeafCallCast

enum Form {
  Card = 'card',
  Knit = 'knit',
  Text = 'text',
  Nick = 'nick',
  Line = 'line',
  Fork = 'fork',
  Nest = 'nest',
}

type ReadNote = {
  tick: number
  line?: boolean
  have: boolean
}

type Head = {
  form: Form
  seed?: Leaf
}

export default function makeSiftList(link: SiftCallLink): SiftCallCast {
  const siftList: Array<Sift> = []

  const cast = {
    ...link,
    siftList,
  }

  // console.log(link.list)

  function makeHead(form: Form, seed?: Leaf) {
    return { form, seed }
  }

  function saveHead(head: Head) {
    headList.push(head)
  }

  function readHead() {
    return headList[headList.length - 1]
  }

  function tossHead() {
    headList.pop()
  }

  let leaf: Leaf | undefined = link.head

  const headList: Array<Head> = [makeHead(Form.Card)]
  const readNoteList: Array<ReadNote> = [
    {
      tick: 0,
      have: true,
      line: true,
    },
  ]

  let textSlot = 0
  let slotLine = true
  // how far the start of the previous line is indented
  let lastTick = 0

  const haltList = []

  function saveReadNote(move = 0) {
    readNoteList.push({
      tick: lastTick + move,
      have: true,
      line: true,
    })
  }

  function tossReadNote() {
    const readNote = loadReadNote()
    if (readNote.line) {
      if (readNote.tick !== lastTick) {
        haltList.push(`Invalid indentation`)
      }
    }
    readNoteList.pop()
  }

  // function saveReadNoteLine(bond: boolean) {
  //   const last = loadReadNote()
  //   if (last) {
  //     last.line = bond
  //   }
  // }

  // function saveReadNoteHave(bond: boolean) {
  //   const last = loadReadNote()
  //   if (last) {
  //     last.have = bond
  //   }
  // }

  function loadReadNote() {
    return readNoteList[readNoteList.length - 1] as ReadNote
  }

  if (leaf) {
    do {
      // console.log(leaf.form, leaf.text)

      switch (leaf.form) {
        case LeafName.RiseNick:
          castRiseNick(leaf)
          break
        case LeafName.FallNick:
          castFallNick(leaf)
          break
        case LeafName.RiseText:
          slotLine = false
          castRiseText(leaf)
          break
        case LeafName.FallText:
          castFallText(leaf)
          break
        case LeafName.RiseHold:
          castRiseHold(leaf)
          break
        case LeafName.FallHold:
          castFallHold(leaf)
          break
        case LeafName.Link: {
          castLink(leaf)
          break
        }
        case LeafName.Note:
          slotLine = false
          break
        case LeafName.Comb:
          slotLine = false
          castComb(leaf)
          break
        case LeafName.Code:
          slotLine = false
          castCode(leaf)
          break
        case LeafName.Slot:
          castSlot(leaf)
          break
        case LeafName.SlotLine:
          fallBond()
          textSlot = 0
          slotLine = true
          break
        case LeafName.Cord:
          slotLine = false
          castCord(leaf)
          break
        // term templates
        case LeafName.Knit:
          slotLine = false
          castKnit(leaf)
          break
        case LeafName.Size:
          slotLine = false
          castSize(leaf)
          break
        default:
          break
      }
    } while ((leaf = leaf.head))
  }

  fallBond()

  // siftList.push({ form: SiftName.FallNest })

  // console.log(show(cast.siftList))
  // process.exit()

  return cast

  /**
   * Handle if it's the first item in the line.
   *
   * Call this for every _content_ node (i.e. not punctuation).
   */

  function testBaseLine() {
    const readNote = loadReadNote()
    // if we are the first item on a new line...
    if (slotLine) {
      slotLine = false

      // we started on the same line as the opening context
      // so no indentation allowed then.
      if (readNote.line === false) {
        haltList.push(new Error('Invalid indentation'))
      } else {
        // we are multiple lines
        readNote.line = true
      }

      // if the content is not one greater
      // than the context wrapper indentation,
      // then that's an issue.
      if (lastTick < readNote.tick + 1) {
        haltList.push(new Error('Invalid indentation'))
      }

      // otherwise we are not in a new line.
    } else {
      // if we are the first item
      if (!readNote.have) {
        readNote.line = false
      }
    }

    readNote.have = true
  }

  function castRiseHold(seed: LeafRiseHold) {
    const head = readHead()

    if (head?.form === Form.Knit) {
      tossHead()
      siftList.push({
        form: SiftName.FallKnit,
      })
    }

    // saveHead(makeHead(Form.Nest))
    // siftList.push({
    //   form: SiftName.RiseNest,
    // })
  }

  function castSlot(seed: LeafSlot) {
    // close the knit, if present
    walk: while (true) {
      const head = readHead()

      switch (head?.form) {
        case Form.Knit:
          siftList.push({
            form: SiftName.FallKnit,
          })
          tossHead()
          break
        default:
          break walk
      }
    }

    if (slotLine) {
      slotLine = false

      const readNote = loadReadNote()

      let tick = Math.floor(seed.text.length / 2)

      if (seed.text.length % 2 !== 0) {
        haltList.push(new Error('Invalid indentation'))
        // try fixing the code and seeing what happens
        tick = readNote.tick + 1
      } else if (tick > lastTick + 1) {
        haltList.push(new Error('Invalid indentation'))
        // try fixing the code and seeing what happens
        tick = lastTick + 1
      } else if (tick < readNote.tick) {
        haltList.push(new Error('Invalid indentation'))
        // try fixing the code and seeing what happens
        tick = readNote.tick + 1
      }

      let diff = tick - readNote.tick

      while (diff-- > 0) {
        saveHead(makeHead(Form.Nest))

        siftList.push({
          form: SiftName.RiseNest,
          // TODO: add new leaf here
        })
      }

      lastTick = tick
    } else {
      // saveHead(makeHead(Form.Nest))
      // siftList.push({
      //   form: SiftName.RiseNest,
      //   // TODO: add new leaf here
      // })
    }
  }

  function castRiseText(seed: LeafRiseText) {
    saveReadNote(1)
    saveHead(makeHead(Form.Text))
    siftList.push({
      form: SiftName.RiseText,
      leaf: seed,
    })
    const readNote = loadReadNote()
    if (tailSlot(seed)) {
      readNote.line = true
    } else {
      readNote.line = false
    }
  }

  function tailSlot(seed: Leaf): boolean {
    if (seed.head) {
      if (seed.head.form === LeafName.Cord) {
        return Boolean(seed.head.text.match(/^\s*\n$/))
      }
    }
    return false
  }

  function castFallText(seed: LeafFallText) {
    siftList.push({
      leaf: seed,
      form: SiftName.FallText,
    })
    tossHead()
    tossReadNote()
  }

  function castCode(seed: LeafCode) {
    testBaseLine()

    if (seed.text.match(/#([xbo])([0-9a-f]+)/i)) {
      const mold = RegExp.$1
      const bond = readCode(mold, RegExp.$2)
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
    testBaseLine()

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
    const readNote = loadReadNote()

    if (readNote.line) {
      // TODO: create a new seed
      // remove the indentation
      seed.text = seed.text.slice(readNote.tick * 2).trimEnd()
    }

    const last = siftList[siftList.length - 1]

    // merge with last to keep things cleaner
    // keep multiline
    if (last?.form === SiftName.Cord && readNote.line) {
      if (seed.text) {
        if (last.leaf.text) {
          if (last.leaf.text.endsWith('\n')) {
            last.leaf.text = `${last.leaf.text}${seed.text}`
          } else {
            last.leaf.text = `${last.leaf.text} ${seed.text}`
          }
        } else {
          last.leaf.text = seed.text
        }
      } else if (seed.head && seed.head.form === LeafName.Cord) {
        last.leaf.text += '\n\n'
      }
    } else {
      siftList.push({
        form: SiftName.Cord,
        leaf: seed,
      })
    }
  }

  function castSize(seed: LeafSize) {
    testBaseLine()

    siftList.push({
      form: SiftName.Size,
      leaf: seed,
      bond: parseInt(seed.text),
    })
  }

  function readCode(mold: string, bond: string) {
    switch (mold) {
      case 'b':
        return parseInt(bond, 2)
      case 'o':
        return parseInt(bond, 8)
      case 'x':
      default:
        return parseInt(bond, 16)
    }
  }

  /**
   * Handle the comma in Link Text.
   */

  function castLink(seed: LeafLink) {
    const head = seed.head
    if (head) {
      if (head.form !== LeafName.Slot) {
        haltList.push(new Error('Invalid character'))
      } else {
        if (head.text.length !== 1) {
          haltList.push(new Error('Invalid spacing'))
        }
      }
    }

    // close potential open knit.
    const find = readHead()
    switch (find?.form) {
      case Form.Knit: {
        castFallKnit()
        castFallFork()
        break
      }
      default:
        break
    }
  }

  function castFallFork() {
    tossHead()
    siftList.push({
      form: SiftName.FallFork,
    })
  }

  function castFallKnit() {
    tossHead()
    siftList.push({
      form: SiftName.FallKnit,
    })
  }

  function castKnit(seed: LeafKnit) {
    castRiseKnit(seed)

    if (seed.text.match(/\/{2,}/)) {
      haltList.push(new Error('Invalid knit'))
    } else if (!seed.text.match(/^[0-9a-z-\/]+$/)) {
      haltList.push(new Error('Invalid knit'))
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

  function castRiseKnit(seed: LeafKnit) {
    const last = seed.back
    switch (last?.form) {
      case LeafName.SlotLine:
      case LeafName.Link:
      case LeafName.RiseNick:
      case LeafName.RiseHold:
      case LeafName.Slot:
      case undefined: {
        siftList.push({
          form: SiftName.RiseFork,
        })
        saveHead(makeHead(Form.Fork))
        break
      }
      default:
        break
    }

    switch (last?.form) {
      case LeafName.Slot:
      case LeafName.SlotLine:
      case LeafName.Link:
      case LeafName.RiseNick:
      case LeafName.RiseHold:
      case undefined: {
        testBaseLine()
        siftList.push({
          form: SiftName.RiseKnit,
        })
        saveHead(makeHead(Form.Knit))
        break
      }
      default:
        break
    }
  }

  function castRiseNick(seed: LeafRiseNick) {
    switch (seed.back?.form) {
      // we are starting a fresh interpolation
      case LeafName.Slot:
      case LeafName.SlotLine:
      case undefined:
        saveHead(makeHead(Form.Fork))
        siftList.push({
          form: SiftName.RiseFork,
        })
        saveHead(makeHead(Form.Knit))
        siftList.push({
          form: SiftName.RiseKnit,
        })
        break
      default:
        break
    }

    saveHead(makeHead(Form.Nick, seed))
    siftList.push({
      form: SiftName.RiseNick,
      leaf: seed,
      size: seed.text.length,
    })
    saveReadNote(1)
  }

  /**
   * Handle close parenthesis.
   *
   * Parentheses can only be on one line.
   */

  function castFallHold(seed: LeafFallHold) {
    walk: while (true) {
      const head = readHead()
      switch (head?.form) {
        case Form.Nest:
          siftList.push({ form: SiftName.FallNest })
          tossHead()
          break
        case Form.Fork:
          siftList.push({ form: SiftName.FallFork })
          tossHead()
          break
        case Form.Knit:
          siftList.push({ form: SiftName.FallKnit })
          tossHead()
          break
        default:
          break walk
      }
    }
  }

  /**
   * Close interpolation.
   *
   * Can be on a separate line.
   */

  function castFallNick(seed: LeafFallNick) {
    walk: while (true) {
      const head = readHead()
      switch (head?.form) {
        case Form.Knit:
          siftList.push({
            form: SiftName.FallKnit,
          })
          tossHead()
          break
        case Form.Nest:
          siftList.push({ form: SiftName.FallNest })
          tossHead()
          break
        case Form.Fork:
          siftList.push({ form: SiftName.FallFork })
          tossHead()
          break
        case Form.Nick:
          siftList.push({
            leaf: seed,
            form: SiftName.FallNick,
          })
          tossHead()
          break walk
        default:
          break walk
      }
    }

    tossReadNote()
  }

  // // close the parentheses
  function fallBond() {
    walk: while (true) {
      const head = readHead()
      tick: switch (head?.form) {
        case Form.Fork:
          siftList.push({
            form: SiftName.FallFork,
          })
          tossHead()
          break tick
        case Form.Nest:
          siftList.push({ form: SiftName.FallNest })
          tossHead()
          break tick
        case Form.Knit:
          siftList.push({
            form: SiftName.FallKnit,
          })
          tossHead()
          break tick
        case Form.Line:
          siftList.push({
            form: SiftName.FallLine,
          })
          tossHead()
          break tick
        case Form.Card:
          break walk
        default:
          break walk
      }
    }
  }
}

function saveBond(
  mesh: Record<string, unknown>,
  name: string,
  bond: unknown,
) {
  Object.defineProperty(mesh, name, {
    value: bond,
    enumerable: false,
    writable: true,
  })
}
