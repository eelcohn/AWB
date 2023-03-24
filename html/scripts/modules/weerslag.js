/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

const LATTITUDE_UP = 54;
const LATTITUDE_DOWN = 49.5;
const LONGITUDE_LEFT = 2;
const LONGITUDE_RIGHT = 9;

const LOCATION_DOT_SIZE = 7;

const ID_IMAGE_MAP = 'img-layer-map-id';
const ID_IMAGE_CLOUD = 'img-layer-cloud-id';
const ID_IMAGE_RAIN = 'img-layer-rain-id';
const ID_IMAGE_LOCATION = 'img-layer-location-id';



class Module {
	img_id = null;

	constructor(id) {
		this.img_id = id;
		this.img_cloudandrain_url = 'https://weerdata.weerslag.nl/image/1.0/?size=ani-8-SatellietBuienRadar-550x550&type=Freecontent';
		this.img_rain_url = 'https://weerdata.weerslag.nl/image/1.0/?size=ani-12-Actueel-1920x1080&type=Freecontent';
		this.img_rain_forecast_url = 'https://weerdata.weerslag.nl/image/1.0/?size=ani-forecast-550x550&type=Freecontent';
		this.img_location_canvas = document.getElementById(ID_IMAGE_LOCATION);
		this.location_ctx = this.img_location_canvas.getContext("2d");
		this.refreshInterval = 5 * 60 * 1000; // Refresh interval is 10 minutes

		/* Schedule update of document content */
		this.task = setInterval(
			this.updateData.bind(this),
			this.refreshInterval
		);

		document.getElementById(this.img_id).addEventListener('load', (e) => {
			/* Get size of parent node */
			var w = this.img_location_canvas.parentNode.clientWidth;
			var h = this.img_location_canvas.parentNode.clientHeight;

			/* Resize location canvas */
			this.img_location_canvas.width = w;
			this.img_location_canvas.height = h;
			this.location_ctx.canvas.width = w;
			this.location_ctx.canvas.height = h;

			/* Calculate where the location is within the canvas */
			var lattitudesOnScreen = Math.abs(LATTITUDE_UP - LATTITUDE_DOWN);
			var longitudesOnScreen = Math.abs(LONGITUDE_LEFT - LONGITUDE_RIGHT);
			var x = Math.floor(Math.abs(((document.config.location.longitude - LONGITUDE_LEFT) / longitudesOnScreen) * w));
			var y = Math.floor(Math.abs(((LATTITUDE_UP - document.config.location.lattitude) / lattitudesOnScreen) * h));
			console.log('w=' + w + ' h=' + h + ' x=' + x + ' y=' + y);

			/* Draw a dot at the location */
			this.location_ctx.clearRect(0, 0, w, h);
			this.location_ctx.fillStyle = "#f00";
			this.location_ctx.beginPath();
			this.location_ctx.fillRect(x, y, LOCATION_DOT_SIZE, LOCATION_DOT_SIZE);
//			this.location_ctx.arc(x, y, 5, 0, 2 * Math.PI);
			this.location_ctx.closePath();
		});

		/* Initial fill of document content */
		this.updateData();
	}

	updateData() {
		document.getElementById(this.img_id).src = this.img_cloudandrain_url + '&v=' + Math.random();
	};
}

export { Module };

