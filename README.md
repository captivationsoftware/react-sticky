react-sticky [![Build Status](https://travis-ci.org/captivationsoftware/react-sticky.svg?branch=master)](https://travis-ci.org/captivationsoftware/react-sticky)
============
The most powerful Sticky library available for React!

#### Demos
  - [Basic](http://rawgit.com/captivationsoftware/react-sticky/master/examples/basic/index.html)
  - [Timeline](http://rawgit.com/captivationsoftware/react-sticky/master/examples/timeline/index.html)

#### Highlights
  - Fully-nestable, allowing you to build awesome layouts with familiar syntax
  - Sane defaults so you spend less time configuring
  - Allows multiple Sticky elements on the page at once with compositional awareness!

## Installation
```sh
npm install react-sticky
```

Tip: run `npm build` to build the compressed UMD version suitable for inclusion via CommonJS, AMD, and even good old fashioned `<script>` tags (available as `ReactSticky`).

## Overview & Basic Example

It all starts with a `<StickyContainer />`. This is basically a plain ol' `<div />` with a React-managed `padding-top` css attribute. As you scroll down the page, all `<Sticky />` tags within
will be constrained to the bounds of its closest `<StickyContainer />` parent.

The elements you actually want to "stick" should be wrapped in the `<Sticky />` tag. The full list of props are available below, but typical usage will look something like so:

app.jsx
```js
import React from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
...

class App extends React.Component ({
  render() {
    return (
      ...
      <StickyContainer>
        ...
        <Sticky>
          <header>
            ...
          </header>
        </Sticky>
        ...
      </StickyContainer>
      ...
    );
  },
});

```

When the "stickiness" becomes activated, the following inline style rules are applied to the Sticky element:

```css
  position: fixed;
  top: 0;
  left: 0;
  width: < width is inherited from the closest StickyContainer >
```
Note that the calculation of the Sticky element's height does not currently take margins into account. If you have margins on this element it may result in unexpected behavior.

### `<StickyContainer />` Props

`<StickyContainer />` passes along all props you provide to it without interference. That's right - no restrictions - go nuts!  

### `<Sticky />` Props

#### stickyStyle _(default: {})_
In the event that you wish to override the style rules applied, simply pass in the style object as a prop:

app.jsx
```js
<StickyContainer>
  <Sticky stickyStyle={customStyleObject}>
    <header />
  </Sticky>
</StickyContainer>
```

Note: You likely want to avoid messing with the following attributes in your stickyStyle: `left`, `top`, and `width`.

#### stickyClassName _(default: 'sticky')_
You can also specify a class name to be applied when the element becomes sticky:

app.jsx
```js
<StickyContainer>
  ...
  <Sticky stickyClassName={customClassName}>
    <header />
  </Sticky>
  ...
</StickyContainer>
```

#### topOffset _(default: 0)_
Sticky state will be triggered when the top of the element is `topOffset` pixels from the top of the closest `<StickyContainer />`. Positive numbers give the impression of a lazy sticky state, whereas negative numbers are more eager in their attachment.

app.jsx
```js
<StickyContainer>
  ...
  <Sticky topOffset={80}>
    <SomeChild />
  </Sticky>
  ...
</StickyContainer>
```

The above would result in an element that becomes sticky once its top is greater than or equal to 80px away from the top of the `<StickyContainer />`.


#### bottomOffset _(default: 0)_
Sticky state will be triggered when the bottom of the element is `bottomOffset` pixels from the bottom of the closest `<StickyContainer />`.

app.jsx
```js
<StickyContainer>
  ...
  <Sticky bottomOffset={80}>
    <SomeChild />
  </Sticky>
  ...
</StickyContainer>
```


#### className _(default: '')_
You can specify a class name that would be applied to the resulting element:

app.jsx
```js
<StickyContainer>
  ...
  <Sticky className={className}>
    <header />
  </Sticky>
  ...
</StickyContainer>
```

#### style _(default: {})_
You can also specify a style object that would be applied to the resulting element:

app.jsx
```js
<StickyContainer>
  ...
  <Sticky style={{background: 'red'}}>
    <header />
  </Sticky>
</StickyContainer>
```

Note: In the event that `stickyStyle` rules conflict with `style` rules, `stickyStyle` rules take precedence ONLY while sticky state is active.

#### onStickyStateChange _(default: function() {})_

Use the onStickyStateChange prop to fire a callback function when the sticky state changes:

app.jsx
```js
<StickyContainer>
  ...
  <Sticky onStickyStateChange={this.handleStickyStateChange}>
    <header />
  </Sticky
  ...
</StickyContainer>
```

#### isActive _(default: true)_

Use the isActive prop to manually turn sticky on or off:

app.jsx
```js
<StickyContainer>
  ...
  <Sticky isActive={false}>
    <header />
  </Sticky
  ...
</StickyContainer>
```

### License
MIT
