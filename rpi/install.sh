#!/usr/bin/env bash

# https://gock.net/blog/2020/raspberry-pi-kiosk/
# https://pimylifeup.com/raspberry-pi-kiosk/

APP_NAME="AWB"
APP_FULLNAME="Aviation Weather Board"
APP_SOURCE="https://github.com/eelcohn/${APP_NAME}"
GPIO_SHUTDOWN_PIN="17"
#LOCALE="nl_NL.UTF-8"
LOG_FILE="/var/log/${APP_NAME}/install.log"
WEATHER_URL="http://127.0.0.1/"

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
#if [[ $(lsb_release -c -s | grep "buster") != "buster" ]] && [[ $(lsb_release -c -s | grep "bookworm") != "bookworm" ]]
if [[ ! $(lsb_release -c -s | grep -E "buster|bookworm") ]]
then
	echo "This script was intended for Raspbian OS codename 'buster' or 'bookworm'. You're using a different Raspbian version:"
 	lsb_release -a
	read -p "Are you sure you want to continue?"
fi

# ------------------------------------------------------------------------------------------------------
# Create log directory and tail the log file so the user can see what's going on during the installation
# ------------------------------------------------------------------------------------------------------
mkdir -m 755 -p "/var/log/${APP_NAME}/"
chown root:root "/var/log/${APP_NAME}/"
touch "${LOG_FILE}"
tail -f "${LOG_FILE}" &
echo "$(date +%c) Installer start for ${APP_NAME}" >> "${LOG_FILE}" 2>&1
echo "$(date +%c) Window manager: ${XDG_SESSION_TYPE}" >> "${LOG_FILE}" 2>&1

# -------------
# Update system
# -------------
echo "$(date +%c) Updating system" >> "${LOG_FILE}" 2>&1
apt-get -y update >> "${LOG_FILE}" 2>&1
apt-get -y dist-upgrade >> "${LOG_FILE}" 2>&1
apt-get -y --with-new-pkgs upgrade >> "${LOG_FILE}" 2>&1
apt-get -y clean >> "${LOG_FILE}" 2>&1 
apt-get -y autoremove >> "${LOG_FILE}" 2>&1

# ----------------------
# Fix unattended updates
# ----------------------
echo "$(date +%c) Fixing unattended updates" >> "${LOG_FILE}" 2>&1
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
echo "$(date +%c) Installing packages" >> "${LOG_FILE}" 2>&1
apt-get install -y chromium-browser git imagemagick nano sed tightvncserver unattended-upgrades >> "${LOG_FILE}" 2>&1

# -------------------------
# Install webserver and PHP
# -------------------------
echo "$(date +%c) Installing lighttpd and PHP" >> "${LOG_FILE}" 2>&1
apt-get install -y lighttpd php php-common php-cgi php-curl >> "${LOG_FILE}" 2>&1
# Enable the FastCGI PHP module
lighty-enable-mod fastcgi-php >> "${LOG_FILE}" 2>&1
# Add the current user to the www-data group
usermod -a -G "www-data" "${USER}" >> "${LOG_FILE}" 2>&1
# Limit access to only locahost
echo '
$HTTP["remoteip"] !~ "127.0.0.1" {
    url.access-deny = ( "" )
}
' >> "/etc/lighttpd/lighttpd.conf"
# Enable php-curl extension
PHPVER=$(php -v | head -n 1 | cut --delimiter=" " -f 2 | cut --delimiter="." -f1-2)
find "/etc/php/${PHPVER}/" -name php.ini -exec sed -i "s/;extension=curl/extension=curl/" "{}" \; >> "${LOG_FILE}" 2>&1

# -------------------
# Install application
# -------------------
echo "$(date +%c) Installing ${APP_NAME}" >> "${LOG_FILE}" 2>&1
git clone ${APP_SOURCE} "/opt/${APP_NAME}" >> "${LOG_FILE}" 2>&1
chmod +x /opt/${APP_NAME}/rpi/*.sh >> "${LOG_FILE}" 2>&1
mv -f "/var/www/html" "/var/www/html.old" >> "${LOG_FILE}" 2>&1
mv -f "/opt/${APP_NAME}/html" "/var/www/" >> "${LOG_FILE}" 2>&1
chown -R www-data:www-data /var/www/html >> "${LOG_FILE}" 2>&1
chmod -R 755 /var/www/html >> "${LOG_FILE}" 2>&1

# -------------------------------------------------------------
# Set locale (if needed)
# -------------------------------------------------------------
if [[ -n "${LOCALE}" ]]
then
	echo "$(date +%c) Setting locale to ${LOCALE}" >> "${LOG_FILE}" 2>&1
	locale-gen "${LOCALE}" >> "${LOG_FILE}" 2>&1
	localectl set-locale "LANG=${LOCALE}" >> "${LOG_FILE}" 2>&1
fi

# -------------------------------------------------------------
# Enable NTP time sync (if it's not already enabled by default)
# -------------------------------------------------------------
echo "$(date +%c) Enabling NTP time sync" >> "${LOG_FILE}" 2>&1
timedatectl set-ntp True >> "${LOG_FILE}" 2>&1

# -----------------------------------------
# Add cron job for daily updates and reboot
# -----------------------------------------
echo "$(date +%c) Adding cron job" >> "${LOG_FILE}" 2>&1
# Create crontab file if it doesn't exist yet
[[ -e "/var/spool/cron/crontabs/${USER}" ]] || touch "/var/spool/cron/crontabs/${USER}" >> "${LOG_FILE}" 2>&1
# Add daily cron job
grep -qxF "0 1 * * * /usr/bin/bash /opt/${APP_NAME}/rpi/updater.sh" "/var/spool/cron/crontabs/${USER}" || echo "0 1 * * * /usr/bin/bash /opt/${APP_NAME}/rpi/updater.sh" >> "/var/spool/cron/crontabs/${USERNAME}"
chown "${USER}":"crontab" "/var/spool/cron/crontabs/${USER}" >> "${LOG_FILE}" 2>&1
chmod 600 "/var/spool/cron/crontabs/${USER}" >> "${LOG_FILE}" 2>&1
systemctl force-reload cron >> "${LOG_FILE}" 2>&1

# -----------------------------------------
# Configure GPIO shutdown button
# -----------------------------------------
if [[ -n "${GPIO_SHUTDOWN_PIN}" ]]
then
	if [[ -e "/boot/config.txt" ]]
	then
 		# Pre-bookworm RPi OS
		CONFIG_TXT_FILE="/boot/config.txt"
	else
 		# Bookworm and later RPi OS
		CONFIG_TXT_FILE="/boot/firmware/config.txt"
	fi
	echo "$(date +%c) Configure GPIO${GPIO_SHUTDOWN_PIN} as a shutdown button for the Raspberry PI (active-low)" >> "${LOG_FILE}" 2>&1
	echo "dtoverlay=gpio-shutdown,gpio_pin=${GPIO_SHUTDOWN_PIN},active_low=1,gpio_pull=up" >> "${CONFIG_TXT_FILE}"
fi

# -------------------------------------------------------
# Configure TightVNC server
# -------------------------------------------------------
echo "$(date +%c) Configuring TightVNC" >> "${LOG_FILE}" 2>&1
cp /opt/${APP_NAME}/rpi/tightvncserver.service /etc/systemd/system/ >> "${LOG_FILE}" 2>&1
sed -i "s/USERNAME/${USER}/" /etc/systemd/system/tightvncserver.service >> "${LOG_FILE}" 2>&1
systemctl enable tightvncserver >> "${LOG_FILE}" 2>&1

# -------------------------------------------------------
# Remove unused packages and services to improve security
# -------------------------------------------------------
#echo "$(date +%c) Removing unused packages and services" >> "${LOG_FILE}" 2>&1
#/opt/${APP_NAME}/rpi/lockdown.sh >> "${LOG_FILE}" 2>&1

# ----------------------
# Execute window-manager-specific commands
# ----------------------
WAYFIRE_INI_FILE="/home/${SUDO_USER}/.config/wayfire.ini"
echo "${WAYFIRE_INI_FILE}" >> "${LOG_FILE}" 2>&1
[[ "${XDG_CURRENT_DESKTOP}" == "LXDE" ]] && source "/opt/${APP_NAME}/rpi/install-LXDE.sh"
[[ -e "${WAYFIRE_INI_FILE}" ]] && echo "Wayfire yes" >> "${LOG_FILE}" 2>&1
[[ -e "${WAYFIRE_INI_FILE}" ]] && source "/opt/${APP_NAME}/rpi/install-Wayland.sh"

# ----------------------
# Change the Raspberry Pi boot splash screen
# ----------------------
echo "$(date +%c) Setting custom Raspberry Pi boot splash screen" >> "${LOG_FILE}" 2>&1
SPLASH_SCREEN="/usr/share/plymouth/themes/pix/splash.png"
mv "${SPLASH_SCREEN}" "${SPLASH_SCREEN}.backup" >> "${LOG_FILE}" 2>&1
convert "/opt/${APP_NAME}/rpi/splash.png"[1024x768] \
	-font 'Cantarell-Light' \
	-pointsize 60 -fill black -gravity North -draw "text 1,26 '${APP_FULLNAME}'" \
	-pointsize 60 -fill white -gravity North -draw "text 0,25 '${APP_FULLNAME}'" \
	-pointsize 18 -fill black -gravity SouthWest -draw "text 24,24 'Raspberry Pi OS v$(cat /etc/debian_version) $(getconf LONG_BIT) bit'" \
	-pointsize 18 -fill white -gravity SouthWest -draw "text 25,25 'Raspberry Pi OS v$(cat /etc/debian_version) $(getconf LONG_BIT) bit'" \
 	-pointsize 18 -fill black -gravity SouthEast -draw "text 24,24 '${APP_SOURCE}'" \
	-pointsize 18 -fill white -gravity SouthEast -draw "text 25,25 '${APP_SOURCE}'" \
 	"${SPLASH_SCREEN}" >> "${LOG_FILE}" 2>&1
plymouth-set-default-theme --rebuild-initrd pix

# -------
# Restart
# -------
echo "$(date +%c) Installer done for ${APP_NAME}" >> "${LOG_FILE}" 2>&1
echo -n 'Restarting in 10 seconds'
for i in {0..10}
do
	sleep 1
 	echo -n .
done

shutdown -r 1 >> "${LOG_FILE}" 2>&1
