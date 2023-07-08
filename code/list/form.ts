export enum Form {
  Base = 'base',
  Line = 'line',
  Text = 'text',
  Nick = 'nick',
  Cull = 'cull',
  Term = 'term',
}

export enum Name {
  FallCull = 'fall-cull',
  FallNick = 'fall-nick',
  FallHold = 'fall-hold',
  FallText = 'fall-text',
  Link = 'link',
  Note = 'note',
  Comb = 'comb',
  Code = 'code',
  RiseCull = 'rise-cull',
  RiseNick = 'rise-nick',
  RiseHold = 'rise-hold',
  RiseText = 'rise-text',
  SlotLine = 'slot-line',
  Text = 'text',
  Size = 'size',
  Slot = 'slot',
  Line = 'line',
  Knit = 'knit',
}

export type Rank = {
  base: number
  head: number
}

export type FallCull = Base & {
  form: Name.FallCull
}

export type Comb = Base & {
  form: Name.Comb
}

export type Size = Base & {
  form: Name.Size
}

export type RiseHold = Base & {
  form: Name.RiseHold
}

export type FallHold = Base & {
  form: Name.FallHold
}

export type RiseText = Base & {
  form: Name.RiseText
}

export type Slot = Base & {
  form: Name.Slot
}

export type FallText = Base & {
  form: Name.FallText
}

export type RiseNick = Base & {
  form: Name.RiseNick
}

export type FallNick = Base & {
  form: Name.FallNick
}

export type RiseCull = Base & {
  form: Name.RiseCull
}

export type Link = Base & {
  form: Name.Link
}

export type Code = Base & {
  form: Name.Code
}

export type Note = Base & {
  form: Name.Note
}

export type SlotLine = Base & {
  form: Name.SlotLine
}

export type Line = Base & {
  form: Name.Line
}

export type Text = Base & {
  form: Name.Text
}

export type Knit = Base & {
  form: Name.Knit
}

export type CallLink = {
  link: string
  text: string
}

// export type Rank = {
//   mark: number
//   line: number
// }

export type Base = {
  rank: Rank
  text: string
  // linked list
  back?: Hunk
  head?: Hunk
}

export type Seed = {
  // what comes before
  base?: Array<Name>
  // what comes after
  head?: Array<Name>
  test: RegExp
  // whether or not we consume token
  take?: boolean
  link?: Name
}

export type CallCast = CallLink & {
  head?: Hunk
  lineText: Array<string>
}

export type Hunk =
  | FallCull
  | FallNick
  | FallHold
  | FallText
  | Link
  | Note
  | Comb
  | Code
  | RiseCull
  | RiseNick
  | RiseHold
  | RiseText
  | SlotLine
  | Text
  | Size
  | Slot
  | RiseSlot
  | FallSlot
  | Knit
  | Line
