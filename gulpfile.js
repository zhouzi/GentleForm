var gulp          = require('gulp');
var $             = require('gulp-load-plugins')();
var webpackConfig = require('./webpack.config.js');
var pkg           = require('./package.json');

var header = [
    '/*!',
    ' * <%= pkg.name %> - v<%= pkg.version %>',
    ' * <%= pkg.description %>',
    ' * <%= pkg.homepage %>',
    ' *',
    ' * @author <%= pkg.author %>',
    ' * @license <%= pkg.license %>',
    ' */',
    '',
    ''
].join('\n');

gulp.task('scripts', function () {
    return gulp
        .src('src/entry.js')
        .pipe($.webpack(webpackConfig))
        .pipe($.header(header, { pkg: pkg }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['default'], function () {
    gulp.watch('src/*.js', ['scripts']);
});

gulp.task('default', ['scripts']);
