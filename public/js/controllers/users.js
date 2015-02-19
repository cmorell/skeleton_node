angular.module('NAME_APP.users').controller('UsersController', ['$scope','$log','$routeParams', '$location','$modal', 'Global', 'Users','ngDialog', 
    function ($scope, $log, $routeParams, $location,$modal, Global, Users, ngDialog) {
    $scope.global = Global;
    




    $scope.cancel = function(){
        $location.path("/");
    };

    

    $scope.update = function(){

        var user = $scope.user;
       
       
        if($scope.password){
            user.password = $scope.password;
        }
        if($scope.new_password){
            user.new_password = $scope.new_password;
        }


        console.log("user"+JSON.stringify(user));
        user.$update(function(data) {
            console.log(data);

            if(typeof data.error !== 'undefined' && data.error !==''){
                $scope.error = data.error;
                $scope.user.email = data.user.email;
                $scope.user.username = data.user.username;
                $scope.user.name = data.user.name;
                $scope.user.id = data.user.id;
                $scope.user.hashedPassword = data.hashedPassword;
            }else{
                $location.path('/');  
            }
            //
        });
    };

    

   

    $scope.findOne = function() {
        Users.get({
            userId: $routeParams.userId
        }, function(user) {
            console.log("get user"+user);
            
                $scope.user = user;
            
           
            
        });
    };

    $scope.passwordReset = function(){
        console.log("selected email:"+$scope.email);

        Users.forgotPassword($scope.email).success(function (data) {
            if(typeof data.error !== 'undefined' && data.error !== ''){
                $scope.error = data.error;
            }else{
                $scope.success = data.success;
                goBack.value = "Back";
            }

        });
    };
    
    
        

}]);