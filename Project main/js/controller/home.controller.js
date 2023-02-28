(function () {
  "use strict";

  angular.module("app").controller("HomeController", HomeController);

  HomeController.$inject = ["UserService", "$rootScope"];
  function HomeController(UserService, $rootScope, $scope) {
    var $scope = this;
    $rootScope.taskId = 0;

    $scope.user = null;
    $scope.allUsers = [];
    $scope.deleteUser = deleteUser;

    initController();

    function initController() {
      loadCurrentUser();
      loadAllUsers();
    }
    function loadCurrentUser() {
      UserService.GetByUsername($rootScope.globals.currentUser.username).then(
        function (user) {
          $scope.user = user;
        }
      );
    }

    function loadAllUsers() {
      UserService.GetAll().then(function (users) {
        $scope.allUsers = users;
      });
    }

    function deleteUser(id) {
      UserService.Delete(id).then(function () {
        loadAllUsers();
      });
    }

    $scope.tasks = [
      {
        id: 1,
        taskName: "Task 1",
        isChecked: false,
      },
      {
        id: 2,
        taskName: "Task 2",
        isChecked: false,
      },
      {
        id: 3,
        taskName: "Task 3",
        isChecked: true,
      },
    ];

    $scope.addTask = function () {
      if ($scope.newTaskName) {
        $scope.tasks.push({
          id: Math.floor(Math.random() * 1000),
          taskName: $scope.newTaskName,
          isChecked: false,
        });
        $scope.newTaskName = "";
        localStorage.setItem("tasks", JSON.stringify($scope.tasks));
        var retrievedObject = localStorage.getItem("tasks");

        console.log("retrievedObject: ", JSON.parse(retrievedObject));
      }
      console.log($scope.tasks);
    };

    $scope.markAll = false;
    $scope.toggleMarkAll = function () {
      angular.forEach($scope.tasks, function (task) {
        task.isChecked = !$scope.markAll;
      });
    };

    $scope.clear = function () {
      var oldTodos = $scope.tasks;
      $scope.tasks = [];
      angular.forEach(oldTodos, function (task) {
        if (!task.isChecked) {
          $scope.tasks.push(task);
        }
      });
    };

    $scope.hasDone = function () {
      return $scope.tasks.length != $scope.remaining();
    };

    $scope.itemText = function () {
      return $scope.tasks.length - $scope.remaining() > 1 ? "items" : "item";
    };

    $scope.remaining = function () {
      var count = 0;
      angular.forEach($scope.tasks, function (task) {
        count += task.isChecked ? 0 : 1;
      });
      return count;
    };
  }
})();
