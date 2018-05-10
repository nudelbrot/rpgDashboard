var gulp = require("gulp");
var mocha = require("gulp-mocha");
var gulpprotobuf = require("gulp-protobufjs");

gulp.task("default", ["protoc", "test"], () => {
  
});

gulp.task("test", () =>
  gulp.src("test/*.test.js", {read: false})
    .pipe(mocha({reporter: "nyan"}))
);

gulp.task("protoc", () => {
  gulp.src("proto/*.proto")
    .pipe(gulpprotobuf())
    .pipe(gulp.dest("build/"));
});
