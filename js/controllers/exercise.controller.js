(function() {
	"use strict";

	angular
		.module("typingTutor")
		.controller("ExerciseController", ExerciseController);

	ExerciseController.$inject = ["$scope", "$uibModal", "$document", "$state", "sharedStatesService", "measurementsService", "asynchronousCallsService", "audioService", "canvasService", "imagesAndDivsService", "computationalModelService", "casovnikiService", "parsingService", "flagsService", "automaticSwitchingService"];

	/**
	 * @ngdoc controller
	 * @name typingTutor.controller:ExerciseController
	 * @description
	 * Controller, ki kontrolira pogled <i>tipkanje.html</i>
	 * <pre>
	 * http://nacomnet.lucami.org/expApp/typingTutor/#/tipkanje
	 * </pre>
	 * Dostop do tega pogleda je mogoc prek brskalnikove naslovne vrstice in prek brskalnikovih BACK/FORWARD gumbov.
	 * @requires $scope
	 * @requires $uibModal
	 * @requires $document
	 * @requires $state
	 * @requires typingTutor.service:sharedStatesService
	 * @requires typingTutor.service:measurementsService
	 * @requires typingTutor.service:asynchronousCallsService
	 * @requires typingTutor.service:audioService
	 * @requires typingTutor.service:canvasService
	 * @requires typingTutor.service:imagesAndDivsService
	 * @requires typingTutor.service:computationalModelService
	 * @requires typingTutor.service:casovnikiService
	 * @requires typingTutor.service:parsingService
	 * @requires typingTutor.service:flagsService
	 * @requires typingTutor.service:automaticSwitchingService
	 */
	function ExerciseController ($scope, $uibModal, $document, $state, sharedStatesService, measurementsService, asynchronousCallsService, audioService, canvasService, imagesAndDivsService, computationalModelService, casovnikiService, parsingService, flagsService, automaticSwitchingService) {
		//console.log("In ExerciseController");
		var vm = this;

		if (automaticSwitchingService.isExperimentOngoing()) {
			if (!automaticSwitchingService.showUserTips()) {
				flagsService.enableTyping();
			} else {
				automaticSwitchingService.disableUserTips();
				$state.go("tipkanje.navodila");
			}
		} else {
			$state.go("tipkanje.navodila");
		}

		var casPritiska1;
		var casPritiska2;

		vm.motnja = false;

		initialization();
		addKeyboardListeners();

		/**
		 * @ngdoc method
		 * @name izvedenKeydown
		 * @methodOf typingTutor.controller:ExerciseController
		 * @example
		 * izvedenKeydown(e);
		 * @param {Object} e objekt eventa onkeydown
		 */
		function izvedenKeydown(e) {
			// chrome vs firefox
			var x = e.which || e.keyCode;

			if (x == 8) { // prepreci keypress event za BACKSPACE (v brskalniku nazaj)
				e.preventDefault();
			} else if (112 <= x && x <= 123) { // prepreci keypress event za F1 - F12 (odpiranje browserjevih podmenujev)
				e.preventDefault();
			} else if (x == 32) { // prepreci keypress event za SPACE (zascrolla browser navzdol)
				e.preventDefault();
				izvedenKeypress(e); // obdelaj SPACE
			}

			var x = casPritiska1;
			setTimeout(function() {
				if (Date.now() - casPritiska1 > 1500) {
					console.log("greater than 1500ms, setting keyboard data size in DB to zero");
					asynchronousCallsService.requestSetKeyboardDataSizeToZero();
				}
			}, 2000);
		}

		/**
		 * @ngdoc method
		 * @name izvedenKeypress
		 * @methodOf typingTutor.controller:ExerciseController
		 * @example
		 * izvedenKeypress(e);
		 * @param {Object} e objekt eventa onkeypress
		 */
		function izvedenKeypress(e) {
			var x = e.which || e.keyCode;
			var uporabnikovaCrka = String.fromCharCode(x);

			// razlikuje velike in male crke na podlagi pritiska na SHIFT
			if (e.shiftKey == false) {
				uporabnikovaCrka = uporabnikovaCrka.toLowerCase();
			}

			var pravilnaCrka = sharedStatesService.getExerciseText()[sharedStatesService.getSteps()];

			sharedStatesService.addUserTextLetter(uporabnikovaCrka);
			// racunaj pravilnost na podlagi zakasnitve, pravilne crke in uporabnikove crke
			computationalModelService.racunajPravilnost(Math.abs(casPritiska2 - casPritiska1), pravilnaCrka, uporabnikovaCrka);

			parsingService.postKeyboard();
			sharedStatesService.increaseSteps();

			// testno klici php datoteko get_iterations.php
			// asynchronousCallsService.getIterations();
		}

		/* ANGULAR WATCH FUNKCIJA */
		$scope.$watch(function() {
			return sharedStatesService.getUserText();
		}, watchUserInput);

		$scope.$watch(function() {
			return imagesAndDivsService.stanjeMotnje();
		}, watchMotnja);

		/**
		 * @ngdoc method
		 * @name watchMotnja
		 * @methodOf typingTutor.controller:ExerciseController
		 * @example
		 * watchMotnja(prej, potem);
		 * @description
		 * S pomocjo angular watch gleda za spremembami stanja motnje. Stanje motnje je boolean (ali motnja je ali je ni).
		 * @param {boolean} zdaj stanje motnje zdaj
		 * @param {boolean} prej stanje motnje prej
		 */
		function watchMotnja(zdaj, prej) {
			if (zdaj != prej) {
				vm.motnja = zdaj;
			}
		}

		/**
		 * @ngdoc method
		 * @name watchUserInput
		 * @methodOf typingTutor.controller:ExerciseController
		 * @example
		 * watchUserInput(prej, potem);
		 * @description
		 * S pomocjo angular watch gleda za spremembami uporabnikovega besedila. Ko uporabnik doda crko, funkcija reagira.
		 * @param {String} zdaj uporabnikovo besedilo zdaj
		 * @param {String} prej uporabnikovo besedilo prej
		 */
		function watchUserInput(zdaj, prej) { // funkcija se izvede tudi cisto na zacetku!
				// vpisovanje zgodovine sproti ob vsakem eventu pritiska tipke kot dodajanje objekta v array
				if (!checkVictory()) {
					canvasService.risiCrke();
					imagesAndDivsService.showFingers(sharedStatesService.getExerciseText()[sharedStatesService.getSteps()]);
					casPritiska1 = Date.now();
				}
		}

		/**
		 * @ngdoc method
		 * @name checkVictory
		 * @methodOf typingTutor.controller:ExerciseController
		 * @example
		 * checkVictory();
		 */
		function checkVictory() {

			//console.log("In key checkVictory");
			//predcasni prehod na novo stopnjo
			//vm.rezultat = sharedStatesService.getExerciseScore();
			//vm.izracun = 100 * vm.rezultat.steviloPravilnihPritiskov / (vm.rezultat.steviloNapacnihPritiskov + vm.rezultat.steviloPravilnihPritiskov);


			if (sharedStatesService.getUserText().length >= sharedStatesService.getExerciseText().length) {

				if(automaticSwitchingService.isExperimentOngoing()) {
					automaticSwitchingService.exerciseOver();
				} else {
					$state.go("statistika");
				}

				return true;
			} else if (sharedStatesService.getUserText().length % 10 == 0) {
				/*zastavica = false;
				var modalInstance = $uibModal.open({
                	animation: true,
                	templateUrl: "partials/modal_questions.html",
                	controller: "ExerciseModalQuestionsController",
                	controllerAs: "MQuestionsCtrl",
                	size: "lg"
            	});
            	console.log("v primeru nazaj");
				setTimeout(function() {
					console.log("postavljam zastavico nazaj");
					zastavica = true;
				}, 3000);*/
				/*} else if (sharedStatesService.getUserText().length === 20 & vm.izracun >= 90) { // hardkodirano
				$uibModal.open({
					animation: true,
					templateUrl: "partials/modal_tipkanje_predcasni_prehod_na_novo_stopnjo.html",
					controller: "ExerciseModalController",
					controllerAs: "TipkanjeModalCtrl",
					size: "lg"
				});*/

			} else if (sharedStatesService.getUserText().length % 2 == 0) {
				//vm.showHidePic = true;
				//imagesAndDivsService.zrisiMotnjo();
			} else {
				//console.log("In key checkVicotry IF FALSE");
				//vm.showHidePic = false;
				return false;
			}
		}

		function initialization() {
			console.log("In function initialization");
			// resetiraj spremenljivke iz prejsnjega nivoja
			sharedStatesService.resetsharedStatesService();

			// pocisti meritve iz prejsnjega nivoja
			measurementsService.emptyHistoryKeyboard();
			measurementsService.emptyHistoryNoldusFaceReader();
			measurementsService.emptyHistoryTobiiEyeTracker();
			measurementsService.emptyHistoryArduino_MPU6050();
			measurementsService.emptyHistoryAndroidWear_M360();
			measurementsService.emptyHistoryMultiluxAccel();
			measurementsService.emptyHistoryMultiluxGSR();

			// izprazni podatke v racunskem modelu iz prejsnjega nivoja
			computationalModelService.prazniMeritve();

			// dostopaj prek DOM do Canvasa
			canvasService.inicializirajCanvas();
			imagesAndDivsService.inicializirajHtmlElemente();
			imagesAndDivsService.spremeniBarvoOzadja();

			var practiceLogtoTheDatabase = {
				level: sharedStatesService.getSelectedExerciseIndex(),
				sublevel: sharedStatesService.getSelectedSubExerciseIndex(),
				username: sharedStatesService.getUsername(),
				casovniZig_in_exerciseIdentifier: sharedStatesService.getUsername() + Date.now(),
				seansaIdentifier: sharedStatesService.getSeansaIdentifier()
			};

			// postaj v bazo zapis, da je uporabnik z dolocenim username startal dolocen nivo ob dolocenem casu
			sharedStatesService.setExerciseIdentifier(practiceLogtoTheDatabase.casovniZig_in_exerciseIdentifier);
			asynchronousCallsService.postExerciseStart(practiceLogtoTheDatabase);

			// ob izhodu ubij event listenerje
			$scope.$on("$destroy", function() {
				console.log("Ubijam event listenerje in ugasam casovnike.");

				casovnikiService.ugasniCasovnike();
				casovnikiService.resetirajCasovnike();

				/*
				if (automaticSwitchingService.isExperimentOngoing()) {
					casovnikiService.ugasniCasovnike(false, true, true, true, true);
					casovnikiService.resetirajCasovnike(false, false, false, false, true);
				} else {
					casovnikiService.ugasniCasovnike();
					casovnikiService.resetirajCasovnike();
				}
				*/

				$document.unbind("keydown keypress");
				$(window).unbind("resize"); // jquery

				asynchronousCallsService.requestSetKeyboardDataSizeToZero();
				asynchronousCallsService.requestSetNoldusFaceReaderDataSizeToZero();
				asynchronousCallsService.requestSetTobiiEyeTrackerDataSizeToZero();
				asynchronousCallsService.requestSetAndroidWear_M360DataSizeToZero();
				asynchronousCallsService.requestSetArduino_MPU6050DataSizeToZero();
				asynchronousCallsService.requestSetMultiluxAccelDataSizeToZero();
				asynchronousCallsService.requestSetMultiluxGSRDataSizeToZero();
			});
		}

		function addKeyboardListeners() {
			console.log("In function addKeyboardListeners");
			/**
			 * @ngdoc event
			 * @name keydown.ExerciseController.zacniCasovnike
			 * @eventOf typingTutor.controller:ExerciseController
			 * @description
			 * Event prvega onkeydown pozene casovnik. Je za enkratno uporabo, ko casovnik pricne teci, se event ukine.
			 */
			$document.bind("keydown.ExerciseController.zacniCasovnike", function(e) {
				console.log("In keydown.ExerciseController.zacniCasovnike");


				if (flagsService.isTypingEnabled()) {

					console.log("In keydown.ExerciseController.zacniCasovnike TYPING ENABLED");
					// ob prvem keydown eventu pozeni casovnik
					casovnikiService.zacniCasovnike();
					// in nato ugasni listener za zaganjanje casovnika
					$document.unbind("keydown.ExerciseController.zacniCasovnike");

					// ob prvem keydown eventu prepisi vrednost prvega casa z novo vrednostjo, da bo zakasnitev 0
					// to se izvede za $document.unbind, ker ta pobere nekaj procesorskega casa
					casPritiska1 = Date.now();

				}


			});

			/**
			 * @ngdoc event
			 * @name keydown.ExerciseController.izvedenKeydown
			 * @eventOf typingTutor.controller:ExerciseController
			 * @description
			 * Event pritiska tipke, ki se zgodi onkeydown. Onkeydown se zgodi pred onkeypress!
			 */
			$document.bind("keydown.ExerciseController.izvedenKeydown", function(e) {
				//console.log("In keydown.ExerciseController.izvedenKeydown");
				if (flagsService.isTypingEnabled()) {
					//console.log("Izvajam izvedenKeydown(e)");
					casPritiska2 = Date.now();
					izvedenKeydown(e);
				}
			});

			/**
			 * @ngdoc event
			 * @name keydown.ExerciseController.izvedenKeypress
			 * @eventOf typingTutor.controller:ExerciseController
			 * @description
			 * Event pritiska tipke, ki se zgodi onkeypress.
			 */
			$document.on("keypress.ExerciseController.izvedenKeypress", function(e) {
				//console.log("In keypress.ExerciseController.izvedenKeypress");
				if (flagsService.isTypingEnabled()) {
					//console.log("Izvajam izvedenKeypress(e)");
					izvedenKeypress(e);
				}
			});
		}
	}

})();
