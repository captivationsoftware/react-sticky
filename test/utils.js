import ReactDOM from 'react-dom';

export function mount(Component, element) {
  let container = element || null;
  if (!container) {
    container = document.createElement('div');
    document.body.appendChild(container);
  }
  return ReactDOM.render(Component, container);
}

export function unmount(sticky) {
  ReactDOM.unmountComponentAtNode(ReactDOM.findDOMNode(sticky).parentNode);
}

export function emitEvent(type, window) {
  let evt = document.createEvent('Event');
  evt.initEvent(type, true, true);
  window.dispatchEvent(evt);
}
