<br/>
<br/>
<br/>
<br/>
<br/>
<br/>
<br/>

<p align='center'>
  <img src='https://github.com/tunebond/link/blob/make/view/link.svg?raw=true' height='256'>
</p>

<h3 align='center'>link</h3>
<p align='center'>
  A Data Modeling Language
</p>

<br/>
<br/>
<br/>

## Overview

Link Text is a little more than a markup language, tending toward a
programming language. In fact, it can be used for a programming
language. It is a way to model information and computation in an easy to
read and write format, suitable for hierarchical note taking and other
means of capturing data down into structured form.

It emerged out of the desire to have one way of writing things (notes,
code, data models, etc.), that was not too verbose and was easy to learn
with very few rules. Writing in all lowercase without having to use the
shift key streamlines your typing so you can stream out your knowledge
the most quickly. Existing markup languages like XML, JSON, and YAML are
too static and don't let you define things in as concise a way as
possible. It is indentation-based, and the typical style of a DSL is to
write it in a somewhat repetitive way to give the quick visual cues as
to the meaning of things. But the way you use it is entirely up to you,
those are just style conventions.

## Example

First, some images of different usages of Link Text. Here are a few
examples from existing code. The first is how you might define a "deck"
(a "package" of Link code). The second is the first part of the Tao Te
Ching captured in a tree, and the later we show how you might write a
simple fibonacci function. These examples are DSLs designed for a
specific purposes. As you will see in the syntax section, the Link
language is independent of a DSL and simply defines some simple idioms
for defining trees of text.

A package definition:

```link
deck @tunebond/base
  head <Link Text Compiler>
  make <Link Text>
  make <Computation>
  make <Philosophy>
  make <Information>
  make <Platform>
  make <White Label>
  mate <Lance Pollard>, site <lp@elk.fm>
  mark <0.0.1>
  dock head
  dock task
  read book
  term <Apache 2.0>
```

The first block of the Tao Te Ching:

```link
head <道德经>
  head <第一章>
    text <道可道，非恆道；>
    text <名可名，非恆名。>
    text <無名天地之始；>
    text <有名萬物之母。>
    text <故，>
    text <恆無，欲也，以觀其妙；>
    text <恆有，欲也，以觀其徼。>
    text <此兩者同出而異名，>
    text <同謂之玄。>
    text <玄之又玄，眾妙之門。>
```

And now for some pictures of the code, since we can't get GitHub to
offer syntax highlighting for a while.

<img src="https://github.com/tunebond/link/blob/make/view/tree.png?raw=true" />

---

<img src="https://github.com/tunebond/link/blob/make/view/mine.png?raw=true" />

---

<img src="https://github.com/tunebond/link/blob/make/view/lace.png?raw=true" />

## Usage

```
pnpm add @tunebond/link
yarn add @tunebond/link
npm install @tunebond/link
```

```ts
import read from '@tunebond/link'

console.log(
  read(`
deck @tunebond/base
  head <Link Text Compiler>
  make <Link Text>
  make <Computation>
  make <Philosophy>
  make <Information>
  make <Platform>
  make <White Label>
  mate <Lance Pollard>, site <lp@elk.fm>
  mark <0.0.1>
  dock head
  dock task
  read book
  term <Apache 2.0>
`),
)
```

## Specification

Now we will go into the actual specification of the syntax. The Link
specification language is a minimal modeling language that is
transformable into code. The file extension to be used is `.link`, as in
`file.link`. It has the following syntax.

### Term

The first thing to cover are _terms_. They are composed of _words_,
separated by dashes. A word is composed of lowercase ascii letters or
numbers. A term can't start with a number. So the following are all
words of a term.

```link
xo
hello-world
foo-bar-baz
abc123
```

The following is an invalid term.

```link
1xo
```

You can nest them arbitrarily into trees. These are all trees.

```link
hello world
this is a tree
this
  is
    a
      tree
```

You can write multiple nodes on a line separated by comma:

```link
this is, also a tree, and a tree
```

The same as:

```link
this is
  also
    a tree
      and a tree
```

You can put things in parentheses too to make it easier to write on one
line:

```link
add(a, subtract(b, c))
```

The same as:

```link
add a, subtract b, c
```

### Mark

You can use numbers ("marks") in the system too:

```link
add 1, 2
```

### Comb

A comb is a decimal number.

```link
add 1, subtract -2, 3.14
```

### Text

A more complex structure is the _text_. They are composed of a weaving
of _cords_ (strings) and _terms_. A string/cord is a contiguous sequence
of arbitrary unicode (utf-8).

A simple template composed only of a string is:

```link
write <hello world>
```

Or multiline text:

```link
text <
  This is a long paragraph.

  And this is another paragraph.
>
```

Then we can add interpolation into the template, by referencing terms
wrapped in angle brackets:

```link
write <{hello-world}>
```

A more robust example might be:

```link
moon <The moon has a period of roughly {bold(<28 days>)}.>
```

Note though, you can still use the angle bracket symbols in regular text
without ambiguity, you just need to prefix them with backslashes.

```link
i <am \<brackets\> included in the actual string>
```

### Code

You can write specific code points, or _codes_, by prefixing the number
sign / hash symbol along with a letter representing the code type,
followed by the code.

```link
i #b0101, am bits
i #o123, am octal
i #xaaaaaa, am hex
```

These can also be used directly in a template:

```link
i <am the symbol #x2665>
```

This makes it so you can reference obscure symbols by their numerical
value, or write bits and things like that. Note though, these just get
compiled down to the following, so the code handler would need to
resolve them properly in the proper context.

### Nest

A nest is a selector, which is a digging down into terms. They look like
paths, but they are really diving down into terms, if you think of it
that way.

```link
get foo/bar
```

You can interpolate on these as well, like doing array index lookup.

```link
get node/children[~i]/name
```

The interpolations can be nested as well, and chained. Here is a complex
example:

```link
get foo/bar[x][o/children[~i]/name]/value
```

The `~` tilde is by convention used for lookup by key (index in array,
key in map), while without the tilde is just a dynamically resolved
property value if you think of it that way.

There is also room to write `*` so we can dereference like in other
language paradigms.

```
get *foo/bar
```

Finally, we have the `?` which is theoretically optionally grabbing a
value if it exists.

```
get foo/bar?/baz
```

### Line

A line is a path, like a file path. Because paths are so common in
programming, they don't need to be treated as strings but can be written
directly. The special `@` symbol is for referencing relative to some
"scope" or context, which you would handle in your interpreter of Link
Text.

```link
load @some/path
load ./relative/path.png
load /an-absolute/other/path.js
```

That is, they are just special strings. You can interpolate on them like
strings as well with curly brackets.

## Conclusion

That is all there is to it! It is a simple way of defining trees of
text, allowing for template variables inside text, and for basic
primitives. It is then up to you to figure out what you want to do with
it. Take a look at the [`base.link`](https://github.com/tunebond/base)
project for the work we are doing to build a programming language
environment on top of Link Text. A primitive Link Text parser is
[here](https://github.com/lancejpollard/link-parser.js), which converts
it into a simple tree.

## Implementation Details

Since this an _indentation-based_ language, it is context sensitive and
a little more complex to parse. As such we divide it into 3 phases:

1. **`mark`**: This phase marks each token with a type in a somewhat
   straightforward way, taking into consideration some basic context
   such as whether it is part of `text` or a `term`.
2. **`fold`**: This phase takes the `mark` tokens and converts them into
   a set of _instructions_ for folding them into a tree.
3. **`link`**: This phase takes the `fold` instructions and converts
   them into the "link tree".

Here is the basic set of TypeScript types for Link Text:

```ts
type LinkWave = {
  form: LinkName.Wave
  bond: boolean
}

type LinkComb = {
  form: LinkName.Comb
  bond: number
}

type LinkCode = {
  bond: string
  base: string
  form: LinkName.Code
}

type LinkCull = {
  nest: Array<LinkTree | LinkTerm | LinkLine | LinkBond>
  base: LinkLine
  form: LinkName.Cull
}

type Link =
  | LinkTerm
  | LinkKnit
  | LinkTree
  | LinkSize
  | LinkSideSize
  | LinkKnit
  | LinkText
  | LinkNick
  | LinkCull
  | LinkComb
  | LinkCode
  | LinkLine
  | LinkWave

type LinkLine = {
  base: LinkTree | LinkNick | LinkCull
  list: Array<LinkTerm | LinkCull>
  form: LinkName.Line
}

type LinkNick = {
  nest: Array<LinkTree | LinkTerm | LinkLine>
  base: LinkTerm | LinkKnit
  size: number
  form: LinkName.Nick
}

type LinkSideSize = {
  form: LinkName.SideSize
  bond: number
}

type LinkText = {
  form: LinkName.TextLine
  bond: string
}

type LinkTerm = {
  base: LinkLine | LinkTree | LinkNick
  nest: Array<LinkText | LinkNick>
  form: LinkName.Term
}

type LinkKnit = {
  nest: Array<LinkText | LinkNick>
  form: LinkName.Text
}

type LinkTree = {
  head?: LinkTerm
  nest: Array<Link>
  base?: LinkTree | LinkNick | LinkCull
  form: LinkName.Tree
}

type LinkSize = {
  form: LinkName.Size
  bond: number
}

type LinkBond =
  | LinkSize
  | LinkKnit
  | LinkSideSize
  | LinkCode
  | LinkComb
  | LinkWave
```

## Syntax Highlighter Installation

The Link Text has a
[syntax highlighter For VSCode](https://marketplace.visualstudio.com/items?itemName=tunebond.link-text).
It's not perfect yet but it gets the job done. If you are new to the
Link Text language, here we will give a brief overview of the syntax.
Explore some of our other repos to get a deeper understanding of the
types of things you can do with Link Text. It's far from complete but a
labor of love. Making a little progress all the time.

You can install the
[VSCode syntax highlighter](https://marketplace.visualstudio.com/items?itemName=tunebond.link-text)
from source by placing the unzipped folder into
`$HOME/.vscode/extensions`, then restarting VSCode. Or just download it
from the package install tool in VSCode.

## Development

Inside the editor, press `F5`. This will compile and run the extension
in a new Extension Development Host window. Make changes them press `F5`
again, etc..

[Here](https://code.visualstudio.com/api/get-started/extension-anatomy)
is more info on building an extension.
[Here](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
is how to publish the extension.

## License

Copyright 2021-2023 <a href='https://tune.bond'>TuneBond</a>

Licensed under the Apache License, Version 2.0 (the "License"); you may
not use this file except in compliance with the License. You may obtain
a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## TuneBond

This is being developed by the folks at [TuneBond](https://tune.bond), a
California-based project for helping humanity master information and
computation. TuneBond started off in the winter of 2008 as a spark of an
idea, to forming a company 10 years later in the winter of 2018, to a
seed of a project just beginning its development phases. It is entirely
bootstrapped by working full time and running
[Etsy](https://etsy.com/shop/tunebond) and
[Amazon](https://www.amazon.com/s?rh=p_27%3AMount+Build) shops. Also
find us on [Facebook](https://www.facebook.com/tunebond),
[Twitter](https://twitter.com/tunebond), and
[LinkedIn](https://www.linkedin.com/company/tunebond). Check out our
other GitHub projects as well!
