var gulp        = require("gulp"),
    $           = require("gulp-load-plugins")(),
    browserSync = require("browser-sync").create(),
    runSequence = require("run-sequence"),
    karmaServer = require("karma").Server,
    fs          = require("fs"),
    browserify  = require("browserify"),
    babelify    = require("babelify");

gulp.task("default", ["css", "js", "watch:css", "watch:html", "watch:js"], start);

gulp.task("legacy", ["css", "js:legacy", "watch:css", "watch:html", "watch:js:legacy"], start);

gulp.task("watch:css", function () {
    return gulp.watch(["./src/css/**/*.scss"])
        .on("change", function () {
            runSequence("css", function () {
                browserSync.reload("*.css");
            });
        });
});

gulp.task("watch:html", function () {
    return gulp.watch([
            "./**/*.html",
            "!./node_modules" 
        ])
        .on("change", function () {
            browserSync.reload();
        });
});

gulp.task("watch:js", function () {
    return gulp.watch(["./src/js/**/*.js"])
        .on("change", function () {
            runSequence("js", function () {
                browserSync.reload();
            });
        })  
});

gulp.task("watch:js:legacy", function () {
    return gulp.watch(["./src/js/**/*.js"])
        .on("change", function () {
            runSequence("js:legacy", function () {
                browserSync.reload();
            });
        })  
});

gulp.task("css", function () {
    return $.rubySass("./src/css/style.scss", {
            sourcemap: true
        })
        .pipe($.autoprefixer({
            browsers: ["Firefox >= 3.6", "Chrome >= 8", "Safari >= 6", "IE >= 8"]
        }))
        .pipe($.sourcemaps.write(".", {
            includeContent: false,
            sourceRoot: "./src/css"
        }))
        .pipe(gulp.dest("./dist/css"));
});

gulp.task("js", function () {
    return browserify("./src/js/app.js", { debug: true })
        .transform(babelify)
        .bundle()
        .on("error", function (err) { 
            console.log("Error : " + err.message); 

            this.emit('end');
        })
        .pipe(fs.createWriteStream("./dist/js/app.js"));
});

gulp.task("js:legacy", function () {
    return gulp.src("./src/js/**/*.js")
        .pipe(gulp.dest("./dist/js"));
});

function start () {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
}