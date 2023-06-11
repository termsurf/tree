import Halt, { Link } from '@tunebond/halt';
import { Text, TextCallCast, TextRank } from './text';
import { FoldCallCast } from './fold';
type WithName = {
    name: string;
};
type WithBase = WithName & {
    base: string;
};
type WithText = {
    text: string;
};
declare const base: {
    not_implemented: {
        code: number;
        note: ({ name, base }: WithBase) => string;
    };
    syntax_error: {
        code: number;
        note: ({ text }: WithText) => string;
    };
    invalid_whitespace: {
        code: number;
        note: ({ text }: WithText) => string;
    };
};
type Base = typeof base;
type Name = keyof Base;
export default function halt(form: Name, link: Link<Base, Name>): Halt<{
    not_implemented: {
        code: number;
        note: ({ name, base }: WithBase) => string;
    };
    syntax_error: {
        code: number;
        note: ({ text }: WithText) => string;
    };
    invalid_whitespace: {
        code: number;
        note: ({ text }: WithText) => string;
    };
}, "not_implemented" | "syntax_error" | "invalid_whitespace">;
export declare function haltNotImplemented(name: string, base: string): Halt<{
    not_implemented: {
        code: number;
        note: ({ name, base }: WithBase) => string;
    };
    syntax_error: {
        code: number;
        note: ({ text }: WithText) => string;
    };
    invalid_whitespace: {
        code: number;
        note: ({ text }: WithText) => string;
    };
}, "not_implemented" | "syntax_error" | "invalid_whitespace">;
export declare function generateSyntaxTokenError(cast: TextCallCast, last: Text): Halt<{
    not_implemented: {
        code: number;
        note: ({ name, base }: WithBase) => string;
    };
    syntax_error: {
        code: number;
        note: ({ text }: WithText) => string;
    };
    invalid_whitespace: {
        code: number;
        note: ({ text }: WithText) => string;
    };
}, "not_implemented" | "syntax_error" | "invalid_whitespace">;
export declare function generateHighlightedErrorText(lineText: Array<string>, rank: TextRank): string;
export declare function makeRankText(bond: TextRank, lineText: Array<string>, rank: TextRank): string;
export declare function generateInvalidWhitespaceError(cast: FoldCallCast, slot: number): Halt<{
    not_implemented: {
        code: number;
        note: ({ name, base }: WithBase) => string;
    };
    syntax_error: {
        code: number;
        note: ({ text }: WithText) => string;
    };
    invalid_whitespace: {
        code: number;
        note: ({ text }: WithText) => string;
    };
}, "not_implemented" | "syntax_error" | "invalid_whitespace">;
export declare function getCursorRangeForTextWhitespaceToken(call: FoldCallCast, slot: number): {
    head: {
        mark: number;
        line: number;
    };
    base: {
        mark: number;
        line: number;
    };
};
export {};
