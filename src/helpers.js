// @TODO Re-enable this eslint rule.
/*eslint-disable valid-jsdoc*/

'use strict';

var path = require('path');
var Kss = require('kss');
var jade = require('jade');
var React = require('react');
var beautify = require('js-beautify').html;
var _isFunction = require('lodash/lang/isFunction');
var _assign = require('lodash/object/assign');

var JadeReactHelpers = function(data, helpers) {
  this.data = data;

  if (helpers) {
    for (var name in helpers) {
      this.registerHelper(name, helpers[name]);
    }
  }
};

/**
 * Register a helper
 * @param  {String} name The name of the helper.
 * @param  {Function} helper The function to be called.
 */
JadeReactHelpers.prototype.registerHelper = function(name, helper) {
  if (!_isFunction(helper)) {
    console.error('second argument must be a function!');
  }
  this[name] = helper;
}

/**
 * Returns a single section, found by its reference number
 * @param  {String|Number} reference The reference number to search for.
 */
JadeReactHelpers.prototype.section = function(reference) {
  var section = this.data.styleguide.section(reference);

  return section ? section.data : {};
}

/**
 * Loop over a section query. If a number is supplied, will convert into
 * a query for all children and descendants of that reference.
 * @param  {Mixed} query The section query
 */
JadeReactHelpers.prototype.eachSection = function(query) {
  var styleguide = this.data.styleguide;
  var buffer = [];
  var sections;
  var i;
  var l;
  query = query || '';

  if (!query.match(/\bx\b|\*/g)) {
    query = query + '.*';
  }
  sections = styleguide.section(query);
  if (!sections) {
    return buffer;
  }

  l = sections.length;
  for (i = 0; i < l; i += 1) {
    buffer.push(sections[i].data);
  }

  return buffer;
}

/**
 * Loop over each section root, i.e. each section only one level deep.
 */
JadeReactHelpers.prototype.eachRoot = function() {
  var buffer = [];
  var sections = this.data.styleguide.section('x');
  var i;
  var l;

  if (!sections) {
    return buffer;
  }

  l = sections.length;
  for (i = 0; i < l; i += 1) {
    buffer.push(sections[i].data);
  }

  return buffer;
}

/**
 * Equivalent to "if the given reference is numeric".
 * @param  {Mixed} reference The KssSection's reference
 */
JadeReactHelpers.prototype.ifNumeric = function(reference) {
  return (typeof reference === 'number' || typeof reference === 'string' && reference.match(/^[\.\d]+$/));
}

/**
 * Equivalent to "if the current reference is X".
 * @param  {Mixed} reference The KssSection's reference
 * @param  {Mixed} context The current section
 */
JadeReactHelpers.prototype.ifReference = function(reference, context) {
  return (context.reference && reference === context.reference);
}


/**
 * Equivalent to "unless the current reference is X".
 * @param  {Mixed} reference The KssSection's reference
 * @param  {Mixed} context The current section
 */
JadeReactHelpers.prototype.unlessReference = function(reference, context) {
  return (!context.reference || reference !== context.reference);
}

/**
 * Equivalent to "if the current section is X levels deep".
 * @param  {Mixed} reference The KssSection's depth
 * @param  {Mixed} context The current section
 */
JadeReactHelpers.prototype.ifDepth = function(depth, context) {
  return (context.depth && depth === context.depth);
}

/**
 * Equivalent to "unless the current section is X levels deep".
 * @param  {Mixed} reference The KssSection's depth
 * @param  {Mixed} context The current section
 */
JadeReactHelpers.prototype.unlessDepth = function(depth, context) {
  return (!context.depth || depth !== context.depth);
}

/**
 * Similar to the eachSection helper, however will loop over each modifier
 * @param  {Object} section Supply a section object to loop over its modifiers.
 */
JadeReactHelpers.prototype.eachModifier = function(section) {
  var modifiers;
  var buffer = [];
  var i;
  var l;

  // set modifiers
  modifiers = section.modifiers || [];

  if (!modifiers) {
    return buffer;
  }

  l = modifiers.length;
  for (i = 0; i < l; i++) {
    buffer.push(modifiers[i].data || {});
  }
  return buffer;
}

/**
 * Similar to the eachSection helper, however will loop over each parameter
 * @param  {Object|KssSection} section Supply a section object to loop over its parameters.
 */
JadeReactHelpers.prototype.eachParameter = function(section) {
  var parameters;
  var buffer = [];
  var i;
  var l;

  // set parameters
  parameters = section.parameters || [];

  if (!parameters) {
    return buffer;
  }

  l = parameters.length;
  for (i = 0; i < l; i++) {
    buffer.push(parameters[i].data || {});
  }
  return buffer;
}

/**
 * Outputs the current section's or modifier's markup.
 * @param  {Object|KssSection} context The current section or modifier
 */
JadeReactHelpers.prototype.markup = function(context) {
  var partials = this.data.partials;
  var section;
  var modifier = false;
  var template;
  var partial;
  var data;
  var renderer;

  if (!context) {
    return '';
  }

  // Determine if the element is a section object or a modifier object.
  if (context.modifiers) {
    // If this is the section object, use the default markup without a modifier class.
    section = new Kss.KssSection(context);
  } else {
    // If this is the markup object, find the modifier class and the section object.
    modifier = new Kss.KssModifier(context);
    section = modifier.section();
  }

  // Load the information about this section's markup partial.
  partial = partials[section.reference()];

  // Prepare the sample data for the partial.
  data = JSON.parse(JSON.stringify(partial.data));
  /*eslint-disable camelcase*/
  if (data.modifier_class) {
    data.modifier_class += ' ';
  } else {
    data.modifier_class = '';
  }
  data.modifier_class += modifier ? modifier.className() : this.data.config.placeholder;
  /*eslint-enable camelcase*/

  // Compile the section's markup partial into a template.
  if (partial.file) {
    // react component
    if (partial.type === 'jsx') {
      renderer = React.createFactory(partial.markup.component);
      template = function() {
        return React.renderToStaticMarkup(
          renderer(_assign({}, data, partial.markup.props))
        );
      };
    } else {
      template = jade.compile('include ' + partial.file, {
        filename: path.basename(partial.file)
      });
    }
  } else {
    template = jade.compile(partial.markup);
  }

  // beautify (for react component)
  return beautify(template(data), {
    "indent_size": 2,
    "indent_with_tabs": false
  });
}

module.exports = JadeReactHelpers;
