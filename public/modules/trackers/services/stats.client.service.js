'use strict';

angular.module('trackers').factory('statsService', ['$http', 'trackersService', function($http, trackersService) {
	var o = {
		trackers: trackersService.trackers,
		bpMinute: {val: 0},
		bpHour: {val: 0},
		bpDay: {val: 0},
		bpWeek: {val: 0},
		bpMonth: {val: 0},
		bpYear: {val: 0}
	};
	
	o.calculateBeats = function() {
		var totalBPM = 0;
		
		for(var i=o.trackers.length-1; i > o.trackers.length-8; i--) {
			if(o.trackers[i]) {
				totalBPM += o.trackers[i].bpm;
			} else {
				break;
			}
		}
		
		//var temp = totalBPM / 7;
		
		angular.copy({val: ~~(totalBPM / o.trackers.length)}, o.bpMinute);
		angular.copy({val: o.bpMinute.val * 60}, o.bpHour);
		angular.copy({val: o.bpHour.val * 24}, o.bpDay);
		angular.copy({val: o.bpDay.val * 7}, o.bpWeek);
		angular.copy({val: o.bpDay.val * 30}, o.bpMonth);
		angular.copy({val: o.bpDay.val * 365}, o.bpYear);
	};
	
	return o;
}]);