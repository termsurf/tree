import { Link, LinkName, LinkHash, LINK_TYPE } from './link'
import haveHalt from '@tunebond/have/halt.js'

export function testLinkForm<N extends LinkName>(
  lead: unknown,
  name: N,
): lead is LinkHash[N] {
  return (lead as Link).form === name
}

export function haveLinkForm<N extends LinkName>(
  lead: unknown,
  name: N,
): asserts lead is LinkHash[N] {
  if (!testLinkForm(lead, name)) {
    throw haveHalt('form_miss', { call: name, need: 'link' })
  }
}

export function testLink(lead: unknown): lead is Link {
  return LINK_TYPE.includes((lead as Link).form)
}

export function haveLink(
  lead: unknown,
  call: string,
): asserts lead is Link {
  if (!testLink(lead)) {
    throw haveHalt('form_miss', { call, need: 'link' })
  }
}
