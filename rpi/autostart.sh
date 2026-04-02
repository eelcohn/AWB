#!/bin/bash

rm -rf ~/.config/chromium
chromium --password-store=basic --noerrdialogs --disable-infobars --check-for-update-interval=31536000 --enable-logging --kiosk http://127.0.0.1/  > /home/weather/chromium-log.txt 2>&1
