angular
    .module("demoApp")
    .factory('LoginService', LoginService); // register the recipe for the service

LoginService.$inject = ['localStorageService', 'LocalStorageConstants', '$q', 'API', '$http'];

function LoginService(LocalStorage, LSC, $q, API, $http) {

    return {

        login: function(data) {

            //first logout any previous
            this.logout();

            var req = {
                method: 'POST',
                url: API.baseUrl + API.loginPath,
                headers: {
                    'X-ApiKey': API.key
                },
                data: data
            };

            return $http(req).then(function(response) {

                //save the auth token
                var auth_token = response.data.auth_token;
                LocalStorage.set(LSC.loggedInAuthTokenKey, auth_token);

                //get the creator
                req = {
                    method: 'GET',
                    url: API.baseUrl + 'creators/current',
                    headers: {
                        'Accept': API.format,
                        'X-ApiKey': API.key,
                        'Authorization': auth_token
                    }
                };

                return $http(req).then(function(response) {
                    //save the creator
                    LocalStorage.set(LSC.loggedInCreatorKey, response.data);
                    //return creator
                    return response.data;

                }, function(error) {
                    return $q.reject(error);
                });
            }, function(error) {
                return $q.reject(error);
            });
        },

        logout: function() {
            LocalStorage.remove(LSC.loggedInCreatorKey);
            LocalStorage.remove(LSC.loggedInAuthTokenKey);
        },

        getCurrentAuthToken: function() {
            return LocalStorage.get(LSC.loggedInAuthTokenKey);
        },
        getCurrentCreator: function() {
            return LocalStorage.get(LSC.loggedInCreatorKey);
        },
        getCurrentCreatorId: function() {
            var currentUser = this.getCurrentCreator();
            return (currentUser != null ? currentUser.id : null);
        },

        isCurrentUser: function(id) {
            var currentUser = this.getCurrentCreator();
            return (currentUser != null && currentUser.id === id);
        },

        isLoggedIn: function() {
            var currentUser = this.getCurrentCreator();
            return (currentUser != null && currentUser.id !== undefined);
        }

    };
}