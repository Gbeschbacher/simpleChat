"use strict";

import { User, Chatroom } from './models';
import { Users, Chatrooms } from './collections';

const {View} = Backbone;
const ENTER_KEY = 13;


class Socket{
    constructor(){
        this.socket = io();
        return this.socket;
    }
}


class HomeView extends View {

    initialize () {
        this.template = $('script[name="home"]').html();
        console.log("homeview init")

        this.events = {
            'click button#username': 'createUser',
            'click button#chatroom': 'createChatroom',
            'keyup input[name="username"]': 'keyPressEventHandler',
        };

        this.Chatrooms = new Chatrooms;
        this.Users = new Users;

        console.log(JSON.stringify(new User()));
        console.log(JSON.stringify(new User({name: "test"})));

    }

    render () {
        this.$el.html(_.template(this.template));
        return this;
    }

    createUser (e) {
        event.preventDefault();

        var $userName = this.$el.find('input[name="username"]');
        var user = new User({name: $userName.val()})

        this.Users.add(user);
        console.log(this.Users);

    }

    createChatroom (e){
        event.preventDefault();

        var $chatroom = this.$el.find('input[name="chatroom"]');

        var chatroom = new Chatroom({name: $chatroom.val()})

        this.Chatrooms.add(chatroom);
        console.log(this.Chatrooms);

    }

    keyPressEventHandler (event) {
        if(event.keyCode === ENTER_KEY){
            //this.setUserName(event);
        }
    }
}

class ChatroomView extends View {

    initialize () {
        this.template = $('script[name="chatroom"]').html();
        this.events = {
            'click button[type="submit"]': 'sendMessage',
            'keyup input[type="text"]': 'keyPressEventHandler'
        }
    }

    render () {
        console.log($('script[name="chatroom"]').html());
        this.$el.html(_.template(this.template));
        return this;
    }


    sendMessage (event) {
        console.log("sendMessage in ChatroomView")
        event.preventDefault();

        let $message = this.$el.find('input[type="text"]');
        let message = $message.val();
        $message.val('');
        console.log("message in ChatroomView: " + message)
    }

    keyPressEventHandler (event){
        if(event.keyCode === ENTER_KEY){
            this.sendMessage(event);
        }
    }
}

export {HomeView, ChatroomView};
