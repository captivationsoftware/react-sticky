import React from "react";

export class Header extends React.Component {
  static defaultProps = {
    className: ""
  };
  render() {
    const { style, renderCount, className } = this.props;
    return (
      <div className={"header " + className} style={style}>
        <h2>
          <span className="pull-left">
            {"<Sticky /> "}
            {renderCount ? <small>(invocation: #{renderCount})</small> : null}
          </span>
        </h2>
      </div>
    );
  }
}
