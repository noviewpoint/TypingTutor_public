(function() {
	"use strict";

	angular
		.module("typingTutor")
		.service("casovnikiService", casovnikiService);

	casovnikiService.$inject = ["sharedStatesService", "computationalModelService", "parsingService", "imagesAndDivsService", "automaticSwitchingService", "audioService", "$state"];

	/**
	 * @ngdoc service
	 * @name typingTutor.service:casovnikiService
	 * @description
	 * Service, ki nudi funkcije za merjenja casa. Poleg merjenja casa tudi casovno prozi poljubne funkcije.
	 * @requires typingTutor.service:sharedStatesService
	 * @requires typingTutor.service:computationalModelService
	 * @requires typingTutor.service:parsingService
	 * @requires typingTutor.service:imagesAndDivsService
	 * @requires typingTutor.service:automaticSwitchingService
	 * @requires typingTutor.service:audioService
	 */

	function casovnikiService(sharedStatesService, computationalModelService, parsingService, imagesAndDivsService, automaticSwitchingService, audioService, $state) {
		//console.log("In casovnikiService");
		// http://codepen.io/lavoiesl/pen/GdqDJ

		/* casi prozenj */
		var timersValues = sharedStatesService.getTimers();

		var konecEksperimenta = sharedStatesService.getXmlConfigSessionOtherData(0)._limitT * 1000;
		var timeoutKonecEksperimenta = true;

		if (konecEksperimenta === -1000) {
			konecEksperimenta = undefined;
		}

		var t1 = parseInt(timersValues["post-measurements"]);
		var t2 = parseInt(timersValues["computational-model"]);
		var t3;
		var t4;
		var t5;

		var casovnik1 = new setCorrectingInterval(dejanje1, t1);
		var casovnik2 = new setCorrectingInterval(dejanje2, t2);
		var casovnik3;
		var casovnik4;
		var casovnik5;

		var absolutnoProzenjeMotnje = [];
		var absolutnoProzenjeVprasanja = [];








		var startingPoint = null;
		//var durationExercise = 0;
		var durationExperiment = 0;
		var durationDisturbance = 5000;

		var LOGME;
		var LOGME2 = null;
		var zastavica = true;

		var LOGabs = null;
		var zastavicaAbs = true;

		return {
			zacniCasovnike: zacniCasovnike,
			ugasniCasovnike: ugasniCasovnike,
			resetirajCasovnike: resetirajCasovnike,
			resetirajTriggerje: resetirajTriggerje
		};

		function dobiVrednostiCasovnikov() {
			console.log("In function dobiVrednostiCasovnikov");

			var x = automaticSwitchingService.getPreostaleNaloge();
			if (x) {
				t3 = x[0]._interT * 1000 != -1000 ? x[0]._interT * 1000 : undefined;
				t4 = x[0]._questT * 1000 != -1000 ? x[0]._questT * 1000 : undefined;
				t5 = x[0]._limitT * 1000 != -1000 ? x[0]._limitT * 1000 : undefined;
			}
		}

		function dobiVrednostiTriggerjev() {
			console.log("In function dobiVrednostiTriggerjev");
			var x = automaticSwitchingService.getTriggers();

			if (!x) {
				return;
			}
			for (var i = 0; i < x.length; i++) {

				var a = parseInt(x[i]._interT);
				var b = parseInt(x[i]._interType);

				var c = parseInt(x[i]._questT);
				var d = parseInt(x[i]._questType);

				if (a !== -1 && b !== -1) { // samo ce interT in interType nista "-1"
					absolutnoProzenjeMotnje.push(x[i]);
				}

				if (c !== -1 && d !== -1) { // samo ce questT in questType nista "-1"
					absolutnoProzenjeVprasanja.push(x[i]);
				}

			}
		}

		function ponastaviVrednostiCasovnikov() {
			console.log("In function ponastaviVrednostiCasovnikov");
			dobiVrednostiCasovnikov();

			if (automaticSwitchingService.isExperimentOngoing()) {
				dobiVrednostiTriggerjev();
			}

			if (t3) {
				casovnik3 = new setCorrectingInterval(dejanje3, t3);
			}

			if (t4) {
				casovnik4 = new setCorrectingInterval(dejanje4, t4);
			}

			if (t5) {
				casovnik5 = new setCorrectingInterval(dejanje5, t5);
			}

			console.log("Motnja cez", t3, "ms.");
			console.log("Vprasanja cez", t4, "ms.");
			console.log("Konec naloge cez", t5, "ms.");

		}


		/**
		 * @ngdoc method
		 * @name zacniCasovnike
		 * @methodOf typingTutor.service:casovnikiService
		 * @example
		 * casovnikiService.zacniCasovnike();
		 * @description
		 * Pozene casovnike.
		 */
		function zacniCasovnike() {
			console.log("In function zacniCasovnike");

			if (!startingPoint) {
				startingPoint = Date.now();
			}

			if (!LOGME2) {
				LOGME2 = Date.now();
			}

			if (!LOGabs) {
				LOGabs = Date.now();
			}

			if (zastavica) {
				ponastaviVrednostiCasovnikov();
				zastavica = false;
			}

			casovnik1.pozeni();
			casovnik2.pozeni();

			if (automaticSwitchingService.isExperimentOngoing()) {
				if (t3) {
					casovnik3.pozeni();
				}

				if (t4) {
					casovnik4.pozeni();
				}

				if (t5) {
					casovnik5.pozeni();
				}

				if (konecEksperimenta !== undefined && timeoutKonecEksperimenta === true) {
					console.log("Nastavljam SET TIMEOUT za konec eksperimenta!");
					setTimeout(function() {
						console.log("KONEC VODENEGA EKSPERIMENTA");
						resetirajTriggerje();
						$state.go("statistika");
						timeoutKonecEksperimenta = false;
					}, konecEksperimenta);
				}


				if (zastavicaAbs) {
					for(var i = 0; i < absolutnoProzenjeMotnje.length; i++) {

						(function(i) {
							absolutnoProzenjeMotnje[i].casovnik = setTimeout(function() {

								console.log("trigger: motnja", i, absolutnoProzenjeMotnje[i], parseInt(absolutnoProzenjeMotnje[i]._interT) * 1000);

								automaticSwitchingService.setInteruptIndex(parseInt(absolutnoProzenjeMotnje[i]._interType) - 1);

								audioService.playSoundInterupt(absolutnoProzenjeMotnje[i]._interType);

								imagesAndDivsService.izvediMotnjo_trigger(durationDisturbance, absolutnoProzenjeMotnje[i]._interType);

							}, parseInt(absolutnoProzenjeMotnje[i]._interT) * 1000);
						})(i);

					}

					for(var i = 0; i < absolutnoProzenjeVprasanja.length; i++) {

						(function(i) {
							absolutnoProzenjeVprasanja[i].casovnik = setTimeout(function() {

								console.log("trigger: motnja", i, absolutnoProzenjeVprasanja[i], parseInt(absolutnoProzenjeVprasanja[i]._questT) * 1000);

								automaticSwitchingService.setQuestionsIndex(parseInt(absolutnoProzenjeVprasanja[i]._questType) - 1);

								ugasniCasovnike();

								automaticSwitchingService.showQuestionsModal(absolutnoProzenjeVprasanja[i]._questType - 1);

							}, parseInt(absolutnoProzenjeVprasanja[i]._questT) * 1000);
						})(i);

					}
					zastavicaAbs = false;
				}




			}

		}


		/**
		 * @ngdoc method
		 * @name ugasniCasovnike
		 * @methodOf typingTutor.service:casovnikiService
		 * @example
		 * casovnikiService.ugasniCasovnike();
		 */
		function ugasniCasovnike() {
			console.log("In function ugasniCasovnike");

			if(!automaticSwitchingService.isExperimentOngoing()) {
				casovnik1.ustavi();
				LOGME2 = null;
			}

			casovnik2.ustavi();

			if (t3) {
				casovnik3.ustavi();
			}

			if (t4) {
				casovnik4.ustavi();
			}

			if (t5) {
				casovnik5.ustavi();
			}

			// set timeoutov zaenkrat ne ugasujem

			if (startingPoint) {
				durationExperiment += Date.now() - startingPoint;
				console.log("Uporabnik je celokupno tipkal", durationExperiment, "ms. Ponovni refresh strani (F5) ta cas resetira.");
				startingPoint = null;
			}



		}





		function resetirajCasovnike() {
			console.log("In function resetirajCasovnike");

			zastavica = true;

			if (!automaticSwitchingService.isExperimentOngoing()) {
				casovnik1 = new setCorrectingInterval(dejanje1, t1);
				resetirajTriggerje();
				timeoutKonecEksperimenta = true;
			}

			casovnik2 = new setCorrectingInterval(dejanje2, t2);

			if (t3) {
				casovnik3 = new setCorrectingInterval(dejanje3, t3);
			}

			if (t4) {
				casovnik4 = new setCorrectingInterval(dejanje4, t4);
			}

			if (t5) {
				casovnik5 = new setCorrectingInterval(dejanje5, t5);
			}

		}

		function resetirajTriggerje() {
			console.log("In function resetirajTriggerje");


			zastavicaAbs = true;

			for(var i = 0; i < absolutnoProzenjeMotnje.length; i++) {

				(function(i) {
					clearTimeout(absolutnoProzenjeMotnje[i].casovnik);
				})(i);

			}

			for(var i = 0; i < absolutnoProzenjeVprasanja.length; i++) {

				(function(i) {
					clearTimeout(absolutnoProzenjeVprasanja[i].casovnik);
				})(i);

			}
		}












		function dejanje1() {
			//console.log("dejanje1", Date.now() - LOGME2, "ms.");
			parsingService.postSensors();
		}
		function dejanje2() {
			console.log("dejanje2", Date.now() - LOGME, "ms.");
			computationalModelService.racunajPozornostInUtrujenost();
		}
		function dejanje3() {
			console.log("dejanje3", Date.now() - LOGME, "ms.");
			imagesAndDivsService.izvediMotnjo(durationDisturbance);

			var x = automaticSwitchingService.getPreostaleNaloge();

			if (x[0]._interType !== "-1") {
				audioService.playSoundInterupt(x[0]._interType);
			}
		}
		function dejanje4() {
			console.log("dejanje4", Date.now() - LOGME, "ms.");
			//ugasniCasovnike(false, true, true, true, true);
			ugasniCasovnike();
			automaticSwitchingService.showQuestionsModal();
		}
		function dejanje5() {
			console.log("dejanje5", Date.now() - LOGME, "ms.");
			//ugasniCasovnike(false, true, true, true, true);
			ugasniCasovnike();
			automaticSwitchingService.exerciseOver();
		}










		function setCorrectingInterval(func, delay) {

			var target;
			var ostanek = 0;
			var zacetek;
			var dejanskiTimer = 0;
			var tick = tick;


			var self = this;
			// dostopno od zunaj:
			self.ustavi = ustavi;
			self.pozeni = pozeni;


			function ustavi() {
				if (dejanskiTimer) {
					var casNehanja = Date.now();
					ostanek += (casNehanja - zacetek) % delay; // ostanek, delay --> en nivo visje
					clearTimeout(dejanskiTimer); // dejanskiTimer --> en nivo visje
					dejanskiTimer = 0; // dejanskiTimer --> en nivo visje
				}
			}
			function pozeni() {
				if (!dejanskiTimer) {
					LOGME = Date.now();
					zacetek = Date.now();
					target = zacetek + delay - ostanek; // target, delay, ostanek --> en nivo visje
					dejanskiTimer = setTimeout(tick, delay - ostanek); // tick, delay --> en nivo visje
				}
			}
			function tick() {
				target += delay; // target, delay --> en nivo visje
				//func(); // func --> en nivo visje
				var popravekCasa = target - Date.now(); // target --> en nivo visje
				dejanskiTimer = setTimeout(tick, popravekCasa); // dejanskiTimer, tick --> en nivo visje (potrebno da lahko clearas timeout)
				ostanek = 0;
				zacetek = Date.now();

				// func mora biti klicana na koncu da lahko iz dejanja4 ustavim casovnik4, drugace se dejanskiTimer ponastavi!
				func(); // func --> en nivo visje
			}

		}
	}
})();
