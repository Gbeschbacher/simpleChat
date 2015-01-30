(function() {

    var http    = require( "http" );

    var express = require( "express" );
    var morgan  = require( "morgan" );
    var bodyParser = require( "body-parser" );

    var config  = require( "./config" );
    var api = require( "./api" );

    var app = express();

    var accessLogStream = fs.createWriteStream(
        config.accessLog,
        { flags: "a" }
    );

    app.use( morgan( "combined", { stream: accessLogStream }) );

    app.use( bodyParser.urlencoded({extended: true}) );
    app.use( bodyParser.json() );

    app.use( api );

    module.exports = function () {
        server = http.createServer( app );

        server.listen( config.port, function() {
            var address = server.address()
            console.log( "Listening on " + address.address + ":" + address.port );
        });
    }

})();
