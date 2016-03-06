import raf from 'raf';
import Signal from 'simple-signal';

export default function Watcher(events) {
  const signal = new Signal();

  const handleEvent = (e) => raf(() => signal.emit(e));

  /**
    * Wire up event listeners if in a browser-type environment
    */
  if (typeof window !== "undefined") {
    events
      .forEach(function(evt) {
        if (window.addEventListener) {
          window.addEventListener(evt, handleEvent);
        } else {
          window.attachEvent('on' + evt, handleEvent);
        }
      });
  }

  return signal;
}
