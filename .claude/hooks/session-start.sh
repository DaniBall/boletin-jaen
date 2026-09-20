#!/bin/bash
# Prepara el entorno de las sesiones de Claude Code en la web: instala las
# dependencias para que el typecheck, los tests y el linter funcionen desde el
# primer momento. En local no hace nada.
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

cd "${CLAUDE_PROJECT_DIR:-$(dirname "$0")/../..}"

if [ -f package-lock.json ]; then
  npm ci --no-audit --no-fund
else
  # Sin lockfile no se puede usar npm ci.
  npm install --no-audit --no-fund
fi
