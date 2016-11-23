import React from 'react';
import ReactDOM from 'react-dom';

import Channel from './channel';

export default class Container extends React.Component {
  static propTypes = {
    name: React.PropTypes.string
  }

  static defaultProps = {
    name: 'sticky'
  }

  static contextTypes = {
    'sticky-channel': React.PropTypes.object,
  }

  static childContextTypes = {
    'sticky-channel': React.PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.channel = new Channel({ inherited: 0, offset: 0, node: null });
  }

  getChildContext() {
    return { 'sticky-channel': { [this.props.name]: this.channel } };
  }

  componentWillMount() {
    const parentChannel = this.context['sticky-channel'];

    if (parentChannel && this.props.name in parentChannel) {
      parentChannel[this.props.name].subscribe(this.updateOffset);
    }
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    this.channel.update((data) => { data.node = node });
  }

  componentWillUnmount() {
    this.channel.update((data) => { data.node = null });

    const parentChannel = this.context['sticky-channel'];

    if (parentChannel && this.props.name in parentChannel) {
      parentChannel[this.props.name].unsubscribe(this.updateOffset);
    }
  }

  updateOffset = ({ inherited, offset }) => {
    this.channel.update((data) => { data.inherited = inherited + offset });
  }

  render() {
    return <div {...this.props}>
      {this.props.children}
    </div>
  }
}
