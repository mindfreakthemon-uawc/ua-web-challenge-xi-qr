let gulp = require('gulp');
let typescript = require('gulp-tsc');
let connect = require('gulp-connect');
let plumber = require('gulp-plumber');
let del = require('del');
let Builder = require('systemjs-builder');

const APP_SRC_GLOB = 'app/**/*.ts';
const APP_OUT_DIR = 'build/app';

/**
 * Compiles typescript application and copies it to app dir.
 */
gulp.task('app', ['app:clear'], () => {
	let compilerOptions = require('../tsconfig.json').compilerOptions;

	return gulp.src([APP_SRC_GLOB])
		.pipe(plumber())
		.pipe(typescript(Object.assign({
			additionalTscParameters: ['--types']
		}, compilerOptions)))
		.pipe(gulp.dest(APP_OUT_DIR))
		.pipe(connect.reload());
});

/**
 * Bundles application into one file, along with RxJS and Angular2.
 */
gulp.task('app:prod', ['app', 'vendor'], () => {
	let builder = new Builder('.', './systemjs.config.js');

	return builder.bundle('app', 'build/bundle/app.min.js');
});

gulp.task('app:watch', () => gulp.watch(APP_SRC_GLOB, ['app']));

gulp.task('app:clear', () => {
	return del([`${APP_OUT_DIR}/**/*.js`]);
});
