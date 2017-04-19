import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { Sticky, StickyContainer } from '../../src';

let i = 0;
class Document extends PureComponent {
  render() {
    return (
      <div style={{ height: 1500, margin: '0 30px' }}>
        <h2>Content before the Sticky...</h2>
        <div style={{ marginBottom: 200 }} />
        <StickyContainer style={{ height: 500, background: '#ddd', padding: '0 30px' }}>
          <Sticky>
            {
              ({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom }) => {
                return (
                  <div style={{ ...style, height: 80, overflow: 'auto', background: '#aaa'}}>
                    <h2>
                      <span className="pull-left">&lt;Sticky /&gt; invocation: #{i++}</span>
                      <small className="pull-right" style={{ marginTop: 10 }}>
                        <ul className="list-inline">
                          <li>isSticky: {isSticky ? 'true' : 'false'}</li>
                          <li>wasSticky: {wasSticky ? 'true' : 'false'}</li>
                          <li>distanceFromTop: { distanceFromTop }</li>
                          <li>distanceFromBottom: {distanceFromBottom}</li>
                        </ul>
                      </small>
                    </h2>
                  </div>
                )
              }
            }
          </Sticky>

          <h2 className="text-center" style={{ marginTop: 150 }}>&lt;StickyContainer /&gt;</h2>
        </StickyContainer>
        <div style={{ marginBottom: 200 }} />
          <h2>Content after the Sticky...</h2>
        </div>
    );
  }
}

ReactDOM.render(<Document />, document.getElementById('mount'));
