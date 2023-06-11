import _ from 'lodash'

import type { MarkCallCast } from '../mark/index.js'
import { MarkName } from '../mark/index.js'
import { FoldName } from './form.js'
import type { FoldCallCast, FoldTermSlot, Fold } from './form.js'
import { generateInvalidWhitespaceError } from '../halt.js'
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
}

type FormBase = {
  form: Form
  nest: number
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

  const formList: Array<FormBase> = [{ form: Form.Card, nest: 0 }]

  const cast = {
    ...link,
    foldList,
  }

  castMark()

  function castMark() {
    let textSlot = 0 // indent
    let lineHost = false
    let lastTextSlot = 0
    const nest: Array<Form> = []

    function diffTextSlot() {
      if (lastTextSlot > textSlot) {
        while (lastTextSlot > textSlot) {
          lastTextSlot--
          foldList.push(fold(FoldName.FallNest))
        }
      }
    }

    while (slot < link.list.length) {
      const seed = link.list[slot]
      haveMesh(seed, 'seed')

      switch (seed.form) {
        case MarkName.FallCull:
          foldList.push({
            rank: seed.rank,
            ...fold(FoldName.FallCull),
          })
          formList.pop()
          break
        case MarkName.FallNick:
          foldList.push({
            rank: seed.rank,
            text: seed.text,
            ...fold(FoldName.FallNick),
          })
          formList.pop()
          break
        case MarkName.FallHold:
          foldList.push(fold(FoldName.FallNest))
          slot++
          break
        case MarkName.FallLineText:
          break
        case MarkName.FallText: {
          const base = formList.pop()
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
          break
        case MarkName.Note:
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
          slot++
          foldList.push({
            rank: seed.rank,
            ...fold(FoldName.RiseCull),
          })
          const head = link.list[slot]
          switch (head?.form) {
            case MarkName.LineSlot:
              slot++
              formList.push({
                form: Form.Cull,
                nest: textSlot + 1,
              })
              break
            default:
              formList.push({
                form: Form.Cull,
                nest: textSlot,
              })
              break
          }
          break
        }
        case MarkName.RiseSlot:
          textSlot++
          break
        case MarkName.RiseNick: {
          slot++
          foldList.push({
            rank: seed.rank,
            size: seed.text.length,
            ...fold(FoldName.RiseNick),
          })
          const head = link.list[slot]
          switch (head?.form) {
            case MarkName.LineSlot:
              slot++
              formList.push({
                form: Form.Nick,
                nest: textSlot + 1,
              })
              break
            default:
              formList.push({
                form: Form.Nick,
                nest: textSlot,
              })
              break
          }
          break
        }
        case MarkName.RiseNest:
          foldList.push(fold(FoldName.RiseNest))
          slot++
          break
        case MarkName.RiseHold:
          foldList.push(fold(FoldName.RiseNest))
          slot++
          break
        case MarkName.RiseLineText:
          break
        case MarkName.RiseText: {
          slot++
          foldList.push({
            rank: seed.rank,
            ...fold(FoldName.RiseText),
          })
          const head = link.list[slot]
          switch (head?.form) {
            case MarkName.LineSlot:
              slot++
              formList.push({
                form: Form.Text,
                nest: textSlot + 1,
              })
              break
            default:
              formList.push({
                form: Form.Text,
                nest: textSlot,
              })
              break
          }
          break
        }
        case MarkName.LineSlot: {
          // const base = formList[formList.length - 1]
          // haveMesh(base, 'base')
          // base.nest = base.baseNest
          textSlot = 0
          slot++
          walk: while (true) {
            const head = link.list[slot]

            switch (head?.form) {
              case MarkName.RiseSlot:
                slot++
                textSlot++
                break walk
              default:
                break walk
            }
          }

          diffTextSlot()
          break
        }
        case MarkName.SideSize: {
          foldList.push({
            ...seed,
            bond: parseInt(seed.text, 10),
            ...fold(FoldName.Comb),
          })
          break
        }
        case MarkName.Text: {
          foldList.push({
            ...seed,
            bond: seed.text,
            ...fold(FoldName.Text),
          })
          break
        }
        case MarkName.TermText: {
          foldList.push(fold(FoldName.RiseTermLine))
          foldList.push({
            ...seed,
            bond: seed.text,
            ...fold(FoldName.TermText),
          })
          formList.push({
            form: Form.TermLine,
            nest: textSlot,
          })
          break
        }
        case MarkName.Size: {
          foldList.push({
            ...seed,
            bond: parseInt(seed.text, 10),
            ...fold(FoldName.Comb),
          })
          break
        }
        case MarkName.LineTextLink: {
          foldList.push({
            ...seed,
            bond: seed.text,
            ...fold(FoldName.Text),
          })
          break
        }
        case MarkName.LineTextSlot: {
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
      slot++
    }
  }

  console.log(JSON.stringify(cast.foldList, null, 2))

  return cast
}
