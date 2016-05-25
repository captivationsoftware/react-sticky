import React from 'react';
import ReactDOM from 'react-dom';

export default class Sticky extends React.Component {

  static contextTypes = {
    container: React.PropTypes.any,
    offset: React.PropTypes.number,
    rect: React.PropTypes.object
  }

  static propTypes = {
    isActive: React.PropTypes.bool
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

  getOrigin(pageY) {
    return this.refs.placeholder.getBoundingClientRect().top + pageY;
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

  update() {
    const height = this.getHeight();
    const pageY = window.pageYOffset;
    const origin = this.getOrigin(pageY);
    const isSticky = this.isSticky(pageY, origin);

    const s = this.state;
    if(s.height !== height || s.origin !== origin || s.isSticky !== isSticky)
      this.setState({ height, origin, isSticky });
  }

  isSticky(pageY, origin) {
    return this.props.isActive && pageY + this.context.offset - this.props.topOffset >= origin
      && this.context.offset <= (this.context.rect.bottom || 0) - this.props.bottomOffset;
  }

  onScroll = () => {
    const height = this.getHeight();
    const pageY = window.pageYOffset;
    const origin = this.getOrigin(pageY);
    const isSticky = this.isSticky(pageY, this.state.origin);
    const xOffset = this.getXOffset();
    const width = this.getWidth();
    const hasChanged = this.state.isSticky !== isSticky;

    const state = this.state;
    if ((isSticky && (xOffset !== state.xOffset || width !== state.width))
      || state.height !== height || state.origin !== origin
      || state.isSticky !== isSticky) {
      this.setState({ isSticky, origin, height, xOffset, width });
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
      const placeholderRect = this.refs.placeholder.getBoundingClientRect();
      const stickyStyle = {
        position: 'fixed',
        top: this.context.offset,
        left: this.state.xOffset,
        width: this.state.width,
      };

      const bottomLimit = (this.context.rect.bottom || 0) - this.state.height - this.props.bottomOffset;
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
