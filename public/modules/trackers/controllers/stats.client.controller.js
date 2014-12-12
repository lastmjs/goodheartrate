'use strict';

// Trackers controller
angular.module('trackers').controller('StatsController', ['$scope', 'statsService',
	function($scope, statsService) {
		$scope.bpMinute = statsService.bpMinute;
		$scope.bpHour = statsService.bpHour;
		$scope.bpDay = statsService.bpDay;
		$scope.bpWeek = statsService.bpWeek;
		$scope.bpMonth = statsService.bpMonth;
		$scope.bpYear = statsService.bpYear;
		$scope.calculateBeats = statsService.calculateBeats;
		
		$scope.calculateBeats();
	}
]);