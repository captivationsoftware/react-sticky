import raf from 'raf';
import Signal from 'simple-signal';

const signal = new Signal();

const handleEvent = () => raf(signal.emit);

/**
  * Wire up event listeners
  */
['scroll', 'resize', 'touchmove', 'touchend']
  .forEach(function(evt) {
    if (window.addEventListener) {
      window.addEventListener(evt, handleEvent);
    } else {
      window.attachEvent('on' + evt, handleEvent);
    }
  });

export default signal;
