'use strict';

angular.module('trackers').directive('ghrGraph', ['trackersService', function(trackersService) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				// Get context with jQuery - using jQuery's .get() method.
				var ctx = $(element).get(0).getContext("2d");
				
				var data = {
					labels: ["January", "February", "March", "April", "May", "June", "July"],
					datasets: [
						{
							label: "My First dataset",
							fillColor: "rgba(220,220,220,0.2)",
							strokeColor: "rgba(220,220,220,1)",
							pointColor: "rgba(220,220,220,1)",
							pointStrokeColor: "#fff",
							pointHighlightFill: "#fff",
							pointHighlightStroke: "rgba(220,220,220,1)",
							data: trackersService.trackers
							//data: [65, 59, 80, 81, 56, 55, 40]
						}
					]
				};
				
				// This will get the first returned node in the jQuery collection.
				var myNewChart = new Chart(ctx).Line(data, {});
			}
		};
	}
]);