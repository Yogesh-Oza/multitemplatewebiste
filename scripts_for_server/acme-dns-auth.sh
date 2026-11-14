#!/bin/bash
# Certbot manual-auth-hook for DNS-01
# Writes challenge to /tmp/acme-dns-challenge.txt and waits for /tmp/acme-dns-ready
set -eu
OUT=/tmp/acme-dns-challenge.txt
READY=/tmp/acme-dns-ready
DONE=/tmp/acme-dns-done

rm -f "$READY" "$DONE"
{
  echo "CERTBOT_DOMAIN=${CERTBOT_DOMAIN}"
  echo "CERTBOT_VALIDATION=${CERTBOT_VALIDATION}"
  echo "HOST=_acme-challenge"
  if [ "$CERTBOT_DOMAIN" = "mahagp.in" ] || [ "$CERTBOT_DOMAIN" = "*.mahagp.in" ]; then
    echo "TXT_NAME=_acme-challenge"
  else
    echo "TXT_NAME=_acme-challenge.${CERTBOT_DOMAIN%.mahagp.in}"
  fi
  echo "TXT_VALUE=${CERTBOT_VALIDATION}"
} > "$OUT"

echo "ACME challenge written to $OUT — add TXT on Hostinger, then: touch $READY"

# Wait up to 30 minutes for operator to create TXT + touch ready file
for i in $(seq 1 360); do
  if [ -f "$READY" ]; then
    # Give DNS a bit more time after ready signal
    sleep 15
    echo "ready acknowledged"
    touch "$DONE"
    exit 0
  fi
  sleep 5
done

echo "Timed out waiting for $READY" >&2
exit 1
