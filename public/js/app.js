(function () {
    "use strict";
    function config($routeProvider, $locationProvider) {
        $routeProvider.
          when('/login', {
              templateUrl: './partial1.html',
              controller: 'loginController',
              controllerAs: "vm",
              title: "Login"
          }).
          when('/Chat', {
              templateUrl: './partial2.html',
              controller: 'ChatController',
              controllerAs: "vm",
              title: "Chat"
          }).
          otherwise({
              redirectTo: '/login'
          });

        //  $locationProvider.html5Mode(true);

        /* scrollbar defaults
         scrollBarsProvider.defaults = {
            autoHideScrollbar: false,
            //setHeight: 500,
            //scrollInertia: 500,
            axis: "yx",
            advanced: {
                updateOnContentResize: true
            },
            scrollButtons: {
                scrollAmount: "auto", // scroll amount when button pressed
                enable: true // enable scrolling buttons by default
            },
            theme: "minimal-dark"
        };*/
    }
    function run($rootScope, $location, $http) {
        // keep user logged in after page refresh
        //  $rootScope.globals = $cookieStore.get("globals") || {};
        //  if ($rootScope.globals.currentUser) {
        //      $http.defaults.headers.common["Authorization"] = "Bearer " + $rootScope.globals.currentUser.Bearer; // jshint ignore:line
        //  }
        $rootScope.$on("$locationChangeStart", function (event, next, current) {
            $rootScope.title = event.title;
            // redirect to login page if not logged in and trying to access a restricted page
            //var restrictedPage = $.inArray($location.path(), ["/login"]) === -1;
            //  var loggedIn = $rootScope.globals.currentUser;
            //if (restrictedPage && !loggedIn) {
            //    $location.path("/login");
            //  }
        });
        $rootScope.$on("$routeChangeStart", function (next, current) {

        });
        $rootScope.page = {
            setTitle: function (title) {
                this.title = title + " | The Wellness Corner";
            }
        }
    }
    // Declare app level module which depends on filters, and services
    angular.module("myApp",
            [
            //    'ngRoute', 'ngCookies', 'ngResource', 'ngMaterial', 'ngAnimate', 'ngAria'
          "ngResource",
          "ngSanitize",
          "ngRoute",
          //"ngCookies",
          "ngAnimate",
          "ngMaterial",
          "ngMessages",
          "myApp.filters",
          "myApp.directives",

        // 3rd party dependencies
        "btford.socket-io",
         //,"ngScrollbar",
      //   "angular-perfect-scrollbar-2",
      //   "vkEmojiPicker", "mgcrea.ngStrap",
         "emojiApp",
         "sun.scrollable"

            ]).config(config).run(run);
    /*prefix: 'foo~',*/
    config.$inject = ["$routeProvider", "$locationProvider",
    // "scrollBarsProvider"
    ];
    run.$inject = ["$rootScope", "$location", "$http"];

    angular.module("myApp").factory('socket', function (socketFactory) {
        return socketFactory({
            prefix: 'foo',
            ioSocket: io.connect('http://192.168.1.91:3000')
        });
    });


})();
