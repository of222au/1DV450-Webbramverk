'use strict';

// Declare app level module which depends on views, and components
angular
    .module('demoApp', ['ngRoute', 'LocalStorageModule', 'uiGmapgoogle-maps', 'ngTagsInput'])
    .config(['$routeProvider', '$locationProvider',
        function($routeProvider, $locationProvider) {
            $routeProvider.
            when('/map', {
                templateUrl: 'components/map/map-view.html',
                controller: 'MapController',
                controllerAs: 'mapController'
            }).
            when('/events', {
                templateUrl: 'components/events/list-view.html',
                controller: 'ListController',
                controllerAs: 'listController'
            }).

            when('/event/new', {
                templateUrl: 'components/event/new/new-event-view.html',
                controller: 'NewEventController',
                controllerAs: 'eventController'
            }).
            when('/event/:eventId/edit', {
                templateUrl: 'components/event/edit/edit-event-view.html',
                controller: 'EditEventController',
                controllerAs: 'editEventController'
            }).
            when('/event/:eventId/delete', {
                templateUrl: 'components/event/delete/delete-event-view.html',
                controller: 'DeleteEventController',
                controllerAs: 'deleteEventController'
            }).
            when('/event/:eventId', {
                templateUrl: 'components/event/event-view.html',
                controller: 'EventController',
                controllerAs: 'eventController'
            }).

            when('/login', {
                templateUrl: 'components/login/login-view.html',
                controller: 'LoginController',
                controllerAs: 'loginController'
            }).
            when('/logout', {
                templateUrl: 'components/logout/logout-view.html',
                controller: 'LogoutController'
            }).
            otherwise({redirectTo: '/map'});

            $locationProvider.html5Mode(true);
        }
    ])
    .config(function (localStorageServiceProvider) {
        localStorageServiceProvider
            .setPrefix('demoApp')
            .setStorageType('sessionStorage')
            .setNotify(true, true)
    })
    .config(function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            //    key: 'your api key',
            //v: '3.22', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });
    })
    .constant('GeneralSettings', {
        'defaultMapSettings': {
            'latitude': 58,
            'longitude': 14
        }
    })
    .constant('API', {
        'baseUrl': 'http://localhost:3000/', //change this url if needed (if API is running on another port for example)
        'loginPath': 'auth',
        'format': 'application/json',
        'key': '' //Put an user application API-key here
    })
    .constant('LocalStorageConstants', {  //keys for sessionStorage-keys
        'eventsKey': 'events',
        'tagsKey': 'tags',
        'creatorsKey': 'creators',
        'loggedInAuthTokenKey': 'authToken',
        'loggedInCreatorKey': 'loggedInCreator'
    });
