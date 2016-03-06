import React from 'react';
import Sticky from './sticky';

export default class Container extends React.Component {

  static contextTypes = {
    container: React.PropTypes.any,
    topCorrection: React.PropTypes.number
  }

  static childContextTypes = {
    container: React.PropTypes.any,
    topCorrection: React.PropTypes.number,
    offset: React.PropTypes.number,
    rect: React.PropTypes.any
  }

  constructor(props) {
    super(props);
    this.state = {
      topCorrection: 0,
      rect: {}
    };
  }

  getChildContext() {
    const container = this;
    const topCorrection = (this.context.topCorrection || 0) + this.state.topCorrection;
    const offset = topCorrection - this.state.topCorrection;
    const rect = this.state.node ? this.state.node.getBoundingClientRect() : {};
    return { container, topCorrection, offset, rect };
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    this.setState({ node });
  }

  updateTopCorrection(topCorrection) {
    this.setState({ topCorrection });
  }

  render() {
    return <div refs="container" {...this.props}>
      {this.props.children}
    </div>
  }
}
