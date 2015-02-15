"use strict";

var router = require( "express" ).Router();
var rooms = require( "./rooms" );
var users = require( "./users" );


router.use( "/api/v0/users", users );
router.use( "/api/v0/rooms", rooms );

router.all( "*", function( req, res ) {
    console.log( "Route not found: ", req.url );
    res.render("index");
});

module.exports = router;