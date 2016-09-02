'use strict';

/* Directives */

angular.module('myApp.directives', []).
  directive('appVersion', function (version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  });
  // .directive("chatUsersList", function () {
  //     return {
  //         link: function (scope, element, attrs) {
  //
  //         },
  //         templateUrl: "../Views/ChatUsersList.html"
  //     }
  // })
