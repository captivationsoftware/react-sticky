react-sticky [![Build Status](https://travis-ci.org/captivationsoftware/react-sticky.svg?branch=master)](https://travis-ci.org/captivationsoftware/react-sticky)
============

### [Demo](https://captivationsoftware.github.io/react-sticky)

Make your React components sticky!

NOTE: Version 4.0.0 is in progress -- 3.0.0 was the last stable version. 

Perfect for headers, menus, or any other element where you want to maximize
usability as your users scroll. Tons of options to make this component fit
your project's needs, or simply rely on the ready-to-go defaults.

##### Highlights:
  - High Performance
  - Allows multiple Sticky elements on the page at once with compositional awareness!

## Installation
```sh
npm install react-sticky
```

Tip: run `npm install` to build the compressed UMD version suitable for inclusion via CommonJS, AMD, and even good old fashioned `<script>` tags.

## Code Example

Create a `<Sticky.Container />` and then add `<Sticky />` elements like so:

app.jsx
```js
var React = require('react'),
  Sticky = require('react-sticky');

var Header = React.createClass({
  render: function() {
    return (
      <Sticky.Container>
        ...
        <Sticky>
          <header>
            <nav />
          </header>
        </Sticky>
        ...
      </Sticky.Container>
    );
  },
});

```

When the "stickiness" becomes activated, the following css style rules are applied to the Sticky element:

```css
  position: fixed;
  top: 0;
  left: 0;
  width: < width of sticky-container >
```

### Props

#### stickyContainerClass
If you would like to use another name for sticky container's besides `sticky-container`, you may supply the class name you would like to use:

app.jsx
```js
<div class="my-container"
  <Sticky stickyContainerClass="my-container">
    <header />
  </Sticky>
</div>
```

#### stickyStyle
In the event that you wish to override the style rules applied, simply pass in the style object as a prop:

app.jsx
```js
<Sticky stickyStyle={customStyleObject}>
  <header />
</Sticky>
```

Note:
For more information on the style object see <http://facebook.github.io/react/tips/inline-styles.html>

#### stickyClass
You can also specify a class name ('sticky' by default) to be applied when the element becomes sticky:

app.jsx
```js
<Sticky stickyClass={customClassName}>
  <header />
</Sticky>
```

If you prefer to use external CSS rules instead of inline styles, you will need to pass an empty object to the stickyStyle property. Doing so will prevent the default inline styles from taking precedence over your own CSS rules. An example of how to do this is found below:

app.jsx
```js
<Sticky stickyClass="supersticky" stickyStyle={{}}>
  <header />
</Sticky>
```

#### topOffset
Sticky state will be triggered when the top of the element is `topOffset` pixels from the top of the window (0 by default). Positive numbers give the impression of a lazy sticky state, whereas negative numbers are more eager in their attachment.

app.jsx
```js
<Sticky topOffset={80}>
  <SomeChild />
</Sticky>
```

The above would result in an element that becomes sticky once its top is greater than or equal to 80px away from the top of the screen.


#### className
You can specify a class name that would be applied to the resulting element:

app.jsx
```js
<Sticky className={className}>
  <header />
</Sticky>
```

#### style
You can specify a style object that would be applied to the resulting element:

app.jsx
```js
<Sticky style={{background: 'red'}}>
  <header />
</Sticky>
```

Note: In the event that `stickyStyle` rules conflict with `style` rules, `stickyStyle` rules take precedence ONLY while sticky state is active.

#### onStickyStateChange

Use the onStickyStateChange prop to fire a callback function when the sticky state changes:

app.jsx
```js
<Sticky onStickyStateChange={this.handleStickyStateChange}>
  <header />
</Sticky
```

## Supported By

##### [Captivation Software](http://www.captivationsoftware.com)

## License

MIT License
