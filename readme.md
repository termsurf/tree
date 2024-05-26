<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<p align='center'>
  <img src='https://github.com/termsurf/tree/blob/make/view/tree.svg?raw=true' height='256'>
</p>

<h3 align='center'>tree</h3>
<p align='center'>
  A Data Modeling Programming Language
</p>

<br/>
<br/>
<br/>

## Welcome

TreeCode (see the [website](https://tree.surf)) is a little more than a
markup language, tending toward a programming language. In fact, it can
be used for a programming language. It is a way to model information and
computation in an easy to read and write format, suitable for
hierarchical note taking and other means of capturing data down into
structured form.

```
pnpm add @termsurf/tree
```

```ts
import tree from '@termsurf/tree'

const file = './base.tree'
const text = 'form call'
const parse = tree({ file, text })
```

Install the
[syntax highlighter](https://marketplace.visualstudio.com/items?itemName=termsurf.tree-code)
VSCode extension and get aworkin!

<img src='https://github.com/termsurf/tree/blob/make/view/tree.png?raw=true' />

## State of Library

Tests pass for positive cases (`pnpm test`), but fail on some crazy
error cases it should handle nicely. So still have some work to do on
making this robust, but it should parse the basic structures fine, just
not commplicated interpolation styles with nesting.

## License

MIT

## TermSurf

This is being developed by the folks at [TermSurf](https://term.surf), a
California-based project for helping humanity master information and
computation. Find us on [Twitter](https://twitter.com/termsurfcode),
[LinkedIn](https://www.linkedin.com/company/termsurf), and
[Facebook](https://www.facebook.com/termsurf). Check out our other
[GitHub projects](https://github.com/termsurf) as well!
