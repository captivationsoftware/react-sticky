require('babel-register')();
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

enzyme.configure({ adapter: new Adapter() });

const jsdom = require('jsdom').jsdom;

const exposedProperties = ['window', 'navigator', 'document'];

global.document = jsdom('');
global.window = document.defaultView;
Object.keys(document.defaultView).forEach(property => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

global.requestAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};

global.cancelAnimationFrame = function(callback) {
  setTimeout(callback, 0);
};

global.navigator = {
  userAgent: 'node.js'
};

const mount = document.createElement('div');
mount.id = 'mount';
document.body.appendChild(mount);
