"use strict";

var mongoose = require( "mongoose" );

var db = require( "../../connection.js" );

var roomSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    messages: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        created: {
            type: Date,
            default: new Date(),
            required: true
        },
        content: {
            type: String,
            required: true
        }
    }]
})

module.exports = {
    schema: roomSchema,
    model: db.model( "Room", roomSchema )
}