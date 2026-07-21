# =============================================================================
# law-firm-website :: backend image
# 多阶段构建：deps → builder → runner
# 产物：ghcr.io/<owner>/lawfirm-backend:<tag>
# 职责：仅对外提供 /api/** 路由 + 后台管理界面（不含公开官网静态页）
# 实现方式：构建时通过 NEXT_PUBLIC_APP_MODE=backend 把后台与 API 隔离
#           启动后用反向代理把 /lawfirm/api/** → backend，/lawfirm/admin/** → backend
# =============================================================================

# ---------- Stage 1: deps ----------
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY package.json package-lock.json* ./
COPY prisma ./prisma
RUN npm ci --no-audit --no-fund --prefer-offline

# ---------- Stage 2: builder ----------
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# 后端模式：仅暴露 API + admin，不包含公开官网静态页
ENV NEXT_PUBLIC_APP_MODE=backend
# 放开 Node 内存限制（GitHub runner 偶发 build 超 2GB）
ENV NODE_OPTIONS=--max-old-space-size=4096

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate && npm run build

# ---------- Stage 3: runner ----------
FROM node:20-alpine AS runner
RUN apk add --no-cache openssl curl tini
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NEXT_PUBLIC_APP_MODE=backend

RUN addgroup --system --gid 1001 nodejs \
 && adduser  --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://127.0.0.1:3000/api/health || exit 1

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]