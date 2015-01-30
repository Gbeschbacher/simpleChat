gulp               = require("gulp-help")(require("gulp"))
coffee             = require "gulp-coffee"
coffeelint         = require "gulp-coffeelint"
jade               = require "gulp-jade"
templateCache      = require "gulp-angular-templatecache"
concat             = require "gulp-concat"
uglify             = require "gulp-uglify"
gif                = require "gulp-if"
karma              = require "gulp-karma"
shell              = require "gulp-shell"
debug              = require "gulp-debug"
copy               = require "gulp-copy"


console.log line for line in [
    ""
    ""
    ""
    "                                        _"
    "__   _____  ___  ___      __      _____| |__         __ _ _ __  _ __"
    "\\ \\ / / _ \\/ __|/ _ \\ ____\\ \\ /\\ / / _ \\ '_ \\ _____ / _` | '_ \\| '_ \\"
    " \\ V /  __/\\__ \\ (_) |_____\\ V  V /  __/ |_) |_____| (_| | |_) | |_) |"
    "  \\_/ \\___||___/\\___/       \\_/\\_/ \\___|_.__/       \\__,_| .__/| .__/"
    "                                                         |_|   |_|"
    ""
]


BUILD_FILES = [
    "./bower_components/jquery/dist/jquery.js"
    "./bower_components/angular/angular.js"
    "./bower_components/angular-route/angular-route.js"
    "./bower_components/angular-resource/angular-resource.js"
    "./bower_components/angular-animate/angular-animate.js"
    "./bower_components/angular-cookies/angular-cookies.js"
    "./bower_components/angular-bootstrap/ui-bootstrap-tpls.js"
    "./bower_components/ng-file-upload/angular-file-upload.js"
    "./bower_components/angular-ui-router/release/angular-ui-router.js"
    "./app/init-deps.coffee"
    "./app/app.coffee"
    "./app/app-controller.coffee"
    "./app/*/**/*.coffee"
    "!./app/*/**/*_test.coffee"
    "./app/**/*.jade"
]

COPY_FILES =
    img:   "app/images/**/**.*"

gulp.task "lint"
    , "Lints all CoffeeScript source files."
    , ->
        gulp.src("./app/**/*.coffee")
            .pipe(coffeelint())
            .pipe(coffeelint.reporter())


gulp.task "test"
    , "Starts and reruns all tests on change of test or source files."
    , ->
        gulp.src "./idonotexist" # workaround - it shouldn't rewrite the sources
            .pipe karma(         # of the config file
                configFile: "karma.conf.coffee"
                action: "watch"
            )


gulp.task "build"
    , "Lints and builds the project to './build/'."
    , ["lint", "copy:img"]
    , ->
        gulp.src(BUILD_FILES)
            .pipe( gif("*.coffee", continueOnError( coffee() ) ) )
            .pipe gif("*.jade", continueOnError( jade() ) )
            .pipe gif("**/index.html", gulp.dest("./build/"))
            .pipe gif "*.html", templateCache(module: "veso")
            .pipe gif("*.js", concat("app.js"))
            .pipe gulp.dest("./build/js/")


gulp.task "build:production"
    , "Lints, builds and minifies the project to './build/'."
    , ["lint"]
    , ->
        gulp.src(BUILD_FILES)
            .pipe gif("*.coffee", coffee())
                .on "error", (error) ->
                    console.error 'CoffeeScript Compile Error: ', error
            .pipe gif("*.jade", jade())
            .pipe gif("**/index.html", gulp.dest("./build/"))
            .pipe gif "*.html", templateCache(module: "veso")
            .pipe gif("*.js", concat("app.js"))
            .pipe uglify()
            .pipe gulp.dest("./build/js/")


gulp.task "default"
    , "Runs 'develop' and 'test'."
    , ["develop"]


gulp.task "build:watch"
    , "Runs 'build' and watches the source files, rebuilds the project on change."
    , ["build"]
    , ->
        gulp.watch ["app/**/*.coffee", "app/**/*.jade"], ["build"]

gulp.task "develop"
    , "Watches/Build and Test the source files on change."
    , ["build:watch", "test"]


gulp.task "dev"
    , "Shorthand for develop."
    , ["develop"]

gulp.task "copy:img"
    , "Copy images to './build/' dir."
    , ->
        gulp.src COPY_FILES.img
            .pipe copy "./build/", prefix: 1

gulp.task "clean"
    , "Clear './build/' folder."
    , (cb) ->
        run rm + " ./build/* -rf"
            .exec(cb)


gulp.task "pull"
    , "Do a git pull."
    , shell.task(
        "git pull"
    )

gulp.task "update"
    , "Pull newest changes, prune and install packages, install bower packages."
    , shell.task([
        "git stash save backup_update_$(date +%Y%m%d_%H%M%S)"
        "git pull"
        "npm prune"
        "npm install"
        "bower install"
    ])

gulp.task "checkout:dev"
    , "Stash & Checkout branch: 'dev'."
    , shell.task ([
        "git stash save backup_checkout:dev_$(date +%Y%m%d_%H%M%S)"
        "git checkout dev"
        "git pull"
        "npm prune"
        "npm install"
        "bower install"
    ])

gulp.task "checkout:test"
    , "Stash & Checkout branch: 'test'."
    , shell.task ([
        "git stash save backup_checkout:test_$(date +%Y%m%d_%H%M%S)"
        "git checkout test"
        "git pull"
        "npm prune"
        "npm install"
        "bower install"
    ])

gulp.task "checkout:master"
    , "Stash & Checkout branch: 'master'."
    , shell.task ([
        "git stash save backup_checkout:master_$(date +%Y%m%d_%H%M%S)"
        "git checkout master"
        "git pull"
        "npm prune"
        "npm install"
        "bower install"
    ])



# TODO: docs

# clean stream of onerror

continueOnError = (stream) ->
    stream
        .on 'error', (err) ->
            console.log err
            return
        .on 'newListener', ->
            cleaner @

cleaner = (stream) ->
    stream.listeners('error').forEach( (item) ->
        if (item.name is 'onerror') then @.removeListener('error', item)
    , stream)

