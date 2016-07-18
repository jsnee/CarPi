#! /bin/sh

cd /home/pi/car-pi
npm install
node server.js
#x-www-browser http://localhost:3000
#chromium-browser --kiosk http://localhost:3000
