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
  .forEach(function(type) {
    if (window.addEventListener) {
      window.addEventListener(type, handleEvent);
    } else {
      window.attachEvent('on' + type, handleEvent);
    }
  });


// Start the loop
raf(function tick() {
  if (state.hasUnhandledEvent || state.hasTouchEvent) {
    console.log('emitter')
    signal.emit();
    state.hasUnhandledEvent = false;
  }
  raf(tick);
});


/*
 * Lightweight event listener for window events.
 *
 * See http://www.html5rocks.com/en/tutorials/speed/animations/
 */
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
