#! /bin/sh

cd ~
curl -LOk https://github.com/jsnee/CarPi/archive/master.zip
unzip master.zip
chmod +x CarPi-master/upgrade.sh
chmod +x CarPi-master/update.sh
chmod +x CarPi-master/clean.sh
chmod +x CarPi-master/launch-car-pi.sh
./CarPi-master/upgrade.sh