import _ from 'lodash'

import type { MarkCallCast } from '../mark/index.js'
import { MarkName } from '../mark/index.js'
import { FoldName } from './form.js'
import type { FoldCallCast, FoldTermSlot, Fold } from './form.js'
import { generateInvalidWhitespaceError } from '../halt.js'
import { haveMesh } from '@tunebond/have'

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
  baseNest: number
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

  const formList: Array<FormBase> = [
    { form: Form.Card, nest: 0, baseNest: 0 },
  ]

  const cast = {
    ...link,
    foldList,
  }

  castMark()

  function castMark() {
    let textSlot = 0 // indent
    let lineHost = false

    while (slot < link.list.length) {
      const seed = link.list[slot]
      haveMesh(seed, 'seed')
      const base = formList[formList.length - 1]
      haveMesh(base, 'base')

      console.log(base.form, seed)

      test: switch (base.form) {
        case Form.Cull: {
          switch (seed.form) {
            case MarkName.RiseCull: {
              foldList.push({
                rank: seed.rank,
                ...fold(FoldName.RiseCull),
              })
              slot++
              break test
            }
            case MarkName.FallCull: {
              foldList.push({
                rank: seed.rank,
                ...fold(FoldName.FallCull),
              })
              formList.pop()
              slot++
              break test
            }
            case MarkName.Note: {
              slot++
              break test
            }
            case MarkName.Size: {
              foldList.push({
                ...seed,
                bond: parseInt(seed.text, 10),
                ...fold(FoldName.Size),
              })
              slot++
              break test
            }
            case MarkName.SideSize: {
              foldList.push({
                ...seed,
                bond: parseInt(seed.text, 10),
                ...fold(FoldName.SideSize),
              })
              slot++
              break test
            }
            case MarkName.Comb: {
              foldList.push({
                ...seed,
                bond: parseFloat(seed.text),
                ...fold(FoldName.Comb),
              })
              slot++
              break test
            }
            case MarkName.Code: {
              lineHost = false
              const [hash, base = '', ...bond] = seed.text
              foldList.push({
                ...seed,
                bond: bond.join(''),
                base,
                ...fold(FoldName.Code),
              })
              slot++
              break test
            }
            default:
              console.log(cast.foldList)
              throw new Error(`${base.form} in ${seed.form}`)
              break test
          }
        }
        case Form.Nest: {
          switch (seed.form) {
            case MarkName.RiseNest: {
              foldList.push(fold(FoldName.RiseNest))
              slot++
              break test
            }
            // case MarkName.Link: {
            //   slot++
            //   break test
            // }
            // case MarkName.LineTextLink: {
            //   foldList.push({
            //     rank: seed.rank,
            //     bond: seed.text,
            //     ...fold(FoldName.Text),
            //   })
            //   slot++
            //   break test
            // }
            // case MarkName.LineTextSlot: {
            //   foldList.push({
            //     rank: seed.rank,
            //     bond: seed.text,
            //     ...fold(FoldName.Text),
            //   })
            //   slot++
            //   break test
            // }
            case MarkName.RiseLineText: {
              formList.push({
                form: Form.Line,
                nest: base.nest,
                baseNest: base.nest,
              })
              break test
            }
            // case MarkName.FallLineText: {
            //   formList.pop()
            //   break test
            // }
            // case MarkName.RiseNick: {
            //   formList.push({
            //     form: Form.Nick,
            //     nest: base.nest,
            //     baseNest: base.nest,
            //   })
            //   break test
            // }
            // case MarkName.RiseCull: {
            //   formList.push({
            //     form: Form.Cull,
            //     nest: base.nest,
            //     baseNest: base.nest,
            //   })
            //   break test
            // }
            // case MarkName.FallNick: {
            //   formList.pop()
            //   break test
            // }
            case MarkName.TermText: {
              foldList.push(fold(FoldName.RiseTermLine))
              formList.push({
                form: Form.TermLine,
                nest: base.nest,
                baseNest: base.nest,
              })
              break test
            }
            case MarkName.Note: {
              slot++
              break test
            }
            case MarkName.Size: {
              foldList.push({
                ...seed,
                bond: parseInt(seed.text, 10),
                ...fold(FoldName.Size),
              })
              slot++
              break test
            }
            case MarkName.SideSize: {
              foldList.push({
                ...seed,
                bond: parseInt(seed.text, 10),
                ...fold(FoldName.SideSize),
              })
              slot++
              break test
            }
            case MarkName.Comb: {
              foldList.push({
                ...seed,
                bond: parseFloat(seed.text),
                ...fold(FoldName.Comb),
              })
              slot++
              break test
            }
            case MarkName.Code: {
              lineHost = false
              const [hash, base = '', ...bond] = seed.text
              foldList.push({
                ...seed,
                bond: bond.join(''),
                base,
                ...fold(FoldName.Code),
              })
              slot++
              break test
            }
            case MarkName.FallHold:
              foldList.push(fold(FoldName.FallNest))
              formList.pop()
              slot++
              break test
            case MarkName.LineSlot:
              foldList.push(fold(FoldName.FallNest))
              formList.pop()
              break test
            default:
              console.log(cast.foldList)
              throw new Error(`${base.form} in ${seed.form}`)
              break test
          }
        }
        case Form.Nick:
          switch (seed.form) {
            case MarkName.RiseNick: {
              foldList.push({
                rank: seed.rank,
                size: seed.text.length,
                ...fold(FoldName.RiseNick),
              })
              slot++
              break test
            }
            case MarkName.FallNick: {
              foldList.push({
                rank: seed.rank,
                ...fold(FoldName.FallNick),
              })
              formList.pop()
              slot++
              break test
            }
            case MarkName.LineSlot: {
              while (base.nest > base.baseNest - 1) {
                foldList.push(fold(FoldName.FallNest))
                base.nest--
              }
              slot++
              break test
            }
            case MarkName.FallHold:
              foldList.push(fold(FoldName.FallNest))
              slot++
              break test
            case MarkName.RiseSlot: {
              base.nest++
              foldList.push(fold(FoldName.RiseNest))
              slot++
              break test
            }
            case MarkName.TermText: {
              foldList.push(fold(FoldName.RiseTermLine))
              formList.push({
                form: Form.TermLine,
                nest: base.nest,
                baseNest: base.nest,
              })
              break test
            }
            default:
              console.log(cast.foldList)
              throw new Error(`${base.form} in ${seed.form}`)
              break test
          }
          break test
        case Form.TermLine:
          switch (seed.form) {
            case MarkName.FallNick: {
              formList.pop()
              break test
            }
            case MarkName.FallLineText: {
              // formList.pop()
              slot++
              break test
            }
            case MarkName.Link: {
              foldList.push(fold(FoldName.FallTermLine))
              formList.pop()
              slot++
              break test
            }
            case MarkName.TermText: {
              foldList.push({
                rank: seed.rank,
                bond: seed.text,
                ...fold(FoldName.TermText),
              })
              slot++
              break test
            }
            case MarkName.RiseNick: {
              formList.push({
                form: Form.Nick,
                nest: base.nest,
                baseNest: base.nest,
              })
              break test
            }
            case MarkName.RiseCull: {
              formList.push({
                form: Form.Cull,
                nest: base.nest,
                baseNest: base.nest,
              })
              break test
            }
            case MarkName.RiseNest: {
              foldList.push(fold(FoldName.FallTermLine))
              formList.pop()
              formList.push({
                form: Form.Nest,
                nest: base.nest,
                baseNest: base.nest,
              })
              break test
            }
            case MarkName.LineSlot: {
              foldList.push(fold(FoldName.FallTermLine))

              while (base.nest > base.baseNest - 1) {
                foldList.push(fold(FoldName.FallNest))
                base.nest--
              }
              slot++
              break test
            }
            case MarkName.RiseSlot: {
              base.nest++
              foldList.push(fold(FoldName.RiseNest))
              slot++
              break test
            }
            case MarkName.RiseLineText: {
              formList.push({
                form: Form.Line,
                nest: base.nest,
                baseNest: base.nest,
              })
              break test
            }
            default:
              console.log(cast.foldList)
              throw new Error(`${base.form} in ${seed.form}`)
              break test
          }
          break test
        case Form.Line:
          switch (seed.form) {
            case MarkName.RiseLineText: {
              foldList.push({
                rank: seed.rank,
                bond: seed.text,
                ...fold(FoldName.Text),
              })
              slot++
              break test
            }
            case MarkName.FallLineText: {
              formList.pop()
              slot++
              break test
            }
            default:
              console.log(cast.foldList)
              throw new Error(`${base.form} in ${seed.form}`)
          }
        case Form.Card:
          switch (seed.form) {
            case MarkName.Size: {
              throw new Error('Invalid term ' + seed.text)
              break test
            }
            case MarkName.SideSize: {
              throw new Error('Invalid term ' + seed.text)
              break test
            }
            case MarkName.Comb: {
              throw new Error('Invalid term ' + seed.text)
              break test
            }
            case MarkName.Code: {
              throw new Error('Invalid term ' + seed.text)
              break test
            }
            case MarkName.TermText: {
              foldList.push(fold(FoldName.RiseTermLine))
              formList.push({
                form: Form.TermLine,
                nest: base.nest,
                baseNest: base.nest,
              })
              break test
            }
            // case MarkName.FallLineText: {
            //   slot++
            //   break test
            // }
            case MarkName.RiseSlot: {
              base.nest++
              foldList.push(fold(FoldName.RiseNest))
              slot++
              break test
            }
            case MarkName.RiseNest: {
              throw generateInvalidWhitespaceError(cast, slot)
              break test
            }
            case MarkName.LineSlot: {
              while (base.nest > base.baseNest - 1) {
                foldList.push(fold(FoldName.FallNest))
                base.nest--
              }
              slot++
              break test
            }
            case MarkName.RiseNick:
              formList.push({
                form: Form.Nick,
                nest: base.nest,
                baseNest: base.nest,
              })
              break test
            case MarkName.FallCull:
            case MarkName.FallNick:
            case MarkName.FallHold:
            case MarkName.FallText:
            case MarkName.RiseCull:
            case MarkName.RiseNest:
            case MarkName.RiseHold:
            case MarkName.RiseText:
            case MarkName.Link: {
              throw new Error('Oops')
              // throw generateInvalidCompilerStateError(
              //   `Uncastd text type ${seed.form}.`,
              //   link.path,
              // )
            }
            case MarkName.RiseLineText: {
              // foldList.push(...castLine(link))
              break test
            }
            default:
              console.log(cast.foldList)
              throw new Error(`${base.form} in ${seed.form}`)
              break test
          }
        default:
          break test
      }
    }
  }

  console.log(cast.foldList)

  return cast
}
