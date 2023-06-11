import assert from 'assert'
import fs from 'fs'
import test from 'node:test'
import { dirname } from 'path'
import stripAnsi from 'strip-ansi'
import { fileURLToPath } from 'url'

import { code } from '~'

import make from '../code/link/index.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename).replace(
  /\/base.link\/host/,
  '/base.link/make',
)

async function start() {
  await code.loadSourceMaps()
  const fixtures = (await fs.promises.readdir(`${__dirname}/file`))
    .filter(x => x.endsWith('.link'))
    .map(x => `${__dirname}/file/${x}`)

  for (const path of fixtures) {
    const localPath = path.replace(`${__dirname}/`, '')
    test(`make ${localPath}`, async () => {
      const content = await fs.promises.readFile(path, 'utf-8')
      const [input, expected] = content
        .split(/\n---\n/)
        .map(x => x.trim())
      assert(input, 'Should have defined initial input')
      assert(expected, 'Should have defined expected output')
      assertParse(path, input, expected)
    })
  }
}

start()

function assertParse(path: string, input: string, expected: string) {
  const data = make({ path, text: input })
  const output = '' //trimLines(code.printMesh(data.link))

  const a = stripAnsi(output).trim()
  const b = stripAnsi(expected).trim()

  if (a !== b) {
    if (process.env.DEVELOP) {
      console.log(output)
    }
    code.throwError(code.generateStringMismatchError(data, a, b))
  }
}

function trimLines(text: string): string {
  return text
    .split('\n')
    .map(x => x.slice(2))
    .join('\n')
}
