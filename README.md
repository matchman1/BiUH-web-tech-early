# BiUH Web Tech · 2026-09-23 存档版

BiUH Web Tech 网站早期版本的一个副本，现在作为独立站点继续改。
起点是原仓库的提交 [`95248aa`](https://github.com/matchman1/BiUH-web-tech/commit/95248aa)（提交信息 `footer`，2026-09-23），之后在此基础上重写。

- 原仓库：<https://github.com/matchman1/BiUH-web-tech>
- 当前线上站（最新版）：<https://matchman1.github.io/BiUH-web-tech/>
- 本站：<https://matchman1.github.io/BiUH-web-tech-early/>

## 页面

| 文件 | 内容 |
|---|---|
| `index.html` | 首页：一整块黑底 hero + 四张目录卡片 |
| `quotes.html` | 八条引文 |
| `project.html` | 六个项目想法，每个一句话说明 |
| `machine.html` | 无用机器（开关会自己关掉）+ 猜数字游戏 |
| `about.html` | 这站是怎么拼起来的、下次会怎么改 |
| `contact.html` | 联系方式 |

`nav.html` 和 `footer.html` 是**片段**，不是完整页面：它们由 `parts.js` 用 `fetch()` 拉取后注入每页的 `#site-header` / `#site-footer`。改导航只需要改这一处，六页同时变。

## 本地预览

页面用 `fetch()` 加载片段，浏览器在 `file://` 下会按 CORS 拦掉，所以双击 `index.html` 看不到导航和页脚。需要一个本地 HTTP 服务：

```bat
serve\serve.bat
```

它会优先用 Python，没有 Python 就用 Node.js（`serve\serve.js`，无需安装任何包）。然后打开 <http://127.0.0.1:8000/>。

## 代码结构

- `styles.css` —— 六个页面的样式，按页分节；配色只有五个值（黑、白、深灰、中灰、浅灰），定义在文件顶部的 `:root` 变量里，深色模式只换这一组变量
- `nav.css` —— 导航栏与站内页脚（六页共用）
- `parts.js` —— 一个 `load(file, target)` 函数，注入导航与页脚，并给当前页高亮
- `machine.js` —— 只服务 `machine.html`：无用机器与猜数字

## 素材与图标

- `images/z-y.png` —— 原始图形（2048×2048），所有图标的来源
- `images/icon-180.png` —— 180×180，手机主屏图标（`apple-touch-icon`）
- `images/favicon-32.png` —— 32×32，浏览器标签页图标
- 早期版本里的 `bilibili.jpg`、`w3.png`、`xlm.jpg` 已删除，首页也不再外链 B 站
