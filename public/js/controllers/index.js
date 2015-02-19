angular.module('NAME_APP.system').controller('IndexController', ['$scope', 'Global','Socket', function ($scope, Global, Socket) {

    $scope.global = Global;

    Socket.on('dashboard:updated',function(update){
    	console.log("update:"+update);
    });
}]);