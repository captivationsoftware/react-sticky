import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { Sticky, StickyContainer } from '../../src';

class Header extends PureComponent {
  i = 0;
  render() {
    return (
      <div style={{ ...this.props.style, height: 80, overflow: 'auto', background: '#aaa'}}>
        <h2>
          <span className="pull-left">&lt;Sticky /&gt; <small>(invocation: #{this.i++})</small></span>
        </h2>
      </div>
    );
  }
}

class Document extends PureComponent {
  render() {
    return (
      <div style={{ height: 1500, margin: '0 30px' }}>
        <h2>Content before the Sticky...</h2>
        <div style={{ display: 'flex' }}>
          <StickyContainer style={{ display: 'inline-block', height: 5000, background: '#ddd', padding: '0 30px' }}>
            <Sticky>
              {
                ({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom, calculatedHeight }) => {
                  console.log({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom, calculatedHeight });
                  return <Header style={style} />
                }
              }
            </Sticky>

            <h2 className="text-center" style={{ marginTop: 150 }}>&lt;StickyContainer/&gt;</h2>
            <p>with default 16ms throttling (62.5 fps)</p>
          </StickyContainer>
          <StickyContainer style={{ display: 'inline-block', height: 5000, background: '#ddd', padding: '0 30px' }} throttleWait={ 20 } >
            <Sticky>
              {
                ({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom, calculatedHeight }) => {
                  console.log({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom, calculatedHeight });
                  return <Header style={style} />
                }
              }
            </Sticky>

            <h2 className="text-center" style={{ marginTop: 150 }}>&lt;StickyContainer /&gt;</h2>
            <p>with 20ms throttling (50 fps)</p>
          </StickyContainer>
          <StickyContainer style={{ display: 'inline-block', height: 5000, background: '#ddd', padding: '0 30px' }} throttleWait={ 50 }>
            <Sticky>
              {
                ({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom, calculatedHeight }) => {
                  console.log({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom, calculatedHeight });
                  return <Header style={style} />
                }
              }
            </Sticky>

            <h2 className="text-center" style={{ marginTop: 150 }}>&lt;StickyContainer /&gt;</h2>
            <p>with 50ms throttling (20 fps)</p>
          </StickyContainer>
          <StickyContainer style={{ display: 'inline-block', height: 5000, background: '#ddd', padding: '0 30px' }} throttleWait={ 100 }>
            <Sticky>
              {
                ({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom, calculatedHeight }) => {
                  console.log({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom, calculatedHeight });
                  return <Header style={style} />
                }
              }
            </Sticky>

            <h2 className="text-center" style={{ marginTop: 150 }}>&lt;StickyContainer /&gt;</h2>
            <p>with 100ms throttling (10 fps)</p>
          </StickyContainer>
        </div>
        <div style={{ marginBottom: 200 }} />
          <h2>Content after the Sticky...</h2>
        </div>
    );
  }
}

ReactDOM.render(<Document />, document.getElementById('mount'));
