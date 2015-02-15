"use strict";

const {View} = Backbone;
const ENTER_KEY = 13;



class LoginView extends View {
    initialize (options) {
        console.log("loginview init", window.loggedin);
        this.template = $( "script[name='login']" ).html();
        this.events = {
            "click a#login": "login",
            "click a#signup": "signup",
        }
        this.inProgress = false;
        this.render();
    }

    render (options) {
        this.$el.html( _.template(this.template)({
            // vars
        }));
        if (window.loggedin == false) {
            this.$el.find(".alert").show();
        } else {
            this.$el.find(".alert").hide();
        }
        return this;
    }

    login (e) {
        //e.preventDefault();
        if (this.inProgress) {
            return;
        }
        this.inProgress = true;
        //this.$el.find(".alert").hide()
        var password = this.$el.find("#password").val();
        var user = this.$el.find("#username").val();
        console.log("login", user, password);

        var that = this;
        // workaround to prevent 401 popup
        $.ajax({
            url: "http://"+encodeURIComponent(user)+":"+encodeURIComponent(password)+"@localhost:3000/api/v0/user/auth",
            type: "GET",
            dataType: "json",
            success: function( data ) {
                window.loggedin = true;
                console.log("auth success");
                that.user = {
                    name: user,
                    password: password
                }
                that.start();
            },
            error: function( err ) {
                window.loggedin = false;
                that.inProgress = false;
                that.$el.find(".alert").show();
                console.log("error", err);
            }
        });
        return true;
    }

    signup (e) {
        console.log("signup");
        if (this.inProgress) {
            return;
        }
        this.inProgress = true;
        //this.$el.find(".alert").hide();

        var password = this.$el.find("#password").val();
        var username = this.$el.find("#username").val();
        var that = this;
        $.ajax({
            url: window.url + "/api/v0/user",
            type: "POST",
            dataType: "json",
            data: {
                name: username,
                password: password
            },
            success: function( data ) {
                console.log("success");
                window.loggedin = true;
                that.user = {
                    name: username,
                    password: password
                }
                that.start();
            },
            error: function( err ) {
                window.loggedin = false;
                that.inProgress = false;
                that.$el.find(".alert").show();
                console.log("error", err);
            }
        })

    }

    start () {
        // create socket
        var that = this;
        var prev = that.view;
        window.rooms.fetch({
            data: {
                sort_by: 'name'
            }
        }).done(function() {
            console.log("blubB");
            window.socket = io.connect( window.url, {query: {
                user: that.user.name,
                password: that.user.password
            }});
            window.socket.on("updateRooms", function() {
                console.log("updateRooms");
                window.rooms.fetch({
                    data: {
                        sort_by: 'name'
                    }
                });
            });
            console.log(window.socket);
            console.log( url );

            /*var next = new HomeView({collection: window.rooms});
            if (prev) {
                prev.remove();
            }
            next.render();
            that.$el.html(next.$el);
            that.view = next;
            */
            that.inProgress = false;
        });
    }
}

class OverView extends View {

    initialize (options) {
        console.log("whaat?")
        console.log(this.collection);
        this.template = $('script[name="home"]').html();
        console.log("homeview init", this.collection)
        window.rooms.fetch({},{wait:true});
        this.events = {
            'click button#addRoom': 'addRoom',
            "click a#join": "joinRoom"
        };

        this.collection.on('all', this.render, this);
        this.render();
    }

    render () {
        this.$el.html(_.template(this.template)({
            chatrooms: this.collection.models
        }));
        return this;
    }


    addRoom (e) {
        console.log("addRoom", this.collection.create);
        e.preventDefault();
        var name = this.$el.find("#newRoom").val();
        this.collection.create({name: name},{wait:true});
        window.socket.emit("addRoom", {asdf: "jklö"});
    }

    /*
    joinRoom (room) {
        var room = this.collection.find({"name":$(e.target).data("room")+""});
        console.log("join", room.name);
        socket.emit("join", {room: room.name});

        var prev = this.view;
        var next = new ChatroomView({collection: room});
        if (prev) {
            prev.remove();
        }
        next.render();
        this.$el.html(next.$el);
        this.view = next;
    }
    */



    keyPressEventHandler (event) {
        if(event.keyCode === ENTER_KEY){

            let inputName = $(event.currentTarget).attr("name");
            console.log(inputName === "username")
            console.log(inputName);
            if(inputName === "username"){
                this.createUser(event);
            }else{
                this.createChatroom(event);
            }

            //this.createUser(event);
        }
    }
}

class ChatroomView extends View {

    initialize (options) {
        console.log("chatroom init", this.collection);
        this.name = options.name;
        this.template = $('script[name="chat"]').html();
        this.events = {
            'keyup #inputline': 'keyPressEventHandler',
            "keyup #msg": "keyUp",
            "click #send": "sendMessage"
        }
        var that = this;
        window.socket.on("message", function(data) {
            that.appendMessage(data);
        })
        this.collection.on( "all", this.render, this);
        this.render();
        /*
        this.socket.on('message', function(user, msg){
            console.log(user + ": " + msg);
            this.getMessage(user, msg)
        });
        */

    }

    appendMessage (data) {
        window.messages.push(data);
        var $tmpl = $('script[name="message"]').html();
        console.log("tmpl", $tmpl, data);
        this.$el.find("ul").append(
            _.template($tmpl)({
                name: data.name,
                message: data.message
            })
        )
    }

    render () {
        this.$el.html(_.template(this.template)({
            rooms: this.collection,
            name: this.name
        }));
        return this;
    }

    sendMessage (e) {
        console.log("sendMessage in ChatroomView")
        e.preventDefault();

        var $msg = this.$el.find('input[type="text"]');
        window.socket.emit("message", $msg.val());
        $msg.val('');
    }

    keyUp (e){
        if(e.keyCode === ENTER_KEY){
            this.sendMessage(e);
        }
    }
}

export {OverView, ChatroomView, LoginView};
