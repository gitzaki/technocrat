// ==== SETUP ==== //

// Project configuration
var project     = 'pendrell'
  , build       = './build/'
  , dist        = './dist/'+project+'/'
  , source      = './src/' // 'source' instead of 'src' to avoid confusion with gulp.src
  , lang        = 'languages/'
  , bower       = './bower_components/'
;

// Ubik components (array); ubikPlugins specifies optional theme-specific components; ubikCore is required for this theme to function
var ubikPlugins = ['admin', 'analytics', 'cleaner', 'comments', 'excluder', 'feed', 'lingual', 'markdown', 'places', 'post-formats', 'quick-terms', 'recordpress', 'series', 'seo']
  , ubikCore    = ['excerpt', 'favicons', 'imagery', 'meta', 'search', 'terms', 'time', 'title']
  , ubik        = ubikCore.concat(ubikPlugins)
;

// Initialization sequence
var gulp        = require('gulp')
  , gutil       = require('gulp-util')
  , plugins     = require('gulp-load-plugins')({ camelize: true })  // This loads all modules prefixed with "gulp-" to plugin.moduleName
  , del         = require('del')
;



// ==== STYLES ==== //

// Stylesheet handling; don't forget `gem install sass`; Compass is not included by default here
gulp.task('styles', function() {
  return gulp.src([source+'scss/*.scss', '!'+source+'scss/_*.scss']) // Ignore partials
  .pipe(plugins.rubySass({
    loadPath: bower // Adds the `bower_components` directory to the load path so you can @import directly
  , precision: 8
  , 'sourcemap=none': true // Not yet ready for prime time! Sass 3.4 has sourcemaps on by default but this causes some problems from the Gulp toolchain
  }))
  .pipe(plugins.autoprefixer('last 2 versions', 'ie 9', 'ios 6', 'android 4'))
  .pipe(gulp.dest(build))
  .pipe(plugins.rename({suffix: '.min'}))
  .pipe(plugins.minifyCss({ keepSpecialComments: 1 }))
  .pipe(gulp.dest(build));
});



// ==== SCRIPTS ==== //

// Scripts broken out into different tasks to create specific bundles which are then compressed in place
// Rationale: why bother letting WP queue individual scripts when we can easily roll bundles for all occasions?
// @TODO: a better bundling method; this is getting out of hand...
gulp.task('scripts', [
    'scripts-lint',
    'scripts-html5',
    'scripts-contact',
    'scripts-core',
    'scripts-prism',
    'scripts-pg8',
    'scripts-pf',
    'scripts-pf-prism',
    'scripts-pg8-pf',
    'scripts-pg8-prism',
    'scripts-pg8-pf-prism',
    'scripts-xn8',
    'scripts-xn8-prism'
  ], function(){
  return gulp.src([build+'js/**/*.js', '!'+build+'js/**/*.min.js']) // Avoid recursive min.min.min.js
  .pipe(plugins.rename({suffix: '.min'}))
  .pipe(plugins.uglify())
  .pipe(gulp.dest(build+'js/'));
});

// Only lint custom scripts; ignore the error-riddled custom build of Prism
gulp.task('scripts-lint', function() {
  return gulp.src([source+'js/**/*.js', '!'+source+'js/prism.js'])
  .pipe(plugins.jshint('.jshintrc'))
  .pipe(plugins.jshint.reporter('default'));
});

// HTML5 shiv that originally came with Twenty Twelve; provides backwards compatibility with legacy IE browsers: https://github.com/aFarkas/html5shiv
gulp.task('scripts-html5', function() {
  return gulp.src(bower+'html5shiv/dist/html5shiv.js')
  .pipe(gulp.dest(build+'js/'));
});

// Contact form standalone script (not integrated into any general bundle)
gulp.task('scripts-contact', function() {
  return gulp.src([
    bower+'jquery-validation/dist/jquery.validate.js'
  , source+'js/contact-form.js'
  ])
  .pipe(plugins.concat('contact-form.js'))
  .pipe(gulp.dest(build+'js/'));
});

// These are the core custom scripts
gulp.task('scripts-core', function() {
  return gulp.src([
    source+'js/navigation.js'
  , source+'js/core.js'
  ])
  .pipe(plugins.concat('p-core.js'))
  .pipe(gulp.dest(build+'js/'));
});

// Prism code highlighting; roll your own at http://prismjs.com/
gulp.task('scripts-prism', ['scripts-core'], function() {
  return gulp.src([
    source+'js/prism.js'
  , build+'js/p-core.js'
  ])
  .pipe(plugins.concat('p-prism.js'))
  .pipe(gulp.dest(build+'js/'));
});

// Page Loader: loads the next page of content with jQuery/AJAX
gulp.task('scripts-pg8', ['scripts-core'], function() {
  return gulp.src([
    bower+'html5-history-api/history.iegte8.js'
  , bower+'spin.js/spin.js'
  , bower+'spin.js/jquery.spin.js'
  , source+'js/page-loader.js'
  , build+'js/p-core.js'
  ])
  .pipe(plugins.concat('p-pg8.js'))
  .pipe(gulp.dest(build+'js/'));
});

// Page Loader
gulp.task('scripts-pg8-prism', ['scripts-core'], function() {
  return gulp.src([
    bower+'html5-history-api/history.iegte8.js'
  , bower+'spin.js/spin.js'
  , bower+'spin.js/jquery.spin.js'
  , source+'js/page-loader.js'
  , source+'js/prism.js'
  , build+'js/p-core.js'
  ])
  .pipe(plugins.concat('p-pg8-prism.js'))
  .pipe(gulp.dest(build+'js/'));
});

// Picturefill
gulp.task('scripts-pf', ['scripts-core'], function() {
  return gulp.src([
    bower+'picturefill/dist/picturefill.js'
  , build+'js/p-core.js'
  ])
  .pipe(plugins.concat('p-pf.js'))
  .pipe(gulp.dest(build+'js/'));
});

// Picturefill + Prism
gulp.task('scripts-pf-prism', ['scripts-core'], function() {
  return gulp.src([
    bower+'picturefill/dist/picturefill.js'
  , source+'js/prism.js'
  , build+'js/p-core.js'
  ])
  .pipe(plugins.concat('p-pf.js'))
  .pipe(gulp.dest(build+'js/'));
});

// Page Loader + Picturefill
gulp.task('scripts-pg8-pf', ['scripts-core'], function() {
  return gulp.src([
    bower+'html5-history-api/history.iegte8.js'
  , bower+'spin.js/spin.js'
  , bower+'spin.js/jquery.spin.js'
  , source+'js/page-loader.js'
  , bower+'picturefill/dist/picturefill.js'
  , build+'js/p-core.js'
  ])
  .pipe(plugins.concat('p-pg8-pf.js'))
  .pipe(gulp.dest(build+'js/'));
});

// Page Loader + Picturefill + Prism
gulp.task('scripts-pg8-pf-prism', ['scripts-core'], function() {
  return gulp.src([
    bower+'html5-history-api/history.iegte8.js'
  , bower+'spin.js/spin.js'
  , bower+'spin.js/jquery.spin.js'
  , source+'js/page-loader.js'
  , source+'js/prism.js'
  , bower+'picturefill/dist/picturefill.js'
  , build+'js/p-core.js'
  ])
  .pipe(plugins.concat('p-pg8-pf-prism.js'))
  .pipe(gulp.dest(build+'js/'));
});

// Ajaxinate: brute-force page loading with jQuery/AJAX; the order of dependencies is important here
gulp.task('scripts-xn8', ['scripts-core'], function() {
  return gulp.src([
    bower+'html5-history-api/history.iegte8.js'
  , bower+'spin.js/spin.js'
  , bower+'spin.js/jquery.spin.js'
  , bower+'ajaxinate/src/ajaxinate.js'
  , bower+'ajaxinate-wp/src/ajaxinate-wp.js'
  , source+'js/ajaxinate.js'
  , build+'js/p-core.js'
  ])
  .pipe(plugins.concat('p-xn8.js'))
  .pipe(gulp.dest(build+'js/'));
});

// Ajaxinate + Prism
gulp.task('scripts-xn8-prism', ['scripts-core'], function() {
  return gulp.src([
    bower+'html5-history-api/history.iegte8.js'
  , bower+'spin.js/spin.js'
  , bower+'spin.js/jquery.spin.js'
  , bower+'ajaxinate/src/ajaxinate.js'
  , bower+'ajaxinate-wp/src/ajaxinate-wp.js'
  , source+'js/ajaxinate.js'
  , source+'js/prism.js'
  , build+'js/p-core.js'
  ])
  .pipe(plugins.concat('p-xn8-prism.js'))
  .pipe(gulp.dest(build+'js/'));
});



// ==== IMAGES ==== //

// Copy images; minification occurs during packaging
gulp.task('images', function() {
  return gulp.src(source+'**/*(*.png|*.jpg|*.jpeg|*.gif)')
  .pipe(gulp.dest(build));
});



// ==== LANGUAGES ==== //

// Copy everything under `src/languages` indiscriminately
gulp.task('languages', function() {
  return gulp.src(source+lang+'**/*')
  .pipe(gulp.dest(build+lang));
});



// ==== PHP ==== //

gulp.task('php', ['php-core', 'ubik']);

// Copy PHP source files to the build directory
gulp.task('php-core', function() {
  return gulp.src(source+'**/*.php')
  .pipe(gulp.dest(build));
});



// ==== UBIK ==== //

// Copy Ubik components into the `build/modules` directory
gulp.task('ubik', function() {

  // Iterate through the Ubik array and wrap each plugin in the glob pattern
  ubik.forEach(function(plugin, i, array) {
    array[i] = bower+'ubik-'+plugin+'/**/*';
  });

  // Ignore patterns and integrate Ubik core
  var ubikIgnore = ['!'+bower+'ubik*/**/*.json', '!'+bower+'ubik*/**/readme.*'];
  ubik = ubik.concat(bower+'ubik/**/*', ubikIgnore);

  // Copy components
  return gulp.src(ubik)
  .pipe(gulp.dest(build+'modules'));
});



// ==== DISTRIBUTION ==== //

// Prepare a distribution, the properly minified, uglified, and sanitized version of the theme ready for installation

// Clean out junk files after build
gulp.task('clean', ['build'], function(cb) {
  del([build+'**/.DS_Store'], cb)
});

// Totally wipe the contents of the distribution folder after doing a clean build
gulp.task('dist-wipe', ['clean'], function(cb) {
  del([dist], cb)
});

// Copy everything in the build folder (except previously minified stylesheets) to the `dist/project` folder
gulp.task('dist-copy', ['dist-wipe'], function() {
  return gulp.src([build+'**/*', '!'+build+'**/*.min.css'])
  .pipe(gulp.dest(dist));
});

// Minify stylesheets in place
gulp.task('dist-styles', ['dist-copy'], function() {
  return gulp.src([dist+'**/*.css', '!'+dist+'**/*.min.css'])
  .pipe(plugins.minifyCss({ keepSpecialComments: 1 }))
  .pipe(gulp.dest(dist));
});

// Optimize images in place
gulp.task('dist-images', ['dist-styles'], function() {
  return gulp.src([dist+'**/*.png', dist+'**/*.jpg', dist+'**/*.jpeg', dist+'**/*.gif', '!'+dist+'screenshot.png'])
  .pipe(plugins.imagemin({
    optimizationLevel: 7
  , progressive: true
  , interlaced: true
  }))
  .pipe(gulp.dest(dist));
});



// ==== BOWER ==== //

// Executed on `bower update` which is in turn triggered by `npm update`; use this to manually copy front-end dependencies into your working source folder
gulp.task('bower', ['bower-normalize']);

// Used to get around Sass's inability to properly @import vanilla CSS
gulp.task('bower-normalize', function() {
  return gulp.src(bower+'normalize.css/normalize.css')
  .pipe(plugins.rename('_base_normalize.scss'))
  .pipe(gulp.dest(source+'scss'));
});



// ==== WATCH & RELOAD ==== //

// Start the livereload server; not asynchronous
gulp.task('server', ['build'], function() {
  plugins.livereload.listen(35729, function (err) {
    if (err) {
      return console.log(err);
    };
  });
});

// Watch task: build stuff when files are modified, livereload when anything in the `build` or `dist` folders change
gulp.task('watch', ['server'], function() {
  gulp.watch(source+'scss/**/*.scss', ['styles']);
  gulp.watch([source+'js/**/*.js', bower+'**/*.js'], ['scripts']);
  gulp.watch(source+'**/*(*.png|*.jpg|*.jpeg|*.gif)', ['images']);
  gulp.watch(source+'**/*.php', ['php']);
  gulp.watch([build+'**/*', dist+'**/*']).on('change', function(file) {
    plugins.livereload.changed(file.path);
  });
});



// ==== TASKS ==== //

// Build styles and scripts; copy PHP files
gulp.task('build', ['styles', 'scripts', 'images', 'languages', 'php']);

// Release creates a clean distribution package under `dist` after running build, clean, and wipe in sequence
// NOTE: this is a resource-intensive task; @TODO: integrate deployment and git updating?
gulp.task('dist', ['dist-images']);

// The default task runs watch which boots up the Livereload server after an initial build is finished
gulp.task('default', ['watch']);
