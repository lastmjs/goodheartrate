'use strict';

angular.module('trackers').factory('statsService', ['$http', function($http, trackersService, Authentication) {
	var o = {
		bpMinute: {val: 0},
		bpHour: {val: 0},
		bpDay: {val: 0},
		bpWeek: {val: 0},
		bpMonth: {val: 0},
		bpYear: {val: 0},
		bspMinute: {val: 0},
		bspHour: {val: 0},
		bspDay: {val: 0},
		bspWeek: {val: 0},
		bspMonth: {val: 0},
		bspYear: {val: 0}
	};
	
	o.calculateBeats = function(trackers) {
		var totalBPM = 0;
		var count = 0;
		
		for(var i=trackers.length - 1; i > trackers.length-7; i--) {
			if(trackers[i]) {
				totalBPM += trackers[i].bpm;
				count++;
			} else {
				break;
			}
		}
		
		angular.copy({val: ~~(totalBPM / count)}, o.bpMinute);
		angular.copy({val: o.bpMinute.val * 60}, o.bpHour);
		angular.copy({val: o.bpMinute.val * 1440}, o.bpDay);
		angular.copy({val: o.bpMinute.val * 10080}, o.bpWeek);
		angular.copy({val: o.bpMinute.val * 43200}, o.bpMonth);
		angular.copy({val: o.bpMinute.val * 525600}, o.bpYear);
	};
	
	o.calculateBeatsSaved = function(user) {
		var differencePerMinute = ~~Math.abs(o.bpMinute.val - user.startingHeartRate);
		
		angular.copy({val: differencePerMinute}, o.bspMinute);
		angular.copy({val: differencePerMinute * 60}, o.bspHour);
		angular.copy({val: differencePerMinute * 1440}, o.bspDay);
		angular.copy({val: differencePerMinute * 10080}, o.bspWeek);
		angular.copy({val: differencePerMinute * 43200}, o.bspMonth);
		angular.copy({val: differencePerMinute * 525600}, o.bspYear);
	};
	
	return o;
}]);