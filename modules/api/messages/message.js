"use strict";

mongoose = require( "mongoose" );

db = require( "../../connection.js" );

messageSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    date:
        type: Date,
        required: true,
        default: Date.now()
})

module.exports = {
    schema: messageSchema,
    model: db.model( "Message", messageSchema )
}