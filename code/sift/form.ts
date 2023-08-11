import type {
  LeafCallCast,
  LeafFallNick,
  LeafFallText,
  LeafNote,
  LeafComb,
  LeafCode,
  LeafRiseNick,
  LeafRiseText,
  LeafCord,
  LeafSize,
  LeafSlot,
  LeafSlotLine,
} from '../leaf/form.js'
import haveHalt from '@nerdbond/have/halt.js'

export enum SiftName {
  FallNest = 'sift-fall-nest',
  FallNick = 'sift-fall-nick',
  FallText = 'sift-fall-text',
  FallLine = 'sift-fall-line',
  Note = 'sift-note',
  Comb = 'sift-comb',
  Code = 'sift-code',
  RiseNest = 'sift-rise-nest',
  RiseNick = 'sift-rise-nick',
  RiseText = 'sift-rise-text',
  RiseLine = 'sift-rise-line',
  Cord = 'sift-cord',
  Size = 'sift-size',
  RiseFork = 'sift-rise-fork',
  FallFork = 'sift-fall-fork',
  RiseKnit = 'sift-rise-knit',
  FallKnit = 'sift-fall-knit',
}

export type SiftHash = {
  'sift-fall-nest': SiftFallNest
  'sift-fall-nick': SiftFallNick
  'sift-fall-text': SiftFallText
  'sift-note': SiftNote
  'sift-comb': SiftComb
  'sift-code': SiftCode
  'sift-rise-nest': SiftRiseNest
  'sift-rise-nick': SiftRiseNick
  'sift-rise-text': SiftRiseText
  'sift-cord': SiftCord
  'sift-size': SiftSize
  // this should be called fork
  'sift-rise-fork': SiftRiseFork
  'sift-fall-fork': SiftFallFork
  'sift-rise-knit': SiftRiseKnit
  'sift-fall-knit': SiftFallKnit
  'sift-rise-line': SiftRiseLine
  'sift-fall-line': SiftFallLine
}

export type SiftRiseLine = {
  form: SiftName.RiseLine
}

export type SiftFallLine = {
  form: SiftName.FallLine
}

export type SiftRiseKnit = {
  form: SiftName.RiseKnit
}

export type SiftFallKnit = {
  form: SiftName.FallKnit
}

export type SiftRiseFork = {
  form: SiftName.RiseFork
  leaf?: LeafSlot | LeafSlotLine
}

export type SiftFallFork = {
  form: SiftName.FallFork
}

export type SiftFallNest = {
  form: SiftName.FallNest
}

export type SiftFallNick = {
  form: SiftName.FallNick
  leaf: LeafFallNick
}

export type SiftFallText = {
  form: SiftName.FallText
  leaf: LeafFallText
}

export type SiftNote = {
  form: SiftName.Note
  leaf: LeafNote
}

export type SiftComb = {
  form: SiftName.Comb
  bond: number
  leaf: LeafComb
}

export type SiftCode = {
  bond: number
  mold: string
  form: SiftName.Code
  leaf: LeafCode
}

export type Sift =
  | SiftFallNick
  // can get rid of nest, and use fork instead
  | SiftRiseNest
  | SiftFallNest
  | SiftFallText
  | SiftNote
  | SiftComb
  | SiftCode
  | SiftRiseNick
  | SiftRiseText
  | SiftCord
  | SiftSize
  | SiftRiseFork
  | SiftFallFork
  | SiftRiseKnit
  | SiftFallKnit
  | SiftRiseLine
  | SiftFallLine

export type SiftRiseNest = {
  form: SiftName.RiseNest
}

export type SiftRiseNick = {
  size: number
  form: SiftName.RiseNick
  leaf: LeafRiseNick
}

export type SiftRiseText = {
  form: SiftName.RiseText
  leaf: LeafRiseText
}

export type SiftCallCast = LeafCallCast & {
  siftList: Array<Sift>
}

export type SiftCord = {
  form: SiftName.Cord
  leaf: LeafCord
}

export type SiftSize = {
  form: SiftName.Size
  bond: number
  leaf: LeafSize
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
