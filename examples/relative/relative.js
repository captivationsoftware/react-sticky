import React, { PureComponent } from "react";
import ReactDOM from "react-dom";

import { Sticky, StickyContainer } from "../../src";
import { Header } from "../header";

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
            <Sticky relative={true}>
              {({ style }) => (
                <Header style={style} renderCount={renderCount++} />
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
