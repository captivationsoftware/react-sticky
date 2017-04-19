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

  handleContainerEvent = ({ distanceFromTop }) => {
    this.setState({ distanceFromTop })
  };

  render() {
    this.wasSticky = this.isSticky;
    const isSafeToMeasure = this.placeholder && this.content;

    const isSticky = this.isSticky = isSafeToMeasure &&
      this.placeholder.offsetTop + this.props.topOffset < this.state.distanceFromTop;

    const placeholderClientRect = isSafeToMeasure ? this.placeholder.getBoundingClientRect() : {};

    return (
      <div>
        <div ref={ placeholder => this.placeholder = placeholder } />
        {
          React.cloneElement(
            this.props.children({
              isSticky,
              style: !isSticky ? { } : {
                position: 'fixed',
                top: 0,
                left: placeholderClientRect.left,
                width: placeholderClientRect.width
              }
            }),
            { ref: content => { if (content) this.content = content; } }
          )
        }
      </div>
    )
  }
}
