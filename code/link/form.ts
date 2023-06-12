import type { Rank } from '../mark/index.js'
import haveHalt from '@tunebond/have/halt.js'

export enum LinkHint {
  // Code = 'code',
  // nick == interpolated == dynamic
  NickLine = 'nick-line',
  NickTerm = 'nick-term',
  NickText = 'nick-text',
  Void = 'void',
  // Size = 'size',
  // SideSize = 'side-size',
  Line = 'line',
  Term = 'term',
  Text = 'text',
}

export enum LinkName {
  Wave = 'link-wave',
  Comb = 'link-comb',
  Code = 'link-code',
  Cull = 'link-cull',
  Line = 'link-line',
  Nick = 'link-nick',
  SideSize = 'link-side-size',
  Text = 'link-text',
  Knit = 'link-knit',
  Tree = 'link-tree',
  Size = 'link-size',
}

export type LinkHash = {
  'link-wave': LinkWave
  'link-comb': LinkComb
  'link-code': LinkCode
  'link-cull': LinkCull
  'link-line': LinkLine
  'link-nick': LinkNick
  'link-side-size': LinkSideSize
  'link-text': LinkText
  'link-knit': LinkKnit
  'link-tree': LinkTree
  'link-size': LinkSize
}

export const LINK_TYPE = [
  LinkName.Wave,
  LinkName.Comb,
  LinkName.Code,
  LinkName.Cull,
  LinkName.Line,
  LinkName.Nick,
  LinkName.SideSize,
  LinkName.Knit,
  LinkName.Text,
  LinkName.Tree,
  LinkName.Size,
]

export type LinkCallCast = {
  linkTree: LinkTree
}

export type LinkTree = {
  nest: Array<Link>
  base?: LinkTree | LinkNick | LinkCull
  form: LinkName.Tree
}

export type LinkWave = {
  form: LinkName.Wave
  bond: boolean
  rank: Rank
}

export type LinkComb = {
  rank: Rank
  form: LinkName.Comb
  bond: number
}

export type LinkCode = {
  bond: string
  rank: Rank
  mold: string
  form: LinkName.Code
}

export type LinkCull = {
  head?: LinkTree | LinkBond
  base?: LinkLine
  form: LinkName.Cull
  rank: Rank
}

export type LinkLine = {
  base?: LinkTree
  list: Array<LinkCull | LinkNick | LinkKnit>
  form: LinkName.Line
  rank: Rank
}

export type LinkNick = {
  head?: LinkTree
  base?: LinkLine | LinkKnit
  size: number
  form: LinkName.Nick
  rank: Rank
}

export type LinkSideSize = {
  rank: Rank
  form: LinkName.SideSize
  bond: number
}

export type LinkText = {
  rank: Rank
  form: LinkName.Text
  bond: string
}

export type LinkKnit = {
  nest: Array<LinkText | LinkNick>
  form: LinkName.Knit
}

export type LinkSize = {
  form: LinkName.Size
  bond: number
}

export type LinkBond =
  | LinkSize
  | LinkKnit
  | LinkSideSize
  | LinkCode
  | LinkComb
  | LinkWave
  | LinkText

export type Link =
  | LinkKnit
  | LinkTree
  | LinkSize
  | LinkSideSize
  | LinkKnit
  | LinkText
  | LinkNick
  | LinkCull
  | LinkComb
  | LinkCode
  | LinkLine
  | LinkWave

export function testLinkForm<N extends LinkName>(
  lead: unknown,
  name: N,
): lead is LinkHash[N] {
  return (lead as Link).form === name
}

export function haveLinkForm<N extends LinkName>(
  lead: unknown,
  name: N,
): asserts lead is LinkHash[N] {
  if (!testLinkForm(lead, name)) {
    throw haveHalt('form_miss', { call: name, need: 'link' })
  }
}

export function testLink(lead: unknown): lead is Link {
  return LINK_TYPE.includes((lead as Link).form)
}

export function haveLink(
  lead: unknown,
  call: string,
): asserts lead is Link {
  if (!testLink(lead)) {
    throw haveHalt('form_miss', { call, need: 'link' })
  }
}
