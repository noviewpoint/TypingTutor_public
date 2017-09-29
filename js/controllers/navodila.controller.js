(function() {
	"use strict";

	angular
		.module("typingTutor")
		.controller("NavodilaController", NavodilaController);

	NavodilaController.$inject = ["flagsService", "$document", "$uibModalInstance", "$timeout", "sharedStatesService", "$sce"];

	/**
	 * @ngdoc controller
	 * @name typingTutor.controller:NavodilaController
	 */
	function NavodilaController (flagsService, $document, $uibModalInstance, $timeout, sharedStatesService, $sce) {
		//console.log("In NavodilaController");
		var vm = this;

		flagsService.disableTyping();

		//http://stackoverflow.com/questions/20045150/how-to-set-an-iframe-src-attribute-from-a-variable-in-angularjs
		vm.ytLink = $sce.trustAsResourceUrl(sharedStatesService.getXmlConfigUserTip());

		$document.on("keydown.navodila", function(e) {
			//setTimeout(flagsService.enableTyping, 500);
			//if you don't want a digest to run, you can simply pass false as the third argument.
			$document.unbind("keydown.navodila");
			$timeout(flagsService.enableTyping, 300, false);
			$uibModalInstance.close();
		});
	}

})();
