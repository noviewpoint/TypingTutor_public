(function() {
	"use strict";

	angular
		.module("typingTutor")
		.directive("nivo", nivo);

		function nivo() {
			//console.log("In directive nivo");
			return {
				restrict: "E",
				templateUrl: "partials/nivo.html"
			};
		}
})();
