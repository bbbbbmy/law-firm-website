#!/usr/bin/env bash
# Run on 8.133.204.5 before deploying an image that reads careers_* tables.
set -euo pipefail

if [[ "${1:-}" != '--apply' || $# -ne 1 ]]; then
  echo "Usage: $0 --apply (backup production DB, then apply pending Prisma migrations)" >&2
  exit 2
fi

DEPLOY_DIR=/opt/law-firm
REPO_DIR=/home/admin/law-firm-repo
[[ -f "$REPO_DIR/prisma/migrations/20261023170000_careers_content/migration.sql" ]] || {
  echo 'Careers migration not present in server checkout. Fetch/check out intended release first.' >&2
  exit 1
}
[[ -f "$DEPLOY_DIR/.env" ]] || { echo 'Deployment .env not found' >&2; exit 1; }
set -a
# Production compose uses this trusted deployment configuration for DB credentials.
# shellcheck disable=SC1091
source "$DEPLOY_DIR/.env"
set +a
: "${LAWFIRM_DB_PASSWORD:?LAWFIRM_DB_PASSWORD missing}"

umask 077
mkdir -p "$DEPLOY_DIR/backups"
backup="$DEPLOY_DIR/backups/before-careers-$(date +%Y%m%d-%H%M%S).dump"
# Stop immediately if the backup fails or is empty; never migrate without a backup.
sudo docker exec lawfirm-postgres \
  pg_dump -U postgres -d lawfirm_db -Fc > "$backup"
[[ -s "$backup" ]] || { echo 'Empty DB backup; migration stopped' >&2; exit 1; }
echo "Production backup: $backup"

# The deployed standalone app image does not contain the Prisma CLI. Run the
# migration from this checkout in a disposable Node container on the DB network.
# Keep node_modules in an isolated volume; do not change repo files or app containers.
sudo --preserve-env=LAWFIRM_DB_PASSWORD docker run --rm --network traefik \
  --mount "type=bind,src=$REPO_DIR,dst=/src,readonly" \
  --mount 'type=volume,src=lawfirm-careers-migrate-node-modules,dst=/app/node_modules' \
  --workdir /app -e LAWFIRM_DB_PASSWORD node:20-alpine \
  sh -ec 'apk add --no-cache openssl >/dev/null; cp -a /src/. /app/; export DATABASE_URL="postgresql://lawfirm:${LAWFIRM_DB_PASSWORD}@lawfirm-postgres:5432/lawfirm_db?schema=public"; npm ci --no-audit --no-fund; npx prisma migrate deploy'

# Verify required tables exist before swapping the frontend/backend image tag.
sudo docker exec lawfirm-postgres psql \
  -U postgres -d lawfirm_db -Atc \
  "SELECT to_regclass('public.careers_contents'), to_regclass('public.careers_cards'), to_regclass('public.careers_jobs')" \
  | grep -qx 'careers_contents|careers_cards|careers_jobs'
echo 'Careers tables ready; deploy the new image and verify admin save.'
