import chalk from 'chalk';
import makeFoldList, { FoldName } from './fold/index.js';
import { seedizeLinkText } from './text/index.js';
import { LinkName } from './form.js';
export * from './fold/index.js';
export * from './text/index.js';
export * from './form.js';
export function readLinkTree(link) {
    let result = undefined;
    // console.log(prettifyJSON(link.foldList))
    const hold = {
        wall: [],
        slot: 0,
        tree: { nest: [], form: LinkName.Tree },
    };
    const context = {
        line: [],
        list: [hold.tree],
        tree: hold.tree,
    };
    hold.wall.push(context);
    while (hold.slot < link.foldList.length) {
        const seed = link.foldList[hold.slot];
        if (!seed) {
            continue;
        }
        switch (seed.form) {
            case FoldName.TermSlot:
                readTermSlot({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.RiseHook:
                readRiseHook({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.RiseNick:
                readRiseNick({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.FallNick:
                readFallNick({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.RiseTermLine:
                readRiseTermLine({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.FallTermLine:
                readFallTermLine({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.RiseCull:
                readRiseCull({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.FallCull:
                readFallCull({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.RiseTerm:
                readRiseTerm({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.FallTerm:
                readFallTerm({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.FallHook:
                readFallHook({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.Size:
                readSize({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.RiseText:
                readRiseText({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.FallText:
                readFallText({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.Text:
                readText({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.Comb:
                readComb({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.SideSize:
                readSideSize({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.Code:
                readCode({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.RiseNest:
                readRiseNest({
                    ...link,
                    hold,
                    seed,
                });
                break;
            case FoldName.FallNest:
                readFallNest({
                    ...link,
                    hold,
                    seed,
                });
                break;
            default:
                throwError(generatedNotImplementedYetError(seed.form, link.line));
        }
        hold.slot++;
    }
    assertLink(hold.tree, LinkName.Tree);
    // console.log(printParserMesh(hold.tree))
    return {
        ...link,
        linkTree: hold.tree,
    };
}
export function readFallHook(link) {
    const wall = link.hold.wall[link.hold.wall.length - 1];
    const list = wall?.list;
    list?.pop();
}
export function readFallCull(link) {
    const { wall } = link.hold;
    wall.pop();
}
export function readFallNest(link) {
    const wall = link.hold.wall[link.hold.wall.length - 1];
    const list = wall?.list;
    list?.pop();
    wall?.line.pop();
}
export function readFallNick(link) {
    const { wall } = link.hold;
    wall.pop();
}
export function readFallTerm(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list;
    list?.pop();
}
export function readFallTermLine(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list;
    list?.pop();
}
export function readFallText(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list;
    list?.pop();
}
export function readComb(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list ?? [];
    const ride = list?.[list.length - 1];
    switch (ride?.form) {
        case LinkName.Tree: {
            if (link.seed.form === FoldName.Comb) {
                const uint = {
                    rank: link.seed.rank,
                    form: LinkName.Comb,
                    bond: link.seed.bond,
                };
                ride.nest.push(uint);
            }
            break;
        }
        default:
            throwError(generatedNotImplementedYetError(ride?.form, link.line));
    }
}
export function readCode(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list ?? [];
    const ride = list?.[list.length - 1];
    switch (ride?.form) {
        case LinkName.Tree: {
            if (link.seed.form === FoldName.Code) {
                const code = {
                    base: link.seed.base,
                    rank: link.seed.rank,
                    bond: link.seed.bond,
                    form: LinkName.Code,
                };
                ride.nest.push(code);
            }
            break;
        }
        default:
            throwError(generatedNotImplementedYetError(ride?.form, link.line));
    }
}
export function readRiseHook(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list ?? [];
    const ride = list?.[list.length - 1];
    switch (ride?.form) {
        case LinkName.Nick: {
            const tree = {
                nest: [],
                base: ride,
                form: LinkName.Tree,
            };
            ride.nest.push(tree);
            list?.push(tree);
            break;
        }
        case LinkName.Cull: {
            const tree = {
                nest: [],
                base: ride,
                form: LinkName.Tree,
            };
            ride.nest.push(tree);
            list?.push(tree);
            break;
        }
        case LinkName.Tree: {
            const tree = {
                nest: [],
                base: ride,
                form: LinkName.Tree,
            };
            ride.nest.push(tree);
            list?.push(tree);
            break;
        }
        // case LinkName.Term: {
        //   const tree: LinkTree = {
        //     nest: [],
        //     base: ride,
        //     form: LinkName.Tree,
        //   }
        //   ride.nest.push(tree)
        //   list?.push(tree)
        //   break
        // }
        default:
            throwError(generatedNotImplementedYetError(ride?.form, link.line));
    }
}
export function readRiseCull(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list ?? [];
    const ride = list?.[list.length - 1];
    switch (ride?.form) {
        case LinkName.Line: {
            const cull = {
                nest: [],
                base: ride,
                form: LinkName.Cull,
            };
            ride.list.push(cull);
            list?.push(cull);
            const tree = cull;
            wall.push({
                line: [],
                list: [tree],
                tree,
            });
            break;
        }
        default:
            throwError(generatedNotImplementedYetError(ride?.form, link.line));
    }
}
export function readRiseNest(link) {
    const wall = link.hold.wall[link.hold.wall.length - 1];
    if (!wall) {
        return;
    }
    let tree = wall.tree;
    for (const part of wall.line) {
        if (tree && tree.form === LinkName.Tree) {
            const node = tree.nest[part];
            if (node) {
                if (node.form === LinkName.Tree) {
                    tree = node;
                }
                else {
                    tree = undefined;
                }
            }
            else {
                tree = undefined;
                break;
            }
        }
        else if (tree && tree.form === LinkName.Nick) {
            const node = tree.nest[part];
            if (node) {
                if (node.form === LinkName.Tree) {
                    tree = node;
                }
                else {
                    tree = undefined;
                }
            }
            else {
                tree = undefined;
                break;
            }
        }
        else if (tree && tree.form === LinkName.Cull) {
            const node = tree.nest[part];
            if (node) {
                if (node.form === LinkName.Tree) {
                    tree = node;
                }
                else {
                    tree = undefined;
                }
            }
            else {
                tree = undefined;
                break;
            }
        }
    }
    if (tree &&
        (tree.form === LinkName.Tree ||
            tree.form === LinkName.Nick ||
            tree.form === LinkName.Cull)) {
        wall.line.push(tree.nest.length - 1);
        const node = tree.nest[tree.nest.length - 1];
        if (node) {
            wall.list.push(node);
        }
        else {
            // throw new Error()
        }
    }
    else {
        // throw new Error()
    }
}
export function readRiseNick(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list ?? [];
    const ride = list?.[list.length - 1];
    switch (ride?.form) {
        case LinkName.Term: {
            if (link.seed.form === FoldName.RiseNick) {
                const plugin = {
                    nest: [],
                    base: ride,
                    size: link.seed.size,
                    form: LinkName.Nick,
                };
                ride.list.push(plugin);
                const tree = plugin;
                wall.push({
                    line: [],
                    list: [tree],
                    tree,
                });
                // list?.push(plugin)
            }
            break;
        }
        case LinkName.Text: {
            if (link.seed.form === FoldName.RiseNick) {
                const plugin = {
                    nest: [],
                    base: ride,
                    size: link.seed.size,
                    form: LinkName.Nick,
                };
                ride.list.push(plugin);
                const tree = plugin;
                wall.push({
                    line: [],
                    list: [tree],
                    tree,
                });
                // list?.push(plugin)
            }
            break;
        }
        default:
            throwError(generatedNotImplementedYetError(ride?.form, link.line));
    }
}
export function readRiseTerm(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list ?? [];
    const ride = list?.[list.length - 1];
    switch (ride?.form) {
        case LinkName.Line: {
            const term = {
                dive: false,
                // guard: false,
                base: ride,
                // query: false,
                list: [],
                form: LinkName.Term,
            };
            list?.push(term);
            ride.list.push(term);
            break;
        }
        case LinkName.Nick: {
            const term = {
                dive: false,
                // guard: false,
                base: ride,
                // query: false,
                list: [],
                form: LinkName.Term,
            };
            list?.push(term);
            ride.nest.push(term);
            break;
        }
        case LinkName.Tree: {
            const term = {
                dive: false,
                // guard: false,
                base: ride,
                // query: false,
                list: [],
                form: LinkName.Term,
            };
            list?.push(term);
            if (ride.head) {
                ride.nest.push(term);
            }
            else {
                ride.head = term;
            }
            break;
        }
        default:
            throwError(generatedNotImplementedYetError(ride?.form, link.line));
    }
}
export function readRiseTermLine(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list ?? [];
    const ride = list?.[list.length - 1];
    switch (ride?.form) {
        case LinkName.Tree: {
            const line = {
                base: ride,
                list: [],
                form: LinkName.Line,
            };
            list?.push(line);
            ride.nest.push(line);
            break;
        }
        case LinkName.Nick: {
            const line = {
                base: ride,
                list: [],
                form: LinkName.Line,
            };
            list?.push(line);
            ride.nest.push(line);
            break;
        }
        case LinkName.Cull: {
            const line = {
                base: ride,
                list: [],
                form: LinkName.Line,
            };
            list?.push(line);
            ride.nest.push(line);
            break;
        }
        default:
            throwError(generatedNotImplementedYetError(ride?.form, link.line));
    }
}
export function readRiseText(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list ?? [];
    const ride = list?.[list.length - 1];
    switch (ride?.form) {
        case LinkName.Tree: {
            const text = {
                list: [],
                form: LinkName.Text,
            };
            ride.nest.push(text);
            list?.push(text);
            break;
        }
        default:
            throwError(generatedNotImplementedYetError(ride?.form, link.line));
    }
}
export function readSideSize(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list ?? [];
    const ride = list?.[list.length - 1];
    switch (ride?.form) {
        case LinkName.Tree: {
            if (link.seed.form === FoldName.SideSize) {
                const int = {
                    rank: link.seed.rank,
                    form: LinkName.SideSize,
                    bond: link.seed.bond,
                };
                ride.nest.push(int);
            }
            break;
        }
        default:
            throwError(generatedNotImplementedYetError(ride?.form, link.line));
    }
}
function printMeshDetails(node, flat = false) {
    const text = [];
    switch (node.form) {
        case LinkName.Text: {
            text.push(node.bond);
            break;
        }
        case LinkName.Tree: {
            const head = [];
            if (node.head) {
                printMeshDetails(node.head, flat).forEach(line => {
                    head.push(`${line}`);
                });
            }
            const nest = [];
            node.nest.forEach(el => {
                printMeshDetails(el, flat).forEach(line => {
                    nest.push(`${line}`);
                });
            });
            if (flat) {
                text.push(`${head.join('')}(${nest.join(', ')})`);
            }
            else {
                text.push(`${head.join('')}`);
                nest.forEach(line => {
                    text.push(`  ${line}`);
                });
            }
            break;
        }
        case LinkName.Size: {
            text.push(chalk.green(`${node.bond}`));
            break;
        }
        case LinkName.Text: {
            const string = [];
            node.list.forEach(seg => {
                printMeshDetails(seg, true).forEach(line => {
                    string.push(`${line}`);
                });
            });
            text.push(`<${string.join('')}>`);
            break;
        }
        case LinkName.Nick: {
            if (node.nest.length) {
                const plugin = [];
                node.nest.forEach(nest => {
                    printMeshDetails(nest, true).forEach(line => {
                        plugin.push(`${line}`);
                    });
                });
                text.push('{'.repeat(node.size) +
                    plugin.join('') +
                    '}'.repeat(node.size));
            }
            break;
        }
        case LinkName.Cull: {
            const slot = [];
            node.nest.forEach(nest => {
                printMeshDetails(nest, true).forEach(line => {
                    slot.push(`${line}`);
                });
            });
            text.push('[' + slot.join('') + ']');
            break;
        }
        case LinkName.Comb: {
            text.push(`${node.bond}`);
            break;
        }
        case LinkName.Code: {
            text.push(`#${node.system}${node.code}`);
            break;
        }
        case LinkName.Term: {
            const term = [];
            node.list.forEach(seg => {
                printMeshDetails(seg, true).forEach(line => {
                    term.push(line);
                });
            });
            text.push(term.join(''));
            break;
        }
        case LinkName.Line: {
            const line = [];
            node.list.forEach((seg, i) => {
                printMeshDetails(seg, true).forEach(line => {
                    if (i > 0 && seg.form !== LinkName.Cull) {
                        line.push('/');
                    }
                    line.push(line);
                });
            });
            text.push(line.join(''));
            break;
        }
        default:
            throwError(generatedNotImplementedYetError(undefined));
    }
    return text;
}
export function readText(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list ?? [];
    const ride = list?.[list.length - 1];
    switch (ride?.form) {
        case LinkName.Text: {
            if (link.seed.form === FoldName.Text) {
                const string = {
                    rank: link.seed.rank,
                    form: LinkName.Text,
                    bond: link.seed.bond,
                };
                ride.list.push(string);
            }
            break;
        }
        case LinkName.Tree: {
            if (link.seed.form === FoldName.Text) {
                const string = {
                    rank: link.seed.rank,
                    form: LinkName.Text,
                    bond: link.seed.bond,
                };
                ride.nest.push(string);
            }
            break;
        }
        default:
            throwError(generatedNotImplementedYetError(ride?.form, link.line));
    }
}
function printParserMeshDetails(node) {
    const text = [];
    const title = chalk.white(node.form);
    switch (node.form) {
        case LinkName.Text: {
            text.push(`${title} ${chalk.green(node.bond)}`);
            break;
        }
        case LinkName.Tree: {
            text.push(`${title}`);
            if (node.head) {
                text.push(chalk.gray(`  head:`));
                printParserMeshDetails(node.head).forEach(line => {
                    text.push(`    ${line}`);
                });
            }
            else {
                text.push(chalk.gray('  hook: undefined'));
            }
            if (node.nest.length) {
                text.push(chalk.gray(`  nest:`));
                node.nest.forEach(el => {
                    printParserMeshDetails(el).forEach(line => {
                        text.push(`    ${line}`);
                    });
                });
            }
            break;
        }
        case LinkName.Size: {
            text.push(`${title} ${node.bond}`);
            break;
        }
        case LinkName.Text: {
            text.push(`${title}`);
            node.list.forEach(seg => {
                printParserMeshDetails(seg).forEach(line => {
                    text.push(`  ${line}`);
                });
            });
            break;
        }
        case LinkName.Nick: {
            text.push(`${title}`);
            text.push(chalk.gray(`  size: ${node.size}`));
            if (node.nest.length) {
                text.push(chalk.gray(`  nest:`));
                node.nest.forEach(nest => {
                    printParserMeshDetails(nest).forEach(line => {
                        text.push(`    ${line}`);
                    });
                });
            }
            break;
        }
        case LinkName.Cull: {
            text.push(`${title}`);
            text.push(chalk.gray(`  nest:`));
            node.nest.forEach(nest => {
                printParserMeshDetails(nest).forEach(line => {
                    text.push(`    ${line}`);
                });
            });
            break;
        }
        case LinkName.Comb: {
            text.push(`${title} ${node.bond}`);
            break;
        }
        case LinkName.Code: {
            text.push(`${title} #${node.system}${node.code}`);
            break;
        }
        case LinkName.Term: {
            text.push(`${title}`);
            node.list.forEach(seg => {
                printParserMeshDetails(seg).forEach(line => {
                    text.push(`  ${line}`);
                });
            });
            break;
        }
        case LinkName.Line: {
            text.push(`${title}`);
            node.list.forEach(seg => {
                printParserMeshDetails(seg).forEach(line => {
                    text.push(`  ${line}`);
                });
            });
            break;
        }
        default:
            throwError(generatedNotImplementedYetError(undefined));
    }
    return text;
}
export function readTermSlot(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list ?? [];
    const ride = list?.[list.length - 1];
    switch (ride?.form) {
        case LinkName.Term: {
            const base = ride.base;
            const oldTerm = ride;
            if (link.seed.form === FoldName.TermSlot) {
                oldTerm.dive = link.seed.dive;
                // oldTerm.guard = link.seed.guard
                oldTerm.form = LinkName.Term;
                oldTerm.base = base;
                // oldTerm.query = link.seed.query
                oldTerm.list.push({
                    rank: link.seed.rank,
                    form: LinkName.Text,
                    bond: link.seed.bond,
                });
                // if (!link.seed.start) {
                //   const termList: Array<LinkTerm> = mergeTerms(
                //     oldTerm,
                //     newTerm,
                //   )
                // }
                // base.list.push(newTerm)
                // list.push(newTerm)
            }
            break;
        }
        default:
            throwError(generatedNotImplementedYetError(ride?.form, link.line));
    }
}
export function readSize(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list ?? [];
    const ride = list?.[list.length - 1];
    switch (ride?.form) {
        case LinkName.Tree: {
            if (link.seed.form === FoldName.Size) {
                const uint = {
                    form: LinkName.Size,
                    bond: link.seed.bond,
                };
                ride.nest.push(uint);
            }
            break;
        }
        default:
            throwError(generatedNotImplementedYetError(ride?.form, link.line));
    }
}
export function printMesh(base) {
    const text = [''];
    printMeshDetails(base).forEach(line => {
        text.push(`${line}`);
    });
    text.push('');
    return text.join('\n');
}
export function printParserMesh(base) {
    const text = [''];
    printParserMeshDetails(base).forEach(line => {
        text.push(`  ${line}`);
    });
    text.push('');
    return text.join('\n');
}
// eslint-disable-next-line sort-exports/sort-exports
export const LINK_HINT_TEXT = {
    [LinkHint.Code]: 'boolean',
    [LinkHint.DynamicTerm]: 'dynamic term',
    [LinkHint.DynamicText]: 'dynamic text',
    [LinkHint.DynamicLine]: 'dynamic line',
    [LinkHint.Empty]: 'empty',
    [LinkHint.Mark]: 'unsigned integer',
    [LinkHint.StaticTerm]: 'static term',
    [LinkHint.StaticText]: 'static text',
    [LinkHint.StaticLine]: 'static line',
};
export function parseLinkText(link) {
    return readLinkTree(makeFoldList(seedizeLinkText(link)));
}
//# sourceMappingURL=index.js.map