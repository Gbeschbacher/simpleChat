(function() {
    "use strict";

    var http    = require( "http" );

    var express = require( "express" );
    var morgan  = require( "morgan" );
    var bodyParser = require( "body-parser" );

    var config  = require( "./config" );
    var api = require( "./api" );

    var app = express();

    app.use( morgan() );
    app.use( bodyParser.urlencoded({extended: true}) );
    app.use( bodyParser.json() );

    app.use( express.static("./build") );
    app.use( express.static("./views") );
    app.use( express.static("./bower_components") );

    app.use( api );

    module.exports = function () {
        var server = http.createServer( app );

        server.listen( config.port, function() {
            var address = server.address();
            console.log( "Listening on " + address.address + ":" + address.port );
        });
    };

})();
