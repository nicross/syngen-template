const cleancss = require('gulp-clean-css')
const concat = require('gulp-concat')
const electron = require('gulp-run-electron')
const gulp = require('gulp')
const header = require('gulp-header')
const gulpif = require('gulp-if')
const iife = require('gulp-iife')
const package = require('./package.json')
const packager = require('electron-packager')
const serve = require('gulp-serve')
const uglify = require('gulp-uglify-es').default
const zip = require('gulp-zip')

const argv = require('yargs').argv,
  isDebug = argv.debug === true

gulp.task('build-css', () => {
  return gulp.src(
    getCss()
  ).pipe(
    concat('styles.min.css')
  ).pipe(
    gulpif(!isDebug, cleancss())
  ).pipe(
    gulp.dest('public')
  )
})

gulp.task('build-js', () => {
  return gulp.src(
    getJs()
  ).pipe(
    concat('scripts.min.js')
  ).pipe(
    gulpif(!isDebug, iife(), header("'use strict';\n\n"))
  ).pipe(
    gulp.dest('public')
  ).pipe(
    gulpif(!isDebug, uglify())
  ).pipe(
    gulp.dest('public')
  )
})

gulp.task('build', gulp.series('build-css', 'build-js'))

gulp.task('dist-electron', async () => {
  // Builds only for current platform, e.g. must build separately on Windows and Linux
  const platforms = [process.platform]

  const paths = await packager({
    arch: 'x64',
    asar: true,
    dir: '.',
    icon: 'assets/icon/icon',
    ignore: [
      '.gitignore',
      '.gitmodules',
      'assets',
      'dist',
      'Gulpfile.js',
      'node_modules',
      'package-lock.json',
      'README.md',
      'src',
    ],
    out: 'dist',
    overwrite: true,
    platform: platforms,
  })

  // XXX: Archives have no root directory
  paths.forEach((path) => {
    gulp.src(path + '/**/*').pipe(
      zip(path.replace('dist\\', '') + '.zip')
    ).pipe(
      gulp.dest('dist')
    )
  })
})

gulp.task('dist-html5', () => {
  // XXX: Archive has no root directory
  return gulp.src([
    'public/favicon.png',
    'public/index.html',
    'public/scripts.min.js',
    'public/styles.min.css',
  ], {base: 'public'}).pipe(
    zip(package.name + '-html5.zip')
  ).pipe(
    gulp.dest('dist')
  )
})

gulp.task('dist', gulp.series('build', 'dist-electron', 'dist-html5'))

gulp.task('electron', () => {
  return gulp.src('.').pipe(
    electron()
  )
})

gulp.task('electron-build', gulp.series('build', 'electron'))

gulp.task('serve', serve('public'))

gulp.task('watch', () => {
  gulp.watch('src/**', gulp.series('build'))
})

gulp.task('dev', gulp.parallel('serve', 'watch'))

function getCss() {
  const srcs = [
    'src/css/reset.css',
    'src/css/main.css',
    'src/css/*.css',
    'src/css/**/*.css',
  ]

  return srcs
}

function getJs() {
  return [
    ...getEngineJs(),
    ...getContentJs(),
    ...getAppJs(),
    'src/js/main.js',
  ]
}

function getAppJs() {
  const srcs = [
    'src/js/app.js',
    'src/js/app/*.js',
    'src/js/app/**/*.js',
  ]

  return srcs
}

function getContentJs() {
  const srcs = [
    'src/js/content.js',
    'src/js/content/*.js',
    'src/js/content/**/*.js',
  ]

  return srcs
}

function getEngineJs() {
  return [
    'node_modules/syngen/dist/syngen.js',
    'src/js/engine.js',
  ]
}
