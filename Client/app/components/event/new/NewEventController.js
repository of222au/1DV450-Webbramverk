
angular
    .module('demoApp')
    .controller('NewEventController', NewEventController);

// Dependency injections, routeParams give us the /:id
NewEventController.$inject = ['$scope', 'EventService', 'LoginService', '$window', '$location', 'GeneralSettings', 'ValidationService'];

function NewEventController($scope, eventService, loginService, $window, $location, generalSettings, validationService) {

    // Set the ViewModel
    var vm = this;

    vm.markersControl = {};
    $scope.event = {
        name: '',
        creator_id: loginService.getCurrentCreatorId(),
        location: {
            latitude: generalSettings.defaultMapSettings.latitude,
            longitude: generalSettings.defaultMapSettings.longitude
        }
    };

    $scope.isLoggedIn = loginService.isLoggedIn();
    $scope.closeSuccessAlert = false;
    $scope.errorMessage = '';

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

    var initialize = function() {

        validationService.resetErrors();

        if (!$scope.isLoggedIn) {
            $location.url('login');
        }
    };

    $scope.saveEvent = function() {

        validationService.resetErrors();

        $scope.closeSuccessAlert = false;
        $scope.successMessage = '';

        var eventPromise = eventService.saveEvent($scope.event);
        eventPromise
            .then(function (data) {

                //redirect to event
                $location.path('event/' + data.id);
                $scope.$apply();

            }, function(error) {
                console.log(error);
                if (error.status == 401) {
                    loginService.logout();
                    $window.location.href = 'events';
                }
                else {
                    // Something went wrong!
                    validationService.parseErrors(error);
                    $window.scrollTo(0, 0);
                }
            });
    };

    initialize();
}