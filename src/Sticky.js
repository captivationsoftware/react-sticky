import React, { Component } from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

export default class Sticky extends Component {
  static propTypes = {
    topOffset: PropTypes.number,
    bottomOffset: PropTypes.number,
    relative: PropTypes.bool,
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    relative: false,
    topOffset: 0,
    bottomOffset: 0,
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
    this.placeholder.style.paddingBottom = this.props.disableCompensation
      ? 0
      : `${this.state.isSticky ? this.state.calculatedHeight : 0}px`;
  }

  handleContainerEvent = ({ distanceFromTop, distanceFromBottom } = {}) => {
    const contentClientRect = this.content.getBoundingClientRect();
    const calculatedHeight = contentClientRect.height;

    if (this.props.relative) {
      const parent = this.context.getParent();

      distanceFromTop = this.placeholder.offsetTop - parent.scrollTop;
      distanceFromBottom = parent.scrollHeight - parent.scrollTop;
    }

    const wasSticky = !!this.state.isSticky;
    const isSticky =
      distanceFromTop <= -this.props.topOffset &&
      distanceFromBottom > -this.props.bottomOffset;
    const style = this.calculateStyle(
      isSticky,
      distanceFromBottom,
      calculatedHeight
    );

    distanceFromBottom = distanceFromBottom - calculatedHeight;

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

  calculateStyle(isSticky, distanceFromBottom, calculatedHeight) {
    const parent = this.context.getParent();
    const placeholderClientRect = this.placeholder.getBoundingClientRect();
    const bottomDifference =
      distanceFromBottom - this.props.bottomOffset - calculatedHeight;
    let style = {};

    if (isSticky) {
      if (this.props.relative) {
        style = {
          position: "absolute",
          top: parent.scrollTop,
          width: placeholderClientRect.width
        };

        if (bottomDifference <= 0) style.top = style.top + bottomDifference;
      } else {
        style = {
          position: "fixed",
          top: bottomDifference > 0 ? 0 : bottomDifference,
          left: placeholderClientRect.left,
          width: placeholderClientRect.width
        };
      }
    }

    return style;
  }

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
