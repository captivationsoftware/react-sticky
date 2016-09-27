(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom"], factory);
	else if(typeof exports === 'object')
		exports["ReactSticky"] = factory(require("react"), require("react-dom"));
	else
		root["ReactSticky"] = factory(root["React"], root["ReactDOM"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
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
	exports.Channel = exports.StickyContainer = exports.Sticky = undefined;

	var _sticky = __webpack_require__(5);

	var _sticky2 = _interopRequireDefault(_sticky);

	var _container = __webpack_require__(4);

	var _container2 = _interopRequireDefault(_container);

	var _channel = __webpack_require__(1);

	var _channel2 = _interopRequireDefault(_channel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.Sticky = _sticky2.default;
	exports.StickyContainer = _container2.default;
	exports.Channel = _channel2.default;
	exports.default = _sticky2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Channel = function Channel(data) {
	  _classCallCheck(this, Channel);

	  var listeners = [];
	  data = data || {};

	  this.subscribe = function (fn) {
	    listeners.push(fn);
	  };

	  this.unsubscribe = function (fn) {
	    var idx = listeners.indexOf(fn);
	    if (idx !== -1) listeners.splice(idx, 1);
	  };

	  this.update = function (fn) {
	    if (fn) fn(data);
	    listeners.forEach(function (l) {
	      return l(data);
	    });
	  };
	};

	exports.default = Channel;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(3);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	var _channel = __webpack_require__(1);

	var _channel2 = _interopRequireDefault(_channel);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Container = function (_React$Component) {
	  _inherits(Container, _React$Component);

	  function Container(props) {
	    _classCallCheck(this, Container);

	    var _this = _possibleConstructorReturn(this, (Container.__proto__ || Object.getPrototypeOf(Container)).call(this, props));

	    _this.updateOffset = function (_ref) {
	      var inherited = _ref.inherited;
	      var offset = _ref.offset;

	      _this.channel.update(function (data) {
	        data.inherited = inherited + offset;
	      });
	    };

	    _this.channel = new _channel2.default({ inherited: 0, offset: 0, node: null });
	    _this.rect = {};
	    return _this;
	  }

	  _createClass(Container, [{
	    key: 'getChildContext',
	    value: function getChildContext() {
	      return { 'sticky-channel': this.channel };
	    }
	  }, {
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      var parentChannel = this.context['sticky-channel'];
	      if (parentChannel) parentChannel.subscribe(this.updateOffset);
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var node = _reactDom2.default.findDOMNode(this);
	      this.channel.update(function (data) {
	        data.node = node;
	      });
	      this.rect = node.getBoundingClientRect();
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this.channel.update(function (data) {
	        data.node = null;
	      });

	      var parentChannel = this.context['sticky-channel'];
	      if (parentChannel) parentChannel.unsubscribe(this.updateOffset);
	    }
	  }, {
	    key: 'componentDidUpdate',
	    value: function componentDidUpdate() {
	      var _this2 = this;

	      var node = _reactDom2.default.findDOMNode(this);
	      var nextRect = node.getBoundingClientRect();
	      // Have we changed any prop values?
	      // Somehow Object.keys(this.rect) returns [] O_O
	      var valuesMatch = ['top', 'bottom', 'left', 'right'].every(function (key) {
	        return nextRect.hasOwnProperty(key) && nextRect[key] === _this2.rect[key];
	      });
	      return !valuesMatch && this.channel.update(function (data) {
	        data.node = node;
	      });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      return _react2.default.createElement(
	        'div',
	        this.props,
	        this.props.children
	      );
	    }
	  }]);

	  return Container;
	}(_react2.default.Component);

	Container.contextTypes = {
	  'sticky-channel': _react2.default.PropTypes.any
	};
	Container.childContextTypes = {
	  'sticky-channel': _react2.default.PropTypes.any
	};
	exports.default = Container;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(2);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(3);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

	function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Sticky = function (_React$Component) {
	  _inherits(Sticky, _React$Component);

	  function Sticky(props) {
	    _classCallCheck(this, Sticky);

	    var _this = _possibleConstructorReturn(this, (Sticky.__proto__ || Object.getPrototypeOf(Sticky)).call(this, props));

	    _initialiseProps.call(_this);

	    _this.state = {};
	    return _this;
	  }

	  _createClass(Sticky, [{
	    key: 'componentWillMount',
	    value: function componentWillMount() {
	      this.channel = this.context['sticky-channel'];
	      this.channel.subscribe(this.updateContext);
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      var _this2 = this;

	      this.on(['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'], function () {
	        return _this2.recomputeState();
	      });
	      this.recomputeState();
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps(nextProps) {
	      this.recomputeState(nextProps);
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      var _this3 = this;

	      this.off(['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'], function () {
	        return _this3.recomputeState();
	      });
	      this.channel.unsubscribe(this.updateContext);
	    }
	  }, {
	    key: 'getXOffset',
	    value: function getXOffset() {
	      return this.refs.placeholder.getBoundingClientRect().left;
	    }
	  }, {
	    key: 'getWidth',
	    value: function getWidth() {
	      return this.refs.placeholder.getBoundingClientRect().width;
	    }
	  }, {
	    key: 'getHeight',
	    value: function getHeight() {
	      return _reactDom2.default.findDOMNode(this.refs.children).getBoundingClientRect().height;
	    }
	  }, {
	    key: 'getPlaceholderRect',
	    value: function getPlaceholderRect() {
	      return this.refs.placeholder.getBoundingClientRect();
	    }
	  }, {
	    key: 'getContainerRect',
	    value: function getContainerRect() {
	      return this.containerNode ? this.containerNode.getBoundingClientRect() : {
	        top: 0,
	        bottom: 0
	      };
	    }
	  }, {
	    key: 'isStickyBottom',
	    value: function isStickyBottom(props, state) {
	      var bottomOffset = props.bottomOffset;
	      var containerOffset = state.containerOffset;
	      var height = state.height;
	      var placeholderTop = state.placeholderTop;
	      var winHeight = state.winHeight;


	      var bottomBreakpoint = containerOffset - bottomOffset;
	      var placeholderBottom = placeholderTop + height;

	      return placeholderBottom >= winHeight - bottomBreakpoint;
	    }
	  }, {
	    key: 'isStickyTop',
	    value: function isStickyTop(props, state) {
	      var distancesFromPlaceholder = state.placeholderTop; // this.getPlaceholderRect().top;

	      var topBreakpoint = state.containerOffset - props.topOffset;
	      var bottomBreakpoint = state.containerOffset + props.bottomOffset;

	      return distancesFromPlaceholder <= topBreakpoint && state.containerBottom >= bottomBreakpoint;
	    }
	  }, {
	    key: 'isSticky',
	    value: function isSticky(props, state) {
	      if (!props.isActive) {
	        return false;
	      }

	      return props.position === 'top' ? this.isStickyTop(props, state) : this.isStickyBottom(props, state);
	    }
	  }, {
	    key: 'on',
	    value: function on(events, callback) {
	      events.forEach(function (evt) {
	        window.addEventListener(evt, callback);
	      });
	    }
	  }, {
	    key: 'off',
	    value: function off(events, callback) {
	      events.forEach(function (evt) {
	        window.removeEventListener(evt, callback);
	      });
	    }
	  }, {
	    key: 'shouldComponentUpdate',
	    value: function shouldComponentUpdate(newProps, newState) {
	      var _this4 = this;

	      // Have we changed the number of props?
	      var propNames = Object.keys(this.props);
	      if (Object.keys(newProps).length != propNames.length) return true;

	      // Have we changed any prop values?
	      var valuesMatch = propNames.every(function (key) {
	        return newProps.hasOwnProperty(key) && newProps[key] === _this4.props[key];
	      });
	      if (!valuesMatch) return true;

	      // Have we changed any state that will always impact rendering?
	      var state = this.state;
	      if (newState.isSticky !== state.isSticky) return true;

	      // If we are sticky, have we changed any state that will impact rendering?
	      if (state.isSticky) {
	        if (newState.height !== state.height) return true;
	        if (newState.width !== state.width) return true;
	        if (newState.xOffset !== state.xOffset) return true;
	        if (newState.placeholderTop !== state.placeholderTop) return true;
	      }

	      if (newState.containerOffset !== state.containerOffset) return true;
	      if (newState.containerBottom !== state.containerBottom) return true;
	      if (newState.containerTop !== state.containerTop) return true;

	      return false;
	    }
	  }, {
	    key: 'getPositionOffset',
	    value: function getPositionOffset() {
	      var _state = this.state;
	      var containerOffset = _state.containerOffset;
	      var containerTop = _state.containerTop;
	      var containerBottom = _state.containerBottom;
	      var height = _state.height;
	      var _props = this.props;
	      var bottomOffset = _props.bottomOffset;
	      var position = _props.position;
	      var topOffset = _props.topOffset;


	      var bottomLimit = containerBottom - height - bottomOffset;
	      var topLimit = window.innerHeight - containerTop - topOffset;

	      return position === 'top' ? Math.min(containerOffset, bottomLimit) : Math.min(containerOffset, topLimit);
	    }

	    /*
	     * The special sauce.
	     */

	  }, {
	    key: 'render',
	    value: function render() {
	      var _extends2;

	      var _props2 = this.props;
	      var propsClassName = _props2.className;
	      var position = _props2.position;
	      var stickyClassName = _props2.stickyClassName;
	      var stickyStyle = _props2.stickyStyle;
	      var style = _props2.style;

	      var props = _objectWithoutProperties(_props2, ['className', 'position', 'stickyClassName', 'stickyStyle', 'style']);

	      var _state2 = this.state;
	      var isSticky = _state2.isSticky;
	      var height = _state2.height;
	      var width = _state2.width;
	      var xOffset = _state2.xOffset;


	      var placeholderStyle = { paddingBottom: isSticky ? height : 0 };
	      var className = propsClassName + ' ' + (isSticky ? stickyClassName : '');
	      var finalStickyStyle = isSticky && _extends((_extends2 = {
	        position: 'fixed'
	      }, _defineProperty(_extends2, position, this.getPositionOffset()), _defineProperty(_extends2, 'left', xOffset), _defineProperty(_extends2, 'width', width), _extends2), stickyStyle);

	      // To ensure that this component becomes sticky immediately on mobile devices instead
	      // of disappearing until the scroll event completes, we add `transform: translateZ(0)`
	      // to 'kick' rendering of this element to the GPU
	      // @see http://stackoverflow.com/questions/32875046
	      var finalStyle = _extends({
	        transform: 'translateZ(0)'
	      }, style, finalStickyStyle || {});

	      return _react2.default.createElement(
	        'div',
	        null,
	        _react2.default.createElement('div', { ref: 'placeholder', style: placeholderStyle }),
	        _react2.default.createElement(
	          'div',
	          _extends({}, props, { ref: 'children', className: className, style: finalStyle }),
	          this.props.children
	        )
	      );
	    }
	  }]);

	  return Sticky;
	}(_react2.default.Component);

	Sticky.propTypes = {
	  isActive: _react2.default.PropTypes.bool,
	  className: _react2.default.PropTypes.string,
	  position: _react2.default.PropTypes.oneOf(['top', 'bottom']),
	  style: _react2.default.PropTypes.object,
	  stickyClassName: _react2.default.PropTypes.string,
	  stickyStyle: _react2.default.PropTypes.object,
	  topOffset: _react2.default.PropTypes.number,
	  bottomOffset: _react2.default.PropTypes.number,
	  onStickyStateChange: _react2.default.PropTypes.func
	};
	Sticky.defaultProps = {
	  isActive: true,
	  className: '',
	  position: 'top',
	  style: {},
	  stickyClassName: 'sticky',
	  stickyStyle: {},
	  topOffset: 0,
	  bottomOffset: 0,
	  onStickyStateChange: function onStickyStateChange() {}
	};
	Sticky.contextTypes = {
	  'sticky-channel': _react2.default.PropTypes.any
	};

	var _initialiseProps = function _initialiseProps() {
	  var _this5 = this;

	  this.updateContext = function (_ref) {
	    var inherited = _ref.inherited;
	    var node = _ref.node;

	    _this5.containerNode = node;
	    _this5.recomputeState(_this5.props, inherited);
	    /*this.setState({
	      containerOffset: inherited,
	      containerBottom: this.getContainerRect().bottom,
	      containerTop: this.getContainerRect().top,
	      placeholderTop: this.getPlaceholderRect().top,
	    });*/
	  };

	  this.recomputeState = function () {
	    var props = arguments.length <= 0 || arguments[0] === undefined ? _this5.props : arguments[0];
	    var inherited = arguments.length <= 1 || arguments[1] === undefined ? false : arguments[1];

	    var nextState = _extends({}, _this5.state, {
	      height: _this5.getHeight(),
	      width: _this5.getWidth(),
	      xOffset: _this5.getXOffset(),
	      containerOffset: inherited === false ? _this5.state.containerOffset : inherited,
	      containerBottom: _this5.getContainerRect().bottom,
	      containerTop: _this5.getContainerRect().top,
	      placeholderTop: _this5.getPlaceholderRect().top,
	      winHeight: window.innerHeight
	    });

	    var isSticky = _this5.isSticky(props, nextState);
	    var finalNextState = _extends({}, nextState, { isSticky: isSticky });
	    var hasChanged = _this5.state.isSticky !== isSticky;

	    _this5.setState(finalNextState, function () {
	      if (hasChanged) {
	        if (_this5.channel) {
	          _this5.channel.update(function (data) {
	            data.offset = isSticky ? _this5.state.height : 0;
	          });
	        }

	        _this5.props.onStickyStateChange(isSticky);
	      }
	    });
	  };
	};

	exports.default = Sticky;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;