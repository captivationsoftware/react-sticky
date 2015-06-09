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

  checkStickyState: function() {
    var wasSticky = this.state.isSticky,
        doc       = document.documentElement,
        pageY     = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    
    // if current scroll position the same as previous one
    if (pageY === this.previousPageYOffset) {
      // lets increase the count of this "nothing to do" circumstance
      this.stickyCheckCnt++;
      // if it is already half a second with nothing changed (1000/16/2)
      //   take a nap and wait on events that were binded in componentDidMount
      //   method and return immediately
      // otherwise call self recursively thru requestAnimationFrame
      //   and return immediately
      return (this.stickyCheckCnt > 31) ? this.stopLoop() : this.requestFrame();
    }

    var isSticky = pageY > this.elementOffset,
        nextState = { isSticky: isSticky };
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
    // save previous scrollPosition
    this.previousPageYOffset = pageY;
    // call itself recursively thru requestAnimationFrame
    this.requestFrame();
  },

  componentDidMount: function() {
    this.reset();
    // see checkStickyState metod for this variable purpose
    this.stickyCheckCnt = 0;
    // start loop where we will checkStickyState
    this.startLoop();
    this.state.events.forEach(function(type) {
      window.addEventListener(type, this.startLoop);
    }, this);
  },
  componentWillUnmount: function() {
    // stop loop where we are checking checkStickyState
    this.stopLoop();
    this.state.events.forEach(function(type) {
      window.removeEventListener(type, this.startLoop);
    }, this);
  },
  startLoop: function() {
    // start the loop only if it isn't running yet
    if (this.isLoopRunning) { return }; this.isLoopRunning = true;
    this.requestFrame();
  },
  stopLoop: function() {
    // stop the next frame from firing
    // needs https://github.com/darius/requestAnimationFrame polyfill
    // to work in legacy browsers
    cancelAnimationFrame(this.requestID);
    // reset flags, see checkStickyState method
    // for this.stickyCheckCnt purpose
    this.isLoopRunning = false; this.stickyCheckCnt = 0;
  },
  requestFrame: function () {
    // requst checkStickyState method thru requestAnimationFrame callback
    this.requestID = requestAnimationFrame(this.checkStickyState);
  },
  render: function() {
    return this.props.type({
      style: this.state.style,
      className: this.state.className
    }, this.props.children);
  }
});

module.exports = Sticky;

