"use strict";

const {Model} = Backbone;

class Chatroom extends Model{
    constructor (args) {
        super(args);
        this.url = "/api/v0/room";

        Object.defineProperty(this, "name", {
            get: function (){ return this.get("name")} ,
            set: function (value) { this.set("name",value); }
        });

        Object.defineProperty(this, "users", {
            get: function (){ return this.get("users")} ,
            set: function (value) { this.set("users",value); }
        });
    }

    defaults(){
        return {
            name: "unnamed",
            users: []
        };
    }

}

export default Chatroom;

