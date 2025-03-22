/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */
/* jshint esversion: 6 */ 

import { DATE_OPTIONS_UTC, DATE_OPTIONS_LOCAL, UNIT_CELCIUS, UNIT_FEET } from '../const.js';
import { LANGUAGE_SOURCE, LANGUAGE_LAST_UPDATED } from '../language.js';

const SOURCE = 'KNMI';

const ID_LLFC_SOURCE_LABEL = 'llfc-source-label';
const ID_LLFC_SOURCE_DATA = 'llfc-source-data';
const ID_LLFC_LAST_UPDATED_LABEL = 'llfc-last-updated-label';
const ID_LLFC_LAST_UPDATED_SPINNER = 'llfc-last-updated-spinner';
const ID_LLFC_LAST_UPDATED_WARNING = 'llfc-last-updated-warning';
const ID_LLFC_CONTENT = 'llfc-content';
const ID_LLFC_SITUATION = 'llfc-situation-data';
const ID_LLFC_SIGNIFICANT_WEATHER = 'llfc-significant-weather-data';
const ID_LLFC_WINDS = 'llfc-winds-data';
const ID_LLFC_CLOUDS = 'llfc-clouds-data';
const ID_LLFC_THERMALS = 'llfc-thermals-data';
const ID_LLFC_FORECAST = 'llfc-forecast-data';

const ID_VALID_FROM = 'llfc-valid-from';
const ID_LAST_UPDATED = 'llfc-last-updated';

const LLFC_ITEMS = [
	'Geldig',
	'Situatie',
	'Significant weer',
	'Wind',
	'Bewolking',
	'Zicht',
	'Nulgraden niveau',
	'Hoogtewinden en temperaturen',
	'Thermiek',
	'Max. temperatuur',
	'Vooruitzichten',
	'Daglichtperiode',
];

const UPPERCASES = {
//	'few/sct': 'FEW/SCT',
//	'sct/bkn': 'SCT/BKN',
//	'bkn/ovc': 'BKN/OVC',
	'utc': 'UTC',
	'vfr': 'VFR',
	' nm': ' NM',
	' fir': ' FIR',
//	' few': ' FEW',
//	' sct': ' SCT',
//	' bkn': ' BKN',
//	' ovc': ' OVC',
//	'Few': 'FEW',
//	'Sct': 'SCT',
//	'Bkn': 'BKN',
//	'Ovc': 'OVC',
	' fl0': ' FL0',
	' fl1': ' FL1',
	' Fl0': ' FL0',
	' Fl1': ' FL1',
	'celcius': 'Celcius',
	'geisoleerde': 'geïsoleerde',
	'georienteerd': 'georiënteerd',
	'orientatie': 'oriëntatie',
	'groningen': 'Groningen',
	'friesland': 'Friesland',
	'drenthe': 'Drenthe',
	'overijssel': 'Overijssel',
	'gelderland': 'Gelderland',
	'flevoland': 'Flevoland',
	'noord holland': 'Noord Holland',
	'zuid holland': 'Zuid Holland',
	'holland': 'Holland',
	'zeeland': 'Zeeland',
	'noord brabant': 'Noord Brabant',
	'brabant': 'Brabant',
	'limburg': 'Limburg',
	'texel': 'Texel',
	'vlieland': 'Vlieland',
	'terschelling': 'Terschelling',
	'ameland': 'Ameland',
	'schiermonnikoog': 'Schiermonnikoog',
	'achterhoek': 'Achterhoek',
	'alpen': 'Alpen',
	'arnhem': 'Arnhem',
	'atlantisch': 'Atlantisch',
	'atlantische oceaan': 'Atlantische Oceaan',
	'azoren': 'Azoren',
	'baltische': 'Baltische',
	'belgie': 'België',
	'bretagne': 'Bretagne',
	'britse eilanden': 'Britse Eilanden',
	'britse': 'Britse',
	'centraal europa': 'Centraal Europa',
	'centraal-europa': 'Centraal-Europa',
	'de kooij': 'De Kooij',
	'den haag': 'Den Haag',
	'denemarken': 'Denemarken',
	'duitsland': 'Duitsland',
	'duitse bocht': 'Duitse Bocht',
	'duitse': 'Duitse',
	'eindhoven': 'Eindhoven',
	'engeland': 'Engeland',
	'engelse': 'Engelse',
	'europa': 'Europa',
	'finland': 'Finland',
	'frankrijk': 'Frankrijk',
	'groot-brittannie': 'Groot-Brittannië',
	'golf van biscaje': 'Golf van Biscaje',
	'golf van biskaje': 'Golf van Biskaje',
	'ierland': 'Ierland',
	'ijsland': 'IJsland',
	'ijsselmeer': 'IJsselmeer',
	'lille': 'Lille',
	'nederland': 'Nederland',
	'noorse': 'Noorse',
	'noordzee': 'Noordzee',
	'noorwegen': 'Noorwegen',
	'normandie': 'Normandië',
	'oostenrijk': 'Oostenrijk',
	'oostzee': 'Oostzee',
	'polen': 'Polen',
	'rusland': 'Rusland',
	'scandinavie': 'Scandinavië',
	'schotland': 'Schotland',
	'shetlandeilanden': 'Shetlandeilanden',
	'tilburg': 'Tilburg',
	'tsjechie': 'Tsjechië',
	'twente': 'Twente',
	'veluwe': 'Veluwe',
	'verenigd koninkrijk': 'Verenigd Koninkrijk',
	'waddeneilanden': 'Waddeneilanden',
	'waddengebied': 'Waddengebied',
	'waddenzee': 'Waddenzee',
	'wadden': 'Wadden',
	'wales': 'Wales',
	'zweden': 'Zweden',
	' noord-': ' Noord-',
	' oost-': ' Oost-',
	' west-': ' West-',
	' zuid-': ' Zuid-',
	' noordoost-': ' Noordoost-',
	' noordwest-': ' Noordwest-',
	' zuidoost-': ' Zuidoost-',
	' zuidwest-': ' Zuidwest-',
	' ehad': ' EHAD',
	' ehal': ' EHAL',
	' eham': ' EHAM',
	' ehbd': ' EHBD',
	' ehbk': ' EHBK',
	' ehdb': ' EHDB',
	' ehdl': ' EHDL',
	' ehdp': ' EHDP',
	' ehdr': ' EHDR',
	' ehds': ' EHDS',
	' ehdv': ' EHDV',
	' eheh': ' EHEH',
	' ehfs': ' EHFS',
	' ehgg': ' EHGG',
	' ehgr': ' EHGR',
	' ehha': ' EHHA',
	' ehho': ' EHHO',
	' ehhv': ' EHHV',
	' ehkd': ' EHKD',
	' ehle': ' EHLE',
	' ehlw': ' EHLW',
	' ehmc': ' EHMC',
	' ehmm': ' EHMM',
	' ehmz': ' EHMZ',
	' ehmm': ' EHMM',
	' ehnd': ' EHND',
	' ehnp': ' EHNP',
	' ehnr': ' EHNR',
	' ehow': ' EHOW',
	' ehrd': ' EHRD',
	' ehsb': ' EHSB',
	' ehse': ' EHSE',
	' ehst': ' EHST',
	' ehte': ' EHTE',
	' ehtL': ' EHTL',
	' ehts': ' EHTS',
	' ehtw': ' EHTW',
	' ehtx': ' EHTX',
	' ehvb': ' EHVB',
	' ehve': ' EHVE',
	' ehvk': ' EHVK',
	' ehvl': ' EHVL',
	' ehwo': ' EHWO',
	'-ehal': '-EHAL',
	'-eham': '-EHAM',
	'-ehbd': '-EHBD',
	'-ehbk': '-EHBK',
	'-ehdb': '-EHDB',
	'-ehdl': '-EHDL',
	'-ehdp': '-EHDP',
	'-ehdr': '-EHDR',
	'-ehds': '-EHDS',
	'-eheh': '-EHEH',
	'-ehfs': '-EHFS',
	'-ehgg': '-EHGG',
	'-ehgr': '-EHGR',
	'-ehho': '-EHHO',
	'-ehhv': '-EHHV',
	'-ehkd': '-EHKD',
	'-ehle': '-EHLE',
	'-ehlw': '-EHLW',
	'-ehmc': '-EHMC',
	'-ehmm': '-EHMM',
	'-ehmz': '-EHMZ',
	'-ehmm': '-EHMM',
	'-ehnd': '-EHND',
	'-ehnp': '-EHNP',
	'-ehow': '-EHOW',
	'-ehrd': '-EHRD',
	'-ehsb': '-EHSB',
	'-ehse': '-EHSE',
	'-ehst': '-EHST',
	'-ehte': '-EHTE',
	'-ehtL': '-EHTL',
	'-ehts': '-EHTS',
	'-ehtw': '-EHTW',
	'-ehtx': '-EHTX',
	'-ehvb': '-EHVB',
	'-ehve': '-EHVE',
	'-ehvk': '-EHVK',
	'-ehvl': '-EHVL',
	'-ehwo': '-EHWO',
	'nnw-zzo': 'NNW-ZZO',
	'wnw-ozo': 'WNW-OZO',
	'nno-zzw': 'NNO-ZZW',
	'ono-wzw': 'ONO-WZW',
	'ozo-wnw': 'OZO-WNW',
	'zzo-nnw': 'ZZO-NNW',
	'wzw-ono': 'WZW-ONO',
	'zzw-nno': 'ZZW-NNO',
	'nw-zo': 'NW-ZO',
	'no-zw': 'NO-ZW',
	'zw-no': 'ZW-NO',
	'zo-nw': 'ZO-NW',
	'n-z': 'N-Z',
	'z-n': 'Z-N',
	'w-o': 'W-O',
	'o-w': 'O-W',
	' nw ': ' NW ',
	' no ': ' NO ',
	' zw ': ' ZW ',
	' zo ': ' ZO ',
	' nw-': ' NW-',
	' no-': ' NO-',
	' zw-': ' ZW-',
	' zo-': ' ZO-',
	'ono': 'ONO',
	'ozo': 'OZO',
	'wnw': 'WNW',
	'wzw': 'WZW',
	'zzo': 'ZZO',
	'zzw': 'ZZW',
	' ac ': ' AC ',
	' as ': ' AS ',
	' cb ': ' CB ',
	' cu ': ' CU ',
	' ns ': ' NS ',
	' sc ': ' SC ',
	' st ': ' ST ',
	' tcu ': ' TCU ',
	' ac-': ' AC-',
	' as-': ' AS-',
	' cb-': ' CB-',
	' cu-': ' CU-',
	' ns-': ' NS-',
	' sc-': ' SC-',
	' st-': ' ST-',
	' tcu-': ' TCU-',
	' ac,': ' AC,',
	' as,': ' AS,',
	' cb,': ' CB,',
	' cu,': ' CU,',
	' ns,': ' NS,',
	' sc,': ' SC,',
	' st,': ' ST,',
	' tcu,': ' TCU,',
	' ac.': ' AC.',
	' as.': ' AS.',
	' cb.': ' CB.',
	' cu.': ' CU.',
	' ns.': ' NS.',
	' sc.': ' SC.',
	' st.': ' ST.',
	' tcu.': ' TCU.',
	'ac/as': 'AC/AS',
	'ac/sc': 'AC/SC',
	'ac/sc/ns': 'AC/SC/NS',
	'as/ac': 'AS/AC',
	'as/ns': 'AS/NS',
	'as/sc': 'AS/SC',
	'cb/tcu': 'CB/TCU',
	'cu/ac': 'CU/AC',
	'cu/sc': 'CU/SC',
	'ns/sc': 'NS/SC',
	'ns/st': 'NS/ST',
	'sc/ac': 'SC/AC',
	'sc/as': 'SC/AS',
	'sc/cu': 'SC/CU',
	'sc/ns': 'SC/NS',
	'sc/st': 'SC/ST',
	'st/ns': 'ST/NS',
	'st/sc': 'ST/SC',
	'tcu/cb': 'TCU/CB',
};

const ALERTWORDS = [
	'ijsaanzetting',
	'onweer',
	'turbulentie',	
];

class Module {
	constructor() {
		this.url = 'https://www.knmi.nl/nederland-nu/luchtvaart/weerbulletin-kleine-luchtvaart';
        this.user_agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:136.0) Gecko/20100101 Firefox/136.0';
		this.cors_proxy_url = 'cors-proxy.php';
		this.refreshInterval = 10 * 60 * 1000; // Refresh interval is 10 minutes

		this.llfc = null;
		this.llfc_items = {};
		this.valid_from = null;
		this.last_updated = null;

		/* Set language specific stuff */
		document.getElementById(ID_LLFC_SOURCE_LABEL).innerHTML = LANGUAGE_SOURCE;
		document.getElementById(ID_LLFC_SOURCE_DATA).innerHTML = SOURCE;
		document.getElementById(ID_LLFC_LAST_UPDATED_LABEL).innerHTML = LANGUAGE_LAST_UPDATED;

		/* Schedule update of document content */
		this.task = setInterval(
			this.updateData.bind(this),
			this.refreshInterval
		);

		/* Initial fill of document content */
		this.updateData();
	}

	updateData() {
		var i, start;

		/* Disable warning icon */
		document.getElementById(ID_LLFC_LAST_UPDATED_WARNING).style.display = 'none';

		/* Enable spinner icon */
		document.getElementById(ID_LLFC_LAST_UPDATED_SPINNER).style.display = 'block';

		/* Update KNMI LLFC data */
		fetch(
			this.cors_proxy_url,
			{
				headers: {
					'X-Request-Url': this.url,
                    'X-User-Agent': this.user_agent,
				},
				keepalive: true,
				method: 'GET',
				referrerPolicy: 'no-referrer',
			}
		).then(response => {
			if (response.status == 200) {
				return response.text();
			} else {
				console.warn('Returned HTTP error ' + response.status + ' (' + response.statusText + ')');
				return null;
			}
		}).then(data => {
			/* Disable spinner icon */
			document.getElementById(ID_LLFC_LAST_UPDATED_SPINNER).style.display = 'none';

			if (data != null) {
				this.last_updated = new Date();

				/* Get contents from the result from allorigins.win and get the LLFC bulletin by slicing off any HTML content*/
				this.llfc = data.slice(data.indexOf('ZCZC'), data.indexOf('</pre>'));

				/* Check if there's a valid LLFC bulletin in the document */
				if (this.llfc.length > 0) {
					/* Get day & time when this bulletin was published */
					this.valid_from = new Date();
					start = this.llfc.indexOf('EHDB ') + 5;
					this.valid_from.setDate(
						Number(this.llfc.slice(start, start + 2))
					);
					this.valid_from.setHours(
						Number(this.llfc.slice(start + 2, start + 4)) - (new Date().getTimezoneOffset() / 60),
						Number(this.llfc.slice(start + 4, start + 6)),
						0
					);

					/* De-compose LLFC */
					this.llfc_items = {};
					start = this.llfc.indexOf('GELDIG ');
					this.llfc_items['GELDIG'] = this.llfc.slice(start + 7, this.llfc.indexOf('\n', start));
					for (i = 0; i < LLFC_ITEMS.length; i++) {
						this.llfc_items[LLFC_ITEMS[i].toUpperCase()] = this.llfc_decompose(LLFC_ITEMS[i].toUpperCase());
					}

					/* Fill document contents */
					document.getElementById(ID_LLFC_CONTENT).innerHTML = '';
					for (i = 0; i < document.config.knmi_llfc.length; i++) {
						if (this.llfc_items[document.config.knmi_llfc[i].toUpperCase()] !== null) {
							document.getElementById(ID_LLFC_CONTENT).innerHTML += '<div class=llfc-item><span class="llfc-item-header">' + document.config.knmi_llfc[i] + ':</span>&nbsp;<span class="llfc-item-text">' + this.llfc_items[document.config.knmi_llfc[i].toUpperCase()] + '</span></div>';
						}
					}
					document.getElementById(ID_VALID_FROM).innerHTML = this.valid_from.toLocaleString(document.config.locale, DATE_OPTIONS_LOCAL);
					document.getElementById(ID_LAST_UPDATED).innerHTML = this.last_updated.toLocaleString(document.config.locale, DATE_OPTIONS_LOCAL);
				} else {
					document.getElementById(ID_LLFC_LAST_UPDATED_WARNING).style.display = 'block';
				}
			} else {
				document.getElementById(ID_LLFC_LAST_UPDATED_WARNING).style.display = 'block';
			}

		}).catch((error) => {
			/* Disable spinner icon */
			document.getElementById(ID_LLFC_LAST_UPDATED_SPINNER).style.display = 'none';

			/* Enable warning icon */
			document.getElementById(ID_LLFC_LAST_UPDATED_WARNING).style.display = 'block';

			console.error(error);
		});
	}

	llfc_decompose(component) {
		var i, start, data, sentences, key, result = null;

		start = this.llfc.indexOf('.\n' + component);
		if (start !== -1) {
			/* The 'GELDIG' component doesn't have a ':', so set the start variable to a fixed value of 7 */
			if (component === 'GELDIG') {
				start = this.llfc.indexOf(' ', start) + 1;
			} else {
				start = this.llfc.indexOf(': ', start) + 2;
			}

            /*  */
            data = this.llfc.slice(start, this.llfc.indexOf('\n.\n', start)).toLowerCase().replaceAll('\n', ' ');

            /* Highlight specific words that need extra attention */
			for (key in ALERTWORDS) {
				data = data.replaceAll(ALERTWORDS[key], '<span class="llfc-item-text-alert">' + ALERTWORDS[key] + '</span>');
			}

			/* Make some METAR- and language-specific uppercase changes */
			for (key in UPPERCASES) {
				data = data.replaceAll(key, UPPERCASES[key]);
			}

			/* Start each sentence with an uppercase letter */
			sentences = data.split(". ");
			for (i = 0; i < sentences.length; i++) {
				/* Always make first letter uppercase for the component */
				sentences[0]= sentences[0][0].toUpperCase() + sentences[0].slice(1);
				/* Only transform first letter of sentence to uppercase when it's not preceded by an abbreviation */
				if ((i !== 0) && (sentences[i - 1][sentences[i - 1].length - 2] !== '.')) {
					sentences[i] = sentences[i][0].toUpperCase() + sentences[i].slice(1);
				}
			}

			/* Combine the seperated sentences to one string again */
			result = sentences.join('. ');
		}
		return result;
	}
}

export { Module };
