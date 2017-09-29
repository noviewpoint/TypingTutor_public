(function() {
	"use strict";

	angular
		.module("typingTutor")
		.controller("DebugController", DebugController);

	DebugController.$inject = ["$timeout", "sharedStatesService", "$scope"];

	/**
	 * @ngdoc controller
	 * @name typingTutor.controller:DebugController
	 * @description
	 * Controller, ki kontrolira debug mode.
	 * <pre>
	 * http://nacomnet.lucami.org/expApp/typingTutor/#/tipkanje/debug
	 * </pre>
	 * Dostop do tega pogleda je mogoc prek brskalnikove naslovne vrstice.
	 * @requires $timeout
	 * @requires typingTutor.service:sharedStatesService
	 * @requires $scope
	 */
	function DebugController($timeout, sharedStatesService, $scope) {
		console.log("In DebugController");

		var vm = this;

		vm.x = null; // casovnik
		vm.y = sharedStatesService.getXmlConfigFileName();

		var tickInterval = 100; // ponovni klici na vsakih 10 ms

		var zacetek = Date.now();

		var tick = function () {
			vm.x = Date.now();
			$timeout(tick, tickInterval);
		};

		// Start the timer
		var timer = $timeout(tick, tickInterval);

		// ob ubijanju controllerja se časovnik ugasne (pritisk BACK ali vpis novega urlja - npr. prehod v menu)

		$scope.$on("$destroy", function() {
	        if (timer) {
	            $timeout.cancel(timer);
	            tick = null;
	        }
    	});


	}



})();
