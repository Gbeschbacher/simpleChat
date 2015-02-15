"use strict";

import { OverView as Overview, ChatroomView as Chatroom, LoginView as Login } from './views';
import Chatrooms from './collections';

class Router extends Backbone.Router {

    constructor () {
        this.routes = {
            "": "home",
            "overview": "overview",
            "room/:name": "room"

        };
        super();
    }

    home () {
        console.log("Router#login");
        this.view = new Login();
        $("#app").html(this.view.render().$el);
    }


    overview () {
        window.messages = [];
        var that = this;
        if ( window.socket ) {
            window.socket.emit("leave");
        }
        if (!window.loggedin) {
            setTimeout( function() {
                if (window.loggedin !== true) {
                    return that.navigate("/", {trigger:true});
                }
                that.view = new Overview({collection:window.rooms});
                $("#app").html(that.view.render().$el);


            }, 300);
        } else {
            if (window.loggedin !== true) {
                return this.navigate("/", {trigger:true});
            }
            this.view = new Overview({collection:window.rooms});
            $("#app").html(this.view.render().$el);
        }
    }

    room (name) {
        if (window.loggedin !== true) {
            return this.navigate("/",{trigger:true});
        }
        var room = window.rooms.find({"name": name+""});
        console.log("blubb", room);
        if ( room ) {
            console.log("Router#room");
            window.socket.emit("join", {room: room.name});
            this.view = new Chatroom({collection:window.rooms, name: name});
            $("#app").html(this.view.render().$el);
        } else {
            this.navigate("/");
        }

    }

}

export default Router;
