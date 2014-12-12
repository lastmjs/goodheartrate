'use strict';

angular.module('trackers').factory('trackersService', ['$http', '$rootScope', function($http, $rootScope) {
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
			var strippedDate = undefined;
			if(indexOfT !== -1) {
				strippedDate = o.trackers[i].date.substr(0, indexOfT);
			} else {
				strippedDate = o.trackers[i].date;
			}
			
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
		return $http.post('/trackers', trackerObj);
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
	
	o.createOrUpdateDemo = function(trackerObj) {
		
		for(var i=0; i < o.trackers.length; i++) {
			if(o.trackers[i].date === trackerObj.date) {
				angular.copy(trackerObj, o.trackers[i]);
				return;
			}
		}
		
		o.trackers.push(trackerObj);
		o.trackers.sort(function(a, b) {
			var aDate = Date.parse(a.date);
			var bDate = Date.parse(b.date);
			
			if(aDate < bDate) {
				return -1;
			}
			
			if(aDate > bDate) {
				return 1;
			}
			
			return 0;
		});
	};
	
	o.getAllDemo = function() {
		var tempTrackers = [
			{
				date: '2014-12-1',
				bpm: 70
			},
			{
				date: '2014-12-2',
				bpm: 70
			},
			{
				date: '2014-12-3',
				bpm: 70
			},
			{
				date: '2014-12-4',
				bpm: 69
			},
			{
				date: '2014-12-5',
				bpm: 69
			},
			{
				date: '2014-12-6',
				bpm: 68
			},
			{
				date: '2014-12-7',
				bpm: 67
			},
			{
				date: '2014-12-8',
				bpm: 67
			},
			{
				date: '2014-12-9',
				bpm: 67
			},
			{
				date: '2014-12-10',
				bpm: 65
			},
			{
				date: '2014-12-11',
				bpm: 65
			},
			{
				date: '2014-12-12',
				bpm: 64
			},
			{
				date: '2014-12-13',
				bpm: 63
			},
			{
				date: '2014-12-14',
				bpm: 63
			},
			{
				date: '2014-12-15',
				bpm: 63
			},
			{
				date: '2014-12-16',
				bpm: 63
			},
			{
				date: '2014-12-17',
				bpm: 60
			},
			{
				date: '2014-12-18',
				bpm: 60
			},
			{
				date: '2014-12-19',
				bpm: 60
			},
			{
				date: '2014-12-20',
				bpm: 60
			},
			{
				date: '2014-12-21',
				bpm: 59
			},
			{
				date: '2014-12-22',
				bpm: 58
			},
			{
				date: '2014-12-23',
				bpm: 57
			},
			{
				date: '2014-12-24',
				bpm: 57
			},
			{
				date: '2014-12-25',
				bpm: 56
			},
			{
				date: '2014-12-26',
				bpm: 56
			},
			{
				date: '2014-12-27',
				bpm: 55
			},
			{
				date: '2014-12-28',
				bpm: 55
			},
			{
				date: '2014-12-29',
				bpm: 55
			},
			{
				date: '2014-12-30',
				bpm: 54
			}
		];
		
		angular.copy(tempTrackers, o.trackers);
	};
	
	o.getByDateDemo = function(date) {
		for(var i=0; i < o.trackers.length; i++) {
			if(o.trackers[i].date === date) {
				$rootScope.$apply(angular.copy(o.trackers[i], o.trackerObj));
				return;
			}
		}
		
		var data = {date: date, bpm: undefined};
		$rootScope.$apply(angular.copy(data, o.trackerObj));
	};
	
	return o;
}]);