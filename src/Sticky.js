import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

export default class Sticky extends Component {
  static propTypes = {
    topOffset: PropTypes.number,
    bottomOffset: PropTypes.number,
    relative: PropTypes.bool,
    children: PropTypes.func.isRequired,
    hasDifferentNonStickyHeight: PropTypes.bool,
    useHeightForTopOffset: PropTypes.bool,
    useHeightForBottomOffset: PropTypes.bool
  };

  static defaultProps = {
    relative: false,
    topOffset: 0,
    bottomOffset: 0,
    disableCompensation: false,
    disableHardwareAcceleration: false,
    hasDifferentNonStickyHeight: false,
    useHeightForTopOffset: false,
    useHeightForBottomOffset: false
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
    const { calculatedHeight, nonStickyHeight } = this.state

    this.placeholder.style.paddingBottom = this.props.disableCompensation
      ? 0
      : `${this.state.isSticky ? (nonStickyHeight || calculatedHeight) : 0}px`;
  }

  componentDidMount() {
    const contentClientRect = this.content.getBoundingClientRect();
    const calculatedHeight = contentClientRect.height;

    const newState = {}

    if (this.props.hasDifferentNonStickyHeight) {
      newState.nonStickyHeight = calculatedHeight
    }

    if (this.props.useHeightForTopOffset) {
      newState.topOffset = calculatedHeight
    }

    if (this.props.useHeightForBottomOffset) {
      newState.bottomOffset = calculatedHeight
    }

    this.setState(newState)
  }

  handleContainerEvent = ({
    distanceFromTop,
    distanceFromBottom,
    eventSource
  }) => {
    const parent = this.context.getParent();
    const topOffset = this.state.topOffset || this.props.topOffset
    const bottomOffset = this.state.bottomOffset || this.props.bottomOffset

    let preventingStickyStateChanges = false;

    if (this.props.relative) {
      preventingStickyStateChanges = eventSource !== parent;
      distanceFromTop =
        -(eventSource.scrollTop + eventSource.offsetTop) +
        this.placeholder.offsetTop;
    }

    const placeholderClientRect = this.placeholder.getBoundingClientRect();
    const contentClientRect = this.content.getBoundingClientRect();
    const calculatedHeight = contentClientRect.height;

    const bottomDifference =
      distanceFromBottom - bottomOffset - calculatedHeight;

    const wasSticky = !!this.state.isSticky;
    const isSticky = preventingStickyStateChanges
      ? wasSticky
      : (distanceFromTop || 0) <= -topOffset &&
        distanceFromBottom > -bottomOffset;

    distanceFromBottom =
      (this.props.relative
        ? parent.scrollHeight - parent.scrollTop
        : distanceFromBottom) - calculatedHeight;

    const style = !isSticky
      ? {}
      : {
          position: "fixed",
          top:
            bottomDifference > 0
              ? this.props.relative
                ? parent.offsetTop - parent.offsetParent.scrollTop
                : 0
              : bottomDifference,
          left: placeholderClientRect.left,
          width: placeholderClientRect.width
        };

    if (!this.props.disableHardwareAcceleration) {
      style.transform = "translateZ(0)";
    }

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
