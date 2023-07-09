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
  LinkCull,
  LinkHint,
  LinkKnit,
  LinkName,
  LinkNick,
  LinkFork,
  haveLink,
  haveLinkForm,
} from './form.js'
import kink from '../kink.js'
import { haveMesh } from '@tunebond/have'
import Kink from '@tunebond/kink'

export * from '../sift/index.js'
export * from '../leaf/index.js'
export * from './form.js'

type LinkWall = {
  list: Array<Link>
  tree: LinkTree | LinkFork | LinkNick | LinkCull | LinkKnit
}

type LinkCallLinkHold = {
  wall: Array<LinkWall>
  slot: number
  tree: LinkFork
}

type LinkCallLink<T extends SiftName> = SiftCallCast & {
  hold: LinkCallLinkHold
  seed: SiftHash[T]
}

function readSiftTree(link: SiftCallCast): LinkCallCast {
  const hold: LinkCallLinkHold = {
    wall: [],
    slot: 0,
    tree: { nest: [], form: LinkName.Fork },
  }

  // console.log(
  //   link.siftList.map(x => ({
  //     form: x.form,
  //     text: x.text,
  //   })),
  // )

  // // console.log(
  //   link.list.map(x => ({
  //     form: x.form,
  //     text: x.text,
  //   })),
  // )

  const context: LinkWall = {
    list: [hold.tree],
    tree: hold.tree,
  }

  hold.wall.push(context)

  while (hold.slot < link.siftList.length) {
    const seed = link.siftList[hold.slot]
    haveMesh(seed, 'seed')

    // console.log(seed)

    switch (seed.form) {
      case SiftName.RiseKnit:
        readRiseKnit({
          ...link,
          hold,
          seed,
        })
        break
      case SiftName.FallKnit:
        readFallKnit({
          ...link,
          hold,
          seed,
        })
        break
      case SiftName.RiseFork:
        readRiseFork({
          ...link,
          hold,
          seed,
        })
        break
      case SiftName.RiseNick:
        readRiseNick({
          ...link,
          hold,
          seed,
        })
        break
      case SiftName.FallNick:
        readFallNick({
          ...link,
          hold,
          seed,
        })
        break
      case SiftName.RiseCull:
        readRiseCull({
          ...link,
          hold,
          seed,
        })
        break
      case SiftName.FallCull:
        readFallCull({
          ...link,
          hold,
          seed,
        })
        break
      case SiftName.Size:
        readSize({
          ...link,
          hold,
          seed,
        })
        break
      case SiftName.RiseText:
        readRiseText({
          ...link,
          hold,
          seed,
        })
        break
      case SiftName.FallText:
        readFallText({
          ...link,
          hold,
          seed,
        })
        break
      case SiftName.Cord:
        readCord({
          ...link,
          hold,
          seed,
        })
        break
      case SiftName.Comb:
        readComb({
          ...link,
          hold,
          seed,
        })
        break
      case SiftName.Code:
        readCode({
          ...link,
          hold,
          seed,
        })
        break
      case SiftName.RiseNest:
        readRiseNest({
          ...link,
          hold,
          seed,
        })
        break
      case SiftName.FallNest:
        readFallNest({
          ...link,
          hold,
          seed,
        })
        break
      default:
        throw kink('not_implemented', {
          form: seed.form,
          file: link.file,
        })
    }

    hold.slot++
  }

  haveLinkForm(hold.tree, LinkName.Fork)

  // console.log(JSON.stringify(hold.tree, null, 2))

  return {
    ...link,
    tree: {
      form: LinkName.Tree,
      nest: hold.tree,
    },
  }
}

function readFallCull(link: LinkCallLink<SiftName.FallCull>): void {
  // const { wall } = link.hold
  // wall.pop()
  takeWallLeaf(link)
}

function readFallNest(link: LinkCallLink<SiftName.FallNest>): void {
  const wall = link.hold.wall[link.hold.wall.length - 1]
  const list = wall?.list
  list?.pop()
  // wall?.line.pop()
}

function readFallNick(link: LinkCallLink<SiftName.FallNick>): void {
  // const { wall } = link.hold
  // wall.pop()
  takeWallLeaf(link)
}

function readFallFork(link: LinkCallLink<SiftName.FallFork>): void {
  // const { wall } = link.hold
  // wall.pop()
  takeWallLeaf(link)
  // console.log('fall tree', link.seed.form)
}

function readFallKnit(link: LinkCallLink<SiftName.FallKnit>): void {
  takeWallLeaf(link)
}

function takeWallLeaf(link: LinkCallLink<SiftName>) {
  const { wall } = link.hold
  const context = wall[wall.length - 1]
  const list = context?.list
  // console.log('take leaf', link.seed.form, list?.[list.length - 1])
  return list?.pop()
}

function readFallText(link: LinkCallLink<SiftName.FallText>): void {
  takeWallLeaf(link)
}

function readWallLeaf(link: LinkCallLink<SiftName>) {
  const { wall } = link.hold
  const context = wall[wall.length - 1]
  const list = context?.list ?? []
  const ride = list?.[list.length - 1]
  return { wall, list, ride }
}

function readComb(link: LinkCallLink<SiftName.Comb>): void {
  const { ride } = readWallLeaf(link)

  switch (ride?.form) {
    default:
      haveLink(ride, 'ride')
      throw kink('not_implemented', {
        form: ride.form,
        file: link.file,
      })
  }
}

function readCode(link: LinkCallLink<SiftName.Code>): void {
  const { ride } = readWallLeaf(link)

  switch (ride?.form) {
    default:
      haveLink(ride, 'ride')
      throw kink('not_implemented', {
        form: ride.form,
        file: link.file,
      })
  }
}

function readRiseFork(link: LinkCallLink<SiftName.RiseFork>): void {
  const { ride, list, wall } = readWallLeaf(link)

  switch (ride?.form) {
    case LinkName.Fork: {
      const tree: LinkFork = {
        nest: [],
        form: LinkName.Fork,
      }

      ride.nest.push(tree)
      list.push(tree)

      linkBase(tree, ride)
      break
    }
    case LinkName.Knit: {
      const tree: LinkFork = {
        nest: [],
        form: LinkName.Fork,
      }

      linkBase(tree, ride)

      ride.base?.nest.push(tree)
      list.push(tree)
      break
    }
    case LinkName.Cull: {
      const tree: LinkFork = {
        nest: [],
        form: LinkName.Fork,
      }

      linkBase(tree, ride)

      ride.nest = tree

      list.push(tree)
      break
    }
    case LinkName.Nick: {
      const tree: LinkFork = {
        nest: [],
        form: LinkName.Fork,
      }

      linkBase(tree, ride)

      ride.nest = tree

      list.push(tree)
      break
    }
    default:
      haveLink(ride, 'ride')
      throw kink('not_implemented', {
        form: ride.form,
        file: link.file,
      })
  }
}

function readRiseCull(link: LinkCallLink<SiftName.RiseCull>): void {
  const { ride, list, wall } = readWallLeaf(link)

  switch (ride?.form) {
    case LinkName.Knit: {
      const cull: LinkCull = {
        form: LinkName.Cull,
      }

      linkBase(cull, ride)

      ride.nest.push(cull)

      list.push(cull) // add it to the context
      break
    }
    default:
      haveLink(ride, 'ride')
      throw kink('not_implemented', {
        form: ride.form,
        file: link.file,
      })
  }
}

function readRiseNest(link: LinkCallLink<SiftName.RiseNest>): void {}

function readRiseNick(link: LinkCallLink<SiftName.RiseNick>): void {
  const { ride, wall, list } = readWallLeaf(link)

  switch (ride?.form) {
    case LinkName.Knit: {
      const nick: LinkNick = {
        form: LinkName.Nick,
        size: link.seed.size,
        leaf: link.seed.leaf,
      }
      ride.nest.push(nick)

      linkBase(nick, ride)

      list.push(nick)
      break
    }
    case LinkName.Cull: {
      const tree: LinkFork = {
        form: LinkName.Fork,
        nest: [],
      }

      const knit: LinkKnit = {
        form: LinkName.Knit,
        nest: [],
      }

      const nick: LinkNick = {
        form: LinkName.Nick,
        size: link.seed.size,
      }

      linkBase(nick, knit)

      knit.nest.push(nick)

      linkBase(knit, tree)
      linkBase(tree, ride)

      tree.nest.push(knit)

      ride.nest = tree

      list.push(tree)
      list.push(knit)
      list.push(nick)
      break
    }
    case LinkName.Fork: {
      const knit: LinkKnit = {
        form: LinkName.Knit,
        nest: [],
      }

      const nick: LinkNick = {
        form: LinkName.Nick,
        size: link.seed.size,
      }

      linkBase(nick, knit)

      knit.nest.push(nick)

      linkBase(knit, ride)

      ride.nest.push(knit)

      list.push(knit)
      list.push(nick)
      break
    }
    default:
      haveMesh(ride, 'ride')
      throw kink('not_implemented', {
        form: ride.form,
        file: link.file,
      })
  }
}

function readRiseKnit(link: LinkCallLink<SiftName.RiseKnit>): void {
  const { ride, list, wall } = readWallLeaf(link)

  switch (ride?.form) {
    case LinkName.Fork: {
      const base = ride.nest.find(find => find.form === LinkName.Knit)
      if (base) {
        list.push(base)
      } else {
        const knit: LinkKnit = {
          form: LinkName.Knit,
          nest: [],
        }

        ride.nest.push(knit)
        list.push(knit)

        linkBase(knit, ride)
      }
      break
    }
    default:
      haveLink(ride, 'ride')
      throw kink('not_implemented', {
        form: ride.form,
        file: link.file,
      })
  }
}

function readRiseText(link: LinkCallLink<SiftName.RiseText>): void {
  const { ride } = readWallLeaf(link)

  switch (ride?.form) {
    default:
      haveLink(ride, 'ride')
      throw kink('not_implemented', {
        form: ride.form,
        file: link.file,
      })
  }
}

function readCord(link: LinkCallLink<SiftName.Cord>): void {
  const { ride } = readWallLeaf(link)

  switch (ride?.form) {
    case LinkName.Knit: {
      const cord: LinkCord = {
        form: LinkName.Cord,
        leaf: link.seed.leaf,
      }

      ride.nest.push(cord)

      linkBase(cord, ride)
      break
    }
    case LinkName.Fork: {
      const cord: LinkCord = {
        form: LinkName.Cord,
        leaf: link.seed.leaf,
      }

      ride.nest.push(cord)

      linkBase(cord, ride)
      break
    }
    default:
      haveLink(ride, 'ride')
      throw kink('not_implemented', {
        form: ride.form,
        file: link.file,
      })
  }
}

function readSize(link: LinkCallLink<SiftName.Size>): void {
  const { ride } = readWallLeaf(link)

  switch (ride?.form) {
    default:
      haveLink(ride, 'ride')
      throw kink('not_implemented', {
        form: ride.form,
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
    return readSiftTree(makeSiftList(lead))
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
