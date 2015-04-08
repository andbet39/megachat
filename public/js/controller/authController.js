/**
 * Created by andrea.terzani on 07/04/2015.
 */
app.controller('authController', function($scope,$http) {

    $scope.user  = {username:'',password:''};


    $http.get('/auth/currentuser').
        success(function(data) {
            $scope.loggeduser = data;
        }).
        error(function() {
            $scope.alert = 'Login failed'
        });


    $scope.login = function(user){
        $http.post('/auth/login', user).
            success(function(data) {
                $scope.loggeduser = data;
            }).
            error(function() {
                $scope.alert = 'Login failed'
            });

    };


    $scope.logout = function(){
        $http.get('/auth/logout')
            .success(function() {
                $scope.loggeduser = {};
            })
            .error(function() {
                $scope.alert = 'Logout failed'
            });

    };


});

