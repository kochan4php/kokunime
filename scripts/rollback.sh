#!/usr/bin/env bash
# Manual rollback companion to deploy.sh. Runs ON the deployment server
# (same directory as docker-compose.prod.yml).
#
#   ./rollback.sh <tag>   # e.g. ./rollback.sh sha-1a2b3c4
#
# Pulls the tag, restarts the stack, waits for /api/live, and rolls forward
# again to whatever was running before if the old tag fails its health gate.
set -euo pipefail

cd "$(dirname "$0")"
TAG="${1:?usage: rollback.sh <tag>}"
export KOKUNIME_TAG="$TAG"

CONTAINER="kokunime-app"
HEALTH_URL="http://localhost:3000/api/live"
COMPOSE=(docker compose -f docker-compose.prod.yml)

PREV_IMAGE="$(docker inspect -f '{{.Config.Image}}' "$CONTAINER" 2>/dev/null || true)"
echo "rollback to: $TAG (currently: ${PREV_IMAGE:-none})"

"${COMPOSE[@]}" pull
"${COMPOSE[@]}" up -d --remove-orphans

for _ in $(seq 1 24); do
  if curl -fsS --max-time 5 "$HEALTH_URL" >/dev/null 2>&1; then
    echo "rollback healthy: $TAG"
    exit 0
  fi
  sleep 5
done

echo "health check failed after 120s"
if [ -n "$PREV_IMAGE" ]; then
  PREV_TAG="${PREV_IMAGE##*:}"
  echo "rolling forward back to $PREV_TAG"
  KOKUNIME_TAG="$PREV_TAG" "${COMPOSE[@]}" up -d --remove-orphans || true
fi
exit 1
