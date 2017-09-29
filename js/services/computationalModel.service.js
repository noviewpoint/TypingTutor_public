(function() {
	"use strict";

	angular
		.module("typingTutor")
		.service("computationalModelService", computationalModelService);

	computationalModelService.$inject = ["audioService", "pravilnoTipkanjeService", "sharedStatesService", "canvasService", "imagesAndDivsService", "measurementsService", "smejkoService"];

	/**
	 * @ngdoc service
	 * @name typingTutor.service:computationalModelService
	 * @description
	 * Service, ki nudi funkcije za izvajanje racunskega modela.
	 * @requires typingTutor.service:audioService
	 * @requires typingTutor.service:pravilnoTipkanjeService
	 * @requires typingTutor.service:sharedStatesService
	 * @requires typingTutor.service:canvasService
	 * @requires typingTutor.service:imagesAndDivsService
	 * @requires typingTutor.service:measurementsService
	 */

	function computationalModelService(audioService, pravilnoTipkanjeService, sharedStatesService, canvasService, imagesAndDivsService, measurementsService, smejkoService) {
		//console.log("In computationalModelService");
		var vm = this;

		// performanse javascripta za izbiro zadnjega elementa v arrayu => http://jsperf.com/last-array-element2

		/* vzorcev za regularno meritev */
		var potrebnoSteviloVzorcev = 4;

		/* utezi */
		var BETA_0 = 1,
			BETA_1 = 0.01,
			BETA_2 = 500,
			BETA_3 = 800;

		var trenutnePravilnosti = [],
			pozornosti = [],
			utrujenosti = [];

		return {
			racunajPravilnost: racunajPravilnost,
			racunajPozornostInUtrujenost: racunajPozornostInUtrujenost,
			dobiPozornosti: dobiPozornosti,
			dobiUtrujenosti: dobiUtrujenosti,
			prazniMeritve: prazniMeritve
		};

		/**
		 * @ngdoc method
		 * @name preveriTipNapake
		 * @methodOf typingTutor.service:computationalModelService
		 *
		 * @description
		 * Preveri tip napake.
		 * @example
		 * computationalModelService.preveriTipNapake();
		 * @param {string} [pravilna crka] crka, ki jo je uporabnik pritisnil
		 * @param {string} {crka} crka, ki bi jo uporabnik moral pritisniti
		 * @returns {boolean} tip napake
		 */
		// ce napaka ni tipa 1, je avtomatsko tipa 2 :)
		function preveriTipNapake(a, b) {
			var c = pravilnoTipkanjeService.dobiCrkeSosede();
			if (c.hasOwnProperty(a)) {
				for (var i = 0; i < c[a].length; i++) {
					if (c[a][i] === b) {
						return true;
					}
				}
			}
		}

		// ustvarjanje objektov s konstruktorjem, lastnosti vsakega ustvarjenega objekta kazejo v isti koscek rama
		function ObjektPravilnosti(zakasnitev, pravilnost) {
			this.zakasnitev = zakasnitev;
			this.pravilnost = pravilnost;
		}

		function racunajPravilnost(zakasnitev, pravilnaCrka, uporabnikovaCrka) {

			var tipNapake = 0, // 0 = brez napake, 1 = napaka tipa 1, 2 = napaka tipa 2
				napakaTip1 = 0,
				napakaTip2 = 0;

			if (pravilnaCrka !== uporabnikovaCrka) {
				// NAPACEN STISK TIPKE
				preveriTipNapake(pravilnaCrka, uporabnikovaCrka) ? (napakaTip1 = 1, tipNapake = 1) : (napakaTip2 = 1, tipNapake = 2);
				//console.log("Tip napake 1 je", napakaTip1, "in tip napake 2 je", napakaTip2, ". Vrednost napake je", tipNapake, ".");

				sharedStatesService.povecajSteviloNapacnihPritiskov();
				audioService.playSoundWrongLetter();
				imagesAndDivsService.spremeniBarvoOzadja(false);
			} else {
				// PRAVILEN STISK TIPKE
				sharedStatesService.povecajSteviloPravilnihPritiskov();
				audioService.playSoundCorrectLetter();
				imagesAndDivsService.spremeniBarvoOzadja(true);
			}

			// formula linearne regresije
			var pravilnost = BETA_0 + BETA_1 * zakasnitev + BETA_2 * napakaTip1 +  BETA_3 * napakaTip2;

			// se upostevajo pri meritvi - array vrednosti pravilnosti zadnjih 4 sekund
			trenutnePravilnosti.push(pravilnost);
			measurementsService.addToHistoryKeyboard(zakasnitev, uporabnikovaCrka, pravilnaCrka, tipNapake, pravilnost);
		}

		function racunajPozornostInUtrujenost() {
			// console.log("Racunal sem z:", trenutnePravilnosti);
			if (trenutnePravilnosti.length >= potrebnoSteviloVzorcev) {
				// console.log("Vzorec meritev zadosti velik:", trenutnePravilnosti, ". To bo sedaj izpraznjeno.");

				// ce se vmes doda crka pride do napake! POPRAVITI !!!

				var povprecje = racunajPovprecje(trenutnePravilnosti);
				var varianca = racunajVarianco(trenutnePravilnosti, povprecje);

				// var indeks = pravilnosti.length - trenutnePravilnosti.length;
				// var dolzina = trenutnePravilnosti.length;

				pozornosti.push({
					casovniZig: Date.now(),
					pozornost: povprecje
					// indeks: indeks,
					// korak: dolzina
				});
				utrujenosti.push({
					casovniZig: Date.now(),
					utrujenost: varianca
					// indeks: indeks,
					// korak: dolzina
				});

				// izprazni meritve
				trenutnePravilnosti = [];

				// posreduj zadnjo pozornost za risanje smejkota
				if (sharedStatesService.getXmlConfigEmoticon()) {
					smejkoService.updateSmejko(pozornosti[pozornosti.length - 1].pozornost);
				}
				audioService.playSoundEmoticonUpdate();

			} else {
				// console.log("Vzorec meritev premajhen.");
				// izprazni meritve
				trenutnePravilnosti = [];
			}
		}

		// vhod je matrika stevil
		function racunajPovprecje(vzorec) {
			var velikostVzorca = vzorec.length,
				sestevek = 0,
				povprecje = 0;

			for (var i = 0; i < velikostVzorca; i++) {
				sestevek += vzorec[i];
			}

			povprecje = sestevek / velikostVzorca;
			return povprecje;
		}

		// vhod je matrika stevil
		function racunajVarianco(vzorec, povprecje) {
			var velikostVzorca = vzorec.length,
				deviacije = 0,
				varianca = 0;

			for (var i = 0; i < velikostVzorca; i++) {
				deviacije += (vzorec[i] - povprecje)^2;
			}

			varianca = Math.abs(deviacije / (velikostVzorca - 1)); // velikost vzorca pozitivno naravno stevilo, ni deljenja z 0
			return varianca;
		}

		/**
		 * @ngdoc method
		 * @name dobiPozornosti
		 * @methodOf typingTutor.service:computationalModelService
		 * @example
		 * computationalModelService.dobiPozornosti();
		 * @returns {Array} utrujenosti so
		 */
		function dobiPozornosti() {
			return pozornosti;
		}

		/**
		 * @ngdoc method
		 * @name dobiUtrujenosti
		 * @methodOf typingTutor.service:computationalModelService
		 * @example
		 * computationalModelService.dobiUtrujenosti();
		 * @returns {Array} utrujenosti so
		 */
		function dobiUtrujenosti() {
			return utrujenosti;
		}

		/**
		 * @ngdoc method
		 * @name prazniMeritve
		 * @methodOf typingTutor.service:computationalModelService
		 * @example
		 * computationalModelService.prazniMeritve();
		 */
		function prazniMeritve() {
			trenutnePravilnosti = [],
			pozornosti = [],
			utrujenosti = [];
		}

	}

})();
