#! /bin/sh

cd ~
rm master.zip
rm -r CarPi-master
cd car-pi
killall node
npm install
node server.js
