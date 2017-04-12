import '../setup'

import { expect } from 'chai';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { mount, unmount } from '../utils';

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
  });
});
