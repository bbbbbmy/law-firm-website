#!/bin/bash
# =============================================================================
# 在现有 pgsql-pgsql-1 容器里建 lawfirm 用户 + lawfirm_db
# 用法： bash scripts/init-db.sh <lawfirm_password>
# =============================================================================
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "用法: $0 <lawfirm_user_password>"
  echo "示例: $0 'P@ssw0rd-Str0ng-R@nd0m-32chars'"
  exit 1
fi

LAWFIRM_PASSWORD="$1"
POSTGRES_CONTAINER="pgsql-pgsql-1"

# 1) 确认容器在跑
if ! docker ps --format '{{.Names}}' | grep -q "^${POSTGRES_CONTAINER}\$"; then
  echo "❌ ${POSTGRES_CONTAINER} 没在跑"
  exit 2
fi

# 2) 用 postgres 超级用户连接，建 lawfirm 角色和库
docker exec -e PGPASSWORD=password "$POSTGRES_CONTAINER" psql -U username -d db1 <<SQL
-- 幂等：先清掉（如果有残留）
DROP DATABASE IF EXISTS lawfirm_db;
DROP ROLE IF EXISTS lawfirm;

-- 建用户 + 库
CREATE ROLE lawfirm WITH LOGIN PASSWORD '${LAWFIRM_PASSWORD}';
CREATE DATABASE lawfirm_db OWNER lawfirm;

-- 给 lawfirm 完整权限（避免 prisma migrate 时缺权限）
GRANT ALL PRIVILEGES ON DATABASE lawfirm_db TO lawfirm;
\c lawfirm_db
GRANT ALL ON SCHEMA public TO lawfirm;

\du lawfirm
\l lawfirm_db
SQL

echo "✅ lawfirm 用户 + lawfirm_db 已建好"
echo "下一步："
echo "  export LAWFIRM_DB_PASSWORD='${LAWFIRM_PASSWORD}'"
echo "  echo \$LAWFIRM_DB_PASSWORD > /opt/data/law-firm-website/.env.production"
echo "  cd /opt/data/law-firm-website && docker compose -f docker-compose.production.yml --env-file .env.production up -d"