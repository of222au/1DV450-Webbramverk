
angular
    .module('demoApp')
    .controller('EventController', EventController)
    .directive('eventView', function() {
        return {
            templateUrl: 'components/event/_event-info-view.html'
        };
    });

// Dependency injections, routeParams give us the /:id
EventController.$inject = ['$scope', '$routeParams', 'EventService', 'LoginService', 'GeneralSettings'];

function EventController($scope, $routeParams, eventService, loginService, generalSettings) {

    // Set the ViewModel
    var vm = this;
    vm.eventId = $routeParams.eventId;
    vm.markersControl = {};

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

        //load event
        var eventPromise = eventService.getEvent(vm.eventId);
        eventPromise
            .then(function (data) {
                $scope.event = data.data;
                //set center of map to the marker
                $scope.map.center = {
                    latitude: $scope.event.location.latitude,
                    longitude: $scope.event.location.longitude
                };
            }).catch(function (error) {
                // Something went wrong!
                vm.message = error;
                console.log("Error: " + error);
            });
    };

    $scope.checkIfCurrentUser = function(id) {
        return loginService.isCurrentUser(id);
    };


    loadEvent();

}