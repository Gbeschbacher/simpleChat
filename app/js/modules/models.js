"use strict";

const {Model} = Backbone;
// Chatroom Model
// ==============

// a simple Model, represents the room API
class Chatroom extends Model{
    constructor ( args ) {
        super( args );
        this.url = "/api/v0/room";

        Object.defineProperty( this, "name", {
            get: function (){
                return this.get( "name" );
            },
            set: function ( val ) {
                this.set( "name", val );
            }
        });

        Object.defineProperty( this, "users", {
            get: function (){
                return this.get( "users" );
            },
            set: function ( val ) {
                this.set( "users", val );
            }
        });
    }

    defaults(){
        return {
            name: "",
            users: []
        };
    }

}

export default Chatroom;

