(function(root) {
  "use strict";
  const AS = { R: 0.11, REL: 0.17, FR_M: 0.04, PULL_IN: 0.05, PULL_OUT: 0.06, FIRE_PULL: 0.7 };
  function create(opts) {
    const P = Object.assign({}, AS, opts || {});
    const st = { lock: null, pull: 0, lx: 0, ly: 0, x: 0, y: 0, fire: false, nearFriend: false };
    const inZone = (x, y, f, m) => x > f.x0 - m && x < f.x1 + m && y > f.y0 - m && y < f.y1 + m;
    function step(o) {
      const raw = o.raw, S0 = o.S0, dt = Math.max(1 / 240, Math.min(0.1, o.dt || 1 / 60)), fr = o.friends || [], m = P.FR_M * S0;
      const clear = (x, y) => {
        for (const f of fr) if (inZone(x, y, f, m)) return false;
        return true;
      };
      let cur = null;
      if (o.live && raw) {
        const T = o.targets || [];
        if (st.lock !== null) {
          for (const t of T) if (t.id === st.lock) {
            cur = t;
            break;
          }
          if (cur && (!clear(cur.x, cur.y) || Math.hypot(raw.x - cur.x, raw.y - cur.y) > P.REL * S0)) cur = null;
        }
        if (!cur) {
          let bd = P.R * S0;
          for (const t of T) {
            const d = Math.hypot(raw.x - t.x, raw.y - t.y);
            if (d < bd && clear(t.x, t.y)) {
              bd = d;
              cur = t;
            }
          }
        }
      }
      if (cur) {
        if (cur.id !== st.lock) st.pull = Math.min(st.pull, 0.25);
        st.lock = cur.id;
        st.lx = cur.x;
        st.ly = cur.y;
        st.pull += (1 - st.pull) * (1 - Math.exp(-dt / P.PULL_IN));
      } else {
        st.lock = null;
        st.pull *= Math.exp(-dt / P.PULL_OUT);
        if (st.pull < 0.01) st.pull = 0;
      }
      if (!raw) {
        st.fire = false;
        st.nearFriend = false;
        return st;
      }
      st.x = raw.x + (st.lx - raw.x) * st.pull;
      st.y = raw.y + (st.ly - raw.y) * st.pull;
      st.nearFriend = !clear(st.x, st.y) || !clear(raw.x, raw.y);
      st.fire = !!o.live && st.lock !== null && st.pull > P.FIRE_PULL && !st.nearFriend;
      return st;
    }
    function reset() {
      st.lock = null;
      st.pull = 0;
      st.fire = false;
      st.nearFriend = false;
    }
    return { state: st, step, reset, P };
  }
  const API = { create, AS };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.WSAssist = API;
})(typeof window !== "undefined" ? window : globalThis);
