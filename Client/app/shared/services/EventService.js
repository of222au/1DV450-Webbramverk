angular
    .module("demoApp")
    .factory('EventService', EventService); // register the recipe for teh service

EventService.$inject = ['ResourceService', 'localStorageService', 'LocalStorageConstants', '$q'];

function EventService(Resource, LocalStorage, LSC, $q) {

    var Event = Resource('events');

    //used when some event has been added (saved) or updated
    var clearCachedEventData = function(id) {
        LocalStorage.remove(LSC.eventsKey);
        LocalStorage.remove(LSC.eventsKey + ':' + id);
    };

    var prepareEventData = function(event) {
        event.location_attributes = event.location;

        return event;
    };


    return {

        get: function(onlyPage) {

            var items = (onlyPage === undefined ? LocalStorage.get(LSC.eventsKey) : null);
            var deferred = $q.defer();

            if (!items) {

                items = [];
                var page = (onlyPage !== undefined ? onlyPage : 1);
                loadData(page, onlyPage !== undefined);

                function loadData(page, onlyThisPage) {

                    Event.getCollection(page).then(function (data) {
                        items = items.concat(data);

                        var pagination = Event.getLastPagination();
                        if (!onlyThisPage && pagination && pagination.total_pages && pagination.total_pages > page) {
                            page += 1;
                            loadData(page);
                        }
                        else {
                            if (!onlyThisPage) {
                                LocalStorage.set(LSC.eventsKey, items);
                            }
                            deferred.resolve(items);
                        }
                    }, function(error) {
                        deferred.reject(error);
                    });
                }
            }
            else {
                deferred.resolve(items);
            }

            return deferred.promise;
        },

        getLastPagination: function() {
            return Event.getLastPagination();
        },

        getEvent: function(id) {

            //Create a promise
            var deferred = $q.defer();
            var promise;

            var obj = {'instanceName': 'events', 'id': id};
            promise = Event.getSingle(obj);

            promise.then(function(data) {

                deferred.resolve(data);

            }).catch(function() {
                deferred.reject("Något gick fel när eventet skulle laddas");
            });

            return promise;
        },

        saveEvent: function(data) {

            var event = prepareEventData(data);

            return Event.save('events', event).then(function(data) {
                console.log('saved event!');
                clearCachedEventData(data.id);
                return data;
            });
        },

        updateEvent: function(data) {

            var event = prepareEventData(data);

            return Event.update('events', event).then(function(data) {
                clearCachedEventData(data.id);
                return data;
            });
        },


        deleteEvent: function(data) {

            var event = prepareEventData(data);

            return Event.delete('events', event).then(function(data) {
                clearCachedEventData(data.id);
                return data;
            });
        }
    };
}