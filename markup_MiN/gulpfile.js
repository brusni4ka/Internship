/**
 * Created by kate on 12/10/16.
 */
const gulp = require('gulp');
const less = require('gulp-less');
const cssnano = require('gulp-cssnano');
const useref = require('gulp-useref');
const gulpIf = require('gulp-if');
const browserSync = require('browser-sync').create();
const imageop = require('gulp-image-optimization');
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const del = require('del');
const runSequence = require('run-sequence');
const autoprefixer = require('gulp-autoprefixer');


gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    })
});

gulp.task('less', function () {
    return gulp.src('app/css/**/*.less')
        .pipe((less()))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }));
});

gulp.task('prefix', function () {
    return gulp.src('app/css/**/*.css')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css'))
});

gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))

});

gulp.task('images', function (cb) {
    gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    // Caching images that ran through imagemin
        .pipe(cache(imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images')).on('end', cb).on('error', cb);
});

gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean', function () {
    return del('dist')
});

//Do NOT working properly
/*gulp.task('watch', ['browserSync', 'less'], function (){
    gulp.watch('app/!**!/!*.less', ['less']);
     gulp.watch('app/!*.html', browserSync.reload);
 });*/


//Building project. Just run 'Gulp'

gulp.task('default',
    gulp.series('clean', 'less', 'prefix',
        gulp.parallel('useref', 'images', 'fonts')
    )
);
