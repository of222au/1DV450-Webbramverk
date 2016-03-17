
angular
    .module('demoApp')
    .controller('ListController', ListController);

// Dependency injections, routeParams give us the /:id
ListController.$inject = ['$scope', 'EventService', 'LoginService', '$window', '$location'];

function ListController($scope, eventService, loginService, $window, $location) {

    $scope.pageNr = 1;

    var eventsPerPage = 5;
    $scope.allEvents = [];
    $scope.filteredEvents = [];
    $scope.pageEvents = [];
    $scope.pagination = {
        pages: 0,
        startAt: 0,
        endAt: -1
    };

    $scope.searchEventsName = '';
    $scope.searchEventsLocationName = '';
    $scope.searchEventsTagName = '';
    $scope.errorMessage = '';


    var initialize = function() {

        if ($location.search().tag) {
            $scope.searchEventsTagName = $location.search().tag;
        }

        //load events
        eventService.get()

            .then(function (data) {

                $scope.allEvents = data;
                $scope.filter();

            }, function (error) {
                console.log(error);
                $scope.errorMessage = 'Kunde inte ladda event-listan. Prova igen lite senare.';
            });
    };

    $scope.previousPage = function() {
        if ($scope.pageNr > 1) {
            $scope.pageNr = $scope.pageNr - 1;
        }
        else {
            $scope.pageNr = 1;
        }
        $scope.filter();
    };
    $scope.nextPage = function() {
        $scope.pageNr = $scope.pageNr + 1;
        $scope.filter();
    };
    $scope.showPage = function(pageNr) {
        $scope.pageNr = pageNr;
        $scope.filter();
        $window.scrollTo(0, 0);
    };

    $scope.filter = function() {
        filterEvents();
        setPagination();
        setEvents();
    };

    var filterEvents = function () {
        $scope.filteredEvents = [];
        for (var i = 0; i < $scope.allEvents.length; i++) {
            if ($scope.filterEvent($scope.allEvents[i])) {
                $scope.filteredEvents.push($scope.allEvents[i]);
            }
        }
    };
    var setPagination = function() {
        $scope.pagination.pages = ($scope.filteredEvents.length < 1 ? 0 : ($scope.filteredEvents.length < eventsPerPage ? 1 : Math.ceil($scope.filteredEvents.length / eventsPerPage)));
        if ($scope.pageNr > $scope.pagination.pages) {
            $scope.pageNr = ($scope.pagination.pages > 0 ? $scope.pagination.pages : 1);
        }
        $scope.pagination.startAt = ($scope.pageNr - 1) * eventsPerPage;
        $scope.pagination.endAt = ($scope.pagination.startAt + eventsPerPage > $scope.filteredEvents.length ? $scope.filteredEvents.length : $scope.pagination.startAt + eventsPerPage);
        $scope.pagination.firstPage = $scope.pageNr == 1;
        $scope.pagination.lastPage = $scope.pageNr >= $scope.pagination.pages;
        $scope.paginationPageList = paginationPageList();
    };
    var setEvents = function() {
        $scope.pageEvents = [];
        for (var i = $scope.pagination.startAt; i < $scope.pagination.endAt; i++) {
            $scope.pageEvents.push($scope.filteredEvents[i]);
        }
    };

    var paginationPageList = function() {
        var pageArray = [];
        var pageCounter = ($scope.pageNr > 3 ? $scope.pageNr - 2 : 1);
        while(pageCounter <= $scope.pagination.pages && pageCounter <= $scope.pageNr + 2) {
            pageArray.push(pageCounter);
            pageCounter = pageCounter + 1;
        }
        return pageArray;
    };

    $scope.checkIfCurrentUser = function(id) {
        return loginService.isCurrentUser(id);
    };
    $scope.isLoggedIn = function() {
        return loginService.isLoggedIn();
    };

    $scope.clearFilter = function() {
        $scope.searchEventsName = '';
        $scope.searchEventsLocationName = '';
        $scope.searchEventsTagName = '';
        $scope.filter();
    };

    $scope.filterEvent = function(event) {
        if ($scope.searchEventsName !== undefined && $scope.searchEventsName.length !== 0) {
            if ($scope.doSearchEventName(event, $scope.searchEventsName) != true) {
                return false;
            }
        }
        if ($scope.searchEventsLocationName !== undefined && $scope.searchEventsLocationName.length !== 0) {
            if ($scope.doSearchEventLocationName(event, $scope.searchEventsLocationName) != true) {
                return false;
            }
        }
        if ($scope.searchEventsTagName !== undefined && $scope.searchEventsTagName.length !== 0) {
            if ($scope.doSearchEventTagName(event, $scope.searchEventsTagName) != true) {
                return false;
            }
        }
        return true;
    };
    $scope.doSearchEventName = function (event, searchValue) {
        return (event.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0);
    };
    $scope.doSearchEventLocationName = function (event, searchValue) {
        return (event.location.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0);
    };
    $scope.doSearchEventTagName = function (event, searchValue) {
        for (var i = 0; i < event.tags.length; i++) {
            if (event.tags[i].name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) {
                return true;
            }
        }
        return false;
    };


    initialize();

}