
angular
    .module('demoApp')
    .controller('LogoutController', LogoutController);

// Dependency injections, routeParams give us the /:id
LogoutController.$inject = ['$scope', 'LoginService', '$window'];

function LogoutController($scope, loginService, $window) {

    $scope.logout = function() {

        loginService.logout();

        //redirect to start page
        $window.location.href = '';
    };

    $scope.logout();
}