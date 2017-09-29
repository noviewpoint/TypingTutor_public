(function() {
	"use strict";

	angular
		.module("typingTutor")
		.service("okvirService", okvirService);

	okvirService.$inject = ["flagsService", "measurementsService", "sharedStatesService"];

	/**
	 * @ngdoc service
	 * @name typingTutor.service:okvirService
	 * @description
	 * okvirService
	 * @requires $window
	 * @requires typingTutor.service:flagsService
	 * @requires typingTutor.service:measurementsService
	 * @requires typingTutor.service:sharedStatesService
	 * @requires typingTutor.service:okvirService
	 */

	function okvirService(flagsService, measurementsService, sharedStatesService) {
		//console.log("In okvirService");

		// zacasni canvas za performance
		var tempCanvas = document.createElement("canvas");
		var tempContext = tempCanvas.getContext("2d");
		flagsService.setOkvir(false);

		var canvas = document.createElement("typingCanvas");
		var context = tempCanvas.getContext("2d");


		var sirina = 200;
		var visina = 215;
		var radij = 25;
		// var sirina = 200 / 2 - 20;
		// var visina = 215 / 2;
		// var radij = 25 / 2;
		var debelinaCrte = 10;

		tempCanvas.width = sirina + 2 * radij + debelinaCrte;
		tempCanvas.height = visina + 2 * radij + debelinaCrte;
		//tempCanvas.height =
		tempContext.lineWidth = debelinaCrte;

		// horizontalno je okvir vedno povsem centriran
		var x = radij + debelinaCrte/2 + sirina/2;
		var y = debelinaCrte/2;

		var dolzinaTotal = 2 * Math.PI * radij + 2 * sirina + 2 * visina;
		var krozniLok = radij * Math.PI/2;
		var delcki = [sirina/2, krozniLok, visina, krozniLok, sirina, krozniLok, visina, krozniLok, sirina/2];

		return {
			risiOkvir: risiOkvir
		};

		/**
		 * @ngdoc method
		 * @name risiOkvir
		 * @methodOf typingTutor.service:okvirService
		 * @example
		 * canvasService.risiOkvir();
		 * @description
		 * Izdela in narise okvir okoli crke
		 */

		function risiOkvir() {
			if (!flagsService.getOkvir()) {

				tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
				tempContext.beginPath();

				if (measurementsService.getHistoryKeyboard()[sharedStatesService.getSteps() - 1] != undefined && measurementsService.getHistoryKeyboard()[sharedStatesService.getSteps() - 1].tipNapake != 0) {
					// rdec okvir
					tempContext.strokeStyle = "rgb(249, 20, 26)";

				} else {
					// zelen okvir
					tempContext.strokeStyle = "rgb(11, 150, 69)";
				}

				tempContext.lineWidth = debelinaCrte;

				tempContext.moveTo(x, y);

				tempContext.lineTo(x + sirina/2, y);
				tempContext.arc(x + sirina/2, y + radij, radij, 1.5 * Math.PI, 2 * Math.PI);

				tempContext.lineTo(x + sirina/2 + radij, y + radij + visina);
				tempContext.arc(x + sirina/2, y + radij + visina, radij, 0 * Math.PI, 0.5 * Math.PI);

				tempContext.lineTo(x - sirina/2, y + 2 * radij + visina);
				tempContext.arc(x - sirina/2, y + radij + visina, radij, 0.5 * Math.PI, 1 * Math.PI);

				tempContext.lineTo(x - sirina/2 - radij, y + radij);
				tempContext.arc(x - sirina/2, y + radij, radij, 1 * Math.PI, 1.5 * Math.PI);

				tempContext.lineTo(x, y);

				tempContext.stroke();

				var dolzinaProgress = dolzinaTotal * (sharedStatesService.getUserText().length / sharedStatesService.getExerciseText().length);

				tempContext.beginPath();
				tempContext.strokeStyle = "white";
				tempContext.lineWidth = 5;

				tempContext.moveTo(x, y);

				napredekBar:
				for (var i = 0; i <= 8; i++) {
					switch(i) {
						case 0:
						if(dolzinaProgress >= delcki[0]) {
							tempContext.lineTo(x + sirina/2, y);
						} else {
							tempContext.lineTo(x + dolzinaProgress, y);
							break napredekBar;
						}
						dolzinaProgress -= delcki[0];
						break;
						case 1:
						if(dolzinaProgress >= delcki[1]) {
							tempContext.arc(x + sirina/2, y + radij, radij, 1.5 * Math.PI, 2 * Math.PI);
						} else {
							tempContext.arc(x + sirina/2, y + radij, radij, 1.5 * Math.PI, Math.PI * (1.5 + 0.5 * (dolzinaProgress/delcki[1])));
							break napredekBar;
						}
						dolzinaProgress -= delcki[1];
						break;
						case 2:
						if(dolzinaProgress >= delcki[2]) {
							tempContext.lineTo(x + sirina/2 + radij, y + radij + visina);
						} else {
							tempContext.lineTo(x + sirina/2 + radij, y + radij + dolzinaProgress);
							break napredekBar;
						}
						dolzinaProgress -= delcki[2];
						break;
						case 3:
						if(dolzinaProgress >= delcki[3]) {
							tempContext.arc(x + sirina/2, y + radij + visina, radij, 0 * Math.PI, 0.5 * Math.PI);
						} else {
							tempContext.arc(x + sirina/2, y + radij + visina, radij, 0 * Math.PI, Math.PI * (0 + 0.5 * (dolzinaProgress/delcki[3])));
							break napredekBar;
						}
						dolzinaProgress -= delcki[3];
						break;
						case 4:
						if(dolzinaProgress >= delcki[4]) {
							tempContext.lineTo(x - sirina/2, y + 2 * radij + visina);
						} else {
							tempContext.lineTo(x + sirina/2 - dolzinaProgress, y + 2 * radij + visina);
							break napredekBar;
						}
						dolzinaProgress -= delcki[4];
						break;
						case 5:
						if(dolzinaProgress >= delcki[5]) {
							tempContext.arc(x - sirina/2, y + radij + visina, radij, 0.5 * Math.PI, 1 * Math.PI);
						} else {
							tempContext.arc(x - sirina/2, y + radij + visina, radij, 0.5 * Math.PI, Math.PI * (0.5 + 0.5 * (dolzinaProgress/delcki[5])));
							break napredekBar;
						}
						dolzinaProgress -= delcki[5];
						break;
						case 6:
						if(dolzinaProgress >= delcki[6]) {
							tempContext.lineTo(x - sirina/2 - radij, y + radij);
						} else {
							tempContext.lineTo(x - sirina/2 - radij, y + radij + visina - dolzinaProgress);
							break napredekBar;
						}
						dolzinaProgress -= delcki[6];
						break;
						case 7:
						if(dolzinaProgress >= delcki[7]) {
							tempContext.arc(x - sirina/2, y + radij, radij, 1 * Math.PI, 1.5 * Math.PI);
						} else {
							tempContext.arc(x - sirina/2, y + radij, radij, 1 * Math.PI, Math.PI * (1 + 0.5 * (dolzinaProgress/delcki[7])));
							break napredekBar;
						}
						dolzinaProgress -= delcki[7];
						break;
						case 8:
						if(dolzinaProgress >= delcki[8]) {
							tempContext.lineTo(x, y);
						} else {
							tempContext.lineTo(x - (sirina/2 - dolzinaProgress), y);
							break napredekBar;
						}
						dolzinaProgress -= delcki[8];
						break;
						default:
						break;
					}
				}
				tempContext.stroke();
				flagsService.setOkvir(true);
			}
			return tempCanvas;
		}

	}

})();
