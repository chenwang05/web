# 森屿 Minecraft · 官网

深色森系设计，纯静态 HTML/CSS/JS，**无任何外部 CDN 依赖**，国内访问更快更稳。

本版更新（2026-11-08）：

- **新增玩法**：每日任务（/quest）、全服空投（/airdrop）、全服 Boss 战（/boss）、称号系统（/title），
  已加入首页「玩法标签页」（任务与全服活动 / 称号系统）与玩家手册第二十 ~ 二十三节。
- **移除全部服务器监测**：status.html 状态页、首页/导航状态卡、相关 JS 与样式全部删除。
- **进服地址只保留两个**：Java `senyumc.top:33347`、基岩 `senyumc.top:33349`（备用地址一并移除）。

## 文件结构

```
├── index.html        首页（Hero·特色·玩法标签页·世界·连接教程·规则·税收）
├── docs.html         玩家手册（22 节功能命令，带侧边目录，滚动高亮）
├── 404.html          404 页面（服务器需配置 error_page）
├── assets/
│   ├── style.css     全站样式
│   └── main.js       全站脚本
├── tb.png            站点图标（沿用原图）
└── gongan.png        公安备案图标（沿用原图）
```

## 部署

把本目录所有文件上传到网站根目录，覆盖旧文件即可。页面文件名与旧版一致，
旧版 `guide.html` 的外链（如 `guide.html#rules`）会自动跳转到新版首页对应区块；
旧链接 `status.html` 现已不存在，可按需在 Nginx 做 301 到首页。

如需 404 页生效，在 Nginx 里加：

```nginx
error_page 404 /404.html;
```

## 改配置（只改一处）

打开 `assets/main.js`，顶部 `CONFIG` 集中管理全站信息：

```js
const CONFIG = {
  SERVER_NAME: "森屿小破服",
  SERVER_IP: "senyumc.top:33347",           // Java 版进服地址
  SERVER_IP_BEDROCK: "senyumc.top:33349",   // 基岩版进服地址（端口不同）
  MAP_VIEW_URL: "https://map.senyumc.top",
  QQ_GROUP: "993653958",
  QQ_GROUP_URL: "https://qm.qq.com/q/R6Dm45ZpsK",
};
```

改这里之后，全站的复制按钮、地图/加群链接都会同步更新。

## 进服地址

页面直接公开两个地址，均有复制按钮（首页、连接教程、导航「复制地址」）：

- ☕ Java 版：**senyumc.top:33347**
- 📱 基岩版：**senyumc.top:33349**

进服仍需在 QQ 群完成账号绑定。

## 本地预览

在本目录执行 `python3 -m http.server 8000`，浏览器打开 http://127.0.0.1:8000
