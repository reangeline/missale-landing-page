#!/bin/bash
set -euo pipefail

# Default APP path
APP="${APP:-/Users/reangeline/Projects/Missale/holy_messages}"

# Define source and destination mappings
declare -a MAPPINGS=(
  "$APP/Sources/Resources/Legal/politica-de-privacidade.pt.md:src/content/legal/pt/privacy.md"
  "$APP/Sources/Resources/Legal/termos-de-uso.pt.md:src/content/legal/pt/terms.md"
  "$APP/Sources/Resources/Legal/privacy-policy.en.md:src/content/legal/en/privacy.md"
  "$APP/Sources/Resources/Legal/terms-of-use.en.md:src/content/legal/en/terms.md"
  "$APP/Sources/Resources/Legal/politica-de-privacidad.es.md:src/content/legal/es/privacy.md"
  "$APP/Sources/Resources/Legal/terminos-de-uso.es.md:src/content/legal/es/terms.md"
)

# Process each mapping
for mapping in "${MAPPINGS[@]}"; do
  src="${mapping%:*}"
  dst="${mapping#*:}"

  # Check if source file exists
  if [ ! -f "$src" ]; then
    echo "ERROR: Source file not found: $src" >&2
    exit 1
  fi

  # Create destination directory if needed
  dst_dir=$(dirname "$dst")
  mkdir -p "$dst_dir"

  # Copy file byte-by-byte
  cp "$src" "$dst"

  # Print confirmation
  echo "Copied: $src → $dst"
done
