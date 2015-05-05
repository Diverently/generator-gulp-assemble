'use strict';
var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var $ = gulpLoadPlugins();
var assemble = require('assemble');
var browserSync    = require('browser-sync');

// Paths
var paths = {
  assemble: {
    pages: 'src/pages/**/*.hbs',
    layouts: 'src/layouts/**/*.hbs',
    partials: 'src/partials/**/*.hbs',
    data: 'src/data/*.{json,yml}'
  },
  fonts: {
    src: ['src/assets/fonts/*'],
    tmp: '.tmp/fonts/',
    dest: 'build/fonts/'
  },
  css: {
    src: 'src/assets/css/main.scss',
    srcAll: 'src/assets/css/**/*.scss',
    tmp: '.tmp/css/',
    dest: 'build/css/'
  }
};




// Server Tasks
// ----------------------------------------------------------------------------------------------------------
// Assemble
gulp.task('assemble-tmp', function () {
  // Assemble Options
  assemble.layouts(paths.assemble.layouts);
  assemble.partials(paths.assemble.partials);
  assemble.data(paths.assemble.data);
  assemble.option('layout', 'default');

  return gulp.src(paths.assemble.pages)
    .pipe($.newer({
      dest: './.tmp',
      ext: '.html'
    }))
    .pipe($.assemble(assemble))
    .pipe($.prettyUrl())
    .pipe($.htmlmin())
    .pipe(gulp.dest('./.tmp'))
    .pipe(browserSync.reload({
      stream: true,
      once: true
    }));
});


// Fonts
gulp.task('fonts-tmp', function() {
  return gulp.src(paths.fonts.src)
    .pipe($.newer(paths.fonts.tmp))
    .pipe(gulp.dest(paths.fonts.tmp));
});


// Styles
gulp.task('styles-tmp', function() {
  return gulp.src(paths.css.src)
    .pipe($.sass({
      includePaths: ['css'],
      onError: browserSync.notify
    }))
    .pipe($.autoprefixer(['last 15 versions', '> 1%', 'ie10', 'ie9', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe($.csso())
    .pipe(gulp.dest(paths.css.tmp))
    .pipe(browserSync.reload({
      stream: true,
      once: true
    }));
});


gulp.task('browser-sync', ['assemble-tmp', 'fonts-tmp', 'styles-tmp'], function() {
  browserSync({
    server: {
      baseDir: '.tmp'
    }
  });
});




// Watch Tasks
// ----------------------------------------------------------------------------------------------------------
gulp.task('watch', function() {
  gulp.watch([paths.assemble.pages, paths.assemble.partials, paths.assemble.data], ['assemble-tmp']);
  gulp.watch(paths.css.srcAll, ['styles-tmp']);
  gulp.watch(paths.css.src, ['fonts-tmp']);
});




// Default Task
// ----------------------------------------------------------------------------------------------------------
gulp.task('default', ['browser-sync', 'watch']);
