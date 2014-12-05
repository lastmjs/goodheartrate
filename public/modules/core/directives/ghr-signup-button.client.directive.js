'use strict';

angular.module('core').directive('ghrSignupButton', [
	function() {
		return {
			link: function ($scope, element, attrs) {
				
				element.bind('click', function() {			
					if($('#signUpArea').css('visibility') === 'hidden') {
						$('#signUpArea').css('visibility', 'visible');
						$('#loginButton').css('transition', 'all .3s ease-in-out');
					} else {
						$('#signUpArea').css('visibility', 'hidden');
						$('#loginButton').css('transition', 'none');
					}				
				});
			}
		};
	}
]);