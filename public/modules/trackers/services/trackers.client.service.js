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
			scaleFontFamily: 'Ubuntu',
			scaleFontColor: '#484848',
			scaleOverride: true,
			scaleSteps: 20,
			scaleStepWidth: 5,
			scaleStartValue: 0
		}
	};
	
	o.initGraph = function() {
		var dayNames = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday'
		];
		
		var monthNames = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];
		
		var labelsArray = [];
		var bpmArray = [];
		
		var totalBPM = 0;
		for(var i=0; i < o.trackers.length; i++) {
			var indexOfT = o.trackers[i].date.indexOf('T');
			var strippedDate = o.trackers[i].date.substr(0, indexOfT);
			var dateSegments = strippedDate.split('-');

			var formattedDate = monthNames[dateSegments[1] - 1] + ' ' + dateSegments[2] + ', ' + dateSegments[0];
			
			labelsArray.push(formattedDate);
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
					fillColor: "rgba(51,122,183,0.2)",
					strokeColor: "rgba(51,122,183,1)",
					pointColor: "rgba(51,122,183,1)",
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
			o.getAll();
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