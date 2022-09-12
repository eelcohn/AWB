/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

const DATE_OPTIONS_UTC = { timeZone: 'UTC', timeZoneName: 'short', hour12: false, hour: '2-digit', minute: '2-digit'};
const DATE_OPTIONS_LOCAL = { timeZoneName: 'short', hour12: false, hour: '2-digit', minute: '2-digit'};
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
	'groningen': 'Groningen',
	'friesland': 'Friesland',
	'drenthe': 'Drenthe',
	'overijssel': 'Overijssel',
	'gelderland': 'Gelderland',
	'flevoland': 'Flevoland',
	'noord holland': 'Noord Holland',
	'noord-holland': 'Noord-Holland',
	'zuid holland': 'Zuid Holland',
	'zuid-holland': 'Zuid-Holland',
	'zeeland': 'Zeeland',
	'noord brabant': 'Noord Brabant',
	'limburg': 'Limburg',
	'texel': 'Texel',
	'vlieland': 'Vlieland',
	'terschelling': 'Terschelling',
	'ameland': 'Ameland',
	'schiermonnikoog': 'Schiermonnikoog',
	'achterhoek': 'Achterhoek',
	'ijsselmeer': 'IJsselmeer',
	'azoren': 'Azoren',
	'baltische': 'Baltische',
	'britse eilanden': 'Britse Eilanden',
	'britse': 'Britse',
	'centraal-europa': 'Centraal-Europa',
	'denemarken': 'Denemarken',
	'duitsland': 'Duitsland',
	'engeland': 'Engeland',
	'frankrijk': 'Frankrijk',
	'golf van biscaje': 'Golf van Biskaje',
	'ierland': 'Ierland',
	'ijsland': 'IJsland',
	'nederland': 'Nederland',
	'noord-europa': 'Noord-Europa',
	'noord-frankrijk': 'Noord-Frankrijk',
	'noorse': 'Noorse',
	'noordzee': 'Noordzee',
	'noorwegen': 'Noorwegen',
	'oost-europa': 'Oost-Europa',
	'polen': 'Polen',
	'scandinavie': 'Scandinavië',
	'schotland': 'Schotland',
	'twente': 'Twente',
	'waddeneilanden': 'Waddeneilanden',
	'waddengebied': 'Waddengebied',
	'waddenzee': 'Waddenzee',
	'wales': 'Wales',
	'west-europa': 'West-Europa',
	'zuid-europa': 'Zuid-Europa',
	'ehal': 'EHAL',
	'eham': 'EHAM',
	'ehbk': 'EHBK',
	'ehbd': 'EHBD',
	'ehdr': 'EHDR',
	'eheh': 'EHEH',
	'ehgg': 'EHGG',
	'ehho': 'EHHO',
	'ehhv': 'EHHV',
	'ehkd': 'EHKD',
	'ehle': 'EHLE',
	'ehmz': 'EHMZ',
	'ehmm': 'EHMM',
	'ehnd': 'EHND',
	'ehow': 'EHOW',
	'ehrd': 'EHRD',
	'ehse': 'EHSE',
	'ehst': 'EHST',
	'ehte': 'EHTE',
	'ehtw': 'EHTW',
	'ehtx': 'EHTX',
	'ehve': 'EHVE',
	'n-z': 'N-Z',
	'nnw-zzo': 'NNW-ZZO',
	'nw-zo': 'NW-ZO',
	'wnw-ozo': 'WNW-OZO',
	'no-zw': 'NO-ZW',
	'nno-zzw': 'NNO-ZZW',
	'zw-no': 'ZW-NO',
	'wzw-ono': 'WZW-ONO',
	'zo-nw': 'ZO-NW',
	'z-n': 'Z-N',
	' nw ': ' NW ',
	' no ': ' NO ',
	' zw ': ' ZW ',
	' zo ': ' ZO ',
	' wnw': ' WNW',
	' wzw': ' WZW',
	' ono': ' ONO',
	' ozo': ' OZO',
	' ac ': ' AC ',
	' as ': ' AS ',
	' cb ': ' CB ',
	' cu ': ' CU ',
	' ns ': ' NS ',
	' sc ': ' SC ',
	' st ': ' ST ',
	' tcu ': ' TCU ',
	'as/sc': 'AS/SC',
	'cu/ac': 'CU/AC',
	'cu/sc': 'CU/SC',
	'sc/ac': 'SC/AC',
	'sc/as': 'SC/AS',
	'sc/ns': 'SC/NS',
	'sc/cu': 'SC/CU',
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
			}
		}).catch((error) => {
			console.error(error);
		});
	}

	gafor_decompose(component) {
		var i, start, data, sentences, key, result = null;

		start = this.gafor.indexOf(component);
		if (start !== -1) {
			/* The 'GELDIG' component doesn't have a ':', so set the start variable to a fixed value of 7 */
			if (component === 'GELDIG') {
				start = this.gafor.indexOf(' ', start) + 1;
			} else {
				start = this.gafor.indexOf(': ', start) + 2;
			}
			data = this.gafor.slice(start, this.gafor.indexOf('\n.\n', start)).toLowerCase().replaceAll('\n', ' ');
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

			/* Make some METAR- and language-specific uppercase changes */
			for (key in UPPERCASES) {
				result = result.replaceAll(key, UPPERCASES[key]);
			}
		}
		return result;
	}
}

export { Module };

