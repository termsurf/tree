import Kink from '@tunebond/kink'
import { makeKinkText } from '@tunebond/kink-text'
import tint from '@tunebond/tint'
import { Band } from './list/form.js'
import { haveText } from '@tunebond/have'

const host = '@tunebond/link'

type Base = {
  syntax_error: {
    file: string
    text: Array<string>
    band: Band
  }
  not_implemented: {
    file: string
    form: string
  }
}

type Name = keyof Base

Kink.base(host, 'syntax_error', () => ({
  code: 1,
  note: 'Error in the structure of the text tree',
}))

Kink.base(host, 'not_implemented', () => ({
  code: 2,
  note: `This feature hasn't been implemented yet`,
}))

Kink.fill(host, 'syntax_error', (link: Base['syntax_error']) => ({
  file: link.file,
  text: generateHighlightedErrorText(link.text, link.band),
}))

Kink.fill(host, 'not_implemented', (link: Base['not_implemented']) => ({
  file: link.file,
  link: {
    form: link.form,
  },
}))

Kink.code(host, (code: number) => code.toString(16).padStart(4, '0'))

export default function kink<N extends Name>(form: N, link?: Base[N]) {
  return new Kink(Kink.makeBase(host, form, link))
}

export { makeKinkText }

export function generateHighlightedErrorText(
  lineText: Array<string>,
  band: Band,
): string {
  const headLine = Math.min(band.base.line + 2, lineText.length - 1)
  const headLineString = lineText[headLine]
  haveText(headLineString, `text[${headLine}]`)

  const headMark = headLineString.length - 1
  const bindBand: Band = {
    head: {
      mark: headMark,
      line: headLine,
    },
    base: {
      mark: 0,
      line: Math.max(0, band.base.line - 2),
    },
  }

  const text = makeBandText(bindBand, lineText, band)

  return text
}

export function makeBandText(
  bond: Band,
  lineText: Array<string>,
  band: Band,
): string {
  const lineList: Array<string> = []
  let i = bond.base.line
  let n = bond.head.line
  let pad = String(n + 1).length
  const defaultIndent = new Array(pad + 1).join(' ')
  const W = { tone: 'white' }
  const WB = { tone: 'brightWhite' }
  const R = { tone: 'red' }
  lineList.push(tint(`${defaultIndent} |`, W))

  while (i <= n) {
    const line = lineText[i]
    haveText(line, 'line')
    const x = i + 1
    let z =
      i < line.length ? x.toString().padStart(pad, ' ') : defaultIndent

    if (band.base.line === i) {
      lineList.push(tint(`${z} | ${line}`, WB))
      const indentA = new Array(z.length + 1).join(' ')
      const indentB = new Array(band.base.mark + 1).join(' ')
      const haltText = new Array(
        band.head.mark - band.base.mark + 1,
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
