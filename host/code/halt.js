import Halt from '@tunebond/halt';
import { TextName } from './text';
import { haveMesh, haveText } from '@tunebond/have';
const host = '@tunebond/link';
const base = {
    not_implemented: {
        code: 1,
        note: ({ name, base }) => `We have not yet implemented '${name}' in ${base}. Please reach out.`,
    },
    syntax_error: {
        code: 2,
        note: ({ text }) => `Error in the structure of the link text tree.`,
    },
    invalid_whitespace: {
        code: 3,
        note: ({ text }) => `Invalid whitespace.`,
    },
};
export default function halt(form, link) {
    return new Halt({ base, form, host, link });
}
export function haltNotImplemented(name, base) {
    return halt('not_implemented', { name, base });
}
export function generateSyntaxTokenError(cast, last) {
    const rank = {
        head: {
            mark: 0,
            line: 0,
        },
        base: {
            mark: 0,
            line: 0,
        },
    };
    rank.base.line = last.rank.base.line;
    rank.head.line = last.rank.head.line;
    rank.base.mark = last.rank.base.mark;
    rank.head.mark = last.rank.head.mark;
    const text = generateHighlightedErrorText(cast.lineText, rank);
    return halt('syntax_error', { text });
}
export function generateHighlightedErrorText(lineText, rank) {
    const headLine = Math.min(rank.base.line + 2, lineText.length - 1);
    const headLineString = lineText[headLine];
    haveText(headLineString, `text[${headLine}]`);
    const headMark = headLineString.length - 1;
    const bindRank = {
        head: {
            mark: headMark,
            line: headLine,
        },
        base: {
            mark: 0,
            line: Math.max(0, rank.base.line - 2),
        },
    };
    const text = makeRankText(bindRank, lineText, rank);
    return text;
}
export function makeRankText(bond, lineText, rank) {
    const lineList = [];
    let i = bond.base.line;
    let n = bond.head.line;
    let pad = String(n + 1).length;
    const defaultIndent = new Array(pad + 1).join(' ');
    lineList.push(chalk.white(`${defaultIndent} |`));
    while (i <= n) {
        const line = lineText[i];
        haveText(line, 'line');
        const x = i + 1;
        let z = i < line.length ? x.toString().padStart(pad, ' ') : defaultIndent;
        if (rank.base.line === i) {
            lineList.push(chalk.whiteBright(`${z} | ${line}`));
            const indentA = new Array(z.length + 1).join(' ');
            const indentB = new Array(rank.base.mark + 1).join(' ');
            const haltText = new Array(rank.head.mark - rank.base.mark + 1).join('~');
            lineList.push(chalk.white(`${indentA} | ${indentB}`) +
                chalk.red(`${haltText}`));
        }
        else {
            lineList.push(chalk.white(`${z} | ${lineText}`));
        }
        i++;
    }
    lineList.push(chalk.white(`${defaultIndent} |`));
    return lineList.join('\n');
}
export function generateInvalidWhitespaceError(cast, slot) {
    const seed = cast.list[slot];
    haveMesh(seed, 'seed');
    const rank = getCursorRangeForTextWhitespaceToken(cast, slot);
    const text = generateHighlightedErrorText(cast.lineText, rank);
    return halt('invalid_whitespace', { text });
}
export function getCursorRangeForTextWhitespaceToken(call, slot) {
    let seedList = [];
    let i = slot;
    loop: while (i < call.list.length) {
        let t = call.list[i];
        haveMesh(t, 't');
        switch (t.form) {
            case TextName.RiseSlot:
            case TextName.RiseNest:
                seedList.push(t);
                break;
            default:
                break loop;
        }
        i++;
    }
    const base = seedList[0];
    const head = seedList[seedList.length - 1];
    haveMesh(base, 'base');
    haveMesh(head, 'head');
    return {
        head: {
            mark: head.rank.head.mark,
            line: head.rank.head.line,
        },
        base: {
            mark: base.rank.base.mark,
            line: base.rank.base.line,
        },
    };
}
//# sourceMappingURL=halt.js.map