import React from 'react';
import ReactDOM from 'react-dom';

export default class Sticky extends React.Component {

  static contextTypes = {
    container: React.PropTypes.any,
    offset: React.PropTypes.number,
    rect: React.PropTypes.object
  }

  static defaultProps = {
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

  update() {
    const height = ReactDOM.findDOMNode(this).getBoundingClientRect().height;
    const pageY = window.pageYOffset;
    const origin = this.refs.placeholder.getBoundingClientRect().top + pageY;
    const isSticky = this.isSticky(pageY, origin);
    this.setState({ height, origin, isSticky });
  }

  isSticky(pageY, origin) {
    return pageY + this.context.offset - this.props.topOffset >= origin
      && this.context.offset <= (this.context.rect.bottom || 0) - this.props.bottomOffset;
  }

  onScroll = () => {
    const pageY = window.pageYOffset;
    const isSticky = this.isSticky(pageY, this.state.origin);
    const hasChanged = this.state.isSticky !== isSticky;
    const origin = this.refs.placeholder.getBoundingClientRect().top + window.pageYOffset;

    this.setState({ isSticky, origin });
    this.context.container.updateOffset(isSticky ? this.state.height : 0);

    if (hasChanged) this.props.onStickyStateChange(isSticky);
  }

  onResize = () => {
    const height = ReactDOM.findDOMNode(this).getBoundingClientRect().height;
    const origin = this.refs.placeholder.getBoundingClientRect().top + window.pageYOffset;
    this.setState({ height, origin });
  }

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
        left: placeholderRect.left,
        width: placeholderRect.width
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
