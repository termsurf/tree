import type { FoldResultType, LinkInputType, LinkNodeType, LinkResultType, TextTokenType } from '~';
import { Text } from './text/index.js';
import type { TextInputType } from './text/index.js';
export * from './fold/index.js';
export * from './text/index.js';
export * from './form.js';
export declare enum LinkHint {
    Code = "code",
    DynamicPath = "dynamic-path",
    DynamicTerm = "dynamic-term",
    DynamicText = "dynamic-text",
    Empty = "",
    Mark = "mark",
    StaticPath = "static-path",
    StaticTerm = "static-term",
    StaticText = "static-text"
}
export declare function assertTextGenericType(object: unknown, name?: string): asserts object is TextTokenType<Text>;
export declare function assertTextType<T extends Text>(object: unknown, type: T, name?: string): asserts object is TextTokenType<T>;
export declare function isTextGenericType(object: unknown): object is TextTokenType<Text>;
export declare function isTextType<T extends Text>(object: unknown, type: T): object is TextTokenType<T>;
export declare function parseLinkTree(input: FoldResultType): LinkResultType;
export declare function parse_closeHandle(input: LinkInputType): void;
export declare function parse_closeIndex(input: LinkInputType): void;
export declare function parse_closeNest(input: LinkInputType): void;
export declare function parse_closePlugin(input: LinkInputType): void;
export declare function parse_closeTerm(input: LinkInputType): void;
export declare function parse_closeTermPath(input: LinkInputType): void;
export declare function parse_closeText(input: LinkInputType): void;
export declare function parse_decimal(input: LinkInputType): void;
export declare function parse_hashtag(input: LinkInputType): void;
export declare function parse_openHandle(input: LinkInputType): void;
export declare function parse_openIndex(input: LinkInputType): void;
export declare function parse_openNest(input: LinkInputType): void;
export declare function parse_openPlugin(input: LinkInputType): void;
export declare function parse_openTerm(input: LinkInputType): void;
export declare function parse_openTermPath(input: LinkInputType): void;
export declare function parse_openText(input: LinkInputType): void;
export declare function parse_signedInteger(input: LinkInputType): void;
export declare function parse_string(input: LinkInputType): void;
export declare function parse_termFragment(input: LinkInputType): void;
export declare function parse_unsignedInteger(input: LinkInputType): void;
export declare function printMesh(base: LinkNodeType): string;
export declare function printParserMesh(base: LinkNodeType): string;
export declare const LINK_HINT_TEXT: Record<LinkHint, string>;
export declare function parseLinkText(input: TextInputType): LinkResultType;
