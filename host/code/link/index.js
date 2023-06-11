import makeFoldList, { FoldName, } from '../fold/index.js';
import makeTextList from '../text/index.js';
import { LinkHint, LinkName, } from './form.js';
import { haltNotImplemented } from '../halt.js';
import { haveLink, haveLinkForm } from '../../code/have.js';
export * from '../fold/index.js';
export * from '../text/index.js';
export * from './form.js';
function readFoldTree(link) {
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
                throw haltNotImplemented(seed.form, link.link);
        }
        hold.slot++;
    }
    haveLinkForm(hold.tree, LinkName.Tree);
    // console.log(printParserMesh(hold.tree))
    return {
        ...link,
        linkTree: hold.tree,
    };
}
function readFallHook(link) {
    const wall = link.hold.wall[link.hold.wall.length - 1];
    const list = wall?.list;
    list?.pop();
}
function readFallCull(link) {
    const { wall } = link.hold;
    wall.pop();
}
function readFallNest(link) {
    const wall = link.hold.wall[link.hold.wall.length - 1];
    const list = wall?.list;
    list?.pop();
    wall?.line.pop();
}
function readFallNick(link) {
    const { wall } = link.hold;
    wall.pop();
}
function readFallTerm(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list;
    list?.pop();
}
function readFallTermLine(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list;
    list?.pop();
}
function readFallText(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list;
    list?.pop();
}
function readComb(link) {
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
            haveLink(ride, 'ride');
            throw haltNotImplemented(ride.form, link.link);
    }
}
function readCode(link) {
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
            haveLink(ride, 'ride');
            throw haltNotImplemented(ride.form, link.link);
    }
}
function readRiseHook(link) {
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
            haveLink(ride, 'ride');
            throw haltNotImplemented(ride.form, link.link);
    }
}
function readRiseCull(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list ?? [];
    const ride = list?.[list.length - 1];
    switch (ride?.form) {
        case LinkName.Line: {
            const cull = {
                // rank: link.seed.rank,
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
            haveLink(ride, 'ride');
            throw haltNotImplemented(ride.form, link.link);
    }
}
function readRiseNest(link) {
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
function readRiseNick(link) {
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
            haveLink(ride, 'ride');
            throw haltNotImplemented(ride.form, link.link);
    }
}
function readRiseTerm(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list ?? [];
    const ride = list?.[list.length - 1];
    switch (ride?.form) {
        case LinkName.Line: {
            const term = {
                dive: false,
                soak: false,
                base: ride,
                cull: false,
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
                soak: false,
                base: ride,
                cull: false,
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
                soak: false,
                base: ride,
                cull: false,
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
            haveLink(ride, 'ride');
            throw haltNotImplemented(ride.form, link.link);
    }
}
function readRiseTermLine(link) {
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
            haveLink(ride, 'ride');
            throw haltNotImplemented(ride.form, link.link);
    }
}
function readRiseText(link) {
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
            haveLink(ride, 'ride');
            throw haltNotImplemented(ride.form, link.link);
    }
}
function readSideSize(link) {
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
            haveLink(ride, 'ride');
            throw haltNotImplemented(ride.form, link.link);
    }
}
function readText(link) {
    const { wall } = link.hold;
    const context = wall[wall.length - 1];
    const list = context?.list ?? [];
    const ride = list?.[list.length - 1];
    switch (ride?.form) {
        case LinkName.Text: {
            if (link.seed.form === FoldName.Text) {
                const string = {
                    rank: link.seed.rank,
                    form: LinkName.TextLine,
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
                    form: LinkName.TextLine,
                    bond: link.seed.bond,
                };
                ride.nest.push(string);
            }
            break;
        }
        default:
            haveLink(ride, 'ride');
            throw haltNotImplemented(ride.form, link.link);
    }
}
function readTermSlot(link) {
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
                oldTerm.soak = link.seed.soak;
                oldTerm.form = LinkName.Term;
                oldTerm.base = base;
                oldTerm.cull = link.seed.cull;
                oldTerm.list.push({
                    rank: link.seed.rank,
                    form: LinkName.TextLine,
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
            haveLink(ride, 'ride');
            throw haltNotImplemented(ride.form, link.link);
    }
}
function readSize(link) {
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
            haveLink(ride, 'ride');
            throw haltNotImplemented(ride.form, link.link);
    }
}
export const LINK_HINT_TEXT = {
    [LinkHint.NickTerm]: 'nick term',
    [LinkHint.NickText]: 'nick text',
    [LinkHint.NickLine]: 'nick line',
    [LinkHint.Void]: 'void',
    [LinkHint.Term]: 'term',
    [LinkHint.Text]: 'text',
    [LinkHint.Line]: 'line',
};
export default function makeLinkTree(link) {
    return readFoldTree(makeFoldList(makeTextList(link)));
}
export * from './show.js';
//# sourceMappingURL=index.js.map