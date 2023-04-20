/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

const ID_IMAGE_MAP = 'img-layer-map-id';
const ID_IMAGE_CLOUD = 'img-layer-cloud-id';
const ID_IMAGE_RAIN = 'img-layer-rain-id';
const ID_IMAGE_LOCATION = 'img-layer-location-id';



class Module {
	img_id = null;

	constructor(id) {
		this.img_id = id;
		this.img_map_url = 'https://www.weerplaza.nl/Content/Images/Radar/Radar-1050-v2.jpg';
		this.img_cloud_url = 'https://lb01.meteoplaza.com/gdata/satellite/5min/nlradar.202303230645.jpg';	// Interval = 15 minutes
		this.img_rain_url = 'https://lb01.meteoplaza.com/gdata/radar/preciptype/precipitationtype_observations_202303230715.png';	// Interval 5 minutes
		this.img_location_canvas = document.getElementById(ID_IMAGE_LOCATION);
		this.location_ctx = this.img_location_canvas.getContext("2d");
		this.refreshInterval = 5 * 60 * 1000; // Refresh interval is 10 minutes

		/* Resize canvas */
		var parent = this.img_location_canvas.parentNode,
			styles = getComputedStyle(parent),
			w = parseInt(styles.getPropertyValue("width"), 10),
			h = parseInt(styles.getPropertyValue("height"), 10);
			console.log(w);
			console.log(h);
		this.img_location_canvas.width = w;
		this.img_location_canvas.height = h;
		this.location_ctx.canvas.width = w;
		this.location_ctx.canvas.height = h;

//		this.img_location_canvas.width = this.img_location_canvas.offsetWidth;
//		this.img_location_canvas.height = this.img_location_canvas.offsetHeight;

		/* Draw a dot at the location */
		var lattitudesOnScreen = Math.abs(LATTITUDE_UP - LATTITUDE_DOWN);
		var longitudesOnScreen = Math.abs(LONGITUDE_LEFT - LONGITUDE_RIGHT);
		var x = ((document.config.location.lattitude - LATTITUDE_DOWN) / lattitudesOnScreen) * this.img_location_canvas.height;
		var y = ((document.config.location.longitude - LONGITUDE_LEFT) / longitudesOnScreen) * this.img_location_canvas.width;
		x = 100;
		y = 100;
		this.location_ctx.clearRect(0, 0, this.img_location_canvas.width, this.img_location_canvas.height);
		this.location_ctx.fillStyle = "#F00";
		this.location_ctx.beginPath();
		this.location_ctx.fillRect(x, y, 5, 5); // fill in the pixel at (x, y)
		this.location_ctx.closePath();

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

