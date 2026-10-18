# 森屿 Minecraft · 新版官网

深色森系全新设计，纯静态 HTML/CSS/JS，**无任何外部 CDN 依赖**（不再加载 Tailwind），国内访问更快更稳。

## 文件结构

```
web-new/
├── index.html        首页（Hero·状态卡·特色·玩法标签页·世界·连接教程·规则·税收）
├── docs.html         玩家手册（14 节功能命令，带侧边目录，滚动高亮）
├── donate.html       捐助支持（二维码 + 光荣榜，读取 donate.json）
├── 404.html          404 页面（服务器需配置 error_page）
├── guide.html        旧链接跳转页（自动转到首页对应锚点，可保留）
├── assets/
│   ├── style.css     全站样式
│   └── main.js       全站脚本
├── tb.png            站点图标（沿用原图）
├── qr.jpg            捐助二维码（沿用原图）
├── gongan.png        公安备案图标（沿用原图）
└── donate.json       捐助光荣榜数据
```

## 部署

把 `web-new/` 里所有文件上传到网站根目录，覆盖旧文件即可。页面文件名与旧版一致，
旧版 `guide.html` 的外链（如 `guide.html#rules`）会自动跳转到新版首页对应区块。

如需 404 页生效，在 Nginx 里加：

```nginx
error_page 404 /404.html;
```

## 改配置（只改一处）

打开 `assets/main.js`，顶部 `CONFIG` 集中管理全站信息：

```js
const CONFIG = {
  SERVER_NAME: "森屿小破服",
  SERVER_IP: "senyumc.top",            // 页面展示的地址
  QUERY_IP: "43.226.60.75:33347",      // 状态查询用的 IP:端口（Java 端）
  MAP_VIEW_URL: "https://map.senyumc.top",
  QQ_GROUP: "993653958",
  QQ_GROUP_URL: "https://qm.qq.com/q/R6Dm45ZpsK",
};
```

改这里之后，全站的复制按钮、状态查询、地图/加群链接都会同步更新。

## 服务器状态卡说明

- 状态通过 `api.mcsrvstat.us` 查询 `QUERY_IP`，每 60 秒刷新一次，在线时自动显示服务器图标与人数。
- 若以后换服，改 `QUERY_IP` 即可；页面上只展示 `senyumc.top`，完整端口依旧只在群里公告。

## 捐助光荣榜

编辑 `donate.json`，格式如下（name / amount 必填，message 可空）：

```json
[
  { "name": "玩家A", "amount": 10, "message": "支持服主" }
]
```

本地预览：在本目录执行 `python3 -m http.server 8000`，浏览器打开 http://127.0.0.1:8000
