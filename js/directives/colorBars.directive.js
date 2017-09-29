(function() {
	"use strict";

	angular
		.module("typingTutor")
		.directive("colorBars", colorBars);

		function colorBars() {
			//console.log("In directive colorBars");
			return {
				restrict: "E",
				templateUrl: "partials/color_bars.html"
			};
		}
})();
