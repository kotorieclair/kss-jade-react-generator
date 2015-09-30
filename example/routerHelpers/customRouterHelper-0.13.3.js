// Sample custom react-router@0.13.3 helper
module.exports = {
  makePath: function() {
    return 'sample_makePath';
  },
  makeHref: function() {
    return 'sample_makeHref';
  },
  transitionTo: function() {},
  replaceWith: function() {},
  goBack: function() {},
  getCurrentPath: function() {
    return 'current_path';
  },
  getCurrentRoutes: function() {
    return ['sample', 'routes'];
  },
  getCurrentPathname: function() {
    return 'current_path_name';
  },
  getCurrentParams: function() {
    return { sample: 'sample_params'};
  },
  getCurrentQuery: function() {
    return { sample: 'sample_query'};
  },
  isActive: function() {
    return true;
  },
  getRouteAtDepth: function() {},
  setRouteComponentAtDepth: function() {}
};
