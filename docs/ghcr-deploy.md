# GHCR 部署指南

本文档说明 `law-firm-website` 项目如何通过 GitHub Actions 构建并发布到 GitHub Container Registry（GHCR），以及如何在阿里云 ECS 上拉取运行。

> 当前仓库托管在 **Gitee**，本 CI/CD 仅在同步到 GitHub 后生效；建议在 GitHub 创建同名仓库并启用 push 同步。

---

## 一、产出镜像

| 镜像 | 用途 | 暴露端口 | 容器内进程 |
|---|---|---|---|
| `ghcr.io/<owner>/lawfirm-frontend` | 公开官网 + 后台 UI + 全部 API | `3000` | `node server.js` |
| `ghcr.io/<owner>/lawfirm-backend`  | 仅 API + 后台管理 | `3000` | `node server.js`（`APP_MODE=backend`） |

> 两个镜像共用同一份代码 + Prisma client；区别仅在构建时注入的环境变量：
> - frontend：`NEXT_PUBLIC_BASE_PATH=`（空） → 适合 Traefik 子路径剥离后的根路径服务
> - backend：`NEXT_PUBLIC_APP_MODE=backend` → 仅暴露 `/api/**` 与 `/admin/**`

---

## 二、镜像 Tag 策略

每次构建会同时打多个 tag，方便不同场景使用：

| 场景 | tag 格式 | 示例 |
|---|---|---|
| 默认（main 分支） | `latest` + `sha-xxxxxxx` | `latest`, `sha-abc1234` |
| PR | 仅 `sha-prNN`（不 push） | `sha-pr42` |
| 推送 tag `v1.2.3` | `1.2.3` + `1.2` + `latest` + `sha-xxxxxxx` | `1.2.3`, `1.2`, `latest` |

---

## 三、GitHub 端一次性配置

1. **创建 GitHub 仓库**（与 Gitee 同名 `law-firm-website`），并把当前代码 push 上去：
   ```bash
   cd /opt/data/law-firm-website
   git remote add github git@github.com:<your-org>/law-firm-website.git
   git push github main
   ```
2. **启用 GHCR 写权限**：Settings → Actions → General → Workflow permissions → 勾选 *Read and write permissions*（默认已经够用 `packages: write`）。
3. **调整包可见性**（首次推送后）：进入 Packages 页面，把 `lawfirm-frontend` 和 `lawfirm-backend` 改成 *Public* 或在需要的用户/团队范围内 *Private*。
4. **触发首次构建**：push 到 `main` 分支即可，或 Actions 页面 *Run workflow* 手动触发。

> 仓库内的 `secrets.GITHUB_TOKEN` 由 GitHub 自动注入，**无需手动创建 PAT**。

---

## 四、阿里云 ECS 拉取 + 运行

### 4.1 登录 GHCR（首次）

ECS 上需要 Personal Access Token（`read:packages` 即可）：

```bash
echo "$GITHUB_TOKEN" | docker login ghcr.io -u <your-github-username> --password-stdin
```

### 4.2 docker run（最快验证）

```bash
# 前端
docker run -d --name lawfirm-frontend \
  -p 3000:3000 \
  -e DATABASE_URL='postgresql://user:pass@host:5432/db' \
  -e SESSION_SECRET='<long-random-string>' \
  -e ADMIN_SECRET='<admin-token>' \
  ghcr.io/<owner>/lawfirm-frontend:sha-abc1234

# 后端
docker run -d --name lawfirm-backend \
  -p 3001:3000 \
  -e DATABASE_URL='postgresql://user:pass@host:5432/db' \
  -e SESSION_SECRET='<long-random-string>' \
  -e ADMIN_SECRET='<admin-token>' \
  ghcr.io/<owner>/lawfirm-backend:sha-abc1234
```

### 4.3 docker-compose（推荐，与现有 Traefik 配合）

参考根目录的 `docker-compose.yml` 写法（待补），要点：

```yaml
services:
  frontend:
    image: ghcr.io/<owner>/lawfirm-frontend:sha-${IMAGE_TAG}
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://lawfirm:${DB_PASS}@db:5432/lawfirm
      SESSION_SECRET: ${SESSION_SECRET}
      ADMIN_SECRET:   ${ADMIN_SECRET}
      NEXT_PUBLIC_BASE_PATH: /lawfirm   # 与 Traefik 子路径一致
    labels:
      traefik.enable: "true"
      traefik.http.routers.lawfirm-frontend.rule: "Host(`example.com`) && PathPrefix(`/lawfirm`)"
      traefik.http.routers.lawfirm-frontend.entrypoints: "websecure"
      traefik.http.routers.lawfirm-frontend.tls.certresolver: "letsencrypt"
      traefik.http.services.lawfirm-frontend.loadbalancer.server.port: "3000"
      traefik.http.middlewares.lawfirm-strip.stripprefix.prefixes: "/lawfirm"
      traefik.http.routers.lawfirm-frontend.middlewares: "lawfirm-strip"

  backend:
    image: ghcr.io/<owner>/lawfirm-backend:sha-${IMAGE_TAG}
    restart: unless-stopped
    environment:
      DATABASE_URL: postgresql://lawfirm:${DB_PASS}@db:5432/lawfirm
      SESSION_SECRET: ${SESSION_SECRET}
      ADMIN_SECRET:   ${ADMIN_SECRET}
    labels:
      traefik.http.routers.lawfirm-api.rule: "Host(`example.com`) && (PathPrefix(`/lawfirm/api`) || PathPrefix(`/lawfirm/admin`))"
      traefik.http.services.lawfirm-api.loadbalancer.server.port: "3000"
```

---

## 五、关键环境变量

| 变量 | 必填 | 说明 |
|---|---|---|
| `DATABASE_URL`     | ✅ | Prisma 连接串，例：`postgresql://user:pass@db:5432/lawfirm` |
| `SESSION_SECRET`   | ✅ | iron-session 加密密钥，至少 32 字符随机串 |
| `ADMIN_SECRET`     | ⚠️ | 当前代码读取（详见 `src/lib/session/index.ts`），请与 `.env` 保持一致 |
| `NEXT_PUBLIC_BASE_PATH` | ❌ | 仅 frontend 用，默认 `/lawfirm`；要部署到根路径时设为空 |
| `PORT`             | ❌ | 默认 3000，docker-compose 改端口时同步改 `HOSTNAME` 也无副作用 |

> ⚠️ **安全提醒**：当前代码 `src/lib/session/index.ts:11` 的 `SESSION_SECRET` 兜底值是公开硬编码串，**生产环境务必显式注入**，否则 session 可被伪造。

---

## 六、回滚

```bash
# 把 IMAGE_TAG 换成上一个稳定 sha
export IMAGE_TAG=abc1234
docker compose pull && docker compose up -d
```

GitHub Actions 缓存按 image 分别存（`scope=frontend` / `scope=backend`），回滚时构建会复用缓存，秒级完成。

---

## 七、本地验证（不需要 GHCR）

在把 workflow push 到 GitHub 之前，可以本地 dry-run：

```bash
# 一次性 build 前端镜像
docker build -f docker/frontend.Dockerfile -t lawfirm-frontend:dev .

# 一次性 build 后端镜像
docker build -f docker/backend.Dockerfile -t lawfirm-backend:dev .

# 用现有 .env 跑起来
docker run --rm -p 3000:3000 --env-file .env lawfirm-frontend:dev
```

打开 http://localhost:3000/lawfirm 验证。

---

## 八、CI 触发矩阵

| 触发 | 是否 push | tag |
|---|---|---|
| push 到 `main` / `master` | ✅ | `latest` + `sha-xxxxxxx` |
| 推送 tag `v*.*.*` | ✅ | `1.2.3` + `1.2` + `latest` + `sha-xxxxxxx` |
| PR | ❌（只 build） | `sha-prNN`（仅本地缓存） |
| 手动 `workflow_dispatch` | ✅ | `sha-xxxxxxx`（勾选 *push_latest* 时再加 `latest`） |