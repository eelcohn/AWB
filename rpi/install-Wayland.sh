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

echo "$(date +%c) Configuring Wayland}" >> "${LOG_FILE}" 2>&1

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
EXTRAS_PATH="/tmp/wayfire-plugins-extra"
BUILD_PATH="${EXTRAS_PATH}/build"
apt-get install cmake libvulkan-dev meson
# Temp stuuf (remove this?)
#wayfire-dev libglibmm-2.4-dev

if [[ "$(wayfire --version)" == "0.7.5" ]]
then
	# Work-around to get the plugin-compiler working. This can be removed once Raspbian has updated the Wayfire version to >= 0.8.0
	git clone https://github.com/seffs/wayfire-plugins-extra-raspbian "${EXTRAS_PATH}"
else
	git clone https://github.com/WayfireWM/wayfire-plugins-extra "${EXTRAS_PATH}"
fi
meson setup --prefix=/usr --buildtype=release "${BUILD_PATH}" "${EXTRAS_PATH}"

# Temp; test if build/setup by the above command works. If so, then remove this
#cd "${EXTRAS_PATH}"
#meson build --prefix=/usr --buildtype=release <-- old style meson setup
#meson setup --prefix=/usr --buildtype=release

ninja -C "${BUILD_PATH}" && sudo ninja -C "${BUILD_PATH}" install

# Temp; test if build/setup by the above command works. If so, then remove this
# cd ~

rm -rf "${EXTRAS_PATH}"
apt-get remove libvulkan-dev

crudini --set "${WAYFIRE_INI_FILE}" "core" "plugins" "autostart hide-cursor"
#crudini --set "${WAYFIRE_INI_FILE}" "core" "plugins" "autostart autostart-static command pixdecor expo grid hide-cursor move place resize switcher vswitch window-rules wm-actions wort zoom"

# -------------------------------------------------------
# Autostart kiosk script
# -------------------------------------------------------
crudini --set "${WAYFIRE_INI_FILE}" "autostart" "delprofile" "rm -rf ~/.config/chromium"
crudini --set "${WAYFIRE_INI_FILE}" "autostart" "kiosk" "chromium-browser --noerrdialogs --disable-infobars --check-for-update-interval=31536000 --enable-logging --kiosk http://127.0.0.1/"
