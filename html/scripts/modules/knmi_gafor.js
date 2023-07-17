/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */
/* jshint esversion: 6 */ 

import { DATE_OPTIONS_UTC, DATE_OPTIONS_LOCAL, UNIT_CELCIUS, UNIT_FEET } from '../const.js';
import { LANGUAGE_SOURCE, LANGUAGE_LAST_UPDATED } from '../language.js';

const SOURCE = 'KNMI';

const ID_GAFOR_SOURCE_LABEL = 'gafor-source-label';
const ID_GAFOR_SOURCE_DATA = 'gafor-source-data';
const ID_GAFOR_LAST_UPDATED_LABEL = 'gafor-last-updated-label';
const ID_GAFOR_LAST_UPDATED_SPINNER = 'gafor-last-updated-spinner';
const ID_GAFOR_LAST_UPDATED_WARNING = 'gafor-last-updated-warning';
const ID_GAFOR_CONTENT = 'gafor-content';
const ID_GAFOR_SITUATION = 'gafor-situation-data';
const ID_GAFOR_SIGNIFICANT_WEATHER = 'gafor-significant-weather-data';
const ID_GAFOR_WINDS = 'gafor-winds-data';
const ID_GAFOR_CLOUDS = 'gafor-clouds-data';
const ID_GAFOR_THERMALS = 'gafor-thermals-data';
const ID_GAFOR_FORECAST = 'gafor-forecast-data';

const ID_VALID_FROM = 'gafor-valid-from';
const ID_LAST_UPDATED = 'gafor-last-updated';

const GAFOR_ITEMS = [
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
	'cavok': 'CAVOK',
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
	'-fl0': '-FL0',
	'-fl1': '-FL1',
	'-Fl0': '-FL0',
	'-Fl1': '-FL1',
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
	'atlantische oceaan': 'Atlantische Oceaan',
	'azoren': 'Azoren',
	'baltische': 'Baltische',
	'belgie': 'België',
	'bretagne': 'Bretagne',
	'britse eilanden': 'Britse Eilanden',
	'britse': 'Britse',
	'centraal-europa': 'Centraal-Europa',
	'denemarken': 'Denemarken',
	'duitsland': 'Duitsland',
	'duitse': 'Duitse',
	'engeland': 'Engeland',
	'engelse': 'Engelse',
	'europa': 'Europa',
	'finland': 'Finland',
	'frankrijk': 'Frankrijk',
	'golf van biscaje': 'Golf van Biscaje',
	'ierland': 'Ierland',
	'ijsland': 'IJsland',
	'ijsselmeer': 'IJsselmeer',
	'nederland': 'Nederland',
	'noorse zee': 'Noorse Zee',
	'noorse': 'Noorse',
	'noordzee': 'Noordzee',
	'noorwegen': 'Noorwegen',
	'oostenrijk': 'Oostenrijk',
	'polen': 'Polen',
	'rusland': 'Rusland',
	'scandinavie': 'Scandinavië',
	'schotland': 'Schotland',
	'twente': 'Twente',
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
	' ehal': ' EHAL',
	' eham': ' EHAM',
	' ehbd': ' EHBD',
	' ehbk': ' EHBK',
	' ehdb': ' EHDB',
	' ehdl': ' EHDL',
	' ehdp': ' EHDP',
	' ehdr': ' EHDR',
	' ehds': ' EHDS',
	' eheh': ' EHEH',
	' ehfs': ' EHFS',
	' ehgg': ' EHGG',
	' ehgr': ' EHGR',
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
	'as/sc': 'AS/SC',
	'as/ac': 'AS/AC',
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

class Module {
	constructor() {
		this.url = 'https://www.knmi.nl/nederland-nu/luchtvaart/weerbulletin-kleine-luchtvaart';
		this.cors_proxy_url = 'cors-proxy.php';
		this.refreshInterval = 10 * 60 * 1000; // Refresh interval is 10 minutes

		this.gafor = null;
		this.gafor_items = {};
		this.valid_from = null;
		this.last_updated = null;

		/* Set language specific stuff */
		document.getElementById(ID_GAFOR_SOURCE_LABEL).innerHTML = LANGUAGE_SOURCE;
		document.getElementById(ID_GAFOR_SOURCE_DATA).innerHTML = SOURCE;
		document.getElementById(ID_GAFOR_LAST_UPDATED_LABEL).innerHTML = LANGUAGE_LAST_UPDATED;

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
		document.getElementById(ID_GAFOR_LAST_UPDATED_WARNING).style.display = 'none';

		/* Enable spinner icon */
		document.getElementById(ID_GAFOR_LAST_UPDATED_SPINNER).style.display = 'block';

		/* Update KNMI GAFOR data */
		fetch(
			this.cors_proxy_url,
			{
				headers: {
					'X-Request-Url': this.url,
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
			document.getElementById(ID_GAFOR_LAST_UPDATED_SPINNER).style.display = 'none';

			if (data != null) {
				this.last_updated = new Date();

				/* Get contents from the result from allorigins.win and get the GAFOR bulletin by slicing off any HTML content*/
				this.gafor = data.slice(data.indexOf('ZCZC'), data.indexOf('</pre>'));

				/* Get day & time when this bulletin was published */
				this.valid_from = new Date();
				start = this.gafor.indexOf('EHDB ') + 5;
				this.valid_from.setDate(
					Number(this.gafor.slice(start, start + 2))
				);
				this.valid_from.setHours(
					Number(this.gafor.slice(start + 2, start + 4)) - (new Date().getTimezoneOffset() / 60),
					Number(this.gafor.slice(start + 4, start + 6)),
					0
				);

				/* De-compose GAFOR */
				this.gafor_items = {};
				start = this.gafor.indexOf('GELDIG ');
				this.gafor_items['GELDIG'] = this.gafor.slice(start + 7, this.gafor.indexOf('\n', start));
				for (i = 0; i < GAFOR_ITEMS.length; i++) {
					this.gafor_items[GAFOR_ITEMS[i].toUpperCase()] = this.gafor_decompose(GAFOR_ITEMS[i].toUpperCase());
				}

				/* Fill document contents */
				document.getElementById(ID_GAFOR_CONTENT).innerHTML = '';
				for (i = 0; i < document.config.knmi_gafor.length; i++) {
					if (this.gafor_items[document.config.knmi_gafor[i].toUpperCase()] !== null) {
						document.getElementById(ID_GAFOR_CONTENT).innerHTML += '<div class=gafor-item><span class="gafor-item-header">' + document.config.knmi_gafor[i] + ':</span>&nbsp;<span class="gafor-item-text">' + this.gafor_items[document.config.knmi_gafor[i].toUpperCase()] + '</span></div>';
					}
				}
				document.getElementById(ID_VALID_FROM).innerHTML = this.valid_from.toLocaleString(document.config.locale, DATE_OPTIONS_LOCAL);
				document.getElementById(ID_LAST_UPDATED).innerHTML = this.last_updated.toLocaleString(document.config.locale, DATE_OPTIONS_LOCAL);
			} else {
				document.getElementById(ID_GAFOR_LAST_UPDATED_WARNING).style.display = 'block';
			}

		}).catch((error) => {
			/* Disable spinner icon */
			document.getElementById(ID_GAFOR_LAST_UPDATED_SPINNER).style.display = 'none';

			/* Enable warning icon */
			document.getElementById(ID_GAFOR_LAST_UPDATED_WARNING).style.display = 'block';

			console.error(error);
		});
	}

	gafor_decompose(component) {
		var i, start, data, sentences, key, result = null;

		start = this.gafor.indexOf('.\n' + component);
		if (start !== -1) {
			/* The 'GELDIG' component doesn't have a ':', so set the start variable to a fixed value of 7 */
			if (component === 'GELDIG') {
				start = this.gafor.indexOf(' ', start) + 1;
			} else {
				start = this.gafor.indexOf(': ', start) + 2;
			}
			data = this.gafor.slice(start, this.gafor.indexOf('\n.\n', start)).toLowerCase().replaceAll('\n', ' ');

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

