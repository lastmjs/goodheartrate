'use strict';

angular.module('core').directive('ghrAuthenticationArea', [
	function() {
		return {
			link: function ($scope, element, attrs) {
				element.bind('click', function() {	
					var form = undefined;
					var otherForm = undefined;
					
					
					if(attrs.id === 'login') {
						form = $('#loginForm');
						otherForm = $('#signupForm');
					} else {
						form = $('#signupForm');
						otherForm = $('#loginForm');
					}
							
					if(form.css('visibility') === 'hidden') {
						$('#loginButton').css('transition', 'none');
						$('#signupButton').css('transition', 'none');
						otherForm.css('visibility', 'hidden');
						form.css('visibility', 'visible');
						//$('#loginButton').css('transition', 'all .3s ease-in-out');
						//$('#signupButton').css('transition', 'all .3s ease-in-out');
					} else {
						form.css('visibility', 'hidden');
						$('#loginButton').css('transition', 'none');
						$('#signupButton').css('transition', 'none');
					}				
				});
			}
		};
	}
]);