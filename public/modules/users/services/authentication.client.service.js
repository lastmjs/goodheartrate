'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$injector',
	function($injector) {
		var o = {
			user: window.user
		};
		
		o.fetchUser = function() {
			var http = $injector.get('$http');
			return http.get('/users/' + o.user._id).success(function(data) {
				angular.copy(data, o.user);
			});
		};

		return o;
	}
]);