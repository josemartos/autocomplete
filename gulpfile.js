const { dest, task, src, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const cleanCss = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gutil = require('gulp-util');
const concat = require('gulp-concat');
const eslint = require('gulp-eslint');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

const paths = {
    entry: './source/scripts/app.js',
    sass: {
        src: [
            './source/sass/**/*.scss'
        ],
        dest: './web/css'
    },
    scripts: {
        src: [
            './source/scripts/**/*.js'
        ],
        dest: './web/js'
    }
};

function compileSass () {
    return src(paths.sass.src)
        .pipe(sass().on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(concat('styles.min.css'))
        .pipe(cleanCss())
        .pipe(sourcemaps.write('./'))
        .pipe(dest(paths.sass.dest));
};

function compileScripts () {
    return browserify({
        extensions: ['.js'],
        entries:  [paths.entry],
        debug: true
      })
      .transform('babelify')
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(buffer())
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(sourcemaps.write('./maps'))
      .pipe(dest(paths.scripts.dest))
};

task('lintjs', () => {
    return src(paths.scripts.src)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

task('watch', () => {
    watch(paths.sass.src, compileSass);
    watch(paths.scripts.src, series("lintjs", compileScripts));
});

task('build', parallel(compileSass, series("lintjs", compileScripts)));
