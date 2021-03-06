require("babel/register");

var gulp = require('gulp');
var kss = require('kss');
var kssGenerator = require('./src/index.js');
var open = require('gulp-open');
var less = require('gulp-less');
var cssmin = require('gulp-minify-css');

gulp.task('kss', ['less'], function() {
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

gulp.task('less', function() {
  return gulp.src('./src/template/public/kss.less')
    .pipe(less())
    .pipe(cssmin())
    .pipe(gulp.dest('./src/template/public'));
});

gulp.task('watch', ['kss'], function() {
  gulp.watch(['./src/**/*', './example/**/*'], ['kss']);
});
