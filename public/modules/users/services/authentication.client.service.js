'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$injector',
	function($injector) {
		var _this = this;

		_this._data = {
			user: window.user
		};
		
		_this._data.fetchUser = function() {
			var http = $injector.get('$http');
			return http.post('/users/', _this._data.user._id).success(function(data) {
				angular.copy(data, _this._data.user);
			});
		};

		return _this._data;
	}
]);