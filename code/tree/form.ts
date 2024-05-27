import type { Leaf } from '../leaf/form.js'
import haveHalt from '@termsurf/have/make/halt.js'

export enum TreeHint {
  // Code = 'code',
  // nick == interpolated == dynamic
  NickKnit = 'nick-knit',
  NickText = 'nick-text',
  Void = 'void',
  // Size = 'size',
  Knit = 'knit',
  Text = 'text',
}

export enum TreeName {
  Comb = 'tree-comb',
  Code = 'tree-code',
  Knit = 'tree-knit',
  Nick = 'tree-nick',
  Text = 'tree-text',
  Cord = 'tree-cord',
  Fork = 'tree-fork',
  Size = 'tree-size',
  Line = 'tree-line',
}

export type TreeHash = {
  'tree-comb': TreeComb
  'tree-code': TreeCode
  'tree-knit': TreeKnit
  'tree-nick': TreeNick
  'tree-cord': TreeCord
  'tree-text': TreeText
  'tree-fork': TreeFork
  'tree-size': TreeSize
  'tree-line': TreeLine
}

export const TREE_FORM = [
  TreeName.Comb,
  TreeName.Code,
  TreeName.Knit,
  TreeName.Nick,
  TreeName.Text,
  TreeName.Cord,
  TreeName.Fork,
  TreeName.Size,
  TreeName.Line,
]

export type TreeCallCast = {
  tree: TreeLine
}

export type TreeFold = {
  base?: Leaf
  head?: Leaf
}

export type TreeLine = {
  nest: Array<TreeFork>
  form: TreeName.Line
}

export type TreeFork = {
  fold?: TreeFold
  nest: Array<
    | TreeText
    | TreeFork
    | TreeSize
    | TreeText
    | TreeCord
    | TreeNick
    | TreeComb
    | TreeCode
    | TreeKnit
  >
  base?: TreeFork | TreeNick
  form: TreeName.Fork
}

export type TreeComb = {
  form: TreeName.Comb
  bond: number
  base?: TreeFork
  leaf: Leaf
}

export type TreeCode = {
  bond: number
  mold: string
  base?: TreeFork
  form: TreeName.Code
  leaf: Leaf
}

export type TreeKnit = {
  base?: TreeFork
  nest: Array<TreeNick | TreeCord>
  form: TreeName.Knit
  fold?: TreeFold
}

export type TreeNick = {
  nest?: TreeFork
  base?: TreeKnit | TreeText
  size: number
  form: TreeName.Nick
  fold?: TreeFold
}

export type TreeCord = {
  form: TreeName.Cord
  base?: TreeText | TreeKnit
  leaf: Leaf
}

/**
 * This gets a base and head leaf,
 * so we know where it starts and ends easily.
 */

export type TreeText = {
  nest: Array<TreeCord | TreeNick>
  form: TreeName.Text
  base?: TreeFork
  fold?: TreeFold
}

export type TreeSize = {
  form: TreeName.Size
  bond: number
  base?: TreeFork
  leaf: Leaf
}

export type Tree =
  | TreeComb
  | TreeCode
  | TreeKnit
  | TreeNick
  | TreeCord
  | TreeText
  | TreeFork
  | TreeSize
  | TreeLine

export function testTreeForm<N extends TreeName>(
  lead: unknown,
  name: N,
): lead is TreeHash[N] {
  return (lead as Tree).form === name
}

export function haveTreeForm<N extends TreeName>(
  lead: unknown,
  name: N,
): asserts lead is TreeHash[N] {
  if (!testTreeForm(lead, name)) {
    throw haveHalt('form_miss', { call: name, need: 'tree' })
  }
}

export function testTree(lead: unknown): lead is Tree {
  return TREE_FORM.includes((lead as Tree).form)
}

export function haveTree(
  lead: unknown,
  call: string,
): asserts lead is Tree {
  if (!testTree(lead)) {
    throw haveHalt('form_miss', { call, need: 'tree' })
  }
}
