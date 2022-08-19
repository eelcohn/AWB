#!/usr/bin/env bash

APP_NAME="AWB"
APP_SOURCE="https://github.com/eelcohn/${APP_NAME}"
LOG_FILE="/var/log/${APP_NAME}/update.log"
VERSION_FILE="/opt/${APP_NAME}/VERSION"

echo "`date +%c` Updating and rebooting system" >> "${LOG_FILE}" 2>&1

#
# Check if user has root permissions
#
if [ "$EUID" -ne 0 ]
then
	echo "Please run as root" >> "${LOG_FILE}" 2>&1
	exit
fi

#
# Create log directory if it doesn't exist already
#
[ ! -d "/var/log/${APP_NAME}" ] && mkdir -m 755 -p "/var/log/${APP_NAME}/"

LOCAL_VERSION="`cat ${VERSION_FILE}`"
#EXT_VERSION="`curl -s https://api.github.com/repos/eelcohn/${APP_NAME}/releases/latest | jq -r \".assets[] | select(.name) | .browser_download_url\"`"
EXT_VERSION="`curl -s https://raw.githubusercontent.com/eelcohn/${APP_NAME}/main/VERSION`"

#
# Update system
#
apt-get -y update >> "${LOG_FILE}" 2>&1
apt-get -y --with-new-pkgs upgrade >> "${LOG_FILE}" 2>&1

#
# Update application
#
echo "`date +%c` Local version: ${LOCAL_VERSION}   Ext version: ${EXT_VERSION}" >> "${LOG_FILE}" 2>&1
if [ "${LOCAL_VERSION}" != "${EXT_VERSION}" ]
then
	echo "`date +%c` New ${APP_NAME} version found: ${EXT_VERSION}" >> "${LOG_FILE}" 2>&1
	git clone ${APP_SOURCE} "/tmp/weather" >> "${LOG_FILE}" 2>&1
	mv -f /tmp/weather/VERSION "/opt/${APP_NAME}/" >> "${LOG_FILE}" 2>&1
	mv -f /tmp/weather/*.sh "/opt/${APP_NAME}/" >> "${LOG_FILE}" 2>&1
	sudo chmod 755 /opt/${APP_NAME}/*.sh >> "${LOG_FILE}" 2>&1
	rm -rf "/var/www/html.old" >> "${LOG_FILE}" 2>&1
	mv -f "/var/www/html" "/var/www/html.old" >> "${LOG_FILE}" 2>&1
	mv -f "/tmp/weather/html" "/var/www/" >> "${LOG_FILE}" 2>&1
	cp -a "/var/www/html.old/scripts/config.js" "/var/www/html/scripts/" >> "${LOG_FILE}" 2>&1
	sudo chown -R www-data:www-data /var/www >> "${LOG_FILE}" 2>&1
	sudo chmod -R 755 /var/www >> "${LOG_FILE}" 2>&1
fi

echo "`date +%c` Updaing done" >> "${LOG_FILE}" 2>&1

/usr/sbin/shutdown -r now >> "${LOG_FILE}" 2>&1

