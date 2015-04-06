var app  = angular.module('locationApp', [ 'btford.socket-io' ]).
    factory('mySocket', function (socketFactory) {
        return socketFactory();
    });