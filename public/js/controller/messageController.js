/**
 * Created by andreaterzani on 04/04/15.
 */
app.controller('messageController', function($scope,$http,mySocket) {

    $scope.messages = [{'message':'Prova'},{'message':'Prova2'}];
    $scope.message={'message':'','latitude':42.23232,'longitude':12.2345};

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(setPosition);
    } else {
        x.innerHTML = "Geolocation is not supported by this browser.";
    }

    var mapOptions = {
        center: { lat:  $scope.message.latitude, lng: $scope.message.longitude},
        zoom: 4
    };
    $scope.map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);



    function setPosition(position){

        $scope.message.latitude  = position.coords.latitude;
        $scope.message.longitude = position.coords.longitude;


        $scope.map.panTo(new google.maps.LatLng( position.coords.latitude, position.coords.longitude));


    }



    mySocket.on('send:message',function(mess){

        console.log(mess);
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(mess.coordinates[1],mess.coordinates[0]),
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            title:"test marker"
        });



        marker.info = new google.maps.InfoWindow({
            content: mess.message
        });

             marker.info.open($scope.map, marker);
            setTimeout(function () {
                marker.setMap(null);
                delete marker;
            }, 5000);

        $scope.messages.push(mess);


    });


    $http.get('api/location').success(function(data){
        $scope.messages = data;
    });

    $scope.messageClick=function(message){
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(message.coordinates[1],message.coordinates[0]),
            map: $scope.map,
            animation: google.maps.Animation.DROP,
        });



        marker.info = new google.maps.InfoWindow({
            content: message.message
        });

        marker.info.open($scope.map, marker);
        setTimeout(function () {
            marker.setMap(null);
            delete marker;
        }, 5000);

    };


    $scope.saveMessage = function(message){

        console.log('SaveMessage');

        if($scope.message.message != '') {


            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(message.latitude,message.longitude),
                map: $scope.map,
                animation: google.maps.Animation.DROP,
            });



            marker.info = new google.maps.InfoWindow({
                content: $scope.message.message
            });

            marker.info.open($scope.map, marker);
            setTimeout(function () {
                marker.setMap(null);
                delete marker;
            }, 5000);

            mySocket.emit('send:message',message);
            $scope.messages.push(message);


        }
    };







});


