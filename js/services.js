// js/services/todos.js
angular.module('demoServices', [])
        .factory('CommonData', function(){
        var data = "";
        return{
            getData : function(){
                return data;
            },
            setData : function(newData){
                data = newData;                
            }
        }
    })
    .factory('Users', function($http, $window) {
        return {
            get : function() {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/users/?select={"_id": 1, "name": 1}');
            },
            getUser: function(userID){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/users/' + userID);
            },
            deleteUser: function(userID){
                var baseUrl = $window.sessionStorage.baseurl;
                $http.get(baseUrl + '/api/users/' + userID).success(function(data){
                    var pendingTasks = data.data.pendingTasks;
                    for(var task in pendingTasks){
                        $http.get(baseUrl + '/api/tasks/' + pendingTasks[task]).success(function(data){
                            var taskData = data.data;
                            $http({
                                method: 'PUT',
                                url: baseUrl + '/api/tasks/' + pendingTasks[task],
                                data: $.param( {deadline: taskData.deadline, name: taskData.name, assignedUser: "", assignedUserName: "unassigned"}),
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            })
                                .success(function(data){
                            });
                        });
                    }


                });

                return $http.delete(baseUrl + '/api/users/' + userID);

            }
        }
    });
