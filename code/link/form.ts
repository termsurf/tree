import type { Rank } from '../mark/index.js'
import haveHalt from '@tunebond/have/halt.js'

export enum LinkHint {
  // Code = 'code',
  // nick == interpolated == dynamic
  NickKnit = 'nick-line',
  NickText = 'nick-text',
  Void = 'void',
  // Size = 'size',
  // SideSize = 'side-size',
  Knit = 'line',
  Text = 'text',
}

export enum LinkName {
  Wave = 'link-wave',
  Comb = 'link-comb',
  Code = 'link-code',
  Cull = 'link-cull',
  Knit = 'link-knit',
  Nick = 'link-nick',
  SideSize = 'link-side-size',
  Text = 'link-text',
  Cord = 'link-cord',
  Tree = 'link-tree',
  Size = 'link-size',
}

export type LinkHash = {
  'link-wave': LinkWave
  'link-comb': LinkComb
  'link-code': LinkCode
  'link-cull': LinkCull
  'link-knit': LinkKnit
  'link-nick': LinkNick
  'link-side-size': LinkSideSize
  'link-cord': LinkCord
  'link-text': LinkText
  'link-tree': LinkTree
  'link-size': LinkSize
}

export const LINK_TYPE = [
  LinkName.Wave,
  LinkName.Comb,
  LinkName.Code,
  LinkName.Cull,
  LinkName.Knit,
  LinkName.Nick,
  LinkName.SideSize,
  LinkName.Text,
  LinkName.Cord,
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
  rank?: Rank
}

export type LinkComb = {
  rank?: Rank
  form: LinkName.Comb
  bond: number
}

export type LinkCode = {
  bond: string
  rank?: Rank
  mold: string
  form: LinkName.Code
}

export type LinkCull = {
  head?: LinkTree | LinkBond
  base?: LinkKnit
  form: LinkName.Cull
  rank?: Rank
}

export type LinkKnit = {
  base?: LinkTree
  list: Array<LinkCull | LinkNick | LinkCord>
  form: LinkName.Knit
  rank?: Rank
}

export type LinkNick = {
  head?: LinkTree
  base?: LinkKnit | LinkText
  size: number
  form: LinkName.Nick
  rank?: Rank
}

export type LinkSideSize = {
  rank?: Rank
  form: LinkName.SideSize
  bond: number
}

export type LinkCord = {
  rank?: Rank
  form: LinkName.Cord
  bond: string
}

export type LinkText = {
  nest: Array<LinkCord | LinkNick>
  form: LinkName.Text
  rank?: Rank
}

export type LinkSize = {
  form: LinkName.Size
  bond: number
}

export type LinkBond =
  | LinkSize
  | LinkText
  | LinkSideSize
  | LinkCode
  | LinkComb
  | LinkWave
  | LinkCord

export type Link =
  | LinkText
  | LinkTree
  | LinkSize
  | LinkSideSize
  | LinkText
  | LinkCord
  | LinkNick
  | LinkCull
  | LinkComb
  | LinkCode
  | LinkKnit
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
