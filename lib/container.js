'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _channel = require('./channel');

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
      var inherited = _ref.inherited,
          offset = _ref.offset;

      _this.channel.update(function (data) {
        data.inherited = inherited + offset;
      });
    };

    _this.channel = new _channel2.default({ inherited: 0, offset: 0, node: null });
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