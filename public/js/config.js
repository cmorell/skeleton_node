//Setting up route
angular.module('NAME_APP').config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
        when('/', {
            templateUrl: 'views/index.html'
        }).
        when('/sample_model', {
            templateUrl: 'views/sample_model/list.html'
        }).
        when('/sample_model/create', {
            templateUrl: 'views/sample_model/create.html'
        }).
        when('/sample_model/:sample_modelId/edit', {
            templateUrl: 'views/sample_model/edit.html'
        }).
        when('/sample_model/:sample_modelId/show', {
            templateUrl: 'views/sample_model/view.html'
        }).
        when('/users/:userId', {
            templateUrl: 'views/users/edit.html'
        }).
        when('/account/password_reset', {
            templateUrl: 'views/users/password_reset.html'
        }).
        otherwise({
            redirectTo: '/'
        });
    }
]);


//Setting HTML5 Location Mode
angular.module('NAME_APP').config(['$locationProvider',
    function($locationProvider) {
        $locationProvider.hashPrefix("!");
    }
]);