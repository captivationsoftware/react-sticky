var React = require('react'),
  raf = require('raf');

var Sticky = React.createClass({

  reset: function() {
    var windowOffset = window.pageYOffset || (document.documentElement.clientHeight ? document.documentElement : document.body).scrollTop;
    this.elementOffset = this.getDOMNode().getBoundingClientRect().top + windowOffset;
  },  
  
  tick: function() {
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
    
    if (!this.unmounting) {
      raf(this.tick);
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
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
    
    this.reset();
    raf(this.tick()); 
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
