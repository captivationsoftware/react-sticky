import React from 'react';
import ReactDOM from 'react-dom';

const events = ['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'];

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

    this.handleEvents = this.handleEvents.bind(this);
    this.updateContext = this.updateContext.bind(this);
  }

  componentWillMount() {
    this.channel = this.context['sticky-channel'];
    this.channel.subscribe(this.updateContext);
  }

  componentDidMount() {
    this.subscribeToEvents();
    this.recomputeState();
  }

  componentWillReceiveProps(nextProps) {
    this.recomputeState(nextProps);
  }

  componentWillUnmount() {
    this.unsubscribeToEvents();
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

  isStickyBottom(props, state) {
    const { bottomOffset } = props
    const { containerOffset, height, placeholderTop, winHeight } = state

    const bottomBreakpoint = containerOffset - bottomOffset
    const placeholderBottom = placeholderTop + height

    return placeholderBottom >= winHeight - bottomBreakpoint
  }

  isStickyTop(props, state) {
    const distancesFromPlaceholder = state.placeholderTop

    const topBreakpoint = state.containerOffset - props.topOffset;
    const bottomBreakpoint = state.containerOffset + props.bottomOffset;

    return distancesFromPlaceholder <= topBreakpoint && state.containerBottom >= bottomBreakpoint;
  }

  isSticky(props, state) {
    if (!props.isActive) {
      return false;
    }

    return props.position === 'top' ? this.isStickyTop(props, state) : this.isStickyBottom(props, state);
  }

  updateContext({ inherited, node }) {
    this.containerNode = node;
    this.recomputeState(this.props, inherited)
  }

  recomputeState(props = this.props, inherited = false) {
    const nextState = {
      ...this.state,
      height: this.getHeight(),
      width: this.getWidth(),
      xOffset: this.getXOffset(),
      containerOffset: inherited === false ? this.state.containerOffset : inherited,
      containerBottom: this.getContainerRect().bottom,
      containerTop: this.getContainerRect().top,
      placeholderTop: this.getPlaceholderRect().top,
      winHeight: window.innerHeight,
    }

    const isSticky = this.isSticky(props, nextState);
    const finalNextState = { ...nextState, isSticky }
    const hasChanged = this.state.isSticky !== isSticky;

    this.setState(finalNextState, () => {
      // After component did update lets broadcast update msg to channel
      if (hasChanged) {
        if (this.channel) {
          this.channel.update((data) => {
            data.offset = (isSticky ? this.state.height : 0);
          });
        }

        this.props.onStickyStateChange(isSticky);
      }
    });
  }

  handleEvents() {
    this.recomputeState();
  }

  subscribeToEvents() {
    events.forEach((evt) => {
      window.addEventListener(evt, this.handleEvents);
    });
  }

  unsubscribeToEvents() {
    events.forEach((evt) => {
      window.removeEventListener(evt, this.handleEvents);
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
      if (newState.placeholderTop !== state.placeholderTop) return true;
    }

    // We should check container sizes anyway
    if (newState.containerOffset !== state.containerOffset) return true;
    if (newState.containerBottom !== state.containerBottom) return true;
    if (newState.containerTop !== state.containerTop) return true;

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
