"use strict";

const gulp = require("gulp");
const imagemin = require("gulp-imagemin");

gulp.task("default", function() {
  return gulp.src("img/*")
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest("dist/images"));
});




