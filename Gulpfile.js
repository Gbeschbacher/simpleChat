(function () {
    "use strict";

    var gulp = require( "gulp-help" )(require("gulp"));

    var shell = require( "gulp-shell" );
    var jshint = require( "gulp-jshint" );
    var nodemon = require( "gulp-nodemon" );
    var traceur = require( "gulp-traceur" );
    var uglify  = require( "gulp-uglify" );
    var sourcemaps = require( "gulp-sourcemaps" );

    /*

    Tasks:
        default     connect & file watcher
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
        "",
        ""
    ];
    var line;
    for (var _i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        console.log(line);
    }




    gulp.task("lint", "Lints all CoffeeScript source files.", function() {
        gulp.src(["./**/*.js", "!./node_modules/**", "!./build/**", "!./bower_components/**"]).pipe(jshint()).pipe(jshint.reporter());
    });


    gulp.task("build", "Lints, builds and minifies the project to './build/'.", ["lint"], function() {
        return gulp.src( "app/*.js" )
            .pipe( traceur() )
            .pipe( uglify() )
            .pipe( gulp.dest("./build") );
    });

    gulp.task("default", "Runs 'develop' and 'test'.", ["develop"]);

    gulp.task("build:watch", "Runs 'build' and watches the source files, rebuilds the project on change.", ["build"], function() {
        gulp.watch(["app/**/*.js", "app/**/*.jade"], ["build"]);
    });

    gulp.task("develop", "Watches/Build and Test the source files on change.", ["build:watch", "test"]);

    gulp.task("dev", "Shorthand for develop.", ["develop"]);

    gulp.task("clean", "Clear './build/' folder.", shell.task(["rm ./build/* -rf"]));

    gulp.task("pull", "Do a git pull.", shell.task("git pull"));

    gulp.task("update", "Pull newest changes, prune and install packages, install bower packages.", shell.task(["git stash save backup_update_$(date +%Y%m%d_%H%M%S)", "git pull", "npm prune", "npm install", "bower install"]));

    gulp.task("checkout", "Stash & Checkout branch: 'master'.", shell.task(["git stash save backup_checkout:master_$(date +%Y%m%d_%H%M%S)", "git checkout master", "git pull", "npm prune", "npm install", "bower install"]));


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


    /*
    var continueOnError = function(stream) {
        return stream.on('error', function(err) {
            console.log(err);
        }).on('newListener', function() {
            return cleaner(this);
        });
    };

    var cleaner = function(stream) {
        return stream.listeners('error').forEach(function(item) {
            if (item.name === 'onerror') {
                return this.removeListener('error', item);
            }
        }, stream);
    };*/
})();