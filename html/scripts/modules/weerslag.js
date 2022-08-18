/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

class Module {
	img_id = null;

	constructor(id) {
		this.img_id = id;
		this.img_cloudandrain_url = 'https://weerdata.weerslag.nl/image/1.0/?size=ani-8-SatellietBuienRadar-550x550&type=Freecontent';
		this.img_rain_url = 'https://weerdata.weerslag.nl/image/1.0/?size=ani-12-Actueel-1920x1080&type=Freecontent';
		this.img_rain_forecast_url = 'https://weerdata.weerslag.nl/image/1.0/?size=ani-forecast-550x550&type=Freecontent';
		this.refreshInterval = 5 * 60 * 1000; // Refresh interval is 10 minutes

		/* Schedule update of document content */
		this.task = setInterval(
			this.updateData.bind(this),
			this.refreshInterval
		);

		/* Initial fill of document content */
		this.updateData();
	}

	updateData() {
		document.getElementById(this.img_id).src = this.img_cloudandrain_url + '&v=' + Math.random();
	};
}

export { Module };

