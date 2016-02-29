import React from 'react';
import Sticky from './sticky';
import { copy } from './utils';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paddingTopCorrection: 0
    };
  }

  componentDidMount() {
    this.setState({ node: ReactDOM.findDOMNode(this) });
  }

  getChildContext() {
    return { container: this }
  }

  setPaddingTopCorrection(paddingTopCorrection) {
    this.setState({ paddingTopCorrection });
  }

  render() {
    let style = copy({}, this.props.style || {});

    if (this.state.node) {
      let paddingTop = style.paddingTop || (parseInt(this.state.node.style.paddingTop) || 0);
      style.paddingTop = paddingTop + this.state.paddingTopCorrection;
    }

    return <div {...this.props} style={style}>
      {this.props.children}
    </div>
  }
}

Container.childContextTypes = {
  container: React.PropTypes.any
}

export default Container;
