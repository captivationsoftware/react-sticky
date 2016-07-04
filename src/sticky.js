import React from 'react';
import ReactDOM from 'react-dom';

export default class Sticky extends React.Component {

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
    return ReactDOM.findDOMNode(this).getBoundingClientRect().height;
  }

  getDistanceFromTop() {
    return this.refs.placeholder.getBoundingClientRect().top;
  }

  getDistanceFromBottom() {
    if (!this.containerNode) return 0;
    return this.containerNode.getBoundingClientRect().bottom;
  }

  isSticky() {
    if (!this.props.isActive) return false;

    const fromTop = this.getDistanceFromTop();
    const fromBottom = this.getDistanceFromBottom();

    const topBreakpoint = this.state.containerOffset - this.props.topOffset;
    const bottomBreakpoint = this.state.containerOffset + this.props.bottomOffset;

    return fromTop <= topBreakpoint && fromBottom >= bottomBreakpoint;
  }

  updateContext = ({ inherited, node }) => {
    this.containerNode = node;
    this.setState({
      containerOffset: inherited,
      distanceFromBottom: this.getDistanceFromBottom()
    });
  }

	isInView() {
		const doc = document.documentElement
		const portTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0)
		const portBottom = portTop + window.innerHeight

		const node = ReactDOM.findDOMNode(this)
		const nodeTop = node.offsetTop
		const nodeBottom = nodeTop + node.getBoundingClientRect().height

		return nodeBottom >= portTop && nodeTop <= portBottom
			|| !!node.querySelector('.' + this.props.stickyClassName)
	}
		
	
	
  recomputeStatex = () => {
    const isSticky = this.isSticky();
    const height = this.getHeight();
    const width = this.getWidth();
    const xOffset = this.getXOffset();
    const distanceFromBottom = this.getDistanceFromBottom();
    const hasChanged = this.state.isSticky !== isSticky;

    this.setState({ isSticky, height, width, xOffset, distanceFromBottom});

    if (hasChanged) {
      if (this.channel) {
        this.channel.update((data) => {
          data.offset = (isSticky ? this.state.height : 0);
        });
      }

      this.props.onStickyStateChange(isSticky);
    }
  }

	recomputeState = () => {
		const isSticky = this.isSticky();
		const isInView = this.isInView()

		const height = this.getHeight();
		const width = this.getWidth();
		const xOffset = this.getXOffset();
		const distanceFromBottom = this.getDistanceFromBottom();

		const hasChanged = this.state.isSticky !== isSticky;

		if(isInView || hasChanged)
			this.setState({ isSticky, height, width, xOffset, distanceFromBottom, isInView });

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
	  if(newState.isInView !== state.isInView) return true

    // If we are in view, have we changed any state that will impact rendering?
	  if(state.isInView) {
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
    const placeholderStyle = { paddingBottom: 0 };
    let className = this.props.className;
    let style = this.props.style;

    if (this.state.isSticky) {
      const stickyStyle = {
        position: 'fixed',
        top: this.state.containerOffset,
        left: this.state.xOffset,
        width: this.state.width
      };

      const bottomLimit = this.state.distanceFromBottom - this.state.height - this.props.bottomOffset;
      if (this.state.containerOffset > bottomLimit) {
        stickyStyle.top = bottomLimit;
      }

      placeholderStyle.paddingBottom = this.state.height;

      className += ` ${this.props.stickyClassName}`;
      style = Object.assign({}, style, stickyStyle, this.props.stickyStyle);
    }

    return (
      <div>
        <div ref="placeholder" style={placeholderStyle}></div>
        <div {...this.props} className={className} style={style}>
          {this.props.children}
        </div>
      </div>
    );
  }
}
