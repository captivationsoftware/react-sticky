var React = require('react'),
  Sticky = require('../index');

var App = React.createClass({
  handleStickyStateChange: function ( state ) {
    console.log( state );
  },
  render: function() {
    return (
      <div>
        <Sticky onStickyStateChange={this.handleStickyStateChange}>
          <header>
            Header (sticky) 
          </header>
        </Sticky>
        <main>
          Main content
        </main>
        <footer>
          Footer content
        </footer>
      </div>
    );
  }
});

React.renderComponent(<App />, document.getElementById('example'));
