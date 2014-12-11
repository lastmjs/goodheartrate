'use strict';

angular.module('trackers').factory('trackersService', ['$http', function($http) {
	var o = {
		trackers: [],
		trackerObj: {
			date: undefined,
			bpm: undefined
		},
		chartData: {},
		chartOptions: {}
	};
	
	o.create = function(trackerObj) {
		return $http.post('/trackers', trackerObj).success(function(data) {
			o.trackers.push(data);
		});
	};
	
	o.getAll = function() {
		return $http.get('/trackers').success(function(data) {
			angular.copy(data, o.trackers);
		});
	};
	
	o.getByDate = function(date) {
		return $http.get('/trackers/' + date).success(function(data) {
			if(data !== 'null') {
				angular.copy(data, o.trackerObj);
			} else {
				data = {date: o.trackerObj.date, bpm: undefined};
				angular.copy(data, o.trackerObj);
			}
		});
	};
	
	return o;
}]);