(function() {
    "use strict";
    /* Controllers */
    function loginController($rootScope, $scope, socket, $location, flashService) {
        var vm = this;
        $rootScope.user = new Object();
        $rootScope.login = false;
        $rootScope.user.login = "";
        $rootScope.user.password = "";
        //    $rootScope.user.login="anjana";
        //  $rootScope.user.password="anjana@123";

        $rootScope.isLogedIn = false;
        //  var ipc=require("ipc");
        //function Init(){
        //  $rootScope.isLogedIn=false;
        //  socket.removeListener();
        //}

        /*    -------------------------------Login---------------------------------------------------------*/
        function login() {
            socket.emit("login", $rootScope.user);
        }
        socket.on("onLogin", function(response) {
            if (response) {
                if (response.UserID !== 0) {
                    $rootScope.isLogedIn = true;
                    $rootScope.loggedinUser = response;


                    $location.path("/Chat");
                } else {
                    flashService.Error("Error");
                }
            }
            console.log(response);
        });
        /*    -------------------------------Login---------------------------------------------------------*/

        vm.Login = login;
        //  Init();
    }
    angular.module("myApp").controller("loginController", loginController);
    loginController.$inject = ["$rootScope", "$scope", "socket", "$location", "FlashService"]
})();
