import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';

import { Sticky, StickyContainer } from '../../src';

class Document extends PureComponent {
  render() {
    return (
      <div>
        {
          [1,2,3,4,5,6,7,8].map(i => {
            return (
              <StickyContainer key={i} style={{ height: 1000, background: `hsl(${i*40}, 70%, 90%)`, position: 'relative' }}>
                <Sticky footer placeholderStyles={{ position: 'absolute', bottom: 0, width: '100vw' }}>
                  {
                    ({ isSticky, wasSticky, style, distanceFromTop, distanceFromBottom, calculatedHeight }) => {
                      return (
                        <div style={{  height: 80, background: `hsl(${i*40}, 70%, 50%)`, position: 'absolute', width: '100vw',   bottom: 0, ...style}}>
                          <h2 style={{ lineHeight: '80px', padding: 0, margin: 0 }}>
                            <span className="pull-left">&lt;Sticky #{i} /&gt;</span>
                          </h2>
                        </div>
                      )
                    }
                  }
                </Sticky>

                <h2 className="text-center" style={{ marginTop: 0 }}>&lt;StickyContainer #{i} /&gt;</h2>
              </StickyContainer>
            )
          })
        }
      </div>
    );
  }
}

ReactDOM.render(<Document />, document.getElementById('mount'));
