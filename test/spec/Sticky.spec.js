import React from 'react';
import { mount } from 'enzyme';
import { StickyContainer, Sticky } from '../../src';
import { STATUS_CODES } from 'http';

const attachTo = document.getElementById('mount');

describe('Invalid Sticky', () => {
  it('should complain if Sticky child is not a function', () => {
    expect(() =>
      mount(
        <StickyContainer>
          <Sticky />
        </StickyContainer>,
        { attachTo }
      )
    ).toThrow(TypeError);
  });

  it('should complain if StickyContainer is not found', () => {
    expect(() => mount(<Sticky>{() => <div />}</Sticky>, { attachTo })).toThrow(
      TypeError
    );
  });
});

describe('Valid Sticky', () => {
  const componentFactory = props => (
    <StickyContainer>
      <Sticky {...props} />
    </StickyContainer>
  );

  describe('lifecycle', () => {
    let container;
    beforeEach(() => {
      container = mount(componentFactory({ children: () => <div /> }), {
        attachTo
      });
    });

    it('should register as subscriber of parent on mount', () => {
      expect(container.instance().subscribers).toContain(
        container.find(Sticky).instance().handleContainerEvent
      );
    });

    it('should unregister as subscriber of parent on unmount', () => {
      expect(container.instance().subscribers).toContain(
        container.find(Sticky).instance().handleContainerEvent
      );
      mount(<StickyContainer />, { attachTo });
      expect(container.instance().subscribers).toEqual([]);
    });
  });

  describe('with no props', () => {
    const expectedStickyStyle = {
      left: 10,
      top: 0,
      width: 100,
      position: 'fixed',
      transform: 'translateZ(0)'
    };

    let sticky;
    beforeEach(() => {
      const wrapper = mount(
        componentFactory({
          children: () => <div />
        }),
        { attachTo }
      );

      const {
        position,
        transform,
        ...boundingClientRect
      } = expectedStickyStyle;
      sticky = wrapper.find(Sticky).instance();
      sticky.content.current.getBoundingClientRect = jest.fn(() => ({
        ...boundingClientRect,
        height: 100
      }));
      sticky.placeholder.current.getBoundingClientRect = jest.fn(() => ({
        ...boundingClientRect,
        height: 100
      }));
    });

    it('should change have an expected start state', () => {
      expect(sticky.state).toEqual({
        isSticky: false,
        wasSticky: false,
        style: {}
      });
    });

    it('should be sticky when distanceFromTop is 0', () => {
      sticky.handleContainerEvent({
        distanceFromTop: 0,
        distanceFromBottom: 1000,
        eventSource: document.body
      });
      expect(sticky.state).toEqual({
        isSticky: true,
        wasSticky: false,
        style: expectedStickyStyle,
        distanceFromTop: 0,
        distanceFromBottom: 900,
        calculatedHeight: 100
      });
      expect(parseInt(sticky.placeholder.current.style.paddingBottom)).toBe(
        100
      );
    });

    it('should be sticky when distanceFromTop is negative', () => {
      sticky.handleContainerEvent({
        distanceFromTop: -1,
        distanceFromBottom: 999,
        eventSource: document.body
      });
      expect(sticky.state).toEqual({
        isSticky: true,
        wasSticky: false,
        style: expectedStickyStyle,
        distanceFromTop: -1,
        distanceFromBottom: 899,
        calculatedHeight: 100
      });
      expect(parseInt(sticky.placeholder.current.style.paddingBottom)).toBe(
        100
      );
    });

    it('should continue to be sticky when distanceFromTop becomes increasingly negative', () => {
      sticky.handleContainerEvent({
        distanceFromTop: -1,
        distanceFromBottom: 999,
        eventSource: document.body
      });
      sticky.handleContainerEvent({
        distanceFromTop: -2,
        distanceFromBottom: 998,
        eventSource: document.body
      });
      expect(sticky.state).toEqual({
        isSticky: true,
        wasSticky: true,
        style: expectedStickyStyle,
        distanceFromTop: -2,
        distanceFromBottom: 898,
        calculatedHeight: 100
      });
      expect(parseInt(sticky.placeholder.current.style.paddingBottom)).toBe(
        100
      );
    });

    it('should cease to be sticky when distanceFromTop becomes greater than 0', () => {
      sticky.handleContainerEvent({
        distanceFromTop: -1,
        distanceFromBottom: 999,
        eventSource: { ...document.body, offsetTop: 3 }
      });
      sticky.handleContainerEvent({
        distanceFromTop: 1,
        distanceFromBottom: 1001,
        eventSource: { ...document.body, offsetTop: 3 }
      });
      expect(sticky.state).toEqual({
        isSticky: false,
        wasSticky: true,
        style: { transform: 'translateZ(0)' },
        distanceFromTop: 1,
        distanceFromBottom: 901,
        calculatedHeight: 100
      });
      expect(parseInt(sticky.placeholder.current.style.paddingBottom)).toBe(0);
    });

    it('should compensate sticky style height when distanceFromBottom is < 0', () => {
      sticky.handleContainerEvent({
        distanceFromTop: -901,
        distanceFromBottom: 99,
        eventSource: document.body
      });
      expect(sticky.state).toEqual({
        isSticky: true,
        wasSticky: false,
        style: { ...expectedStickyStyle, top: -1 },
        distanceFromTop: -901,
        distanceFromBottom: -1,
        calculatedHeight: 100
      });
      expect(parseInt(sticky.placeholder.current.style.paddingBottom)).toBe(
        100
      );
    });
  });

  describe('with topOffset not equal to 0', () => {
    it('should attach lazily when topOffset is positive', () => {
      const wrapper = mount(
        componentFactory({
          topOffset: 1,
          children: () => <div />
        }),
        { attachTo }
      );

      const sticky = wrapper.find(Sticky).instance();
      sticky.handleContainerEvent({
        distanceFromTop: 0,
        distanceFromBottom: 100,
        eventSource: document.body
      });
      expect(sticky.state.isSticky).toBeFalsy();
      sticky.handleContainerEvent({
        distanceFromTop: -1,
        distanceFromBottom: 99,
        eventSource: document.body
      });
      expect(sticky.state.isSticky).toBeTruthy();
    });

    it('should attach aggressively when topOffset is negative', () => {
      const wrapper = mount(
        componentFactory({
          topOffset: -1,
          children: () => <div />
        }),
        { attachTo }
      );

      const sticky = wrapper.find(Sticky).instance();
      sticky.handleContainerEvent({
        distanceFromTop: 2,
        distanceFromBottom: 99,
        eventSource: document.body
      });
      expect(sticky.state.isSticky).toBeFalsy();
      sticky.handleContainerEvent({
        distanceFromTop: 1,
        distanceFromBottom: 98,
        eventSource: document.body
      });
      expect(sticky.state.isSticky).toBeTruthy();
    });
  });

  describe('when relative = true', () => {
    let eventSource, sticky;
    beforeEach(() => {
      const wrapper = mount(
        componentFactory({
          relative: true,
          children: () => <div />
        }),
        { attachTo }
      );

      eventSource = wrapper.instance().currentNode.current;
      Object.defineProperty(eventSource, 'scrollHeight', {
        value: 1000
      });
      Object.defineProperty(eventSource, 'offsetTop', {
        value: 0
      });
      Object.defineProperty(eventSource, 'offsetParent', {
        value: {
          scrollTop: 0
        }
      });

      sticky = wrapper.find(Sticky).instance();
    });

    it('should not change sticky state when event source is not StickyContainer', () => {
      Object.defineProperty(sticky.placeholder.current, 'offsetTop', {
        value: 0
      });

      eventSource.scrollTop = 0;

      sticky.handleContainerEvent({
        distanceFromTop: 100,
        distanceFromBottom: 500,
        eventSource
      });
      expect(sticky.state.isSticky).toBeTruthy();

      sticky.handleContainerEvent({
        distanceFromTop: 100,
        distanceFromBottom: 500,
        eventSource: document.body
      });
      expect(sticky.state.isSticky).toBeTruthy();
    });

    it('should change sticky state when event source is StickyContainer', () => {
      Object.defineProperty(sticky.placeholder.current, 'offsetTop', {
        value: 1
      });
      eventSource.scrollTop = 0;

      sticky.placeholder.current.getBoundingClientRect = jest.fn(() => ({
        paddingBottom: 3
      }));

      sticky.handleContainerEvent({
        distanceFromTop: 100,
        distanceFromBottom: 500,
        eventSource
      });
      expect(sticky.state.isSticky).toBeFalsy();

      eventSource.scrollTop = 1;
      sticky.handleContainerEvent({
        distanceFromTop: 100,
        distanceFromBottom: 500,
        eventSource
      });
      expect(sticky.state.isSticky).toBeTruthy();

      eventSource.scrollTop = 2;
      sticky.handleContainerEvent({
        distanceFromTop: 100,
        distanceFromBottom: 500,
        eventSource
      });
      expect(sticky.state.isSticky).toBeTruthy();
    });

    it('should adjust sticky style.top when StickyContainer has a negative distanceFromTop', () => {
      Object.defineProperty(sticky.placeholder.current, 'offsetTop', {
        value: 0
      });
      eventSource.scrollTop = 0;

      sticky.handleContainerEvent({
        distanceFromTop: 0,
        distanceFromBottom: 1000,
        eventSource
      });
      expect(sticky.state.isSticky).toBeTruthy();
      expect(sticky.state.style.top).toBe(0);

      eventSource.offsetParent.scrollTop = 1;
      sticky.handleContainerEvent({
        distanceFromTop: -1,
        distanceFromBottom: 999,
        eventSource: document.body
      });
      expect(sticky.state.isSticky).toBeTruthy();
      expect(sticky.state.style.top).toBe(-1);

      eventSource.scrollTop = 1;
      sticky.handleContainerEvent({
        distanceFromTop: -1,
        distanceFromBottom: 1000,
        eventSource
      });
      expect(sticky.state.isSticky).toBeTruthy();
      expect(sticky.state.style.top).toBe(-1);
    });
  });

  describe('with disableHardwareAcceleration = true', () => {
    it('should not include translateZ style when sticky', () => {
      const wrapper = mount(
        componentFactory({
          disableHardwareAcceleration: true,
          children: () => <div />
        }),
        { attachTo }
      );

      const sticky = wrapper.find(Sticky).instance();
      sticky.handleContainerEvent({
        distanceFromTop: 1,
        distanceFromBottom: 100,
        eventSource: document.body
      });
      expect(sticky.state.isSticky).toBeFalsy();
      expect(sticky.state.style.transform).toBeUndefined();

      sticky.handleContainerEvent({
        distanceFromTop: -1,
        distanceFromBottom: 99,
        eventSource: document.body
      });
      expect(sticky.state.isSticky).toBeTruthy();
      expect(sticky.state.style.transform).toBeUndefined();
    });
  });

  describe('with disableCompensation = true', () => {
    it('should not include translateZ style when sticky', () => {
      const wrapper = mount(
        componentFactory({
          disableCompensation: true,
          children: () => <div />
        }),
        { attachTo }
      );

      const sticky = wrapper.find(Sticky).instance();
      sticky.handleContainerEvent({
        distanceFromTop: -1,
        distanceFromBottom: 99,
        eventSource: document.body
      });
      expect(sticky.state.isSticky).toBeTruthy();
      expect(parseInt(sticky.placeholder.current.style.paddingBottom)).toBe(0);
    });
  });
});
