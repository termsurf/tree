import assert from 'assert';
import fs from 'fs';
import test from 'node:test';
import { dirname } from 'path';
import stripAnsi from 'strip-ansi';
import { fileURLToPath } from 'url';
import { code } from '~';
import { parseLinkText as parse } from '../../code/link/index.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename).replace(/\/base.link\/host/, '/base.link/make');
// const nest = form(`link 1, foo <bar>`)
// const nest = form(`link <./{code/ball}>`)
// const nest = form(`link {a}-x-{y/z}, foo <bar>`)
// const nest = parse(`
// load @tunebond/wolf/code
//   load /shared/result
//     take tree free-result
//     take tree is-below-or-return-error
//     take tree is-minimally-or-return-error
//   load /javascript/mark/8
//     take form mark-8
// `)
// const nest = parse({
//   path: 'foo.link',
//   text: `
// # true or false
// time one
//   # true
//   three four # five
//     six
//   seven 8
//     nine
// ten 11
// `,
// })
// console.log(prettifyJSON(nest))
async function start() {
    await code.loadSourceMaps();
    const fixtures = (await fs.promises.readdir(`${__dirname}/file`))
        .filter(x => x.endsWith('.link'))
        .map(x => `${__dirname}/file/${x}`);
    for (const path of fixtures) {
        const localPath = path.replace(`${__dirname}/`, '');
        test(`parse ${localPath}`, async () => {
            const content = await fs.promises.readFile(path, 'utf-8');
            const [input, expected] = content
                .split(/\n---\n/)
                .map(x => x.trim());
            assert(input, 'Should have defined initial input');
            assert(expected, 'Should have defined expected output');
            assertParse(path, input, expected);
        });
    }
}
start();
function assertParse(path, input, expected) {
    const data = parse({ path, text: input });
    const output = ''; //trimLines(code.printMesh(data.link))
    const a = stripAnsi(output).trim();
    const b = stripAnsi(expected).trim();
    if (a !== b) {
        if (process.env.DEVELOP) {
            console.log(output);
        }
        code.throwError(code.generateStringMismatchError(data, a, b));
    }
}
function trimLines(text) {
    return text
        .split('\n')
        .map(x => x.slice(2))
        .join('\n');
}
//# sourceMappingURL=index.test.js.map