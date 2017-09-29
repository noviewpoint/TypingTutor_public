(function() {
	"use strict";

	angular
		.module("typingTutor")
		.directive("akcijaObResize", akcijaObResize);

		function akcijaObResize() {
			//console.log("In directive akcijaObResize");
			return {
				link: povezi
			};

			function povezi(scope, element) {

				scope.$on('resize::resize', onResize);

				function onResize(e) {
					//console.log("In directive akcijaObResize", e);
					console.log("V directive akcijaObResize");
				}
			}
		}
})();
