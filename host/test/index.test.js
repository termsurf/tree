import assert from 'assert';
import { promises as fs } from 'fs';
import test from 'node:test';
import { dirname } from 'path';
import stripAnsi from 'strip-ansi';
import { fileURLToPath } from 'url';
import makeLinkTree, { showLinkTree } from '../code/link/index.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const FIND = process.env.FIND;
async function start() {
    const fixtures = (await fs.readdir(`${__dirname}/file`))
        .filter(x => x.endsWith('.link'))
        .map(x => `${__dirname}/file/${x}`)
        .filter(x => !FIND || x.match(FIND));
    for (const path of fixtures) {
        const localPath = path.replace(`${__dirname}/`, '');
        test(`make ${localPath}`, async () => {
            const content = await fs.readFile(path, 'utf-8');
            const [provided, expected] = content
                .split(/\n---\n/)
                .map(x => x.trim());
            assert(provided, 'Should have defined provided input');
            assert(expected, 'Should have defined expected output');
            assertParse(path, provided, expected);
        });
    }
    const kinkFixtures = (await fs.readdir(`${__dirname}/file/kink`))
        .filter(x => x.endsWith('.link'))
        .map(x => `${__dirname}/file/kink/${x}`)
        .filter(x => !FIND || x.match(FIND));
    for (const path of kinkFixtures) {
        const localPath = path.replace(`${__dirname}/`, '');
        test(`make ${localPath}`, async () => {
            const content = await fs.readFile(path, 'utf-8');
            const [provided, expected] = content
                .split(/\n---\n/)
                .map(x => x.trim());
            assert(provided, 'Should have defined provided input');
            assert(expected, 'Should have defined expected output');
            assertParseKink(path, provided, expected);
        });
    }
}
start();
function assertParse(link, provided, expected) {
    const data = makeLinkTree({ link, text: provided });
    const output = trimLines(showLinkTree(data.linkTree));
    const a = String(stripAnsi(output)).trim();
    const b = String(stripAnsi(expected)).trim();
    if (a !== b) {
        if (process.env.DEVELOP) {
            console.log(output);
        }
        throw new Error(`${a} != ${b}`);
        // code.throwError(code.generateStringMismatchError(data, a, b))
    }
}
function assertParseKink(link, provided, expected) {
    try {
        const data = makeLinkTree({ link, text: provided });
        console.log(data);
    }
    catch (e) {
        if (e instanceof Error) {
            if (e.message != expected) {
                throw e;
            }
        }
    }
}
function trimLines(text) {
    return text
        .split('\n')
        .map(x => x.slice(2))
        .join('\n');
}
//# sourceMappingURL=index.test.js.map