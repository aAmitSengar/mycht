var gulp = require('gulp'),
    babel = require('gulp-babel'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
     del = require('del'),
     childProcess = require('child_process');
var winInstaller = require('electron-windows-installer');
// gulp.task('default', ['compile']);
//gulp.task('default', function () { console.log('Hello Gulp!') });
//
gulp.task('create-windows-installer', function(done) {
  winInstaller({
            appDirectory:'app-win32-ia32',
            outputDirectory: 'app-win32-ia32/release',
            iconUrl:'http://demo.truworth.net/rx/images/logo.png',
            exe: 'app.exe',
            title: 'Chat',
            setupExe: 'Setup.exe',
            noMsi: true,
            setupIcon: 'icon.ico',
            loadingGif: 'LoadingFull.gif',
            arch: 'ia32',
            signingHashAlgorithms:'sha256'
   }).then(done).catch(done);
});


// var runSequence = require('run-sequence'),
//     del = require('del'),
//     exec = require('child_process').exec;

gulp.task('build', function () {
    return gulp.src('*.es')
        .pipe(babel())
        .pipe(rename({extname: '.js'}))
        .pipe(gulp.dest('./dist'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function () {

    return del(['dist']);
});
gulp.task('run', function () {
  childProcess.spawn(electron, ['--debug=5858','./app'], { stdio: 'inherit' });
});
gulp.task('exec', function (cb) {
    exec('node dist/app.js', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});

gulp.task('default', function (cb) {
    runSequence('clean', 'build', 'exec', cb);
});
