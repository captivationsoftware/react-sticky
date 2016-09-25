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

  getStickyDistancesFromPlaceholder() {
    return this.refs.placeholder.getBoundingClientRect().top;
  }

  getDistanceFromContainer() {
    if (!this.containerNode) return 0;
    return this.containerNode.getBoundingClientRect();
  }

  isStickyBottom() {
    const topBreakpoint = this.state.containerOffset - this.props.topOffset;
    const bottomBreakpoint = this.state.containerOffset + this.props.bottomOffset;

    const wHeight = window.innerHeight
    const realBottom = this.refs.placeholder.getBoundingClientRect().top + this.state.height
    //const fromTop = this.getDistanceFromContainer().top + this.state.;
    const res = realBottom >= wHeight + bottomBreakpoint// && realBottom <= fromBottom + bottomBreakpoint;
    console.log('Real top = %i, distance = %i', realBottom, wHeight + topBreakpoint);
    console.log('Is bottom sticky? ', res);
    return res;
  }

  isStickyTop() {
    if (!this.props.isActive) return false;

    const distancesFromPlaceholder = this.getStickyDistancesFromPlaceholder();
    const fromBottom = this.getDistanceFromContainer().bottom;

    const topBreakpoint = this.state.containerOffset - this.props.topOffset;
    const bottomBreakpoint = this.state.containerOffset + this.props.bottomOffset;

    console.log('From top = %i, bottom = %i ', distancesFromPlaceholder, fromBottom);
    return distancesFromPlaceholder <= topBreakpoint && fromBottom >= bottomBreakpoint;
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
      distanceFromBottom: this.getDistanceFromContainer().bottom,
      distanceFromTop: this.getDistanceFromContainer().top,
    });
  }

  recomputeState = () => {
    const isSticky = this.isSticky();
    const height = this.getHeight();
    const width = this.getWidth();
    const xOffset = this.getXOffset();
    const distanceFromBottom = this.getDistanceFromContainer().bottom;
    const distanceFromTop = this.getDistanceFromContainer().top;
    const hasChanged = this.state.isSticky !== isSticky;

    this.setState({ isSticky, height, width, xOffset, distanceFromBottom, distanceFromTop });

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
      if (newState.distanceFromBottom !== state.distanceFromBottom) return true;
    }

    return false;
  }

  /*
   * The special sauce.
   */
  render() {
    const {
      className: propsClassName,
      topOffset,
      isActive,
      position,
      stickyClassName,
      stickyStyle,
      style,
      bottomOffset,
      onStickyStateChange,
      ...props
    } = this.props;
    const {
      containerOffset,
      isSticky,
      height,
      width,
      xOffset,
    } = this.state

    const placeholderStyle = { paddingBottom: isSticky ? height : 0 };
    const className = `${propsClassName} ${isSticky ? stickyClassName : ''}`;

    // To ensure that this component becomes sticky immediately on mobile devices instead
    // of disappearing until the scroll event completes, we add `transform: translateZ(0)`
    // to 'kick' rendering of this element to the GPU
    // @see http://stackoverflow.com/questions/32875046
    const getPositionOffset = () => {
      const { containerOffset, distanceFromTop, distanceFromBottom, height } = this.state;
      const { bottomOffset, position } = this.props;
      const bottomLimit = distanceFromBottom - height - bottomOffset
      const topLimit =  window.innerHeight - distanceFromTop - topOffset

      //return containerOffset > bottomLimit ? bottomLimit : containerOffset
      return position === 'top'
        ? Math.min(containerOffset, bottomLimit)
        : Math.min(containerOffset, topLimit)
    }
    const finalStickyStyle = isSticky && {
      position: 'fixed',
      [position]: getPositionOffset(),
      left: xOffset,
      width: width,
      ...stickyStyle,
    }
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
