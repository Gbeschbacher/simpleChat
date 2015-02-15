"use strict";

var socketIO = require( "socket.io" );
var User = require( "../api/users/user" ).model;
var Room = require( "../api/rooms/room" ).model;

var io = null;

module.exports = function( server ) {
    io = socketIO( server );

    // authenticate
    io.use( function( socket, next ) {
        var name = socket.handshake.query.user;
        var password = socket.handshake.query.password;
        auth( name, password, socket, next );
    });

    io.on( "connection", function( socket ) {
        socket.user = socket.handshake.user;

        // an api call was allready made, so just inform the others
        socket.on("addRoom", function() {
            io.sockets.emit( "updateRooms" );
        });

        socket.on("join", function(data) {
            joinRoom( data.room, socket );
        });

        // spread the message
        socket.on("message", function(message) {
            io.sockets.in( socket.room ).emit( "message", {
                name: socket.user.name,
                message: message
            });
        });

        socket.on("leave", function() {
            leaveRoom( socket );
        });

        socket.on("disconnect", function() {
            leaveRoom( socket );
        });

    });

};

// user auth
function auth( name, password, socket, cb ) {
    User.findOne( {name: name}, function( err, user ){
        if ( err ) {
            return cb( new Error(err) );
        }
        if ( !user ) {
            return cb( new Error("not authorized") );
        }
        if ( !user.authenticate( password ) ) {
            return cb( new Error("not authorized") );
        }
        socket.handshake.user = user;
        cb();
    });
}

// add a user to the users list and inform other clients
function joinRoom( name, socket ) {
    Room.findOne( {name: name}, function( err, room ) {
        if ( err ) {
            console.log( "wasn't able to find room ", err );
        } else {
            room.users.push( socket.user._id );
            room.markModified( "users" );
            room.save( function( err ){
                if ( err ) {
                    console.log( "wasn't able to save room ", err);
                } else {
                    socket.join(room.name);
                    socket.room = room.name;
                    io.sockets.emit("updateRooms");
                    io.sockets.in( socket.room ).emit("addUser", socket.user.name);
                }
            });
        }
    });
}

// remove a user from the users list and inform other clients
function leaveRoom( socket ) {
    Room.findOne( {name:socket.room}, function( err, room ) {
        if ( err ) {
            console.log( "wasn't able to find room ", err );
        } else {
            if ( room === null ) {
                return;
            }
            var idx = room.users.indexOf( socket.user._id );
            if ( idx > -1 ) {
                room.users.splice(idx,1);
                room.markModified( "users" );
            }
            room.save( function( err ){
                if ( err ) {
                    console.log( "wasn't able to save room ", err);
                } else {
                    socket.leave(room.name);
                    io.sockets.emit("updateRooms");
                    io.sockets.in(socket.room).emit("removeUser", socket.user.name);
                    delete socket.room;
                }
            });
        }
    });
}