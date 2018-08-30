const gulp = require('gulp');
const jshint = require('gulp-jshint');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const del = require('del');
const runSequence = require('run-sequence');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');

gulp.task('html', function () {
    return gulp.src('src/*.html')
        .pipe(useref())
        .pipe(gulp.dest('prod'));
});

gulp.task('styles', () => {
    return gulp.src('src/css/*.less')
        .pipe(less())
        .pipe(gulp.dest('prod/css'))
})

gulp.task('copyFonts', () => {
    return gulp.src('src/css/fonts/*.ttf')
        .pipe(gulp.dest('prod/css/fonts'))
})

gulp.task('js', () => {
    return gulp.src('src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('prod/js'))
})

gulp.task('clean', () => {
    return del.sync('prod');
});
gulp.task('build', () => {
    runSequence(
        'clean',
        'html',
        'styles',
        'js',
        'copyFonts'
    );
})

gulp.task('watch', function () {
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/css/*.less', ['styles']);
    gulp.watch('src/js/*.js', ['js']);
})

gulp.task('browser-sync', function () {
    browserSync.init({
        server: './prod'
    });
    browserSync.watch('src').on('change', browserSync.reload)
});

gulp.task('dev', () => {
    runSequence(
        'build',
        'watch',
        'browser-sync');
})