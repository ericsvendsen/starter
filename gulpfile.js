var gulp = require('gulp'),
	concat = require('gulp-concat'),
	less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    karma = require('karma').server,
    nodemon = require('gulp-nodemon'),
    livereload = require('gulp-livereload');

var vendorBase = './jspm_packages',
    paths = {
        vendorStyles: [
            vendorBase + '/github/twbs/bootstrap*/css/bootstrap.css',
            vendorBase + './jspm_packages/npm/font-awesome*/css/font-awesome.css'
        ],
        vendorScripts: [
            vendorBase + '/github/components/jquery*/jquery.js',
            vendorBase + '/twbs/bootstrap*/js/bootstrap.js'
        ],
        styles: ['./client/stylesheets/*.less'],
        scripts: ['./client/app/**/*.js'],
        html: ['./client/app/**/*.html'],
        tests: ['./tests/*.js']
    };

// vendor
gulp.task('vendor', function () {
    gulp.src(paths.vendorScripts)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('public/javascripts'));

    gulp.src(paths.vendorStyles)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('public/stylesheets'));

    // accommodate bootstrap css source mapping
    gulp.src(vendorBase + '/github/twbs/bootstrap*/css/bootstrap.css.map')
        .pipe(concat('bootstrap.css.map'))
        .pipe(gulp.dest('public/stylesheets'));
});

// app
gulp.task('app', function () {
    gulp.src(paths.scripts)
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/javascripts'));
});

// styles
gulp.task('less', function () {
    return gulp.src(paths.styles)
        .pipe(less())
        .pipe(gulp.dest('public/stylesheets/'));
});

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
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

// dev server
gulp.task('serve', function (){
    nodemon({
        script: 'app.js',
        env: { 'NODE_ENV': 'development' }
    });
});

// watch files and livereload
gulp.task('watch', function(){
    //gulp.watch(paths.html, ['html']);
    gulp.watch(paths.scripts, ['lint', 'app']);
    gulp.watch(paths.styles, ['less']);
    livereload.listen();
    gulp.watch('public/**').on('change', livereload.changed);
});

// build
//gulp.task('build', ['vendor', 'app', 'less', 'lint']);
gulp.task('build', ['vendor', 'app', 'less', 'lint']);

// default gulp task
gulp.task('default', ['test', 'build', 'serve', 'watch']);