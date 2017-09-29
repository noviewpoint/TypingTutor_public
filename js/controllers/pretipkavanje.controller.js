(function() {
	"use strict";

	angular
		.module("typingTutor")
		.controller("PretipkavanjeController", PretipkavanjeController);

	PretipkavanjeController.$inject = ["measurementsService", "$scope", "casovnikiService", "asynchronousCallsService", "sharedStatesService", "$state"];

	/**
	 * @ngdoc controller
	 * @name typingTutor.controller:PretipkavanjeController
	 * @description
	 * Controller, ki kontrolira pretipkavanje.
	 */

	function PretipkavanjeController(measurementsService, $scope, casovnikiService, asynchronousCallsService, sharedStatesService, $state) {
		console.log("In PretipkavanjeController");
		var vm = this;

		var pretipkavanjeText = sharedStatesService.getPretipkavanjeText();
		vm.navodilo = pretipkavanjeText.navodilo;
		vm.besedilo = pretipkavanjeText.besedilo;

		initialization();
		casovnikiService.zacniCasovnike();

		var handle;
		requestAnimationFrame(tick);

		var trajanjePretipkavanje = 125 * 1000; // 125 sekund trajanja
		var initialTimestamp = Date.now();
		var pogojIzstopa = trajanjePretipkavanje + initialTimestamp;

		function tick() {

			if (Date.now() >= pogojIzstopa) {
				cancelAnimationFrame(handle);
				handle = null;
				$state.go("menu");
			} else {
				handle = requestAnimationFrame(tick);
			}
		}

		function initialization() {
			console.log("In function initialization");

			// pocisti meritve iz prejsnjega nivoja
			measurementsService.emptyHistoryNoldusFaceReader();
			measurementsService.emptyHistoryTobiiEyeTracker();
			measurementsService.emptyHistoryArduino_MPU6050();
			measurementsService.emptyHistoryAndroidWear_M360();
			measurementsService.emptyHistoryMultiluxAccel();
			measurementsService.emptyHistoryMultiluxGSR();

			/*var practiceLogtoTheDatabase = {
				username: sharedStatesService.getUsername(),
				casovniZig_in_exerciseIdentifier: sharedStatesService.getUsername() + Date.now()
			};*/

			// postaj v bazo zapis, da je uporabnik z dolocenim username startal dolocen nivo ob dolocenem casu
			// asynchronousCallsService.postExerciseStart(practiceLogtoTheDatabase);

			// ob izhodu ubij event listenerje
			$scope.$on("$destroy", function() {
				console.log("Ugasam casovnike.");

				casovnikiService.ugasniCasovnike();
				casovnikiService.resetirajCasovnike();

				asynchronousCallsService.requestSetNoldusFaceReaderDataSizeToZero();
				asynchronousCallsService.requestSetTobiiEyeTrackerDataSizeToZero();
				asynchronousCallsService.requestSetAndroidWear_M360DataSizeToZero();
				asynchronousCallsService.requestSetArduino_MPU6050DataSizeToZero();
				asynchronousCallsService.requestSetMultiluxAccelDataSizeToZero();
				asynchronousCallsService.requestSetMultiluxGSRDataSizeToZero();
			});
		}
	}

})();
