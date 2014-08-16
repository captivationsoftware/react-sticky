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
          Content
        </main>
        <footer>
          Footer
        </footer>
      </div>
    );
  }
});

React.renderComponent(new App(), document.getElementById('example'));
