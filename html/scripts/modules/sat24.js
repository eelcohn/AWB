/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

class Module {
	constructor(id) {
		this.img_id = id;
		this.img_url = 'https://api.sat24.com/animated/NL/visual/' + document.config.sat24.image_size + '/' + document.config.sat24.timezone + '/' + document.config.sat24.location;
		this.refreshInterval = 10 * 60 * 1000; // Refresh interval is 10 minutes

		/* Schedule update of document content */
		this.task = setInterval(
			this.updateData.bind(this),
			this.refreshInterval
		);

		/* Initial fill of document content */
		this.updateData();
	}

	updateData() {
		document.getElementById(this.img_id).src = this.img_url + '?update_rand=' + Math.random();
	}
}

export { Module };

