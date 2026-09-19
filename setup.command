#!/bin/bash

cd `dirname $0`

if [ ! -d ./application/node_modules ]; then
    cd ./application
    yarn install
    cd ../
fi

docker-compose build
docker-compose up -d