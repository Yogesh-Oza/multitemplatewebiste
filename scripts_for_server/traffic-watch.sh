#!/usr/bin/env bash
# Belatrix traffic watcher — analyze nginx access logs.
# Usage:
#   ./traffic-watch.sh                 # last 24 hours
#   ./traffic-watch.sh --hours 6       # last 6 hours
#   ./traffic-watch.sh --live          # follow log in real time
#   ./traffic-watch.sh --ip 1.2.3.4    # requests from one IP
#   ./traffic-watch.sh --log /path/to/log

set -euo pipefail

LOG_FILE="/var/log/nginx/belatrix-access.log"
HOURS=24
MODE="report"
FILTER_IP=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --hours) HOURS="$2"; shift 2 ;;
    --live) MODE="live"; shift ;;
    --ip) FILTER_IP="$2"; MODE="ip"; shift 2 ;;
    --log) LOG_FILE="$2"; shift 2 ;;
    -h|--help)
      sed -n '2,8p' "$0"
      exit 0
      ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

if [[ ! -f "$LOG_FILE" ]]; then
  echo "Log file not found: $LOG_FILE" >&2
  echo "Ensure nginx belatrix access_log is enabled." >&2
  exit 1
fi

classify_ua() {
  local ua="$1"
  case "$ua" in
    *Googlebot*|*Google-InspectionTool*|*AdsBot-Google*|*Mediapartners-Google*) echo "google_bot" ;;
    *bingbot*|*BingPreview*|*msnbot*) echo "bing_bot" ;;
    *LinkedInBot*|*Twitterbot*|*facebookexternalhit*|*Slackbot*|*Applebot*|*DuckDuckBot*) echo "other_good_bot" ;;
    *GPTBot*|*ChatGPT-User*|*Claude-Web*|*Bytespider*|*PerplexityBot*|*CCBot*) echo "ai_bot" ;;
    *SemrushBot*|*AhrefsBot*|*MJ12bot*|*DotBot*|*YandexBot*|*PetalBot*) echo "seo_bot" ;;
    *curl*|*wget*|*python-requests*|*Go-http-client*|*HeadlessChrome*|*puppeteer*) echo "scanner" ;;
    *Mozilla/5.0*Chrome*|*Mozilla/5.0*Safari*|*Mozilla/5.0*Firefox*|*Mozilla/5.0*Edg*) echo "human" ;;
    "") echo "unknown" ;;
    *) echo "unknown" ;;
  esac
}

if [[ "$MODE" == "live" ]]; then
  echo "Following $LOG_FILE (Ctrl+C to stop)..."
  tail -F "$LOG_FILE"
  exit 0
fi

if [[ "$MODE" == "ip" ]]; then
  echo "=== Requests from $FILTER_IP ==="
  grep -F "$FILTER_IP" "$LOG_FILE" | tail -n 100
  exit 0
fi

SINCE=$(date -d "-${HOURS} hours" '+%d/%b/%Y:%H:%M:%S' 2>/dev/null || date -v-"${HOURS}"H '+%d/%b/%Y:%H:%M:%S')

TMP=$(mktemp)
trap 'rm -f "$TMP"' EXIT

# Parse nginx combined-style lines from belatrix_traffic format
awk -v since="$SINCE" '
  {
    if (match($0, /\[([0-9]{2}\/[A-Za-z]{3}\/[0-9]{4}:[0-9]{2}:[0-9]{2}:[0-9]{2})/, ts)) {
      if (ts[1] < since) next
    }
    ip=$1
  }
  match($0, /"([A-Z]+) ([^ ]+) HTTP/, req) {
    method=req[1]; path=req[2]
  }
  match($0, /" ([0-9]{3}) ([0-9]+) /, st) {
    status=st[1]; bytes=st[2]
  }
  match($0, /"([^"]*)" "([^"]*)"/, refua) {
    referer=refua[1]; ua=refua[2]
  }
  {
    print ip "|" method "|" path "|" status "|" bytes "|" referer "|" ua
  }
' "$LOG_FILE" > "$TMP"

TOTAL_LINES=$(wc -l < "$TMP" | tr -d ' ')
TOTAL_BYTES=$(awk -F'|' '{s+=$5} END {print s+0}' "$TMP")

echo "=============================================="
echo " Belatrix traffic report (last ${HOURS}h)"
echo " Log: $LOG_FILE"
echo "=============================================="
echo "Total requests : $TOTAL_LINES"
awk -v b="$TOTAL_BYTES" 'BEGIN {printf "Total bandwidth: %.2f MB\n", b/1048576}'

echo
echo "--- Traffic by type (requests | bandwidth MB) ---"
awk -F'|' '
  function kind(ua) {
    if (ua ~ /Googlebot|Google-InspectionTool|AdsBot-Google|Mediapartners-Google/) return "google_bot"
    if (ua ~ /bingbot|BingPreview|msnbot/) return "bing_bot"
    if (ua ~ /LinkedInBot|Twitterbot|facebookexternalhit|Slackbot|Applebot|DuckDuckBot/) return "other_good_bot"
    if (ua ~ /GPTBot|ChatGPT-User|Claude-Web|Bytespider|PerplexityBot|CCBot/) return "ai_bot"
    if (ua ~ /SemrushBot|AhrefsBot|MJ12bot|DotBot|YandexBot|PetalBot/) return "seo_bot"
    if (ua ~ /curl|wget|python-requests|Go-http-client|HeadlessChrome|puppeteer/) return "scanner"
    if (ua ~ /Mozilla\/5\.0/ && ua ~ /Chrome|Safari|Firefox|Edg/) return "human"
  if (ua == "") return "unknown"
    return "unknown"
  }
  {
    k=kind($7)
    req[k]++
    bytes[k]+=$5
  }
  END {
    for (k in req) printf "%-16s %6d   %8.2f MB\n", k, req[k], bytes[k]/1048576
  }
' "$TMP" | sort -k2 -nr

echo
echo "--- Top 15 IPs (requests | bandwidth MB) ---"
awk -F'|' '{req[$1]++; bytes[$1]+=$5} END {for (ip in req) printf "%s %6d %8.2f\n", ip, req[ip], bytes[ip]/1048576}' "$TMP" \
  | sort -k2 -nr | head -n 15 \
  | awk '{printf "%-16s %6d req   %8.2f MB\n", $1, $2, $3}'

echo
echo "--- Top 15 paths ---"
awk -F'|' '{path[$3]++} END {for (p in path) print path[p], p}' "$TMP" | sort -nr | head -n 15 | awk '{printf "%6d  %s\n", $1, $2}'

echo
echo "--- Top referrers ---"
awk -F'|' '$6 != "-" && $6 != "" {ref[$6]++} END {for (r in ref) print ref[r], r}' "$TMP" | sort -nr | head -n 10 | awk '{printf "%6d  %s\n", $1, substr($0, index($0,$2))}'

echo
echo "--- Suspicious: scanner/unknown heavy IPs (>50 req) ---"
awk -F'|' '
  function kind(ua) {
    if (ua ~ /curl|wget|python-requests|Go-http-client|HeadlessChrome|puppeteer/) return "scanner"
    if (ua == "" || length(ua) < 12) return "unknown"
    if (ua ~ /Mozilla\/5\.0/ && ua ~ /Chrome|Safari|Firefox|Edg/) return "human"
    return "other"
  }
  {
    k=kind($7)
    if (k == "scanner" || k == "unknown") bad[$1]++
    total[$1]++
  }
  END {
    for (ip in total) if (total[ip] > 50 && bad[ip] > 0) printf "%s total=%d suspicious=%d\n", ip, total[ip], bad[ip]+0
  }
' "$TMP" | sort -t= -k2 -nr | head -n 10

echo
echo "Tip: pm2 logs belatrix | grep traffic_request   (app-level JSON logs)"
echo "Disable app logging: TRAFFIC_LOG_ENABLED=false in /var/www/belatrix/.env.local"
