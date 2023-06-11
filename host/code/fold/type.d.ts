import type { TextResult } from '~';
export declare enum FoldName {
    FallHook = "fold-fall-hook",
    FallCull = "fold-fall-cull",
    FallLine = "fold-fall-line",
    FallCard = "fold-fall-card",
    FallNest = "fold-fall-nest",
    FallNick = "fold-fall-nick",
    FallTerm = "fold-fall-term",
    FallTermLine = "fold-fall-term-line",
    FallText = "fold-fall-text",
    Note = "fold-note",
    Comb = "fold-comb",
    Code = "fold-code",
    RiseHook = "fold-rise-hook",
    RiseCull = "fold-rise-cull",
    RiseLine = "fold-rise-line",
    RiseCard = "fold-rise-card",
    RiseNest = "fold-rise-nest",
    RiseNick = "fold-rise-nick",
    RiseTerm = "fold-rise-term",
    RiseTermLine = "fold-rise-term-line",
    RiseText = "fold-rise-text",
    SideSize = "fold-side-size",
    Text = "fold-text",
    TermSlot = "fold-term-slot",
    TermSlotLink = "fold-term-slot-link",
    Size = "fold-size"
}
export type FoldBase = {
    code: number;
};
export type FoldFallHook = FoldBase & {
    form: FoldName.FallHook;
};
export type FoldFallCull = FoldBase & {
    form: FoldName.FallCull;
};
export type FoldFallLine = FoldBase & {
    form: FoldName.FallLine;
};
export type FoldFallCard = FoldBase & {
    form: FoldName.FallCard;
};
export type FoldFallNest = FoldBase & {
    form: FoldName.FallNest;
};
export type FoldFallNick = FoldBase & {
    form: FoldName.FallNick;
};
export type FoldFallTermLine = FoldBase & {
    form: FoldName.FallTermLine;
};
export type FoldFallTerm = FoldBase & {
    form: FoldName.FallTerm;
};
export type FoldFallText = FoldBase & {
    form: FoldName.FallText;
};
export type FoldNote = FoldBase & {
    form: FoldName.Note;
};
export type FoldComb = FoldBase & {
    range: FoldRange;
    form: FoldName.Comb;
    value: number;
};
export type FoldEditorRange = {
    end: number;
    start: number;
};
export type FoldCode = FoldBase & {
    code: string;
    range: FoldRange;
    system: string;
    form: FoldName.Code;
};
export type Fold = FoldFallCull | FoldFallCard | FoldFallNick | FoldFallTermLine | FoldFallTerm | FoldRiseNest | FoldFallNest | FoldFallText | FoldNote | FoldTermSlotLink | FoldComb | FoldRiseLine | FoldFallLine | FoldCode | FoldRiseCull | FoldRiseCard | FoldRiseNick | FoldRiseTermLine | FoldRiseTerm | FoldRiseText | FoldSideSize | FoldText | FoldTermSlot | FoldSize | FoldRiseHook | FoldFallHook;
export type FoldRiseHook = FoldBase & {
    form: FoldName.RiseHook;
};
export type FoldRiseCull = FoldBase & {
    form: FoldName.RiseCull;
};
export type FoldRiseLine = FoldBase & {
    form: FoldName.RiseLine;
};
export type FoldRiseCard = FoldBase & {
    form: FoldName.RiseCard;
};
export type FoldRiseNest = FoldBase & {
    form: FoldName.RiseNest;
};
export type FoldRiseNick = FoldBase & {
    size: number;
    form: FoldName.RiseNick;
};
export type FoldRiseTermLine = FoldBase & {
    form: FoldName.RiseTermLine;
};
export type FoldRiseTerm = FoldBase & {
    form: FoldName.RiseTerm;
};
export type FoldRiseText = FoldBase & {
    form: FoldName.RiseText;
};
export type FoldRange = {
    character: FoldEditorRange;
    line: FoldEditorRange;
    offset: FoldEditorRange;
};
export type FoldResult = TextResult & {
    directions: Array<Fold>;
};
export type FoldSideSize = FoldBase & {
    range: FoldRange;
    form: FoldName.SideSize;
    value: number;
};
export type FoldText = FoldBase & {
    range: FoldRange;
    form: FoldName.Text;
    value: string;
};
export type FoldTermSlot = FoldBase & {
    dereference: boolean;
    guard: boolean;
    query: boolean;
    range: FoldRange;
    start: boolean;
    form: FoldName.TermSlot;
    value: string;
};
export type FoldTermSlotLink = FoldBase & {
    form: FoldName.TermSlotLink;
};
export type FoldSize = FoldBase & {
    range: FoldRange;
    form: FoldName.Size;
    value: number;
};
