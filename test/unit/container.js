import '../setup'

import { expect } from 'chai';
import React from 'react';
import { mount, unmount } from '../utils';

const { StickyContainer, Channel } = require('../../src');

describe('StickyContainer component', function() {
  beforeEach(() => {
    this.stickyContainer = mount(<StickyContainer></StickyContainer>);
  });

  afterEach(() => {
    unmount(this.stickyContainer);
  });

  describe('context', () => {
    beforeEach(() => {
      this.childContext = this.stickyContainer.getChildContext()['sticky-channel']['sticky'];
    });

    afterEach(() => {
      // Avoid calling the unmounting update.
      this.childContext.update = () => {};
    });

    it('should expose a Channel', () => {
      expect(this.childContext).to.not.be.null;
    });

    it('should publish its DOMNode via its Channel', (done) => {
      const childChannel = this.childContext;
      childChannel.subscribe(({ node }) => {
        expect(node).to.be.an.instanceof(window.HTMLDivElement);
        done();
      });

      this.stickyContainer.componentDidMount();
    });

    it('should publish any inherited offsets via its Channel', (done) => {
      const parentChannel = { sticky: new Channel({ inherited: 0 }) };
      this.stickyContainer.context['sticky-channel'] = parentChannel;
      this.stickyContainer.componentWillMount();

      const childChannel = this.childContext;
      childChannel.subscribe(({ inherited }) => {
        expect(inherited).to.equal(999);
        done();
      });

      parentChannel.sticky.update((data) => { data.offset = 999 });
    });
  });
});
