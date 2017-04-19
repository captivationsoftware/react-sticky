import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { Sticky, StickyContainer } from '../../src';

let i = 0;
class Document extends PureComponent {
  render() {
    return (
      <div style={{ height: 2000 }}>
        <h1>Some content</h1>
        <div style={{ marginBottom: 200 }} />
        <StickyContainer style={{ height: 500, background: '#ddd', margin: '0 30px', padding: '0 30px' }}>
          <Sticky>
            {
              ({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom }) => {
                return (
                  <div style={{ ...style, height: 100, overflow: 'auto', background: '#aaa'}}>
                    <h1>
                      <span className="pull-left">Invocation #{i++}</span>
                      <small className="pull-right" style={{ marginTop: 10 }}>
                        <ul className="list-inline">
                          <li>isSticky: {isSticky ? 'true' : 'false'}</li>
                          <li>wasSticky: {wasSticky ? 'true' : 'false'}</li>
                          <li>distanceFromTop: { distanceFromTop }</li>
                          <li>distanceFromBottom: {distanceFromBottom}</li>
                        </ul>
                      </small>
                    </h1>
                  </div>
                )
              }
            }
          </Sticky>
        </StickyContainer>
        <div style={{ marginBottom: 200 }} />
        <h1>More content</h1>
      </div>
    );
  }
}

ReactDOM.render(<Document />, document.getElementById('mount'));
