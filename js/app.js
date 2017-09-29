(function() {
	"use strict";

	/**
	 * @ngdoc object
	 * @name typingTutor
	 * @description Socially Aware Application (SAA) Typing Tutor.
	 */
	angular
		.module("typingTutor", ["ui.router", "ui.bootstrap", "pascalprecht.translate", "ngAnimate", "ngCookies"])
		.config(config, "config")
		.run(run, "run");

	config.$inject = ["$urlRouterProvider", "$stateProvider", "$translateProvider", "$compileProvider", "$locationProvider"];

	// ob pravem refreshu strani bo to vedno default parameter!
	var privzetXmlParameter = "expConf_v01.xml"; // delita si ga 'run' in 'config' funkciji

	function config($urlRouterProvider, $stateProvider, $translateProvider, $compileProvider, $locationProvider) {
		// https://docs.angularjs.org/guide/production
		$compileProvider.debugInfoEnabled(false);
		//$compileProvider.commentDirectivesEnabled(false);
		//$compileProvider.cssClassDirectivesEnabled(false);

		$locationProvider.hashPrefix("");
		$locationProvider.html5Mode.enabled;

		var referencaTrenutniModal;

		var translationsEN = {
			HEADLINE: 'What an awesome module!',
			PARAGRAPH: 'Srsly!',
			PASSED_AS_TEXT: 'Hey there! I\'m passed as text value!',
			PASSED_AS_ATTRIBUTE: 'I\'m passed as attribute value, cool ha?',
			PASSED_AS_INTERPOLATION: 'Beginners! I\'m interpolated!',
			VARIABLE_REPLACEMENT: 'Hi {{name}}',
			MISSING_TRANSLATION: 'Oops! I have not been translated into German...',
			BUTTON_LANG_DE: 'German',
			BUTTON_LANG_EN: 'English'
		};

		var translationsDE= {
			HEADLINE: 'Was für ein großartiges Modul!',
			PARAGRAPH: 'Ernsthaft!',
			PASSED_AS_TEXT: 'Hey! Ich wurde als text übergeben!',
			PASSED_AS_ATTRIBUTE: 'Ich wurde als Attribut übergeben, cool oder?',
			PASSED_AS_INTERPOLATION: 'Anfänger! Ich bin interpoliert!',
			VARIABLE_REPLACEMENT: 'Hi {{name}}',
			// MISSING_TRANSLATION is ... missing :)
			BUTTON_LANG_DE: 'Deutsch',
			BUTTON_LANG_EN: 'Englisch'
		};

		$translateProvider.translations('en', translationsEN);
		$translateProvider.translations('de', translationsDE);
		$translateProvider.preferredLanguage('en');
		$translateProvider.fallbackLanguage('en');
		// Enable escaping of HTML
		$translateProvider.useSanitizeValueStrategy('escape');
		//$translateProvider.useCookieStorage();

		// For any unmatched url, redirect
		$urlRouterProvider
			.otherwise("/menu/" + privzetXmlParameter);


		$stateProvider
			.state("menu", {
				url: "/menu/{xmlFile}/{seansa}/{go}",
				params: {
					xmlFile: {
						squash: false,
						value: function($location) { // se izvede ce je stanje klicano brez parametra,
							console.log("Berem parameter: '" + privzetXmlParameter + "'");
							$location.path("/menu/" + privzetXmlParameter);
							return privzetXmlParameter;
						}
					},
					seansa: {
						squash: true,
						value: undefined
					},
					go: {
						squash: true,
						value: undefined
						// With JavaScript, null is for objects, undefined is for variables, properties, and methods.
					}
				},
				templateUrl: "partials/menu.html",
				controller: "MenuController",
				controllerAs: "MenuCtrl",
				// cache: false
				resolve: {
					queryParameters: function($stateParams) {
						if ($stateParams.xmlFile !== "") {
							console.log("Nastavljam parameter: '" + $stateParams.xmlFile + "'");
							privzetXmlParameter = $stateParams.xmlFile;
						}
						return true;
					},
					vprasanja: function(asynchronousCallsService, sharedStatesService) {
						return asynchronousCallsService.requestQuestions()
							.then(function(response) {
								sharedStatesService.setQuestions(response.data);
							}, function(errResponse) {
								console.log("Error", errResponse);
							});
					},

					besedilaNalog: function(asynchronousCallsService, sharedStatesService) {
						return asynchronousCallsService.requestExercisesText()
							.then(function(response) {
								sharedStatesService.setExercisesText(response.data);
								return asynchronousCallsService.requestUserUnlocksAndAchievements();
							}, function(errResponse) {
								console.log("Error", errResponse);
							})
							.then(function(response) {
								sharedStatesService.setUserUnlocksAndAchievements(response.data);
							}, function(errResponse) {
								console.log("Error", errResponse);
							});
					},

					besediloPretipkavanja: function(asynchronousCallsService, sharedStatesService) {
						return asynchronousCallsService.requestPretipkavanjeText()
							.then(function(response) {
								//console.log("Successfully resolved pretipkavanje.json", response.data);
								sharedStatesService.setPretipkavanjeText(response.data);
							}, function(errResponse) {
								console.log("Error", errResponse);
							});
					},

					avtentikacija: function(asynchronousCallsService, sharedStatesService) {
						return asynchronousCallsService.requestAuthentication()
							.then(function(response) {
								sharedStatesService.setUsername(response.data);
							}, function(errResponse) {
								console.log("Error", errResponse);
							});
					},
					/*konfiguracija: function(asynchronousCallsService, sharedStatesService) {
						return asynchronousCallsService.requestConfigFile()
							.then(function(response) {
								sharedStatesService.setConfigFile(response.data);
							}, function(errResponse) {
								console.log("Error", errResponse);
							});
					},*/

					xmlKonfiguracija: function(asynchronousCallsService, sharedStatesService, $stateParams, $location) {
						console.log("V xmlKonfiguracija");
						var prefix = "xml config/";
						var x = prefix + $stateParams.xmlFile;
						return asynchronousCallsService.requestXmlConfigFile(x)
							.then(function(response) {
								console.log("Xml config found in: '" + x + "'");
								var x2js = new X2JS();


								var jsonObjekt = x2js.xml_str2json(response.data);

								if (jsonObjekt === null) {
									alert("NAPAKA PRI PARSANJU XML DATOTEKE");
								}

								sharedStatesService.setXmlConfigFile(jsonObjekt);
								sharedStatesService.setXmlConfigFileName(x);
							}, function(errResponse) {
								console.log("Error", errResponse);
								$location.path("/expConf_v01.xml");
								$stateParams.xmlFile = "expConf_v01.xml";
								alert("ŽELJENA XML DATOTEKA NE OBSTAJA V DIREKTORIJU APLIKACIJE, NALOŽENA PRIVZETA XML DATOTEKA");
							});
					},
					postaviPodatkeNaNulo: function(asynchronousCallsService) {
						asynchronousCallsService.requestSetKeyboardDataSizeToZero();
						asynchronousCallsService.requestSetNoldusFaceReaderDataSizeToZero();
						asynchronousCallsService.requestSetTobiiEyeTrackerDataSizeToZero();
						asynchronousCallsService.requestSetAndroidWear_M360DataSizeToZero();
						asynchronousCallsService.requestSetArduino_MPU6050DataSizeToZero();
						asynchronousCallsService.requestSetMultiluxAccelDataSizeToZero();
						asynchronousCallsService.requestSetMultiluxGSRDataSizeToZero();
						return true;
					}

				},
				onEnter: function(automaticSwitchingService) {
					console.log("onEnter menu state");
					automaticSwitchingService.endExperiment();
				}
			})
			.state("menu.modalNedovoljenje", {
				// namerno brez url-ja
				onEnter: function($state, $uibModal) {
					$uibModal.open({
						templateUrl: "partials/modal_menu_nedovoljenje.html",
						controller: "MenuModalController",
						controllerAs: "MenuModalNedovoljenjeCtrl",
						size: "lg",
						animation: true
					}).result.finally(function() { // nato pojdi nazaj v parent state
						$state.go('^');
					});
					// cache: false
				}
			})
			.state("profile", {
				url: "/profile",
				templateUrl: "partials/profile.html",
				controller: "ProfileController",
				controllerAs: "ProfileCtrl"
				// cache: false
			})
			.state("profile.senzorji", {
				url: "/senzorji",
				templateUrl: "partials/senzorji.html",
				controller: "ProfileController",
				controllerAs: "ProfileCtrl"
				// cache: false
			})
			.state("profile.administracija", {
				url: "/administracija",
				templateUrl: "partials/administracija.html",
				controller: "ProfileController",
				controllerAs: "ProfileCtrl"
				// cache: false
			})
			.state("pretipkavanje", {
				url: "/pretipkavanje",
				templateUrl: "partials/pretipkavanje.html",
				controller: "PretipkavanjeController",
				controllerAs: "PretipkavanjeCtrl"
				// cache: false
			})
			.state("tipkanje", {
				url: "/tipkanje",
				templateUrl: "partials/tipkanje.html",
				controller: "ExerciseController",
				controllerAs: "TipkanjeCtrl"
				// cache: false
			})
			.state("tipkanje.questions", {
				// namerno brez url-ja
				onEnter: function($state, $uibModal) {
					referencaTrenutniModal = $uibModal.open({
						templateUrl: "partials/modal_questions.html",
						controller: "ExerciseModalQuestionsController",
						controllerAs: "MQuestionsCtrl",
						size: "lg",
						animation: true
					});

					referencaTrenutniModal
						.result.finally(function() { // nato pojdi nazaj v parent state
							$state.go('^');
						});
				},
				onExit: function() {
					//$uibModalStack wont work
					referencaTrenutniModal.close();
				}
				// cache: false
			})
			.state("tipkanje.navodila", {
				// namerno brez url-ja
				onEnter: function($state, $uibModal) {
					console.log("onEnter tipkanje.navodila");
					referencaTrenutniModal = $uibModal.open({
						templateUrl: "partials/modal_navodila.html",
						controller: "NavodilaController",
						controllerAs: "NavodilaCtrl",
						windowClass: 'velik',
						animation: true
					});

					/* referencaTrenutniModal
						.result.then(function() {
						console.log("A");
						//$state.go("tipkanje");
					}, function() {
						console.log("B");
						//$state.go("menu");
					}); */

					/*

					modalInstance
						.result.finally(function() { // nato pojdi nazaj v parent state
							$state.go('^');
						});

					 */

					referencaTrenutniModal
						.result.finally(function() { // ob pritisku neke tipke pojdi nazaj v parent state
							$state.go('^');
						});

				},
				onExit: function() { // ob pritisku na BACK od brskalnika
					//$uibModalStack wont work
					referencaTrenutniModal.close();
				}
				// cache: false
			})
			.state("statistika", {
				// namerno brez url-ja
				templateUrl: "partials/statistika.html",
				controller: "StatistikaController",
				controllerAs: "StatistikaCtrl"
				// cache: false
			})
			.state("tipkanje.debug", {
				url: "/debug",
				templateUrl: "partials/debug.html",
				controller: "DebugController",
				controllerAs: "DebugCtrl",
				onEnter: function($state) {
					console.log("onEnter tipkanje.debug");
				},
				onExit: function() {
					console.log("onExit tipkanje.debug");
				}
				// cache: false
			})
	}

	run.$inject = ["$location", "$rootScope"];

	function run($location, $rootScope) {
		console.log("In function run");

		var pattern = /\/menu\//i;
		var match = pattern.exec($location.path());
		if (match === null) { // preveri, ce je uporabnik refreshal stran v stanju 'menu'
			console.log("Page refreshed on invalid state. Redirecting to default state.");
			$location.path("/menu/" + privzetXmlParameter);
		}

		$rootScope.$on('$stateChangeStart',
			function(event, toState, toParams, fromState, fromParams) {
				//console.log("Application has switched from state", fromState, "to state", toState, "from parameters", fromParams, "to parameters", toParams);
				console.log("PREHOD STANJ:", fromState.name, "-->", toState.name);

				if ($location.path() === "/menu/") {
					console.log("Prenastavljam url iz /menu/");
					$location.url("/" + toParams.xmlFile);
				}
		});
		/*$rootScope.$on('$stateChangeSuccess',
			function(event, toState, toParams, fromState, fromParams) {
				//restore all query string parameters back to $location.search
		});*/
	}
})();
