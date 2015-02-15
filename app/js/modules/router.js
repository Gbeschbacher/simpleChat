"use strict";

import { OverView as Overview, ChatroomView as Chatroom, LoginView as Login } from './views';

// Router
// ======

class Router extends Backbone.Router {

    constructor () {
        // define routes
        this.routes = {
            "": "home",
            "overview": "overview",
            "room/:name": "room"
        };
        super();
    }

    // home
    // ----

    // render login view
    home () {
        this.view = new Login();
        $( "#app" ).html( this.view.render().$el );
    }

    // overview
    // --------
    overview () {
        window.messages = [];

        // make sure, that last room was left
        if ( window.socket ) {
            window.socket.emit( "leave" );
        }
        // if not logged in, return to home
        if ( window.loggedin !== true ) {
            return this.navigate( "/", {trigger:true} );
        }
        // render Overview
        this.view = new Overview( {collection:window.rooms} );
        $( "#app" ).html( this.view.render().$el );
    }

    // room
    // ----
    room ( name ) {
        // if not logged in, return to home
        if ( window.loggedin !== true ) {
            return this.navigate( "/", {trigger:true} );
        }

        // check if room exists
        var room = window.rooms.find( {"name": name + ""} );

        if ( room ) {
            // if so, emit join, render Chatroom
            window.socket.emit( "join", {room: room.name} );
            this.view = new Chatroom( {collection:window.rooms, name: name} );
            $("#app").html( this.view.render().$el );
        } else {
            this.navigate( "/" );
        }

    }

}

export default Router;
