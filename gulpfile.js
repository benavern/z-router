/**
 * Generated with Quench (http://quenchjs.com/)
 * adapted by benjamin caradeuc (http://caradeuc.info/)
 */
var gulp         = require('gulp'),
    plumber      = require('gulp-plumber'),
    rename       = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var concat       = require('gulp-concat');
var jshint       = require('gulp-jshint');
var uglify       = require('gulp-uglify');
var minifycss    = require('gulp-minify-css');
var sass         = require('gulp-sass');
var jade         = require('gulp-jade');
var browserSync  = require('browser-sync');

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./docs"
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});


gulp.task('styles', function() {
  gulp.src(['src/sass/**/*.sass'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(sass({indentedSyntax: true}))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest('docs/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest('docs/css/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('scripts', function() {
  return gulp.src(['src/js/ZRouter.js','src/js/app.js'])
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('docs/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('docs/js/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('html', function() {
  gulp.src('src/**/*.jade')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(jade())
    .pipe(gulp.dest('docs/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('download', function() {
  return gulp.src('src/js/ZRouter.js')
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(rename({basename: 'ZRouter'}))
    .pipe(gulp.dest('docs/download/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest('docs/download/'))
});


gulp.task('build', ['html', 'styles', 'scripts', 'download']);

gulp.task('default', ['browser-sync'], function(){
  gulp.watch("src/sass/**/*.sass", ['styles']);
  gulp.watch("src/js/**/*.js", ['scripts', 'download']);
  gulp.watch("src/**/*.html", ['bs-reload']);
  gulp.watch("src/**/*.jade", ['html']);
});
