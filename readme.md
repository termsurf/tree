<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<p align='center'>
  <img src='https://github.com/cluesurf/tree/blob/make/view/tree.svg?raw=true' height='256'>
</p>

<h3 align='center'>tree</h3>
<p align='center'>
  A Data Modeling Programming Language
</p>

<br/>
<br/>
<br/>

## Welcome

[TreeCode](https://tree.surf) is a little more than a markup language,
tending toward a programming language. In fact, it can be used for a
programming language. It is a way to model information and computation
in an easy to read and write format, suitable for hierarchical note
taking and other means of capturing data down into structured form.

## Theory

There are two types of TreeCode:

- `TreeFlow`: Simple tree structure, non-circular, expanded
  interpolations. This is "simple form" of TreeCode, which can be used
  to construct serializable data like JSON.
- `TreeMesh`: Code tree structure, possibly circular, linked
  interpolations. This is the "complex form" of TreeCode, which can be
  used to write complex code.

Upon parsing, we should be able to say whether or not the TreeCode
passes the threshold for being called `TreeFlow`, otherwise it is by
default considered `TreeMesh`.

In principle, two separate parsers can be developed for these two forms,
`TreeFlow` being optimized for not handling all the complex cases of
circular reasoning and interpolation, just sticking to basic expanding
data structures like JSON.

## Installation

```
pnpm add @cluesurf/tree
```

## Usage

```ts
import makeTree from '@cluesurf/tree'

const file = './base.tree'
const text = `deck <@cluesurf/wolf>
  bear ./code
  test ./test
  mark <0.0.1>`
const tree = makeTree({ file, text })
```

## VSCode Integration

Install the
[syntax highlighter](https://marketplace.visualstudio.com/items?itemName=cluesurf.tree-code)
VSCode extension and get aworkin!

<img src='https://github.com/cluesurf/tree/blob/make/view/tree.png?raw=true' />

## State of Library

Tests pass for positive cases (`pnpm test`), but fail on some crazy
error cases it should handle nicely. So still have some work to do on
making this robust, but it should parse the basic structures fine, just
not commplicated interpolation styles with nesting.

## License

MIT

## ClueSurf

This is being developed by the folks at [ClueSurf](https://clue.surf), a
California-based project for helping humanity master information and
computation. Find us on [X](https://twitter.com/cluesurf),
[LinkedIn](https://www.linkedin.com/company/cluesurf), and
[Facebook](https://www.facebook.com/cluesurf). Check out our other
[GitHub projects](https://github.com/cluesurf) as well!
