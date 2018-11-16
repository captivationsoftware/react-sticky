import React, { PureComponent } from 'react';

export const StickyContext = React.createContext();

export default class Container extends PureComponent {
  currentNode = React.createRef();

  events = [
    'resize',
    'scroll',
    'touchstart',
    'touchmove',
    'touchend',
    'pageshow',
    'load'
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

      this.rafHandle = window.requestAnimationFrame(() => {
        this.framePending = false;
        const {
          top,
          bottom
        } = this.currentNode.current.getBoundingClientRect();

        this.subscribers.forEach(handler =>
          handler({
            distanceFromTop: top,
            distanceFromBottom: bottom,
            eventSource:
              currentTarget === window
                ? document.body
                : this.currentNode.current
          })
        );
      });
      this.framePending = true;
    }
  };

  getParent = () => this.currentNode.current;

  componentDidMount() {
    this.events.forEach(event =>
      window.addEventListener(event, this.notifySubscribers)
    );
  }

  componentWillUnmount() {
    if (this.rafHandle) {
      window.cancelAnimationFrame(this.rafHandle);
      this.rafHandle = null;
    }

    this.events.forEach(event =>
      window.removeEventListener(event, this.notifySubscribers)
    );
  }

  render() {
    return (
      <StickyContext.Provider
        value={{
          subscribe: this.subscribe,
          unsubscribe: this.unsubscribe,
          getParent: this.getParent
        }}
      >
        <div
          {...this.props}
          ref={this.currentNode}
          onScroll={this.notifySubscribers}
          onTouchStart={this.notifySubscribers}
          onTouchMove={this.notifySubscribers}
          onTouchEnd={this.notifySubscribers}
        />
      </StickyContext.Provider>
    );
  }
}
