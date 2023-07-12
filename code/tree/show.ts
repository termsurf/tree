import { Link, LinkName } from './form.js'
import tint from '@tunebond/tint-text'

const G = { tone: 'green' }

export function showLinkTree(base: Link): string {
  const list: Array<string> = ['']

  showLinkTreeBase(base).forEach(line => {
    list.push(`${line}`)
  })

  // console.log(JSON.stringify(base, null, 2))

  list.push('')

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
      seed.nest.forEach(seed => {
        list.push(...showLinkTreeBase(seed))
      })
      break
    }
    case LinkName.Cord: {
      list.push(seed.leaf.text)
      break
    }
    case LinkName.Fork: {
      const head: Array<string> = []
      const nestHead = seed.nest[0]
      if (nestHead) {
        showLinkTreeBase(nestHead, true, nestSize).forEach(line => {
          head.push(`${line}`)
        })
      }

      const nest: Array<string> = []
      seed.nest.slice(1).forEach(el => {
        showLinkTreeBase(el, flat, nestSize + 1).forEach(line => {
          nest.push(`${line}`)
        })
      })

      if (flat) {
        const text = nest.join(', ').trim()
        if (text) {
          list.push(`${head.join('')}(${text})`)
        } else {
          list.push(`${head.join('')}`)
        }
      } else {
        list.push(...head)
        nest.forEach(line => {
          if (line) {
            list.push(`  ${line}`)
          }
        })
      }
      break
    }
    case LinkName.Size: {
      list.push(`${seed.bond}`)
      break
    }
    case LinkName.Text: {
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
    case LinkName.Comb: {
      list.push(`${seed.bond}`)
      break
    }
    case LinkName.Code: {
      switch (seed.mold) {
        case 'b':
          list.push(`#${seed.mold}${seed.bond.toString(2)}`)
          break
        case 'o':
          list.push(`#${seed.mold}${seed.bond.toString(8)}`)
          break
        case 'x':
          list.push(`#${seed.mold}${seed.bond.toString(16)}`)
          break
        default:
          list.push(
            `#${seed.mold}${seed.bond.toString(parseInt(seed.mold))}`,
          )
          break
      }
      break
    }
    case LinkName.Knit: {
      const line: Array<string> = []
      seed.nest.forEach((seg, i) => {
        showLinkTreeBase(seg, true, nestSize + 1).forEach(l => {
          if (i > 0 && seg.form !== LinkName.Nick) {
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
