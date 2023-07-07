import Halt, { Link } from '@tunebond/halt'
import { TONE } from '@tunebond/halt-text'
import tint from '@tunebond/tint'
import { CallCast, Rank, Hunk } from './list/form.js'
import { haveText } from '@tunebond/have'

const host = '@tunebond/link'

type HaveCastBack = {
  cast: CallCast
  back: Hunk
}

const base = {
  text: {
    code: 1,
    link: (link: HaveCastBack) => link,
    note: (link: HaveCastBack) =>
      `Error in the structure of the Link Text tree.`,
  },
}

type Base = typeof base

type Name = keyof Base

export default function halt(form: Name, link: Link<Base, Name>) {
  return new Halt({ base, form, host, link })
}

export function makeTextHalt(
  cast: CallCast,
  back: Hunk,
) {
  const rank: Rank = {
    head: {
      mark: 0,
      line: 0,
    },
    base: {
      mark: 0,
      line: 0,
    },
  }

  rank.base.line = back.rank.base.line
  rank.head.line = back.rank.head.line
  rank.base.mark = back.rank.base.mark
  rank.head.mark = back.rank.head.mark

  const hint = generateHighlightedErrorText(cast.lineText, rank)

  return halt('text', { cast, back })
}

export function generateHighlightedErrorText(
  lineText: Array<string>,
  rank: Rank,
): string {
  const headLine = Math.min(rank.base.line + 2, lineText.length - 1)
  const headLineString = lineText[headLine]
  haveText(headLineString, `text[${headLine}]`)

  const headMark = headLineString.length - 1
  const bindRank: Rank = {
    head: {
      mark: headMark,
      line: headLine,
    },
    base: {
      mark: 0,
      line: Math.max(0, rank.base.line - 2),
    },
  }

  const text = makeRankText(bindRank, lineText, rank)

  return text
}

export function makeRankText(
  bond: Rank,
  lineText: Array<string>,
  rank: Rank,
): string {
  const lineList: Array<string> = []
  let i = bond.base.line
  let n = bond.head.line
  let pad = String(n + 1).length
  const defaultIndent = new Array(pad + 1).join(' ')
  const W = { tone: TONE.fall.base }
  const WB = { tone: TONE.fall.base, bold: true }
  const R = { tone: TONE.fall.red }
  lineList.push(tint(`${defaultIndent} |`, W))

  while (i <= n) {
    const line = lineText[i]
    haveText(line, 'line')
    const x = i + 1
    let z =
      i < line.length ? x.toString().padStart(pad, ' ') : defaultIndent

    if (rank.base.line === i) {
      lineList.push(tint(`${z} | ${line}`, WB))
      const indentA = new Array(z.length + 1).join(' ')
      const indentB = new Array(rank.base.mark + 1).join(' ')
      const haltText = new Array(
        rank.head.mark - rank.base.mark + 1,
      ).join('~')
      lineList.push(
        tint(`${indentA} | ${indentB}`, W) + tint(`${haltText}`, R),
      )
    } else {
      lineList.push(tint(`${z} | ${lineText}`, W))
    }
    i++
  }

  lineList.push(tint(`${defaultIndent} |`, W))

  return lineList.join('\n')
}
