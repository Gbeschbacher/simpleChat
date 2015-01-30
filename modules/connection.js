"use strict";
var config, connect, db, mongoose;

mongoose = require("mongoose");

config = require("../config");

db = "";

connect = function() {
    return db = mongoose.createConnection(config.mongo, {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    });
};

connect();

db.on("error", function(error) {
    console.log("error while creating db connection");
    return console.log(error);
});

db.on("disconnected", function() {
    console.log("disconnected from server, trying to reconnect");
    return connect();
});

db.once("open", function() {
    return console.log("db connection opened", config.mongo);
});

module.exports = db;
