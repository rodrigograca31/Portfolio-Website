// including plugins
const gulp = require('gulp');
const htmlmin = require("gulp-html-minifier-terser");
const runSequence = require('run-sequence');
const cleanCSS = require('gulp-clean-css');
const terser = require('gulp-terser');
const clean = require('gulp-clean');

const injectPartials = require('gulp-inject-partials');
const imagemin = require('gulp-imagemin');
const sitemap = require('gulp-sitemap');
const brotli = require('gulp-brotli');
const deleteEmpty = require('delete-empty');

const folder = './';
const siteUrl = 'https://portfolio.rodrigograca.com/';

// npm init
// npm install gulp browser-sync gulp-minify-html gulp-minify-css gulp-uglify run-sequence gulp-clean gulp-inject-partials gulp-sitemap gulp-imagemin --save

// https://julienrenaux.fr/2014/05/25/introduction-to-gulp-js-with-practical-examples/

gulp.task('default', ['maintask'], function (callback) {
	//runs maintask first, then:
	return callback;
});

gulp.task('maintask', function(callback) {
	// it runs 'clean' then 'copyall' then the other ones in parallel then callback
	return runSequence(
		'clean',
		'copyall',
		'sitemap',
		['minify-html', 'minify-css', 'minify-js', 'minify-imgs'],
        'brotli',
		'clean-files',
		'delete-empty',
		callback);
});


gulp.task('clean', function () {
    return gulp.src('./dist/', {read: false})
        .pipe(clean());
});

gulp.task('copyall', function () {
	return gulp.src([folder + '**/*', '!**/node_modules/**', '!**/node_modules', '!**dist/**', '!**dist'])
		.pipe(gulp.dest('./dist/'));
});

gulp.task('minify-html', () => {
	return gulp.src([folder + '**/*.html', '!**/node_modules/**', '!**/node_modules', '!**dist/**', '!**dist'])
    .pipe(injectPartials())
	.pipe(htmlmin({
		collapseWhitespace: true,
		removeComments: true,
		removeAttributeQuotes: true,
		minifyJS: true
	}))
	.pipe(gulp.dest('./dist/'));
});

gulp.task('minify-css', function () {
	return gulp.src([folder + '**/*.css', '!**/node_modules/**', '!**/node_modules', '!**dist/**', '!**dist'])
		.pipe(cleanCSS())
		.pipe(gulp.dest('./dist/'));
});

gulp.task('minify-js', function () {
	return gulp.src([folder + '**/*.js', '!**/node_modules/**', '!**/node_modules', '!**dist/**', '!**dist'])
		.pipe(terser({
			ecma: 6,
			mangle: {
				toplevel: true,
			}
		}))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('minify-imgs', function () {
	return gulp.src([folder + '**/*.{png,jpg,gif,svg,jpeg}', '!**/node_modules/**', '!**/node_modules', '!**dist/**', '!**dist'])
		.pipe(imagemin())
		.pipe(gulp.dest('./dist/'));
});

gulp.task('sitemap', function () {
	gulp.src('index.html', {
		read: false
	})
	.pipe(sitemap({
		siteUrl: siteUrl
	}))
	.pipe(gulp.dest('./dist/'));
});

/* https://css-tricks.com/brotli-static-compression/ */
gulp.task('brotli', function() {
  return gulp.src("./dist/" + "**/*.{html,js,css,svg,json}")
    .pipe(brotli.compress())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('clean-files', function () {
    return gulp.src('./dist/**/*.{less,scss,map,DS_Store}', {read: false})
        .pipe(clean());
});

gulp.task('delete-empty', function () {
	return deleteEmpty('./dist/');
});
