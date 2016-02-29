import React from 'react';
import ReactDOM from 'react-dom';
import watcher from './watcher';
import { copy } from './utils';

class Sticky extends React.Component {

  constructor(props) {
    super(props);
    this.state = { };
  }

  /*
   * Return the distance of the scrollbar from the
   * top of the window plus the total height of all
   * stuck Sticky instances above this one.
   */
  pageOffset() {
    return (window.pageYOffset || document.documentElement.scrollTop);
  }

  otherStickyOffset() {
    if (this.container) return this.container.getCumulativeTopCorrection();
    else return 0;
  }

  /*
   * Returns the y-coordinate of the top of this element.
   */
  calculateOrigin(node) {
    node = node || this.node;

    // Only recalcute origin if the last origin has been made stale via resize
    if (this.lastWidth !== window.innerWidth || this.lastHeight !== window.innerHeight) {
      this.lastWidth = window.innerWidth;
      this.lastHeight = window.innerHeight;

      // Do some ugly DOM manipulation to where this element's non-sticky position would be
      let previousPosition = node.style.position;
      node.style.position = '';
      this.origin = node.getBoundingClientRect().top + this.pageOffset() - this.otherStickyOffset();
      node.style.position = previousPosition;
    }

    return this.origin;
  }

  /*
   * Returns true/false depending on if this should be sticky.
   */
  shouldBeSticky() {
    let offset = this.pageOffset();
    let origin = this.calculateOrigin();

    var stickyTopConditionsMet = offset >= origin + this.props.topOffset;
    var stickyBottomConditionsMet = offset < this.containerNode.getBoundingClientRect().height + origin - this.node.getBoundingClientRect().height;
    return stickyTopConditionsMet && stickyBottomConditionsMet;
  }


  transition() {
    if (this.containerNode) {
      this.nextState(this.shouldBeSticky());
    }
  }

  /*
   * Anytime new props are received, force re-evaluation
   */
  componentWillReceiveProps() {
    watcher.emit();
  }

  componentWillUpdate(props, state, context) {
    this.container = context.container;
    this.containerNode = ReactDOM.findDOMNode(this.container);
  }

  componentDidMount() {
    this.node = ReactDOM.findDOMNode(this);
    watcher.on(this.transition.bind(this));
    watcher.emit();
  }

  componentWillUnmount() {
    watcher.off(this.transition.bind(this));
  }

  /*
   * If sticky, merge this.props.stickyStyle with this.props.style.
   * If not, just return this.props.style.
   */
  nextStyle(shouldBeSticky) {
    if (shouldBeSticky) {
      // inherit the boundaries of the container
      var rect = (this.containerNode || document.body).getBoundingClientRect();
      var style = copy({}, this.props.style);
      style.position = 'fixed';
      style.left = rect.left;
      style.width = rect.width;
      style.top = this.otherStickyOffset();

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
      this.preventBounce(shouldBeSticky);
      this.props.onStickyStateChange(shouldBeSticky);
    }
  }

  preventBounce(shouldBeSticky) {
    let bounceCorrection;
    if (shouldBeSticky) {
      bounceCorrection = this.bounceCorrection = Math.ceil(this.node.getBoundingClientRect().height);
    } else {
      bounceCorrection= -this.bounceCorrection || 0;
    }
    if (this.container) this.container.setTopCorrection(bounceCorrection)
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

Sticky.contextTypes = {
  container: React.PropTypes.any
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
