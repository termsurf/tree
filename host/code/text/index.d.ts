declare enum Form {
    Base = "base",
    Line = "line",
    Text = "text",
    Nick = "nick",
    Cull = "cull",
    Term = "term"
}
export declare enum TextName {
    FallCull = "text-fall-cull",
    FallNick = "text-fall-nick",
    FallHold = "text-fall-hold",
    FallLineText = "text-fall-line",
    FallText = "text-fall-text",
    Link = "text-link",
    Note = "text-note",
    Comb = "text-comb",
    Code = "text-code",
    RiseCull = "text-rise-cull",
    RiseSlot = "text-rise-slot",
    RiseNick = "text-rise-nick",
    RiseNest = "text-rise-nest",
    RiseHold = "text-rise-hold",
    RiseLineText = "text-rise-line",
    RiseText = "text-rise-text",
    LineSlot = "text-line-slot",
    SideSize = "text-side-size",
    Text = "text-text",
    TermText = "text-term-text",
    RiseTerm = "text-rise-term",
    FallTerm = "text-fall-term",
    Size = "text-size",
    LineTextLink = "text-line-text-link",
    LineTextSlot = "text-line-text-slot"
}
export type TextRankLink = {
    mark: number;
    line: number;
};
export type TextRank = {
    base: TextRankLink;
    head: TextRankLink;
};
export declare const TEXT_LINE_TEST_LIST: Array<TextName>;
export declare const TEXT_NICK_TEST_LIST: Array<TextName>;
export declare const TEXT_TEXT_TEST_LIST: Array<TextName>;
export declare const TEXT_TERM_TEST_LIST: Array<TextName>;
export declare const TEXT_CULL_TEST_LIST: Array<TextName>;
export declare const TEXT_NAME: Array<TextName>;
export declare const TEXT_BASE_TEST_LIST: Array<TextName>;
export declare const TEXT_TEST: Record<Form, Array<TextName>>;
export type TextRiseTerm = TextBase & {
    form: TextName.RiseTerm;
};
export type TextFallTerm = TextBase & {
    form: TextName.FallTerm;
};
export type TextFallCull = TextBase & {
    form: TextName.FallCull;
};
export type TextFallLineText = TextBase & {
    form: TextName.FallLineText;
};
export type TextRiseSlot = TextBase & {
    form: TextName.RiseSlot;
};
export type TextLineTextLink = TextBase & {
    form: TextName.LineTextLink;
};
export type TextLineTextSlot = TextBase & {
    form: TextName.LineTextSlot;
};
export type TextComb = TextBase & {
    form: TextName.Comb;
};
export type TextSideSize = TextBase & {
    form: TextName.SideSize;
};
export type TextSize = TextBase & {
    form: TextName.Size;
};
export type TextRiseNest = TextBase & {
    form: TextName.RiseNest;
};
export type TextRiseHold = TextBase & {
    form: TextName.RiseHold;
};
export type TextFallHold = TextBase & {
    form: TextName.FallHold;
};
export type TextRiseText = TextBase & {
    form: TextName.RiseText;
};
export type TextFallText = TextBase & {
    form: TextName.FallText;
};
export type TextRiseNick = TextBase & {
    form: TextName.RiseNick;
};
export type TextFallNick = TextBase & {
    form: TextName.FallNick;
};
export type TextRiseCull = TextBase & {
    form: TextName.RiseCull;
};
export type TextLink = TextBase & {
    form: TextName.Link;
};
export type TextCode = TextBase & {
    form: TextName.Code;
};
export type TextNote = TextBase & {
    form: TextName.Note;
};
export type TextRiseLineText = TextBase & {
    form: TextName.RiseLineText;
};
export type TextLineSlot = TextBase & {
    form: TextName.LineSlot;
};
export type TextText = TextBase & {
    form: TextName.Text;
};
export type TextTermText = TextBase & {
    form: TextName.TermText;
};
export type TextCallLink = {
    link: string;
    text: string;
};
export type TextLineRange = {
    mark: number;
    line: number;
};
export type TextBase = {
    rank: TextRank;
    text: string;
};
export type TextSeed = {
    base?: Array<TextName>;
    test: RegExp;
    take?: boolean;
};
export type TextCallCast = TextCallLink & {
    list: Array<Text>;
    lineText: Array<string>;
};
export type Text = TextFallCull | TextLineSlot | TextRiseSlot | TextComb | TextSideSize | TextSize | TextRiseNest | TextRiseHold | TextFallHold | TextRiseText | TextFallText | TextRiseNick | TextFallNick | TextLink | TextCode | TextNote | TextRiseCull | TextText | TextTermText | TextRiseLineText | TextFallLineText | TextRiseTerm | TextFallTerm | TextLineTextLink | TextLineTextSlot;
export default function makeTextList(link: TextCallLink): TextCallCast;
export {};
