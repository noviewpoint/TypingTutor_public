(function() {
	"use strict";

	angular
		.module("typingTutor")
		.service("parsingService", parsingService);

	parsingService.$inject = ["asynchronousCallsService", "measurementsService", "sharedStatesService"];

	/**
	 * @ngdoc service
	 * @name typingTutor.service:parsingService
	 * @description
	 * Service, ki dobi meritve, jih preparsa v primerno obliko in poslje naprej.
	 * @requires typingTutor.service:asynchronousCallsService
	 * @requires typingTutor.service:measurementsService
	 * @requires typingTutor.service:sharedStatesService
	 */
	function parsingService(asynchronousCallsService, measurementsService, sharedStatesService) {
		//console.log("In parsingService");
		var vm = this;

		var sensorsValues = sharedStatesService.getSensors();

		var noldus = eval(sensorsValues.noldus);
		var tobii = eval(sensorsValues.tobii);
		var arduino = eval(sensorsValues.arduino);
		var wear = eval(sensorsValues.wear);
		var multiluxAccel = eval(sensorsValues["multilux-accel"]);
		var multiluxGSR =  eval(sensorsValues["multilux-gsr"]);

		return {
			postSensors: postSensors,
			postKeyboard: postKeyboard,
			emptyServer: emptyServer
		};

		function postKeyboard() {
			asynchronousCallsService.postKeyboard(measurementsService.getHistoryKeyboard()[sharedStatesService.getSteps()]);
		}

		function emptyServer() {
			console.log("In function emptyServer");
			asynchronousCallsService.emptyServer();
		}

		function postSensors() {
			if (noldus) {
				asynchronousCallsService.requestNoldusFaceReader()
					.then(function(response) {
						//console.log("Dobljeni objekt od NoldusFaceReader", response.data);

						var result = {};
						var temp = [];

						var str = response.data.NoldusDetailedLog;

						for (var i = 0; i < str.length; i ++) {
							result = str[i];
							// dodajanje timestampa
							result.casovniZig = Date.now();
							result.exerciseIdentifier = sharedStatesService.getExerciseIdentifier();
							result.seansaIdentifier = sharedStatesService.getSeansaIdentifier();
							measurementsService.addToHistoryNoldusFaceReader(result);
							temp.push(result);
						}

						return asynchronousCallsService.postNoldusFaceReader(temp);

					}, function(errResponse) {
						console.log("requestNoldusFaceReader error:", errResponse);
						asynchronousCallsService.requestSetNoldusFaceReaderDataSizeToZero();
					})
					// vpisi v MongoDB
					.then(function(response) {
						//console.log("Success in function asynchronousCallsService.postNoldusFaceReader", response);
					});
			}

			if (tobii) {
				asynchronousCallsService.requestTobiiEyeTracker()
					.then(function(response) {

						//console.log("Dobljeni objekt od  TobiiEyeTracker", response.data);

						var result = {};
						var temp = [];

						var str = response.data.TobiiDetailedLog;

						for (var i = 0; i < str.length; i ++) {
							result = str[i].tobiiEyeTracker;
							// dodajanje timestampa
							result.casovniZig = Date.now();
							result.exerciseIdentifier = sharedStatesService.getExerciseIdentifier();
							result.seansaIdentifier = sharedStatesService.getSeansaIdentifier();
							measurementsService.addToHistoryTobiiEyeTracker(result);
							temp.push(result);
						}

						return asynchronousCallsService.postTobiiEyeTracker(temp)

					}, function(errResponse) {
						console.log("requestTobiiEyeTracker error:", errResponse);
						asynchronousCallsService.requestSetTobiiEyeTrackerDataSizeToZero();
					})
					// vpisi v MongoDB
					.then(function(response) {
						//console.log("Success in function asynchronousCallsService.postTobiiEyeTracker", response);
					});
			}

			if (arduino) {
				asynchronousCallsService.requestArduino_MPU6050()
					.then(function(response) {

						//console.log("Dobljeni objekt od Arduino_MPU6050", response.data);

						var result = {};
						var temp = [];

						var str = response.data.TobiiDetailedLog;

						for (var i = 0; i < str.length; i ++) {
							result = str[i].arduinoDetailedLog;
							// dodajanje timestampa
							result.casovniZig = Date.now();
							result.exerciseIdentifier = sharedStatesService.getExerciseIdentifier();
							result.seansaIdentifier = sharedStatesService.getSeansaIdentifier();
							measurementsService.addToHistoryArduino_MPU6050(result);
							temp.push(result);
						}

						return asynchronousCallsService.postArduino_MPU6050(temp);
					}, function(errResponse) {
						console.log("requestArduino_MPU6050 error:", errResponse);
						asynchronousCallsService.requestSetArduino_MPU6050DataSizeToZero();
					})
					// vpisi v MongoDB
					.then(function(response) {
						//console.log("Success in function asynchronousCallsService.postArduino_MPU6050", response);
					});
			}

			if (wear) {
				asynchronousCallsService.requestAndroidWear_M360()
					.then(function(response) {

						//console.log("Dobljeni objekt od             Wear", response.data);

						var result = {};
						var temp = [];

						var str = response.data.wearLog;

						for (var i = 0; i < str.length; i ++) {
							result = str[i];
							// dodajanje timestampa
							result.casovniZig = Date.now();
							result.exerciseIdentifier = sharedStatesService.getExerciseIdentifier();
							result.seansaIdentifier = sharedStatesService.getSeansaIdentifier();
							measurementsService.addToHistoryAndroidWear_M360(result);
							temp.push(result);
						}

						return asynchronousCallsService.postAndroidWear_M360(temp);
					}, function(errResponse) {
						console.log("requestAndroidWear_M360 error:", errResponse);
						asynchronousCallsService.requestSetAndroidWear_M360DataSizeToZero();
					})
					// vpisi v MongoDB
					.then(function(response) {
						//console.log("Success in function asynchronousCallsService.postAndroidWear_M360", response);
					});
			}

			if (multiluxAccel) {
				asynchronousCallsService.requestMultiluxAccel()
					.then(function(response) {
						//console.log("Dobljeni objekt od MultiluxAccel", response.data);

						var result = {};
						var temp = [];

						var str = response.data.AccelDetailedLog;

						for (var i = 0; i < str.length; i ++) {
							result = str[i];
							// dodajanje timestampa
							result.casovniZig = Date.now();
							result.exerciseIdentifier = sharedStatesService.getExerciseIdentifier();
							result.seansaIdentifier = sharedStatesService.getSeansaIdentifier();
							measurementsService.addToHistoryMultiluxAccel(result);
							temp.push(result);
						}

						return asynchronousCallsService.postMultiluxAccel(temp);
					}, function(errResponse) {
						//console.log("requestMultiluxAccel error:", errResponse);
						asynchronousCallsService.requestSetMultiluxAccelDataSizeToZero();
					})
					// vpisi v MongoDB
					.then(function(response) {
						//console.log("Success in function asynchronousCallsService.postMultiluxAccel", response);
					});
			}

			if (multiluxGSR) {
				asynchronousCallsService.requestMultiluxGSR()
					.then(function(response) {
						//console.log("Dobljeni objekt od MultiluxGSR", response.data);

						var result = {};
						var temp = [];

						var str = response.data.GSRDetailedLog;

						for (var i = 0; i < str.length; i ++) {
							result = str[i];
							// dodajanje timestampa
							result.casovniZig = Date.now();
							result.exerciseIdentifier = sharedStatesService.getExerciseIdentifier();
							result.seansaIdentifier = sharedStatesService.getSeansaIdentifier();
							measurementsService.addToHistoryMultiluxGSR(result);
							temp.push(result);
						}

						return asynchronousCallsService.postMultiluxGSR(temp);
					}, function(errResponse) {
						console.log("requestMultiluxGSR error:", errResponse);
						asynchronousCallsService.requestSetMultiluxGSRDataSizeToZero();
					})
					// vpisi v MongoDB
					.then(function(response) {
						//console.log("Success in function asynchronousCallsService.postMultiluxGSR", response);
					});
			}

		}
	}

})();
