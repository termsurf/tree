import { Link, LinkName } from './form.js'
import tint from '@tunebond/tint'
import { TONE } from '@tunebond/halt-text'
import { haltNotImplemented } from '../halt.js'

const G = { tone: TONE.fall.green }

export function showLinkTree(base: Link): string {
  const text: Array<string> = ['']

  showLinkTreeBase(base).forEach(line => {
    text.push(`${line}`)
  })

  text.push('')

  return text.join('\n')
}

// export function showParserMesh(base: Link): string {
//   const text: Array<string> = ['']

//   showParserMeshDetails(base).forEach(line => {
//     text.push(`  ${line}`)
//   })

//   text.push('')

//   return text.join('\n')
// }

function showLinkTreeBase(node: Link, flat = false): Array<string> {
  const text: Array<string> = []

  switch (node.form) {
    case LinkName.TextLine: {
      text.push(node.bond)
      break
    }
    case LinkName.Tree: {
      const head: Array<string> = []
      if (node.head) {
        showLinkTreeBase(node.head, flat).forEach(line => {
          head.push(`${line}`)
        })
      }
      const nest: Array<string> = []
      node.nest.forEach(el => {
        showLinkTreeBase(el, flat).forEach(line => {
          nest.push(`${line}`)
        })
      })

      if (flat) {
        text.push(`${head.join('')}(${nest.join(', ')})`)
      } else {
        text.push(`${head.join('')}`)
        nest.forEach(line => {
          text.push(`  ${line}`)
        })
      }
      break
    }
    case LinkName.Size: {
      text.push(tint(`${node.bond}`, G))
      break
    }
    case LinkName.Text: {
      const string: Array<string> = []
      node.list.forEach(seg => {
        showLinkTreeBase(seg, true).forEach(line => {
          string.push(`${line}`)
        })
      })
      text.push(`<${string.join('')}>`)
      break
    }
    case LinkName.Nick: {
      if (node.nest.length) {
        const plugin: Array<string> = []
        node.nest.forEach(nest => {
          showLinkTreeBase(nest, true).forEach(line => {
            plugin.push(`${line}`)
          })
        })
        text.push(
          '{'.repeat(node.size) +
            plugin.join('') +
            '}'.repeat(node.size),
        )
      }
      break
    }
    case LinkName.Cull: {
      const slot: Array<string> = []
      node.nest.forEach(nest => {
        showLinkTreeBase(nest, true).forEach(line => {
          slot.push(`${line}`)
        })
      })
      text.push('[' + slot.join('') + ']')
      break
    }
    case LinkName.Comb: {
      text.push(`${node.bond}`)
      break
    }
    case LinkName.Code: {
      text.push(`#${node.base}${node.bond}`)
      break
    }
    case LinkName.Term: {
      const term: Array<string> = []
      node.list.forEach(seg => {
        showLinkTreeBase(seg, true).forEach(line => {
          term.push(line)
        })
      })
      text.push(term.join(''))
      break
    }
    case LinkName.Line: {
      const line: Array<string> = []
      node.list.forEach((seg, i) => {
        showLinkTreeBase(seg, true).forEach(l => {
          if (i > 0 && seg.form !== LinkName.Cull) {
            line.push('/')
          }
          line.push(l)
        })
      })
      text.push(line.join(''))
      break
    }
    default:
      throw haltNotImplemented(node.form, JSON.stringify(node))
  }

  return text
}

// function showParserMeshDetails(node: Link): Array<string> {
//   const text: Array<string> = []

//   const title = chalk.white(node.form)

//   switch (node.form) {
//     case LinkName.Text: {
//       text.push(`${title} ${chalk.green(node.bond)}`)
//       break
//     }
//     case LinkName.Tree: {
//       text.push(`${title}`)
//       if (node.head) {
//         text.push(chalk.gray(`  head:`))
//         showParserMeshDetails(node.head).forEach(line => {
//           text.push(`    ${line}`)
//         })
//       } else {
//         text.push(chalk.gray('  hook: undefined'))
//       }
//       if (node.nest.length) {
//         text.push(chalk.gray(`  nest:`))
//         node.nest.forEach(el => {
//           showParserMeshDetails(el).forEach(line => {
//             text.push(`    ${line}`)
//           })
//         })
//       }
//       break
//     }
//     case LinkName.Size: {
//       text.push(`${title} ${node.bond}`)
//       break
//     }
//     case LinkName.Text: {
//       text.push(`${title}`)
//       node.list.forEach(seg => {
//         showParserMeshDetails(seg).forEach(line => {
//           text.push(`  ${line}`)
//         })
//       })
//       break
//     }
//     case LinkName.Nick: {
//       text.push(`${title}`)
//       text.push(chalk.gray(`  size: ${node.size}`))
//       if (node.nest.length) {
//         text.push(chalk.gray(`  nest:`))
//         node.nest.forEach(nest => {
//           showParserMeshDetails(nest).forEach(line => {
//             text.push(`    ${line}`)
//           })
//         })
//       }
//       break
//     }
//     case LinkName.Cull: {
//       text.push(`${title}`)
//       text.push(chalk.gray(`  nest:`))
//       node.nest.forEach(nest => {
//         showParserMeshDetails(nest).forEach(line => {
//           text.push(`    ${line}`)
//         })
//       })
//       break
//     }
//     case LinkName.Comb: {
//       text.push(`${title} ${node.bond}`)
//       break
//     }
//     case LinkName.Code: {
//       text.push(`${title} #${node.system}${node.code}`)
//       break
//     }
//     case LinkName.Term: {
//       text.push(`${title}`)
//       node.list.forEach(seg => {
//         showParserMeshDetails(seg).forEach(line => {
//           text.push(`  ${line}`)
//         })
//       })
//       break
//     }
//     case LinkName.Line: {
//       text.push(`${title}`)
//       node.list.forEach(seg => {
//         showParserMeshDetails(seg).forEach(line => {
//           text.push(`  ${line}`)
//         })
//       })
//       break
//     }
//     default:
//       throw haltNotImplemented(undefined)
//   }

//   return text
// }
