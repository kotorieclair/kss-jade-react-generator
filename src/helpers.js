// @TODO Re-enable this eslint rule.
/*eslint-disable valid-jsdoc*/

'use strict';

var Kss = require('kss');
var jade = require('jade');
var _isFunction = require('lodash/lang/isFunction');

var JadeReactHelpers = function(data) {
  this.data = data;

  if (data.config.helpers) {
    for (var name in data.config.helpers) {
      this.registerHelper(name, helpers[name]);
    }
  }
};

/**
 * Register a helper
 * @param  {String|Number} reference The reference number to search for.
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
 * Equivalent to "if the given reference is numeric". e.g:
 *
 * {{#ifNumeric reference}}
 *    REFERENCES LIKE 4.0 OR 4.1.14
 *   {{else}}
 *    ANYTHING ELSE
 * {{/ifNumeric}}
 */
JadeReactHelpers.prototype.ifNumeric = function(reference) {
  return (typeof reference === 'number' || typeof reference === 'string' && reference.match(/^[\.\d]+$/));
}

/**
 * Equivalent to "if the current reference is X". e.g:
 *
 * {{#ifReference 'base.headings'}}
 *    IF CURRENT REFERENCE IS base.headings ONLY
 *   {{else}}
 *    ANYTHING ELSE
 * {{/ifReference}}
 */
JadeReactHelpers.prototype.ifReference = function(reference, context) {
  return (context.reference && reference === context.reference);
}


/**
 * Equivalent to "unless the current reference is X". e.g:
 *
 * {{#unlessReference 'base.headings'}}
 *    ANYTHING ELSE
 *   {{else}}
 *    IF CURRENT REFERENCE IS base.headings ONLY
 * {{/unlessReference}}
 */
JadeReactHelpers.prototype.unlessReference = function(reference, context) {
  return (!context.reference || reference !== context.reference);
}

/**
 * Equivalent to "if the current section is X levels deep". e.g:
 *
 * {{#ifDepth 1}}
 *    ROOT ELEMENTS ONLY
 *   {{else}}
 *    ANYTHING ELSE
 * {{/ifDepth}}
 */
JadeReactHelpers.prototype.ifDepth = function(depth, context) {
  return (context.depth && depth === context.depth);
}

/**
 * Equivalent to "unless the current section is X levels deep". e.g:
 *
 * {{#unlessDepth 1}}
 *    ANYTHING ELSE
 *   {{else}}
 *    ROOT ELEMENTS ONLY
 * {{/unlessDepth}}
 */
JadeReactHelpers.prototype.unlessDepth = function(depth, context) {
  return (!context.depth || depth !== context.depth);
}

/**
 * Similar to the {#eachSection} helper, however will loop over each modifier
 * @param  {Object} section Supply a section object to loop over its modifiers. Defaults to the current section.
 */
JadeReactHelpers.prototype.eachModifier = function(context) {
  var modifiers;
  // var options = arguments[arguments.length - 1],
  var buffer = [];
  var i;
  var l;

  // Default to current modifiers, but allow supplying a custom section.
  modifiers = (arguments.length > 1 && arguments[0].data) ? arguments[0].data.modifiers : context.modifiers;

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
 * Similar to the {#eachSection} helper, however will loop over each parameter
 * @param  {Object} section Supply a section object to loop over its parameters. Defaults to the current section.
 */
JadeReactHelpers.prototype.eachParameter = function(context) {
  var parameters;
  // var options = arguments[arguments.length - 1];
  var buffer = [];
  var i;
  var l;

  // Default to current parameters, but allow supplying a custom section.
  parameters = (arguments.length > 1 && arguments[0].data) ? arguments[0].data.parameters : context.parameters;

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
 */
JadeReactHelpers.prototype.markup = function(context) {
  var partials = this.data.partials;
  var section;
  var modifier = false;
  var template;
  var partial;
  var data;

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
  // template = handlebars.compile('{{> "' + partial.name + '"}}');
  // Compile the section's markup partial into a template.
  if (partial.file) {
    template = jade.compile('include ' + partial.file);
  } else {
    template = jade.compile(partial.markup);
  }

  // We don't wrap the rendered template in "new handlebars.SafeString()" since
  // we want the ability to display it as a code sample with {{ }} and as
  // rendered HTML with {{{ }}}.
  return template(data);
}

module.exports = JadeReactHelpers;
