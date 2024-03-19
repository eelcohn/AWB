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
if [[ ${XDG_SESSION_TYPE != "X11" ]]
then
	echo "This script only works for the X11 window manager, and you're using the ${XDG_SESSION_TYPE} window manager."
	exit
fi

# ---------------------------------------
# Disable screen saver and energy savings
# ---------------------------------------
xset s noblank >> "${LOG_FILE}" 2>&1
xset s off >> "${LOG_FILE}" 2>&1
xset -dpms >> "${LOG_FILE}" 2>&1

# ----------------
# Install packages
# ----------------
echo "`date +%c` Installing packages" >> "${LOG_FILE}" 2>&1
sudo apt-get install -y lxde-core lxde task-lxde-desktop unclutter xdotool >> "${LOG_FILE}" 2>&1
# update-alternatives --config x-session-manager >> "${LOG_FILE}" 2>&1

# -----------------------
# Disable screen blanking
# -----------------------
echo "`date +%c` Altering screensaver and energy settings" >> "${LOG_FILE}" 2>&1
grep -qxF "@xset s noblank" /etc/xdg/lxsession/LXDE-pi/autostart || echo "@xset s noblank" >> /etc/xdg/lxsession/LXDE-pi/autostart
# Disable Screensaver
grep -qxF "@xset s off" /etc/xdg/lxsession/LXDE-pi/autostart || echo "@xset s off" >> /etc/xdg/lxsession/LXDE-pi/autostart
# Disable display power management system
grep -qxF "@xset -dpms" /etc/xdg/lxsession/LXDE-pi/autostart || echo "@xset -dpms" >> /etc/xdg/lxsession/LXDE-pi/autostart
# Hide mouse-cursor when idle
grep -qxF "@unclutter -idle 5" /etc/xdg/lxsession/LXDE-pi/autostart || echo "@unclutter -idle 1" >> /etc/xdg/lxsession/LXDE-pi/autostart
# Delete any old Chromium profile
grep -qxF "@rm -rf ~/.config/chromium" /etc/xdg/lxsession/LXDE-pi/autostart || echo "@rm -rf ~/.config/chromium" >> /etc/xdg/lxsession/LXDE-pi/autostart
# Autostart browser and load webpage
grep -qxF "@chromium-browser --noerrdialogs --disable-infobars --check-for-update-interval=31536000 --enable-logging --kiosk ${WEATHER_URL} &" /etc/xdg/lxsession/LXDE-pi/autostart || echo "@chromium-browser --noerrdialogs --disable-infobars --check-for-update-interval=31536000 --enable-logging --kiosk ${WEATHER_URL} &" >> /etc/xdg/lxsession/LXDE-pi/autostart
#grep -qxF "@firefox-esr -foreground --kiosk ${WEATHER_URL} &" /etc/xdg/lxsession/LXDE-pi/autostart || echo "@firefox-esr -foreground --kiosk ${WEATHER_URL} &" >> /etc/xdg/lxsession/LXDE-pi/autostart
#@lxpanel --profile LXDE-pi
#@pcmanfm --desktop --profile LXDE-pi
#@xscreensaver -no-splash
# Copy desktop settings to user
mkdir -p /home/${USER}/.config/lxsession/LXDE-pi >> "${LOG_FILE}" 2>&1
cp /etc/xdg/lxsession/LXDE-pi/autostart /home/${USER}/.config/lxsession/LXDE-pi/ >> "${LOG_FILE}" 2>&1

# ----------------------
# Alter video resolution
# ----------------------
sed -i 's/#framebuffer_width=1280/framebuffer_width=1920/' '/boot/config.txt'
sed -i 's/#framebuffer_height=720/framebuffer_height=1080/' '/boot/config.txt'
sed -i 's/#hdmi_group=1/hdmi_group=1/' '/boot/config.txt'
sed -i 's/#hdmi_mode=1/hdmi_mode=16/' '/boot/config.txt'
