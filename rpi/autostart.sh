#!/bin/bash

# Set screen resolution (only for Debian bookworm/trixie)
WAYLAND_DISPLAY="wayland-0" wlr-randr --output HDMI-A-1 --mode 1920x1080@50Hz

# Clear old Chromium browser log
rm -f ~/chromium.log.bak
mv ~/chromium.log ~/chromium.log.bak

# Reset Chromium browser settings
rm -rf ~/.config/chromium

# Start Chromium browser in kiosk mode
chromium --password-store=basic --noerrdialogs --disable-infobars --check-for-update-interval=31536000 --enable-logging --kiosk http://127.0.0.1/  > ~/chromium.log 2>&1
