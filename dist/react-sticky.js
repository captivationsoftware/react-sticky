(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-dom"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-dom"], factory);
	else if(typeof exports === 'object')
		exports["ReactSticky"] = factory(require("react"), require("react-dom"));
	else
		root["ReactSticky"] = factory(root["React"], root["ReactDOM"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__) {
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

	var _sticky = __webpack_require__(4);

	var _sticky2 = _interopRequireDefault(_sticky);

	var _container = __webpack_require__(3);

	var _container2 = _interopRequireDefault(_container);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.Sticky = _sticky2.default;
	exports.StickyContainer = _container2.default;
	exports.default = _sticky2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

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

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

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
	      offset: 0,
	      rect: {}
	    };
	    return _this;
	  }

	  _createClass(Container, [{
	    key: 'getChildContext',
	    value: function getChildContext() {
	      var container = this;
	      var totalOffset = (this.context.totalOffset || 0) + this.state.offset;
	      var offset = totalOffset - this.state.offset;
	      var rect = this.state.node ? this.state.node.getBoundingClientRect() : {};
	      return { container: container, totalOffset: totalOffset, offset: offset, rect: rect };
	    }
	  }, {
	    key: 'componentDidMount',
	    value: function componentDidMount() {
	      this.setState({ node: this._node });
	    }
	  }, {
	    key: 'updateOffset',
	    value: function updateOffset(offset) {
	      this.setState({ offset: offset });
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      var _this2 = this;

	      return _react2.default.createElement(
	        'div',
	        _extends({ ref: function ref(node) {
	            return _this2._node = node;
	          } }, this.props),
	        this.props.children
	      );
	    }
	  }]);

	  return Container;
	}(_react2.default.Component);

	Container.contextTypes = {
	  container: _react2.default.PropTypes.any,
	  totalOffset: _react2.default.PropTypes.number
	};
	Container.childContextTypes = {
	  container: _react2.default.PropTypes.any,
	  totalOffset: _react2.default.PropTypes.number,
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

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _react = __webpack_require__(1);

	var _react2 = _interopRequireDefault(_react);

	var _reactDom = __webpack_require__(2);

	var _reactDom2 = _interopRequireDefault(_reactDom);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var Sticky = function (_React$Component) {
	  _inherits(Sticky, _React$Component);

	  function Sticky(props) {
	    _classCallCheck(this, Sticky);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Sticky).call(this, props));

	    _this.onScroll = function () {
	      var pageY = window.pageYOffset;
	      var origin = _this.getOrigin(pageY);
	      var isSticky = _this.isSticky(pageY, _this.state.origin);
	      var hasChanged = _this.state.isSticky !== isSticky;

	      _this.setState({ isSticky: isSticky, origin: origin });
	      _this.context.container.updateOffset(isSticky ? _this.state.height : 0);

	      if (hasChanged) _this.props.onStickyStateChange(isSticky);
	    };

	    _this.onResize = function () {
	      var height = _reactDom2.default.findDOMNode(_this).getBoundingClientRect().height;
	      var origin = _this.getOrigin(window.pageYOffset);
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
	      this.update();
	      this.on(['scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'], this.onScroll);
	      this.on(['resize', 'pageshow', 'load'], this.onResize);
	    }
	  }, {
	    key: 'componentWillReceiveProps',
	    value: function componentWillReceiveProps() {
	      this.update();
	    }
	  }, {
	    key: 'componentWillUnmount',
	    value: function componentWillUnmount() {
	      this.off(['scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'], this.onScroll);
	      this.off(['resize', 'pageshow', 'load'], this.onResize);
	    }
	  }, {
	    key: 'getOrigin',
	    value: function getOrigin(pageY) {
	      return this.refs.placeholder.getBoundingClientRect().top + pageY;
	    }
	  }, {
	    key: 'update',
	    value: function update() {
	      var height = _reactDom2.default.findDOMNode(this).getBoundingClientRect().height;
	      var pageY = window.pageYOffset;
	      var origin = this.getOrigin(pageY);
	      var isSticky = this.isSticky(pageY, origin);
	      this.setState({ height: height, origin: origin, isSticky: isSticky });
	    }
	  }, {
	    key: 'isSticky',
	    value: function isSticky(pageY, origin) {
	      return pageY + this.context.offset - this.props.topOffset >= origin && this.context.offset <= (this.context.rect.bottom || 0) - this.props.bottomOffset;
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

	    /*
	     * The special sauce.
	     */

	  }, {
	    key: 'render',
	    value: function render() {
	      var isSticky = this.state.isSticky;

	      var className = this.props.className;
	      if (isSticky) className += ' ' + this.props.stickyClassName;

	      var style = this.props.style;
	      if (isSticky) {
	        var placeholderRect = this.refs.placeholder.getBoundingClientRect();
	        var stickyStyle = {
	          position: 'fixed',
	          top: this.context.offset,
	          left: placeholderRect.left,
	          width: placeholderRect.width
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
	        _react2.default.createElement('div', { ref: 'placeholder', style: { paddingBottom: isSticky ? this.state.height : 0 } }),
	        _react2.default.createElement(
	          'div',
	          _extends({}, this.props, { className: className, style: style }),
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
	  stickyClassName: 'sticky',
	  stickyStyle: {},
	  topOffset: 0,
	  bottomOffset: 0,
	  onStickyStateChange: function onStickyStateChange() {}
	};
	exports.default = Sticky;
	module.exports = exports['default'];

/***/ }
/******/ ])
});
;