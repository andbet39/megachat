/**
 * Created by andrea.terzani on 07/04/2015.
 */
app.controller('authController', function($scope,$http) {

    $scope.user  = {username:'',password:''};
    $scope.loggeduser ={};

    $scope.login = function(user){
        console.log('POST : login');

        $http.post('/login', user).
            success(function(data, status, headers, config) {
                     $scope.loggeduser = data;


            }).
            error(function(data, status, headers, config) {
                $scope.alert = 'Login failed'
            });

    };


});

