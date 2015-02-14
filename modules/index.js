"use strict";

var http    = require( "http" );

var express = require( "express" );
var morgan  = require( "morgan" );
var bodyParser = require( "body-parser" );

var config  = require( "./config" );
var api = require( "./api" );

var app = express();


if ( process.env.NODE_ENV === "development" ) {
    app.use( require("connect-livereload")({port: 35729}) );
}


app.set( "views", __dirname + "/../views/" );
app.set( "view engine", "jade" );

app.use( morgan() );
app.use( bodyParser.urlencoded({extended: true}) );
app.use( bodyParser.json() );

app.use( express.static("build") );
app.use( express.static("bower_components") );

app.use( api );

module.exports = function () {
    var server = http.createServer( app );

    server.listen( config.port, function() {
        var address = server.address();
        console.log( "Listening on " + address.address + ":" + address.port );
    });
};
