(function() {
	"use strict";

	angular
		.module("typingTutor")
		.service("movingLettersService", movingLettersService);

	movingLettersService.$inject = ["$window", "flagsService", "measurementsService", "sharedStatesService", "okvirService"];

	/**
	 * @ngdoc service
	 * @name typingTutor.service:movingLettersService
	 * @description
	 * movingLettersService
	 * @requires $window
	 * @requires typingTutor.service:flagsService
	 * @requires typingTutor.service:measurementsService
	 * @requires typingTutor.service:sharedStatesService
	 * @requires typingTutor.service:okvirService
	 */

	function movingLettersService($window, flagsService, measurementsService, sharedStatesService, okvirService) {

		/* uporaba zacasnih canvasov za hitrejse delovanje aplikacije: */
		//console.log("In movingLettersService");
		var vm = this;

		var requestID;

		var stevecAnimacije = 0;
		var lastAnimationTime = Date.now();
		var fps = 60;

		// zacasni canvas za crke
		var tempCanvas = document.createElement("canvas");
		var tempContext = tempCanvas.getContext("2d");
		flagsService.setCrke(false);

		return {
			risiCrke: risiCrke,
			updateSize: updateSize,
			updateFont: updateFont
		};

		function updateSize(x, y) {
			if (x) {
				tempCanvas.width = x;
			}

			if (y) {
				tempCanvas.height = y;
			}
		}

		function updateFont() {
			tempContext.font = "normal 280px Lucida Console";
			// tempContext.font = "normal 140px Lucida Console";
		}

		function risiCrke(pozicijaX, pozicijaY, prostorCrke, velikostCrke) {
			if(!flagsService.getCrke()) {

				tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

				var userText = sharedStatesService.getUserText();
				var napacne = measurementsService.getHistoryKeyboard();

				var indeks = userText.length - 1;
				// indeks je -1 na zacetku

				var zapis = sharedStatesService.getExerciseText().concat();
				napacne = napacne.concat();

				// za string variabilne dolzine spreminjaj spremenljivko koliko
				var koliko = 14;

				if (indeks >= koliko/2) {
					zapis = zapis.substring(indeks-koliko/2, indeks+koliko/2);
					napacne = napacne.splice(indeks-koliko/2, koliko);
					indeks = koliko/2;
				} else {
					zapis = zapis.substring(0, koliko);
				}

				// izrisi userjev tekst
				for (var i = 0; i < zapis.length; i++) {
					if (napacne[i] != undefined && napacne[i].tipNapake != 0) {
						rdecGradient();
					} else if (napacne[i] != undefined && napacne[i].tipNapake === 0) {
						zelenGradient();
					} else {
						svetlaSiva();
					}

					if (i === indeks+1) {
						temnaSiva();
					}
					tempContext.fillText(zapis[i], pozicijaX + (i-indeks)*prostorCrke + (prostorCrke - velikostCrke)/2 - prostorCrke*stevecAnimacije, pozicijaY);
				}
				flagsService.setCrke(true);
			}
			return tempCanvas;
		}

		/**
		 * @ngdoc method
		 * @name zelenGradient
		 * @methodOf typingTutor.service:movingLettersService
		 * @example
		 * movingLettersService.zelenGradient();
		 */
		function zelenGradient() {
			var gradient = tempContext.createLinearGradient(0, 0, tempCanvas.width, 0);
			gradient.addColorStop("0", "rgba(135, 196, 63, 1)");
			gradient.addColorStop("0.5", "rgba(11, 150, 69, 1)");
			tempContext.fillStyle = gradient;
		}

		/**
		 * @ngdoc method
		 * @name rdecGradient
		 * @methodOf typingTutor.service:movingLettersService
		 * @example
		 * movingLettersService.rdecGradient();
		 */
		function rdecGradient() {
			var gradient = tempContext.createLinearGradient(0, 0, tempCanvas.width, 0);
			gradient.addColorStop("0", "rgb(252, 139, 142)");
			gradient.addColorStop("0.5", "rgb(249, 20, 26)");
			tempContext.fillStyle = gradient;
			tempContext.shadowColor = "black";
			tempContext.shadowOffsetX = 2;
			tempContext.shadowOffsetY = 2;
		}

		/**
		 * @ngdoc method
		 * @name svetlaSiva
		 * @methodOf typingTutor.service:movingLettersService
		 * @example
		 * movingLettersService.svetlaSiva();
		 */
		function svetlaSiva() {
			tempContext.fillStyle = "rgb(204, 204, 204)";
			tempContext.shadowColor = "black";
			tempContext.shadowOffsetX = 2;
			tempContext.shadowOffsetY = 2;
		}

		/**
		 * @ngdoc method
		 * @name temnaSiva
		 * @methodOf typingTutor.service:movingLettersService
		 * @example
		 * movingLettersService.temnaSiva();
		 */
		function temnaSiva() {
			tempContext.fillStyle = "grey";
			tempContext.shadowColor = "black";
			tempContext.shadowOffsetX = 2;
			tempContext.shadowOffsetY = 2;
		}

	}

})();
