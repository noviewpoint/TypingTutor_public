(function() {
	"use strict";

	angular
		.module("typingTutor")
		.directive("graf", graf);

		function graf() {
			//console.log("In directive graf");
			return {
				restrict: "E",
				templateUrl: "partials/graf.html"
			};
		}
})();
