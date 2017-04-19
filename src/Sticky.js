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
    bottomOffset: 0
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
    this.placeholder.style.paddingBottom = `${this.isSticky ? this.content.getBoundingClientRect().height : 0}px`
  }

  handleContainerEvent = ({ distanceFromTop, distanceFromBottom }) => {
    this.setState({ distanceFromTop, distanceFromBottom })
  };

  render() {
    this.wasSticky = this.isSticky;
    const isSafeToMeasure = this.placeholder && this.content;

    const remainingDistanceFromBottom = isSafeToMeasure ? this.state.distanceFromBottom - this.content.getBoundingClientRect().height : 0;

    const isSticky = this.isSticky = isSafeToMeasure
      && this.placeholder.offsetTop + this.props.topOffset < this.state.distanceFromTop
      && this.state.distanceFromBottom > 0

    const placeholderClientRect = isSafeToMeasure ? this.placeholder.getBoundingClientRect() : {};

    const bottomBreakpoint = isSafeToMeasure ? this.state.distanceFromBottom - this.props.bottomOffset - this.content.getBoundingClientRect().height : 0;

    return (
      <div>
        <div ref={ placeholder => this.placeholder = placeholder } />
        {
          React.cloneElement(
            this.props.children({
              isSticky,
              style: !isSticky ? { } : {
                position: 'fixed',
                top: bottomBreakpoint > 0 ? 0 : bottomBreakpoint,
                left: placeholderClientRect.left,
                width: placeholderClientRect.width
              },
              distanceFromTop: isSafeToMeasure ? -this.state.distanceFromTop + this.placeholder.offsetTop : undefined,
              distanceFromBottom: isSafeToMeasure ? this.state.distanceFromBottom : undefined
            }),
            { ref: content => { if (content) this.content = content; } }
          )
        }
      </div>
    )
  }
}
