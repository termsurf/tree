import { haveMesh } from '@tunebond/have';
import { generateSyntaxTokenError } from '../halt.js';
var Form;
(function (Form) {
    Form["Base"] = "base";
    Form["Line"] = "line";
    Form["Text"] = "text";
    Form["Nick"] = "nick";
    Form["Cull"] = "cull";
    Form["Term"] = "term";
})(Form || (Form = {}));
export var MarkName;
(function (MarkName) {
    MarkName["FallCull"] = "mark-fall-cull";
    MarkName["FallNick"] = "mark-fall-nick";
    MarkName["FallHold"] = "mark-fall-hold";
    MarkName["FallLineText"] = "mark-fall-line-text";
    MarkName["FallText"] = "mark-fall-text";
    MarkName["Link"] = "mark-link";
    MarkName["Note"] = "mark-note";
    MarkName["Comb"] = "mark-comb";
    MarkName["Code"] = "mark-code";
    MarkName["RiseCull"] = "mark-rise-cull";
    MarkName["RiseSlot"] = "mark-rise-slot";
    MarkName["RiseNick"] = "mark-rise-nick";
    MarkName["RiseNest"] = "mark-rise-nest";
    MarkName["RiseHold"] = "mark-rise-hold";
    MarkName["RiseLineText"] = "mark-rise-line-text";
    MarkName["RiseText"] = "mark-rise-text";
    MarkName["LineSlot"] = "mark-line-slot";
    MarkName["SideSize"] = "mark-side-size";
    MarkName["Text"] = "mark-text";
    MarkName["TermText"] = "mark-term-text";
    MarkName["Size"] = "mark-size";
    MarkName["LineTextLink"] = "mark-line-text-link";
    MarkName["LineTextSlot"] = "mark-line-text-slot";
})(MarkName || (MarkName = {}));
export const MARK_LINE_TEST_LIST = [
    MarkName.FallLineText,
    MarkName.RiseNick,
    MarkName.LineTextLink,
    MarkName.LineTextSlot,
];
export const MARK_NICK_TEST_LIST = [
    MarkName.TermText,
    MarkName.FallNick,
    MarkName.RiseNest,
    MarkName.Size,
    MarkName.SideSize,
    MarkName.Comb,
    MarkName.Code,
    MarkName.Link,
];
export const MARK_TEXT_TEST_LIST = [
    MarkName.RiseNick,
    MarkName.FallText,
    MarkName.Text,
];
export const MARK_TERM_TEST_LIST = [
    MarkName.RiseNick,
    MarkName.TermText,
    MarkName.RiseCull,
    MarkName.RiseNest,
];
export const MARK_CULL_TEST_LIST = [
    MarkName.TermText,
    MarkName.Size,
    MarkName.SideSize,
    MarkName.Comb,
    MarkName.Code,
    MarkName.FallCull,
];
export const MARK_NAME = [
    MarkName.FallLineText,
    MarkName.FallCull,
    MarkName.FallNick,
    MarkName.FallHold,
    MarkName.FallText,
    MarkName.Link,
    MarkName.Note,
    MarkName.Comb,
    MarkName.Code,
    MarkName.LineSlot,
    MarkName.RiseCull,
    MarkName.RiseSlot,
    MarkName.RiseNick,
    MarkName.RiseNest,
    MarkName.RiseHold,
    MarkName.RiseText,
    MarkName.RiseLineText,
    MarkName.SideSize,
    MarkName.Text,
    MarkName.TermText,
    MarkName.Size,
];
export const MARK_BASE_TEST_LIST = [
    MarkName.FallCull,
    MarkName.FallNick,
    MarkName.FallHold,
    MarkName.FallText,
    MarkName.Link,
    MarkName.Note,
    MarkName.Comb,
    MarkName.Code,
    MarkName.LineSlot,
    MarkName.RiseCull,
    MarkName.RiseSlot,
    MarkName.RiseNick,
    MarkName.RiseNest,
    MarkName.RiseHold,
    MarkName.RiseText,
    MarkName.RiseLineText,
    MarkName.SideSize,
    MarkName.TermText,
    MarkName.Size,
];
export const MARK_TEST = {
    [Form.Line]: MARK_LINE_TEST_LIST,
    [Form.Text]: MARK_TEXT_TEST_LIST,
    [Form.Nick]: MARK_NICK_TEST_LIST,
    [Form.Cull]: MARK_CULL_TEST_LIST,
    [Form.Term]: MARK_TERM_TEST_LIST,
    [Form.Base]: MARK_BASE_TEST_LIST,
};
const TEST = {
    [MarkName.FallCull]: {
        test: /^\]/,
    },
    [MarkName.FallNick]: {
        test: /^\}/,
    },
    [MarkName.FallHold]: {
        test: /^\)/,
    },
    [MarkName.FallText]: {
        test: /^>/,
    },
    [MarkName.Link]: {
        test: /^, /,
    },
    [MarkName.Note]: {
        test: /^# [^\n]+/,
    },
    [MarkName.Comb]: {
        test: /^-?\d+\.\d+/,
    },
    [MarkName.Code]: {
        test: /^#\w+/,
    },
    [MarkName.LineSlot]: {
        test: /^\n/,
    },
    [MarkName.RiseCull]: {
        test: /^\[/,
    },
    [MarkName.RiseNick]: {
        test: /^\{/,
    },
    [MarkName.RiseHold]: {
        test: /^\(/,
    },
    [MarkName.RiseText]: {
        test: /^</,
    },
    [MarkName.RiseSlot]: {
        test: /^  /,
    },
    [MarkName.RiseNest]: {
        test: /^ /,
    },
    [MarkName.RiseLineText]: {
        base: [MarkName.RiseSlot, MarkName.RiseNest, MarkName.Link],
        test: /^(@[\w:\-\*]+\/|\.{1,2}\/|\*{1,2}\/|\/)/,
    },
    [MarkName.LineTextLink]: {
        test: /^\//,
    },
    [MarkName.LineTextSlot]: {
        test: /^[\w:\-\*\.]+|\.{1,2}/,
    },
    [MarkName.FallLineText]: {
        test: /^[\n, ]/,
        take: false,
    },
    [MarkName.SideSize]: {
        test: /^-?\d+(?=\b)/,
    },
    [MarkName.TermText]: {
        test: /^[a-z0-9\/\-]+/,
    },
    [MarkName.Size]: {
        test: /^\d+(?=\b)/,
    },
    [MarkName.Text]: {
        test: /^(?:\\[<>\{\}])+|[^\{>\\]+/,
    },
};
export default function makeTextList(link) {
    const cast = {
        ...link,
        list: [],
        lineText: link.text.split('\n'),
    };
    let formList = [Form.Base];
    let line = 0;
    let mark = 0;
    let move = 0;
    for (let textLine of cast.lineText) {
        // apphead `\n` so test matching works as expected
        textLine = `${textLine}\n`;
        while (textLine) {
            const textForm = formList[formList.length - 1] || Form.Base;
            const testList = MARK_TEST[textForm];
            let progressed = false;
            testLoop: for (const form of testList) {
                const seed = TEST[form];
                haveMesh(seed, 'seed');
                let find = textLine.match(seed.test);
                console.log(find, textForm, form, textLine);
                if (find) {
                    if (seed.base) {
                        const stem = cast.list[cast.list.length - 1];
                        if (!stem) {
                            continue;
                        }
                        if (!seed.base.includes(stem.form)) {
                            continue;
                        }
                    }
                    progressed = true;
                    if (seed.take === false) {
                        const stem = {
                            rank: {
                                head: {
                                    mark,
                                    line,
                                },
                                base: {
                                    mark,
                                    line,
                                },
                            },
                            text: '',
                            form: form,
                        };
                        cast.list.push(stem);
                    }
                    else {
                        const findSize = find[0].length;
                        const findText = textLine.slice(0, findSize);
                        const stem = {
                            rank: {
                                head: {
                                    mark: mark + findSize,
                                    line,
                                },
                                base: {
                                    mark,
                                    line,
                                },
                            },
                            text: findText,
                            form: form,
                        };
                        cast.list.push(stem);
                        textLine = textLine.slice(findSize);
                        move += findSize;
                        mark += findSize;
                    }
                    switch (form) {
                        case MarkName.LineSlot: {
                            line++;
                            mark = 0;
                            break;
                        }
                        case MarkName.RiseNick: {
                            formList.push(Form.Nick);
                            break;
                        }
                        case MarkName.FallNick: {
                            formList.pop();
                            break;
                        }
                        case MarkName.RiseCull: {
                            formList.push(Form.Cull);
                            break;
                        }
                        case MarkName.FallCull: {
                            formList.pop();
                            break;
                        }
                        case MarkName.RiseText: {
                            formList.push(Form.Text);
                            break;
                        }
                        case MarkName.FallText: {
                            formList.pop();
                            break;
                        }
                        case MarkName.RiseLineText: {
                            formList.push(Form.Line);
                            break;
                        }
                        case MarkName.FallLineText: {
                            formList.pop();
                            break;
                        }
                        default:
                            break;
                    }
                    break testLoop;
                }
            }
            if (!progressed) {
                const last = cast.list[cast.list.length - 1];
                haveMesh(last, 'last');
                console.log(cast.list);
                throw generateSyntaxTokenError(cast, last);
            }
        }
        if (textLine.length) {
            const last = cast.list[cast.list.length - 1];
            haveMesh(last, 'last');
            throw generateSyntaxTokenError(cast, last);
        }
    }
    console.log(JSON.stringify(cast.list, null, 2));
    return cast;
}
//# sourceMappingURL=index.js.map