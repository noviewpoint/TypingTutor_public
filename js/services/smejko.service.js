(function() {
	"use strict";

	angular
		.module("typingTutor")
		.service("smejkoService", smejkoService);

	smejkoService.$inject = [];

	/**
	 * @ngdoc service
	 * @name typingTutor.service:smejkoService
	 * @description
	 * smejkoService
	 * @requires $window
	 * @requires typingTutor.service:flagsService
	 * @requires typingTutor.service:measurementsService
	 * @requires typingTutor.service:sharedStatesService
	 * @requires typingTutor.service:okvirService
	 */

	function smejkoService() {
		//console.log("In smejkoService");

		var canvas;
		var context;
		var imageRootDirectory = "img/emotion set";

		var images = [];

		for (var i = 0; i < 8; i++) {
			images[i] = new Image();
			images[i].src = imageRootDirectory + "/smiley" + (i + 1) + ".svg";
			console.log(images[i].src);
		}

		return {
			updateSmejko: updateSmejko,
			createNeutralSmejko: createNeutralSmejko
		};

		/**
		 * @ngdoc method
		 * @name updateMouth
		 * @methodOf typingTutor.service:smejkoService
		 * @example
		 * smejkoService.updateMouth(x);
		 * @param {Number} x stevilo med 100 in 300, za 200 stopenj nasmeha/zalosti
		 */
		function updateMouth(x) {
			// console.log("In function updateMouth", x);
			x = 300 - x;
			if(x < 100) {
				x = 100;
			}

			// draw the mouth
			context.beginPath();
			context.moveTo(150 - 75, 150 + 25);
			context.quadraticCurveTo(150, x, 150 + 75, 150 + 25);
			context.stroke();
		}

		function drawFace() {
			// console.log("In function drawFace");
			var centerX = canvas.width/2;
			var centerY = canvas.height/2;
			var radius = canvas.width/2 - 5;
			var eyeRadius = 20;
			var eyeXOffset = 55;

			var centerX = canvas.width/2;
			var centerY = canvas.height/2;
			var radius = canvas.width/2 - 5;
			var eyeRadius = 20;
			var eyeXOffset = 55;

			// draw the yellow circle
			context.beginPath();
			context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);

			var grd = context.createRadialGradient(centerX,centerY,radius, 5, 5, 5);
			grd.addColorStop(0, "#D4EB57");
			grd.addColorStop(1, "white");

			context.fillStyle = grd;

			context.fill();
			context.lineWidth = 3;
			context.strokeStyle = "black";
			context.stroke();

			// draw the eyes
			context.beginPath();
			var eyeX = centerX - eyeXOffset;
			var eyeY = centerY - eyeXOffset;
			context.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI, false);
			var eyeX = centerX + eyeXOffset;
			context.arc(eyeX, eyeY, eyeRadius, 0, 2 * Math.PI, false);
			context.fillStyle = "black";
			context.fill();

			context.beginPath();
			var eyeX = centerX - eyeXOffset;
			var eyeY = centerY - eyeXOffset;
			context.arc(eyeX, eyeY, eyeRadius-2, 0, 2 * Math.PI, false);
			var eyeX = centerX + eyeXOffset;
			context.arc(eyeX, eyeY, eyeRadius-2, 0, 2 * Math.PI, false);
			context.fillStyle = "white";
			context.fill();

			context.beginPath();
			var eyeX = centerX - eyeXOffset;
			var eyeY = centerY - eyeXOffset;
			context.arc(eyeX+2, eyeY+3, eyeRadius-12, 0, 2 * Math.PI, false);
			var eyeX = centerX + eyeXOffset;
			context.arc(eyeX-2, eyeY+3, eyeRadius-12, 0, 2 * Math.PI, false);
			context.fillStyle = "black";
			context.fill();
		}

		function createNeutralSmejko() {
			console.log("In function createNeutralSmejko");
			canvas = document.getElementById("smejkoCanvas");
			context = canvas.getContext("2d");

			// old stuff here:
			// drawFace();
			// updateMouth(125);

			// privzeto smiley1 s 100ms zamika (drugace se ne narise - ???)
			setTimeout(function() {
				console.log("Drawing neutral smiley");
				context.drawImage(images[0], 0, 0, canvas.width, canvas.height);
			}, 100);
		}

		function updateSmejko(x) {
			console.log("In function updateSmejko", x);

			// old stuff here:
			// drawFace();
			// updateMouth(x);

			// glede na x input izberi pravilen smiley
			var i = 0;
			if (x > 3 && x <= 5) {
				i = 1;
			} else if (x > 5 && x <= 8) {
				i = 2;
			} else if (x > 8 && x <= 20) {
				i = 3;
			} else if (x > 20 && x <= 200) {
				i = 4;
			} else if (x > 200 && x <= 400) {
				i = 5;
			} else if (x > 400 && x <= 600) {
				i = 6;
			} else if (x > 600) {
				i = 7;
			}

			console.log("Drawing smiley n.", i);
			context.drawImage(images[i], 0, 0, canvas.width, canvas.height);
		}

	}

})();
