(function() {
	"use strict";

	angular
		.module("typingTutor")
		.service("colorBarsService", colorBarsService);

	colorBarsService.$inject = ["measurementsService"];


	function colorBarsService(measurementsService) {
		//console.log("In colorBarsService");
		var vm = this;

		var noldus;
		var tobii;
		var wear;

		function getLastValues() {
			noldus = measurementsService.getHistoryNoldusFaceReader();
			tobii = measurementsService.getHistoryTobiiEyeTracker();
			wear = measurementsService.getHistoryAndroidWear_M360();

			noldus = noldus[noldus.length - 1];
			tobii = tobii[tobii.length - 1];
			wear = wear[wear.length - 1];

			noldus = noldus[noldus.length - 1];
			tobii = tobii[tobii.length - 1];
			wear = wear[wear.length - 1];

			console.log("getLastValues", noldus, tobii, wear)
		}

		return {
			update: update
		};

		function update() {
			//getLastValues();
			if (document.getElementById("colorBars")) {
				//console.log("Randomly creating indicators on color bars.");
				document.getElementById("indicatorPupil").style.top = (Math.floor(Math.random() * 70) + 10) + "%";
				document.getElementById("indicatorArousal").style.top = (Math.floor(Math.random() * 70) + 10) + "%";
				document.getElementById("indicatorValence").style.top = (Math.floor(Math.random() * 70) + 10) + "%";



				//console.log("update - prikazujem vrednosti");

				//tobii.rightPupilDiameter = tobii.rightPupilDiameter.replace(/\,/g, ".");
				//tobii.leftPupilDiameter = tobii.leftPupilDiameter.replace(/\,/g, ".");
				//var pupilDiameter = (parseFloat(tobii.rightPupilDiameter) + parseFloat(tobii.leftPupilDiameter)) / 2;

				//console.log("update Tobii", pupilDiameter);
				//console.log("update Tobii", tobii.rightPupilDiameter);
				//console.log("update Tobii", tobii.leftPupilDiameter);
				//console.log("update Noldus Arousal", noldus.Arousal);
				//console.log("update Noldus Valence", noldus.Valence);

			} else {
				//console.log("Bars not available.");
			}
		}

		function xxx() {
			var procentaza = 0;
			// desna pupil + leve pupil ce obe -1 tudi povprecje -1 :)
			if (pupilDiameter != -1) { // samo ce lovi sliko posodobi color bar, drugace pusti gor staro vrednost OZ.
				// brisi sliko???
				procentaza = procentaza;
			}

			// scope watch v controllerju




		}
	}
})();
