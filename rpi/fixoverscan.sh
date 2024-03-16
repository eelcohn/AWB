#!/usr/bin/env bash

# Alter overscan settings so the full-screen desktop is available on normal TV's
sed -i 's/#overscan_left=16/overscan_left=40/' '/boot/firmware/config.txt'
sed -i 's/#overscan_right=16/overscan_right=40/' '/boot/firmware/config.txt'
sed -i 's/#overscan_top=16/overscan_top=24/' '/boot/firmware/config.txt'
sed -i 's/#overscan_bottom=16/overscan_bottom=24/' '/boot/firmware/config.txt'
