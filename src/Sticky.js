import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class Sticky extends Component {

  static propTypes = {
    topOffset: PropTypes.number,
    bottomOffset: PropTypes.number,
    relative: PropTypes.bool,
    children: PropTypes.func.isRequired,
    isFooter: PropTypes.bool
  }

  static defaultProps = {
    relative: false,
    topOffset: 0,
    bottomOffset: 0,
    disableCompensation: false,
    disableHardwareAcceleration: false,
    isFooter: false
  }

  static contextTypes = {
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
    getParent: PropTypes.func
  }

  state = {}

  componentWillMount() {
    this.context.subscribe(this.handleContainerEvent)
  }

  componentWillUnmount() {
    this.context.unsubscribe(this.handleContainerEvent)
  }

  componentDidUpdate() {
    this.placeholder.style.paddingBottom = this.props.disableCompensation ? 0 : `${this.state.isSticky ? this.state.calculatedHeight : 0}px`
  }

  handleContainerEvent = ({ distanceFromTop, distanceFromBottom, eventSource }) => {
  const parent = this.context.getParent();
  const preventingStickyStateChanges = this.props.relative && eventSource !== parent;

  const placeholderClientRect = this.placeholder.getBoundingClientRect();
  const contentClientRect = this.content.getBoundingClientRect();
  const calculatedHeight = contentClientRect.height;

  const bottomDifference = distanceFromBottom - this.props.bottomOffset - calculatedHeight;

  distanceFromTop = -distanceFromTop + this.placeholder.offsetTop;

  const wasSticky = !!this.state.isSticky;

  distanceFromBottom = (this.props.relative ? parent.scrollHeight - parent.scrollTop : distanceFromBottom) - calculatedHeight;

  let isSticky = false;
  let topValue = 0;

  if (!this.props.isFooter) {
      isSticky = preventingStickyStateChanges ? wasSticky : (distanceFromTop < -this.props.topOffset && distanceFromBottom > -this.props.bottomOffset);

      const bottomDifference = distanceFromBottom - this.props.bottomOffset - calculatedHeight;
      topValue = bottomDifference > 0 ? (this.props.relative ? parent.offsetTop - parent.offsetParent.scrollTop : 0) : bottomDifference;
  } else {
      const viewportHeight = window.innerHeight;
      const containerHeight = parent.getBoundingClientRect().height;
      isSticky = preventingStickyStateChanges ? wasSticky : distanceFromTop + this.props.topOffset < viewportHeight && distanceFromBottom + calculatedHeight - this.props.bottomOffset> 0;

      const footerDynamicTopValue = distanceFromTop + this.props.topOffset;
      const footerStaticValue = viewportHeight - calculatedHeight;

      const footerTopValue = Math.max(footerDynamicTopValue, footerStaticValue);
      const footerBottomValue = distanceFromBottom - this.props.bottomOffset;
      topValue = footerBottomValue + calculatedHeight < viewportHeight ? footerBottomValue : footerTopValue;
  }

  const style = !isSticky ? { } : {
    position: 'fixed',
    top: topValue,
    left: placeholderClientRect.left,
    width: placeholderClientRect.width,
    transform: this.props.disableHardwareAcceleration ? '' : 'translateZ(0)'
  };

  this.setState({
    isSticky,
    wasSticky,
    distanceFromTop,
    distanceFromBottom,
    calculatedHeight,
    style
  });
};

  render() {
    const element = React.cloneElement(
      this.props.children({
        isSticky: this.state.isSticky,
        wasSticky: this.state.wasSticky,
        distanceFromTop: this.state.distanceFromTop,
        distanceFromBottom: this.state.distanceFromBottom,
        calculatedHeight: this.state.calculatedHeight,
        style: this.state.style
      }),
      { ref: content => { this.content = ReactDOM.findDOMNode(content); } }
    )

    return (
      <div>
        <div ref={ placeholder => this.placeholder = placeholder } />
        { element }
      </div>
    )
  }
}
