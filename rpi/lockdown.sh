#!/usr/bin/env bash

APP_NAME="AWB"
LOG_FILE="/var/log/${APP_NAME}/install.log"

#
# Check if user has root permissions
#
if [ "$EUID" -ne 0 ]
then
	echo "Please run as root"
	exit
fi

echo "`date +%c` Running lockdown script" >> "${LOG_FILE}" 2>&1

#
# Remove unused packages
#
echo "`date +%c` Removing unused packages" >> "${LOG_FILE}" 2>&1
sudo apt-get -y purge libreoffice* realvnc* vlc >> "${LOG_FILE}" 2>&1
sudo apt-get -y purge wolfram-engine scratch scratch2 nuscratch sonic-pi idle3 smartsim java-common minecraft-pi >> "${LOG_FILE}" 2>&1
sudo apt-get -y autoremove >> "${LOG_FILE}" 2>&1
sudo apt-get -y clean >> "${LOG_FILE}" 2>&1

#
# Disable Bluetooth
#
echo "`date +%c` Disabling BlueTooth" >> "${LOG_FILE}" 2>&1
#rfkill >> "${LOG_FILE}" 2>&1
systemctl disable hciuart >> "${LOG_FILE}" 2>&1

echo "`date +%c` Lockdown script done" >> "${LOG_FILE}" 2>&1

