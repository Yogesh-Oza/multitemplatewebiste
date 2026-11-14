#!/bin/bash
set -eu

echo "=== Before ==="
uptime
free -h | head -2
du -sh /root/.pm2/logs 2>/dev/null || true

echo ""
echo "=== Stopping CRM cron PM2 jobs (every 2-5 min — not needed for SVKK) ==="
for name in cron-notifications cron-followups cron-sla cron-instagram-token; do
  if pm2 describe "$name" >/dev/null 2>&1; then
    pm2 delete "$name" || true
    echo "  deleted: $name"
  else
    echo "  skip (not found): $name"
  fi
done

pm2 save

echo ""
echo "=== Flushing PM2 logs ==="
pm2 flush

echo ""
echo "=== Truncating failed-login logs (btmp) ==="
: > /var/log/btmp 2>/dev/null || true
: > /var/log/btmp.1 2>/dev/null || true

echo ""
echo "=== Vacuum systemd journal (keep last 50MB) ==="
journalctl --vacuum-size=50M 2>/dev/null || true

echo ""
echo "=== After ==="
pm2 status
du -sh /root/.pm2/logs 2>/dev/null || true
du -sh /var/log/journal 2>/dev/null || true
free -h | head -2
curl -sf http://127.0.0.1:4000/health && echo " svkk-api: OK" || echo " svkk-api: check needed"
curl -sf -o /dev/null -w "svkk-frontend: %{http_code}\n" http://127.0.0.1:3002/ || true
