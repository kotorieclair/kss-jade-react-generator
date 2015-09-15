var React = require('react');
var _assign = require('lodash/object/assign');

var RouterContext = function(Component, options) {
  function DummyRouter() {}

  _assign(DummyRouter, {
    makePath: function() {},
    makeHref: function() {},
    transitionTo: function() {},
    replaceWith: function() {},
    goBack: function() {},
    getCurrentPath: function() {},
    getCurrentRoutes: function() {},
    getCurrentPathname: function() {},
    getCurrentParams: function() {},
    getCurrentQuery: function() {},
    isActive: function() {},
    getRouteAtDepth: function() {},
    setRouteComponentAtDepth: function() {}
  }, options);

  return React.createClass({
    childContextTypes: {
      router: React.PropTypes.func,
      routeDepth: React.PropTypes.number
    },

    getChildContext: function() {
      return {
        router: DummyRouter,
        routeDepth: 0
      };
    },

    render: function() {
      return <Component {...this.props} />
    }
  });
}

module.exports = RouterContext;
