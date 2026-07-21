# =============================================================================
# law-firm-website :: frontend image
# 多阶段构建：deps → builder → runner
# 产物：ghcr.io/<owner>/lawfirm-frontend:<tag>
# 职责：对外提供公开官网（含 basePath=/lawfirm）+ 后台 UI + 全部 API 路由
# =============================================================================

# ---------- Stage 1: deps ----------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# 复制依赖清单，先装依赖（利用 Docker 层缓存）
COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci --no-audit --no-fund --prefer-offline

# ---------- Stage 2: builder ----------
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# 复制已安装的依赖
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 生成 Prisma Client（代码里有 @prisma/client 运行时依赖）
RUN npx prisma generate

# 设置 NEXT_PUBLIC_BASE_PATH 由运行时环境变量决定，build 阶段用占位值。
# 镜像启动时可在 docker-compose 里覆盖为 /lawfirm 或空字符串。
ENV NEXT_PUBLIC_BASE_PATH=/lawfirm
# 放开 Node 内存限制（GitHub runner 偶发 build 超 2GB）
ENV NODE_OPTIONS=--max-old-space-size=4096
RUN npm run build

# ---------- Stage 3: runner ----------
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl curl tini
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# 非 root 用户运行
RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

# 复制 standalone 输出（包含最小可运行 node_modules 子集）
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# Prisma client 需要 schema 才能在运行时使用
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]