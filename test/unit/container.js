import '../setup'

import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import { mount, unmount } from '../utils';

const { Sticky, StickyContainer, Channel } = require('../../src');
const { DEFAULT_INITIAL_ZINDEX } = require('../../src/container');

describe('StickyContainer component', function() {
  beforeEach(() => {
    this.stickyContainer = mount(<StickyContainer></StickyContainer>);
  });

  afterEach(() => {
    unmount(this.stickyContainer);
  });

  describe('context', () => {
    beforeEach(() => {
      this.childContext = this.stickyContainer.getChildContext();
    });

    describe('sticky-channel', () => {
      afterEach(() => {
        // Avoid calling the unmounting update.
        this.childContext['sticky-channel'].update = () => {};
      });

      it('should subscribe to any Channel in its ancestry', (done) => {
        this.stickyContainer.context['sticky-channel'] = {
          subscribe: (fn) => done(),
          unsubscribe: () => {},
        };
        this.stickyContainer.componentWillMount();
      });

      it('should expose a Channel', () => {
        expect(this.childContext['sticky-channel']).to.not.be.null;
      });

      it('should publish any inherited offsets via its Channel', (done) => {
        const parentChannel = new Channel({ inherited: 0 });
        this.stickyContainer.context['sticky-channel'] = parentChannel;
        this.stickyContainer.componentWillMount();

        const childChannel = this.childContext['sticky-channel'];
        childChannel.subscribe(({ inherited }) => {
          expect(inherited).to.equal(999);
          done();
        });

        parentChannel.update((data) => { data.offset = 999 });
      });

      it('should publish its DOMNode via its Channel', (done) => {
        const childChannel = this.childContext['sticky-channel'];
        childChannel.subscribe(({ node }) => {
          expect(node).to.be.an.instanceof(window.HTMLDivElement);
          done();
        });

        this.stickyContainer.componentDidMount();
      });
    });
  });
  
  describe('props', () => {
    describe('zIndex', () => {
      it(`should specify style.z-index of ${DEFAULT_INITIAL_ZINDEX} if not set and no ancestor container`, () => {
        expect(ReactDOM.findDOMNode(this.stickyContainer).style['z-index']).to.equal(`${DEFAULT_INITIAL_ZINDEX}`);
      })

      it('should disable auto z-indexing when 0', () => {
        const container = mount(<StickyContainer zIndex={0}/>);
        expect(ReactDOM.findDOMNode(container).style['z-index']).to.equal('');
        unmount(container);
      });

      it('should specify style.z-index of container', () => {
        const container = mount(<StickyContainer zIndex={10}/>);
        expect(ReactDOM.findDOMNode(container).style['z-index']).to.equal('10');
        unmount(container);
      });

      it('should auto set child container style.z-index as container zIndex - 2', () => {
        let childContainer;
        const container = mount(
          <StickyContainer zIndex={10}>
            <StickyContainer ref={comp => childContainer = comp}/>
          </StickyContainer>
        );
        expect(ReactDOM.findDOMNode(childContainer).style['z-index']).to.equal('8');
        unmount(container);
      });

      it('should override using z-index of parent container', () => {
        let childContainer;
        const container = mount(
          <StickyContainer zIndex={10}>
            <StickyContainer zIndex={100} ref={comp => childContainer = comp}/>
          </StickyContainer>
        );
        expect(ReactDOM.findDOMNode(childContainer).style['z-index']).to.equal('100');
        unmount(container);
      });

      it('should have lower precedence than explicitly set style.z-index', () => {
        const container = mount(<StickyContainer zIndex={10} style={{zIndex: 100}}/>);
        expect(ReactDOM.findDOMNode(container).style['z-index']).to.equal('100');
        unmount(container);
      });
    });
  });
});
