(function () {
    "use strict";
  function mysocket($rootScope){
  //var socket = io.connect("http://192.168.1.91:3000");
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      },
      removeAllListeners: function (eventName, callback) {
            socket.removeAllListeners(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function () {
                  callback.apply(socket, args);
                });
            });
        }
    };
}
angular.module("myApp").factory('socket111', mysocket);
mysocket.$inject=["$rootScope"]
})();
