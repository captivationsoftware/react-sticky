var React = require('react'),
  raf = require('raf');

var Sticky = React.createClass({

  reset: function() {
    var html = document.documentElement, body = document.body;

    var windowOffset = window.pageYOffset || (html.clientHeight ? html : body).scrollTop;
    this.elementOffset = this.getDOMNode().getBoundingClientRect().top + windowOffset;
  },  
  
  tick: function() {
    if (!this.unmounting) {
      raf(this.tick);
    }

    if (this.resizing) {
      this.resizing = false;
      this.reset();
    }

    if (this.scrolling) {
      this.scrolling = false;
      if (pageYOffset > this.elementOffset) {
        this.setState({ className: this.props.stickyClassName || 'sticky' });
      } else {
        this.setState({ className: '' });
      }
    }
  },  

  handleResize: function() {
    this.resizing = true;
  },

  handleScroll: function() {
    this.scrolling = true;
  },

  getInitialState: function() {
    return { className: '' }; 
  },

  componentDidMount: function() {
    this.reset();
    this.tick(); 
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
    this.unmounting = true;
  },

  render: function() {
    return React.DOM.div({
      className: this.state.className
    }, this.props.children);
  }
});

module.exports = Sticky;
