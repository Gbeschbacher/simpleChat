"use strict";
var http    = require( "http" );

var express = require( "express" );
var morgan  = require( "morgan" );
var bodyParser = require( "body-parser" );
var passport = require( "passport" );

var config  = require( "./config" );
var api = require( "./api" );
var socket = require( "./socket" );

var app = express();

// inject livereload script if in development env
if ( process.env.NODE_ENV === "development" ) {
    app.use( require("connect-livereload")({port: 35729}) );
}

// set view path & engine
app.set( "views", __dirname + "/../views/" );
app.set( "view engine", "jade" );

app.use( passport.initialize() );
app.use( morgan("combined") );
app.use( bodyParser.urlencoded({extended: true}) );
app.use( bodyParser.json() );

// serve docs
app.use( express.static("./docs") );

// serve build files
app.use( express.static("./build") );

// bind api
app.use( api );

var server = http.createServer( app );
// add socket.io server
socket( server );

module.exports =  {
    server: server,
    start: function() {
        server.listen( config.port, function() {
            var address = server.address();
            console.log( "Listening on " + address.address + ":" + address.port );
        });
    }
};
