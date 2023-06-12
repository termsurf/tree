import { Fold } from './form.js'

export default function show(foldList: Array<Fold>) {
  const list: Array<string> = []

  let move = 0

  foldList.forEach(fold => {
    if (fold.form.match('rise')) {
      list.push(
        `${makeTextMove(move++)}${fold.form}+ ${fold.text ?? ''}`,
      )
    } else if (fold.form.match('fall')) {
      list.push(
        `${makeTextMove(--move)}${fold.form}- ${fold.text ?? ''}`,
      )
    } else {
      list.push(
        `${makeTextMove(move)}[${fold.form}] ${fold.text ?? ''}`,
      )
    }
  })

  return list.join('\n')
}

function makeTextMove(move: number) {
  return new Array(Math.max(0, move + 1)).join('  ')
}
