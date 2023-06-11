import { haveMesh } from '@tunebond/have';
import { generateSyntaxTokenError } from '../halt.js';
export var TextName;
(function (TextName) {
    TextName["FallCull"] = "text-fall-cull";
    TextName["FallNick"] = "text-fall-nick";
    TextName["FallHold"] = "text-fall-hold";
    TextName["FallLine"] = "text-fall-line";
    TextName["FallText"] = "text-fall-text";
    TextName["Link"] = "text-link";
    TextName["Note"] = "text-note";
    TextName["Comb"] = "text-comb";
    TextName["Code"] = "text-code";
    TextName["Line"] = "text-line";
    TextName["RiseCull"] = "text-rise-cull";
    TextName["RiseSlot"] = "text-rise-slot";
    TextName["RiseNick"] = "text-rise-nick";
    TextName["RiseNest"] = "text-rise-nest";
    TextName["RiseHold"] = "text-rise-hold";
    TextName["RiseLine"] = "text-rise-line";
    TextName["RiseText"] = "text-rise-text";
    TextName["LineSlot"] = "text-line-slot";
    TextName["SideSize"] = "text-side-size";
    TextName["Text"] = "text-text";
    TextName["TermSlot"] = "text-term-slot";
    TextName["Size"] = "text-size";
})(TextName || (TextName = {}));
export const TEXT_LINE_TEST_LIST = [
    TextName.FallLine,
    TextName.RiseNick,
    TextName.FallNick,
    TextName.Line,
];
export const TEXT_TEXT_TEST_LIST = [
    TextName.RiseNick,
    TextName.FallNick,
    TextName.FallText,
    TextName.Text,
];
export const TEXT_NAME = [
    TextName.FallLine,
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
    TextName.RiseLine,
    TextName.Line,
    TextName.SideSize,
    TextName.Text,
    TextName.TermSlot,
    TextName.Size,
];
export const TEXT_TEST_LIST = [
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
    TextName.RiseLine,
    TextName.SideSize,
    TextName.TermSlot,
    TextName.Size,
];
var Form;
(function (Form) {
    Form["Line"] = "line";
    Form["Text"] = "text";
    Form["Tree"] = "tree";
})(Form || (Form = {}));
const TEST = {
    [TextName.FallCull]: {
        test: /^ *\] */,
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
        test: /^ *\[ */,
    },
    [TextName.RiseSlot]: {
        test: /^  /,
    },
    [TextName.RiseNick]: {
        test: /^\{/,
    },
    [TextName.RiseNest]: {
        test: /^ /,
    },
    [TextName.RiseHold]: {
        test: /^\(/,
    },
    [TextName.RiseText]: {
        test: /^</,
    },
    [TextName.RiseLine]: {
        head: [TextName.RiseSlot, TextName.RiseNest, TextName.Link],
        test: /^(?:(?:@[\w:\-\.]+\/)|(?:\.{1,2}\/)|\*{1,2}\/|(?:\/))/,
    },
    [TextName.Line]: {
        test: /^[\w:\-\.\*]*(\/[\w:\-\.\*]*)*/,
    },
    [TextName.FallLine]: {
        test: /^[\n, ]/,
        take: false,
    },
    [TextName.SideSize]: {
        test: /^-\d+(?=\b)/,
    },
    [TextName.TermSlot]: {
        test: /^-?(?:[*~]?[a-z0-9]*(?:-[a-z0-9]+)*\??)(?:\/[a-z0-9]*(?:-[a-z0-9]+)*\??)*-?|-|\//,
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
    let formList = [Form.Tree];
    let line = 0;
    let mark = 0;
    let move = 0;
    for (let textLine of cast.lineText) {
        // apphead `\n` so test matching works as expected
        textLine = `${textLine}\n`;
        while (textLine) {
            const textForm = formList[formList.length - 1] || Form.Tree;
            let testList = TEXT_TEST_LIST;
            switch (textForm) {
                case Form.Tree:
                    testList = TEXT_TEST_LIST;
                    break;
                case Form.Text:
                    testList = TEXT_TEXT_TEST_LIST;
                    break;
                case Form.Line:
                    testList = TEXT_LINE_TEST_LIST;
                    break;
                default:
                    testList = TEXT_TEST_LIST;
                    break;
            }
            let progressed = false;
            testLoop: for (const form of testList) {
                const seed = TEST[form];
                if (seed && seed.test instanceof RegExp) {
                    let find = textLine.match(seed.test);
                    if (find) {
                        // console.log(textForm, form, find, textLine, seed.test)
                        if (seed.head) {
                            const stem = cast.list[cast.list.length - 1];
                            if (!stem) {
                                continue;
                            }
                            if (!seed.head.includes(stem.form)) {
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
                                formList.push(Form.Tree);
                                break;
                            }
                            case TextName.FallNick: {
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
                            case TextName.RiseLine: {
                                formList.push(Form.Line);
                                break;
                            }
                            case TextName.FallLine: {
                                formList.pop();
                                break;
                            }
                            default:
                                break;
                        }
                        break testLoop;
                    }
                }
            }
            if (!progressed) {
                const last = cast.list[cast.list.length - 1];
                haveMesh(last, 'last');
                throw generateSyntaxTokenError(cast, last);
            }
        }
        if (textLine.length) {
            const last = cast.list[cast.list.length - 1];
            haveMesh(last, 'last');
            throw generateSyntaxTokenError(cast, last);
        }
    }
    // console.log(JSON.stringify(cast.list, null, 2))
    return cast;
}
//# sourceMappingURL=index.js.map