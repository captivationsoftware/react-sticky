import React from 'react';
import ReactDOM from 'react-dom';
import Watcher from './watcher';

export default class Sticky extends React.Component {

  static contextTypes = {
    container: React.PropTypes.any,
    offset: React.PropTypes.number
  }

  static defaultProps = {
    className: '',
    style: {},
    stickyClass: 'sticky',
    stickyStyle: {},
    topOffset: 0,
    bottomOffset: 0,
    onStickyStateChange: function () {}
  }

  static scrollWatcher = new Watcher(['scroll', 'touchstart', 'touchend']);
  static resizeWatcher = new Watcher(['resize']);

  constructor(props) {
    super(props);

    this.state = {
      height: 0,
      stickyStyle: {}
    };
  }

  componentDidMount() {
    this.updateOrigin();
    this.updateHeight();

    Sticky.resizeWatcher.on(this.onResize);
    Sticky.scrollWatcher.on(this.onScroll);
  }

  componentWillUnmount() {
    Sticky.resizeWatcher.off(this.onResize);
    Sticky.scrollWatcher.off(this.onScroll);
  }

  /*
   * Anytime new props are received, force re-evaluation
   */
  componentWillReceiveProps() {
    this.updateHeight();
  }

  pageOffset() {
    return window.pageYOffset || document.documentElement.scrollTop;
  }

  /*
   * Returns true/false depending on if this should be sticky.
   */
  stickyConditionsMet() {
    let offset = this.pageOffset();
    let origin =  this.state.origin - (this.context.offset || 0);
    let containerNode = ReactDOM.findDOMNode(this.context.container);

    // check conditions
    let stickyTopConditionsMet = offset >= origin + this.props.topOffset;
    let stickyBottomConditionsMet = offset + this.props.bottomOffset < origin + containerNode.getBoundingClientRect().height;
    return stickyTopConditionsMet && stickyBottomConditionsMet;
  }

  onScroll = () => {
    let isSticky = this.stickyConditionsMet();
    let hasChanged = this.state.isSticky !== isSticky;
    let topCorrection = 0;
    let stickyStyle = {};

    if (isSticky) {
      let offset = this.context.offset || 0;
      let containerRect = ReactDOM.findDOMNode(this.context.container).getBoundingClientRect();
      stickyStyle = {
        position: 'fixed',
        top: offset,
        left: containerRect.left,
        width: containerRect.width
      };
      topCorrection = this.state.height;

      let bottomLimit = containerRect.bottom - this.state.height - this.props.bottomOffset;
      if (offset > bottomLimit) {
        stickyStyle.top = bottomLimit;
      }
    }

    // Update state
    this.setState({ isSticky, stickyStyle });
    this.context.container.updateTopCorrection(topCorrection);

    // Publish sticky state change
    if (hasChanged) this.props.onStickyStateChange(isSticky);
  }

  onResize = () => {
    this.updateOrigin();
    // emit a scroll event to re-calculate container top offsets
    Sticky.scrollWatcher.emit();
  }

  updateOrigin() {
    let node = React.findDOMNode(this);

    // Do some DOM manipulation to where this element's non-sticky position would be
    let previousPosition = node.style.position;
    node.style.position = '';
    let origin = node.getBoundingClientRect().top + this.pageOffset();
    node.style.position = previousPosition;

    this.setState({origin});
  }

  updateHeight() {
    let height = ReactDOM.findDOMNode(this).getBoundingClientRect().height;
    this.setState({ height });
  }

  /*
   * The special sauce.
   */
  render() {
    let className = `${this.props.className} ${this.state.isSticky ? this.props.stickyClass : ''}`

    let style = this.props.style;
    if (this.state.isSticky) {
      style = Object.assign({}, this.props.style, this.state.stickyStyle, this.props.stickyStyle);
    }

    return (
      <div className={className} style={style}>
        {this.props.children}
      </div>
    );
  }
}
