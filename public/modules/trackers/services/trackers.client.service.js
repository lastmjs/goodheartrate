'use strict';

angular.module('trackers').factory('trackersService', ['$http', 'graphService', function($http, graphService) {
	var o = {
		trackers: []
	};
	
	o.create = function(data) {
		return $http.post('/trackers', data).success(function(data) {
			o.trackers.push(data);
			//graphService.initGraph();
		});
	};
	
	o.getAll = function() {
		return $http.get('/trackers').success(function(data) {
			angular.copy(data, o.trackers);
			//graphService.initGraph();
		});
	};
	
	return o;
}]);