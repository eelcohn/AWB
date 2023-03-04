#!/usr/bin/env bash

APP_MAINTAINER="eelcohn"
APP_NAME="AWB"
APP_SOURCE="https://github.com/${APP_MAINTAINER}/${APP_NAME}"
LOG_FILE="/var/log/${APP_NAME}/update.log"
VERSION_FILE="/opt/${APP_NAME}/VERSION"

echo "`date +%c` Updating and rebooting system" >> "${LOG_FILE}" 2>&1

# ----------------------------------
# Check if user has root permissions
# ----------------------------------
if [ "$EUID" -ne 0 ]
then
	echo "Please run as root" >> "${LOG_FILE}" 2>&1
	exit
fi

# ---------------------------
# Remount /boot as read/write
# ---------------------------
mount -o remount,rw /boot

# ------------------------------------------------
# Create log directory if it doesn't exist already
# ------------------------------------------------
[ ! -d "/var/log/${APP_NAME}" ] && mkdir -m 755 -p "/var/log/${APP_NAME}/"

# -------------
# Update system
# -------------
echo "`date +%c` `apt-get -qq -y update`" >> "${LOG_FILE}" 2>&1
echo "`date +%c` `apt-get -qq -y --with-new-pkgs upgrade`" >> "${LOG_FILE}" 2>&1

# ------------------
# Update application
# ------------------
LOCAL_VERSION="`cat ${VERSION_FILE}`"
#EXT_VERSION="`curl -s https://api.github.com/repos/eelcohn/${APP_NAME}/releases/latest | jq -r \".assets[] | select(.name) | .browser_download_url\"`"
EXT_VERSION="`curl -s https://raw.githubusercontent.com/eelcohn/${APP_NAME}/main/VERSION`"
if [ "${LOCAL_VERSION}" != "${EXT_VERSION}" ]
then
	echo "`date +%c` New ${APP_NAME} version found: ${EXT_VERSION} (Local version: ${LOCAL_VERSION})" >> "${LOG_FILE}" 2>&1
	rm -rf "/opt/${APP_NAME}.new" >> "${LOG_FILE}" 2>&1
	git clone ${APP_SOURCE} "/opt/${APP_NAME}.new" >> "${LOG_FILE}" 2>&1
	sudo chmod +x /opt/${APP_NAME}.new/rpi/*.sh >> "${LOG_FILE}" 2>&1
	rm -rf "/opt/${APP_NAME}.old" >> "${LOG_FILE}" 2>&1
	mv -f "/opt/${APP_NAME}" "/opt/${APP_NAME}.old" >> "${LOG_FILE}" 2>&1
	mv -f "/opt/${APP_NAME}.new" "/opt/${APP_NAME}" >> "${LOG_FILE}" 2>&1
	rm -rf "/var/www/html.old" >> "${LOG_FILE}" 2>&1
	mv -f "/var/www/html" "/var/www/html.old" >> "${LOG_FILE}" 2>&1
	mv -f "/opt/${APP_NAME}/html" "/var/www/" >> "${LOG_FILE}" 2>&1
	cp -a "/var/www/html.old/config.json" "/var/www/html/" >> "${LOG_FILE}" 2>&1
	sudo chown -R www-data:www-data /var/www/html >> "${LOG_FILE}" 2>&1
	sudo chmod -R 755 /var/www/html >> "${LOG_FILE}" 2>&1
fi

# -------
# Restart
# -------
echo "`date +%c` Updaing done" >> "${LOG_FILE}" 2>&1

/usr/sbin/shutdown -r now >> "${LOG_FILE}" 2>&1
