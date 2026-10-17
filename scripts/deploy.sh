#!/usr/bin/env bash
# Runs ON the deployment server (shipped there by .github/workflows/deploy.yml).
# Pulls the requested image tag, restarts the stack, waits for /api/live,
# and rolls back to the previously running image if the new one fails.
set -euo pipefail

cd "$(dirname "$0")"
TAG="${1:-latest}"
export KOKUNIME_TAG="$TAG"

CONTAINER="kokunime-app"
# Liveness keeps the deploy gate independent of upstream: a healthy container
# that serves stale cache while kusonime is down must not be rolled back.
HEALTH_URL="http://localhost:3000/api/live"
COMPOSE=(docker compose -f docker-compose.prod.yml)

PREV_IMAGE="$(docker inspect -f '{{.Config.Image}}' "$CONTAINER" 2>/dev/null || true)"
echo "deploy tag: $TAG (previous: ${PREV_IMAGE:-none})"

"${COMPOSE[@]}" pull
"${COMPOSE[@]}" up -d --remove-orphans

for _ in $(seq 1 24); do
  if curl -fsS --max-time 5 "$HEALTH_URL" >/dev/null 2>&1; then
    echo "deploy healthy: $TAG"
    exit 0
  fi
  sleep 5
done

echo "health check failed after 120s"
if [ -n "$PREV_IMAGE" ]; then
  PREV_TAG="${PREV_IMAGE##*:}"
  echo "rolling back to $PREV_TAG"
  KOKUNIME_TAG="$PREV_TAG" "${COMPOSE[@]}" up -d --remove-orphans || true
fi
exit 1
