import React from "react";
import { expect } from "chai";
import { mount } from "enzyme";
import { StickyContainer, Sticky } from "../../src";

const attachTo = document.getElementById("mount");

describe("Invalid Sticky", () => {
  it("should complain if Sticky child is not a function", () => {
    expect(() =>
      mount(
        <StickyContainer>
          <Sticky />
        </StickyContainer>,
        { attachTo }
      )
    ).to.throw(TypeError);
  });

  it("should complain if StickyContainer is not found", () => {
    expect(() =>
      mount(<Sticky>{() => <div />}</Sticky>, { attachTo })
    ).to.throw(TypeError);
  });
});

describe("Valid Sticky", () => {
  const componentFactory = props => (
    <StickyContainer>
      <Sticky {...props} />
    </StickyContainer>
  );

  describe("lifecycle", () => {
    let container;
    beforeEach(() => {
      container = mount(componentFactory({ children: () => <div /> }), {
        attachTo
      });
    });

    it("should register as subscriber of parent on mount", () => {
      expect(container.node.subscribers).to.contain(
        container.children().node.handleContainerEvent
      );
    });

    it("should unregister as subscriber of parent on unmount", () => {
      expect(container.node.subscribers).to.contain(
        container.children().node.handleContainerEvent
      );
      mount(<StickyContainer />, { attachTo });
      expect(container.node.subscribers).to.be.empty;
    });
  });

  describe("with no props", () => {
    const expectedStickyStyle = {
      left: 10,
      top: 0,
      width: 100,
      position: "fixed",
      transform: "translateZ(0)"
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

      sticky = wrapper.children().node;
      sticky.content.getBoundingClientRect = () => ({
        ...boundingClientRect,
        height: 100
      });
      sticky.placeholder.getBoundingClientRect = () => ({
        ...boundingClientRect,
        height: 100
      });
    });

    it("should change have an expected start state", () => {
      expect(sticky.state).to.eql({
        isSticky: false,
        wasSticky: false,
        style: {}
      });
    });

    it("should be sticky when distanceFromTop is 0", () => {
      sticky.handleContainerEvent({
        distanceFromTop: 0,
        distanceFromBottom: 1000
      });
      expect(sticky.state).to.eql({
        isSticky: true,
        wasSticky: false,
        style: expectedStickyStyle,
        distanceFromTop: 0,
        distanceFromBottom: 900,
        calculatedHeight: 100
      });
      expect(parseInt(sticky.placeholder.style.paddingBottom)).to.equal(100);
    });

    it("should be sticky when distanceFromTop is negative", () => {
      sticky.handleContainerEvent({
        distanceFromTop: -1,
        distanceFromBottom: 999
      });
      expect(sticky.state).to.eql({
        isSticky: true,
        wasSticky: false,
        style: expectedStickyStyle,
        distanceFromTop: -1,
        distanceFromBottom: 899,
        calculatedHeight: 100
      });
      expect(parseInt(sticky.placeholder.style.paddingBottom)).to.equal(100);
    });

    it("should continue to be sticky when distanceFromTop becomes increasingly negative", () => {
      sticky.handleContainerEvent({
        distanceFromTop: -1,
        distanceFromBottom: 999
      });
      sticky.handleContainerEvent({
        distanceFromTop: -2,
        distanceFromBottom: 998
      });
      expect(sticky.state).to.eql({
        isSticky: true,
        wasSticky: true,
        style: expectedStickyStyle,
        distanceFromTop: -2,
        distanceFromBottom: 898,
        calculatedHeight: 100
      });
      expect(parseInt(sticky.placeholder.style.paddingBottom)).to.equal(100);
    });

    it("should cease to be sticky when distanceFromTop becomes greater than 0", () => {
      sticky.handleContainerEvent({
        distanceFromTop: -1,
        distanceFromBottom: 999
      });
      sticky.handleContainerEvent({
        distanceFromTop: 1,
        distanceFromBottom: 1001
      });
      expect(sticky.state).to.eql({
        isSticky: false,
        wasSticky: true,
        style: { transform: "translateZ(0)" },
        distanceFromTop: 1,
        distanceFromBottom: 901,
        calculatedHeight: 100
      });
      expect(parseInt(sticky.placeholder.style.paddingBottom)).to.equal(0);
    });

    it("should compensate sticky style height when distanceFromBottom is < 0", () => {
      sticky.handleContainerEvent({
        distanceFromTop: -901,
        distanceFromBottom: 99
      });
      expect(sticky.state).to.eql({
        isSticky: true,
        wasSticky: false,
        style: { ...expectedStickyStyle, top: -1 },
        distanceFromTop: -901,
        distanceFromBottom: -1,
        calculatedHeight: 100
      });
      expect(parseInt(sticky.placeholder.style.paddingBottom)).to.equal(100);
    });
  });

  describe("with topOffset not equal to 0", () => {
    it("should attach lazily when topOffset is positive", () => {
      const wrapper = mount(
        componentFactory({
          topOffset: 1,
          children: () => <div />
        }),
        { attachTo }
      );

      const sticky = wrapper.children().node;
      sticky.handleContainerEvent({
        distanceFromTop: 0,
        distanceFromBottom: 100
      });
      expect(sticky.state.isSticky).to.be.false;
      sticky.handleContainerEvent({
        distanceFromTop: -1,
        distanceFromBottom: 99
      });
      expect(sticky.state.isSticky).to.be.true;
    });

    it("should attach aggressively when topOffset is negative", () => {
      const wrapper = mount(
        componentFactory({
          topOffset: -1,
          children: () => <div />
        }),
        { attachTo }
      );

      const sticky = wrapper.children().node;
      sticky.handleContainerEvent({
        distanceFromTop: 2,
        distanceFromBottom: 99
      });
      expect(sticky.state.isSticky).to.be.false;
      sticky.handleContainerEvent({
        distanceFromTop: 1,
        distanceFromBottom: 98
      });
      expect(sticky.state.isSticky).to.be.true;
    });
  });

  describe("when relative = true", () => {
    let parent, sticky;
    const expectedStickyStyle = {
      top: 0,
      width: 100,
      position: "absolute",
      transform: "translateZ(0)"
    };

    beforeEach(() => {
      const wrapper = mount(
        componentFactory({
          relative: true,
          children: () => <div />
        }),
        { attachTo }
      );

      parent = wrapper.node.node;
      parent.scrollTop = 0;
      parent.scrollHeight = 1000;
      parent.offsetTop = 0;
      parent.offsetParent = { scrollTop: 0 };

      const {
        position,
        transform,
        ...boundingClientRect
      } = expectedStickyStyle;

      sticky = wrapper.children().node;
      sticky.content.getBoundingClientRect = () => ({
        ...boundingClientRect,
        height: 100
      });
      sticky.placeholder.offsetTop = 0;
      sticky.placeholder.getBoundingClientRect = () => ({
        ...boundingClientRect,
        height: 100
      });
    });

    it("should not be intially sticky", () => {
      expect(sticky.state).to.eql({
        isSticky: false,
        wasSticky: false,
        style: {}
      });
    });

    it("should be sticky when distanceFromTop relative to parent is 0", () => {
      sticky.placeholder.offsetTop = 0;
      parent.offsetTop = 0;
      parent.scrollTop = 0;

      sticky.handleContainerEvent();
      expect(sticky.state).to.eql({
        isSticky: true,
        wasSticky: false,
        style: expectedStickyStyle,
        distanceFromTop: 0,
        distanceFromBottom: 900,
        calculatedHeight: 100
      });
      expect(parseInt(sticky.placeholder.style.paddingBottom)).to.equal(100);
    });

    it("should be sticky when distanceFromTop relative to parent is negative", () => {
      sticky.placeholder.offsetTop = 0;
      parent.offsetTop = 0;
      parent.scrollTop = 1;

      sticky.handleContainerEvent();
      expect(sticky.state).to.eql({
        isSticky: true,
        wasSticky: false,
        style: { ...expectedStickyStyle, top: 1 },
        distanceFromTop: -1,
        distanceFromBottom: 899,
        calculatedHeight: 100
      });
      expect(parseInt(sticky.placeholder.style.paddingBottom)).to.equal(100);
    });

    it("should continue to be sticky when distanceFromTop relative to parent becomes increasingly negative", () => {
      sticky.placeholder.offsetTop = 0;
      parent.offsetTop = 0;
      parent.scrollTop = 1;

      sticky.handleContainerEvent();
      expect(sticky.state).to.eql({
        isSticky: true,
        wasSticky: false,
        style: { ...expectedStickyStyle, top: 1 },
        distanceFromTop: -1,
        distanceFromBottom: 899,
        calculatedHeight: 100
      });

      parent.offsetTop = 1;
      sticky.handleContainerEvent();
      expect(sticky.state).to.eql({
        isSticky: true,
        wasSticky: true,
        style: { ...expectedStickyStyle, top: 1 },
        distanceFromTop: -1,
        distanceFromBottom: 899,
        calculatedHeight: 100
      });

      sticky.placeholder.offsetTop = 1;
      sticky.handleContainerEvent();
      expect(sticky.state).to.eql({
        isSticky: true,
        wasSticky: true,
        style: { ...expectedStickyStyle, top: 1 },
        distanceFromTop: 0,
        distanceFromBottom: 899,
        calculatedHeight: 100
      });
    });

    it("should cease to be sticky when distanceFromTop relative to parent becomes greater than 0", () => {
      sticky.handleContainerEvent();

      sticky.placeholder.offsetTop = 1;
      sticky.handleContainerEvent();

      expect(sticky.state).to.eql({
        isSticky: false,
        wasSticky: true,
        style: { transform: "translateZ(0)" },
        distanceFromTop: 1,
        distanceFromBottom: 900,
        calculatedHeight: 100
      });
      expect(parseInt(sticky.placeholder.style.paddingBottom)).to.equal(0);
    });
  });

  describe("with disableHardwareAcceleration = true", () => {
    it("should not include translateZ style when sticky", () => {
      const wrapper = mount(
        componentFactory({
          disableHardwareAcceleration: true,
          children: () => <div />
        }),
        { attachTo }
      );

      const sticky = wrapper.children().node;
      sticky.handleContainerEvent({
        distanceFromTop: 1,
        distanceFromBottom: 100
      });
      expect(sticky.state.isSticky).to.be.false;
      expect(sticky.state.style.transform).to.be.undefined;

      sticky.handleContainerEvent({
        distanceFromTop: -1,
        distanceFromBottom: 99
      });
      expect(sticky.state.isSticky).to.be.true;
      expect(sticky.state.style.transform).to.be.undefined;
    });
  });

  describe("with disableCompensation = true", () => {
    it("should not include translateZ style when sticky", () => {
      const wrapper = mount(
        componentFactory({
          disableCompensation: true,
          children: () => <div />
        }),
        { attachTo }
      );

      const sticky = wrapper.children().node;
      sticky.handleContainerEvent({
        distanceFromTop: -1,
        distanceFromBottom: 99
      });
      expect(sticky.state.isSticky).to.be.true;
      expect(parseInt(sticky.placeholder.style.paddingBottom)).to.equal(0);
    });
  });
});
