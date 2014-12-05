'use strict';


angular.module('core').controller('HomeController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');
		
		$scope.credentials = {
			username: '',
			password: ''
		};
		
		$scope.login = function() {
			$http.post('/auth/login', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
		
		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);