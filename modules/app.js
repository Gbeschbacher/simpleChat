"use strict";

var express = require( "express" );
var morgan  = require( "morgan" );
var bodyParser = require( "body-parser" );

var api = require( "./api" );

var app = express();

app.use( require("connect-livereload")({port: 35729}) );

app.set( "views", __dirname + "/../views/" );
app.set( "view engine", "jade" );

app.use( morgan() );
app.use( bodyParser.urlencoded({extended: true}) );
app.use( bodyParser.json() );

app.use( express.static("build") );
app.use( express.static("bower_components") );

app.use( api );

module.exports = app;
