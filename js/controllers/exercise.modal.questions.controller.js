(function() {
	"use strict";

	angular
		.module("typingTutor")
		.controller("ExerciseModalQuestionsController", ExerciseModalQuestionsController);

	ExerciseModalQuestionsController.$inject = ["$uibModalInstance", "asynchronousCallsService", "sharedStatesService", "casovnikiService", "flagsService", "automaticSwitchingService"];

	/**
	 * @ngdoc controller
	 * @name typingTutor.controller:ExerciseModalQuestionsController
	 * @description
	 * Controller, ki kontrolira modal okno <i>modal_questions</i> od pogleda <i>tipkanje.html</i>
	 * <pre>
	 * http://nacomnet.lucami.org/expApp/typingTutor/#/tipkanje
	 * </pre>
	 * Dostop do tega pogleda je mogoc prek brskalnikove naslovne vrstice in prek brskalnikovih BACK/FORWARD gumbov.
	 * @requires $uibModalInstance
	 * @requires asynchronousCallsService
	 * @requires sharedStatesService
	 * @requires typingTutor.service:flagsService
	 * @requires typingTutor.service:automaticSwitchingService
	 */
	function ExerciseModalQuestionsController($uibModalInstance, asynchronousCallsService, sharedStatesService, casovnikiService, flagsService, automaticSwitchingService) {
		//console.log("In controller ModalQuestionsController");
		var vm = this; // brez rabe angular.bind

		flagsService.disableTyping();
		var casPojavitveVprasanj = Date.now();

		vm.okModal = okModal;
		vm.cancelModal = cancelModal;
		vm.postAnswers = postAnswers;

		var lastnosti = automaticSwitchingService.getPreostaleNaloge();

		var questionSet = sharedStatesService.getQuestions();


		var x = automaticSwitchingService.getPreostaleNaloge()[0]._questType - 1;
		var y = automaticSwitchingService.getQuestionsIndex();
		if (x !== -2) {
			vm.questions = [questionSet[x][0], questionSet[x][1], questionSet[x][2]];
		}
		if (y !== -1) {
			vm.questions = [questionSet[y][0], questionSet[y][1], questionSet[y][2]];
		}


		// default vrednosti odgovorov
		vm.answers = [5, 5, 5];

		/**
		 * @ngdoc method
		 * @name okModal
		 * @methodOf typingTutor.controller:ExerciseModalQuestionsController
		 * @example
		 * ExerciseModalQuestionsController.okModal();
		 * @description Uporabnik pritisne OK v modal oknu.
		 */
		function okModal() {
			console.log("okModal");
			flagsService.enableTyping();
			$uibModalInstance.close();
			casovnikiService.zacniCasovnike();
		}
		/**
		 * @ngdoc method
		 * @name cancelModal
		 * @methodOf typingTutor.controller:ExerciseModalQuestionsController
		 * @example
		 * ExerciseModalQuestionsController.cancelModal();
		 * @description Uporabnik pritisne CANCEL v modal oknu.
		 */
		function cancelModal() {
			console.log("cancelModal");
			flagsService.enableTyping();
			$uibModalInstance.dismiss("cancel");
			casovnikiService.zacniCasovnike();
		}


		/**
		 * @ngdoc method
		 * @name postAnswers
		 * @methodOf typingTutor.controller:ExerciseModalQuestionsController
		 * @example
		 * ExerciseModalQuestionsController.postAnswers();
		 * @description Funkcija, ki submita form z odgovori na vprašanja.
		 */
		function postAnswers() {
			var answersLogtoTheDatabase = {
				level: sharedStatesService.getSelectedExerciseIndex(),
				sublevel: sharedStatesService.getSelectedSubExerciseIndex(),
				username: sharedStatesService.getUsername(),
				casovniZig_in_exerciseIdentifier: sharedStatesService.getExerciseIdentifier(),
				casPojavitveVprasanj: casPojavitveVprasanj,
				casOddajeVprasanj: Date.now(),
				stanjaCasovnikov: "zaenkrat se brez!",
				vprasanjaInOdgovori: {
					first: {
						question: vm.questions[0],
						answer: vm.answers[0]
					},
					second: {
						question: vm.questions[1],
						answer: vm.answers[1]
					},
					third: {
						question: vm.questions[2],
						answer: vm.answers[2]
					}
				}

			};
			asynchronousCallsService.postAnswers(answersLogtoTheDatabase)
				.then(function(response) {
					console.log("response:", response.data);
				}, function(errResponse) {
					console.log("errResponse:", errResponse.data);
				});
		}
	}

})();
