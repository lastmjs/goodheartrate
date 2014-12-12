'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'goodheartrate';
	var applicationModuleVendorDependencies = ['ngResource', 'ngCookies',  'ngAnimate',  'ngTouch',  'ngSanitize',  'ui.router', 'ui.bootstrap', 'ui.utils', 'angles'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();
'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider',
	function($locationProvider) {
		$locationProvider.hashPrefix('!');
	}
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
	//Fixing facebook bug with redirect
	if (window.location.hash === '#_=_') window.location.hash = '#!';

	//Then init the app
	angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});
'use strict';

// Use Application configuration module to register a new module
ApplicationConfiguration.registerModule('core');
'use strict';

// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('trackers');
'use strict';

// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');
'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',
	function($stateProvider, $urlRouterProvider) {
		// Redirect to home view when route not found
		$urlRouterProvider.otherwise('/');

		// Home state routing
		$stateProvider.
		state('home', {
			url: '/',
			templateUrl: 'modules/core/views/home.client.view.html'
		});
	}
]);
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
'use strict';


angular.module('core').controller('HomeController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
		
		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');
	}
]);
'use strict';

//Menu service used for managing  menus
angular.module('core').service('Menus', [

	function() {
		// Define a set of default roles
		this.defaultRoles = ['*'];

		// Define the menus object
		this.menus = {};

		// A private function for rendering decision 
		var shouldRender = function(user) {
			if (user) {
				if (!!~this.roles.indexOf('*')) {
					return true;
				} else {
					for (var userRoleIndex in user.roles) {
						for (var roleIndex in this.roles) {
							if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
								return true;
							}
						}
					}
				}
			} else {
				return this.isPublic;
			}

			return false;
		};

		// Validate menu existance
		this.validateMenuExistance = function(menuId) {
			if (menuId && menuId.length) {
				if (this.menus[menuId]) {
					return true;
				} else {
					throw new Error('Menu does not exists');
				}
			} else {
				throw new Error('MenuId was not provided');
			}

			return false;
		};

		// Get the menu object by menu id
		this.getMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			return this.menus[menuId];
		};

		// Add new menu object by menu id
		this.addMenu = function(menuId, isPublic, roles) {
			// Create the new menu
			this.menus[menuId] = {
				isPublic: isPublic || false,
				roles: roles || this.defaultRoles,
				items: [],
				shouldRender: shouldRender
			};

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenu = function(menuId) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Return the menu object
			delete this.menus[menuId];
		};

		// Add menu item object
		this.addMenuItem = function(menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Push new menu item
			this.menus[menuId].items.push({
				title: menuItemTitle,
				link: menuItemURL,
				menuItemType: menuItemType || 'item',
				menuItemClass: menuItemType,
				uiRoute: menuItemUIRoute || ('/' + menuItemURL),
				isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].isPublic : isPublic),
				roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].roles : roles),
				position: position || 0,
				items: [],
				shouldRender: shouldRender
			});

			// Return the menu object
			return this.menus[menuId];
		};

		// Add submenu item object
		this.addSubMenuItem = function(menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
					// Push new submenu item
					this.menus[menuId].items[itemIndex].items.push({
						title: menuItemTitle,
						link: menuItemURL,
						uiRoute: menuItemUIRoute || ('/' + menuItemURL),
						isPublic: ((isPublic === null || typeof isPublic === 'undefined') ? this.menus[menuId].items[itemIndex].isPublic : isPublic),
						roles: ((roles === null || typeof roles === 'undefined') ? this.menus[menuId].items[itemIndex].roles : roles),
						position: position || 0,
						shouldRender: shouldRender
					});
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeMenuItem = function(menuId, menuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
					this.menus[menuId].items.splice(itemIndex, 1);
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		// Remove existing menu object by menu id
		this.removeSubMenuItem = function(menuId, submenuItemURL) {
			// Validate that the menu exists
			this.validateMenuExistance(menuId);

			// Search for menu item to remove
			for (var itemIndex in this.menus[menuId].items) {
				for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
					if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
						this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
					}
				}
			}

			// Return the menu object
			return this.menus[menuId];
		};

		//Adding the topbar menu
		this.addMenu('topbar');
	}
]);
'use strict';

//Setting up route
angular.module('trackers').config(['$stateProvider',
	function($stateProvider) {
		// Trackers state routing
		$stateProvider.
		state('tracker', {
			url: '/tracker',
			templateUrl: 'modules/trackers/views/index-tracker.client.view.html'/*,
			resolve: {
				trackerPromise: ['trackersService', function(trackersService) {
					return trackersService.getAll();
				}]
			}*/
		});
		/*state('listTrackers', {
			url: '/trackers',
			templateUrl: 'modules/trackers/views/list-trackers.client.view.html'
		}).
		state('createTracker', {
			url: '/trackers/create',
			templateUrl: 'modules/trackers/views/create-tracker.client.view.html'
		}).
		state('viewTracker', {
			url: '/trackers/:trackerId',
			templateUrl: 'modules/trackers/views/view-tracker.client.view.html'
		}).
		state('editTracker', {
			url: '/trackers/:trackerId/edit',
			templateUrl: 'modules/trackers/views/edit-tracker.client.view.html'
		});*/
	}
]);
'use strict';

// Trackers controller
angular.module('trackers').controller('StatsController', ['$scope', 'Authentication', 'trackersService', 'statsService',
	function($scope, Authentication, trackersService, statsService) {
		$scope.user = Authentication.user;
		$scope.trackers = trackersService.trackers
		
		$scope.bpMinute = statsService.bpMinute;
		$scope.bpHour = statsService.bpHour;
		$scope.bpDay = statsService.bpDay;
		$scope.bpWeek = statsService.bpWeek;
		$scope.bpMonth = statsService.bpMonth;
		$scope.bpYear = statsService.bpYear;
		
		$scope.bspMinute = statsService.bspMinute;
		$scope.bspHour = statsService.bspHour;
		$scope.bspDay = statsService.bspDay;
		$scope.bspWeek = statsService.bspWeek;
		$scope.bspMonth = statsService.bspMonth;
		$scope.bspYear = statsService.bspYear;
		
		$scope.calculateBeats = function() {
			statsService.calculateBeats($scope.trackers);
		};
		
		$scope.calculateBeatsSaved = function() {
			statsService.calculateBeatsSaved($scope.user);
		};
		
		//$scope.calculateBeats();
		//$scope.calculateBeatsSaved();
	}
]);
'use strict';

// Trackers controller
angular.module('trackers').controller('TrackersController', ['$scope', '$stateParams', 'Authentication', 'trackersService', 'statsService',
	function($scope, $stateParams, Authentication, trackersService, statsService) {
		$scope.authentication = Authentication;
		$scope.trackers = trackersService.trackers;
		$scope.trackerObj = trackersService.trackerObj;
		$scope.chartData = trackersService.chartData;
		$scope.chartOptions = trackersService.chartOptions;
		
		if($scope.authentication.user) {
			$scope.createOrUpdate = function() {
				trackersService.createOrUpdate($scope.trackerObj).then(function() {
					$scope.getAll();
				});
			};
			
			$scope.getAll = function() {
				trackersService.getAll().then(function() {
					Authentication.fetchUser().then(function() {
						statsService.calculateBeats($scope.trackers);
						statsService.calculateBeatsSaved($scope.authentication.user);
						trackersService.initGraph();
					});
				});
			};
			
			$scope.getByDate = function() {
				trackersService.getByDate($scope.trackerObj.date);
			};
		} else {
			$scope.createOrUpdate = function() {
				trackersService.createOrUpdateDemo($scope.trackerObj);
				$scope.getAll();
			};
			
			$scope.getAll = function() {
				statsService.calculateBeats($scope.trackers);
				statsService.calculateBeatsSaved({startingHeartRate: 70});
				trackersService.initGraph();
			};
			
			$scope.getByDate = function() {
				trackersService.getByDateDemo($scope.trackerObj.date);
			};
			
			trackersService.getAllDemo();
		}
		
		$scope.getAll();
		
		/*$scope.list = function() {
			trackersService.getAll();
		};*/
		
		/*// Create new Tracker
		$scope.create = function() {
			// Create new Tracker object
			var tracker = new Trackers ({
				name: this.name
			});

			// Redirect after save
			tracker.$save(function(response) {
				$location.path('trackers/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tracker
		$scope.remove = function(tracker) {
			if ( tracker ) { 
				tracker.$remove();

				for (var i in $scope.trackers) {
					if ($scope.trackers [i] === tracker) {
						$scope.trackers.splice(i, 1);
					}
				}
			} else {
				$scope.tracker.$remove(function() {
					$location.path('trackers');
				});
			}
		};

		// Update existing Tracker
		$scope.update = function() {
			var tracker = $scope.tracker;

			tracker.$update(function() {
				$location.path('trackers/' + tracker._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find existing Tracker
		$scope.findOne = function() {
			$scope.tracker = Trackers.get({ 
				trackerId: $stateParams.trackerId
			});
		};*/
	}
]);
'use strict';

angular.module('trackers').directive('ghrDatepicker', [
	function() {
		return {
			restrict: 'A',
			link: function postLink(scope, element, attrs) {
				$(element).datepicker({ dateFormat: 'yy-mm-d' });
				
				$(element).on('change keyup paste', function() {
					scope.trackerObj.date = $(element).val();
					scope.getByDate();
					//scope.$apply(); //TODO figure out how to do the above with $apply instead of having to know the exact model variable
				});
			}
		};
	}
]);
'use strict';

angular.module('trackers').factory('statsService', ['$http', function($http) {
	var o = {
		bpMinute: {val: 0},
		bpHour: {val: 0},
		bpDay: {val: 0},
		bpWeek: {val: 0},
		bpMonth: {val: 0},
		bpYear: {val: 0},
		bspMinute: {val: 0},
		bspHour: {val: 0},
		bspDay: {val: 0},
		bspWeek: {val: 0},
		bspMonth: {val: 0},
		bspYear: {val: 0}
	};
	
	o.calculateBeats = function(trackers) {
		var totalBPM = 0;
		var count = 0;
		
		for(var i=trackers.length - 1; i > trackers.length-7; i--) {
			if(trackers[i]) {
				totalBPM += trackers[i].bpm;
				count++;
			} else {
				break;
			}
		}
		
		angular.copy({val: ~~(totalBPM / count)}, o.bpMinute);
		angular.copy({val: o.bpMinute.val * 60}, o.bpHour);
		angular.copy({val: o.bpMinute.val * 1440}, o.bpDay);
		angular.copy({val: o.bpMinute.val * 10080}, o.bpWeek);
		angular.copy({val: o.bpMinute.val * 43200}, o.bpMonth);
		angular.copy({val: o.bpMinute.val * 525600}, o.bpYear);
	};
	
	o.calculateBeatsSaved = function(user) {
		var differencePerMinute = ~~Math.abs(o.bpMinute.val - user.startingHeartRate);
		
		angular.copy({val: differencePerMinute}, o.bspMinute);
		angular.copy({val: differencePerMinute * 60}, o.bspHour);
		angular.copy({val: differencePerMinute * 1440}, o.bspDay);
		angular.copy({val: differencePerMinute * 10080}, o.bspWeek);
		angular.copy({val: differencePerMinute * 43200}, o.bspMonth);
		angular.copy({val: differencePerMinute * 525600}, o.bspYear);
	};
	
	return o;
}]);
'use strict';

angular.module('trackers').factory('trackersService', ['$http', '$rootScope', function($http, $rootScope) {
	var o = {
		trackers: [],
		trackerObj: {
			date: undefined,
			bpm: undefined
		},
		chartData: {},
		chartOptions: {
			scaleFontFamily: 'Ubuntu',
			scaleFontColor: '#484848',
			scaleOverride: true,
			scaleSteps: 20,
			scaleStepWidth: 5,
			scaleStartValue: 0
		}
	};
	
	o.initGraph = function() {
		var dayNames = [
			'Sunday',
			'Monday',
			'Tuesday',
			'Wednesday',
			'Thursday',
			'Friday',
			'Saturday'
		];
		
		var monthNames = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec'
		];
		
		var labelsArray = [];
		var bpmArray = [];
		
		var totalBPM = 0;
		for(var i=0; i < o.trackers.length; i++) {
			var indexOfT = o.trackers[i].date.indexOf('T');
			var strippedDate = undefined;
			if(indexOfT !== -1) {
				strippedDate = o.trackers[i].date.substr(0, indexOfT);
			} else {
				strippedDate = o.trackers[i].date;
			}
			
			var dateSegments = strippedDate.split('-');

			var formattedDate = monthNames[dateSegments[1] - 1] + ' ' + dateSegments[2] + ', ' + dateSegments[0];
			
			labelsArray.push(formattedDate);
			bpmArray.push(o.trackers[i].bpm);
			
			totalBPM += o.trackers[i].bpm;
		}
		
		var averageBPM = totalBPM / o.trackers.length;
		labelsArray.unshift("Average BPM");
		bpmArray.unshift(averageBPM);
		
		var newChartData = {
			labels: labelsArray,
			datasets: [
				{
					label: "My First dataset",
					fillColor: "rgba(51,122,183,0.2)",
					strokeColor: "rgba(51,122,183,1)",
					pointColor: "rgba(51,122,183,1)",
					pointStrokeColor: "#fff",
					pointHighlightFill: "#fff",
					pointHighlightStroke: "rgba(220,220,220,1)",
					data: bpmArray
				}
			]
		};
		
		angular.copy(newChartData, o.chartData);
	};
	
	o.createOrUpdate = function(trackerObj) {
		return $http.post('/trackers', trackerObj);
	};
	
	o.getAll = function() {
		return $http.get('/trackers').success(function(data) {
			angular.copy(data, o.trackers);
		});
	};
	
	o.getByDate = function(date) {
		return $http.get('/trackers/' + date).success(function(data) {
			if(data !== 'null') {
				angular.copy(data, o.trackerObj);
			} else {
				data = {date: o.trackerObj.date, bpm: undefined};
				angular.copy(data, o.trackerObj);
			}
		});
	};
	
	o.createOrUpdateDemo = function(trackerObj) {
		
		for(var i=0; i < o.trackers.length; i++) {
			if(o.trackers[i].date === trackerObj.date) {
				if(trackerObj !== o.trackers[i]) {
					angular.copy({date: trackerObj.date, bpm: trackerObj.bpm}, o.trackers[i]);
				}
				
				return;
			}
		}
		
		o.trackers.push({date: trackerObj.date, bpm: trackerObj.bpm});
		o.trackers.sort(function(a, b) {
			var aDate = Date.parse(a.date);
			var bDate = Date.parse(b.date);
			
			if(aDate < bDate) {
				return -1;
			}
			
			if(aDate > bDate) {
				return 1;
			}
			
			return 0;
		});
	};
	
	o.getAllDemo = function() {
		var tempTrackers = [
			{
				date: '2014-12-1',
				bpm: 70
			},
			{
				date: '2014-12-2',
				bpm: 70
			},
			{
				date: '2014-12-3',
				bpm: 70
			},
			{
				date: '2014-12-4',
				bpm: 69
			},
			{
				date: '2014-12-5',
				bpm: 69
			},
			{
				date: '2014-12-6',
				bpm: 68
			},
			{
				date: '2014-12-7',
				bpm: 67
			},
			{
				date: '2014-12-8',
				bpm: 67
			},
			{
				date: '2014-12-9',
				bpm: 67
			},
			{
				date: '2014-12-10',
				bpm: 65
			},
			{
				date: '2014-12-11',
				bpm: 65
			},
			{
				date: '2014-12-12',
				bpm: 64
			},
			{
				date: '2014-12-13',
				bpm: 63
			},
			{
				date: '2014-12-14',
				bpm: 63
			},
			{
				date: '2014-12-15',
				bpm: 63
			},
			{
				date: '2014-12-16',
				bpm: 63
			},
			{
				date: '2014-12-17',
				bpm: 60
			},
			{
				date: '2014-12-18',
				bpm: 60
			},
			{
				date: '2014-12-19',
				bpm: 60
			},
			{
				date: '2014-12-20',
				bpm: 60
			},
			{
				date: '2014-12-21',
				bpm: 59
			},
			{
				date: '2014-12-22',
				bpm: 58
			},
			{
				date: '2014-12-23',
				bpm: 57
			},
			{
				date: '2014-12-24',
				bpm: 57
			},
			{
				date: '2014-12-25',
				bpm: 56
			},
			{
				date: '2014-12-26',
				bpm: 56
			},
			{
				date: '2014-12-27',
				bpm: 55
			},
			{
				date: '2014-12-28',
				bpm: 55
			},
			{
				date: '2014-12-29',
				bpm: 55
			},
			{
				date: '2014-12-30',
				bpm: 54
			}
		];
		
		angular.copy(tempTrackers, o.trackers);
	};
	
	o.getByDateDemo = function(date) {
		for(var i=0; i < o.trackers.length; i++) {
			if(o.trackers[i].date === date) {
				
				if(o.trackers[i] !== o.trackerObj) {
					$rootScope.$apply(angular.copy(o.trackers[i], o.trackerObj));
				}
				return;
			}
		}
		
		var data = {date: date, bpm: undefined};
		$rootScope.$apply(angular.copy(data, o.trackerObj));
	};
	
	return o;
}]);
'use strict';

// Config HTTP Error Handling
angular.module('users').config(['$httpProvider',
	function($httpProvider) {
		// Set the httpProvider "not authorized" interceptor
		$httpProvider.interceptors.push(['$q', '$location', 'Authentication',
			function($q, $location, Authentication) {
				return {
					responseError: function(rejection) {
						switch (rejection.status) {
							case 401:
								// Deauthenticate the global user
								Authentication.user = null;

								// Redirect to signin page
								$location.path('signin');
								break;
							case 403:
								// Add unauthorized behaviour 
								break;
						}

						return $q.reject(rejection);
					}
				};
			}
		]);
	}
]);
'use strict';

// Setting up route
angular.module('users').config(['$stateProvider',
	function($stateProvider) {
		// Users state routing
		$stateProvider.
		state('profile', {
			url: '/settings/profile',
			templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
		}).
		state('password', {
			url: '/settings/password',
			templateUrl: 'modules/users/views/settings/change-password.client.view.html'
		}).
		state('accounts', {
			url: '/settings/accounts',
			templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
		}).
		state('signup', {
			url: '/signup',
			templateUrl: 'modules/users/views/authentication/signup.client.view.html'
		}).
		state('signin', {
			url: '/signin',
			templateUrl: 'modules/users/views/authentication/signin.client.view.html'
		}).
		state('forgot', {
			url: '/password/forgot',
			templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
		}).
		state('reset-invalid', {
			url: '/password/reset/invalid',
			templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
		}).
		state('reset-success', {
			url: '/password/reset/success',
			templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
		}).
		state('reset', {
			url: '/password/reset/:token',
			templateUrl: 'modules/users/views/password/reset-password.client.view.html'
		});
	}
]);
'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

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

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
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
'use strict';

angular.module('users').controller('PasswordController', ['$scope', '$stateParams', '$http', '$location', 'Authentication',
	function($scope, $stateParams, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		//If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		// Submit forgotten password account id
		$scope.askForPasswordReset = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/forgot', $scope.credentials).success(function(response) {
				// Show user success message and clear form
				$scope.credentials = null;
				$scope.success = response.message;

			}).error(function(response) {
				// Show user error message and clear form
				$scope.credentials = null;
				$scope.error = response.message;
			});
		};

		// Change user password
		$scope.resetUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.passwordDetails = null;

				// Attach user profile
				Authentication.user = response;

				// And redirect to the index page
				$location.path('/password/reset/success');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
'use strict';

angular.module('users').controller('SettingsController', ['$scope', '$http', '$location', 'Users', 'Authentication',
	function($scope, $http, $location, Users, Authentication) {
		$scope.user = Authentication.user;

		// If user is not signed in then redirect back home
		if (!$scope.user) $location.path('/');

		// Check if there are additional accounts 
		$scope.hasConnectedAdditionalSocialAccounts = function(provider) {
			for (var i in $scope.user.additionalProvidersData) {
				return true;
			}

			return false;
		};

		// Check if provider is already in use with current user
		$scope.isConnectedSocialAccount = function(provider) {
			return $scope.user.provider === provider || ($scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider]);
		};

		// Remove a user social account
		$scope.removeUserSocialAccount = function(provider) {
			$scope.success = $scope.error = null;

			$http.delete('/users/accounts', {
				params: {
					provider: provider
				}
			}).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.user = Authentication.user = response;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		// Update a user profile
		$scope.updateUserProfile = function(isValid) {
			if (isValid) {
				$scope.success = $scope.error = null;
				var user = new Users($scope.user);

				user.$update(function(response) {
					$scope.success = true;
					Authentication.user = response;
				}, function(response) {
					$scope.error = response.data.message;
				});
			} else {
				$scope.submitted = true;
			}
		};

		// Change user password
		$scope.changeUserPassword = function() {
			$scope.success = $scope.error = null;

			$http.post('/users/password', $scope.passwordDetails).success(function(response) {
				// If successful show success message and clear form
				$scope.success = true;
				$scope.passwordDetails = null;
			}).error(function(response) {
				$scope.error = response.message;
			});
		};
	}
]);
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
'use strict';

// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', ['$resource',
	function($resource) {
		return $resource('users', {}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);