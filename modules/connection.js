"use strict";

var mongoose = require( "mongoose" );
var config = require( "./config.js" );

var connection = undefined;

var connect = function() {
    connection = mongoose.createConnection( config.mongo, {
        server: {
            socketOptions: {
                keppAlive: 1
            }
        }
    })
};
connect();

connection.on( "error", function(error) {
    console.log( "error while creating db connection" );
});

connection.on( "disconnected", function() {
    console.log( "disconnected from server, trying to reconnect" );
    connect();
});

connection.on( "open", function() {
    console.log( "db connection opened" );
});

module.exports = connection;