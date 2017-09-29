(function() {
	"use strict";

	angular
		.module("typingTutor")
		.directive("hoverMakesFontRed", hoverMakesFontRed);

		function hoverMakesFontRed() {
			//console.log("In directive hoverMakesFontRed");
			var povezi = povezi;

			return {
				restrict: "A",
				link: povezi
			};

			function povezi(scope, element, attributes) {

				// javascript way
				$(element).on("mouseenter", function() {
					$(element).css({
						"color": "red",
						"font-weight": "bold"
					});
				});
				$(element).on("mouseleave", function() {
					$(element).css({
						"color": "",
						"font-weight": ""
					});
				});


				// css way (changed with javascript) - ne dela glih...
				// var besedilo = element.children()[0];

				/*var start = element.parent()[0].id;

				console.log(element);

				var glava = document.getElementsByTagName('head')[0];
				var css ="p:hover { color: red; }";
				console.log(css);
				// 				color: red;
				// font-weight: bold;

				var style = document.createElement("style");

				if (style.styleSheet) { // ce ze obstaja css rule za obravnavani element, pripni nova css pravila obstojecim
					style.styleSheet.cssText = css;
				} else { // ce ne obstaja css rule za obravnavani element, naredi kreiraj povsem novo pravilo
					style.appendChild(document.createTextNode(css));
				}

				// dodaj css pravilo v glavo html dokumenta
				glava.appendChild(style); */
			}
		}
})();
