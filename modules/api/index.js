"use strict";

var router = require( "express" ).Router();
var rooms = require( "./rooms" );
var users = require( "./users" );


router.use( "/api/v0/user", users );
router.use( "/api/v0/room", rooms );

router.all( "*", function( req, res ) {
    console.log( "Route not found: ", req.url );
    res.render("index");
});

module.exports = router;