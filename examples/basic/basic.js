import React, { PureComponent } from "react";
import ReactDOM from "react-dom";

import { Sticky, StickyContainer } from "../../src";
import { Header } from "../header";

let renderCount = 0;
export class Basic extends PureComponent {
  render() {
    return (
      <div style={{ height: 1500, margin: "0 30px" }}>
        <h2>Content before the Sticky...</h2>
        <div style={{ marginBottom: 200 }} />
        <StickyContainer
          style={{ height: 500, background: "#ddd", padding: "0 30px" }}
        >
          <Sticky>
            {({ style }) => (
              <Header style={style} renderCount={renderCount++} />
            )}
          </Sticky>

          <h2 className="text-center" style={{ marginTop: 150 }}>
            {"<StickyContainer />"}
          </h2>
        </StickyContainer>
        <div style={{ marginBottom: 200 }} />
        <h2>Content after the Sticky...</h2>
      </div>
    );
  }
}
