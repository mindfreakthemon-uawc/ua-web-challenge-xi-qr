let gulp = require('gulp');
let pug = require('gulp-pug');
let connect = require('gulp-connect');
let plumber = require('gulp-plumber');
let inject = require('gulp-inject');
let inline = require('gulp-inline-source');
let series = require('stream-series');
let path = require('path');

const PAGES_SRC_GLOB = 'index.pug';
const PAGES_OUT_DIR = '.';

/**
 * Injects vendor bundle into js section and all css files into css section.
 */
gulp.task('pages', ['vendor', 'templates', 'css'], () => {
	return gulp.src(PAGES_SRC_GLOB)
		.pipe(plumber())
		.pipe(inject(gulp.src('build/bundle/vendor.js', { read: false })))
		.pipe(inject(gulp.src('build/css/*.css', { read: false })))
		.pipe(inject(gulp.src('build/app/**/*.html', { read: false }), {
			transform: (filepath) => `link(rel='import', href='${filepath}', id='tmpl-${path.basename(filepath, '.html')}')`,
			name: 'inject:import'
		}))
		.pipe(pug({ pretty: true }))
		.pipe(gulp.dest(PAGES_OUT_DIR))
		.pipe(connect.reload());
});

/**
 * Injects vendor bundle, app bundle into js section and all css into css section.
 */
gulp.task('pages:prod', ['vendor', 'app:prod', 'templates', 'css:prod'], () => {
	let vendor = gulp.src('build/bundle/vendor.js', { read: false });
	let app = gulp.src('build/bundle/app.min.js', { read: false });

	return gulp.src(PAGES_SRC_GLOB)
		.pipe(plumber())
		.pipe(inject(series(vendor, app), {
			addRootSlash: false
			// transform: (filepath) => `script(inline, src='${filepath}')`
		}))
		.pipe(inject(gulp.src('build/css/*.css', { read: false }), {
			addRootSlash: false
			// transform: (filepath) => `link(inline, rel='stylesheet', href='${filepath}')`
		}))
		.pipe(pug())
		.pipe(inline({
			rootpath: '.'
		}))
		.pipe(gulp.dest(PAGES_OUT_DIR))
		.pipe(connect.reload());
});

gulp.task('pages:watch', () => gulp.watch(PAGES_SRC_GLOB, ['pages']));
