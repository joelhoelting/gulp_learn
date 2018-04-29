'use_strict';

import gulp from 'gulp';
import imagemin from 'gulp-imagemin';
import newer from 'gulp-newer';
import del from 'del';
import pkg from './package.json';

var devBuild = ((process.env.NODE_ENV || 'development').trim().toLowerCase() !== 'production');

// File Locations

const PATHS = {
  src: 'src/',
  build: 'build/',
  images: {
    in: 'src/images/*.*',
    out: 'build/images/'
  }
};

// Show Build Type
// console.log(pkg.name + ' ' +)

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

gulp.task('default', ['images'], () => {
  gulp.watch(PATHS.images.in, ['images']);
});