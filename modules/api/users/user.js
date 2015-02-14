"use strict";

mongoose = require( "mongoose" );

db = require( "../../connection.js" );

userSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId
        ref: "Message"
    }]
})

module.exports = {
    schema: userSchema,
    model: db.model( "User", userSchema )
}