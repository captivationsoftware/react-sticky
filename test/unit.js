import { expect } from 'chai';
import { jsdom } from 'jsdom';
import React from 'react';
import ReactDOM from 'react-dom';
import Sticky from '../lib/sticky';
import _ from 'lodash';
import ReactTestUtils from 'react-addons-test-utils';

// Initialize jsdom
global.document = jsdom('<body></body>');
global.window = document.defaultView;

describe('Sticky component', function() {
  function mount(JSX) {
    let container = document.createElement('div');
    document.body.appendChild(container);
    return ReactDOM.render(JSX, container);
  }

  function unmount(sticky) {
    ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sticky).parentNode);
  }

  beforeEach(() => {
    expect(Sticky.__frame).to.be.null;
    expect(Sticky.__instances).to.be.empty;
    this.sticky = mount(<Sticky>Test</Sticky>);
  });

  afterEach(() => {
    unmount(this.sticky);
    expect(Sticky.__instances).to.be.empty;
    expect(Sticky.__frame).to.be.null;
  });

  it ('should be added to the list of static instances', () => {
    expect(Sticky.__instances).to.contain(this.sticky);
  });

  it ('should update the frame while mounted', (done) => {
    let frame = Sticky.__frame;
    setTimeout(() => {
      expect(Sticky.__frame).to.not.equal(frame);
      expect(Sticky.__frame).to.not.be.null;
      done();
    }, 20);
  });

  describe('state', () => {
    it ('should be sticky when scroll position is greater than original position plus topOffset', () => {
      var scrollPosition = 100;
      var topOffset = -50;
      var distanceFromTopOfPage = 10;

      this.sticky.pageOffset = () => scrollPosition;
      this.sticky.props = _.extend(this.sticky.props, {topOffset});
      this.sticky.origin = distanceFromTopOfPage;

      // is 100 > (10 - 50)? Yes, so should be sticky
      expect(this.sticky.shouldBeSticky()).to.be.true;
    });

    it ('should be sticky when scroll position is equal to original position plus topOffset', () => {
      var scrollPosition = 100;
      var topOffset = 0;
      var distanceFromTopOfPage = 100;

      this.sticky.pageOffset = () => scrollPosition;
      this.sticky.props = _.extend(this.sticky.props, {topOffset});
      this.sticky.origin = distanceFromTopOfPage;

      // is 100 > (100 - 0)? Yes, so should be sticky
      expect(this.sticky.shouldBeSticky()).to.be.true;
    });

    it ('should not be sticky when scroll position is less that original position plus topOffset', () => {
      var scrollPosition = 0;
      var topOffset = 0;
      var distanceFromTopOfPage = 100;

      this.sticky.pageOffset = () => scrollPosition;
      this.sticky.props = _.extend(this.sticky.props, {topOffset});
      this.sticky.origin = distanceFromTopOfPage;

      // is 0 > (100 - 0)? No, so should not sticky
      expect(this.sticky.shouldBeSticky()).to.be.false;
    });

    describe('style transitions', () => {
      it ('should add the sticky class when sticky', () => {
        let shouldBeSticky = true;

        this.sticky.props = _.extend(this.sticky.props, {
          style: _.extend(this.sticky.props.style, { foo: 1, baz: 4 }),
          stickyStyle: { bar: 2, baz: 3 }
        })

        this.sticky.nextState(shouldBeSticky);
        expect(this.sticky.state.style).to.deep.equal(
          _.extend(this.sticky.props.style, this.sticky.props.stickyStyle));
      });

      it ('should omit the sticky class when not sticky', () => {
        let shouldBeSticky = false;
        this.sticky.props = _.extend(this.sticky.props, {
          style: _.extend(this.sticky.props.style, { foo: 1, baz: 4 }),
          stickyStyle: { bar: 2, baz: 3 }
        });
        this.sticky.nextState(shouldBeSticky);
        expect(this.sticky.state.style).to.equal(this.sticky.props.style);
      });
    });

    describe('className transitions', () => {
      it ('should add the sticky class when sticky', () => {
        let shouldBeSticky = true;
        this.sticky.props = _.extend({}, this.sticky.props, {
          className: 'foo'
        });
        this.sticky.state.isSticky = !shouldBeSticky;
        this.sticky.nextState(shouldBeSticky);
        expect(this.sticky.state.className).to.equal('foo sticky');
      });

      it ('should omit the sticky class when not sticky', () => {
        let shouldBeSticky = false;
        this.sticky.props = _.extend({}, this.sticky.props, {
          className: 'foo'
        });
        this.sticky.state.isSticky = !shouldBeSticky;
        this.sticky.nextState(shouldBeSticky);
        expect(this.sticky.state.className).to.equal('foo');
      });
    });

    describe('change events', () => {
      it ('should fire the onStickyStateChange event when sticky state changes', (done) => {
        let shouldBeSticky = true;

        unmount(this.sticky);

        function onStickyStateChange(isSticky) {
          expect(isSticky).to.equal(shouldBeSticky);
          done();
        }

        this.sticky = mount(
          <Sticky onStickyStateChange={onStickyStateChange}>
            Test
          </Sticky>
        );

        this.sticky.state.isSticky = !shouldBeSticky;
        this.sticky.nextState(shouldBeSticky);
      });

      it ('should not fire the onStickyStateChange event when sticky state remains the same', (done) => {
        var shouldBeSticky = true;

        unmount(this.sticky);

        function onStickyStateChange(isSticky) {
          expect(false).to.be.true;
        }

        this.sticky = mount(
          <Sticky onStickyStateChange={onStickyStateChange}>
            Test
          </Sticky>
        );

        this.sticky.state.isSticky = shouldBeSticky;
        this.sticky.nextState(shouldBeSticky);
        setTimeout(done, 20);
      });

    });
  });

  describe('properties', () => {

  });

  describe('interaction with other Sticky components', () => {
    beforeEach(() => {
      this.bottomMost = mount(<Sticky>1</Sticky>);
      this.inBetween = mount(<Sticky>2</Sticky>);
      Sticky.unregister(this.bottomMost);
      Sticky.unregister(this.inBetween);
      this.bottomMost.top = function () { return 300; };
      this.inBetween.top = function () { return 100; };
      Sticky.register(this.bottomMost);
      Sticky.register(this.inBetween);
    });

    afterEach(() => {
      unmount(this.bottomMost);
      unmount(this.inBetween);
    });

    it ('should know what components are above it', () => {
      expect(Sticky.instancesAbove(this.sticky)).to.be.empty;

      var aboveInBetween = Sticky.instancesAbove(this.inBetween);
      expect(aboveInBetween[0]).to.equal(this.sticky);

      var aboveBottomMost = Sticky.instancesAbove(this.bottomMost);
      expect(aboveBottomMost[0]).to.equal(this.sticky);
      expect(aboveBottomMost[1]).to.equal(this.inBetween);
    });

    it ('should incorporate height of other sticky elements above it when computing offset', () => {
      expect(this.inBetween.pageOffset()).to.equal(0);
      this.sticky.state.isSticky = false;
      this.inBetween.state.isSticky = true;

      let rects = { height: 30 };
      this.inBetween.domNode = { getBoundingClientRect() { return rects; } };

      expect(this.inBetween.pageOffset()).to.equal(0);
      expect(this.bottomMost.pageOffset()).to.equal(rects.height);
    });
  });

  describe('event listeners', () => {
    function emitEvent(type) {
      let evt = document.createEvent('Event');
      evt.initEvent(type, true, true);
      window.dispatchEvent(evt);
    }

    beforeEach(() => {
      this.sticky.hasUnhandledEvent = false;
    });

    it ('should react to scroll events', (done) => {
      this.sticky.nextState = () => done();
      emitEvent('scroll');
    });

    it ('should react to resize events', (done) => {
      this.sticky.nextState = () => done();
      emitEvent('resize');
    });

    it ('should react to touch events', (done) => {
      this.sticky.nextState = () => done();
      emitEvent('touchmove');
    });
  });
});
