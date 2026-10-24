# 「加入我们」生产上线检查

本分支新增 `careers_contents`、`careers_cards`、`careers_jobs`。GitHub Actions 只构建镜像，**不会迁移生产数据库**；公开页面在查询失败时回退默认文案，不能用“页面打开了”证明数据库已迁移。后台保存依赖这些表，没有迁移会返回 500。

在生产服务器 `8.133.204.5`，**合并后、新镜像切换前**，按顺序执行：

1. 让 `/home/admin/law-firm-repo` 检出目标发布版本（含 `prisma/migrations/20261023170000_careers_content/migration.sql`）。不要只在未合并的功能分支执行生产迁移。
2. 运行 `bash /home/admin/law-firm-repo/scripts/migrate-careers-production.sh --apply`。脚本先备份数据库到 `/opt/law-firm/backups/`，再在一次性 Node 容器中执行 `prisma migrate deploy`，并验证三个新表。失败则**不要切换镜像**，保留备份排查。
3. 确认 GitHub Actions 构建成功、两个 GHCR 镜像均可拉取且对应目标 commit。仅修改生产 `/opt/law-firm/.env` 的 `IMAGE_TAG`，`docker compose up -d --no-deps frontend backend`，等待两容器 healthy。
4. 检查 `/lawfirm/zh/careers` 与 `/lawfirm/en/careers` 的页面、四个「立即咨询」链接（应直达 `/lawfirm/{lang}/contact`），在登录后的 `/lawfirm/admin/pages/careers` 保存一项中文编辑，刷新公开页确认显示；再测试英文独立保存。

不需对生产运行 `prisma migrate dev`，也**不要运行全量 `prisma db seed`** 来代替迁移；没有 careers 行时后台第一次保存会按当前默认值创建该语言的完整内容及卡片。迁移前旧数据不会被修改；需要回滚时保留 DB 备份和旧镜像 tag，先制定数据恢复方案，不要盲目回滚已应用的迁移。
