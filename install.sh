#! /bin/sh

sudo apt-get install bluez python-gobject python-gobject-2 node npm chromium-browser python-dev libbluetooth-dev -y
#sudo apt-get install pulseaudio-module-bluetooth
#Use custom package now
cd car-pi
#Make sure pulseaudio-module-bluetooth isn't already installed
sudo dpkg -i --skip-same-version lib/pulseaudio-utils_5.0-13_armhf.deb
#sudo apt-get -f install
sudo dpkg -i --skip-same-version lib/pulseaudio_5.0-13_armhf.deb
sudo dpkg -i --skip-same-version lib/pulseaudio-module-x11.0-13_armhf.deb
sudo dpkg -i --skip-same-version lib/pulseaudio-module-bluetooth_5.0-13_armhf.deb
sudo npm install pm2 -g
sudo pip install pybluez
npm install
#pm2 stop all
#pm2 start server.js --name="CarPi"
#sudo su -c "env PATH=$PATH:/usr/local/bin pm2 startup linux -u pi --hp /home/pi"
#pm2 save
sudo reboot