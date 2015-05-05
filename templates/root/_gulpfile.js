'use strict';
var gulp            = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var browserSync     = require('browser-sync');
var assemble        = require('assemble');
var browserify      = require('browserify');
var source          = require('vinyl-source-stream');
var mainBowerFiles  = require('main-bower-files');
var $ = gulpLoadPlugins();

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
  },
  js: {
    srcDir: 'src/assets/js/',
    modulesEntry: './src/assets/js/main.coffee',
    tmp: '.tmp/js/',
    tmpStandalone: '.tmp/js/standalone/'
  }
};




// Server Tasks
// ----------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------

// Assemble
// ----------------------------------------------------------------------------------------------------------
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
// ----------------------------------------------------------------------------------------------------------
gulp.task('fonts-tmp', function() {
  return gulp.src(paths.fonts.src)
    .pipe($.newer(paths.fonts.tmp))
    .pipe(gulp.dest(paths.fonts.tmp));
});


// Styles
// ----------------------------------------------------------------------------------------------------------
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


// Scripts
// ----------------------------------------------------------------------------------------------------------
// Create your main JS stuff
gulp.task('browserify', function() {
  return browserify({
      entries: paths.js.modulesEntry,
      extensions: ['.coffee', '.js']
    })
    .transform('coffeeify')
    .bundle()
    .pipe(source('browserify.js'))
    .pipe(gulp.dest(paths.js.srcDir));
});

// Get all Bower JS files
gulp.task('bower', function() {
  return gulp.src(mainBowerFiles(), { base: './bower_components' })
    .pipe($.concat('bower.js'))
    .pipe(gulp.dest(paths.js.srcDir));
});

// Get an individual Modernizr build
gulp.task('modernizr', function() {
  gulp.src([paths.js.srcDir + '**/*.js', paths.js.srcDir + '**/*.coffee', paths.css.srcAll])
    .pipe($.modernizr({
      options: [
        'setClasses',
        'addTest',
        'testProp',
        'fnBind'
      ]
    }))
    .pipe(gulp.dest(paths.js.srcDir));
});

// Let standalone scripts be by themselves, e.g. html5shiv
gulp.task('standalone-tmp', function() {
  return gulp.src(paths.js.srcDir + 'standalone/**/*.js')
    .pipe($.uglify())
    .pipe(gulp.dest(paths.js.tmpStandalone));
});

gulp.task('scripts-tmp', ['browserify', 'bower', 'standalone-tmp', 'modernizr'], function() {
  return gulp.src([
      paths.js.srcDir + 'bower.js',
      paths.js.srcDir + 'vendor/*.{js,coffee}',
      paths.js.srcDir + 'modernizr.js',
      paths.js.srcDir + 'browserify.js'
    ])
    .pipe($.concat('build.js'))
    .pipe(gulp.dest(paths.js.tmp));
});


// Browser Sync
// ----------------------------------------------------------------------------------------------------------
gulp.task('browser-sync', ['assemble-tmp', 'fonts-tmp', 'styles-tmp', 'scripts-tmp'], function() {
  browserSync({
    server: {
      baseDir: '.tmp'
    }
  });
});




// Watch Files
// ----------------------------------------------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------------------
gulp.task('watch', function() {
  gulp.watch([paths.assemble.pages, paths.assemble.partials, paths.assemble.data], ['assemble-tmp']);
  gulp.watch(paths.css.srcAll, ['styles-tmp']);
  gulp.watch(paths.css.src, ['fonts-tmp']);
});




// Production Tasks
// ----------------------------------------------------------------------------------------------------------
gulp.task('default', ['browser-sync', 'watch']);
