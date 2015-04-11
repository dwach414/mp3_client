// var demoApp = angular.module('demoApp', ['demoControllers']);

var demoApp = angular.module('demoApp', ['ngRoute', 'demoControllers', 'demoServices', '720kb.datepicker']);

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
        when('/addtask', {
            templateUrl: 'partials/addtask.html',
            controller: 'AddTaskController'
        }).
        when('/tasklist/:id',{
            templateUrl: 'partials/taskdetails.html',
            controller: 'TaskDetailsController'
        }).
        when('/edittask/:id', {
            templateUrl: 'partials/edittask.html',
            controller: 'EditTaskController'
        }).
        otherwise({
            redirectTo: '/settings'
        });
}]);