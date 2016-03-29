
angular
    .module('demoApp')
    .controller('MapController', MapController);

// Dependency injections, routeParams give us the /:id
MapController.$inject = ['$scope', 'EventService', 'GeneralSettings'];

function MapController($scope, eventService, generalSettings) {

    // Set the ViewModel
    var vm = this;
    vm.eventList = [];
    vm.markersControl = {};

    $scope.eventsPageNr = 1;
    $scope.errorMessage = '';

    $scope.map = {
        center: { latitude: generalSettings.defaultMapSettings.latitude, longitude: generalSettings.defaultMapSettings.longitude },
        zoom: 7,
        window: {
            marker: {},
            show: false,
            closeClick: function() {
                this.show = false;
            },
            options: {} // define when map is ready
        }
    };

    //load all events
    var loadEvents = function(pageNr) {

        eventService.get(pageNr)

            .then(function (data) {

                vm.eventList = data;

                vm.pagination = eventService.getLastPagination();
                vm.paginationPageList = paginationPageList();

            }, function (error) {
                console.log(error);
                $scope.errorMessage = 'Kunde inte ladda event-listan. Prova igen lite senare.';
            });

        //disable pagination button click if they have "disabled" class
        $('.pagination .disabled a').on('click', function(e) {
            e.preventDefault();
        });
    };


    var paginationPageList = function() {
        var maxPages = vm.pagination.total_pages;
        var startAt = ($scope.eventsPageNr >= 3 ? $scope.eventsPageNr - 2 : 1);
        var endAt = ($scope.eventsPageNr >= (maxPages - 2) ? maxPages : ($scope.eventsPageNr <= 3 ? 5 : ($scope.eventsPageNr + 2)));

        var pageArray = [];
        for (var i = startAt; i <= endAt; i++) {
            pageArray.push(i);
        }

        return pageArray;
    };


    $scope.loadEventsPage = function (pageNr) {
        $scope.eventsPageNr = pageNr;
        loadEvents($scope.eventsPageNr);
    };

    $scope.onMarkerClick = function(marker, eventName, model) {
        $scope.showMarker(model);
    };
    $scope.showMarker = function(model) {
        $scope.map.window.model = model;
        $scope.map.window.show = true;
        $scope.map.center = { latitude: model.location.latitude, longitude: model.location.longitude};
    };


    loadEvents($scope.eventsPageNr);

}