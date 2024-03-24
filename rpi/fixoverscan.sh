#!/usr/bin/env bash

# Alter overscan settings so the full-screen desktop is available on normal TV's
if [[ ! $(lsb_release -c -s | grep -E "buster") ]]
then
  sed -i 's/#overscan_left=16/overscan_left=40/' '/boot/config.txt'
  sed -i 's/#overscan_right=16/overscan_right=40/' '/boot/config.txt'
  sed -i 's/#overscan_top=16/overscan_top=24/' '/boot/config.txt'
  sed -i 's/#overscan_bottom=16/overscan_bottom=24/' '/boot/config.txt'
fi
if [[ ! $(lsb_release -c -s | grep -E "bookworm") ]]
then
  echo "video=HDMI-A-1:1920x1080@50,margin_left=40,margin_right=40,margin_top=24,margin_bottom=24" >> /boot/firmware/config.txt
fi
