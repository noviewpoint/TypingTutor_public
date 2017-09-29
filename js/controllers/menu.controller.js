(function() {
	"use strict";

	angular
		.module("typingTutor")
		.controller("MenuController", MenuController);

	MenuController.$inject = ["$rootScope", "$scope", "$uibModal", "$state", "sharedStatesService", "asynchronousCallsService", "audioService", "$translate", "automaticSwitchingService", "$stateParams"];

	/**
	 * @ngdoc controller
	 * @name typingTutor.controller:MenuController
	 * @description
	 * Controller, ki kontrolira pogled <i>menu.html</i>
	 * <pre>
	 * http://nacomnet.lucami.org/expApp/typingTutor/#/
	 * </pre>
	 * Dostop do tega pogleda je mogoc prek brskalnikove naslovne vrstice in prek brskalnikovih BACK/FORWARD gumbov.
	 * @requires $scope
	 * @requires $uibModal
	 * @requires $state
	 * @requires typingTutor.service:sharedStatesService
	 * @requires typingTutor.service:asynchronousCallsService
	 * @requires typingTutor.service:audioService
	 */

	function MenuController($rootScope, $scope, $uibModal, $state, sharedStatesService, asynchronousCallsService, audioService, $translate, automaticSwitchingService, $stateParams) {
		//console.log("In MenuController");
		var vm = this;

		if ($stateParams.go === "automatic") {
			automaticSwitchingService.runControlledExperiment();
		}

		if ($stateParams.seansa) {
			console.log("Seansa:", $stateParams.seansa);
			sharedStatesService.setSeansaIdentifier($stateParams.seansa);

		} else {
			sharedStatesService.setSeansaIdentifier("");
			console.log("Seansa ni nastavljena");
		}


		// na zacetku vedno postavi na OFF
		// automaticSwitchingService.endExperiment();

		// default vrednost session indexa
		vm.experimentIndex = 1;
		vm.setSession = sharedStatesService.setSession;

		vm.isCollapsed = true;
		vm.collapsedAnimation = "ng-show-add animated zoomInUp";

		//"pull" funkcionalnost
		var mouseDown = false;
		vm.setSelectedExerciseIndexMouseEnter = setSelectedExerciseIndexMouseEnter;
		vm.enableMouseDown = enableMouseDown;
		vm.disableMouseDown = disableMouseDown;
		vm.mouseleave = mouseLeave;


		vm.changeCollapse = changeCollapse;
		vm.playSoundBeginExperiment = audioService.playSoundBeginExperiment;


		vm.getSelectedExerciseIndex = sharedStatesService.getSelectedExerciseIndex;
		vm.getSelectedSubExerciseIndex = sharedStatesService.getSelectedSubExerciseIndex;

		vm.setSelectedExerciseIndex = sharedStatesService.setSelectedExerciseIndex;
		vm.setSelectedSubExerciseIndex = sharedStatesService.setSelectedSubExerciseIndex;

		vm.toogleSound = audioService.toogleSound;
		vm.isSoundTurnedOn = audioService.isSoundTurnedOn;

		vm.runControlledExperiment = automaticSwitchingService.runControlledExperiment;


		vm.changeStateToTyping = changeStateToTyping;


		vm.getInstructions = sharedStatesService.getInstructions;
		vm.getUserUnlocksAndAchievements = sharedStatesService.getUserUnlocksAndAchievements;


		vm.getUsername = sharedStatesService.getUsername;
		vm.runPretipkavanje = runPretipkavanje;






		// console.log("Verzija translata", $translate.versionInfo());

		// angular-translate only $emit's on $rootScope level because of performance reasons
		$rootScope.$on("$translateChangeSuccess", function() {
			$translate("HEADLINE").then(function(translation) {
				$scope.headline = translation;
			});
		});

		$scope.changeLanguage = function (langKey) {
		    $translate.use(langKey);
		  };








		/**
		 * @ngdoc method
		 * @name changeStateToTyping
		 * @methodOf typingTutor.controller:MenuController
		 * @example
		 * MenuCtrl.changeStateToTyping();
		 */
		function changeStateToTyping() {
			var a = sharedStatesService.getSelectedExerciseIndex();
			var b = sharedStatesService.getSelectedSubExerciseIndex();
			if (sharedStatesService.getUserUnlocksAndAchievements()[a].sublevels[b].achievement > 0) {
				$state.go("tipkanje");
			} else {
				$state.go("menu.modalNedovoljenje");
			}
		}

		function changeCollapse() {
			vm.isCollapsed = !vm.isCollapsed;

			if (vm.isCollapsed === true) {
				vm.collapsedAnimation = "ng-show-add animated zoomInUp";
			} else {
				vm.collapsedAnimation = "ng-hide-add animated zoomOutDown";
			}
		}



		// ng-mousedown="MenuCtrl.enableMouseDown();" ng-mouseenter="MenuCtrl.setSelectedExerciseIndexMouseEnter(x.id, $event);"
		//  ng-click="MenuCtrl.setSelectedExerciseIndex(x.id);" ng-mouseup="MenuCtrl.setSelectedExerciseIndex(x.id); MenuCtrl.disableMouseDown();"
		//   ng-mouseleave="MenuCtrl.mouseleave();"

		function enableMouseDown() {
			console.log("mousedown enabled");
			//mouseDown = true;
		}

		function disableMouseDown() {
			console.log("mousedown disabled");
			//mouseDown = false;
		}

		function setSelectedExerciseIndexMouseEnter(x, $event) {
			if (mouseDown) {
				console.log("X ->",$event.originalEvent.pageX,"Y ->",$event.originalEvent.pageY);
				console.log("settal exercise index iz posebne");
				//sharedStatesService.setSelectedExerciseIndex(x);
			}
		}

		function mouseLeave() {
			console.log("LEAVE!");
			//mouseDown = false;
		}

		function runPretipkavanje() {
			$state.go("pretipkavanje");
		}
	}

})();
