'use strict';

angular.module('trackers').factory('trackersService', ['$http', function($http) {
	var o = {
		trackers: []
	};
	
	o.getAll = function(username) {
		return $http.get('/trackers/' + username).success(function(data) {
			angular.copy(data, o.trackers);
		});
	};
	
	o.create = function(username, data) {
		return $http.post('/trackers/' + username, data).success(function(data) {
			o.trackers.push(data);
		});
	};
	
	return o;
}]);