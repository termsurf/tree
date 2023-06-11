export declare enum TextName {
    FallCull = "text-fall-cull",
    FallNick = "text-fall-nick",
    FallHold = "text-fall-hold",
    FallLine = "text-fall-line",
    FallText = "text-fall-text",
    Link = "text-link",
    Note = "text-note",
    Comb = "text-comb",
    Code = "text-code",
    Line = "text-line",
    RiseCull = "text-rise-cull",
    RiseSlot = "text-rise-slot",
    RiseNick = "text-rise-nick",
    RiseNest = "text-rise-nest",
    RiseHold = "text-rise-hold",
    RiseLine = "text-rise-line",
    RiseText = "text-rise-text",
    LineSlot = "text-line-slot",
    SideSize = "text-side-size",
    Text = "text-text",
    TermSlot = "text-term-slot",
    Size = "text-size"
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
export declare const TEXT_TEXT_TEST_LIST: Array<TextName>;
export declare const TEXT_NAME: Array<TextName>;
export declare const TEXT_TEST_LIST: Array<TextName>;
export type TextFallCull = TextBase & {
    form: TextName.FallCull;
};
export type TextFallLine = TextBase & {
    form: TextName.FallLine;
};
export type TextLine = TextBase & {
    form: TextName.Line;
};
export type TextRiseSlot = TextBase & {
    form: TextName.RiseSlot;
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
export type TextRiseLine = TextBase & {
    form: TextName.RiseLine;
};
export type TextLineSlot = TextBase & {
    form: TextName.LineSlot;
};
export type TextText = TextBase & {
    form: TextName.Text;
};
export type TextTermSlot = TextBase & {
    form: TextName.TermSlot;
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
    head?: Array<TextName>;
    test: RegExp;
    take?: boolean;
};
export type TextCallCast = TextCallLink & {
    list: Array<Text>;
    lineText: Array<string>;
};
export type Text = TextFallCull | TextLine | TextLineSlot | TextRiseSlot | TextComb | TextSideSize | TextSize | TextRiseNest | TextRiseHold | TextFallHold | TextRiseText | TextFallText | TextRiseNick | TextFallNick | TextLink | TextCode | TextNote | TextRiseCull | TextText | TextTermSlot | TextRiseLine | TextFallLine;
export default function makeTextList(link: TextCallLink): TextCallCast;
