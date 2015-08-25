var gulp = require('gulp');
var kss = require('kss');
var kssGenerator = require('./src/kss_jade_react_generator.js');
var open = require('gulp-open')

gulp.task('kss', function() {
  kss.traverse('./example', {}, function(err, styleguide) {
    kssGenerator.init({
      source: ['./example'],
      destination: './styleguide',
      template: './src/template',
      helpers: []
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
