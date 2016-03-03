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
    offset: React.PropTypes.number
  }

  constructor(props) {
    super(props);
    this.state = {
      topCorrection: 0
    };
  }

  getChildContext() {
    let container = this;
    let topCorrection = (this.context.topCorrection || 0) + this.state.topCorrection;
    let offset = topCorrection - this.state.topCorrection;
    return { container, topCorrection, offset };
  }

  updateTopCorrection(topCorrection) {
    this.setState({ topCorrection });
  }

  render() {
    let style = Object.assign({}, this.props.style || {});

    let paddingTop = style.paddingTop || 0;
    style.paddingTop = paddingTop + this.state.topCorrection;

    return <div {...this.props} style={style}>
      {this.props.children}
    </div>
  }
}
