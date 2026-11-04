/* ==========================================================
   森屿 Minecraft — 全站脚本
   站点信息集中在这里配置，改一处全站生效
   ========================================================== */

const CONFIG = {
  SERVER_NAME: "森屿小破服",
  SERVER_IP: "senyumc.top:33347",           // 主进服地址（一键复制的就是这个完整地址）
  QUERY_IP: "senyumc.top:33347",            // 主地址（状态查询用，MineBBS 支持域名查询）
  BACKUP_IP: "play.senyumc.top:13347",      // 备用入口（主地址连不上时使用）
  MAP_VIEW_URL: "https://map.senyumc.top",
  SITE_URL: "https://www.senyumc.top",         // 官网地址（状态监测页连通性探测用）
  QQ_GROUP: "993653958",
  QQ_GROUP_URL: "https://qm.qq.com/q/R6Dm45ZpsK",
  /* 状态接口：MineBBS Motd 查询站（国内访问更稳定）。
     stype=je 表示探测 Java 版（be 为基岩版）；未填 port 时只传 ip。 */
  STATUS_API: () => {
    const [host, port] = CONFIG.QUERY_IP.split(":");
    let url = `https://motd.minebbs.com/api/status?ip=${host}`;
    if (port) url += `&port=${port}`;
    return url + "&stype=je";
  },
  /* 备用接口：MineBBS 暂时不可用时退回 mcsrvstat */
  STATUS_API_FALLBACK: (ip) => `https://api.mcsrvstat.us/2/${ip}`,
};

/* ---------- 小工具 ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

function toast(msg) {
  let t = $("#toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    t.style.cssText =
      "position:fixed;left:50%;bottom:34px;transform:translateX(-50%) translateY(16px);" +
      "z-index:200;padding:10px 22px;border-radius:999px;font-size:14px;font-weight:600;" +
      "background:rgba(13,21,16,.94);border:1px solid rgba(110,231,160,.4);color:#6ee7a0;" +
      "backdrop-filter:blur(10px);box-shadow:0 10px 30px rgba(0,0,0,.4);opacity:0;" +
      "transition:all .3s ease;pointer-events:none;";
    document.body.appendChild(t);
  }
  t.textContent = msg;
  requestAnimationFrame(() => { t.style.opacity = "1"; t.style.transform = "translateX(-50%) translateY(0)"; });
  clearTimeout(t._timer);
  t._timer = setTimeout(() => { t.style.opacity = "0"; t.style.transform = "translateX(-50%) translateY(16px)"; }, 2200);
}

async function copyText(text, okMsg = "✅ 已复制到剪贴板") {
  try {
    await navigator.clipboard.writeText(text);
    toast(okMsg);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text; ta.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(ta); ta.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch {}
    ta.remove();
    if (ok) toast(okMsg);
    else toast(`复制失败，请手动复制：${text}`);
    return ok;
  }
}

/* ---------- 导航 ---------- */
function initNav() {
  const nav = $(".nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  const burger = $(".nav-burger");
  const menu = $(".mobile-menu");
  if (burger && menu) {
    burger.addEventListener("click", () => menu.classList.toggle("open"));
    menu.addEventListener("click", (e) => { if (e.target.tagName === "A") menu.classList.remove("open"); });
  }

  // 高亮当前页导航
  const here = location.pathname.split("/").pop() || "index.html";
  $$(".nav-links a").forEach((a) => {
    const href = a.getAttribute("href") || "";
    if (href === here || href === "./" + here) a.classList.add("active");
  });
}

/* ---------- 回到顶部 ---------- */
function initToTop() {
  const btn = document.createElement("button");
  btn.id = "toTop";
  btn.innerHTML = "↑";
  btn.title = "回到顶部";
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  document.body.appendChild(btn);
  window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 500), { passive: true });
}

/* ---------- 萤火粒子 ---------- */
function initFireflies() {
  const box = $(".fireflies");
  if (!box || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const n = window.innerWidth < 700 ? 9 : 16;
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    const dur = 9 + Math.random() * 14;
    s.style.left = Math.random() * 100 + "%";
    s.style.bottom = -(5 + Math.random() * 15) + "%";
    s.style.setProperty("--dx", (Math.random() * 120 - 60).toFixed(0) + "px");
    s.style.setProperty("--peak", (0.25 + Math.random() * 0.5).toFixed(2));
    s.style.animationDuration = dur + "s";
    s.style.animationDelay = -Math.random() * dur + "s";
    const sc = 0.6 + Math.random() * 1.2;
    s.style.transform = `scale(${sc})`;
    box.appendChild(s);
  }
}

/* ---------- 进场动画 ---------- */
function initReveal() {
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }),
    { threshold: 0.08 }
  );
  $$(".reveal").forEach((el) => io.observe(el));
}

/* ---------- 复制 IP / 加群按钮 ---------- */
function initActions() {
  $$("[data-copy-ip]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const ok = await copyText(CONFIG.SERVER_IP, "✅ 服务器地址已复制");
      if (ok && btn.classList.contains("ip-chip")) {
        btn.classList.add("copied");
        setTimeout(() => btn.classList.remove("copied"), 1800);
      }
    });
  });
  $$("[data-join-group]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await copyText(CONFIG.QQ_GROUP, "✅ 群号已复制，正在打开加群页面");
      window.open(CONFIG.QQ_GROUP_URL, "_blank");
    });
  });
  // 站内所有外链按配置回填
  $$("[data-link]").forEach((a) => {
    const key = a.dataset.link;
    if (CONFIG[key]) a.href = CONFIG[key];
    a.target = "_blank";
  });
  $$("[data-text]").forEach((el) => {
    el.textContent = CONFIG[el.dataset.text] ?? "";
  });
}

/* ---------- 服务器状态 ---------- */
function initStatus() {
  const cards = $$("[data-status-card]");
  if (!cards.length) return;

  async function refresh() {
    for (const card of cards) {
      const dot = $(".js-dot", card);
      const stateEl = $(".js-state", card);
      if (!dot || !stateEl) continue;
      const playersEl = $(".js-players", card);
      const maxEl = $(".js-max", card);
      const verEl = $(".js-ver", card);
      const iconEl = $(".js-icon", card);
      let data = null;
      try {
        const res = await fetch(CONFIG.STATUS_API(CONFIG.QUERY_IP), { cache: "no-store" });
        data = await res.json();
      } catch {
        try {
          // 主接口失败时退回备用接口
          const res = await fetch(CONFIG.STATUS_API_FALLBACK(CONFIG.QUERY_IP), { cache: "no-store" });
          data = await res.json();
        } catch { data = null; }
      }
      /* 统一两种接口的判定：MineBBS 用 status 字段，mcsrvstat 用 online 字段 */
      const online = !!data && (data.status === "online" || data.online === true);
      const players = (data && data.players) || {};
      if (online) {
        dot.className = "dot js-dot on";
        stateEl.textContent = "在线";
        stateEl.className = "js-state st-ok";
        if (playersEl) playersEl.textContent = Number(players.online) || 0;
        if (maxEl) maxEl.textContent = Number(players.max) || 0;
        const rawVer = String((data && data.version) || "Java / 基岩");
        const m = rawVer.match(/[A-Za-z]*\s*\d+\.\d+(?:\.\d+)?/);
        if (verEl) verEl.textContent = m ? m[0].trim() : rawVer;
        if (data.icon && iconEl) iconEl.src = data.icon;
      } else if (data) {
        dot.className = "dot js-dot off";
        stateEl.textContent = "离线";
        stateEl.className = "js-state st-bad";
        if (playersEl) playersEl.textContent = "0";
        if (maxEl) maxEl.textContent = "0";
      } else {
        dot.className = "dot js-dot unknown";
        stateEl.textContent = "获取失败";
      }
    }
  }
  refresh();
  setInterval(refresh, 60000);
}

/* ---------- 状态监测页（status.html） ---------- */
function initStatusPage() {
  const page = $("#status-page");
  if (!page) return;

  const REFRESH_AFTER = 30;                       // 秒
  const cards = $$(".sp-card", page);
  const webCards = $$("[data-web]", page);
  const updatedEl = $("#sp-updated", page);
  const countdownEl = $("#sp-countdown", page);
  const refreshBtn = $("#sp-refresh", page);
  let countdown = REFRESH_AFTER;

  /* 只监测 CONFIG 里配置的森屿本服地址，stype: je = Java 版 / be = 基岩版；
     卡片可用 data-ip 指定 CONFIG 里的地址项（默认 QUERY_IP 主地址，备用入口用 BACKUP_IP） */
  async function probe(card) {
    const stype = card.dataset.stype === "be" ? "be" : "je";
    const [host, port] = String(CONFIG[card.dataset.ip || "QUERY_IP"] || CONFIG.QUERY_IP).split(":");
    const dot = $(".js-dot", card);
    const stateEl = $(".js-state", card);
    const playersEl = $(".js-players", card);
    const maxEl = $(".js-max", card);
    const verEl = $(".js-ver", card);
    const delayEl = $(".js-delay", card);
    const motdEl = $(".js-motd", card);
    const iconEl = $(".js-icon", card);
    let url = `https://motd.minebbs.com/api/status?ip=${host}&stype=${stype}`;
    if (port) url += `&port=${port}`;

    let data = null;
    try {
      const res = await fetch(url, { cache: "no-store" });
      data = await res.json();
    } catch {
      /* MineBBS 不可用时退回 mcsrvstat（Java / 基岩各自接口） */
      try {
        const fb = stype === "be" ? `https://api.mcsrvstat.us/bedrock/2/${CONFIG.QUERY_IP}` : CONFIG.STATUS_API_FALLBACK(CONFIG.QUERY_IP);
        const res2 = await fetch(fb, { cache: "no-store" });
        const d = await res2.json();
        if (d && d.online === true) {
          const md = d.motd || {};
          const motdText = Array.isArray(md.clean) ? md.clean.join("")
            : (typeof md.clean === "string" ? md.clean
            : (Array.isArray(md.raw) ? md.raw.join("") : (typeof md.raw === "string" ? md.raw : "")));
          data = { status: "online", version: d.version, players: d.players || {}, icon: d.icon, pureMotd: motdText };
        }
      } catch { data = null; }
    }

    if (data && data.status === "online") {
        dot.className = "dot js-dot on";
        stateEl.textContent = "在线";
        stateEl.className = "js-state st-ok";
        const pl = data.players || {};
        if (playersEl) playersEl.textContent = Number(pl.online) || 0;
        if (maxEl) maxEl.textContent = Number(pl.max) || 0;
        const raw = String(data.version || "");
        const m = raw.match(/[A-Za-z]*\s*\d+\.\d+(?:\.\d+)?/);
        if (verEl) verEl.textContent = m ? m[0].trim() : (raw || "—");
        if (delayEl) delayEl.textContent = data.delay ? `${data.delay} ms` : "—";
        if (motdEl) {
          let mt = String(data.pureMotd || data.motd || "—").trim();
          /* Geyser 返回的 MOTD 有时被引号包住，去掉首尾引号 */
          if (mt.length > 1 && ((mt.startsWith('"') && mt.endsWith('"')) || (mt.startsWith("'") && mt.endsWith("'")))) mt = mt.slice(1, -1);
          motdEl.textContent = mt || "—";
        }
        if (iconEl && data.icon) iconEl.src = data.icon;
      } else if (data) {
        dot.className = "dot js-dot off";
        stateEl.textContent = "离线";
        stateEl.className = "js-state st-bad";
        if (playersEl) playersEl.textContent = "0";
        if (maxEl) maxEl.textContent = "0";
        if (verEl) verEl.textContent = "—";
        if (delayEl) delayEl.textContent = "—";
        if (motdEl) motdEl.textContent = "—";
      } else {
        dot.className = "dot js-dot unknown";
        stateEl.textContent = "检测失败";
        stateEl.className = "js-state";
        if (delayEl) delayEl.textContent = "—";
      }
  }

  /* 网页服务（官网 / 地图）连通性检测：
     no-cors 请求能发出去并收到响应即算"在线"，无法读响应内容只测连通；
     6 秒无响应判"超时"，配置协议不通时自动换 http/https 再试一次 */
  function probeWeb(card) {
    const dot = $(".js-dot", card);
    const stateEl = $(".js-state", card);
    const delayEl = $(".js-delay", card);
    const original = String(CONFIG[card.dataset.web] || "");
    const alt = original.startsWith("https://")
      ? original.replace("https://", "http://")
      : original.replace("http://", "https://");
    const candidates = [...new Set([original, alt])].filter(Boolean);

    let timedOut = false;

    async function attempt(url) {
      const ctl = new AbortController();
      const timer = setTimeout(() => ctl.abort(), 6000);
      try {
        const t0 = performance.now();
        await fetch(url, { mode: "no-cors", cache: "no-store", signal: ctl.signal });
        return Math.max(1, Math.round(performance.now() - t0));
      } catch {
        if (ctl.signal.aborted) timedOut = true;
        return null;
      } finally {
        clearTimeout(timer);
      }
    }

    (async () => {
      let ms = null;
      for (const url of candidates) {
        ms = await attempt(url);
        if (ms !== null) break;
      }
      if (ms !== null) {
        dot.className = "dot js-dot on";
        stateEl.textContent = "在线";
        stateEl.className = "js-state st-ok";
        if (delayEl) delayEl.textContent = `${ms} ms`;
      } else {
        dot.className = "dot js-dot off";
        stateEl.textContent = timedOut ? "超时" : "离线";
        stateEl.className = timedOut ? "js-state" : "js-state st-bad";
        if (delayEl) delayEl.textContent = "—";
      }
    })();
  }

  async function refresh() {
    if (updatedEl) updatedEl.textContent = "检测中…";
    await Promise.allSettled([...cards.map(probe), ...webCards.map(probeWeb)]);
    if (updatedEl) updatedEl.textContent = "最近检测：" + new Date().toLocaleTimeString("zh-CN");
    countdown = REFRESH_AFTER;
    paintCountdown();
  }

  function paintCountdown() { if (countdownEl) countdownEl.textContent = `${countdown} 秒后自动刷新`; }

  setInterval(() => { countdown -= 1; if (countdown <= 0) refresh(); else paintCountdown(); }, 1000);
  if (refreshBtn) refreshBtn.addEventListener("click", refresh);
  refresh();
}

/* ---------- 玩法标签页 ---------- */
function initTabs() {
  const tabsBox = $("[data-tabs]");
  if (!tabsBox) return;
  const btns = $$(".tab-btn", tabsBox);
  const panels = $$(".tab-panel", tabsBox);
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      panels.forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      $(`#tab-${btn.dataset.tab}`, tabsBox)?.classList.add("active");
    });
  });
}

/* ---------- 捐助光荣榜 ---------- */
function initDonate() {
  const list = $("#donList");
  if (!list) return;
  fetch("./donate.json", { cache: "no-store" })
    .then((r) => r.json())
    .then((rows) => {
      const items = rows.filter((r) => r.name && r.amount);
      if (!items.length) {
        list.innerHTML = `<div class="don-empty">虚位以待，期待你的名字出现在这里 🌱</div>`;
        return;
      }
      list.innerHTML = items
        .map(
          (r) => `<div class="don-row">
            <span class="d-name">${String(r.name).replace(/</g, "&lt;")}</span>
            <span class="d-msg">${String(r.message || "").replace(/</g, "&lt;")}</span>
            <span class="d-amt">¥${r.amount}</span>
          </div>`
        )
        .join("");
    })
    .catch(() => { list.innerHTML = `<div class="don-empty">名单加载失败，请稍后刷新重试</div>`; });
}

/* ---------- 手册页目录滚动高亮 ---------- */
function initScrollSpy() {
  const toc = $(".toc");
  if (!toc) return;
  const links = $$("a", toc);
  const secs = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if (!secs.length) return;
  const io = new IntersectionObserver(
    (es) => {
      es.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((l) => l.classList.remove("active"));
        const link = links.find((l) => l.getAttribute("href") === "#" + e.target.id);
        if (link) link.classList.add("active");
      });
    },
    { rootMargin: "-15% 0px -70% 0px" }
  );
  secs.forEach((s) => io.observe(s));
}

/* ---------- 启动 ---------- */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initFireflies();
  initReveal();
  initActions();
  initStatus();
  initStatusPage();
  initTabs();
  initDonate();
  initScrollSpy();
  initToTop();
});
