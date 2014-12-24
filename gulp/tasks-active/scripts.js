// ==== SCRIPTS ==== //

var gulp        = require('gulp')
  , plugins     = require('gulp-load-plugins')({ camelize: true })
  , merge       = require('merge-stream')
  , config      = require('../config').scripts
;

// Check core scripts for errors
gulp.task('scripts-lint', function() {
  return gulp.src(config.lint.src)
  .pipe(plugins.jshint('.jshintrc'))
  .pipe(plugins.jshint.reporter('default')); // No need to pipe this anywhere
});

// Generate an array of script bundles defined in the configuration file
// Adapted from https://github.com/gulpjs/gulp/blob/master/docs/recipes/running-task-steps-per-folder.md
gulp.task('scripts-bundle', ['scripts-lint'], function(){
  var bundles = []
    , chunks = [];

  // Iterate through all bundles defined in the configuration object
  for (var bundle in config.bundles) {
    if (config.bundles.hasOwnProperty(bundle)) {

      // Iterate through each bundle and mash the chunks together
      config.bundles[bundle].forEach(function(chunk){
        chunks = chunks.concat(config.chunks[chunk]);
      });

      // Push the results to the bundles array
      bundles.push( [bundle, chunks] );
    }
  }

  // Define the task for each bundle
  var tasks = bundles.map(function(bundle) {
    var name = bundle[0].replace(/_/g, '-') // Replace underscores with hyphens
      , src = bundle[1];

    return gulp.src(src)
    .pipe(plugins.concat(config.namespace + name + '.js'))
    .pipe(gulp.dest(config.dest));
  });

  // Cross the streams
  return merge(tasks);
});

// Minify scripts in place
gulp.task('scripts-minify', ['scripts-bundle'], function(){
  return gulp.src(config.minify.src)
  .pipe(plugins.rename(config.minify.rename))
  .pipe(plugins.uglify(config.minify.uglify))
  .pipe(gulp.dest(config.minify.dest));
});

// Master script task; lint -> bundle -> minify
gulp.task('scripts', ['scripts-minify']);
