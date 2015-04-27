var gulp = require('./gulp')([
  'browserify',
  'sass'
]);

// default task
gulp.task('default',['browserify','sass']);
