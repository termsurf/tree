import makeFoldList, {
  FoldCallCast,
  FoldHash,
  FoldName,
} from '../sift/index.js'
import makeTextList from '../list/index.js'
import { MarkCallLink } from '../list/form.js'
import {
  Link,
  LinkCallCast,
  LinkCord,
  LinkCull,
  LinkHint,
  LinkKnit,
  LinkName,
  LinkNick,
  LinkTree,
  haveLink,
  haveLinkForm,
} from './form.js'
import { haltNotImplemented } from '../halt.js'
import { haveMesh } from '@tunebond/have'

export * from '../sift/index.js'
export * from '../list/index.js'
export * from './form.js'

type LinkWall = {
  list: Array<Link>
  tree: LinkTree | LinkNick | LinkCull | LinkKnit
}

type LinkCallLinkHold = {
  wall: Array<LinkWall>
  slot: number
  tree: LinkTree
}

type LinkCallLink<T extends FoldName> = FoldCallCast & {
  hold: LinkCallLinkHold
  seed: FoldHash[T]
}

function readFoldTree(link: FoldCallCast): LinkCallCast {
  const hold: LinkCallLinkHold = {
    wall: [],
    slot: 0,
    tree: { nest: [], form: LinkName.Tree },
  }

  // console.log(
  //   link.foldList.map(x => ({
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

  while (hold.slot < link.foldList.length) {
    const seed = link.foldList[hold.slot]
    haveMesh(seed, 'seed')

    // console.log(seed)

    switch (seed.form) {
      case FoldName.RiseKnit:
        readRiseKnit({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.FallKnit:
        readFallKnit({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.RiseTree:
        readRiseTree({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.TermText:
        readTermText({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.RiseNick:
        readRiseNick({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.FallNick:
        readFallNick({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.FallTermLine:
        readFallTermLine({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.RiseCull:
        readRiseCull({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.FallCull:
        readFallCull({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.Size:
        readSize({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.RiseText:
        readRiseText({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.FallText:
        readFallText({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.FallTree:
        readFallTree({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.Text:
        readText({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.Comb:
        readComb({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.SideSize:
        readSideSize({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.Code:
        readCode({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.RiseNest:
        readRiseNest({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.FallNest:
        readFallNest({
          ...link,
          hold,
          seed,
        })
        break
      case FoldName.TermText:
        break
      default:
        throw haltNotImplemented(seed.form, link.link)
    }

    hold.slot++
  }

  haveLinkForm(hold.tree, LinkName.Tree)

  // console.log(JSON.stringify(hold.tree, null, 2))

  return {
    ...link,
    linkTree: hold.tree,
  }
}

function readFallCull(link: LinkCallLink<FoldName.FallCull>): void {
  // const { wall } = link.hold
  // wall.pop()
  takeWallLeaf(link)
}

function readFallNest(link: LinkCallLink<FoldName.FallNest>): void {
  const wall = link.hold.wall[link.hold.wall.length - 1]
  const list = wall?.list
  list?.pop()
  // wall?.line.pop()
}

function readFallNick(link: LinkCallLink<FoldName.FallNick>): void {
  // const { wall } = link.hold
  // wall.pop()
  takeWallLeaf(link)
}

function readFallTree(link: LinkCallLink<FoldName.FallTree>): void {
  // const { wall } = link.hold
  // wall.pop()
  takeWallLeaf(link)
  // console.log('fall tree', link.seed.form)
}

function readFallKnit(link: LinkCallLink<FoldName.FallKnit>): void {
  takeWallLeaf(link)
}

function readFallTermLine(
  link: LinkCallLink<FoldName.FallTermLine>,
): void {
  takeWallLeaf(link)
}

function takeWallLeaf(link: LinkCallLink<FoldName>) {
  const { wall } = link.hold
  const context = wall[wall.length - 1]
  const list = context?.list
  // console.log('take leaf', link.seed.form, list?.[list.length - 1])
  return list?.pop()
}

function readFallText(link: LinkCallLink<FoldName.FallText>): void {
  takeWallLeaf(link)
}

function readWallLeaf(link: LinkCallLink<FoldName>) {
  const { wall } = link.hold
  const context = wall[wall.length - 1]
  const list = context?.list ?? []
  const ride = list?.[list.length - 1]
  return { wall, list, ride }
}

function readComb(link: LinkCallLink<FoldName.Comb>): void {
  const { ride } = readWallLeaf(link)

  switch (ride?.form) {
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readCode(link: LinkCallLink<FoldName.Code>): void {
  const { ride } = readWallLeaf(link)

  switch (ride?.form) {
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readRiseTree(link: LinkCallLink<FoldName.RiseTree>): void {
  const { ride, list, wall } = readWallLeaf(link)

  switch (ride?.form) {
    case LinkName.Tree: {
      const tree: LinkTree = {
        nest: [],
        form: LinkName.Tree,
      }

      ride.nest.push(tree)
      list.push(tree)

      linkBase(tree, ride)
      break
    }
    case LinkName.Knit: {
      const tree: LinkTree = {
        nest: [],
        form: LinkName.Tree,
      }

      linkBase(tree, ride)

      ride.base?.nest.push(tree)
      list.push(tree)
      break
    }
    case LinkName.Cull: {
      const tree: LinkTree = {
        nest: [],
        form: LinkName.Tree,
      }

      linkBase(tree, ride)

      ride.head = tree

      list.push(tree)
      break
    }
    case LinkName.Nick: {
      const tree: LinkTree = {
        nest: [],
        form: LinkName.Tree,
      }

      linkBase(tree, ride)

      ride.head = tree

      list.push(tree)
      break
    }
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readRiseCull(link: LinkCallLink<FoldName.RiseCull>): void {
  const { ride, list, wall } = readWallLeaf(link)

  switch (ride?.form) {
    case LinkName.Knit: {
      const cull: LinkCull = {
        form: LinkName.Cull,
      }

      linkBase(cull, ride)

      ride.list.push(cull)

      list.push(cull) // add it to the context
      break
    }
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readRiseNest(link: LinkCallLink<FoldName.RiseNest>): void {}

function readRiseNick(link: LinkCallLink<FoldName.RiseNick>): void {
  const { ride, wall, list } = readWallLeaf(link)

  switch (ride?.form) {
    case LinkName.Knit: {
      const nick: LinkNick = {
        form: LinkName.Nick,
        size: link.seed.size,
        rank: link.seed.rank,
      }
      ride.list.push(nick)

      linkBase(nick, ride)

      list.push(nick)
      break
    }
    case LinkName.Cull: {
      const tree: LinkTree = {
        form: LinkName.Tree,
        nest: [],
      }

      const knit: LinkKnit = {
        form: LinkName.Knit,
        list: [],
      }

      const nick: LinkNick = {
        form: LinkName.Nick,
        size: link.seed.size,
        rank: link.seed.rank,
      }

      linkBase(nick, knit)

      knit.list.push(nick)

      linkBase(knit, tree)
      linkBase(tree, ride)

      tree.nest.push(knit)

      ride.head = tree

      list.push(tree)
      list.push(knit)
      list.push(nick)
      break
    }
    case LinkName.Tree: {
      const knit: LinkKnit = {
        form: LinkName.Knit,
        list: [],
      }

      const nick: LinkNick = {
        form: LinkName.Nick,
        size: link.seed.size,
        rank: link.seed.rank,
      }

      linkBase(nick, knit)

      knit.list.push(nick)

      linkBase(knit, ride)

      ride.nest.push(knit)

      list.push(knit)
      list.push(nick)
      break
    }
    default:
      haveMesh(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readRiseKnit(link: LinkCallLink<FoldName.RiseKnit>): void {
  const { ride, list, wall } = readWallLeaf(link)

  switch (ride?.form) {
    case LinkName.Tree: {
      const base = ride.nest.find(find => find.form === LinkName.Knit)
      if (base) {
        list.push(base)
      } else {
        const knit: LinkKnit = {
          form: LinkName.Knit,
          list: [],
        }

        ride.nest.push(knit)
        list.push(knit)

        linkBase(knit, ride)
      }
      break
    }
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readRiseText(link: LinkCallLink<FoldName.RiseText>): void {
  const { ride } = readWallLeaf(link)

  switch (ride?.form) {
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readSideSize(link: LinkCallLink<FoldName.SideSize>): void {
  const { ride } = readWallLeaf(link)

  switch (ride?.form) {
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readText(link: LinkCallLink<FoldName.Text>): void {
  const { ride } = readWallLeaf(link)

  switch (ride?.form) {
    case LinkName.Knit: {
      const cord: LinkCord = {
        form: LinkName.Cord,
        bond: link.seed.bond,
        rank: link.seed.rank,
      }

      ride.list.push(cord)

      linkBase(cord, ride)
      break
    }
    case LinkName.Tree: {
      const cord: LinkCord = {
        form: LinkName.Cord,
        bond: link.seed.bond,
        rank: link.seed.rank,
      }

      ride.nest.push(cord)

      linkBase(cord, ride)
      break
    }
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readTermText(link: LinkCallLink<FoldName.TermText>): void {
  const { ride } = readWallLeaf(link)

  switch (ride?.form) {
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readSize(link: LinkCallLink<FoldName.Size>): void {
  const { ride } = readWallLeaf(link)

  switch (ride?.form) {
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

export const LINK_HINT_TEXT: Record<LinkHint, string> = {
  [LinkHint.NickText]: 'nick text',
  [LinkHint.NickKnit]: 'nick line',
  [LinkHint.Void]: 'void',
  [LinkHint.Text]: 'text',
  [LinkHint.Knit]: 'line',
}

export default function makeLinkTree(link: MarkCallLink): LinkCallCast {
  return readFoldTree(makeFoldList(makeTextList(link)))
}

export * from './show.js'

function linkBase(head: Link, base: Link) {
  Object.defineProperty(head, 'base', {
    value: base,
    enumerable: false,
    writable: true,
  })
}
