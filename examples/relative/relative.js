import React, { PureComponent } from "react";
import ReactDOM from "react-dom";

import { Sticky, StickyContainer } from "../../src";

let renderCount = 0;
export class Relative extends PureComponent {
  render() {
    return (
      <div style={{ margin: 30 }}>
        <StickyContainer
          style={{
            height: 250,
            overflowY: "auto",
            background: "#ddd",
            padding: "0 30px"
          }}
        >
          <div style={{ height: 500 }}>
            <div style={{ height: 50 }} />
            <Sticky relative>
              {({
                isSticky,
                wasSticky,
                style,
                distanceFromTop,
                distanceFromBottom,
                calculatedHeight
              }) => (
                <div
                  style={{
                    ...style,
                    height: 100,
                    overflow: "auto",
                    background: "#aaa"
                  }}
                >
                  <h2>
                    <span className="pull-left">
                      &lt;Sticky /&gt;{" "}
                      <small>(invocation: #{renderCount++})</small>
                    </span>
                  </h2>
                </div>
              )}
            </Sticky>

            <h2 className="text-center" style={{ marginTop: 150 }}>
              overflowing container
            </h2>
          </div>
        </StickyContainer>
      </div>
    );
  }
}
