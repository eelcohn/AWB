/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

class Module {
	constructor(id) {
		this.img_id = id;
		this.img_weather_url = 'https://cdn.knmi.nl/knmi/map/general/weather-map.gif';
		this.img_neerslagradar_url = 'https://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/neerslagradar/WWWRADAR_loop.gif';
		this.img_neerslagradar_lightning_url = 'https://cdn.knmi.nl/knmi/map/page/weer/actueel-weer/neerslagradar/WWWRADARLGT_loop.gif';
		this.refreshInterval = 5 * 60 * 1000; // Refresh interval is 5 minutes

		/* Schedule update of document content */
		this.task = setInterval(
			this.updateData.bind(this),
			this.refreshInterval
		);

		/* Initial fill of document content */
		this.updateData();
	}


	updateData() {
		/* Update the KNMI Neerslag image */
		document.getElementById(this.img_id).src = this.img_neerslagradar_lightning_url + '?update_rand=' + Math.random();
	}
};

export { Module };

