import React from 'react';
import Sticky from './sticky';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topCorrection: 0
    };
  }

  componentDidMount() {
    this.setState({ node: ReactDOM.findDOMNode(this) });
  }

  getChildContext() {
    return {
      container: this
    }
  }

  getCumulativeTopCorrection() {
    let topCorrection = 0;
    let container = this.context.container;
    while (container) {
      topCorrection += container.state.topCorrection;
      container = container.context.container;
    };
    return topCorrection;
  }

  setTopCorrection(topCorrection) {
    this.setState({ topCorrection });
  }

  render() {
    let style = Object.assign({}, this.props.style || {});

    if (this.state.node) {
      let paddingTop = style.paddingTop || (parseInt(this.state.node.style.paddingTop) || 0);
      style.paddingTop = paddingTop + this.state.topCorrection;
    }

    return <div {...this.props} style={style}>
      {this.props.children}
    </div>
  }
}

Container.contextTypes = {
  container: React.PropTypes.any
}

Container.childContextTypes = {
  container: React.PropTypes.any
}

export default Container;
