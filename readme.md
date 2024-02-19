<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<p align='center'>
  <img src='https://github.com/termsurf/leaf/blob/make/view/link.svg?raw=true' height='256'>
</p>

<h3 align='center'>leaf</h3>
<p align='center'>
  A Data Modeling Language
</p>

<br/>
<br/>
<br/>

## Welcome

LeafText (see the [website](https://leaf.surf)) is a little more than a
markup language, tending toward a programming language. In fact, it can
be used for a programming language. It is a way to model information and
computation in an easy to read and write format, suitable for
hierarchical leaf taking and other means of capturing data down into
structured form.

```
pnpm add @termsurf/leaf
```

```ts
import leaf from '@termsurf/leaf'

const file = './tree.leaf'
const text = 'form call'
const parse = leaf({ file, text })
```

Install the
[syntax highlighter](https://marketplace.visualstudio.com/items?itemName=termsurf.leaf-text)
VSCode extension and get aworkin!

## State of Library

Tests pass for positive cases (`pnpm test`), but fail on some crazy
error cases it should handle nicely. So still have some work to do on
making this robust, but it should parse the basic structures fine, just
not commplicated interpolation styles with nesting.

## License

Copyright 2021-2024 <a href='https://term.surf'>TermSurf</a>

Licensed under the Apache License, Version 2.0 (the "License"); you may
not use this file except in compliance with the License. You may obtain
a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## TermSurf

This is being developed by the folks at [TermSurf](https://term.surf), a
California-based project for helping humanity master information and
computation. Find us on [Twitter](https://twitter.com/termsurfcode),
[LinkedIn](https://www.linkedin.com/company/termsurf), and
[Facebook](https://www.facebook.com/termsurf). Check out our other
[GitHub projects](https://github.com/termsurf) as well!
