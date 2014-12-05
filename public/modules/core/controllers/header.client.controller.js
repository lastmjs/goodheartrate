'use strict';

angular.module('core').controller('HeaderController', ['$scope', 'Authentication', 'Menus',
	function($scope, Authentication, Menus) {
		$scope.authentication = Authentication;
		$scope.isCollapsed = false;
		$scope.menu = Menus.getMenu('topbar');
		$scope.loginOpen = false;
		$scope.signupOpen = false;
		
		$scope.loginClick = function() {
			$scope.loginOpen = !$scope.loginOpen;
			$scope.signupOpen = false;
		};
		
		$scope.signupClick = function() {
			$scope.signupOpen = !$scope.signupOpen;
			$scope.loginOpen = false;
		};

		$scope.toggleCollapsibleMenu = function() {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// Collapsing the menu after navigation
		$scope.$on('$stateChangeSuccess', function() {
			$scope.isCollapsed = false;
		});
	}
]);