const { src, dest, series, parallel } = require("gulp");
const gulppostcss = require('gulp-postcss');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');

// a function for HTML tasks
function htmlTask() {
  return src('src/*.html')
    .pipe(dest('dist/'))
}

// a function for JS file tasks
function scriptTask() {
  return src('src/script/*.js')
  .pipe(sourcemaps.init())
  .pipe(concat('all.js'))
  .pipe(sourcemaps.write())
  .pipe(dest('dist/script'))
}

// a function for CSS files tasks
function stylesTask() {
  return src('src/css/*.css')
    .pipe(sourcemaps.init())
    .pipe(gulppostcss([ autoprefixer(), cssnano() ]))
    .pipe(concat('all.css'))
    .pipe(sourcemaps.write())
    .pipe(dest('dist/css'))
}

exports.default = series(htmlTask,  parallel(scriptTask, stylesTask));