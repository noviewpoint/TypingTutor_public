(function() {
	"use strict";

	angular
		.module("typingTutor")
		.service("measurementsService", measurementsService);

	measurementsService.$inject = ["sharedStatesService"];

	/**
	 * @ngdoc service
	 * @name typingTutor.service:measurementsService
	 * @description
	 * Service, ki hrani podatke senzorjev. Tipkovnica se tudi steje kot senzor.
	 * @requires sharedStatesService
	 */

	function measurementsService(sharedStatesService) {
		//console.log("In measurementsService");
		var vm = this;

		var historyKeyboard = [],
			historyNoldusFaceReader = [],
			historyTobiiEyeTracker = [],
			historyArduino_MPU6050 = [],
			historyAndroidWear_M360 = [],
			historyMultiluxAccel = [],
			historyMultiluxGSR = [];

		return {
			addToHistoryKeyboard: addToHistoryKeyboard,
			getHistoryKeyboard: getHistoryKeyboard,
			emptyHistoryKeyboard: emptyHistoryKeyboard,

			addToHistoryNoldusFaceReader: addToHistoryNoldusFaceReader,
			getHistoryNoldusFaceReader: getHistoryNoldusFaceReader,
			emptyHistoryNoldusFaceReader: emptyHistoryNoldusFaceReader,

			addToHistoryTobiiEyeTracker: addToHistoryTobiiEyeTracker,
			getHistoryTobiiEyeTracker: getHistoryTobiiEyeTracker,
			emptyHistoryTobiiEyeTracker: emptyHistoryTobiiEyeTracker,

			addToHistoryArduino_MPU6050: addToHistoryArduino_MPU6050,
			getHistoryArduino_MPU6050: getHistoryArduino_MPU6050,
			emptyHistoryArduino_MPU6050: emptyHistoryArduino_MPU6050,

			addToHistoryAndroidWear_M360: addToHistoryAndroidWear_M360,
			getHistoryAndroidWear_M360: getHistoryAndroidWear_M360,
			emptyHistoryAndroidWear_M360: emptyHistoryAndroidWear_M360,

			addToHistoryMultiluxAccel: addToHistoryMultiluxAccel,
			getHistoryMultiluxAccel: getHistoryMultiluxAccel,
			emptyHistoryMultiluxAccel: emptyHistoryMultiluxAccel,

			addToHistoryMultiluxGSR: addToHistoryMultiluxGSR,
			getHistoryMultiluxGSR: getHistoryMultiluxGSR,
			emptyHistoryMultiluxGSR: emptyHistoryMultiluxGSR
		};

		// ustvarjanje objektov s konstruktorjem, lastnosti vsakega ustvarjenega objekta kazejo v isti koscek rama
		function HistoryKeyboardObject(zakasnitev, uporabnikovaCrka, pravilnaCrka, tipNapake, pravilnost) {
			this.zakasnitev = zakasnitev;
			this.uporabnikovaCrka = uporabnikovaCrka;
			this.pravilnaCrka = pravilnaCrka;
			this.tipNapake = tipNapake;
			this.pravilnost = pravilnost;
			// dodajanje timestampa
			this.casovniZig = Date.now();
			this.exerciseIdentifier = sharedStatesService.getExerciseIdentifier();
			this.seansaIdentifier = sharedStatesService.getSeansaIdentifier();
		}


		function addToHistoryKeyboard(zakasnitev, uporabnikovaCrka, pravilnaCrka, tipNapake, pravilnost) {
			historyKeyboard.push(new HistoryKeyboardObject(zakasnitev, uporabnikovaCrka, pravilnaCrka, tipNapake, pravilnost));
			// console.log("Zgodovina historyKeyboard:", historyKeyboard);
		}
		function getHistoryKeyboard() {
			return historyKeyboard;
		}
		function emptyHistoryKeyboard() {
			historyKeyboard = [];
		}


		function addToHistoryNoldusFaceReader(x) {
			historyNoldusFaceReader.push(x);
			//console.log("Zgodovina noldusFaceReader:", historyNoldusFaceReader);
		}
		function getHistoryNoldusFaceReader() {
			return historyNoldusFaceReader;
		}
		function emptyHistoryNoldusFaceReader() {
			historyNoldusFaceReader = [];
		}


		function addToHistoryTobiiEyeTracker(x) {
			historyTobiiEyeTracker.push(x);
			//console.log("Zgodovina tobiiEyeTracker:", historyTobiiEyeTracker);
		}
		function getHistoryTobiiEyeTracker() {
			return historyTobiiEyeTracker;
		}
		function emptyHistoryTobiiEyeTracker() {
			historyTobiiEyeTracker = [];
		}


		function addToHistoryArduino_MPU6050(x) {
			historyArduino_MPU6050.push(x);
			//console.log("Zgodovina arduino_MPU6050:", historyArduino_MPU6050);
		}
		function getHistoryArduino_MPU6050() {
			return historyArduino_MPU6050;
		}
		function emptyHistoryArduino_MPU6050() {
			historyArduino_MPU6050 = [];
		}


		function addToHistoryAndroidWear_M360(x) {
			historyAndroidWear_M360.push(x);
			//console.log("Zgodovina androidWear_M360:", historyAndroidWear_M360);
		}
		function getHistoryAndroidWear_M360() {
			return historyAndroidWear_M360;
		}
		function emptyHistoryAndroidWear_M360() {
			historyAndroidWear_M360 = [];
		}

		function addToHistoryMultiluxAccel(x) {
			historyMultiluxAccel.push(x);
		}
		function getHistoryMultiluxAccel() {
			return historyMultiluxAccel;
		}
		function emptyHistoryMultiluxAccel() {
			historyMultiluxAccel = [];
		}

		function addToHistoryMultiluxGSR(x) {
			historyMultiluxGSR.push(x);
		}
		function getHistoryMultiluxGSR() {
			return historyMultiluxGSR;
		}
		function emptyHistoryMultiluxGSR() {
			historyMultiluxGSR = [];
		}
	}

})();
