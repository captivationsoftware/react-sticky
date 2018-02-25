import React from "react";

export class Header extends React.Component {
  render() {
    const { style, renderCount } = this.props;
    return (
      <div
        style={{
          height: 80,
          overflow: "auto",
          background: "#aaa",
          ...style
        }}
      >
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
