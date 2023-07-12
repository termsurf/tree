import type { Leaf } from '../leaf/form.js'
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
  Comb = 'link-comb',
  Code = 'link-code',
  Knit = 'link-knit',
  Nick = 'link-nick',
  Text = 'link-text',
  Cord = 'link-cord',
  Fork = 'link-fork',
  Size = 'link-size',
  Tree = 'link-tree',
}

export type LinkHash = {
  'link-comb': LinkComb
  'link-code': LinkCode
  'link-knit': LinkKnit
  'link-nick': LinkNick
  'link-cord': LinkCord
  'link-text': LinkText
  'link-fork': LinkFork
  'link-size': LinkSize
  'link-tree': LinkTree
}

export const LINK_TYPE = [
  LinkName.Comb,
  LinkName.Code,
  LinkName.Knit,
  LinkName.Nick,
  LinkName.Text,
  LinkName.Cord,
  LinkName.Fork,
  LinkName.Size,
  LinkName.Tree,
]

export type LinkCallCast = {
  tree: LinkTree
}

export type LinkFold = {
  base?: Leaf
  head?: Leaf
}

export type LinkTree = {
  nest: Array<LinkFork>
  form: LinkName.Tree
}

export type LinkFork = {
  fold?: LinkFold
  nest: Array<
    | LinkText
    | LinkFork
    | LinkSize
    | LinkText
    | LinkCord
    | LinkNick
    | LinkComb
    | LinkCode
    | LinkKnit
  >
  base?: LinkFork | LinkNick
  form: LinkName.Fork
}

export type LinkComb = {
  form: LinkName.Comb
  bond: number
  base?: LinkFork
  leaf: Leaf
}

export type LinkCode = {
  bond: number
  mold: string
  base?: LinkFork
  form: LinkName.Code
  leaf: Leaf
}

export type LinkKnit = {
  base?: LinkFork
  nest: Array<LinkNick | LinkCord>
  form: LinkName.Knit
  fold?: LinkFold
}

export type LinkNick = {
  nest?: LinkFork
  base?: LinkKnit | LinkText
  size: number
  form: LinkName.Nick
  fold?: LinkFold
}

export type LinkCord = {
  form: LinkName.Cord
  base?: LinkText | LinkKnit
  leaf: Leaf
}

/**
 * This gets a base and head leaf,
 * so we know where it starts and ends easily.
 */

export type LinkText = {
  nest: Array<LinkCord | LinkNick>
  form: LinkName.Text
  base?: LinkFork
  fold?: LinkFold
}

export type LinkSize = {
  form: LinkName.Size
  bond: number
  base?: LinkFork
  leaf: Leaf
}

export type Link =
  | LinkComb
  | LinkCode
  | LinkKnit
  | LinkNick
  | LinkCord
  | LinkText
  | LinkFork
  | LinkSize
  | LinkTree

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
