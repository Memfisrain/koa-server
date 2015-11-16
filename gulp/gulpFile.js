"use strict";

const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const jshint = require("gulp-jshint");
const mocha = require("gulp-mocha");
const runSequence = require("run-sequence");

gulp.task("lint", function() {
  return gulp.src("*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("default"))
});

gulp.task("images", function() {
  return gulp.src("img/*")
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest("dist/images"));
});

gulp.task("tests", function() {
  return gulp.src(["**/*/test/*.js", "test/*.js", "!node_modules/*/**/test/*.js"], {read: false})
    .pipe(mocha());
});

gulp.task("default", ["images", "lint", "tests"]);




