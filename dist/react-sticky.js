(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom"], factory);
	else if(typeof exports === 'object')
		exports["ReactSticky"] = factory(require("react"), require("react-dom"));
	else
		root["ReactSticky"] = factory(root["React"], root["ReactDOM"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_9__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.StickyContainer = exports.Sticky = undefined;

	var _sticky = __webpack_require__(1);

	var _sticky2 = _interopRequireDefault(_sticky);

	var _container = __webpack_require__(3);

	var _container2 = _interopRequireDefault(_container);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.Sticky = _sticky2.default;
	exports.StickyContainer = _container2.default;
	exports.default = _sticky2.default;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(9);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _watcher = __webpack_require__(4);

	var _watcher2 = _interopRequireDefault(_watcher);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Sticky = function (_React$Component) {
	  _inherits(Sticky, _React$Component);

	  function Sticky(props) {
	    _classCallCheck(this, Sticky);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Sticky).call(this, props));

	    _this.onScroll = function (e) {
	      var pageY = window.pageYOffset;
	      var isSticky = pageY + _this.context.offset - _this.props.topOffset >= _this.state.origin && _this.context.offset + _this.props.bottomOffset < _this.state.origin + _this.context.rect.bottom;

	      _this.setState({ pageY: pageY, isSticky: isSticky });
	      _this.context.container.updateTopCorrection(isSticky ? _this.state.height : 0);

	      if (_this.state.isSticky !== isSticky) _this.props.onStickyStateChange(isSticky);
	    };

	    _this.onResize = function () {
	      var height = _reactDom2.default.findDOMNode(_this).getBoundingClientRect().height;
	      var origin = _this.refs.static.getBoundingClientRect().top + window.pageYOffset;
	      _this.setState({ height: height, origin: origin });
	    };

	    _this.state = {
	      isSticky: false
	    };
	    return _this;
	  }

	  _createClass(Sticky, [{
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var height = _reactDom2.default.findDOMNode(this).getBoundingClientRect().height;
	      var pageY = window.pageYOffset;
	      var origin = this.refs.static.getBoundingClientRect().top + pageY;
	      this.setState({ pageY: pageY, height: height, origin: origin });

	      Sticky.resizeWatcher.on(this.onResize);
	      Sticky.scrollWatcher.on(this.onScroll);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      Sticky.resizeWatcher.off(this.onResize);
	      Sticky.scrollWatcher.off(this.onScroll);
	    }
	  }, {
	    key: 'render',


	    /*
	     * The special sauce.
	     */
	    value: function render() {
	      var isSticky = this.state.isSticky;

	      var className = this.props.className + ' ' + (isSticky ? this.props.stickyClass : '');

	      var style = this.props.style;
	      if (isSticky) {
	        var stickyStyle = {
	          position: 'fixed',
	          top: this.context.offset,
	          left: this.refs.static.getBoundingClientRect().left,
	          width: this.refs.static.getBoundingClientRect().width
	        };

	        var bottomLimit = (this.context.rect.bottom || 0) - this.state.height - this.props.bottomOffset;
	        if (this.context.offset > bottomLimit) {
	          stickyStyle.top = bottomLimit;
	        }

	        style = _extends({}, this.props.style, stickyStyle, this.props.stickyStyle);
	      }

	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement('div', { ref: 'static', style: { paddingBottom: isSticky ? this.state.height : 0 } }),
	        _react2.default.createElement(
	          'div',
	          { ref: 'fixed', className: className, style: style },
	          this.props.children
	        )
	      );
	    }
	  }]);

	  return Sticky;
	}(_react2.default.Component);

	Sticky.contextTypes = {
	  container: _react2.default.PropTypes.any,
	  offset: _react2.default.PropTypes.number,
	  rect: _react2.default.PropTypes.object
	};
	Sticky.defaultProps = {
	  className: '',
	  style: {},
	  stickyClass: 'sticky',
	  stickyStyle: {},
	  topOffset: 0,
	  bottomOffset: 0,
	  onStickyStateChange: function onStickyStateChange() {}
	};
	Sticky.scrollWatcher = new _watcher2.default(['scroll', 'touchstart', 'touchend']);
	Sticky.resizeWatcher = new _watcher2.default(['resize']);
	exports.default = Sticky;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _sticky = __webpack_require__(1);

	var _sticky2 = _interopRequireDefault(_sticky);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Container = function (_React$Component) {
	  _inherits(Container, _React$Component);

	  function Container(props) {
	    _classCallCheck(this, Container);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Container).call(this, props));

	    _this.state = {
	      topCorrection: 0,
	      rect: {}
	    };
	    return _this;
	  }

	  _createClass(Container, [{
	    key: 'getChildContext',
	    value: function getChildContext() {
	      var container = this;
	      var topCorrection = (this.context.topCorrection || 0) + this.state.topCorrection;
	      var offset = topCorrection - this.state.topCorrection;
	      var rect = this.state.node ? this.state.node.getBoundingClientRect() : {};
	      return { container: container, topCorrection: topCorrection, offset: offset, rect: rect };
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var node = ReactDOM.findDOMNode(this);
	      this.setState({ node: node });
	    }
	  }, {
	    key: 'updateTopCorrection',
	    value: function updateTopCorrection(topCorrection) {
	      this.setState({ topCorrection: topCorrection });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        _extends({ refs: 'container' }, this.props),
	        this.props.children
	      );
	    }
	  }]);

	  return Container;
	}(_react2.default.Component);

	Container.contextTypes = {
	  container: _react2.default.PropTypes.any,
	  topCorrection: _react2.default.PropTypes.number
	};
	Container.childContextTypes = {
	  container: _react2.default.PropTypes.any,
	  topCorrection: _react2.default.PropTypes.number,
	  offset: _react2.default.PropTypes.number,
	  rect: _react2.default.PropTypes.any
	};
	exports.default = Container;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Watcher;

	var _raf = __webpack_require__(7);

	var _raf2 = _interopRequireDefault(_raf);

	var _simpleSignal = __webpack_require__(8);

	var _simpleSignal2 = _interopRequireDefault(_simpleSignal);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Watcher(events) {
	  var signal = new _simpleSignal2.default();

	  var handleEvent = function handleEvent(e) {
	    return (0, _raf2.default)(function () {
	      return signal.emit(e);
	    });
	  };

	  /**
	    * Wire up event listeners if in a browser-type environment
	    */
	  if (typeof window !== "undefined") {
	    events.forEach(function (evt) {
	      if (window.addEventListener) {
	        window.addEventListener(evt, handleEvent);
	      } else {
	        window.attachEvent('on' + evt, handleEvent);
	      }
	    });
	  }

	  return signal;
	}
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Generated by CoffeeScript 1.7.1
	(function() {
	  var getNanoSeconds, hrtime, loadTime;

	  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
	    module.exports = function() {
	      return performance.now();
	    };
	  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
	    module.exports = function() {
	      return (getNanoSeconds() - loadTime) / 1e6;
	    };
	    hrtime = process.hrtime;
	    getNanoSeconds = function() {
	      var hr;
	      hr = hrtime();
	      return hr[0] * 1e9 + hr[1];
	    };
	    loadTime = getNanoSeconds();
	  } else if (Date.now) {
	    module.exports = function() {
	      return Date.now() - loadTime;
	    };
	    loadTime = Date.now();
	  } else {
	    module.exports = function() {
	      return new Date().getTime() - loadTime;
	    };
	    loadTime = new Date().getTime();
	  }

	}).call(this);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(6)))

/***/ },
/* 6 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var now = __webpack_require__(5)
	  , root = typeof window === 'undefined' ? global : window
	  , vendors = ['moz', 'webkit']
	  , suffix = 'AnimationFrame'
	  , raf = root['request' + suffix]
	  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

	for(var i = 0; !raf && i < vendors.length; i++) {
	  raf = root[vendors[i] + 'Request' + suffix]
	  caf = root[vendors[i] + 'Cancel' + suffix]
	      || root[vendors[i] + 'CancelRequest' + suffix]
	}

	// Some versions of FF have rAF but not cAF
	if(!raf || !caf) {
	  var last = 0
	    , id = 0
	    , queue = []
	    , frameDuration = 1000 / 60

	  raf = function(callback) {
	    if(queue.length === 0) {
	      var _now = now()
	        , next = Math.max(0, frameDuration - (_now - last))
	      last = next + _now
	      setTimeout(function() {
	        var cp = queue.slice(0)
	        // Clear queue here to prevent
	        // callbacks from appending listeners
	        // to the current frame's queue
	        queue.length = 0
	        for(var i = 0; i < cp.length; i++) {
	          if(!cp[i].cancelled) {
	            try{
	              cp[i].callback(last)
	            } catch(e) {
	              setTimeout(function() { throw e }, 0)
	            }
	          }
	        }
	      }, Math.round(next))
	    }
	    queue.push({
	      handle: ++id,
	      callback: callback,
	      cancelled: false
	    })
	    return id
	  }

	  caf = function(handle) {
	    for(var i = 0; i < queue.length; i++) {
	      if(queue[i].handle === handle) {
	        queue[i].cancelled = true
	      }
	    }
	  }
	}

	module.exports = function(fn) {
	  // Wrap in a new function to prevent
	  // `cancel` potentially being assigned
	  // to the native rAF function
	  return raf.call(root, fn)
	}
	module.exports.cancel = function() {
	  caf.apply(root, arguments)
	}
	module.exports.polyfill = function() {
	  root.requestAnimationFrame = raf
	  root.cancelAnimationFrame = caf
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";

	exports.__esModule = true;
	exports["default"] = Signal;

	function Signal() {
	  var subscribers = [];
	  return {
	    on: function on(fn) {
	      subscribers.push(fn);
	    },
	    off: function off(fn) {
	      var index = subscribers.indexOf(fn);
	      if (index > -1) {
	        subscribers.splice(index, 1);
	      }
	    },
	    emit: function emit(val) {
	      for (var i = 0, len = subscribers.length; i < len; ++i) {
	        subscribers[i](val);
	      }
	    }
	  };
	}

	module.exports = exports["default"];

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_9__;

/***/ }
/******/ ])
});
;