let gulp = require('gulp');

require('./tasks/css');
require('./tasks/app');
require('./tasks/templates');
require('./tasks/styles');
require('./tasks/vendor');
require('./tasks/statics');
require('./tasks/pages');
require('./tasks/connect');
require('./tasks/clean');

gulp.task('compile', ['statics', 'app', 'templates', 'styles', 'css', 'pages']);
gulp.task('compile:prod', ['statics', 'pages:prod']);

gulp.task('watch', ['css:watch', 'templates:watch', 'styles:watch', 'app:watch',/* 'pages:watch',*/ 'statics:watch']);

gulp.task('dev:prod', ['clean'], () => {
	gulp.run(['vendor', 'compile:prod', 'connect']);
});

gulp.task('dev', ['clean'], () => {
	gulp.run(['vendor', 'compile', 'connect', 'watch']);
});

gulp.task('default', ['dev']);
