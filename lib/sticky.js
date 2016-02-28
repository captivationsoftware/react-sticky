import React from 'react';
import ReactDOM from 'react-dom';
import { STICKY_CONTAINER_ATTR } from './constants';
import watcher from './watcher';
import { copy } from './utils';

class Sticky extends React.Component {

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
    return [];
  }


  constructor(props) {
    super(props);
    this.state = {};
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
      && !container.hasAttribute(STICKY_CONTAINER_ATTR)) {
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


  handleUpdate() {
    console.log('updating!');
    var shouldBeSticky = this.shouldBeSticky();
    this.nextState(shouldBeSticky);
  }

  /*
   * Anytime new props are received, force re-evaluation
   */
  componentWillReceiveProps() {
    watcher.emit();
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
    this.domNode = ReactDOM.findDOMNode(this);
    this.container = this.containerOf(this.domNode);
    this.origin = this.top() + this.pageOffset();

    watcher.on(this.handleUpdate.bind(this));
    watcher.emit();
  }

  /*
   * Instance was removed from the page.
   *
   * Undo everything during mounting.
   */
  componentWillUnmount() {
    this.domNode = null;

    watcher.off(this.handleUpdate.bind(this));
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
