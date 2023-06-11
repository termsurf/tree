import type { TextRank } from './text/index.js';
export type { TextRank };
export declare enum LinkHint {
    Code = "code",
    NickLine = "nick-line",
    NickTerm = "nick-term",
    NickText = "nick-text",
    Void = "void",
    Size = "size",
    SideSize = "side-size",
    Line = "line",
    Term = "term",
    Text = "text"
}
export declare enum LinkName {
    Wave = "link-wave",
    Comb = "link-comb",
    Code = "link-code",
    Cull = "link-cull",
    Line = "link-path",
    Nick = "link-nick",
    SideSize = "link-side-size",
    Term = "link-term",
    Text = "link-text",
    Tree = "link-tree",
    Size = "link-size"
}
export declare const LINK_TYPE: LinkName[];
export type LinkWave = {
    form: LinkName.Wave;
    bond: boolean;
    rank: TextRank;
};
export type LinkComb = {
    rank: TextRank;
    form: LinkName.Comb;
    bond: number;
};
export type LinkCode = {
    bond: string;
    rank: TextRank;
    base: string;
    form: LinkName.Code;
};
export type LinkCull = {
    nest: Array<LinkTree | LinkTerm | LinkLine>;
    base: LinkLine;
    form: LinkName.Cull;
    rank: TextRank;
};
export type Link = LinkTerm | LinkText | LinkTree | LinkSize | LinkSideSize | LinkText | LinkNick | LinkCull | LinkComb | LinkCode | LinkLine | LinkWave;
export type LinkLine = {
    base: LinkTree | LinkNick | LinkCull;
    list: Array<LinkTerm | LinkCull>;
    form: LinkName.Line;
};
export type LinkNick = {
    nest: Array<LinkTree | LinkTerm | LinkLine>;
    base: LinkTerm | LinkText;
    size: number;
    form: LinkName.Nick;
};
export type LinkCallCast = {
    linkTree: LinkTree;
};
export type LinkSideSize = {
    rank: TextRank;
    form: LinkName.SideSize;
    bond: number;
};
export type LinkTextLine = {
    rank: TextRank;
    form: LinkName.Text;
    bond: string;
};
export type LinkTerm = {
    dive: boolean;
    base: LinkLine | LinkTree | LinkNick;
    list: Array<LinkTextLine | LinkNick>;
    form: LinkName.Term;
};
export type LinkText = {
    list: Array<LinkTextLine | LinkNick>;
    form: LinkName.Text;
};
export type LinkTree = {
    head?: LinkTerm;
    nest: Array<Link>;
    base?: LinkTree | LinkNick | LinkCull;
    form: LinkName.Tree;
};
export type LinkSize = {
    form: LinkName.Size;
    bond: number;
};
