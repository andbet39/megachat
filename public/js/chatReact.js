0/*** @jsx React.DOM */



var socket = io.connect();
var messages = [];

var Title  = React.createClass({
    render: function() {
        return (
            <div className="title">
                <h1>{this.props.text}</h1>
            </div>
        );
    }
});

var Chatty = React.createClass({
    getInitialState: function(){

        socket.on('init', this.initialize);
        socket.on('send:message', this.messageRecieve);


        return { user:'',messages:[], text: ''};
    },

    initialize: function(data){
        console.log(data);
        this.setState({user: data.user ,messages:data.mess});
    },

    messageRecieve: function(message){
        this.state.messages.push(message);
        this.setState();
    },
    handleMessageSubmit : function(message){
        this.state.messages.push(message);
        this.setState();
        socket.emit('send:message', message);
        console.log("Sent message" +  message);
    },

    render: function(){
        return(
            <div className="chatty">

                <Title text={this.state.user}/>
                <MessageForm user={this.state.user} submitfnc={this.handleMessageSubmit}/>
                <MessageList messages={this.state.messages}/>
            </div>
        );
    }
});

var MessageList = React.createClass({

    render: function () {
        var renderMessage = function(message){
            return <Message usr={message.user} msg={message.text} />
        }
        return(
        <ul className="message">
            { this.props.messages.map(renderMessage)}
        </ul>
        );
    }
});



var MessageForm = React.createClass({

    getInitialState: function(){
        return {text: ''};
    },
    changeHandler : function(e){
        this.setState({ text : e.target.value });
    },
    handleSubmit : function(e){
        e.preventDefault();
        var message = {
            user : this.props.user,
            text : this.state.text
        }

        this.props.submitfnc(message);
        this.setState({ text: '' });
    },
    render:function(){
        return(
          <div className="messageForm">
              <form onSubmit={this.handleSubmit} >
                  <input onChange={this.changeHandler} value={this.state.text}/>
              </form>
          </div>
        );
    }
});

var Message = React.createClass({
    render: function(){
        return(
            <li className="message">{this.props.usr} say {this.props.msg}
            </li>
        );
    }
});


React.render(
<Chatty />,
    document.getElementById('container')
);