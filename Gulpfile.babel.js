import gulp from 'gulp';
import sass from 'gulp-sass';
import cleanCss from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import gutil from 'gulp-util';
import concat from 'gulp-concat';
import jshint from 'gulp-jshint';
import runSequence from 'run-sequence';

import browserify from 'browserify';
import babelify from 'babelify';
import source from 'vinyl-source-stream';
import buffer from 'vinyl-buffer';

const paths = {
    sass: {
        source: [
            './source/sass/**/*.scss'
        ],
        dest: './web/css'
    },
    scripts: {
        source: [
            './source/scripts/**/*.js'
        ],
        dest: 'web/js'
    }
};

gulp.task('compile-sass', () => {
    gulp.src(paths.sass.source)
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(concat('styles.min.css'))
        .pipe(cleanCss())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.sass.dest));
});

gulp.task('run-jshint', function() {
    gulp.src(paths.scripts.source)
        .pipe(jshint({esversion: 6}))
        .pipe(jshint.reporter('jshint-stylish', {verbose: true}))
});

gulp.task('compile-scripts', function() {
    browserify({ debug: true })
        .transform(babelify)
        .require("./source/scripts/app.js", { entry: true })
        .bundle()
        .on('error', gutil.log)
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(paths.scripts.dest));
});

gulp.task('watch', () => {
    gulp.watch(paths.sass.source, ['compile-sass']);
    gulp.watch(paths.scripts.source, ['run-jshint']);
    gulp.watch(paths.scripts.source, ['compile-scripts']);
});

gulp.task('build', function () {
    runSequence('compile-sass', 'run-jshint', 'compile-scripts');
});