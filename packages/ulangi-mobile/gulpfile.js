var gulp = require("gulp");
var ts = require("gulp-typescript");
var changed = require("gulp-changed");
var cache = require("gulp-cached");


var projectPaths = [ "src/**/*.tsx", "src/**/*.ts" ]

gulp.task('watch', function(){
  gulp.watch(projectPaths).on("change", function() {
    // Use to check the whole project
    var checkWholeProject = ts.createProject("tsconfig.json", {noEmitOnError: true});

    // Use to compile the changed files only
    var compileChangedFiles = ts.createProject("tsconfig.json");

    let hasError = false
    return gulp.src(projectPaths)
      .pipe(checkWholeProject())
      .on("error", function(){
        hasError = true
        console.log("Error occurred. Changed files will not be emitted.")
      })
      .on("finish", function(){
        if (hasError === false){
          gulp.src(projectPaths)
            .pipe(cache("src_project"))
            .pipe(compileChangedFiles())
            .js.pipe(gulp.dest("artifacts"))
          console.log("Successfully emitted changed files.")
        }
      })
  });
})
