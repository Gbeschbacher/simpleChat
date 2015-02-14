"use strict";

mongoose = require( "mongoose" );

db = require( "../../connection.js" );

roomSchema = mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId
        ref: "User"
    }]
})

module.exports = {
    schema: roomSchema,
    model: db.model( "Room", roomSchema )
}