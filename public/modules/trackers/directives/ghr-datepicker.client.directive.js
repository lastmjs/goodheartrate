'use strict';

angular.module('trackers').directive('ghrDatepicker', [
	function() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).datepicker();
				
				$(element).on('change keyup paste click', function() {
					scope.trackerObj.date = $(element).val();
					//scope.$apply(); //TODO figure out how to do the above with $apply instead of having to know the exact model variable
				});
			}
		};
	}
]);