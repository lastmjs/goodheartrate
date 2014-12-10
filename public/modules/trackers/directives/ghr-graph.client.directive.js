'use strict';

angular.module('trackers').directive('ghrGraph', ['graphService', function(graphService) {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				graphService.ctx = $(element).get(0).getContext("2d");
				graphService.initGraph();
			}
		};
	}
]);