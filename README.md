# 律师事务所网站

专业的律师事务所网站系统，支持中英双语，包含用户端网站和管理员后台。

## 技术栈

- **前端**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **数据库**: PostgreSQL + Prisma ORM
- **存储**: 阿里云 OSS
- **部署**: 阿里云 ECS

## 项目结构

```
web/
├── src/
│   ├── app/                    # Next.js App Router
│   │   └── [lang]/             # 双语路由 (zh/en)
│   │       ├── page.tsx        # 首页
│   │       ├── about/          # 关于我们
│   │       ├── services/       # 服务领域
│   │       ├── team/           # 专业团队
│   │       ├── news/           # 资讯动态
│   │       ├── cases/          # 案例展示
│   │       ├── careers/         # 人才招聘
│   │       └── contact/         # 联系我们
│   ├── components/
│   │   ├── layout/             # 布局组件
│   │   ├── blocks/             # 业务组件
│   │   └── admin/              # 管理后台组件
│   ├── lib/
│   │   └── prisma.ts           # Prisma 客户端
│   └── types/
│       └── index.ts            # 类型定义
├── prisma/
│   └── schema.prisma          # 数据库模型
└── scripts/
    └── seed.ts                # 数据库初始化脚本
```

## 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 14+
- npm 或 yarn

### 安装依赖

```bash
cd web
npm install
```

### 配置环境变量

```bash
cp .env.example .env
# 编辑 .env 填写数据库连接信息
```

### 数据库设置

```bash
# 生成 Prisma Client
npx prisma generate

# 运行数据库迁移
npx prisma migrate dev

# 初始化数据
npx ts-node scripts/seed.ts
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

## 部署到阿里云

### 1. 服务器准备

- 购买阿里云 ECS (推荐 Ubuntu 22.04)
- 安装 Node.js 18+
- 安装 PostgreSQL 14+
- 安装 Nginx

### 2. 数据库配置

```bash
# 连接 PostgreSQL
psql -U postgres

# 创建数据库
CREATE DATABASE lawfirm_db;
CREATE USER lawfirm WITH ENCRYPTED PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE lawfirm_db TO lawfirm;
```

### 3. 配置 Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 4. 配置 SSL (可选)

使用 Let's Encrypt 免费证书:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 5. 设置 PM2 进程管理

```bash
npm install -g pm2
pm2 start npm --name "lawfirm" -- start
pm2 save
pm2 startup
```

## 管理后台

访问 http://your-domain.com/admin

默认管理员账号:
- 用户名: admin
- 密码: admin123

**重要**: 请在首次登录后修改密码！

## 功能列表

### 用户端
- [x] 首页 - Banner轮播、律所介绍、资讯动态、业务领域
- [x] 关于我们 - 律所简介、荣誉资质、德善客户
- [x] 服务领域 - 民商事纠纷、刑事纠纷、行政纠纷、涉外纠纷
- [x] 专业团队 - 律师展示
- [x] 资讯动态 - 文章列表
- [x] 案例展示 - 案例列表
- [x] 人才招聘 - 职位信息
- [x] 联系我们 - 联系信息和二维码
- [x] 中英双语切换

### 管理后台
- [ ] 登录认证
- [ ] 页面内容编辑
- [ ] Banner管理
- [ ] 文章管理
- [ ] 团队成员管理
- [ ] 媒体库管理
- [ ] 网站配置

## 许可证

MIT