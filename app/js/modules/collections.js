"use strict";

import Chatroom from './models';
const {Collection} = Backbone;

// Chatroom Collection
// ===================

// a collections of Chatrooms
class Chatrooms extends Collection {
    constructor ( args ) {
        super( args );
        this.model = Chatroom;
        this.url = "/api/v0/room";
    }
}

export default Chatrooms;