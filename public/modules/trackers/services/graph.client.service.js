'use strict';

angular.module('trackers').factory('graphService', ['trackersService', function(trackersService) {
	var o = {
		data: {},
		chart: undefined,
		ctx: undefined
	};
	
	o.initGraph = function() {
		var trackerArray = trackersService.trackers;
		var labelsArray = [];
		var bpmArray = [];
		
		for(var i=0; i < trackerArray.length; i++) {
			labelsArray.push(trackerArray[i].date);
			bpmArray.push(trackerArray[i].bpm);
		}
		
		o.data = {
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
		
		o.chart = new Chart(o.ctx).Line(o.data, {});
	};
	
	return o;
}]);