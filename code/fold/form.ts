import type { MarkCallCast, Rank } from '../mark/index.js'

export enum FoldName {
  FallHook = 'fold-fall-hook',
  FallCull = 'fold-fall-cull',
  FallCard = 'fold-fall-card',
  FallNest = 'fold-fall-nest',
  FallNick = 'fold-fall-nick',
  FallTermLine = 'fold-fall-term-line',
  FallText = 'fold-fall-text',
  Note = 'fold-note',
  Comb = 'fold-comb',
  Code = 'fold-code',
  RiseHook = 'fold-rise-hook',
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

export type FoldBase = {
  code: number
}

export type FoldFallHook = FoldBase & {
  form: FoldName.FallHook
}

export type FoldFallCull = FoldBase & {
  form: FoldName.FallCull
  rank: Rank
}

export type FoldTermText = FoldBase & {
  form: FoldName.TermText
  rank: Rank
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
  rank: Rank
}

export type FoldFallTermLine = FoldBase & {
  form: FoldName.FallTermLine
}

export type FoldFallText = FoldBase & {
  form: FoldName.FallText
}

export type FoldNote = FoldBase & {
  form: FoldName.Note
}

export type FoldComb = FoldBase & {
  rank: Rank
  form: FoldName.Comb
  bond: number
}

export type FoldCode = FoldBase & {
  bond: string
  rank: Rank
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
  | FoldRiseHook
  | FoldFallHook

export type FoldRiseHook = FoldBase & {
  form: FoldName.RiseHook
}

export type FoldRiseCull = FoldBase & {
  form: FoldName.RiseCull
  rank: Rank
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
  rank: Rank
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
  rank: Rank
  form: FoldName.SideSize
  bond: number
}

export type FoldText = FoldBase & {
  rank: Rank
  form: FoldName.Text
  bond: string
}

export type FoldSize = FoldBase & {
  rank: Rank
  form: FoldName.Size
  bond: number
}
