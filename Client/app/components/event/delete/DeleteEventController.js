
angular
    .module('demoApp')
    .controller('DeleteEventController', DeleteEventController);

// Dependency injections, routeParams give us the /:id
DeleteEventController.$inject = ['$scope', '$routeParams', '$location', 'EventService', 'LoginService', 'ValidationService', '$window' ];

function DeleteEventController($scope, $routeParams, $location, eventService, loginService, validationService, $window) {

    // Set the ViewModel
    var vm = this;

    vm.eventId = $routeParams.eventId;

    $scope.errorMessage = '';
    $scope.correctUser = false;

    var loadEvent = function() {

        var eventPromise = eventService.getEvent(vm.eventId);
        eventPromise
            .then(function (data) {

                //save the event
                $scope.event = data.data;
                $scope.eventName = angular.copy($scope.event.name);

                $scope.correctUser = loginService.isCurrentUser($scope.event.creator.id);
                if (!$scope.correctUser) {
                    //wrong user (creator)!
                    $scope.errorMessage = 'Du har inte rättighet att ta bort detta event';
                }

            }).catch(function (error) {
            // Something went wrong!
            $scope.errorMessage = error;
            console.log("Error: " + error);
        });
    };

    $scope.deleteEvent = function() {

        validationService.resetErrors();

        var eventPromise = eventService.deleteEvent($scope.event);
        eventPromise
            .then(function (data) {

                //redirect to events
                $location.path('events');

            }).catch(function (error) {
                // Something went wrong!
                validationService.parseErrors(error);

                //scroll to top of page
                $window.scrollTo(0, 0);
            });
    };

    $scope.cancelDelete = function() {
        $location.path('event/' + vm.eventId);
    };


    loadEvent();

}