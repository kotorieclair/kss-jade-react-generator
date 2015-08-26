var React = require('react');

var SampleComponent = React.createClass({
  getInitialState: function() {
    return {
      title: "this is title"
    };
  },
  render: function() {
    return (
      <div>
        <p>external react markup</p>
        <p>{this.state.title}</p>
        <p>{this.props.providedProp}</p>
        <p>{this.props.modifier_class}</p>
      </div>
    );
  }
});

module.exports = SampleComponent;
