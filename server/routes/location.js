module.exports = function(app,httpServer) {



    var mongoose = require('mongoose');
    var lct = require('../model/locationModel.js');
    var Location = mongoose.model('Location');

    var io = require('socket.io')(httpServer);

    io.on('connection', function (socket) {
        console.log(socket.id);



    });


    app.get('/api/location', function(req, res) {

         Location.find({}).exec(function(err, data){
            res.json(data);

        });
    });

    app.post('/api/location',function(req,res){

        var l =  new Location();
        l.message = req.body.message;
        var loc = [req.body.longitude,req.body.latitude];
        l.coordinates=loc;
        l.created = new Date();

        l.save(function(err) {
            if (err) {
                console.log("error saving message");

            }else{
                io.sockets.emit('send:locmessage',l);

                res.json(l);
            }
        });

    });


    app.get('/api/geojson', function(req, res) {


        var geoJson =[];

        Location.find({}).exec(function(err, data){

           data.forEach(function(message){

               if(message.coordinates) {
                   var msg = {
                       "type": "Feature",
                       "geometry": {
                           "type": "Point",
                           "coordinates": [message.coordinates[0], message.coordinates[1]]
                       },
                       "properties": {
                           "title": message.message
                       }
                   };

                   geoJson.push(msg);
               }

            });

            res.send(geoJson);

        });


    });



};


