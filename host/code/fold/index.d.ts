import type { TextCallCast } from '../text/index.js';
import type { FoldCallCast } from './form.js';
export * from './form.js';
export type FoldCallLink = TextCallCast;
export default function makeFoldList(link: FoldCallLink): FoldCallCast;
