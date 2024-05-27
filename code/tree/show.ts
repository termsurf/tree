import { Tree, TreeName } from './form.js'

export function showTreeLine(base: Tree): string {
  const list: Array<string> = ['']

  showTreeTreeBase(base).forEach(line => {
    list.push(`${line}`)
  })

  // console.log(JSON.stringify(base, null, 2))

  list.push('')

  return list.join('\n')
}

// export function showParserMesh(base: Tree): string {
//   const list: Array<string> = ['']

//   showParserMeshDetails(base).forEach(line => {
//     list.push(`  ${line}`)
//   })

//   list.push('')

//   return list.join('\n')
// }

function showTreeTreeBase(
  seed: Tree,
  flat = false,
  nestSize = 0,
): Array<string> {
  const list: Array<string> = []

  switch (seed.form) {
    case TreeName.Line: {
      seed.nest.forEach(seed => {
        list.push(...showTreeTreeBase(seed))
      })
      break
    }
    case TreeName.Cord: {
      list.push(seed.leaf.text)
      break
    }
    case TreeName.Fork: {
      const head: Array<string> = []
      const nestHead = seed.nest[0]
      if (nestHead) {
        showTreeTreeBase(nestHead, true, nestSize).forEach(line => {
          head.push(`${line}`)
        })
      }

      const nest: Array<string> = []
      seed.nest.slice(1).forEach(el => {
        showTreeTreeBase(el, flat, nestSize + 1).forEach(line => {
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
    case TreeName.Size: {
      list.push(`${seed.bond}`)
      break
    }
    case TreeName.Text: {
      const string: Array<string> = []
      seed.nest.forEach(seg => {
        showTreeTreeBase(seg, true, nestSize + 1).forEach(line => {
          string.push(`${line}`)
        })
      })
      list.push(`<${string.join('')}>`)
      break
    }
    case TreeName.Nick: {
      if (seed.nest) {
        const plugin: Array<string> = []
        showTreeTreeBase(seed.nest, true, nestSize + 1).forEach(
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
    case TreeName.Comb: {
      list.push(`${seed.bond}`)
      break
    }
    case TreeName.Code: {
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
    case TreeName.Knit: {
      const line: Array<string> = []
      seed.nest.forEach((seg, i) => {
        showTreeTreeBase(seg, true, nestSize + 1).forEach(l => {
          if (i > 0 && seg.form !== TreeName.Nick) {
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

// function showParserMeshDetails(seed: Tree): Array<string> {
//   const list: Array<string> = []

//   const title = chalk.white(seed.form)

//   switch (seed.form) {
//     case TreeName.Text: {
//       list.push(`${title} ${chalk.green(seed.bond)}`)
//       break
//     }
//     case TreeName.Line: {
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
//     case TreeName.Size: {
//       list.push(`${title} ${seed.bond}`)
//       break
//     }
//     case TreeName.Text: {
//       list.push(`${title}`)
//       seed.list.forEach(seg => {
//         showParserMeshDetails(seg).forEach(line => {
//           list.push(`  ${line}`)
//         })
//       })
//       break
//     }
//     case TreeName.Nick: {
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
//     case TreeName.Cull: {
//       list.push(`${title}`)
//       list.push(chalk.gray(`  nest:`))
//       seed.nest.forEach(nest => {
//         showParserMeshDetails(nest).forEach(line => {
//           list.push(`    ${line}`)
//         })
//       })
//       break
//     }
//     case TreeName.Comb: {
//       list.push(`${title} ${seed.bond}`)
//       break
//     }
//     case TreeName.Code: {
//       list.push(`${title} #${seed.system}${seed.code}`)
//       break
//     }
//     case TreeName.Term: {
//       list.push(`${title}`)
//       seed.list.forEach(seg => {
//         showParserMeshDetails(seg).forEach(line => {
//           list.push(`  ${line}`)
//         })
//       })
//       break
//     }
//     case TreeName.Line: {
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
