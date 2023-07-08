import type { CallCast, Band, Hunk } from '../list/form.js'
import haveHalt from '@tunebond/have/halt.js'

export enum SiftName {
  FallCull = 'fall-cull',
  FallCard = 'fall-card',
  FallNest = 'fall-nest',
  FallNick = 'fall-nick',
  FallTermLine = 'fall-term-line',
  FallText = 'fall-text',
  Note = 'note',
  Comb = 'comb',
  Code = 'code',
  RiseCull = 'rise-cull',
  RiseCard = 'rise-card',
  RiseNest = 'rise-nest',
  RiseNick = 'rise-nick',
  RiseTermLine = 'rise-term-line',
  RiseText = 'rise-text',
  SideSize = 'side-size',
  Text = 'text',
  TermText = 'term-text',
  Size = 'size',
  RiseTree = 'rise-tree',
  FallTree = 'fall-tree',
  Knit = 'knit',
  RiseKnit = 'rise-knit',
  FallKnit = 'fall-knit',
}

export type SiftHash = {
  'fall-cull': SiftFallCull
  'fall-card': SiftFallCard
  'fall-nest': SiftFallNest
  'fall-nick': SiftFallNick
  'fall-term-line': SiftFallTermLine
  'fall-text': SiftFallText
  note: SiftNote
  comb: SiftComb
  code: SiftCode
  'rise-cull': SiftRiseCull
  'rise-card': SiftRiseCard
  'rise-nest': SiftRiseNest
  'rise-nick': SiftRiseNick
  'rise-term-line': SiftRiseTermLine
  'rise-text': SiftRiseText
  'side-size': SiftSideSize
  text: SiftText
  'term-text': SiftTermText
  size: SiftSize
  'rise-tree': SiftRiseTree
  'fall-tree': SiftFallTree
  knit: SiftKnit
  'rise-knit': SiftRiseKnit
  'fall-knit': SiftFallKnit
}

export type SiftBase = {
  band?: Band
  list?: Hunk
}

export type SiftFallCull = SiftBase & {
  form: SiftName.FallCull
  text: string
}

export type SiftTermText = SiftBase & {
  form: SiftName.TermText
  bond: string
}

export type SiftFallCard = SiftBase & {
  form: SiftName.FallCard
}

export type SiftRiseKnit = SiftBase & {
  form: SiftName.RiseKnit
}

export type SiftFallKnit = SiftBase & {
  form: SiftName.FallKnit
}

export type SiftRiseTree = Omit<SiftBase, 'band'> & {
  form: SiftName.RiseTree
}

export type SiftFallTree = Omit<SiftBase, 'band'> & {
  form: SiftName.FallTree
}

export type SiftFallNest = Omit<SiftBase, 'band'> & {
  form: SiftName.FallNest
}

export type SiftFallNick = SiftBase & {
  form: SiftName.FallNick
  text: string
}

export type SiftFallTermLine = Omit<SiftBase, 'band'> & {
  form: SiftName.FallTermLine
}

export type SiftFallText = SiftBase & {
  form: SiftName.FallText
  text: string
}

export type SiftNote = SiftBase & {
  form: SiftName.Note
}

export type SiftKnit = SiftBase & {
  form: SiftName.Knit
  // nest: Array<SiftText | SiftNic>
}

export type SiftComb = SiftBase & {
  form: SiftName.Comb
  bond: number
}

export type SiftCode = SiftBase & {
  bond: number
  mold: string
  form: SiftName.Code
}

export type Sift =
  | SiftFallCull
  | SiftFallCard
  | SiftFallNick
  | SiftFallTermLine
  | SiftTermText
  | SiftRiseNest
  | SiftFallNest
  | SiftFallText
  | SiftNote
  | SiftComb
  | SiftCode
  | SiftRiseCull
  | SiftRiseCard
  | SiftRiseNick
  | SiftRiseTermLine
  | SiftRiseText
  | SiftSideSize
  | SiftText
  | SiftSize
  | SiftRiseTree
  | SiftFallTree
  | SiftKnit
  | SiftRiseKnit
  | SiftFallKnit

export type SiftRiseCull = SiftBase & {
  form: SiftName.RiseCull
  text: string
}

export type SiftRiseCard = SiftBase & {
  form: SiftName.RiseCard
}

export type SiftRiseNest = SiftBase & {
  form: SiftName.RiseNest
}

export type SiftRiseNick = SiftBase & {
  size: number
  form: SiftName.RiseNick
  text: string
}

export type SiftRiseTermLine = SiftBase & {
  form: SiftName.RiseTermLine
}

export type SiftRiseText = SiftBase & {
  form: SiftName.RiseText
}

export type SiftCallCast = CallCast & {
  siftList: Array<Sift>
}

export type SiftSideSize = SiftBase & {
  form: SiftName.SideSize
  bond: number
}

export type SiftText = SiftBase & {
  form: SiftName.Text
  bond: string
}

export type SiftSize = SiftBase & {
  form: SiftName.Size
  bond: number
}

export function testSiftForm<N extends SiftName>(
  lead: unknown,
  name: N,
): lead is SiftHash[N] {
  return (lead as Sift).form === name
}

export function haveSiftForm<N extends SiftName>(
  lead: unknown,
  name: N,
): asserts lead is SiftHash[N] {
  if (!testSiftForm(lead, name)) {
    throw haveHalt('form_miss', { call: name, need: 'sift' })
  }
}
