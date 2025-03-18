#!/usr/bin/env bash

xdotool search --class Chrome windowactivate --sync %1 key i windowactivate $(xdotool getactivewindow)
