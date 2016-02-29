import React from 'react';
import ReactDOM from 'react-dom';
import watcher from './watcher';

class Sticky extends React.Component {

  constructor(props) {
    super(props);
    this.state = { };
  }

  componentWillUpdate(props, state, context) {
    if (state.node && !state.container && context.container) {
      this.setState({
        container: context.container,
        containerNode: ReactDOM.findDOMNode(context.container),
      });

      // Now we're ready to go!
      watcher.on(this.transition.bind(this));
      watcher.emit();
    }
  }

  /*
   * Anytime new props are received, force re-evaluation
   */
  componentWillReceiveProps() {
    let origin = this.calculateOrigin(this.state.node);
    this.setState({ origin });

    watcher.emit();
  }

  componentDidMount() {
    let node = ReactDOM.findDOMNode(this);
    let origin = this.calculateOrigin(node);
    this.setState({ node, origin });
  }

  componentWillUnmount() {
    watcher.off(this.transition.bind(this));
  }

  /*
   * Return the distance of the scrollbar from the
   * top of the window plus the total height of all
   * stuck Sticky instances above this one.
   */
  pageOffset() {
    return (window.pageYOffset || document.documentElement.scrollTop);
  }

  otherStickyOffset() {
    return this.state.container.state.cumulativeTopCorrection;
  }

  /*
   * Returns true/false depending on if this should be sticky.
   */
  shouldBeSticky() {
    let offset = this.pageOffset();
    let origin =  this.state.origin - this.otherStickyOffset();

    let stickyTopConditionsMet = offset >= origin + this.props.topOffset;
    let stickyBottomConditionsMet = offset < this.state.containerNode.getBoundingClientRect().height + origin;
    return stickyTopConditionsMet && stickyBottomConditionsMet;
  }


  transition() {
    if (this.state.container) {
      this.nextState(this.shouldBeSticky());
    }
  }

  /*
   * Returns the y-coordinate of the top of this element.
   */
  calculateOrigin(node) {
    // Do some ugly DOM manipulation to where this element's non-sticky position would be
    let previousPosition = node.style.position;
    node.style.position = '';
    let origin = node.getBoundingClientRect().top + this.pageOffset();
    node.style.position = previousPosition;
    return origin;
  }
  /*
   * If sticky, merge this.props.stickyStyle with this.props.style.
   * If not, just return this.props.style.
   */
  nextStyle(shouldBeSticky) {
    if (shouldBeSticky) {
      // inherit the boundaries of the container
      var rect = (this.state.containerNode || document.body).getBoundingClientRect();
      var style = Object.assign({}, this.props.style);
      style.position = 'fixed';
      style.left = rect.left;
      style.width = rect.width;
      style.top = this.otherStickyOffset();

      let bottomLimit = rect.bottom - this.state.node.getBoundingClientRect().height;
      if (style.top > bottomLimit) style.top = bottomLimit;

      // Finally, override the best-fit style with any user props
      return Object.assign(style, this.props.stickyStyle);
    } else {
      return this.props.style;
    }
  }

  /*
   * If sticky, merge this.props.stickyClass with this.props.className.
   * If not, just return this.props.className.
   */
  nextClassName(shouldBeSticky) {
    var className = this.props.className;
    if (shouldBeSticky) {
      className += ' ' + this.props.stickyClass;
    }
    return className;
  }

  /*
   * Transition to the next state.
   *
   * Updates the isSticky, style, and className state
   * variables.
   *
   * If sticky state is different than the previous,
   * fire the onStickyStateChange callback.
   */
  nextState(shouldBeSticky) {
    var hasChanged = this.state.isSticky !== shouldBeSticky;

    // Update this state
    this.setState({
      isSticky: shouldBeSticky,
      style: this.nextStyle(shouldBeSticky),
      className: this.nextClassName(shouldBeSticky)
    });

    if (hasChanged) {

      // Update container state
      if (this.state.container) {
        this.state.container.nextState({
          isSticky: shouldBeSticky,
          height: this.state.node.getBoundingClientRect().height
        });
      }

      // Publish sticky state change
      this.props.onStickyStateChange(shouldBeSticky);
    }
  }

  /*
   * The special sauce.
   */
  render() {
    return (
      <div style={this.state.style} className={this.state.className}>
        {this.props.children}
      </div>
    );
  }
}

Sticky.contextTypes = {
  container: React.PropTypes.any
}


/*
 * Default properties...
 */
Sticky.defaultProps = {
  className: '',
  style: {},
  stickyClass: 'sticky',
  stickyStyle: {},
  topOffset: 0,
  onStickyStateChange: function () {}
}

export default Sticky;
