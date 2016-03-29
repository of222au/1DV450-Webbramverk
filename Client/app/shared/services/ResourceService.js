angular
    .module("demoApp")
    .factory('ResourceService', ResourceService); // register the recipe for teh service

ResourceService.$inject = ['$http', 'API', 'LoginService'];

function ResourceService($http, API, loginService) {

    return function(collectionName) {

        var Resource = function(data) {
            angular.extend(this, data);
        };

        var pagination = null;

        var surroundDataObjectWithResourceName = function(collectionName, data) {
            //put the object data inside an object with collectionName (minus 's', ex. 'events' => 'event')
            var elementName = collectionName.substr(0, collectionName.length - 1);
            var dataElement = {};
            dataElement[elementName] = data;
            return dataElement;
        };

        Resource.getCollection = function(page, per_page) {
            var req = {
                method: 'GET',
                url: API.baseUrl + collectionName,
                headers: {
                    'Accept': API.format,
                    'X-ApiKey': API.key
                },
                params: {
                    page: (page ? page : null),
                    per_page: (per_page ? per_page : null)
                }
            };

            return $http(req).then(function(response) {
                if (response.headers('X-Pagination')) {
                    pagination = JSON.parse(response.headers('X-Pagination'));
                }
                else {
                    pagination = null;
                }

                var result = [];
                angular.forEach(response.data, function(value, key) {
                    result[key] = new Resource(value);
                });
                return result;
            });
        };
        Resource.getLastPagination = function() {
            return pagination;
        };

        Resource.getSingle = function(resourceInfo) {
            var url;
            if (resourceInfo.hasOwnProperty('url')) {
                url = resourceInfo.url;
            }
            else if (resourceInfo.hasOwnProperty('instanceName') && resourceInfo.hasOwnProperty('id')) {
                url = API.baseUrl + resourceInfo.instanceName + '/' + resourceInfo.id;
            }
            else {
                return false;
            }

            var req = {
                method: 'GET',
                url: url,
                headers: {
                    'Accept': API.format,
                    'X-ApiKey': API.key
                }
            };

            return $http(req).then(function(response) {
                return response;
            });
        };

        Resource.save = function(collectionName, data) {
            var dataElement = surroundDataObjectWithResourceName(collectionName, data);

            var req = {
                method: 'POST',
                url: API.baseUrl + collectionName,
                headers: {
                    'Accept': API.format,
                    'X-ApiKey': API.key,
                    'Authorization': loginService.getCurrentAuthToken()
                },
                data: dataElement
            };

            return $http(req).then(function(response) {
                return new Resource(response.data);
            });
        };

        Resource.update = function(collectionName, data) {
            var dataElement = surroundDataObjectWithResourceName(collectionName, data);

            var req = {
                method: 'PUT',
                url: API.baseUrl + collectionName + '/' + data.id,
                headers: {
                    'Accept': API.format,
                    'X-ApiKey': API.key,
                    'Authorization': loginService.getCurrentAuthToken()
                },
                data: dataElement
            };

            return $http(req).then(function(response) {
                return new Resource(response.data);
            });
        };

        Resource.delete = function(collectionName, data) {

            var req = {
                method: 'DELETE',
                url: API.baseUrl + collectionName + '/' + data.id,
                headers: {
                    'Accept': API.format,
                    'X-ApiKey': API.key,
                    'Authorization': loginService.getCurrentAuthToken()
                }
            };

            return $http(req).then(function(response) {
                return new Resource(response.data);
            });
        };

        return Resource;
    };
}