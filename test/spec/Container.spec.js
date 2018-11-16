import React from 'react';
import { mount, shallow } from 'enzyme';
import { StickyContainer } from '../../src';

const attachTo = document.getElementById('mount');

describe('StickyContainer', () => {
  let container, containerNode;
  beforeEach(() => {
    container = mount(<StickyContainer />, { attachTo });
    containerNode = container.instance();
  });

  describe('getChildContext', () => {
    it('should expose a subscribe function that adds a callback to the subscriber list', () => {
      expect(containerNode.subscribe).toBeInstanceOf(Function);

      const callback = () => ({});
      expect(containerNode.subscribers).toEqual([]);
      containerNode.subscribe(callback);
      expect(containerNode.subscribers[0]).toEqual(callback);
    });

    it('should expose an unsubscribe function that removes a callback from the subscriber list', () => {
      expect(containerNode.unsubscribe).toBeInstanceOf(Function);

      const callback = () => ({});
      containerNode.subscribe(callback);
      expect(containerNode.subscribers[0]).toEqual(callback);
      containerNode.unsubscribe(callback);
      expect(containerNode.subscribers).toEqual([]);
    });

    it("should expose a getParent function that returns the container's underlying DOM ref", () => {
      expect(containerNode.getParent).toBeInstanceOf(Function);
      expect(containerNode.getParent()).toEqual(
        containerNode.currentNode.current
      );
    });
  });

  describe('subscribers', () => {
    let subscribe;
    beforeEach(() => {
      subscribe = containerNode.subscribe;
    });

    // container events
    ['scroll', 'touchstart', 'touchmove', 'touchend'].forEach(eventName => {
      it(`should be notified on container ${eventName} event`, done => {
        expect(containerNode.subscribers).toEqual([]);
        subscribe(() => done());
        container.simulate(eventName);
      });
    });

    // window events
    [
      'resize',
      'scroll',
      'touchstart',
      'touchmove',
      'touchend',
      'pageshow',
      'load'
    ].forEach(eventName => {
      it(`should be notified on window ${eventName} event`, done => {
        expect(containerNode.subscribers).toEqual([]);
        subscribe(() => done());
        window.dispatchEvent(new Event(eventName));
      });
    });
  });

  describe('notifySubscribers', () => {
    it('should publish document.body as eventSource to subscribers when window event', done => {
      containerNode.subscribers = [
        ({ eventSource }) => (
          expect(eventSource).toEqual(document.body), done()
        )
      ];
      containerNode.notifySubscribers({ currentTarget: window });
    });

    it('should publish node as eventSource to subscribers when div event', done => {
      containerNode.subscribers = [
        ({ eventSource }) => (
          expect(eventSource).toEqual(containerNode.currentNode.current), done()
        )
      ];
      containerNode.notifySubscribers({
        currentTarget: containerNode.currentNode.current
      });
    });

    it('should publish node top and bottom to subscribers', done => {
      containerNode.subscribers = [
        ({ distanceFromTop, distanceFromBottom }) => {
          expect(distanceFromTop).toEqual(100);
          expect(distanceFromBottom).toEqual(200);
          done();
        }
      ];

      containerNode.currentNode.current.getBoundingClientRect = () => ({
        top: 100,
        bottom: 200
      });
      containerNode.notifySubscribers({ currentTarget: window });
    });
  });
});
