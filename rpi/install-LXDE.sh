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

echo "$(date +%c) Configuring ${XDG_CURRENT_DESKTOP}" >> "${LOG_FILE}" 2>&1

# ---------------------------------------
# Disable screen saver and energy savings
# ---------------------------------------
xset s noblank >> "${LOG_FILE}" 2>&1
xset s off >> "${LOG_FILE}" 2>&1
xset -dpms >> "${LOG_FILE}" 2>&1

# ----------------
# Install packages
# ----------------
echo "$(date +%c) Installing packages" >> "${LOG_FILE}" 2>&1
apt-get install -y unclutter xdotool >> "${LOG_FILE}" 2>&1
#apt-get install -y lxde-core lxde task-lxde-desktop unclutter xdotool >> "${LOG_FILE}" 2>&1
# update-alternatives --config x-session-manager >> "${LOG_FILE}" 2>&1

# -----------------------
# Disable screen blanking
# -----------------------
echo "$(date +%c) Altering screensaver and energy settings" >> "${LOG_FILE}" 2>&1
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
mkdir -p "/home/${USER}/.config/lxsession/LXDE-pi" >> "${LOG_FILE}" 2>&1
cp "/etc/xdg/lxsession/LXDE-pi/autostart" "/home/${USER}/.config/lxsession/LXDE-pi/" >> "${LOG_FILE}" 2>&1

# ----------------------
# Alter video resolution
# ----------------------
#sed -i 's/#framebuffer_width=1280/framebuffer_width=1920/' '/boot/firmware/config.txt'
#sed -i 's/#framebuffer_height=720/framebuffer_height=1080/' '/boot/firmware/config.txt'
#sed -i 's/#hdmi_group=1/hdmi_group=1/' '/boot/firmware/config.txt'
#sed -i 's/#hdmi_mode=1/hdmi_mode=16/' '/boot/firmware/config.txt'
echo "video=HDMI-1:1920x1080@50,margin_left=40,margin_right=40,margin_top=24,margin_bottom=24" >> "/boot/firmware/config.txt" 
