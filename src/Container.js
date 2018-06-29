import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import raf from "raf";

export default class Container extends PureComponent {
  static propTypes = {
    capture: PropTypes.bool
  };

  static defaultProps = {
    capture: false
  };

  static childContextTypes = {
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
    getParent: PropTypes.func
  };

  getChildContext() {
    return {
      subscribe: this.subscribe,
      unsubscribe: this.unsubscribe,
      getParent: this.getParent
    };
  }

  events = [
    "resize",
    "scroll",
    "touchstart",
    "touchmove",
    "touchend",
    "pageshow",
    "load"
  ];

  subscribers = [];

  rafHandle = null;

  subscribe = handler => {
    this.subscribers = this.subscribers.concat(handler);
  };

  unsubscribe = handler => {
    this.subscribers = this.subscribers.filter(current => current !== handler);
  };

  notifySubscribers = evt => {
    if (!this.framePending) {
      const { currentTarget } = evt;

      this.rafHandle = raf(() => {
        this.framePending = false;
        const { top, bottom } = this.node.getBoundingClientRect();

        this.subscribers.forEach(handler =>
          handler({
            distanceFromTop: top,
            distanceFromBottom: bottom,
            eventSource: currentTarget === window ? document.body : this.node
          })
        );
      });
      this.framePending = true;
    }
  };

  getParent = () => this.node;

  componentDidMount() {
    this.capture = this.props.capture;
    this.events.forEach(event =>
      window.addEventListener(event, this.notifySubscribers, this.capture)
    );
  }

  componentWillUnmount() {
    if (this.rafHandle) {
      raf.cancel(this.rafHandle);
      this.rafHandle = null;
    }

    this.events.forEach(event =>
      window.removeEventListener(event, this.notifySubscribers, this.capture)
    );
  }

  render() {
    const { capture, ...rest } = this.props;
    return (
      <div
        {...rest}
        ref={node => (this.node = node)}
        onScroll={this.notifySubscribers}
        onTouchStart={this.notifySubscribers}
        onTouchMove={this.notifySubscribers}
        onTouchEnd={this.notifySubscribers}
      />
    );
  }
}
