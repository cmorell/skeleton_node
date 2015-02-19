//Project service used for projects REST endpoint
angular.module('NAME_APP.users').factory("Users", ['$resource','$http', function($resource, $http) {
    Users = $resource('users/:userId', {
        userId: '@id'
    }, {
        update: {
            method: 'PUT'
        },
        remove:{ method: 'DELETE'}
    });

    Users.forgotPassword = function(email){
        console.log("forgotPassword using:"+email);

    	return $http.post('/users/forgotPassword',{email:email});
    };
    
    return Users;
}]);