react-sticky
============

A simple React component polyfill for making any mounted component on your page sticky.

## Installation
```sh
npm install react-sticky
```

## Code Example

app.jsx
```node
var React = require('react'),
  Sticky = require('react-sticky');

var Header = React.createClass({
  render: function() {
    return (
      <Sticky>
        <header>
          ...
        </header>
      </Sticky>
    );
  },
});

```

app.css
```css
.sticky {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
}
```

In the event that you do not want to use the default class name, .sticky, you can override the default like so:

app.jsx
```node
<Sticky stickyClassName="fixed">
  ...
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

