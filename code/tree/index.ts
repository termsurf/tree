import makeSiftList, {
  SiftCallCast,
  SiftHash,
  SiftName,
} from '../sift/index.js'
import makeTextList from '../leaf/index.js'
import { LeafCallLink } from '../leaf/form.js'
import {
  Link,
  LinkCallCast,
  LinkCord,
  LinkTree,
  LinkHint,
  LinkKnit,
  LinkName,
  LinkNick,
  LinkFork,
  haveLink,
  LinkText,
  LinkSize,
  LinkComb,
  LinkCode,
} from './form.js'
import kink from '../kink.js'
import { haveMesh } from '@termsurf/have'
import Kink from '@termsurf/kink'

export * from '../sift/index.js'
export * from '../leaf/index.js'
export * from './form.js'

type LinkCallLink<T extends SiftName> = SiftCallCast & {
  wall: Array<Slab>
  seed: SiftHash[T]
  kinkList: Array<Kink>
}

type Slab = {
  line: Array<Link>
  nest: Array<Link>
  slot: number
}

function readSiftTree(link: SiftCallCast): LinkCallCast | Array<Kink> {
  const tree: LinkTree = {
    form: LinkName.Tree,
    nest: [],
  }
  const line: Array<Link> = [tree]
  const nest: Array<Link> = [tree]

  const slab: Slab = {
    line,
    nest,
    slot: 0,
  }

  const wall: Array<Slab> = [slab]
  const kinkList: Array<Kink> = []

  let tick = 0

  while (tick < link.siftList.length) {
    const seed = link.siftList[tick]
    haveMesh(seed, 'seed')

    // console.log(seed)

    switch (seed.form) {
      case SiftName.RiseKnit:
        readRiseKnit({
          ...link,
          wall,
          kinkList,
          seed,
        })
        break
      case SiftName.FallKnit:
        readFallKnit({
          ...link,
          wall,
          kinkList,
          seed,
        })
        break
      case SiftName.RiseFork:
        readRiseFork({
          ...link,
          wall,
          kinkList,
          seed,
        })
        break
      case SiftName.FallFork:
        readFallFork({
          ...link,
          wall,
          kinkList,
          seed,
        })
        break
      case SiftName.RiseNick:
        readRiseNick({
          ...link,
          wall,
          kinkList,
          seed,
        })
        break
      case SiftName.FallNick:
        readFallNick({
          ...link,
          wall,
          kinkList,
          seed,
        })
        break
      case SiftName.Size:
        readSize({
          ...link,
          wall,
          kinkList,
          seed,
        })
        break
      case SiftName.RiseText:
        readRiseText({
          ...link,
          wall,
          kinkList,
          seed,
        })
        break
      case SiftName.FallText:
        readFallText({
          ...link,
          wall,
          kinkList,
          seed,
        })
        break
      case SiftName.Cord:
        readCord({
          ...link,
          wall,
          kinkList,
          seed,
        })
        break
      case SiftName.Comb:
        readComb({
          ...link,
          wall,
          kinkList,
          seed,
        })
        break
      case SiftName.Code:
        readCode({
          ...link,
          wall,
          kinkList,
          seed,
        })
        break
      case SiftName.RiseNest:
        readRiseNest({
          ...link,
          wall,
          kinkList,
          seed,
        })
        break
      case SiftName.FallNest:
        readFallNest({
          ...link,
          wall,
          kinkList,
          seed,
        })
        break
      default:
        throw kink('not_implemented', {
          form: seed.form,
          file: link.file,
        })
    }

    tick++
  }

  return kinkList.length
    ? kinkList
    : {
        ...link,
        tree,
      }
}

function readRiseNest(link: LinkCallLink<SiftName.RiseNest>): void {
  const slab = link.wall[link.wall.length - 1]
  haveMesh(slab, 'slab')
  slab.slot++
  const base = slab.nest[slab.slot] as Link
  slab.line = [base]
}

function readFallNest(link: LinkCallLink<SiftName.FallNest>): void {
  const slab = link.wall[link.wall.length - 1]
  haveMesh(slab, 'slab')
  slab.slot--
  const base = slab.nest[slab.slot] as Link
  slab.line = [base]
}

function readFallNick(link: LinkCallLink<SiftName.FallNick>): void {
  link.wall.pop()
}

function readFallFork(link: LinkCallLink<SiftName.FallFork>): void {
  const slab = link.wall[link.wall.length - 1]
  slab?.line.pop()
}

function readFallKnit(link: LinkCallLink<SiftName.FallKnit>): void {
  const slab = link.wall[link.wall.length - 1]
  slab?.line.pop()
}

function readFallText(link: LinkCallLink<SiftName.FallText>): void {
  const slab = link.wall[link.wall.length - 1]
  slab?.line.pop()
}

function readBase(link: LinkCallLink<SiftName>) {
  const slab = link.wall[link.wall.length - 1]
  haveMesh(slab, 'slab')
  const base = slab.line[slab.line.length - 1] as Link
  return { slab, base, wall: link.wall }
}

function readComb(link: LinkCallLink<SiftName.Comb>): void {
  const { base, slab } = readBase(link)

  switch (base.form) {
    case LinkName.Fork: {
      const comb: LinkComb = {
        form: LinkName.Comb,
        leaf: link.seed.leaf,
        bond: link.seed.bond,
      }

      linkBase(comb, base)

      base.nest.push(comb)
      break
    }
    default:
      haveLink(base, 'base')
      throw kink('not_implemented', {
        form: base.form,
        file: link.file,
      })
  }
}

function readCode(link: LinkCallLink<SiftName.Code>): void {
  const { base, slab } = readBase(link)

  switch (base.form) {
    case LinkName.Fork: {
      const code: LinkCode = {
        form: LinkName.Code,
        leaf: link.seed.leaf,
        bond: link.seed.bond,
        mold: link.seed.mold,
      }

      linkBase(code, base)

      base.nest.push(code)
      break
    }
    default:
      haveLink(base, 'base')
      throw kink('not_implemented', {
        form: base.form,
        file: link.file,
      })
  }
}

function readRiseFork(link: LinkCallLink<SiftName.RiseFork>): void {
  const { base, slab, wall } = readBase(link)

  switch (base.form) {
    case LinkName.Tree: {
      const fork: LinkFork = {
        nest: [],
        form: LinkName.Fork,
      }

      base.nest.push(fork)
      slab.line.push(fork)

      linkBase(fork, base)

      takeSlab(slab, fork)
      break
    }
    case LinkName.Fork: {
      const fork: LinkFork = {
        nest: [],
        form: LinkName.Fork,
      }

      base.nest.push(fork)
      slab.line.push(fork)

      linkBase(fork, base)

      takeSlab(slab, fork)
      break
    }
    case LinkName.Nick: {
      const fork: LinkFork = {
        nest: [],
        form: LinkName.Fork,
      }

      base.nest = fork
      slab.line.push(fork)

      linkBase(fork, base)

      takeSlab(slab, fork)
      break
    }
    default:
      haveLink(base, 'base')
      throw kink('not_implemented', {
        form: base.form,
        file: link.file,
      })
  }
}

function readRiseNick(link: LinkCallLink<SiftName.RiseNick>): void {
  const { base, wall } = readBase(link)

  switch (base.form) {
    case LinkName.Knit: {
      const nick: LinkNick = {
        form: LinkName.Nick,
        size: link.seed.size,
        // fold: link.seed.leaf,
      }
      base.nest.push(nick)
      // slab.line.push(nick)

      makeSlab(wall, nick)

      linkBase(nick, base)
      break
    }
    case LinkName.Text: {
      const nick: LinkNick = {
        form: LinkName.Nick,
        size: link.seed.size,
        // fold: link.seed.leaf,
      }
      base.nest.push(nick)
      // slab.line.push(nick)

      makeSlab(wall, nick)

      linkBase(nick, base)
      break
    }
    default:
      haveMesh(base, 'base')
      throw kink('not_implemented', {
        form: base.form,
        file: link.file,
      })
  }
}

function readRiseKnit(link: LinkCallLink<SiftName.RiseKnit>): void {
  const { base, slab } = readBase(link)

  switch (base.form) {
    case LinkName.Fork: {
      const knit: LinkKnit = {
        form: LinkName.Knit,
        nest: [],
      }

      base.nest.push(knit)
      slab.line.push(knit)

      linkBase(knit, base)

      takeSlab(slab, knit)
      break
    }
    default:
      haveLink(base, 'base')
      throw kink('not_implemented', {
        form: base.form,
        file: link.file,
      })
  }
}

function readRiseText(link: LinkCallLink<SiftName.RiseText>): void {
  const { base, slab } = readBase(link)

  switch (base.form) {
    case LinkName.Fork: {
      const text: LinkText = {
        form: LinkName.Text,
        nest: [],
      }
      base.nest.push(text)
      slab.line.push(text)
      break
    }
    default:
      haveLink(base, 'base')
      throw kink('not_implemented', {
        form: base.form,
        file: link.file,
      })
  }
}

function readCord(link: LinkCallLink<SiftName.Cord>): void {
  const { base } = readBase(link)

  switch (base.form) {
    case LinkName.Knit: {
      const cord: LinkCord = {
        form: LinkName.Cord,
        leaf: link.seed.leaf,
      }

      base.nest.push(cord)

      linkBase(cord, base)
      break
    }
    case LinkName.Text: {
      const cord: LinkCord = {
        form: LinkName.Cord,
        leaf: link.seed.leaf,
      }

      base.nest.push(cord)

      linkBase(cord, base)
      break
    }
    default:
      haveLink(base, 'base')
      throw kink('not_implemented', {
        form: base.form,
        file: link.file,
      })
  }
}

function readSize(link: LinkCallLink<SiftName.Size>): void {
  const { base } = readBase(link)

  switch (base.form) {
    case LinkName.Fork: {
      const size: LinkSize = {
        form: LinkName.Size,
        leaf: link.seed.leaf,
        bond: link.seed.bond,
      }

      base.nest.push(size)

      linkBase(size, base)
      break
    }
    case LinkName.Tree: {
      link.kinkList.push(
        kink('invalid_nesting', {
          file: link.file,
          band: link.seed.leaf.band,
          text: link.lineText,
          hint: `Size values (numbers) shouldn't be used as terms.`,
        }),
      )
      break
    }
    default:
      haveLink(base, 'base')
      throw kink('not_implemented', {
        form: base.form,
        file: link.file,
      })
  }
}

export const LINK_HINT_TEXT: Record<LinkHint, string> = {
  [LinkHint.NickText]: 'nick text',
  [LinkHint.NickKnit]: 'nick line',
  [LinkHint.Void]: 'void',
  [LinkHint.Text]: 'text',
  [LinkHint.Knit]: 'line',
}

export default function makeLinkFork(
  link: LeafCallLink,
): LinkCallCast | Array<Kink> {
  const lead = makeTextList(link)

  if (Array.isArray(lead)) {
    return lead
  } else {
    const siftLead = makeSiftList(lead)
    if (Array.isArray(siftLead)) {
      return siftLead
    }
    return readSiftTree(siftLead)
  }
}

export * from './show.js'

function linkBase(head: Link, base: Link) {
  Object.defineProperty(head, 'base', {
    value: base,
    enumerable: false,
    writable: true,
  })
}

function takeSlab(slab: Slab, head: Link) {
  if (slab.line.length === 2) {
    slab.nest = slab.nest.slice(0, slab.slot + 1)
    slab.nest.push(head)
  }
}

function makeSlab(wall: Array<Slab>, head: Link) {
  wall.push({
    line: [head],
    nest: [head],
    slot: 0,
  })
}
