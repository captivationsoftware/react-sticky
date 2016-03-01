import React from 'react';
import Sticky from './sticky';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      topCorrection: 0,
      cumulativeTopCorrection: 0
    };
  }

  getChildContext() {
    return {
      container: this
    }
  }

  componentDidMount() {
    let cumulativeTopCorrection = this.cumulativeTopCorrection();
    this.setState({ cumulativeTopCorrection });
  }

  cumulativeTopCorrection() {
    let topCorrection = 0;
    if (this.context.container) {
      let container = this.context.container;
      while (container) {
        topCorrection += container.state.topCorrection;
        container = container.context.container;
      };
    }
    return topCorrection;
  }

  componentDidUpdate() {
    let cumulativeTopCorrection = this.cumulativeTopCorrection();
    if (this.state.cumulativeTopCorrection !== cumulativeTopCorrection) {
      this.setState({ cumulativeTopCorrection });
    }
  }

  nextState(state) {
    let topCorrection = state.isSticky ? state.height : 0;
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

Container.contextTypes = {
  container: React.PropTypes.any
}

Container.childContextTypes = {
  container: React.PropTypes.any
}

export default Container;
