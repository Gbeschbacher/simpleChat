var socketIO = require( "socket.io" );
var User = require( "../api/users/user" ).model;
var Room = require( "../api/rooms/room" ).model;

module.exports = function( server ) {
    var io = socketIO( server );

    io.use( function (socket, next) {
        var name = socket.handshake.query.user;
        var password = socket.handshake.query.password;

        console.log(name, password);

        User.findOne( {name: name}, function( err, user ){
            if ( err ) {
                return next( new Error(err) );
            }
            if ( !user ) {
                return next( new Error("not authorized") );
            }
            if ( !user.authenticate( password ) ) {
                return next( new Error("not authorized") );
            }
            user.online = true;

            user.save( function( err ) {
                if ( err ) {
                    next( new Error( err ) );
                } else {
                    socket.handshake.user = user;
                    next();
                }
            })
        });
    });

    io.on("connection", function(socket) {
        socket.user = socket.handshake.user;
        console.log("got new io connection", socket.user);

        socket.on("addRoom", function() {
            io.sockets.emit("updateRooms");
        });


        socket.on("join", function(data) {
            console.log("find:", data);
            Room.findOne({name:data.room}, function( err, room ) {
                if ( err ) {
                    console.log( "wasn't able to find room ", err );
                } else {
                    console.log("room", room);
                    room.users.push( socket.user._id );
                    room.markModified( "users" );
                    room.save( function( err ){
                        if ( err ) {
                            console.log( "wasn't able to save room ", err);
                        } else {
                            socket.join(room.name);
                            socket.room = room.name;
                            io.sockets.emit("updateRooms");
                            io.sockets.in(socket.room).emit("addUser", socket.user.name);
                        }
                    });
                }
            })
        });

        socket.on("message", function(message) {
            console.log("EMIT MESSAGE", message);
            io.sockets.in(socket.room).emit("message", {
                name: socket.user.name,
                message: message
            });
        });

        socket.on("leave", function() {
            Room.findOne({name:socket.room}, function( err, room ) {
                if ( err ) {
                    console.log( "wasn't able to find room ", err );
                } else {
                    console.log("room", room);
                    var idx = room.users.indexOf( socket.user._id );
                    if ( idx > -1 ) {
                        room.users.splice(idx,1);
                        room.markModified( "users" );
                    }
                    room.save( function( err ){
                        if ( err ) {
                            console.log( "wasn't able to save room ", err);
                        } else {
                            console.log( "leave room", room.name);
                            socket.leave(room.name);
                            io.sockets.emit("updateRooms");
                            io.sockets.in(socket.room).emit("removeUser", socket.user.name);
                            delete socket.room;
                        }
                    });
                }
            })
        })

        socket.on("disconnect", function() {
            console.log("disconnect");
            Room.findOne({name:socket.room}, function( err, room ) {
                if ( err ) {
                    console.log( "wasn't able to find room ", err );
                } else {
                    if (!room) {
                        return;
                    }
                    console.log("room", room);
                    var idx = room.users.indexOf( socket.user._id );
                    if ( idx > -1 ) {
                        room.users.splice(idx,1);
                        room.markModified( "users" );
                    }
                    room.save( function( err ){
                        if ( err ) {
                            console.log( "wasn't able to save room ", err);
                        } else {
                            console.log( "leave room", room);
                            socket.leave(room.name);
                            io.sockets.emit("updateRooms");
                            io.sockets.in(socket.room).emit("removeUser", socket.user.name);
                        }
                    });
                }
            })
        })

    });

};