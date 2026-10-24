# scripts

| File | Purpose |
|---|---|
| `init-db.sh` | Initialize law firm database on legacy deployment. |
| `migrate-careers-production.sh` | Explicit `--apply` gate backs up production DB then runs pending Prisma migrations with temporary Node CLI and verifies careers tables; does not swap images. See change: fix-careers-review-blockers. |
