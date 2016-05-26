export default class Channel {
  constructor(data) {
    const listeners = [];
    data = data || {};

    this.subscribe = (fn) => {
      listeners.push(fn)
    };

    this.unsubscribe = (fn) => {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };

    this.update = (fn) => {
      if (fn) fn(data);
      listeners.forEach((l) => l(data));
    }
  }
}
