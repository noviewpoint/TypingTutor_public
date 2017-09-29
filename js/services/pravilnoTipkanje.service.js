(function() {
	"use strict";

	angular
		.module("typingTutor")
		.service("pravilnoTipkanjeService", pravilnoTipkanjeService);

	pravilnoTipkanjeService.$inject = [];

	/**
	 * @ngdoc service
	 * @name typingTutor.service:pravilnoTipkanjeService
	 * @description
	 * Service, ki nudi funkcije, ki povejo kako se pravilno tipka.
	 */

	function pravilnoTipkanjeService() {
		//console.log("In pravilnoTipkanjeService");
		var vm = this;

		var imenaPrstov = ["levi_mezinec", "levi_prstanec", "levi_sredinec", "levi_kazalec", "levi_palec", "desni_palec", "desni_kazalec", "desni_sredinec", "desni_prstanec", "desni_mezinec"];

		/* neposredni stiki tipk na slovenski tipkovnici*/
		var crkeSosede = {
			"q" : ["w", "a"],
			"w" : ["q", "e", "a", "s"],
			"e" : ["w", "r", "s", "d"],
			"r" : ["e", "t", "d", "f"],
			"t" : ["r", "z", "f", "g"],
			"z" : ["t", "u", "g", "h"],
			"u" : ["z", "i", "h", "j"],
			"i" : ["u", "o", "j", "k"],
			"o" : ["i", "p", "k", "l"],
			"p" : ["o", "š", "l", "č"],
			"š" : ["p", "đ", "č", "ć"],
			"đ" : ["š", "ć", "ž"],

			"a" : ["q", "w", "s", "<", "y"],
			"s" : ["w", "e", "a", "s", "y", "x"],
			"d" : ["e", "r", "s", "f", "x", "c"],
			"f" : ["r", "t", "d", "g", "c", "v"],
			"g" : ["t", "z", "f", "h", "v", "b"],
			"h" : ["z", "u", "g", "j", "b", "n"],
			"j" : ["u", "i", "h", "k", "n", "m"],
			"k" : ["i", "o", "j", "l", "m", ","],
			"l" : ["o", "p", "k", "č", ",", "."],
			"č" : ["p", "š", "l", "ć", ".", "-"],
			"ć" : ["š", "đ", "č", "ž", "-"],
			"ž" : ["đ", "ć"], // shift ne stejemo!

			"y" : ["a", "s", "<", "x"],
			"x" : ["s", "d", "y", "c"],
			"c" : ["d", "f", "x", "v"],
			"v" : ["f", "g", "c", "b"],
			"b" : ["g", "h", "v", "n"],
			"n" : ["h", "j", "b", "m"],
			"m" : ["j", "k", "n", ","],
			"," : ["k", "l", "m", "."],
			"." : ["l", "č", ",", "-"],
			"-" : ["č", "ć", "."] // nekateri layouti tipkovnic desno od - se nek cuden znak pred shiftom
		};

		var prstiCrk = {
			"q" : 1,
			"w" : 2,
			"e" : 3,
			"r" : 4,
			"t" : 4,
			"z" : 7,
			"u" : 7,
			"i" : 8,
			"o" : 9,
			"p" : 10,
			"š" : 10,
			"đ" : 10,

			"a" : 1,
			"s" : 2,
			"d" : 3,
			"f" : 4,
			"g" : 4,
			"h" : 7,
			"j" : 7,
			"k" : 8,
			"l" : 9,
			"č" : 10,
			"ć" : 10,
			"ž" : 10,

			"y" : 1,
			"x" : 2,
			"c" : 3,
			"v" : 4,
			"b" : 4,
			"n" : 7,
			"m" : 8,
			"," : 9,
			"." : 10,
			"-" : 10,
			// space za palca
			" " : 5
		};
		/**
		 * @ngdoc method
		 * @name dobiPravilnoKombinacijoRok
		 * @methodOf typingTutor.service:pravilnoTipkanjeService
		 * @example
		 * pravilnoTipkanjeService.dobiPravilnoKombinacijoRok();
		 */
		function dobiPravilnoKombinacijoRok(crka) {
			// console.log("In function dobiPravilnoKombinacijoRok");
			if (crka) {
				var crka = crka.toLowerCase();
			}

			return imenaPrstov[prstiCrk[crka] - 1];
		}

		function dobiCrkeSosede() {
			return crkeSosede;
		}

		return {
			dobiPravilnoKombinacijoRok: dobiPravilnoKombinacijoRok,
			dobiCrkeSosede: dobiCrkeSosede
		};
	}

})();
