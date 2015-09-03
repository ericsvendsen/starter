(function () {
    'use strict';

    var app = angular.module('starterApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ngRoute'
    ]);

    app.config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                controller: 'homeController',
                templateUrl: 'modules/homeTemplate.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    });
})();