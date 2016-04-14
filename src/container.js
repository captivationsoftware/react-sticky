import React from 'react';

export default class Container extends React.Component {

  static contextTypes = {
    container: React.PropTypes.any,
    totalOffset: React.PropTypes.number
  }

  static childContextTypes = {
    container: React.PropTypes.any,
    totalOffset: React.PropTypes.number,
    offset: React.PropTypes.number,
    rect: React.PropTypes.any
  }

  constructor(props) {
    super(props);
    this.state = {
      offset: 0,
      rect: {}
    };
  }

  getChildContext() {
    const container = this;
    const totalOffset = (this.context.totalOffset || 0) + this.state.offset;
    const offset = totalOffset - this.state.offset;
    const rect = this.state.node ? this.state.node.getBoundingClientRect() : {};
    return { container, totalOffset, offset, rect };
  }

  componentDidMount() {
    this.setState({ node: this._node });
  }

  updateOffset(offset) {
    this.setState({ offset });
  }

  render() {
    return <div ref={ node => this._node = node } {...this.props}>
      {this.props.children}
    </div>
  }
}
