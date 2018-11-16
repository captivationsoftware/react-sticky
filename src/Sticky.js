import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StickyContext } from './Container';

export default class Sticky extends Component {
  static propTypes = {
    topOffset: PropTypes.number,
    bottomOffset: PropTypes.number,
    relative: PropTypes.bool,
    withCopy: PropTypes.bool,
    children: PropTypes.func.isRequired
  };

  static defaultProps = {
    relative: false,
    topOffset: 0,
    bottomOffset: 0,
    withCopy: false,
    disableCompensation: false,
    disableHardwareAcceleration: false
  };

  static contextType = StickyContext;

  content = React.createRef();
  placeholder = React.createRef();

  state = {
    isSticky: false,
    wasSticky: false,
    style: {}
  };

  componentWillMount() {
    if (!this.context.subscribe)
      throw new TypeError(
        'Expected Sticky to be mounted within StickyContainer'
      );
    this.context.subscribe(this.handleContainerEvent);
  }

  componentWillUnmount() {
    this.context.unsubscribe(this.handleContainerEvent);
  }

  componentDidUpdate() {
    this.placeholder.current.style.paddingBottom = this.props
      .disableCompensation
      ? 0
      : `${this.state.isSticky ? this.state.calculatedHeight : 0}px`;
  }

  handleContainerEvent = ({
    distanceFromTop,
    distanceFromBottom,
    eventSource
  }) => {
    const parent = this.context.getParent();

    let preventingStickyStateChanges = false;
    if (this.props.relative) {
      preventingStickyStateChanges = eventSource !== parent;
      distanceFromTop =
        -(eventSource.scrollTop + eventSource.offsetTop) +
        this.placeholder.current.offsetTop;
    }

    const placeholderClientRect = this.placeholder.current.getBoundingClientRect();
    const contentClientRect = this.content.current.getBoundingClientRect();
    const calculatedHeight = contentClientRect.height;

    const bottomDifference =
      distanceFromBottom - this.props.bottomOffset - calculatedHeight;

    const wasSticky = !!this.state.isSticky;
    const isSticky = preventingStickyStateChanges
      ? wasSticky
      : distanceFromTop <= -this.props.topOffset &&
        distanceFromBottom > -this.props.bottomOffset;

    distanceFromBottom =
      (this.props.relative
        ? parent.scrollHeight - parent.scrollTop
        : distanceFromBottom) - calculatedHeight;

    const style = !isSticky
      ? {}
      : {
          position: 'fixed',
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
      style.transform = 'translateZ(0)';
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
    const { withCopy } = this.props;
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
        ref: this.content
      }
    );

    const originalElement = React.cloneElement(
      this.props.children({
        style: undefined,
        isSticky: false
      })
    );

    return (
      <div>
        <div ref={this.placeholder} />
        {!withCopy && element}
        {withCopy && (
          <React.Fragment>
            {element}
            {this.state.isSticky && originalElement}
          </React.Fragment>
        )}
      </div>
    );
  }
}
