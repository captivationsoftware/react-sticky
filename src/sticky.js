import React from 'react';
import ReactDOM from 'react-dom';
import Watcher from './watcher';

export default class Sticky extends React.Component {

  static contextTypes = {
    container: React.PropTypes.any,
    offset: React.PropTypes.number,
    rect: React.PropTypes.object
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
      isSticky: false
    };
  }

  componentDidMount() {
    const height = ReactDOM.findDOMNode(this).getBoundingClientRect().height;
    const pageY = window.pageYOffset;
    const origin = this.refs.static.getBoundingClientRect().top + pageY;
    this.setState({ pageY, height, origin });

    Sticky.resizeWatcher.on(this.onResize);
    Sticky.scrollWatcher.on(this.onScroll);
  }

  componentWillUnmount() {
    Sticky.resizeWatcher.off(this.onResize);
    Sticky.scrollWatcher.off(this.onScroll);
  }

  onScroll = () => {
    const pageY = window.pageYOffset;
    const isSticky =
      pageY + this.context.offset - this.props.topOffset >= this.state.origin
      && this.context.offset + this.props.bottomOffset < this.state.origin + this.context.rect.bottom;

    this.setState({ pageY, isSticky });
    this.context.container.updateTopCorrection(isSticky ? this.state.height : 0);

    if (this.state.isSticky !== isSticky) this.props.onStickyStateChange(isSticky);
  }

  onResize = () => {
    const height = ReactDOM.findDOMNode(this).getBoundingClientRect().height;
    const origin = this.refs.static.getBoundingClientRect().top + window.pageYOffset;
    this.setState({ height, origin });
  }

  /*
   * The special sauce.
   */
  render() {
    const isSticky = this.state.isSticky;

    const className = `${this.props.className} ${isSticky ? this.props.stickyClass : ''}`

    let style = this.props.style;
    if (isSticky) {
      const stickyStyle = {
        position: 'fixed',
        top: this.context.offset,
        left: this.refs.static.getBoundingClientRect().left,
        width: this.refs.static.getBoundingClientRect().width
      };

      const bottomLimit = (this.context.rect.bottom || 0) - this.state.height - this.props.bottomOffset;
      if (this.context.offset > bottomLimit) {
        stickyStyle.top = bottomLimit;
      }

      style = Object.assign({}, this.props.style, stickyStyle, this.props.stickyStyle);
    }

    return (
      <div>
        <div ref="static" style={{ paddingBottom: isSticky ? this.state.height : 0 }}></div>
        <div ref="fixed" className={className} style={style}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
