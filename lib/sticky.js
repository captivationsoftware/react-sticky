var React = require('react');

var Sticky = React.createClass({

  getDefaultProps: function() {
    return {
      type: React.DOM.div,
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
      nextState.className = this.props.stickyClass;
    } else {
      nextState.style = {};
      nextState.className = '';
    }
    this.setState(nextState);
    if (isSticky !== wasSticky) {
      this.props.onStickyStateChange(isSticky);
    }
  },

  componentDidMount: function() {
    this.reset();
    window.addEventListener('load', this.handleEvent);
    window.addEventListener('scroll', this.handleEvent);
    window.addEventListener('resize', this.handleEvent);
  },

  componentWillUnmount: function() {
    window.removeEventListener('load', this.handleEvent);
    window.removeEventListener('scroll', this.handleEvent);
    window.removeEventListener('resize', this.handleEvent);
  },

  shouldComponentUpdate: function() {
    return this.state.isSticky !== this.lastState.isSticky;
  },

  render: function() {
    this.lastState = this.state;
    return this.props.type({
      style: this.state.style,
      className: this.state.className
    }, this.props.children);
  }
});

module.exports = Sticky;
