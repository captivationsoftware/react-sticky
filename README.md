react-sticky
============

A simple React component polyfill for making any mounted component on your page sticky. This uses the raf (https://github.com/chrisdickinson/raf) polyfill to ensure that the animations for super-smooth scrolling work well for all major browsers.

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

To control the look-and-feel of what happens when the "stickiness" becomes activated, you will need to add the .sticky class to your stylesheet:

app.css
```css
.sticky {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
```
Note: 
We didn't want to make any assumptions about your project, and as such, the above css rule is required for this component to have any visual effect. Having said that, the above will most likely cover the majority of use cases. 

### Options

In the event that you do not want to use the default class name, .sticky, you can override the default like so:

app.jsx
```js
<Sticky stickyClassName="fixed">
  <header />
</Sticky>
```

app.css
```css
.fixed {
  ...
}
```

A more in-depth example is included, but you will need to build it first using the following command:
```sh
scripts/build-example
```

## Contributors

Captivation Software (@teamcaptivation)

By all means, if you see room for improvement, let us know!

## License

MIT License

