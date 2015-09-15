require("babel/register");

var gulp = require('gulp');
var kss = require('kss');
var kssGenerator = require('./src/index.js');
var open = require('gulp-open')

gulp.task('kss', function() {
  kss.traverse('./example', { custom: ['DefaultModifier', 'Colors'] }, function(err, styleguide) {
    kssGenerator.init({
      source: ['./example'],
      destination: './styleguide',
      template: './src/template',
      helpers: ['./example/helpers'],
      css: ['../example/styles/style.css'],
      routerHelpers: ['./example/routerHelpers']
    });

    kssGenerator.generate(styleguide);
  });
});

gulp.task('kss:open', function() {
  return gulp.src('./styleguide/index.html')
    .pipe(open());
});

gulp.task('watch', ['kss'], function() {
  gulp.watch(['./src/**/*', './example/**/*'], ['kss']);
});
