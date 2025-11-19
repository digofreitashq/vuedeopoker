const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");

function minifyHTML() {
  return gulp
    .src("src/**/*.html")
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(gulp.dest("dist"));
}

function minifyJS() {
  return gulp.src("src/**/*.js").pipe(terser()).pipe(gulp.dest("dist"));
}

function minifyCSS() {
  return gulp.src("src/**/*.css").pipe(cleanCSS()).pipe(gulp.dest("dist"));
}

function copyOthers() {
  return gulp
    .src(["src/**/*", "!src/**/*.html", "!src/**/*.js", "!src/**/*.css"])
    .pipe(gulp.dest("dist"));
}

exports.default = gulp.parallel(minifyHTML, minifyJS, minifyCSS, copyOthers);
