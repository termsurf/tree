export enum Form {
  Base = 'base',
  Line = 'line',
  Text = 'text',
  Nick = 'nick',
  Cull = 'cull',
  Term = 'term',
}

export enum MarkName {
  FallCull = 'mark-fall-cull',
  FallNick = 'mark-fall-nick',
  FallHold = 'mark-fall-hold',
  FallText = 'mark-fall-text',
  Link = 'mark-link',
  Note = 'mark-note',
  Comb = 'mark-comb',
  Code = 'mark-code',
  RiseCull = 'mark-rise-cull',
  RiseNick = 'mark-rise-nick',
  RiseHold = 'mark-rise-hold',
  RiseText = 'mark-rise-text',
  LineSlot = 'mark-line-slot',
  Text = 'mark-text',
  Size = 'mark-size',
  Slot = 'mark-slot',
  RiseSlot = 'mark-rise-slot',
  FallSlot = 'mark-fall-slot',
  Line = 'mark-line',
  Knit = 'mark-knit',
}

// rank
export type RankLink = {
  mark: number
  line: number
}

export type Rank = {
  base: RankLink
  head: RankLink
}

export type MarkFallCull = MarkBase & {
  form: MarkName.FallCull
}

export type MarkComb = MarkBase & {
  form: MarkName.Comb
}

export type MarkSize = MarkBase & {
  form: MarkName.Size
}

export type MarkRiseHold = MarkBase & {
  form: MarkName.RiseHold
}

export type MarkFallHold = MarkBase & {
  form: MarkName.FallHold
}

export type MarkRiseText = MarkBase & {
  form: MarkName.RiseText
}

export type MarkSlot = MarkBase & {
  form: MarkName.Slot
}

export type MarkRiseSlot = MarkBase & {
  form: MarkName.RiseSlot
}

export type MarkFallText = MarkBase & {
  form: MarkName.FallText
}

export type MarkRiseNick = MarkBase & {
  form: MarkName.RiseNick
}

export type MarkFallNick = MarkBase & {
  form: MarkName.FallNick
}

export type MarkRiseCull = MarkBase & {
  form: MarkName.RiseCull
}

export type MarkLink = MarkBase & {
  form: MarkName.Link
}

export type MarkCode = MarkBase & {
  form: MarkName.Code
}

export type MarkNote = MarkBase & {
  form: MarkName.Note
}

export type MarkFallSlot = MarkBase & {
  form: MarkName.FallSlot
}

export type MarkLineSlot = MarkBase & {
  form: MarkName.LineSlot
}

export type MarkText = MarkBase & {
  form: MarkName.Text
}

export type MarkKnit = MarkBase & {
  form: MarkName.Knit
}

export type MarkCallLink = {
  link: string
  text: string
}

export type MarkLineRange = {
  mark: number
  line: number
}

export type MarkBase = {
  rank: Rank
  text: string
}

export type MarkSeed = {
  // what comes before
  base?: Array<MarkName>
  // what comes after
  head?: Array<MarkName>
  test: RegExp
  // whether or not we consume token
  take?: boolean
  link?: MarkName
}

export type MarkCallCast = MarkCallLink & {
  list: Array<Mark>
  lineText: Array<string>
}

export type Mark =
  | MarkFallCull
  | MarkFallNick
  | MarkFallHold
  | MarkFallText
  | MarkLink
  | MarkNote
  | MarkComb
  | MarkCode
  | MarkRiseCull
  | MarkRiseNick
  | MarkRiseHold
  | MarkRiseText
  | MarkLineSlot
  | MarkText
  | MarkSize
  | MarkSlot
  | MarkRiseSlot
  | MarkFallSlot
  | MarkKnit
