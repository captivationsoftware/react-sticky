import React from 'react';
import ReactDOM from 'react-dom';

export default class Sticky extends React.Component {

  static contextTypes = {
    container: React.PropTypes.any,
    offset: React.PropTypes.number,
    rect: React.PropTypes.object
  }

  static propTypes = {
    isActive: React.PropTypes.bool,
    className: React.PropTypes.string,
    style: React.PropTypes.object,
    stickyClassName: React.PropTypes.string,
    stickyStyle: React.PropTypes.object,
    topOffset: React.PropTypes.number,
    bottomOffset: React.PropTypes.number,
    onStickyStateChange: React.PropTypes.func
  }

  static defaultProps = {
    isActive: true,
    className: '',
    style: {},
    stickyClassName: 'sticky',
    stickyStyle: {},
    topOffset: 0,
    bottomOffset: 0,
    onStickyStateChange: function () {}
  }

  constructor(props) {
    super(props);

    this.state = {
      isSticky: false
    };
  }

  componentDidMount() {
    this.update();
    this.on(['scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'], this.onScroll);
    this.on(['resize', 'pageshow', 'load'], this.onResize);
  }

  componentWillReceiveProps() {
    this.update();
  }

  componentWillUnmount() {
    this.off(['scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'], this.onScroll);
    this.off(['resize', 'pageshow', 'load'], this.onResize);
  }

  getXOffset() {
    return this.refs.placeholder.getBoundingClientRect().left;
  }

  getWidth() {
    return this.refs.placeholder.getBoundingClientRect().width;
  }

  getHeight() {
    return ReactDOM.findDOMNode(this).getBoundingClientRect().height;
  }

  getDistanceFromTop() {
    return this.refs.placeholder.getBoundingClientRect().top;
  }

  getDistanceFromBottom() {
    return (this.context.rect && this.context.rect.bottom) || 0;
  }

  update() {
    const height = this.getHeight();
    const isSticky = this.isSticky();

    const s = this.state;
    if(s.height !== height || s.isSticky !== isSticky)
      this.setState({ height, isSticky });
  }

  isSticky() {
    if (!this.props.isActive) return false;

    const fromTop = this.getDistanceFromTop();
    const fromBottom = this.getDistanceFromBottom();

    const topBreakpoint = this.context.offset - this.props.topOffset;
    const bottomBreakpoint = this.context.offset + this.props.bottomOffset;

    return fromTop <= topBreakpoint && fromBottom >= bottomBreakpoint;
  }

  onScroll = () => {
    const height = this.getHeight();
    const isSticky = this.isSticky();
    const xOffset = this.getXOffset();
    const width = this.getWidth();
    const hasChanged = this.state.isSticky !== isSticky;

    const state = this.state;
    if ((isSticky && (xOffset !== state.xOffset || width !== state.width))
      || state.height !== height
      || state.isSticky !== isSticky) {
      this.setState({ isSticky, height, xOffset, width });
    }

    this.context.container.updateOffset(isSticky ? this.state.height : 0);

    if (hasChanged) this.props.onStickyStateChange(isSticky);
  }

  onResize = this.onScroll;

  on(events, callback) {
    events.forEach((evt) => {
      window.addEventListener(evt, callback);
    });
  }

  off(events, callback) {
    events.forEach((evt) => {
      window.removeEventListener(evt, callback);
    });
  }

  /*
   * The special sauce.
   */
  render() {
    const isSticky = this.state.isSticky;

    let className = this.props.className;
    if (isSticky) className += ` ${this.props.stickyClassName}`;

    let style = this.props.style;
    if (isSticky) {
      const stickyStyle = {
        position: 'fixed',
        top: this.context.offset,
        left: this.state.xOffset,
        width: this.state.width,
      };

      const bottomLimit = this.getDistanceFromBottom() - this.state.height - this.props.bottomOffset;
      if (this.context.offset > bottomLimit) {
        stickyStyle.top = bottomLimit;
      }

      style = Object.assign({}, this.props.style, stickyStyle, this.props.stickyStyle);
    }

    return (
      <div>
        <div ref="placeholder" style={{ paddingBottom: isSticky ? this.state.height : 0 }}></div>
        <div {...this.props} className={className} style={style}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
