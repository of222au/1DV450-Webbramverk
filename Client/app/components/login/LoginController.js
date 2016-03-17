
angular
    .module('demoApp')
    .controller('LoginController', LoginController);

// Dependency injections, routeParams give us the /:id
LoginController.$inject = ['$scope', 'LoginService', '$window'];

function LoginController($scope, loginService, $window) {

    $scope.closeValidationAlert = false;
    $scope.errorMessage = '';
    $scope.creator = {
        email: 'user1@test.com',
        password: ''
    };

    $scope.login = function() {

        $scope.closeValidationAlert = true;

        loginService.login($scope.creator)
            .then(function (data) {

                //redirect to start page
                $window.location.href = '';

            }, function (error) {
                // Something went wrong!
                $scope.closeValidationAlert = false;
                $scope.errorMessage = error;
                $scope.creator.password = '';
            });
    };

}