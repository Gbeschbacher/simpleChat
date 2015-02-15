"use strict";

var passport = require( "passport" );

var router = require( "express" ).Router();
var BasicStrategy = require( "passport-http" ).BasicStrategy;

passport.use( new BasicStrategy({}, function( name, password, done ){
    User.findOne( {name: name}, function( err, user ){
        if ( err ) {
            return done( err );
        }
        if ( !user ) {
            return done( null, false );
        }
        if ( !user.authenticate( password ) ) {
            return done( null, false );
        }
        return done( null, user );
    });
}));

var basicAuth = passport.authenticate( "basic", {session:false} );

var User = require( "./user" ).model;

var urlRoot = router.route( "/" );

urlRoot.get( function( req, res ) {
    User.find( {}, function( err, users ){
        if ( err ) {
            console.log( "wasn't able to get Users", err );
            res.send( err );
        } else {
            if ( users == null ) {
                users = []
            }
            res.send( users );
        }
    });
});

urlRoot.post( function( req, res ) {
    user = new User;
    user.name = req.body.name;
    //user.password = req.body.password;

    user.save( function( err ) {
        if ( err ) {
            console.log( "error while creating User ", err );
            res.send( err );
        } else {
            res.status( 200 ).end();
        }
    });
});


module.exports = router;