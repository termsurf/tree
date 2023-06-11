import { LINK_TYPE } from './link';
import haveHalt from '@tunebond/have/halt.js';
export function testLinkForm(lead, name) {
    return lead.form === name;
}
export function haveLinkForm(lead, name) {
    if (!testLinkForm(lead, name)) {
        throw haveHalt('form_miss', { call: name, need: 'link' });
    }
}
export function testLink(lead) {
    return LINK_TYPE.includes(lead.form);
}
export function haveLink(lead, call) {
    if (!testLink(lead)) {
        throw haveHalt('form_miss', { call, need: 'link' });
    }
}
//# sourceMappingURL=have.js.map