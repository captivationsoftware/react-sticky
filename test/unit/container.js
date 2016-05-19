import { expect } from 'chai';
import { jsdom } from 'jsdom';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import { mount, unmount } from '../utils';

// Initialize jsdom
global.document = jsdom('<body></body>');
global.window = document.defaultView;

const { Sticky, StickyContainer } = require('../../src');

describe('StickyContainer component', function() {
  beforeEach(() => {
    this.stickyContainer = mount(<StickyContainer></StickyContainer>);
  });

  afterEach(() => {
    unmount(this.stickyContainer);
  });

  it ('should allow external modification of its offset', () => {
    expect(this.stickyContainer.state.offset).to.equal(0);
    this.stickyContainer.getChildContext = () => {
      return {
        rect: { bottom: 1000 },
        offset: 0
      }
    }
    this.stickyContainer.updateOffset(100);
    expect(this.stickyContainer.state.offset).to.equal(100);
  });

  it ('should expose the correct child context', () => {
    const offset = 100;
    const node = { getBoundingClientRect: () => { return {top:123}; } };
    this.stickyContainer.setState({ offset, node });
    this.stickyContainer.context.totalOffset = 150;

    const childContext = this.stickyContainer.getChildContext();
    expect(childContext.totalOffset).to.equal(250);
    expect(childContext.offset).to.equal(150);
    expect(childContext.rect.top).to.equal(123);
  });
});
