import React, { PureComponent } from "react";
import ReactDOM from "react-dom";

import { Sticky, StickyContainer } from "../../src";
import { Header } from "../header";

const containerBg = i => `hsl(${i * 40}, 70%, 90%)`;
const headerBg = i => `hsl(${i * 40}, 70%, 50%)`;

export class Stacked extends PureComponent {
  render() {
    return (
      <div>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
          <StickyContainer
            key={i}
            className="container"
            style={{ background: containerBg(i) }}
          >
            <Sticky>
              {({ style }) => (
                <Header style={{ ...style, background: headerBg(i) }} />
              )}
            </Sticky>

            <h2 className="text-center">{`<StickyContainer #${i} />`}</h2>
          </StickyContainer>
        ))}
      </div>
    );
  }
}
