export {};
// export function logDirectionList(foldList: Array<Fold>): Array<string> {
//   const tree: Array<string> = ['']
//   let textSlot = 1
//   let yay = 0
//   let nay = 0
//   foldList.forEach(direction => {
//     let color = chalk.gray
//     let diff = 0
//     let type = 'neutral'
//     if (direction.form.match('open')) {
//       textSlot++
//       yay++
//       color = chalk.green
//       type = 'open'
//     } else if (direction.form.match('fall')) {
//       diff = -1
//       nay++
//       color = chalk.yellow
//       type = 'fall'
//     }
//     const textSlotText = new Array(
//       Math.max(0, type.match(/open|fall/) ? textSlot : textSlot + 1),
//     ).join('  ')
//     const value = chalk.whiteBright(
//       'value' in direction
//         ? direction.value
//         : 'text' in direction
//         ? direction.text
//         : '',
//     )
//     const symbol = chalk.gray(
//       '', // type === 'fall' ? nay : type === 'open' ? yay : '',
//     )
//     tree.push(
//       `  ${textSlotText}${color(direction.form)} ${value} ${symbol}`,
//     )
//     textSlot += diff
//   })
//   tree.push('')
//   return tree
// }
//# sourceMappingURL=show.js.map