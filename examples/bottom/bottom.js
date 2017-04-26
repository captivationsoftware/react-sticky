import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { Sticky, StickyContainer, Edges } from '../../src';

let i = 0;
class Document extends PureComponent {
  render() {
    return (
      <div style={{ height: 1500, margin: '0 30px' }}>
        <h2>Bottom edge example</h2>
        <h2>Content before the Sticky...</h2>
        <h2>Scroll down</h2>
        <div style={{ marginBottom: 500 }} />
          <div style={{ height: 200, marginTop: 200 }}/>
          <StickyContainer style={{ height: 500, background: '#ddd', padding: '0 30px' }}>
            <div style={{ height: 100 }}/>
            <Sticky edge={Edges.BOTTOM}>
              {
                ({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom, calculatedHeight }) => {
                  console.log({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom, calculatedHeight });
                  return (
                    <div style={{ ...style, height: 80, overflow: 'auto', background: '#aaa'}}>
                      <h2>
                        <span className="pull-left">&lt;Sticky edge={'{'}Edges.BOTTOM{'}'}/&gt; <small>(invocation: #{i++})</small></span>
                      </h2>
                    </div>
                  )
                }
              }
            </Sticky>
            <div style={{ height: 100 }}/>
            <h2 className="text-center">&lt;StickyContainer /&gt;</h2>
          </StickyContainer>
          <div style={{ marginBottom: 500 }} />
          <h2>Content after the Sticky...</h2>
          <div style={{ height: 200, marginTop: 200 }}/>
        </div>
    );
  }
}

ReactDOM.render(<Document />, document.getElementById('mount'));
