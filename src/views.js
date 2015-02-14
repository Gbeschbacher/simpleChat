class HomeView extends Backbone.View{

    initialize () {
        this.template = $('script[name=""]').html();
    }

    render () {
        this.$el.html(_.template(this.template));
        return this;
    }

}

class ChatroomView extends Backbone.View{

    initialize () {
        this.template = $('script[name=""]').html();
    }

    render () {
        this.$el.html(_.template(this.template));
        return this;
    }

}

export{HomeView, ChatroomView};
