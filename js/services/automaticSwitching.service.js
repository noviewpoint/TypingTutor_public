(function() {
	"use strict";

	angular
		.module("typingTutor")
		.service("automaticSwitchingService", automaticSwitchingService);

	automaticSwitchingService.$inject = ["$state", "$uibModal", "sharedStatesService"];

	/**
	 * @ngdoc service
	 * @name typingTutor.service:automaticSwitchingService
	 * @description
	 * Poganja vodeni eksperiment
	 * @requires $state
	 * @requires $uibModal
	 * @requires typingTutor.service:sharedStatesService
	 */

	function automaticSwitchingService($state, $uibModal, sharedStatesService) {
		//console.log("In automaticSwitchingService");

		var experimentSettings;
		var ongoingExperiment = false;
		var autoRepeat = false;
		var preostaleNaloge;
		var triggers;

		var questionsIndex;
		var interuptIndex;
		var sejaIndex;
		var userTips = false;

		return {
			runControlledExperiment: runControlledExperiment,
			exerciseOver: exerciseOver,
			showQuestionsModal: showQuestionsModal,
			isExperimentOngoing: isExperimentOngoing,
			endExperiment: endExperiment,

			getPreostaleNaloge: getPreostaleNaloge,
			getTriggers: getTriggers,

			setQuestionsIndex: setQuestionsIndex,
			getQuestionsIndex: getQuestionsIndex,

			setInteruptIndex: setInteruptIndex,
			getInteruptIndex: getInteruptIndex,

			showUserTips: showUserTips,
			disableUserTips: disableUserTips
		};

		function getPreostaleNaloge() {
			return preostaleNaloge;
		}

		function getSessionSettings(x) {
			// dobi nastavitve ustreznega sessiona
			preostaleNaloge = sharedStatesService.getXmlConfigSessionEvent(x);
			preostaleNaloge = preostaleNaloge.concat(); // da ne gre po referenci!
			triggers = sharedStatesService.getXmlConfigSessionTrigger(x);
		}

		function getTriggers() {
			return triggers;
		}


		/**
		 * @ngdoc method
		 * @name runControlledExperiment
		 * @methodOf typingTutor.service:automaticSwitchingService
		 * @description
		 * Požene vodeni eksperiment.
		 * @example
		 * automaticSwitchingService.runControlledExperiment();
		 */
		function runControlledExperiment(x) {
			console.log("In function runControlledExperiment");
			console.log("Indeks seje je", x);
			enableUserTips();

			sejaIndex = x;

			getSessionSettings(x - 1);


			//sharedStatesService.setSelectedExerciseIndex(experimentSettings.startingExercise - 1);
			//sharedStatesService.setSelectedExerciseIndex(experimentSettings.startingSubExercise - 1);

			if (preostaleNaloge) {
				console.log(eval(sharedStatesService.getXmlConfigSessionOtherData(x - 1)._continuousLoop));
				// dodaj vajo prvega elementa arraya
				sharedStatesService.setSelectedExerciseIndex(parseInt(preostaleNaloge[0]._level) - 1);
				sharedStatesService.setSelectedSubExerciseIndex(parseInt(preostaleNaloge[0]._exer) - 1);


				ongoingExperiment = true;
				$state.go("tipkanje");
			} else {
				alert("Uzbral si neustrezni indeks seje! Nic se ni zgodilo.");
			}
		}

		/**
		 * @ngdoc method
		 * @name exerciseOver
		 * @methodOf typingTutor.service:automaticSwitchingService
		 * @description
		 * Obravnava konec vaje.
		 * @example
		 * automaticSwitchingService.exerciseOver();
		 */
		function exerciseOver() {
			console.log("exerciseOver");
			//var a = sharedStatesService.getSelectedExerciseIndex();
			//var b = sharedStatesService.getSelectedSubExerciseIndex();


			// unici prvi element arraya
			preostaleNaloge.shift();

			console.log("Po unicenju element");
			console.log(preostaleNaloge);
			console.log(sharedStatesService.getXmlConfigSessionEvent(0));


			if (preostaleNaloge.length >= 1) {

				// dodaj vajo prvega elementa arraya
				sharedStatesService.setSelectedExerciseIndex(preostaleNaloge[0]._level - 1);
				sharedStatesService.setSelectedSubExerciseIndex(preostaleNaloge[0]._exer - 1);

				console.log("Reloadam controller za tipkanje");
				$state.reload("tipkanje");

			} else {
				if (eval(sharedStatesService.getXmlConfigSessionOtherData()._continuousLoop)) {
					console.log("Izvajanje v neskoncnost...");
					preostaleNaloge = sharedStatesService.getXmlConfigSessionEvent(sejaIndex);
					preostaleNaloge = preostaleNaloge.concat();

					// dodaj vajo prvega elementa arraya
					sharedStatesService.setSelectedExerciseIndex(preostaleNaloge[0]._level - 1);
					sharedStatesService.setSelectedSubExerciseIndex(preostaleNaloge[0]._exer - 1);

					console.log("Reloadam controller za tipkanje");
					$state.reload("tipkanje");

				} else {
					console.log("KONEC VODENEGA EKSPERIMENTA");
					$state.go("statistika");
					preostaleNaloge = [];
					ongoingExperiment = false;
				}
			}


			/* if (a <= experimentSettings.startingExercise && b <= experimentSettings.startingSubExercise) {

				sharedStatesService.setSelectedSubExerciseIndex(sharedStatesService.getSelectedSubExerciseIndex() + 1);

				console.log("Reloadam controller za tipkanje");
				$state.reload("tipkanje");

			} else {
				console.log("KONEC VODENEGA EKSPERIMENTA");
				$state.go("statistika");
				ongoingExperiment = false;
			} */
		}

		function showQuestionsModal(x) {
			console.log("xexe: izvedba 2");
			if (x) {
				setQuestionsIndex(x - 1);
			}
			$state.go("tipkanje.questions");
		}

		function isExperimentOngoing() {
			return ongoingExperiment;
		}
		function showUserTips() {
			console.log("showUserTips");
			return userTips;
		}
		function disableUserTips() {
			console.log("disableUserTips");
			userTips = false;
		}
		function enableUserTips() {
			console.log("enableUserTips");
			userTips = true;
		}


		function endExperiment() {
			console.log("In function endExperiment");
			ongoingExperiment = false;
		}



		function setQuestionsIndex(x) {
			console.log("In function setQuestionsIndex");
			questionsIndex = x;
		}
		function getQuestionsIndex() {
			console.log("In function getQuestionsIndex");
			return questionsIndex;
		}


		function setInteruptIndex(x) {
			interuptIndex = x;
		}
		function getInteruptIndex() {
			return interuptIndex;
		}

	}

})();
