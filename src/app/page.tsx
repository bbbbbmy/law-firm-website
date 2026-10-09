// 根路径 / 的页面
//
// 之前 src/app/page.tsx 是直接 redirect('/zh')——这是个 302/307 跳转响应。
// 但很多 HTML meta 验证工具（Baidu ziyuan 等）只检查 200 响应的 body，
// 不跟随 302 跳转，所以 Baidu 验证一直失败。
//
// 这个页面在根路径 / 上直接渲染 200 响应，body 包含所有搜索引擎的
// verification meta + 一个客户端 JS 跳转（3 秒后到 /lawfirm/zh），
// 用户体验上是自动跳转，验证工具看 200 响应的 body 也能找到 meta。

export const dynamic = 'force-dynamic'

const VERIFICATION_META = [
  { name: 'msvalidate.01', content: 'A8DF2D84B5E8F3A4C567534AF972FF33' }, // Bing Webmaster
  { name: 'baidu-site-verification', content: 'codeva-m0eVVSmqA5' }, // Baidu 搜索资源平台
  { name: '360-site-verification', content: 'c3710f1db20ec6ca15db35d7749d4442' }, // 360 站长
  { name: 'sogou_site_verification', content: 'BV4xVAo1mz' }, // 搜狗站长
]

const HOME_URL = 'https://www.deshanxinyi.com/lawfirm/zh'

export default function Root() {
  return (
    <>
      <head>
        {VERIFICATION_META.map((m) => (
          <meta key={m.name} name={m.name} content={m.content} />
        ))}
        <title>江苏德善(新沂)律师事务所</title>
      </head>
      <p>
        正在前往 <a href={HOME_URL}>江苏德善(新沂)律师事务所</a>…
      </p>
      <script
        dangerouslySetInnerHTML={{
          __html: `setTimeout(function(){ window.location.replace("${HOME_URL}"); }, 100);`,
        }}
      />
    </>
  )
}
