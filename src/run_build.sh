#!/bin/bash

if [ "$#" -lt 1 ]; then
   echo "Please enter deployment mode: dev | beta | prod"
   exit
fi

svn update
build=`svn info . | egrep "Revision: [0-9]+" | cut -d " " -f2`
major=1
minor=0
version=${major}.${minor}.${build}
gsed -i -E "s/REACT_APP_VERSION=(\S+)/REACT_APP_VERSION=${version}/g" package.json
DEVHOST=max.mns.vc
gsed -i -E "s/\"HOST=(\S+)/\"HOST=${DEVHOST}/g" package.json
REACT_APP_API_USER=apiadmin
gsed -i -E "s/REACT_APP_API_USER=(\S+)/REACT_APP_API_USER=${REACT_APP_API_USER}/g" package.json
REACT_APP_API_PASSWORD=gokstad
gsed -i -E "s/REACT_APP_API_PASSWORD=(\S+)/REACT_APP_API_PASSWORD=${REACT_APP_API_PASSWORD}/g" package.json
REACT_APP_WSS_USER=wssadmin
gsed -i -E "s/REACT_APP_WSS_USER=(\S+)/REACT_APP_WSS_USER=${REACT_APP_WSS_USER}/g" package.json
REACT_APP_WSS_PASSWORD=pokemon
gsed -i -E "s/REACT_APP_WSS_PASSWORD=(\S+)/REACT_APP_WSS_PASSWORD=${REACT_APP_WSS_PASSWORD}/g" package.json

if [[ "$1" == "dev" ]]; then
   REACT_APP_API_HOST=max.mns.vc
elif [[ "$1" == "beta" ]]; then 
   REACT_APP_API_HOST=beta.play.vc
elif [[ "$1" == "prod" ]]; then 
   REACT_APP_API_HOST=my.play.vc
fi
gsed -i -E "s/REACT_APP_API_HOST=(\S+)/REACT_APP_API_HOST=${REACT_APP_API_HOST}/g" package.json

#
gsed -E "s/\"https:\/\/(\S+):5004/\"https:\/\/${DEVHOST}:5004/g" package.json

read -p "Would you like to build package (Y|y|N|n)? " yn
echo $yn
if [[ $yn =~ ^[Yy]$ ]]
then
   npm run build
fi
