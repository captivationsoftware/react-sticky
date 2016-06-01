import React from 'react';
import ReactDOM from 'react-dom';

import Channel from './channel';

export default class Container extends React.Component {

  static contextTypes = {
    'sticky-channel': React.PropTypes.any,
  }

  static childContextTypes = {
    'sticky-channel': React.PropTypes.any,
  }

  constructor(props) {
    super(props);
    this.channel = new Channel({ inherited: 0, offset: 0, node: null });
  }

  getChildContext() {
    return { 'sticky-channel': this.channel };
  }

  componentWillMount() {
    const parentChannel = this.context['sticky-channel'];
    if (parentChannel) parentChannel.subscribe(this.updateOffset);
  }

  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    this.channel.update((data) => { data.node = node });
  }

  componentWillUnmount() {
    this.channel.update((data) => { data.node = null });

    const parentChannel = this.context['sticky-channel'];
    if (parentChannel) parentChannel.unsubscribe(this.updateOffset);
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
