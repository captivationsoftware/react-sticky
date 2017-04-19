import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

export default class Sticky extends Component {

  static propTypes = {
    topOffset: PropTypes.number,
    bottomOffset: PropTypes.number,
    children: PropTypes.func.isRequired
  }

  static defaultProps = {
    topOffset: 0,
    bottomOffset: 0,
    disableCompensation: false,
    disableHardwareAcceleration: false
  }

  static contextTypes = {
    subscribe: PropTypes.func,
    unsubscribe: PropTypes.func
  }

  state = {}

  componentWillMount() {
    this.context.subscribe(this.handleContainerEvent)
  }

  componentWillUnmount() {
    this.context.unsubscribe(this.handleContainerEvent)
  }

  componentDidUpdate() {
    this.placeholder.style.paddingBottom = this.props.disableCompensation ? 0 : `${this.state.isSticky ? this.content.getBoundingClientRect().height : 0}px`
  }

  handleContainerEvent = ({ distanceFromTop, distanceFromBottom }) => {
    const wasSticky = !!this.state.isSticky;
    const isSticky = this.placeholder.offsetTop + this.props.topOffset < distanceFromTop && distanceFromBottom > 0;

    const bottomDifference = distanceFromBottom - this.props.bottomOffset - this.content.getBoundingClientRect().height;

    const placeholderClientRect = this.placeholder.getBoundingClientRect();
    const style = !isSticky ? { } : {
      position: 'fixed',
      top: bottomDifference > 0 ? 0 : bottomDifference,
      left: placeholderClientRect.left,
      width: placeholderClientRect.width,
      transform: this.props.disableHardwareAcceleration ? '' : 'translateZ(0)'
    }

    distanceFromTop = -distanceFromTop + this.placeholder.offsetTop;

    this.setState({ isSticky, wasSticky, distanceFromTop, distanceFromBottom, style })
  };

  render() {
    const element = React.cloneElement(
      this.props.children({
        isSticky: this.state.isSticky,
        wasSticky: this.state.wasSticky,
        distanceFromTop: this.state.distanceFromTop,
        distanceFromBottom: this.state.distanceFromBottom,
        style: this.state.style
      }),
      { ref: content => { if (content) this.content = content; } }
    )

    return (
      <div>
        <div ref={ placeholder => this.placeholder = placeholder } />
        { element }
      </div>
    )
  }
}
