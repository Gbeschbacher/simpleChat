"use strict";

class User extends Model{
    constructor(args){
        super(args)
        Object.defineProperty(this, "name", {
            get: function (){ return this.get("name")} ,
            set: function (value) { this.set("name",value); }
        });
    }

    defaults(){
        return{
            name: "unnamed"
        };
    }
}

class Chatroom extends Model{
    constructor(args){
        super(args)

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
        return{
            name: "unnamed"
        };
    }
}

export {User, Chatroom};

