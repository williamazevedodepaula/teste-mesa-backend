#!/bin/bash


git pull origin main 
sudo docker-compose -f docker-compose.yml -f docker-compose.production.override.yml build
sudo docker-compose -f docker-compose.yml -f docker-compose.production.override.yml down
sudo docker-compose -f docker-compose.yml -f docker-compose.production.override.yml up -d