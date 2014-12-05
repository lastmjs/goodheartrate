'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication',
	function($scope, Authentication) {
		$scope.authentication = Authentication;
		$scope.loginOpen = false;
		$scope.signupOpen = false;
		
		$scope.loginButtonClick = function() {
			$scope.loginOpen = !$scope.loginOpen;
			$scope.signupOpen = false;
		};
		
		$scope.signupButtonClick = function() {
			$scope.signupOpen = !$scope.signupOpen;
			$scope.loginOpen = false;
		};
		
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