import React, { PureComponent } from "react";
import ReactDOM from "react-dom";

import { Sticky, StickyContainer } from "../../src";

let i = 0;
class Document extends PureComponent {
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
              }) => {
                // console.log({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom, calculatedHeight });

                return (
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
                        &lt;Sticky /&gt; <small>(invocation: #{i++})</small>
                      </span>
                    </h2>
                  </div>
                );
              }}
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

ReactDOM.render(<Document />, document.getElementById("mount"));
