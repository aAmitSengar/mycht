(function () {
    "use strict";
function flashService($rootScope, $timeout, $mdToast) {
        var service = {};
        function clearFlashMessage() {
            var flash = $rootScope.flash;
            if (flash) {
                if (!flash.keepAfterLocationChange) {
                    delete $rootScope.flash;
                } else {
                    // only keep for a single location change
                    flash.keepAfterLocationChange = false;
                }
            }
        }
        function initService() {
            clearFlashMessage();
            $rootScope.$on("$locationChangeStart", function () {
                clearFlashMessage();
            });
        }

        function success(message, keepAfterLocationChange) {
            //Materialize.toast
          // Materialize.toast(message, 10000, "Successalert");
            $rootScope.showActionToast(message);
        }


        function error(message, keepAfterLocationChange) {
       // Materialize.toast(message, 10000, "erroralert");
             $rootScope.showActionToast(message);
           //    $rootScope.showSimpleToast(message);
                }

        var last = {
            bottom: false,
            top: true,
            left: false,
            right: true
        };
        $rootScope.toastPosition = angular.extend({}, last);
        $rootScope.getToastPosition = function () {
            sanitizePosition();
            return Object.keys($rootScope.toastPosition)
              .filter(function (pos) { return $rootScope.toastPosition[pos]; })
              .join(' ');
        };
        function sanitizePosition() {
            var current = $rootScope.toastPosition;
            if (current.bottom && last.top) current.top = false;
            if (current.top && last.bottom) current.bottom = false;
            if (current.right && last.left) current.left = false;
            if (current.left && last.right) current.right = false;
            last = angular.extend({}, current);
        }
        $rootScope.showSimpleToast = function (message) {
            var pinTo = $rootScope.getToastPosition();
            $mdToast.show(
              $mdToast.simple()
                .textContent(message)
                .position(pinTo)
                .hideDelay(3000)
            );
        };
        $rootScope.showActionToast = function (message) {
            var pinTo = $rootScope.getToastPosition();
            var toast = $mdToast.simple()
              .textContent(message)
              //.action('UNDO')
              //.highlightAction(true)
              //.highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
              .position(pinTo);
            $mdToast.show(toast).then(function (response) {
                if (response == 'ok') {
                    //alert('You clicked the \'UNDO\' action.');
                }
            });
        };

        $rootScope.closeToast = function () {
            $mdToast.hide();
        };

        initService();

        service.Success = success;
        service.Error = error;
        return service;
    }

    angular.module("myApp").factory("FlashService", flashService);
    flashService.$inject = ["$rootScope", "$timeout","$mdToast"];
})();
