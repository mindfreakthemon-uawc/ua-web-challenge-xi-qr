let gulp = require('gulp');
let connect = require('gulp-connect');
let concat = require('gulp-concat');
let uglify = require('gulp-uglify');

const VENDOR_LIST = [
	'node_modules/systemjs/dist/system.js'
];

/**
 * Copies vendors that are statically linked in html page.
 */
gulp.task('vendor', () => {
	return gulp.src(VENDOR_LIST, { base: 'node_modules' })
		.pipe(concat('vendor.js'))
		.pipe(uglify())
		.pipe(gulp.dest('build/bundle'))
		.pipe(connect.reload());
});


