import { STICKY_CONTAINER_ATTR } from './constants';

class Container extends React.Component {

  constructor(props) {
    super(props);
    this.state = {}
    this.state[STICKY_CONTAINER_ATTR] = '';
  }

  render() {
    return <div {...this.props} {...this.state}>{this.props.children}</div>
  }
}

export default Container;
