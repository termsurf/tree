import makeSiftList, {
  SiftCallCast,
  SiftHash,
  SiftName,
} from '../sift/index.js'
import makeTextList from '../leaf/index.js'
import { LeafCallTree } from '../leaf/form.js'
import {
  Tree,
  TreeCallCast,
  TreeCord,
  TreeLine,
  TreeHint,
  TreeKnit,
  TreeName,
  TreeNick,
  TreeFork,
  haveTree,
  TreeText,
  TreeSize,
  TreeComb,
  TreeCode,
} from './form.js'
import kink from '../kink.js'
import { haveMesh } from '@termsurf/have'
import Kink, { KinkList } from '@termsurf/kink'

export * from '../sift/index.js'
export * from '../leaf/index.js'
export * from './form.js'

export * from './show.js'

type TreeCallTree<T extends SiftName> = SiftCallCast & {
  wall: Array<Slab>
  seed: SiftHash[T]
  kinkList: Array<Kink>
}

type Slab = {
  line: Array<Tree>
  nest: Array<Tree>
  slot: number
}

function readSiftTree(link: SiftCallCast): TreeCallCast | KinkList {
  const tree: TreeLine = {
    form: TreeName.Line,
    nest: [],
  }
  const line: Array<Tree> = [tree]
  const nest: Array<Tree> = [tree]

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
    ? new KinkList(kinkList)
    : {
        ...link,
        tree,
      }
}

function readRiseNest(link: TreeCallTree<SiftName.RiseNest>): void {
  const slab = link.wall[link.wall.length - 1]
  haveMesh(slab, 'slab')
  slab.slot++
  const base = slab.nest[slab.slot] as Tree
  slab.line = [base]
}

function readFallNest(link: TreeCallTree<SiftName.FallNest>): void {
  const slab = link.wall[link.wall.length - 1]
  haveMesh(slab, 'slab')
  slab.slot--
  const base = slab.nest[slab.slot] as Tree
  slab.line = [base]
}

function readFallNick(link: TreeCallTree<SiftName.FallNick>): void {
  link.wall.pop()
}

function readFallFork(link: TreeCallTree<SiftName.FallFork>): void {
  const slab = link.wall[link.wall.length - 1]
  slab?.line.pop()
}

function readFallKnit(link: TreeCallTree<SiftName.FallKnit>): void {
  const slab = link.wall[link.wall.length - 1]
  slab?.line.pop()
}

function readFallText(link: TreeCallTree<SiftName.FallText>): void {
  const slab = link.wall[link.wall.length - 1]
  slab?.line.pop()
}

function readBase(link: TreeCallTree<SiftName>) {
  const slab = link.wall[link.wall.length - 1]
  haveMesh(slab, 'slab')
  const base = slab.line[slab.line.length - 1] as Tree
  return { slab, base, wall: link.wall }
}

function readComb(link: TreeCallTree<SiftName.Comb>): void {
  const { base, slab } = readBase(link)

  switch (base.form) {
    case TreeName.Fork: {
      const comb: TreeComb = {
        form: TreeName.Comb,
        leaf: link.seed.leaf,
        bond: link.seed.bond,
      }

      linkBase(comb, base)

      base.nest.push(comb)
      break
    }
    default:
      haveTree(base, 'base')
      throw kink('not_implemented', {
        form: base.form,
        file: link.file,
      })
  }
}

function readCode(link: TreeCallTree<SiftName.Code>): void {
  const { base, slab } = readBase(link)

  switch (base.form) {
    case TreeName.Fork: {
      const code: TreeCode = {
        form: TreeName.Code,
        leaf: link.seed.leaf,
        bond: link.seed.bond,
        mold: link.seed.mold,
      }

      linkBase(code, base)

      base.nest.push(code)
      break
    }
    default:
      haveTree(base, 'base')
      throw kink('not_implemented', {
        form: base.form,
        file: link.file,
      })
  }
}

function readRiseFork(link: TreeCallTree<SiftName.RiseFork>): void {
  const { base, slab, wall } = readBase(link)

  switch (base.form) {
    case TreeName.Line: {
      const fork: TreeFork = {
        nest: [],
        form: TreeName.Fork,
      }

      base.nest.push(fork)
      slab.line.push(fork)

      linkBase(fork, base)

      takeSlab(slab, fork)
      break
    }
    case TreeName.Fork: {
      const fork: TreeFork = {
        nest: [],
        form: TreeName.Fork,
      }

      base.nest.push(fork)
      slab.line.push(fork)

      linkBase(fork, base)

      takeSlab(slab, fork)
      break
    }
    case TreeName.Nick: {
      const fork: TreeFork = {
        nest: [],
        form: TreeName.Fork,
      }

      base.nest = fork
      slab.line.push(fork)

      linkBase(fork, base)

      takeSlab(slab, fork)
      break
    }
    default:
      haveTree(base, 'base')
      throw kink('not_implemented', {
        form: base.form,
        file: link.file,
      })
  }
}

function readRiseNick(link: TreeCallTree<SiftName.RiseNick>): void {
  const { base, wall } = readBase(link)

  switch (base.form) {
    case TreeName.Knit: {
      const nick: TreeNick = {
        form: TreeName.Nick,
        size: link.seed.size,
        // fold: link.seed.leaf,
      }
      base.nest.push(nick)
      // slab.line.push(nick)

      makeSlab(wall, nick)

      linkBase(nick, base)
      break
    }
    case TreeName.Text: {
      const nick: TreeNick = {
        form: TreeName.Nick,
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

function readRiseKnit(link: TreeCallTree<SiftName.RiseKnit>): void {
  const { base, slab } = readBase(link)

  switch (base.form) {
    case TreeName.Fork: {
      const knit: TreeKnit = {
        form: TreeName.Knit,
        nest: [],
      }

      base.nest.push(knit)
      slab.line.push(knit)

      linkBase(knit, base)

      takeSlab(slab, knit)
      break
    }
    default:
      haveTree(base, 'base')
      throw kink('not_implemented', {
        form: base.form,
        file: link.file,
      })
  }
}

function readRiseText(link: TreeCallTree<SiftName.RiseText>): void {
  const { base, slab } = readBase(link)

  switch (base.form) {
    case TreeName.Fork: {
      const text: TreeText = {
        form: TreeName.Text,
        nest: [],
      }
      base.nest.push(text)
      slab.line.push(text)
      break
    }
    default:
      haveTree(base, 'base')
      throw kink('not_implemented', {
        form: base.form,
        file: link.file,
      })
  }
}

function readCord(link: TreeCallTree<SiftName.Cord>): void {
  const { base } = readBase(link)

  switch (base.form) {
    case TreeName.Knit: {
      const cord: TreeCord = {
        form: TreeName.Cord,
        leaf: link.seed.leaf,
      }

      base.nest.push(cord)

      linkBase(cord, base)
      break
    }
    case TreeName.Text: {
      const cord: TreeCord = {
        form: TreeName.Cord,
        leaf: link.seed.leaf,
      }

      base.nest.push(cord)

      linkBase(cord, base)
      break
    }
    default:
      haveTree(base, 'base')
      throw kink('not_implemented', {
        form: base.form,
        file: link.file,
      })
  }
}

function readSize(link: TreeCallTree<SiftName.Size>): void {
  const { base } = readBase(link)

  switch (base.form) {
    case TreeName.Fork: {
      const size: TreeSize = {
        form: TreeName.Size,
        leaf: link.seed.leaf,
        bond: link.seed.bond,
      }

      base.nest.push(size)

      linkBase(size, base)
      break
    }
    case TreeName.Line: {
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
      haveTree(base, 'base')
      throw kink('not_implemented', {
        form: base.form,
        file: link.file,
      })
  }
}

export const LINK_HINT_TEXT: Record<TreeHint, string> = {
  [TreeHint.NickText]: 'nick text',
  [TreeHint.NickKnit]: 'nick line',
  [TreeHint.Void]: 'void',
  [TreeHint.Text]: 'text',
  [TreeHint.Knit]: 'line',
}

export default function makeTreeFork(
  link: LeafCallTree,
): TreeCallCast | KinkList {
  const lead = makeTextList(link)

  if (Array.isArray(lead)) {
    return new KinkList(lead)
  } else {
    const siftLead = makeSiftList(lead)
    if (Array.isArray(siftLead)) {
      return new KinkList(siftLead)
    }
    return readSiftTree(siftLead)
  }
}

function linkBase(head: Tree, base: Tree) {
  Object.defineProperty(head, 'base', {
    value: base,
    enumerable: false,
    writable: true,
  })
}

function takeSlab(slab: Slab, head: Tree) {
  if (slab.line.length === 2) {
    slab.nest = slab.nest.slice(0, slab.slot + 1)
    slab.nest.push(head)
  }
}

function makeSlab(wall: Array<Slab>, head: Tree) {
  wall.push({
    line: [head],
    nest: [head],
    slot: 0,
  })
}
