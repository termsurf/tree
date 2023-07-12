import { Sift } from './form.js'

export default function show(foldList: Array<Sift>) {
  const list: Array<string> = []

  let move = 0

  foldList.forEach(fold => {
    if (fold.form.match('rise')) {
      list.push(
        `${makeTextMove(move++)}${fold.form.slice(5)}+ ${
          ('leaf' in fold &&
            fold.leaf &&
            'text' in fold.leaf &&
            lead(fold.leaf.text)) ||
          ''
        }`,
      )
    } else if (fold.form.match('fall')) {
      list.push(
        `${makeTextMove(--move)}${fold.form.slice(5)}- ${
          ('leaf' in fold &&
            fold.leaf &&
            'text' in fold.leaf &&
            lead(fold.leaf.text)) ||
          ''
        }`,
      )
    } else {
      list.push(
        `${makeTextMove(move)}[${fold.form.slice(5)}] ${
          ('leaf' in fold &&
            fold.leaf &&
            'text' in fold.leaf &&
            lead(fold.leaf.text)) ||
          ''
        }`,
      )
    }
  })

  return list.join('\n')
}

function makeTextMove(move: number) {
  return new Array(Math.max(0, move + 1)).join('  ')
}

function lead(text: string) {
  return text.replace(/\n/g, '\\n')
  // .replace(/^ +/g, _ =>
  //   _.split('')
  //     .map(x => `\\s`)
  //     .join(''),
  // )
}
