import { expect } from 'chai';
import { jsdom } from 'jsdom';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import { mount, unmount } from '../utils';

// Initialize jsdom
global.document = jsdom('<body></body>');
global.window = document.defaultView;

const { Sticky, StickyContainer, Channel } = require('../../src');

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

    afterEach(() => {
      // Avoid calling the unmounting update.
      this.childContext['sticky-channel'].update = () => {};
    });

    it('should expose a Channel', () => {
      expect(this.childContext['sticky-channel']).to.not.be.null;
    });

    it('should subscribe to any Channel in its ancestry', (done) => {
      this.stickyContainer.context['sticky-channel'] = {
        subscribe: (fn) => done(),
        unsubscribe: () => {},
      };
      this.stickyContainer.componentWillMount();
    });

    it('should publish its DOMNode via its Channel', (done) => {
      const childChannel = this.childContext['sticky-channel'];
      childChannel.subscribe(({ node }) => {
        expect(node).to.be.an.instanceof(window.HTMLDivElement);
        done();
      });

      this.stickyContainer.componentDidMount();
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
    
    it('should allow specification of element type', (done) => {
      const mountedStickyContainer = mount(<StickyContainer tagName="a"></StickyContainer>);
      const tagName = mountedStickyContainer._reactInternalInstance._renderedComponent._currentElement.type;
      expect(tagName).to.equal("a");
      unmount(mountedStickyContainer);
      done();
    })
  });
});
