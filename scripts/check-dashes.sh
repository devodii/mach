#!/usr/bin/env bash
# House style: no em dashes (U+2014) or en dashes (U+2013) in prose, comments,
# or UI copy. Use a comma, colon, semicolon, parentheses, or a conjunction.
#
# Exits non-zero and prints every offending line, so it can gate a commit hook
# or CI step.
set -uo pipefail

cd "$(dirname "$0")/.." || exit 1

# LICENSE is third-party text and is deliberately left alone.
hits=$(grep -rnE $'—|–' \
        --include='*.ts' --include='*.tsx' --include='*.js' --include='*.mjs' \
        --include='*.md' --include='*.css' --include='*.json' \
        --include='*.yml' --include='*.yaml' \
        --include='Dockerfile' \
        . 2>/dev/null \
      | grep -v '/node_modules/' \
      | grep -v '/.next/' \
      | grep -v '/_book/' \
      | grep -v '/.pnpm-store/' \
      | grep -v '^./LICENSE')

if [ -n "$hits" ]; then
  echo "Found em/en dashes. Replace with a comma, colon, or conjunction:"
  echo
  echo "$hits"
  exit 1
fi

echo "No em or en dashes found."
