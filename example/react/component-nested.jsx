var React = require('react');
var SampleComponent = require('./component-vanilla.jsx');

var NestedComponent = React.createClass({
  render: function() {
    return (
      <div className="react-2">
        <p>external React markup - nested</p>
        <p>{this.props.nested}</p>
        <SampleComponent providedProp="this is a nested component!" />
      </div>
    );
  }
});

module.exports = NestedComponent;
