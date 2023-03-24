/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */

const ID_SYSTEMMESSAGE = 'systemmessage';
const CLASS_SYSTEMMESSAGE_SHOW = 'systemmessage-show';
const ICON_TREND_DOWN = 'mdi-arrow-bottom-right';
const ICON_TREND_UP = 'mdi-arrow-top-right';
const WIND_DIRECTIONS = [
	'N',
	'NNE',
	'NE',
	'ENE',
	'E',
	'ESE',
	'SE',
	'SSE',
	'S',
	'SSW',
	'SW',
	'WSW',
	'W',
	'WNW',
	'NW',
	'NNW',
];

/* Create a system message popup modal */
function createSystemMessage(message) {
	document.getElementById(ID_SYSTEMMESSAGE).innerHTML = message;
	document.getElementById(ID_SYSTEMMESSAGE).classList.add(CLASS_SYSTEMMESSAGE_SHOW);
}

/* Remove a system message popup modal */
function removeSystemMessage() {
	document.getElementById(ID_SYSTEMMESSAGE).classList.remove(CLASS_SYSTEMMESSAGE_SHOW);
}

/* Set compass needle */
function setCompass(id, degrees) {
	if (degrees > 180) {
		degrees -= 360;
	}
	document.getElementById(id).style.transform = 'rotate(' + degrees + 'deg)';
}

/* Calculate trend TODO make a generic function */
function setTrend(id, current, previous) {
	if (previous !== null) {
		if (Number(current) < Number(previous)) {
			document.getElementById(id).innerHTML = '<span class="iconify" data-icon="' + ICON_TREND_DOWN + '"></span>';
//			document.getElementById(id).dataset.icon = ICON_TREND_DOWN;
		} else if (Number(current) > Number(previous)) {
			document.getElementById(id).innerHTML = '<span class="iconify" data-icon="' + ICON_TREND_UP + '"></span>';
//			document.getElementById(id).dataset.icon = ICON_TREND_UP;
		} else {
			document.getElementById(id).innerHTML = '';
//			document.getElementById(id).dataset.icon = null;
		}
	}
}

/* Returns a readable string representing the wind direction */
function windDegreesToDirection(degrees) {
	degrees += ((360 / WIND_DIRECTIONS.length) / 2);
	if (degrees >= 360) {
		degrees -= 360;
	}
	return WIND_DIRECTIONS[Math.floor(degrees / (360 / WIND_DIRECTIONS.length))];
}

export {
	createSystemMessage,
	removeSystemMessage,
	setCompass,
	setTrend,
	windDegreesToDirection,
};

