"use strict";

import Chatroom from './models';

const {Collection} = Backbone;

class Chatrooms extends Collection {
    constructor (args) {
        super(args)
        this.model = Chatroom;
        this.url = "/api/v0/room";
    }
}

export default Chatrooms;