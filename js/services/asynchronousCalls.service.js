(function() {
	"use strict";

	angular
		.module("typingTutor")
		.service("asynchronousCallsService", asynchronousCallsService);

	asynchronousCallsService.$inject = ["$http"];

	/**
	 * @ngdoc service
	 * @name typingTutor.service:asynchronousCallsService
	 * @description
	 * Service, ki nudi funkcije za izvajanje asinhronih GET/POST klicev.
	 * @requires $http
	 */

	function asynchronousCallsService($http) {
		//console.log("In asynchronousCallsService");

		var noldusFaceReaderUrl = "http://127.0.0.1:8080/noldusFaceReader",
			tobiiEyeTrackerUrl = "http://127.0.0.1:8080/tobiiEyetracker",
			arduino_MPU6050Url = "http://127.0.0.1:8080/arduino_MPU6050",
			androidWear_M360Url = "http://127.0.0.1:8080/wear",
			multiluxGSRUrl = "http://127.0.0.1:8080/multiLuxGSR",
			multiluxAccelUrl = "http://127.0.0.1:8080/multiLuxAccel",
			emptyServerUrl = "http://127.0.0.1:8080/emptyData";

		// vse tu so ASYNCANI REQUESTI, ki vrnejo promise
		// privzeto angularjs naredi headers: {"Content-Type": "application/json"}
		// GET caching in browser ---> tam kjer nam je to koristno

		return {
			postUnlockLevel: postUnlockLevel,
			requestUserUnlocksAndAchievements: requestUserUnlocksAndAchievements,
			requestExercisesText: requestExercisesText,
			requestPretipkavanjeText: requestPretipkavanjeText,
			requestAuthentication: requestAuthentication,

			parseJson: parseJson,

			postKeyboard: postKeyboard,
			postExerciseStart: postExerciseStart,
			postNoldusFaceReader: postNoldusFaceReader,
			postTobiiEyeTracker: postTobiiEyeTracker,
			postArduino_MPU6050: postArduino_MPU6050,
			postAndroidWear_M360: postAndroidWear_M360,
			postMultiluxAccel: postMultiluxAccel,
			postMultiluxGSR: postMultiluxGSR,

			requestNoldusFaceReader: requestNoldusFaceReader,
			requestTobiiEyeTracker: requestTobiiEyeTracker,
			requestArduino_MPU6050: requestArduino_MPU6050,
			requestAndroidWear_M360: requestAndroidWear_M360,
			requestMultiluxAccel: requestMultiluxAccel,
			requestMultiluxGSR: requestMultiluxGSR,

			emptyServer: emptyServer,

			requestQuestions: requestQuestions,
			requestConfigFile: requestConfigFile,
			requestXmlConfigFile: requestXmlConfigFile,

			postAnswers: postAnswers,
			getIterations: getIterations,

			requestSetKeyboardDataSizeToZero: requestSetKeyboardDataSizeToZero,
			requestSetNoldusFaceReaderDataSizeToZero: requestSetNoldusFaceReaderDataSizeToZero,
			requestSetTobiiEyeTrackerDataSizeToZero: requestSetTobiiEyeTrackerDataSizeToZero,
			requestSetAndroidWear_M360DataSizeToZero: requestSetAndroidWear_M360DataSizeToZero,
			requestSetArduino_MPU6050DataSizeToZero: requestSetArduino_MPU6050DataSizeToZero,
			requestSetMultiluxAccelDataSizeToZero: requestSetMultiluxAccelDataSizeToZero,
			requestSetMultiluxGSRDataSizeToZero: requestSetMultiluxGSRDataSizeToZero
		};

		function postUnlockLevel(x) {
			return $http({method: "POST", url: "php/post_unlock_level.php", data: x});
		}
		function requestUserUnlocksAndAchievements() {
			return $http({method: "GET", url: "php/request_user_unlocks_and_achievements.php"});
		}
		function requestExercisesText() {
			// $http({method: "GET", url: "php/request_exercises_text.php"});
			return $http({method: "GET", url: "vaje.json"});
		}
		function requestPretipkavanjeText() {
			return $http({method: "GET", url: "pretipkavanje.json"});
		}
		function requestAuthentication() {
			return $http({method: "GET", url: "php/request_authentication.php"});
		}


		function parseJson(x) {
			return $http({method: "POST", url: "php/parse_json.php", data: x});
		}


		// post merjenj v MongoDB podatkovno bazo
		function postKeyboard(x) {
			// return $http({method: "POST", url: "php/post_measurements.php", data: x});
			return $http({method: "POST", url: "php/post_keyboard.php", data: x});
		}
		function postNoldusFaceReader(x) {
			return $http({method: "POST", url: "php/post_noldus_face_reader.php", data: x});
		}
		function postTobiiEyeTracker(x) {
			return $http({method: "POST", url: "php/post_tobii_eye_tracker.php", data: x});
		}
		function postArduino_MPU6050(x) {
			return $http({method: "POST", url: "php/post_arduino_MPU6050.php", data: x});
		}
		function postAndroidWear_M360(x) {
			return $http({method: "POST", url: "php/post_android_wear_M360.php", data: x});
		}
		function postMultiluxAccel(x) {
			return $http({method: "POST", url: "php/post_multilux_Accel_test.php", data: x});
		}
		function postMultiluxGSR(x) {
			return $http({method: "POST", url: "php/post_GSR_test.php", data: x});
		}
		function postExerciseStart(x) {
			return $http({method: "POST", url: "php/post_exercise_start.php", data: x});
		}


		function requestNoldusFaceReader() {
			return $http({method: "GET", url: noldusFaceReaderUrl});
		}
		function requestTobiiEyeTracker() {
			return $http({method: "GET", url: tobiiEyeTrackerUrl});
		}
		function requestArduino_MPU6050() {
			return $http({method: "GET", url: arduino_MPU6050Url});
		}
		function requestAndroidWear_M360() {
			return $http({method: "GET", url: androidWear_M360Url});
		}
		function requestMultiluxAccel() {
			return $http({method: "GET", url: multiluxAccelUrl});
		}
		function requestMultiluxGSR() {
			return $http({method: "GET", url: multiluxGSRUrl});
		}



		function emptyServer() {
			return $http({method: "GET", url: emptyServerUrl});
		}
		function getProduct() {
            return $http.get(noldusFaceReaderUrl).then(function(response) {
                return response.data;
            });
    	}
    	function requestQuestions(x) {
			return $http({method: "GET", url: "php/request_questions.php"});
		}
		function requestConfigFile() {
			return $http({method: "GET", url: "config.json"});
		}
		function requestXmlConfigFile(x) {
			return $http({method: "GET", url: x});
		}

		function postAnswers(x) {
			return $http({method: "POST", url: "php/post_answers.php", data: x});
		}

		function getIterations() {
			return $http({method: "GET", url: "php/get_iterations.php"});
		}

		function requestSetKeyboardDataSizeToZero() {
			return $http({method: "GET", url: "php/request_set_keyboard_data_size_to_zero.php"});
		}
		function requestSetNoldusFaceReaderDataSizeToZero() {
			return $http({method: "GET", url: "php/request_set_noldus_face_reader_data_size_to_zero.php"});
		}
		function requestSetTobiiEyeTrackerDataSizeToZero() {
			return $http({method: "GET", url: "php/request_set_tobii_eye_tracker_data_size_to_zero.php"});
		}
		function requestSetAndroidWear_M360DataSizeToZero() {
			return $http({method: "GET", url: "php/request_set_android_wear_M360_data_size_to_zero.php"});
		}
		function requestSetArduino_MPU6050DataSizeToZero() {
			return $http({method: "GET", url: "php/request_set_arduino_MPU6050_data_size_to_zero.php"});
		}
		function requestSetMultiluxAccelDataSizeToZero() {
			return $http({method: "GET", url: "php/request_set_multilux_accel_data_size_to_zero.php"});
		}
		function requestSetMultiluxGSRDataSizeToZero() {
			return $http({method: "GET", url: "php/request_set_multilux_GSR_data_size_to_zero.php"});
		}

	}
})();
