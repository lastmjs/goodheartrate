'use strict';

angular.module('trackers').factory('trackersService', ['$http', function($http) {
	var o = {
		trackers: []
	};
	
	o.create = function(data) {
		return $http.post('/trackers', data).success(function(data) {
			o.trackers.push(data);
		});
	};
	
	o.getAll = function() {
		return $http.get('/trackers').success(function(data) {
			angular.copy(data, o.trackers);
		});
	};
	
	return o;
}]);