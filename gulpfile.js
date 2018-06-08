'use strict';


const gulp = require('gulp'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  sass = require('gulp-sass'),
  maps = require('gulp-sourcemaps'),
  del = require('del'),
  useref = require('gulp-useref'),
  iff = require('gulp-if'),
  csso = require('gulp-csso'),
  image = require('gulp-image'),
  connect = require('gulp-connect'),
  gulpSequence = require('gulp-sequence');

  var options = {
    src: 'src',
    dist: 'dist'
  }

  gulp.task('concatScripts', function() {
  return gulp.src([
   'src/js/global.js',
   'src/js/circle/autogrow.js',
   'src/js/circle/circle.js'])
  .pipe(maps.init())
  .pipe(concat('all.min.js'))
  .pipe(maps.write('./'))
  .pipe(gulp.dest(options.dist + '/js'));
});

gulp.task('scripts',['concatScripts'], function(){
  return gulp.src(options.dist + '/js/all.min.js')
  .pipe(uglify())
  // .pipe(rename('all.min.js'))
  .pipe(gulp.dest(options.dist + '/js'));
});

  gulp.task('concatStyles', function() {
    return gulp.src(options.src + "/sass/global.scss")
        .pipe(maps.init())
        .pipe(concat('all.min.css'))
        .pipe(sass())
        .pipe(maps.write('./'))
        .pipe(gulp.dest(options.dist + '/styles'));
  });

  gulp.task('styles',['concatStyles'], function(){
    return gulp.src(options.dist + '/styles/all.min.css')
    .pipe(csso())
    .pipe(gulp.dest(options.dist + '/styles'))
  });

  gulp.task('images', function (){
    return gulp.src(options.src + "/images/*")
    .pipe(image())
    .pipe(gulp.dest(options.dist + '/images'));

  });

  gulp.task('watchFiles', function() {
    gulp.watch(options.src + '/scss/**/*.scss', ['compileSass']);
  })

  gulp.task('clean', function() {
    del([options.dist]);
  });



  gulp.task("files", function() {
    gulp.src([options.src + "/icons/**", options.src + "/index.html"], { base: options.src})
      .pipe(gulp.dest(options.dist));
  });

  gulp.task('watch', function() {
    gulp.watch(options.src + '/sass/**/*.scss', ['styles']);
  });

  gulp.task('serve', function(){
    connect.server({
      root: ['dist'],
      port: 3000
    });
  });

  gulp.task("build", gulpSequence(['clean'],['styles', 'scripts', 'images'], 'files'))

  gulp.task('default', ['build'], function(){
    gulp.start('serve');
  });
