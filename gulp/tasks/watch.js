'use strict';

var config        = require('../config');
var gulp          = require('gulp');

gulp.task('watch', function() {

  gulp.watch('./src/components/*.js', ['build']);

});