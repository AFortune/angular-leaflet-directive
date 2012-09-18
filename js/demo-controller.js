function DemoController ($scope, $location)
{
	
	$scope.activeTab = $location.path() == $scope.basePath ? "usage" : $location.path().substr(1);
	
	$scope.$watch("activeTab", function (newValue, oldValue) {
		if (newValue === oldValue) {
			return;
		}
		
		$location.path($scope.basePath +  $scope.activeTab);
	});
	
	$scope.$watch(function () {
		return $location.path();
	}, function (newValue, oldValue) {
		if (newValue === oldValue) {
			return;
		}
		
		$scope.activeTab = newValue.substr($scope.basePath.length);
	});
	
	$scope.getNavClass = function (item) {
		return item == $scope.activeTab ? "active" : "";
	};
	
	$scope.center = {
		lat: 0,
		lng: 0
	};
	
	$scope.latitude = null;
	$scope.longitude = null;
	
	$scope.zoom = 4;
	
	$scope.markers = [];
	
	$scope.markerLat = null;
	$scope.markerLng = null;
	
	$scope.addMarker = function () {
		$scope.markers.push({
			latitude: parseFloat($scope.markerLat),
			longitude: parseFloat($scope.markerLng)
		});
		
		$scope.markerLat = null;
		$scope.markerLng = null;
	};
}

(function () {
	
	var module = angular.module("angular-leaflet-directive-demo", ["leaflet-directive", "ui"]);
	
	module.config(function ($locationProvider) {
		$locationProvider.html5Mode(true);
	});
	
	module.run(function ($rootScope, $location) {
		$rootScope.basePath = $location.path();
	});
	
	module.directive("callToAction", function () {
		return {
			restrict: "E",
			transclude: true,
			replace: true,
			template: "<a class='btn' ng-click='track()' ng-transclude></a>",
			link: function (scope, element, attrs, ctrl) {
				scope.track = function () {
					if (_gaq) {
						_gaq.push(["_trackEvent", attrs.category, angular.element(element).text()]);
					}
				};
			}
		};
	});
	
	module.run(function ($rootScope) {
		
		if (!navigator.geolocation) {
			$rootScope.center = {
				lat: 0,
				lng: 0
			};
			
			return;
		}
		
		navigator.geolocation.getCurrentPosition(function (position) {
			$rootScope.center = {
					lat: position.coords.latitude,
					lng: position.coords.longitude
				};
			}, 
			function (position) {
				$rootScope.center = {
					lat: 0,
					lng: 0
				};	
			}, {
			timeout: 10000,
			maximumAge: 60000
		});
	});
}());
