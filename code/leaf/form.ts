export enum LeafForm {
  Base = 'base',
  Line = 'line',
  Text = 'text',
  Nick = 'nick',
  Term = 'term',
}

export enum LeafName {
  FallNick = 'leaf-fall-nick',
  FallHold = 'leaf-fall-hold',
  FallText = 'leaf-fall-text',
  Link = 'leaf-link',
  Note = 'leaf-note',
  Comb = 'leaf-comb',
  Code = 'leaf-code',
  RiseNick = 'leaf-rise-nick',
  RiseHold = 'leaf-rise-hold',
  RiseText = 'leaf-rise-text',
  SlotLine = 'leaf-slot-line',
  Cord = 'leaf-cord',
  Size = 'leaf-size',
  Slot = 'leaf-slot',
  Knit = 'leaf-knit',
}

export type LeafBandSlot = {
  mark: number
  line: number
}

export type LeafBand = {
  base: LeafBandSlot
  head: LeafBandSlot
}

export type LeafComb = LeafBase & {
  form: LeafName.Comb
}

export type LeafSize = LeafBase & {
  form: LeafName.Size
}

export type LeafRiseHold = LeafBase & {
  form: LeafName.RiseHold
}

export type LeafFallHold = LeafBase & {
  form: LeafName.FallHold
}

export type LeafRiseText = LeafBase & {
  form: LeafName.RiseText
}

export type LeafSlot = LeafBase & {
  form: LeafName.Slot
}

export type LeafFallText = LeafBase & {
  form: LeafName.FallText
}

export type LeafRiseNick = LeafBase & {
  form: LeafName.RiseNick
}

export type LeafFallNick = LeafBase & {
  form: LeafName.FallNick
}

export type LeafLink = LeafBase & {
  form: LeafName.Link
}

export type LeafCode = LeafBase & {
  form: LeafName.Code
}

export type LeafNote = LeafBase & {
  form: LeafName.Note
}

export type LeafSlotLine = LeafBase & {
  form: LeafName.SlotLine
}

export type LeafCord = LeafBase & {
  form: LeafName.Cord
}

export type LeafKnit = LeafBase & {
  form: LeafName.Knit
}

export type LeafCallTree = {
  file: string
  text: string
}

export type LeafBase = {
  band: LeafBand
  text: string
  // linked list
  back?: Leaf
  head?: Leaf
}

export type LeafSeed = {
  test: RegExp
}

export type LeafCallCast = LeafCallTree & {
  head?: Leaf
  lineText: Array<string>
}

export type Leaf =
  | LeafFallNick
  | LeafFallHold
  | LeafFallText
  | LeafLink
  | LeafNote
  | LeafComb
  | LeafCode
  | LeafRiseNick
  | LeafRiseHold
  | LeafRiseText
  | LeafSlotLine
  | LeafCord
  | LeafSize
  | LeafSlot
  | LeafKnit
