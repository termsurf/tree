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
export var TextName;
(function (TextName) {
    TextName["FallCull"] = "text-fall-cull";
    TextName["FallNick"] = "text-fall-nick";
    TextName["FallHold"] = "text-fall-hold";
    TextName["FallLineText"] = "text-fall-line";
    TextName["FallText"] = "text-fall-text";
    TextName["Link"] = "text-link";
    TextName["Note"] = "text-note";
    TextName["Comb"] = "text-comb";
    TextName["Code"] = "text-code";
    TextName["RiseCull"] = "text-rise-cull";
    TextName["RiseSlot"] = "text-rise-slot";
    TextName["RiseNick"] = "text-rise-nick";
    TextName["RiseNest"] = "text-rise-nest";
    TextName["RiseHold"] = "text-rise-hold";
    TextName["RiseLineText"] = "text-rise-line";
    TextName["RiseText"] = "text-rise-text";
    TextName["LineSlot"] = "text-line-slot";
    TextName["SideSize"] = "text-side-size";
    TextName["Text"] = "text-text";
    TextName["TermText"] = "text-term-text";
    TextName["RiseTerm"] = "text-rise-term";
    TextName["FallTerm"] = "text-fall-term";
    TextName["Size"] = "text-size";
    TextName["LineTextLink"] = "text-line-text-link";
    TextName["LineTextSlot"] = "text-line-text-slot";
})(TextName || (TextName = {}));
export const TEXT_LINE_TEST_LIST = [
    TextName.FallLineText,
    TextName.RiseNick,
    TextName.LineTextLink,
    TextName.LineTextSlot,
];
export const TEXT_NICK_TEST_LIST = [
    TextName.RiseTerm,
    TextName.FallNick,
];
export const TEXT_TEXT_TEST_LIST = [
    TextName.RiseNick,
    TextName.FallText,
    TextName.Text,
];
export const TEXT_TERM_TEST_LIST = [
    TextName.RiseNick,
    TextName.TermText,
    TextName.FallTerm,
    TextName.RiseCull,
];
export const TEXT_CULL_TEST_LIST = [
    TextName.RiseTerm,
    TextName.Size,
    TextName.SideSize,
    TextName.Comb,
    TextName.Code,
    TextName.FallCull,
];
export const TEXT_NAME = [
    TextName.FallLineText,
    TextName.FallCull,
    TextName.FallNick,
    TextName.FallHold,
    TextName.FallText,
    TextName.Link,
    TextName.Note,
    TextName.Comb,
    TextName.Code,
    TextName.LineSlot,
    TextName.RiseCull,
    TextName.RiseSlot,
    TextName.RiseNick,
    TextName.RiseNest,
    TextName.RiseHold,
    TextName.RiseText,
    TextName.RiseLineText,
    TextName.SideSize,
    TextName.Text,
    TextName.TermText,
    TextName.Size,
];
export const TEXT_BASE_TEST_LIST = [
    TextName.FallCull,
    TextName.FallNick,
    TextName.FallHold,
    TextName.FallText,
    TextName.Link,
    TextName.Note,
    TextName.Comb,
    TextName.Code,
    TextName.LineSlot,
    TextName.RiseCull,
    TextName.RiseSlot,
    TextName.RiseNick,
    TextName.RiseNest,
    TextName.RiseHold,
    TextName.RiseText,
    TextName.RiseLineText,
    TextName.SideSize,
    TextName.RiseTerm,
    TextName.Size,
];
export const TEXT_TEST = {
    [Form.Line]: TEXT_LINE_TEST_LIST,
    [Form.Text]: TEXT_TEXT_TEST_LIST,
    [Form.Nick]: TEXT_NICK_TEST_LIST,
    [Form.Cull]: TEXT_CULL_TEST_LIST,
    [Form.Term]: TEXT_TERM_TEST_LIST,
    [Form.Base]: TEXT_BASE_TEST_LIST,
};
const TEST = {
    [TextName.FallCull]: {
        test: /^\]/,
    },
    [TextName.FallNick]: {
        test: /^\}/,
    },
    [TextName.FallHold]: {
        test: /^\)/,
    },
    [TextName.FallText]: {
        test: /^>/,
    },
    [TextName.Link]: {
        test: /^, /,
    },
    [TextName.Note]: {
        test: /^# [^\n]+/,
    },
    [TextName.Comb]: {
        test: /^-?\d+\.\d+/,
    },
    [TextName.Code]: {
        test: /^#\w+/,
    },
    [TextName.LineSlot]: {
        test: /^\n/,
    },
    [TextName.RiseCull]: {
        test: /^\[/,
    },
    [TextName.RiseNick]: {
        test: /^\{/,
    },
    [TextName.RiseHold]: {
        test: /^\(/,
    },
    [TextName.RiseText]: {
        test: /^</,
    },
    [TextName.RiseSlot]: {
        test: /^  /,
    },
    [TextName.RiseNest]: {
        test: /^ /,
    },
    [TextName.RiseLineText]: {
        base: [TextName.RiseSlot, TextName.RiseNest, TextName.Link],
        test: /^@[\w:\-\*]+\/|\.{1,2}\/|\*{1,2}\/|\//,
    },
    [TextName.LineTextLink]: {
        test: /^\//,
    },
    [TextName.LineTextSlot]: {
        test: /^[\w:\-\*]+|\.{1,2}/,
    },
    [TextName.FallLineText]: {
        test: /^[\n, ]/,
        take: false,
    },
    [TextName.SideSize]: {
        test: /^-\d+(?=\b)/,
    },
    [TextName.RiseTerm]: {
        test: /^[*~]?[a-z]/,
        take: false,
    },
    [TextName.TermText]: {
        test: /^[a-z][a-z0-9]*\??(?:\/[a-z][a-z0-9]*\??)*/,
    },
    [TextName.FallTerm]: {
        test: /^[\n, \]\[]/,
        take: false,
    },
    [TextName.Size]: {
        test: /^\d+(?=\b)/,
    },
    [TextName.Text]: {
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
            const testList = TEXT_TEST[textForm];
            let progressed = false;
            testLoop: for (const form of testList) {
                const seed = TEST[form];
                haveMesh(seed, 'seed');
                let find = textLine.match(seed.test);
                console.log(find, form, textLine);
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
                        case TextName.LineSlot: {
                            line++;
                            mark = 0;
                        }
                        case TextName.RiseNick: {
                            formList.push(Form.Nick);
                            break;
                        }
                        case TextName.FallNick: {
                            formList.pop();
                            break;
                        }
                        case TextName.RiseCull: {
                            formList.push(Form.Cull);
                            break;
                        }
                        case TextName.FallCull: {
                            formList.pop();
                            break;
                        }
                        case TextName.RiseTerm: {
                            formList.push(Form.Term);
                            break;
                        }
                        case TextName.FallTerm: {
                            formList.pop();
                            break;
                        }
                        case TextName.RiseText: {
                            formList.push(Form.Text);
                            break;
                        }
                        case TextName.FallText: {
                            formList.pop();
                            break;
                        }
                        case TextName.RiseLineText: {
                            formList.push(Form.Line);
                            break;
                        }
                        case TextName.FallLineText: {
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
    process.exit();
    return cast;
}
//# sourceMappingURL=index.js.map