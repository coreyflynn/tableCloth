var gulp = require('gulp');
var gutil = require('gulp-util');

/**
 * export a function that bootstraps modules under the './tasks' directory
 * @param  {Array}  tasks An array of strings specifying the modules to
 *                        bootstrap
 * @return {object} the configured gulp object
 */
module.exports = function(tasks) {
    tasks.forEach(function(name) {
        gutil.log('bootstrapping task', gutil.colors.magenta(name));
        gulp.task(name, require('./tasks/' + name));
    });

    return gulp;
};
