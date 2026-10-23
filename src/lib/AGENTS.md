# src/lib

| File | Purpose |
|---|---|
| `careersContent.ts` | 「加入我们」页面内容契约：`CareersContentData` / `CareersCardData` / `CareersJobData` types，`DEFAULT_CONTENT` / `DEFAULT_CARDS` / `DEFAULT_JOBS` (zh+en)，兜底常量 `CAREERS_HERO_FALLBACK` / `CAREERS_ENV_IMAGE_FALLBACK` / `CAREERS_CONTACT_FALLBACK`，helpers `splitParagraphs` (按 `\n\n` 分段，段内单换行折叠为空格) and `sortByOrder`. Single source of truth shared by public page, admin editor and `prisma/seed.ts`. |
| `clientBasePath.ts` | Client-only: splits `window.location.pathname` at `/admin` to derive basePath for `fetch()`. Returns `''` during SSR. Export: `clientBasePath`. |
| `prisma.ts` | Prisma singleton with `PrismaPg` adapter; caches client+pool on `globalThis` outside production. Export: `prisma`. |
| `publicUrl.ts` | Concatenates a stored media path onto `NEXT_PUBLIC_SITE_URL` for absolute copy-URL display. Opaque to the path — callers must not pre-append basePath. Export: `publicUrl`. |
| `session/` | `iron-session` admin session helpers. Export: `getSession`, `sessionOptions`. |
| `upload.ts` | Writes uploads to OSS when `OSS_ACCESS_KEY_ID` + `OSS_BUCKET` are set, else to `public/uploads/<type>/`. Export: `uploadFile`. |
| `url.ts` | `buildHref(path, lang?)` → `/zh/team` style path WITHOUT basePath (`<Link>` adds it). Export: `buildHref`. |

## Contracts

- `splitParagraphs` is what makes 后台 textarea → 渲染 work: DB stores `\n\n`-separated prose, components render one `<p className="text-indent-2em">` per paragraph. Changing the separator means changing this helper.
- `careersContent.ts` is imported by `prisma/seed.ts` via a relative `../src/lib/careersContent` path — keep it free of server-only imports.