var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var gutil = require('gulp-util');

function querySass() {
  var globPath = 'src/scss/**/*.scss';
  var destPath = 'dist/';

    return watch(globPath, function() {
      gutil.log(gutil.colors.magenta('sass'),destPath);
      gulp.src('src/scss/main.scss')
        .pipe(sass())
        .pipe(gulp.dest(destPath))
    });
}

module.exports = querySass;
