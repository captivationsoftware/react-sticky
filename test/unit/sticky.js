import { expect } from 'chai';
import { jsdom } from 'jsdom';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import { mount, unmount, emitEvent } from '../utils';

// Initialize jsdom
global.document = jsdom('<body></body>');
global.window = document.defaultView;

const { Sticky, StickyContainer } = require('../../src');

describe('Sticky component', function() {

  beforeEach(() => {
    this.stickyContainer = mount(<StickyContainer></StickyContainer>);
    this.container = ReactDOM.findDOMNode(this.stickyContainer);
    this.sticky = mount(<Sticky>Test</Sticky>, this.container);

    // Mock out some commonly called functions (override them again later as needed)
    this.sticky.context.offset = 0;
    this.sticky.context.rect = {};
    this.sticky.context.container = { updateOffset: () => {} }
  });

  afterEach(() => {
    unmount(this.sticky);
    unmount(this.stickyContainer);
  });

  describe('props', () => {
    describe('topOffset', () => {
      describe('(positive)', () => {
        beforeEach(() => {
          this.sticky = mount(<Sticky topOffset={10}>Test</Sticky>, this.container);
        });

        it('is not sticky when it is mid-screen', () => {
          this.sticky.getDistanceFromTop = () => 100;
          expect(this.sticky.isSticky()).to.be.false;
        });

        it('is not sticky when it is at the top of the screen', () => {
          this.sticky.getDistanceFromTop = () => 0;
          expect(this.sticky.isSticky()).to.be.false;
        });

        it('is not sticky when it is less than `topOffset` pixels above the top of the screen', () => {
          this.sticky.getDistanceFromTop = () => -9;
          expect(this.sticky.isSticky()).to.be.false;
        });

        it('is sticky when it is exactly `topOffset` pixels above the top of the screen', () => {
          this.sticky.getDistanceFromTop = () => -10;
          expect(this.sticky.isSticky()).to.be.true;
        });

        it('is sticky when it is more than `topOffset` pixels above the top of the screen', () => {
          this.sticky.getDistanceFromTop = () => -11;
          expect(this.sticky.isSticky()).to.be.true;
        });
      });

      describe('(negative)', () => {
        beforeEach(() => {
          this.sticky = mount(<Sticky topOffset={-10}>Test</Sticky>, this.container);
        });

        it('is not sticky when it is more than `topOffset` pixels below the top of the screen', () => {
          this.sticky.getDistanceFromTop = () => 11;
          expect(this.sticky.isSticky()).to.be.false;
        });

        it('is sticky when it is exactly `topOffset` pixels below the top of the screen', () => {
          this.sticky.getDistanceFromTop = () => 10;
          expect(this.sticky.isSticky()).to.be.true;
        });

        it('is sticky when it is less than `topOffset` pixels below the top of the screen', () => {
          this.sticky.getDistanceFromTop = () => 9;
          expect(this.sticky.isSticky()).to.be.true;
        });

        it('is sticky when it is at the top of the screen', () => {
          this.sticky.getDistanceFromTop = () => 0;
          expect(this.sticky.isSticky()).to.be.true;
        });

        it('is sticky when the component is above the top of the screen', () => {
          this.sticky.getDistanceFromTop = () => -100;
          expect(this.sticky.isSticky()).to.be.true;
        });
      });

      describe('with context.offset', () => {
        beforeEach(() => {
          this.sticky = mount(<Sticky topOffset={10}>Test</Sticky>, this.container);
          this.sticky.getDistanceFromBottom = () => 1000;
          this.sticky.context.offset = 15;
        });

        it('is not sticky when the component is at the `offset`', () => {
          this.sticky.getDistanceFromTop = () => 15;
          expect(this.sticky.isSticky()).to.be.false;
        });

        it('is not sticky when the component is at the `topOffset`', () => {
          this.sticky.getDistanceFromTop = () => 10;
          expect(this.sticky.isSticky()).to.be.false;
        });

        it('is sticky when the component is `topOffset` pixels above the `offset`', () => {
          this.sticky.getDistanceFromTop = () => 5;
          expect(this.sticky.isSticky()).to.be.true;
        });
      });
    });

    describe('bottomOffset', () => {
      describe('(positive)', () => {
        beforeEach(() => {
          this.sticky = mount(<Sticky bottomOffset={10}>Test</Sticky>, this.container);
        });

        it('is sticky when the container bottom is more than `bottomOffset` pixels below the top of the screen', () => {
          this.sticky.getDistanceFromBottom = () => 11;
          expect(this.sticky.isSticky()).to.be.true;
        });

        // TODO: Evaluate negating this case.
        it('is sticky when the container bottom is exactly `bottomOffset` pixels below the top of the screen', () => {
          this.sticky.getDistanceFromBottom = () => 10;
          expect(this.sticky.isSticky()).to.be.true;
        });

        it('is not sticky when the container bottom is less than `bottomOffset` pixels below the top of the screen', () => {
          this.sticky.getDistanceFromBottom = () => 9;
          expect(this.sticky.isSticky()).to.be.false;
        });

        it('is not sticky when the container bottom is at the top of the screen', () => {
          this.sticky.getDistanceFromBottom = () => 0;
          expect(this.sticky.isSticky()).to.be.false;
        });

        it('is not sticky when the container bottom is above the top of the screen', () => {
          this.sticky.getDistanceFromBottom = () => -10;
          expect(this.sticky.isSticky()).to.be.false;
        });
      });

      describe('(negative)', () => {
        beforeEach(() => {
          this.sticky = mount(<Sticky bottomOffset={-10}>Test</Sticky>, this.container);
        });

        it('is sticky when the container bottom is below the top of the screen', () => {
          this.sticky.getDistanceFromBottom = () => 20;
          expect(this.sticky.isSticky()).to.be.true;
        });

        it('is sticky when the container bottom is at the top of the screen', () => {
          this.sticky.getDistanceFromBottom = () => 0;
          expect(this.sticky.isSticky()).to.be.true;
        });

        it('is sticky when the container bottom is less than `bottomOffset` pixels above the top of the screen', () => {
          this.sticky.getDistanceFromBottom = () => -9;
          expect(this.sticky.isSticky()).to.be.true;
        });

        // TODO: Evaluate negating this case.
        it('is sticky when the container bottom is exactly `bottomOffset` pixels above the top of the screen', () => {
          this.sticky.getDistanceFromBottom = () => -10;
          expect(this.sticky.isSticky()).to.be.true;
        });

        it('is not sticky when the container bottom is more than `bottomOffset` pixels above the top of the screen', () => {
          this.sticky.getDistanceFromBottom = () => -11;
          expect(this.sticky.isSticky()).to.be.false;
        });
      });

      describe('with context.offset', () => {
        beforeEach(() => {
          this.sticky = mount(<Sticky bottomOffset={10}>Test</Sticky>, this.container);
          this.sticky.getDistanceFromTop = () => -1000;
          this.sticky.context.offset = 15;
        });

        it('is sticky when the container bottom is below the `offset`', () => {
          this.sticky.getDistanceFromBottom = () => 30;
          expect(this.sticky.isSticky()).to.be.true;
        });

        // TODO: Evaluate negating this case.
        it('is sticky when the container bottom is `bottomOffset` pixels below the `offset`', () => {
          this.sticky.getDistanceFromBottom = () => 25;
          expect(this.sticky.isSticky()).to.be.true;
        });

        it('is not sticky when the container bottom is just above `bottomOffset` pixels below the `offset`', () => {
          this.sticky.getDistanceFromBottom = () => 24;
          expect(this.sticky.isSticky()).to.be.false;
        });

        it('is not sticky when the container bottom is well above `bottomOffset` pixels below the `offset`', () => {
          this.sticky.getDistanceFromBottom = () => 5;
          expect(this.sticky.isSticky()).to.be.false;
        });
      });
    });

    describe('isActive', () => {
      it('`true` allows the component to be sticky', () => {
        this.sticky = mount(<Sticky isActive={true}>Test</Sticky>, this.container);
        this.sticky.getDistanceFromTop = () => 0;

        expect(this.sticky.isSticky()).to.be.true;
      });

      it('`false` prevents the component from being sticky', () => {
        this.sticky = mount(<Sticky isActive={false}>Test</Sticky>, this.container);
        this.sticky.getDistanceFromTop = () => 0;

        expect(this.sticky.isSticky()).to.be.false;
      });
    });

    describe('onStickyStateChange', () => {
      beforeEach(() => {
        const spy = (...args) => this.callback(...args);
        this.callback = () => {}
        this.sticky = mount(<Sticky onStickyStateChange={spy}>Test</Sticky>, this.container);
      });

      it('calls the onStickyStateChange callback when becoming sticky', (done) => {
        this.sticky.getDistanceFromTop = () => 10;
        this.sticky.recomputeState();  // Not Sticky

        this.callback = (isSticky) => {
          expect(isSticky).to.equal(true);
          done();
        }

        this.sticky.getDistanceFromTop = () => 0;
        this.sticky.recomputeState();  // Sticky
      });

      it('calls the onStickyStateChange callback when losing stickiness', (done) => {
        this.sticky.getDistanceFromTop = () => 0;
        this.sticky.recomputeState();  // Sticky

        this.callback = (isSticky) => {
          expect(isSticky).to.equal(false);
          done();
        }

        this.sticky.getDistanceFromTop = () => 10;
        this.sticky.recomputeState();  // Not Sticky
      });

      it('does not call the onStickyStateChange callback when staying sticky', (done) => {
        this.sticky.getDistanceFromTop = () => 0;
        this.sticky.recomputeState();  // Sticky

        this.callback = (isSticky) => {
          expect(false).to.equal(true);
        }

        this.sticky.getDistanceFromTop = () => -10;
        this.sticky.recomputeState();  // Still Sticky
        setTimeout(done, 10);
      });

      it('does not call the onStickyStateChange callback when staying unstuck', (done) => {
        this.sticky.getDistanceFromTop = () => 10;
        this.sticky.recomputeState();  // Not Sticky

        this.callback = (isSticky) => {
          expect(false).to.equal(true);
        }

        this.sticky.getDistanceFromTop = () => 20;
        this.sticky.recomputeState();  // Still Not Sticky
        setTimeout(done, 10);
      });
    });

    describe('className', () => {
      it('renders the DOM node with the given className', () => {
        this.sticky = mount(<Sticky className="xyz">Test</Sticky>, this.container);
        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.xyz')).to.not.be.null;
      });

      it('adds the "sticky" class to the DOM node when sticky', () => {
        this.sticky = mount(<Sticky className="xyz">Test</Sticky>, this.container);
        this.sticky.setState({ isSticky: true });

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.xyz')).to.not.be.null;
        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.xyz.sticky')).to.not.be.null;
      });

      it('omits the "sticky" class when not sticky', () => {
        this.sticky = mount(<Sticky className="xyz">Test</Sticky>, this.container);
        this.sticky.setState({ isSticky: false });

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.xyz')).to.not.be.null;
        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.xyz.sticky')).to.be.null;
      });
    });

    describe('stickyClassName', () => {
      it('adds the `stickyClassName` to the DOM node when sticky', () => {
        this.sticky = mount(<Sticky stickyClassName="xyz">Test</Sticky>, this.container);
        this.sticky.setState({ isSticky: true });

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.xyz')).to.not.be.null;
      });

      it('omits the `stickyClassName` when not sticky', () => {
        this.sticky = mount(<Sticky stickyClassName="xyz">Test</Sticky>, this.container);
        this.sticky.setState({ isSticky: false });

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.xyz')).to.be.null;
      });

      it('uses the `stickyClassName` instead of the default "sticky" class', () => {
        this.sticky = mount(<Sticky stickyClassName="xyz">Test</Sticky>, this.container);
        this.sticky.setState({ isSticky: true });

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.xyz')).to.not.be.null;
        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.sticky')).to.be.null;
      });
    });

    describe('style', () => {
      it('applies the given styles', () => {
        this.sticky = mount(<Sticky className="handle" style={{height: 100, opacity: 0.5}}>Test</Sticky>, this.container);

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.height).to.equal('100px');
        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.opacity).to.equal('0.5');
      });
    });

    describe('stickyStyle', () => {
      it('applies if the component is sticky', () => {
        this.sticky = mount(<Sticky className="handle" stickyStyle={{height: 200}}>Test</Sticky>, this.container);
        this.sticky.setState({ isSticky: true });

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.height).to.equal('200px');
      });

      it('does not apply if the component is not sticky', () => {
        this.sticky = mount(<Sticky className="handle" stickyStyle={{height: 200}}>Test</Sticky>, this.container);
        this.sticky.setState({ isSticky: false });

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.height).to.equal('');
      });

      it('merges `stickyStyle` with the provided `style` prop', () => {
        this.sticky = mount(<Sticky className="handle" style={{height: 100, opacity: 0.5}} stickyStyle={{height: 200}}>Test</Sticky>, this.container);
        this.sticky.setState({ isSticky: true });

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.height).to.equal('200px');
        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.opacity).to.equal('0.5');
      });
    });
  });

  describe('state', () => {
    describe('xOffset', () => {
      beforeEach(() => {
        this.sticky = mount(<Sticky className="handle">Test</Sticky>, this.container);
      });

      describe('updates through `recomputeState`', () => {
        it('becomes updated when called while sticky', () => {
          this.sticky.setState({ isSticky: true, xOffset: 10 })
          this.sticky.isSticky = () => true;
          this.sticky.getXOffset = () => 20;

          this.sticky.recomputeState();

          expect(this.sticky.state.xOffset).to.equal(20);
        });
      });

      it('is not passed to the non-placeholder child if not sticky', () => {
        this.sticky.setState({ isSticky: false, xOffset: 1000 });
        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.left).to.equal('');
      });

      it('is passed to the non-placeholder child if sticky', () => {
        this.sticky.setState({ isSticky: true, xOffset: 1000 });
        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.left).to.equal('1000px');
      });
    });

    describe('height', () => {
      it('is not passed to the placeholder child as padding if not sticky', () => {
        this.sticky.setState({ isSticky: false, height: 1000 });
        expect(this.sticky.refs.placeholder.style.paddingBottom).to.equal('0px');
      });

      it('is passed to the placeholder child as padding if sticky', () => {
        this.sticky.setState({ isSticky: true, height: 1000 });
        expect(this.sticky.refs.placeholder.style.paddingBottom).to.equal('1000px');
      });
    });
  });

  describe('context', () => {
    describe('offset', () => {
      // `offset` represents the space occupied by sticky elements in containers outside our own.

      beforeEach(() => {
        this.sticky = mount(<Sticky className="handle">Test</Sticky>, this.container);
        this.sticky.getDistanceFromBottom = () => 200;
        this.sticky.setState({ isSticky: true });
      });

      it('uses a provided offset as the top position of a sticky element', () => {
        this.sticky.context.offset = 100;
        this.sticky.forceUpdate();

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.top).to.equal('100px');
      });
    });
  });

  describe('behaviors', () => {
    describe('sticking to the bottom of the container', () => {
      beforeEach(() => {
        this.sticky = mount(<Sticky className="handle" style={{top: 1}}>Test</Sticky>, this.container);
        this.sticky.setState({ height: 100 });
        this.sticky.getHeight = () => 100;
      });

      it('is stuck to the top of the screen while there is still space before the bottom of the context container', () => {
        this.sticky.getDistanceFromBottom = () => 100;
        this.sticky.recomputeState();
        this.sticky.forceUpdate();

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.top).to.equal('0px');
      });

      it('is "pushed" by the bottom of the context container when there component will not fit on screen', () => {
        this.sticky.getDistanceFromBottom = () => 90;
        this.sticky.recomputeState();
        this.sticky.forceUpdate();

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.top).to.equal('-10px');
      });

      it('is "pushed" off-screen when the bottom of the context container scrolls to the top', () => {
        this.sticky.getDistanceFromBottom = () => 0;
        this.sticky.recomputeState();
        this.sticky.forceUpdate();

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.top).to.equal('-100px');
      });

      it('returns to its inline position when the bottom of the context container scrolls off the top', () => {
        this.sticky.getDistanceFromBottom = () => -10;
        this.sticky.recomputeState();
        this.sticky.forceUpdate();

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.top).to.equal('1px');
      });
    });

    describe('offset reporting', () => {
      beforeEach(() => {
        this.contextOffset = 0;

        this.sticky.getHeight = () => 100;
        this.sticky.context.container = {
          updateOffset: (offset) => { this.contextOffset = offset; },
        }
      });

      it('reports an offset of zero to its container when not sticky', () => {
        this.sticky.isSticky = () => false;
        this.sticky.recomputeState();

        expect(this.contextOffset).to.equal(0);
      });

      it('reports an offset of the component height to its container when sticky', () => {
        this.sticky.isSticky = () => true;
        this.sticky.recomputeState();

        expect(this.contextOffset).to.equal(this.sticky.getHeight());
      });
    });
  });
});
