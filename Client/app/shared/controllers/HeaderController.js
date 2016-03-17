
angular
    .module('demoApp')
    .controller('HeaderController', HeaderController);

// Dependency injections, routeParams give us the /:id
HeaderController.$inject = ['$scope', '$location', 'LoginService'];

function HeaderController($scope, $location, loginService) {

    $scope.currentCreator = loginService.getCurrentCreator();

    $scope.isActive = function (viewLocation) {
        return $location.path().indexOf(viewLocation) === 0;
    };

}