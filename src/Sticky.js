import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

export default class Sticky extends Component {
  static propTypes = {
    topOffset: PropTypes.number,
    bottomOffset: PropTypes.number,
    leftOffset: PropTypes.number,
    rightOffset: PropTypes.number,
    horizontal: PropTypes.bool,
    relative: PropTypes.bool,
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    relative: false,
    topOffset: 0,
    bottomOffset: 0,
    leftOffset: 0,
    rightOffset: 0,
    horizontal: false,
    disableCompensation: false,
    disableHardwareAcceleration: false
  };

  static contextTypes = {
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
    getParent: PropTypes.func
  };

  state = {
    isSticky: false,
    wasSticky: false,
    style: {}
  };

  componentWillMount() {
    if (!this.context.subscribe)
      throw new TypeError(
        "Expected Sticky to be mounted within StickyContainer"
      );

    this.context.subscribe(this.handleContainerEvent);
  }

  componentWillUnmount() {
    this.context.unsubscribe(this.handleContainerEvent);
  }

  componentDidUpdate() {
    if (!this.props.horizontal) {
      this.placeholder.style.paddingBottom = this.props.disableCompensation
        ? 0
        : `${this.state.isSticky ? this.state.calculatedHeight : 0}px`;
    } else {
      this.placeholder.style.paddingRight = this.props.disableCompensation
        ? 0
        : `${this.state.isSticky ? this.state.calculatedWidth : 0}px`;
    }
  }

  handleContainerEvent = ({
    distanceFromTop,
    distanceFromBottom,
    eventSource
  }) => {
    const parent = this.context.getParent();
    const { horizontal } = this.props;

    let preventingStickyStateChanges = false;
    if (this.props.relative) {
      preventingStickyStateChanges = eventSource !== parent;
      distanceFromLeft =
        -(eventSource.scrollLeft + eventSource.offsetLeft) +
        this.placeholder.offsetLeft;
      distanceFromTop =
        -(eventSource.scrollTop + eventSource.offsetTop) +
        this.placeholder.offsetTop;
    }

    const placeholderClientRect = this.placeholder.getBoundingClientRect();
    const contentClientRect = this.content.getBoundingClientRect();
    const calculatedHeight = contentClientRect.height;
    const calculatedWidth = contentClientRect.width;

    const bottomDifference =
      distanceFromBottom - this.props.bottomOffset - calculatedHeight;
    const rightDifference =
      distanceFromRight - this.props.rightOffset - calculatedWidth;

    const wasSticky = !!this.state.isSticky
    const isSticky = preventingStickyStateChanges
      ? wasSticky
      : !horizontal
      ? distanceFromTop <= -this.props.topOffset &&
        distanceFromBottom > -this.props.bottomOffset
      : distanceFromLeft <= -this.props.leftOffset &&
        distanceFromRight > -this.props.rightOffset;

    distanceFromBottom =
      (this.props.relative
        ? parent.scrollHeight - parent.scrollTop
        : distanceFromBottom) - calculatedHeight;
    distanceFromRight =
      (this.props.relative
        ? parent.scrollWidth - parent.scrollLeft
        : distanceFromRight) - calculatedWidth;

    const style = !isSticky
      ? {}
      : !horizontal
      ? {
          position: 'fixed',
          top:
            bottomDifference > 0
              ? this.props.relative
                ? parent.offsetTop - parent.offsetParent.scrollTop
                : 0
              : bottomDifference,
          left: placeholderClientRect.left,
          width: placeholderClientRect.width
        }
      : {
          position: 'fixed',
          left:
            rightDifference > 0
              ? this.props.relative
                ? parent.offsetLeft - parent.offsetParent.scrollLeft
                : 0
              : rightDifference,
          top: placeholderClientRect.top,
          height: placeholderClientRect.height
        }

    if (!this.props.disableHardwareAcceleration) {
      style.transform = 'translateZ(0)';
    }

    this.setState({
      isSticky,
      wasSticky,
      distanceFromTop,
      distanceFromBottom,
      distanceFromLeft,
      distanceFromRight,
      calculatedHeight,
      calculatedWidth,
      style,
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
      {
        ref: content => {
          this.content = ReactDOM.findDOMNode(content);
        }
      }
    );

    return (
      <div>
        <div ref={placeholder => (this.placeholder = placeholder)} />
        {element}
      </div>
    );
  }
}
