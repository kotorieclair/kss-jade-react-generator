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
        <p>React component with React-Router@1.0.0-rc1 component</p>
        <Link to="hogehoge" activeClassName={this.props.activeClassName}>
          React-Router Link component
        </Link>
        <Link to={this.props.linkTo} activeClassName={this.props.activeClassName}>
          another Link component
        </Link>
        <p>This example is replacing following methods</p>
        <ul>
          <li>createHref() - returns <code>sample_createHref</code></li>
          <li>isActive() - returns <code>true</code></li>
        </ul>
      </div>
    );
  }
});

module.exports = {
  component: SampleComponent,
  props: {
    linkTo: 'link',
    activeClassName: 'active'
  }
};
