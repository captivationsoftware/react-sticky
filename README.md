react-sticky
============

A simple React component polyfill for making any mounted component on your page sticky.

## Installation
```sh
npm install react-sticky
```

## Code Example

First, you will want to wrap the element you want to be sticky with <Sticky></Sticky> tags. When the element is scrolled past the point where it would start to move off screen, the stickiness is activated.

app.jsx
```js
var React = require('react'),
  Sticky = require('react-sticky');

var Header = React.createClass({
  render: function() {
    return (
      <Sticky>
        <header>
          <nav />
        </header>
      </Sticky>
    );
  },
});

```

When the "stickiness" becomes activated, the following css style rules are applied to the Sticky element:

```css
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
```

### Options

#### style
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
You can specify a class name ('sticky' by default) to be applied when the element becomes sticky:

app.jsx
```js
<Sticky stickyClass={customClassName}>
  <header />
</Sticky>
```

#### type
You can specify the type of element (`React.DOM.div` by default) that will be rendered:

app.jsx
```js
<Sticky type={React.DOM.header}>
  <SomeChild />
</Sticky>
```


A more in-depth example is included, but you will need to build it first using the following command:
```sh
scripts/build-example
```

## Contributors

Captivation Software (@teamcaptivation)

Aaron Goin

Alejandro Tardin

By all means, if you see room for improvement, let us know!

## License

MIT License
