(function() {
  "use strict";
  var def = function(o, k, v) {
    if (o && !(k in o)) Object.defineProperty(o, k, { value: v, writable: true, configurable: true });
  };
  if (typeof globalThis === "undefined") window.globalThis = window;
  var at = function(i) {
    i = Math.trunc(i) || 0;
    if (i < 0) i += this.length;
    return i < 0 || i >= this.length ? void 0 : this[i];
  };
  def(Array.prototype, "at", at);
  def(String.prototype, "at", at);
  if (typeof Int8Array !== "undefined") def(Object.getPrototypeOf(Int8Array.prototype), "at", at);
  def(Array.prototype, "flat", function flat(d) {
    d = d === void 0 ? 1 : Math.trunc(d) || 0;
    return d < 1 ? Array.prototype.slice.call(this) : Array.prototype.reduce.call(this, function(a, v) {
      return a.concat(Array.isArray(v) ? flat.call(v, d - 1) : v);
    }, []);
  });
  def(Array.prototype, "flatMap", function(f, t) {
    return Array.prototype.map.call(this, f, t).flat();
  });
  def(Array.prototype, "findLast", function(f, t) {
    for (var i = this.length - 1; i >= 0; i--) if (f.call(t, this[i], i, this)) return this[i];
  });
  def(Array.prototype, "findLastIndex", function(f, t) {
    for (var i = this.length - 1; i >= 0; i--) if (f.call(t, this[i], i, this)) return i;
    return -1;
  });
  def(Object, "fromEntries", function(it) {
    var o = {};
    Array.from(it, function(e) {
      o[e[0]] = e[1];
    });
    return o;
  });
  def(Object, "hasOwn", function(o, k) {
    return Object.prototype.hasOwnProperty.call(o, k);
  });
  def(String.prototype, "replaceAll", function(s, r) {
    if (s instanceof RegExp) return this.replace(s, r);
    return this.split(String(s)).join(typeof r === "function" ? r(String(s)) : r);
  });
  def(String.prototype, "trimStart", String.prototype.trimLeft);
  def(String.prototype, "trimEnd", String.prototype.trimRight);
  def(window, "queueMicrotask", function(f) {
    Promise.resolve().then(f);
  });
  def(window, "structuredClone", function(v) {
    return v === void 0 ? v : JSON.parse(JSON.stringify(v));
  });
  def(Promise, "allSettled", function(ps) {
    return Promise.all(Array.from(ps, function(p) {
      return Promise.resolve(p).then(function(value) {
        return { status: "fulfilled", value };
      }, function(reason) {
        return { status: "rejected", reason };
      });
    }));
  });
  function roundRect(x, y, w, h, r) {
    var a = r === void 0 ? [0] : Array.isArray(r) ? r : [r];
    var n = function(v) {
      return typeof v === "number" ? v : v && (v.x || 0) || 0;
    };
    var tl, tr, br, bl;
    if (a.length === 1) tl = tr = br = bl = n(a[0]);
    else if (a.length === 2) {
      tl = br = n(a[0]);
      tr = bl = n(a[1]);
    } else if (a.length === 3) {
      tl = n(a[0]);
      tr = bl = n(a[1]);
      br = n(a[2]);
    } else {
      tl = n(a[0]);
      tr = n(a[1]);
      br = n(a[2]);
      bl = n(a[3]);
    }
    if (w < 0) {
      x += w;
      w = -w;
    }
    if (h < 0) {
      y += h;
      h = -h;
    }
    var k = Math.min(1, w / (tl + tr || 1), w / (bl + br || 1), h / (tl + bl || 1), h / (tr + br || 1));
    tl *= k;
    tr *= k;
    br *= k;
    bl *= k;
    this.moveTo(x + tl, y);
    this.lineTo(x + w - tr, y);
    this.arcTo(x + w, y, x + w, y + tr, tr);
    this.lineTo(x + w, y + h - br);
    this.arcTo(x + w, y + h, x + w - br, y + h, br);
    this.lineTo(x + bl, y + h);
    this.arcTo(x, y + h, x, y + h - bl, bl);
    this.lineTo(x, y + tl);
    this.arcTo(x, y, x + tl, y, tl);
    this.closePath();
  }
  if (window.CanvasRenderingContext2D) def(CanvasRenderingContext2D.prototype, "roundRect", roundRect);
  if (window.Path2D) def(Path2D.prototype, "roundRect", roundRect);
  if (window.OffscreenCanvasRenderingContext2D) def(OffscreenCanvasRenderingContext2D.prototype, "roundRect", roundRect);
  if (window.CanvasRenderingContext2D) def(CanvasRenderingContext2D.prototype, "reset", function() {
    this.setTransform(1, 0, 0, 1, 0, 0);
    this.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.beginPath();
  });
  if (window.Element) def(Element.prototype, "replaceChildren", function() {
    while (this.firstChild) this.removeChild(this.firstChild);
    this.append.apply(this, arguments);
  });
  try {
    var pc = document.createElement("canvas"), g = pc.getContext("webgl2");
    if (g) {
      var fb = g.createFramebuffer(), cb = g.createRenderbuffer(), db = g.createRenderbuffer(), tx = g.createTexture(), fb2 = g.createFramebuffer();
      g.bindFramebuffer(g.FRAMEBUFFER, fb);
      g.bindRenderbuffer(g.RENDERBUFFER, cb);
      g.renderbufferStorageMultisample(g.RENDERBUFFER, 4, g.RGBA8, 4, 4);
      g.framebufferRenderbuffer(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.RENDERBUFFER, cb);
      g.bindRenderbuffer(g.RENDERBUFFER, db);
      g.renderbufferStorageMultisample(g.RENDERBUFFER, 4, g.DEPTH_COMPONENT24, 4, 4);
      g.framebufferRenderbuffer(g.FRAMEBUFFER, g.DEPTH_ATTACHMENT, g.RENDERBUFFER, db);
      var ok = g.checkFramebufferStatus(g.FRAMEBUFFER) === g.FRAMEBUFFER_COMPLETE;
      if (ok) {
        g.clearColor(0, 1, 0, 1);
        g.clear(g.COLOR_BUFFER_BIT | g.DEPTH_BUFFER_BIT);
        g.bindTexture(g.TEXTURE_2D, tx);
        g.texStorage2D(g.TEXTURE_2D, 1, g.RGBA8, 4, 4);
        g.bindFramebuffer(g.DRAW_FRAMEBUFFER, fb2);
        g.framebufferTexture2D(g.DRAW_FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, tx, 0);
        g.bindFramebuffer(g.READ_FRAMEBUFFER, fb);
        g.blitFramebuffer(0, 0, 4, 4, 0, 0, 4, 4, g.COLOR_BUFFER_BIT, g.NEAREST);
        g.bindFramebuffer(g.FRAMEBUFFER, fb2);
        var px = new Uint8Array(4);
        g.readPixels(1, 1, 1, 1, g.RGBA, g.UNSIGNED_BYTE, px);
        ok = g.getError() === 0 && px[1] > 200 && px[0] < 50;
      }
      window.__bmNoMSAA = !ok;
      var lc = g.getExtension("WEBGL_lose_context");
      if (lc) lc.loseContext();
    }
  } catch (e) {
    window.__bmNoMSAA = true;
  }
  if (window.AbortSignal) def(AbortSignal, "timeout", function(ms) {
    var c = new AbortController();
    setTimeout(function() {
      c.abort();
    }, ms);
    return c.signal;
  });
})();
