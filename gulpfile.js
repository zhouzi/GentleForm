var gulp          = require('gulp');
var $             = require('gulp-load-plugins')();
var webpackConfig = require('./webpack.config.js');
var pkg           = require('./package.json');
var browserSync   = require('browser-sync');
var reload        = browserSync.reload;
var generate      = require('./generate.js');

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

gulp.task('serve', ['default'], function () {
    browserSync({ notify: false, port: 9000, server: { baseDir: ['.'] } });
    gulp.watch(['index.html', 'styles.css']).on('change', reload);
    gulp.run('watch');
});

gulp.task('styles', function () {
    return gulp
        .src('*.scss')
        .pipe($.sass({ outputStyle: 'compressed' }))
        .pipe($.autoprefixer('last 2 version'))
        .pipe(gulp.dest(''))
    ;
});

gulp.task('scripts', function () {
    return gulp
        .src('src/entry.js')
        .pipe($.webpack(webpackConfig))
        .pipe($.header(header, { pkg: pkg }))
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['default'], function () {
    gulp.watch('src/*.js', ['scripts']);
    gulp.watch('*.scss', ['styles']);
    gulp.watch('README.md', ['doc']);
});

gulp.task('doc', function (done) {
    generate(done);
});

gulp.task('default', ['styles', 'scripts']);
