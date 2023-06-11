import type { TextCallCast } from '../text/index.js';
import { FoldName } from './form.js';
import type { FoldCallCast } from './form.js';
export * from './form.js';
export type FoldStateHandleType = (link: FoldCallLink) => void;
export type FoldCallLink = TextCallCast;
export type FoldStateType = {
    base: <T extends FoldName>(form: T) => {
        id: number;
        form: T;
    };
    count: (form: FoldName) => number;
    slot: number;
    foldList: Array<FoldName>;
    stack: Array<FoldName>;
};
export default function makeFoldList(link: TextCallCast): FoldCallCast;
