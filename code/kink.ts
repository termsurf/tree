import Kink from '@tunebond/kink'
import { makeKinkText } from '@tunebond/kink-text'
import tint from '@tunebond/tint-text'
import { LeafBand } from './leaf/form.js'
import { haveText } from '@tunebond/have'
import { isNode } from 'browser-or-node'

const VIEW_SIZE = (isNode ? process.stdout.columns : 80) ?? 80

const host = '@tunebond/link'

type Base = {
  syntax_error: {
    take: {
      file: string
      text: Array<string>
      band: LeafBand
    }
    base: {
      file: string
      band: LeafBand
      hint?: string
    }
    fill: {
      text: string
    }
  }
  not_implemented: {
    take: {
      file: string
      form: string
    }
  }
  invalid_nesting: {
    take: {
      file: string
      text: Array<string>
      band: LeafBand
      hint?: string
    }
    base: {
      file: string
      band: LeafBand
      hint?: string
    }
    fill: {
      text: string
    }
  }
  invalid_indentation: {
    take: {
      file: string
      text: Array<string>
      band: LeafBand
      hint?: string
    }
    base: {
      file: string
      band: LeafBand
      hint?: string
    }
    fill: {
      text: string
    }
  }
}

type Name = keyof Base

Kink.base(
  host,
  'syntax_error',
  (take: Base['syntax_error']['take']) => ({
    code: 1,
    note: 'Error in the structure of the LinkText Tree',
  }),
)

Kink.load(
  host,
  'syntax_error',
  (take: Base['syntax_error']['take']) => ({
    file: take.file,
    band: take.band,
  }),
)

Kink.fill(
  host,
  'syntax_error',
  (
    take: Base['syntax_error']['take'],
    base: Base['syntax_error']['base'],
  ) => ({
    file: `${base.file}:${base.band.base.line + 1}:${
      base.band.base.mark + 1
    }`,
    text: makeShowText(take.text, take.band),
  }),
)

Kink.base(
  host,
  'invalid_nesting',
  (take: Base['invalid_nesting']['take']) => ({
    code: 2,
    note: 'The Link Tree has invalid nesting',
  }),
)

Kink.load(
  host,
  'invalid_nesting',
  (take: Base['invalid_nesting']['take']) => ({
    file: take.file,
    band: take.band,
    hint: take.hint,
  }),
)

Kink.fill(
  host,
  'invalid_nesting',
  (
    take: Base['invalid_nesting']['take'],
    base: Base['invalid_nesting']['base'],
  ) => ({
    file: `${base.file}:${base.band.base.line + 1}:${
      base.band.base.mark + 1
    }`,
    text: makeShowText(take.text, take.band),
    hint: take.hint,
  }),
)

Kink.base(
  host,
  'invalid_indentation',
  (take: Base['invalid_indentation']['take']) => ({
    code: 3,
    note: 'The Link Tree has invalid indentation',
  }),
)

Kink.load(
  host,
  'invalid_indentation',
  (take: Base['invalid_indentation']['take']) => ({
    file: take.file,
    band: take.band,
    hint: take.hint,
  }),
)

Kink.fill(
  host,
  'invalid_indentation',
  (
    take: Base['invalid_indentation']['take'],
    base: Base['invalid_indentation']['base'],
  ) => ({
    file: `${base.file}:${base.band.base.line + 1}:${
      base.band.base.mark + 1
    }`,
    text: makeShowText(take.text, take.band),
    hint: take.hint,
  }),
)

Kink.base(host, 'not_implemented', () => ({
  code: 2,
  note: `This feature hasn't been implemented yet`,
}))

Kink.load(
  host,
  'not_implemented',
  (link: Base['not_implemented']['take']) => ({
    file: link.file,
    form: link.form,
  }),
)

Kink.code(host, (code: number) => code.toString(16).padStart(4, '0'))

export default function makeBase<N extends Name>(
  form: N,
  link?: Base[N]['take'],
) {
  return Kink.make(host, form, link)
}

export function makeFill<N extends Name>(
  form: N,
  link?: Base[N]['take'],
) {
  return Kink
}

export { makeKinkText }

export function makeShowText(
  lineText: Array<string>,
  band: LeafBand,
): string {
  const headLine = Math.min(band.base.line + 4, lineText.length - 1)
  const headLineString = lineText[headLine]
  haveText(headLineString, `text[${headLine}]`)

  const headMark = headLineString.length - 1
  const bindBand: LeafBand = {
    head: {
      mark: headMark,
      line: headLine,
    },
    base: {
      mark: 0,
      line: Math.max(0, band.base.line - 4),
    },
  }

  const text = makeBandText(bindBand, lineText, band)

  return text
}

export function makeBandText(
  bond: LeafBand,
  lineText: Array<string>,
  band: LeafBand,
): string {
  const lineList: Array<string> = []
  let i = bond.base.line
  let n = bond.head.line
  let pad = String(n + 1).length
  const defaultIndent = new Array(pad + 1).join(' ')
  const W = { tone: 'white' }
  const WB = { tone: 'whiteBright' }
  const R = { tone: 'red' }
  lineList.push(tint(`${defaultIndent} |`, W))

  while (i <= n) {
    let line = lineText[i]
    haveText(line, 'line')
    const x = i + 1
    let z = x.toString().padStart(pad, ' ')

    if (band.base.line === i) {
      let size = z.length + 3 + line.length
      let diff = size > VIEW_SIZE ? size - VIEW_SIZE : 0
      line = line.slice(0, line.length - diff)
      const a = line.slice(0, band.base.mark)
      const b = line.slice(band.base.mark, band.head.mark)
      const c = line.slice(band.head.mark)
      lineList.push(tint(`${z} | ${a}${tint(b, R)}${c}`, WB))
      const indentA = new Array(z.length + 1).join(' ')
      const indentB = new Array(band.base.mark + 1).join(' ')
      let haltText = new Array(
        band.head.mark - band.base.mark + 1,
      ).join('~')
      size = indentA.length + 3 + indentB.length + haltText.length
      diff = size > VIEW_SIZE ? size - VIEW_SIZE : 0
      haltText = haltText.slice(0, haltText.length - diff)
      lineList.push(
        tint(`${indentA} | ${indentB}`, W) + tint(`${haltText}`, R),
      )
    } else {
      let size = z.length + 3 + line.length
      let diff = size > VIEW_SIZE ? size - VIEW_SIZE : 0
      line = line.slice(0, line.length - diff)
      lineList.push(tint(`${z} | ${line}`, W))
    }
    i++
  }

  lineList.push(tint(`${defaultIndent} |`, W))

  return lineList.join('\n')
}
