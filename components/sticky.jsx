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
    raf(this.tick);
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
    //this.interval = window.setInterval(this.tick, 100);
    this.reset();
    raf(this.tick());
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  },

  componentWillUnmount: function() {
    //window.clearInterval(this.interval);
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  },

  render: function() {
    return (
      <div className={this.state.className}>
        {this.props.children}
      </div>
    );
  }
});

module.exports = Sticky;
