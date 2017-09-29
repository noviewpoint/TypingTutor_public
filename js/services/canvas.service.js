(function() {
	"use strict";

	angular
		.module("typingTutor")
		.service("canvasService", canvasService);

	canvasService.$inject = ["$window", "sharedStatesService", "smejkoService", "flagsService", "okvirService", "movingLettersService"];

	/**
	 * @ngdoc service
	 * @name typingTutor.service:canvasService
	 * @description
	 * Service, ki nudi funkcije za risanje po canvasu.
	 * @requires $window
	 * @requires typingTutor.service:sharedStatesService
	 * @requires typingTutor.service:smejkoService
	 * @requires typingTutor.service:flagsService
	 * @requires typingTutor.service:okvirService
	 * @requires typingTutor.service:movingLettersService
	 */

	function canvasService($window, sharedStatesService, smejkoService, flagsService, okvirService, movingLettersService) {
		//console.log("In canvasService");
		var vm = this;

		var globalnaSirinaOkna = $window.innerWidth;
		var requestID;
		var	fps = 60;
		var canvas;
		var context;
		var pozicijaX;
		var pozicijaY;
		var stevecAnimacije = 0;
		var prostorCrke = 200; // rocno nastavljeno koliko prostora zavzema ena crka
		// var prostorCrke = 200 / 2;
		var lastAnimationTime = Date.now();

		/**
		 * @ngdoc method
		 * @name inicializirajCanvas
		 * @methodOf typingTutor.service:canvasService
		 * @example
		 * canvasService.inicializirajCanvas();
		 * @description
		 * Inicializira realni HTML5 Canvas element v katerega se bo risalo.
		 */

		function inicializirajCanvas() {
			console.log("In function inicializirajCanvas");

			// realni osrednji canvas
			canvas = document.getElementById("typingCanvas");
			context = canvas.getContext("2d");

			canvas.width = $window.innerWidth - 20; // varnostna meja 20px, da brskalnik ne prikaze horizontalnega scroll bara na desnem robu
			canvas.height = 350; // rocno nastavljena visina
			context.font = "normal 20em Lucida Console"; // default font

			pozicijaX = (canvas.width - prostorCrke) / 2; // zacetna pozicija crk po x, zacne na polovici horizontale
			pozicijaY = canvas.height - (canvas.height - prostorCrke) / 2; // zacetna pozicija crk po y, zacne na polovici vertikale

			movingLettersService.updateSize($window.innerWidth +  prostorCrke, canvas.height);
			movingLettersService.updateFont();

			if (sharedStatesService.getXmlConfigEmoticon()) {
				smejkoService.createNeutralSmejko();
			}

			// angular ali native js resize eventi prevec komplicirajo
			$(window).bind("resize", function() { // jquery
				console.log("In event listener for resize");
				// resiza se samo ob horizontalnih spremembah
				if (globalnaSirinaOkna != $window.innerWidth) {
					console.log("In event listener for horizontal resize");
					globalnaSirinaOkna = $window.innerWidth;
					risiCanvasResize();
				}
			});

		}

		// za animacijo canvasa
		$window.requestAnimFrame = (function() {
			return $window.requestAnimationFrame ||
			$window.webkitRequestAnimationFrame ||
			$window.mozRequestAnimationFrame ||
			$window.oRequestAnimationFrame ||
			$window.msRequestAnimationFrame;
		})();

		return {
			risiCrke: risiCrke,
			inicializirajCanvas: inicializirajCanvas
		};

		/**
		 * @ngdoc method
		 * @name showFPS
		 * @methodOf typingTutor.service:canvasService
		 * @example
		 * canvasService.showFPS();
		 * @description
		 * Pokaze hitrost renderiranja v frames per second.
		 */
		function showFPS() {
			context.fillStyle = "Black";
			context.font = "normal 2em Arial";
			fps = Math.round(fps);
			context.fillText(fps + " fps", 50, 20);
			context.font = "normal 20em Lucida Console"; // postavi font na default
		}

		/**
		 * @ngdoc method
		 * @name risiCanvasResize
		 * @methodOf typingTutor.service:canvasService
		 * @example
		 * canvasService.risiCanvasResize();
		 * @description
		 * Izrise Canvas na novo ob resizu okna brskalnika.
		 */
		function risiCanvasResize() {
			canvas.width  = $window.innerWidth - 20; // varnostna meja 20px, da brskalnik ne prikaze horizontalnega scroll bara na desnem robu
			pozicijaX = (canvas.width - prostorCrke) / 2;

			movingLettersService.updateSize($window.innerWidth + prostorCrke);

			// font se drugace ob resizu resetira, zato ga je treba se enkrat postaviti na default
			context.font = "normal 20em Lucida Console";
			movingLettersService.updateFont();

			risiCrke();
		}

		/**
		 * @ngdoc method
		 * @name risiCrke
		 * @methodOf typingTutor.service:canvasService
		 * @example
		 * canvasService.risiCrke();
		 * @description
		 * Narise premikajoce crke na ekran.
		 */
		function risiCrke() {

			requestID = requestAnimFrame(risiCrke);

			// v 5 korakih izdela animacijo (neodvisno od framerata)
			if (stevecAnimacije <= 0.9) {

				stevecAnimacije += 0.2;
				// brisi povrsino realnega canvasa
				context.clearRect(0, 0, canvas.width, canvas.height);

				// chrome vs firefox font width, uporabljamo monospaced font
				var velikostCrke = context.measureText(" ").width;

				var delta = (Date.now() - lastAnimationTime) / 1000;
				lastAnimationTime = Date.now();
				fps = 1 / delta;

				var crkice = movingLettersService.risiCrke(pozicijaX, pozicijaY, prostorCrke, velikostCrke);
				context.drawImage(crkice, -prostorCrke*stevecAnimacije, 0);

				var okvircek = okvirService.risiOkvir();
				context.drawImage(okvircek, pozicijaX - 25, pozicijaY - 215 - 25);
				// context.drawImage(okvircek, pozicijaX - 47, pozicijaY - 123);

				//showFPS();

			} else {

				flagsService.setOkvir(false);
				flagsService.setCrke(false);
				stevecAnimacije = 0;
				cancelAnimationFrame(requestID);

			}
		}

		/**
		 * @ngdoc method
		 * @name prekiniPrejsnjeAnimacije
		 * @methodOf typingTutor.service:canvasService
		 * @example
		 * canvasService.prekiniPrejsnjeAnimacije();
		 */
		function prekiniPrejsnjeAnimacije() {
			stevecAnimacije = 0;
			console.log("Konec animacije prek namenske funkcije", requestID);
			cancelAnimationFrame(requestID);
		}

		function rgbOzadje(r, g, b) {
			this.r = r;
			this.g = g;
			this.b = b;
		}

		function hslOzadje(h, s, l) {
			this.h = h;
			this.s = s;
			this.l = l;
		}
	}

})();
