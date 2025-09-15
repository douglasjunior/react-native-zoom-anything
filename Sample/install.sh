#!/bin/bash

rm -rf ../node_modules/
rm -rf node_modules/
rm -rf ios/Pods/
yarn install
rm -rf node_modules/react-native-zoom-anything/Sample/ 
rm -rf node_modules/react-native-zoom-anything/.git/

npx -y pod-install
