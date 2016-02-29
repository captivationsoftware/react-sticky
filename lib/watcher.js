import raf from 'raf';
import Signal from 'simple-signal';

const state = {
  hasUnhandledEvent: false,
  hasTouchEvent: false
};

const signal = new Signal();

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


// Start the loop
raf(function tick() {
  if (state.hasUnhandledEvent || state.hasTouchEvent) {
    signal.emit();
    state.hasUnhandledEvent = false;
  }
  raf(tick);
});

function handleEvent(event) {
  switch (event.type) {
    case 'touchmove':
      state.hasTouchEvent = true;
      break;
    case 'touchend':
      state.hasTouchEvent = false;
      break;
    default:
      state.hasUnhandledEvent = true;
  }
}

export default signal;
