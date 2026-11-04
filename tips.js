(function() {
  const BP = window.BodyMovin = window.BodyMovin || {};
  let cfg = { accent: "#ffd36b", max: 2, bottom: 0.82, items: [] }, root = null, raf = 0, configured = false;
  const ctxTips = /* @__PURE__ */ new Map();
  const els = /* @__PURE__ */ new Map();
  let seq = 0;
  const seen = /* @__PURE__ */ new Map(), SHOW_MS = 3e3, REST_MS = 4e3, REST_STANDING_MS = 3e4;
  const CSS = '\n  #bp-tips{position:fixed;top:0;right:0;bottom:0;left:0;pointer-events:none;z-index:28;font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display",system-ui,"Segoe UI",Roboto,sans-serif}\n  .bpt{position:absolute;left:0;top:0;box-sizing:border-box;max-width:var(--bpt-w,320px);padding:.28em .9em .32em;border-radius:999px;\n    background:rgba(6,8,18,.9);border:1px solid rgba(255,255,255,.25);color:#fff;\n    font-weight:800;font-size:var(--bpt-fs,18px);line-height:1.15;letter-spacing:.01em;text-shadow:0 1px 3px rgba(0,0,0,.8);\n    -webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;\n    opacity:0;transition:opacity .35s ease,border-color .3s}\n  .bpt.on{opacity:1}\n  .bpt.hot{border-color:var(--bpt-acc,#ffd36b)}\n  .bpt.hot.on{opacity:1}\n  .bpt b{color:var(--bpt-acc,#ffd36b);font-weight:900}';
  function ensureRoot() {
    if (root || typeof document === "undefined" || !document.body) return root;
    if (!document.getElementById("bpt-css")) {
      const st = document.createElement("style");
      st.id = "bpt-css";
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    root = document.createElement("div");
    root.id = "bp-tips";
    root.setAttribute("aria-live", "polite");
    document.body.appendChild(root);
    return root;
  }
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  function html(t) {
    const i = t.indexOf(": ");
    return i > 0 && i < 26 ? "<b>".concat(esc(t.slice(0, i + 1)), "</b> ").concat(esc(t.slice(i + 2))) : esc(t);
  }
  const R = (r) => r && (r.right != null ? r : { left: r.x, top: r.y, right: r.x + r.w, bottom: r.y + r.h });
  const visible = (e) => {
    if (!e || !e.getClientRects().length) return false;
    const cs = getComputedStyle(e);
    return cs.display !== "none" && cs.visibility !== "hidden" && +cs.opacity > 0.05;
  };
  function tips(o) {
    cfg = Object.assign({ accent: "#ffd36b", max: 2, bottom: 0.82, items: [] }, o || {});
    configured = true;
    ensureRoot();
    kick();
    return tips;
  }
  function tip(id, text, ms = 2200, opt = {}) {
    if (!text) {
      ctxTips.delete(id);
      return;
    }
    const now = performance.now(), t = ctxTips.get(id);
    if (t) {
      t.text = text;
      t.until = now + ms;
      t.hot = !!opt.hot;
    } else ctxTips.set(id, { text, until: now + ms, hot: !!opt.hot, born: ++seq });
    ensureRoot();
    kick();
  }
  tips.clear = () => {
    ctxTips.clear();
    for (const [, e] of els) e.want = false;
    kick();
  };
  tips.avoidRects = () => root ? avoidRects() : [];
  tips.active = () => [...els.entries()].filter(([, e]) => e.shown).map(([id, e]) => ({ id, text: e.text, rect: e.el.getBoundingClientRect() }));
  function rowBox(W, H) {
    let bottom = 0, left = Infinity, right = 0;
    const ids = ["bp-sys", "bp-home", "bp-menu", "bp-music", "bp-pause"].concat(cfg.row || []);
    for (const id of ids) {
      const e = typeof id === "string" ? document.getElementById(id) : id;
      if (!visible(e)) continue;
      const r = e.getBoundingClientRect();
      if (!r.width || r.top > H * 0.3 || r.left > W * 0.5) continue;
      bottom = Math.max(bottom, r.bottom);
      left = Math.min(left, r.left);
      right = Math.max(right, r.right);
    }
    const vmin = Math.min(W, H) / 100;
    if (!bottom) bottom = Math.max(12, 1.6 * vmin) + Math.max(36, 5.4 * vmin);
    if (!isFinite(left)) left = Math.max(12, 1.6 * vmin);
    return { bottom, left, right };
  }
  function avoidRects() {
    const out = [];
    for (const sel of ["#bp-cam", ".bph-tip", "#bp-pausehint", "#bp-checkin", ".bph-wrap:not(.bph-gone)"]) for (const e of document.querySelectorAll(sel)) if (visible(e)) out.push(e.getBoundingClientRect());
    if (cfg.avoidSel) {
      for (const e of document.querySelectorAll(cfg.avoidSel)) if (visible(e)) out.push(e.getBoundingClientRect());
    }
    if (cfg.avoid) {
      try {
        for (const r of cfg.avoid() || []) if (r) out.push(R(r));
      } catch (_) {
      }
    }
    return out;
  }
  function allowed() {
    if (BP.paused) return false;
    if (BP.howTo && BP.howTo.visible) return false;
    const pov = document.getElementById("bp-pause-ov");
    if (pov && pov.style.display === "flex") return false;
    if (cfg.when) {
      try {
        return !!cfg.when();
      } catch (_) {
        return false;
      }
    }
    return true;
  }
  function frame(now) {
    raf = 0;
    if (!ensureRoot()) {
      kick();
      return;
    }
    const W = innerWidth, H = innerHeight, vmin = Math.min(W, H) / 100;
    for (const [id, t] of ctxTips) if (now > t.until) ctxTips.delete(id);
    const want = [];
    if (configured && allowed()) {
      [...ctxTips.entries()].sort((a, b) => b[1].hot - a[1].hot || b[1].born - a[1].born).forEach(([id, t]) => want.push({ id, text: t.text, hot: t.hot, standing: false }));
      for (const it of cfg.items || []) {
        let ok = true;
        if (it.when) {
          try {
            ok = !!it.when();
          } catch (_) {
            ok = false;
          }
        }
        if (ok && !want.some((w) => w.id === it.id)) want.push({ id: it.id, text: it.text, hot: false, standing: true });
      }
    }
    const fresh = want.filter((w) => {
      const s = seen.get(w.id);
      if (!s) return true;
      if (now - s.first < SHOW_MS) return true;
      if (now - s.last > (w.standing ? REST_STANDING_MS : REST_MS)) {
        seen.delete(w.id);
        return true;
      }
      return false;
    });
    for (const w of want) {
      const s = seen.get(w.id);
      if (s && now - s.first >= SHOW_MS) s.last = now;
    }
    const cur = [...els.entries()].find(([, e]) => e.shown);
    let pick = cur && fresh.find((w) => w.id === cur[0]) || fresh[0];
    fresh.length = 0;
    if (pick) fresh.push(pick);
    const fs = Math.round(Math.max(15, Math.min(28, 2.5 * vmin))), maxW = Math.round(W * 0.6);
    root.style.setProperty("--bpt-fs", fs + "px");
    root.style.setProperty("--bpt-w", maxW + "px");
    root.style.setProperty("--bpt-acc", cfg.accent || "#ffd36b");
    for (const [, e] of els) e.want = false;
    for (const w of fresh) {
      if (!seen.has(w.id)) seen.set(w.id, { first: now, last: now });
      let e = els.get(w.id);
      if (!e) {
        const el = document.createElement("div");
        el.className = "bpt";
        root.appendChild(el);
        e = { el, text: null, shown: false, y: null };
        els.set(w.id, e);
      }
      e.want = true;
      if (e.text !== w.text) {
        e.text = w.text;
        e.el.innerHTML = html(w.text);
      }
      e.el.classList.toggle("hot", !!w.hot);
      const r = e.el.getBoundingClientRect(), wd = r.width || maxW * 0.6, ht = r.height || fs * 1.6, edge = Math.max(6, 1 * vmin);
      const x = Math.round(W / 2 - wd / 2), row = rowBox(W, H);
      const av = avoidRects(), hits = (yy2) => av.some((a) => x < a.right && x + wd > a.left && yy2 < a.bottom && yy2 + ht > a.top);
      let yy = H - edge - ht;
      if (hits(yy)) {
        yy = edge;
        if (x < row.right + edge && yy < row.bottom) yy = row.bottom + edge;
        if (hits(yy)) {
          e.want = false;
          continue;
        }
      }
      e.el.style.left = x + "px";
      e.el.style.top = Math.round(yy) + "px";
      e.y = yy;
    }
    for (const [id, e] of els) {
      if (e.want && !e.shown) {
        e.shown = true;
        e.gone = 0;
        requestAnimationFrame(() => e.el.classList.add("on"));
      }
      if (!e.want && e.shown) {
        e.shown = false;
        e.el.classList.remove("on");
        e.gone = now;
      }
      if (!e.want && !e.shown && e.gone && now - e.gone > 450) {
        e.el.remove();
        els.delete(id);
      }
      if (!e.want && !e.shown && !e.gone) {
        e.el.remove();
        els.delete(id);
      }
    }
    root.dataset.n = String([...els.values()].filter((e) => e.shown).length);
    if (configured || ctxTips.size || els.size) kick();
  }
  function kick() {
    if (!raf && typeof requestAnimationFrame !== "undefined") raf = requestAnimationFrame(frame);
  }
  BP.tips = tips;
  BP.tip = tip;
})();
