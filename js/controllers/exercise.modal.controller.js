(function() {
	"use strict";

	angular
		.module("typingTutor")
		.controller("ExerciseModalController", ExerciseModalController);

	ExerciseModalController.$inject = ["$uibModalInstance", "flagsService"];

	/**
	 * @ngdoc controller
	 * @name typingTutor.controller:ExerciseModalController
	 * @description
	 * Controller, ki kontrolira modal okno <i>modal_tipkanje_predcasni_prehod_na_novo_stopnjo</i> od pogleda <i>tipkanje.html</i>
	 * <pre>
	 * http://nacomnet.lucami.org/expApp/typingTutor/#/tipkanje
	 * </pre>
	 * Dostop do tega pogleda je mogoc prek brskalnikove naslovne vrstice in prek brskalnikovih BACK/FORWARD gumbov.
	 * @requires $uibModalInstance
	 * @requires flagsService
	 */
	function ExerciseModalController($uibModalInstance, flagsService) {
		//console.log("In controller ExerciseModalController");
		var vm = this; // brez rabe angular.bind

		flagsService.disableTyping();

		vm.okModal = okModal;
		vm.cancelModal = cancelModal;

		/**
		 * @ngdoc method
		 * @name okModal
		 * @methodOf typingTutor.controller:ExerciseModalController
		 * @example
		 * TipkanjeModalCtrl.okModal();
		 */
		function okModal() {
			$uibModalInstance.close();
			$state.go("statistika"); // koncaj
		}
		/**
		 * @ngdoc method
		 * @name cancelModal
		 * @methodOf typingTutor.controller:ExerciseModalController
		 * @example
		 * TipkanjeModalCtrl.cancelModal();
		 */
		function cancelModal() {
			$uibModalInstance.dismiss("cancel");
		}
	}

})();
