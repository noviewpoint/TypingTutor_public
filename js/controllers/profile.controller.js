(function() {
	"use strict";

	angular
		.module("typingTutor")
		.controller("ProfileController", ProfileController);

	ProfileController.$inject = ["sharedStatesService", "asynchronousCallsService"];

	/**
	 * @ngdoc controller
	 * @name typingTutor.controller:ProfileController
	 * @description
	 * Controller, ki kontrolira pogled <i>profile.html</i>
	 * <pre>
	 * http://nacomnet.lucami.org/expApp/typingTutor/#/profile
	 * </pre>
	 * Dostop do tega pogleda je mogoc prek brskalnikove naslovne vrstice in prek brskalnikovih BACK/FORWARD gumbov.
	 * @requires typingTutor.service:sharedStatesService
	 * @requires typingTutor.service:asynchronousCallsService
	 */

	function ProfileController(sharedStatesService, asynchronousCallsService) {
		//console.log("In ProfileController");
		var vm = this;

		// check sensors
		vm.availableNoldusFaceReader;
		vm.availableTobiiEyeTracker;
		vm.availableArduino_MPU6050;
		vm.availableAndroidWear_M360;

		vm.checkSensors = checkSensors;

		vm.checkSensors();

		function checkSensors() {
			console.log("Checking sensors availability");
			asynchronousCallsService.requestNoldusFaceReader()
				.then(function(response) {
					vm.availableNoldusFaceReader = true;
				}, function(response) {
					vm.availableNoldusFaceReader = false;
				});
			asynchronousCallsService.requestTobiiEyeTracker()
				.then(function(response) {
					vm.availableTobiiEyeTracker = true;
				}, function(response) {
					vm.availableTobiiEyeTracker = false;
				});
			asynchronousCallsService.requestArduino_MPU6050()
				.then(function(response) {
					vm.availableArduino_MPU6050 = true;
				}, function(response) {
					vm.availableArduino_MPU6050 = false;
				});
			asynchronousCallsService.requestAndroidWear_M360()
				.then(function(response) {
					vm.availableAndroidWear_M360 = true;
				}, function(response) {
					vm.availableAndroidWear_M360 = false;
				});
		}
	}
})();
