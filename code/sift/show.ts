import { Sift } from './form.js'

export default function show(foldList: Array<Sift>) {
  const list: Array<string> = []

  let move = 0

  foldList.forEach(fold => {
    if (fold.form.match('rise')) {
      list.push(
        `${makeTextMove(move++)}${fold.form}+ ${
          ('text' in fold && fold.text) ?? ''
        }`,
      )
    } else if (fold.form.match('fall')) {
      list.push(
        `${makeTextMove(--move)}${fold.form}- ${
          ('text' in fold && fold.text) ?? ''
        }`,
      )
    } else {
      list.push(
        `${makeTextMove(move)}[${fold.form}] ${
          ('text' in fold && fold.text) ?? ''
        }`,
      )
    }
  })

  return list.join('\n')
}

function makeTextMove(move: number) {
  return new Array(Math.max(0, move + 1)).join('  ')
}
