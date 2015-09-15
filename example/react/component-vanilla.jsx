var React = require('react');
var Link = require('react-router').Link;

var SampleComponent = React.createClass({
  getInitialState: function() {
    return {
      title: "this is state.title"
    };
  },
  render: function() {
    return (
      <div className="react-1">
        <p>external React markup</p>
        <p>{this.state.title}</p>
        <p>{this.props.providedProp}</p>
      </div>
    );
  }
});

module.exports = SampleComponent;
