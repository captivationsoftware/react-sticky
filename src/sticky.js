import React from 'react';
import ReactDOM from 'react-dom';

export default class Sticky extends React.Component {

  static propTypes = {
    isActive: React.PropTypes.bool,
    className: React.PropTypes.string,
    position: React.PropTypes.oneOf(['top', 'bottom']),
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
    position: 'top',
    style: {},
    stickyClassName: 'sticky',
    stickyStyle: {},
    topOffset: 0,
    bottomOffset: 0,
    onStickyStateChange: () => {}
  }

  static contextTypes = {
    'sticky-channel': React.PropTypes.any
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.channel = this.context['sticky-channel'];
    this.channel.subscribe(this.updateContext);
  }

  componentDidMount() {
    this.on(['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'], this.recomputeState);
    this.recomputeState();
  }

  componentWillReceiveProps() {
    this.recomputeState();
  }

  componentWillUnmount() {
    this.off(['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'], this.recomputeState);
    this.channel.unsubscribe(this.updateContext);
  }

  getXOffset() {
    return this.refs.placeholder.getBoundingClientRect().left;
  }

  getWidth() {
    return this.refs.placeholder.getBoundingClientRect().width;
  }

  getHeight() {
    return ReactDOM.findDOMNode(this.refs.children).getBoundingClientRect().height;
  }

  getPlaceholderRect() {
    return this.refs.placeholder.getBoundingClientRect();
  }

  getContainerRect() {
    return this.containerNode ? this.containerNode.getBoundingClientRect() : {
      top: 0,
      bottom: 0,
    }
  }

  isStickyBottom() {
    const { bottomOffset } = this.props
    const { containerOffset, height, placeholderTop, winHeight } = this.state

    const bottomBreakpoint = containerOffset - bottomOffset
    const placeholderBottom = placeholderTop + height

    return placeholderBottom >= winHeight - bottomBreakpoint
  }

  isStickyTop() {
    const distancesFromPlaceholder = this.getPlaceholderRect().top;

    const topBreakpoint = this.state.containerOffset - this.props.topOffset;
    const bottomBreakpoint = this.state.containerOffset + this.props.bottomOffset;

    return distancesFromPlaceholder <= topBreakpoint && this.state.containerBottom >= bottomBreakpoint;
  }

  isSticky() {
    if (!this.props.isActive) {
      return false;
    }

    return this.props.position === 'top' ? this.isStickyTop() : this.isStickyBottom();
  }

  updateContext = ({ inherited, node }) => {
    this.containerNode = node;
    this.setState({
      containerOffset: inherited,
      containerBottom: this.getContainerRect().bottom,
      containerTop: this.getContainerRect().top,
      placeholderTop: this.getPlaceholderRect().top,
    });
  }

  recomputeState = () => {
    const isSticky = this.isSticky();
    const height = this.getHeight();
    const width = this.getWidth();
    const xOffset = this.getXOffset();
    const containerBottom = this.getContainerRect().bottom;
    const containerTop = this.getContainerRect().top;
    const placeholderTop = this.getPlaceholderRect().top;
    const hasChanged = this.state.isSticky !== isSticky;
    const winHeight = window.innerHeight;

    this.setState({ isSticky, height, width, xOffset, containerBottom, containerTop, placeholderTop, winHeight });

    if (hasChanged) {
      if (this.channel) {
        this.channel.update((data) => {
          data.offset = (isSticky ? this.state.height : 0);
        });
      }

      this.props.onStickyStateChange(isSticky);
    }
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

  shouldComponentUpdate(newProps, newState) {
    // Have we changed the number of props?
    const propNames = Object.keys(this.props);
    if (Object.keys(newProps).length != propNames.length) return true;

    // Have we changed any prop values?
    const valuesMatch = propNames.every((key) => {
      return newProps.hasOwnProperty(key) && newProps[key] === this.props[key];
    });
    if (!valuesMatch) return true;

    // Have we changed any state that will always impact rendering?
    const state = this.state;
    if (newState.isSticky !== state.isSticky) return true;

    // If we are sticky, have we changed any state that will impact rendering?
    if (state.isSticky) {
      if (newState.height !== state.height) return true;
      if (newState.width !== state.width) return true;
      if (newState.xOffset !== state.xOffset) return true;
      if (newState.containerOffset !== state.containerOffset) return true;
      if (newState.containerBottom !== state.containerBottom) return true;
      if (newState.placeholderTop !== state.placeholderTop) return true;
      if (newState.containerTop !== state.containerTop) return true;
    }

    return false;
  }

  getPositionOffset() {
    const { containerOffset, containerTop, containerBottom, height } = this.state;
    const { bottomOffset, position, topOffset } = this.props;

    const bottomLimit = containerBottom - height - bottomOffset
    const topLimit =  window.innerHeight - containerTop - topOffset

    return position === 'top'
      ? Math.min(containerOffset, bottomLimit)
      : Math.min(containerOffset, topLimit)
  }

  /*
   * The special sauce.
   */
  render() {
    const {
      className: propsClassName,
      position,
      stickyClassName,
      stickyStyle,
      style,
      ...props
    } = this.props;
    const {
      isSticky,
      height,
      width,
      xOffset,
    } = this.state

    const placeholderStyle = { paddingBottom: isSticky ? height : 0 };
    const className = `${propsClassName} ${isSticky ? stickyClassName : ''}`;
    const finalStickyStyle = isSticky && {
      position: 'fixed',
      [position]: this.getPositionOffset(),
      left: xOffset,
      width: width,
      ...stickyStyle,
    }

    // To ensure that this component becomes sticky immediately on mobile devices instead
    // of disappearing until the scroll event completes, we add `transform: translateZ(0)`
    // to 'kick' rendering of this element to the GPU
    // @see http://stackoverflow.com/questions/32875046
    const finalStyle = {
      transform: 'translateZ(0)',
      ...style,
      ...(finalStickyStyle || {})
    }


    return (
      <div>
        <div ref="placeholder" style={placeholderStyle} />
        <div {...props} ref="children" className={className} style={finalStyle}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
