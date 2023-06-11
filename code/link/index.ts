import makeFoldList, {
  Fold,
  FoldCallCast,
  FoldHash,
  FoldName,
  haveFoldForm,
} from '../fold/index.js'
import makeTextList, { MarkCallLink } from '../mark/index.js'
import {
  Link,
  LinkCallCast,
  LinkCode,
  LinkComb,
  LinkCull,
  LinkHint,
  LinkLine,
  LinkName,
  LinkNick,
  LinkSideSize,
  LinkSize,
  LinkTerm,
  LinkKnit,
  LinkText,
  LinkTree,
  haveLink,
  haveLinkForm,
} from './form.js'
import { haltNotImplemented } from '../halt.js'
import { haveMesh } from '@tunebond/have'

export * from '../fold/index.js'
export * from '../mark/index.js'
export * from './form.js'

type LinkWall = {
  line: Array<number>
  list: Array<Link>
  tree: LinkTree | LinkNick | LinkCull
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

  console.log(
    link.foldList.map(x => ({
      form: x.form,
      text: x.text,
    })),
  )

  console.log(
    link.list.map(x => ({
      form: x.form,
      text: x.text,
    })),
  )

  const context: LinkWall = {
    line: [],
    list: [hold.tree],
    tree: hold.tree,
  }

  hold.wall.push(context)

  while (hold.slot < link.foldList.length) {
    const seed = link.foldList[hold.slot]
    haveMesh(seed, 'seed')

    console.log(seed.text)

    switch (seed.form) {
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
      case FoldName.RiseTermLine:
        readRiseTermLine({
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

  // console.log(printParserMesh(hold.tree))

  return {
    ...link,
    linkTree: hold.tree,
  }
}

function readFallCull(link: LinkCallLink<FoldName.FallCull>): void {
  const { wall } = link.hold
  wall.pop()
}

function readFallNest(link: LinkCallLink<FoldName.FallNest>): void {
  const wall = link.hold.wall[link.hold.wall.length - 1]
  const list = wall?.list
  list?.pop()
  wall?.line.pop()
}

function readFallNick(link: LinkCallLink<FoldName.FallNick>): void {
  const { wall } = link.hold
  wall.pop()
}

function readFallTermLine(
  link: LinkCallLink<FoldName.FallTermLine>,
): void {
  const { wall } = link.hold
  const context = wall[wall.length - 1]
  const list = context?.list
  list?.pop()
}

function readFallText(link: LinkCallLink<FoldName.FallText>): void {
  const { wall } = link.hold
  const context = wall[wall.length - 1]
  const list = context?.list
  list?.pop()
}

function readComb(link: LinkCallLink<FoldName.Comb>): void {
  const { wall } = link.hold
  const context = wall[wall.length - 1]
  const list = context?.list ?? []
  const ride = list?.[list.length - 1]

  switch (ride?.form) {
    case LinkName.Tree: {
      if (link.seed.form === FoldName.Comb) {
        const uint: LinkComb = {
          rank: link.seed.rank,
          form: LinkName.Comb,
          bond: link.seed.bond,
        }

        ride.nest.push(uint)
      }
      break
    }
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readCode(link: LinkCallLink<FoldName.Code>): void {
  const { wall } = link.hold
  const context = wall[wall.length - 1]
  const list = context?.list ?? []
  const ride = list?.[list.length - 1]

  switch (ride?.form) {
    case LinkName.Tree: {
      if (link.seed.form === FoldName.Code) {
        const code: LinkCode = {
          base: link.seed.base,
          rank: link.seed.rank,
          bond: link.seed.bond,
          form: LinkName.Code,
        }

        ride.nest.push(code)
      }
      break
    }
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readRiseCull(link: LinkCallLink<FoldName.RiseCull>): void {
  const { wall } = link.hold
  const context = wall[wall.length - 1]
  const list = context?.list ?? []
  const ride = list?.[list.length - 1]

  switch (ride?.form) {
    case LinkName.Line: {
      const cull: LinkCull = {
        // rank: link.seed.rank,
        nest: [],
        base: ride,
        form: LinkName.Cull,
      }

      ride.list.push(cull)
      list?.push(cull)

      const tree = cull

      wall.push({
        line: [],
        list: [tree],
        tree,
      })
      break
    }
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readRiseNest(link: LinkCallLink<FoldName.RiseNest>): void {
  const wall = link.hold.wall[link.hold.wall.length - 1]

  if (!wall) {
    return
  }

  // console.log(wall.line, JSON.stringify(wall.tree, null, 2))
  let tree: LinkTree | LinkNick | LinkCull | undefined = wall.tree

  for (const part of wall.line) {
    if (tree && tree.form === LinkName.Tree) {
      const node: Link | undefined = tree.nest[part]
      if (node) {
        if (node.form === LinkName.Tree) {
          tree = node
        } else {
          tree = undefined
        }
      } else {
        tree = undefined
        break
      }
    } else if (tree && tree.form === LinkName.Nick) {
      const node: Link | undefined = tree.nest[part]
      if (node) {
        if (node.form === LinkName.Tree) {
          tree = node
        } else {
          tree = undefined
        }
      } else {
        tree = undefined
        break
      }
    } else if (tree && tree.form === LinkName.Cull) {
      const node: Link | undefined = tree.nest[part]
      if (node) {
        if (node.form === LinkName.Tree) {
          tree = node
        } else {
          tree = undefined
        }
      } else {
        tree = undefined
        break
      }
    }
  }

  if (
    tree &&
    (tree.form === LinkName.Tree ||
      tree.form === LinkName.Nick ||
      tree.form === LinkName.Cull)
  ) {
    wall.line.push(tree.nest.length - 1)
    const head = tree.nest[tree.nest.length - 1]
    console.log(JSON.stringify(head))
    if (head) {
      wall.list.push(head)
    } else {
      // throw new Error()
    }
  } else {
    // throw new Error()
  }
}

function readRiseNick(link: LinkCallLink<FoldName.RiseNick>): void {
  const { wall } = link.hold
  const context = wall[wall.length - 1]
  const list = context?.list ?? []
  const ride = list?.[list.length - 1]

  switch (ride?.form) {
    case LinkName.Term: {
      if (link.seed.form === FoldName.RiseNick) {
        const plugin: LinkNick = {
          nest: [],
          base: ride,
          size: link.seed.size,
          form: LinkName.Nick,
        }

        ride.list.push(plugin)

        const tree = plugin

        wall.push({
          line: [],
          list: [tree],
          tree,
        })

        // list?.push(plugin)
      }

      break
    }
    case LinkName.Text: {
      if (link.seed.form === FoldName.RiseNick) {
        const plugin: LinkNick = {
          nest: [],
          base: ride,
          size: link.seed.size,
          form: LinkName.Nick,
        }

        ride.list.push(plugin)

        const tree = plugin

        wall.push({
          line: [],
          list: [tree],
          tree,
        })

        // list?.push(plugin)
      }

      break
    }
    case LinkName.Line: {
      haveFoldForm(link.seed, FoldName.RiseNick)
      haveMesh(ride, 'ride')
      const nick: LinkNick = {
        nest: [],
        rank: link.seed.rank,
        size: link.seed.size,
        form: LinkName.Nick,
      }

      linkBase(nick, ride)

      ride.list.push(nick)

      const tree = nick

      wall.push({
        line: [],
        list: [tree],
        tree,
      })

      // list?.push(plugin)

      break
    }
    default:
      haveMesh(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readRiseTermLine(
  link: LinkCallLink<FoldName.RiseTermLine>,
): void {
  const { wall } = link.hold
  const context = wall[wall.length - 1]
  const list = context?.list ?? []
  const ride = list?.[list.length - 1]

  switch (ride?.form) {
    case LinkName.Line: {
      const term: LinkTerm = {
        nest: [],
        form: LinkName.Term,
      }

      linkBase(term, ride)

      list?.push(term)

      ride.list.push(term)

      break
    }
    case LinkName.Tree: {
      const line: LinkLine = {
        rank: link.seed.rank,
        list: [],
        form: LinkName.Line,
      }

      linkBase(line, ride)

      list?.push(line)

      ride.nest.push(line)

      break
    }
    case LinkName.Cull: {
      const line: LinkLine = {
        rank: link.seed.rank,
        list: [],
        form: LinkName.Line,
      }

      linkBase(line, ride)

      list?.push(line)

      ride.nest.push(line)

      break
    }
    case LinkName.Nick: {
      const line: LinkLine = {
        rank: link.seed.rank,
        list: [],
        form: LinkName.Line,
      }

      linkBase(line, ride)

      list?.push(line)

      ride.nest.push(line)

      break
    }
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readRiseText(link: LinkCallLink<FoldName.RiseText>): void {
  const { wall } = link.hold
  const context = wall[wall.length - 1]
  const list = context?.list ?? []
  const ride = list?.[list.length - 1]

  switch (ride?.form) {
    case LinkName.Tree: {
      const text: LinkKnit = {
        list: [],
        form: LinkName.Text,
      }

      ride.nest.push(text)
      list?.push(text)
      break
    }
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readSideSize(link: LinkCallLink<FoldName.SideSize>): void {
  const { wall } = link.hold
  const context = wall[wall.length - 1]
  const list = context?.list ?? []
  const ride = list?.[list.length - 1]

  switch (ride?.form) {
    case LinkName.Tree: {
      if (link.seed.form === FoldName.SideSize) {
        const int: LinkSideSize = {
          rank: link.seed.rank,
          form: LinkName.SideSize,
          bond: link.seed.bond,
        }

        ride.nest.push(int)
      }
      break
    }
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readText(link: LinkCallLink<FoldName.Text>): void {
  const { wall } = link.hold
  const context = wall[wall.length - 1]
  const list = context?.list ?? []
  const ride = list?.[list.length - 1]

  switch (ride?.form) {
    case LinkName.Text: {
      if (link.seed.form === FoldName.Text) {
        const string: LinkKnitLine = {
          rank: link.seed.rank,
          form: LinkName.TextLine,
          bond: link.seed.bond,
        }

        ride.list.push(string)
      }
      break
    }
    case LinkName.Tree: {
      if (link.seed.form === FoldName.Text) {
        const string: LinkKnitLine = {
          rank: link.seed.rank,
          form: LinkName.TextLine,
          bond: link.seed.bond,
        }

        ride.nest.push(string)
      }
      break
    }
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readTermText(link: LinkCallLink<FoldName.TermText>): void {
  const { wall } = link.hold
  const context = wall[wall.length - 1]
  const list = context?.list ?? []
  const ride = list?.[list.length - 1]

  switch (ride?.form) {
    case LinkName.Term: {
      const base = ride.base
      const oldTerm = ride

      if (link.seed.form === FoldName.TermText) {
        // oldTerm.dive = link.seed.dive
        // oldTerm.soak = link.seed.soak
        oldTerm.form = LinkName.Term
        oldTerm.base = base
        // oldTerm.cull = link.seed.cull

        oldTerm.nest.push({
          rank: link.seed.rank,
          form: LinkName.Text,
          bond: link.seed.bond,
        })

        // if (!link.seed.start) {
        //   const termList: Array<LinkTerm> = mergeTerms(
        //     oldTerm,
        //     newTerm,
        //   )
        // }
        // base.list.push(newTerm)
        // list.push(newTerm)
      }
      break
    }
    case LinkName.Line: {
      const line = ride
      line.list.push({
        rank: link.seed.rank,
        form: LinkName.Text,
        bond: link.seed.bond,
      })
      break
    }
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

function readSize(link: LinkCallLink<FoldName.Size>): void {
  const { wall } = link.hold
  const context = wall[wall.length - 1]
  const list = context?.list ?? []
  const ride = list?.[list.length - 1]

  switch (ride?.form) {
    case LinkName.Tree: {
      if (link.seed.form === FoldName.Size) {
        const uint: LinkSize = {
          form: LinkName.Size,
          bond: link.seed.bond,
        }

        ride.nest.push(uint)
      }
      break
    }
    default:
      haveLink(ride, 'ride')
      throw haltNotImplemented(ride.form, link.link)
  }
}

export const LINK_HINT_TEXT: Record<LinkHint, string> = {
  [LinkHint.NickTerm]: 'nick term',
  [LinkHint.NickText]: 'nick text',
  [LinkHint.NickLine]: 'nick line',
  [LinkHint.Void]: 'void',
  [LinkHint.Term]: 'term',
  [LinkHint.Text]: 'text',
  [LinkHint.Line]: 'line',
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
