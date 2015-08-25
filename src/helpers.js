// @TODO Re-enable this eslint rule.
/*eslint-disable valid-jsdoc*/

'use strict';

var _isFunction = require('lodash/lang/isFunction')

var JadeReactHelpers = function(styleguide, helpers) {
  if (!styleguide) {
    console.error('styleguide must be provided!');
  }
  this.styleguide = styleguide;

  if (helpers) {
    for (var name in helpers) {
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
  var section = this.styleguide.section(reference);

  return section ? section.data : {};
}

/**
 * Loop over a section query. If a number is supplied, will convert into
 * a query for all children and descendants of that reference.
 * @param  {Mixed} query The section query
 */
JadeReactHelpers.prototype.eachSection = function(query) {
  var styleguide = this.styleguide;
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
  var sections = this.styleguide.section('x');
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


JadeReactHelpers.prototype.testHelper = function() {
  return this;
}



module.exports = JadeReactHelpers;



// // @TODO Re-enable this eslint rule.
// /*eslint-disable valid-jsdoc*/
//
// 'use strict';
//
// var Kss = require('kss');
//
// function(handlebars, config) {
//   config = config || {};
//
//   /**
//    * Returns a single section, found by its reference number
//    * @param  {String|Number} reference The reference number to search for.
//    */
//   handlebars.registerHelper('section', function(reference, options) {
//     var section = options.data.root.styleguide.section(reference);
//
//     return section ? options.fn(section.data) : false;
//   });
//
//   /**
//    * Loop over a section query. If a number is supplied, will convert into
//    * a query for all children and descendants of that reference.
//    * @param  {Mixed} query The section query
//    */
//   handlebars.registerHelper('eachSection', function(query, options) {
//     var styleguide = options.data.root.styleguide,
//       buffer = '',
//       sections,
//       i, l;
//
//     if (!query.match(/\bx\b|\*/g)) {
//       query = query + '.*';
//     }
//     sections = styleguide.section(query);
//     if (!sections) {
//       return '';
//     }
//
//     l = sections.length;
//     for (i = 0; i < l; i += 1) {
//       buffer += options.fn(sections[i].data);
//     }
//
//     return buffer;
//   });
//
//   /**
//    * Loop over each section root, i.e. each section only one level deep.
//    */
//   handlebars.registerHelper('eachRoot', function(options) {
//     var buffer = '',
//       sections = options.data.root.styleguide.section('x'),
//       i, l;
//
//     if (!sections) {
//       return '';
//     }
//
//     l = sections.length;
//     for (i = 0; i < l; i += 1) {
//       buffer += options.fn(sections[i].data);
//     }
//
//     return buffer;
//   });
//
//   /**
//    * Equivalent to "if the given reference is numeric". e.g:
//    *
//    * {{#ifNumeric reference}}
//    *    REFERENCES LIKE 4.0 OR 4.1.14
//    *   {{else}}
//    *    ANYTHING ELSE
//    * {{/ifNumeric}}
//    */
//   handlebars.registerHelper('ifNumeric', function(reference, options) {
//     return (typeof reference === 'number' || typeof reference === 'string' && reference.match(/^[\.\d]+$/)) ? options.fn(this) : options.inverse(this);
//   });
//
//   /**
//    * Equivalent to "if the current reference is X". e.g:
//    *
//    * {{#ifReference 'base.headings'}}
//    *    IF CURRENT REFERENCE IS base.headings ONLY
//    *   {{else}}
//    *    ANYTHING ELSE
//    * {{/ifReference}}
//    */
//   handlebars.registerHelper('ifReference', function(reference, options) {
//     return (this.reference && reference === this.reference) ? options.fn(this) : options.inverse(this);
//   });
//
//   /**
//    * Equivalent to "unless the current reference is X". e.g:
//    *
//    * {{#unlessReference 'base.headings'}}
//    *    ANYTHING ELSE
//    *   {{else}}
//    *    IF CURRENT REFERENCE IS base.headings ONLY
//    * {{/unlessReference}}
//    */
//   handlebars.registerHelper('unlessReference', function(reference, options) {
//     return (!this.reference || reference !== this.reference) ? options.fn(this) : options.inverse(this);
//   });
//
//   /**
//    * Equivalent to "if the current section is X levels deep". e.g:
//    *
//    * {{#ifDepth 1}}
//    *    ROOT ELEMENTS ONLY
//    *   {{else}}
//    *    ANYTHING ELSE
//    * {{/ifDepth}}
//    */
//   handlebars.registerHelper('ifDepth', function(depth, options) {
//     return (this.depth && depth === this.depth) ? options.fn(this) : options.inverse(this);
//   });
//
//   /**
//    * Equivalent to "unless the current section is X levels deep". e.g:
//    *
//    * {{#unlessDepth 1}}
//    *    ANYTHING ELSE
//    *   {{else}}
//    *    ROOT ELEMENTS ONLY
//    * {{/unlessDepth}}
//    */
//   handlebars.registerHelper('unlessDepth', function(depth, options) {
//     return (!this.depth || depth !== this.depth) ? options.fn(this) : options.inverse(this);
//   });
//
//   /**
//    * Similar to the {#eachSection} helper, however will loop over each modifier
//    * @param  {Object} section Supply a section object to loop over its modifiers. Defaults to the current section.
//    */
//   handlebars.registerHelper('eachModifier', function() {
//     var modifiers,
//       options = arguments[arguments.length - 1],
//       buffer = '',
//       i, l;
//
//     // Default to current modifiers, but allow supplying a custom section.
//     modifiers = (arguments.length > 1 && arguments[0].data) ? arguments[0].data.modifiers : this.modifiers;
//
//     if (!modifiers) {
//       return '';
//     }
//
//     l = modifiers.length;
//     for (i = 0; i < l; i++) {
//       buffer += options.fn(modifiers[i].data || '');
//     }
//     return buffer;
//   });
//
//   /**
//    * Similar to the {#eachSection} helper, however will loop over each parameter
//    * @param  {Object} section Supply a section object to loop over its parameters. Defaults to the current section.
//    */
//   handlebars.registerHelper('eachParameter', function() {
//     var parameters,
//       options = arguments[arguments.length - 1],
//       buffer = '',
//       i, l;
//
//     // Default to current parameters, but allow supplying a custom section.
//     parameters = (arguments.length > 1 && arguments[0].data) ? arguments[0].data.parameters : this.parameters;
//
//     if (!parameters) {
//       return '';
//     }
//
//     l = parameters.length;
//     for (i = 0; i < l; i++) {
//       buffer += options.fn(parameters[i].data || '');
//     }
//     return buffer;
//   });
//
//   /**
//    * Outputs the current section's or modifier's markup.
//    */
//   handlebars.registerHelper('markup', function(options) {
//     var partials = options.data.root.partials,
//       section,
//       modifier = false,
//       template,
//       partial,
//       data;
//
//     if (!this) {
//       return '';
//     }
//
//     // Determine if the element is a section object or a modifier object.
//     if (this.modifiers) {
//       // If this is the section object, use the default markup without a modifier class.
//       section = new Kss.KssSection(this);
//     } else {
//       // If this is the markup object, find the modifier class and the section object.
//       modifier = new Kss.KssModifier(this);
//       section = modifier.section();
//     }
//
//     // Load the information about this section's markup partial.
//     partial = partials[section.reference()];
//
//     // Prepare the sample data for the partial.
//     data = JSON.parse(JSON.stringify(partial.data));
//     /*eslint-disable camelcase*/
//     if (data.modifier_class) {
//       data.modifier_class += ' ';
//     } else {
//       data.modifier_class = '';
//     }
//     data.modifier_class += modifier ? modifier.className() : config.placeholder;
//     /*eslint-enable camelcase*/
//
//     // Compile the section's markup partial into a template.
//     template = handlebars.compile('{{> "' + partial.name + '"}}');
//     // We don't wrap the rendered template in "new handlebars.SafeString()" since
//     // we want the ability to display it as a code sample with {{ }} and as
//     // rendered HTML with {{{ }}}.
//     return template(data);
//   });
// });
