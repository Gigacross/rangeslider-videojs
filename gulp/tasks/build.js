'use strict';

var concat = require('gulp-concat');
var gulp   = require('gulp');
 
gulp.task('build', ['clean'], function() {
  return gulp.src(['./src/top.js',
                   './src/components/RangeSlider.js',
                   './src/components/player.js',
                   './src/components/RSTimeBar.js', 
                   './src/components/SeekRSBar.js', 
                   './src/components/SelectionBar.js',
                   './src/components/SelectionBarLeft.js',
                   './src/components/SelectionBarRight.js',
                   './src/components/TimePanel.js',
                   './src/components/TimePanelLeft.js',
                   './src/components/TimePanelRight.js',
                   './src/components/ControlTimePanel.js',
                   './src/components/ControlTimePanelLeft.js',
                   './src/components/ControlTimePanelRight.js', 
                   './src/tail.js'])
    .pipe(concat('rangeslider.js'))
    .pipe(gulp.dest('./dist/'));
});