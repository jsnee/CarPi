#! /bin/sh

cd ~
rm master.zip
rm -r CarPi-master
cd car-pi
npm install
node server.js
