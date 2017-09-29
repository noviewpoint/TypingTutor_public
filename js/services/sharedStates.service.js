(function() {
	"use strict";

	angular
		.module("typingTutor")
		.service("sharedStatesService", sharedStatesService);

	sharedStatesService.$inject = [];

	/**
	 * @ngdoc service
	 * @name typingTutor.service:sharedStatesService
	 * @description
	 * Velik service, ki hrani podatke uporabnika in aplikacije ter nudi funkcije za branje/pisanje po teh podatkih.
	 */
	function sharedStatesService() {
		//console.log("In sharedStatesService");
		var vm = this;

		// napolni resolve v app.js
		var vprasanja,
			exercisesText,
			pretipkavanjeText,
			userUnlocksAndAchievements,
			username,
			configFile,
			xmlConfigFile;

		var selectedExerciseIndex = 0,
			selectedSubExerciseIndex = 0,
			steps = 0,
			userText = "", // uft8 za blank space je \u00A0
			steviloPravilnihPritiskov = 0,
			steviloNapacnihPritiskov = 0,
			exerciseIdentifier = 0,
			seansaIdentifier = "";

		var xmlConfigFileName = "";

		return {
			setQuestions: setQuestions,
			getQuestions: getQuestions,

			setExercisesText: setExercisesText,
			getExerciseText: getExerciseText,
			getInstructions: getInstructions,

			setPretipkavanjeText: setPretipkavanjeText,
			getPretipkavanjeText: getPretipkavanjeText,

			setUserUnlocksAndAchievements: setUserUnlocksAndAchievements,
			getUserUnlocksAndAchievements: getUserUnlocksAndAchievements,

			setUsername: setUsername,
			getUsername: getUsername,

			setConfigFile: setConfigFile,
			setXmlConfigFile: setXmlConfigFile,
			getXmlConfigSessionEvent: getXmlConfigSessionEvent,
			getXmlConfigSessionTrigger: getXmlConfigSessionTrigger,
			getXmlConfigAudioRecord: getXmlConfigAudioRecord,
			getXmlConfigVisualImage: getXmlConfigVisualImage,
			getXmlConfigSessionOtherData: getXmlConfigSessionOtherData,
			getXmlConfigUserTip: getXmlConfigUserTip,
			getXmlConfigEmoticon: getXmlConfigEmoticon,
			getTimers: getTimers,
			getSensors: getSensors,
			getExperimentSettings: getExperimentSettings,
			getFileLocation: getFileLocation,

			setSession: setSession,


			resetsharedStatesService: resetsharedStatesService,


			setSelectedExerciseIndex: setSelectedExerciseIndex,
			getSelectedExerciseIndex: getSelectedExerciseIndex,

			setSelectedSubExerciseIndex: setSelectedSubExerciseIndex,
			getSelectedSubExerciseIndex: getSelectedSubExerciseIndex,

			increaseSteps: increaseSteps,
			decreaseSteps: decreaseSteps,
			getSteps: getSteps,

			addUserTextLetter: addUserTextLetter,
			removeUserTextLetter: removeUserTextLetter,
			getUserText: getUserText,

			povecajSteviloPravilnihPritiskov: povecajSteviloPravilnihPritiskov,
			povecajSteviloNapacnihPritiskov: povecajSteviloNapacnihPritiskov,
			getExerciseScore: getExerciseScore,

			setExerciseIdentifier: setExerciseIdentifier,
			getExerciseIdentifier: getExerciseIdentifier,

			setSeansaIdentifier: setSeansaIdentifier,
			getSeansaIdentifier: getSeansaIdentifier,

			getXmlConfigFileName: getXmlConfigFileName,
			setXmlConfigFileName: setXmlConfigFileName
		};


		// ustvarjanje objektov s konstruktorjem, lastnosti vsakega ustvarjenega objekta kazejo v isti koscek rama
		function Level(id, achievement) {
			this.id = id;
			this.achievement = achievement;
			this.sublevels = [];
		}

		function Sublevel(id, achievement) {
			this.id = id;
			this.achievement = achievement;
		}


		/**
		 * @ngdoc method
		 * @name resetsharedStatesService
		 * @methodOf typingTutor.service:sharedStatesService
		 * @description
		 * Pobrise stanje v sharedStatesService (obicajno po koncu nivoja).
		 * @example
		 * sharedStatesService.resetsharedStatesService();
		 */
		function resetsharedStatesService() {
			steps = 0,
			userText = "",
			steviloPravilnihPritiskov = 0,
			steviloNapacnihPritiskov = 0,
			exerciseIdentifier = null;
		}
		/**
		 * @ngdoc method
		 * @name setSelectedExerciseIndex
		 * @methodOf typingTutor.service:sharedStatesService
		 * @description
		 * Uporabnik izbere stopnjo. Ob izboru stopnje se hkrati izbere najvecji odklenjeni nivo v stopnji ali nivo stopnje, ki najbolj rabi izboljsanje. Ce so vsi nivoji opravljeni na max tezavnosti, je izbran prvi nivo.
		 * @example
		 * sharedStatesService.setSelectedExerciseIndex(x);
		 * @param {int} x indeks stopnje
		 */
		function setSelectedExerciseIndex(x) {
			if (x != selectedExerciseIndex) {
				selectedExerciseIndex = x;

				var temp = [];
				var arr = userUnlocksAndAchievements[x].sublevels;

				for (var i = 0; i < arr.length; i++) {
					temp[i] = arr[i].achievement;
				}

				var indexOfMinValue = temp.reduce(function(iMin, x, i, a) {
					return (x < a[iMin] && x != 0) ? i : iMin;
				}, 0);

				selectedSubExerciseIndex = indexOfMinValue;
			}
		}
		/**
		 * @ngdoc method
		 * @name getSelectedExerciseIndex
		 * @methodOf typingTutor.service:sharedStatesService
		 *
		 * @description
		 * Pove, katera stopnja je izbrana.
		 * @example
		 * sharedStatesService.getSelectedExerciseIndex();
		 * @returns {int} indeks stopnje
		 */
		function getSelectedExerciseIndex() {
			return selectedExerciseIndex;
		}
		/**
		 * @ngdoc method
		 * @name setSelectedSubExerciseIndex
		 * @methodOf typingTutor.service:sharedStatesService
		 *
		 * @description
		 * Uporabnik izbere nivo.
		 * @example
		 * sharedStatesService.setSelectedSubExerciseIndex(x);
		 * @param {int} x indeks nivoja
		 */
		function setSelectedSubExerciseIndex(x) {
			if (x >= exercisesText[selectedExerciseIndex].naloge.length) {
				console.log("Klicano iz increaseSelectedSubExerciseIndex. Index podstopnje bil prevelik, povecujem index kar za stopnjo.");
				selectedExerciseIndex++;
				selectedSubExerciseIndex = 0;
			} else if (x != selectedSubExerciseIndex) {
				selectedSubExerciseIndex = x;
			}
		}
		/**
		 * @ngdoc method
		 * @name getSelectedSubExerciseIndex
		 * @methodOf typingTutor.service:sharedStatesService
		 *
		 * @description
		 * Pove, kateri nivo je izbran.
		 * @example
		 * sharedStatesService.getSelectedSubExerciseIndex();
		 * @returns {int} indeks stopnje
		 */
		function getSelectedSubExerciseIndex() {
			return selectedSubExerciseIndex;
		}
		/**
		 * @ngdoc method
		 * @name setExercisesText
		 * @methodOf typingTutor.service:sharedStatesService
		 *
		 * @description
		 * Shrani besedila nalog v spremenljivko (po izvedenem http get).
		 * @example
		 * sharedStatesService.setExercisesText();
		 * @param {object} objekt besedil vseh nalog
		 */
		function setExercisesText(x) {
			exercisesText = x;
		}
		/**
		 * @ngdoc method
		 * @name getExerciseText
		 * @methodOf typingTutor.service:sharedStatesService
		 *
		 * @description
		 * Vrni besedilo izbrane naloge.
		 * @example
		 * sharedStatesService.getExerciseText();
		 * @param {string} besedilo izbrane naloge
		 */
		function getExerciseText() {
			return exercisesText[selectedExerciseIndex].naloge[selectedSubExerciseIndex];
		}
		/**
		 * @ngdoc method
		 * @name getInstructions
		 * @methodOf typingTutor.service:sharedStatesService
		 *
		 * @description
		 * Vrni navodilo izbrane naloge.
		 * @example
		 * sharedStatesService.getInstructions();
		 * @param {string} navodilo izbrane naloge
		 */
		function getInstructions() {
			return exercisesText[selectedExerciseIndex].navodilo;
		}

		function setPretipkavanjeText(x) {
			pretipkavanjeText = x;
		}

		function getPretipkavanjeText() {
			return pretipkavanjeText;
		}

		function setUsername(x) {
			username = x;
		}
		function getUsername() {
			return username;
		}

		function setUserUnlocksAndAchievements(x) {

			// vzpostavi stanje vseh dosezkov na 0
			userUnlocksAndAchievements = [];
			for (var i = 0; i < exercisesText.length; i++) {
				userUnlocksAndAchievements.push(new Level(i, 0));
				for (var j = 0; j < exercisesText[i].naloge.length; j++) {
					userUnlocksAndAchievements[i].sublevels.push(new Sublevel(j, 0));
				}
			}

			// odklene ustrezne podnivoje glede na podatke iz mysql queryjev
			for (var i = 0; i < x.length; i++) {
				var a = parseInt(x[i]["level_exercises"]) - 1;
				var b = parseInt(x[i]["sublevel_exercises"]) - 1;
				var c = parseInt(x[i]["max(tt_achievements.id_achievements)"]);
				userUnlocksAndAchievements[a].achievement = 1;
				userUnlocksAndAchievements[a].sublevels[b].achievement = c;
			}

			// izracunaj skupni dosezek stopnje na podlagi dosezkov podnivojev
			for (var i = 0; i < exercisesText.length; i++) {
				var sestevek = 0;
				for (var j = 0; j < exercisesText[i].naloge.length; j++) {
					sestevek += userUnlocksAndAchievements[i].sublevels[j].achievement;
				}
				userUnlocksAndAchievements[i].achievement = Math.ceil(sestevek / exercisesText[i].naloge.length);
			}

			setSelectedExerciseIndex(selectedExerciseIndex);
		}
		function getUserUnlocksAndAchievements() {
			return userUnlocksAndAchievements;
		}


		function addUserTextLetter(x) {
			userText += x;
		}
		function removeUserTextLetter() {
			userText = userText.slice(0, - 1);
		}
		function getUserText() {
			return userText;
		}


		function increaseSteps() {
			steps++;
		}
		function decreaseSteps() { // se bo lahko rabilo ce v app uvedemo BACKSPACE in bo uporabnik popravljal za nazaj
			steps--;
		}
		function getSteps() {
			return steps;
		}


		/* za racunanje % uspesnosti uporabnika */
		function povecajSteviloPravilnihPritiskov() {
			steviloPravilnihPritiskov++;
		}
		function povecajSteviloNapacnihPritiskov() {
			steviloNapacnihPritiskov++;
		}
		function getExerciseScore() {
			//console.log("Stevilo korakov:", steps, ". Od tega pritiskov pravilnih | napacnih:", steviloPravilnihPritiskov, "|", steviloNapacnihPritiskov, ".");
			return {
				steviloPravilnihPritiskov: steviloPravilnihPritiskov,
				steviloNapacnihPritiskov: steviloNapacnihPritiskov
			};
		}


		function setExerciseIdentifier(x) {
			exerciseIdentifier = x;
		}
		function getExerciseIdentifier() {
			return exerciseIdentifier;
		}

		function setSeansaIdentifier(x) {
			seansaIdentifier = x;
		}
		function getSeansaIdentifier() {
			return seansaIdentifier;
		}

		function getQuestions() {
			var x = [];
			for (var i in vprasanja) {
				x.push(vprasanja[i].questionsSet);
			}
			return x;
		}
		function setQuestions(x) {
			vprasanja = x;
		}

		function setConfigFile(x) {
			configFile = x;
		}
		function setXmlConfigFile(x) {
			console.log("In function setXmlConfigFile");
			xmlConfigFile = x;
			console.log(xmlConfigFile);
		}
		function getXmlConfigSessionEvent(x) {
			var a = xmlConfigFile.config.sessions.session[x] ? xmlConfigFile.config.sessions.session[x] : xmlConfigFile.config.sessions.session;
			if (a) {
				return a.events.event;
			}
		}
		function getXmlConfigSessionTrigger(x) {
			var a = xmlConfigFile.config.sessions.session[x] ? xmlConfigFile.config.sessions.session[x] : xmlConfigFile.config.sessions.session;
			if (a) {
				return a.triggers.trigger;
			}
		}
		function getXmlConfigAudioRecord() {
			var a = xmlConfigFile.config.interupts.audio.record;
			var b = {};

			if (a === undefined) {
				console.log("getXmlConfigAudioRecord() iz xml sheme dobil undefined");
				return b;
			}

			if (!a.length) { // ce samo en element, xml parser vrne objekt
				b[a._type] = a;
			} else { // ce vec elementov, xml parser vrne array
				for (let i = 0, length = a.length; i < length; i++) {
					b[a[i]._type] = a[i];
				}
			}
			return b;
		}
		function getXmlConfigVisualImage() {
			var a = xmlConfigFile.config.interupts.visual.image;
			var b = {};

			if (a === undefined) {
				console.log("getXmlConfigVisualImage() iz xml sheme dobil undefined");
				return b;
			}

			if (!a.length) { // ce samo en element, xml parser vrne objekt
				b[a._type] = a;
			} else { // ce vec elementov, xml parser vrne array
				for (let i = 0, length = a.length; i < length; i++) {
					b[a[i]._type] = a[i];
				}
			}
			return b;
		}
		function getXmlConfigSessionOtherData(x) {
			var a = xmlConfigFile.config.sessions.session[x] ? xmlConfigFile.config.sessions.session[x] : xmlConfigFile.config.sessions.session;
			return a;
		}

		function getXmlConfigUserTip() {
			if (xmlConfigFile.config["user-tip"]) {
				return xmlConfigFile.config["user-tip"];
			}
			return "ni navodil!";
		}

		function getXmlConfigEmoticon() {
			return xmlConfigFile.config["emoticon"] === 'true';
		}


		function getTimers() {
			return xmlConfigFile.config.timers;
		}

		function getSensors() {
			return xmlConfigFile.config.sensors;
		}

		function getExperimentSettings() {
			return configFile.experiment;
		}

		function getFileLocation() {
			return configFile.fileLocation;
		}

		function setSession(x) {

		}

		function getXmlConfigFileName() {
			console.log("In function getXmlConfigFileName:", xmlConfigFileName);
			return xmlConfigFileName;
		}

		function setXmlConfigFileName(x) {
			console.log("In function setXmlConfigFileName:", x);
			xmlConfigFileName = x;
		}


	}
})();
