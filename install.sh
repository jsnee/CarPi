#! /bin/sh

sudo apt-get install bluez pulseaudio-module-bluetooth python-gobject python-gobject-2 node npm chromium-browser -y
sudo npm install pm2 -g
cd car-pi
npm install
pm2 stop all
pm2 start server.js --name="CarPi"
sudo su -c "env PATH=$PATH:/usr/local/bin pm2 startup linux -u pi --hp /home/pi"
pm2 save
sudo reboot