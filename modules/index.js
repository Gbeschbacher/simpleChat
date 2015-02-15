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

var basicAuth = passport.authenticate( "basic", {session:false} );

if ( process.env.NODE_ENV === "development" ) {
    app.use( require("connect-livereload")({port: 35729}) );
}


app.set( "views", __dirname + "/../views/" );
app.set( "view engine", "jade" );

app.use( passport.initialize() );
app.use( morgan("combined") );
app.use( bodyParser.urlencoded({extended: true}) );
app.use( bodyParser.json() );

app.use( express.static("./build") );

app.use( api );

var server = http.createServer( app );
socket( server );

module.exports =  {
    server: server,
    start: function() {
        server.listen( config.port, function() {
            var address = server.address();
            console.log( "Listening on " + address.address + ":" + address.port );
        });
    }
}
