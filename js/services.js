// js/services/todos.js
angular.module('demoServices', [])
    .factory('Tasks', function ($http, $window) {
        return {
            getTask: function(taskid){
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/tasks/' + taskid);
            },
            updateTask: function (task) {
                var baseUrl = $window.sessionStorage.baseurl;
                var retStatement = $http({
                    method: 'PUT',
                    url: baseUrl + '/api/tasks/' + task._id,
                    data: $.param({
                        name: task.name,
                        deadline: task.deadline,
                        assignedUser: task.assignedUser,
                        assignedUserName: task.assignedUserName,
                        description: task.description,
                        completed: task.completed
                    }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data){
                    var taskid = data.data._id;
                    if(task.assignedUser && task.completed == false){
                        $http.get(baseUrl + '/api/users/' + task.assignedUser).success(function(data){
                            if(data.data.pendingTasks.indexOf(taskid.toString()) < 0){
                                var name = data.data.name;
                                var email = data.data.email;
                                var pendingTasks = data.data.pendingTasks;
                                if(pendingTasks.length == 0){
                                    pendingTasks[0] = taskid.toString();
                                } else {
                                    pendingTasks[pendingTasks.length] = taskid.toString();
                                }
                                $http({
                                    method: 'PUT',
                                    url: baseUrl + '/api/users/' + task.assignedUser,
                                    data: $.param({
                                        name: name,
                                        email: email,
                                        pendingTasks: pendingTasks
                                    }),
                                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                                });
                            }
                        });

                    }
                });
                return retStatement;
            },
            addTask: function(task){
                var baseUrl = $window.sessionStorage.baseurl;
                var retStatement = $http({
                    method: 'POST',
                    url: baseUrl + '/api/tasks/',
                    data: $.param({
                        name: task.name,
                        deadline: task.deadline,
                        assignedUser: task.assignedUser,
                        assignedUserName: task.assignedUserName,
                        description: task.description
                    }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                }).success(function(data){
                    var taskid = data.data._id;
                    if(task.assignedUser){
                        $http.get(baseUrl + '/api/users/' + task.assignedUser).success(function(data){
                            var name = data.data.name;
                            var email = data.data.email;
                            var pendingTasks = data.data.pendingTasks;
                            if(pendingTasks.length == 0){
                                pendingTasks[0] = taskid.toString();
                            } else {
                                pendingTasks[pendingTasks.length] = taskid.toString();
                            }
                            $http({
                                method: 'PUT',
                                url: baseUrl + '/api/users/' + task.assignedUser,
                                data: $.param({
                                    name: name,
                                    email: email,
                                    pendingTasks: pendingTasks
                                }),
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            });
                        });

                    }
                });
                return retStatement;
            },
            setCompleted: function (taskID, taskName, taskDeadline) {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http({
                    method: 'PUT',
                    url: baseUrl + '/api/tasks/' + taskID,
                    data: $.param({
                        deadline: taskDeadline,
                        name: taskName,
                        completed: true
                    }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            },
            getTasks: function (subset, select, sort, skip) {
                var baseUrl = $window.sessionStorage.baseurl;
                if (subset != 'All') {
                    return $http.get(baseUrl + '/api/tasks/?select={"_id": 1, "name": 1, "deadline": 1, "assignedUserName": 1, "assignedUser": 1}&limit=10&skip=' + skip + '&sort={' + select + ': ' + sort + '}' + '&where={"completed": ' + subset + '}');
                } else {
                    return $http.get(baseUrl + '/api/tasks/?select={"_id": 1, "name": 1, "deadline": 1, "assignedUserName": 1, "assignedUser": 1}&limit=10&skip=' + skip + '&sort={' + select + ': ' + sort + '}');

                }
            },
            getTaskNumber: function (subset, select, sort) {
                var baseUrl = $window.sessionStorage.baseurl;
                if (subset != 'All') {
                    return $http.get(baseUrl + '/api/tasks/?select={"_id": 1, "name": 1, "deadline": 1, "assignedUserName": 1, "assignedUser": 1}&count=true&sort={' + select + ': ' + sort + '}' + '&where={"completed": ' + subset + '}');
                } else {
                    return $http.get(baseUrl + '/api/tasks/?select={"_id": 1, "name": 1, "deadline": 1, "assignedUserName": 1, "assignedUser": 1}&count=true&sort={' + select + ': ' + sort + '}');

                }
            },
            deleteTask: function (userID, taskID) {
                var baseUrl = $window.sessionStorage.baseurl;
                if(userID != ""){
                    $http.get(baseUrl + '/api/users/' + userID).success(function (data) {
                        var name = data.data.name;
                        var email = data.data.email;
                        var pendingTasks = data.data.pendingTasks;
                        var index = pendingTasks.indexOf(taskID.toString());
                        pendingTasks.splice(index, 1);
                        $http({
                            method: 'PUT',
                            url: baseUrl + '/api/users/' + userID,
                            data: $.param({
                                name: name,
                                email: email,
                                pendingTasks: pendingTasks
                            }),
                            headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                        }).success(function(data){
                        });
                    });
                }

                return $http.delete(baseUrl + '/api/tasks/' + taskID);

            }
        }
    })
    .factory('Users', function ($http, $window) {
        return {
            removePendingTask: function(userID, taskID){
                var baseUrl  = $window.sessionStorage.baseurl;
                $http.get(baseUrl + '/api/users/' + userID).success(function(data){
                    var name = data.data.name;
                    var email = data.data.email;
                    var pendingTasks = data.data.pendingTasks;
                    var index = pendingTasks.indexOf(taskID.toString());
                    pendingTasks.splice(index, 1);
                    $http({
                        method: 'PUT',
                        url: baseUrl + '/api/users/' + userID,
                        data: $.param({
                            name: name,
                            email: email,
                            pendingTasks: pendingTasks
                        }),
                        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                    });
                });
            },
            get: function () {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/users/?select={"_id": 1, "name": 1}');
            },
            getUser: function (userID) {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/users/' + userID);
            },
            deleteUser: function (userID) {
                var baseUrl = $window.sessionStorage.baseurl;
                $http.get(baseUrl + '/api/users/' + userID).success(function (data) {
                    var pendingTasks = data.data.pendingTasks;
                    for (var task in pendingTasks) {
                        $http.get(baseUrl + '/api/tasks/' + pendingTasks[task]).success(function (data) {
                            var taskData = data.data;
                            $http({
                                method: 'PUT',
                                url: baseUrl + '/api/tasks/' + pendingTasks[task],
                                data: $.param({
                                    deadline: taskData.deadline,
                                    name: taskData.name,
                                    assignedUser: "",
                                    assignedUserName: "unassigned"
                                }),
                                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                            })
                                .success(function (data) {
                                });
                        });
                    }


                });

                return $http.delete(baseUrl + '/api/users/' + userID);

            },
            getUserPendingTasks: function (userID) {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/tasks/?where={"assignedUser":"' + userID + '", "completed":false}');
            },
            getUserCompletedTasks: function (userID) {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http.get(baseUrl + '/api/tasks/?where={"assignedUser":"' + userID + '", "completed":true}');
            },
            addUser: function (name, email) {
                var baseUrl = $window.sessionStorage.baseurl;
                return $http({
                    method: 'POST',
                    url: baseUrl + '/api/users',
                    data: $.param({
                        name: name,
                        email: email
                    }),
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
                });
            }
        }
    });
