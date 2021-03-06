/**
 * Created by andrea.terzani on 01/04/2015.
 */
module.exports = function(httpServer) {

    var io = require('socket.io')(httpServer);
    var mongoose = require('mongoose');

    var msg = require('./server/model/messagemodel.js');

    var Message = mongoose.model('Message');



    var users = [];


    io.on('connection', function (socket) {
        console.log(socket.id);

        Message.find({}).sort('-created').limit(10).exec(function(err, mess){
            socket.emit('init',{user:getuser(),mess:mess});
        });


        socket.on('send:message', function (data) {
            console.log("Received send:message");

            socket.broadcast.emit('send:message', {
                text: data.text ,
                user: data.user
            });

            savemessage(data);

        });



    });

    var savemessage = function(message){

        var msg = new Message();
        msg.msg=message.text;
        msg.user=message.user;
        msg.created = new Date();

        msg.save(function(err) {
            if (err) {
                console.log("error saving message");
            }
        });

    };

    var getuser = function () {

        var user = "USER" + users.length;
        users.push(user);

        return user;

    };

    

}