// Remove after https://github.com/Constellation/doctrine/issues/100 is fixed.
/*eslint-disable valid-jsdoc*/

'use strict';

/**
 * The `kss/generator/jade_react` module loads the kssJadeReactGenerator
 * object, a `{@link KssGenerator}` object using Jade templating.
 * ```
 * var kssJadeReactGenerator = require('kss/generator/jade_react');
 * ```
 * @module kss/generator/jade_react
 */

var KssGenerator = require('kss/generator');
var KssSection = require('kss/lib/kss_section.js');
var JadeReactHelpers = require('./helpers.js');
var fs = require('fs');
var glob = require('glob');
var marked = require('marked');
var path = require('path');
var wrench = require('wrench');
var _assign = require('lodash/object/assign');
var defaultTitle = require('./template/index.js').options;

// Pass a string to KssGenerator() to tell the system which API version is
// implemented by kssJadeReactGenerator.
var kssJadeReactGenerator = new KssGenerator('2.0', {
  'helpers': {
    string: true,
    path: true,
    describe: 'Location of custom helpers; see http://bit.ly/kss-wiki'
  },
  'homepage': {
    string: true,
    multiple: false,
    describe: 'File name of the homepage\'s Markdown file',
    default: 'styleguide.md'
  },
  'placeholder': {
    string: true,
    multiple: false,
    describe: 'Placeholder text to use for modifier classes',
    default: '[modifier class]'
  }
});

/**
 * Initialize the style guide creation process.
 *
 * This method is given a configuration JSON object with the details of the
 * requested style guide generation. The generator can use this information for
 * any necessary tasks before the KSS parsing of the source files.
 *
 * @alias module:kss/generator/jade_react.init
 * @param {Object} config Configuration object for the style guide generation.
 */
kssJadeReactGenerator.init = function(config) {
  var i;
  var j;
  var helper;

  // Save the configuration parameters.
  this.config = config;
  this.config.helpers = this.config.helpers || [];
  this.config.homepage = this.config.homepage || this.options.homepage.default;
  this.config.placeholder = this.config.placeholder || this.options.placeholder.default;
  this.config.title = this.config.title || defaultTitle.title.default;
  this.helpers = {};

  console.log('');
  console.log('kssJadeReactGenerator');
  console.log('Generating your KSS style guide!');
  console.log('');
  console.log(' * KSS Source  : ' + this.config.source.join(', '));
  console.log(' * Destination : ' + this.config.destination);
  console.log(' * Template    : ' + this.config.template || './template');
  if (this.config.helpers) {
    console.log(' * Helpers     : ' + this.config.helpers.join(', '));
  }
  console.log('');

  // Create a new destination directory.
  try {
    fs.mkdirSync(this.config.destination);
  } catch (e) {
    // empty
  }

  // Optionally, copy the contents of the template's "public" folder.
  try {
    wrench.copyDirSyncRecursive(
      this.config.template + '/public',
      this.config.destination + '/public',
      {
        forceDelete: true,
        excludeHiddenUnix: true
      }
    );
  } catch (e) {
    // empty
  }

  // Ensure a "public" folder exists.
  try {
    fs.mkdirSync(this.config.destination + '/public');
  } catch (e) {
    // empty
  }

  // Store the global Jade object.
  this.jade = require('jade');

  // Load the config's helpers.
  if (this.config.helpers.length > 0) {
    for (i = 0; i < this.config.helpers.length; i++) {
      if (fs.existsSync(this.config.helpers[i])) {
        // Load custom helpers.
        var helperFiles = fs.readdirSync(this.config.helpers[i]);

        for (j = 0; j < helperFiles.length; j++) {
          if (path.extname(helperFiles[j]) === '.js') {
            helper = require(path.resolve(this.config.helpers[i] + '/' + helperFiles[j]));
            if (typeof helper === 'object') {
              this.helpers = _assign({}, this.helpers, helper);
            }
          }
        }
      }
    }
  }

  // Compile the jade template.
  this.template = this.jade.compileFile(this.config.template + '/index.jade', {
    pretty: true
  });
};

/**
 * Generate the HTML files of the style guide given a KssStyleguide object.
 *
 * @alias module:kss/generator/jade_react.generate
 * @param {KssStyleguide} styleguide The KSS style guide in object format.
 */
kssJadeReactGenerator.generate = function(styleguide) {
  var sections = styleguide.section();
  var sectionCount = sections.length;
  var sectionRoots = [];
  var rootCount;
  var currentRoot;
  var childSections = [];
  var partials = {};
  var partial;
  var files = [];
  var i;
  var key;
  var bundler;

  console.log(styleguide.data.files.map(function(file) {
    return ' - ' + file;
  }).join('\n'));

  // Throw an error if no KSS sections are found in the source files.
  if (sectionCount === 0) {
    throw new Error('No KSS documentation discovered in source files.');
  }

  console.log('...Determining section markup:');

  for (i = 0; i < sectionCount; i += 1) {
    // Register all the markup blocks as Jade partials.
    if (sections[i].markup()) {
      partial = {
        name: sections[i].reference(),
        reference: sections[i].reference(),
        file: '',
        type: '',
        markup: sections[i].markup(),
        data: {}
      };
      // If the markup is a file path, attempt to load the file.
      if (partial.markup.match(/^[^\n]+\.(html|jade|jsx)$/)) {
        partial.file = partial.markup;
        partial.name = path.basename(partial.file, path.extname(partial.file));
        files = [];
        for (key in this.config.source) {
          if (!files.length) {
            files = glob.sync(this.config.source[key] + '/**/' + partial.file);
          }
        }
        // If the markup file is not found, note that in the style guide.
        if (!files.length) {
          partial.markup += ' NOT FOUND!';
        }
        console.log(' - ' + partial.reference + ': ' + partial.markup);
        if (files.length) {
          // Load the partial's markup from file.
          partial.file = files[0];
          partial.type = path.extname(partial.file).replace('.', '');
          if (partial.type === 'jsx') {
            partial.markup = require(path.resolve(partial.file));
          } else {
            partial.markup = fs.readFileSync(partial.file, 'utf8');
          }
          // Load sample data for the partial from the sample .json file.
          if (fs.existsSync(path.dirname(partial.file) + '/' + partial.name + '.json')) {
            try {
              partial.data = require(path.dirname(partial.file) + '/' + partial.name + '.json');
            } catch (e) {
              partial.data = {};
            }
          }
        }
      } else {
        console.log(' - ' + partial.reference + ': inline markup');
      }
      // Save the name of the partial and its data for retrieval in the markup
      // helper, where we only know the reference.
      partials[partial.reference] = partial;
    }

    // Accumulate all of the sections' first indexes
    // in case they don't have a root element.
    currentRoot = sections[i].reference().split(/(?:\.|\ \-\ )/)[0];
    if (sectionRoots.indexOf(currentRoot) === -1) {
      sectionRoots.push(currentRoot);
    }
  }

  console.log('...Generating style guide sections:');

  // Now, group all of the sections by their root
  // reference, and make a page for each.
  rootCount = sectionRoots.length;
  for (i = 0; i < rootCount; i += 1) {
    childSections = styleguide.section(sectionRoots[i] + '.*');

    this.generatePage(styleguide, childSections, sectionRoots[i], sectionRoots, partials);
  }

  // Generate the homepage.
  childSections = [];
  this.generatePage(styleguide, childSections, 'styleguide.homepage', sectionRoots, partials);
};

/**
 * Renders the Jade template for a section and saves it to a file.
 *
 * @alias module:kss/generator/jade_react.generatePage
 * @param {KssStyleguide} styleguide The KSS style guide in object format.
 * @param {Array} sections An array of KssSection objects.
 * @param {string} root The current section's reference.
 * @param {Array} sectionRoots An array of section references for all sections at the root of the style guide.
 * @param {Object} partials A hash of the names and data of the registered Jade partials.
 */
kssJadeReactGenerator.generatePage = function(styleguide, sections, root, sectionRoots, partials) {
  var filename = '';
  var files;
  var homepageText = false;
  var styles = '';
  var scripts = '';
  var customFields = this.config.custom;
  var key;
  var data;

  if (root === 'styleguide.homepage') {
    filename = 'index.html';
    console.log(' - homepage');
    // Ensure homepageText is a non-false value.
    for (key in this.config.source) {
      if (!homepageText) {
        try {
          files = glob.sync(this.config.source[key] + '/**/' + this.config.homepage);
          if (files.length) {
            homepageText = ' ' + marked(fs.readFileSync(files[0], 'utf8'));
          }
        } catch (e) {
          // empty
        }
      }
    }
    if (!homepageText) {
      homepageText = ' ';
      console.log('   ...no homepage content found in ' + this.config.homepage + '.');
    }
  } else {
    filename = 'section-' + KssSection.prototype.encodeReferenceURI(root) + '.html';
    console.log(
      ' - section ' + root + ' [',
      styleguide.section(root) ? styleguide.section(root).header() : 'Unnamed',
      ']'
    );
  }
  // Create the HTML to load the optional CSS and JS.
  /*eslint-disable guard-for-in*/
  for (key in this.config.css) {
    styles = styles + '<link rel="stylesheet" href="' + this.config.css[key] + '">\n';
  }
  for (key in this.config.js) {
    scripts = scripts + '<script src="' + this.config.js[key] + '"></script>\n';
  }
  /*eslint-enable guard-for-in*/

  /*eslint-disable key-spacing*/
  data = {
    partials:     partials,
    styleguide:   styleguide,
    sectionRoots: sectionRoots,
    sections:     sections.map(function(section) {
      return section.toJSON(customFields);
    }),
    rootName:     root,
    config:       this.config || {},
    homepage:     homepageText,
    styles:       styles,
    scripts:      scripts
  };

  data.helpers = new JadeReactHelpers(data, this.helpers);

  fs.writeFileSync(this.config.destination + '/' + filename, this.template(data));
  /*eslint-enable key-spacing*/
};

module.exports = kssJadeReactGenerator;
