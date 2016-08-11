#! /bin/sh

sudo apt-get install bluez pulseaudio-module-bluetooth python-gobject python-gobject-2 node npm chromium-browser -y
sudo npm install pm2 -g
cd car-pi
npm install
pm2 stop all
pm2 start server.js --name="CarPi"
sudo pm2 startup
pm2 save
sudo reboot