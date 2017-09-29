(function() {
	"use strict";

	angular
		.module("typingTutor")
		.directive("zaznajResize", zaznajResize);

		// ODLIČNO!
		// http://stackoverflow.com/questions/23272169/angularjs-what-is-the-best-way-to-bind-to-a-global-event-in-a-directive
		function zaznajResize($window) {

			return {
				restrict: "E",
				link: povezi
			};

			function povezi(scope) {

				angular.element($window).on("resize", onResize);
				scope.$on("$destroy", cleanUp);

				function onResize(e) {
					//console.log("V directive zaznajResize - function onResize", e);
					console.log("V directive zaznajResize - function onResize");
					// Namespacing events with name of directive + event to avoid collisions
					scope.$broadcast("resize::resize");
				}

				function cleanUp() {
					console.log("V directive zaznajResize - function cleanUp");
					angular.element($window).off("resize", onResize);
				}

			}
		}
})();
