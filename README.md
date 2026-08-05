# Craft Netlify Blog

这是一个使用 Astro 构建的无头 (Headless) 博客系统，以 Craft 作为后台内容管理系统，使用 Netlify 部署。

## 一、技术栈

- **框架**: Astro (服务端渲染)
- **样式**: 原生 CSS
- **数据源**: Craft Multi-Document API
- **部署**: Netlify (使用 `@astrojs/netlify` 适配器)

## 二、如何在 Craft 创建 Blog Posts

1. 在 Craft 中创建一个新的文档或页面，输入任意名称（例如：“博客”）。
2. 在该页面下，输入 `/collection`，选择“新建合集”(Table/Collection)。
3. 在合集中添加字段。

### 推荐字段名称和类型
- **Title (默认标题列)**: 文本 (Text)，必填，表示文章标题
- **项目**: 多选 (Multi-Select)
- **发布日期**: 日期 (Date)
- **标签**: 多选 (Multi-Select)

*注意：目前系统适配了以上具体字段（以真实 Bundle 结构为准）。*

## 三、获取 Craft Collection ID 与接入
1. **创建 Connection**: 在 Craft 的开发者/集成选项中，创建一个 Read-only 权限的 Connection，获得你的 API Server 链接。
2. **获取 ID**: 可使用 Craft 提供的 API Explorer，或通过调用 `GET /collections` 获取你要作为博客后台的 Collection ID。

## 四、本地运行与环境变量

### `.env` 配置
复制 `.env.example` 并重命名为 `.env`，填入信息：
```env
CRAFT_API_URL=https://connect.craft.do/links/YOUR_LINK_ID/api/v1
CRAFT_COLLECTION_ID=YOUR_COLLECTION_ID
SITE_URL=http://localhost:4321
SITE_NAME=我的个人博客
SITE_DESCRIPTION=关于 AI、Web Coding、创作与个人实践的记录
```

### 运行命令
```bash
# 安装依赖
npm install

# 启动本地开发服务 (支持后台运行)
npm run dev
# 或 astro dev --background

# 构建项目
npm run build
```

## 五、部署与上线

1. **推送 GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```
2. **连接 Netlify**:
   - 登录 Netlify，选择 "Import from GitHub"。
   - 选中刚才推送的仓库。
   - Build Command 为 `npm run build`，Publish directory 为 `dist`。
3. **添加环境变量**:
   - 在 Netlify 的 Site settings -> Environment variables 中，添加上面 `.env` 里定义的所有变量，尤其是 `CRAFT_API_URL` 和 `CRAFT_COLLECTION_ID`。
4. **绑定域名**:
   - 在 Netlify 的 Domain management 中添加自定义域名。

## 六、常见问题

- **如何发布新文章？**
  只需在 Craft 的“博客”合集中添加新行（Item），系统即可读取。内容写在打开该行页面后的主体部分中。
- **更新后多久显示？**
  Netlify 开启了 s-maxage=60 的 CDN 缓存，更新最快在 1 分钟后生效。
- **如何确保 Craft API 不泄露？**
  项目使用了服务端渲染 (SSR)。Craft 的所有数据请求都只发生在服务器端，浏览器端不会发起该请求，从而避免凭据暴露。
- **构建报错 / 找不到内容？**
  请检查 `CRAFT_API_URL` 和 `CRAFT_COLLECTION_ID` 是否正确，且发布日期是否有缺失值。
