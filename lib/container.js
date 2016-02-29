import React from 'react';
import Sticky from './sticky';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }

  componentDidMount() {
    this.setState({ node: ReactDOM.findDOMNode(this) });
  }

  getChildContext() {
    return { containerNode: this.state.node }
  }

  render() {
    return <div {...this.props}>
      {this.props.children}
    </div>
  }
}

Container.childContextTypes = {
  containerNode: React.PropTypes.any
}

export default Container;
