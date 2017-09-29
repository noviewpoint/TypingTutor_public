(function() {
	"use strict";

	angular
		.module("typingTutor")
		.controller("GrafController", GrafController);

	GrafController.$inject = ["$scope", "measurementsService"];

	/**
	 * @ngdoc controller
	 * @name typingTutor.controller:GrafController
	 * @description
	 * Controller, ki kontrolira graf od pogleda <i>tipkanje.html</i>
	 * <pre>
	 * http://nacomnet.lucami.org/expApp/typingTutor/#/tipkanje
	 * </pre>
	 * Dostop do tega pogleda je mogoc prek brskalnikove naslovne vrstice in prek brskalnikovih BACK/FORWARD gumbov.
	 * @requires $scope
	 * @requires measurementsService
	 */
	function GrafController($scope, measurementsService) {
		//console.log("In GrafController");
		var vm = this;

		var tab = 0;

		var noldus = {};
		var tobii = {};

		var linePupil = new TimeSeries();
		var lineArousal = new TimeSeries();
		var lineValence = new TimeSeries();

		vm.isCollapsed = isCollapsed;
		vm.changeCollapse = changeCollapse;
		vm.collapsedAnimation = collapsedAnimation;

		var indicatorMaxSize = 214;
		vm.indicatorMaxSize = indicatorMaxSize;

		// default so sredinske vrednosti
		vm.indicatorPupilSize = indicatorMaxSize/2;
		vm.indicatorArousalSize = indicatorMaxSize/2;
		vm.indicatorValenceSize = indicatorMaxSize/2;


		/* ANGULAR WATCH FUNKCIJA */
		$scope.$watchCollection(function() {
			return measurementsService.getHistoryTobiiEyeTracker();
		}, watchTobiiHistory);


		function watchTobiiHistory(prej, potem) {
			// od 0 do 4
			vm.indicatorPupilSize = (indicatorMaxSize / 4) * tobii;

			// if not exist end here
			if (!noldus.length) {
				return;
			}

			// od 0 do 1
			vm.indicatorArousalSize = indicatorMaxSize * noldus[noldus.length - 1].Arousal;
			// od -1 do 1
			vm.indicatorValenceSize = (indicatorMaxSize / 2) * (noldus[noldus.length - 1].Valence + 1);
		}


		// random update grafa na 1000ms
		var timer1 = setInterval(function() {

			tobii = measurementsService.getHistoryTobiiEyeTracker();
			tobii = tobii[tobii.length - 1];

			// if not exist end here
			if (tobii === undefined) {
				return;
			}

			tobii.rightPupilDiameter = tobii.rightPupilDiameter.replace(/\,/g, ".");
			tobii.leftPupilDiameter = tobii.leftPupilDiameter.replace(/\,/g, ".");
			tobii = (parseFloat(tobii.rightPupilDiameter) + parseFloat(tobii.leftPupilDiameter)) / 2;

			// ce eye tracker ne lovi obeh zenic
			if (tobii === -1) {
				tobii = 0;
			}

			// od 0 do 4 -----> od 0 do 1
			linePupil.append(Date.now(), tobii/4);

			noldus = measurementsService.getHistoryNoldusFaceReader();

			// od 0 do 1 default
			lineArousal.append(Date.now(), noldus[noldus.length - 1].Arousal);


			// od -1 do 1 -----> od 0 do 1
			lineValence.append(Date.now(), (noldus[noldus.length - 1].Valence + 1) / 2);




			/* line1Copy = JSON.parse(JSON.stringify(line1));

			for (var i = 0; i < 12; i++) {
				console.log("smoothie line1.data[" + i + "]", line1.data[i]);
			} */

		}, 1000);

		var chart = new SmoothieChart({millisPerPixel:22,grid:{strokeStyle:'#fbb03b',verticalSections:10},labels:{precision:0},maxValue:1,minValue: 0});
		chart.addTimeSeries(linePupil, { strokeStyle: 'rgba(157, 30, 200, 1)', lineWidth: 6 });
		chart.addTimeSeries(lineArousal, { strokeStyle: 'rgba(26, 184, 26, 1)', lineWidth: 6 });
		chart.addTimeSeries(lineValence, { strokeStyle: 'rgba(143, 100, 26, 1)', lineWidth: 6 });

		function streamajNaGraf() {
			chart.streamTo(document.getElementById("chart"), 1000);
		}

		// pocakaj 100ms da se tekoce zrise vrednosti na graf
		var timer2 = setTimeout(streamajNaGraf, 100);

		// ob izhodu ubij timeoute
		$scope.$on("$destroy", function() {
			clearTimeout(timer1);
			clearTimeout(timer2);
		});

		function isCollapsed(x) {
			if (x === tab) {
				return true;
			} else {
				return false;
			}
		}

		function changeCollapse() {
			tab++;
			if (tab === 3) {
				tab = 0;
			}
		}

		function collapsedAnimation(x) {

			if (tab === 1 && x == 1) {
				return "ng-show-add animated flipInX";
			} else if (tab === 2 && x == 1) {
				return "ng-hide-add animated flipOutX";
			} else if (tab === 2 && x == 2) {
				return "ng-show-add animated flipInX";
			} else if (tab === 0 && x == 2) {
				return "ng-hide-add animated flipOutX";
			}
		}

	}

})();
