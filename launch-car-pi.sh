#! /bin/sh

cd /home/pi/car-pi
npm install
pm2 start server.js --name="CarPi"
#x-www-browser http://localhost:3000
chromium-browser --incognito --kiosk http://localhost:3000
