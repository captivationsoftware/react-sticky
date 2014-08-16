###*
  @jsx React.DOM
###

Dropdown = React.createClass
  render: ->
    @transferPropsTo `
      <div class="btn-group">
        <button tabIndex='-1' type='button' class="btn dropdown-toggle"
            data-toggle="dropdown">
          <span class="caret"></span>
        </button>
        <ul class="dropdown-menu">
          {this.props.children}
        </ul>
      </div>`
