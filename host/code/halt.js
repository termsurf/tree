import Halt from '@tunebond/halt';
import { TONE } from '@tunebond/halt-text';
import tint from '@tunebond/tint';
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
    const W = { tone: TONE.fall.base };
    const WB = { tone: TONE.fall.base, bold: true };
    const R = { tone: TONE.fall.red };
    lineList.push(tint(`${defaultIndent} |`, W));
    while (i <= n) {
        const line = lineText[i];
        haveText(line, 'line');
        const x = i + 1;
        let z = i < line.length ? x.toString().padStart(pad, ' ') : defaultIndent;
        if (rank.base.line === i) {
            lineList.push(tint(`${z} | ${line}`, WB));
            const indentA = new Array(z.length + 1).join(' ');
            const indentB = new Array(rank.base.mark + 1).join(' ');
            const haltText = new Array(rank.head.mark - rank.base.mark + 1).join('~');
            lineList.push(tint(`${indentA} | ${indentB}`, W) + tint(`${haltText}`, R));
        }
        else {
            lineList.push(tint(`${z} | ${lineText}`, W));
        }
        i++;
    }
    lineList.push(tint(`${defaultIndent} |`, W));
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
export function generateInvalidCompilerStateError(hint, path) {
    return {
        code: `0028`,
        file: path,
        hint: [
            hint,
            `This is some bug with the budding compiler. Check the stack trace to see where the error occurred.`,
        ]
            .filter(x => x)
            .join(' '),
        note: `Invalid compiler state`,
    };
}
//# sourceMappingURL=halt.js.map