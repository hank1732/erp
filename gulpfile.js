const gulp = require('gulp');
const concat = require('gulp-concat');
const changed = require('gulp-changed');
// 出错不中断gulp
const plumber = require('gulp-plumber');
const babel = require('gulp-babel');
const series = require('stream-series');
const watch = require('gulp-watch');
const flatten = require('gulp-flatten');
const runSequence = require('run-sequence');
const stylus = require('gulp-stylus');
const inject = require('gulp-inject');
const clean = require('gulp-clean');
const livereload = require('gulp-livereload');

const ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglifyjs');

const codebase = './build'
let files = {};

gulp.task('clean', function() {
  return gulp.src('./build', { read: false })
    .pipe(clean());
});

gulp.task('vendor', function() {
  gulp.src(['./vendor/**/fonts/**.*'])
    .pipe(flatten())
    .pipe(gulp.dest(codebase + '/vendor/fonts'));

  files.vendorScript =
    gulp.src([
      './vendor/jquery/jquery.min.js',
      './vendor/angular/angular.min.js',
      './vendor/angular/angular-resource.min.js',
      './vendor/angular/angular-ui-route.js',
      './vendor/angular/loading-bar.min.js',
      './vendor/angular/ui-bootstrap-tpls-2.5.0.min.js',
      './vendor/angular/ng-file-upload-shim.min.js',
      './vendor/angular/ng-file-upload.min.js',
      './vendor/moment.js',
    ])
    .pipe(changed(codebase))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(codebase + '/vendor/js'));

  files.vendorStyle =
    gulp.src(['./vendor/**/*.css'])
    .pipe(changed(codebase))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(codebase + '/vendor/css'));

});

gulp.task('html', function() {
  gulp.src(['./src/**/*.html'])
    .pipe(plumber())
    .pipe(changed(codebase))
    .pipe(gulp.dest(codebase))
    .pipe(livereload());
});

gulp.task('src-js', function() {
  files.js =
    gulp.src(['./src/index.js', './src/**/*.js'])
    .pipe(changed(codebase))
    .pipe(plumber())
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(concat('main.js'))
    .pipe(ngAnnotate())
    // .pipe(uglify())
    .pipe(gulp.dest(codebase))
    .pipe(livereload());
});

gulp.task('src-styl', function() {
  files.css =
    gulp.src(['./src/**/*.styl'])
    .pipe(changed(codebase))
    .pipe(concat('main.styl'))
    .pipe(stylus())
    .pipe(concat('main.css'))
    .pipe(gulp.dest(codebase))
    .pipe(livereload());
});

gulp.task('inject', function() {
  gulp.src('./src/index.html')
    .pipe(inject(files.vendorStyle, { name: 'vendor', ignorePath: 'build' }))
    .pipe(inject(files.vendorScript, { name: 'vendor', ignorePath: 'build' }))
    .pipe(inject(files.css, { name: 'css', ignorePath: 'build' }))
    .pipe(inject(files.js, { name: 'js', ignorePath: 'build' }))
    .pipe(gulp.dest(codebase));
})

// 开发时，使用watch监测变化并重新build
gulp.task('default', ['build'], function() {
  livereload.listen();
  gulp.watch(['./src/**/*.html'], ['html']);
  gulp.watch(['./src/**/*.styl'], ['src-styl']);
  gulp.watch(['./src/**/*.js'], ['src-js']);
});

gulp.task('build', function() {
  runSequence('clean', 'html', 'vendor', 'src-styl', 'src-js', 'inject')
})
