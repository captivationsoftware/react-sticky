var React = require('react'),
  Sticky = require('../index');

var App = React.createClass({
  handleStickyStateChange: function ( state ) {
    console.log( state );
  },
  render: function() {
    return (
      <div>
        <Sticky stickyClass="supersticky"
          stickyStyle={{top: 0, left: 0, right: 0, background: 'orange'}}
          type={React.DOM.header}
          onStickyStateChange={this.handleStickyStateChange}>

          <nav>Header (sticky)</nav>
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
