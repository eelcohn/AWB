#!/usr/bin/env bash

# Alter overscan settings so the full-screen desktop is available on normal TV's
sed -i 's/#overscan_left=16/overscan_left=40/' '/boot/config.txt'
sed -i 's/#overscan_right=16/overscan_right=40/' '/boot/config.txt'
sed -i 's/#overscan_top=16/overscan_top=24/' '/boot/config.txt'
sed -i 's/#overscan_bottom=16/overscan_bottom=24/' '/boot/config.txt'
sed -i 's/#framebuffer_width=1280/framebuffer_width=1920/' '/boot/config.txt'
sed -i 's/#framebuffer_height=720/framebuffer_height=1080/' '/boot/config.txt'
sed -i 's/#hdmi_group=1/hdmi_group=1/' '/boot/config.txt'
sed -i 's/#hdmi_mode=1/hdmi_mode=16/' '/boot/config.txt'
