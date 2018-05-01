'use_strict';

import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';
import preprocess from 'gulp-preprocess';
import htmlclean from 'gulp-htmlclean';
import size from 'gulp-size'
import del from 'del';
import pkg from './package.json';

var devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production');

// File Locations

const PATHS = {
  src: 'src/',
  build: 'build/',
  html: {
    in: 'src/*.html',
    watch: ['src/*.html', 'src/template/**/*'],
    out: 'build/',
    context: {
      devBuild: devBuild,
      author: pkg.author,
      version: pkg.version
    }
  },
  images: {
    in: 'src/images/*.*',
    out: 'build/images/'
  }
};

// Show Build Type
console.log(`${pkg.name} ${pkg.version}, ${devBuild ? 'development' : 'production'}`)

gulp.task('images', () => {
  return gulp.src(PATHS.images.in)
    .pipe(newer(PATHS.images.out))
    .pipe(imagemin())
    .pipe(gulp.dest(PATHS.images.out));
});

gulp.task('clean', () => {
  del([
    PATHS.build + '*'
  ]);
});

// Build HTML Files
gulp.task('html', () => {
  var page = gulp.src(PATHS.html.in).pipe(preprocess({context: PATHS.html.context}));
  if (!devBuild) {
    page = page
      .pipe(size({ title: 'HTML in'}))
      .pipe(htmlclean())
      .pipe(size({ title: 'HTML out'}))
  }
  return page.pipe(gulp.dest(PATHS.html.out));
});

gulp.task('default', ['html', 'images'], () => {
  // html changes
  gulp.watch(PATHS.html.watch, ['html'])

  // image changes
  gulp.watch(PATHS.images.in, ['images']);
});
