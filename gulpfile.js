// gulpfile.js

const gulp = require('gulp');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const clean = require('gulp-clean');

var sass = require('gulp-sass');
const connect = require('gulp-connect');


// COPY

/**
 * Copy files from monster template
 */
gulp.task('copy:monster', () => {
  return gulp.src([
      // './monster_template/assets/**/*',
      './monster_template/css/**/*',
      './monster_template/fonts/**/*',
      './monster_template/images/**/*',
      './monster_template/js/**/*',
    ], {base: './monster_template'})
    .pipe(gulp.dest('./dist/'));
});

/**
 * Copy assets from /src
 */
gulp.task('copy:assets', () => {
  return gulp.src([
      './src/assets/**/*',
    ], {base: './src/'})
    .pipe(gulp.dest('./dist/'));
});

// BUILD

/**
 * Build sass file from /src and copy.
 */
gulp.task('build:sass', function () {
  return gulp.src('./src/css/overrides.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css/'));
});

/**
 * Build html from hbs and copy.
 */
gulp.task('build:html', () => {
  return gulp.src('./src/pages/**/*.hbs')
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: ['./src/partials'],
      helpers : {
        menuActive: function(page, item){
          return page==item ? 'active' : '';
        },
        eq(a,b){
          return a===b;
        }
      }
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest('./dist'));
});

/**
 * Copy files needed for functions in functions dir
 */
gulp.task('copy:functions', ['copy:monster', 'copy:assets', 'build:sass', 'build:html'], ()=>{
  return gulp.src([
      './dist/toutes-nos-actualites.html',
      './dist/actualite.html',
      './dist/offres-emploi.html',
      './dist/offre-emploi.html',
    ], {base: './dist'})
    .pipe(gulp.dest('./functions/pages'));
});

/**
 * Cleanup dist dir
 */
gulp.task('cleanup:dist', ['copy:functions'], ()=>{
  return gulp.src([
      './dist/toutes-nos-actualites.html',
      './dist/actualite.html',
      './dist/offres-emploi.html',
      './dist/offre-emploi.html',
    ], {base: './dist', read: false})
    .pipe(clean());
});


/**
 * Full build process
 */
gulp.task('build:full', ['cleanup:dist'], ()=>{
  // Reload after build
  return gulp.src('./dist/*').pipe(connect.reload());
});


// SERVE

/**
 * Serve files from /dist
 */
gulp.task('http:serve', ['build:full'], function() {
  connect.server({
    root: 'dist',
    livereload: true
  });
});


// DEFAULT

gulp.task('default', ['http:serve'], ()=>{
  gulp.watch(['./src/**/*'], ['build:full']);
});

