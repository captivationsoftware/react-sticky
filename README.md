react-sticky [![Build Status](https://travis-ci.org/captivationsoftware/react-sticky.svg?branch=master)](https://travis-ci.org/captivationsoftware/react-sticky)
============

Make your React components sticky!

#### Update (7/2017): No longer actively maintained:
The 6.0.1 release is the last release maintained by Captivation Software. This means we will not be considering any PR's and/or responding to any issues until a new maintainer is identified. It is *highly* recommended that you begin transitioning to another sticky library to ensure better support and sustainability. This is obviously less than ideal - sorry for any inconvenience!

If you are interested in taking over ownership of react-sticky and are willing and able to invest the time the React community deserves, send a message to info@captivationsoftware.com. 

#### Demos
  - [Basic](http://rawgit.com/captivationsoftware/react-sticky/master/examples/basic/index.html)
  - [Relative](http://rawgit.com/captivationsoftware/react-sticky/master/examples/relative/index.html)
  - [Stacked](http://rawgit.com/captivationsoftware/react-sticky/master/examples/stacked/index.html)

#### Version 6.x Highlights
  - Completely redesigned to support sticky behavior via higher-order component, giving you ultimate control of implementation details
  - Features a minimal yet efficient API
  - Drops support for versions of React < 15.3. If you are using an earlier version of React, continue to use the 5.x series

## Installation
```sh
npm install react-sticky
```

## Overview & Basic Example
`<Sticky />` elements require a function that returns a React component or DOM node as the only child. When invoked, this child function will be supplied an object with the following properties:
 - `isSticky` _(boolean)_ - is the element sticky as a result of the current event?
 - `wasSticky` _(boolean)_ - was the element sticky prior to the current event?
 - `distanceFromTop` _(number)_ - number of pixels from the top of the `Sticky` to the nearest `StickyContainer`'s top
 - `distanceFromBottom` _(number)_ - number of pixels from the bottom of the `Sticky` to the nearest `StickyContainer`'s bottom
 - `calculatedHeight` _(number)_ - height of the element returned by this function
 - `style` _(object)_ - modifiable style attributes to optionally be passed to the element returned by this function

The `Sticky`'s child function will be called when events occur in the parent `StickyContainer`,
and will serve as the callback to apply your own logic and customizations, with sane `style` attributes
to get you up and running quickly.  

app.js
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
          {
            ({
              style,

              // the following are also available but unused in this example
              isSticky,
              wasSticky,
              distanceFromTop,
              distanceFromBottom,
              calculatedHeight
            }) => {
              return (
                <header style={style}>
                  ...
                </header>
              )
            }
          }
        </Sticky>
        ...
      </StickyContainer>
      ...
    );
  },
});

```

When the "stickiness" becomes activated, the arguments to the sticky function
are modified. Similarly, when deactivated, the arguments will update accordingly.

### `<StickyContainer />` Props
`<StickyContainer />` supports all valid `<div />` props.  

### `<Sticky />` Props

#### relative _(default: false)_
Set `relative` to `true` if the `<Sticky />` element will be rendered within
an overflowing `<StickyContainer />` (e.g. `style={{ overflowY: 'auto' }}`) and you want
the `<Sticky />` behavior to react to events only within that container.

When in `relative` mode, `window` events will not trigger sticky state changes. Only scrolling
within the nearest `StickyContainer` can trigger sticky state changes.

#### topOffset _(default: 0)_
Sticky state will be triggered when the top of the element is `topOffset` pixels from the top of the closest `<StickyContainer />`. Positive numbers give the impression of a lazy sticky state, whereas negative numbers are more eager in their attachment.

app.js
```js
<StickyContainer>
  ...
  <Sticky topOffset={80}>
    { props => (...) }
  </Sticky>
  ...
</StickyContainer>
```

The above would result in an element that becomes sticky once its top is greater than or equal to 80px away from the top of the `<StickyContainer />`.

#### topPosition _(default: 0)_
Space in pixels between sticky header and top of the viewport. 

#### bottomOffset _(default: 0)_
Sticky state will be triggered when the bottom of the element is `bottomOffset` pixels from the bottom of the closest `<StickyContainer />`.

app.js
```js
<StickyContainer>
  ...
  <Sticky bottomOffset={80}>
    { props => (...) }
  </Sticky>
  ...
</StickyContainer>
```

The above would result in an element that ceases to be sticky once its bottom is 80px away from the bottom of the `<StickyContainer />`.

#### disableCompensation _(default: false)_
Set `disableCompensation` to `true` if you do not want your `<Sticky />` to apply padding to
a hidden placeholder `<div />` to correct "jumpiness" as attachment changes from `position:fixed`
and back.

app.js
```js
<StickyContainer>
  ...
  <Sticky disableCompensation>
    { props => (...) }
  </Sticky>
  ...
</StickyContainer>
```

#### disableHardwareAcceleration _(default: false)_
When `disableHardwareAcceleration` is set to `true`, the `<Sticky />` element will not use hardware acceleration (e.g. `transform: translateZ(0)`). This setting is not recommended as it negatively impacts
the mobile experience, and can usually be avoided by improving the structure of your DOM.

app.js
```js
<StickyContainer>
  ...
  <Sticky disableHardwareAcceleration>
    { props => (...) }
  </Sticky>
  ...
</StickyContainer>
```

#### placeholderStyles 
An object with inline styles for placeholder.

#### footer _(default: false)_
When `footer` is set to `true`, the `<Sticky />` element will stick to the bottom of viewport. In this case you need to pass `placeholderStyles` property to Sticky with the same 'position' styles(position, bottom, top, etc) and width as you set to your footer. StickyContainer should have `position: realtive`. Doesn't work with `relative: true`. 
```
<StickyContainer style={{ height: 3000, background: '#ddd', padding: '0 30px', position: 'relative'}}>
  <Sticky footer={true} placeholderStyles={{ position: 'absolute', bottom: 100, width: '90vw' }}>
    {
      ({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom, calculatedHeight }) => {
        console.log({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom, calculatedHeight });
        return <Header style={Object.assign({}, { position: 'absolute', bottom: 100, width: '90vw' }, style)} />
      }
    }
  </Sticky>

  <h2 className="text-center" style={{ marginTop: 150 }}>&lt;StickyContainer /&gt;</h2>
</StickyContainer>
```