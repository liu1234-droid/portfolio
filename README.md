# GitHub 静态版：泛进店达人筛选

这是可直接上传到 GitHub 仓库并部署到 GitHub Pages / Vercel / Netlify 的纯静态版本。

## 包含文件
- index.html（页面骨架 + 主逻辑）
- styles.css（静态编译的 Tailwind 样式，替代 CDN，首屏更快）
- sw.js（Service Worker：静态资源本地缓存，刷新/再次访问秒开）
- data.js（达人主数据，已剔除页面未使用字段）
- tags.js（万粉一级/二级标签）
- attrs.js（定制报价 / 定制视频预期CPM / 粉丝八大人群，紧凑格式）
- spam.js（刷量达人名单，前置过滤）
- avatars.js（达人头像 URL）
- videos.js（参考视频元数据）
- xlsx.full.min.js（Excel 导出组件，点击导出时才按需加载）

## 性能设计（2026-09 优化）
- 静态资源本地缓存：sw.js 采用 stale-while-revalidate，首次加载后刷新秒开
- 数据文件并行加载，不阻塞首屏渲染，加载中有过渡动画
- Tailwind 样式静态编译（约 17KB），不再依赖 cdn.tailwindcss.com
- Excel 组件（约 880KB）按需加载，首屏不下载
- 数据文件压缩：总体积从约 30MB 降至约 25MB（gzip 后约 8MB）
- 图片懒加载（loading="lazy"）

## 特点
- 支持所有核心筛选、排序、导出 Excel
- 不包含热力图 / 埋点 / internal 页面
- 数据来自当前已生成的真实静态数据文件

## GitHub Pages 使用方式
1. 新建 GitHub 仓库
2. 把本目录全部文件上传到仓库根目录
3. 在 GitHub 仓库 Settings -> Pages 中启用 Pages
4. Source 选择 `Deploy from a branch`
5. Branch 选择 `main` / `/root`
6. 等待发布完成后访问生成的网址

## 注意
- 这是静态版，后续数据更新需要重新替换 `data.js / tags.js / attrs.js / spam.js`
- 数据文件更新后，建议把 `sw.js` 里的缓存版本号 `fjd-picker-v1` 加 1（如改为 `fjd-picker-v2`），让访客浏览器立即更新缓存
- 如果要全网可访问且自动更新数据，需要再接 CI/CD 或后端取数流程
