(function() {
	"use strict";

	angular
		.module("typingTutor")
		.service("imagesAndDivsService", imagesAndDivsService);

	imagesAndDivsService.$inject = ["pravilnoTipkanjeService", "audioService", "sharedStatesService"];

	/**
	 * @ngdoc service
	 * @name typingTutor.service:imagesAndDivsService
	 * @description
	 * Service, ki nudi funkcije za risanje s HTML elementi.
	 * @requires typingTutor.service:pravilnoTipkanjeService
	 * @requires typingTutor.service:audioService
	 */

	function imagesAndDivsService(pravilnoTipkanjeService, audioService, sharedStatesService) {
		//console.log("In imagesAndDivsService");
		var vm = this;
		var motnja = false;

		vm.barvaOzadja = "";
		vm.barvaOzadjaHue = 36;
		vm.barvaOzadjaLightness = 50;

		var ozadje;
		var roke;

		var imageInterupt = sharedStatesService.getXmlConfigVisualImage();
		console.log("imageInterupt:", imageInterupt);

		return {
			showFingers: showFingers,
			updateProgress: updateProgress,
			spremeniBarvoOzadja: spremeniBarvoOzadja,

			izvediMotnjo: izvediMotnjo,
			stanjeMotnje: stanjeMotnje,

			inicializirajHtmlElemente: inicializirajHtmlElemente,
			izvediMotnjo_trigger: izvediMotnjo_trigger
		};

		/**
		 * @ngdoc method
		 * @name showFingers
		 * @methodOf typingTutor.service:imagesAndDivsService
		 * @example
		 * imagesAndDivsService.showFingers(crka);
		 * @param {String} crka katera crka
		 */
		function showFingers(crka) {
			if (crka) {
				roke.src = "img/slike_prstov/" + pravilnoTipkanjeService.dobiPravilnoKombinacijoRok(crka) + ".svg";
			}
		}

		/**
		 * @ngdoc method
		 * @name updateProgress
		 * @methodOf typingTutor.service:imagesAndDivsService
		 * @example
		 * imagesAndDivsService.updateProgress(value);
		 * @param {Number} value stevilo pikslov
		 */
		function updateProgress(value) {
			// var progressBar =
			document.getElementById("progress-bar-moving").style.width = "" + value + "%";
		}

		/**
		 * @ngdoc method
		 * @name spremeniBarvoOzadja
		 * @methodOf typingTutor.service:imagesAndDivsService
		 * @example
		 * imagesAndDivsService.spremeniBarvoOzadja(x);
		 * @param {Boolean} x pove ali naj funkcija svetli oz. temni ozadje
		 */
		function spremeniBarvoOzadja(x) {
			//console.log("In function spremeniBarvoOzadja");
			if (x) {
				if (vm.barvaOzadjaLightness < 50) {
					vm.barvaOzadjaLightness++;
				}
				vm.barvaOzadjaHue++;
			} else {
				if (vm.barvaOzadjaLightness > 0) {
					vm.barvaOzadjaLightness--;
				}
			}
		    vm.barvaOzadja = "hsl(" + vm.barvaOzadjaHue + ", 96%, " + vm.barvaOzadjaLightness + "%)";
		    ozadje.background = "linear-gradient(to right, " + vm.barvaOzadja + ", white, " + vm.barvaOzadja + ")";

			//document.body.style.background = "url(img/tekstura.jpg) no-repeat center center fixed, linear-gradient(to right, hsla(190, 50%, 45%, 1), white, hsla(170, 50%, 45%, 1))";
			// var barvaTemp = barvniProstori.hslToRgb(trenutnoOzadjeHSL.h, trenutnoOzadjeHSL.s, trenutnoOzadjeHSL.l);
			// document.body.style.background = "linear-gradient(to right, rgb(" + barvaTemp[0] + ", " + barvaTemp[1] + ", " + barvaTemp[2] + "), white, rgb(" + barvaTemp[0] + ", " + barvaTemp[1] + ", " + barvaTemp[2] + "))";
			/* document.body.style.background = "url(img/tekstura.jpg) no-repeat center center fixed, linear-gradient(to right, rgb(" + barvaTemp[0] + ", " + barvaTemp[1] + ", " + barvaTemp[2] + "), white, rgb(" + barvaTemp[0] + ", " + barvaTemp[1] + ", " + barvaTemp[2] + "))"; */
		}

		function izvediMotnjo(casMotnje) {
			console.log("Začenjam z morebitno slikovno motnjo");
			motnja = true;

			setTimeout(function() {
				console.log("Končujem z morebitno slikovno motnjo");
				motnja = false;
			}, casMotnje);

			//document.body.style.background = "blue";
			/*
			var para = document.createElement("p");
			var node = document.createTextNode("This is a new paragraph.");
			para.appendChild(node);
			var element = document.getElementById("belowTypingCanvas");
			element.appendChild(para);
			 */
		}

		function izvediMotnjo_trigger(casMotnje, index) {
			console.log("izvediMotnjo_trigger();");
			if (imageInterupt.hasOwnProperty(index)) {
				var slika = imageInterupt[index]._path;
			} else {
				console.log("Indeks slike ni najden!");
				return;
			}

			var x = document.createElement("img");
		    x.setAttribute("src", slika);
		    x.setAttribute("width", "250");
		    x.setAttribute("width", "250");


		    x.style.position = "absolute";
		    x.style.left = "10%";
		    //x.setAttribute("z-index", "5");

		    var element = document.getElementById("belowTypingCanvas");
			element.insertBefore(x, element.firstChild);


			setTimeout(function() {
				console.log("Končujem z izvediMotnjo_trigger();");
				element.removeChild(element.firstChild);
			}, casMotnje);
			//<img style="position: absolute; left: 10%; z-index: 5;" ng-src="img/Shapes_V1.png" ng-show="TipkanjeCtrl.motnja;" />
		}

		function stanjeMotnje() {
			return motnja;
		}

		function inicializirajHtmlElemente() {
			ozadje = document.body.style;
			roke = document.getElementById("tipkarskeRoke");
		}

	}

})();
