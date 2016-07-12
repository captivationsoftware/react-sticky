export default class Channel {
  constructor(data) {
    const listeners = [];
    data = data || {};
    let wasUpdated = false;

    this.subscribe = (fn) => {
      listeners.push(fn)
      if (wasUpdated) fn(data)
    };

    this.unsubscribe = (fn) => {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };

    this.update = (fn) => {
      wasUpdated = true
      if (fn) fn(data);
      listeners.forEach((l) => l(data));
    }
  }
}
