var React = require('react');

var Sticky = React.createClass({

  statics: {
    instances: [],
    register: function(instance) {
      Sticky.instances.push(instance);
      Sticky.instances.sort(function(a, b) {
        if (a.top() > b.top()) return 1;
        if (b.top() > a.top()) return -1;
        return 0;
      });
    },
    unregister: function(instance) {
      var index = Sticky.instances.indexOf(instance);
      if (index > 0) Sticky.instances.splice(index, 1);
    },
    instancesAbove: function(instance) {
      return Sticky.instances.slice(0, Sticky.instances.indexOf(instance));
    }
  },

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

  getInitialState: function() {
    return {
      events: ['scroll', 'resize', 'touchmove', 'touchend']
    };
  },

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

  top: function() {
    return this.domNode.getBoundingClientRect().top;
  },

  shouldBeSticky: function() {
    return this.pageOffset() > this.unstickY + this.props.topOffset;
  },

  handleTick: function() {
    if (this.hasUnhandledEvent || this.hasTouchEvent) {
      var shouldBeSticky = this.shouldBeSticky();
      this.nextState(shouldBeSticky);
      this.hasUnhandledEvent = false;
    }
    this.tick();
  },

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

  componentDidMount: function() {
    this.state.events.forEach(function(type) {
      if (window.addEventListener) {
        window.addEventListener(type, this.handleEvent);
      } else {
        window.attachEvent('on' + type, this.handleEvent);
      }
    }, this);
    this.domNode = React.findDOMNode ? React.findDOMNode(this) : this.getDOMNode();
    this.unstickY = this.top() + this.pageOffset();
    Sticky.register(this);
    this.hasUnhandledEvent = true;
    this.tick();
  },

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
    this.cancel();
  },

  isModernBrowser: function() {
    return window && window.requestAnimationFrame && window.cancelAnimationFrame;
  },

  cancel: function() {
    var cancel = this.isModernBrowser() ? cancelAnimationFrame : clearTimeout;
    cancel(this.currentTick);
  },

  tick: function () {
    var next = this.isModernBrowser() ? requestAnimationFrame : setTimeout;
    this.currentTick = next(this.handleTick, 1000 / 60);
  },

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

  nextClassName: function(shouldBeSticky) {
    var className = this.props.className;
    if (shouldBeSticky) {
      className += ' ' + this.props.stickyClass;
    }
    return className;
  },

  nextState: function(shouldBeSticky) {
    var hasChanged = this.state.isSticky !== shouldBeSticky;
    this.setState({
      isSticky: shouldBeSticky,
      style: this.nextStyle(shouldBeSticky),
      className: this.nextClassName(shouldBeSticky)
    });
    if (hasChanged) this.props.onStickyStateChange(shouldBeSticky);
  },

  render: function() {
    return this.props.type({
      style: this.state.style,
      className: this.state.className
    }, this.props.children);
  }
});

module.exports = Sticky;
