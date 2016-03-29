
angular
    .module('demoApp')
    .controller('EditEventController', EditEventController);

// Dependency injections, routeParams give us the /:id
EditEventController.$inject = ['$scope', '$routeParams', 'EventService', 'LoginService', 'ValidationService', '$window', 'GeneralSettings'];

function EditEventController($scope, $routeParams, eventService, loginService, validationService, $window, generalSettings) {

    // Set the ViewModel
    var vm = this;

    vm.eventId = $routeParams.eventId;
    vm.markersControl = {};

    $scope.correctUser = false;
    $scope.eventName = '';
    $scope.errorMessage = '';
    $scope.closeSuccessAlert = false;
    $scope.successMessage = '';

    $scope.markerOptions = { draggable: true };
    $scope.markerEvents = {
        dragend: function (marker, eventName, args) {
            $scope.event.location.latitude = marker.getPosition().lat();
            $scope.event.location.longitude = marker.getPosition().lng();
        }
    };
    $scope.map = {
        center: { latitude: generalSettings.defaultMapSettings.latitude, longitude: generalSettings.defaultMapSettings.longitude },
        zoom: 10,
        window: {
            marker: {},
            show: false,
            closeClick: function() {
                this.show = false;
            },
            options: {} // define when map is ready
        }
    };

    var loadEvent = function() {

        validationService.resetErrors();
        
        var eventPromise = eventService.getEvent(vm.eventId);
        eventPromise
            .then(function (data) {

                //save the event
                $scope.event = data.data;
                $scope.eventName = angular.copy($scope.event.name);

                $scope.correctUser = loginService.isCurrentUser($scope.event.creator.id);
                if ($scope.correctUser) {

                    //set center of map to the marker
                    $scope.map.center = {
                        latitude: $scope.event.location.latitude,
                        longitude: $scope.event.location.longitude
                    };
                }
                else {
                    //wrong user (creator)!
                    $scope.errorMessage = 'Du har inte rättighet att ändra detta event';
                }

            }).catch(function (error) {
            // Something went wrong!
            $scope.errorMessage = error;
            console.log("Error: " + error);
        });
    };


    $scope.saveEvent = function() {

        validationService.resetErrors();

        $scope.closeSuccessAlert = false;
        $scope.successMessage = '';

        var eventPromise = eventService.updateEvent($scope.event);
        eventPromise
            .then(function (data) {
                //save the event
                $scope.event = data;

                //set center of map to the marker
                $scope.map.center = {
                    latitude: $scope.event.location.latitude,
                    longitude: $scope.event.location.longitude
                };

                $scope.successMessage = 'Eventet har sparats';

            }, function(error) {
                console.log(error);
                if (error.status == 401) {
                    loginService.logout();
                    $window.location.href = 'events';
                }
                else {
                    // Something went wrong!
                    validationService.parseErrors(error);
                }
            });

        //scroll to top of page
        $window.scrollTo(0, 0);
    };


    loadEvent();
}