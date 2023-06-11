declare enum Form {
    Base = "base",
    Line = "line",
    Text = "text",
    Nick = "nick",
    Cull = "cull",
    Term = "term"
}
export declare enum MarkName {
    FallCull = "mark-fall-cull",
    FallNick = "mark-fall-nick",
    FallHold = "mark-fall-hold",
    FallLineText = "mark-fall-line-text",
    FallText = "mark-fall-text",
    Link = "mark-link",
    Note = "mark-note",
    Comb = "mark-comb",
    Code = "mark-code",
    RiseCull = "mark-rise-cull",
    RiseSlot = "mark-rise-slot",
    RiseNick = "mark-rise-nick",
    RiseNest = "mark-rise-nest",
    RiseHold = "mark-rise-hold",
    RiseLineText = "mark-rise-line-text",
    RiseText = "mark-rise-text",
    LineSlot = "mark-line-slot",
    SideSize = "mark-side-size",
    Text = "mark-text",
    TermText = "mark-term-text",
    Size = "mark-size",
    LineTextLink = "mark-line-text-link",
    LineTextSlot = "mark-line-text-slot"
}
export type RankLink = {
    mark: number;
    line: number;
};
export type Rank = {
    base: RankLink;
    head: RankLink;
};
export declare const MARK_LINE_TEST_LIST: Array<MarkName>;
export declare const MARK_NICK_TEST_LIST: Array<MarkName>;
export declare const MARK_TEXT_TEST_LIST: Array<MarkName>;
export declare const MARK_TERM_TEST_LIST: Array<MarkName>;
export declare const MARK_CULL_TEST_LIST: Array<MarkName>;
export declare const MARK_NAME: Array<MarkName>;
export declare const MARK_BASE_TEST_LIST: Array<MarkName>;
export declare const MARK_TEST: Record<Form, Array<MarkName>>;
export type MarkFallCull = MarkBase & {
    form: MarkName.FallCull;
};
export type MarkFallLineText = MarkBase & {
    form: MarkName.FallLineText;
};
export type MarkRiseSlot = MarkBase & {
    form: MarkName.RiseSlot;
};
export type MarkLineTextLink = MarkBase & {
    form: MarkName.LineTextLink;
};
export type MarkLineTextSlot = MarkBase & {
    form: MarkName.LineTextSlot;
};
export type MarkComb = MarkBase & {
    form: MarkName.Comb;
};
export type MarkSideSize = MarkBase & {
    form: MarkName.SideSize;
};
export type MarkSize = MarkBase & {
    form: MarkName.Size;
};
export type MarkRiseNest = MarkBase & {
    form: MarkName.RiseNest;
};
export type MarkRiseHold = MarkBase & {
    form: MarkName.RiseHold;
};
export type MarkFallHold = MarkBase & {
    form: MarkName.FallHold;
};
export type MarkRiseText = MarkBase & {
    form: MarkName.RiseText;
};
export type MarkFallText = MarkBase & {
    form: MarkName.FallText;
};
export type MarkRiseNick = MarkBase & {
    form: MarkName.RiseNick;
};
export type MarkFallNick = MarkBase & {
    form: MarkName.FallNick;
};
export type MarkRiseCull = MarkBase & {
    form: MarkName.RiseCull;
};
export type MarkLink = MarkBase & {
    form: MarkName.Link;
};
export type MarkCode = MarkBase & {
    form: MarkName.Code;
};
export type MarkNote = MarkBase & {
    form: MarkName.Note;
};
export type MarkRiseLineText = MarkBase & {
    form: MarkName.RiseLineText;
};
export type MarkLineSlot = MarkBase & {
    form: MarkName.LineSlot;
};
export type MarkText = MarkBase & {
    form: MarkName.Text;
};
export type MarkTermText = MarkBase & {
    form: MarkName.TermText;
};
export type MarkCallLink = {
    link: string;
    text: string;
};
export type MarkLineRange = {
    mark: number;
    line: number;
};
export type MarkBase = {
    rank: Rank;
    text: string;
};
export type MarkSeed = {
    base?: Array<MarkName>;
    test: RegExp;
    take?: boolean;
};
export type MarkCallCast = MarkCallLink & {
    list: Array<Mark>;
    lineText: Array<string>;
};
export type Mark = MarkFallCull | MarkLineSlot | MarkRiseSlot | MarkComb | MarkSideSize | MarkSize | MarkRiseNest | MarkRiseHold | MarkFallHold | MarkRiseText | MarkFallText | MarkRiseNick | MarkFallNick | MarkLink | MarkCode | MarkNote | MarkRiseCull | MarkText | MarkTermText | MarkRiseLineText | MarkFallLineText | MarkLineTextLink | MarkLineTextSlot;
export default function makeTextList(link: MarkCallLink): MarkCallCast;
export {};
