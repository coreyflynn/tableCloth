var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watchify = require('watchify');
var browserify = require('browserify');

function browserifyThis(basePath,destPath) {
  var bundler = watchify(browserify(basePath + 'main.js', watchify.args));

  bundler.on('update', bundle);

  function bundle() {
    gutil.log(gutil.colors.magenta('browserify'),basePath)
    return bundler.bundle()
    // log errors if they happen
    .on('error', function(err){gutil.log(gutil.colors.red('Error:'),err.message)})
    .pipe(source('bundle.js'))
    // optional, remove if you dont want sourcemaps
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    .pipe(sourcemaps.write('./')) // writes .map file
    //
    .pipe(gulp.dest(destPath));
  }

  return bundle;
}



module.exports = browserifyThis;
