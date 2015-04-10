var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('UserDetailsController', ['$scope', 'Users', '$routeParams', 'Tasks', function ($scope, Users, $routeParams, Tasks) {

    var isShowingCompletedTasks = false;

    Users.getUser($routeParams.id).success(function (data) {
        $scope.user = data.data;
    });

    Users.getUserPendingTasks($routeParams.id).success(function (data) {
        $scope.tasks = data.data;
    });

    $scope.cTasks = "";
    $scope.getUserCompletedTasks = function () {
        isShowingCompletedTasks = true;
        Users.getUserCompletedTasks($routeParams.id).success(function (data) {
            $scope.cTasks = data.data;
        });
    };

    $scope.setTaskCompleted = function (taskid, taskname, taskdealine) {
        Tasks.setCompleted(taskid, taskname, taskdealine).success(function (data) {

            Users.getUserPendingTasks($routeParams.id).success(function (data) {
                $scope.tasks = data.data;
            });
            if (isShowingCompletedTasks) {
                $scope.getUserCompletedTasks();
            }

        });

    };

}]);

demoControllers.controller('TaskListController', ['$scope', 'Tasks', function ($scope, Tasks) {

    $scope.taskSubset = "false";
    $scope.taskSort = 1;
    $scope.taskSelect = "dateCreated";
    $scope.prevColor = "secondary";
    $scope.nextColor = "info";

    var skip = 0;

    var taskNumber = 0;

    $scope.deleteTask = function(userID, taskID){
        Tasks.deleteTask(userID, taskID).success(function(data){
            getTaskNumber();
            if(skip )
            if(taskNumber == skip && skip > 0){
                skip -=10;
            }

           getTasks();
        });
    };

    var getTasks = function(){
        Tasks.getTasks($scope.taskSubset, $scope.taskSelect, $scope.taskSort, skip).success(function(data){
            $scope.tasks = data.data;
        });
        if(skip == 0){
            $scope.prevColor = "secondary";
            $scope.nextColor = "info";
        } else if (skip >= (taskNumber -10)){
            $scope.prevColor = "info";
            $scope.nextColor = "secondary";
        } else {
            $scope.prevColor = "info";
            $scope.nextColor = "info";
        }
    };
    var getTaskNumber = function(){
        Tasks.getTaskNumber($scope.taskSubset, $scope.taskSelect, $scope.taskSort).success(function(data){
            taskNumber = data.data;
        });
    };

    getTaskNumber();
    getTasks();

    $scope.getMoreTasks = function(nextorprev){
      if(nextorprev == 0){ // 0 means prev
            if(skip > 0){
                skip -= 10;
                getTasks();
            }
      }  else {
            if(skip < (taskNumber - 10)){
                skip +=10;
                getTasks();
            }
      }
    };

    $scope.updateTasks = function(){
        skip = 0;
        getTaskNumber();
        getTasks();

    };



}]);


demoControllers.controller('UserListController', ['$scope', '$http', 'Users', '$window', function ($scope, $http, Users, $window) {

    Users.get().success(function (data) {
        $scope.users = data.data;
    });

    $scope.deleteUser = function (index) {
        Users.deleteUser($scope.users[index]._id).success(function (data) {
            var tmpList = angular.copy($scope.users);
            tmpList.splice(index, 1);
            $scope.users = tmpList;
        });
    };


}]);

demoControllers.controller('SettingsController', ['$scope', '$window', function ($scope, $window) {
    $scope.url = $window.sessionStorage.baseurl;
    $scope.setUrl = function () {
        $window.sessionStorage.baseurl = $scope.url;
        $scope.displayText = "URL set";

    };

}]);


demoControllers.controller('AddUserController', ['$scope', '$window', 'Users', function($scope, $window, Users){

    $scope.successAlert = true;
    $scope.hideSuccessAlert = function () {
        $scope.successAlert = true;
    }
    $scope.errorAlert = true;
    $scope.hideErrorAlert = function () {
        $scope.errorAlert = true;
    }

    $scope.errorMsg = "";
    $scope.successMsg = "";
    $scope.addUser = function(){
        if($scope.user != undefined && $scope.user.name != undefined && $scope.user.email != undefined){
            Users.addUser($scope.user.name, $scope.user.email).success(function (data){
                $scope.successMsg = data.message;
                $scope.successAlert = false;
            }).error(function (data){
                $scope.errorMsg = data.message;
                $scope.errorAlert = false;
            });
        }
    }

}]);

