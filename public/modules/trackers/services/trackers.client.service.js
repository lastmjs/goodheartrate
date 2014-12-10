'use strict';

angular.module('trackers').factory('trackersService', ['$http', function($http) {
	var o = {
		trackers: []
	};
	
	o.getAll = function(username) {
		return $http.get('/' + username + '/trackers').success(function(data) {
			angular.copy(data, o.trackers);
		});
	};
	
	return o;
}]);