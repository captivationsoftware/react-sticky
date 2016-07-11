import '../setup'

import { expect } from 'chai';

const { Channel } = require('../../src');

describe('Channel', function() {
  it('permits subscription', (done) => {
    const subject = new Channel();

    subject.subscribe((data) => { done() });

    subject.update();
  });

  it('permits multiple subscribers', (done) => {
    const subject = new Channel();

    let count = 0;
    subject.subscribe((data) => { if ((count += 1) == 5) done() });
    subject.subscribe((data) => { if ((count += 1) == 5) done() });
    subject.subscribe((data) => { if ((count += 1) == 5) done() });
    subject.subscribe((data) => { if ((count += 1) == 5) done() });
    subject.subscribe((data) => { if ((count += 1) == 5) done() });

    subject.update();
  });

  it('permits unsubscription', () => {
    const subject = new Channel();
    const subscriber = () => expect(true).to.be.false;

    subject.subscribe(subscriber);
    subject.unsubscribe(subscriber);

    subject.update();
  });

  it('does not remove legitimate subscribers on unsubscription', (done) => {
    const subject = new Channel();
    const subscriber = () => expect(true).to.be.false;

    let count = 0;
    subject.subscribe((data) => { if ((count += 1) == 5) done() });
    subject.subscribe((data) => { if ((count += 1) == 5) done() });
    subject.subscribe(subscriber);
    subject.subscribe((data) => { if ((count += 1) == 5) done() });
    subject.subscribe((data) => { if ((count += 1) == 5) done() });
    subject.subscribe((data) => { if ((count += 1) == 5) done() });

    subject.unsubscribe(subscriber);

    subject.update();
  });

  it('takes a default data argument', (done) => {
    const subject = new Channel({ x: 1 });

    subject.subscribe((data) => {
      expect(data.x).to.equal(1);
      done();
    });

    subject.update();
  });

  it('permits data updates', (done) => {
    const subject = new Channel({ x: 1 });

    subject.subscribe((data) => {
      expect(data.x).to.equal(2);
      expect(data.y).to.equal(3);
      done();
    });

    subject.update((data) => { data.x = 2; data.y = 3 });
  });
});
