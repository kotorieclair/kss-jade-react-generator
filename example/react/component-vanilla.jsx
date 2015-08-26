var React = require('react');

var SampleComponent = React.createClass({
  getInitialState: function() {
    return {
      title: "this is state.title"
    };
  },
  render: function() {
    return (
      <div>
        <p>external react markup</p>
        <p>{this.state.title}</p>
        <p>{this.props.providedProp}</p>
        <p className={this.props.modifier_class}>modifier class goes here</p>
      </div>
    );
  }
});

module.exports = SampleComponent;
