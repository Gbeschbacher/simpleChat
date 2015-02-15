"use strict";

var mongoose = require( "mongoose" );

var db = require( "../../connection.js" );

var userSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    salt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    }

})

userSchema.virtual( "password" ).set( function( password ) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hash = this.encryptPassword( password );
}).get( function() {
    return this._password;
});

userSchema.methods = {
    authenticate: function( plainText ) {
        return this.encryptPassword( plainText ) === this.hash;
    },
    makeSalt: function() {
        return Math.round( new Date().valueOf() * Math.random() ) + ""
    },
    encryptPassword: function( password ) {
        if (!password) {
            return;
        }
        try {
            return crypto.createHmac( "sha1", this.salt )
                .update( password )
                .digest( "hex" );
        } catch ( err ) {
            return ""
        }
    }
}

module.exports = {
    schema: userSchema,
    model: db.model( "User", userSchema )
}