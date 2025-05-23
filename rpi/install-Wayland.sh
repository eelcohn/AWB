#!/usr/bin/env bash

APP_NAME="AWB"
LOG_FILE="/var/log/${APP_NAME}/install.log"
WAYFIRE_INI_FILE="/home/${SUDO_USER}/.config/wayfire.ini"
AUTOSTART_PATH="/home/${SUDO_USER}/autostart/"
AUTOSTART_FILE="/home/${SUDO_USER}/autostart/${APP_NAME}.desktop"
VIDEO_RESOLUTION_HEIGHT="1080"
VIDEO_RESOLUTION_WIDTH="1920"
VIDEO_FRAMERATE="50000"

# ----------------------------------
# Check if user has root permissions
# ----------------------------------
if [[ "$EUID" -ne 0 ]]
then
	echo "Please run as root" >> "${LOG_FILE}" 2>&1
	exit
fi

# ----------------------------------
# Check if wayfire.ini file exists
# ----------------------------------
#if [[ ! -e "${WAYFIRE_INI_FILE}" ]]
#then
#	echo "WayfireCould not find wayfire.ini file." >> "${LOG_FILE}" 2>&1
#	echo "${WAYFIRE_INI_FILE}" >> "${LOG_FILE}" 2>&1
#	exit
#fi

echo "$(date +%c) Wayfire: Configuring Wayland" >> "${LOG_FILE}" 2>&1
apt-get -y install crudini >> "${LOG_FILE}" 2>&1

# ----------------------------------
# Compile extra Wayfire plugins (needed for the hide-cursor plugin)
# ----------------------------------
echo "$(date +%c) Wayfire: compiling and installing Wayfire extra plugins" >> "${LOG_FILE}" 2>&1
echo "$(date +%c) Wayfire: found Wayfire version $(wayfire --version)" >> "${LOG_FILE}" 2>&1
EXTRAS_PATH="/tmp/wayfire-plugins-extra"
BUILD_PATH="${EXTRAS_PATH}/build"
apt-get -y install cmake libglibmm-2.68-dev libvulkan-dev meson wayfire-dev >> "${LOG_FILE}" 2>&1
# libglibmm-2.4-dev

if [[ "$(wayfire --version)" == 0.7.5* ]]
then
	# Work-around to get the plugin-compiler working. This can be removed once Raspbian has updated the Wayfire version to >= 0.8.0
	git clone https://github.com/seffs/wayfire-plugins-extra-raspbian "${EXTRAS_PATH}" >> "${LOG_FILE}" 2>&1
else
	git clone https://github.com/WayfireWM/wayfire-plugins-extra "${EXTRAS_PATH}" >> "${LOG_FILE}" 2>&1
fi
PKG_CONFIG_PATH="/usr/lib/aarch64-linux-gnu/pkgconfig/"
meson setup --prefix=/usr --buildtype=release "${BUILD_PATH}" "${EXTRAS_PATH}" >> "${LOG_FILE}" 2>&1

# Temp; test if build/setup by the above command works. If so, then remove this
#cd "${EXTRAS_PATH}"
#meson build --prefix=/usr --buildtype=release <-- old style meson setup
#meson setup --prefix=/usr --buildtype=release

ninja -C "${BUILD_PATH}" && sudo ninja -C "${BUILD_PATH}" install >> "${LOG_FILE}" 2>&1

# Temp; test if build/setup by the above command works. If so, then remove this
# cd ~

rm -rf "${EXTRAS_PATH}" >> "${LOG_FILE}" 2>&1
apt-get -y remove libvulkan-dev >> "${LOG_FILE}" 2>&1

crudini --set "${WAYFIRE_INI_FILE}" "core" "plugins" "autostart hide-cursor" >> "${LOG_FILE}" 2>&1
#crudini --set "${WAYFIRE_INI_FILE}" "core" "plugins" "autostart autostart-static command pixdecor expo grid hide-cursor move place resize switcher vswitch window-rules wm-actions wort zoom" >> "${LOG_FILE}" 2>&1

# ----------------------------------
# Set screen-resolution to 1920x1080 and refresh rate to 50Hz
# ----------------------------------
echo "$(date +%c) Wayfire: setting display resolution" >> "${LOG_FILE}" 2>&1
DISPLAY="$(loginctl show-user "$USER" --property Display --value)"
#crudini --set "${WAYFIRE_INI_FILE}" "output:HDMI-A-$(DISPLAY)" "mode" "${VIDEO_RESOLUTION_WIDTH}x${VIDEO_RESOLUTION_HEIGHT}@${VIDEO_FRAMERATE}" >> "${LOG_FILE}" 2>&1
#crudini --set "${WAYFIRE_INI_FILE}" "output:HDMI-A-$(DISPLAY)" "position" "0,0" >> "${LOG_FILE}" 2>&1
#crudini --set "${WAYFIRE_INI_FILE}" "output:HDMI-A-$(DISPLAY)" "transform" "normal" >> "${LOG_FILE}" 2>&1
crudini --set "${WAYFIRE_INI_FILE}" "output:HDMI-A-1" "mode" "${VIDEO_RESOLUTION_WIDTH}x${VIDEO_RESOLUTION_HEIGHT}@${VIDEO_FRAMERATE}" >> "${LOG_FILE}" 2>&1
crudini --set "${WAYFIRE_INI_FILE}" "output:HDMI-A-1" "position" "0,0" >> "${LOG_FILE}" 2>&1
crudini --set "${WAYFIRE_INI_FILE}" "output:HDMI-A-1" "transform" "normal" >> "${LOG_FILE}" 2>&1

# -------------------------------------------------------
# Autostart kiosk script
# -------------------------------------------------------
echo "$(date +%c) Wayfire: configuring autostart kiosk script" >> "${LOG_FILE}" 2>&1
#crudini --set "${WAYFIRE_INI_FILE}" "autostart" "delprofile" "rm -rf ~/.config/chromium" >> "${LOG_FILE}" 2>&1
#crudini --set "${WAYFIRE_INI_FILE}" "autostart" "kiosk" "chromium-browser --noerrdialogs --disable-infobars --check-for-update-interval=31536000 --enable-logging --kiosk http://127.0.0.1/" >> "${LOG_FILE}" 2>&1
mkdir -p "${AUTOSTART_PATH}"
crudini --set "${AUTOSTART_FILE}" "Desktop Entry" "Type" "Application" >> "${LOG_FILE}" 2>&1
crudini --set "${AUTOSTART_FILE}" "Desktop Entry" "Name" "${APP_NAME}" >> "${LOG_FILE}" 2>&1
crudini --set "${AUTOSTART_FILE}" "Desktop Entry" "Exec" "bash -c \"rm -rf ~/.config/chromium && chromium-browser --noerrdialogs --disable-infobars --check-for-update-interval=31536000 --enable-logging --kiosk http://127.0.0.1/ > /dev/null & \"" >> "${LOG_FILE}" 2>&1
