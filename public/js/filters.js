'use strict';

/* Filters */

angular.module('myApp.filters', []).
  filter('interpolate', function (version) {
    return function (text) {
      return String(text).replace(/\%VERSION\%/mg, version);
    }
  }).filter('parseUrl', function($sce) {
    var urlPattern = /(http|ftp|https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/gi;
    return function(text) {
        angular.forEach(text.match(urlPattern), function(url) {
            text = text.replace(url, "<a target=\"_blank\" href="+ url + ">" + url +"</a>");
        });
        return $sce.trustAsHtml(text);
    };
});;
