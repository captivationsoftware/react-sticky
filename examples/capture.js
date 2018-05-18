import React, { PureComponent } from "react";
import ReactDOM from "react-dom";

import { Sticky, StickyContainer } from "../src";
import { Header } from "./header";

const containerBg = i => `hsl(${i * 40}, 70%, 90%)`;
const headerBg = i => `hsl(${i * 40}, 70%, 50%)`;

export class Capture extends PureComponent {
  render() {
    return (
      <div className="wrapper">
        <aside className="sidebar">Sidebar</aside>
        <div className="scroll-container">
          <h1>Within a scrolling container</h1>
          <div className="gap short" />
          <StickyContainer capture={true}>
            <div className="row">
              <div className="column">
                <p>
                  Nunc consectetur placerat sem, rutrum pretium neque fringilla
                  eget. Etiam blandit ac sem vel mollis. Aenean eros leo,
                  ullamcorper ut luctus vitae, suscipit et libero. Duis
                  vulputate tortor nec commodo scelerisque. Praesent fermentum
                  diam vitae nunc ultricies condimentum. Curabitur consectetur
                  purus nec ligula tempor finibus. Maecenas vulputate elementum
                  felis a sagittis. Nam non malesuada ante.
                </p>
                <p>
                  Nunc consectetur placerat sem, rutrum pretium neque fringilla
                  eget. Etiam blandit ac sem vel mollis. Aenean eros leo,
                  ullamcorper ut luctus vitae, suscipit et libero. Duis
                  vulputate tortor nec commodo scelerisque. Praesent fermentum
                  diam vitae nunc ultricies condimentum. Curabitur consectetur
                  purus nec ligula tempor finibus. Maecenas vulputate elementum
                  felis a sagittis. Nam non malesuada ante.
                </p>
              </div>

              <div className="column">
                <Sticky>{({ style }) => <Header style={style} />}</Sticky>
              </div>
            </div>
          </StickyContainer>
          <div className="gap tall">lots of trailing content</div>
        </div>
      </div>
    );
  }
}
