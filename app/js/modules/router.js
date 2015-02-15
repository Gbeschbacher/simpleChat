"use strict";

import { RoomsView as Rooms, ChatroomView as Chatroom, LoginView as Login } from './views';
import { Users, Chatrooms } from './collections';

// class Socket{
//     constructor(){
//         this.socket = io();
//         return this.socket;
//     }
// }

class Router extends Backbone.Router {

    constructor () {
        this.routes = {
            "": "home",
            "chatroom/:id": "chatroom"
        };

         this.socket = new Socket;

        this.chatrooms = new Chatrooms;
        this.users = new Users;
        // this.chatrooms.fetch();

        super();
    }

    home () {
        console.log("Router#login");
        this.view = new Login();
        $("#app").html(this.view.render().$el);
    }

    rooms () {
        console.log("Router#home");
        // this.socket.emit("leave");
        // this.view && (this.view.close ? this.view.close() : this.view.remove());
        this.view = new Home({chatroomCollection: this.chatrooms, userCollection: this.users});
        $("#app").html(this.view.render().$el);
    }

    chatroom (_id) {
        let chatroom = this.chatrooms.find({"id": _id})
        console.log("Router#chatroom", chatroom);

        if(chatroom == null){
            return this.navigate("/", {trigger: true});
        }

        // this.socket.removeListener("message");
        // this.socket.emit("leave")
        // this.view && (this.view.close ? this.view.close() : this.view.remove())
        this.view = new Chatroom({model: chatroom, socket: this.socket})
        // this.socket.emit("joinChatroom", _id)
        $("#app").html(this.view.render().$el)

    }
}

export default Router;
