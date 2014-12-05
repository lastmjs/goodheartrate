'use strict';

angular.module('core').directive('ghrSignupButton', [
	function() {
		return {
			link: function ($scope, element, attrs) {
				
				element.bind('click', function() {			
					if($('#signUpArea').css('visibility') === 'hidden') {
						$('#signUpArea').css('visibility', 'visible');
					} else {
						$('#signUpArea').css('visibility', 'hidden');
					}				
				});
			}
		};
	}
]);