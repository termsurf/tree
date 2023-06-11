import { Link, LinkName, LinkHash } from './link';
export declare function testLinkForm<N extends LinkName>(lead: unknown, name: N): lead is LinkHash[N];
export declare function haveLinkForm<N extends LinkName>(lead: unknown, name: N): asserts lead is LinkHash[N];
export declare function testLink(lead: unknown): lead is Link;
export declare function haveLink(lead: unknown, call: string): asserts lead is Link;
