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
      <div className="react-3">
        <p>React component with React-Router component {this.props.linkTo}</p>
        <Link to="hogehoge">React-Router Link component</Link>
        <Link to={this.props.linkTo}>another Link component</Link>
        <p>This example is replacing following methods</p>
        <ul>
          <li>makeHref() - returns 'sample_makeHref'</li>
          <li>isActive() - returns true</li>
        </ul>
      </div>
    );
  }
});

module.exports = {
  component: SampleComponent,
  props: {
    linkTo: 'link',
  }
};
