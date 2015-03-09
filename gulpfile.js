var gulp = require('gulp'),
	concat = require('gulp-concat'),
	mbf = require('main-bower-files'),
	less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    karma = require('karma').server,
    nodemon = require('gulp-nodemon');

// vendor
gulp.task('bower', function () {
    var jsRegex = (/.*\.js$/i),
        cssRegex = (/.*\.css$/i);

	gulp.src(mbf({ filter: jsRegex }))
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('public/javascripts'));

    gulp.src(mbf({ filter: cssRegex }))
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('public/stylesheets'));

    // accommodate bootstrap css source mapping
    gulp.src('./bower_components/**/bootstrap.css.map')
        .pipe(concat('bootstrap.css.map'))
        .pipe(gulp.dest('public/stylesheets'));
});

// app
gulp.task('app', ['bower'], function () {
    gulp.src('./src/app/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('public/javascripts'));
});

gulp.task('less', function () {
    return gulp.src('src/styles/style.less')
        .pipe(less())
        .pipe(gulp.dest('public/stylesheets/'));
});

// code linting
gulp.task('jshint', function () {
    return gulp.src(['src/app/**/*.js'])
        .pipe(jshint(process.env.NODE_ENV === 'development' ? { devel: true, debug: true } : {} ))
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

// test runner
gulp.task('test', function (done) {
    karma.start({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done);
});

// dev server
gulp.task('dev', ['jshint', 'app', 'less'], function () {
    /*nodemon({ script: 'app.js', ext: 'html js', ignore: [] })
        .on('change', ['jshint', 'app', 'less'])
        .on('restart', function () {
            console.log('restarted!')
        });*/
    nodemon({ script: 'app.js', ext: 'html js', ignore: [] });
});

gulp.task('default', ['jshint', 'app', 'less']);