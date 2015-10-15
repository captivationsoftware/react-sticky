var React = require('react');
var ReactDOM = require('react-dom');

var Sticky = React.createClass({
  /*
   * Using statics to facilitate positional awareness
   * between multiple Sticky instances residing in the
   * DOM at the same time.
   */
  statics: {
    /*
     * Internal variables. Should not be used beyond
     * the scope of other statics methods or testing.
     */
    __frame: null,
    __instances: [],
    /*
     * Adds the supplied Sticky instance to the
     * internal list of mounted Sticky instances,
     * sorted by the .top() value for each instance.
     *
     * If the animation frame loop (or fallback)
     * isn't running, start it now.
     */
    register: function(instance) {
      Sticky.__instances.push(instance);
      Sticky.__instances.sort(function(a, b) {
        if (a.top() > b.top()) return 1;
        if (b.top() > a.top()) return -1;
        return 0;
      });
      if (Sticky.__frame === null) Sticky.resumeLoop();
    },
    /*
     * Remove the supplied Sticky instance from the
     * internal list of mounted Sticky instances.
     *
     * If the animation frame loop (or fallback)
     * is no longer in use, stop it now.
     */
    unregister: function(instance) {
      var index = Sticky.__instances.indexOf(instance);
      if (index > -1) Sticky.__instances.splice(index, 1);
      if (Sticky.__instances.length === 0) Sticky.cancelLoop();
    },
    /*
     * Return every Sticky instance that is
     * positioned above the supplied instance.
     */
    instancesAbove: function(instance) {
      return Sticky.__instances.slice(0, Sticky.__instances.indexOf(instance));
    },
    /*
     * Returns true if the browser environment can support
     * requestAnimationFrame. Otherwise returns false;
     */
    isModernBrowser: function() {
      return window && window.requestAnimationFrame && window.cancelAnimationFrame;
    },
    /*
     * Creates the next frame in the animation loop.
     */
    resumeLoop: function() {
      var nextFrame = Sticky.isModernBrowser() ? requestAnimationFrame : setTimeout;
      Sticky.__frame = nextFrame(Sticky.onFrame, 1000 / 60);
    },
    /*
     * Cancels the animation loop.
     */
    cancelLoop: function() {
      var cancel = Sticky.isModernBrowser() ? cancelAnimationFrame : clearTimeout;
      cancel(Sticky.__frame);
      Sticky.__frame = null;
    },
    /*
     * Loop iteration routine.
     */
    onFrame: function() {
      for (var i = 0; i < Sticky.__instances.length; i++) {
        var sticky = Sticky.__instances[i];
        sticky.handleFrame();
      }
      Sticky.resumeLoop();
    }
  },
  /*
   * Default properties. Self-explanatory...
   */
  getDefaultProps: function() {
    return {
      type: React.DOM.div,
      className: '',
      style: {},
      stickyClass: 'sticky',
      stickyStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1
      },
      topOffset: 0,
      onStickyStateChange: function () {}
    };
  },
  /*
   * Return the list of events this instance
   * should react to.
   */
  getInitialState: function() {
    return {
      events: ['scroll', 'resize', 'touchmove', 'touchend']
    };
  },
  /*
   * Return the distance of the scrollbar from the
   * top of the window plus the total height of all
   * stuck Sticky instances above this one.
   */
  pageOffset: function() {
    var otherStickies = Sticky.instancesAbove(this);
    var otherStickyOffsets = 0;
    for (var i = 0; i < otherStickies.length; i++) {
      var otherSticky = otherStickies[i];
      if (otherSticky.state.isSticky) {
        otherStickyOffsets += otherSticky.domNode.getBoundingClientRect().height;
      }
    }
    return (window.pageYOffset || document.documentElement.scrollTop) + otherStickyOffsets;
  },
  /*
   * Returns the y-coordinate of the top of this element.
   */
  top: function() {
    return this.domNode.getBoundingClientRect().top;
  },
  /*
   * Returns true/false depending on if this should be sticky.
   */
  shouldBeSticky: function() {
    return this.pageOffset() >= this.origin + this.props.topOffset;
  },
  /*
   * Loop iteration for this instance.
   *
   * Should only fire any time there is an event
   * that hasn't been handled. This serves as a
   * throttle for continuous events (i.e. scroll).
   */
  handleFrame: function() {
    if (this.hasUnhandledEvent || this.hasTouchEvent) {
      var shouldBeSticky = this.shouldBeSticky();
      this.nextState(shouldBeSticky);
      this.hasUnhandledEvent = false;
    }
  },
  /*
   * Lightweight event listener for window events.
   *
   * See http://www.html5rocks.com/en/tutorials/speed/animations/
   */
  handleEvent: function(event) {
    switch (event.type) {
      case 'touchmove':
        this.hasTouchEvent = true;
        break;
      case 'touchend':
        this.hasTouchEvent = false;
        break;
      default:
        this.hasUnhandledEvent = true;
    }
  },
  /*
   * Instance was mounted on the page.
   *
   * In order, this function should:
   *  - Register events listeners with window.
   *  - Cache the domNode using ReactDOM.findDOMNode.
   *  - Store the initial y-position (origin) of this
   *    instance.
   *  - Register this instance, subscribing to animation
   *    loop.
   */
  componentDidMount: function() {
    this.state.events.forEach(function(type) {
      if (window.addEventListener) {
        window.addEventListener(type, this.handleEvent);
      } else {
        window.attachEvent('on' + type, this.handleEvent);
      }
    }, this);
    this.domNode = ReactDOM.findDOMNode(this);
    this.origin = this.top() + this.pageOffset();
    this.hasUnhandledEvent = true;
    Sticky.register(this);
  },
  /*
   * Instance was removed from the page.
   *
   * Undo everything during mounting.
   */
  componentWillUnmount: function() {
    this.state.events.forEach(function(type) {
      if (window.removeEventListener) {
        window.removeEventListener(type, this.handleEvent);
      } else {
        window.detachEvent('on' + type, this.handleEvent)
      }
    }, this);
    this.domNode = null;
    Sticky.unregister(this);
  },
  /*
   * If sticky, merge this.props.stickyStyle with this.props.style.
   * If not, just return this.props.style.
   */
  nextStyle: function(shouldBeSticky) {
    if (shouldBeSticky) {
      var copyStyles = function(dest, source) {
        for (var rule in source) {
          dest[rule] = source[rule];
        };
        return dest;
      }
      return copyStyles(copyStyles({}, this.props.style), this.props.stickyStyle)
    } else {
      return this.props.style;
    }
  },
  /*
   * If sticky, merge this.props.stickyClass with this.props.className.
   * If not, just return this.props.className.
   */
  nextClassName: function(shouldBeSticky) {
    var className = this.props.className;
    if (shouldBeSticky) {
      className += ' ' + this.props.stickyClass;
    }
    return className;
  },
  /*
   * Transition to the next state.
   *
   * Updates the isSticky, style, and className state
   * variables.
   *
   * If sticky state is different than the previous,
   * fire the onStickyStateChange callback.
   */
  nextState: function(shouldBeSticky) {
    var hasChanged = this.state.isSticky !== shouldBeSticky;
    this.setState({
      isSticky: shouldBeSticky,
      style: this.nextStyle(shouldBeSticky),
      className: this.nextClassName(shouldBeSticky)
    });
    if (hasChanged) this.props.onStickyStateChange(shouldBeSticky);
  },
  /*
   * The special sauce.
   */
  render: function() {
    return this.props.type({
      style: this.state.style,
      className: this.state.className
    }, this.props.children);
  }
});

module.exports = Sticky;
