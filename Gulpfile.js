(function () {
    "use strict";

    var gulp = require( "gulp-help" )(require("gulp"));

    var shell      = require( "gulp-shell" );
    var jshint     = require( "gulp-jshint" );
    var nodemon    = require( "gulp-nodemon" );
    var traceur    = require( "gulp-traceur" );
    var uglify     = require( "gulp-uglify" );
    var concat     = require( "gulp-concat" );
    var sass       = require( "gulp-sass" );
    var prefixer   = require( "gulp-autoprefixer" );
    var minifyCSS  = require( "gulp-minify-css" );
    var docco      = require( "gulp-docco" );
    var jasmine    = require( "gulp-jasmine" );
    var livereload = require( "gulp-livereload" );


    var browserify = require( "browserify" );
    var es6ify     = require( "es6ify" );
    var source     = require( "vinyl-source-stream" );
    var traceur    = require( "gulp-traceur" );
    var rimraf     = require( "rimraf" );
    /*

    Tasks:
        default     serve
        serve       local server, browser open, auto refresh
        build:js    traceur, uglify
        build:css   scss (libsass), autoprefixer
        build       js & css
        test        jasmine, jshint <-- only clientside
        doc         docco
    */

    var _ref = [
        "",
        "",
        "     _                 _       _____ _           _   ",
        "    (_)               | |     / ____| |         | |  ",
        " ___ _ _ __ ___  _ __ | | ___| |    | |__   __ _| |_ ",
        "/ __| | '_ ` _ \\| '_ \\| |/ _ \\ |    | '_ \\ / _` | __|",
        "\\__ \\ | | | | | | |_) | |  __/ |____| | | | (_| | |_ ",
        "|___/_|_| |_| |_| .__/|_|\\___|\\_____|_| |_|\\__,_|\\__|",
        "                | |                                  ",
        "                |_|  ",
        "",
        ""
    ];
    var line;
    for (var _i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        console.log(line);
    }

    var FILES = [
        "./bower_components/jquery/dist/jquery.js",
        "./bower_components/underscore/underscore.js",
        "./bower_components/backbone/backbone.js",
        "./build/main-bundle.js"
    ];

    gulp.task( "doc", function() {
        return gulp.src( ["./modules/**/*.js", "./app/js"] )
            .pipe( docco() )
            .pipe( gulp.dest( "./docs") )

    })
    gulp.task( "docs", ["doc"] );

    gulp.task( "lint", "Lints all CoffeeScript source files.", function() {
        return gulp.src( ["./app/**/*.js", "!./modules/**/*.js"] )
            .pipe( jshint() )
            .pipe( jshint.reporter() );
    });

    gulp.task( "test", ["build"], function() {
        return gulp.src( "spec/**/*.js" )
            .pipe(jasmine());
    })


    /* 3rd step: concat and uglify */
    gulp.task("build:js", ["browserify:main"], function() {
        return gulp.src( FILES )
            .pipe( concat("app.js") )
            .pipe( gulp.dest("./build/") )
            .pipe( uglify() )
            .pipe( livereload() )
    });

    /* 1st Step: transpile es6 with tracur into tmp dir */
    gulp.task( "build:tmp", function() {
        return gulp.src( "./app/js/modules/**/*.js" )
            .pipe( traceur( {modules:"commonjs"} ) )
            .pipe( gulp.dest("./build/tmp") );
    })

    /* 2nd Step: add es6 runtime with browserify */
    gulp.task( "browserify:main", ["build:tmp"], function() {
        return browserify( "./app/js/main.js" )
            .transform( es6ify )
            .bundle()
            .pipe( source("main-bundle.js") )
            .pipe( gulp.dest("./build/") );
    })


    gulp.task( "build:css", function() {
        return gulp.src( "./app/css/app.scss" )
            .pipe( sass() )
            .pipe( prefixer({
                browsers: ['last 2 versions'],
                cascade: false}) )
            .pipe( minifyCSS() )
            .pipe( gulp.dest("./build") )
            .pipe( livereload() )
    });

    gulp.task( "build", ["build:css", "build:js", "build:cleanTemp"]);

    gulp.task( "build:cleanTemp", ["build:js"], function(cb) {
        rimraf( "./build/tmp", function() {
            rimraf( "./build/main-bundle.js", cb );
        });
    })

    gulp.task( "default", "Runs 'develop' and 'test'.", ["serve"] );

    gulp.task("dev", "Runs 'build' and watches the source files, rebuilds the project on change.", ["build", "nodemon"], function() {
        //express.run()
        livereload.listen();
        gulp.watch(["./app/**/*.js"], ["build:js", "test"], function() {
            console.log("js changed");
        });
        gulp.watch(["./app/css/**/*.scss"], ["build:css"], function() {
            console.log("scss changed");
        });
        gulp.watch(["./views/**/*.jade"], function() {
            console.log("view changed");
            livereload.reload();
            //express.notify(cb);
        });
    });

    gulp.task("clean", "Clear './build/' folder.", function(cb) {
        rimraf( "./build", cb );
    });

    gulp.task("clean:tmp", function( cb ) {
        rimraf( "./build/tmp" );
    });


    var nodemonStarted = false;

    gulp.task( "nodemon", ["build"], function() {
        if (nodemonStarted) {
            return true;
        }
        nodemonStarted = true;
        nodemon({
                script: "./app.js",
                watch:  [
                    "./modules"
                ]
            }).on( "restart", function() {
                console.log( "app restarted" );
            });
    });

})();
