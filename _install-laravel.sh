#!/bin/sh
cd $1
composer install
chmod -R 777 storage
cp .env.example .env
php artisan key:generate
npm i
npm run dev
