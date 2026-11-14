#!/bin/bash
# Deploy MahaGP (gram-panchayat) Next.js app to /var/www/mahagp
set -eu

APP_DIR="/var/www/mahagp"
PORT=3008
PM2_NAME="mahagp"

echo "=== Deploying MahaGP ==="

mkdir -p "$APP_DIR"

cd "$APP_DIR"

if [ ! -f package.json ]; then
  echo "ERROR: package.json not found in $APP_DIR — upload the app first"
  exit 1
fi

echo "Installing dependencies..."
npm ci 2>/dev/null || npm install

echo "Building..."
npm run build

echo "Pruning dev dependencies..."
npm prune --omit=dev 2>/dev/null || true

echo "Starting with PM2 on port $PORT..."
export PORT=$PORT
export NODE_ENV=production

if pm2 describe "$PM2_NAME" >/dev/null 2>&1; then
  pm2 delete "$PM2_NAME" || true
fi

PORT=$PORT NODE_ENV=production pm2 start npm --name "$PM2_NAME" -- start
pm2 save

echo "=== Nginx ==="
if [ -f /etc/nginx/sites-available/mahagp ]; then
  nginx -t && systemctl reload nginx
  echo "Nginx reloaded"
else
  echo "NOTE: Copy nginx-mahagp.conf to /etc/nginx/sites-available/mahagp and enable it"
fi

echo "=== Health check ==="
sleep 3
curl -sf -o /dev/null -w "%{http_code}" -H "Host: mahagp.in" "http://127.0.0.1:$PORT/" && echo " OK" || echo " FAILED — check pm2 logs $PM2_NAME"

pm2 status "$PM2_NAME"
