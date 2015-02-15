var server = require( "../index.js" ).server;
var io = require( "socket.io" )( server );

module.exports = io;


