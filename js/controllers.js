var demoControllers = angular.module('demoControllers', []);

demoControllers.controller('UserDetailsController', ['$scope', 'Users', '$routeParams'  , function($scope, Users, $routeParams) {

  Users.getUser($routeParams.id).success(function(data){
    $scope.user = data.data;
  });

}]);

demoControllers.controller('SecondController', ['$scope', 'CommonData' , function($scope, CommonData) {
  $scope.data = "";
  $scope.getData = function(){
    $scope.data = CommonData.getData();

  };

}]);


demoControllers.controller('UserListController', ['$scope', '$http', 'Users', '$window' , function($scope, $http,  Users, $window) {

  Users.get().success(function(data){
    $scope.users = data.data;
  });

  $scope.deleteUser = function(index){
    Users.deleteUser($scope.users[index]._id).success(function(data){
      var tmpList = angular.copy($scope.users);
      tmpList.splice(index, 1);
      $scope.users = tmpList;
    });
  };


}]);

demoControllers.controller('SettingsController', ['$scope' , '$window' , function($scope, $window) {
  $scope.url = $window.sessionStorage.baseurl;
  $scope.setUrl = function(){
    $window.sessionStorage.baseurl = $scope.url; 
    $scope.displayText = "URL set";

  };

}]);


