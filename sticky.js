var React = require('react');

var Sticky = React.createClass({

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
        right: 0
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

  top: function() {
    return this.domNode.getBoundingClientRect().top;
  },

  shouldBeSticky: function() {
    var position = this.domNode.style.position;
    this.domNode.style.position = 'relative';
    var shouldBeSticky = this.top() <= -this.props.topOffset;
    this.domNode.style.position = position;
    return shouldBeSticky;
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
    return [this.props.className]
      .concat(shouldBeSticky ? this.props.stickyClass : undefined)
      .join(' ');
  },

  nextState: function(shouldBeSticky) {
    this.setState({
      isSticky: shouldBeSticky,
      style: this.nextStyle(shouldBeSticky),
      className: this.nextClassName(shouldBeSticky)
    });
    var isSticky = this.state.isSticky;
    if (isSticky !== shouldBeSticky)
      this.props.onStickyStateChange(shouldBeSticky);
  },

  render: function() {
    return this.props.type({
      style: this.state.style,
      className: this.state.className
    }, this.props.children);
  }
});

module.exports = Sticky;
