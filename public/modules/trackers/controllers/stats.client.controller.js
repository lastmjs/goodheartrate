'use strict';

// Trackers controller
angular.module('trackers').controller('StatsController', ['$scope', 'Authentication', 'trackersService', 'statsService',
	function($scope, Authentication, trackersService, statsService) {
		$scope.user = Authentication.user;
		$scope.trackers = trackersService.trackers
		
		$scope.bpMinute = statsService.bpMinute;
		$scope.bpHour = statsService.bpHour;
		$scope.bpDay = statsService.bpDay;
		$scope.bpWeek = statsService.bpWeek;
		$scope.bpMonth = statsService.bpMonth;
		$scope.bpYear = statsService.bpYear;
		
		$scope.bspMinute = statsService.bspMinute;
		$scope.bspHour = statsService.bspHour;
		$scope.bspDay = statsService.bspDay;
		$scope.bspWeek = statsService.bspWeek;
		$scope.bspMonth = statsService.bspMonth;
		$scope.bspYear = statsService.bspYear;
		
		$scope.calculateBeats = function() {
			statsService.calculateBeats($scope.trackers);
		};
		
		$scope.calculateBeatsSaved = function() {
			statsService.calculateBeatsSaved($scope.user);
		};
		
		//$scope.calculateBeats();
		//$scope.calculateBeatsSaved();
	}
]);