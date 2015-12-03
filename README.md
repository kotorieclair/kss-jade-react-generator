# kss-jade-react-generator

![owner status](https://img.shields.io/badge/owner-busy-red.svg)

[![NPM](https://nodei.co/npm/kss-jade-react-generator.png)](https://nodei.co/npm/kss-jade-react-generator/)

A [kss-node](http://kss-node.github.io/kss-node/)'s generator - supporting [Jade](http://jade-lang.com/) and [React](https://facebook.github.io/react/) component

**Currently lacks tests**

## Overview
This is mostly a direct translation of the kss-node's default Handlebars generator, but few changes are added.

In addition to Jade, React components can be used as the external markup file.

### Features
- Plain HTML and Jade as inline markup
- Plain HTML, Jade and React component as external files
- Load the custom helpers which can be used within a template
- Custom properties are added to the template (see below for more details)

### Custom Properties
Some custom properties are added for richer style guide creation.

These properties must be set with either following ways:
* With CLI command - Use `--custom` option (see the official kss-node documentation)
* With JavaScript API - Pass the option including `custom` property with `array` value during the initialization (see [gulpfile.js](https://github.com/kotorieclair/kss-jade-react-generator/blob/master/gulpfile.js) for an example)

List of the custom properties:
* DefaultModifier - Specifies the default modifier.
* Colors - Useful for just listing colors.

See the [sample CSS file](https://github.com/kotorieclair/kss-jade-react-generator/tree/master/example/styles/properties.css) for more details.

## Examples
See the [example](https://github.com/kotorieclair/kss-jade-react-generator/tree/master/example) directory for the usage details.

The example style guide using the directory above can be generated through a [Gulp](http://gulpjs.com/) task.
```bash
$ gulp kss
```
Then, open the generated style guide with
```bash
$ gulp kss:open
```
