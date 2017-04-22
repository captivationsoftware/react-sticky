import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

export default class Container extends PureComponent {

  static childContextTypes = {
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func,
    getParent: PropTypes.func
  }

  getChildContext() {
    return {
      subscribe: this.subscribe,
      unsubscribe: this.unsubscribe,
      getParent: this.getParent
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
    const eventSource = evt.currentTarget === window ? document.body : this.node;

    if (!this.framePending) {
      requestAnimationFrame(() => {
        this.framePending = false;
        const boundingClientRect = this.node.getBoundingClientRect();
        const distanceFromTop = eventSource.scrollTop + eventSource.offsetTop;
        const distanceFromBottom = boundingClientRect.bottom;

        this.subscribers.forEach(handler => handler({
          distanceFromTop, distanceFromBottom, eventSource
        }));
      });
      this.framePending = true;
    }
  }

  getParent = () => this.node

  componentDidMount() {
    this.events.forEach(event => window.addEventListener(event, this.notifySubscribers))
  }

  componentWillUnmount() {
    this.events.forEach(event => window.removeEventListener(event, this.notifySubscribers))
  }

  render() {
    return (
      <div
        ref={ node => this.node = node }
        onScroll={this.notifySubscribers}
        onTouchStart={this.notifySubscribers}
        onTouchMove={this.notifySubscribers}
        onTouchEnd={this.notifySubscribers}
        { ...this.props }
      />
    );
  }
}
