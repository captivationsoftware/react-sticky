var React = require('react'),
		Sticky = React.createClass({

  reset: function() {
    var html = document.documentElement,
        body = document.body,
        windowOffset = window.pageYOffset || (html.clientHeight ? html : body).scrollTop;
    
    this.elementOffset = this.getDOMNode().getBoundingClientRect().top + windowOffset;
  },

  handleResize: function() {
    // set style with callback to reset once style rendered succesfully
    this.setState({ style: {} }, this.reset);
  },

  handleScroll: function() {
    if (window.pageYOffset > this.elementOffset) this.setState({ style: this.props.stickyStyle });
    else this.setState({ style: {} });
  },

  getDefaultProps: function() {
    return {
      stickyStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0
      }
    };
  },

  getInitialState: function() {
    return {
      style: {}
    }; 
  },

  componentDidMount: function() {
    this.reset();
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  },

  render: function() {
    return React.DOM.div({
      style: this.state.style
    }, this.props.children);
  }
});

module.exports = Sticky;
