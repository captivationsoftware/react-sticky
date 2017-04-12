import '../setup'

import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { mount, unmount, emitEvent } from '../utils';

const { Sticky, StickyContainer } = require('../../src');

describe('Sticky component', function() {
  const mountSticky = (component) => {
    this.stickyContainer = mount(<StickyContainer children={component} />);
    this.sticky = ReactTestUtils.scryRenderedComponentsWithType(this.stickyContainer, Sticky)[0];
  };

  beforeEach(() => {
    mountSticky(<Sticky />);
    this.sticky.distanceFromBottom = () => 1000;
  });

  afterEach(() => {
    unmount(this.stickyContainer);
  });

  describe('props', () => {
    describe('topOffset', () => {
      describe('(positive)', () => {
        beforeEach(() => {
          mountSticky(<Sticky topOffset={10}>Test</Sticky>);
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
          mountSticky(<Sticky topOffset={-10}>Test</Sticky>);
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

      describe('with containerOffset', () => {
        beforeEach(() => {
          mountSticky(<Sticky topOffset={10}>Test</Sticky>, this.container);
          this.sticky.getDistanceFromBottom = () => 1000;
          this.sticky.setState({ containerOffset: 15 });
        });

        it('is not sticky when the component is at the `offset`', () => {
          this.sticky.getDistanceFromTop = () => 15;
          expect(this.sticky.isSticky()).to.be.false;
        });

        it('is not sticky when the component is at the `topOffset`', () => {
          this.sticky.getDistanceFromTop = () => 10;
          expect(this.sticky.isSticky()).to.be.false;
        });

        it('is sticky when the component is `topOffset` pixels above the `containerOffset`', () => {
          this.sticky.getDistanceFromTop = () => 5;
          expect(this.sticky.isSticky()).to.be.true;
        });
      });
    });

    describe('bottomOffset', () => {
      describe('(positive)', () => {
        beforeEach(() => {
          mountSticky(<Sticky bottomOffset={10}>Test</Sticky>);
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
          mountSticky(<Sticky bottomOffset={-10}>Test</Sticky>);
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

      describe('with containerOffset', () => {
        beforeEach(() => {
          mountSticky(<Sticky bottomOffset={10}>Test</Sticky>);
          this.sticky.getDistanceFromTop = () => -1000;
          this.sticky.setState({ containerOffset: 15 });
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
        mountSticky(<Sticky isActive={true}>Test</Sticky>);
        this.sticky.getDistanceFromTop = () => 0;

        expect(this.sticky.isSticky()).to.be.true;
      });

      it('`false` prevents the component from being sticky', () => {
        mountSticky(<Sticky isActive={false}>Test</Sticky>);
        this.sticky.getDistanceFromTop = () => 0;

        expect(this.sticky.isSticky()).to.be.false;
      });
    });

    describe('onStickyStateChange', () => {
      beforeEach(() => {
        const spy = (...args) => this.callback(...args);
        this.callback = () => {}
        mountSticky(<Sticky onStickyStateChange={spy}>Test</Sticky>);
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
        mountSticky(<Sticky className="xyz">Test</Sticky>);
        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.xyz')).to.not.be.null;
      });

      it('adds the "sticky" class to the DOM node when sticky', () => {
        mountSticky(<Sticky className="xyz">Test</Sticky>);
        this.sticky.setState({ isSticky: true });

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.xyz')).to.not.be.null;
        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.xyz.sticky')).to.not.be.null;
      });

      it('omits the "sticky" class when not sticky', () => {
        mountSticky(<Sticky className="xyz">Test</Sticky>);
        this.sticky.setState({ isSticky: false });

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.xyz')).to.not.be.null;
        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.xyz.sticky')).to.be.null;
      });
    });

    describe('stickyClassName', () => {
      it('adds the `stickyClassName` to the DOM node when sticky', () => {
        mountSticky(<Sticky stickyClassName="xyz">Test</Sticky>);
        this.sticky.setState({ isSticky: true });

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.xyz')).to.not.be.null;
      });

      it('omits the `stickyClassName` when not sticky', () => {
        mountSticky(<Sticky stickyClassName="xyz">Test</Sticky>);
        this.sticky.setState({ isSticky: false });

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.xyz')).to.be.null;
      });

      it('uses the `stickyClassName` instead of the default "sticky" class', () => {
        mountSticky(<Sticky stickyClassName="xyz">Test</Sticky>);
        this.sticky.setState({ isSticky: true });

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.xyz')).to.not.be.null;
        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.sticky')).to.be.null;
      });
    });

    describe('style', () => {
      it('`transform: translateZ(0)` is present', () => {
        mountSticky(<Sticky className="handle">Test</Sticky>);

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.transform).to.equal('translateZ(0)');
      });

      it('applies the given styles', () => {
        mountSticky(<Sticky className="handle" style={{height: 100, opacity: 0.5}}>Test</Sticky>);

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.height).to.equal('100px');
        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.opacity).to.equal('0.5');
      });
    });

    describe('stickyStyle', () => {
      it('applies if the component is sticky', () => {
        mountSticky(<Sticky className="handle" stickyStyle={{height: 200}}>Test</Sticky>);
        this.sticky.setState({ isSticky: true });

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.height).to.equal('200px');
      });

      it('does not apply if the component is not sticky', () => {
        mountSticky(<Sticky className="handle" stickyStyle={{height: 200}}>Test</Sticky>);
        this.sticky.setState({ isSticky: false });

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.height).to.equal('');
      });

      it('merges `stickyStyle` with the provided `style` prop and `transform: translateZ(0)`', () => {
        mountSticky(<Sticky className="handle" style={{height: 100, opacity: 0.5}} stickyStyle={{height: 200}}>Test</Sticky>);
        this.sticky.setState({ isSticky: true });

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.transform).to.equal('translateZ(0)');
        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.height).to.equal('200px');
        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.opacity).to.equal('0.5');
      });
    });
  });

  describe('state', () => {
    describe('containerOffset', () => {
      it('uses containerOffset as the top position of a sticky element', () => {
        mountSticky(<Sticky className="handle">Test</Sticky>);
        this.sticky.setState({ isSticky: true, distanceFromBottom: 200, containerOffset: 99 });
        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.top).to.equal('99px');
      });
    });

    describe('xOffset', () => {
      beforeEach(() => {
        mountSticky(<Sticky className="handle">Test</Sticky>);
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

      it('gets height from the children', () => {
        const childrenNode = ReactDOM.findDOMNode(this.sticky.refs.children);
        childrenNode.getBoundingClientRect = () => ({ height: 123 })
        expect(this.sticky.getHeight()).to.equal(123)
      });
    });
  });

  describe('context', () => {
    describe('sticky-channel', () => {
      beforeEach(() => {
        this.channel = this.stickyContainer.getChildContext()['sticky-channel'];
      });

      it('is subscribed to for updates to inherited offsets', () => {
        this.channel.update((data) => data.inherited = 999);
        expect(this.sticky.state.containerOffset).to.equal(999);
      });

      it('is subscribed to for updates to the container node', () => {
        const node = { getBoundingClientRect: () => { return { bottom: 999 } } };
        this.channel.update((data) => data.node = node);
        expect(this.sticky.state.distanceFromBottom).to.equal(999);
      });

      it('is used by `recomputeState` to notify the parent container when we toggle stickiness', () => {
        let called = 0;
        this.channel.subscribe(() => called += 1);

        this.sticky.setState({ isSticky: false });
        this.sticky.isSticky = () => false;
        this.sticky.recomputeState();
        expect(called).to.equal(0);

        this.sticky.isSticky = () => true;
        this.sticky.recomputeState();
        expect(called).to.equal(1);

        this.sticky.isSticky = () => false;
        this.sticky.recomputeState();
        expect(called).to.equal(2);
      });
    });
  });

  describe('behaviors', () => {
    describe('sticking to the bottom of the container', () => {
      beforeEach(() => {
        mountSticky(<Sticky className="handle" style={{top: 1}}>Test</Sticky>);
        this.sticky.getHeight = () => 100;
      });

      it('is stuck to the top of the screen while there is still space before the bottom of the context container', () => {
        this.sticky.getDistanceFromBottom = () => 100;
        this.sticky.recomputeState();

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.top).to.equal('0px');
      });

      it('is "pushed" by the bottom of the context container when there component will not fit on screen', () => {
        this.sticky.getDistanceFromBottom = () => 90;
        this.sticky.recomputeState();

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.top).to.equal('-10px');
      });

      it('is "pushed" off-screen when the bottom of the context container scrolls to the top', () => {
        this.sticky.getDistanceFromBottom = () => 0;
        this.sticky.recomputeState();

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.top).to.equal('-100px');
      });

      it('returns to its inline position when the bottom of the context container scrolls off the top', () => {
        this.sticky.getDistanceFromBottom = () => -10;
        this.sticky.recomputeState();

        expect(ReactDOM.findDOMNode(this.sticky).querySelector('.handle').style.top).to.equal('1px');
      });
    });

    describe('offset reporting', () => {
      describe('(mechanism)', () => {
        beforeEach(() => {
          this.sticky.channel.unsubscribe(this.sticky.updateContext);

          this.channelData = {}
          this.sticky.channel = {
            update: (fn) => fn(this.channelData),
            unsubscribe: () => {}
          }

          this.sticky.getHeight = () => 100;
        });

        it('reports an offset of zero to its container when losing stickiness', () => {
          this.sticky.setState({ isSticky: true });

          this.sticky.isSticky = () => false;
          this.sticky.recomputeState();

          expect(this.channelData.offset).to.equal(0);
        });

        it('reports an offset of the component height to its container when becoming sticky', () => {
          this.sticky.setState({ isSticky: false });

          this.sticky.isSticky = () => true;
          this.sticky.recomputeState();

          expect(this.channelData.offset).to.equal(this.sticky.getHeight());
        });
      });

      describe('(effect)', () => {
        beforeEach(() => {
          class NoUpdates extends React.Component {
            shouldComponentUpdate() { return false; }

            render() {
              return (<div>{this.props.children}</div>);
            }
          }

          mountSticky(
            <div>
              <Sticky>Hi</Sticky>
              <StickyContainer>
                <Sticky>Mid</Sticky>
                <NoUpdates>
                  <StickyContainer>
                    <Sticky>Low</Sticky>
                  </StickyContainer>
                </NoUpdates>
              </StickyContainer>
            </div>
          );

          this.stickyContainerMid = ReactTestUtils.scryRenderedComponentsWithType(this.stickyContainer, StickyContainer)[1];
          this.stickyMid = ReactTestUtils.scryRenderedComponentsWithType(this.stickyContainerMid, Sticky)[0];

          this.stickyContainerLow = ReactTestUtils.scryRenderedComponentsWithType(this.stickyContainerMid, StickyContainer)[1];
          this.stickyLow = ReactTestUtils.scryRenderedComponentsWithType(this.stickyContainerLow, Sticky)[0];
        });

        it('defaults to an offset of zero', () => {
          expect(this.sticky.state.containerOffset).to.equal(0);
          expect(this.stickyMid.state.containerOffset).to.equal(0);
          expect(this.stickyLow.state.containerOffset).to.equal(0);
        });

        it('passes offsets to child Containers', () => {
          this.sticky.setState({ isSticky: false });
          this.sticky.getHeight = () => 100;
          this.sticky.isSticky = () => true;
          this.sticky.recomputeState();

          expect(this.stickyMid.state.containerOffset).to.equal(100);
        });

        it('passes offsets through components that do not re-render', () => {
          this.sticky.setState({ isSticky: false });
          this.sticky.getHeight = () => 100;
          this.sticky.isSticky = () => true;
          this.sticky.recomputeState();

          expect(this.stickyLow.state.containerOffset).to.equal(100);
        });

        it('aggregates offsets from all parent Containers with actively sticky components', () => {
          this.sticky.setState({ isSticky: false });
          this.sticky.getHeight = () => 100;
          this.sticky.isSticky = () => true;
          this.sticky.recomputeState();

          expect(this.stickyLow.state.containerOffset).to.equal(100);

          this.stickyMid.setState({ isSticky: false });
          this.stickyMid.getHeight = () => 200;
          this.stickyMid.isSticky = () => true;
          this.stickyMid.recomputeState();

          expect(this.stickyLow.state.containerOffset).to.equal(300);

          this.sticky.isSticky = () => false;
          this.sticky.recomputeState();

          expect(this.stickyLow.state.containerOffset).to.equal(200);
        });
      });
    });
  });
});
