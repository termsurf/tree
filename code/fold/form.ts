import type { MarkCallCast, Rank } from '../mark/index.js'
import haveHalt from '@tunebond/have/halt.js'

export enum FoldName {
  FallCull = 'fold-fall-cull',
  FallCard = 'fold-fall-card',
  FallNest = 'fold-fall-nest',
  FallNick = 'fold-fall-nick',
  FallTermLine = 'fold-fall-term-line',
  FallText = 'fold-fall-text',
  Note = 'fold-note',
  Comb = 'fold-comb',
  Code = 'fold-code',
  RiseCull = 'fold-rise-cull',
  RiseCard = 'fold-rise-card',
  RiseNest = 'fold-rise-nest',
  RiseNick = 'fold-rise-nick',
  RiseTermLine = 'fold-rise-term-line',
  RiseText = 'fold-rise-text',
  SideSize = 'fold-side-size',
  Text = 'fold-text',
  TermText = 'fold-term-text',
  Size = 'fold-size',
}

export type FoldHash = {
  'fold-fall-cull': FoldFallCull
  'fold-fall-card': FoldFallCard
  'fold-fall-nest': FoldFallNest
  'fold-fall-nick': FoldFallNick
  'fold-fall-term-line': FoldFallTermLine
  'fold-fall-text': FoldFallText
  'fold-note': FoldNote
  'fold-comb': FoldComb
  'fold-code': FoldCode
  'fold-rise-cull': FoldRiseCull
  'fold-rise-card': FoldRiseCard
  'fold-rise-nest': FoldRiseNest
  'fold-rise-nick': FoldRiseNick
  'fold-rise-term-line': FoldRiseTermLine
  'fold-rise-text': FoldRiseText
  'fold-side-size': FoldSideSize
  'fold-text': FoldText
  'fold-term-text': FoldTermText
  'fold-size': FoldSize
}

export type FoldBase = {
  code: number
  rank: Rank
}

export type FoldFallCull = FoldBase & {
  form: FoldName.FallCull
  text: string
}

export type FoldTermText = FoldBase & {
  form: FoldName.TermText
  bond: string
}

export type FoldFallCard = FoldBase & {
  form: FoldName.FallCard
}

export type FoldFallNest = FoldBase & {
  form: FoldName.FallNest
}

export type FoldFallNick = FoldBase & {
  form: FoldName.FallNick
  text: string
}

export type FoldFallTermLine = FoldBase & {
  form: FoldName.FallTermLine
}

export type FoldFallText = FoldBase & {
  form: FoldName.FallText
  text: string
}

export type FoldNote = FoldBase & {
  form: FoldName.Note
}

export type FoldComb = FoldBase & {
  form: FoldName.Comb
  bond: number
}

export type FoldCode = FoldBase & {
  bond: string
  base: string
  form: FoldName.Code
}

export type Fold =
  | FoldFallCull
  | FoldFallCard
  | FoldFallNick
  | FoldFallTermLine
  | FoldTermText
  | FoldRiseNest
  | FoldFallNest
  | FoldFallText
  | FoldNote
  | FoldComb
  | FoldCode
  | FoldRiseCull
  | FoldRiseCard
  | FoldRiseNick
  | FoldRiseTermLine
  | FoldRiseText
  | FoldSideSize
  | FoldText
  | FoldSize

export type FoldRiseCull = FoldBase & {
  form: FoldName.RiseCull
  text: string
}

export type FoldRiseCard = FoldBase & {
  form: FoldName.RiseCard
}

export type FoldRiseNest = FoldBase & {
  form: FoldName.RiseNest
}

export type FoldRiseNick = FoldBase & {
  size: number
  form: FoldName.RiseNick
  text: string
}

export type FoldRiseTermLine = FoldBase & {
  form: FoldName.RiseTermLine
}

export type FoldRiseText = FoldBase & {
  form: FoldName.RiseText
}

export type FoldCallCast = MarkCallCast & {
  foldList: Array<Fold>
}

export type FoldSideSize = FoldBase & {
  form: FoldName.SideSize
  bond: number
}

export type FoldText = FoldBase & {
  form: FoldName.Text
  bond: string
}

export type FoldSize = FoldBase & {
  form: FoldName.Size
  bond: number
}

export function testFoldForm<N extends FoldName>(
  lead: unknown,
  name: N,
): lead is FoldHash[N] {
  return (lead as Fold).form === name
}

export function haveFoldForm<N extends FoldName>(
  lead: unknown,
  name: N,
): asserts lead is FoldHash[N] {
  if (!testFoldForm(lead, name)) {
    throw haveHalt('form_miss', { call: name, need: 'fold' })
  }
}
