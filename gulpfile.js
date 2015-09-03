var gulp = require('gulp'),
	concat = require('gulp-concat'),
    connect = require('gulp-connect'),
	mbf = require('main-bower-files'),
	less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    karma = require('karma').server,
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del');

var paths = {
    styles: ['./app/stylesheets/*.less'],
    scripts: ['./app/modules/**/*.js'],
    html: ['./app/modules/**/*.html'],
    tests: ['./tests/*.js']
};

// clean
gulp.task('clean', function () {
    return del([
        'build/**/*'
    ]);
});

// vendor
gulp.task('vendor-js', ['clean'], function () {
    var jsRegex = (/.*\.js$/i);
	return gulp.src(mbf({ filter: jsRegex }))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('build/scripts'));
});
gulp.task('vendor-css', ['clean'], function () {
    return gulp.src('./bower_components/**/*.min.css')
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest('build/stylesheets'));
});
gulp.task('vendor', ['vendor-js','vendor-css']);

// app
gulp.task('app-js', ['clean'], function () {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.write())
        .pipe(connect.reload())
        .pipe(gulp.dest('build/scripts'));
});
gulp.task('app-html', ['clean'], function () {
    return gulp.src(paths.html)
        .pipe(connect.reload())
        .pipe(gulp.dest('build/modules'));
});
gulp.task('app-css', ['clean'], function () {
    return gulp.src(paths.styles)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(sourcemaps.write())
        .pipe(connect.reload())
        .pipe(gulp.dest('build/stylesheets'));
});
gulp.task('app', ['app-js','app-html','app-css']);

// code linting
gulp.task('lint', function () {
    return gulp.src(paths.scripts)
        .pipe(jshint(process.env.NODE_ENV === 'development' ? { devel: true, debug: true } : {} ))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

// tests
gulp.task('test', function (done) {
    karma.start({
        configFile: 'karma.conf.js',
        singleRun: true
    }, done);
});

// dev server
gulp.task('connect', function () {
    connect.server({
        port: 3000,
        root: 'build',
        livereload: true
    });
});

// watch files
gulp.task('watch', function () {
    gulp.watch(paths.html, ['html']);
    gulp.watch(paths.scripts, ['lint', 'app-js']);
    gulp.watch(paths.styles, ['app-css']);
});

// build
gulp.task('build', ['vendor', 'app', 'lint'], function () {
    return gulp.src('app/index.html')
        .pipe(gulp.dest('build'));
});

// deploy
gulp.task('deploy', ['build'], function () {
    return gulp.src('build/**/*')
        .pipe(gulp.dest('dist'));
});

// default gulp task
gulp.task('default', ['build', 'connect', 'watch']);