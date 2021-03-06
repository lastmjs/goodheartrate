'use strict';

angular.module('core').controller('HeaderController', ['$scope', '$location', '$http', 'Authentication',
	function($scope, $location, $http, Authentication) {
		$scope.authentication = Authentication;
		$scope.loginOpen = false;
		$scope.signupOpen = false;
		$scope.currentRoute = $location;
		
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

				$scope.loginButtonClick();
				
				// And redirect to the index page
				$location.path('/tracker');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
		
		$scope.signup = function() {
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;
				
				$scope.signupButtonClick();

				// And redirect to the index page
				$location.path('/tracker');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);