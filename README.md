# BiUH Web Tech · 2026-09-23 存档版

BiUH Web Tech 网站的早期静态版本，原样存档，单独发布/留档用。

- 来源：原仓库提交 [`95248aa`](https://github.com/matchman1/BiUH-web-tech/commit/95248aa)（提交信息 `footer`，2026-09-23）
- 原仓库：<https://github.com/matchman1/BiUH-web-tech>
- 当前线上站（最新版）：<https://matchman1.github.io/BiUH-web-tech/>
- 本站（存档版）：<https://matchman1.github.io/BiUH-web-tech-early/>

## 这一版是什么

四个手写页面 + 两个用 `fetch()` 注入的公共片段：

| 文件 | 作用 |
|---|---|
| `index.html` | 首页 |
| `quotes.html` | Famous Quotes |
| `project.html` | Project Ideas |
| `contact.html` | Contact |
| `nav.html` · `footer.html` | 只有 `<nav>` / `<p>` 的片段，由 `parts.js` 塞进每页的 `#site-header` / `#site-footer` |
| `parts.js` | 一个 `load(file, target)` 函数负责两处注入，外加当前页导航高亮 |
| `styles.css` · `nav.css` | 样式 |

这一版还没有后来加的 `cpu/`、`gpu/`、`cpus.html`、`gpu.html`、`slogans.html`、`theme.css`、`theme.js`。

## 本地预览

`parts.js` 用 `fetch()` 读片段，浏览器在 `file://` 下会按 CORS 拦掉，所以直接双击 `index.html` 是看不到导航和页脚的。需要一个本地 HTTP 服务：

```bat
serve.bat
```

它内部就是 `python -m http.server 8000 --bind 127.0.0.1`，需要已装 Python。没有 Python 的话用任意静态服务器也行，例如：

```bat
npx serve .
```

然后打开 <http://127.0.0.1:8000/>。

## 与原仓库的关系

- 页面内容与原仓库该提交**完全一致**，没有改动任何代码。
- 只额外补了两个文件：`.nojekyll`（让 GitHub Pages 原样发布，不走 Jekyll）和这份 `README.md`。
- `backup/`、`.pdfwork/`、`p2/`、`1.pdf` 等是当时的工作产物，原样保留，不影响站点运行。
