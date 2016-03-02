import raf from 'raf';
import Signal from 'simple-signal';

export default function Watcher(events) {
  const signal = new Signal();

  const handleEvent = () => raf(signal.emit);

  /**
    * Wire up event listeners
    */
  events
    .forEach(function(evt) {
      if (window.addEventListener) {
        window.addEventListener(evt, handleEvent);
      } else {
        window.attachEvent('on' + evt, handleEvent);
      }
    });

  return signal;
}
