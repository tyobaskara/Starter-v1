var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    postcss = require('gulp-postcss'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('autoprefixer'),
    uglifycss = require('gulp-uglifycss'),
    uglifyjs = require('gulp-uglifyjs'),
    concat = require('gulp-concat'),
    bourbon = require('node-bourbon'),
    browserSync = require('browser-sync').create(),
    path = require("path"),
    html = require('gulp-processhtml'),
    watch = require('gulp-watch'),
    runs = require('run-sequence'),
    clean = require('gulp-clean'),
    injectPartials = require('gulp-file-include');

var targetPath = "../Public";

var paths = {
    sass:
        [
            path.join(__dirname, 'sass/*.scss')
        ],
    pages: 
        [
            path.join(__dirname, 'sass/*pages*/*.scss')
        ],
    css:
        {
            vendor:
                [
                    path.join(__dirname, "sass/*bootstrap*/_bootstrap.scss"),
                ],
            plugins:
                [
                    path.join(__dirname, "bower_components/jcf/dist/css/theme-minimal/jcf.css"),
                    //path.join(__dirname, "bower_components/jcf/dist/css/demo.css"),
                    path.join(__dirname, "bower_components/slick-carousel/slick/slick.css"),
                    path.join(__dirname, "bower_components/slick-carousel/slick/slick-theme.css"),

                    // FONT AWESOME CSS
                    path.join(__dirname, "bower_components/font-awesome/css/font-awesome.css"),

                    path.join(__dirname, "plugins/**/*.css"),

                ]
        },        
    js:
        {
            vendor:
                [
                    path.join(__dirname, "bower_components/javascript/defer_parsing.js"),
                    path.join(__dirname, "bower_components/jquery/dist/jquery.min.js"),
                    path.join(__dirname, "bower_components/bootstrap/dist/js/bootstrap.min.js"),
                ],
            plugins:
                [
                    path.join(__dirname, "bower_components/jcf/dist/js/jcf.js"),
                    path.join(__dirname, "bower_components/jcf/dist/js/jcf.radio.js"),
                    path.join(__dirname, "bower_components/jcf/dist/js/jcf.checkbox.js"),
                    path.join(__dirname, "bower_components/jcf/dist/js/jcf.select.js"),
                    path.join(__dirname, "bower_components/slick-carousel/slick/slick.min.js"),

                    path.join(__dirname, "plugins/**/*.js"),
                ],
            app:
                [
                    path.join(__dirname, 'script/*.js')
                ],
            includes: 
                [
                    path.join(__dirname, 'script/*Includes*/*.js')
                ]
        }
}

// --------------------------------------------------------- INIT TASK //

gulp.task('init', ['sass', 'sass_vendor', 'sass_plugins', 'pages', 'js', 'js_vendor', 'js_plugins', 'js_custom']);

// --------------------------------------------------------- SET TASK FOR WATCHER //


// CLEANER
gulp.task('clean-sass', function (file) {
  return gulp.src([
        path.join(__dirname, targetPath + '/assets/css/main.css'), 
        path.join(__dirname, targetPath + '/assets/css/maps/main.css.map'), 
        ], {read: false})
    .pipe(clean({force: true}));
});
gulp.task('clean-pages', function () {
  return gulp.src([
        path.join(__dirname, targetPath + '/assets/css/*pages*/*.css'),
        path.join(__dirname, targetPath + '/assets/css/maps/*pages*/*.css.map')
        ], {read: false})
    .pipe(clean({force: true}));
});
gulp.task('clean-sass-vendor', function () {
  return gulp.src([
        path.join(__dirname, targetPath + '/assets/css/vendor.min.css'),
        path.join(__dirname, targetPath + '/assets/css/maps/vendor.min.css.map')
        ], {read: false})
    .pipe(clean({force: true}));
});
gulp.task('clean-sass-plugins', function () {
  return gulp.src([
        path.join(__dirname, targetPath + '/assets/css/plugins.min.css'),
        path.join(__dirname, targetPath + '/assets/css/maps/plugins.min.css.map')
        ], {read: false})
    .pipe(clean({force: true}));
});
gulp.task('clean-js', function () {
  return gulp.src(path.join(__dirname, targetPath + '/assets/js/app.min.js'), {read: false})
    .pipe(clean({force: true}));
});
gulp.task('clean-js_vendor', function () {
  return gulp.src(path.join(__dirname, targetPath + '/assets/js/vendor.min.js'), {read: false})
    .pipe(clean({force: true}));
});
gulp.task('clean-js_plugins', function () {
  return gulp.src(path.join(__dirname, targetPath + '/assets/js/plugins.min.js'), {read: false})
    .pipe(clean({force: true}));
});
gulp.task('clean-js_custom', function () {
  return gulp.src(path.join(__dirname, targetPath + '/assets/js/*Includes*/*.js'), {read: false})
    .pipe(clean({force: true}));
});
// CLEANER

// copy HTML task
gulp.task('html', function() {
    return gulp.src(path.join(__dirname, "views/pages/*.html"))
        //.pipe(html())
        .pipe(injectPartials({
          prefix: '@@',
          basepath: '@file'
        }))
        .pipe(gulp.dest(path.join(__dirname, targetPath)))
        .pipe(browserSync.stream())
});

// copy the sass file task
gulp.task('sass', ['clean-sass'], function() {
    return gulp.src(paths.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({
          outputStyle: 'compressed',
          includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(postcss([autoprefixer({ browsers: ['> 0%'] })]))       
        //.pipe(uglifycss())
        .pipe(sourcemaps.write(path.join(__dirname, targetPath + '/assets/css/maps'), {
            includeContent: false, 
            sourceRoot: path.join(__dirname, targetPath + '/assets/css/maps'),
            sourceMappingURL: function(file) {
                return 'maps/' + file.relative + '.map';
            }
        }))
        .pipe(gulp.dest(path.join(__dirname, targetPath + '/assets/css/')))
        .pipe(browserSync.stream())
});


gulp.task('sass_plugins', ['clean-sass-plugins'], function() {
    return gulp.src(paths.css.plugins)
        .pipe(concat('plugins.min.css'))
        .pipe(sourcemaps.init())
        .pipe(sass({
          outputStyle: 'compressed',
          includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(sourcemaps.write(path.join(__dirname, targetPath + '/assets/css/maps'), {
            includeContent: false, 
            sourceRoot: path.join(__dirname, targetPath + '/assets/css/maps'),
            sourceMappingURL: function(file) {
                return 'maps/' + file.relative + '.map';
            }
        }))
        .pipe(gulp.dest(path.join(__dirname, targetPath + '/assets/css/')))
        .pipe(browserSync.stream())
});


gulp.task('sass_vendor', ['clean-sass-vendor'], function() {
    return gulp.src(paths.css.vendor)
        .pipe(concat('vendor.min.css'))
        .pipe(sourcemaps.init())
        .pipe(sass({
          outputStyle: 'compressed',
          includePaths: bourbon.includePaths
        }).on('error', sass.logError))
        .pipe(sourcemaps.write(path.join(__dirname, targetPath + '/assets/css/maps'), {
            includeContent: false, 
            sourceRoot: path.join(__dirname, targetPath + '/assets/css/maps'),
            sourceMappingURL: function(file) {
                return 'maps/' + file.relative + '.map';
            }
        }))
        .pipe(gulp.dest(path.join(__dirname, targetPath + '/assets/css/')))
        .pipe(browserSync.stream())
});

gulp.task('pages', ['clean-pages'], function () {
    return gulp.src(paths.pages)
        .pipe(sourcemaps.init({identityMap: true}))
        .pipe(sass({
          outputStyle: 'compressed',
          includePaths: bourbon.includePaths 
        }).on('error', sass.logError))
        .pipe(postcss([autoprefixer({ browsers: ['> 0%'] })]))
        .pipe(sourcemaps.write(path.join(__dirname, targetPath + '/assets/css/maps'), {
            includeContent: false, 
            sourceRoot: path.join(__dirname, targetPath + '/assets/css/maps'),
            sourceMappingURL: function(file) {
                var filename = escape(file.relative).replace(/pages%5C/g, "");
                return '../maps/pages/' + filename + '.map';
            }
        }))
        .pipe(gulp.dest(path.join(__dirname, targetPath + '/assets/css/')))
        .pipe(browserSync.stream())
});

// copy javascript task
gulp.task('js', ['clean-js'], function () {
    return gulp.src(paths.js.app)
        .pipe(concat('app.min.js'))
        .pipe(uglifyjs())
        .pipe(gulp.dest(path.join(__dirname, targetPath + '/assets/js/')));
});

gulp.task('js_vendor', ['clean-js_vendor'], function () {
    return gulp.src(paths.js.vendor)
        .pipe(concat('vendor.min.js'))
        .pipe(uglifyjs())
        .pipe(gulp.dest(path.join(__dirname, targetPath + '/assets/js/')));
});

gulp.task('js_plugins', ['clean-js_plugins'], function () {
    return gulp.src(paths.js.plugins)
        .pipe(concat('plugins.min.js'))
        .pipe(uglifyjs())
        .pipe(gulp.dest(path.join(__dirname, targetPath + '/assets/js/')));
});

gulp.task('js_custom', ['clean-js_custom'], function () {
    return gulp.src(paths.js.includes)
        //.pipe(uglifyjs())
        .pipe(gulp.dest(path.join(__dirname, targetPath + '/assets/js/')));
});

// --------------------------------------------------------- SET SHOW WATCHER //

//Watcher active
gulp.task('watch', function(){
    watch(path.join(__dirname, "sass/**/*.scss"), function() { runs('sass'); });
    watch(paths.js.app, function() { runs('js'); });  
    watch(paths.js.plugins, function() { runs('js_plugins'); });
    watch(paths.js.vendor, function() { runs('js_vendor'); });
    watch(paths.js.includes, function() { runs('js_custom'); });
    watch(paths.css.vendor, function() { runs('sass_vendor'); });
    watch(paths.css.plugins, function() { runs('sass_plugins'); });
    watch(paths.pages, function() { runs('pages'); });
});

// --------------------------------------------------------- SHOW WATCHER //




gulp.task('default', ['init', 'html', 'watch'], function(){

    browserSync.init({
        server: {
            baseDir: [path.join(__dirname, targetPath)]
        }
    });
    watch(path.join(__dirname, "views/**/*.html"), function() {
        runs('html');
    });
});

gulp.task('development', ['init', 'watch']);