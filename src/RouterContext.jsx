var React = require('react');
var _assign = require('lodash/object/assign');

var RouterContext = function(Component, options) {
  function DummyRouter() {}

  var dummyHistory = _assign({}, {
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
    setRouteComponentAtDepth: function() {},
    createHref: function() {}
  }, options);

  _assign(DummyRouter, dummyHistory);

  return React.createClass({
    childContextTypes: {
      history: React.PropTypes.object,
      router: React.PropTypes.func,
      routeDepth: React.PropTypes.number
    },

    getChildContext: function() {
      return {
        history: dummyHistory,
        router: DummyRouter,
        routeDepth: 0
      };
    },

    render: function() {
      return React.createElement(Component, this.props);
    }
  });
}

module.exports = RouterContext;
