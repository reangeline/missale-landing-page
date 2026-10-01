#!/bin/bash
# Gera public/og.png (1200×630) a partir de scripts/og.html com o Chrome headless.
# Ferramenta local: não roda no build nem no CI.
set -euo pipefail
cd "$(dirname "$0")/.."
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
PROFILE="$(mktemp -d)"
# O Chrome às vezes não encerra sozinho depois da captura; o alarme garante a saída.
perl -e 'alarm shift; exec @ARGV' 12 "$CHROME" --headless=new --disable-gpu --no-first-run \
  --hide-scrollbars --user-data-dir="$PROFILE" --force-device-scale-factor=1 \
  --window-size=1200,630 --screenshot="$PWD/public/og.png" "file://$PWD/scripts/og.html" \
  >/dev/null 2>&1 || true
rm -rf "$PROFILE"
test -s public/og.png && sips -g pixelWidth -g pixelHeight public/og.png
