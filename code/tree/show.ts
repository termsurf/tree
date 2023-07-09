import { Link, LinkName } from './form.js'
import tint from '@tunebond/tint-text'

const G = { tone: 'green' }

export function showLinkTree(base: Link): string {
  const list: Array<string> = ['']

  showLinkTreeBase(base).forEach(line => {
    list.push(`${line}`)
  })

  list.push('')

  console.log(list)
  return list.join('\n')
}

// export function showParserMesh(base: Link): string {
//   const list: Array<string> = ['']

//   showParserMeshDetails(base).forEach(line => {
//     list.push(`  ${line}`)
//   })

//   list.push('')

//   return list.join('\n')
// }

function showLinkTreeBase(
  seed: Link,
  flat = false,
  nestSize = 0,
): Array<string> {
  const list: Array<string> = []

  switch (seed.form) {
    case LinkName.Tree: {
      list.push(...showLinkTreeBase(seed.nest))
      break
    }
    case LinkName.Cord: {
      console.log(`${move(nestSize)}cord`, seed.leaf.text)
      list.push(seed.leaf.text)
      break
    }
    case LinkName.Fork: {
      console.log(`${move(nestSize)}tree`)
      const head: Array<string> = []
      // if (seed.head) {
      //   showLinkTreeBase(seed.head, flat).forEach(line => {
      //     head.push(`${line}`)
      //   })
      // }
      const nest: Array<string> = []
      seed.nest.forEach(el => {
        showLinkTreeBase(el, flat, nestSize + 1).forEach(line => {
          nest.push(`${line}`)
        })
      })

      if (flat) {
        const text = nest.join(', ')
        if (text) {
          list.push(`${text}`)
        }
      } else {
        // list.push(`${head.join('')}`)
        nest.forEach(line => {
          if (line) {
            list.push(`  ${line}`)
          }
        })
      }
      break
    }
    case LinkName.Size: {
      console.log(`${move(nestSize)}size`)
      list.push(tint(`${seed.bond}`, G))
      break
    }
    case LinkName.Text: {
      console.log(`${move(nestSize)}text`)
      const string: Array<string> = []
      seed.nest.forEach(seg => {
        showLinkTreeBase(seg, true, nestSize + 1).forEach(line => {
          string.push(`${line}`)
        })
      })
      list.push(`<${string.join('')}>`)
      break
    }
    case LinkName.Nick: {
      console.log(`${move(nestSize)}nick`)
      if (seed.nest) {
        const plugin: Array<string> = []
        showLinkTreeBase(seed.nest, true, nestSize + 1).forEach(
          line => {
            plugin.push(`${line}`)
          },
        )
        const text = plugin.join('')
        if (text) {
          list.push(
            '{'.repeat(seed.size) + text + '}'.repeat(seed.size),
          )
        }
      }
      break
    }
    case LinkName.Cull: {
      console.log(`${move(nestSize)}cull`)
      const slot: Array<string> = []
      if (seed.nest) {
        showLinkTreeBase(seed.nest, true, nestSize + 1).forEach(
          line => {
            slot.push(`${line}`)
          },
        )
      }
      const text = slot.join('')
      if (text) {
        list.push('[' + text + ']')
      }
      break
    }
    case LinkName.Comb: {
      console.log(`${move(nestSize)}comb`)
      list.push(`${seed.bond}`)
      break
    }
    case LinkName.Code: {
      console.log(`${move(nestSize)}code`)
      list.push(`#${seed.mold}${seed.bond}`)
      break
    }
    case LinkName.Knit: {
      console.log(`${move(nestSize)}knit`)
      const line: Array<string> = []
      seed.nest.forEach((seg, i) => {
        showLinkTreeBase(seg, true, nestSize + 1).forEach(l => {
          if (
            i > 0 &&
            seg.form !== LinkName.Cull &&
            seg.form !== LinkName.Nick
          ) {
            line.push('')
          }
          line.push(l)
        })
      })
      const text = line.join('')
      if (text) {
        list.push(text)
      }
      break
    }
    default:
      throw new Error()
  }

  return list
}

// function showParserMeshDetails(seed: Link): Array<string> {
//   const list: Array<string> = []

//   const title = chalk.white(seed.form)

//   switch (seed.form) {
//     case LinkName.Text: {
//       list.push(`${title} ${chalk.green(seed.bond)}`)
//       break
//     }
//     case LinkName.Tree: {
//       list.push(`${title}`)
//       if (seed.head) {
//         list.push(chalk.gray(`  head:`))
//         showParserMeshDetails(seed.head).forEach(line => {
//           list.push(`    ${line}`)
//         })
//       } else {
//         list.push(chalk.gray('  hook: undefined'))
//       }
//       if (seed.nest.length) {
//         list.push(chalk.gray(`  nest:`))
//         seed.nest.forEach(el => {
//           showParserMeshDetails(el).forEach(line => {
//             list.push(`    ${line}`)
//           })
//         })
//       }
//       break
//     }
//     case LinkName.Size: {
//       list.push(`${title} ${seed.bond}`)
//       break
//     }
//     case LinkName.Text: {
//       list.push(`${title}`)
//       seed.list.forEach(seg => {
//         showParserMeshDetails(seg).forEach(line => {
//           list.push(`  ${line}`)
//         })
//       })
//       break
//     }
//     case LinkName.Nick: {
//       list.push(`${title}`)
//       list.push(chalk.gray(`  size: ${seed.size}`))
//       if (seed.nest.length) {
//         list.push(chalk.gray(`  nest:`))
//         seed.nest.forEach(nest => {
//           showParserMeshDetails(nest).forEach(line => {
//             list.push(`    ${line}`)
//           })
//         })
//       }
//       break
//     }
//     case LinkName.Cull: {
//       list.push(`${title}`)
//       list.push(chalk.gray(`  nest:`))
//       seed.nest.forEach(nest => {
//         showParserMeshDetails(nest).forEach(line => {
//           list.push(`    ${line}`)
//         })
//       })
//       break
//     }
//     case LinkName.Comb: {
//       list.push(`${title} ${seed.bond}`)
//       break
//     }
//     case LinkName.Code: {
//       list.push(`${title} #${seed.system}${seed.code}`)
//       break
//     }
//     case LinkName.Term: {
//       list.push(`${title}`)
//       seed.list.forEach(seg => {
//         showParserMeshDetails(seg).forEach(line => {
//           list.push(`  ${line}`)
//         })
//       })
//       break
//     }
//     case LinkName.Line: {
//       list.push(`${title}`)
//       seed.list.forEach(seg => {
//         showParserMeshDetails(seg).forEach(line => {
//           list.push(`  ${line}`)
//         })
//       })
//       break
//     }
//     default:
//       throw kink('not_implemented', { form: undefined)
//   file: }

//   return list
// }

function move(size: number) {
  return new Array(size + 1).join('  ')
}
