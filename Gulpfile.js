// get the dependencies
var gulp = require('gulp'),
  childProcess = require('child_process'),
  electron = require('electron-prebuilt');

var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

// create the gulp task
gulp.task('run', function () {
    childProcess.spawn(electron, ['./app'], { stdio: 'inherit' });
});
 
gulp.task('ts', function(done) {
  var tsResult = tsProject.src()
    .pipe(ts(tsProject), undefined, ts.reporter.fullReporter());
  return tsResult.js.pipe(gulp.dest('app/js'));
});


//node-gyp configure --target=0.33.1 --arch=x64 --dist-url=https://atom.io/download/atom-shell
//node-gyp build