// var demoApp = angular.module('demoApp', ['demoControllers']);

var demoApp = angular.module('demoApp', ['ngRoute', 'demoControllers', 'demoServices']);

demoApp.config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/userlist/:id', {
            templateUrl: 'partials/userdetails.html',
            controller: 'UserDetailsController'
        }).
        when('/tasklist', {
            templateUrl: 'partials/tasklist.html',
            controller: 'TaskListController'
        }).
        when('/settings', {
            templateUrl: 'partials/settings.html',
            controller: 'SettingsController'
        }).
        when('/userlist', {
            templateUrl: 'partials/userlist.html',
            controller: 'UserListController'
        }).
        when('/adduser', {
            templateUrl: 'partials/adduser.html',
            controller: 'AddUserController'
        }).
        otherwise({
            redirectTo: '/settings'
        });
}]);