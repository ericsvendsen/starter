var gulp = require('gulp'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    mbf = require('main-bower-files'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    karma = require('karma').server,
    sourcemaps = require('gulp-sourcemaps'),
    del = require('del'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    ngAnnotate = require('gulp-ng-annotate');

var paths = {
    styles: ['./app/stylesheets/*.less'],
    scripts: ['./app/modules/**/*.js'],
    html: ['./app/modules/**/*.html'],
    tests: ['./tests/*.js']
};

// clean
gulp.task('clean', function () {
    return del([
        './build/**/*'
    ]);
});

// vendor scripts
gulp.task('vendor-js', ['clean'], function () {
    var jsRegex = (/.*\.js$/i);
    return gulp.src(mbf({ filter: jsRegex }))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./build/scripts'));
});

// vendor css
gulp.task('vendor-css', ['clean'], function () {
    return gulp.src('./bower_components/**/*.min.css')
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest('./build/stylesheets'));
});

// vendor fonts
gulp.task('fontawesome', ['clean'], function () {
    return gulp.src('./bower_components/fontawesome/fonts/**/*.{ttf,woff,woff2,eof,svg}')
        .pipe(gulp.dest('./build/fonts'));
});
gulp.task('vendor-fonts', ['fontawesome']);

gulp.task('vendor-build', ['vendor-js', 'vendor-css', 'vendor-fonts']);

// app
var appJs = function () {
    return gulp.src(paths.scripts)
        .pipe(concat('app.js'))
        .pipe(ngAnnotate({ single_quotes: true }))
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/scripts'));
};
gulp.task('app-js', ['clean'], appJs);
gulp.task('app-js-watch', appJs);

var appHtml = function () {
    return gulp.src(paths.html)
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/modules'));
};
gulp.task('app-html', ['clean'], appHtml);
gulp.task('app-html-watch', appHtml);

var appCss = function () {
    return gulp.src(paths.styles)
        .pipe(less())
        .pipe(connect.reload())
        .pipe(gulp.dest('./build/stylesheets'));
};
gulp.task('app-css', ['clean'], appCss);
gulp.task('app-css-watch', appCss);

gulp.task('app-build', ['app-js', 'app-html', 'app-css']);

// code linting
gulp.task('lint', function () {
    return gulp.src(paths.scripts)
        .pipe(jshint({ devel: true, debug: true }))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

// uglify
gulp.task('uglify-vendor-js', ['build'], function () {
    gulp.src('./build/scripts/vendor.js')
        .pipe(uglify())
        .pipe(gulp.dest('./build/scripts'));
});

gulp.task('uglify-app-js', ['build'], function () {
    gulp.src('./build/scripts/app.js')
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/scripts'));
});

gulp.task('uglify-app-css', ['build'], function () {
    gulp.src('./build/stylesheets/style.css')
        .pipe(sourcemaps.init())
        .pipe(minifyCss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./build/stylesheets'));
});
gulp.task('uglify', ['uglify-vendor-js', 'uglify-app-js', 'uglify-app-css']);

// tests
gulp.task('test', function (done) {
    karma.start({
        configFile: 'karma.conf.js',
        singleRun: true
    }, done);
});

// dev server
gulp.task('connect', ['build'], function () {
    connect.server({
        port: 3000,
        root: 'build',
        livereload: true
    });
});

// watch files
gulp.task('watch', ['connect'], function () {
    gulp.watch(paths.html, ['app-html-watch']);
    gulp.watch(paths.scripts, ['lint', 'app-js-watch']);
    gulp.watch(paths.styles, ['app-css-watch']);
});

// build
gulp.task('build', ['vendor-build', 'app-build', 'lint'], function () {
    return gulp.src('app/index.html')
        .pipe(gulp.dest('build'));
});

// deploy
gulp.task('deploy', ['build'], function () {
    del(['./dist/**/*']).then(function () {
        return gulp.src('./build/**/*')
            .pipe(gulp.dest('dist'));
    });
});

// default gulp task
gulp.task('default', ['build', 'connect', 'watch']);
