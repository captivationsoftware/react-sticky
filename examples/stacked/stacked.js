import React, { PureComponent } from "react";
import ReactDOM from "react-dom";

import { Sticky, StickyContainer } from "../../src";
import { Header } from "../header";

export class Stacked extends PureComponent {
  render() {
    return (
      <div>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <StickyContainer
            key={i}
            style={{ height: 500, background: `hsl(${i * 40}, 70%, 90%)` }}
          >
            <Sticky>
              {({ style }) => (
                <Header
                  style={{ ...style, background: `hsl(${i * 40}, 70%, 50%)` }}
                />
              )}
            </Sticky>

            <h2 className="text-center" style={{ marginTop: 150 }}>
              {`<StickyContainer #${i} />`}
            </h2>
          </StickyContainer>
        ))}
      </div>
    );
  }
}
