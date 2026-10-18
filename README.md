# 森屿 Minecraft · 新版官网

深色森系全新设计，纯静态 HTML/CSS/JS，**无任何外部 CDN 依赖**（不再加载 Tailwind），国内访问更快更稳。

## 文件结构

```
web-main/
├── index.html        首页（Hero·状态卡·特色·玩法标签页·世界·连接教程·规则·税收）
├── docs.html         玩家手册（15 节功能命令，带侧边目录，滚动高亮）
├── download.html     游戏下载（Java 启动器 PCL2/HMCL/官方 + 基岩版下载入口）
├── status.html       状态监测页（Java / 基岩双端探测，30 秒自动刷新）
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

把 `web-main/` 里所有文件上传到网站根目录，覆盖旧文件即可。页面文件名与旧版一致，
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
  SERVER_IP: "senyumc.top:33347",      // 主进服地址（一键复制的就是它）
  QUERY_IP: "senyumc.top:33347",       // 主地址（状态查询用，MineBBS 支持域名）
  MAP_VIEW_URL: "https://map.senyumc.top",
  SITE_URL: "https://www.senyumc.top",         // 官网地址（状态监测页连通性探测用）
  BACKUP_IP: "play.senyumc.top:13347",         // 备用入口（主地址连不上时使用）
  QQ_GROUP: "993653958",
  QQ_GROUP_URL: "https://qm.qq.com/q/R6Dm45ZpsK",
  STATUS_API: () => { /* MineBBS Motd 接口，stype=je 探测 Java 版 */ },
  STATUS_API_FALLBACK: (ip) => `https://api.mcsrvstat.us/2/${ip}`,
};
```

改这里之后，全站的复制按钮、状态查询、地图/加群链接都会同步更新。

## 服务器状态卡说明

- 状态卡监测的就是**森屿本服**，不跳转任何第三方页面：优先通过 **MineBBS Motd 查询站**
  （`motd.minebbs.com`，国内访问稳定）查询 `QUERY_IP`，`stype=je` 固定探测 Java 版；
  若 MineBBS 暂时不可用，自动退回 `api.mcsrvstat.us`。
- 每 60 秒刷新一次，在线时自动显示服务器图标、人数与版本号（如 `Leaf 26.2`）。
- 若以后换服，改 `SERVER_IP` / `QUERY_IP` 即可。完整进服地址直接公开在页面上：
  主地址 **senyumc.top:33347**（导航栏与各页"复制地址"按钮复制的就是它），
  备用 **play.senyumc.top:13347**；进服仍需在 QQ 群完成账号绑定。

## 状态监测页（status.html）

- 页面同时探测**森屿本服的 Java 端与基岩互通桥（Geyser）**，各显示一张监测卡：
  在线状态、在线人数、服务端 / 基岩版本号、探测延迟与 MOTD。
- 每 **30 秒**倒计时自动刷新，也可点"🔄 手动刷新"；接口为 MineBBS Motd 查询站
  （`stype=je` 探 Java、`stype=be` 探基岩），MineBBS 不可用时自动退回
  `api.mcsrvstat.us`（Java 与基岩各自接口），全部只查询我们自己的服务器。
- 另有**备用入口监测**：探测 `BACKUP_IP`（`play.senyumc.top:13347`，主地址连不上时的备选进服地址）。
- 还有**官网与实时地图的连通性监测卡**：用 `no-cors` 请求探测 `SITE_URL` 与 `MAP_VIEW_URL`，
  能连上即在线（6 秒超时判"超时"），配置的协议不通时自动在 http / https 之间换协议再试；
  只测连通性，不检查页面内容。官网托管在 **Cloudflare**（`www.senyumc.top`），
  官网卡的延迟是到 Cloudflare 边缘节点的时间。
- 入口：首页状态卡下方"🔍 打开完整状态监测页"、全站页脚"相关链接 → 服务器状态"、手机菜单"服务器状态"。

## 捐助光荣榜

编辑 `donate.json`，格式如下（name / amount 必填，message 可空）：

```json
[
  { "name": "玩家A", "amount": 10, "message": "支持服主" }
]
```

本地预览：在本目录执行 `python3 -m http.server 8000`，浏览器打开 http://127.0.0.1:8000
