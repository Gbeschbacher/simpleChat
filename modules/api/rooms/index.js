"use strict";

var router = require( "express" ).Router();

var Room = require( "./room" ).model;
var User = require( "../users/user" ).model;

var urlRoot = router.route( "/" );

urlRoot.get( function( req, res ) {
    console.log("blubb");
    Room.find( {}).populate("users").exec( function( err, rooms ){
        if ( err ) {
            console.log( "wasn't able to get Rooms", err );
            res.send( err );
        } else {
            console.log("ROOMS", rooms);
            if ( rooms == null ) {
                rooms = []
            }
            res.send( rooms );
        }
    });
});

urlRoot.post( function( req, res) {
    console.log("blabb");
    var room = new Room;
    room.name = req.body.name;
    if ( req.body.users ) {
        room.users = req.body.users
    }

    room.save( function( err ) {
        if ( err ) {
            console.log( "wasn't able to create new Room ", err );
            res.send( err );
        } else {
            res.status( 200 ).end();
        }
    });
});

var urlName = router.route( "/:name" );

urlName.get( function( req, res ) {

    console.log("blebb");
    Room.findOne( {name: req.params.name}, function( err, room ) {
        if ( err ) {
            console.log( "wasn't able to get Room ", err );
            res.send( err );
        } else {
            res.json( room );
        }
    });
});


/* add a message */
urlName.post( function( req, res ) {
    Room.findOne( {name: req.params.name}, function( err, room ) {
        if ( err ) {
            console.log( "wasn't able to find Room ", err );
        } else {
            User.findOne( {_id: req.body.user}, function( err, user ) {
                if ( err ) {
                    console.log( "wasn't able to find User ", err );
                } else {
                    room.messages.push( {
                        user: user._id,
                        content: req.body.message
                    });
                    room.save( function( err ) {
                        if ( err ) {
                            console.log( "wasn't able to add message ", err );
                        } else {
                            res.status( 200 ).end();
                        }
                    });
                }
            });
        }
    })
});

urlName.delete( function( req, res ) {
    Room.findOne( {name: req.params.name} ).remove( function( err ) {
        if ( err ) {
            console.log( "wasn't able to remove Room ", err );
        } else {
            res.status( 200 ).end();
        }
    });
});


module.exports = router;