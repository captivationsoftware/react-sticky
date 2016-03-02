import React from 'react';
import Sticky from './sticky';
import Watcher from './watcher';

export default class Container extends React.Component {

  static contextTypes = {
    container: React.PropTypes.any,
    topCorrection: React.PropTypes.number
  }

  static childContextTypes = {
    container: React.PropTypes.any,
    topCorrection: React.PropTypes.number
  }

  static resizeWatcher = new Watcher(['resize']);

  constructor(props) {
    super(props);
    this.state = {
      topCorrection: 0
    };
  }

  getChildContext() {
    let container = this;
    let topCorrection = (this.context.topCorrection || 0)+ this.state.topCorrection;
    return { container, topCorrection }
  }

  componentDidMount() {
    Container.resizeWatcher.on(this.onResize);
  }

  componentWillUnmount() {
    Container.resizeWatcher.off(this.onResize);
  }

  onResize = () => {
    this.setState({topCorrection: 0});
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
