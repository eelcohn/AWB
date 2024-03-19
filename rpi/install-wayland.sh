#!/usr/bin/env bash

LOG_FILE="/var/log/${APP_NAME}/install.log"

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
if [[ ${XDG_SESSION_TYPE != "WAYLAND" ]]
then
	echo "This script only works for the Wayland window manager, and you're using the ${XDG_SESSION_TYPE} window manager."
	exit
fi

# ----------------------
# Alter video resolution
# ----------------------
# Does not work for Wayfire/Wayland:
#xrandr -s 1920x1080 >> "${LOG_FILE}" 2>&1

# -------------------------------------------------------
# Autostart kiosk script
# -------------------------------------------------------
cat <<EOT >> /home/weather/.config/wayfire.ini
[core]
plugins = autostart hide-cursor

[autostart]
kiosk = rm -rf ~/.config/chromium && chromium-browser --noerrdialogs --disable-infobars --check-for-update-interval=31536000 --enable-logging --kiosk ${WEATHER_URL}
EOT
