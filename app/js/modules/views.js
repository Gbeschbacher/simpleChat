"use strict";

const {View} = Backbone;
const ENTER_KEY = 13;

class LoginView extends View {
    initialize () {
        this.template = $( "script[name='login']" ).html();
        this.events = {
            "click a#login": "login",
            "click a#signup": "signup",
        };
        this.inProgress = false;
    }

    render () {
        this.$el.html( _.template(this.template)() );
        if ( window.loggedin === false ) {
            this.$el.find( ".alert" ).show();
        } else {
            this.$el.find( ".alert" ).hide();
        }
        return this;
    }

    login ( e ) {
        e.preventDefault();
        if ( this.inProgress ) {
            return;
        }
        this.inProgress = true;
        var password = this.$el.find( "#password" ).val();
        var user = this.$el.find( "#username" ).val();

        var that = this;

        var url = "http://";
        url += encodeURIComponent(user) + ":";
        url += encodeURIComponent(password);
        url += "@localhost:3000/api/v0/user/auth";

        // workaround to prevent 401 popup
        $.ajax({
            url: url,
            type: "GET",
            dataType: "json",
            success: function() {
                window.loggedin = true;
                that.user = {
                    name: user,
                    password: password
                };
                that.start( e.target.href );
            },
            error: function() {
                window.loggedin = false;
                that.inProgress = false;
                that.$el.find( ".alert" ).show();
            }
        });
    }

    signup ( e ) {
        e.preventDefault();

        if (this.inProgress) {
            return;
        }
        this.inProgress = true;

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
            success: function() {
                window.loggedin = true;
                that.user = {
                    name: username,
                    password: password
                };
                that.start( e.target.href );
            },
            error: function() {
                window.loggedin = false;
                that.inProgress = false;
                that.$el.find( ".alert" ).show();
            }
        });

    }

    start ( href ) {
        // create socket
        var that = this;
        window.rooms.fetch({
            data: {
                sort_by: "name"
            }
        }).done(function() {
            window.socket = io.connect( window.url, { query: {
                user: that.user.name,
                password: that.user.password
            }});
            window.socket.on( "updateRooms", function() {
                window.rooms.fetch({
                    data: {
                        sort_by: "name"
                    }
                });
            });
            window.location = href;
            that.inProgress = false;
        });
    }
}

class OverView extends View {

    initialize () {
        this.template = $( "script[name='home']" ).html();
        window.rooms.fetch( {}, {wait:true} );
        this.events = {
            'click button#addRoom': 'addRoom',
            "click a#join": "joinRoom"
        };

        this.collection.on( "all", this.render, this );
    }

    render () {
        this.$el.html( _.template(this.template)( {
            chatrooms: this.collection.models
        }));
        return this;
    }

    addRoom ( e ) {
        e.preventDefault();
        var name = this.$el.find( "#newRoom" ).val();
        this.collection.create( {name: name}, {wait:true} );
        window.socket.emit( "addRoom" );
    }
}

class ChatroomView extends View {

    initialize ( options ) {
        this.name = options.name;
        this.template = $( "script[name='chat']" ).html();
        this.events = {
            "keyup #inputline": "keyPressEventHandler",
            "keyup #msg": "keyUp",
            "click #send": "sendMessage"
        };

        var that = this;
        window.socket.on( "message", function( data ) {
            that.appendMessage( data );
        });
        this.collection.on( "all", this.render, this);
        this.render();
    }

    appendMessage ( data ) {
        window.messages.push( data );
        var $tmpl = $("script[name='message']").html();

        this.$el.find( "ul" ).append(
            _.template( $tmpl )({
                name: data.name,
                message: data.message
            })
        );
    }

    render () {
        this.$el.html( _.template(this.template)({
            rooms: this.collection,
            name: this.name
        }));
        return this;
    }

    sendMessage ( e ) {
        e.preventDefault();
        var $msg = this.$el.find( "input[type='text']" );
        window.socket.emit( "message", $msg.val() );
        $msg.val("");
    }

    keyUp (e){
        if( e.keyCode === ENTER_KEY ){
            this.sendMessage( e );
        }
    }
}

export {OverView, ChatroomView, LoginView};
