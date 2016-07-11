// setup.js should be required/imported at the very top over every test suit file.
// technically only required for tests importing React, but making a habit to
// import at top of every file not a bad thing, and there may come to be other 'things'
// that need to run before any tests to setup the environment, that aren't specific to React

import { jsdom } from 'jsdom';

// Initialize jsdom and set global document, window, and navigator.
// globals must be set BEFORE THE FIRST require('react'), or in some cases React can throw:
//   "
//      Invariant Violation: dangerouslyReplaceNodeWithMarkup(...): Cannot render markup in a
//      worker thread. Make sure `window` and `document` are available globally before requiring
//      React when unit testing or use ReactDOMServer.renderToString() for server rendering.
//   "
//
// This was resolved by finding similar issue and solutions at:
//     https://github.com/airbnb/enzyme/issues/58
// and https://github.com/tmpvar/jsdom/issues/1352
global.document = jsdom('<body></body>');
global.window = document.defaultView;
global.navigator = window.navigator;

