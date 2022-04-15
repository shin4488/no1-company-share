@echo off

if not exist "./application/node_modules" (
    cd ./application
    call yarn install
    cd ../
)

docker-compose build
docker-compose up -d
