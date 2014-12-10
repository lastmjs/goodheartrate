'use strict';

angular.module('trackers').directive('ghrDatepicker', [
	function() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).datepicker();
				
				$(element).on('change keyup paste click', function() {
					scope.trackerObj.date = $(element).val();
				});
			}
		};
	}
]);