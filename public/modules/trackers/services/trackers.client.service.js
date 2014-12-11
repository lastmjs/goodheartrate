'use strict';

angular.module('trackers').factory('trackersService', ['$http', function($http) {
	var o = {
		trackers: [],
		trackerObj: {
			date: undefined,
			bpm: undefined
		},
		chartData: {},
		chartOptions: {
			scaleOverride: true,
			scaleSteps: 20,
			scaleStepWidth: 5,
			scaleStartValue: 0
		}
	};
	
	o.initGraph = function() {
		var labelsArray = [];
		var bpmArray = [];
		
		var totalBPM = 0;
		for(var i=0; i < o.trackers.length; i++) {
			labelsArray.push(o.trackers[i].date);
			bpmArray.push(o.trackers[i].bpm);
			
			totalBPM += o.trackers[i].bpm;
		}
		
		var averageBPM = totalBPM / o.trackers.length;
		labelsArray.unshift("Average BPM");
		bpmArray.unshift(averageBPM);
		
		var newChartData = {
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
		
		angular.copy(newChartData, o.chartData);
	};
	
	o.createOrUpdate = function(trackerObj) {
		return $http.post('/trackers', trackerObj).success(function(data) {
			
			for(var i=0; i < o.trackers.length; i++) {
				if(o.trackers[i]._id === data._id) {
					o.trackers[i] = data;
					o.initGraph();
					return;
				}
			}
			
			o.trackers.push(data);
			o.initGraph();
		});
	};
	
	o.getAll = function() {
		return $http.get('/trackers').success(function(data) {
			angular.copy(data, o.trackers);
			o.initGraph();
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