import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { Sticky, StickyContainer } from '../../src';

let i = 0;
class Document extends PureComponent {
  render() {
    return (
      <StickyContainer style={{ height: 1000 }}>
        <h1>Some content</h1>
        <div style={{ marginBottom: 200 }} />
        <Sticky>
          {
            ({ isSticky, style }) => {
              return (
                <div style={{ ...style, overflow: 'auto', background: '#eee'}}>
                  <h1>Update #{i++}</h1>
                </div>
              )
            }
          }
        </Sticky>
        <div style={{ marginBottom: 200 }} />
        <h1>More content</h1>
      </StickyContainer>
    );
  }
}

ReactDOM.render(<Document />, document.getElementById('mount'));
