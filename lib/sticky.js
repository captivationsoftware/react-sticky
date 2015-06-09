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

  reset: function() {
    var html = document.documentElement;
    var body = document.body;
    var windowOffset = window.pageYOffset || (html.clientHeight ? html : body).scrollTop;

    this.elementOffset = this.getDOMNode().getBoundingClientRect().top + windowOffset;
  },

  handleEvent: function() {
    var wasSticky = this.state.isSticky;
    var isSticky = window.pageYOffset > this.elementOffset;
    var nextState = { isSticky: isSticky };
    if (isSticky) {
      nextState.style = this.props.stickyStyle;
      nextState.className = this.props.className + ' ' + this.props.stickyClass;
    } else {
      nextState.style = {};
      nextState.className = this.props.className;
    }
    this.setState(nextState);
    if (isSticky !== wasSticky) {
      this.props.onStickyStateChange(isSticky);
    }
  },

  componentDidMount: function() {
    this.reset();
    this.state.events.forEach(function(type) {
      window.addEventListener(type, this.handleEvent);
    }, this);
  },

  componentWillUnmount: function() {
    this.state.events.forEach(function(type) {
      window.removeEventListener(type, this.handleEvent);
    }, this);
  },

  render: function() {
    return this.props.type({
      style: this.state.style,
      className: this.state.className
    }, this.props.children);
  }
});

module.exports = Sticky;
