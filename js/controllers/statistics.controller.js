(function() {
	"use strict";

	angular
		.module("typingTutor")
		.controller("StatistikaController", StatistikaController);

	StatistikaController.$inject = ["$state", "sharedStatesService", "asynchronousCallsService", "audioService", "measurementsService"];

	/**
	 * @ngdoc controller
	 * @name typingTutor.controller:StatistikaController
	 * @description
	 * Controller, ki kontrolira pogled <i>statistika.html</i>
	 *
	 * Dostop do tega pogleda je zaklenjen. Aplikacija preusmeri v ta pogled, ce uporabnik opravi stopnjo.
	 * @requires $state
	 * @requires typingTutor.service:sharedStatesService
	 * @requires typingTutor.service:asynchronousCallsService
	 * @requires typingTutor.service:audioService
	 * @requires typingTutor.service:measurementsService
	 */
	function StatistikaController($state, sharedStatesService, asynchronousCallsService, audioService, measurementsService) {
		//console.log("In StatistikaController");
		var vm = this; // brez rabe angular.bind

		vm.increaseSelectedSubExerciseIndex = increaseSelectedSubExerciseIndex;

		// http://www.williammalone.com/articles/html5-canvas-javascript-bar-graph/
		var a = measurementsService.getHistoryKeyboard();
		var b = "";
		for (var i = 0; i < a.length; i++) {
			b += a[i].uporabnikovaCrka;
		}
		vm.exerciseReport = b;
		vm.repeatExercise = repeatExercise;
		vm.goBackToMenu = goBackToMenu;

		calculateStars();
		animateStars();

		/**
		 * @ngdoc method
		 * @name increaseSelectedSubExerciseIndex
		 * @methodOf typingTutor.controller:StatistikaController
		 * @example
		 * StatistikaCtrl.increaseSelectedSubExerciseIndex();
		 */
		function increaseSelectedSubExerciseIndex() {
			sharedStatesService.setSelectedSubExerciseIndex(sharedStatesService.getSelectedSubExerciseIndex() + 1);
		}

		/**
		 * @ngdoc method
		 * @name calculateStars
		 * @methodOf typingTutor.controller:StatistikaController
		 * @example
		 * calculateStars();
		 */
		function calculateStars() {
			vm.izracun = 100 *  sharedStatesService.getExerciseScore().steviloPravilnihPritiskov / (sharedStatesService.getExerciseScore().steviloNapacnihPritiskov +  sharedStatesService.getExerciseScore().steviloPravilnihPritiskov);
			vm.zvezdice = 0;
			vm.unlock = false;

			if (!vm.izracun) {
				vm.izracun = 0;
			}

			if (vm.izracun > 90) {
				vm.zvezdice = 4;
				vm.unlock = true;
			} else if (vm.izracun > 65) {
				vm.zvezdice = 3;
				vm.unlock = true; // ce uporabnik doseze vsaj 2 zvezdici, odklene naslednjo stopnjo
			} else if (vm.izracun > 50) {
				vm.zvezdice = 2;
			} else {
				vm.zvezdice = 1;
			}
		}

		/**
		 * @ngdoc method
		 * @name animateStars
		 * @methodOf typingTutor.controller:StatistikaController
		 * @example
		 * animateStars();
		 */
		function animateStars() {
			for (var i = 0; i < 3; i++) {
				if (vm.zvezdice > (i + 1)) {
					setTimeout(function() {
						try {
							var x = document.getElementsByClassName("fave");

							for(var i = 0; i < x.length; i++) {
								if(x[i].className == "fave") {
									x[i].className = "fave ongoing";
									audioService.playSoundStarPopout();
									break;
								}
							}
						} catch(e) {
							console.log("Napaka pri animaciji zvezdic. Koda napake:", e);
						}
					}, 750 + i * 250);
				}
			}
		}

		var send = {
			level: sharedStatesService.getSelectedExerciseIndex(),
			sublevel: sharedStatesService.getSelectedSubExerciseIndex(),
			achievement: vm.zvezdice,
			unlock: vm.unlock
		};

		asynchronousCallsService.postUnlockLevel(send);

		function repeatExercise() {
			$state.go("tipkanje");
		}

		function goBackToMenu() {
			$state.go("menu");
		}
	}

})();
