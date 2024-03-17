#!/usr/bin/env bash

# https://gock.net/blog/2020/raspberry-pi-kiosk/
# https://pimylifeup.com/raspberry-pi-kiosk/

APP_NAME="AWB"
APP_SOURCE="https://github.com/eelcohn/${APP_NAME}"
LOG_FILE="/var/log/${APP_NAME}/install.log"
WEATHER_URL="http://127.0.0.1/"
RASPBIAN_OS_CODENAME="bookworm"

# ----------------------------------
# Check if user has root permissions
# ----------------------------------
if [ "$EUID" -ne 0 ]
then
	echo "Please run as root"
	exit
fi

# ----------------------------------
# Check Raspbian OS codename
# ----------------------------------
if [[ $(lsb_release -c -s | grep "${RASPBIAN_OS_CODENAME}") != "${RASPBIAN_OS_CODENAME}" ]]
then
	echo "This script was intended for Raspbian OS codename ${RASPBIAN_OS_CODENAME}. You're using a different Raspbian version:"
 	lsb_release -a
	read -p "Are you sure you want to continue?"
fi

# ------------------------------------------------------------------------------------------------------
# Create log directory and tail the log file so the user can see what's going on during the installation
# ------------------------------------------------------------------------------------------------------
mkdir -m 755 -p "/var/log/${APP_NAME}/"
chown root:root "/var/log/${APP_NAME}/"
echo "`date +%c` Installer start for ${APP_NAME}" >> "${LOG_FILE}" 2>&1
tail -f "${LOG_FILE}" &

# ---------------------------------------
# Disable screen saver and energy savings
# ---------------------------------------
xset s noblank >> "${LOG_FILE}" 2>&1
xset s off >> "${LOG_FILE}" 2>&1
xset -dpms >> "${LOG_FILE}" 2>&1

# -------------
# Update system
# -------------
echo "`date +%c` Updating system" >> "${LOG_FILE}" 2>&1
sudo apt-get -y update >> "${LOG_FILE}" 2>&1
sudo apt-get -y --with-new-pkgs upgrade >> "${LOG_FILE}" 2>&1
sudo apt-get -y clean >> "${LOG_FILE}" 2>&1
sudo apt-get -y autoremove >> "${LOG_FILE}" 2>&1

# ----------------------
# Fix unattended updates
# ----------------------
echo "`date +%c` Fixing unattended updates" >> "${LOG_FILE}" 2>&1
echo 'Unattended-Upgrade::Origins-Pattern {
//      Fix missing Rasbian sources.
        "origin=Debian,codename=${distro_codename},label=Debian";
        "origin=Debian,codename=${distro_codename},label=Debian-Security";
        "origin=Raspbian,codename=${distro_codename},label=Raspbian";
        "origin=Raspberry Pi Foundation,codename=${distro_codename},label=Raspberry Pi Foundation";
};' | sudo tee /etc/apt/apt.conf.d/51unattended-upgrades-raspbian

# ----------------
# Install packages
# ----------------
echo "`date +%c` Installing packages" >> "${LOG_FILE}" 2>&1
sudo apt-get install -y chromium-browser git nano sed tightvncserver unattended-upgrades >> "${LOG_FILE}" 2>&1
# update-alternatives --config x-session-manager >> "${LOG_FILE}" 2>&1

# -------------------------
# Install webserver and PHP
# -------------------------
echo "`date +%c` Installing lighttpd and PHP" >> "${LOG_FILE}" 2>&1
apt-get install -y lighttpd php php-common php-cgi php-curl >> "${LOG_FILE}" 2>&1
# Enable the FastCGI PHP module
lighty-enable-mod fastcgi-php >> "${LOG_FILE}" 2>&1
# Add the current user to the www-data group
sudo usermod -a -G www-data ${USER} >> "${LOG_FILE}" 2>&1
# Limit access to only locahost
echo '
$HTTP["remoteip"] !~ "127.0.0.1" {
    url.access-deny = ( "" )
}
' >> "/etc/lighttpd/lighttpd.conf"
# Enable php-curl extension
PHPVER=$(php -v | head -n 1 | cut --delimiter=" " -f 2 | cut --delimiter="." -f1-2)
sed -i "s/;extension=curl/extension=curl/" "/etc/php/${PHPVER}/cgi/php.ini"

# -------------------
# Install application
# -------------------
echo "`date +%c` Installing ${APP_NAME}" >> "${LOG_FILE}" 2>&1
git clone ${APP_SOURCE} "/opt/${APP_NAME}" >> "${LOG_FILE}" 2>&1
sudo chmod +x /opt/${APP_NAME}/rpi/*.sh >> "${LOG_FILE}" 2>&1
mv -f "/var/www/html" "/var/www/html.old" >> "${LOG_FILE}" 2>&1
mv -f "/opt/${APP_NAME}/html" "/var/www/" >> "${LOG_FILE}" 2>&1
sudo chown -R www-data:www-data /var/www/html >> "${LOG_FILE}" 2>&1
sudo chmod -R 755 /var/www/html >> "${LOG_FILE}" 2>&1

# -------------------------------------------------------------
# Enable NTP time sync (if it's not already enabled by default)
# -------------------------------------------------------------
echo "`date +%c` Enabling NTP time sync" >> "${LOG_FILE}" 2>&1
timedatectl set-ntp True >> "${LOG_FILE}" 2>&1

# -----------------------------------------
# Add cron job for daily updates and reboot
# -----------------------------------------
echo "`date +%c` Adding cron job" >> "${LOG_FILE}" 2>&1

grep -qxF "0 1 * * * /usr/bin/bash /opt/${APP_NAME}/rpi/updater.sh" "/var/spool/cron/crontabs/root" || echo "0 1 * * * /usr/bin/bash /opt/${APP_NAME}/rpi/updater.sh" >> "/var/spool/cron/crontabs/root"
chown root:crontab /var/spool/cron/crontabs/root >> "${LOG_FILE}" 2>&1
chmod 600 /var/spool/cron/crontabs/root >> "${LOG_FILE}" 2>&1
systemctl force-reload cron >> "${LOG_FILE}" 2>&1

# ----------------------
# Alter video resolution
# ----------------------
# Does not work for Wayfire/Wayland:
#xrandr -s 1920x1080

# -------------------------------------------------------
# Remove unused packages and services to improve security
# -------------------------------------------------------
#echo "`date +%c` Removing unused packages and services" >> "${LOG_FILE}" 2>&1
#/opt/${APP_NAME}/rpi/lockdown.sh >> "${LOG_FILE}" 2>&1

# -------------------------------------------------------
# Autostart kiosk script
# -------------------------------------------------------
cat <<EOT >> /home/weather/.config/wayfire.ini
[core]
plugins = autostart hide-cursor

[autostart]
kiosk = rm -rf ~/.config/chromium && chromium-browser --noerrdialogs --disable-infobars --check-for-update-interval=31536000 --enable-logging --kiosk ${WEATHER_URL}
EOT

# -------
# Restart
# -------
echo "`date +%c` Installer done for ${APP_NAME}" >> "${LOG_FILE}" 2>&1
echo 'Restarting in 10 seconds...'
sleep 10
shutdown -r now
