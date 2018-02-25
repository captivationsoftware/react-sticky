import React, { PureComponent } from "react";
import ReactDOM from "react-dom";

import { Sticky, StickyContainer } from "../../src";

let renderCount = 0;
class Header extends PureComponent {
  render() {
    return (
      <div
        style={{
          ...this.props.style,
          height: 80,
          overflow: "auto",
          background: "#aaa"
        }}
      >
        <h2>
          <span className="pull-left">
            &lt;Sticky /&gt; <small>(invocation: #{renderCount++})</small>
          </span>
        </h2>
      </div>
    );
  }
}

export class Basic extends PureComponent {
  render() {
    return (
      <div style={{ height: 1500, margin: "0 30px" }}>
        <h2>Content before the Sticky...</h2>
        <div style={{ marginBottom: 200 }} />
        <StickyContainer
          style={{ height: 500, background: "#ddd", padding: "0 30px" }}
        >
          <Sticky>{({ style }) => <Header style={style} />}</Sticky>
          <h2 className="text-center" style={{ marginTop: 150 }}>
            &lt;StickyContainer /&gt;
          </h2>
        </StickyContainer>
        <div style={{ marginBottom: 200 }} />
        <h2>Content after the Sticky...</h2>
      </div>
    );
  }
}
