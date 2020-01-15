#!/bin/bash

killall -9 node
rm -r /home/ec2-user/civilservant -f
git clone https://github.com/G-Thompson-Ops/civilservant.git /home/ec2-user/civilservant
cp /home/ec2-user/config.js /home/ec2-user/civilservant/config.js
cd /home/ec2-user/civilservant
npm install
npm start --silent