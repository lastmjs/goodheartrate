'use strict';

// Trackers controller
angular.module('trackers').controller('TrackersController', ['$scope', '$stateParams', '$location', 'Authentication', 'trackersService',
	function($scope, $stateParams, $location, Authentication, trackersService) {
		$scope.authentication = Authentication;
		$scope.trackers = trackersService.trackers;
		$scope.trackerObj = {
			date: undefined,
			bpm: undefined
		};
		$scope.chartData = {};
		$scope.chartOptions = {};
		
		$scope.initGraph = function() {
			var labelsArray = [];
			var bpmArray = [];
			
			for(var i=0; i < $scope.trackers.length; i++) {
				labelsArray.push($scope.trackers[i].date);
				bpmArray.push($scope.trackers[i].bpm);
			}
			
			$scope.chartData = {
				labels: labelsArray,
				datasets: [
					{
						label: "My First dataset",
						fillColor: "rgba(220,220,220,0.2)",
						strokeColor: "rgba(220,220,220,1)",
						pointColor: "rgba(220,220,220,1)",
						pointStrokeColor: "#fff",
						pointHighlightFill: "#fff",
						pointHighlightStroke: "rgba(220,220,220,1)",
						data: bpmArray
					}
				]
			};
		};
		$scope.initGraph();
		
		$scope.create = function() {
			trackersService.create($scope.trackerObj);
		};
		
		$scope.list = function() {
			trackersService.getAll();
		};
		
		/*// Create new Tracker
		$scope.create = function() {
			// Create new Tracker object
			var tracker = new Trackers ({
				name: this.name
			});

			// Redirect after save
			tracker.$save(function(response) {
				$location.path('trackers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tracker
		$scope.remove = function(tracker) {
			if ( tracker ) { 
				tracker.$remove();

				for (var i in $scope.trackers) {
					if ($scope.trackers [i] === tracker) {
						$scope.trackers.splice(i, 1);
					}
				}
			} else {
				$scope.tracker.$remove(function() {
					$location.path('trackers');
				});
			}
		};

		// Update existing Tracker
		$scope.update = function() {
			var tracker = $scope.tracker;

			tracker.$update(function() {
				$location.path('trackers/' + tracker._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find existing Tracker
		$scope.findOne = function() {
			$scope.tracker = Trackers.get({ 
				trackerId: $stateParams.trackerId
			});
		};*/
	}
]);