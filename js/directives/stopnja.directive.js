(function() {
	"use strict";

	angular
		.module("typingTutor")
		.directive("stopnja", stopnja);

		function stopnja() {
			//console.log("In directive stopnja");
			return {
				restrict: "E",
				templateUrl: "partials/stopnja.html"
			};
		}
})();
