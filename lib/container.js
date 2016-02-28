class Container extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <div {...this.props} data-sticky-container>{this.props.children}</div>
  }
}

export default Container;
