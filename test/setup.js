// setup.js should be required/imported at teh very top over every test suit file

import { jsdom } from 'jsdom';

// Initialize jsdom, set global document, window, and navigator.
// This must occur BEFORE THE FIRST require('react'), or in some cases React can throw:
//   "
//      Invariant Violation: dangerouslyReplaceNodeWithMarkup(...): Cannot render markup in a
//      worker thread. Make sure `window` and `document` are available globally before requiring
//      React when unit testing or use ReactDOMServer.renderToString() for server rendering.
//   "
//
// This was resolved by finding similar issue and solution at:
//     https://github.com/airbnb/enzyme/issues/58
// and https://github.com/tmpvar/jsdom/issues/1352
global.document = jsdom('<body></body>');
global.window = document.defaultView;
global.navigator = window.navigator;

