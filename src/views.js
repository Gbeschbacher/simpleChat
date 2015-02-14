const {View, Model, Collection} = Backbone;
const ENTER_KEY = 13;

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

class Socket{
    constructor(){
        this.socket = io();
        return this.socket;
    }
}

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

class Users extends Collection {
  constructor (args) {
    this.model = User;
    super(args)
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

class Chatrooms extends Collection {
  constructor (args) {
    this.model = Chatroom;
    super(args)
  }
}



export{HomeView, ChatroomView};
