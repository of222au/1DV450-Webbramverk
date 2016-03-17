angular
    .module("demoApp")
    .factory('ValidationService', ValidationService); // register the recipe for the service

ValidationService.$inject = ['$rootScope'];

function ValidationService($rootScope) {

    $rootScope.validationErrors = [];
    $rootScope.knownValidationErrors = [];


    var doResetErrors = function () {
        $rootScope.validationErrors = [];
        $rootScope.knownValidationErrors = [];
        $rootScope.closeValidationAlert = false;
    };


    $rootScope.hasValidationError = function (errorName) {
        var errors = $rootScope.getValidationErrors(errorName);
        if (errors.length > 0) {
            return true;
        }

        return false;
    };
    $rootScope.getValidationErrorMessage = function (errorName) {
        var errors = $rootScope.getValidationErrors(errorName);
        if (errors.length > 0)
            return errors[0].message;
        else
            return '';
    };
    $rootScope.getValidationErrors = function (errorName) {
        if (!$rootScope.knownValidationErrors) { $rootScope.knownValidationErrors = []; }

        if ($rootScope.validationErrors) {
            var result = $rootScope.validationErrors.filter(function (obj) {
                return obj.name == errorName;
            });
            if (result.length > 0) {
                //move errors found from the general array to known errors array
                for (var i = $rootScope.validationErrors.length - 1; i >= 0; i--) {
                    if ($rootScope.validationErrors[i].name == errorName) {
                        $rootScope.knownValidationErrors.push($rootScope.validationErrors[i]);
                        $rootScope.validationErrors.splice(i, 1);
                    }
                }
            }
            var resultFromKnown = $rootScope.knownValidationErrors.filter(function (obj) {
                return obj.name == errorName;
            });

            return result.concat(resultFromKnown);
        }
        return [];
    };

    return {

        resetErrors: function() {
            doResetErrors();
        },

        parseErrors: function (errors) {
            doResetErrors();

            if (errors.data && errors.data.errors && angular.isObject(errors.data.errors)) {
                for (var key in errors.data.errors) {
                    for (var i = 0; i < errors.data.errors[key].length; i++) {
                        $rootScope.validationErrors.push({ name: key, message: errors.data.errors[key][i] });
                    }
                }
            } else {
                $rootScope.validationErrors.push('Kunde inte utföra åtgärden, kontrollera att allt är rätt inmatat.');
            }
        }
    };
}