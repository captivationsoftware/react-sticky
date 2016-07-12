import React from 'react';
import ReactDOM from 'react-dom';

import Channel from './channel';

const DEFAULT_INITIAL_ZINDEX = 1000;

export default class Container extends React.Component {
  static propTypes = {
    zIndex: React.PropTypes.number
  }

  static contextTypes = {
    'sticky-channel': React.PropTypes.any,
    stickyZIndex: React.PropTypes.number
  }

  static childContextTypes = {
    'sticky-channel': React.PropTypes.any,
    stickyZIndex: React.PropTypes.number
  }

  constructor(props) {
    super(props);
    this.channel = new Channel({ inherited: 0, offset: 0, node: null });
  }

  getZIndex() {
    if(this.context.stickyZIndex === 0) return 0;
    if(this.context.stickyZIndex) return this.context.stickyZIndex;
    if(this.props.zIndex === 0) return 0
    return this.props.zIndex || DEFAULT_INITIAL_ZINDEX;
  }

  getChildContext() {
    return {
      'sticky-channel': this.channel,
      stickyZIndex: this.getZIndex()
    };
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
    const zIndex = this.getZIndex()
    let style;
    if(zIndex !== 0)
      style = {zIndex}

    return <div style={style} {...this.props}>
      {this.props.children}
    </div>
  }
}
