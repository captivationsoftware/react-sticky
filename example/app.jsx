var React = require('react'),
  Sticky = require('../index');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <Sticky>
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
