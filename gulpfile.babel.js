'use_strict';

import gulp from 'gulp';
import eslint from 'gulp-eslint';
import imagemin from 'gulp-imagemin';
import concat from 'gulp-concat';
import newer from 'gulp-newer';
import preprocess from 'gulp-preprocess';
import browsersync from 'browser-sync';
import htmlclean from 'gulp-htmlclean';
import size from 'gulp-size'
import imacss from 'gulp-imacss';
import sass from 'gulp-sass';
import pleeease from 'gulp-pleeease';
import uglify from 'gulp-uglify';
import urlAdjuster from 'gulp-css-url-adjuster';
import del from 'del';
import pkg from './package.json';

// file locations
var 
	devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production'),

	source = 'src/',
	dest = 'build/',

	html = {
		in: source + '*.html',
		watch: [source + '*.html', source + 'template/**/*'],
		out: dest,
		context: {
			devBuild: devBuild,
			author: pkg.author,
			version: pkg.version
		}
	},

	images = {
		in: source + 'images/*.*',
		out: dest + 'images/'
	},

	imguri = {
		in: source + 'images/inline/*',
		out: source + 'scss/images/',
		filename: '_datauri.scss',
		namespace: 'img'
	},

	css = {
		in: source + 'scss/main.scss',
		watch: [source + 'scss/**/*'],
		out: dest + 'css/',
		sassOpts: {
			outputStyle: 'nest',
			imagePath: '../images/',
			precision: 3,
			errLogToConsole: true
		},
		pleeeaseOpts: {
			autoprefixer: { 
				browsers: ['last 2 versions', '> 2%']
			},
			rem: ['16px'],
			pseudoElements: true,
			mqpacker: true,
			minifier: !devBuild
		}
	},

	js = {
		in: source + 'js/**/*',
		out: dest + 'js/',
		filename: 'main.js'
	},

	fonts = {
		in: source + 'fonts/*.*',
		out: css.out + 'fonts/'
	},
	
	syncOpts = {
		server: {
			baseDir: dest,
			index: 'index.html'
		},
		open: false,
		notify: true
	};

// show build type
console.log(pkg.name + ' ' + pkg.version + ', ' + (devBuild ? 'development' : 'production') + ' build');

// clean the build folder
gulp.task('clean', function() {
	del([
		dest + '*'
	]);
});

// build HTML files
gulp.task('html', function() {
	var page = gulp.src(html.in).pipe(preprocess({ context: html.context }));
	if (!devBuild) {
		page = page
			.pipe(size({ title: 'HTML in' }))
			.pipe(htmlclean())
			.pipe(size({ title: 'HTML out' }));
	}
	return page.pipe(gulp.dest(html.out));
});

// manage images
gulp.task('images', function() {
	return gulp.src(images.in)
		.pipe(newer(images.out))
		.pipe(imagemin())
		.pipe(gulp.dest(images.out));
});

// convert inline images to dataURIs in SCSS source
gulp.task('imguri', function() {
	return gulp.src(imguri.in)
		.pipe(imagemin())
		.pipe(imacss(imguri.filename, imguri.namespace))
		.pipe(gulp.dest(imguri.out));
});

// copy fonts
gulp.task('fonts', function() {
	return gulp.src(fonts.in)
		.pipe(newer(fonts.out))
		.pipe(gulp.dest(fonts.out));
});

// compile sass
gulp.task('sass', ['imguri'], function() {
	return gulp.src(css.in)
		.pipe(sass(css.sassOpts))
		.pipe(urlAdjuster({
			prepend: css.sassOpts.imagePath
		}))
		.pipe(size({title: 'CSS in '}))
		.pipe(pleeease(css.pleeeaseOpts))
		.pipe(size({title: 'CSS out '}))
		.pipe(gulp.dest(css.out))
		.pipe(browsersync.reload({ stream: true }));
});

// compile js
gulp.task('js', function() {
	if (devBuild) {
		return gulp.src(js.in)
			.pipe(newer(js.out))
			.pipe(gulp.dest(js.out));
	} else {
		del([
			dest + 'js/*'
		]);
		return gulp.src(js.in)
			.pipe(concat(js.filename))
			.pipe(size({ title: 'JS in '}))
			.pipe(uglify())
			.pipe(size({ title: 'JS out '}))
			.pipe(gulp.dest(js.out));
	}
});

// BrowserSync
gulp.task('browsersync', function() {
	browsersync(syncOpts);
});

// default task
gulp.task('default', ['html', 'images', 'fonts', 'sass', 'js', 'browsersync'], function() {

	// html changes
	gulp.watch(html.watch, ['html', browsersync.reload]);

	// image changes
	gulp.watch(images.in, ['images']);

	// font changes
	gulp.watch(fonts.in, ['fonts']);

	// sass changes
	gulp.watch([css.watch, imguri.in], ['sass']);

	// js changes
	gulp.watch(js.in, ['js', browsersync.reload]);
});