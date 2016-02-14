var gulp = require("gulp"),
	webpack = require("gulp-webpack"),
	webpackConfig = require("./webpack.config"),
	livereload = require("gulp-livereload");

gulp.task("webpack", function() {
	gulp.src("./")
		.pipe(webpack(webpackConfig))
		.pipe(gulp.dest("./public/dist/"))
		.pipe(livereload());
});

gulp.task("watch", function() {
	livereload.listen();
});

gulp.task("default", function () {
	gulp.start("webpack", "watch");
});