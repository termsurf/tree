import _ from 'lodash'

import type {
  MarkCallCast,
  MarkFallCull,
  MarkFallNick,
  MarkLineSlot,
  MarkRiseCull,
  MarkRiseNick,
  MarkRiseText,
  MarkTermBase,
  MarkText,
} from '../mark/index.js'
import { MarkName } from '../mark/index.js'
import { FoldName } from './form.js'
import type { FoldCallCast, Fold } from './form.js'
import { haveMesh, haveWave } from '@tunebond/have'

export * from './form.js'

export type FoldCallLink = MarkCallCast

enum Form {
  Card = 'card',
  TermLine = 'term-line',
  Text = 'text',
  Nick = 'nick',
  Cull = 'cull',
  Nest = 'nest',
  Line = 'line',
  Tree = 'tree',
}

type FormBase = {
  form: Form
  nest: number
  nestTree: number
}

export default function makeFoldList(link: FoldCallLink): FoldCallCast {
  const sizeList: Record<string, number> = {}

  // console.log(
  //   link.list.map(x => ({
  //     text: x.text,
  //     form: x.form,
  //   })),
  // )

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

  const foldList: Array<Fold> = [fold(FoldName.RiseTree)]

  let slot = 0

  const formList: Array<FormBase> = [
    { form: Form.Card, nest: 0, nestTree: 1 },
  ]

  const cast = {
    ...link,
    foldList,
  }

  let textSlot = 0 // indent
  let lastTextSlot = 0
  let nestSlot = 0
  let formBond = formList[0]

  function diffTextSlot() {
    if (lastTextSlot > textSlot) {
      while (lastTextSlot > textSlot) {
        lastTextSlot--
        foldList.push({
          ...fold(FoldName.FallNest),
        })
        // takeForm()
      }
    }
  }

  function readHead() {
    while (textSlot-- >= 0) {
      foldList.push({
        ...fold(FoldName.FallNest),
      })
      // takeForm()
    }
  }

  function readNestSlot() {
    haveMesh(formBond, 'formBond')

    while (formBond.nestTree-- > 0) {
      foldList.push({
        ...fold(FoldName.FallNest),
      })
      // takeForm()
    }

    formBond.nestTree = 0
  }

  function takeHeadForm() {
    while (formList.length > 1) {
      const base = takeForm()
      haveMesh(base, 'base')
      switch (base.form) {
        case Form.Nest:
          foldList.push({
            ...fold(FoldName.FallNest),
          })
          break
        case Form.Tree:
          foldList.push({
            ...fold(FoldName.FallTree),
          })
          break
        case Form.TermLine:
          foldList.push({
            ...fold(FoldName.FallTermLine),
          })
          break
          // case Form.Nick:
          //   foldList.push({
          //     ...fold(FoldName.FallNick),
          //   })
          break
        default:
          break
      }
    }
  }

  let formSlot = 0

  castFold()

  function saveForm(
    form: Form,
    nestText = textSlot,
    nestTree = nestSlot,
  ) {
    const bond = {
      form,
      nest: nestText,
      nestTree: nestTree,
    }
    formList.push(bond)

    console.log(`${makeTextMove(formSlot++)}${form}+`)

    formBond = bond
  }

  function readForm() {
    const base = formList[formList.length - 1]

    return base
  }

  function takeForm() {
    const base = formList.pop()

    console.log(`${makeTextMove(--formSlot)}${base?.form}-`)

    formBond = base

    readNestSlot()

    return base
  }

  function castFold() {
    while (slot < link.list.length) {
      const seed = link.list[slot]
      haveMesh(seed, 'seed')

      // console.log(seed.text, seed.form)

      switch (seed.form) {
        case MarkName.FallCull: {
          castFallCull(seed)
          break
        }
        case MarkName.FallNick: {
          castFallNick(seed)
          break
        }
        case MarkName.FallHold:
          takeForm()
          foldList.push({
            ...fold(FoldName.FallNest),
          })
          slot++
          break
        case MarkName.FallLineText:
          // console.log('fall line text')
          slot++
          break
        case MarkName.FallText: {
          const base = readForm()
          takeForm()
          haveMesh(base, 'base')
          haveWave(base.nest === textSlot, 'equal')
          slot++
          foldList.push({
            rank: seed.rank,
            text: seed.text,
            ...fold(FoldName.FallText),
          })
          break
        }
        case MarkName.Link:
          slot++
          const a = readForm()
          if (a?.form === Form.TermLine) {
            foldList.push({
              ...fold(FoldName.FallTermLine),
            })
            takeForm()
          }

          const b = readForm()
          if (b?.form === Form.Tree) {
            foldList.push(fold(FoldName.FallTree))
            takeForm()
          }
          break
        case MarkName.Note:
          slot++
          break
        case MarkName.Comb: {
          slot++
          foldList.push({
            ...seed,
            bond: parseFloat(seed.text),
            ...fold(FoldName.Comb),
          })
          break
        }
        case MarkName.Code: {
          slot++
          const [hash, base = '', ...bond] = seed.text
          foldList.push({
            ...seed,
            bond: bond.join(''),
            base,
            ...fold(FoldName.Code),
          })
          break
        }
        case MarkName.RiseCull: {
          castRiseCull(seed)
          break
        }
        case MarkName.RiseSlot:
          textSlot++
          slot++
          foldList.push({
            rank: seed.rank,
            ...fold(FoldName.RiseNest),
          })
          saveForm(Form.Nest)
          haveMesh(formBond, 'formBond')
          formBond.nestTree++
          break
        case MarkName.RiseNick: {
          castRiseNick(seed)
          break
        }
        case MarkName.FallTerm: {
          const a = readForm()
          const b = readForm()

          if (a?.form === Form.TermLine) {
            takeForm()
            foldList.push({
              ...fold(FoldName.FallTermLine),
            })
          }

          if (b?.form === Form.Tree) {
            takeForm()
            foldList.push({
              ...fold(FoldName.FallTree),
            })
          }

          slot++
          break
        }
        case MarkName.RiseNest:
          foldList.push({
            rank: seed.rank,
            ...fold(FoldName.RiseNest),
          })
          saveForm(Form.Nest)
          haveMesh(formBond, 'formBond')
          formBond.nestTree++
          slot++
          break
        case MarkName.RiseHold:
          foldList.push({
            rank: seed.rank,
            ...fold(FoldName.RiseNest),
          })
          slot++
          break
        case MarkName.RiseLineText:
          slot++
          break
        case MarkName.RiseText: {
          castRiseText(seed)
          break
        }
        case MarkName.LineSlot: {
          readLineSlot(seed)
          break
        }
        case MarkName.SideSize: {
          foldList.push({
            rank: seed.rank,
            bond: parseInt(seed.text, 10),
            ...fold(FoldName.Comb),
          })
          slot++
          const head = link.list[slot]
          switch (head?.form) {
            case MarkName.RiseNest:
              throw new Error('Cant use numbers as terms.')
              break
            default:
              break
          }
          break
        }
        case MarkName.Text: {
          castText(seed)
          break
        }
        case MarkName.TermBase: {
          castTermBase(seed)
          break
        }
        case MarkName.TermLink: {
          slot++
          foldList.push({
            ...seed,
            bond: seed.text,
            ...fold(FoldName.TermText),
          })
          break
        }
        case MarkName.TermHead: {
          slot++
          foldList.push({
            ...seed,
            bond: seed.text,
            ...fold(FoldName.TermText),
          })
          break
        }
        case MarkName.TermLineLink: {
          slot++
          foldList.push({
            ...seed,
            bond: seed.text,
            ...fold(FoldName.TermText),
          })
          break
        }
        case MarkName.Size: {
          slot++
          foldList.push({
            ...seed,
            bond: parseInt(seed.text, 10),
            ...fold(FoldName.Comb),
          })
          const head = link.list[slot]
          switch (head?.form) {
            case MarkName.RiseNest:
              throw new Error('Cant use numbers as terms.')
              break
            default:
              break
          }
          break
        }
        case MarkName.LineTextLink: {
          slot++
          foldList.push({
            ...seed,
            bond: seed.text,
            ...fold(FoldName.Text),
          })
          break
        }
        case MarkName.LineTextSlot: {
          slot++
          foldList.push({
            ...seed,
            bond: seed.text,
            ...fold(FoldName.Text),
          })
          break
        }
        default:
          throw new Error('undefined')
          break
      }

      function readLineSlot(seed: MarkLineSlot) {
        let lastTextSlot = textSlot
        while (lastTextSlot-- >= 0) {
          const c = readForm()

          if (c?.form === Form.Nest) {
            foldList.push({
              ...fold(FoldName.FallNest),
            })
            takeForm()
          }

          const a = readForm()
          if (a?.form === Form.TermLine) {
            takeForm()
            foldList.push({
              ...fold(FoldName.FallTermLine),
            })
          }

          const b = readForm()
          if (b?.form === Form.Tree) {
            takeForm()
            foldList.push({
              ...fold(FoldName.FallTree),
            })
          }

          console.log(a, b)
        }
        textSlot = 0
        slot++
        walk: while (true) {
          const head = link.list[slot]

          switch (head?.form) {
            case MarkName.RiseSlot:
              slot++
              textSlot++
              foldList.push({
                rank: seed.rank,
                ...fold(FoldName.RiseNest),
              })
              break
            default:
              break walk
          }
        }

        diffTextSlot()
      }

      function castTermBase(seed: MarkTermBase) {
        const last = link.list[slot - 1]

        switch (last?.form) {
          case undefined:
          case MarkName.RiseNest:
          case MarkName.RiseSlot:
          case MarkName.LineSlot:
          case MarkName.RiseNick:
          case MarkName.RiseCull:
          case MarkName.Link:
            foldList.push(fold(FoldName.RiseTree))
            foldList.push({
              rank: seed.rank,
              ...fold(FoldName.RiseTermLine),
            })
            console.log(seed.text, seed.form)
            saveForm(Form.Tree)
            saveForm(Form.TermLine)
            break
          default:
            console.log('MORE', seed.text, seed.form)
            break
        }

        slot++
        foldList.push({
          ...seed,
          bond: seed.text,
          ...fold(FoldName.TermText),
        })
      }
    }
  }

  function castFallCull(seed: MarkFallCull) {
    slot++
    const a = readForm()
    if (a?.form === Form.TermLine) {
      foldList.push({
        ...fold(FoldName.FallTermLine),
      })
      takeForm()
    }

    const b = readForm()
    if (b?.form === Form.Tree) {
      foldList.push(fold(FoldName.FallTree))
      takeForm()
    }

    const c = takeForm() // cull
    if (c?.form === Form.Cull) {
      // nestSlot = c.nestTree
      // takeNestSlotBack()
    }

    foldList.push({
      rank: seed.rank,
      text: seed.text,
      ...fold(FoldName.FallCull),
    })

    const headSlot = link.list[slot]
    switch (headSlot?.form) {
      case undefined:
      case MarkName.RiseNest:
      case MarkName.RiseSlot:
      case MarkName.LineSlot:
      case MarkName.Link: {
        const c = readForm()

        if (c?.form === Form.TermLine) {
          foldList.push({
            ...fold(FoldName.FallTermLine),
          })
          takeForm()
        }

        const d = readForm()
        if (d?.form === Form.Tree) {
          foldList.push(fold(FoldName.FallTree))
          takeForm()
        }
      }
      default:
        break
    }
  }

  function castText(seed: MarkText) {
    slot++
    const base = formList[formList.length - 1]
    haveMesh(base, 'base')

    if (base.nest >= 0) {
      haveWave(base.nest === seed.text.match(/^(  )+/)?.length, 'equal')
    }

    foldList.push({
      ...seed,
      bond: seed.text,
      ...fold(FoldName.Text),
    })
  }

  function castRiseText(seed: MarkRiseText) {
    slot++
    foldList.push({
      rank: seed.rank,
      ...fold(FoldName.RiseText),
    })
    const head = link.list[slot]
    switch (head?.text) {
      case '\n':
        slot++
        saveForm(Form.Text, textSlot + 1, 0)
        break
      default:
        saveForm(Form.Text, 0, 0)
        break
    }
  }

  function castFallNick(seed: MarkFallNick) {
    const a = readForm()

    if (a?.form === Form.TermLine) {
      foldList.push({
        ...fold(FoldName.FallTermLine),
      })
      takeForm()
    }

    const b = readForm()
    if (b?.form === Form.Tree) {
      foldList.push(fold(FoldName.FallTree))
      takeForm()
    }

    const c = takeForm() // nick
    if (c?.form === Form.Nick) {
      // nestSlot = c.nestTree
      // takeNestSlotBack()
    }

    foldList.push({
      rank: seed.rank,
      text: seed.text,
      ...fold(FoldName.FallNick),
    })
    const last = formList[formList.length - 1]
    if (last) {
      last.nest = -1
    }
    slot++

    const headSlot = link.list[slot]
    switch (headSlot?.form) {
      case undefined:
      case MarkName.RiseNest:
      case MarkName.RiseSlot:
      case MarkName.LineSlot:
      case MarkName.Link: {
        const c = readForm()

        if (c?.form === Form.TermLine) {
          foldList.push({
            ...fold(FoldName.FallTermLine),
          })
          takeForm()
        }

        const d = readForm()
        if (d?.form === Form.Tree) {
          foldList.push(fold(FoldName.FallTree))
          takeForm()
        }
      }
      default:
        break
    }
  }

  function castRiseNick(seed: MarkRiseNick) {
    slot++
    foldList.push({
      rank: seed.rank,
      text: seed.text,
      size: seed.text.length,
      ...fold(FoldName.RiseNick),
    })
    const head = link.list[slot]
    switch (head?.form) {
      case MarkName.LineSlot:
        slot++
        saveForm(Form.Nick, textSlot + 1, 0)
        haveMesh(formBond, 'formBond')
        formBond.nestTree++
        break
      default:
        saveForm(Form.Nick, textSlot, 0)
        haveMesh(formBond, 'formBond')
        formBond.nestTree++
        break
    }
  }

  function takeNestSlotBack() {
    while (nestSlot-- >= 0) {
      foldList.push({
        ...fold(FoldName.FallNest),
      })
    }
  }

  function castRiseCull(seed: MarkRiseCull) {
    slot++
    foldList.push({
      rank: seed.rank,
      text: seed.text,
      ...fold(FoldName.RiseCull),
    })
    const head = link.list[slot]
    switch (head?.form) {
      case MarkName.LineSlot:
        slot++
        saveForm(Form.Cull, textSlot + 1, 0)
        haveMesh(formBond, 'formBond')
        formBond.nestTree++
        break
      default:
        saveForm(Form.Cull, textSlot, 0)
        haveMesh(formBond, 'formBond')
        formBond.nestTree++
        break
    }
  }

  readHead()

  // takeHeadForm()

  foldList.push(fold(FoldName.FallTree))

  // console.log(JSON.stringify(cast.foldList, null, 2))

  return cast
}

function makeTextMove(move: number) {
  return new Array(move + 1).join('  ')
}
