(function() {
	"use strict";

	angular
		.module("typingTutor")
		.directive("motnja", motnja);

		motnja.$inject = ["sharedStatesService", "automaticSwitchingService", "$compile"];

		function motnja(sharedStatesService, automaticSwitchingService, $compile) {
			//console.log("In directive motnja");

			//var imageLocation = sharedStatesService.getFileLocation().disturbanceImage;
			var images = sharedStatesService.getXmlConfigVisualImage();
			console.log("images:", images);
			var povezi = povezi;

			return {
				restrict: "E",
				link: povezi
			};

			function povezi(scope, element) {
				// vsakic ko se klice link function se directive unici in kreira znova
				console.log("In link function");

				var x = automaticSwitchingService.getPreostaleNaloge();

				if (x && parseInt(x[0]._interType) !== -1 && images.hasOwnProperty(x[0]._interType)) {

					var image = images[x[0]._interType]._path;
					var template = "<img style='position: absolute; left: 10%; z-index: 5; height: 200px; width: 200px;' ng-src='" + image + "' ng-show='TipkanjeCtrl.motnja;' />";
					var linkFn = $compile(template);
					var content = linkFn(scope);

					element.append(content);

				}

			}
		}
})();
