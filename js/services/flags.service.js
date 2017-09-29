(function() {
	"use strict";

	angular
		.module("typingTutor")
		.service("flagsService", flagsService);

	flagsService.$inject = [];

	/**
	 * @ngdoc service
	 * @name typingTutor.service:flagsService
	 * @description
	 * flagsService
	 * @requires $window
	 * @requires typingTutor.service:flagsService
	 * @requires typingTutor.service:measurementsService
	 * @requires typingTutor.service:sharedStatesService
	 * @requires typingTutor.service:okvirService
	 */

	function flagsService() {
		//console.log("In flagsService");

		var okvir = false;
		var crke = false;
		var typing = true;

		return {
			getOkvir: getOkvir,
			setOkvir: setOkvir,

			getCrke: getCrke,
			setCrke: setCrke,

			isTypingEnabled: isTypingEnabled,
			enableTyping: enableTyping,
			disableTyping: disableTyping
		};

		function getOkvir() {
			return okvir;
		}
		function setOkvir(x) {
			okvir = x;
		}

		function getCrke() {
			return crke;
		}
		function setCrke(x) {
			crke = x;
		}

		function isTypingEnabled() {
			return typing;
		}
		function enableTyping() {
			console.log("in enableTyping");
			typing = true;
		}
		function disableTyping() {
			console.log("in disableTyping");
			typing = false;
		}
	}

})();
