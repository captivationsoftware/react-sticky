import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Container extends PureComponent {

  static propTypes = {
    overflow: PropTypes.bool
  }

  static childContextTypes = {
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
    overflow: PropTypes.bool
  }

  getChildContext() {
    return {
      subscribe: this.subscribe,
      unsubscribe: this.unsubscribe,
      overflow: this.props.overflow
    };
  }

  events = [
    'resize',
    'scroll',
    'touchstart',
    'touchmove',
    'touchend',
    'pageshow',
    'load'
  ]

  subscribers = [];

  subscribe = handler => {
    this.subscribers = this.subscribers.concat(handler);
  }

  unsubscribe = handler => {
    this.subscribers = this.subscribers.filter(current => current !== handler);
  }

  notifySubscribers = evt => {
    const eventSource = !this.props.overflow && evt.currentTarget === window ? document.body : this.node;

    if (!this.framePending) {
      requestAnimationFrame(() => {
        this.framePending = false;
        const boundingClientRect = this.node.getBoundingClientRect();
        const distanceFromTop = this.props.overflow ? eventSource.offsetTop - eventSource.scrollTop : eventSource.scrollTop + eventSource.offsetTop;
        const distanceFromBottom = boundingClientRect.bottom;

        this.subscribers.forEach(handler => handler({
          distanceFromTop, distanceFromBottom
        }));
      });
      this.framePending = true;
    }
  }

  componentDidMount() {
    this.events.forEach(event => window.addEventListener(event, this.notifySubscribers))
  }

  componentWillUnmount() {
    this.events.forEach(event => window.removeEventListener(event, this.notifySubscribers))
  }

  render() {
    const { overflow, ...props } = { ...this.props };

    return (
      <div
        ref={ node => this.node = node }
        onScroll={this.notifySubscribers}
        onTouchStart={this.notifySubscribers}
        onTouchMove={this.notifySubscribers}
        onTouchEnd={this.notifySubscribers}
        { ...props }
        style={{ ...props.style, position: this.props.overflow ? 'relative' : '' }}
      />
    );
  }
}
