#!/bin/bash
# Deploy Zenon Consulting Next.js app to /var/www/zenon
set -eu

APP_DIR="/var/www/zenon"
PORT=3004
PM2_NAME="zenon"

echo "=== Deploying Zenon Consulting ==="

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
if [ -f /etc/nginx/sites-available/zenon ]; then
  nginx -t && systemctl reload nginx
  echo "Nginx reloaded"
else
  echo "NOTE: Copy nginx-zenon.conf to /etc/nginx/sites-available/zenon and enable it"
fi

echo "=== Health check ==="
sleep 3
curl -sf "http://127.0.0.1:$PORT/api/health" && echo " OK" || echo " FAILED — check pm2 logs $PM2_NAME"

pm2 status "$PM2_NAME"
