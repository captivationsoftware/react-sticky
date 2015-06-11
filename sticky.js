var React = require('react');

var Sticky = React.createClass({

  getDefaultProps: function() {
    return {
      type: React.DOM.div,
      className: '',
      stickyClass: 'sticky',
      stickyStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0
      },
      onStickyStateChange: function () {}
    };
  },

  getInitialState: function() {
    return {
      events: ['load', 'scroll', 'resize'],
      style: {}
    };
  },

  scrollPosition: function() {
    var html = document.documentElement;
    var body = document.body;
    return window.pageYOffset || (html.clientHeight ? html : body).scrollTop;
  },

  distanceFromTop: function() {
    return this.getDOMNode().getBoundingClientRect().top;
  },

  initialize: function() {;
    this.elementOffset = this.distanceFromTop() + this.scrollPosition();
  },

  handleTick: function() {
    var wasSticky = this.state.isSticky;
    var isSticky = this.scrollPosition() > this.elementOffset;

    if (this.hasUnhandledEvent && isSticky !== wasSticky) {
      var nextState = { isSticky: isSticky };
      if (isSticky) {
        nextState.style = this.props.stickyStyle;
        nextState.className = this.props.className + ' ' + this.props.stickyClass;
      } else {
        nextState.style = {};
        nextState.className = this.props.className;
      }
      this.setState(nextState);
      this.props.onStickyStateChange(isSticky);
    }
    this.hasUnhandledEvent = false;
    this.tick();
  },

  handleEvent: function() {
    this.hasUnhandledEvent = true;
  },

  componentDidMount: function() {
    this.initialize();
    this.state.events.forEach(function(type) {
      window.addEventListener(type, this.handleEvent);
    }, this);
    this.tick();
  },

  componentWillUnmount: function() {
    this.state.events.forEach(function(type) {
      window.removeEventListener(type, this.handleEvent);
    }, this);
    this.cancel();
  },

  isModernBrowser: function() {
    return requestAnimationFrame && cancelAnimationFrame;
  },

  cancel: function() {
    var cancel = this.isModernBrowser() ? cancelAnimationFrame : clearTimeout;
    cancel(this.currentTick);
  },

  tick: function () {
    var next = this.isModernBrowser() ? requestAnimationFrame : setTimeout;
    this.currentTick = next(this.handleTick, 1000 / 60);
  },

  render: function() {
    return this.props.type({
      style: this.state.style,
      className: this.state.className
    }, this.props.children);
  }
});

module.exports = Sticky;
