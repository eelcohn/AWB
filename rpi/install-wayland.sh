#!/usr/bin/env bash

LOG_FILE="/var/log/${APP_NAME}/install.log"
WAYFIRE_INI_FILE="~/.config/wayfire.ini"

# ----------------------------------
# Check if user has root permissions
# ----------------------------------
if [ "$EUID" -ne 0 ]
then
	echo "Please run as root"
	exit
fi

# ----------------------------------
# Check the current window manager
# ----------------------------------
if [[ "${XDG_SESSION_TYPE}" != "WAYLAND" ]]
then
	echo "This script only works for the Wayland window manager, and you're using the ${XDG_SESSION_TYPE} window manager."
	exit
fi

echo "$(date +%c) Configuring Wayland" >> "${LOG_FILE}" 2>&1

# ----------------------------------
# Set screen-resolution to 1920x1080 and refresh rate to 50Hz
# ----------------------------------
apt-get install crudini
crudini --set "${WAYFIRE_INI_FILE}" "output:HDMI-A-1" "mode" "1920x1080@50000"
crudini --set "${WAYFIRE_INI_FILE}" "output:HDMI-A-1" "position" "0,0"
crudini --set "${WAYFIRE_INI_FILE}" "output:HDMI-A-1" "transform" "normal"

# ----------------------------------
# Compile extra Wayfire plugins (needed for the hide-cursor plugin)
# ----------------------------------

apt-get install libvulkan-dev
if [[ "$(wayfire --version)" == "0.7.5" ]]
then
	# Work-around to get the plugin-compiler working. This can be removed once Raspbian has updated the Wayfire version to >= 0.8.0
	git clone https://github.com/seffs/wayfire-plugins-extra-raspbian /tmp/wayfire-plugins/extra
else
	git clone https://github.com/WayfireWM/wayfire-plugins-extra /tmp/wayfire-plugins/extra
fi
cd /tmp/wayfire-plugins-extra
meson build --prefix=/usr --buildtype=release
ninja -C build && sudo ninja -C build install
rm -rf /tmp/wayfire-plugins-extra
apt-get remove libvulkan-dev

crudini --set "${WAYFIRE_INI_FILE}" "core" "plugins" "autostart hide-cursor"

# -------------------------------------------------------
# Autostart kiosk script
# -------------------------------------------------------
crudini --set "${WAYFIRE_INI_FILE}" "autostart" "kiosk" "chromium-browser --noerrdialogs --disable-infobars --check-for-update-interval=31536000 --enable-logging --kiosk http://127.0.0.1/"
