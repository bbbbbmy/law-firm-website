// 根路径 / 的页面
// 之前是直接 redirect('/zh')，但这导致访问 / 的客户端只看到 302/307 响应，
// 搜索引擎验证工具（如 Baidu ziyuan.baidu.com）可能在 200 响应的 body 里找 meta tag，
// 不跟随跳转就找不到。
// 改：直接渲染一个含所有 verification meta + 客户端 JS 跳转的 HTML。

const VERIFICATION_META = [
  { name: 'msvalidate.01', content: 'A8DF2D84B5E8F3A4C567534AF972FF33' }, // Bing
  { name: 'baidu-site-verification', content: 'codeva-m0eVVSmqA5' }, // Baidu
  { name: '360-site-verification', content: 'c3710f1db20ec6ca15db35d7749d4442' }, // 360
  { name: 'sogou_site_verification', content: 'BV4xVAo1mz' }, // Sogou
]

export default function Root() {
  const metaTags = VERIFICATION_META
    .map((m) => `<meta name="${m.name}" content="${m.content}" />`)
    .join('\n    ')

  // 直接返回 HTML（Next.js server component 必须返回 JSX，绕过 layout 渲染）
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8" />
  ${metaTags}
  <title>江苏德善(新沂)律师事务所</title>
  <meta http-equiv="refresh" content="3;url=https://www.deshanxinyi.com/lawfirm/zh" />
  <script>window.location.replace("https://www.deshanxinyi.com/lawfirm/zh")</script>
</head>
<body>
  <p>正在前往 <a href="https://www.deshanxinyi.com/lawfirm/zh">江苏德善(新沂)律师事务所</a> ...</p>
</body>
</html>`

  // Next.js server component must return JSX. Return dangerouslySetInnerHTML wrapper.
  return (
    <div dangerouslySetInnerHTML={{ __html: html }} />
  )
}
