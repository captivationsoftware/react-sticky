import React from 'react';
import ReactDOM from 'react-dom';
import Watcher from './watcher';

export default class Sticky extends React.Component {

  static contextTypes = {
    container: React.PropTypes.any,
    topCorrection: React.PropTypes.number
  }

  static defaultProps = {
    className: '',
    style: {},
    stickyClass: 'sticky',
    stickyStyle: {},
    topOffset: 0,
    onStickyStateChange: function () {}
  }

  static scrollWatcher = new Watcher(['scroll', 'touchstart', 'touchend']);
  static resizeWatcher = new Watcher(['resize']);

  constructor(props) {
    super(props);

    this.state = {
      height: 0,
      top: 0
    };
  }

  /*
   * Anytime new props are received, force re-evaluation
   */
  componentWillReceiveProps() {
    Sticky.resizeWatcher.emit();
    Sticky.scrollWatcher.emit();
  }

  componentDidMount() {
    this.updateOrigin();
    this.updateRect();

    Sticky.resizeWatcher.on(this.onResize);
    Sticky.scrollWatcher.on(this.onScroll);
  }

  componentWillUnmount() {
    Sticky.resizeWatcher.off(this.onResize);
    Sticky.scrollWatcher.off(this.onScroll);
  }

  pageOffset() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  /*
   * Returns true/false depending on if this should be sticky.
   */
  shouldBeSticky() {
    let offset = this.pageOffset();
    let origin =  this.state.origin - this.state.top;

    let containerNode = ReactDOM.findDOMNode(this.context.container);

    // check conditions
    let stickyTopConditionsMet = offset >= origin + this.props.topOffset;
    let stickyBottomConditionsMet = offset < containerNode.getBoundingClientRect().height + origin;
    return stickyTopConditionsMet && stickyBottomConditionsMet;
  }

  onScroll = () => {
    let shouldBeSticky = this.shouldBeSticky();

    let hasChanged = (this.state.isSticky !== shouldBeSticky);

    // Update this state
    this.setState({
      isSticky: shouldBeSticky,
      style: this.nextStyle(shouldBeSticky),
      className: this.nextClassName(shouldBeSticky)
    });

    // Update container state
    if (this.context.container) {
      this.context.container.nextState({
        isSticky: shouldBeSticky,
        height: this.state.height
      });
    }

    if (hasChanged) {
      // Publish sticky state change
      this.props.onStickyStateChange(shouldBeSticky);
    }
  }


  onResize = () => {
    this.updateOrigin();
    // emit a scroll event to re-calculate container top offsets
    Sticky.scrollWatcher.emit();
  }

  updateOrigin() {
    let node = React.findDOMNode(this);

    // Do some ugly DOM manipulation to where this element's non-sticky position would be
    let previousPosition = node.style.position;
    node.style.position = '';
    let origin = node.getBoundingClientRect().top + this.pageOffset();
    node.style.position = previousPosition;

    this.setState({origin});

  }

  updateRect() {
    let height = ReactDOM.findDOMNode(this).getBoundingClientRect().height;
    let top = Math.max((this.context.topCorrection || 0) - height, 0);
    this.setState({ height, top });
  }

  /*
   * If sticky, merge this.props.stickyStyle with this.props.style.
   * If not, just return this.props.style.
   */
  nextStyle(shouldBeSticky) {
    if (shouldBeSticky) {
      let containerRect = ReactDOM.findDOMNode(this.context.container).getBoundingClientRect();

      // inherit the boundaries of the container
      let style = Object.assign({}, this.props.style);
      style.position = 'fixed';
      style.left = containerRect.left;
      style.width = containerRect.width;
      style.top = this.state.top;

      let bottomLimit = containerRect.bottom - this.state.height;
      if (style.top > bottomLimit) style.top = bottomLimit;

      // Finally, override the best-fit style with any user props
      return Object.assign(style, this.props.stickyStyle);
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
