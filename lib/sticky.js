import React from 'react';
import ReactDOM from 'react-dom';
import { copy } from './utils';

class Sticky extends React.Component {
  /*
   * Adds the supplied Sticky instance to the
   * internal list of mounted Sticky instances,
   * sorted by the .top() value for each instance.
   *
   * If the animation frame loop (or fallback)
   * isn't running, start it now.
   */
   static register(instance) {
    // Sticky.__instances.push(instance);
    // Sticky.__instances.sort(function(a, b) {
    //   if (a.top() > b.top()) return 1;
    //   if (b.top() > a.top()) return -1;
    //   return 0;
    // });
    // if (Sticky.__frame === null) Sticky.resumeLoop();
  }

  /*
   * Remove the supplied Sticky instance from the
   * internal list of mounted Sticky instances.
   *
   * If the animation frame loop (or fallback)
   * is no longer in use, stop it now.
   */
  static unregister(instance) {
    // var index = Sticky.__instances.indexOf(instance);
    // if (index > -1) Sticky.__instances.splice(index, 1);
    // if (Sticky.__instances.length === 0) Sticky.cancelLoop();
  }

  /*
   * Return every Sticky instance that is
   * positioned above the supplied instance.
   */
  static instancesAbove(instance) {
    // var instances = [];
    // var allAbove = Sticky.__instances.slice(0, Sticky.__instances.indexOf(instance));
    // for (var i = 0; i < allAbove.length; i++) {
    //   var above = allAbove[i];
    //   if (above.container.contains(instance.container)) instances.push(above);
    // }
    // return instances;
  }

  /*
   * Returns true if the browser environment can support
   * requestAnimationFrame. Otherwise returns false;
   */
  static isModernBrowser() {
    return window && window.requestAnimationFrame && window.cancelAnimationFrame;
  }

  /*
   * Creates the next frame in the animation loop.
   */
  static resumeLoop() {
    // var nextFrame = Sticky.isModernBrowser() ? requestAnimationFrame : setTimeout;
    // Sticky.__frame = nextFrame(Sticky.onFrame, 1000 / 60);
  }

  /*
   * Cancels the animation loop.
   */
  static cancelLoop() {
    // var cancel = Sticky.isModernBrowser() ? cancelAnimationFrame : clearTimeout;
    // cancel(Sticky.__frame);
    // Sticky.__frame = null;
  }

  /*
   * Loop iteration routine.
   */
  static onFrame() {
    // for (var i = 0; i < Sticky.__instances.length; i++) {
    //   var sticky = Sticky.__instances[i];
    //   sticky.handleFrame();
    // }
    // Sticky.resumeLoop();
  }

  constructor(props) {
    super(props);
    this.state = {
      events: ['scroll', 'resize', 'touchmove', 'touchend']
    };
  }

  /*
   * Return the distance of the scrollbar from the
   * top of the window plus the total height of all
   * stuck Sticky instances above this one.
   */
  pageOffset() {
    return (window.pageYOffset || document.documentElement.scrollTop) + this.otherStickyOffset();
  }

  otherStickyOffset() {
    var otherStickies = Sticky.instancesAbove(this);

    var offset = 0;
    for (var i = 0; i < otherStickies.length; i++) {
      var otherSticky = otherStickies[i];
      if (otherSticky.state.isSticky) {
        offset += otherSticky.domNode.getBoundingClientRect().height;
      }
    }
    return offset;
  }

  containerOf(node) {
    var container = node.parentNode || document.body;
    while (container !== document.body
      && !container.hasAttribute('data-sticky-container')) {
      container = container.parentNode;
    }
    return container;
  }

  /*
   * Returns the y-coordinate of the top of this element.
   */
  top() {
    return this.domNode.getBoundingClientRect().top;
  }

  /*
   * Returns true/false depending on if this should be sticky.
   */
  shouldBeSticky() {
    var offset = this.pageOffset()
    var stickyTopConditionsMet = offset >= this.origin + this.props.topOffset;
    var stickyBottomConditionsMet = this.container === document.body ? true : offset < this.container.getBoundingClientRect().height + this.origin - this.domNode.getBoundingClientRect().height;

    return stickyTopConditionsMet && stickyBottomConditionsMet;
  }

  /*
   * Loop iteration for this instance.
   *
   * Should only fire any time there is an event
   * that hasn't been handled. This serves as a
   * throttle for continuous events (i.e. scroll).
   */
  handleFrame() {
    if (this.hasUnhandledEvent || this.hasTouchEvent) {
      var shouldBeSticky = this.shouldBeSticky();
      this.nextState(shouldBeSticky);
      this.hasUnhandledEvent = false;
    }
  }

  /*
   * Lightweight event listener for window events.
   *
   * See http://www.html5rocks.com/en/tutorials/speed/animations/
   */
  handleEvent(event) {
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
  }

  /*
   * Instance was mounted on the page.
   *
   * In order, this function should:
   *  - Register events listeners with window.
   *  - Cache the domNode using ReactDOM.findDOMNode.
   *  - Store the initial y-position (origin) of this
   *    instance.
   *  - Register this instance, subscribing to animation
   *    loop.
   */
  componentDidMount() {
    // this.state.events.forEach(function(type) {
    //   if (window.addEventListener) {
    //     window.addEventListener(type, this.handleEvent);
    //   } else {
    //     window.attachEvent('on' + type, this.handleEvent);
    //   }
    // }, this);
    // this.domNode = ReactDOM.findDOMNode(this);
    // this.container = this.containerOf(this.domNode);
    // this.origin = this.top() + this.pageOffset();
    // this.hasUnhandledEvent = true;
    // Sticky.register(this);
  }

  /*
   * Anytime new props are received, force re-evaluation
   */
  componentWillReceiveProps() {
    this.hasUnhandledEvent = true;
  }

  /*
   * Instance was removed from the page.
   *
   * Undo everything during mounting.
   */
  componentWillUnmount() {
    // this.state.events.forEach(function(type) {
    //   if (window.removeEventListener) {
    //     window.removeEventListener(type, this.handleEvent);
    //   } else {
    //     window.detachEvent('on' + type, this.handleEvent)
    //   }
    // }, this);
    // this.domNode = null;
    // Sticky.unregister(this);
  }

  /*
   * If sticky, merge this.props.stickyStyle with this.props.style.
   * If not, just return this.props.style.
   */
  nextStyle(shouldBeSticky) {
    if (shouldBeSticky) {
      // inherit the boundaries of the container
      var rect = this.container.getBoundingClientRect();
      var style = copy({}, this.props.style);
      style.position = 'fixed';
      style.left = rect.left;
      style.width = rect.width;
      style.top = this.otherStickyOffset();
      console.log(this.domNode, this.container, this.pageOffset())

      // Finally, override the best-fit style with any user props
      return copy(style, this.props.stickyStyle);
    } else {
      return this.props.style;
    }
  }

  /*
   * If sticky, merge this.props.stickyClass with this.props.className.
   * If not, just return this.props.className.
   */
  nextClassName(shouldBeSticky) {
    var className = this.props.className;
    if (shouldBeSticky) {
      className += ' ' + this.props.stickyClass;
    }
    return className;
  }

  /*
   * Transition to the next state.
   *
   * Updates the isSticky, style, and className state
   * variables.
   *
   * If sticky state is different than the previous,
   * fire the onStickyStateChange callback.
   */
  nextState(shouldBeSticky) {
    var hasChanged = this.state.isSticky !== shouldBeSticky;
    this.setState({
      isSticky: shouldBeSticky,
      style: this.nextStyle(shouldBeSticky),
      className: this.nextClassName(shouldBeSticky)
    });
    if (hasChanged) {
      this.correctBounce(shouldBeSticky);
      this.props.onStickyStateChange(shouldBeSticky);
    }
  }

  correctBounce(shouldBeSticky) {
    var bounceCorrection;
    if (shouldBeSticky) {
      bounceCorrection = this.bounceCorrection = Math.ceil(this.domNode.getBoundingClientRect().height);
    } else {
      bounceCorrection= -this.bounceCorrection;
    }
    var paddingTop = (parseInt(this.container.style.paddingTop) || 0) + bounceCorrection;
    this.container.style.paddingTop = paddingTop + 'px';
  }

  /*
   * The special sauce.
   */
  render() {
    return (
      <div style={this.state.style} className={this.state.className}>
        {this.props.children}
      </div>
    );
  }
}

/*
 * Default properties...
 */
Sticky.defaultProps = {
  className: '',
  style: {},
  stickyClass: 'sticky',
  stickyStyle: {},
  topOffset: 0,
  onStickyStateChange: function () {}
}

export default Sticky;
