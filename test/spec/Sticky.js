import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { StickyContainer, Sticky } from '../../src';

const attachTo = document.getElementById('mount');

describe("Sticky", () => {

  describe('lifecycle', () => {

    let container;
    beforeEach(() => {
      container = mount(
        <StickyContainer>
          <Sticky>
            { () => <div /> }
          </Sticky>
        </StickyContainer>, { attachTo });
    });

    it('should register as subscriber of parent on mount', () => {
      expect(container.node.subscribers).to.contain(container.children().node.handleContainerEvent)
    });

    it('should unregister as subscriber of parent on unmount', () => {
      expect(container.node.subscribers).to.contain(container.children().node.handleContainerEvent);
      mount(<StickyContainer />, { attachTo });
      expect(container.node.subscribers).to.be.empty;
    });

  });

});
