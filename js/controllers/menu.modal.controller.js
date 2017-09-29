(function() {
	"use strict";

	angular
		.module("typingTutor")
		.controller("MenuModalController", MenuModalController);

	MenuModalController.$inject = ["$uibModalInstance"];

	/**
	 * @ngdoc controller
	 * @name typingTutor.controller:MenuModalController
	 * @description
	 * Controller, ki kontrolira modal okno <i>modal_menu_nedovoljenje.html</i> od pogleda <i>menu.html</i>
	 * <pre>
	 * http://nacomnet.lucami.org/expApp/typingTutor/#/
	 * </pre>
	 * Dostop do tega pogleda je mogoc prek brskalnikove naslovne vrstice in prek brskalnikovih BACK/FORWARD gumbov.
	 * @requires $uibModalInstance
	 */
	function MenuModalController($uibModalInstance) {
		//console.log("In MenuModalController");
		var vm = this;
		// $uibModal.open({
		// 	animation: true,
		// 	templateUrl: "partials/modal_menu_nedovoljenje.html",
		// 	controller: "MenuModalController",
		// 	controllerAs: "MenuModalCtrl",
		// 	size: "lg"
		// });
		//scope: $scope,
		//templateUrl: "partials/modal_profile.html",
		//size: "",
		//backdrop: false

		vm.okModal = okModal;

		/**
		 * @ngdoc method
		 * @name okModal
		 * @methodOf typingTutor.controller:MenuModalController
		 * @example
		 * MenuModalController.okModal();
		 */
		function okModal() {
			$uibModalInstance.close();
		}
	}

})();
