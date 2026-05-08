var lv = Object.defineProperty;
var Rf = (e) => {
  throw TypeError(e);
};
var uv = (e, t, n) => t in e ? lv(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Yi = (e, t, n) => uv(e, typeof t != "symbol" ? t + "" : t, n), lc = (e, t, n) => t.has(e) || Rf("Cannot " + n);
var de = (e, t, n) => (lc(e, t, "read from private field"), n ? n.call(e) : t.get(e)), tn = (e, t, n) => t.has(e) ? Rf("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), kt = (e, t, n, r) => (lc(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n), Cn = (e, t, n) => (lc(e, t, "access private method"), n);
import Fn, { app as Pe, session as Df, ipcMain as re, BrowserWindow as ve, shell as so, dialog as Ir, Menu as fv } from "electron";
import D, { dirname as Np, join as ze } from "path";
import hr, { fileURLToPath as Ip } from "url";
import ke from "node:process";
import Se from "node:path";
import { promisify as pt, isDeepStrictEqual as Ff } from "node:util";
import he from "node:fs";
import Xi from "node:crypto";
import Lf from "node:assert";
import Pp from "node:os";
import "node:events";
import "node:stream";
import ya, { execSync as Ll, spawn as js } from "child_process";
import L from "fs";
import Et from "https";
import jo from "zlib";
import Oi from "crypto";
import { Client as dv } from "@xhayper/discord-rpc";
import hv from "constants";
import Mo from "stream";
import xl from "util";
import Op from "assert";
import Rp from "events";
import Dp from "tty";
import va from "os";
import pv from "http";
const qr = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, Fp = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), Lp = 1e6, mv = (e) => e >= "0" && e <= "9";
function xp(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= Lp;
  }
  return !1;
}
function uc(e, t) {
  return Fp.has(e) ? !1 : (e && xp(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function gv(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  const t = [];
  let n = "", r = "start", i = !1, o = 0;
  for (const s of e) {
    if (o++, i) {
      n += s, i = !1;
      continue;
    }
    if (s === "\\") {
      if (r === "index")
        throw new Error(`Invalid character '${s}' in an index at position ${o}`);
      if (r === "indexEnd")
        throw new Error(`Invalid character '${s}' after an index at position ${o}`);
      i = !0, r = r === "start" ? "property" : r;
      continue;
    }
    switch (s) {
      case ".": {
        if (r === "index")
          throw new Error(`Invalid character '${s}' in an index at position ${o}`);
        if (r === "indexEnd") {
          r = "property";
          break;
        }
        if (!uc(n, t))
          return [];
        n = "", r = "property";
        break;
      }
      case "[": {
        if (r === "index")
          throw new Error(`Invalid character '${s}' in an index at position ${o}`);
        if (r === "indexEnd") {
          r = "index";
          break;
        }
        if (r === "property" || r === "start") {
          if ((n || r === "property") && !uc(n, t))
            return [];
          n = "";
        }
        r = "index";
        break;
      }
      case "]": {
        if (r === "index") {
          if (n === "")
            n = (t.pop() || "") + "[]", r = "property";
          else {
            const a = Number.parseInt(n, 10);
            !Number.isNaN(a) && Number.isFinite(a) && a >= 0 && a <= Number.MAX_SAFE_INTEGER && a <= Lp && n === String(a) ? t.push(a) : t.push(n), n = "", r = "indexEnd";
          }
          break;
        }
        if (r === "indexEnd")
          throw new Error(`Invalid character '${s}' after an index at position ${o}`);
        n += s;
        break;
      }
      default: {
        if (r === "index" && !mv(s))
          throw new Error(`Invalid character '${s}' in an index at position ${o}`);
        if (r === "indexEnd")
          throw new Error(`Invalid character '${s}' after an index at position ${o}`);
        r === "start" && (r = "property"), n += s;
      }
    }
  }
  switch (i && (n += "\\"), r) {
    case "property": {
      if (!uc(n, t))
        return [];
      break;
    }
    case "index":
      throw new Error("Index was not closed");
    case "start": {
      t.push("");
      break;
    }
  }
  return t;
}
function wa(e) {
  if (typeof e == "string")
    return gv(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [n, r] of e.entries()) {
      if (typeof r != "string" && typeof r != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${n}, got ${typeof r}`);
      if (typeof r == "number" && !Number.isFinite(r))
        throw new TypeError(`Path segment at index ${n} must be a finite number, got ${r}`);
      if (Fp.has(r))
        return [];
      typeof r == "string" && xp(r) ? t.push(Number.parseInt(r, 10)) : t.push(r);
    }
    return t;
  }
  return [];
}
function xf(e, t, n) {
  if (!qr(e) || typeof t != "string" && !Array.isArray(t))
    return n === void 0 ? e : n;
  const r = wa(t);
  if (r.length === 0)
    return n;
  for (let i = 0; i < r.length; i++) {
    const o = r[i];
    if (e = e[o], e == null) {
      if (i !== r.length - 1)
        return n;
      break;
    }
  }
  return e === void 0 ? n : e;
}
function ls(e, t, n) {
  if (!qr(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const r = e, i = wa(t);
  if (i.length === 0)
    return e;
  for (let o = 0; o < i.length; o++) {
    const s = i[o];
    if (o === i.length - 1)
      e[s] = n;
    else if (!qr(e[s])) {
      const c = typeof i[o + 1] == "number";
      e[s] = c ? [] : {};
    }
    e = e[s];
  }
  return r;
}
function yv(e, t) {
  if (!qr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const n = wa(t);
  if (n.length === 0)
    return !1;
  for (let r = 0; r < n.length; r++) {
    const i = n[r];
    if (r === n.length - 1)
      return Object.hasOwn(e, i) ? (delete e[i], !0) : !1;
    if (e = e[i], !qr(e))
      return !1;
  }
}
function fc(e, t) {
  if (!qr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const n = wa(t);
  if (n.length === 0)
    return !1;
  for (const r of n) {
    if (!qr(e) || !(r in e))
      return !1;
    e = e[r];
  }
  return !0;
}
const Qn = Pp.homedir(), kl = Pp.tmpdir(), { env: hi } = ke, vv = (e) => {
  const t = Se.join(Qn, "Library");
  return {
    data: Se.join(t, "Application Support", e),
    config: Se.join(t, "Preferences", e),
    cache: Se.join(t, "Caches", e),
    log: Se.join(t, "Logs", e),
    temp: Se.join(kl, e)
  };
}, wv = (e) => {
  const t = hi.APPDATA || Se.join(Qn, "AppData", "Roaming"), n = hi.LOCALAPPDATA || Se.join(Qn, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: Se.join(n, e, "Data"),
    config: Se.join(t, e, "Config"),
    cache: Se.join(n, e, "Cache"),
    log: Se.join(n, e, "Log"),
    temp: Se.join(kl, e)
  };
}, Ev = (e) => {
  const t = Se.basename(Qn);
  return {
    data: Se.join(hi.XDG_DATA_HOME || Se.join(Qn, ".local", "share"), e),
    config: Se.join(hi.XDG_CONFIG_HOME || Se.join(Qn, ".config"), e),
    cache: Se.join(hi.XDG_CACHE_HOME || Se.join(Qn, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: Se.join(hi.XDG_STATE_HOME || Se.join(Qn, ".local", "state"), e),
    temp: Se.join(kl, t, e)
  };
};
function _v(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), ke.platform === "darwin" ? vv(e) : ke.platform === "win32" ? wv(e) : Ev(e);
}
const Hn = (e, t) => {
  const { onError: n } = t;
  return function(...i) {
    return e.apply(void 0, i).catch(n);
  };
}, Nn = (e, t) => {
  const { onError: n } = t;
  return function(...i) {
    try {
      return e.apply(void 0, i);
    } catch (o) {
      return n(o);
    }
  };
}, $v = 250, qn = (e, t) => {
  const { isRetriable: n } = t;
  return function(i) {
    const { timeout: o } = i, s = i.interval ?? $v, a = Date.now() + o;
    return function c(...u) {
      return e.apply(void 0, u).catch((l) => {
        if (!n(l) || Date.now() >= a)
          throw l;
        const f = Math.round(s * Math.random());
        return f > 0 ? new Promise((d) => setTimeout(d, f)).then(() => c.apply(void 0, u)) : c.apply(void 0, u);
      });
    };
  };
}, zn = (e, t) => {
  const { isRetriable: n } = t;
  return function(i) {
    const { timeout: o } = i, s = Date.now() + o;
    return function(...c) {
      for (; ; )
        try {
          return e.apply(void 0, c);
        } catch (u) {
          if (!n(u) || Date.now() >= s)
            throw u;
          continue;
        }
    };
  };
}, pi = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!pi.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !Sv && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!pi.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!pi.isNodeError(e))
      throw e;
    if (!pi.isChangeErrorOk(e))
      throw e;
  }
}, us = {
  onError: pi.onChangeError
}, qt = {
  onError: () => {
  }
}, Sv = ke.getuid ? !ke.getuid() : !1, mt = {
  isRetriable: pi.isRetriableError
}, yt = {
  attempt: {
    /* ASYNC */
    chmod: Hn(pt(he.chmod), us),
    chown: Hn(pt(he.chown), us),
    close: Hn(pt(he.close), qt),
    fsync: Hn(pt(he.fsync), qt),
    mkdir: Hn(pt(he.mkdir), qt),
    realpath: Hn(pt(he.realpath), qt),
    stat: Hn(pt(he.stat), qt),
    unlink: Hn(pt(he.unlink), qt),
    /* SYNC */
    chmodSync: Nn(he.chmodSync, us),
    chownSync: Nn(he.chownSync, us),
    closeSync: Nn(he.closeSync, qt),
    existsSync: Nn(he.existsSync, qt),
    fsyncSync: Nn(he.fsync, qt),
    mkdirSync: Nn(he.mkdirSync, qt),
    realpathSync: Nn(he.realpathSync, qt),
    statSync: Nn(he.statSync, qt),
    unlinkSync: Nn(he.unlinkSync, qt)
  },
  retry: {
    /* ASYNC */
    close: qn(pt(he.close), mt),
    fsync: qn(pt(he.fsync), mt),
    open: qn(pt(he.open), mt),
    readFile: qn(pt(he.readFile), mt),
    rename: qn(pt(he.rename), mt),
    stat: qn(pt(he.stat), mt),
    write: qn(pt(he.write), mt),
    writeFile: qn(pt(he.writeFile), mt),
    /* SYNC */
    closeSync: zn(he.closeSync, mt),
    fsyncSync: zn(he.fsyncSync, mt),
    openSync: zn(he.openSync, mt),
    readFileSync: zn(he.readFileSync, mt),
    renameSync: zn(he.renameSync, mt),
    statSync: zn(he.statSync, mt),
    writeSync: zn(he.writeSync, mt),
    writeFileSync: zn(he.writeFileSync, mt)
  }
}, bv = "utf8", kf = 438, Av = 511, Tv = {}, Cv = ke.geteuid ? ke.geteuid() : -1, Nv = ke.getegid ? ke.getegid() : -1, Iv = 1e3, Pv = !!ke.getuid;
ke.getuid && ke.getuid();
const Uf = 128, Ov = (e) => e instanceof Error && "code" in e, jf = (e) => typeof e == "string", dc = (e) => e === void 0, Rv = ke.platform === "linux", kp = ke.platform === "win32", Ul = ["SIGHUP", "SIGINT", "SIGTERM"];
kp || Ul.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
Rv && Ul.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class Dv {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const n of this.callbacks)
          n();
        t && (kp && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? ke.kill(ke.pid, "SIGTERM") : ke.kill(ke.pid, t));
      }
    }, this.hook = () => {
      ke.once("exit", () => this.exit());
      for (const t of Ul)
        try {
          ke.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const Fv = new Dv(), Lv = Fv.register, vt = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), i = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${i}`;
  },
  get: (e, t, n = !0) => {
    const r = vt.truncate(t(e));
    return r in vt.store ? vt.get(e, t, n) : (vt.store[r] = n, [r, () => delete vt.store[r]]);
  },
  purge: (e) => {
    vt.store[e] && (delete vt.store[e], yt.attempt.unlink(e));
  },
  purgeSync: (e) => {
    vt.store[e] && (delete vt.store[e], yt.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in vt.store)
      vt.purgeSync(e);
  },
  truncate: (e) => {
    const t = Se.basename(e);
    if (t.length <= Uf)
      return e;
    const n = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!n)
      return e;
    const r = t.length - Uf;
    return `${e.slice(0, -t.length)}${n[1]}${n[2].slice(0, -r)}${n[3]}`;
  }
};
Lv(vt.purgeSyncAll);
function Up(e, t, n = Tv) {
  if (jf(n))
    return Up(e, t, { encoding: n });
  const i = { timeout: n.timeout ?? Iv };
  let o = null, s = null, a = null;
  try {
    const c = yt.attempt.realpathSync(e), u = !!c;
    e = c || e, [s, o] = vt.get(e, n.tmpCreate || vt.create, n.tmpPurge !== !1);
    const l = Pv && dc(n.chown), f = dc(n.mode);
    if (u && (l || f)) {
      const h = yt.attempt.statSync(e);
      h && (n = { ...n }, l && (n.chown = { uid: h.uid, gid: h.gid }), f && (n.mode = h.mode));
    }
    if (!u) {
      const h = Se.dirname(e);
      yt.attempt.mkdirSync(h, {
        mode: Av,
        recursive: !0
      });
    }
    a = yt.retry.openSync(i)(s, "w", n.mode || kf), n.tmpCreated && n.tmpCreated(s), jf(t) ? yt.retry.writeSync(i)(a, t, 0, n.encoding || bv) : dc(t) || yt.retry.writeSync(i)(a, t, 0, t.length, 0), n.fsync !== !1 && (n.fsyncWait !== !1 ? yt.retry.fsyncSync(i)(a) : yt.attempt.fsync(a)), yt.retry.closeSync(i)(a), a = null, n.chown && (n.chown.uid !== Cv || n.chown.gid !== Nv) && yt.attempt.chownSync(s, n.chown.uid, n.chown.gid), n.mode && n.mode !== kf && yt.attempt.chmodSync(s, n.mode);
    try {
      yt.retry.renameSync(i)(s, e);
    } catch (h) {
      if (!Ov(h) || h.code !== "ENAMETOOLONG")
        throw h;
      yt.retry.renameSync(i)(s, vt.truncate(e));
    }
    o(), s = null;
  } finally {
    a && yt.attempt.closeSync(a), s && vt.purge(s);
  }
}
var Nt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function jl(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var al = { exports: {} }, Ml = {}, Zt = {}, Ti = {}, Bo = {}, ue = {}, _o = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class n extends t {
    constructor(g) {
      if (super(), !e.IDENTIFIER.test(g))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = g;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      return !1;
    }
    get names() {
      return { [this.str]: 1 };
    }
  }
  e.Name = n;
  class r extends t {
    constructor(g) {
      super(), this._items = typeof g == "string" ? [g] : g;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const g = this._items[0];
      return g === "" || g === '""';
    }
    get str() {
      var g;
      return (g = this._str) !== null && g !== void 0 ? g : this._str = this._items.reduce((E, S) => `${E}${S}`, "");
    }
    get names() {
      var g;
      return (g = this._names) !== null && g !== void 0 ? g : this._names = this._items.reduce((E, S) => (S instanceof n && (E[S.str] = (E[S.str] || 0) + 1), E), {});
    }
  }
  e._Code = r, e.nil = new r("");
  function i(y, ...g) {
    const E = [y[0]];
    let S = 0;
    for (; S < g.length; )
      a(E, g[S]), E.push(y[++S]);
    return new r(E);
  }
  e._ = i;
  const o = new r("+");
  function s(y, ...g) {
    const E = [d(y[0])];
    let S = 0;
    for (; S < g.length; )
      E.push(o), a(E, g[S]), E.push(o, d(y[++S]));
    return c(E), new r(E);
  }
  e.str = s;
  function a(y, g) {
    g instanceof r ? y.push(...g._items) : g instanceof n ? y.push(g) : y.push(f(g));
  }
  e.addCodeArg = a;
  function c(y) {
    let g = 1;
    for (; g < y.length - 1; ) {
      if (y[g] === o) {
        const E = u(y[g - 1], y[g + 1]);
        if (E !== void 0) {
          y.splice(g - 1, 3, E);
          continue;
        }
        y[g++] = "+";
      }
      g++;
    }
  }
  function u(y, g) {
    if (g === '""')
      return y;
    if (y === '""')
      return g;
    if (typeof y == "string")
      return g instanceof n || y[y.length - 1] !== '"' ? void 0 : typeof g != "string" ? `${y.slice(0, -1)}${g}"` : g[0] === '"' ? y.slice(0, -1) + g.slice(1) : void 0;
    if (typeof g == "string" && g[0] === '"' && !(y instanceof n))
      return `"${y}${g.slice(1)}`;
  }
  function l(y, g) {
    return g.emptyStr() ? y : y.emptyStr() ? g : s`${y}${g}`;
  }
  e.strConcat = l;
  function f(y) {
    return typeof y == "number" || typeof y == "boolean" || y === null ? y : d(Array.isArray(y) ? y.join(",") : y);
  }
  function h(y) {
    return new r(d(y));
  }
  e.stringify = h;
  function d(y) {
    return JSON.stringify(y).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = d;
  function m(y) {
    return typeof y == "string" && e.IDENTIFIER.test(y) ? new r(`.${y}`) : i`[${y}]`;
  }
  e.getProperty = m;
  function p(y) {
    if (typeof y == "string" && e.IDENTIFIER.test(y))
      return new r(`${y}`);
    throw new Error(`CodeGen: invalid export name: ${y}, use explicit $id name mapping`);
  }
  e.getEsmExportName = p;
  function v(y) {
    return new r(y.toString());
  }
  e.regexpCode = v;
})(_o);
var cl = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = _o;
  class n extends Error {
    constructor(u) {
      super(`CodeGen: "code" for ${u} not defined`), this.value = u.value;
    }
  }
  var r;
  (function(c) {
    c[c.Started = 0] = "Started", c[c.Completed = 1] = "Completed";
  })(r || (e.UsedValueState = r = {})), e.varKinds = {
    const: new t.Name("const"),
    let: new t.Name("let"),
    var: new t.Name("var")
  };
  class i {
    constructor({ prefixes: u, parent: l } = {}) {
      this._names = {}, this._prefixes = u, this._parent = l;
    }
    toName(u) {
      return u instanceof t.Name ? u : this.name(u);
    }
    name(u) {
      return new t.Name(this._newName(u));
    }
    _newName(u) {
      const l = this._names[u] || this._nameGroup(u);
      return `${u}${l.index++}`;
    }
    _nameGroup(u) {
      var l, f;
      if (!((f = (l = this._parent) === null || l === void 0 ? void 0 : l._prefixes) === null || f === void 0) && f.has(u) || this._prefixes && !this._prefixes.has(u))
        throw new Error(`CodeGen: prefix "${u}" is not allowed in this scope`);
      return this._names[u] = { prefix: u, index: 0 };
    }
  }
  e.Scope = i;
  class o extends t.Name {
    constructor(u, l) {
      super(l), this.prefix = u;
    }
    setValue(u, { property: l, itemIndex: f }) {
      this.value = u, this.scopePath = (0, t._)`.${new t.Name(l)}[${f}]`;
    }
  }
  e.ValueScopeName = o;
  const s = (0, t._)`\n`;
  class a extends i {
    constructor(u) {
      super(u), this._values = {}, this._scope = u.scope, this.opts = { ...u, _n: u.lines ? s : t.nil };
    }
    get() {
      return this._scope;
    }
    name(u) {
      return new o(u, this._newName(u));
    }
    value(u, l) {
      var f;
      if (l.ref === void 0)
        throw new Error("CodeGen: ref must be passed in value");
      const h = this.toName(u), { prefix: d } = h, m = (f = l.key) !== null && f !== void 0 ? f : l.ref;
      let p = this._values[d];
      if (p) {
        const g = p.get(m);
        if (g)
          return g;
      } else
        p = this._values[d] = /* @__PURE__ */ new Map();
      p.set(m, h);
      const v = this._scope[d] || (this._scope[d] = []), y = v.length;
      return v[y] = l.ref, h.setValue(l, { property: d, itemIndex: y }), h;
    }
    getValue(u, l) {
      const f = this._values[u];
      if (f)
        return f.get(l);
    }
    scopeRefs(u, l = this._values) {
      return this._reduceValues(l, (f) => {
        if (f.scopePath === void 0)
          throw new Error(`CodeGen: name "${f}" has no value`);
        return (0, t._)`${u}${f.scopePath}`;
      });
    }
    scopeCode(u = this._values, l, f) {
      return this._reduceValues(u, (h) => {
        if (h.value === void 0)
          throw new Error(`CodeGen: name "${h}" has no value`);
        return h.value.code;
      }, l, f);
    }
    _reduceValues(u, l, f = {}, h) {
      let d = t.nil;
      for (const m in u) {
        const p = u[m];
        if (!p)
          continue;
        const v = f[m] = f[m] || /* @__PURE__ */ new Map();
        p.forEach((y) => {
          if (v.has(y))
            return;
          v.set(y, r.Started);
          let g = l(y);
          if (g) {
            const E = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            d = (0, t._)`${d}${E} ${y} = ${g};${this.opts._n}`;
          } else if (g = h == null ? void 0 : h(y))
            d = (0, t._)`${d}${g}${this.opts._n}`;
          else
            throw new n(y);
          v.set(y, r.Completed);
        });
      }
      return d;
    }
  }
  e.ValueScope = a;
})(cl);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = _o, n = cl;
  var r = _o;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return r._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return r.str;
  } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
    return r.strConcat;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return r.nil;
  } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
    return r.getProperty;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return r.stringify;
  } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
    return r.regexpCode;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return r.Name;
  } });
  var i = cl;
  Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
    return i.Scope;
  } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
    return i.ValueScope;
  } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
    return i.ValueScopeName;
  } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
    return i.varKinds;
  } }), e.operators = {
    GT: new t._Code(">"),
    GTE: new t._Code(">="),
    LT: new t._Code("<"),
    LTE: new t._Code("<="),
    EQ: new t._Code("==="),
    NEQ: new t._Code("!=="),
    NOT: new t._Code("!"),
    OR: new t._Code("||"),
    AND: new t._Code("&&"),
    ADD: new t._Code("+")
  };
  class o {
    optimizeNodes() {
      return this;
    }
    optimizeNames($, T) {
      return this;
    }
  }
  class s extends o {
    constructor($, T, M) {
      super(), this.varKind = $, this.name = T, this.rhs = M;
    }
    render({ es5: $, _n: T }) {
      const M = $ ? n.varKinds.var : this.varKind, ne = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${M} ${this.name}${ne};` + T;
    }
    optimizeNames($, T) {
      if ($[this.name.str])
        return this.rhs && (this.rhs = F(this.rhs, $, T)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class a extends o {
    constructor($, T, M) {
      super(), this.lhs = $, this.rhs = T, this.sideEffects = M;
    }
    render({ _n: $ }) {
      return `${this.lhs} = ${this.rhs};` + $;
    }
    optimizeNames($, T) {
      if (!(this.lhs instanceof t.Name && !$[this.lhs.str] && !this.sideEffects))
        return this.rhs = F(this.rhs, $, T), this;
    }
    get names() {
      const $ = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return Z($, this.rhs);
    }
  }
  class c extends a {
    constructor($, T, M, ne) {
      super($, M, ne), this.op = T;
    }
    render({ _n: $ }) {
      return `${this.lhs} ${this.op}= ${this.rhs};` + $;
    }
  }
  class u extends o {
    constructor($) {
      super(), this.label = $, this.names = {};
    }
    render({ _n: $ }) {
      return `${this.label}:` + $;
    }
  }
  class l extends o {
    constructor($) {
      super(), this.label = $, this.names = {};
    }
    render({ _n: $ }) {
      return `break${this.label ? ` ${this.label}` : ""};` + $;
    }
  }
  class f extends o {
    constructor($) {
      super(), this.error = $;
    }
    render({ _n: $ }) {
      return `throw ${this.error};` + $;
    }
    get names() {
      return this.error.names;
    }
  }
  class h extends o {
    constructor($) {
      super(), this.code = $;
    }
    render({ _n: $ }) {
      return `${this.code};` + $;
    }
    optimizeNodes() {
      return `${this.code}` ? this : void 0;
    }
    optimizeNames($, T) {
      return this.code = F(this.code, $, T), this;
    }
    get names() {
      return this.code instanceof t._CodeOrName ? this.code.names : {};
    }
  }
  class d extends o {
    constructor($ = []) {
      super(), this.nodes = $;
    }
    render($) {
      return this.nodes.reduce((T, M) => T + M.render($), "");
    }
    optimizeNodes() {
      const { nodes: $ } = this;
      let T = $.length;
      for (; T--; ) {
        const M = $[T].optimizeNodes();
        Array.isArray(M) ? $.splice(T, 1, ...M) : M ? $[T] = M : $.splice(T, 1);
      }
      return $.length > 0 ? this : void 0;
    }
    optimizeNames($, T) {
      const { nodes: M } = this;
      let ne = M.length;
      for (; ne--; ) {
        const te = M[ne];
        te.optimizeNames($, T) || (x($, te.names), M.splice(ne, 1));
      }
      return M.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce(($, T) => V($, T.names), {});
    }
  }
  class m extends d {
    render($) {
      return "{" + $._n + super.render($) + "}" + $._n;
    }
  }
  class p extends d {
  }
  class v extends m {
  }
  v.kind = "else";
  class y extends m {
    constructor($, T) {
      super(T), this.condition = $;
    }
    render($) {
      let T = `if(${this.condition})` + super.render($);
      return this.else && (T += "else " + this.else.render($)), T;
    }
    optimizeNodes() {
      super.optimizeNodes();
      const $ = this.condition;
      if ($ === !0)
        return this.nodes;
      let T = this.else;
      if (T) {
        const M = T.optimizeNodes();
        T = this.else = Array.isArray(M) ? new v(M) : M;
      }
      if (T)
        return $ === !1 ? T instanceof y ? T : T.nodes : this.nodes.length ? this : new y(W($), T instanceof y ? [T] : T.nodes);
      if (!($ === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames($, T) {
      var M;
      if (this.else = (M = this.else) === null || M === void 0 ? void 0 : M.optimizeNames($, T), !!(super.optimizeNames($, T) || this.else))
        return this.condition = F(this.condition, $, T), this;
    }
    get names() {
      const $ = super.names;
      return Z($, this.condition), this.else && V($, this.else.names), $;
    }
  }
  y.kind = "if";
  class g extends m {
  }
  g.kind = "for";
  class E extends g {
    constructor($) {
      super(), this.iteration = $;
    }
    render($) {
      return `for(${this.iteration})` + super.render($);
    }
    optimizeNames($, T) {
      if (super.optimizeNames($, T))
        return this.iteration = F(this.iteration, $, T), this;
    }
    get names() {
      return V(super.names, this.iteration.names);
    }
  }
  class S extends g {
    constructor($, T, M, ne) {
      super(), this.varKind = $, this.name = T, this.from = M, this.to = ne;
    }
    render($) {
      const T = $.es5 ? n.varKinds.var : this.varKind, { name: M, from: ne, to: te } = this;
      return `for(${T} ${M}=${ne}; ${M}<${te}; ${M}++)` + super.render($);
    }
    get names() {
      const $ = Z(super.names, this.from);
      return Z($, this.to);
    }
  }
  class C extends g {
    constructor($, T, M, ne) {
      super(), this.loop = $, this.varKind = T, this.name = M, this.iterable = ne;
    }
    render($) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render($);
    }
    optimizeNames($, T) {
      if (super.optimizeNames($, T))
        return this.iterable = F(this.iterable, $, T), this;
    }
    get names() {
      return V(super.names, this.iterable.names);
    }
  }
  class U extends m {
    constructor($, T, M) {
      super(), this.name = $, this.args = T, this.async = M;
    }
    render($) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render($);
    }
  }
  U.kind = "func";
  class G extends d {
    render($) {
      return "return " + super.render($);
    }
  }
  G.kind = "return";
  class z extends m {
    render($) {
      let T = "try" + super.render($);
      return this.catch && (T += this.catch.render($)), this.finally && (T += this.finally.render($)), T;
    }
    optimizeNodes() {
      var $, T;
      return super.optimizeNodes(), ($ = this.catch) === null || $ === void 0 || $.optimizeNodes(), (T = this.finally) === null || T === void 0 || T.optimizeNodes(), this;
    }
    optimizeNames($, T) {
      var M, ne;
      return super.optimizeNames($, T), (M = this.catch) === null || M === void 0 || M.optimizeNames($, T), (ne = this.finally) === null || ne === void 0 || ne.optimizeNames($, T), this;
    }
    get names() {
      const $ = super.names;
      return this.catch && V($, this.catch.names), this.finally && V($, this.finally.names), $;
    }
  }
  class H extends m {
    constructor($) {
      super(), this.error = $;
    }
    render($) {
      return `catch(${this.error})` + super.render($);
    }
  }
  H.kind = "catch";
  class b extends m {
    render($) {
      return "finally" + super.render($);
    }
  }
  b.kind = "finally";
  class B {
    constructor($, T = {}) {
      this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...T, _n: T.lines ? `
` : "" }, this._extScope = $, this._scope = new n.Scope({ parent: $ }), this._nodes = [new p()];
    }
    toString() {
      return this._root.render(this.opts);
    }
    // returns unique name in the internal scope
    name($) {
      return this._scope.name($);
    }
    // reserves unique name in the external scope
    scopeName($) {
      return this._extScope.name($);
    }
    // reserves unique name in the external scope and assigns value to it
    scopeValue($, T) {
      const M = this._extScope.value($, T);
      return (this._values[M.prefix] || (this._values[M.prefix] = /* @__PURE__ */ new Set())).add(M), M;
    }
    getScopeValue($, T) {
      return this._extScope.getValue($, T);
    }
    // return code that assigns values in the external scope to the names that are used internally
    // (same names that were returned by gen.scopeName or gen.scopeValue)
    scopeRefs($) {
      return this._extScope.scopeRefs($, this._values);
    }
    scopeCode() {
      return this._extScope.scopeCode(this._values);
    }
    _def($, T, M, ne) {
      const te = this._scope.toName(T);
      return M !== void 0 && ne && (this._constants[te.str] = M), this._leafNode(new s($, te, M)), te;
    }
    // `const` declaration (`var` in es5 mode)
    const($, T, M) {
      return this._def(n.varKinds.const, $, T, M);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let($, T, M) {
      return this._def(n.varKinds.let, $, T, M);
    }
    // `var` declaration with optional assignment
    var($, T, M) {
      return this._def(n.varKinds.var, $, T, M);
    }
    // assignment code
    assign($, T, M) {
      return this._leafNode(new a($, T, M));
    }
    // `+=` code
    add($, T) {
      return this._leafNode(new c($, e.operators.ADD, T));
    }
    // appends passed SafeExpr to code or executes Block
    code($) {
      return typeof $ == "function" ? $() : $ !== t.nil && this._leafNode(new h($)), this;
    }
    // returns code for object literal for the passed argument list of key-value pairs
    object(...$) {
      const T = ["{"];
      for (const [M, ne] of $)
        T.length > 1 && T.push(","), T.push(M), (M !== ne || this.opts.es5) && (T.push(":"), (0, t.addCodeArg)(T, ne));
      return T.push("}"), new t._Code(T);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if($, T, M) {
      if (this._blockNode(new y($)), T && M)
        this.code(T).else().code(M).endIf();
      else if (T)
        this.code(T).endIf();
      else if (M)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf($) {
      return this._elseNode(new y($));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new v());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(y, v);
    }
    _for($, T) {
      return this._blockNode($), T && this.code(T).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for($, T) {
      return this._for(new E($), T);
    }
    // `for` statement for a range of values
    forRange($, T, M, ne, te = this.opts.es5 ? n.varKinds.var : n.varKinds.let) {
      const we = this._scope.toName($);
      return this._for(new S(te, we, T, M), () => ne(we));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf($, T, M, ne = n.varKinds.const) {
      const te = this._scope.toName($);
      if (this.opts.es5) {
        const we = T instanceof t.Name ? T : this.var("_arr", T);
        return this.forRange("_i", 0, (0, t._)`${we}.length`, (ce) => {
          this.var(te, (0, t._)`${we}[${ce}]`), M(te);
        });
      }
      return this._for(new C("of", ne, te, T), () => M(te));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn($, T, M, ne = this.opts.es5 ? n.varKinds.var : n.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf($, (0, t._)`Object.keys(${T})`, M);
      const te = this._scope.toName($);
      return this._for(new C("in", ne, te, T), () => M(te));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(g);
    }
    // `label` statement
    label($) {
      return this._leafNode(new u($));
    }
    // `break` statement
    break($) {
      return this._leafNode(new l($));
    }
    // `return` statement
    return($) {
      const T = new G();
      if (this._blockNode(T), this.code($), T.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(G);
    }
    // `try` statement
    try($, T, M) {
      if (!T && !M)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const ne = new z();
      if (this._blockNode(ne), this.code($), T) {
        const te = this.name("e");
        this._currNode = ne.catch = new H(te), T(te);
      }
      return M && (this._currNode = ne.finally = new b(), this.code(M)), this._endBlockNode(H, b);
    }
    // `throw` statement
    throw($) {
      return this._leafNode(new f($));
    }
    // start self-balancing block
    block($, T) {
      return this._blockStarts.push(this._nodes.length), $ && this.code($).endBlock(T), this;
    }
    // end the current self-balancing block
    endBlock($) {
      const T = this._blockStarts.pop();
      if (T === void 0)
        throw new Error("CodeGen: not in self-balancing block");
      const M = this._nodes.length - T;
      if (M < 0 || $ !== void 0 && M !== $)
        throw new Error(`CodeGen: wrong number of nodes: ${M} vs ${$} expected`);
      return this._nodes.length = T, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func($, T = t.nil, M, ne) {
      return this._blockNode(new U($, T, M)), ne && this.code(ne).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(U);
    }
    optimize($ = 1) {
      for (; $-- > 0; )
        this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
    }
    _leafNode($) {
      return this._currNode.nodes.push($), this;
    }
    _blockNode($) {
      this._currNode.nodes.push($), this._nodes.push($);
    }
    _endBlockNode($, T) {
      const M = this._currNode;
      if (M instanceof $ || T && M instanceof T)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${T ? `${$.kind}/${T.kind}` : $.kind}"`);
    }
    _elseNode($) {
      const T = this._currNode;
      if (!(T instanceof y))
        throw new Error('CodeGen: "else" without "if"');
      return this._currNode = T.else = $, this;
    }
    get _root() {
      return this._nodes[0];
    }
    get _currNode() {
      const $ = this._nodes;
      return $[$.length - 1];
    }
    set _currNode($) {
      const T = this._nodes;
      T[T.length - 1] = $;
    }
  }
  e.CodeGen = B;
  function V(O, $) {
    for (const T in $)
      O[T] = (O[T] || 0) + ($[T] || 0);
    return O;
  }
  function Z(O, $) {
    return $ instanceof t._CodeOrName ? V(O, $.names) : O;
  }
  function F(O, $, T) {
    if (O instanceof t.Name)
      return M(O);
    if (!ne(O))
      return O;
    return new t._Code(O._items.reduce((te, we) => (we instanceof t.Name && (we = M(we)), we instanceof t._Code ? te.push(...we._items) : te.push(we), te), []));
    function M(te) {
      const we = T[te.str];
      return we === void 0 || $[te.str] !== 1 ? te : (delete $[te.str], we);
    }
    function ne(te) {
      return te instanceof t._Code && te._items.some((we) => we instanceof t.Name && $[we.str] === 1 && T[we.str] !== void 0);
    }
  }
  function x(O, $) {
    for (const T in $)
      O[T] = (O[T] || 0) - ($[T] || 0);
  }
  function W(O) {
    return typeof O == "boolean" || typeof O == "number" || O === null ? !O : (0, t._)`!${R(O)}`;
  }
  e.not = W;
  const q = N(e.operators.AND);
  function Y(...O) {
    return O.reduce(q);
  }
  e.and = Y;
  const J = N(e.operators.OR);
  function j(...O) {
    return O.reduce(J);
  }
  e.or = j;
  function N(O) {
    return ($, T) => $ === t.nil ? T : T === t.nil ? $ : (0, t._)`${R($)} ${O} ${R(T)}`;
  }
  function R(O) {
    return O instanceof t.Name ? O : (0, t._)`(${O})`;
  }
})(ue);
var Q = {};
Object.defineProperty(Q, "__esModule", { value: !0 });
Q.checkStrictMode = Q.getErrorPath = Q.Type = Q.useFunc = Q.setEvaluated = Q.evaluatedPropsToName = Q.mergeEvaluated = Q.eachItem = Q.unescapeJsonPointer = Q.escapeJsonPointer = Q.escapeFragment = Q.unescapeFragment = Q.schemaRefOrVal = Q.schemaHasRulesButRef = Q.schemaHasRules = Q.checkUnknownRules = Q.alwaysValidSchema = Q.toHash = void 0;
const Ie = ue, xv = _o;
function kv(e) {
  const t = {};
  for (const n of e)
    t[n] = !0;
  return t;
}
Q.toHash = kv;
function Uv(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (jp(e, t), !Mp(t, e.self.RULES.all));
}
Q.alwaysValidSchema = Uv;
function jp(e, t = e.schema) {
  const { opts: n, self: r } = e;
  if (!n.strictSchema || typeof t == "boolean")
    return;
  const i = r.RULES.keywords;
  for (const o in t)
    i[o] || qp(e, `unknown keyword: "${o}"`);
}
Q.checkUnknownRules = jp;
function Mp(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const n in e)
    if (t[n])
      return !0;
  return !1;
}
Q.schemaHasRules = Mp;
function jv(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const n in e)
    if (n !== "$ref" && t.all[n])
      return !0;
  return !1;
}
Q.schemaHasRulesButRef = jv;
function Mv({ topSchemaRef: e, schemaPath: t }, n, r, i) {
  if (!i) {
    if (typeof n == "number" || typeof n == "boolean")
      return n;
    if (typeof n == "string")
      return (0, Ie._)`${n}`;
  }
  return (0, Ie._)`${e}${t}${(0, Ie.getProperty)(r)}`;
}
Q.schemaRefOrVal = Mv;
function Bv(e) {
  return Bp(decodeURIComponent(e));
}
Q.unescapeFragment = Bv;
function Hv(e) {
  return encodeURIComponent(Bl(e));
}
Q.escapeFragment = Hv;
function Bl(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
Q.escapeJsonPointer = Bl;
function Bp(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
Q.unescapeJsonPointer = Bp;
function qv(e, t) {
  if (Array.isArray(e))
    for (const n of e)
      t(n);
  else
    t(e);
}
Q.eachItem = qv;
function Mf({ mergeNames: e, mergeToName: t, mergeValues: n, resultToName: r }) {
  return (i, o, s, a) => {
    const c = s === void 0 ? o : s instanceof Ie.Name ? (o instanceof Ie.Name ? e(i, o, s) : t(i, o, s), s) : o instanceof Ie.Name ? (t(i, s, o), o) : n(o, s);
    return a === Ie.Name && !(c instanceof Ie.Name) ? r(i, c) : c;
  };
}
Q.mergeEvaluated = {
  props: Mf({
    mergeNames: (e, t, n) => e.if((0, Ie._)`${n} !== true && ${t} !== undefined`, () => {
      e.if((0, Ie._)`${t} === true`, () => e.assign(n, !0), () => e.assign(n, (0, Ie._)`${n} || {}`).code((0, Ie._)`Object.assign(${n}, ${t})`));
    }),
    mergeToName: (e, t, n) => e.if((0, Ie._)`${n} !== true`, () => {
      t === !0 ? e.assign(n, !0) : (e.assign(n, (0, Ie._)`${n} || {}`), Hl(e, n, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Hp
  }),
  items: Mf({
    mergeNames: (e, t, n) => e.if((0, Ie._)`${n} !== true && ${t} !== undefined`, () => e.assign(n, (0, Ie._)`${t} === true ? true : ${n} > ${t} ? ${n} : ${t}`)),
    mergeToName: (e, t, n) => e.if((0, Ie._)`${n} !== true`, () => e.assign(n, t === !0 ? !0 : (0, Ie._)`${n} > ${t} ? ${n} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Hp(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const n = e.var("props", (0, Ie._)`{}`);
  return t !== void 0 && Hl(e, n, t), n;
}
Q.evaluatedPropsToName = Hp;
function Hl(e, t, n) {
  Object.keys(n).forEach((r) => e.assign((0, Ie._)`${t}${(0, Ie.getProperty)(r)}`, !0));
}
Q.setEvaluated = Hl;
const Bf = {};
function zv(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Bf[t.code] || (Bf[t.code] = new xv._Code(t.code))
  });
}
Q.useFunc = zv;
var ll;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(ll || (Q.Type = ll = {}));
function Vv(e, t, n) {
  if (e instanceof Ie.Name) {
    const r = t === ll.Num;
    return n ? r ? (0, Ie._)`"[" + ${e} + "]"` : (0, Ie._)`"['" + ${e} + "']"` : r ? (0, Ie._)`"/" + ${e}` : (0, Ie._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return n ? (0, Ie.getProperty)(e).toString() : "/" + Bl(e);
}
Q.getErrorPath = Vv;
function qp(e, t, n = e.opts.strictSchema) {
  if (n) {
    if (t = `strict mode: ${t}`, n === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
Q.checkStrictMode = qp;
var Gt = {};
Object.defineProperty(Gt, "__esModule", { value: !0 });
const gt = ue, Gv = {
  // validation function arguments
  data: new gt.Name("data"),
  // data passed to validation function
  // args passed from referencing schema
  valCxt: new gt.Name("valCxt"),
  // validation/data context - should not be used directly, it is destructured to the names below
  instancePath: new gt.Name("instancePath"),
  parentData: new gt.Name("parentData"),
  parentDataProperty: new gt.Name("parentDataProperty"),
  rootData: new gt.Name("rootData"),
  // root data - same as the data passed to the first/top validation function
  dynamicAnchors: new gt.Name("dynamicAnchors"),
  // used to support recursiveRef and dynamicRef
  // function scoped variables
  vErrors: new gt.Name("vErrors"),
  // null or array of validation errors
  errors: new gt.Name("errors"),
  // counter of validation errors
  this: new gt.Name("this"),
  // "globals"
  self: new gt.Name("self"),
  scope: new gt.Name("scope"),
  // JTD serialize/parse name for JSON string and position
  json: new gt.Name("json"),
  jsonPos: new gt.Name("jsonPos"),
  jsonLen: new gt.Name("jsonLen"),
  jsonPart: new gt.Name("jsonPart")
};
Gt.default = Gv;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = ue, n = Q, r = Gt;
  e.keywordError = {
    message: ({ keyword: v }) => (0, t.str)`must pass "${v}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: v, schemaType: y }) => y ? (0, t.str)`"${v}" keyword must be ${y} ($data)` : (0, t.str)`"${v}" keyword is invalid ($data)`
  };
  function i(v, y = e.keywordError, g, E) {
    const { it: S } = v, { gen: C, compositeRule: U, allErrors: G } = S, z = f(v, y, g);
    E ?? (U || G) ? c(C, z) : u(S, (0, t._)`[${z}]`);
  }
  e.reportError = i;
  function o(v, y = e.keywordError, g) {
    const { it: E } = v, { gen: S, compositeRule: C, allErrors: U } = E, G = f(v, y, g);
    c(S, G), C || U || u(E, r.default.vErrors);
  }
  e.reportExtraError = o;
  function s(v, y) {
    v.assign(r.default.errors, y), v.if((0, t._)`${r.default.vErrors} !== null`, () => v.if(y, () => v.assign((0, t._)`${r.default.vErrors}.length`, y), () => v.assign(r.default.vErrors, null)));
  }
  e.resetErrorsCount = s;
  function a({ gen: v, keyword: y, schemaValue: g, data: E, errsCount: S, it: C }) {
    if (S === void 0)
      throw new Error("ajv implementation error");
    const U = v.name("err");
    v.forRange("i", S, r.default.errors, (G) => {
      v.const(U, (0, t._)`${r.default.vErrors}[${G}]`), v.if((0, t._)`${U}.instancePath === undefined`, () => v.assign((0, t._)`${U}.instancePath`, (0, t.strConcat)(r.default.instancePath, C.errorPath))), v.assign((0, t._)`${U}.schemaPath`, (0, t.str)`${C.errSchemaPath}/${y}`), C.opts.verbose && (v.assign((0, t._)`${U}.schema`, g), v.assign((0, t._)`${U}.data`, E));
    });
  }
  e.extendErrors = a;
  function c(v, y) {
    const g = v.const("err", y);
    v.if((0, t._)`${r.default.vErrors} === null`, () => v.assign(r.default.vErrors, (0, t._)`[${g}]`), (0, t._)`${r.default.vErrors}.push(${g})`), v.code((0, t._)`${r.default.errors}++`);
  }
  function u(v, y) {
    const { gen: g, validateName: E, schemaEnv: S } = v;
    S.$async ? g.throw((0, t._)`new ${v.ValidationError}(${y})`) : (g.assign((0, t._)`${E}.errors`, y), g.return(!1));
  }
  const l = {
    keyword: new t.Name("keyword"),
    schemaPath: new t.Name("schemaPath"),
    // also used in JTD errors
    params: new t.Name("params"),
    propertyName: new t.Name("propertyName"),
    message: new t.Name("message"),
    schema: new t.Name("schema"),
    parentSchema: new t.Name("parentSchema")
  };
  function f(v, y, g) {
    const { createErrors: E } = v.it;
    return E === !1 ? (0, t._)`{}` : h(v, y, g);
  }
  function h(v, y, g = {}) {
    const { gen: E, it: S } = v, C = [
      d(S, g),
      m(v, g)
    ];
    return p(v, y, C), E.object(...C);
  }
  function d({ errorPath: v }, { instancePath: y }) {
    const g = y ? (0, t.str)`${v}${(0, n.getErrorPath)(y, n.Type.Str)}` : v;
    return [r.default.instancePath, (0, t.strConcat)(r.default.instancePath, g)];
  }
  function m({ keyword: v, it: { errSchemaPath: y } }, { schemaPath: g, parentSchema: E }) {
    let S = E ? y : (0, t.str)`${y}/${v}`;
    return g && (S = (0, t.str)`${S}${(0, n.getErrorPath)(g, n.Type.Str)}`), [l.schemaPath, S];
  }
  function p(v, { params: y, message: g }, E) {
    const { keyword: S, data: C, schemaValue: U, it: G } = v, { opts: z, propertyName: H, topSchemaRef: b, schemaPath: B } = G;
    E.push([l.keyword, S], [l.params, typeof y == "function" ? y(v) : y || (0, t._)`{}`]), z.messages && E.push([l.message, typeof g == "function" ? g(v) : g]), z.verbose && E.push([l.schema, U], [l.parentSchema, (0, t._)`${b}${B}`], [r.default.data, C]), H && E.push([l.propertyName, H]);
  }
})(Bo);
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.boolOrEmptySchema = Ti.topBoolOrEmptySchema = void 0;
const Wv = Bo, Kv = ue, Jv = Gt, Yv = {
  message: "boolean schema is false"
};
function Xv(e) {
  const { gen: t, schema: n, validateName: r } = e;
  n === !1 ? zp(e, !1) : typeof n == "object" && n.$async === !0 ? t.return(Jv.default.data) : (t.assign((0, Kv._)`${r}.errors`, null), t.return(!0));
}
Ti.topBoolOrEmptySchema = Xv;
function Zv(e, t) {
  const { gen: n, schema: r } = e;
  r === !1 ? (n.var(t, !1), zp(e)) : n.var(t, !0);
}
Ti.boolOrEmptySchema = Zv;
function zp(e, t) {
  const { gen: n, data: r } = e, i = {
    gen: n,
    keyword: "false schema",
    data: r,
    schema: !1,
    schemaCode: !1,
    schemaValue: !1,
    params: {},
    it: e
  };
  (0, Wv.reportError)(i, Yv, void 0, t);
}
var Qe = {}, zr = {};
Object.defineProperty(zr, "__esModule", { value: !0 });
zr.getRules = zr.isJSONType = void 0;
const Qv = ["string", "number", "integer", "boolean", "null", "object", "array"], ew = new Set(Qv);
function tw(e) {
  return typeof e == "string" && ew.has(e);
}
zr.isJSONType = tw;
function nw() {
  const e = {
    number: { type: "number", rules: [] },
    string: { type: "string", rules: [] },
    array: { type: "array", rules: [] },
    object: { type: "object", rules: [] }
  };
  return {
    types: { ...e, integer: !0, boolean: !0, null: !0 },
    rules: [{ rules: [] }, e.number, e.string, e.array, e.object],
    post: { rules: [] },
    all: {},
    keywords: {}
  };
}
zr.getRules = nw;
var Rn = {};
Object.defineProperty(Rn, "__esModule", { value: !0 });
Rn.shouldUseRule = Rn.shouldUseGroup = Rn.schemaHasRulesForType = void 0;
function rw({ schema: e, self: t }, n) {
  const r = t.RULES.types[n];
  return r && r !== !0 && Vp(e, r);
}
Rn.schemaHasRulesForType = rw;
function Vp(e, t) {
  return t.rules.some((n) => Gp(e, n));
}
Rn.shouldUseGroup = Vp;
function Gp(e, t) {
  var n;
  return e[t.keyword] !== void 0 || ((n = t.definition.implements) === null || n === void 0 ? void 0 : n.some((r) => e[r] !== void 0));
}
Rn.shouldUseRule = Gp;
Object.defineProperty(Qe, "__esModule", { value: !0 });
Qe.reportTypeError = Qe.checkDataTypes = Qe.checkDataType = Qe.coerceAndCheckDataType = Qe.getJSONTypes = Qe.getSchemaTypes = Qe.DataType = void 0;
const iw = zr, ow = Rn, sw = Bo, me = ue, Wp = Q;
var _i;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(_i || (Qe.DataType = _i = {}));
function aw(e) {
  const t = Kp(e.type);
  if (t.includes("null")) {
    if (e.nullable === !1)
      throw new Error("type: null contradicts nullable: false");
  } else {
    if (!t.length && e.nullable !== void 0)
      throw new Error('"nullable" cannot be used without "type"');
    e.nullable === !0 && t.push("null");
  }
  return t;
}
Qe.getSchemaTypes = aw;
function Kp(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(iw.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Qe.getJSONTypes = Kp;
function cw(e, t) {
  const { gen: n, data: r, opts: i } = e, o = lw(t, i.coerceTypes), s = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, ow.schemaHasRulesForType)(e, t[0]));
  if (s) {
    const a = ql(t, r, i.strictNumbers, _i.Wrong);
    n.if(a, () => {
      o.length ? uw(e, t, o) : zl(e);
    });
  }
  return s;
}
Qe.coerceAndCheckDataType = cw;
const Jp = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function lw(e, t) {
  return t ? e.filter((n) => Jp.has(n) || t === "array" && n === "array") : [];
}
function uw(e, t, n) {
  const { gen: r, data: i, opts: o } = e, s = r.let("dataType", (0, me._)`typeof ${i}`), a = r.let("coerced", (0, me._)`undefined`);
  o.coerceTypes === "array" && r.if((0, me._)`${s} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => r.assign(i, (0, me._)`${i}[0]`).assign(s, (0, me._)`typeof ${i}`).if(ql(t, i, o.strictNumbers), () => r.assign(a, i))), r.if((0, me._)`${a} !== undefined`);
  for (const u of n)
    (Jp.has(u) || u === "array" && o.coerceTypes === "array") && c(u);
  r.else(), zl(e), r.endIf(), r.if((0, me._)`${a} !== undefined`, () => {
    r.assign(i, a), fw(e, a);
  });
  function c(u) {
    switch (u) {
      case "string":
        r.elseIf((0, me._)`${s} == "number" || ${s} == "boolean"`).assign(a, (0, me._)`"" + ${i}`).elseIf((0, me._)`${i} === null`).assign(a, (0, me._)`""`);
        return;
      case "number":
        r.elseIf((0, me._)`${s} == "boolean" || ${i} === null
              || (${s} == "string" && ${i} && ${i} == +${i})`).assign(a, (0, me._)`+${i}`);
        return;
      case "integer":
        r.elseIf((0, me._)`${s} === "boolean" || ${i} === null
              || (${s} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(a, (0, me._)`+${i}`);
        return;
      case "boolean":
        r.elseIf((0, me._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(a, !1).elseIf((0, me._)`${i} === "true" || ${i} === 1`).assign(a, !0);
        return;
      case "null":
        r.elseIf((0, me._)`${i} === "" || ${i} === 0 || ${i} === false`), r.assign(a, null);
        return;
      case "array":
        r.elseIf((0, me._)`${s} === "string" || ${s} === "number"
              || ${s} === "boolean" || ${i} === null`).assign(a, (0, me._)`[${i}]`);
    }
  }
}
function fw({ gen: e, parentData: t, parentDataProperty: n }, r) {
  e.if((0, me._)`${t} !== undefined`, () => e.assign((0, me._)`${t}[${n}]`, r));
}
function ul(e, t, n, r = _i.Correct) {
  const i = r === _i.Correct ? me.operators.EQ : me.operators.NEQ;
  let o;
  switch (e) {
    case "null":
      return (0, me._)`${t} ${i} null`;
    case "array":
      o = (0, me._)`Array.isArray(${t})`;
      break;
    case "object":
      o = (0, me._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      o = s((0, me._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      o = s();
      break;
    default:
      return (0, me._)`typeof ${t} ${i} ${e}`;
  }
  return r === _i.Correct ? o : (0, me.not)(o);
  function s(a = me.nil) {
    return (0, me.and)((0, me._)`typeof ${t} == "number"`, a, n ? (0, me._)`isFinite(${t})` : me.nil);
  }
}
Qe.checkDataType = ul;
function ql(e, t, n, r) {
  if (e.length === 1)
    return ul(e[0], t, n, r);
  let i;
  const o = (0, Wp.toHash)(e);
  if (o.array && o.object) {
    const s = (0, me._)`typeof ${t} != "object"`;
    i = o.null ? s : (0, me._)`!${t} || ${s}`, delete o.null, delete o.array, delete o.object;
  } else
    i = me.nil;
  o.number && delete o.integer;
  for (const s in o)
    i = (0, me.and)(i, ul(s, t, n, r));
  return i;
}
Qe.checkDataTypes = ql;
const dw = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, me._)`{type: ${e}}` : (0, me._)`{type: ${t}}`
};
function zl(e) {
  const t = hw(e);
  (0, sw.reportError)(t, dw);
}
Qe.reportTypeError = zl;
function hw(e) {
  const { gen: t, data: n, schema: r } = e, i = (0, Wp.schemaRefOrVal)(e, r, "type");
  return {
    gen: t,
    keyword: "type",
    data: n,
    schema: r.type,
    schemaCode: i,
    schemaValue: i,
    parentSchema: r,
    params: {},
    it: e
  };
}
var Ea = {};
Object.defineProperty(Ea, "__esModule", { value: !0 });
Ea.assignDefaults = void 0;
const ti = ue, pw = Q;
function mw(e, t) {
  const { properties: n, items: r } = e.schema;
  if (t === "object" && n)
    for (const i in n)
      Hf(e, i, n[i].default);
  else t === "array" && Array.isArray(r) && r.forEach((i, o) => Hf(e, o, i.default));
}
Ea.assignDefaults = mw;
function Hf(e, t, n) {
  const { gen: r, compositeRule: i, data: o, opts: s } = e;
  if (n === void 0)
    return;
  const a = (0, ti._)`${o}${(0, ti.getProperty)(t)}`;
  if (i) {
    (0, pw.checkStrictMode)(e, `default is ignored for: ${a}`);
    return;
  }
  let c = (0, ti._)`${a} === undefined`;
  s.useDefaults === "empty" && (c = (0, ti._)`${c} || ${a} === null || ${a} === ""`), r.if(c, (0, ti._)`${a} = ${(0, ti.stringify)(n)}`);
}
var vn = {}, ye = {};
Object.defineProperty(ye, "__esModule", { value: !0 });
ye.validateUnion = ye.validateArray = ye.usePattern = ye.callValidateCode = ye.schemaProperties = ye.allSchemaProperties = ye.noPropertyInData = ye.propertyInData = ye.isOwnProperty = ye.hasPropFunc = ye.reportMissingProp = ye.checkMissingProp = ye.checkReportMissingProp = void 0;
const Le = ue, Vl = Q, Vn = Gt, gw = Q;
function yw(e, t) {
  const { gen: n, data: r, it: i } = e;
  n.if(Wl(n, r, t, i.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Le._)`${t}` }, !0), e.error();
  });
}
ye.checkReportMissingProp = yw;
function vw({ gen: e, data: t, it: { opts: n } }, r, i) {
  return (0, Le.or)(...r.map((o) => (0, Le.and)(Wl(e, t, o, n.ownProperties), (0, Le._)`${i} = ${o}`)));
}
ye.checkMissingProp = vw;
function ww(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ye.reportMissingProp = ww;
function Yp(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Le._)`Object.prototype.hasOwnProperty`
  });
}
ye.hasPropFunc = Yp;
function Gl(e, t, n) {
  return (0, Le._)`${Yp(e)}.call(${t}, ${n})`;
}
ye.isOwnProperty = Gl;
function Ew(e, t, n, r) {
  const i = (0, Le._)`${t}${(0, Le.getProperty)(n)} !== undefined`;
  return r ? (0, Le._)`${i} && ${Gl(e, t, n)}` : i;
}
ye.propertyInData = Ew;
function Wl(e, t, n, r) {
  const i = (0, Le._)`${t}${(0, Le.getProperty)(n)} === undefined`;
  return r ? (0, Le.or)(i, (0, Le.not)(Gl(e, t, n))) : i;
}
ye.noPropertyInData = Wl;
function Xp(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ye.allSchemaProperties = Xp;
function _w(e, t) {
  return Xp(t).filter((n) => !(0, Vl.alwaysValidSchema)(e, t[n]));
}
ye.schemaProperties = _w;
function $w({ schemaCode: e, data: t, it: { gen: n, topSchemaRef: r, schemaPath: i, errorPath: o }, it: s }, a, c, u) {
  const l = u ? (0, Le._)`${e}, ${t}, ${r}${i}` : t, f = [
    [Vn.default.instancePath, (0, Le.strConcat)(Vn.default.instancePath, o)],
    [Vn.default.parentData, s.parentData],
    [Vn.default.parentDataProperty, s.parentDataProperty],
    [Vn.default.rootData, Vn.default.rootData]
  ];
  s.opts.dynamicRef && f.push([Vn.default.dynamicAnchors, Vn.default.dynamicAnchors]);
  const h = (0, Le._)`${l}, ${n.object(...f)}`;
  return c !== Le.nil ? (0, Le._)`${a}.call(${c}, ${h})` : (0, Le._)`${a}(${h})`;
}
ye.callValidateCode = $w;
const Sw = (0, Le._)`new RegExp`;
function bw({ gen: e, it: { opts: t } }, n) {
  const r = t.unicodeRegExp ? "u" : "", { regExp: i } = t.code, o = i(n, r);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, Le._)`${i.code === "new RegExp" ? Sw : (0, gw.useFunc)(e, i)}(${n}, ${r})`
  });
}
ye.usePattern = bw;
function Aw(e) {
  const { gen: t, data: n, keyword: r, it: i } = e, o = t.name("valid");
  if (i.allErrors) {
    const a = t.let("valid", !0);
    return s(() => t.assign(a, !1)), a;
  }
  return t.var(o, !0), s(() => t.break()), o;
  function s(a) {
    const c = t.const("len", (0, Le._)`${n}.length`);
    t.forRange("i", 0, c, (u) => {
      e.subschema({
        keyword: r,
        dataProp: u,
        dataPropType: Vl.Type.Num
      }, o), t.if((0, Le.not)(o), a);
    });
  }
}
ye.validateArray = Aw;
function Tw(e) {
  const { gen: t, schema: n, keyword: r, it: i } = e;
  if (!Array.isArray(n))
    throw new Error("ajv implementation error");
  if (n.some((c) => (0, Vl.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
    return;
  const s = t.let("valid", !1), a = t.name("_valid");
  t.block(() => n.forEach((c, u) => {
    const l = e.subschema({
      keyword: r,
      schemaProp: u,
      compositeRule: !0
    }, a);
    t.assign(s, (0, Le._)`${s} || ${a}`), e.mergeValidEvaluated(l, a) || t.if((0, Le.not)(s));
  })), e.result(s, () => e.reset(), () => e.error(!0));
}
ye.validateUnion = Tw;
Object.defineProperty(vn, "__esModule", { value: !0 });
vn.validateKeywordUsage = vn.validSchemaType = vn.funcKeywordCode = vn.macroKeywordCode = void 0;
const Tt = ue, Pr = Gt, Cw = ye, Nw = Bo;
function Iw(e, t) {
  const { gen: n, keyword: r, schema: i, parentSchema: o, it: s } = e, a = t.macro.call(s.self, i, o, s), c = Zp(n, r, a);
  s.opts.validateSchema !== !1 && s.self.validateSchema(a, !0);
  const u = n.name("valid");
  e.subschema({
    schema: a,
    schemaPath: Tt.nil,
    errSchemaPath: `${s.errSchemaPath}/${r}`,
    topSchemaRef: c,
    compositeRule: !0
  }, u), e.pass(u, () => e.error(!0));
}
vn.macroKeywordCode = Iw;
function Pw(e, t) {
  var n;
  const { gen: r, keyword: i, schema: o, parentSchema: s, $data: a, it: c } = e;
  Rw(c, t);
  const u = !a && t.compile ? t.compile.call(c.self, o, s, c) : t.validate, l = Zp(r, i, u), f = r.let("valid");
  e.block$data(f, h), e.ok((n = t.valid) !== null && n !== void 0 ? n : f);
  function h() {
    if (t.errors === !1)
      p(), t.modifying && qf(e), v(() => e.error());
    else {
      const y = t.async ? d() : m();
      t.modifying && qf(e), v(() => Ow(e, y));
    }
  }
  function d() {
    const y = r.let("ruleErrs", null);
    return r.try(() => p((0, Tt._)`await `), (g) => r.assign(f, !1).if((0, Tt._)`${g} instanceof ${c.ValidationError}`, () => r.assign(y, (0, Tt._)`${g}.errors`), () => r.throw(g))), y;
  }
  function m() {
    const y = (0, Tt._)`${l}.errors`;
    return r.assign(y, null), p(Tt.nil), y;
  }
  function p(y = t.async ? (0, Tt._)`await ` : Tt.nil) {
    const g = c.opts.passContext ? Pr.default.this : Pr.default.self, E = !("compile" in t && !a || t.schema === !1);
    r.assign(f, (0, Tt._)`${y}${(0, Cw.callValidateCode)(e, l, g, E)}`, t.modifying);
  }
  function v(y) {
    var g;
    r.if((0, Tt.not)((g = t.valid) !== null && g !== void 0 ? g : f), y);
  }
}
vn.funcKeywordCode = Pw;
function qf(e) {
  const { gen: t, data: n, it: r } = e;
  t.if(r.parentData, () => t.assign(n, (0, Tt._)`${r.parentData}[${r.parentDataProperty}]`));
}
function Ow(e, t) {
  const { gen: n } = e;
  n.if((0, Tt._)`Array.isArray(${t})`, () => {
    n.assign(Pr.default.vErrors, (0, Tt._)`${Pr.default.vErrors} === null ? ${t} : ${Pr.default.vErrors}.concat(${t})`).assign(Pr.default.errors, (0, Tt._)`${Pr.default.vErrors}.length`), (0, Nw.extendErrors)(e);
  }, () => e.error());
}
function Rw({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Zp(e, t, n) {
  if (n === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof n == "function" ? { ref: n } : { ref: n, code: (0, Tt.stringify)(n) });
}
function Dw(e, t, n = !1) {
  return !t.length || t.some((r) => r === "array" ? Array.isArray(e) : r === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == r || n && typeof e > "u");
}
vn.validSchemaType = Dw;
function Fw({ schema: e, opts: t, self: n, errSchemaPath: r }, i, o) {
  if (Array.isArray(i.keyword) ? !i.keyword.includes(o) : i.keyword !== o)
    throw new Error("ajv implementation error");
  const s = i.dependencies;
  if (s != null && s.some((a) => !Object.prototype.hasOwnProperty.call(e, a)))
    throw new Error(`parent schema must have dependencies of ${o}: ${s.join(",")}`);
  if (i.validateSchema && !i.validateSchema(e[o])) {
    const c = `keyword "${o}" value is invalid at path "${r}": ` + n.errorsText(i.validateSchema.errors);
    if (t.validateSchema === "log")
      n.logger.error(c);
    else
      throw new Error(c);
  }
}
vn.validateKeywordUsage = Fw;
var sr = {};
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.extendSubschemaMode = sr.extendSubschemaData = sr.getSubschema = void 0;
const yn = ue, Qp = Q;
function Lw(e, { keyword: t, schemaProp: n, schema: r, schemaPath: i, errSchemaPath: o, topSchemaRef: s }) {
  if (t !== void 0 && r !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const a = e.schema[t];
    return n === void 0 ? {
      schema: a,
      schemaPath: (0, yn._)`${e.schemaPath}${(0, yn.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: a[n],
      schemaPath: (0, yn._)`${e.schemaPath}${(0, yn.getProperty)(t)}${(0, yn.getProperty)(n)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Qp.escapeFragment)(n)}`
    };
  }
  if (r !== void 0) {
    if (i === void 0 || o === void 0 || s === void 0)
      throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
    return {
      schema: r,
      schemaPath: i,
      topSchemaRef: s,
      errSchemaPath: o
    };
  }
  throw new Error('either "keyword" or "schema" must be passed');
}
sr.getSubschema = Lw;
function xw(e, t, { dataProp: n, dataPropType: r, data: i, dataTypes: o, propertyName: s }) {
  if (i !== void 0 && n !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: a } = t;
  if (n !== void 0) {
    const { errorPath: u, dataPathArr: l, opts: f } = t, h = a.let("data", (0, yn._)`${t.data}${(0, yn.getProperty)(n)}`, !0);
    c(h), e.errorPath = (0, yn.str)`${u}${(0, Qp.getErrorPath)(n, r, f.jsPropertySyntax)}`, e.parentDataProperty = (0, yn._)`${n}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (i !== void 0) {
    const u = i instanceof yn.Name ? i : a.let("data", i, !0);
    c(u), s !== void 0 && (e.propertyName = s);
  }
  o && (e.dataTypes = o);
  function c(u) {
    e.data = u, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, u];
  }
}
sr.extendSubschemaData = xw;
function kw(e, { jtdDiscriminator: t, jtdMetadata: n, compositeRule: r, createErrors: i, allErrors: o }) {
  r !== void 0 && (e.compositeRule = r), i !== void 0 && (e.createErrors = i), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = n;
}
sr.extendSubschemaMode = kw;
var ut = {}, em = function e(t, n) {
  if (t === n) return !0;
  if (t && n && typeof t == "object" && typeof n == "object") {
    if (t.constructor !== n.constructor) return !1;
    var r, i, o;
    if (Array.isArray(t)) {
      if (r = t.length, r != n.length) return !1;
      for (i = r; i-- !== 0; )
        if (!e(t[i], n[i])) return !1;
      return !0;
    }
    if (t.constructor === RegExp) return t.source === n.source && t.flags === n.flags;
    if (t.valueOf !== Object.prototype.valueOf) return t.valueOf() === n.valueOf();
    if (t.toString !== Object.prototype.toString) return t.toString() === n.toString();
    if (o = Object.keys(t), r = o.length, r !== Object.keys(n).length) return !1;
    for (i = r; i-- !== 0; )
      if (!Object.prototype.hasOwnProperty.call(n, o[i])) return !1;
    for (i = r; i-- !== 0; ) {
      var s = o[i];
      if (!e(t[s], n[s])) return !1;
    }
    return !0;
  }
  return t !== t && n !== n;
}, tm = { exports: {} }, rr = tm.exports = function(e, t, n) {
  typeof t == "function" && (n = t, t = {}), n = t.cb || n;
  var r = typeof n == "function" ? n : n.pre || function() {
  }, i = n.post || function() {
  };
  Ms(t, r, i, e, "", e);
};
rr.keywords = {
  additionalItems: !0,
  items: !0,
  contains: !0,
  additionalProperties: !0,
  propertyNames: !0,
  not: !0,
  if: !0,
  then: !0,
  else: !0
};
rr.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
rr.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
rr.skipKeywords = {
  default: !0,
  enum: !0,
  const: !0,
  required: !0,
  maximum: !0,
  minimum: !0,
  exclusiveMaximum: !0,
  exclusiveMinimum: !0,
  multipleOf: !0,
  maxLength: !0,
  minLength: !0,
  pattern: !0,
  format: !0,
  maxItems: !0,
  minItems: !0,
  uniqueItems: !0,
  maxProperties: !0,
  minProperties: !0
};
function Ms(e, t, n, r, i, o, s, a, c, u) {
  if (r && typeof r == "object" && !Array.isArray(r)) {
    t(r, i, o, s, a, c, u);
    for (var l in r) {
      var f = r[l];
      if (Array.isArray(f)) {
        if (l in rr.arrayKeywords)
          for (var h = 0; h < f.length; h++)
            Ms(e, t, n, f[h], i + "/" + l + "/" + h, o, i, l, r, h);
      } else if (l in rr.propsKeywords) {
        if (f && typeof f == "object")
          for (var d in f)
            Ms(e, t, n, f[d], i + "/" + l + "/" + Uw(d), o, i, l, r, d);
      } else (l in rr.keywords || e.allKeys && !(l in rr.skipKeywords)) && Ms(e, t, n, f, i + "/" + l, o, i, l, r);
    }
    n(r, i, o, s, a, c, u);
  }
}
function Uw(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var jw = tm.exports;
Object.defineProperty(ut, "__esModule", { value: !0 });
ut.getSchemaRefs = ut.resolveUrl = ut.normalizeId = ut._getFullPath = ut.getFullPath = ut.inlineRef = void 0;
const Mw = Q, Bw = em, Hw = jw, qw = /* @__PURE__ */ new Set([
  "type",
  "format",
  "pattern",
  "maxLength",
  "minLength",
  "maxProperties",
  "minProperties",
  "maxItems",
  "minItems",
  "maximum",
  "minimum",
  "uniqueItems",
  "multipleOf",
  "required",
  "enum",
  "const"
]);
function zw(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !fl(e) : t ? nm(e) <= t : !1;
}
ut.inlineRef = zw;
const Vw = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function fl(e) {
  for (const t in e) {
    if (Vw.has(t))
      return !0;
    const n = e[t];
    if (Array.isArray(n) && n.some(fl) || typeof n == "object" && fl(n))
      return !0;
  }
  return !1;
}
function nm(e) {
  let t = 0;
  for (const n in e) {
    if (n === "$ref")
      return 1 / 0;
    if (t++, !qw.has(n) && (typeof e[n] == "object" && (0, Mw.eachItem)(e[n], (r) => t += nm(r)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function rm(e, t = "", n) {
  n !== !1 && (t = $i(t));
  const r = e.parse(t);
  return im(e, r);
}
ut.getFullPath = rm;
function im(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
ut._getFullPath = im;
const Gw = /#\/?$/;
function $i(e) {
  return e ? e.replace(Gw, "") : "";
}
ut.normalizeId = $i;
function Ww(e, t, n) {
  return n = $i(n), e.resolve(t, n);
}
ut.resolveUrl = Ww;
const Kw = /^[a-z_][-a-z0-9._]*$/i;
function Jw(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: n, uriResolver: r } = this.opts, i = $i(e[n] || t), o = { "": i }, s = rm(r, i, !1), a = {}, c = /* @__PURE__ */ new Set();
  return Hw(e, { allKeys: !0 }, (f, h, d, m) => {
    if (m === void 0)
      return;
    const p = s + h;
    let v = o[m];
    typeof f[n] == "string" && (v = y.call(this, f[n])), g.call(this, f.$anchor), g.call(this, f.$dynamicAnchor), o[h] = v;
    function y(E) {
      const S = this.opts.uriResolver.resolve;
      if (E = $i(v ? S(v, E) : E), c.has(E))
        throw l(E);
      c.add(E);
      let C = this.refs[E];
      return typeof C == "string" && (C = this.refs[C]), typeof C == "object" ? u(f, C.schema, E) : E !== $i(p) && (E[0] === "#" ? (u(f, a[E], E), a[E] = f) : this.refs[E] = p), E;
    }
    function g(E) {
      if (typeof E == "string") {
        if (!Kw.test(E))
          throw new Error(`invalid anchor "${E}"`);
        y.call(this, `#${E}`);
      }
    }
  }), a;
  function u(f, h, d) {
    if (h !== void 0 && !Bw(f, h))
      throw l(d);
  }
  function l(f) {
    return new Error(`reference "${f}" resolves to more than one schema`);
  }
}
ut.getSchemaRefs = Jw;
Object.defineProperty(Zt, "__esModule", { value: !0 });
Zt.getData = Zt.KeywordCxt = Zt.validateFunctionCode = void 0;
const om = Ti, zf = Qe, Kl = Rn, Xs = Qe, Yw = Ea, fo = vn, hc = sr, se = ue, le = Gt, Xw = ut, Dn = Q, Zi = Bo;
function Zw(e) {
  if (cm(e) && (lm(e), am(e))) {
    tE(e);
    return;
  }
  sm(e, () => (0, om.topBoolOrEmptySchema)(e));
}
Zt.validateFunctionCode = Zw;
function sm({ gen: e, validateName: t, schema: n, schemaEnv: r, opts: i }, o) {
  i.code.es5 ? e.func(t, (0, se._)`${le.default.data}, ${le.default.valCxt}`, r.$async, () => {
    e.code((0, se._)`"use strict"; ${Vf(n, i)}`), eE(e, i), e.code(o);
  }) : e.func(t, (0, se._)`${le.default.data}, ${Qw(i)}`, r.$async, () => e.code(Vf(n, i)).code(o));
}
function Qw(e) {
  return (0, se._)`{${le.default.instancePath}="", ${le.default.parentData}, ${le.default.parentDataProperty}, ${le.default.rootData}=${le.default.data}${e.dynamicRef ? (0, se._)`, ${le.default.dynamicAnchors}={}` : se.nil}}={}`;
}
function eE(e, t) {
  e.if(le.default.valCxt, () => {
    e.var(le.default.instancePath, (0, se._)`${le.default.valCxt}.${le.default.instancePath}`), e.var(le.default.parentData, (0, se._)`${le.default.valCxt}.${le.default.parentData}`), e.var(le.default.parentDataProperty, (0, se._)`${le.default.valCxt}.${le.default.parentDataProperty}`), e.var(le.default.rootData, (0, se._)`${le.default.valCxt}.${le.default.rootData}`), t.dynamicRef && e.var(le.default.dynamicAnchors, (0, se._)`${le.default.valCxt}.${le.default.dynamicAnchors}`);
  }, () => {
    e.var(le.default.instancePath, (0, se._)`""`), e.var(le.default.parentData, (0, se._)`undefined`), e.var(le.default.parentDataProperty, (0, se._)`undefined`), e.var(le.default.rootData, le.default.data), t.dynamicRef && e.var(le.default.dynamicAnchors, (0, se._)`{}`);
  });
}
function tE(e) {
  const { schema: t, opts: n, gen: r } = e;
  sm(e, () => {
    n.$comment && t.$comment && fm(e), sE(e), r.let(le.default.vErrors, null), r.let(le.default.errors, 0), n.unevaluated && nE(e), um(e), lE(e);
  });
}
function nE(e) {
  const { gen: t, validateName: n } = e;
  e.evaluated = t.const("evaluated", (0, se._)`${n}.evaluated`), t.if((0, se._)`${e.evaluated}.dynamicProps`, () => t.assign((0, se._)`${e.evaluated}.props`, (0, se._)`undefined`)), t.if((0, se._)`${e.evaluated}.dynamicItems`, () => t.assign((0, se._)`${e.evaluated}.items`, (0, se._)`undefined`));
}
function Vf(e, t) {
  const n = typeof e == "object" && e[t.schemaId];
  return n && (t.code.source || t.code.process) ? (0, se._)`/*# sourceURL=${n} */` : se.nil;
}
function rE(e, t) {
  if (cm(e) && (lm(e), am(e))) {
    iE(e, t);
    return;
  }
  (0, om.boolOrEmptySchema)(e, t);
}
function am({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const n in e)
    if (t.RULES.all[n])
      return !0;
  return !1;
}
function cm(e) {
  return typeof e.schema != "boolean";
}
function iE(e, t) {
  const { schema: n, gen: r, opts: i } = e;
  i.$comment && n.$comment && fm(e), aE(e), cE(e);
  const o = r.const("_errs", le.default.errors);
  um(e, o), r.var(t, (0, se._)`${o} === ${le.default.errors}`);
}
function lm(e) {
  (0, Dn.checkUnknownRules)(e), oE(e);
}
function um(e, t) {
  if (e.opts.jtd)
    return Gf(e, [], !1, t);
  const n = (0, zf.getSchemaTypes)(e.schema), r = (0, zf.coerceAndCheckDataType)(e, n);
  Gf(e, n, !r, t);
}
function oE(e) {
  const { schema: t, errSchemaPath: n, opts: r, self: i } = e;
  t.$ref && r.ignoreKeywordsWithRef && (0, Dn.schemaHasRulesButRef)(t, i.RULES) && i.logger.warn(`$ref: keywords ignored in schema at path "${n}"`);
}
function sE(e) {
  const { schema: t, opts: n } = e;
  t.default !== void 0 && n.useDefaults && n.strictSchema && (0, Dn.checkStrictMode)(e, "default is ignored in the schema root");
}
function aE(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, Xw.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function cE(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function fm({ gen: e, schemaEnv: t, schema: n, errSchemaPath: r, opts: i }) {
  const o = n.$comment;
  if (i.$comment === !0)
    e.code((0, se._)`${le.default.self}.logger.log(${o})`);
  else if (typeof i.$comment == "function") {
    const s = (0, se.str)`${r}/$comment`, a = e.scopeValue("root", { ref: t.root });
    e.code((0, se._)`${le.default.self}.opts.$comment(${o}, ${s}, ${a}.schema)`);
  }
}
function lE(e) {
  const { gen: t, schemaEnv: n, validateName: r, ValidationError: i, opts: o } = e;
  n.$async ? t.if((0, se._)`${le.default.errors} === 0`, () => t.return(le.default.data), () => t.throw((0, se._)`new ${i}(${le.default.vErrors})`)) : (t.assign((0, se._)`${r}.errors`, le.default.vErrors), o.unevaluated && uE(e), t.return((0, se._)`${le.default.errors} === 0`));
}
function uE({ gen: e, evaluated: t, props: n, items: r }) {
  n instanceof se.Name && e.assign((0, se._)`${t}.props`, n), r instanceof se.Name && e.assign((0, se._)`${t}.items`, r);
}
function Gf(e, t, n, r) {
  const { gen: i, schema: o, data: s, allErrors: a, opts: c, self: u } = e, { RULES: l } = u;
  if (o.$ref && (c.ignoreKeywordsWithRef || !(0, Dn.schemaHasRulesButRef)(o, l))) {
    i.block(() => pm(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || fE(e, t), i.block(() => {
    for (const h of l.rules)
      f(h);
    f(l.post);
  });
  function f(h) {
    (0, Kl.shouldUseGroup)(o, h) && (h.type ? (i.if((0, Xs.checkDataType)(h.type, s, c.strictNumbers)), Wf(e, h), t.length === 1 && t[0] === h.type && n && (i.else(), (0, Xs.reportTypeError)(e)), i.endIf()) : Wf(e, h), a || i.if((0, se._)`${le.default.errors} === ${r || 0}`));
  }
}
function Wf(e, t) {
  const { gen: n, schema: r, opts: { useDefaults: i } } = e;
  i && (0, Yw.assignDefaults)(e, t.type), n.block(() => {
    for (const o of t.rules)
      (0, Kl.shouldUseRule)(r, o) && pm(e, o.keyword, o.definition, t.type);
  });
}
function fE(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (dE(e, t), e.opts.allowUnionTypes || hE(e, t), pE(e, e.dataTypes));
}
function dE(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((n) => {
      dm(e.dataTypes, n) || Jl(e, `type "${n}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), gE(e, t);
  }
}
function hE(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && Jl(e, "use allowUnionTypes to allow union type keyword");
}
function pE(e, t) {
  const n = e.self.RULES.all;
  for (const r in n) {
    const i = n[r];
    if (typeof i == "object" && (0, Kl.shouldUseRule)(e.schema, i)) {
      const { type: o } = i.definition;
      o.length && !o.some((s) => mE(t, s)) && Jl(e, `missing type "${o.join(",")}" for keyword "${r}"`);
    }
  }
}
function mE(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function dm(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function gE(e, t) {
  const n = [];
  for (const r of e.dataTypes)
    dm(t, r) ? n.push(r) : t.includes("integer") && r === "number" && n.push("integer");
  e.dataTypes = n;
}
function Jl(e, t) {
  const n = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${n}" (strictTypes)`, (0, Dn.checkStrictMode)(e, t, e.opts.strictTypes);
}
class hm {
  constructor(t, n, r) {
    if ((0, fo.validateKeywordUsage)(t, n, r), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = r, this.data = t.data, this.schema = t.schema[r], this.$data = n.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, Dn.schemaRefOrVal)(t, this.schema, r, this.$data), this.schemaType = n.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = n, this.$data)
      this.schemaCode = t.gen.const("vSchema", mm(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, fo.validSchemaType)(this.schema, n.schemaType, n.allowUndefined))
      throw new Error(`${r} value must be ${JSON.stringify(n.schemaType)}`);
    ("code" in n ? n.trackErrors : n.errors !== !1) && (this.errsCount = t.gen.const("_errs", le.default.errors));
  }
  result(t, n, r) {
    this.failResult((0, se.not)(t), n, r);
  }
  failResult(t, n, r) {
    this.gen.if(t), r ? r() : this.error(), n ? (this.gen.else(), n(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  pass(t, n) {
    this.failResult((0, se.not)(t), void 0, n);
  }
  fail(t) {
    if (t === void 0) {
      this.error(), this.allErrors || this.gen.if(!1);
      return;
    }
    this.gen.if(t), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
  }
  fail$data(t) {
    if (!this.$data)
      return this.fail(t);
    const { schemaCode: n } = this;
    this.fail((0, se._)`${n} !== undefined && (${(0, se.or)(this.invalid$data(), t)})`);
  }
  error(t, n, r) {
    if (n) {
      this.setParams(n), this._error(t, r), this.setParams({});
      return;
    }
    this._error(t, r);
  }
  _error(t, n) {
    (t ? Zi.reportExtraError : Zi.reportError)(this, this.def.error, n);
  }
  $dataError() {
    (0, Zi.reportError)(this, this.def.$dataError || Zi.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Zi.resetErrorsCount)(this.gen, this.errsCount);
  }
  ok(t) {
    this.allErrors || this.gen.if(t);
  }
  setParams(t, n) {
    n ? Object.assign(this.params, t) : this.params = t;
  }
  block$data(t, n, r = se.nil) {
    this.gen.block(() => {
      this.check$data(t, r), n();
    });
  }
  check$data(t = se.nil, n = se.nil) {
    if (!this.$data)
      return;
    const { gen: r, schemaCode: i, schemaType: o, def: s } = this;
    r.if((0, se.or)((0, se._)`${i} === undefined`, n)), t !== se.nil && r.assign(t, !0), (o.length || s.validateSchema) && (r.elseIf(this.invalid$data()), this.$dataError(), t !== se.nil && r.assign(t, !1)), r.else();
  }
  invalid$data() {
    const { gen: t, schemaCode: n, schemaType: r, def: i, it: o } = this;
    return (0, se.or)(s(), a());
    function s() {
      if (r.length) {
        if (!(n instanceof se.Name))
          throw new Error("ajv implementation error");
        const c = Array.isArray(r) ? r : [r];
        return (0, se._)`${(0, Xs.checkDataTypes)(c, n, o.opts.strictNumbers, Xs.DataType.Wrong)}`;
      }
      return se.nil;
    }
    function a() {
      if (i.validateSchema) {
        const c = t.scopeValue("validate$data", { ref: i.validateSchema });
        return (0, se._)`!${c}(${n})`;
      }
      return se.nil;
    }
  }
  subschema(t, n) {
    const r = (0, hc.getSubschema)(this.it, t);
    (0, hc.extendSubschemaData)(r, this.it, t), (0, hc.extendSubschemaMode)(r, t);
    const i = { ...this.it, ...r, items: void 0, props: void 0 };
    return rE(i, n), i;
  }
  mergeEvaluated(t, n) {
    const { it: r, gen: i } = this;
    r.opts.unevaluated && (r.props !== !0 && t.props !== void 0 && (r.props = Dn.mergeEvaluated.props(i, t.props, r.props, n)), r.items !== !0 && t.items !== void 0 && (r.items = Dn.mergeEvaluated.items(i, t.items, r.items, n)));
  }
  mergeValidEvaluated(t, n) {
    const { it: r, gen: i } = this;
    if (r.opts.unevaluated && (r.props !== !0 || r.items !== !0))
      return i.if(n, () => this.mergeEvaluated(t, se.Name)), !0;
  }
}
Zt.KeywordCxt = hm;
function pm(e, t, n, r) {
  const i = new hm(e, n, t);
  "code" in n ? n.code(i, r) : i.$data && n.validate ? (0, fo.funcKeywordCode)(i, n) : "macro" in n ? (0, fo.macroKeywordCode)(i, n) : (n.compile || n.validate) && (0, fo.funcKeywordCode)(i, n);
}
const yE = /^\/(?:[^~]|~0|~1)*$/, vE = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function mm(e, { dataLevel: t, dataNames: n, dataPathArr: r }) {
  let i, o;
  if (e === "")
    return le.default.rootData;
  if (e[0] === "/") {
    if (!yE.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    i = e, o = le.default.rootData;
  } else {
    const u = vE.exec(e);
    if (!u)
      throw new Error(`Invalid JSON-pointer: ${e}`);
    const l = +u[1];
    if (i = u[2], i === "#") {
      if (l >= t)
        throw new Error(c("property/index", l));
      return r[t - l];
    }
    if (l > t)
      throw new Error(c("data", l));
    if (o = n[t - l], !i)
      return o;
  }
  let s = o;
  const a = i.split("/");
  for (const u of a)
    u && (o = (0, se._)`${o}${(0, se.getProperty)((0, Dn.unescapeJsonPointer)(u))}`, s = (0, se._)`${s} && ${o}`);
  return s;
  function c(u, l) {
    return `Cannot access ${u} ${l} levels up, current level is ${t}`;
  }
}
Zt.getData = mm;
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
class wE extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
Ri.default = wE;
var Kr = {};
Object.defineProperty(Kr, "__esModule", { value: !0 });
const pc = ut;
class EE extends Error {
  constructor(t, n, r, i) {
    super(i || `can't resolve reference ${r} from id ${n}`), this.missingRef = (0, pc.resolveUrl)(t, n, r), this.missingSchema = (0, pc.normalizeId)((0, pc.getFullPath)(t, this.missingRef));
  }
}
Kr.default = EE;
var Ct = {};
Object.defineProperty(Ct, "__esModule", { value: !0 });
Ct.resolveSchema = Ct.getCompilingSchema = Ct.resolveRef = Ct.compileSchema = Ct.SchemaEnv = void 0;
const nn = ue, _E = Ri, _r = Gt, cn = ut, Kf = Q, $E = Zt;
class _a {
  constructor(t) {
    var n;
    this.refs = {}, this.dynamicAnchors = {};
    let r;
    typeof t.schema == "object" && (r = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (n = t.baseId) !== null && n !== void 0 ? n : (0, cn.normalizeId)(r == null ? void 0 : r[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = r == null ? void 0 : r.$async, this.refs = {};
  }
}
Ct.SchemaEnv = _a;
function Yl(e) {
  const t = gm.call(this, e);
  if (t)
    return t;
  const n = (0, cn.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: r, lines: i } = this.opts.code, { ownProperties: o } = this.opts, s = new nn.CodeGen(this.scope, { es5: r, lines: i, ownProperties: o });
  let a;
  e.$async && (a = s.scopeValue("Error", {
    ref: _E.default,
    code: (0, nn._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = s.scopeName("validate");
  e.validateName = c;
  const u = {
    gen: s,
    allErrors: this.opts.allErrors,
    data: _r.default.data,
    parentData: _r.default.parentData,
    parentDataProperty: _r.default.parentDataProperty,
    dataNames: [_r.default.data],
    dataPathArr: [nn.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: s.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, nn.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: a,
    schema: e.schema,
    schemaEnv: e,
    rootId: n,
    baseId: e.baseId || n,
    schemaPath: nn.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, nn._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, $E.validateFunctionCode)(u), s.optimize(this.opts.code.optimize);
    const f = s.toString();
    l = `${s.scopeRefs(_r.default.scope)}return ${f}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const d = new Function(`${_r.default.self}`, `${_r.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: d }), d.errors = null, d.schema = e.schema, d.schemaEnv = e, e.$async && (d.$async = !0), this.opts.code.source === !0 && (d.source = { validateName: c, validateCode: f, scopeValues: s._values }), this.opts.unevaluated) {
      const { props: m, items: p } = u;
      d.evaluated = {
        props: m instanceof nn.Name ? void 0 : m,
        items: p instanceof nn.Name ? void 0 : p,
        dynamicProps: m instanceof nn.Name,
        dynamicItems: p instanceof nn.Name
      }, d.source && (d.source.evaluated = (0, nn.stringify)(d.evaluated));
    }
    return e.validate = d, e;
  } catch (f) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), f;
  } finally {
    this._compilations.delete(e);
  }
}
Ct.compileSchema = Yl;
function SE(e, t, n) {
  var r;
  n = (0, cn.resolveUrl)(this.opts.uriResolver, t, n);
  const i = e.refs[n];
  if (i)
    return i;
  let o = TE.call(this, e, n);
  if (o === void 0) {
    const s = (r = e.localRefs) === null || r === void 0 ? void 0 : r[n], { schemaId: a } = this.opts;
    s && (o = new _a({ schema: s, schemaId: a, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[n] = bE.call(this, o);
}
Ct.resolveRef = SE;
function bE(e) {
  return (0, cn.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Yl.call(this, e);
}
function gm(e) {
  for (const t of this._compilations)
    if (AE(t, e))
      return t;
}
Ct.getCompilingSchema = gm;
function AE(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function TE(e, t) {
  let n;
  for (; typeof (n = this.refs[t]) == "string"; )
    t = n;
  return n || this.schemas[t] || $a.call(this, e, t);
}
function $a(e, t) {
  const n = this.opts.uriResolver.parse(t), r = (0, cn._getFullPath)(this.opts.uriResolver, n);
  let i = (0, cn.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && r === i)
    return mc.call(this, n, e);
  const o = (0, cn.normalizeId)(r), s = this.refs[o] || this.schemas[o];
  if (typeof s == "string") {
    const a = $a.call(this, e, s);
    return typeof (a == null ? void 0 : a.schema) != "object" ? void 0 : mc.call(this, n, a);
  }
  if (typeof (s == null ? void 0 : s.schema) == "object") {
    if (s.validate || Yl.call(this, s), o === (0, cn.normalizeId)(t)) {
      const { schema: a } = s, { schemaId: c } = this.opts, u = a[c];
      return u && (i = (0, cn.resolveUrl)(this.opts.uriResolver, i, u)), new _a({ schema: a, schemaId: c, root: e, baseId: i });
    }
    return mc.call(this, n, s);
  }
}
Ct.resolveSchema = $a;
const CE = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function mc(e, { baseId: t, schema: n, root: r }) {
  var i;
  if (((i = e.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const a of e.fragment.slice(1).split("/")) {
    if (typeof n == "boolean")
      return;
    const c = n[(0, Kf.unescapeFragment)(a)];
    if (c === void 0)
      return;
    n = c;
    const u = typeof n == "object" && n[this.opts.schemaId];
    !CE.has(a) && u && (t = (0, cn.resolveUrl)(this.opts.uriResolver, t, u));
  }
  let o;
  if (typeof n != "boolean" && n.$ref && !(0, Kf.schemaHasRulesButRef)(n, this.RULES)) {
    const a = (0, cn.resolveUrl)(this.opts.uriResolver, t, n.$ref);
    o = $a.call(this, r, a);
  }
  const { schemaId: s } = this.opts;
  if (o = o || new _a({ schema: n, schemaId: s, root: r, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const NE = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", IE = "Meta-schema for $data reference (JSON AnySchema extension proposal)", PE = "object", OE = [
  "$data"
], RE = {
  $data: {
    type: "string",
    anyOf: [
      {
        format: "relative-json-pointer"
      },
      {
        format: "json-pointer"
      }
    ]
  }
}, DE = !1, FE = {
  $id: NE,
  description: IE,
  type: PE,
  required: OE,
  properties: RE,
  additionalProperties: DE
};
var Xl = {}, Sa = { exports: {} };
const LE = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), ym = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
function vm(e) {
  let t = "", n = 0, r = 0;
  for (r = 0; r < e.length; r++)
    if (n = e[r].charCodeAt(0), n !== 48) {
      if (!(n >= 48 && n <= 57 || n >= 65 && n <= 70 || n >= 97 && n <= 102))
        return "";
      t += e[r];
      break;
    }
  for (r += 1; r < e.length; r++) {
    if (n = e[r].charCodeAt(0), !(n >= 48 && n <= 57 || n >= 65 && n <= 70 || n >= 97 && n <= 102))
      return "";
    t += e[r];
  }
  return t;
}
const xE = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function Jf(e) {
  return e.length = 0, !0;
}
function kE(e, t, n) {
  if (e.length) {
    const r = vm(e);
    if (r !== "")
      t.push(r);
    else
      return n.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function UE(e) {
  let t = 0;
  const n = { error: !1, address: "", zone: "" }, r = [], i = [];
  let o = !1, s = !1, a = kE;
  for (let c = 0; c < e.length; c++) {
    const u = e[c];
    if (!(u === "[" || u === "]"))
      if (u === ":") {
        if (o === !0 && (s = !0), !a(i, r, n))
          break;
        if (++t > 7) {
          n.error = !0;
          break;
        }
        c > 0 && e[c - 1] === ":" && (o = !0), r.push(":");
        continue;
      } else if (u === "%") {
        if (!a(i, r, n))
          break;
        a = Jf;
      } else {
        i.push(u);
        continue;
      }
  }
  return i.length && (a === Jf ? n.zone = i.join("") : s ? r.push(i.join("")) : r.push(vm(i))), n.address = r.join(""), n;
}
function wm(e) {
  if (jE(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = UE(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let n = t.address, r = t.address;
    return t.zone && (n += "%" + t.zone, r += "%25" + t.zone), { host: n, isIPV6: !0, escapedHost: r };
  }
}
function jE(e, t) {
  let n = 0;
  for (let r = 0; r < e.length; r++)
    e[r] === t && n++;
  return n;
}
function ME(e) {
  let t = e;
  const n = [];
  let r = -1, i = 0;
  for (; i = t.length; ) {
    if (i === 1) {
      if (t === ".")
        break;
      if (t === "/") {
        n.push("/");
        break;
      } else {
        n.push(t);
        break;
      }
    } else if (i === 2) {
      if (t[0] === ".") {
        if (t[1] === ".")
          break;
        if (t[1] === "/") {
          t = t.slice(2);
          continue;
        }
      } else if (t[0] === "/" && (t[1] === "." || t[1] === "/")) {
        n.push("/");
        break;
      }
    } else if (i === 3 && t === "/..") {
      n.length !== 0 && n.pop(), n.push("/");
      break;
    }
    if (t[0] === ".") {
      if (t[1] === ".") {
        if (t[2] === "/") {
          t = t.slice(3);
          continue;
        }
      } else if (t[1] === "/") {
        t = t.slice(2);
        continue;
      }
    } else if (t[0] === "/" && t[1] === ".") {
      if (t[2] === "/") {
        t = t.slice(2);
        continue;
      } else if (t[2] === "." && t[3] === "/") {
        t = t.slice(3), n.length !== 0 && n.pop();
        continue;
      }
    }
    if ((r = t.indexOf("/", 1)) === -1) {
      n.push(t);
      break;
    } else
      n.push(t.slice(0, r)), t = t.slice(r);
  }
  return n.join("");
}
function BE(e, t) {
  const n = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = n(e.scheme)), e.userinfo !== void 0 && (e.userinfo = n(e.userinfo)), e.host !== void 0 && (e.host = n(e.host)), e.path !== void 0 && (e.path = n(e.path)), e.query !== void 0 && (e.query = n(e.query)), e.fragment !== void 0 && (e.fragment = n(e.fragment)), e;
}
function HE(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let n = unescape(e.host);
    if (!ym(n)) {
      const r = wm(n);
      r.isIPV6 === !0 ? n = `[${r.escapedHost}]` : n = e.host;
    }
    t.push(n);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var Em = {
  nonSimpleDomain: xE,
  recomposeAuthority: HE,
  normalizeComponentEncoding: BE,
  removeDotSegments: ME,
  isIPv4: ym,
  isUUID: LE,
  normalizeIPv6: wm
};
const { isUUID: qE } = Em, zE = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function _m(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function $m(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function Sm(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function VE(e) {
  return e.secure = _m(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function GE(e) {
  if ((e.port === (_m(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, n] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = n, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function WE(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const n = e.path.match(zE);
  if (n) {
    const r = t.scheme || e.scheme || "urn";
    e.nid = n[1].toLowerCase(), e.nss = n[2];
    const i = `${r}:${t.nid || e.nid}`, o = Zl(i);
    e.path = void 0, o && (e = o.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function KE(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const n = t.scheme || e.scheme || "urn", r = e.nid.toLowerCase(), i = `${n}:${t.nid || r}`, o = Zl(i);
  o && (e = o.serialize(e, t));
  const s = e, a = e.nss;
  return s.path = `${r || t.nid}:${a}`, t.skipEscape = !0, s;
}
function JE(e, t) {
  const n = e;
  return n.uuid = n.nss, n.nss = void 0, !t.tolerant && (!n.uuid || !qE(n.uuid)) && (n.error = n.error || "UUID is not valid."), n;
}
function YE(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const bm = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: $m,
    serialize: Sm
  }
), XE = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: bm.domainHost,
    parse: $m,
    serialize: Sm
  }
), Bs = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: VE,
    serialize: GE
  }
), ZE = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: Bs.domainHost,
    parse: Bs.parse,
    serialize: Bs.serialize
  }
), QE = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: WE,
    serialize: KE,
    skipNormalize: !0
  }
), e_ = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: JE,
    serialize: YE,
    skipNormalize: !0
  }
), Zs = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: bm,
    https: XE,
    ws: Bs,
    wss: ZE,
    urn: QE,
    "urn:uuid": e_
  }
);
Object.setPrototypeOf(Zs, null);
function Zl(e) {
  return e && (Zs[
    /** @type {SchemeName} */
    e
  ] || Zs[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var t_ = {
  SCHEMES: Zs,
  getSchemeHandler: Zl
};
const { normalizeIPv6: n_, removeDotSegments: ao, recomposeAuthority: r_, normalizeComponentEncoding: fs, isIPv4: i_, nonSimpleDomain: o_ } = Em, { SCHEMES: s_, getSchemeHandler: Am } = t_;
function a_(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  wn(Ln(e, t), t) : typeof e == "object" && (e = /** @type {T} */
  Ln(wn(e, t), t)), e;
}
function c_(e, t, n) {
  const r = n ? Object.assign({ scheme: "null" }, n) : { scheme: "null" }, i = Tm(Ln(e, r), Ln(t, r), r, !0);
  return r.skipEscape = !0, wn(i, r);
}
function Tm(e, t, n, r) {
  const i = {};
  return r || (e = Ln(wn(e, n), n), t = Ln(wn(t, n), n)), n = n || {}, !n.tolerant && t.scheme ? (i.scheme = t.scheme, i.userinfo = t.userinfo, i.host = t.host, i.port = t.port, i.path = ao(t.path || ""), i.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (i.userinfo = t.userinfo, i.host = t.host, i.port = t.port, i.path = ao(t.path || ""), i.query = t.query) : (t.path ? (t.path[0] === "/" ? i.path = ao(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? i.path = "/" + t.path : e.path ? i.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : i.path = t.path, i.path = ao(i.path)), i.query = t.query) : (i.path = e.path, t.query !== void 0 ? i.query = t.query : i.query = e.query), i.userinfo = e.userinfo, i.host = e.host, i.port = e.port), i.scheme = e.scheme), i.fragment = t.fragment, i;
}
function l_(e, t, n) {
  return typeof e == "string" ? (e = unescape(e), e = wn(fs(Ln(e, n), !0), { ...n, skipEscape: !0 })) : typeof e == "object" && (e = wn(fs(e, !0), { ...n, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = wn(fs(Ln(t, n), !0), { ...n, skipEscape: !0 })) : typeof t == "object" && (t = wn(fs(t, !0), { ...n, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function wn(e, t) {
  const n = {
    host: e.host,
    scheme: e.scheme,
    userinfo: e.userinfo,
    port: e.port,
    path: e.path,
    query: e.query,
    nid: e.nid,
    nss: e.nss,
    uuid: e.uuid,
    fragment: e.fragment,
    reference: e.reference,
    resourceName: e.resourceName,
    secure: e.secure,
    error: ""
  }, r = Object.assign({}, t), i = [], o = Am(r.scheme || n.scheme);
  o && o.serialize && o.serialize(n, r), n.path !== void 0 && (r.skipEscape ? n.path = unescape(n.path) : (n.path = escape(n.path), n.scheme !== void 0 && (n.path = n.path.split("%3A").join(":")))), r.reference !== "suffix" && n.scheme && i.push(n.scheme, ":");
  const s = r_(n);
  if (s !== void 0 && (r.reference !== "suffix" && i.push("//"), i.push(s), n.path && n.path[0] !== "/" && i.push("/")), n.path !== void 0) {
    let a = n.path;
    !r.absolutePath && (!o || !o.absolutePath) && (a = ao(a)), s === void 0 && a[0] === "/" && a[1] === "/" && (a = "/%2F" + a.slice(2)), i.push(a);
  }
  return n.query !== void 0 && i.push("?", n.query), n.fragment !== void 0 && i.push("#", n.fragment), i.join("");
}
const u_ = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Ln(e, t) {
  const n = Object.assign({}, t), r = {
    scheme: void 0,
    userinfo: void 0,
    host: "",
    port: void 0,
    path: "",
    query: void 0,
    fragment: void 0
  };
  let i = !1;
  n.reference === "suffix" && (n.scheme ? e = n.scheme + ":" + e : e = "//" + e);
  const o = e.match(u_);
  if (o) {
    if (r.scheme = o[1], r.userinfo = o[3], r.host = o[4], r.port = parseInt(o[5], 10), r.path = o[6] || "", r.query = o[7], r.fragment = o[8], isNaN(r.port) && (r.port = o[5]), r.host)
      if (i_(r.host) === !1) {
        const c = n_(r.host);
        r.host = c.host.toLowerCase(), i = c.isIPV6;
      } else
        i = !0;
    r.scheme === void 0 && r.userinfo === void 0 && r.host === void 0 && r.port === void 0 && r.query === void 0 && !r.path ? r.reference = "same-document" : r.scheme === void 0 ? r.reference = "relative" : r.fragment === void 0 ? r.reference = "absolute" : r.reference = "uri", n.reference && n.reference !== "suffix" && n.reference !== r.reference && (r.error = r.error || "URI is not a " + n.reference + " reference.");
    const s = Am(n.scheme || r.scheme);
    if (!n.unicodeSupport && (!s || !s.unicodeSupport) && r.host && (n.domainHost || s && s.domainHost) && i === !1 && o_(r.host))
      try {
        r.host = URL.domainToASCII(r.host.toLowerCase());
      } catch (a) {
        r.error = r.error || "Host's domain name can not be converted to ASCII: " + a;
      }
    (!s || s && !s.skipNormalize) && (e.indexOf("%") !== -1 && (r.scheme !== void 0 && (r.scheme = unescape(r.scheme)), r.host !== void 0 && (r.host = unescape(r.host))), r.path && (r.path = escape(unescape(r.path))), r.fragment && (r.fragment = encodeURI(decodeURIComponent(r.fragment)))), s && s.parse && s.parse(r, n);
  } else
    r.error = r.error || "URI can not be parsed.";
  return r;
}
const Ql = {
  SCHEMES: s_,
  normalize: a_,
  resolve: c_,
  resolveComponent: Tm,
  equal: l_,
  serialize: wn,
  parse: Ln
};
Sa.exports = Ql;
Sa.exports.default = Ql;
Sa.exports.fastUri = Ql;
var f_ = Sa.exports;
Object.defineProperty(Xl, "__esModule", { value: !0 });
const Cm = f_;
Cm.code = 'require("ajv/dist/runtime/uri").default';
Xl.default = Cm;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Zt;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var n = ue;
  Object.defineProperty(e, "_", { enumerable: !0, get: function() {
    return n._;
  } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
    return n.str;
  } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
    return n.stringify;
  } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
    return n.nil;
  } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
    return n.Name;
  } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
    return n.CodeGen;
  } });
  const r = Ri, i = Kr, o = zr, s = Ct, a = ue, c = ut, u = Qe, l = Q, f = FE, h = Xl, d = (j, N) => new RegExp(j, N);
  d.code = "new RegExp";
  const m = ["removeAdditional", "useDefaults", "coerceTypes"], p = /* @__PURE__ */ new Set([
    "validate",
    "serialize",
    "parse",
    "wrapper",
    "root",
    "schema",
    "keyword",
    "pattern",
    "formats",
    "validate$data",
    "func",
    "obj",
    "Error"
  ]), v = {
    errorDataPath: "",
    format: "`validateFormats: false` can be used instead.",
    nullable: '"nullable" keyword is supported by default.',
    jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
    extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
    missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
    processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
    sourceCode: "Use option `code: {source: true}`",
    strictDefaults: "It is default now, see option `strict`.",
    strictKeywords: "It is default now, see option `strict`.",
    uniqueItems: '"uniqueItems" keyword is always validated.',
    unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
    cache: "Map is used as cache, schema object as key.",
    serialize: "Map is used as cache, schema object as key.",
    ajvErrors: "It is default now."
  }, y = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, g = 200;
  function E(j) {
    var N, R, O, $, T, M, ne, te, we, ce, De, _, w, k, I, ge, Ae, Te, Ue, Ne, tt, Re, nt, pn, Qt;
    const Lt = j.strict, xt = (N = j.code) === null || N === void 0 ? void 0 : N.optimize, Sn = xt === !0 || xt === void 0 ? 1 : xt || 0, Un = (O = (R = j.code) === null || R === void 0 ? void 0 : R.regExp) !== null && O !== void 0 ? O : d, St = ($ = j.uriResolver) !== null && $ !== void 0 ? $ : h.default;
    return {
      strictSchema: (M = (T = j.strictSchema) !== null && T !== void 0 ? T : Lt) !== null && M !== void 0 ? M : !0,
      strictNumbers: (te = (ne = j.strictNumbers) !== null && ne !== void 0 ? ne : Lt) !== null && te !== void 0 ? te : !0,
      strictTypes: (ce = (we = j.strictTypes) !== null && we !== void 0 ? we : Lt) !== null && ce !== void 0 ? ce : "log",
      strictTuples: (_ = (De = j.strictTuples) !== null && De !== void 0 ? De : Lt) !== null && _ !== void 0 ? _ : "log",
      strictRequired: (k = (w = j.strictRequired) !== null && w !== void 0 ? w : Lt) !== null && k !== void 0 ? k : !1,
      code: j.code ? { ...j.code, optimize: Sn, regExp: Un } : { optimize: Sn, regExp: Un },
      loopRequired: (I = j.loopRequired) !== null && I !== void 0 ? I : g,
      loopEnum: (ge = j.loopEnum) !== null && ge !== void 0 ? ge : g,
      meta: (Ae = j.meta) !== null && Ae !== void 0 ? Ae : !0,
      messages: (Te = j.messages) !== null && Te !== void 0 ? Te : !0,
      inlineRefs: (Ue = j.inlineRefs) !== null && Ue !== void 0 ? Ue : !0,
      schemaId: (Ne = j.schemaId) !== null && Ne !== void 0 ? Ne : "$id",
      addUsedSchema: (tt = j.addUsedSchema) !== null && tt !== void 0 ? tt : !0,
      validateSchema: (Re = j.validateSchema) !== null && Re !== void 0 ? Re : !0,
      validateFormats: (nt = j.validateFormats) !== null && nt !== void 0 ? nt : !0,
      unicodeRegExp: (pn = j.unicodeRegExp) !== null && pn !== void 0 ? pn : !0,
      int32range: (Qt = j.int32range) !== null && Qt !== void 0 ? Qt : !0,
      uriResolver: St
    };
  }
  class S {
    constructor(N = {}) {
      this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), N = this.opts = { ...N, ...E(N) };
      const { es5: R, lines: O } = this.opts.code;
      this.scope = new a.ValueScope({ scope: {}, prefixes: p, es5: R, lines: O }), this.logger = V(N.logger);
      const $ = N.validateFormats;
      N.validateFormats = !1, this.RULES = (0, o.getRules)(), C.call(this, v, N, "NOT SUPPORTED"), C.call(this, y, N, "DEPRECATED", "warn"), this._metaOpts = b.call(this), N.formats && z.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), N.keywords && H.call(this, N.keywords), typeof N.meta == "object" && this.addMetaSchema(N.meta), G.call(this), N.validateFormats = $;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: N, meta: R, schemaId: O } = this.opts;
      let $ = f;
      O === "id" && ($ = { ...f }, $.id = $.$id, delete $.$id), R && N && this.addMetaSchema($, $[O], !1);
    }
    defaultMeta() {
      const { meta: N, schemaId: R } = this.opts;
      return this.opts.defaultMeta = typeof N == "object" ? N[R] || N : void 0;
    }
    validate(N, R) {
      let O;
      if (typeof N == "string") {
        if (O = this.getSchema(N), !O)
          throw new Error(`no schema with key or ref "${N}"`);
      } else
        O = this.compile(N);
      const $ = O(R);
      return "$async" in O || (this.errors = O.errors), $;
    }
    compile(N, R) {
      const O = this._addSchema(N, R);
      return O.validate || this._compileSchemaEnv(O);
    }
    compileAsync(N, R) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: O } = this.opts;
      return $.call(this, N, R);
      async function $(ce, De) {
        await T.call(this, ce.$schema);
        const _ = this._addSchema(ce, De);
        return _.validate || M.call(this, _);
      }
      async function T(ce) {
        ce && !this.getSchema(ce) && await $.call(this, { $ref: ce }, !0);
      }
      async function M(ce) {
        try {
          return this._compileSchemaEnv(ce);
        } catch (De) {
          if (!(De instanceof i.default))
            throw De;
          return ne.call(this, De), await te.call(this, De.missingSchema), M.call(this, ce);
        }
      }
      function ne({ missingSchema: ce, missingRef: De }) {
        if (this.refs[ce])
          throw new Error(`AnySchema ${ce} is loaded but ${De} cannot be resolved`);
      }
      async function te(ce) {
        const De = await we.call(this, ce);
        this.refs[ce] || await T.call(this, De.$schema), this.refs[ce] || this.addSchema(De, ce, R);
      }
      async function we(ce) {
        const De = this._loading[ce];
        if (De)
          return De;
        try {
          return await (this._loading[ce] = O(ce));
        } finally {
          delete this._loading[ce];
        }
      }
    }
    // Adds schema to the instance
    addSchema(N, R, O, $ = this.opts.validateSchema) {
      if (Array.isArray(N)) {
        for (const M of N)
          this.addSchema(M, void 0, O, $);
        return this;
      }
      let T;
      if (typeof N == "object") {
        const { schemaId: M } = this.opts;
        if (T = N[M], T !== void 0 && typeof T != "string")
          throw new Error(`schema ${M} must be string`);
      }
      return R = (0, c.normalizeId)(R || T), this._checkUnique(R), this.schemas[R] = this._addSchema(N, O, R, $, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(N, R, O = this.opts.validateSchema) {
      return this.addSchema(N, R, !0, O), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(N, R) {
      if (typeof N == "boolean")
        return !0;
      let O;
      if (O = N.$schema, O !== void 0 && typeof O != "string")
        throw new Error("$schema must be a string");
      if (O = O || this.opts.defaultMeta || this.defaultMeta(), !O)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const $ = this.validate(O, N);
      if (!$ && R) {
        const T = "schema is invalid: " + this.errorsText();
        if (this.opts.validateSchema === "log")
          this.logger.error(T);
        else
          throw new Error(T);
      }
      return $;
    }
    // Get compiled schema by `key` or `ref`.
    // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
    getSchema(N) {
      let R;
      for (; typeof (R = U.call(this, N)) == "string"; )
        N = R;
      if (R === void 0) {
        const { schemaId: O } = this.opts, $ = new s.SchemaEnv({ schema: {}, schemaId: O });
        if (R = s.resolveSchema.call(this, $, N), !R)
          return;
        this.refs[N] = R;
      }
      return R.validate || this._compileSchemaEnv(R);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(N) {
      if (N instanceof RegExp)
        return this._removeAllSchemas(this.schemas, N), this._removeAllSchemas(this.refs, N), this;
      switch (typeof N) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const R = U.call(this, N);
          return typeof R == "object" && this._cache.delete(R.schema), delete this.schemas[N], delete this.refs[N], this;
        }
        case "object": {
          const R = N;
          this._cache.delete(R);
          let O = N[this.opts.schemaId];
          return O && (O = (0, c.normalizeId)(O), delete this.schemas[O], delete this.refs[O]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(N) {
      for (const R of N)
        this.addKeyword(R);
      return this;
    }
    addKeyword(N, R) {
      let O;
      if (typeof N == "string")
        O = N, typeof R == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), R.keyword = O);
      else if (typeof N == "object" && R === void 0) {
        if (R = N, O = R.keyword, Array.isArray(O) && !O.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (F.call(this, O, R), !R)
        return (0, l.eachItem)(O, (T) => x.call(this, T)), this;
      q.call(this, R);
      const $ = {
        ...R,
        type: (0, u.getJSONTypes)(R.type),
        schemaType: (0, u.getJSONTypes)(R.schemaType)
      };
      return (0, l.eachItem)(O, $.type.length === 0 ? (T) => x.call(this, T, $) : (T) => $.type.forEach((M) => x.call(this, T, $, M))), this;
    }
    getKeyword(N) {
      const R = this.RULES.all[N];
      return typeof R == "object" ? R.definition : !!R;
    }
    // Remove keyword
    removeKeyword(N) {
      const { RULES: R } = this;
      delete R.keywords[N], delete R.all[N];
      for (const O of R.rules) {
        const $ = O.rules.findIndex((T) => T.keyword === N);
        $ >= 0 && O.rules.splice($, 1);
      }
      return this;
    }
    // Add format
    addFormat(N, R) {
      return typeof R == "string" && (R = new RegExp(R)), this.formats[N] = R, this;
    }
    errorsText(N = this.errors, { separator: R = ", ", dataVar: O = "data" } = {}) {
      return !N || N.length === 0 ? "No errors" : N.map(($) => `${O}${$.instancePath} ${$.message}`).reduce(($, T) => $ + R + T);
    }
    $dataMetaSchema(N, R) {
      const O = this.RULES.all;
      N = JSON.parse(JSON.stringify(N));
      for (const $ of R) {
        const T = $.split("/").slice(1);
        let M = N;
        for (const ne of T)
          M = M[ne];
        for (const ne in O) {
          const te = O[ne];
          if (typeof te != "object")
            continue;
          const { $data: we } = te.definition, ce = M[ne];
          we && ce && (M[ne] = J(ce));
        }
      }
      return N;
    }
    _removeAllSchemas(N, R) {
      for (const O in N) {
        const $ = N[O];
        (!R || R.test(O)) && (typeof $ == "string" ? delete N[O] : $ && !$.meta && (this._cache.delete($.schema), delete N[O]));
      }
    }
    _addSchema(N, R, O, $ = this.opts.validateSchema, T = this.opts.addUsedSchema) {
      let M;
      const { schemaId: ne } = this.opts;
      if (typeof N == "object")
        M = N[ne];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof N != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let te = this._cache.get(N);
      if (te !== void 0)
        return te;
      O = (0, c.normalizeId)(M || O);
      const we = c.getSchemaRefs.call(this, N, O);
      return te = new s.SchemaEnv({ schema: N, schemaId: ne, meta: R, baseId: O, localRefs: we }), this._cache.set(te.schema, te), T && !O.startsWith("#") && (O && this._checkUnique(O), this.refs[O] = te), $ && this.validateSchema(N, !0), te;
    }
    _checkUnique(N) {
      if (this.schemas[N] || this.refs[N])
        throw new Error(`schema with key or id "${N}" already exists`);
    }
    _compileSchemaEnv(N) {
      if (N.meta ? this._compileMetaSchema(N) : s.compileSchema.call(this, N), !N.validate)
        throw new Error("ajv implementation error");
      return N.validate;
    }
    _compileMetaSchema(N) {
      const R = this.opts;
      this.opts = this._metaOpts;
      try {
        s.compileSchema.call(this, N);
      } finally {
        this.opts = R;
      }
    }
  }
  S.ValidationError = r.default, S.MissingRefError = i.default, e.default = S;
  function C(j, N, R, O = "error") {
    for (const $ in j) {
      const T = $;
      T in N && this.logger[O](`${R}: option ${$}. ${j[T]}`);
    }
  }
  function U(j) {
    return j = (0, c.normalizeId)(j), this.schemas[j] || this.refs[j];
  }
  function G() {
    const j = this.opts.schemas;
    if (j)
      if (Array.isArray(j))
        this.addSchema(j);
      else
        for (const N in j)
          this.addSchema(j[N], N);
  }
  function z() {
    for (const j in this.opts.formats) {
      const N = this.opts.formats[j];
      N && this.addFormat(j, N);
    }
  }
  function H(j) {
    if (Array.isArray(j)) {
      this.addVocabulary(j);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const N in j) {
      const R = j[N];
      R.keyword || (R.keyword = N), this.addKeyword(R);
    }
  }
  function b() {
    const j = { ...this.opts };
    for (const N of m)
      delete j[N];
    return j;
  }
  const B = { log() {
  }, warn() {
  }, error() {
  } };
  function V(j) {
    if (j === !1)
      return B;
    if (j === void 0)
      return console;
    if (j.log && j.warn && j.error)
      return j;
    throw new Error("logger must implement log, warn and error methods");
  }
  const Z = /^[a-z_$][a-z0-9_$:-]*$/i;
  function F(j, N) {
    const { RULES: R } = this;
    if ((0, l.eachItem)(j, (O) => {
      if (R.keywords[O])
        throw new Error(`Keyword ${O} is already defined`);
      if (!Z.test(O))
        throw new Error(`Keyword ${O} has invalid name`);
    }), !!N && N.$data && !("code" in N || "validate" in N))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function x(j, N, R) {
    var O;
    const $ = N == null ? void 0 : N.post;
    if (R && $)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: T } = this;
    let M = $ ? T.post : T.rules.find(({ type: te }) => te === R);
    if (M || (M = { type: R, rules: [] }, T.rules.push(M)), T.keywords[j] = !0, !N)
      return;
    const ne = {
      keyword: j,
      definition: {
        ...N,
        type: (0, u.getJSONTypes)(N.type),
        schemaType: (0, u.getJSONTypes)(N.schemaType)
      }
    };
    N.before ? W.call(this, M, ne, N.before) : M.rules.push(ne), T.all[j] = ne, (O = N.implements) === null || O === void 0 || O.forEach((te) => this.addKeyword(te));
  }
  function W(j, N, R) {
    const O = j.rules.findIndex(($) => $.keyword === R);
    O >= 0 ? j.rules.splice(O, 0, N) : (j.rules.push(N), this.logger.warn(`rule ${R} is not defined`));
  }
  function q(j) {
    let { metaSchema: N } = j;
    N !== void 0 && (j.$data && this.opts.$data && (N = J(N)), j.validateSchema = this.compile(N, !0));
  }
  const Y = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function J(j) {
    return { anyOf: [j, Y] };
  }
})(Ml);
var eu = {}, ba = {}, tu = {};
Object.defineProperty(tu, "__esModule", { value: !0 });
const d_ = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
tu.default = d_;
var xn = {};
Object.defineProperty(xn, "__esModule", { value: !0 });
xn.callRef = xn.getValidate = void 0;
const h_ = Kr, Yf = ye, jt = ue, ni = Gt, Xf = Ct, ds = Q, p_ = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: n, it: r } = e, { baseId: i, schemaEnv: o, validateName: s, opts: a, self: c } = r, { root: u } = o;
    if ((n === "#" || n === "#/") && i === u.baseId)
      return f();
    const l = Xf.resolveRef.call(c, u, i, n);
    if (l === void 0)
      throw new h_.default(r.opts.uriResolver, i, n);
    if (l instanceof Xf.SchemaEnv)
      return h(l);
    return d(l);
    function f() {
      if (o === u)
        return Hs(e, s, o, o.$async);
      const m = t.scopeValue("root", { ref: u });
      return Hs(e, (0, jt._)`${m}.validate`, u, u.$async);
    }
    function h(m) {
      const p = Nm(e, m);
      Hs(e, p, m, m.$async);
    }
    function d(m) {
      const p = t.scopeValue("schema", a.code.source === !0 ? { ref: m, code: (0, jt.stringify)(m) } : { ref: m }), v = t.name("valid"), y = e.subschema({
        schema: m,
        dataTypes: [],
        schemaPath: jt.nil,
        topSchemaRef: p,
        errSchemaPath: n
      }, v);
      e.mergeEvaluated(y), e.ok(v);
    }
  }
};
function Nm(e, t) {
  const { gen: n } = e;
  return t.validate ? n.scopeValue("validate", { ref: t.validate }) : (0, jt._)`${n.scopeValue("wrapper", { ref: t })}.validate`;
}
xn.getValidate = Nm;
function Hs(e, t, n, r) {
  const { gen: i, it: o } = e, { allErrors: s, schemaEnv: a, opts: c } = o, u = c.passContext ? ni.default.this : jt.nil;
  r ? l() : f();
  function l() {
    if (!a.$async)
      throw new Error("async schema referenced by sync schema");
    const m = i.let("valid");
    i.try(() => {
      i.code((0, jt._)`await ${(0, Yf.callValidateCode)(e, t, u)}`), d(t), s || i.assign(m, !0);
    }, (p) => {
      i.if((0, jt._)`!(${p} instanceof ${o.ValidationError})`, () => i.throw(p)), h(p), s || i.assign(m, !1);
    }), e.ok(m);
  }
  function f() {
    e.result((0, Yf.callValidateCode)(e, t, u), () => d(t), () => h(t));
  }
  function h(m) {
    const p = (0, jt._)`${m}.errors`;
    i.assign(ni.default.vErrors, (0, jt._)`${ni.default.vErrors} === null ? ${p} : ${ni.default.vErrors}.concat(${p})`), i.assign(ni.default.errors, (0, jt._)`${ni.default.vErrors}.length`);
  }
  function d(m) {
    var p;
    if (!o.opts.unevaluated)
      return;
    const v = (p = n == null ? void 0 : n.validate) === null || p === void 0 ? void 0 : p.evaluated;
    if (o.props !== !0)
      if (v && !v.dynamicProps)
        v.props !== void 0 && (o.props = ds.mergeEvaluated.props(i, v.props, o.props));
      else {
        const y = i.var("props", (0, jt._)`${m}.evaluated.props`);
        o.props = ds.mergeEvaluated.props(i, y, o.props, jt.Name);
      }
    if (o.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (o.items = ds.mergeEvaluated.items(i, v.items, o.items));
      else {
        const y = i.var("items", (0, jt._)`${m}.evaluated.items`);
        o.items = ds.mergeEvaluated.items(i, y, o.items, jt.Name);
      }
  }
}
xn.callRef = Hs;
xn.default = p_;
Object.defineProperty(ba, "__esModule", { value: !0 });
const m_ = tu, g_ = xn, y_ = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  m_.default,
  g_.default
];
ba.default = y_;
var Aa = {}, nu = {};
Object.defineProperty(nu, "__esModule", { value: !0 });
const Qs = ue, Gn = Qs.operators, ea = {
  maximum: { okStr: "<=", ok: Gn.LTE, fail: Gn.GT },
  minimum: { okStr: ">=", ok: Gn.GTE, fail: Gn.LT },
  exclusiveMaximum: { okStr: "<", ok: Gn.LT, fail: Gn.GTE },
  exclusiveMinimum: { okStr: ">", ok: Gn.GT, fail: Gn.LTE }
}, v_ = {
  message: ({ keyword: e, schemaCode: t }) => (0, Qs.str)`must be ${ea[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Qs._)`{comparison: ${ea[e].okStr}, limit: ${t}}`
}, w_ = {
  keyword: Object.keys(ea),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: v_,
  code(e) {
    const { keyword: t, data: n, schemaCode: r } = e;
    e.fail$data((0, Qs._)`${n} ${ea[t].fail} ${r} || isNaN(${n})`);
  }
};
nu.default = w_;
var ru = {};
Object.defineProperty(ru, "__esModule", { value: !0 });
const ho = ue, E_ = {
  message: ({ schemaCode: e }) => (0, ho.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, ho._)`{multipleOf: ${e}}`
}, __ = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: E_,
  code(e) {
    const { gen: t, data: n, schemaCode: r, it: i } = e, o = i.opts.multipleOfPrecision, s = t.let("res"), a = o ? (0, ho._)`Math.abs(Math.round(${s}) - ${s}) > 1e-${o}` : (0, ho._)`${s} !== parseInt(${s})`;
    e.fail$data((0, ho._)`(${r} === 0 || (${s} = ${n}/${r}, ${a}))`);
  }
};
ru.default = __;
var iu = {}, ou = {};
Object.defineProperty(ou, "__esModule", { value: !0 });
function Im(e) {
  const t = e.length;
  let n = 0, r = 0, i;
  for (; r < t; )
    n++, i = e.charCodeAt(r++), i >= 55296 && i <= 56319 && r < t && (i = e.charCodeAt(r), (i & 64512) === 56320 && r++);
  return n;
}
ou.default = Im;
Im.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(iu, "__esModule", { value: !0 });
const Or = ue, $_ = Q, S_ = ou, b_ = {
  message({ keyword: e, schemaCode: t }) {
    const n = e === "maxLength" ? "more" : "fewer";
    return (0, Or.str)`must NOT have ${n} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Or._)`{limit: ${e}}`
}, A_ = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: b_,
  code(e) {
    const { keyword: t, data: n, schemaCode: r, it: i } = e, o = t === "maxLength" ? Or.operators.GT : Or.operators.LT, s = i.opts.unicode === !1 ? (0, Or._)`${n}.length` : (0, Or._)`${(0, $_.useFunc)(e.gen, S_.default)}(${n})`;
    e.fail$data((0, Or._)`${s} ${o} ${r}`);
  }
};
iu.default = A_;
var su = {};
Object.defineProperty(su, "__esModule", { value: !0 });
const T_ = ye, C_ = Q, mi = ue, N_ = {
  message: ({ schemaCode: e }) => (0, mi.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, mi._)`{pattern: ${e}}`
}, I_ = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: N_,
  code(e) {
    const { gen: t, data: n, $data: r, schema: i, schemaCode: o, it: s } = e, a = s.opts.unicodeRegExp ? "u" : "";
    if (r) {
      const { regExp: c } = s.opts.code, u = c.code === "new RegExp" ? (0, mi._)`new RegExp` : (0, C_.useFunc)(t, c), l = t.let("valid");
      t.try(() => t.assign(l, (0, mi._)`${u}(${o}, ${a}).test(${n})`), () => t.assign(l, !1)), e.fail$data((0, mi._)`!${l}`);
    } else {
      const c = (0, T_.usePattern)(e, i);
      e.fail$data((0, mi._)`!${c}.test(${n})`);
    }
  }
};
su.default = I_;
var au = {};
Object.defineProperty(au, "__esModule", { value: !0 });
const po = ue, P_ = {
  message({ keyword: e, schemaCode: t }) {
    const n = e === "maxProperties" ? "more" : "fewer";
    return (0, po.str)`must NOT have ${n} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, po._)`{limit: ${e}}`
}, O_ = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: P_,
  code(e) {
    const { keyword: t, data: n, schemaCode: r } = e, i = t === "maxProperties" ? po.operators.GT : po.operators.LT;
    e.fail$data((0, po._)`Object.keys(${n}).length ${i} ${r}`);
  }
};
au.default = O_;
var cu = {};
Object.defineProperty(cu, "__esModule", { value: !0 });
const Qi = ye, mo = ue, R_ = Q, D_ = {
  message: ({ params: { missingProperty: e } }) => (0, mo.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, mo._)`{missingProperty: ${e}}`
}, F_ = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: D_,
  code(e) {
    const { gen: t, schema: n, schemaCode: r, data: i, $data: o, it: s } = e, { opts: a } = s;
    if (!o && n.length === 0)
      return;
    const c = n.length >= a.loopRequired;
    if (s.allErrors ? u() : l(), a.strictRequired) {
      const d = e.parentSchema.properties, { definedProperties: m } = e.it;
      for (const p of n)
        if ((d == null ? void 0 : d[p]) === void 0 && !m.has(p)) {
          const v = s.schemaEnv.baseId + s.errSchemaPath, y = `required property "${p}" is not defined at "${v}" (strictRequired)`;
          (0, R_.checkStrictMode)(s, y, s.opts.strictRequired);
        }
    }
    function u() {
      if (c || o)
        e.block$data(mo.nil, f);
      else
        for (const d of n)
          (0, Qi.checkReportMissingProp)(e, d);
    }
    function l() {
      const d = t.let("missing");
      if (c || o) {
        const m = t.let("valid", !0);
        e.block$data(m, () => h(d, m)), e.ok(m);
      } else
        t.if((0, Qi.checkMissingProp)(e, n, d)), (0, Qi.reportMissingProp)(e, d), t.else();
    }
    function f() {
      t.forOf("prop", r, (d) => {
        e.setParams({ missingProperty: d }), t.if((0, Qi.noPropertyInData)(t, i, d, a.ownProperties), () => e.error());
      });
    }
    function h(d, m) {
      e.setParams({ missingProperty: d }), t.forOf(d, r, () => {
        t.assign(m, (0, Qi.propertyInData)(t, i, d, a.ownProperties)), t.if((0, mo.not)(m), () => {
          e.error(), t.break();
        });
      }, mo.nil);
    }
  }
};
cu.default = F_;
var lu = {};
Object.defineProperty(lu, "__esModule", { value: !0 });
const go = ue, L_ = {
  message({ keyword: e, schemaCode: t }) {
    const n = e === "maxItems" ? "more" : "fewer";
    return (0, go.str)`must NOT have ${n} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, go._)`{limit: ${e}}`
}, x_ = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: L_,
  code(e) {
    const { keyword: t, data: n, schemaCode: r } = e, i = t === "maxItems" ? go.operators.GT : go.operators.LT;
    e.fail$data((0, go._)`${n}.length ${i} ${r}`);
  }
};
lu.default = x_;
var uu = {}, Ho = {};
Object.defineProperty(Ho, "__esModule", { value: !0 });
const Pm = em;
Pm.code = 'require("ajv/dist/runtime/equal").default';
Ho.default = Pm;
Object.defineProperty(uu, "__esModule", { value: !0 });
const gc = Qe, lt = ue, k_ = Q, U_ = Ho, j_ = {
  message: ({ params: { i: e, j: t } }) => (0, lt.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, lt._)`{i: ${e}, j: ${t}}`
}, M_ = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: j_,
  code(e) {
    const { gen: t, data: n, $data: r, schema: i, parentSchema: o, schemaCode: s, it: a } = e;
    if (!r && !i)
      return;
    const c = t.let("valid"), u = o.items ? (0, gc.getSchemaTypes)(o.items) : [];
    e.block$data(c, l, (0, lt._)`${s} === false`), e.ok(c);
    function l() {
      const m = t.let("i", (0, lt._)`${n}.length`), p = t.let("j");
      e.setParams({ i: m, j: p }), t.assign(c, !0), t.if((0, lt._)`${m} > 1`, () => (f() ? h : d)(m, p));
    }
    function f() {
      return u.length > 0 && !u.some((m) => m === "object" || m === "array");
    }
    function h(m, p) {
      const v = t.name("item"), y = (0, gc.checkDataTypes)(u, v, a.opts.strictNumbers, gc.DataType.Wrong), g = t.const("indices", (0, lt._)`{}`);
      t.for((0, lt._)`;${m}--;`, () => {
        t.let(v, (0, lt._)`${n}[${m}]`), t.if(y, (0, lt._)`continue`), u.length > 1 && t.if((0, lt._)`typeof ${v} == "string"`, (0, lt._)`${v} += "_"`), t.if((0, lt._)`typeof ${g}[${v}] == "number"`, () => {
          t.assign(p, (0, lt._)`${g}[${v}]`), e.error(), t.assign(c, !1).break();
        }).code((0, lt._)`${g}[${v}] = ${m}`);
      });
    }
    function d(m, p) {
      const v = (0, k_.useFunc)(t, U_.default), y = t.name("outer");
      t.label(y).for((0, lt._)`;${m}--;`, () => t.for((0, lt._)`${p} = ${m}; ${p}--;`, () => t.if((0, lt._)`${v}(${n}[${m}], ${n}[${p}])`, () => {
        e.error(), t.assign(c, !1).break(y);
      })));
    }
  }
};
uu.default = M_;
var fu = {};
Object.defineProperty(fu, "__esModule", { value: !0 });
const dl = ue, B_ = Q, H_ = Ho, q_ = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, dl._)`{allowedValue: ${e}}`
}, z_ = {
  keyword: "const",
  $data: !0,
  error: q_,
  code(e) {
    const { gen: t, data: n, $data: r, schemaCode: i, schema: o } = e;
    r || o && typeof o == "object" ? e.fail$data((0, dl._)`!${(0, B_.useFunc)(t, H_.default)}(${n}, ${i})`) : e.fail((0, dl._)`${o} !== ${n}`);
  }
};
fu.default = z_;
var du = {};
Object.defineProperty(du, "__esModule", { value: !0 });
const co = ue, V_ = Q, G_ = Ho, W_ = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, co._)`{allowedValues: ${e}}`
}, K_ = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: W_,
  code(e) {
    const { gen: t, data: n, $data: r, schema: i, schemaCode: o, it: s } = e;
    if (!r && i.length === 0)
      throw new Error("enum must have non-empty array");
    const a = i.length >= s.opts.loopEnum;
    let c;
    const u = () => c ?? (c = (0, V_.useFunc)(t, G_.default));
    let l;
    if (a || r)
      l = t.let("valid"), e.block$data(l, f);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const d = t.const("vSchema", o);
      l = (0, co.or)(...i.map((m, p) => h(d, p)));
    }
    e.pass(l);
    function f() {
      t.assign(l, !1), t.forOf("v", o, (d) => t.if((0, co._)`${u()}(${n}, ${d})`, () => t.assign(l, !0).break()));
    }
    function h(d, m) {
      const p = i[m];
      return typeof p == "object" && p !== null ? (0, co._)`${u()}(${n}, ${d}[${m}])` : (0, co._)`${n} === ${p}`;
    }
  }
};
du.default = K_;
Object.defineProperty(Aa, "__esModule", { value: !0 });
const J_ = nu, Y_ = ru, X_ = iu, Z_ = su, Q_ = au, e$ = cu, t$ = lu, n$ = uu, r$ = fu, i$ = du, o$ = [
  // number
  J_.default,
  Y_.default,
  // string
  X_.default,
  Z_.default,
  // object
  Q_.default,
  e$.default,
  // array
  t$.default,
  n$.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  r$.default,
  i$.default
];
Aa.default = o$;
var Ta = {}, Di = {};
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.validateAdditionalItems = void 0;
const Rr = ue, hl = Q, s$ = {
  message: ({ params: { len: e } }) => (0, Rr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Rr._)`{limit: ${e}}`
}, a$ = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: s$,
  code(e) {
    const { parentSchema: t, it: n } = e, { items: r } = t;
    if (!Array.isArray(r)) {
      (0, hl.checkStrictMode)(n, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    Om(e, r);
  }
};
function Om(e, t) {
  const { gen: n, schema: r, data: i, keyword: o, it: s } = e;
  s.items = !0;
  const a = n.const("len", (0, Rr._)`${i}.length`);
  if (r === !1)
    e.setParams({ len: t.length }), e.pass((0, Rr._)`${a} <= ${t.length}`);
  else if (typeof r == "object" && !(0, hl.alwaysValidSchema)(s, r)) {
    const u = n.var("valid", (0, Rr._)`${a} <= ${t.length}`);
    n.if((0, Rr.not)(u), () => c(u)), e.ok(u);
  }
  function c(u) {
    n.forRange("i", t.length, a, (l) => {
      e.subschema({ keyword: o, dataProp: l, dataPropType: hl.Type.Num }, u), s.allErrors || n.if((0, Rr.not)(u), () => n.break());
    });
  }
}
Di.validateAdditionalItems = Om;
Di.default = a$;
var hu = {}, Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.validateTuple = void 0;
const Zf = ue, qs = Q, c$ = ye, l$ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: n } = e;
    if (Array.isArray(t))
      return Rm(e, "additionalItems", t);
    n.items = !0, !(0, qs.alwaysValidSchema)(n, t) && e.ok((0, c$.validateArray)(e));
  }
};
function Rm(e, t, n = e.schema) {
  const { gen: r, parentSchema: i, data: o, keyword: s, it: a } = e;
  l(i), a.opts.unevaluated && n.length && a.items !== !0 && (a.items = qs.mergeEvaluated.items(r, n.length, a.items));
  const c = r.name("valid"), u = r.const("len", (0, Zf._)`${o}.length`);
  n.forEach((f, h) => {
    (0, qs.alwaysValidSchema)(a, f) || (r.if((0, Zf._)`${u} > ${h}`, () => e.subschema({
      keyword: s,
      schemaProp: h,
      dataProp: h
    }, c)), e.ok(c));
  });
  function l(f) {
    const { opts: h, errSchemaPath: d } = a, m = n.length, p = m === f.minItems && (m === f.maxItems || f[t] === !1);
    if (h.strictTuples && !p) {
      const v = `"${s}" is ${m}-tuple, but minItems or maxItems/${t} are not specified or different at path "${d}"`;
      (0, qs.checkStrictMode)(a, v, h.strictTuples);
    }
  }
}
Fi.validateTuple = Rm;
Fi.default = l$;
Object.defineProperty(hu, "__esModule", { value: !0 });
const u$ = Fi, f$ = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, u$.validateTuple)(e, "items")
};
hu.default = f$;
var pu = {};
Object.defineProperty(pu, "__esModule", { value: !0 });
const Qf = ue, d$ = Q, h$ = ye, p$ = Di, m$ = {
  message: ({ params: { len: e } }) => (0, Qf.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Qf._)`{limit: ${e}}`
}, g$ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: m$,
  code(e) {
    const { schema: t, parentSchema: n, it: r } = e, { prefixItems: i } = n;
    r.items = !0, !(0, d$.alwaysValidSchema)(r, t) && (i ? (0, p$.validateAdditionalItems)(e, i) : e.ok((0, h$.validateArray)(e)));
  }
};
pu.default = g$;
var mu = {};
Object.defineProperty(mu, "__esModule", { value: !0 });
const Yt = ue, hs = Q, y$ = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Yt.str)`must contain at least ${e} valid item(s)` : (0, Yt.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Yt._)`{minContains: ${e}}` : (0, Yt._)`{minContains: ${e}, maxContains: ${t}}`
}, v$ = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: y$,
  code(e) {
    const { gen: t, schema: n, parentSchema: r, data: i, it: o } = e;
    let s, a;
    const { minContains: c, maxContains: u } = r;
    o.opts.next ? (s = c === void 0 ? 1 : c, a = u) : s = 1;
    const l = t.const("len", (0, Yt._)`${i}.length`);
    if (e.setParams({ min: s, max: a }), a === void 0 && s === 0) {
      (0, hs.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (a !== void 0 && s > a) {
      (0, hs.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, hs.alwaysValidSchema)(o, n)) {
      let p = (0, Yt._)`${l} >= ${s}`;
      a !== void 0 && (p = (0, Yt._)`${p} && ${l} <= ${a}`), e.pass(p);
      return;
    }
    o.items = !0;
    const f = t.name("valid");
    a === void 0 && s === 1 ? d(f, () => t.if(f, () => t.break())) : s === 0 ? (t.let(f, !0), a !== void 0 && t.if((0, Yt._)`${i}.length > 0`, h)) : (t.let(f, !1), h()), e.result(f, () => e.reset());
    function h() {
      const p = t.name("_valid"), v = t.let("count", 0);
      d(p, () => t.if(p, () => m(v)));
    }
    function d(p, v) {
      t.forRange("i", 0, l, (y) => {
        e.subschema({
          keyword: "contains",
          dataProp: y,
          dataPropType: hs.Type.Num,
          compositeRule: !0
        }, p), v();
      });
    }
    function m(p) {
      t.code((0, Yt._)`${p}++`), a === void 0 ? t.if((0, Yt._)`${p} >= ${s}`, () => t.assign(f, !0).break()) : (t.if((0, Yt._)`${p} > ${a}`, () => t.assign(f, !1).break()), s === 1 ? t.assign(f, !0) : t.if((0, Yt._)`${p} >= ${s}`, () => t.assign(f, !0)));
    }
  }
};
mu.default = v$;
var Ca = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = ue, n = Q, r = ye;
  e.error = {
    message: ({ params: { property: c, depsCount: u, deps: l } }) => {
      const f = u === 1 ? "property" : "properties";
      return (0, t.str)`must have ${f} ${l} when property ${c} is present`;
    },
    params: ({ params: { property: c, depsCount: u, deps: l, missingProperty: f } }) => (0, t._)`{property: ${c},
    missingProperty: ${f},
    depsCount: ${u},
    deps: ${l}}`
    // TODO change to reference
  };
  const i = {
    keyword: "dependencies",
    type: "object",
    schemaType: "object",
    error: e.error,
    code(c) {
      const [u, l] = o(c);
      s(c, u), a(c, l);
    }
  };
  function o({ schema: c }) {
    const u = {}, l = {};
    for (const f in c) {
      if (f === "__proto__")
        continue;
      const h = Array.isArray(c[f]) ? u : l;
      h[f] = c[f];
    }
    return [u, l];
  }
  function s(c, u = c.schema) {
    const { gen: l, data: f, it: h } = c;
    if (Object.keys(u).length === 0)
      return;
    const d = l.let("missing");
    for (const m in u) {
      const p = u[m];
      if (p.length === 0)
        continue;
      const v = (0, r.propertyInData)(l, f, m, h.opts.ownProperties);
      c.setParams({
        property: m,
        depsCount: p.length,
        deps: p.join(", ")
      }), h.allErrors ? l.if(v, () => {
        for (const y of p)
          (0, r.checkReportMissingProp)(c, y);
      }) : (l.if((0, t._)`${v} && (${(0, r.checkMissingProp)(c, p, d)})`), (0, r.reportMissingProp)(c, d), l.else());
    }
  }
  e.validatePropertyDeps = s;
  function a(c, u = c.schema) {
    const { gen: l, data: f, keyword: h, it: d } = c, m = l.name("valid");
    for (const p in u)
      (0, n.alwaysValidSchema)(d, u[p]) || (l.if(
        (0, r.propertyInData)(l, f, p, d.opts.ownProperties),
        () => {
          const v = c.subschema({ keyword: h, schemaProp: p }, m);
          c.mergeValidEvaluated(v, m);
        },
        () => l.var(m, !0)
        // TODO var
      ), c.ok(m));
  }
  e.validateSchemaDeps = a, e.default = i;
})(Ca);
var gu = {};
Object.defineProperty(gu, "__esModule", { value: !0 });
const Dm = ue, w$ = Q, E$ = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Dm._)`{propertyName: ${e.propertyName}}`
}, _$ = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: E$,
  code(e) {
    const { gen: t, schema: n, data: r, it: i } = e;
    if ((0, w$.alwaysValidSchema)(i, n))
      return;
    const o = t.name("valid");
    t.forIn("key", r, (s) => {
      e.setParams({ propertyName: s }), e.subschema({
        keyword: "propertyNames",
        data: s,
        dataTypes: ["string"],
        propertyName: s,
        compositeRule: !0
      }, o), t.if((0, Dm.not)(o), () => {
        e.error(!0), i.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
gu.default = _$;
var Na = {};
Object.defineProperty(Na, "__esModule", { value: !0 });
const ps = ye, sn = ue, $$ = Gt, ms = Q, S$ = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, sn._)`{additionalProperty: ${e.additionalProperty}}`
}, b$ = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: S$,
  code(e) {
    const { gen: t, schema: n, parentSchema: r, data: i, errsCount: o, it: s } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: a, opts: c } = s;
    if (s.props = !0, c.removeAdditional !== "all" && (0, ms.alwaysValidSchema)(s, n))
      return;
    const u = (0, ps.allSchemaProperties)(r.properties), l = (0, ps.allSchemaProperties)(r.patternProperties);
    f(), e.ok((0, sn._)`${o} === ${$$.default.errors}`);
    function f() {
      t.forIn("key", i, (v) => {
        !u.length && !l.length ? m(v) : t.if(h(v), () => m(v));
      });
    }
    function h(v) {
      let y;
      if (u.length > 8) {
        const g = (0, ms.schemaRefOrVal)(s, r.properties, "properties");
        y = (0, ps.isOwnProperty)(t, g, v);
      } else u.length ? y = (0, sn.or)(...u.map((g) => (0, sn._)`${v} === ${g}`)) : y = sn.nil;
      return l.length && (y = (0, sn.or)(y, ...l.map((g) => (0, sn._)`${(0, ps.usePattern)(e, g)}.test(${v})`))), (0, sn.not)(y);
    }
    function d(v) {
      t.code((0, sn._)`delete ${i}[${v}]`);
    }
    function m(v) {
      if (c.removeAdditional === "all" || c.removeAdditional && n === !1) {
        d(v);
        return;
      }
      if (n === !1) {
        e.setParams({ additionalProperty: v }), e.error(), a || t.break();
        return;
      }
      if (typeof n == "object" && !(0, ms.alwaysValidSchema)(s, n)) {
        const y = t.name("valid");
        c.removeAdditional === "failing" ? (p(v, y, !1), t.if((0, sn.not)(y), () => {
          e.reset(), d(v);
        })) : (p(v, y), a || t.if((0, sn.not)(y), () => t.break()));
      }
    }
    function p(v, y, g) {
      const E = {
        keyword: "additionalProperties",
        dataProp: v,
        dataPropType: ms.Type.Str
      };
      g === !1 && Object.assign(E, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(E, y);
    }
  }
};
Na.default = b$;
var yu = {};
Object.defineProperty(yu, "__esModule", { value: !0 });
const A$ = Zt, ed = ye, yc = Q, td = Na, T$ = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: n, parentSchema: r, data: i, it: o } = e;
    o.opts.removeAdditional === "all" && r.additionalProperties === void 0 && td.default.code(new A$.KeywordCxt(o, td.default, "additionalProperties"));
    const s = (0, ed.allSchemaProperties)(n);
    for (const f of s)
      o.definedProperties.add(f);
    o.opts.unevaluated && s.length && o.props !== !0 && (o.props = yc.mergeEvaluated.props(t, (0, yc.toHash)(s), o.props));
    const a = s.filter((f) => !(0, yc.alwaysValidSchema)(o, n[f]));
    if (a.length === 0)
      return;
    const c = t.name("valid");
    for (const f of a)
      u(f) ? l(f) : (t.if((0, ed.propertyInData)(t, i, f, o.opts.ownProperties)), l(f), o.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(f), e.ok(c);
    function u(f) {
      return o.opts.useDefaults && !o.compositeRule && n[f].default !== void 0;
    }
    function l(f) {
      e.subschema({
        keyword: "properties",
        schemaProp: f,
        dataProp: f
      }, c);
    }
  }
};
yu.default = T$;
var vu = {};
Object.defineProperty(vu, "__esModule", { value: !0 });
const nd = ye, gs = ue, rd = Q, id = Q, C$ = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: n, data: r, parentSchema: i, it: o } = e, { opts: s } = o, a = (0, nd.allSchemaProperties)(n), c = a.filter((p) => (0, rd.alwaysValidSchema)(o, n[p]));
    if (a.length === 0 || c.length === a.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const u = s.strictSchema && !s.allowMatchingProperties && i.properties, l = t.name("valid");
    o.props !== !0 && !(o.props instanceof gs.Name) && (o.props = (0, id.evaluatedPropsToName)(t, o.props));
    const { props: f } = o;
    h();
    function h() {
      for (const p of a)
        u && d(p), o.allErrors ? m(p) : (t.var(l, !0), m(p), t.if(l));
    }
    function d(p) {
      for (const v in u)
        new RegExp(p).test(v) && (0, rd.checkStrictMode)(o, `property ${v} matches pattern ${p} (use allowMatchingProperties)`);
    }
    function m(p) {
      t.forIn("key", r, (v) => {
        t.if((0, gs._)`${(0, nd.usePattern)(e, p)}.test(${v})`, () => {
          const y = c.includes(p);
          y || e.subschema({
            keyword: "patternProperties",
            schemaProp: p,
            dataProp: v,
            dataPropType: id.Type.Str
          }, l), o.opts.unevaluated && f !== !0 ? t.assign((0, gs._)`${f}[${v}]`, !0) : !y && !o.allErrors && t.if((0, gs.not)(l), () => t.break());
        });
      });
    }
  }
};
vu.default = C$;
var wu = {};
Object.defineProperty(wu, "__esModule", { value: !0 });
const N$ = Q, I$ = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: n, it: r } = e;
    if ((0, N$.alwaysValidSchema)(r, n)) {
      e.fail();
      return;
    }
    const i = t.name("valid");
    e.subschema({
      keyword: "not",
      compositeRule: !0,
      createErrors: !1,
      allErrors: !1
    }, i), e.failResult(i, () => e.reset(), () => e.error());
  },
  error: { message: "must NOT be valid" }
};
wu.default = I$;
var Eu = {};
Object.defineProperty(Eu, "__esModule", { value: !0 });
const P$ = ye, O$ = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: P$.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
Eu.default = O$;
var _u = {};
Object.defineProperty(_u, "__esModule", { value: !0 });
const zs = ue, R$ = Q, D$ = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, zs._)`{passingSchemas: ${e.passing}}`
}, F$ = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: D$,
  code(e) {
    const { gen: t, schema: n, parentSchema: r, it: i } = e;
    if (!Array.isArray(n))
      throw new Error("ajv implementation error");
    if (i.opts.discriminator && r.discriminator)
      return;
    const o = n, s = t.let("valid", !1), a = t.let("passing", null), c = t.name("_valid");
    e.setParams({ passing: a }), t.block(u), e.result(s, () => e.reset(), () => e.error(!0));
    function u() {
      o.forEach((l, f) => {
        let h;
        (0, R$.alwaysValidSchema)(i, l) ? t.var(c, !0) : h = e.subschema({
          keyword: "oneOf",
          schemaProp: f,
          compositeRule: !0
        }, c), f > 0 && t.if((0, zs._)`${c} && ${s}`).assign(s, !1).assign(a, (0, zs._)`[${a}, ${f}]`).else(), t.if(c, () => {
          t.assign(s, !0), t.assign(a, f), h && e.mergeEvaluated(h, zs.Name);
        });
      });
    }
  }
};
_u.default = F$;
var $u = {};
Object.defineProperty($u, "__esModule", { value: !0 });
const L$ = Q, x$ = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: n, it: r } = e;
    if (!Array.isArray(n))
      throw new Error("ajv implementation error");
    const i = t.name("valid");
    n.forEach((o, s) => {
      if ((0, L$.alwaysValidSchema)(r, o))
        return;
      const a = e.subschema({ keyword: "allOf", schemaProp: s }, i);
      e.ok(i), e.mergeEvaluated(a);
    });
  }
};
$u.default = x$;
var Su = {};
Object.defineProperty(Su, "__esModule", { value: !0 });
const ta = ue, Fm = Q, k$ = {
  message: ({ params: e }) => (0, ta.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, ta._)`{failingKeyword: ${e.ifClause}}`
}, U$ = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: k$,
  code(e) {
    const { gen: t, parentSchema: n, it: r } = e;
    n.then === void 0 && n.else === void 0 && (0, Fm.checkStrictMode)(r, '"if" without "then" and "else" is ignored');
    const i = od(r, "then"), o = od(r, "else");
    if (!i && !o)
      return;
    const s = t.let("valid", !0), a = t.name("_valid");
    if (c(), e.reset(), i && o) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(a, u("then", l), u("else", l));
    } else i ? t.if(a, u("then")) : t.if((0, ta.not)(a), u("else"));
    e.pass(s, () => e.error(!0));
    function c() {
      const l = e.subschema({
        keyword: "if",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, a);
      e.mergeEvaluated(l);
    }
    function u(l, f) {
      return () => {
        const h = e.subschema({ keyword: l }, a);
        t.assign(s, a), e.mergeValidEvaluated(h, s), f ? t.assign(f, (0, ta._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function od(e, t) {
  const n = e.schema[t];
  return n !== void 0 && !(0, Fm.alwaysValidSchema)(e, n);
}
Su.default = U$;
var bu = {};
Object.defineProperty(bu, "__esModule", { value: !0 });
const j$ = Q, M$ = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: n }) {
    t.if === void 0 && (0, j$.checkStrictMode)(n, `"${e}" without "if" is ignored`);
  }
};
bu.default = M$;
Object.defineProperty(Ta, "__esModule", { value: !0 });
const B$ = Di, H$ = hu, q$ = Fi, z$ = pu, V$ = mu, G$ = Ca, W$ = gu, K$ = Na, J$ = yu, Y$ = vu, X$ = wu, Z$ = Eu, Q$ = _u, eS = $u, tS = Su, nS = bu;
function rS(e = !1) {
  const t = [
    // any
    X$.default,
    Z$.default,
    Q$.default,
    eS.default,
    tS.default,
    nS.default,
    // object
    W$.default,
    K$.default,
    G$.default,
    J$.default,
    Y$.default
  ];
  return e ? t.push(H$.default, z$.default) : t.push(B$.default, q$.default), t.push(V$.default), t;
}
Ta.default = rS;
var Au = {}, Li = {};
Object.defineProperty(Li, "__esModule", { value: !0 });
Li.dynamicAnchor = void 0;
const vc = ue, iS = Gt, sd = Ct, oS = xn, sS = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => Lm(e, e.schema)
};
function Lm(e, t) {
  const { gen: n, it: r } = e;
  r.schemaEnv.root.dynamicAnchors[t] = !0;
  const i = (0, vc._)`${iS.default.dynamicAnchors}${(0, vc.getProperty)(t)}`, o = r.errSchemaPath === "#" ? r.validateName : aS(e);
  n.if((0, vc._)`!${i}`, () => n.assign(i, o));
}
Li.dynamicAnchor = Lm;
function aS(e) {
  const { schemaEnv: t, schema: n, self: r } = e.it, { root: i, baseId: o, localRefs: s, meta: a } = t.root, { schemaId: c } = r.opts, u = new sd.SchemaEnv({ schema: n, schemaId: c, root: i, baseId: o, localRefs: s, meta: a });
  return sd.compileSchema.call(r, u), (0, oS.getValidate)(e, u);
}
Li.default = sS;
var xi = {};
Object.defineProperty(xi, "__esModule", { value: !0 });
xi.dynamicRef = void 0;
const ad = ue, cS = Gt, cd = xn, lS = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => xm(e, e.schema)
};
function xm(e, t) {
  const { gen: n, keyword: r, it: i } = e;
  if (t[0] !== "#")
    throw new Error(`"${r}" only supports hash fragment reference`);
  const o = t.slice(1);
  if (i.allErrors)
    s();
  else {
    const c = n.let("valid", !1);
    s(c), e.ok(c);
  }
  function s(c) {
    if (i.schemaEnv.root.dynamicAnchors[o]) {
      const u = n.let("_v", (0, ad._)`${cS.default.dynamicAnchors}${(0, ad.getProperty)(o)}`);
      n.if(u, a(u, c), a(i.validateName, c));
    } else
      a(i.validateName, c)();
  }
  function a(c, u) {
    return u ? () => n.block(() => {
      (0, cd.callRef)(e, c), n.let(u, !0);
    }) : () => (0, cd.callRef)(e, c);
  }
}
xi.dynamicRef = xm;
xi.default = lS;
var Tu = {};
Object.defineProperty(Tu, "__esModule", { value: !0 });
const uS = Li, fS = Q, dS = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, uS.dynamicAnchor)(e, "") : (0, fS.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
Tu.default = dS;
var Cu = {};
Object.defineProperty(Cu, "__esModule", { value: !0 });
const hS = xi, pS = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, hS.dynamicRef)(e, e.schema)
};
Cu.default = pS;
Object.defineProperty(Au, "__esModule", { value: !0 });
const mS = Li, gS = xi, yS = Tu, vS = Cu, wS = [mS.default, gS.default, yS.default, vS.default];
Au.default = wS;
var Nu = {}, Iu = {};
Object.defineProperty(Iu, "__esModule", { value: !0 });
const ld = Ca, ES = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: ld.error,
  code: (e) => (0, ld.validatePropertyDeps)(e)
};
Iu.default = ES;
var Pu = {};
Object.defineProperty(Pu, "__esModule", { value: !0 });
const _S = Ca, $S = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, _S.validateSchemaDeps)(e)
};
Pu.default = $S;
var Ou = {};
Object.defineProperty(Ou, "__esModule", { value: !0 });
const SS = Q, bS = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: n }) {
    t.contains === void 0 && (0, SS.checkStrictMode)(n, `"${e}" without "contains" is ignored`);
  }
};
Ou.default = bS;
Object.defineProperty(Nu, "__esModule", { value: !0 });
const AS = Iu, TS = Pu, CS = Ou, NS = [AS.default, TS.default, CS.default];
Nu.default = NS;
var Ru = {}, Du = {};
Object.defineProperty(Du, "__esModule", { value: !0 });
const Kn = ue, ud = Q, IS = Gt, PS = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, Kn._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, OS = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: PS,
  code(e) {
    const { gen: t, schema: n, data: r, errsCount: i, it: o } = e;
    if (!i)
      throw new Error("ajv implementation error");
    const { allErrors: s, props: a } = o;
    a instanceof Kn.Name ? t.if((0, Kn._)`${a} !== true`, () => t.forIn("key", r, (f) => t.if(u(a, f), () => c(f)))) : a !== !0 && t.forIn("key", r, (f) => a === void 0 ? c(f) : t.if(l(a, f), () => c(f))), o.props = !0, e.ok((0, Kn._)`${i} === ${IS.default.errors}`);
    function c(f) {
      if (n === !1) {
        e.setParams({ unevaluatedProperty: f }), e.error(), s || t.break();
        return;
      }
      if (!(0, ud.alwaysValidSchema)(o, n)) {
        const h = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: f,
          dataPropType: ud.Type.Str
        }, h), s || t.if((0, Kn.not)(h), () => t.break());
      }
    }
    function u(f, h) {
      return (0, Kn._)`!${f} || !${f}[${h}]`;
    }
    function l(f, h) {
      const d = [];
      for (const m in f)
        f[m] === !0 && d.push((0, Kn._)`${h} !== ${m}`);
      return (0, Kn.and)(...d);
    }
  }
};
Du.default = OS;
var Fu = {};
Object.defineProperty(Fu, "__esModule", { value: !0 });
const Dr = ue, fd = Q, RS = {
  message: ({ params: { len: e } }) => (0, Dr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Dr._)`{limit: ${e}}`
}, DS = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: RS,
  code(e) {
    const { gen: t, schema: n, data: r, it: i } = e, o = i.items || 0;
    if (o === !0)
      return;
    const s = t.const("len", (0, Dr._)`${r}.length`);
    if (n === !1)
      e.setParams({ len: o }), e.fail((0, Dr._)`${s} > ${o}`);
    else if (typeof n == "object" && !(0, fd.alwaysValidSchema)(i, n)) {
      const c = t.var("valid", (0, Dr._)`${s} <= ${o}`);
      t.if((0, Dr.not)(c), () => a(c, o)), e.ok(c);
    }
    i.items = !0;
    function a(c, u) {
      t.forRange("i", u, s, (l) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: fd.Type.Num }, c), i.allErrors || t.if((0, Dr.not)(c), () => t.break());
      });
    }
  }
};
Fu.default = DS;
Object.defineProperty(Ru, "__esModule", { value: !0 });
const FS = Du, LS = Fu, xS = [FS.default, LS.default];
Ru.default = xS;
var Ia = {}, Lu = {};
Object.defineProperty(Lu, "__esModule", { value: !0 });
const Ke = ue, kS = {
  message: ({ schemaCode: e }) => (0, Ke.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, Ke._)`{format: ${e}}`
}, US = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: kS,
  code(e, t) {
    const { gen: n, data: r, $data: i, schema: o, schemaCode: s, it: a } = e, { opts: c, errSchemaPath: u, schemaEnv: l, self: f } = a;
    if (!c.validateFormats)
      return;
    i ? h() : d();
    function h() {
      const m = n.scopeValue("formats", {
        ref: f.formats,
        code: c.code.formats
      }), p = n.const("fDef", (0, Ke._)`${m}[${s}]`), v = n.let("fType"), y = n.let("format");
      n.if((0, Ke._)`typeof ${p} == "object" && !(${p} instanceof RegExp)`, () => n.assign(v, (0, Ke._)`${p}.type || "string"`).assign(y, (0, Ke._)`${p}.validate`), () => n.assign(v, (0, Ke._)`"string"`).assign(y, p)), e.fail$data((0, Ke.or)(g(), E()));
      function g() {
        return c.strictSchema === !1 ? Ke.nil : (0, Ke._)`${s} && !${y}`;
      }
      function E() {
        const S = l.$async ? (0, Ke._)`(${p}.async ? await ${y}(${r}) : ${y}(${r}))` : (0, Ke._)`${y}(${r})`, C = (0, Ke._)`(typeof ${y} == "function" ? ${S} : ${y}.test(${r}))`;
        return (0, Ke._)`${y} && ${y} !== true && ${v} === ${t} && !${C}`;
      }
    }
    function d() {
      const m = f.formats[o];
      if (!m) {
        g();
        return;
      }
      if (m === !0)
        return;
      const [p, v, y] = E(m);
      p === t && e.pass(S());
      function g() {
        if (c.strictSchema === !1) {
          f.logger.warn(C());
          return;
        }
        throw new Error(C());
        function C() {
          return `unknown format "${o}" ignored in schema at path "${u}"`;
        }
      }
      function E(C) {
        const U = C instanceof RegExp ? (0, Ke.regexpCode)(C) : c.code.formats ? (0, Ke._)`${c.code.formats}${(0, Ke.getProperty)(o)}` : void 0, G = n.scopeValue("formats", { key: o, ref: C, code: U });
        return typeof C == "object" && !(C instanceof RegExp) ? [C.type || "string", C.validate, (0, Ke._)`${G}.validate`] : ["string", C, G];
      }
      function S() {
        if (typeof m == "object" && !(m instanceof RegExp) && m.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, Ke._)`await ${y}(${r})`;
        }
        return typeof v == "function" ? (0, Ke._)`${y}(${r})` : (0, Ke._)`${y}.test(${r})`;
      }
    }
  }
};
Lu.default = US;
Object.defineProperty(Ia, "__esModule", { value: !0 });
const jS = Lu, MS = [jS.default];
Ia.default = MS;
var Vr = {};
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.contentVocabulary = Vr.metadataVocabulary = void 0;
Vr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Vr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(eu, "__esModule", { value: !0 });
const BS = ba, HS = Aa, qS = Ta, zS = Au, VS = Nu, GS = Ru, WS = Ia, dd = Vr, KS = [
  zS.default,
  BS.default,
  HS.default,
  (0, qS.default)(!0),
  WS.default,
  dd.metadataVocabulary,
  dd.contentVocabulary,
  VS.default,
  GS.default
];
eu.default = KS;
var Pa = {}, Oa = {};
Object.defineProperty(Oa, "__esModule", { value: !0 });
Oa.DiscrError = void 0;
var hd;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(hd || (Oa.DiscrError = hd = {}));
Object.defineProperty(Pa, "__esModule", { value: !0 });
const ui = ue, pl = Oa, pd = Ct, JS = Kr, YS = Q, XS = {
  message: ({ params: { discrError: e, tagName: t } }) => e === pl.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: n } }) => (0, ui._)`{error: ${e}, tag: ${n}, tagValue: ${t}}`
}, ZS = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: XS,
  code(e) {
    const { gen: t, data: n, schema: r, parentSchema: i, it: o } = e, { oneOf: s } = i;
    if (!o.opts.discriminator)
      throw new Error("discriminator: requires discriminator option");
    const a = r.propertyName;
    if (typeof a != "string")
      throw new Error("discriminator: requires propertyName");
    if (r.mapping)
      throw new Error("discriminator: mapping is not supported");
    if (!s)
      throw new Error("discriminator: requires oneOf keyword");
    const c = t.let("valid", !1), u = t.const("tag", (0, ui._)`${n}${(0, ui.getProperty)(a)}`);
    t.if((0, ui._)`typeof ${u} == "string"`, () => l(), () => e.error(!1, { discrError: pl.DiscrError.Tag, tag: u, tagName: a })), e.ok(c);
    function l() {
      const d = h();
      t.if(!1);
      for (const m in d)
        t.elseIf((0, ui._)`${u} === ${m}`), t.assign(c, f(d[m]));
      t.else(), e.error(!1, { discrError: pl.DiscrError.Mapping, tag: u, tagName: a }), t.endIf();
    }
    function f(d) {
      const m = t.name("valid"), p = e.subschema({ keyword: "oneOf", schemaProp: d }, m);
      return e.mergeEvaluated(p, ui.Name), m;
    }
    function h() {
      var d;
      const m = {}, p = y(i);
      let v = !0;
      for (let S = 0; S < s.length; S++) {
        let C = s[S];
        if (C != null && C.$ref && !(0, YS.schemaHasRulesButRef)(C, o.self.RULES)) {
          const G = C.$ref;
          if (C = pd.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, G), C instanceof pd.SchemaEnv && (C = C.schema), C === void 0)
            throw new JS.default(o.opts.uriResolver, o.baseId, G);
        }
        const U = (d = C == null ? void 0 : C.properties) === null || d === void 0 ? void 0 : d[a];
        if (typeof U != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${a}"`);
        v = v && (p || y(C)), g(U, S);
      }
      if (!v)
        throw new Error(`discriminator: "${a}" must be required`);
      return m;
      function y({ required: S }) {
        return Array.isArray(S) && S.includes(a);
      }
      function g(S, C) {
        if (S.const)
          E(S.const, C);
        else if (S.enum)
          for (const U of S.enum)
            E(U, C);
        else
          throw new Error(`discriminator: "properties/${a}" must have "const" or "enum"`);
      }
      function E(S, C) {
        if (typeof S != "string" || S in m)
          throw new Error(`discriminator: "${a}" values must be unique strings`);
        m[S] = C;
      }
    }
  }
};
Pa.default = ZS;
var xu = {};
const QS = "https://json-schema.org/draft/2020-12/schema", eb = "https://json-schema.org/draft/2020-12/schema", tb = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, nb = "meta", rb = "Core and Validation specifications meta-schema", ib = [
  {
    $ref: "meta/core"
  },
  {
    $ref: "meta/applicator"
  },
  {
    $ref: "meta/unevaluated"
  },
  {
    $ref: "meta/validation"
  },
  {
    $ref: "meta/meta-data"
  },
  {
    $ref: "meta/format-annotation"
  },
  {
    $ref: "meta/content"
  }
], ob = [
  "object",
  "boolean"
], sb = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", ab = {
  definitions: {
    $comment: '"definitions" has been replaced by "$defs".',
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    deprecated: !0,
    default: {}
  },
  dependencies: {
    $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $dynamicRef: "#meta"
        },
        {
          $ref: "meta/validation#/$defs/stringArray"
        }
      ]
    },
    deprecated: !0,
    default: {}
  },
  $recursiveAnchor: {
    $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
    $ref: "meta/core#/$defs/anchorString",
    deprecated: !0
  },
  $recursiveRef: {
    $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
    $ref: "meta/core#/$defs/uriReferenceString",
    deprecated: !0
  }
}, cb = {
  $schema: QS,
  $id: eb,
  $vocabulary: tb,
  $dynamicAnchor: nb,
  title: rb,
  allOf: ib,
  type: ob,
  $comment: sb,
  properties: ab
}, lb = "https://json-schema.org/draft/2020-12/schema", ub = "https://json-schema.org/draft/2020-12/meta/applicator", fb = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, db = "meta", hb = "Applicator vocabulary meta-schema", pb = [
  "object",
  "boolean"
], mb = {
  prefixItems: {
    $ref: "#/$defs/schemaArray"
  },
  items: {
    $dynamicRef: "#meta"
  },
  contains: {
    $dynamicRef: "#meta"
  },
  additionalProperties: {
    $dynamicRef: "#meta"
  },
  properties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependentSchemas: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    },
    default: {}
  },
  propertyNames: {
    $dynamicRef: "#meta"
  },
  if: {
    $dynamicRef: "#meta"
  },
  then: {
    $dynamicRef: "#meta"
  },
  else: {
    $dynamicRef: "#meta"
  },
  allOf: {
    $ref: "#/$defs/schemaArray"
  },
  anyOf: {
    $ref: "#/$defs/schemaArray"
  },
  oneOf: {
    $ref: "#/$defs/schemaArray"
  },
  not: {
    $dynamicRef: "#meta"
  }
}, gb = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, yb = {
  $schema: lb,
  $id: ub,
  $vocabulary: fb,
  $dynamicAnchor: db,
  title: hb,
  type: pb,
  properties: mb,
  $defs: gb
}, vb = "https://json-schema.org/draft/2020-12/schema", wb = "https://json-schema.org/draft/2020-12/meta/unevaluated", Eb = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, _b = "meta", $b = "Unevaluated applicator vocabulary meta-schema", Sb = [
  "object",
  "boolean"
], bb = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, Ab = {
  $schema: vb,
  $id: wb,
  $vocabulary: Eb,
  $dynamicAnchor: _b,
  title: $b,
  type: Sb,
  properties: bb
}, Tb = "https://json-schema.org/draft/2020-12/schema", Cb = "https://json-schema.org/draft/2020-12/meta/content", Nb = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Ib = "meta", Pb = "Content vocabulary meta-schema", Ob = [
  "object",
  "boolean"
], Rb = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, Db = {
  $schema: Tb,
  $id: Cb,
  $vocabulary: Nb,
  $dynamicAnchor: Ib,
  title: Pb,
  type: Ob,
  properties: Rb
}, Fb = "https://json-schema.org/draft/2020-12/schema", Lb = "https://json-schema.org/draft/2020-12/meta/core", xb = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, kb = "meta", Ub = "Core vocabulary meta-schema", jb = [
  "object",
  "boolean"
], Mb = {
  $id: {
    $ref: "#/$defs/uriReferenceString",
    $comment: "Non-empty fragments not allowed.",
    pattern: "^[^#]*#?$"
  },
  $schema: {
    $ref: "#/$defs/uriString"
  },
  $ref: {
    $ref: "#/$defs/uriReferenceString"
  },
  $anchor: {
    $ref: "#/$defs/anchorString"
  },
  $dynamicRef: {
    $ref: "#/$defs/uriReferenceString"
  },
  $dynamicAnchor: {
    $ref: "#/$defs/anchorString"
  },
  $vocabulary: {
    type: "object",
    propertyNames: {
      $ref: "#/$defs/uriString"
    },
    additionalProperties: {
      type: "boolean"
    }
  },
  $comment: {
    type: "string"
  },
  $defs: {
    type: "object",
    additionalProperties: {
      $dynamicRef: "#meta"
    }
  }
}, Bb = {
  anchorString: {
    type: "string",
    pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
  },
  uriString: {
    type: "string",
    format: "uri"
  },
  uriReferenceString: {
    type: "string",
    format: "uri-reference"
  }
}, Hb = {
  $schema: Fb,
  $id: Lb,
  $vocabulary: xb,
  $dynamicAnchor: kb,
  title: Ub,
  type: jb,
  properties: Mb,
  $defs: Bb
}, qb = "https://json-schema.org/draft/2020-12/schema", zb = "https://json-schema.org/draft/2020-12/meta/format-annotation", Vb = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, Gb = "meta", Wb = "Format vocabulary meta-schema for annotation results", Kb = [
  "object",
  "boolean"
], Jb = {
  format: {
    type: "string"
  }
}, Yb = {
  $schema: qb,
  $id: zb,
  $vocabulary: Vb,
  $dynamicAnchor: Gb,
  title: Wb,
  type: Kb,
  properties: Jb
}, Xb = "https://json-schema.org/draft/2020-12/schema", Zb = "https://json-schema.org/draft/2020-12/meta/meta-data", Qb = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, eA = "meta", tA = "Meta-data vocabulary meta-schema", nA = [
  "object",
  "boolean"
], rA = {
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  deprecated: {
    type: "boolean",
    default: !1
  },
  readOnly: {
    type: "boolean",
    default: !1
  },
  writeOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  }
}, iA = {
  $schema: Xb,
  $id: Zb,
  $vocabulary: Qb,
  $dynamicAnchor: eA,
  title: tA,
  type: nA,
  properties: rA
}, oA = "https://json-schema.org/draft/2020-12/schema", sA = "https://json-schema.org/draft/2020-12/meta/validation", aA = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, cA = "meta", lA = "Validation vocabulary meta-schema", uA = [
  "object",
  "boolean"
], fA = {
  type: {
    anyOf: [
      {
        $ref: "#/$defs/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/$defs/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  const: !0,
  enum: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  maxItems: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  maxContains: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minContains: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 1
  },
  maxProperties: {
    $ref: "#/$defs/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/$defs/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/$defs/stringArray"
  },
  dependentRequired: {
    type: "object",
    additionalProperties: {
      $ref: "#/$defs/stringArray"
    }
  }
}, dA = {
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    $ref: "#/$defs/nonNegativeInteger",
    default: 0
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, hA = {
  $schema: oA,
  $id: sA,
  $vocabulary: aA,
  $dynamicAnchor: cA,
  title: lA,
  type: uA,
  properties: fA,
  $defs: dA
};
Object.defineProperty(xu, "__esModule", { value: !0 });
const pA = cb, mA = yb, gA = Ab, yA = Db, vA = Hb, wA = Yb, EA = iA, _A = hA, $A = ["/properties"];
function SA(e) {
  return [
    pA,
    mA,
    gA,
    yA,
    vA,
    t(this, wA),
    EA,
    t(this, _A)
  ].forEach((n) => this.addMetaSchema(n, void 0, !1)), this;
  function t(n, r) {
    return e ? n.$dataMetaSchema(r, $A) : r;
  }
}
xu.default = SA;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const n = Ml, r = eu, i = Pa, o = xu, s = "https://json-schema.org/draft/2020-12/schema";
  class a extends n.default {
    constructor(d = {}) {
      super({
        ...d,
        dynamicRef: !0,
        next: !0,
        unevaluated: !0
      });
    }
    _addVocabularies() {
      super._addVocabularies(), r.default.forEach((d) => this.addVocabulary(d)), this.opts.discriminator && this.addKeyword(i.default);
    }
    _addDefaultMetaSchema() {
      super._addDefaultMetaSchema();
      const { $data: d, meta: m } = this.opts;
      m && (o.default.call(this, d), this.refs["http://json-schema.org/schema"] = s);
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(s) ? s : void 0);
    }
  }
  t.Ajv2020 = a, e.exports = t = a, e.exports.Ajv2020 = a, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = a;
  var c = Zt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var u = ue;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return u._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return u.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return u.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return u.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return u.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return u.CodeGen;
  } });
  var l = Ri;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return l.default;
  } });
  var f = Kr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return f.default;
  } });
})(al, al.exports);
var bA = al.exports, ml = { exports: {} }, km = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(B, V) {
    return { validate: B, compare: V };
  }
  e.fullFormats = {
    // date: http://tools.ietf.org/html/rfc3339#section-5.6
    date: t(o, s),
    // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
    time: t(c(!0), u),
    "date-time": t(h(!0), d),
    "iso-time": t(c(), l),
    "iso-date-time": t(h(), m),
    // duration: https://tools.ietf.org/html/rfc3339#appendix-A
    duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
    uri: y,
    "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
    // uri-template: https://tools.ietf.org/html/rfc6570
    "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
    // For the source: https://gist.github.com/dperini/729294
    // For test cases: https://mathiasbynens.be/demo/url-regex
    url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
    email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
    // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
    ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
    ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
    regex: b,
    // uuid: http://tools.ietf.org/html/rfc4122
    uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
    // JSON-pointer: https://tools.ietf.org/html/rfc6901
    // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
    "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
    "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
    // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
    "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
    // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
    // byte: https://github.com/miguelmota/is-base64
    byte: E,
    // signed 32 bit integer
    int32: { type: "number", validate: U },
    // signed 64 bit integer
    int64: { type: "number", validate: G },
    // C-type float
    float: { type: "number", validate: z },
    // C-type double
    double: { type: "number", validate: z },
    // hint to the UI to hide input strings
    password: !0,
    // unchecked string payload
    binary: !0
  }, e.fastFormats = {
    ...e.fullFormats,
    date: t(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, s),
    time: t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, u),
    "date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, d),
    "iso-time": t(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, l),
    "iso-date-time": t(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, m),
    // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
    uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
    "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
    // email (sources from jsen validator):
    // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
    // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
    email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
  }, e.formatNames = Object.keys(e.fullFormats);
  function n(B) {
    return B % 4 === 0 && (B % 100 !== 0 || B % 400 === 0);
  }
  const r = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, i = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function o(B) {
    const V = r.exec(B);
    if (!V)
      return !1;
    const Z = +V[1], F = +V[2], x = +V[3];
    return F >= 1 && F <= 12 && x >= 1 && x <= (F === 2 && n(Z) ? 29 : i[F]);
  }
  function s(B, V) {
    if (B && V)
      return B > V ? 1 : B < V ? -1 : 0;
  }
  const a = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(B) {
    return function(Z) {
      const F = a.exec(Z);
      if (!F)
        return !1;
      const x = +F[1], W = +F[2], q = +F[3], Y = F[4], J = F[5] === "-" ? -1 : 1, j = +(F[6] || 0), N = +(F[7] || 0);
      if (j > 23 || N > 59 || B && !Y)
        return !1;
      if (x <= 23 && W <= 59 && q < 60)
        return !0;
      const R = W - N * J, O = x - j * J - (R < 0 ? 1 : 0);
      return (O === 23 || O === -1) && (R === 59 || R === -1) && q < 61;
    };
  }
  function u(B, V) {
    if (!(B && V))
      return;
    const Z = (/* @__PURE__ */ new Date("2020-01-01T" + B)).valueOf(), F = (/* @__PURE__ */ new Date("2020-01-01T" + V)).valueOf();
    if (Z && F)
      return Z - F;
  }
  function l(B, V) {
    if (!(B && V))
      return;
    const Z = a.exec(B), F = a.exec(V);
    if (Z && F)
      return B = Z[1] + Z[2] + Z[3], V = F[1] + F[2] + F[3], B > V ? 1 : B < V ? -1 : 0;
  }
  const f = /t|\s/i;
  function h(B) {
    const V = c(B);
    return function(F) {
      const x = F.split(f);
      return x.length === 2 && o(x[0]) && V(x[1]);
    };
  }
  function d(B, V) {
    if (!(B && V))
      return;
    const Z = new Date(B).valueOf(), F = new Date(V).valueOf();
    if (Z && F)
      return Z - F;
  }
  function m(B, V) {
    if (!(B && V))
      return;
    const [Z, F] = B.split(f), [x, W] = V.split(f), q = s(Z, x);
    if (q !== void 0)
      return q || u(F, W);
  }
  const p = /\/|:/, v = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function y(B) {
    return p.test(B) && v.test(B);
  }
  const g = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function E(B) {
    return g.lastIndex = 0, g.test(B);
  }
  const S = -2147483648, C = 2 ** 31 - 1;
  function U(B) {
    return Number.isInteger(B) && B <= C && B >= S;
  }
  function G(B) {
    return Number.isInteger(B);
  }
  function z() {
    return !0;
  }
  const H = /[^\\]\\Z/;
  function b(B) {
    if (H.test(B))
      return !1;
    try {
      return new RegExp(B), !0;
    } catch {
      return !1;
    }
  }
})(km);
var Um = {}, gl = { exports: {} }, ku = {};
Object.defineProperty(ku, "__esModule", { value: !0 });
const AA = ba, TA = Aa, CA = Ta, NA = Ia, md = Vr, IA = [
  AA.default,
  TA.default,
  (0, CA.default)(),
  NA.default,
  md.metadataVocabulary,
  md.contentVocabulary
];
ku.default = IA;
const PA = "http://json-schema.org/draft-07/schema#", OA = "http://json-schema.org/draft-07/schema#", RA = "Core schema meta-schema", DA = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $ref: "#"
    }
  },
  nonNegativeInteger: {
    type: "integer",
    minimum: 0
  },
  nonNegativeIntegerDefault0: {
    allOf: [
      {
        $ref: "#/definitions/nonNegativeInteger"
      },
      {
        default: 0
      }
    ]
  },
  simpleTypes: {
    enum: [
      "array",
      "boolean",
      "integer",
      "null",
      "number",
      "object",
      "string"
    ]
  },
  stringArray: {
    type: "array",
    items: {
      type: "string"
    },
    uniqueItems: !0,
    default: []
  }
}, FA = [
  "object",
  "boolean"
], LA = {
  $id: {
    type: "string",
    format: "uri-reference"
  },
  $schema: {
    type: "string",
    format: "uri"
  },
  $ref: {
    type: "string",
    format: "uri-reference"
  },
  $comment: {
    type: "string"
  },
  title: {
    type: "string"
  },
  description: {
    type: "string"
  },
  default: !0,
  readOnly: {
    type: "boolean",
    default: !1
  },
  examples: {
    type: "array",
    items: !0
  },
  multipleOf: {
    type: "number",
    exclusiveMinimum: 0
  },
  maximum: {
    type: "number"
  },
  exclusiveMaximum: {
    type: "number"
  },
  minimum: {
    type: "number"
  },
  exclusiveMinimum: {
    type: "number"
  },
  maxLength: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minLength: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  pattern: {
    type: "string",
    format: "regex"
  },
  additionalItems: {
    $ref: "#"
  },
  items: {
    anyOf: [
      {
        $ref: "#"
      },
      {
        $ref: "#/definitions/schemaArray"
      }
    ],
    default: !0
  },
  maxItems: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minItems: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  uniqueItems: {
    type: "boolean",
    default: !1
  },
  contains: {
    $ref: "#"
  },
  maxProperties: {
    $ref: "#/definitions/nonNegativeInteger"
  },
  minProperties: {
    $ref: "#/definitions/nonNegativeIntegerDefault0"
  },
  required: {
    $ref: "#/definitions/stringArray"
  },
  additionalProperties: {
    $ref: "#"
  },
  definitions: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  properties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    default: {}
  },
  patternProperties: {
    type: "object",
    additionalProperties: {
      $ref: "#"
    },
    propertyNames: {
      format: "regex"
    },
    default: {}
  },
  dependencies: {
    type: "object",
    additionalProperties: {
      anyOf: [
        {
          $ref: "#"
        },
        {
          $ref: "#/definitions/stringArray"
        }
      ]
    }
  },
  propertyNames: {
    $ref: "#"
  },
  const: !0,
  enum: {
    type: "array",
    items: !0,
    minItems: 1,
    uniqueItems: !0
  },
  type: {
    anyOf: [
      {
        $ref: "#/definitions/simpleTypes"
      },
      {
        type: "array",
        items: {
          $ref: "#/definitions/simpleTypes"
        },
        minItems: 1,
        uniqueItems: !0
      }
    ]
  },
  format: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentEncoding: {
    type: "string"
  },
  if: {
    $ref: "#"
  },
  then: {
    $ref: "#"
  },
  else: {
    $ref: "#"
  },
  allOf: {
    $ref: "#/definitions/schemaArray"
  },
  anyOf: {
    $ref: "#/definitions/schemaArray"
  },
  oneOf: {
    $ref: "#/definitions/schemaArray"
  },
  not: {
    $ref: "#"
  }
}, xA = {
  $schema: PA,
  $id: OA,
  title: RA,
  definitions: DA,
  type: FA,
  properties: LA,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const n = Ml, r = ku, i = Pa, o = xA, s = ["/properties"], a = "http://json-schema.org/draft-07/schema";
  class c extends n.default {
    _addVocabularies() {
      super._addVocabularies(), r.default.forEach((m) => this.addVocabulary(m)), this.opts.discriminator && this.addKeyword(i.default);
    }
    _addDefaultMetaSchema() {
      if (super._addDefaultMetaSchema(), !this.opts.meta)
        return;
      const m = this.opts.$data ? this.$dataMetaSchema(o, s) : o;
      this.addMetaSchema(m, a, !1), this.refs["http://json-schema.org/schema"] = a;
    }
    defaultMeta() {
      return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(a) ? a : void 0);
    }
  }
  t.Ajv = c, e.exports = t = c, e.exports.Ajv = c, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = c;
  var u = Zt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return u.KeywordCxt;
  } });
  var l = ue;
  Object.defineProperty(t, "_", { enumerable: !0, get: function() {
    return l._;
  } }), Object.defineProperty(t, "str", { enumerable: !0, get: function() {
    return l.str;
  } }), Object.defineProperty(t, "stringify", { enumerable: !0, get: function() {
    return l.stringify;
  } }), Object.defineProperty(t, "nil", { enumerable: !0, get: function() {
    return l.nil;
  } }), Object.defineProperty(t, "Name", { enumerable: !0, get: function() {
    return l.Name;
  } }), Object.defineProperty(t, "CodeGen", { enumerable: !0, get: function() {
    return l.CodeGen;
  } });
  var f = Ri;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return f.default;
  } });
  var h = Kr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(gl, gl.exports);
var kA = gl.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = kA, n = ue, r = n.operators, i = {
    formatMaximum: { okStr: "<=", ok: r.LTE, fail: r.GT },
    formatMinimum: { okStr: ">=", ok: r.GTE, fail: r.LT },
    formatExclusiveMaximum: { okStr: "<", ok: r.LT, fail: r.GTE },
    formatExclusiveMinimum: { okStr: ">", ok: r.GT, fail: r.LTE }
  }, o = {
    message: ({ keyword: a, schemaCode: c }) => (0, n.str)`should be ${i[a].okStr} ${c}`,
    params: ({ keyword: a, schemaCode: c }) => (0, n._)`{comparison: ${i[a].okStr}, limit: ${c}}`
  };
  e.formatLimitDefinition = {
    keyword: Object.keys(i),
    type: "string",
    schemaType: "string",
    $data: !0,
    error: o,
    code(a) {
      const { gen: c, data: u, schemaCode: l, keyword: f, it: h } = a, { opts: d, self: m } = h;
      if (!d.validateFormats)
        return;
      const p = new t.KeywordCxt(h, m.RULES.all.format.definition, "format");
      p.$data ? v() : y();
      function v() {
        const E = c.scopeValue("formats", {
          ref: m.formats,
          code: d.code.formats
        }), S = c.const("fmt", (0, n._)`${E}[${p.schemaCode}]`);
        a.fail$data((0, n.or)((0, n._)`typeof ${S} != "object"`, (0, n._)`${S} instanceof RegExp`, (0, n._)`typeof ${S}.compare != "function"`, g(S)));
      }
      function y() {
        const E = p.schema, S = m.formats[E];
        if (!S || S === !0)
          return;
        if (typeof S != "object" || S instanceof RegExp || typeof S.compare != "function")
          throw new Error(`"${f}": format "${E}" does not define "compare" function`);
        const C = c.scopeValue("formats", {
          key: E,
          ref: S,
          code: d.code.formats ? (0, n._)`${d.code.formats}${(0, n.getProperty)(E)}` : void 0
        });
        a.fail$data(g(C));
      }
      function g(E) {
        return (0, n._)`${E}.compare(${u}, ${l}) ${i[f].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const s = (a) => (a.addKeyword(e.formatLimitDefinition), a);
  e.default = s;
})(Um);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const n = km, r = Um, i = ue, o = new i.Name("fullFormats"), s = new i.Name("fastFormats"), a = (u, l = { keywords: !0 }) => {
    if (Array.isArray(l))
      return c(u, l, n.fullFormats, o), u;
    const [f, h] = l.mode === "fast" ? [n.fastFormats, s] : [n.fullFormats, o], d = l.formats || n.formatNames;
    return c(u, d, f, h), l.keywords && (0, r.default)(u), u;
  };
  a.get = (u, l = "full") => {
    const h = (l === "fast" ? n.fastFormats : n.fullFormats)[u];
    if (!h)
      throw new Error(`Unknown format "${u}"`);
    return h;
  };
  function c(u, l, f, h) {
    var d, m;
    (d = (m = u.opts.code).formats) !== null && d !== void 0 || (m.formats = (0, i._)`require("ajv-formats/dist/formats").${h}`);
    for (const p of l)
      u.addFormat(p, f[p]);
  }
  e.exports = t = a, Object.defineProperty(t, "__esModule", { value: !0 }), t.default = a;
})(ml, ml.exports);
var UA = ml.exports;
const jA = /* @__PURE__ */ jl(UA), MA = (e, t, n, r) => {
  if (n === "length" || n === "prototype" || n === "arguments" || n === "caller")
    return;
  const i = Object.getOwnPropertyDescriptor(e, n), o = Object.getOwnPropertyDescriptor(t, n);
  !BA(i, o) && r || Object.defineProperty(e, n, o);
}, BA = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, HA = (e, t) => {
  const n = Object.getPrototypeOf(t);
  n !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, n);
}, qA = (e, t) => `/* Wrapped ${e}*/
${t}`, zA = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), VA = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), GA = (e, t, n) => {
  const r = n === "" ? "" : `with ${n.trim()}() `, i = qA.bind(null, r, t.toString());
  Object.defineProperty(i, "name", VA);
  const { writable: o, enumerable: s, configurable: a } = zA;
  Object.defineProperty(e, "toString", { value: i, writable: o, enumerable: s, configurable: a });
};
function WA(e, t, { ignoreNonConfigurable: n = !1 } = {}) {
  const { name: r } = e;
  for (const i of Reflect.ownKeys(t))
    MA(e, t, i, n);
  return HA(e, t), GA(e, t, r), e;
}
const gd = (e, t = {}) => {
  if (typeof e != "function")
    throw new TypeError(`Expected the first argument to be a function, got \`${typeof e}\``);
  const {
    wait: n = 0,
    maxWait: r = Number.POSITIVE_INFINITY,
    before: i = !1,
    after: o = !0
  } = t;
  if (n < 0 || r < 0)
    throw new RangeError("`wait` and `maxWait` must not be negative.");
  if (!i && !o)
    throw new Error("Both `before` and `after` are false, function wouldn't be called.");
  let s, a, c;
  const u = function(...l) {
    const f = this, h = () => {
      s = void 0, a && (clearTimeout(a), a = void 0), o && (c = e.apply(f, l));
    }, d = () => {
      a = void 0, s && (clearTimeout(s), s = void 0), o && (c = e.apply(f, l));
    }, m = i && !s;
    return clearTimeout(s), s = setTimeout(h, n), r > 0 && r !== Number.POSITIVE_INFINITY && !a && (a = setTimeout(d, r)), m && (c = e.apply(f, l)), c;
  };
  return WA(u, e), u.cancel = () => {
    s && (clearTimeout(s), s = void 0), a && (clearTimeout(a), a = void 0);
  }, u;
};
var yl = { exports: {} };
const KA = "2.0.0", jm = 256, JA = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, YA = 16, XA = jm - 6, ZA = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Ra = {
  MAX_LENGTH: jm,
  MAX_SAFE_COMPONENT_LENGTH: YA,
  MAX_SAFE_BUILD_LENGTH: XA,
  MAX_SAFE_INTEGER: JA,
  RELEASE_TYPES: ZA,
  SEMVER_SPEC_VERSION: KA,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const QA = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Da = QA;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: r,
    MAX_LENGTH: i
  } = Ra, o = Da;
  t = e.exports = {};
  const s = t.re = [], a = t.safeRe = [], c = t.src = [], u = t.safeSrc = [], l = t.t = {};
  let f = 0;
  const h = "[a-zA-Z0-9-]", d = [
    ["\\s", 1],
    ["\\d", i],
    [h, r]
  ], m = (v) => {
    for (const [y, g] of d)
      v = v.split(`${y}*`).join(`${y}{0,${g}}`).split(`${y}+`).join(`${y}{1,${g}}`);
    return v;
  }, p = (v, y, g) => {
    const E = m(y), S = f++;
    o(v, S, y), l[v] = S, c[S] = y, u[S] = E, s[S] = new RegExp(y, g ? "g" : void 0), a[S] = new RegExp(E, g ? "g" : void 0);
  };
  p("NUMERICIDENTIFIER", "0|[1-9]\\d*"), p("NUMERICIDENTIFIERLOOSE", "\\d+"), p("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), p("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), p("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), p("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), p("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), p("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), p("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), p("BUILDIDENTIFIER", `${h}+`), p("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), p("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), p("FULL", `^${c[l.FULLPLAIN]}$`), p("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), p("LOOSE", `^${c[l.LOOSEPLAIN]}$`), p("GTLT", "((?:<|>)?=?)"), p("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), p("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), p("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), p("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), p("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), p("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), p("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), p("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), p("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), p("COERCERTL", c[l.COERCE], !0), p("COERCERTLFULL", c[l.COERCEFULL], !0), p("LONETILDE", "(?:~>?)"), p("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", p("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), p("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), p("LONECARET", "(?:\\^)"), p("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", p("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), p("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), p("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), p("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), p("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", p("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), p("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), p("STAR", "(<|>)?=?\\s*\\*"), p("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), p("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(yl, yl.exports);
var qo = yl.exports;
const eT = Object.freeze({ loose: !0 }), tT = Object.freeze({}), nT = (e) => e ? typeof e != "object" ? eT : e : tT;
var Uu = nT;
const yd = /^[0-9]+$/, Mm = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const n = yd.test(e), r = yd.test(t);
  return n && r && (e = +e, t = +t), e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}, rT = (e, t) => Mm(t, e);
var Bm = {
  compareIdentifiers: Mm,
  rcompareIdentifiers: rT
};
const ys = Da, { MAX_LENGTH: vd, MAX_SAFE_INTEGER: vs } = Ra, { safeRe: ws, t: Es } = qo, iT = Uu, { compareIdentifiers: wc } = Bm;
let oT = class mn {
  constructor(t, n) {
    if (n = iT(n), t instanceof mn) {
      if (t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > vd)
      throw new TypeError(
        `version is longer than ${vd} characters`
      );
    ys("SemVer", t, n), this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease;
    const r = t.trim().match(n.loose ? ws[Es.LOOSE] : ws[Es.FULL]);
    if (!r)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > vs || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > vs || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > vs || this.patch < 0)
      throw new TypeError("Invalid patch version");
    r[4] ? this.prerelease = r[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < vs)
          return o;
      }
      return i;
    }) : this.prerelease = [], this.build = r[5] ? r[5].split(".") : [], this.format();
  }
  format() {
    return this.version = `${this.major}.${this.minor}.${this.patch}`, this.prerelease.length && (this.version += `-${this.prerelease.join(".")}`), this.version;
  }
  toString() {
    return this.version;
  }
  compare(t) {
    if (ys("SemVer.compare", this.version, this.options, t), !(t instanceof mn)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new mn(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof mn || (t = new mn(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof mn || (t = new mn(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let n = 0;
    do {
      const r = this.prerelease[n], i = t.prerelease[n];
      if (ys("prerelease compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return wc(r, i);
    } while (++n);
  }
  compareBuild(t) {
    t instanceof mn || (t = new mn(t, this.options));
    let n = 0;
    do {
      const r = this.build[n], i = t.build[n];
      if (ys("build compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return wc(r, i);
    } while (++n);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, n, r) {
    if (t.startsWith("pre")) {
      if (!n && r === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (n) {
        const i = `-${n}`.match(this.options.loose ? ws[Es.PRERELEASELOOSE] : ws[Es.PRERELEASE]);
        if (!i || i[1] !== n)
          throw new Error(`invalid identifier: ${n}`);
      }
    }
    switch (t) {
      case "premajor":
        this.prerelease.length = 0, this.patch = 0, this.minor = 0, this.major++, this.inc("pre", n, r);
        break;
      case "preminor":
        this.prerelease.length = 0, this.patch = 0, this.minor++, this.inc("pre", n, r);
        break;
      case "prepatch":
        this.prerelease.length = 0, this.inc("patch", n, r), this.inc("pre", n, r);
        break;
      case "prerelease":
        this.prerelease.length === 0 && this.inc("patch", n, r), this.inc("pre", n, r);
        break;
      case "release":
        if (this.prerelease.length === 0)
          throw new Error(`version ${this.raw} is not a prerelease`);
        this.prerelease.length = 0;
        break;
      case "major":
        (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) && this.major++, this.minor = 0, this.patch = 0, this.prerelease = [];
        break;
      case "minor":
        (this.patch !== 0 || this.prerelease.length === 0) && this.minor++, this.patch = 0, this.prerelease = [];
        break;
      case "patch":
        this.prerelease.length === 0 && this.patch++, this.prerelease = [];
        break;
      case "pre": {
        const i = Number(r) ? 1 : 0;
        if (this.prerelease.length === 0)
          this.prerelease = [i];
        else {
          let o = this.prerelease.length;
          for (; --o >= 0; )
            typeof this.prerelease[o] == "number" && (this.prerelease[o]++, o = -2);
          if (o === -1) {
            if (n === this.prerelease.join(".") && r === !1)
              throw new Error("invalid increment argument: identifier already exists");
            this.prerelease.push(i);
          }
        }
        if (n) {
          let o = [n, i];
          r === !1 && (o = [n]), wc(this.prerelease[0], n) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Ot = oT;
const wd = Ot, sT = (e, t, n = !1) => {
  if (e instanceof wd)
    return e;
  try {
    return new wd(e, t);
  } catch (r) {
    if (!n)
      return null;
    throw r;
  }
};
var ki = sT;
const aT = ki, cT = (e, t) => {
  const n = aT(e, t);
  return n ? n.version : null;
};
var lT = cT;
const uT = ki, fT = (e, t) => {
  const n = uT(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
var dT = fT;
const Ed = Ot, hT = (e, t, n, r, i) => {
  typeof n == "string" && (i = r, r = n, n = void 0);
  try {
    return new Ed(
      e instanceof Ed ? e.version : e,
      n
    ).inc(t, r, i).version;
  } catch {
    return null;
  }
};
var pT = hT;
const _d = ki, mT = (e, t) => {
  const n = _d(e, null, !0), r = _d(t, null, !0), i = n.compare(r);
  if (i === 0)
    return null;
  const o = i > 0, s = o ? n : r, a = o ? r : n, c = !!s.prerelease.length;
  if (!!a.prerelease.length && !c) {
    if (!a.patch && !a.minor)
      return "major";
    if (a.compareMain(s) === 0)
      return a.minor && !a.patch ? "minor" : "patch";
  }
  const l = c ? "pre" : "";
  return n.major !== r.major ? l + "major" : n.minor !== r.minor ? l + "minor" : n.patch !== r.patch ? l + "patch" : "prerelease";
};
var gT = mT;
const yT = Ot, vT = (e, t) => new yT(e, t).major;
var wT = vT;
const ET = Ot, _T = (e, t) => new ET(e, t).minor;
var $T = _T;
const ST = Ot, bT = (e, t) => new ST(e, t).patch;
var AT = bT;
const TT = ki, CT = (e, t) => {
  const n = TT(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
var NT = CT;
const $d = Ot, IT = (e, t, n) => new $d(e, n).compare(new $d(t, n));
var un = IT;
const PT = un, OT = (e, t, n) => PT(t, e, n);
var RT = OT;
const DT = un, FT = (e, t) => DT(e, t, !0);
var LT = FT;
const Sd = Ot, xT = (e, t, n) => {
  const r = new Sd(e, n), i = new Sd(t, n);
  return r.compare(i) || r.compareBuild(i);
};
var ju = xT;
const kT = ju, UT = (e, t) => e.sort((n, r) => kT(n, r, t));
var jT = UT;
const MT = ju, BT = (e, t) => e.sort((n, r) => MT(r, n, t));
var HT = BT;
const qT = un, zT = (e, t, n) => qT(e, t, n) > 0;
var Fa = zT;
const VT = un, GT = (e, t, n) => VT(e, t, n) < 0;
var Mu = GT;
const WT = un, KT = (e, t, n) => WT(e, t, n) === 0;
var Hm = KT;
const JT = un, YT = (e, t, n) => JT(e, t, n) !== 0;
var qm = YT;
const XT = un, ZT = (e, t, n) => XT(e, t, n) >= 0;
var Bu = ZT;
const QT = un, eC = (e, t, n) => QT(e, t, n) <= 0;
var Hu = eC;
const tC = Hm, nC = qm, rC = Fa, iC = Bu, oC = Mu, sC = Hu, aC = (e, t, n, r) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e === n;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e !== n;
    case "":
    case "=":
    case "==":
      return tC(e, n, r);
    case "!=":
      return nC(e, n, r);
    case ">":
      return rC(e, n, r);
    case ">=":
      return iC(e, n, r);
    case "<":
      return oC(e, n, r);
    case "<=":
      return sC(e, n, r);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var zm = aC;
const cC = Ot, lC = ki, { safeRe: _s, t: $s } = qo, uC = (e, t) => {
  if (e instanceof cC)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let n = null;
  if (!t.rtl)
    n = e.match(t.includePrerelease ? _s[$s.COERCEFULL] : _s[$s.COERCE]);
  else {
    const c = t.includePrerelease ? _s[$s.COERCERTLFULL] : _s[$s.COERCERTL];
    let u;
    for (; (u = c.exec(e)) && (!n || n.index + n[0].length !== e.length); )
      (!n || u.index + u[0].length !== n.index + n[0].length) && (n = u), c.lastIndex = u.index + u[1].length + u[2].length;
    c.lastIndex = -1;
  }
  if (n === null)
    return null;
  const r = n[2], i = n[3] || "0", o = n[4] || "0", s = t.includePrerelease && n[5] ? `-${n[5]}` : "", a = t.includePrerelease && n[6] ? `+${n[6]}` : "";
  return lC(`${r}.${i}.${o}${s}${a}`, t);
};
var fC = uC;
class dC {
  constructor() {
    this.max = 1e3, this.map = /* @__PURE__ */ new Map();
  }
  get(t) {
    const n = this.map.get(t);
    if (n !== void 0)
      return this.map.delete(t), this.map.set(t, n), n;
  }
  delete(t) {
    return this.map.delete(t);
  }
  set(t, n) {
    if (!this.delete(t) && n !== void 0) {
      if (this.map.size >= this.max) {
        const i = this.map.keys().next().value;
        this.delete(i);
      }
      this.map.set(t, n);
    }
    return this;
  }
}
var hC = dC, Ec, bd;
function fn() {
  if (bd) return Ec;
  bd = 1;
  const e = /\s+/g;
  class t {
    constructor(x, W) {
      if (W = i(W), x instanceof t)
        return x.loose === !!W.loose && x.includePrerelease === !!W.includePrerelease ? x : new t(x.raw, W);
      if (x instanceof o)
        return this.raw = x.value, this.set = [[x]], this.formatted = void 0, this;
      if (this.options = W, this.loose = !!W.loose, this.includePrerelease = !!W.includePrerelease, this.raw = x.trim().replace(e, " "), this.set = this.raw.split("||").map((q) => this.parseRange(q.trim())).filter((q) => q.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const q = this.set[0];
        if (this.set = this.set.filter((Y) => !p(Y[0])), this.set.length === 0)
          this.set = [q];
        else if (this.set.length > 1) {
          for (const Y of this.set)
            if (Y.length === 1 && v(Y[0])) {
              this.set = [Y];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let x = 0; x < this.set.length; x++) {
          x > 0 && (this.formatted += "||");
          const W = this.set[x];
          for (let q = 0; q < W.length; q++)
            q > 0 && (this.formatted += " "), this.formatted += W[q].toString().trim();
        }
      }
      return this.formatted;
    }
    format() {
      return this.range;
    }
    toString() {
      return this.range;
    }
    parseRange(x) {
      const q = ((this.options.includePrerelease && d) | (this.options.loose && m)) + ":" + x, Y = r.get(q);
      if (Y)
        return Y;
      const J = this.options.loose, j = J ? c[u.HYPHENRANGELOOSE] : c[u.HYPHENRANGE];
      x = x.replace(j, V(this.options.includePrerelease)), s("hyphen replace", x), x = x.replace(c[u.COMPARATORTRIM], l), s("comparator trim", x), x = x.replace(c[u.TILDETRIM], f), s("tilde trim", x), x = x.replace(c[u.CARETTRIM], h), s("caret trim", x);
      let N = x.split(" ").map((T) => g(T, this.options)).join(" ").split(/\s+/).map((T) => B(T, this.options));
      J && (N = N.filter((T) => (s("loose invalid filter", T, this.options), !!T.match(c[u.COMPARATORLOOSE])))), s("range list", N);
      const R = /* @__PURE__ */ new Map(), O = N.map((T) => new o(T, this.options));
      for (const T of O) {
        if (p(T))
          return [T];
        R.set(T.value, T);
      }
      R.size > 1 && R.has("") && R.delete("");
      const $ = [...R.values()];
      return r.set(q, $), $;
    }
    intersects(x, W) {
      if (!(x instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((q) => y(q, W) && x.set.some((Y) => y(Y, W) && q.every((J) => Y.every((j) => J.intersects(j, W)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(x) {
      if (!x)
        return !1;
      if (typeof x == "string")
        try {
          x = new a(x, this.options);
        } catch {
          return !1;
        }
      for (let W = 0; W < this.set.length; W++)
        if (Z(this.set[W], x, this.options))
          return !0;
      return !1;
    }
  }
  Ec = t;
  const n = hC, r = new n(), i = Uu, o = La(), s = Da, a = Ot, {
    safeRe: c,
    t: u,
    comparatorTrimReplace: l,
    tildeTrimReplace: f,
    caretTrimReplace: h
  } = qo, { FLAG_INCLUDE_PRERELEASE: d, FLAG_LOOSE: m } = Ra, p = (F) => F.value === "<0.0.0-0", v = (F) => F.value === "", y = (F, x) => {
    let W = !0;
    const q = F.slice();
    let Y = q.pop();
    for (; W && q.length; )
      W = q.every((J) => Y.intersects(J, x)), Y = q.pop();
    return W;
  }, g = (F, x) => (F = F.replace(c[u.BUILD], ""), s("comp", F, x), F = U(F, x), s("caret", F), F = S(F, x), s("tildes", F), F = z(F, x), s("xrange", F), F = b(F, x), s("stars", F), F), E = (F) => !F || F.toLowerCase() === "x" || F === "*", S = (F, x) => F.trim().split(/\s+/).map((W) => C(W, x)).join(" "), C = (F, x) => {
    const W = x.loose ? c[u.TILDELOOSE] : c[u.TILDE];
    return F.replace(W, (q, Y, J, j, N) => {
      s("tilde", F, q, Y, J, j, N);
      let R;
      return E(Y) ? R = "" : E(J) ? R = `>=${Y}.0.0 <${+Y + 1}.0.0-0` : E(j) ? R = `>=${Y}.${J}.0 <${Y}.${+J + 1}.0-0` : N ? (s("replaceTilde pr", N), R = `>=${Y}.${J}.${j}-${N} <${Y}.${+J + 1}.0-0`) : R = `>=${Y}.${J}.${j} <${Y}.${+J + 1}.0-0`, s("tilde return", R), R;
    });
  }, U = (F, x) => F.trim().split(/\s+/).map((W) => G(W, x)).join(" "), G = (F, x) => {
    s("caret", F, x);
    const W = x.loose ? c[u.CARETLOOSE] : c[u.CARET], q = x.includePrerelease ? "-0" : "";
    return F.replace(W, (Y, J, j, N, R) => {
      s("caret", F, Y, J, j, N, R);
      let O;
      return E(J) ? O = "" : E(j) ? O = `>=${J}.0.0${q} <${+J + 1}.0.0-0` : E(N) ? J === "0" ? O = `>=${J}.${j}.0${q} <${J}.${+j + 1}.0-0` : O = `>=${J}.${j}.0${q} <${+J + 1}.0.0-0` : R ? (s("replaceCaret pr", R), J === "0" ? j === "0" ? O = `>=${J}.${j}.${N}-${R} <${J}.${j}.${+N + 1}-0` : O = `>=${J}.${j}.${N}-${R} <${J}.${+j + 1}.0-0` : O = `>=${J}.${j}.${N}-${R} <${+J + 1}.0.0-0`) : (s("no pr"), J === "0" ? j === "0" ? O = `>=${J}.${j}.${N}${q} <${J}.${j}.${+N + 1}-0` : O = `>=${J}.${j}.${N}${q} <${J}.${+j + 1}.0-0` : O = `>=${J}.${j}.${N} <${+J + 1}.0.0-0`), s("caret return", O), O;
    });
  }, z = (F, x) => (s("replaceXRanges", F, x), F.split(/\s+/).map((W) => H(W, x)).join(" ")), H = (F, x) => {
    F = F.trim();
    const W = x.loose ? c[u.XRANGELOOSE] : c[u.XRANGE];
    return F.replace(W, (q, Y, J, j, N, R) => {
      s("xRange", F, q, Y, J, j, N, R);
      const O = E(J), $ = O || E(j), T = $ || E(N), M = T;
      return Y === "=" && M && (Y = ""), R = x.includePrerelease ? "-0" : "", O ? Y === ">" || Y === "<" ? q = "<0.0.0-0" : q = "*" : Y && M ? ($ && (j = 0), N = 0, Y === ">" ? (Y = ">=", $ ? (J = +J + 1, j = 0, N = 0) : (j = +j + 1, N = 0)) : Y === "<=" && (Y = "<", $ ? J = +J + 1 : j = +j + 1), Y === "<" && (R = "-0"), q = `${Y + J}.${j}.${N}${R}`) : $ ? q = `>=${J}.0.0${R} <${+J + 1}.0.0-0` : T && (q = `>=${J}.${j}.0${R} <${J}.${+j + 1}.0-0`), s("xRange return", q), q;
    });
  }, b = (F, x) => (s("replaceStars", F, x), F.trim().replace(c[u.STAR], "")), B = (F, x) => (s("replaceGTE0", F, x), F.trim().replace(c[x.includePrerelease ? u.GTE0PRE : u.GTE0], "")), V = (F) => (x, W, q, Y, J, j, N, R, O, $, T, M) => (E(q) ? W = "" : E(Y) ? W = `>=${q}.0.0${F ? "-0" : ""}` : E(J) ? W = `>=${q}.${Y}.0${F ? "-0" : ""}` : j ? W = `>=${W}` : W = `>=${W}${F ? "-0" : ""}`, E(O) ? R = "" : E($) ? R = `<${+O + 1}.0.0-0` : E(T) ? R = `<${O}.${+$ + 1}.0-0` : M ? R = `<=${O}.${$}.${T}-${M}` : F ? R = `<${O}.${$}.${+T + 1}-0` : R = `<=${R}`, `${W} ${R}`.trim()), Z = (F, x, W) => {
    for (let q = 0; q < F.length; q++)
      if (!F[q].test(x))
        return !1;
    if (x.prerelease.length && !W.includePrerelease) {
      for (let q = 0; q < F.length; q++)
        if (s(F[q].semver), F[q].semver !== o.ANY && F[q].semver.prerelease.length > 0) {
          const Y = F[q].semver;
          if (Y.major === x.major && Y.minor === x.minor && Y.patch === x.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return Ec;
}
var _c, Ad;
function La() {
  if (Ad) return _c;
  Ad = 1;
  const e = Symbol("SemVer ANY");
  class t {
    static get ANY() {
      return e;
    }
    constructor(l, f) {
      if (f = n(f), l instanceof t) {
        if (l.loose === !!f.loose)
          return l;
        l = l.value;
      }
      l = l.trim().split(/\s+/).join(" "), s("comparator", l, f), this.options = f, this.loose = !!f.loose, this.parse(l), this.semver === e ? this.value = "" : this.value = this.operator + this.semver.version, s("comp", this);
    }
    parse(l) {
      const f = this.options.loose ? r[i.COMPARATORLOOSE] : r[i.COMPARATOR], h = l.match(f);
      if (!h)
        throw new TypeError(`Invalid comparator: ${l}`);
      this.operator = h[1] !== void 0 ? h[1] : "", this.operator === "=" && (this.operator = ""), h[2] ? this.semver = new a(h[2], this.options.loose) : this.semver = e;
    }
    toString() {
      return this.value;
    }
    test(l) {
      if (s("Comparator.test", l, this.options.loose), this.semver === e || l === e)
        return !0;
      if (typeof l == "string")
        try {
          l = new a(l, this.options);
        } catch {
          return !1;
        }
      return o(l, this.operator, this.semver, this.options);
    }
    intersects(l, f) {
      if (!(l instanceof t))
        throw new TypeError("a Comparator is required");
      return this.operator === "" ? this.value === "" ? !0 : new c(l.value, f).test(this.value) : l.operator === "" ? l.value === "" ? !0 : new c(this.value, f).test(l.semver) : (f = n(f), f.includePrerelease && (this.value === "<0.0.0-0" || l.value === "<0.0.0-0") || !f.includePrerelease && (this.value.startsWith("<0.0.0") || l.value.startsWith("<0.0.0")) ? !1 : !!(this.operator.startsWith(">") && l.operator.startsWith(">") || this.operator.startsWith("<") && l.operator.startsWith("<") || this.semver.version === l.semver.version && this.operator.includes("=") && l.operator.includes("=") || o(this.semver, "<", l.semver, f) && this.operator.startsWith(">") && l.operator.startsWith("<") || o(this.semver, ">", l.semver, f) && this.operator.startsWith("<") && l.operator.startsWith(">")));
    }
  }
  _c = t;
  const n = Uu, { safeRe: r, t: i } = qo, o = zm, s = Da, a = Ot, c = fn();
  return _c;
}
const pC = fn(), mC = (e, t, n) => {
  try {
    t = new pC(t, n);
  } catch {
    return !1;
  }
  return t.test(e);
};
var xa = mC;
const gC = fn(), yC = (e, t) => new gC(e, t).set.map((n) => n.map((r) => r.value).join(" ").trim().split(" "));
var vC = yC;
const wC = Ot, EC = fn(), _C = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new EC(t, n);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    o.test(s) && (!r || i.compare(s) === -1) && (r = s, i = new wC(r, n));
  }), r;
};
var $C = _C;
const SC = Ot, bC = fn(), AC = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new bC(t, n);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    o.test(s) && (!r || i.compare(s) === 1) && (r = s, i = new SC(r, n));
  }), r;
};
var TC = AC;
const $c = Ot, CC = fn(), Td = Fa, NC = (e, t) => {
  e = new CC(e, t);
  let n = new $c("0.0.0");
  if (e.test(n) || (n = new $c("0.0.0-0"), e.test(n)))
    return n;
  n = null;
  for (let r = 0; r < e.set.length; ++r) {
    const i = e.set[r];
    let o = null;
    i.forEach((s) => {
      const a = new $c(s.semver.version);
      switch (s.operator) {
        case ">":
          a.prerelease.length === 0 ? a.patch++ : a.prerelease.push(0), a.raw = a.format();
        case "":
        case ">=":
          (!o || Td(a, o)) && (o = a);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${s.operator}`);
      }
    }), o && (!n || Td(n, o)) && (n = o);
  }
  return n && e.test(n) ? n : null;
};
var IC = NC;
const PC = fn(), OC = (e, t) => {
  try {
    return new PC(e, t).range || "*";
  } catch {
    return null;
  }
};
var RC = OC;
const DC = Ot, Vm = La(), { ANY: FC } = Vm, LC = fn(), xC = xa, Cd = Fa, Nd = Mu, kC = Hu, UC = Bu, jC = (e, t, n, r) => {
  e = new DC(e, r), t = new LC(t, r);
  let i, o, s, a, c;
  switch (n) {
    case ">":
      i = Cd, o = kC, s = Nd, a = ">", c = ">=";
      break;
    case "<":
      i = Nd, o = UC, s = Cd, a = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (xC(e, t, r))
    return !1;
  for (let u = 0; u < t.set.length; ++u) {
    const l = t.set[u];
    let f = null, h = null;
    if (l.forEach((d) => {
      d.semver === FC && (d = new Vm(">=0.0.0")), f = f || d, h = h || d, i(d.semver, f.semver, r) ? f = d : s(d.semver, h.semver, r) && (h = d);
    }), f.operator === a || f.operator === c || (!h.operator || h.operator === a) && o(e, h.semver))
      return !1;
    if (h.operator === c && s(e, h.semver))
      return !1;
  }
  return !0;
};
var qu = jC;
const MC = qu, BC = (e, t, n) => MC(e, t, ">", n);
var HC = BC;
const qC = qu, zC = (e, t, n) => qC(e, t, "<", n);
var VC = zC;
const Id = fn(), GC = (e, t, n) => (e = new Id(e, n), t = new Id(t, n), e.intersects(t, n));
var WC = GC;
const KC = xa, JC = un;
var YC = (e, t, n) => {
  const r = [];
  let i = null, o = null;
  const s = e.sort((l, f) => JC(l, f, n));
  for (const l of s)
    KC(l, t, n) ? (o = l, i || (i = l)) : (o && r.push([i, o]), o = null, i = null);
  i && r.push([i, null]);
  const a = [];
  for (const [l, f] of r)
    l === f ? a.push(l) : !f && l === s[0] ? a.push("*") : f ? l === s[0] ? a.push(`<=${f}`) : a.push(`${l} - ${f}`) : a.push(`>=${l}`);
  const c = a.join(" || "), u = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < u.length ? c : t;
};
const Pd = fn(), zu = La(), { ANY: Sc } = zu, eo = xa, Vu = un, XC = (e, t, n = {}) => {
  if (e === t)
    return !0;
  e = new Pd(e, n), t = new Pd(t, n);
  let r = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const s = QC(i, o, n);
      if (r = r || s !== null, s)
        continue e;
    }
    if (r)
      return !1;
  }
  return !0;
}, ZC = [new zu(">=0.0.0-0")], Od = [new zu(">=0.0.0")], QC = (e, t, n) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === Sc) {
    if (t.length === 1 && t[0].semver === Sc)
      return !0;
    n.includePrerelease ? e = ZC : e = Od;
  }
  if (t.length === 1 && t[0].semver === Sc) {
    if (n.includePrerelease)
      return !0;
    t = Od;
  }
  const r = /* @__PURE__ */ new Set();
  let i, o;
  for (const d of e)
    d.operator === ">" || d.operator === ">=" ? i = Rd(i, d, n) : d.operator === "<" || d.operator === "<=" ? o = Dd(o, d, n) : r.add(d.semver);
  if (r.size > 1)
    return null;
  let s;
  if (i && o) {
    if (s = Vu(i.semver, o.semver, n), s > 0)
      return null;
    if (s === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const d of r) {
    if (i && !eo(d, String(i), n) || o && !eo(d, String(o), n))
      return null;
    for (const m of t)
      if (!eo(d, String(m), n))
        return !1;
    return !0;
  }
  let a, c, u, l, f = o && !n.includePrerelease && o.semver.prerelease.length ? o.semver : !1, h = i && !n.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const d of t) {
    if (l = l || d.operator === ">" || d.operator === ">=", u = u || d.operator === "<" || d.operator === "<=", i) {
      if (h && d.semver.prerelease && d.semver.prerelease.length && d.semver.major === h.major && d.semver.minor === h.minor && d.semver.patch === h.patch && (h = !1), d.operator === ">" || d.operator === ">=") {
        if (a = Rd(i, d, n), a === d && a !== i)
          return !1;
      } else if (i.operator === ">=" && !eo(i.semver, String(d), n))
        return !1;
    }
    if (o) {
      if (f && d.semver.prerelease && d.semver.prerelease.length && d.semver.major === f.major && d.semver.minor === f.minor && d.semver.patch === f.patch && (f = !1), d.operator === "<" || d.operator === "<=") {
        if (c = Dd(o, d, n), c === d && c !== o)
          return !1;
      } else if (o.operator === "<=" && !eo(o.semver, String(d), n))
        return !1;
    }
    if (!d.operator && (o || i) && s !== 0)
      return !1;
  }
  return !(i && u && !o && s !== 0 || o && l && !i && s !== 0 || h || f);
}, Rd = (e, t, n) => {
  if (!e)
    return t;
  const r = Vu(e.semver, t.semver, n);
  return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Dd = (e, t, n) => {
  if (!e)
    return t;
  const r = Vu(e.semver, t.semver, n);
  return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var eN = XC;
const bc = qo, Fd = Ra, tN = Ot, Ld = Bm, nN = ki, rN = lT, iN = dT, oN = pT, sN = gT, aN = wT, cN = $T, lN = AT, uN = NT, fN = un, dN = RT, hN = LT, pN = ju, mN = jT, gN = HT, yN = Fa, vN = Mu, wN = Hm, EN = qm, _N = Bu, $N = Hu, SN = zm, bN = fC, AN = La(), TN = fn(), CN = xa, NN = vC, IN = $C, PN = TC, ON = IC, RN = RC, DN = qu, FN = HC, LN = VC, xN = WC, kN = YC, UN = eN;
var Gu = {
  parse: nN,
  valid: rN,
  clean: iN,
  inc: oN,
  diff: sN,
  major: aN,
  minor: cN,
  patch: lN,
  prerelease: uN,
  compare: fN,
  rcompare: dN,
  compareLoose: hN,
  compareBuild: pN,
  sort: mN,
  rsort: gN,
  gt: yN,
  lt: vN,
  eq: wN,
  neq: EN,
  gte: _N,
  lte: $N,
  cmp: SN,
  coerce: bN,
  Comparator: AN,
  Range: TN,
  satisfies: CN,
  toComparators: NN,
  maxSatisfying: IN,
  minSatisfying: PN,
  minVersion: ON,
  validRange: RN,
  outside: DN,
  gtr: FN,
  ltr: LN,
  intersects: xN,
  simplifyRange: kN,
  subset: UN,
  SemVer: tN,
  re: bc.re,
  src: bc.src,
  tokens: bc.t,
  SEMVER_SPEC_VERSION: Fd.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Fd.RELEASE_TYPES,
  compareIdentifiers: Ld.compareIdentifiers,
  rcompareIdentifiers: Ld.rcompareIdentifiers
};
const ri = /* @__PURE__ */ jl(Gu), jN = Object.prototype.toString, MN = "[object Uint8Array]", BN = "[object ArrayBuffer]";
function Gm(e, t, n) {
  return e ? e.constructor === t ? !0 : jN.call(e) === n : !1;
}
function Wm(e) {
  return Gm(e, Uint8Array, MN);
}
function HN(e) {
  return Gm(e, ArrayBuffer, BN);
}
function qN(e) {
  return Wm(e) || HN(e);
}
function zN(e) {
  if (!Wm(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function VN(e) {
  if (!qN(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function Ac(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((i, o) => i + o.length, 0));
  const n = new Uint8Array(t);
  let r = 0;
  for (const i of e)
    zN(i), n.set(i, r), r += i.length;
  return n;
}
const Ss = {
  utf8: new globalThis.TextDecoder("utf8")
};
function bs(e, t = "utf8") {
  return VN(e), Ss[t] ?? (Ss[t] = new globalThis.TextDecoder(t)), Ss[t].decode(e);
}
function GN(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const WN = new globalThis.TextEncoder();
function Tc(e) {
  return GN(e), WN.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const xd = "aes-256-cbc", Km = /* @__PURE__ */ new Set([
  "aes-256-cbc",
  "aes-256-gcm",
  "aes-256-ctr"
]), KN = (e) => typeof e == "string" && Km.has(e), In = () => /* @__PURE__ */ Object.create(null), kd = (e) => e !== void 0, Cc = (e, t) => {
  const n = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), r = typeof t;
  if (n.has(r))
    throw new TypeError(`Setting a value of type \`${r}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Jn = "__internal__", Nc = `${Jn}.migrations.version`;
var tr, nr, Ur, Ut, Jt, jr, Mr, Ai, gn, st, Jm, Ym, Xm, Zm, Qm, eg, tg, ng;
class JN {
  constructor(t = {}) {
    tn(this, st);
    Yi(this, "path");
    Yi(this, "events");
    tn(this, tr);
    tn(this, nr);
    tn(this, Ur);
    tn(this, Ut);
    tn(this, Jt, {});
    tn(this, jr, !1);
    tn(this, Mr);
    tn(this, Ai);
    tn(this, gn);
    Yi(this, "_deserialize", (t) => JSON.parse(t));
    Yi(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const n = Cn(this, st, Jm).call(this, t);
    kt(this, Ut, n), Cn(this, st, Ym).call(this, n), Cn(this, st, Zm).call(this, n), Cn(this, st, Qm).call(this, n), this.events = new EventTarget(), kt(this, nr, n.encryptionKey), kt(this, Ur, n.encryptionAlgorithm ?? xd), this.path = Cn(this, st, eg).call(this, n), Cn(this, st, tg).call(this, n), n.watch && this._watch();
  }
  get(t, n) {
    if (de(this, Ut).accessPropertiesByDotNotation)
      return this._get(t, n);
    const { store: r } = this;
    return t in r ? r[t] : n;
  }
  set(t, n) {
    if (typeof t != "string" && typeof t != "object")
      throw new TypeError(`Expected \`key\` to be of type \`string\` or \`object\`, got ${typeof t}`);
    if (typeof t != "object" && n === void 0)
      throw new TypeError("Use `delete()` to clear values");
    if (this._containsReservedKey(t))
      throw new TypeError(`Please don't use the ${Jn} key, as it's used to manage this module internal operations.`);
    const { store: r } = this, i = (o, s) => {
      if (Cc(o, s), de(this, Ut).accessPropertiesByDotNotation)
        ls(r, o, s);
      else {
        if (o === "__proto__" || o === "constructor" || o === "prototype")
          return;
        r[o] = s;
      }
    };
    if (typeof t == "object") {
      const o = t;
      for (const [s, a] of Object.entries(o))
        i(s, a);
    } else
      i(t, n);
    this.store = r;
  }
  has(t) {
    return de(this, Ut).accessPropertiesByDotNotation ? fc(this.store, t) : t in this.store;
  }
  appendToArray(t, n) {
    Cc(t, n);
    const r = de(this, Ut).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
    if (!Array.isArray(r))
      throw new TypeError(`The key \`${t}\` is already set to a non-array value`);
    this.set(t, [...r, n]);
  }
  /**
      Reset items to their default values, as defined by the `defaults` or `schema` option.
  
      @see `clear()` to reset all items.
  
      @param keys - The keys of the items to reset.
      */
  reset(...t) {
    for (const n of t)
      kd(de(this, Jt)[n]) && this.set(n, de(this, Jt)[n]);
  }
  delete(t) {
    const { store: n } = this;
    de(this, Ut).accessPropertiesByDotNotation ? yv(n, t) : delete n[t], this.store = n;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = In();
    for (const n of Object.keys(de(this, Jt)))
      kd(de(this, Jt)[n]) && (Cc(n, de(this, Jt)[n]), de(this, Ut).accessPropertiesByDotNotation ? ls(t, n, de(this, Jt)[n]) : t[n] = de(this, Jt)[n]);
    this.store = t;
  }
  onDidChange(t, n) {
    if (typeof t != "string")
      throw new TypeError(`Expected \`key\` to be of type \`string\`, got ${typeof t}`);
    if (typeof n != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof n}`);
    return this._handleValueChange(() => this.get(t), n);
  }
  /**
      Watches the whole config object, calling `callback` on any changes.
  
      @param callback - A callback function that is called on any changes. When a `key` is first set `oldValue` will be `undefined`, and when a key is deleted `newValue` will be `undefined`.
      @returns A function, that when called, will unsubscribe.
      */
  onDidAnyChange(t) {
    if (typeof t != "function")
      throw new TypeError(`Expected \`callback\` to be of type \`function\`, got ${typeof t}`);
    return this._handleStoreChange(t);
  }
  get size() {
    return Object.keys(this.store).filter((n) => !this._isReservedKeyPath(n)).length;
  }
  /**
      Get all the config as an object or replace the current config with an object.
  
      @example
      ```
      console.log(config.store);
      //=> {name: 'John', age: 30}
      ```
  
      @example
      ```
      config.store = {
          hello: 'world'
      };
      ```
      */
  get store() {
    var t;
    try {
      const n = he.readFileSync(this.path, de(this, nr) ? null : "utf8"), r = this._decryptData(n);
      return ((o) => {
        const s = this._deserialize(o);
        return de(this, jr) || this._validate(s), Object.assign(In(), s);
      })(r);
    } catch (n) {
      if ((n == null ? void 0 : n.code) === "ENOENT")
        return this._ensureDirectory(), In();
      if (de(this, Ut).clearInvalidConfig) {
        const r = n;
        if (r.name === "SyntaxError" || (t = r.message) != null && t.startsWith("Config schema violation:") || r.message === "Failed to decrypt config data.")
          return In();
      }
      throw n;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !fc(t, Jn))
      try {
        const n = he.readFileSync(this.path, de(this, nr) ? null : "utf8"), r = this._decryptData(n), i = this._deserialize(r);
        fc(i, Jn) && ls(t, Jn, xf(i, Jn));
      } catch {
      }
    de(this, jr) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, n] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, n]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    de(this, Mr) && (de(this, Mr).close(), kt(this, Mr, void 0)), de(this, Ai) && (he.unwatchFile(this.path), kt(this, Ai, !1)), kt(this, gn, void 0);
  }
  _decryptData(t) {
    const n = de(this, nr);
    if (!n)
      return typeof t == "string" ? t : bs(t);
    const r = de(this, Ur), i = r === "aes-256-gcm" ? 16 : 0, o = ":".codePointAt(0), s = typeof t == "string" ? t.codePointAt(16) : t[16];
    if (!(o !== void 0 && s === o)) {
      if (r === "aes-256-cbc")
        return typeof t == "string" ? t : bs(t);
      throw new Error("Failed to decrypt config data.");
    }
    const c = (d) => {
      if (i === 0)
        return { ciphertext: d };
      const m = d.length - i;
      if (m < 0)
        throw new Error("Invalid authentication tag length.");
      return {
        ciphertext: d.slice(0, m),
        authenticationTag: d.slice(m)
      };
    }, u = t.slice(0, 16), l = t.slice(17), f = typeof l == "string" ? Tc(l) : l, h = (d) => {
      const { ciphertext: m, authenticationTag: p } = c(f), v = Xi.pbkdf2Sync(n, d, 1e4, 32, "sha512"), y = Xi.createDecipheriv(r, v, u);
      return p && y.setAuthTag(p), bs(Ac([y.update(m), y.final()]));
    };
    try {
      return h(u);
    } catch {
      try {
        return h(u.toString());
      } catch {
      }
    }
    if (r === "aes-256-cbc")
      return typeof t == "string" ? t : bs(t);
    throw new Error("Failed to decrypt config data.");
  }
  _handleStoreChange(t) {
    let n = this.store;
    const r = () => {
      const i = n, o = this.store;
      Ff(o, i) || (n = o, t.call(this, o, i));
    };
    return this.events.addEventListener("change", r), () => {
      this.events.removeEventListener("change", r);
    };
  }
  _handleValueChange(t, n) {
    let r = t();
    const i = () => {
      const o = r, s = t();
      Ff(s, o) || (r = s, n.call(this, s, o));
    };
    return this.events.addEventListener("change", i), () => {
      this.events.removeEventListener("change", i);
    };
  }
  _validate(t) {
    if (!de(this, tr) || de(this, tr).call(this, t) || !de(this, tr).errors)
      return;
    const r = de(this, tr).errors.map(({ instancePath: i, message: o = "" }) => `\`${i.slice(1)}\` ${o}`);
    throw new Error("Config schema violation: " + r.join("; "));
  }
  _ensureDirectory() {
    he.mkdirSync(Se.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let n = this._serialize(t);
    const r = de(this, nr);
    if (r) {
      const i = Xi.randomBytes(16), o = Xi.pbkdf2Sync(r, i, 1e4, 32, "sha512"), s = Xi.createCipheriv(de(this, Ur), o, i), a = Ac([s.update(Tc(n)), s.final()]), c = [i, Tc(":"), a];
      de(this, Ur) === "aes-256-gcm" && c.push(s.getAuthTag()), n = Ac(c);
    }
    if (ke.env.SNAP)
      he.writeFileSync(this.path, n, { mode: de(this, Ut).configFileMode });
    else
      try {
        Up(this.path, n, { mode: de(this, Ut).configFileMode });
      } catch (i) {
        if ((i == null ? void 0 : i.code) === "EXDEV") {
          he.writeFileSync(this.path, n, { mode: de(this, Ut).configFileMode });
          return;
        }
        throw i;
      }
  }
  _watch() {
    if (this._ensureDirectory(), he.existsSync(this.path) || this._write(In()), ke.platform === "win32" || ke.platform === "darwin") {
      de(this, gn) ?? kt(this, gn, gd(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = Se.dirname(this.path), n = Se.basename(this.path);
      kt(this, Mr, he.watch(t, { persistent: !1, encoding: "utf8" }, (r, i) => {
        i && i !== n || typeof de(this, gn) == "function" && de(this, gn).call(this);
      }));
    } else
      de(this, gn) ?? kt(this, gn, gd(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), he.watchFile(this.path, { persistent: !1 }, (t, n) => {
        typeof de(this, gn) == "function" && de(this, gn).call(this);
      }), kt(this, Ai, !0);
  }
  _migrate(t, n, r) {
    let i = this._get(Nc, "0.0.0");
    const o = Object.keys(t).filter((a) => this._shouldPerformMigration(a, i, n));
    let s = structuredClone(this.store);
    for (const a of o)
      try {
        r && r(this, {
          fromVersion: i,
          toVersion: a,
          finalVersion: n,
          versions: o
        });
        const c = t[a];
        c == null || c(this), this._set(Nc, a), i = a, s = structuredClone(this.store);
      } catch (c) {
        this.store = s;
        const u = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${u}`);
      }
    (this._isVersionInRangeFormat(i) || !ri.eq(i, n)) && this._set(Nc, n);
  }
  _containsReservedKey(t) {
    return typeof t == "string" ? this._isReservedKeyPath(t) : !t || typeof t != "object" ? !1 : this._objectContainsReservedKey(t);
  }
  _objectContainsReservedKey(t) {
    if (!t || typeof t != "object")
      return !1;
    for (const [n, r] of Object.entries(t))
      if (this._isReservedKeyPath(n) || this._objectContainsReservedKey(r))
        return !0;
    return !1;
  }
  _isReservedKeyPath(t) {
    return t === Jn || t.startsWith(`${Jn}.`);
  }
  _isVersionInRangeFormat(t) {
    return ri.clean(t) === null;
  }
  _shouldPerformMigration(t, n, r) {
    return this._isVersionInRangeFormat(t) ? n !== "0.0.0" && ri.satisfies(n, t) ? !1 : ri.satisfies(r, t) : !(ri.lte(t, n) || ri.gt(t, r));
  }
  _get(t, n) {
    return xf(this.store, t, n);
  }
  _set(t, n) {
    const { store: r } = this;
    ls(r, t, n), this.store = r;
  }
}
tr = new WeakMap(), nr = new WeakMap(), Ur = new WeakMap(), Ut = new WeakMap(), Jt = new WeakMap(), jr = new WeakMap(), Mr = new WeakMap(), Ai = new WeakMap(), gn = new WeakMap(), st = new WeakSet(), Jm = function(t) {
  const n = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (n.encryptionAlgorithm ?? (n.encryptionAlgorithm = xd), !KN(n.encryptionAlgorithm))
    throw new TypeError(`The \`encryptionAlgorithm\` option must be one of: ${[...Km].join(", ")}`);
  if (!n.cwd) {
    if (!n.projectName)
      throw new Error("Please specify the `projectName` option.");
    n.cwd = _v(n.projectName, { suffix: n.projectSuffix }).config;
  }
  return typeof n.fileExtension == "string" && (n.fileExtension = n.fileExtension.replace(/^\.+/, "")), n;
}, Ym = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const n = jA.default, r = new bA.Ajv2020({
    allErrors: !0,
    useDefaults: !0,
    ...t.ajvOptions
  });
  n(r);
  const i = {
    ...t.rootSchema,
    type: "object",
    properties: t.schema
  };
  kt(this, tr, r.compile(i)), Cn(this, st, Xm).call(this, t.schema);
}, Xm = function(t) {
  const n = Object.entries(t ?? {});
  for (const [r, i] of n) {
    if (!i || typeof i != "object" || !Object.hasOwn(i, "default"))
      continue;
    const { default: o } = i;
    o !== void 0 && (de(this, Jt)[r] = o);
  }
}, Zm = function(t) {
  t.defaults && Object.assign(de(this, Jt), t.defaults);
}, Qm = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, eg = function(t) {
  const n = typeof t.fileExtension == "string" ? t.fileExtension : void 0, r = n ? `.${n}` : "";
  return Se.resolve(t.cwd, `${t.configName ?? "config"}${r}`);
}, tg = function(t) {
  if (t.migrations) {
    Cn(this, st, ng).call(this, t), this._validate(this.store);
    return;
  }
  const n = this.store, r = Object.assign(In(), t.defaults ?? {}, n);
  this._validate(r);
  try {
    Lf.deepEqual(n, r);
  } catch {
    this.store = r;
  }
}, ng = function(t) {
  const { migrations: n, projectVersion: r } = t;
  if (n) {
    if (!r)
      throw new Error("Please specify the `projectVersion` option.");
    kt(this, jr, !0);
    try {
      const i = this.store, o = Object.assign(In(), t.defaults ?? {}, i);
      try {
        Lf.deepEqual(i, o);
      } catch {
        this._write(o);
      }
      this._migrate(n, r, t.beforeEachMigration);
    } finally {
      kt(this, jr, !1);
    }
  }
};
const { app: Vs, ipcMain: vl, shell: YN } = Fn;
let Ud = !1;
const jd = () => {
  if (!vl || !Vs)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: Vs.getPath("userData"),
    appVersion: Vs.getVersion()
  };
  return Ud || (vl.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Ud = !0), e;
};
class XN extends JN {
  constructor(t) {
    let n, r;
    if (ke.type === "renderer") {
      const i = Fn.ipcRenderer.sendSync("electron-store-get-data");
      if (!i)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: n, appVersion: r } = i);
    } else vl && Vs && ({ defaultCwd: n, appVersion: r } = jd());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = r), t.cwd ? t.cwd = Se.isAbsolute(t.cwd) ? t.cwd : Se.join(n, t.cwd) : t.cwd = n, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    jd();
  }
  async openInEditor() {
    const t = await YN.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const ZN = {
  firstLaunch: !0,
  language: "en",
  theme: "dark",
  appearance: {
    iconTheme: "Simple (Colored)",
    catPack: "Rory ID 11",
    consoleFont: "DejaVu Sans",
    consoleFontSize: 10,
    catOpacity: 75,
    catScaling: "fit"
  },
  minecraft: {
    startMaximized: !1,
    windowWidth: 854,
    windowHeight: 480,
    hideOnLaunch: !1,
    quitOnClose: !1,
    showConsoleOnLaunch: !0,
    showConsoleOnCrash: !0,
    hideConsoleOnExit: !0,
    showPlayTime: !0,
    recordPlayTime: !0,
    showTotalPlayTime: !0,
    showDurationsInHours: !1
  },
  java: {
    executable: "",
    skipCompatChecks: !1,
    skipSetupPrompt: !1,
    autoDetect: !0,
    autoDownload: !0,
    minMemory: 512,
    maxMemory: 8096,
    permGen: 128,
    jvmArgs: ""
  },
  proxy: {
    type: "none",
    address: "127.0.0.1",
    port: 8080,
    username: "",
    password: ""
  },
  services: {
    pasteService: "mclo.gs",
    pasteBaseUrl: "https://api.mclo.gs",
    metaServer: "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json",
    assetsServer: "https://resources.download.minecraft.net/",
    userAgent: "",
    microsoftApiKey: "",
    modrinthApiKey: "",
    curseforgeApiKey: "$2a$10$Qm5Sp4EH9TXayzBgIgMZ3e0UoMO.nVKTxz6R.BHm57BzqHWv3zNRy",
    technicApiKey: ""
  },
  tools: {
    textEditor: "",
    mcedit: "",
    jprofiler: "",
    visualvm: ""
  },
  instanceSorting: "name",
  instanceRenaming: "ask",
  checkUpdates: !1,
  updateInterval: "Every 24 hours",
  folders: {
    instances: "instances",
    mods: "mods",
    icons: "icons",
    java: "java",
    skins: "skins",
    downloads: ""
  },
  commands: {
    preLaunch: "",
    wrapper: "",
    postExit: ""
  },
  envVars: [],
  tweaks: {
    onlineFixes: !1,
    useSystemGLFW: !1,
    glfwPath: "",
    useSystemOpenAL: !1,
    openALPath: ""
  },
  discordRpc: !0
}, Vt = new XN({
  defaults: ZN,
  name: "config"
}), Pn = Pe.getPath("userData"), oe = {
  appData: Pn,
  instances: D.join(Pn, "instances"),
  java: D.join(Pn, "java"),
  icons: D.join(Pn, "icons"),
  skins: D.join(Pn, "skins"),
  mods: D.join(Pn, "mods"),
  logs: D.join(Pn, "logs"),
  config: D.join(Pn, "config.json"),
  accounts: D.join(Pn, "accounts.json")
};
async function QN() {
  const e = Vt.get("proxy");
  e.type === "none" ? await Df.defaultSession.setProxy({ mode: "direct" }) : (e.type === "http" || e.type === "socks5") && await Df.defaultSession.setProxy({
    proxyRules: `${e.type}://${e.address}:${e.port}`
  });
}
function e1() {
  re.handle("config:get", () => Vt.store), re.handle("config:set", (e, t, n) => {
    Vt.set(t, n), t === "proxy" && QN(), ve.getAllWindows().forEach((r) => {
      r.webContents.send("settings:updated");
    });
  });
}
var Ui = { exports: {} }, rg = {
  /* The local file header */
  LOCHDR: 30,
  // LOC header size
  LOCSIG: 67324752,
  // "PK\003\004"
  LOCVER: 4,
  // version needed to extract
  LOCFLG: 6,
  // general purpose bit flag
  LOCHOW: 8,
  // compression method
  LOCTIM: 10,
  // modification time (2 bytes time, 2 bytes date)
  LOCCRC: 14,
  // uncompressed file crc-32 value
  LOCSIZ: 18,
  // compressed size
  LOCLEN: 22,
  // uncompressed size
  LOCNAM: 26,
  // filename length
  LOCEXT: 28,
  // extra field length
  /* The Data descriptor */
  EXTSIG: 134695760,
  // "PK\007\008"
  EXTHDR: 16,
  // EXT header size
  EXTCRC: 4,
  // uncompressed file crc-32 value
  EXTSIZ: 8,
  // compressed size
  EXTLEN: 12,
  // uncompressed size
  /* The central directory file header */
  CENHDR: 46,
  // CEN header size
  CENSIG: 33639248,
  // "PK\001\002"
  CENVEM: 4,
  // version made by
  CENVER: 6,
  // version needed to extract
  CENFLG: 8,
  // encrypt, decrypt flags
  CENHOW: 10,
  // compression method
  CENTIM: 12,
  // modification time (2 bytes time, 2 bytes date)
  CENCRC: 16,
  // uncompressed file crc-32 value
  CENSIZ: 20,
  // compressed size
  CENLEN: 24,
  // uncompressed size
  CENNAM: 28,
  // filename length
  CENEXT: 30,
  // extra field length
  CENCOM: 32,
  // file comment length
  CENDSK: 34,
  // volume number start
  CENATT: 36,
  // internal file attributes
  CENATX: 38,
  // external file attributes (host system dependent)
  CENOFF: 42,
  // LOC header offset
  /* The entries in the end of central directory */
  ENDHDR: 22,
  // END header size
  ENDSIG: 101010256,
  // "PK\005\006"
  ENDSUB: 8,
  // number of entries on this disk
  ENDTOT: 10,
  // total number of entries
  ENDSIZ: 12,
  // central directory size in bytes
  ENDOFF: 16,
  // offset of first CEN header
  ENDCOM: 20,
  // zip file comment length
  END64HDR: 20,
  // zip64 END header size
  END64SIG: 117853008,
  // zip64 Locator signature, "PK\006\007"
  END64START: 4,
  // number of the disk with the start of the zip64
  END64OFF: 8,
  // relative offset of the zip64 end of central directory
  END64NUMDISKS: 16,
  // total number of disks
  ZIP64SIG: 101075792,
  // zip64 signature, "PK\006\006"
  ZIP64HDR: 56,
  // zip64 record minimum size
  ZIP64LEAD: 12,
  // leading bytes at the start of the record, not counted by the value stored in ZIP64SIZE
  ZIP64SIZE: 4,
  // zip64 size of the central directory record
  ZIP64VEM: 12,
  // zip64 version made by
  ZIP64VER: 14,
  // zip64 version needed to extract
  ZIP64DSK: 16,
  // zip64 number of this disk
  ZIP64DSKDIR: 20,
  // number of the disk with the start of the record directory
  ZIP64SUB: 24,
  // number of entries on this disk
  ZIP64TOT: 32,
  // total number of entries
  ZIP64SIZB: 40,
  // zip64 central directory size in bytes
  ZIP64OFF: 48,
  // offset of start of central directory with respect to the starting disk number
  ZIP64EXTRA: 56,
  // extensible data sector
  /* Compression methods */
  STORED: 0,
  // no compression
  SHRUNK: 1,
  // shrunk
  REDUCED1: 2,
  // reduced with compression factor 1
  REDUCED2: 3,
  // reduced with compression factor 2
  REDUCED3: 4,
  // reduced with compression factor 3
  REDUCED4: 5,
  // reduced with compression factor 4
  IMPLODED: 6,
  // imploded
  // 7 reserved for Tokenizing compression algorithm
  DEFLATED: 8,
  // deflated
  ENHANCED_DEFLATED: 9,
  // enhanced deflated
  PKWARE: 10,
  // PKWare DCL imploded
  // 11 reserved by PKWARE
  BZIP2: 12,
  //  compressed using BZIP2
  // 13 reserved by PKWARE
  LZMA: 14,
  // LZMA
  // 15-17 reserved by PKWARE
  IBM_TERSE: 18,
  // compressed using IBM TERSE
  IBM_LZ77: 19,
  // IBM LZ77 z
  AES_ENCRYPT: 99,
  // WinZIP AES encryption method
  /* General purpose bit flag */
  // values can obtained with expression 2**bitnr
  FLG_ENC: 1,
  // Bit 0: encrypted file
  FLG_COMP1: 2,
  // Bit 1, compression option
  FLG_COMP2: 4,
  // Bit 2, compression option
  FLG_DESC: 8,
  // Bit 3, data descriptor
  FLG_ENH: 16,
  // Bit 4, enhanced deflating
  FLG_PATCH: 32,
  // Bit 5, indicates that the file is compressed patched data.
  FLG_STR: 64,
  // Bit 6, strong encryption (patented)
  // Bits 7-10: Currently unused.
  FLG_EFS: 2048,
  // Bit 11: Language encoding flag (EFS)
  // Bit 12: Reserved by PKWARE for enhanced compression.
  // Bit 13: encrypted the Central Directory (patented).
  // Bits 14-15: Reserved by PKWARE.
  FLG_MSK: 4096,
  // mask header values
  /* Load type */
  FILE: 2,
  BUFFER: 1,
  NONE: 0,
  /* 4.5 Extensible data fields */
  EF_ID: 0,
  EF_SIZE: 2,
  /* Header IDs */
  ID_ZIP64: 1,
  ID_AVINFO: 7,
  ID_PFS: 8,
  ID_OS2: 9,
  ID_NTFS: 10,
  ID_OPENVMS: 12,
  ID_UNIX: 13,
  ID_FORK: 14,
  ID_PATCH: 15,
  ID_X509_PKCS7: 20,
  ID_X509_CERTID_F: 21,
  ID_X509_CERTID_C: 22,
  ID_STRONGENC: 23,
  ID_RECORD_MGT: 24,
  ID_X509_PKCS7_RL: 25,
  ID_IBM1: 101,
  ID_IBM2: 102,
  ID_POSZIP: 18064,
  EF_ZIP64_OR_32: 4294967295,
  EF_ZIP64_OR_16: 65535,
  EF_ZIP64_SUNCOMP: 0,
  EF_ZIP64_SCOMP: 8,
  EF_ZIP64_RHO: 16,
  EF_ZIP64_DSN: 24
}, ka = {};
(function(e) {
  const t = {
    /* Header error messages */
    INVALID_LOC: "Invalid LOC header (bad signature)",
    INVALID_CEN: "Invalid CEN header (bad signature)",
    INVALID_END: "Invalid END header (bad signature)",
    /* Descriptor */
    DESCRIPTOR_NOT_EXIST: "No descriptor present",
    DESCRIPTOR_UNKNOWN: "Unknown descriptor format",
    DESCRIPTOR_FAULTY: "Descriptor data is malformed",
    /* ZipEntry error messages*/
    NO_DATA: "Nothing to decompress",
    BAD_CRC: "CRC32 checksum failed {0}",
    FILE_IN_THE_WAY: "There is a file in the way: {0}",
    UNKNOWN_METHOD: "Invalid/unsupported compression method",
    /* Inflater error messages */
    AVAIL_DATA: "inflate::Available inflate data did not terminate",
    INVALID_DISTANCE: "inflate::Invalid literal/length or distance code in fixed or dynamic block",
    TO_MANY_CODES: "inflate::Dynamic block code description: too many length or distance codes",
    INVALID_REPEAT_LEN: "inflate::Dynamic block code description: repeat more than specified lengths",
    INVALID_REPEAT_FIRST: "inflate::Dynamic block code description: repeat lengths with no first length",
    INCOMPLETE_CODES: "inflate::Dynamic block code description: code lengths codes incomplete",
    INVALID_DYN_DISTANCE: "inflate::Dynamic block code description: invalid distance code lengths",
    INVALID_CODES_LEN: "inflate::Dynamic block code description: invalid literal/length code lengths",
    INVALID_STORE_BLOCK: "inflate::Stored block length did not match one's complement",
    INVALID_BLOCK_TYPE: "inflate::Invalid block type (type == 3)",
    /* ADM-ZIP error messages */
    CANT_EXTRACT_FILE: "Could not extract the file",
    CANT_OVERRIDE: "Target file already exists",
    DISK_ENTRY_TOO_LARGE: "Number of disk entries is too large",
    NO_ZIP: "No zip file was loaded",
    NO_ENTRY: "Entry doesn't exist",
    DIRECTORY_CONTENT_ERROR: "A directory cannot have content",
    FILE_NOT_FOUND: 'File not found: "{0}"',
    NOT_IMPLEMENTED: "Not implemented",
    INVALID_FILENAME: "Invalid filename",
    INVALID_FORMAT: "Invalid or unsupported zip format. No END header found",
    INVALID_PASS_PARAM: "Incompatible password parameter",
    WRONG_PASSWORD: "Wrong Password",
    /* ADM-ZIP */
    COMMENT_TOO_LONG: "Comment is too long",
    // Comment can be max 65535 bytes long (NOTE: some non-US characters may take more space)
    EXTRA_FIELD_PARSE_ERROR: "Extra field parsing error"
  };
  function n(r) {
    return function(...i) {
      return i.length && (r = r.replace(/\{(\d)\}/g, (o, s) => i[s] || "")), new Error("ADM-ZIP: " + r);
    };
  }
  for (const r of Object.keys(t))
    e[r] = n(t[r]);
})(ka);
const t1 = L, Ze = D, Md = rg, n1 = ka, r1 = typeof process == "object" && process.platform === "win32", Bd = (e) => typeof e == "object" && e !== null, ig = new Uint32Array(256).map((e, t) => {
  for (let n = 0; n < 8; n++)
    t & 1 ? t = 3988292384 ^ t >>> 1 : t >>>= 1;
  return t >>> 0;
});
function We(e) {
  this.sep = Ze.sep, this.fs = t1, Bd(e) && Bd(e.fs) && typeof e.fs.statSync == "function" && (this.fs = e.fs);
}
var i1 = We;
We.prototype.makeDir = function(e) {
  const t = this;
  function n(r) {
    let i = r.split(t.sep)[0];
    r.split(t.sep).forEach(function(o) {
      if (!(!o || o.substr(-1, 1) === ":")) {
        i += t.sep + o;
        var s;
        try {
          s = t.fs.statSync(i);
        } catch (a) {
          if (a.message && a.message.startsWith("ENOENT"))
            t.fs.mkdirSync(i);
          else
            throw a;
        }
        if (s && s.isFile()) throw n1.FILE_IN_THE_WAY(`"${i}"`);
      }
    });
  }
  n(e);
};
We.prototype.writeFileTo = function(e, t, n, r) {
  const i = this;
  if (i.fs.existsSync(e)) {
    if (!n) return !1;
    var o = i.fs.statSync(e);
    if (o.isDirectory())
      return !1;
  }
  var s = Ze.dirname(e);
  i.fs.existsSync(s) || i.makeDir(s);
  var a;
  try {
    a = i.fs.openSync(e, "w", 438);
  } catch {
    i.fs.chmodSync(e, 438), a = i.fs.openSync(e, "w", 438);
  }
  if (a)
    try {
      i.fs.writeSync(a, t, 0, t.length, 0);
    } finally {
      i.fs.closeSync(a);
    }
  return i.fs.chmodSync(e, r || 438), !0;
};
We.prototype.writeFileToAsync = function(e, t, n, r, i) {
  typeof r == "function" && (i = r, r = void 0);
  const o = this;
  o.fs.exists(e, function(s) {
    if (s && !n) return i(!1);
    o.fs.stat(e, function(a, c) {
      if (s && c.isDirectory())
        return i(!1);
      var u = Ze.dirname(e);
      o.fs.exists(u, function(l) {
        l || o.makeDir(u), o.fs.open(e, "w", 438, function(f, h) {
          f ? o.fs.chmod(e, 438, function() {
            o.fs.open(e, "w", 438, function(d, m) {
              o.fs.write(m, t, 0, t.length, 0, function() {
                o.fs.close(m, function() {
                  o.fs.chmod(e, r || 438, function() {
                    i(!0);
                  });
                });
              });
            });
          }) : h ? o.fs.write(h, t, 0, t.length, 0, function() {
            o.fs.close(h, function() {
              o.fs.chmod(e, r || 438, function() {
                i(!0);
              });
            });
          }) : o.fs.chmod(e, r || 438, function() {
            i(!0);
          });
        });
      });
    });
  });
};
We.prototype.findFiles = function(e) {
  const t = this;
  function n(r, i, o) {
    let s = [];
    return t.fs.readdirSync(r).forEach(function(a) {
      const c = Ze.join(r, a), u = t.fs.statSync(c);
      s.push(Ze.normalize(c) + (u.isDirectory() ? t.sep : "")), u.isDirectory() && o && (s = s.concat(n(c, i, o)));
    }), s;
  }
  return n(e, void 0, !0);
};
We.prototype.findFilesAsync = function(e, t) {
  const n = this;
  let r = [];
  n.fs.readdir(e, function(i, o) {
    if (i) return t(i);
    let s = o.length;
    if (!s) return t(null, r);
    o.forEach(function(a) {
      a = Ze.join(e, a), n.fs.stat(a, function(c, u) {
        if (c) return t(c);
        u && (r.push(Ze.normalize(a) + (u.isDirectory() ? n.sep : "")), u.isDirectory() ? n.findFilesAsync(a, function(l, f) {
          if (l) return t(l);
          r = r.concat(f), --s || t(null, r);
        }) : --s || t(null, r));
      });
    });
  });
};
We.prototype.getAttributes = function() {
};
We.prototype.setAttributes = function() {
};
We.crc32update = function(e, t) {
  return ig[(e ^ t) & 255] ^ e >>> 8;
};
We.crc32 = function(e) {
  typeof e == "string" && (e = Buffer.from(e, "utf8"));
  let t = e.length, n = -1;
  for (let r = 0; r < t; ) n = We.crc32update(n, e[r++]);
  return ~n >>> 0;
};
We.methodToString = function(e) {
  switch (e) {
    case Md.STORED:
      return "STORED (" + e + ")";
    case Md.DEFLATED:
      return "DEFLATED (" + e + ")";
    default:
      return "UNSUPPORTED (" + e + ")";
  }
};
We.canonical = function(e) {
  if (!e) return "";
  const t = Ze.posix.normalize("/" + e.split("\\").join("/"));
  return Ze.join(".", t);
};
We.zipnamefix = function(e) {
  if (!e) return "";
  const t = Ze.posix.normalize("/" + e.split("\\").join("/"));
  return Ze.posix.join(".", t);
};
We.findLast = function(e, t) {
  if (!Array.isArray(e)) throw new TypeError("arr is not array");
  const n = e.length >>> 0;
  for (let r = n - 1; r >= 0; r--)
    if (t(e[r], r, e))
      return e[r];
};
We.sanitize = function(e, t) {
  e = Ze.resolve(Ze.normalize(e));
  for (var n = t.split("/"), r = 0, i = n.length; r < i; r++) {
    var o = Ze.normalize(Ze.join(e, n.slice(r, i).join(Ze.sep)));
    if (o.indexOf(e) === 0)
      return o;
  }
  return Ze.normalize(Ze.join(e, Ze.basename(t)));
};
We.toBuffer = function(t, n) {
  return Buffer.isBuffer(t) ? t : t instanceof Uint8Array ? Buffer.from(t) : typeof t == "string" ? n(t) : Buffer.alloc(0);
};
We.readBigUInt64LE = function(e, t) {
  const n = e.readUInt32LE(t);
  return e.readUInt32LE(t + 4) * 4294967296 + n;
};
We.fromDOS2Date = function(e) {
  return new Date((e >> 25 & 127) + 1980, Math.max((e >> 21 & 15) - 1, 0), Math.max(e >> 16 & 31, 1), e >> 11 & 31, e >> 5 & 63, (e & 31) << 1);
};
We.fromDate2DOS = function(e) {
  let t = 0, n = 0;
  return e.getFullYear() > 1979 && (t = (e.getFullYear() - 1980 & 127) << 9 | e.getMonth() + 1 << 5 | e.getDate(), n = e.getHours() << 11 | e.getMinutes() << 5 | e.getSeconds() >> 1), t << 16 | n;
};
We.isWin = r1;
We.crcTable = ig;
const o1 = D;
var s1 = function(e, { fs: t }) {
  var n = e || "", r = o(), i = null;
  function o() {
    return {
      directory: !1,
      readonly: !1,
      hidden: !1,
      executable: !1,
      mtime: 0,
      atime: 0
    };
  }
  return n && t.existsSync(n) ? (i = t.statSync(n), r.directory = i.isDirectory(), r.mtime = i.mtime, r.atime = i.atime, r.executable = (73 & i.mode) !== 0, r.readonly = (128 & i.mode) === 0, r.hidden = o1.basename(n)[0] === ".") : console.warn("Invalid path: " + n), {
    get directory() {
      return r.directory;
    },
    get readOnly() {
      return r.readonly;
    },
    get hidden() {
      return r.hidden;
    },
    get mtime() {
      return r.mtime;
    },
    get atime() {
      return r.atime;
    },
    get executable() {
      return r.executable;
    },
    decodeAttributes: function() {
    },
    encodeAttributes: function() {
    },
    toJSON: function() {
      return {
        path: n,
        isDirectory: r.directory,
        isReadOnly: r.readonly,
        isHidden: r.hidden,
        isExecutable: r.executable,
        mTime: r.mtime,
        aTime: r.atime
      };
    },
    toString: function() {
      return JSON.stringify(this.toJSON(), null, "	");
    }
  };
}, a1 = {
  efs: !0,
  encode: (e) => Buffer.from(e, "utf8"),
  decode: (e) => e.toString("utf8")
};
Ui.exports = i1;
Ui.exports.Constants = rg;
Ui.exports.Errors = ka;
Ui.exports.FileAttr = s1;
Ui.exports.decoder = a1;
var zo = Ui.exports, Ua = {}, Yn = zo, ee = Yn.Constants, c1 = function() {
  var e = 20, t = 10, n = 0, r = 0, i = 0, o = 0, s = 0, a = 0, c = 0, u = 0, l = 0, f = 0, h = 0, d = 0, m = 0;
  e |= Yn.isWin ? 2560 : 768, n |= ee.FLG_EFS;
  const p = {
    extraLen: 0
  }, v = (g) => Math.max(0, g) >>> 0, y = (g) => Math.max(0, g) & 255;
  return i = Yn.fromDate2DOS(/* @__PURE__ */ new Date()), {
    get made() {
      return e;
    },
    set made(g) {
      e = g;
    },
    get version() {
      return t;
    },
    set version(g) {
      t = g;
    },
    get flags() {
      return n;
    },
    set flags(g) {
      n = g;
    },
    get flags_efs() {
      return (n & ee.FLG_EFS) > 0;
    },
    set flags_efs(g) {
      g ? n |= ee.FLG_EFS : n &= ~ee.FLG_EFS;
    },
    get flags_desc() {
      return (n & ee.FLG_DESC) > 0;
    },
    set flags_desc(g) {
      g ? n |= ee.FLG_DESC : n &= ~ee.FLG_DESC;
    },
    get method() {
      return r;
    },
    set method(g) {
      switch (g) {
        case ee.STORED:
          this.version = 10;
        case ee.DEFLATED:
        default:
          this.version = 20;
      }
      r = g;
    },
    get time() {
      return Yn.fromDOS2Date(this.timeval);
    },
    set time(g) {
      g = new Date(g), this.timeval = Yn.fromDate2DOS(g);
    },
    get timeval() {
      return i;
    },
    set timeval(g) {
      i = v(g);
    },
    get timeHighByte() {
      return y(i >>> 8);
    },
    get crc() {
      return o;
    },
    set crc(g) {
      o = v(g);
    },
    get compressedSize() {
      return s;
    },
    set compressedSize(g) {
      s = v(g);
    },
    get size() {
      return a;
    },
    set size(g) {
      a = v(g);
    },
    get fileNameLength() {
      return c;
    },
    set fileNameLength(g) {
      c = g;
    },
    get extraLength() {
      return u;
    },
    set extraLength(g) {
      u = g;
    },
    get extraLocalLength() {
      return p.extraLen;
    },
    set extraLocalLength(g) {
      p.extraLen = g;
    },
    get commentLength() {
      return l;
    },
    set commentLength(g) {
      l = g;
    },
    get diskNumStart() {
      return f;
    },
    set diskNumStart(g) {
      f = v(g);
    },
    get inAttr() {
      return h;
    },
    set inAttr(g) {
      h = v(g);
    },
    get attr() {
      return d;
    },
    set attr(g) {
      d = v(g);
    },
    // get Unix file permissions
    get fileAttr() {
      return (d || 0) >> 16 & 4095;
    },
    get offset() {
      return m;
    },
    set offset(g) {
      m = v(g);
    },
    get encrypted() {
      return (n & ee.FLG_ENC) === ee.FLG_ENC;
    },
    get centralHeaderSize() {
      return ee.CENHDR + c + u + l;
    },
    get realDataOffset() {
      return m + ee.LOCHDR + p.fnameLen + p.extraLen;
    },
    get localHeader() {
      return p;
    },
    loadLocalHeaderFromBinary: function(g) {
      var E = g.slice(m, m + ee.LOCHDR);
      if (E.readUInt32LE(0) !== ee.LOCSIG)
        throw Yn.Errors.INVALID_LOC();
      p.version = E.readUInt16LE(ee.LOCVER), p.flags = E.readUInt16LE(ee.LOCFLG), p.flags_desc = (p.flags & ee.FLG_DESC) > 0, p.method = E.readUInt16LE(ee.LOCHOW), p.time = E.readUInt32LE(ee.LOCTIM), p.crc = E.readUInt32LE(ee.LOCCRC), p.compressedSize = E.readUInt32LE(ee.LOCSIZ), p.size = E.readUInt32LE(ee.LOCLEN), p.fnameLen = E.readUInt16LE(ee.LOCNAM), p.extraLen = E.readUInt16LE(ee.LOCEXT);
      const S = m + ee.LOCHDR + p.fnameLen, C = S + p.extraLen;
      return g.slice(S, C);
    },
    loadFromBinary: function(g) {
      if (g.length !== ee.CENHDR || g.readUInt32LE(0) !== ee.CENSIG)
        throw Yn.Errors.INVALID_CEN();
      e = g.readUInt16LE(ee.CENVEM), t = g.readUInt16LE(ee.CENVER), n = g.readUInt16LE(ee.CENFLG), r = g.readUInt16LE(ee.CENHOW), i = g.readUInt32LE(ee.CENTIM), o = g.readUInt32LE(ee.CENCRC), s = g.readUInt32LE(ee.CENSIZ), a = g.readUInt32LE(ee.CENLEN), c = g.readUInt16LE(ee.CENNAM), u = g.readUInt16LE(ee.CENEXT), l = g.readUInt16LE(ee.CENCOM), f = g.readUInt16LE(ee.CENDSK), h = g.readUInt16LE(ee.CENATT), d = g.readUInt32LE(ee.CENATX), m = g.readUInt32LE(ee.CENOFF);
    },
    localHeaderToBinary: function() {
      var g = Buffer.alloc(ee.LOCHDR);
      return g.writeUInt32LE(ee.LOCSIG, 0), g.writeUInt16LE(t, ee.LOCVER), g.writeUInt16LE(n, ee.LOCFLG), g.writeUInt16LE(r, ee.LOCHOW), g.writeUInt32LE(i, ee.LOCTIM), g.writeUInt32LE(o, ee.LOCCRC), g.writeUInt32LE(s, ee.LOCSIZ), g.writeUInt32LE(a, ee.LOCLEN), g.writeUInt16LE(c, ee.LOCNAM), g.writeUInt16LE(p.extraLen, ee.LOCEXT), g;
    },
    centralHeaderToBinary: function() {
      var g = Buffer.alloc(ee.CENHDR + c + u + l);
      return g.writeUInt32LE(ee.CENSIG, 0), g.writeUInt16LE(e, ee.CENVEM), g.writeUInt16LE(t, ee.CENVER), g.writeUInt16LE(n, ee.CENFLG), g.writeUInt16LE(r, ee.CENHOW), g.writeUInt32LE(i, ee.CENTIM), g.writeUInt32LE(o, ee.CENCRC), g.writeUInt32LE(s, ee.CENSIZ), g.writeUInt32LE(a, ee.CENLEN), g.writeUInt16LE(c, ee.CENNAM), g.writeUInt16LE(u, ee.CENEXT), g.writeUInt16LE(l, ee.CENCOM), g.writeUInt16LE(f, ee.CENDSK), g.writeUInt16LE(h, ee.CENATT), g.writeUInt32LE(d, ee.CENATX), g.writeUInt32LE(m, ee.CENOFF), g;
    },
    toJSON: function() {
      const g = function(E) {
        return E + " bytes";
      };
      return {
        made: e,
        version: t,
        flags: n,
        method: Yn.methodToString(r),
        time: this.time,
        crc: "0x" + o.toString(16).toUpperCase(),
        compressedSize: g(s),
        size: g(a),
        fileNameLength: g(c),
        extraLength: g(u),
        commentLength: g(l),
        diskNumStart: f,
        inAttr: h,
        attr: d,
        offset: m,
        centralHeaderSize: g(ee.CENHDR + c + u + l)
      };
    },
    toString: function() {
      return JSON.stringify(this.toJSON(), null, "	");
    }
  };
}, fi = zo, Me = fi.Constants, l1 = function() {
  var e = 0, t = 0, n = 0, r = 0, i = 0;
  return {
    get diskEntries() {
      return e;
    },
    set diskEntries(o) {
      e = t = o;
    },
    get totalEntries() {
      return t;
    },
    set totalEntries(o) {
      t = e = o;
    },
    get size() {
      return n;
    },
    set size(o) {
      n = o;
    },
    get offset() {
      return r;
    },
    set offset(o) {
      r = o;
    },
    get commentLength() {
      return i;
    },
    set commentLength(o) {
      i = o;
    },
    get mainHeaderSize() {
      return Me.ENDHDR + i;
    },
    loadFromBinary: function(o) {
      if ((o.length !== Me.ENDHDR || o.readUInt32LE(0) !== Me.ENDSIG) && (o.length < Me.ZIP64HDR || o.readUInt32LE(0) !== Me.ZIP64SIG))
        throw fi.Errors.INVALID_END();
      o.readUInt32LE(0) === Me.ENDSIG ? (e = o.readUInt16LE(Me.ENDSUB), t = o.readUInt16LE(Me.ENDTOT), n = o.readUInt32LE(Me.ENDSIZ), r = o.readUInt32LE(Me.ENDOFF), i = o.readUInt16LE(Me.ENDCOM)) : (e = fi.readBigUInt64LE(o, Me.ZIP64SUB), t = fi.readBigUInt64LE(o, Me.ZIP64TOT), n = fi.readBigUInt64LE(o, Me.ZIP64SIZE), r = fi.readBigUInt64LE(o, Me.ZIP64OFF), i = 0);
    },
    toBinary: function() {
      var o = Buffer.alloc(Me.ENDHDR + i);
      return o.writeUInt32LE(Me.ENDSIG, 0), o.writeUInt32LE(0, 4), o.writeUInt16LE(e, Me.ENDSUB), o.writeUInt16LE(t, Me.ENDTOT), o.writeUInt32LE(n, Me.ENDSIZ), o.writeUInt32LE(r, Me.ENDOFF), o.writeUInt16LE(i, Me.ENDCOM), o.fill(" ", Me.ENDHDR), o;
    },
    toJSON: function() {
      const o = function(s, a) {
        let c = s.toString(16).toUpperCase();
        for (; c.length < a; ) c = "0" + c;
        return "0x" + c;
      };
      return {
        diskEntries: e,
        totalEntries: t,
        size: n + " bytes",
        offset: o(r, 4),
        commentLength: i
      };
    },
    toString: function() {
      return JSON.stringify(this.toJSON(), null, "	");
    }
  };
};
Ua.EntryHeader = c1;
Ua.MainHeader = l1;
var ja = {}, u1 = function(e) {
  var t = jo, n = { chunkSize: (parseInt(e.length / 1024) + 1) * 1024 };
  return {
    deflate: function() {
      return t.deflateRawSync(e, n);
    },
    deflateAsync: function(r) {
      var i = t.createDeflateRaw(n), o = [], s = 0;
      i.on("data", function(a) {
        o.push(a), s += a.length;
      }), i.on("end", function() {
        var a = Buffer.alloc(s), c = 0;
        a.fill(0);
        for (var u = 0; u < o.length; u++) {
          var l = o[u];
          l.copy(a, c), c += l.length;
        }
        r && r(a);
      }), i.end(e);
    }
  };
};
const f1 = +(process.versions ? process.versions.node : "").split(".")[0] || 0;
var d1 = function(e, t) {
  var n = jo;
  const r = f1 >= 15 && t > 0 ? { maxOutputLength: t } : {};
  return {
    inflate: function() {
      return n.inflateRawSync(e, r);
    },
    inflateAsync: function(i) {
      var o = n.createInflateRaw(r), s = [], a = 0;
      o.on("data", function(c) {
        s.push(c), a += c.length;
      }), o.on("end", function() {
        var c = Buffer.alloc(a), u = 0;
        c.fill(0);
        for (var l = 0; l < s.length; l++) {
          var f = s[l];
          f.copy(c, u), u += f.length;
        }
        i && i(c);
      }), o.end(e);
    }
  };
};
const { randomFillSync: Hd } = Oi, h1 = ka, p1 = new Uint32Array(256).map((e, t) => {
  for (let n = 0; n < 8; n++)
    t & 1 ? t = t >>> 1 ^ 3988292384 : t >>>= 1;
  return t >>> 0;
}), og = (e, t) => Math.imul(e, t) >>> 0, qd = (e, t) => p1[(e ^ t) & 255] ^ e >>> 8, $o = () => typeof Hd == "function" ? Hd(Buffer.alloc(12)) : $o.node();
$o.node = () => {
  const e = Buffer.alloc(12), t = e.length;
  for (let n = 0; n < t; n++) e[n] = Math.random() * 256 & 255;
  return e;
};
const Gs = {
  genSalt: $o
};
function Ma(e) {
  const t = Buffer.isBuffer(e) ? e : Buffer.from(e);
  this.keys = new Uint32Array([305419896, 591751049, 878082192]);
  for (let n = 0; n < t.length; n++)
    this.updateKeys(t[n]);
}
Ma.prototype.updateKeys = function(e) {
  const t = this.keys;
  return t[0] = qd(t[0], e), t[1] += t[0] & 255, t[1] = og(t[1], 134775813) + 1, t[2] = qd(t[2], t[1] >>> 24), e;
};
Ma.prototype.next = function() {
  const e = (this.keys[2] | 2) >>> 0;
  return og(e, e ^ 1) >> 8 & 255;
};
function m1(e) {
  const t = new Ma(e);
  return function(n) {
    const r = Buffer.alloc(n.length);
    let i = 0;
    for (let o of n)
      r[i++] = t.updateKeys(o ^ t.next());
    return r;
  };
}
function g1(e) {
  const t = new Ma(e);
  return function(n, r, i = 0) {
    r || (r = Buffer.alloc(n.length));
    for (let o of n) {
      const s = t.next();
      r[i++] = o ^ s, t.updateKeys(o);
    }
    return r;
  };
}
function y1(e, t, n) {
  if (!e || !Buffer.isBuffer(e) || e.length < 12)
    return Buffer.alloc(0);
  const r = m1(n), i = r(e.slice(0, 12)), o = (t.flags & 8) === 8 ? t.timeHighByte : t.crc >>> 24;
  if (i[11] !== o)
    throw h1.WRONG_PASSWORD();
  return r(e.slice(12));
}
function v1(e) {
  Buffer.isBuffer(e) && e.length >= 12 ? Gs.genSalt = function() {
    return e.slice(0, 12);
  } : e === "node" ? Gs.genSalt = $o.node : Gs.genSalt = $o;
}
function w1(e, t, n, r = !1) {
  e == null && (e = Buffer.alloc(0)), Buffer.isBuffer(e) || (e = Buffer.from(e.toString()));
  const i = g1(n), o = Gs.genSalt();
  o[11] = t.crc >>> 24 & 255, r && (o[10] = t.crc >>> 16 & 255);
  const s = Buffer.alloc(e.length + 12);
  return i(o, s), i(e, s, 12);
}
var E1 = { decrypt: y1, encrypt: w1, _salter: v1 };
ja.Deflater = u1;
ja.Inflater = d1;
ja.ZipCrypto = E1;
var be = zo, _1 = Ua, Ge = be.Constants, Ic = ja, sg = function(e, t) {
  var n = new _1.EntryHeader(), r = Buffer.alloc(0), i = Buffer.alloc(0), o = !1, s = null, a = Buffer.alloc(0), c = Buffer.alloc(0), u = !0;
  const l = e, f = typeof l.decoder == "object" ? l.decoder : be.decoder;
  u = f.hasOwnProperty("efs") ? f.efs : !1;
  function h() {
    return !t || !(t instanceof Uint8Array) ? Buffer.alloc(0) : (c = n.loadLocalHeaderFromBinary(t), t.slice(n.realDataOffset, n.realDataOffset + n.compressedSize));
  }
  function d(E) {
    if (!n.flags_desc && !n.localHeader.flags_desc) {
      if (be.crc32(E) !== n.localHeader.crc)
        return !1;
    } else {
      const S = {}, C = n.realDataOffset + n.compressedSize;
      if (t.readUInt32LE(C) == Ge.LOCSIG || t.readUInt32LE(C) == Ge.CENSIG)
        throw be.Errors.DESCRIPTOR_NOT_EXIST();
      if (t.readUInt32LE(C) == Ge.EXTSIG)
        S.crc = t.readUInt32LE(C + Ge.EXTCRC), S.compressedSize = t.readUInt32LE(C + Ge.EXTSIZ), S.size = t.readUInt32LE(C + Ge.EXTLEN);
      else if (t.readUInt16LE(C + 12) === 19280)
        S.crc = t.readUInt32LE(C + Ge.EXTCRC - 4), S.compressedSize = t.readUInt32LE(C + Ge.EXTSIZ - 4), S.size = t.readUInt32LE(C + Ge.EXTLEN - 4);
      else
        throw be.Errors.DESCRIPTOR_UNKNOWN();
      if (S.compressedSize !== n.compressedSize || S.size !== n.size || S.crc !== n.crc)
        throw be.Errors.DESCRIPTOR_FAULTY();
      if (be.crc32(E) !== S.crc)
        return !1;
    }
    return !0;
  }
  function m(E, S, C) {
    if (typeof S > "u" && typeof E == "string" && (C = E, E = void 0), o)
      return E && S && S(Buffer.alloc(0), be.Errors.DIRECTORY_CONTENT_ERROR()), Buffer.alloc(0);
    var U = h();
    if (U.length === 0)
      return E && S && S(U), U;
    if (n.encrypted) {
      if (typeof C != "string" && !Buffer.isBuffer(C))
        throw be.Errors.INVALID_PASS_PARAM();
      U = Ic.ZipCrypto.decrypt(U, n, C);
    }
    var G = Buffer.alloc(n.size);
    switch (n.method) {
      case be.Constants.STORED:
        if (U.copy(G), d(G))
          return E && S && S(G), G;
        throw E && S && S(G, be.Errors.BAD_CRC()), be.Errors.BAD_CRC();
      case be.Constants.DEFLATED:
        var z = new Ic.Inflater(U, n.size);
        if (E)
          z.inflateAsync(function(H) {
            H.copy(H, 0), S && (d(H) ? S(H) : S(H, be.Errors.BAD_CRC()));
          });
        else {
          if (z.inflate(G).copy(G, 0), !d(G))
            throw be.Errors.BAD_CRC(`"${f.decode(r)}"`);
          return G;
        }
        break;
      default:
        throw E && S && S(Buffer.alloc(0), be.Errors.UNKNOWN_METHOD()), be.Errors.UNKNOWN_METHOD();
    }
  }
  function p(E, S) {
    if ((!s || !s.length) && Buffer.isBuffer(t))
      return E && S && S(h()), h();
    if (s.length && !o) {
      var C;
      switch (n.method) {
        case be.Constants.STORED:
          return n.compressedSize = n.size, C = Buffer.alloc(s.length), s.copy(C), E && S && S(C), C;
        default:
        case be.Constants.DEFLATED:
          var U = new Ic.Deflater(s);
          if (E)
            U.deflateAsync(function(z) {
              C = Buffer.alloc(z.length), n.compressedSize = z.length, z.copy(C), S && S(C);
            });
          else {
            var G = U.deflate();
            return n.compressedSize = G.length, G;
          }
          U = null;
          break;
      }
    } else if (E && S)
      S(Buffer.alloc(0));
    else
      return Buffer.alloc(0);
  }
  function v(E, S) {
    return be.readBigUInt64LE(E, S);
  }
  function y(E) {
    try {
      for (var S = 0, C, U, G; S + 4 < E.length; )
        C = E.readUInt16LE(S), S += 2, U = E.readUInt16LE(S), S += 2, G = E.slice(S, S + U), S += U, Ge.ID_ZIP64 === C && g(G);
    } catch {
      throw be.Errors.EXTRA_FIELD_PARSE_ERROR();
    }
  }
  function g(E) {
    var S, C, U, G;
    E.length >= Ge.EF_ZIP64_SCOMP && (S = v(E, Ge.EF_ZIP64_SUNCOMP), n.size === Ge.EF_ZIP64_OR_32 && (n.size = S)), E.length >= Ge.EF_ZIP64_RHO && (C = v(E, Ge.EF_ZIP64_SCOMP), n.compressedSize === Ge.EF_ZIP64_OR_32 && (n.compressedSize = C)), E.length >= Ge.EF_ZIP64_DSN && (U = v(E, Ge.EF_ZIP64_RHO), n.offset === Ge.EF_ZIP64_OR_32 && (n.offset = U)), E.length >= Ge.EF_ZIP64_DSN + 4 && (G = E.readUInt32LE(Ge.EF_ZIP64_DSN), n.diskNumStart === Ge.EF_ZIP64_OR_16 && (n.diskNumStart = G));
  }
  return {
    get entryName() {
      return f.decode(r);
    },
    get rawEntryName() {
      return r;
    },
    set entryName(E) {
      r = be.toBuffer(E, f.encode);
      var S = r[r.length - 1];
      o = S === 47 || S === 92, n.fileNameLength = r.length;
    },
    get efs() {
      return typeof u == "function" ? u(this.entryName) : u;
    },
    get extra() {
      return a;
    },
    set extra(E) {
      a = E, n.extraLength = E.length, y(E);
    },
    get comment() {
      return f.decode(i);
    },
    set comment(E) {
      if (i = be.toBuffer(E, f.encode), n.commentLength = i.length, i.length > 65535) throw be.Errors.COMMENT_TOO_LONG();
    },
    get name() {
      var E = f.decode(r);
      return o ? E.substr(E.length - 1).split("/").pop() : E.split("/").pop();
    },
    get isDirectory() {
      return o;
    },
    getCompressedData: function() {
      return p(!1, null);
    },
    getCompressedDataAsync: function(E) {
      p(!0, E);
    },
    setData: function(E) {
      s = be.toBuffer(E, be.decoder.encode), !o && s.length ? (n.size = s.length, n.method = be.Constants.DEFLATED, n.crc = be.crc32(E), n.changed = !0) : n.method = be.Constants.STORED;
    },
    getData: function(E) {
      return n.changed ? s : m(!1, null, E);
    },
    getDataAsync: function(E, S) {
      n.changed ? E(s) : m(!0, E, S);
    },
    set attr(E) {
      n.attr = E;
    },
    get attr() {
      return n.attr;
    },
    set header(E) {
      n.loadFromBinary(E);
    },
    get header() {
      return n;
    },
    packCentralHeader: function() {
      n.flags_efs = this.efs, n.extraLength = a.length;
      var E = n.centralHeaderToBinary(), S = be.Constants.CENHDR;
      return r.copy(E, S), S += r.length, a.copy(E, S), S += n.extraLength, i.copy(E, S), E;
    },
    packLocalHeader: function() {
      let E = 0;
      n.flags_efs = this.efs, n.extraLocalLength = c.length;
      const S = n.localHeaderToBinary(), C = Buffer.alloc(S.length + r.length + n.extraLocalLength);
      return S.copy(C, E), E += S.length, r.copy(C, E), E += r.length, c.copy(C, E), E += c.length, C;
    },
    toJSON: function() {
      const E = function(S) {
        return "<" + (S && S.length + " bytes buffer" || "null") + ">";
      };
      return {
        entryName: this.entryName,
        name: this.name,
        comment: this.comment,
        isDirectory: this.isDirectory,
        header: n.toJSON(),
        compressedData: E(t),
        data: E(s)
      };
    },
    toString: function() {
      return JSON.stringify(this.toJSON(), null, "	");
    }
  };
};
const zd = sg, $1 = Ua, ct = zo;
var S1 = function(e, t) {
  var n = [], r = {}, i = Buffer.alloc(0), o = new $1.MainHeader(), s = !1;
  const a = /* @__PURE__ */ new Set(), c = t, { noSort: u, decoder: l } = c;
  e ? d(c.readEntries) : s = !0;
  function f() {
    const p = /* @__PURE__ */ new Set();
    for (const v of Object.keys(r)) {
      const y = v.split("/");
      if (y.pop(), !!y.length)
        for (let g = 0; g < y.length; g++) {
          const E = y.slice(0, g + 1).join("/") + "/";
          p.add(E);
        }
    }
    for (const v of p)
      if (!(v in r)) {
        const y = new zd(c);
        y.entryName = v, y.attr = 16, y.temporary = !0, n.push(y), r[y.entryName] = y, a.add(y);
      }
  }
  function h() {
    if (s = !0, r = {}, o.diskEntries > (e.length - o.offset) / ct.Constants.CENHDR)
      throw ct.Errors.DISK_ENTRY_TOO_LARGE();
    n = new Array(o.diskEntries);
    for (var p = o.offset, v = 0; v < n.length; v++) {
      var y = p, g = new zd(c, e);
      g.header = e.slice(y, y += ct.Constants.CENHDR), g.entryName = e.slice(y, y += g.header.fileNameLength), g.header.extraLength && (g.extra = e.slice(y, y += g.header.extraLength)), g.header.commentLength && (g.comment = e.slice(y, y + g.header.commentLength)), p += g.header.centralHeaderSize, n[v] = g, r[g.entryName] = g;
    }
    a.clear(), f();
  }
  function d(p) {
    var v = e.length - ct.Constants.ENDHDR, y = Math.max(0, v - 65535), g = y, E = e.length, S = -1, C = 0;
    for ((typeof c.trailingSpace == "boolean" ? c.trailingSpace : !1) && (y = 0), v; v >= g; v--)
      if (e[v] === 80) {
        if (e.readUInt32LE(v) === ct.Constants.ENDSIG) {
          S = v, C = v, E = v + ct.Constants.ENDHDR, g = v - ct.Constants.END64HDR;
          continue;
        }
        if (e.readUInt32LE(v) === ct.Constants.END64SIG) {
          g = y;
          continue;
        }
        if (e.readUInt32LE(v) === ct.Constants.ZIP64SIG) {
          S = v, E = v + ct.readBigUInt64LE(e, v + ct.Constants.ZIP64SIZE) + ct.Constants.ZIP64LEAD;
          break;
        }
      }
    if (S == -1) throw ct.Errors.INVALID_FORMAT();
    o.loadFromBinary(e.slice(S, E)), o.commentLength && (i = e.slice(C + ct.Constants.ENDHDR)), p && h();
  }
  function m() {
    n.length > 1 && !u && n.sort((p, v) => p.entryName.toLowerCase().localeCompare(v.entryName.toLowerCase()));
  }
  return {
    /**
     * Returns an array of ZipEntry objects existent in the current opened archive
     * @return Array
     */
    get entries() {
      return s || h(), n.filter((p) => !a.has(p));
    },
    /**
     * Archive comment
     * @return {String}
     */
    get comment() {
      return l.decode(i);
    },
    set comment(p) {
      i = ct.toBuffer(p, l.encode), o.commentLength = i.length;
    },
    getEntryCount: function() {
      return s ? n.length : o.diskEntries;
    },
    forEach: function(p) {
      this.entries.forEach(p);
    },
    /**
     * Returns a reference to the entry with the given name or null if entry is inexistent
     *
     * @param entryName
     * @return ZipEntry
     */
    getEntry: function(p) {
      return s || h(), r[p] || null;
    },
    /**
     * Adds the given entry to the entry list
     *
     * @param entry
     */
    setEntry: function(p) {
      s || h(), n.push(p), r[p.entryName] = p, o.totalEntries = n.length;
    },
    /**
     * Removes the file with the given name from the entry list.
     *
     * If the entry is a directory, then all nested files and directories will be removed
     * @param entryName
     * @returns {void}
     */
    deleteFile: function(p, v = !0) {
      s || h();
      const y = r[p];
      this.getEntryChildren(y, v).map((E) => E.entryName).forEach(this.deleteEntry);
    },
    /**
     * Removes the entry with the given name from the entry list.
     *
     * @param {string} entryName
     * @returns {void}
     */
    deleteEntry: function(p) {
      s || h();
      const v = r[p], y = n.indexOf(v);
      y >= 0 && (n.splice(y, 1), delete r[p], o.totalEntries = n.length);
    },
    /**
     *  Iterates and returns all nested files and directories of the given entry
     *
     * @param entry
     * @return Array
     */
    getEntryChildren: function(p, v = !0) {
      if (s || h(), typeof p == "object")
        if (p.isDirectory && v) {
          const y = [], g = p.entryName;
          for (const E of n)
            E.entryName.startsWith(g) && y.push(E);
          return y;
        } else
          return [p];
      return [];
    },
    /**
     *  How many child elements entry has
     *
     * @param {ZipEntry} entry
     * @return {integer}
     */
    getChildCount: function(p) {
      if (p && p.isDirectory) {
        const v = this.getEntryChildren(p);
        return v.includes(p) ? v.length - 1 : v.length;
      }
      return 0;
    },
    /**
     * Returns the zip file
     *
     * @return Buffer
     */
    compressToBuffer: function() {
      s || h(), m();
      const p = [], v = [];
      let y = 0, g = 0;
      o.size = 0, o.offset = 0;
      let E = 0;
      for (const U of this.entries) {
        const G = U.getCompressedData();
        U.header.offset = g;
        const z = U.packLocalHeader(), H = z.length + G.length;
        g += H, p.push(z), p.push(G);
        const b = U.packCentralHeader();
        v.push(b), o.size += b.length, y += H + b.length, E++;
      }
      y += o.mainHeaderSize, o.offset = g, o.totalEntries = E, g = 0;
      const S = Buffer.alloc(y);
      for (const U of p)
        U.copy(S, g), g += U.length;
      for (const U of v)
        U.copy(S, g), g += U.length;
      const C = o.toBinary();
      return i && i.copy(C, ct.Constants.ENDHDR), C.copy(S, g), e = S, s = !1, S;
    },
    toAsyncBuffer: function(p, v, y, g) {
      try {
        s || h(), m();
        const E = [], S = [];
        let C = 0, U = 0, G = 0;
        o.size = 0, o.offset = 0;
        const z = function(H) {
          if (H.length > 0) {
            const b = H.shift(), B = b.entryName + b.extra.toString();
            y && y(B), b.getCompressedDataAsync(function(V) {
              g && g(B), b.header.offset = U;
              const Z = b.packLocalHeader(), F = Z.length + V.length;
              U += F, E.push(Z), E.push(V);
              const x = b.packCentralHeader();
              S.push(x), o.size += x.length, C += F + x.length, G++, z(H);
            });
          } else {
            C += o.mainHeaderSize, o.offset = U, o.totalEntries = G, U = 0;
            const b = Buffer.alloc(C);
            E.forEach(function(V) {
              V.copy(b, U), U += V.length;
            }), S.forEach(function(V) {
              V.copy(b, U), U += V.length;
            });
            const B = o.toBinary();
            i && i.copy(B, ct.Constants.ENDHDR), B.copy(b, U), e = b, s = !1, p(b);
          }
        };
        z(Array.from(this.entries));
      } catch (E) {
        v(E);
      }
    }
  };
};
const He = zo, Be = D, b1 = sg, A1 = S1, $r = (...e) => He.findLast(e, (t) => typeof t == "boolean"), Vd = (...e) => He.findLast(e, (t) => typeof t == "string"), T1 = (...e) => He.findLast(e, (t) => typeof t == "function"), C1 = {
  // option "noSort" : if true it disables files sorting
  noSort: !1,
  // read entries during load (initial loading may be slower)
  readEntries: !1,
  // default method is none
  method: He.Constants.NONE,
  // file system
  fs: null
};
var N1 = function(e, t) {
  let n = null;
  const r = Object.assign(/* @__PURE__ */ Object.create(null), C1);
  e && typeof e == "object" && (e instanceof Uint8Array || (Object.assign(r, e), e = r.input ? r.input : void 0, r.input && delete r.input), Buffer.isBuffer(e) && (n = e, r.method = He.Constants.BUFFER, e = void 0)), Object.assign(r, t);
  const i = new He(r);
  if ((typeof r.decoder != "object" || typeof r.decoder.encode != "function" || typeof r.decoder.decode != "function") && (r.decoder = He.decoder), e && typeof e == "string")
    if (i.fs.existsSync(e))
      r.method = He.Constants.FILE, r.filename = e, n = i.fs.readFileSync(e);
    else
      throw He.Errors.INVALID_FILENAME();
  const o = new A1(n, r), { canonical: s, sanitize: a, zipnamefix: c } = He;
  function u(d) {
    if (d && o) {
      var m;
      if (typeof d == "string" && (m = o.getEntry(Be.posix.normalize(d))), typeof d == "object" && typeof d.entryName < "u" && typeof d.header < "u" && (m = o.getEntry(d.entryName)), m)
        return m;
    }
    return null;
  }
  function l(d) {
    const { join: m, normalize: p, sep: v } = Be.posix;
    return m(Be.isAbsolute(d) ? "/" : ".", p(v + d.split("\\").join(v) + v));
  }
  function f(d) {
    return d instanceof RegExp ? /* @__PURE__ */ function(m) {
      return function(p) {
        return m.test(p);
      };
    }(d) : typeof d != "function" ? () => !0 : d;
  }
  const h = (d, m) => {
    let p = m.slice(-1);
    return p = p === i.sep ? i.sep : "", Be.relative(d, m) + p;
  };
  return {
    /**
     * Extracts the given entry from the archive and returns the content as a Buffer object
     * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
     * @param {Buffer|string} [pass] - password
     * @return Buffer or Null in case of error
     */
    readFile: function(d, m) {
      var p = u(d);
      return p && p.getData(m) || null;
    },
    /**
     * Returns how many child elements has on entry (directories) on files it is always 0
     * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
     * @returns {integer}
     */
    childCount: function(d) {
      const m = u(d);
      if (m)
        return o.getChildCount(m);
    },
    /**
     * Asynchronous readFile
     * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
     * @param {callback} callback
     *
     * @return Buffer or Null in case of error
     */
    readFileAsync: function(d, m) {
      var p = u(d);
      p ? p.getDataAsync(m) : m(null, "getEntry failed for:" + d);
    },
    /**
     * Extracts the given entry from the archive and returns the content as plain text in the given encoding
     * @param {ZipEntry|string} entry - ZipEntry object or String with the full path of the entry
     * @param {string} encoding - Optional. If no encoding is specified utf8 is used
     *
     * @return String
     */
    readAsText: function(d, m) {
      var p = u(d);
      if (p) {
        var v = p.getData();
        if (v && v.length)
          return v.toString(m || "utf8");
      }
      return "";
    },
    /**
     * Asynchronous readAsText
     * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
     * @param {callback} callback
     * @param {string} [encoding] - Optional. If no encoding is specified utf8 is used
     *
     * @return String
     */
    readAsTextAsync: function(d, m, p) {
      var v = u(d);
      v ? v.getDataAsync(function(y, g) {
        if (g) {
          m(y, g);
          return;
        }
        y && y.length ? m(y.toString(p || "utf8")) : m("");
      }) : m("");
    },
    /**
     * Remove the entry from the file or the entry and all it's nested directories and files if the given entry is a directory
     *
     * @param {ZipEntry|string} entry
     * @returns {void}
     */
    deleteFile: function(d, m = !0) {
      var p = u(d);
      p && o.deleteFile(p.entryName, m);
    },
    /**
     * Remove the entry from the file or directory without affecting any nested entries
     *
     * @param {ZipEntry|string} entry
     * @returns {void}
     */
    deleteEntry: function(d) {
      var m = u(d);
      m && o.deleteEntry(m.entryName);
    },
    /**
     * Adds a comment to the zip. The zip must be rewritten after adding the comment.
     *
     * @param {string} comment
     */
    addZipComment: function(d) {
      o.comment = d;
    },
    /**
     * Returns the zip comment
     *
     * @return String
     */
    getZipComment: function() {
      return o.comment || "";
    },
    /**
     * Adds a comment to a specified zipEntry. The zip must be rewritten after adding the comment
     * The comment cannot exceed 65535 characters in length
     *
     * @param {ZipEntry} entry
     * @param {string} comment
     */
    addZipEntryComment: function(d, m) {
      var p = u(d);
      p && (p.comment = m);
    },
    /**
     * Returns the comment of the specified entry
     *
     * @param {ZipEntry} entry
     * @return String
     */
    getZipEntryComment: function(d) {
      var m = u(d);
      return m && m.comment || "";
    },
    /**
     * Updates the content of an existing entry inside the archive. The zip must be rewritten after updating the content
     *
     * @param {ZipEntry} entry
     * @param {Buffer} content
     */
    updateFile: function(d, m) {
      var p = u(d);
      p && p.setData(m);
    },
    /**
     * Adds a file from the disk to the archive
     *
     * @param {string} localPath File to add to zip
     * @param {string} [zipPath] Optional path inside the zip
     * @param {string} [zipName] Optional name for the file
     * @param {string} [comment] Optional file comment
     */
    addLocalFile: function(d, m, p, v) {
      if (i.fs.existsSync(d)) {
        m = m ? l(m) : "";
        const y = Be.win32.basename(Be.win32.normalize(d));
        m += p || y;
        const g = i.fs.statSync(d), E = g.isFile() ? i.fs.readFileSync(d) : Buffer.alloc(0);
        g.isDirectory() && (m += i.sep), this.addFile(m, E, v, g);
      } else
        throw He.Errors.FILE_NOT_FOUND(d);
    },
    /**
     * Callback for showing if everything was done.
     *
     * @callback doneCallback
     * @param {Error} err - Error object
     * @param {boolean} done - was request fully completed
     */
    /**
     * Adds a file from the disk to the archive
     *
     * @param {(object|string)} options - options object, if it is string it us used as localPath.
     * @param {string} options.localPath - Local path to the file.
     * @param {string} [options.comment] - Optional file comment.
     * @param {string} [options.zipPath] - Optional path inside the zip
     * @param {string} [options.zipName] - Optional name for the file
     * @param {doneCallback} callback - The callback that handles the response.
     */
    addLocalFileAsync: function(d, m) {
      d = typeof d == "object" ? d : { localPath: d };
      const p = Be.resolve(d.localPath), { comment: v } = d;
      let { zipPath: y, zipName: g } = d;
      const E = this;
      i.fs.stat(p, function(S, C) {
        if (S) return m(S, !1);
        y = y ? l(y) : "";
        const U = Be.win32.basename(Be.win32.normalize(p));
        if (y += g || U, C.isFile())
          i.fs.readFile(p, function(G, z) {
            return G ? m(G, !1) : (E.addFile(y, z, v, C), setImmediate(m, void 0, !0));
          });
        else if (C.isDirectory())
          return y += i.sep, E.addFile(y, Buffer.alloc(0), v, C), setImmediate(m, void 0, !0);
      });
    },
    /**
     * Adds a local directory and all its nested files and directories to the archive
     *
     * @param {string} localPath - local path to the folder
     * @param {string} [zipPath] - optional path inside zip
     * @param {(RegExp|function)} [filter] - optional RegExp or Function if files match will be included.
     */
    addLocalFolder: function(d, m, p) {
      if (p = f(p), m = m ? l(m) : "", d = Be.normalize(d), i.fs.existsSync(d)) {
        const v = i.findFiles(d), y = this;
        if (v.length)
          for (const g of v) {
            const E = Be.join(m, h(d, g));
            p(E) && y.addLocalFile(g, Be.dirname(E));
          }
      } else
        throw He.Errors.FILE_NOT_FOUND(d);
    },
    /**
     * Asynchronous addLocalFolder
     * @param {string} localPath
     * @param {callback} callback
     * @param {string} [zipPath] optional path inside zip
     * @param {RegExp|function} [filter] optional RegExp or Function if files match will
     *               be included.
     */
    addLocalFolderAsync: function(d, m, p, v) {
      v = f(v), p = p ? l(p) : "", d = Be.normalize(d);
      var y = this;
      i.fs.open(d, "r", function(g) {
        if (g && g.code === "ENOENT")
          m(void 0, He.Errors.FILE_NOT_FOUND(d));
        else if (g)
          m(void 0, g);
        else {
          var E = i.findFiles(d), S = -1, C = function() {
            if (S += 1, S < E.length) {
              var U = E[S], G = h(d, U).split("\\").join("/");
              G = G.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, ""), v(G) ? i.fs.stat(U, function(z, H) {
                z && m(void 0, z), H.isFile() ? i.fs.readFile(U, function(b, B) {
                  b ? m(void 0, b) : (y.addFile(p + G, B, "", H), C());
                }) : (y.addFile(p + G + "/", Buffer.alloc(0), "", H), C());
              }) : process.nextTick(() => {
                C();
              });
            } else
              m(!0, void 0);
          };
          C();
        }
      });
    },
    /**
     * Adds a local directory and all its nested files and directories to the archive
     *
     * @param {object | string} options - options object, if it is string it us used as localPath.
     * @param {string} options.localPath - Local path to the folder.
     * @param {string} [options.zipPath] - optional path inside zip.
     * @param {RegExp|function} [options.filter] - optional RegExp or Function if files match will be included.
     * @param {function|string} [options.namefix] - optional function to help fix filename
     * @param {doneCallback} callback - The callback that handles the response.
     *
     */
    addLocalFolderAsync2: function(d, m) {
      const p = this;
      d = typeof d == "object" ? d : { localPath: d }, localPath = Be.resolve(l(d.localPath));
      let { zipPath: v, filter: y, namefix: g } = d;
      y instanceof RegExp ? y = /* @__PURE__ */ function(C) {
        return function(U) {
          return C.test(U);
        };
      }(y) : typeof y != "function" && (y = function() {
        return !0;
      }), v = v ? l(v) : "", g == "latin1" && (g = (C) => C.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "")), typeof g != "function" && (g = (C) => C);
      const E = (C) => Be.join(v, g(h(localPath, C))), S = (C) => Be.win32.basename(Be.win32.normalize(g(C)));
      i.fs.open(localPath, "r", function(C) {
        C && C.code === "ENOENT" ? m(void 0, He.Errors.FILE_NOT_FOUND(localPath)) : C ? m(void 0, C) : i.findFilesAsync(localPath, function(U, G) {
          if (U) return m(U);
          G = G.filter((z) => y(E(z))), G.length || m(void 0, !1), setImmediate(
            G.reverse().reduce(function(z, H) {
              return function(b, B) {
                if (b || B === !1) return setImmediate(z, b, !1);
                p.addLocalFileAsync(
                  {
                    localPath: H,
                    zipPath: Be.dirname(E(H)),
                    zipName: S(H)
                  },
                  z
                );
              };
            }, m)
          );
        });
      });
    },
    /**
     * Adds a local directory and all its nested files and directories to the archive
     *
     * @param {string} localPath - path where files will be extracted
     * @param {object} props - optional properties
     * @param {string} [props.zipPath] - optional path inside zip
     * @param {RegExp|function} [props.filter] - optional RegExp or Function if files match will be included.
     * @param {function|string} [props.namefix] - optional function to help fix filename
     */
    addLocalFolderPromise: function(d, m) {
      return new Promise((p, v) => {
        this.addLocalFolderAsync2(Object.assign({ localPath: d }, m), (y, g) => {
          y && v(y), g && p(this);
        });
      });
    },
    /**
     * Allows you to create a entry (file or directory) in the zip file.
     * If you want to create a directory the entryName must end in / and a null buffer should be provided.
     * Comment and attributes are optional
     *
     * @param {string} entryName
     * @param {Buffer | string} content - file content as buffer or utf8 coded string
     * @param {string} [comment] - file comment
     * @param {number | object} [attr] - number as unix file permissions, object as filesystem Stats object
     */
    addFile: function(d, m, p, v) {
      d = c(d);
      let y = u(d);
      const g = y != null;
      g || (y = new b1(r), y.entryName = d), y.comment = p || "";
      const E = typeof v == "object" && v instanceof i.fs.Stats;
      E && (y.header.time = v.mtime);
      var S = y.isDirectory ? 16 : 0;
      let C = y.isDirectory ? 16384 : 32768;
      return E ? C |= 4095 & v.mode : typeof v == "number" ? C |= 4095 & v : C |= y.isDirectory ? 493 : 420, S = (S | C << 16) >>> 0, y.attr = S, y.setData(m), g || o.setEntry(y), y;
    },
    /**
     * Returns an array of ZipEntry objects representing the files and folders inside the archive
     *
     * @param {string} [password]
     * @returns Array
     */
    getEntries: function(d) {
      return o.password = d, o ? o.entries : [];
    },
    /**
     * Returns a ZipEntry object representing the file or folder specified by ``name``.
     *
     * @param {string} name
     * @return ZipEntry
     */
    getEntry: function(d) {
      return u(d);
    },
    getEntryCount: function() {
      return o.getEntryCount();
    },
    forEach: function(d) {
      return o.forEach(d);
    },
    /**
     * Extracts the given entry to the given targetPath
     * If the entry is a directory inside the archive, the entire directory and it's subdirectories will be extracted
     *
     * @param {string|ZipEntry} entry - ZipEntry object or String with the full path of the entry
     * @param {string} targetPath - Target folder where to write the file
     * @param {boolean} [maintainEntryPath=true] - If maintainEntryPath is true and the entry is inside a folder, the entry folder will be created in targetPath as well. Default is TRUE
     * @param {boolean} [overwrite=false] - If the file already exists at the target path, the file will be overwriten if this is true.
     * @param {boolean} [keepOriginalPermission=false] - The file will be set as the permission from the entry if this is true.
     * @param {string} [outFileName] - String If set will override the filename of the extracted file (Only works if the entry is a file)
     *
     * @return Boolean
     */
    extractEntryTo: function(d, m, p, v, y, g) {
      v = $r(!1, v), y = $r(!1, y), p = $r(!0, p), g = Vd(y, g);
      var E = u(d);
      if (!E)
        throw He.Errors.NO_ENTRY();
      var S = s(E.entryName), C = a(m, g && !E.isDirectory ? g : p ? S : Be.basename(S));
      if (E.isDirectory) {
        var U = o.getEntryChildren(E);
        return U.forEach(function(H) {
          if (H.isDirectory) return;
          var b = H.getData();
          if (!b)
            throw He.Errors.CANT_EXTRACT_FILE();
          var B = s(H.entryName), V = a(m, p ? B : Be.basename(B));
          const Z = y ? H.header.fileAttr : void 0;
          i.writeFileTo(V, b, v, Z);
        }), !0;
      }
      var G = E.getData(o.password);
      if (!G) throw He.Errors.CANT_EXTRACT_FILE();
      if (i.fs.existsSync(C) && !v)
        throw He.Errors.CANT_OVERRIDE();
      const z = y ? d.header.fileAttr : void 0;
      return i.writeFileTo(C, G, v, z), !0;
    },
    /**
     * Test the archive
     * @param {string} [pass]
     */
    test: function(d) {
      if (!o)
        return !1;
      for (var m in o.entries)
        try {
          if (m.isDirectory)
            continue;
          var p = o.entries[m].getData(d);
          if (!p)
            return !1;
        } catch {
          return !1;
        }
      return !0;
    },
    /**
     * Extracts the entire archive to the given location
     *
     * @param {string} targetPath Target location
     * @param {boolean} [overwrite=false] If the file already exists at the target path, the file will be overwriten if this is true.
     *                  Default is FALSE
     * @param {boolean} [keepOriginalPermission=false] The file will be set as the permission from the entry if this is true.
     *                  Default is FALSE
     * @param {string|Buffer} [pass] password
     */
    extractAllTo: function(d, m, p, v) {
      if (p = $r(!1, p), v = Vd(p, v), m = $r(!1, m), !o) throw He.Errors.NO_ZIP();
      o.entries.forEach(function(y) {
        var g = a(d, s(y.entryName));
        if (y.isDirectory) {
          i.makeDir(g);
          return;
        }
        var E = y.getData(v);
        if (!E)
          throw He.Errors.CANT_EXTRACT_FILE();
        const S = p ? y.header.fileAttr : void 0;
        i.writeFileTo(g, E, m, S);
        try {
          i.fs.utimesSync(g, y.header.time, y.header.time);
        } catch {
          throw He.Errors.CANT_EXTRACT_FILE();
        }
      });
    },
    /**
     * Asynchronous extractAllTo
     *
     * @param {string} targetPath Target location
     * @param {boolean} [overwrite=false] If the file already exists at the target path, the file will be overwriten if this is true.
     *                  Default is FALSE
     * @param {boolean} [keepOriginalPermission=false] The file will be set as the permission from the entry if this is true.
     *                  Default is FALSE
     * @param {function} callback The callback will be executed when all entries are extracted successfully or any error is thrown.
     */
    extractAllToAsync: function(d, m, p, v) {
      if (v = T1(m, p, v), p = $r(!1, p), m = $r(!1, m), !v)
        return new Promise((C, U) => {
          this.extractAllToAsync(d, m, p, function(G) {
            G ? U(G) : C(this);
          });
        });
      if (!o) {
        v(He.Errors.NO_ZIP());
        return;
      }
      d = Be.resolve(d);
      const y = (C) => a(d, Be.normalize(s(C.entryName))), g = (C, U) => new Error(C + ': "' + U + '"'), E = [], S = [];
      o.entries.forEach((C) => {
        C.isDirectory ? E.push(C) : S.push(C);
      });
      for (const C of E) {
        const U = y(C), G = p ? C.header.fileAttr : void 0;
        try {
          i.makeDir(U), G && i.fs.chmodSync(U, G), i.fs.utimesSync(U, C.header.time, C.header.time);
        } catch {
          v(g("Unable to create folder", U));
        }
      }
      S.reverse().reduce(function(C, U) {
        return function(G) {
          if (G)
            C(G);
          else {
            const z = Be.normalize(s(U.entryName)), H = a(d, z);
            U.getDataAsync(function(b, B) {
              if (B)
                C(B);
              else if (!b)
                C(He.Errors.CANT_EXTRACT_FILE());
              else {
                const V = p ? U.header.fileAttr : void 0;
                i.writeFileToAsync(H, b, m, V, function(Z) {
                  Z || C(g("Unable to write file", H)), i.fs.utimes(H, U.header.time, U.header.time, function(F) {
                    F ? C(g("Unable to set times", H)) : C();
                  });
                });
              }
            });
          }
        };
      }, v)();
    },
    /**
     * Writes the newly created zip file to disk at the specified location or if a zip was opened and no ``targetFileName`` is provided, it will overwrite the opened zip
     *
     * @param {string} targetFileName
     * @param {function} callback
     */
    writeZip: function(d, m) {
      if (arguments.length === 1 && typeof d == "function" && (m = d, d = ""), !d && r.filename && (d = r.filename), !!d) {
        var p = o.compressToBuffer();
        if (p) {
          var v = i.writeFileTo(d, p, !0);
          typeof m == "function" && m(v ? null : new Error("failed"), "");
        }
      }
    },
    /**
             *
             * @param {string} targetFileName
             * @param {object} [props]
             * @param {boolean} [props.overwrite=true] If the file already exists at the target path, the file will be overwriten if this is true.
             * @param {boolean} [props.perm] The file will be set as the permission from the entry if this is true.
    
             * @returns {Promise<void>}
             */
    writeZipPromise: function(d, m) {
      const { overwrite: p, perm: v } = Object.assign({ overwrite: !0 }, m);
      return new Promise((y, g) => {
        !d && r.filename && (d = r.filename), d || g("ADM-ZIP: ZIP File Name Missing"), this.toBufferPromise().then((E) => {
          const S = (C) => C ? y(C) : g("ADM-ZIP: Wasn't able to write zip file");
          i.writeFileToAsync(d, E, p, v, S);
        }, g);
      });
    },
    /**
     * @returns {Promise<Buffer>} A promise to the Buffer.
     */
    toBufferPromise: function() {
      return new Promise((d, m) => {
        o.toAsyncBuffer(d, m);
      });
    },
    /**
     * Returns the content of the entire zip file as a Buffer object
     *
     * @prop {function} [onSuccess]
     * @prop {function} [onFail]
     * @prop {function} [onItemStart]
     * @prop {function} [onItemEnd]
     * @returns {Buffer}
     */
    toBuffer: function(d, m, p, v) {
      return typeof d == "function" ? (o.toAsyncBuffer(d, m, p, v), null) : o.compressToBuffer();
    }
  };
};
const En = /* @__PURE__ */ jl(N1), I1 = [
  "C:\\Program Files\\Java",
  "C:\\Program Files (x86)\\Java",
  "C:\\Program Files\\Eclipse Adoptium",
  "C:\\Program Files\\Microsoft",
  "C:\\Program Files\\Zulu",
  "C:\\Program Files\\BellSoft",
  "C:\\Program Files\\Amazon Corretto",
  "C:\\Program Files (x86)\\Common Files\\Oracle\\Java",
  "C:\\Program Files\\Common Files\\Oracle\\Java",
  process.env.APPDATA ? D.join(process.env.APPDATA, "PrismLauncher\\java") : "",
  process.env.LOCALAPPDATA ? D.join(process.env.LOCALAPPDATA, "Packages") : "",
  oe.java
], P1 = [
  "/Library/Java/JavaVirtualMachines",
  "/usr/local/opt"
], O1 = [
  "/usr/lib/jvm",
  "/usr/java"
], R1 = "https://api.adoptium.net/v3";
function D1(e) {
  var t, n;
  try {
    const i = Ll(`"${e}" -version 2>&1`, {
      timeout: 5e3,
      stdio: "pipe"
    }).toString().match(/version "([^"]+)"/);
    return i ? i[1] : null;
  } catch (r) {
    const o = (((t = r.stderr) == null ? void 0 : t.toString()) ?? ((n = r.stdout) == null ? void 0 : n.toString()) ?? "").match(/version "([^"]+)"/);
    return o ? o[1] : null;
  }
}
function F1(e) {
  try {
    const t = Ll(`"${e}" -XshowSettings:all -version 2>&1`, { timeout: 5e3 }).toString();
    return t.includes("amd64") || t.includes("x86_64") ? "amd64" : t.includes("aarch64") || t.includes("arm64") ? "arm64" : t.includes("x86") ? "x86" : "amd64";
  } catch {
    return "amd64";
  }
}
function wl(e) {
  const t = [];
  if (!e || !L.existsSync(e)) return t;
  try {
    const n = L.readdirSync(e);
    for (const r of n) {
      const i = D.join(e, r);
      if (!L.statSync(i).isDirectory()) continue;
      const o = [
        D.join(i, "bin", "javaw.exe"),
        D.join(i, "bin", "java"),
        D.join(i, "jre", "bin", "javaw.exe"),
        D.join(i, "jre", "bin", "java"),
        D.join(i, "Contents", "Home", "bin", "java")
      ];
      for (const s of o)
        if (L.existsSync(s)) {
          const a = D1(s);
          if (a) {
            t.push({
              version: a,
              architecture: F1(s),
              path: s,
              isDefault: !1
            });
            break;
          }
        }
    }
  } catch {
  }
  return t;
}
function L1(e) {
  const t = e.match(/^(\d{2,})\./);
  if (t && parseInt(t[1]) >= 26) return 25;
  const n = e.split("."), r = parseInt(n[1] ?? "0");
  return r >= 21 ? 21 : r >= 17 ? 17 : (r >= 13, 8);
}
function x1(e) {
  return new Promise((t, n) => {
    Et.get(e, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (r) => {
      let i = "";
      r.on("data", (o) => i += o), r.on("end", () => {
        try {
          t(JSON.parse(i));
        } catch {
          n(new Error(`Invalid JSON from ${e}`));
        }
      });
    }).on("error", n);
  });
}
function k1(e, t, n) {
  return new Promise((r, i) => {
    L.mkdirSync(D.dirname(t), { recursive: !0 });
    const o = (s, a = 0) => {
      if (a > 5) return i(new Error("Too many redirects"));
      Et.get(s, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (c) => {
        if ([301, 302, 307, 308].includes(c.statusCode)) {
          const h = c.headers.location;
          return o(h.startsWith("http") ? h : new URL(h, s).toString(), a + 1);
        }
        if (c.statusCode !== 200) return i(new Error(`HTTP ${c.statusCode}`));
        const u = parseInt(c.headers["content-length"] ?? "0");
        let l = 0;
        const f = L.createWriteStream(t);
        c.on("data", (h) => {
          l += h.length, u && n && n(Math.round(l / u * 100));
        }), c.pipe(f), f.on("finish", () => {
          f.close(), r();
        }), f.on("error", (h) => {
          L.unlink(t, () => {
          }), i(h);
        });
      }).on("error", i);
    };
    o(e);
  });
}
async function U1(e, t) {
  try {
    const n = process.platform === "win32" ? "windows" : process.platform === "darwin" ? "mac" : "linux", r = process.arch === "arm64" ? "aarch64" : "x64", i = "jdk";
    t == null || t(`Fetching Java ${e} info...`);
    const o = await x1(
      `${R1}/assets/latest/${e}/hotspot?architecture=${r}&image_type=${i}&os=${n}&vendor=eclipse`
    );
    if (!(o != null && o.length))
      return t == null || t(`No Java ${e} release found`), null;
    const c = o[0].binary.package, u = c.link, l = c.name, f = D.join(oe.java, `java-${e}`), h = D.join(f, l);
    L.mkdirSync(f, { recursive: !0 }), t == null || t(`Downloading Java ${e}...`);
    let d = -1;
    if (await k1(u, h, (p) => {
      const v = Math.floor(p / 10) * 10;
      v > d && (d = v, t == null || t(`Downloading Java ${e}: ${v}%`));
    }), t == null || t(`Extracting Java ${e}...`), l.endsWith(".zip"))
      new En(h).extractAllTo(f, !0);
    else if (l.endsWith(".tar.gz")) {
      const { execSync: p } = await import("child_process");
      p(`tar -xzf "${h}" -C "${f}"`);
    }
    L.unlinkSync(h);
    const m = wl(f);
    return m.length > 0 ? (t == null || t(`Java ${e} installed!`), m[0].path) : null;
  } catch (n) {
    return t == null || t(`Failed to auto-download Java ${e}: ${n}`), null;
  }
}
const na = {
  detect() {
    const e = process.platform, t = e === "win32" ? I1 : e === "darwin" ? P1 : O1, n = [], r = /* @__PURE__ */ new Set();
    for (const i of t) {
      const o = wl(i);
      for (const s of o)
        r.has(s.path) || (r.add(s.path), n.push(s));
    }
    return n.sort((i, o) => {
      const s = parseInt(i.version.split(".")[0]);
      return parseInt(o.version.split(".")[0]) - s;
    }), n.length > 0 && (n[0].isDefault = !0), n;
  },
  getInstalled() {
    const e = oe.java;
    return L.existsSync(e) ? wl(e) : [];
  },
  async getJavaForVersion(e, t) {
    const n = L1(e), r = this.getInstalled(), i = this.detect(), o = [...r, ...i], s = o.find((a) => {
      const c = a.version;
      return (c.startsWith("1.") ? parseInt(c.split(".")[1]) : parseInt(c.split(".")[0])) === n;
    });
    return console.log("[Java] Required major:", n, "| All versions:", o.map((a) => a.version)), s ? s.path : (t == null || t(`Java ${n} not found, downloading automatically...`), U1(n, t));
  }
}, Wu = "00000000402b5328", Ba = "https://login.live.com/oauth20_desktop.srf", j1 = `https://login.live.com/oauth20_authorize.srf?client_id=${Wu}&response_type=code&redirect_uri=${encodeURIComponent(Ba)}&scope=XboxLive.signin%20offline_access`;
function Vo(e, t, n) {
  return new Promise((r, i) => {
    const o = new URL(e), s = {
      hostname: o.hostname,
      path: o.pathname + o.search,
      method: "POST",
      headers: {
        "Content-Type": n["Content-Type"] || "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(t),
        Accept: "application/json",
        ...n
      }
    }, a = Et.request(s, (c) => {
      let u = "";
      c.on("data", (l) => u += l), c.on("end", () => {
        try {
          r(JSON.parse(u));
        } catch {
          r(u);
        }
      });
    });
    a.on("error", i), a.write(t), a.end();
  });
}
function M1(e, t) {
  return new Promise((n, r) => {
    const i = new URL(e), o = {
      hostname: i.hostname,
      path: i.pathname + i.search,
      method: "GET",
      headers: {
        Accept: "application/json",
        ...t
      }
    }, s = Et.request(o, (a) => {
      let c = "";
      a.on("data", (u) => c += u), a.on("end", () => {
        try {
          n(JSON.parse(c));
        } catch {
          n(c);
        }
      });
    });
    s.on("error", r), s.end();
  });
}
async function B1(e) {
  const t = new URLSearchParams({
    client_id: Wu,
    code: e,
    grant_type: "authorization_code",
    redirect_uri: Ba
  }).toString(), n = await Vo(
    "https://login.live.com/oauth20_token.srf",
    t,
    { "Content-Type": "application/x-www-form-urlencoded" }
  );
  if (!n.access_token) throw new Error("Failed to get Microsoft token: " + JSON.stringify(n));
  return n;
}
async function ag(e) {
  const t = JSON.stringify({
    Properties: {
      AuthMethod: "RPS",
      SiteName: "user.auth.xboxlive.com",
      RpsTicket: `d=${e}`
    },
    RelyingParty: "http://auth.xboxlive.com",
    TokenType: "JWT"
  }), n = await Vo(
    "https://user.auth.xboxlive.com/user/authenticate",
    t,
    { "Content-Type": "application/json" }
  );
  if (!n.Token) throw new Error("Failed to get Xbox token: " + JSON.stringify(n));
  return {
    token: n.Token,
    uhs: n.DisplayClaims.xui[0].uhs
  };
}
async function cg(e) {
  const t = JSON.stringify({
    Properties: {
      SandboxId: "RETAIL",
      UserTokens: [e]
    },
    RelyingParty: "rp://api.minecraftservices.com/",
    TokenType: "JWT"
  }), n = await Vo(
    "https://xsts.auth.xboxlive.com/xsts/authorize",
    t,
    { "Content-Type": "application/json" }
  );
  if (!n.Token)
    throw n.XErr === 2148916233 ? new Error("No Microsoft account found. Please create one at xbox.com") : n.XErr === 2148916238 ? new Error("This account is a child account. Please add it to a family") : new Error("Failed to get XSTS token: " + n.XErr);
  return {
    token: n.Token,
    uhs: n.DisplayClaims.xui[0].uhs
  };
}
async function lg(e, t) {
  const n = JSON.stringify({
    identityToken: `XBL3.0 x=${t};${e}`
  }), r = await Vo(
    "https://api.minecraftservices.com/authentication/login_with_xbox",
    n,
    { "Content-Type": "application/json" }
  );
  if (!r.access_token) throw new Error("Failed to get Minecraft token");
  return r.access_token;
}
async function H1(e) {
  const t = await M1(
    "https://api.minecraftservices.com/minecraft/profile",
    { Authorization: `Bearer ${e}` }
  );
  if (!t.id) throw new Error("Failed to get Minecraft profile. Do you own Minecraft?");
  return { id: t.id, name: t.name };
}
async function q1() {
  return new Promise((e, t) => {
    const n = new ve({
      width: 500,
      height: 650,
      title: "Sign in with Microsoft",
      webPreferences: {
        nodeIntegration: !1,
        contextIsolation: !0
      }
    });
    n.setMenuBarVisibility(!1), n.loadURL(j1);
    let r = !1;
    const i = async (o) => {
      if (!o.startsWith(Ba) || r) return;
      r = !0;
      const s = new URL(o), a = s.searchParams.get("code"), c = s.searchParams.get("error");
      if (c) {
        n.close(), t(new Error("Microsoft auth error: " + c));
        return;
      }
      if (a) {
        n.close();
        try {
          const u = await B1(a), l = await ag(u.access_token), f = await cg(l.token), h = await lg(f.token, f.uhs), d = await H1(h), m = {
            id: d.id,
            username: d.id,
            minecraftUsername: d.name,
            type: "msa",
            status: "ready",
            isActive: !0,
            accessToken: h,
            refreshToken: u.refresh_token,
            expiresAt: new Date(Date.now() + 864e5).toISOString()
          };
          e(m);
        } catch (u) {
          t(u);
        }
      }
    };
    n.webContents.on("will-redirect", (o, s) => i(s)), n.webContents.on("will-navigate", (o, s) => i(s)), n.on("closed", () => {
      r || t(new Error("Login window was closed"));
    });
  });
}
async function z1(e) {
  const t = new URLSearchParams({
    client_id: Wu,
    refresh_token: e,
    grant_type: "refresh_token",
    redirect_uri: Ba
  }).toString(), n = await Vo(
    "https://login.live.com/oauth20_token.srf",
    t,
    { "Content-Type": "application/x-www-form-urlencoded" }
  ), r = await ag(n.access_token), i = await cg(r.token);
  return {
    accessToken: await lg(i.token, i.uhs),
    refreshToken: n.refresh_token,
    expiresAt: new Date(Date.now() + 864e5).toISOString(),
    status: "ready"
  };
}
function Sr() {
  try {
    if (!L.existsSync(oe.accounts)) return [];
    const e = L.readFileSync(oe.accounts, "utf-8");
    return JSON.parse(e);
  } catch {
    return [];
  }
}
function ii(e) {
  L.writeFileSync(oe.accounts, JSON.stringify(e, null, 2));
}
const Tr = {
  getAll() {
    return Sr();
  },
  async addMicrosoft() {
    const e = await q1(), t = Sr(), n = t.findIndex((r) => r.id === e.id);
    return n >= 0 ? t[n] = e : (t.length === 0 && (e.isActive = !0), t.push(e)), ii(t), e;
  },
  remove(e) {
    const t = Sr().filter((n) => n.id !== e);
    ii(t);
  },
  setActive(e) {
    const t = Sr().map((n) => ({ ...n, isActive: n.id === e }));
    ii(t);
  },
  getActive() {
    return Sr().find((e) => e.isActive) ?? null;
  },
  async refresh(e) {
    const t = Sr(), n = t.find((r) => r.id === e);
    if (!n) throw new Error("Account not found");
    try {
      const r = await z1(n.refreshToken);
      Object.assign(n, r), ii(t);
    } catch {
      n.status = "errored", ii(t);
    }
  },
  addOffline(e) {
    const t = Sr(), n = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (o, s) => {
      const c = (e.split("").reduce((u, l) => u + l.charCodeAt(0), s) + Math.random() * 16) % 16 | 0;
      return (o === "x" ? c : c & 3 | 8).toString(16);
    }), r = {
      id: n,
      username: e,
      minecraftUsername: e,
      accessToken: "offline",
      refreshToken: "",
      expiresAt: "",
      type: "offline",
      isActive: t.length === 0,
      status: "ready"
    }, i = t.findIndex((o) => o.id === n);
    return i >= 0 ? t[i] = r : t.push(r), ii(t), r;
  }
};
function Gd() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
function Pc(e) {
  try {
    const t = D.join(e, "instance.json");
    if (!L.existsSync(t)) return null;
    const n = L.readFileSync(t, "utf-8");
    return JSON.parse(n);
  } catch {
    return null;
  }
}
function As(e) {
  const t = D.join(oe.instances, e.id);
  L.existsSync(t) || L.mkdirSync(t, { recursive: !0 }), L.writeFileSync(
    D.join(t, "instance.json"),
    JSON.stringify(e, null, 2)
  );
}
const zt = {
  getAll() {
    if (!L.existsSync(oe.instances)) return [];
    const e = L.readdirSync(oe.instances), t = [];
    for (const n of e) {
      const r = D.join(oe.instances, n);
      if (!L.statSync(r).isDirectory()) continue;
      const i = Pc(r);
      i && t.push(i);
    }
    return t;
  },
  create(e) {
    const t = Gd(), n = {
      id: t,
      name: e.name,
      version: e.version,
      modLoader: e.modLoader,
      modLoaderVersion: e.modLoaderVersion,
      icon: e.icon || "default",
      group: e.group || "",
      lastPlayed: null,
      totalPlayTime: 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }, r = D.join(oe.instances, t);
    return L.mkdirSync(D.join(r, "minecraft"), { recursive: !0 }), As(n), n;
  },
  delete(e) {
    const t = D.join(oe.instances, e);
    L.existsSync(t) && L.rmSync(t, { recursive: !0, force: !0 });
  },
  copy(e) {
    const t = D.join(oe.instances, e), n = Pc(t);
    if (!n) throw new Error(`Instance ${e} not found`);
    const r = Gd(), i = {
      ...n,
      id: r,
      name: n.name + " (Copy)",
      lastPlayed: null,
      totalPlayTime: 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }, o = D.join(oe.instances, r);
    return L.mkdirSync(D.join(o, "minecraft"), { recursive: !0 }), As(i), i;
  },
  launch(e) {
    console.log(`Launching instance ${e}`);
  },
  updatePlayTime(e, t) {
    const n = D.join(oe.instances, e), r = Pc(n);
    r && (r.lastPlayed = (/* @__PURE__ */ new Date()).toISOString(), r.totalPlayTime += t, As(r));
  },
  update(e) {
    As(e);
  }
}, V1 = "1502041454829375651";
let ln = null, So = !1;
async function G1() {
  if (Vt.store.discordRpc)
    try {
      ln = new dv({
        clientId: V1,
        transport: { type: "ipc" }
      }), ln.on("ready", () => {
        So = !0, console.log("[Discord RPC] Connected"), ug();
      }), await ln.login();
    } catch (e) {
      console.log("[Discord RPC] Failed to connect:", e), ln = null, So = !1;
    }
}
function W1(e, t, n) {
  var r;
  if (!(!ln || !So))
    try {
      (r = ln.user) == null || r.setActivity({
        details: `Playing ${e}`,
        state: `${t}${n !== "none" ? ` • ${n}` : ""}`.trim(),
        startTimestamp: /* @__PURE__ */ new Date(),
        largeImageKey: "fernlauncher",
        largeImageText: "Fernlauncher",
        instance: !1
      });
    } catch (i) {
      console.log("[Discord RPC] Failed to set activity:", i);
    }
}
function K1() {
  ln && (ln.destroy(), ln = null, So = !1);
}
function ug() {
  var e;
  if (!(!ln || !So))
    try {
      (e = ln.user) == null || e.setActivity({
        details: "In the launcher",
        largeImageKey: "fernlauncher",
        largeImageText: "Fernlauncher",
        instance: !1
      });
    } catch (t) {
      console.log("[Discord RPC] Failed to set idle activity:", t);
    }
}
const Lr = /* @__PURE__ */ new Map(), Oc = /* @__PURE__ */ new Map(), ra = /* @__PURE__ */ new Map();
function J1(e, t) {
  ra.set(e, t), t.on("closed", () => ra.delete(e));
}
function ia(e) {
  return new Promise((t, n) => {
    const r = (i, o = 0) => {
      if (o > 5) return n(new Error("Too many redirects"));
      Et.get(i, (s) => {
        if ([301, 302, 307, 308].includes(s.statusCode)) {
          const c = s.headers.location;
          return c ? r(c.startsWith("http") ? c : new URL(c, i).toString(), o + 1) : n(new Error("Redirect with no location"));
        }
        if (s.statusCode !== 200) return n(new Error(`HTTP ${s.statusCode} for ${i}`));
        let a = "";
        s.on("data", (c) => a += c), s.on("end", () => {
          try {
            t(JSON.parse(a));
          } catch {
            n(new Error(`Invalid JSON from ${i}: ${a.substring(0, 100)}`));
          }
        });
      }).on("error", n);
    };
    r(e);
  });
}
function Xt(e, t) {
  return new Promise((n, r) => {
    if (L.existsSync(t)) return n();
    L.mkdirSync(D.dirname(t), { recursive: !0 });
    const i = (o, s = 0) => {
      if (s > 5) return r(new Error("Too many redirects"));
      Et.get(o, (a) => {
        if ([301, 302, 307, 308].includes(a.statusCode)) {
          const u = a.headers.location;
          return u ? i(u.startsWith("http") ? u : new URL(u, o).toString(), s + 1) : r(new Error("Redirect with no location"));
        }
        if (a.statusCode !== 200) return r(new Error(`HTTP ${a.statusCode} for ${o}`));
        const c = L.createWriteStream(t);
        a.pipe(c), c.on("finish", () => {
          c.close(), n();
        }), c.on("error", (u) => {
          L.unlink(t, () => {
          }), r(u);
        });
      }).on("error", (a) => {
        L.unlink(t, () => {
        }), r(a);
      });
    };
    i(e);
  });
}
function Ce(e, t) {
  var n, r;
  console.log("[sendLog]", t.substring(0, 50), (n = new Error().stack) == null ? void 0 : n.split(`
`)[2]), (r = ra.get(e)) == null || r.webContents.send("instance:log", { instanceId: e, line: t });
}
function Ts(e, t) {
  var n;
  (n = ra.get(e)) == null || n.webContents.send("instance:status", { instanceId: e, status: t });
}
function Wd(e, t) {
  ve.getAllWindows().forEach((n) => n.webContents.send(e, t));
}
async function Y1(e, t, n, r) {
  const i = await ia(`https://meta.fabricmc.net/v2/versions/loader/${e}/${t}/profile/json`);
  for (const o of i.libraries) {
    const [s, a, c] = o.name.split(":"), u = s.replace(/\./g, "/"), l = `${a}-${c}.jar`, f = D.join(r, u, a, c, l), h = o.url ? `${o.url}${u}/${a}/${c}/${l}` : `https://maven.fabricmc.net/${u}/${a}/${c}/${l}`;
    await Xt(h, f), n.unshift(f);
  }
  return i.mainClass;
}
async function X1(e, t, n, r) {
  const i = await ia(`https://meta.quiltmc.org/v3/versions/loader/${e}/${t}/profile/json`);
  for (const o of i.libraries) {
    const [s, a, c] = o.name.split(":"), u = s.replace(/\./g, "/"), l = `${a}-${c}.jar`, f = D.join(r, u, a, c, l), h = o.url ? `${o.url}${u}/${a}/${c}/${l}` : `https://maven.quiltmc.org/repository/release/${u}/${a}/${c}/${l}`;
    await Xt(h, f), n.unshift(f);
  }
  return i.mainClass;
}
function fg(e) {
  const t = D.join(e, "launcher_profiles.json");
  L.existsSync(t) || L.writeFileSync(t, JSON.stringify({
    profiles: {},
    selectedProfile: null,
    clientToken: "fernlaunch",
    authenticationDatabase: {},
    launcherVersion: { name: "2.0", format: 21 }
  }, null, 2));
}
function dg(e, t, n, r, i) {
  return new Promise((o, s) => {
    var u, l;
    const c = js(e, ["-jar", t, "--installClient", n], { cwd: n });
    (u = c.stdout) == null || u.on("data", (f) => console.log(`[${r}]`, f.toString().trim())), (l = c.stderr) == null || l.on("data", (f) => console.log(`[${r}]`, f.toString().trim())), c.on("close", (f) => {
      f === 0 ? o() : s(new Error(`${r} exited with code ${f}`));
    }), c.on("error", s);
  });
}
async function Z1(e, t, n, r) {
  var y, g, E;
  const i = D.join(n, ".."), o = "https://maven.neoforged.net/releases", s = D.join(n, "net/neoforged/neoforge", t, `neoforge-${t}-installer.jar`), a = D.join(i, "versions", `neoforge-${t}`, `neoforge-${t}.json`);
  await Xt(`${o}/net/neoforged/neoforge/${t}/neoforge-${t}-installer.jar`, s);
  const c = D.join(i, "versions", e, `${e}.jar`), u = D.join(n, "net/minecraft/client", e, `client-${e}.jar`);
  L.existsSync(c) && !L.existsSync(u) && (L.mkdirSync(D.dirname(u), { recursive: !0 }), L.copyFileSync(c, u)), L.existsSync(a) || (fg(i), await dg(r, s, i, "NeoForge Installer"));
  const l = JSON.parse(L.readFileSync(a, "utf-8")), f = [];
  for (const S of l.libraries ?? []) {
    if (!((y = S.downloads) != null && y.artifact)) continue;
    const C = S.downloads.artifact, U = D.join(n, C.path);
    await Xt(C.url, U), L.existsSync(U) && f.push(U);
  }
  const h = D.join(n, "net/neoforged/minecraft-client-patched", t, `minecraft-client-patched-${t}.jar`);
  if (L.existsSync(h)) {
    const S = new En(h), C = S.getEntries().some((G) => G.entryName.includes("UndashedUuid")), U = S.getEntries().some((G) => G.entryName.includes("GameProfile"));
    console.log("[Patched client] UndashedUuid:", C, "| GameProfile:", U), console.log("[Patched client] authlib entries:", S.getEntries().filter((G) => G.entryName.includes("mojang/authlib") || G.entryName.includes("mojang/util")).map((G) => G.entryName).slice(0, 10));
  }
  const d = new En(D.join(n, "net/neoforged/neoforge", t, `neoforge-${t}-universal.jar`)), m = d.getEntries().filter((S) => S.entryName.startsWith("META-INF") || S.entryName.includes("authlib") || S.entryName.includes("MANIFEST"));
  console.log("[Universal JAR entries]", m.map((S) => S.entryName));
  const p = d.readAsText("META-INF/MANIFEST.MF");
  console.log("[Universal MANIFEST]", p);
  const v = new En(s);
  for (const S of v.getEntries())
    if (console.log("[Installer entry]", S.entryName), S.entryName.includes("authlib") && S.entryName.endsWith(".jar")) {
      const C = D.join(n, S.entryName.replace("maven/", ""));
      L.existsSync(C) || (L.mkdirSync(D.dirname(C), { recursive: !0 }), v.extractEntryTo(S, D.dirname(C), !1, !0)), f.includes(C) || f.unshift(C);
      break;
    }
  return {
    mainClass: l.mainClass ?? "net.neoforged.fml.startup.Client",
    gameArgs: (((g = l.arguments) == null ? void 0 : g.game) ?? []).filter((S) => typeof S == "string"),
    jvmArgs: (((E = l.arguments) == null ? void 0 : E.jvm) ?? []).filter((S) => typeof S == "string"),
    neoClasspath: f
  };
}
async function Q1(e, t, n, r, i) {
  var E, S, C, U, G;
  const o = D.join(r, ".."), s = t.includes(e) ? t : `${e}-${t}`, a = "https://maven.minecraftforge.net", c = D.join(r, "net/minecraftforge/forge", s, `forge-${s}-installer.jar`), u = D.join(o, "versions");
  await Xt(`${a}/net/minecraftforge/forge/${s}/forge-${s}-installer.jar`, c), fg(o), L.existsSync(u) || L.mkdirSync(u, { recursive: !0 });
  const l = t.split("-").pop(), f = () => L.readdirSync(u).find((z) => z.toLowerCase().includes("forge") && z.includes(l));
  let h = f();
  const d = new En(c), p = "versionInfo" in JSON.parse(d.readAsText("install_profile.json"));
  if (console.log("[Forge] isOldInstaller:", p), !h)
    if (p) {
      const z = JSON.parse(d.readAsText("install_profile.json"));
      console.log("[Forge] install_profile keys:", Object.keys(z));
      const H = z.versionInfo, b = H.id, B = D.join(u, b);
      L.mkdirSync(B, { recursive: !0 }), L.writeFileSync(D.join(B, `${b}.json`), JSON.stringify(H, null, 2));
      for (const V of d.getEntries()) {
        if (!V.entryName.startsWith("maven/")) continue;
        const Z = D.join(r, V.entryName.replace("maven/", ""));
        L.existsSync(Z) || (L.mkdirSync(D.dirname(Z), { recursive: !0 }), d.extractEntryTo(V, D.dirname(Z), !1, !0));
      }
      for (const V of H.libraries ?? []) {
        if (V.clientreq === !1) continue;
        const Z = V.name.split(":"), F = Z[0].replace(/\./g, "/"), x = Z[1], W = Z[2], q = `${x}-${W}.jar`, Y = D.join(r, F, x, W, q);
        if (!L.existsSync(Y)) {
          const J = V.url ?? "https://libraries.minecraft.net/";
          try {
            await Xt(`${J}${F}/${x}/${W}/${q}`, Y);
          } catch {
            try {
              await Xt(`${a}/${F}/${x}/${W}/${q}`, Y);
            } catch {
              console.warn(`[Forge] Could not download library: ${V.name}`);
            }
          }
        }
      }
      h = f();
    } else
      await dg(i, c, o, "Forge Installer"), h = f();
  const v = D.join(r, "net", "minecraftforge", "forge", s, `forge-${s}-universal.jar`);
  if (p) {
    if (!L.existsSync(v)) {
      const z = d.getEntries().find((H) => H.entryName.endsWith("-universal.jar"));
      if (z) {
        L.mkdirSync(D.dirname(v), { recursive: !0 }), d.extractEntryTo(z, D.dirname(v), !1, !0);
        const H = D.join(D.dirname(v), z.entryName);
        L.existsSync(H) && H !== v && L.renameSync(H, v);
      }
    }
    L.existsSync(v) && (n.push(v), console.log("[Forge] Added universal jar to classpath"));
  }
  if (!h) throw new Error("Could not find Forge version directory after installation");
  const y = D.join(u, h, `${h}.json`), g = JSON.parse(L.readFileSync(y, "utf-8"));
  if (p)
    for (const z of g.libraries ?? []) {
      const H = z.name.split(":"), b = H[0].replace(/\./g, "/"), B = H[1], V = H[2];
      if (b.includes("minecraftforge") && B === "forge") continue;
      const F = D.join(r, b, B, V, `${B}-${V}.jar`);
      L.existsSync(F) ? n.push(F) : console.warn(`[Forge] Missing lib: ${z.name}`);
    }
  if (!p) {
    for (const z of g.libraries ?? [])
      if ((S = (E = z.downloads) == null ? void 0 : E.artifact) != null && S.path) {
        const H = D.join(r, z.downloads.artifact.path);
        L.existsSync(H) ? n.push(H) : console.warn("[Forge] Missing new forge lib:", z.name, H);
      }
    console.log("[Forge] New forge classpath entries:", n.filter((z) => z.includes("forge")));
  }
  if (!h) throw new Error("Could not find Forge version directory after installation");
  return console.log("[Forge] mainClass:", g.mainClass), console.log("[Forge] classpath forge entries:", n.filter((z) => z.includes("forge"))), {
    mainClass: g.mainClass ?? "net.minecraftforge.bootstrap.ForgeBootstrap",
    gameArgs: (C = g.arguments) != null && C.game ? g.arguments.game.filter((z) => typeof z == "string") : ((U = g.minecraftArguments) == null ? void 0 : U.split(" ")) ?? [],
    jvmArgs: [
      "-Dfml.ignoreInvalidMinecraftCertificates=true",
      "-Dfml.ignorePatchDiscrepancies=true",
      ...(((G = g.arguments) == null ? void 0 : G.jvm) ?? []).filter((z) => typeof z == "string")
    ]
  };
}
function eI() {
  return process.platform === "win32" ? "windows" : process.platform === "darwin" ? "osx" : "linux";
}
function to(e, t) {
  return e.map((n) => {
    for (const [r, i] of Object.entries(t))
      n = n.replace(new RegExp(`\\$\\{${r}\\}`, "g"), i);
    return n;
  });
}
async function tI(e) {
  var tt, Re, nt, pn, Qt, Lt, xt, Sn, Un, St, qi, zi, ns, Vi, gr, Gi;
  if (Lr.has(e)) throw new Error("Instance is already running!");
  const t = D.join(oe.instances, e), n = D.join(t, "instance.json");
  if (!L.existsSync(n)) throw new Error("Instance not found");
  const r = JSON.parse(L.readFileSync(n, "utf-8")), i = D.join(t, "minecraft"), o = Vt.store, s = Tr.getActive();
  if (console.log("[Launch] Active account:", s == null ? void 0 : s.minecraftUsername, s == null ? void 0 : s.type), !s) throw new Error("No active account. Please log in first.");
  Ts(e, "downloading"), Ce(e, "🌿 Fernlauncher starting..."), Ce(e, `Launching ${r.name} (${r.version})`), Ce(e, "Fetching version manifest...");
  const a = ((tt = o.services) == null ? void 0 : tt.metaServer) || "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json", u = (await ia(a)).versions.find((X) => X.id === r.version);
  if (!u) throw new Error(`Version ${r.version} not found in manifest`);
  const l = await ia(u.url), f = D.join(oe.appData, "versions", r.version);
  L.mkdirSync(f, { recursive: !0 }), Ce(e, "Downloading Minecraft client...");
  const h = D.join(f, `${r.version}.jar`);
  await Xt(l.downloads.client.url, h), Ce(e, "Downloading libraries...");
  const d = D.join(oe.appData, "libraries"), m = [], p = eI(), v = r.modLoader === "neoforge" || r.modLoader === "forge";
  for (const X of l.libraries) {
    if (X.rules && !X.rules.every((xe) => {
      var Xe;
      const rt = (Xe = xe.os) == null ? void 0 : Xe.name;
      return rt ? xe.action === "allow" ? rt === p : rt !== p : xe.action === "allow";
    }))
      continue;
    const fe = (Re = X.downloads) == null ? void 0 : Re.artifact;
    if (!fe || v && ((nt = X.name) != null && nt.includes("log4j-slf4j"))) continue;
    const $e = D.join(d, fe.path);
    await Xt(fe.url, $e), m.push($e);
  }
  r.modLoader !== "neoforge" && m.push(h), Ce(e, "Finding Java...");
  const y = (() => {
    const X = parseInt(r.version.split(".")[1] ?? "0");
    return X >= 21 ? 21 : X >= 17 ? 17 : 8;
  })();
  function g(X) {
    try {
      const $e = Ll(`"${X}" -version 2>&1`, { timeout: 5e3 }).toString().match(/version "([^"]+)"/);
      if (!$e) return 0;
      const Ee = $e[1];
      return Ee.startsWith("1.") ? parseInt(Ee.split(".")[1]) : parseInt(Ee.split(".")[0]);
    } catch {
      return 0;
    }
  }
  let E = o.java.executable;
  if (E && L.existsSync(E)) {
    const X = g(E);
    Ce(e, `Configured Java version: ${X}, required: ${y}`), X !== y && (Ce(e, `Finding Java ${y}...`), E = await na.getJavaForVersion(r.version, (fe) => Ce(e, fe)) ?? "");
  } else
    E = await na.getJavaForVersion(r.version, (X) => Ce(e, X)) ?? "";
  if (!E || !L.existsSync(E))
    throw new Error(`No Java ${y} found. Please install it in Settings → Java.`);
  let S = l.mainClass, C = [], U = [], G = [], z = [], H = [];
  if (r.modLoader === "fabric" && r.modLoaderVersion)
    Ce(e, "Applying Fabric loader..."), S = await Y1(r.version, r.modLoaderVersion, m, d), Ce(e, `Fabric main class: ${S}`);
  else if (r.modLoader === "quilt" && r.modLoaderVersion)
    Ce(e, "Applying Quilt loader..."), S = await X1(r.version, r.modLoaderVersion, m, d), Ce(e, `Quilt main class: ${S}`);
  else if (r.modLoader === "neoforge" && r.modLoaderVersion) {
    Ce(e, "Applying NeoForge loader...");
    const X = await Z1(r.version, r.modLoaderVersion, d, E);
    S = X.mainClass, C = X.gameArgs, U = X.jvmArgs, G = X.neoClasspath, Ce(e, `NeoForge main class: ${S}`);
  } else if (r.modLoader === "forge" && r.modLoaderVersion) {
    Ce(e, "Applying Forge loader...");
    const X = await Q1(r.version, r.modLoaderVersion, m, d, E);
    S = X.mainClass, z = X.gameArgs, H = X.jvmArgs, Ce(e, `Forge main class: ${S}`), console.log("[Old Forge] gameArgs:", X.gameArgs), console.log("[Old Forge] jvmArgs:", X.jvmArgs);
  }
  const b = /* @__PURE__ */ new Set(), B = [];
  for (const X of [...G, ...m]) {
    const fe = D.basename(X);
    b.has(fe) || (b.add(fe), B.push(X));
  }
  Ce(e, "Downloading assets...");
  const V = D.join(oe.appData, "assets"), Z = D.join(V, "indexes"), F = D.join(V, "objects");
  L.mkdirSync(Z, { recursive: !0 }), L.mkdirSync(F, { recursive: !0 });
  const x = ((pn = o.services) == null ? void 0 : pn.assetsServer) || "https://resources.download.minecraft.net/", W = l.assetIndex, q = D.join(Z, `${W.id}.json`);
  await Xt(W.url, q);
  const Y = Object.entries(JSON.parse(L.readFileSync(q, "utf-8")).objects);
  let J = 0;
  const j = 64;
  for (let X = 0; X < Y.length; X += j)
    await Promise.all(Y.slice(X, X + j).map(async ([, fe]) => {
      const $e = fe.hash, Ee = $e.substring(0, 2), xe = D.join(F, Ee, $e);
      L.existsSync(xe) || await Xt(`${x}${Ee}/${$e}`, xe), J++;
      const rt = Math.round(J / Y.length * 100);
      (J % 50 === 0 || J === Y.length) && Ce(e, `Assets: ${J}/${Y.length} (${rt}%)`);
    }));
  Ce(e, "Building launch arguments...");
  const N = D.join(f, "natives");
  if (L.mkdirSync(N, { recursive: !0 }), L.mkdirSync(i, { recursive: !0 }), parseInt(r.version.split(".")[1] ?? "0") <= 12) {
    const X = process.platform === "win32" ? "windows" : process.platform === "darwin" ? "osx" : "linux";
    for (const fe of l.libraries) {
      if (!((Qt = fe.natives) != null && Qt[X]) || fe.rules && !fe.rules.every((Xe) => {
        var Qr;
        const bn = (Qr = Xe.os) == null ? void 0 : Qr.name;
        return bn ? Xe.action === "allow" ? bn === X : bn !== X : Xe.action === "allow";
      }))
        continue;
      const $e = fe.natives[X].replace("${arch}", "64"), Ee = (xt = (Lt = fe.downloads) == null ? void 0 : Lt.classifiers) == null ? void 0 : xt[$e];
      if (!Ee) continue;
      const xe = D.join(d, Ee.path);
      if (await Xt(Ee.url, xe), L.existsSync(xe)) {
        const rt = new En(xe);
        rt.getEntries().forEach((Xe) => {
          !Xe.isDirectory && (Xe.entryName.endsWith(".dll") || Xe.entryName.endsWith(".so") || Xe.entryName.endsWith(".dylib")) && rt.extractEntryTo(Xe, N, !1, !0);
        }), console.log("[Natives] Extracted from", Ee.path);
      }
    }
    console.log("[Natives] dir after extraction:", L.readdirSync(N));
  }
  console.log("[Natives] dir contents:", L.readdirSync(N)), console.log("[Natives] lwjgl native jars:", l.libraries.filter((X) => X.natives).map((X) => X.name));
  const O = process.platform === "win32" ? ";" : ":", $ = B.join(O), T = {
    natives_directory: N,
    launcher_name: "Fernlauncher",
    launcher_version: "1.0.0",
    classpath: $,
    library_directory: d,
    classpath_separator: O
  }, M = {
    auth_player_name: s.minecraftUsername,
    version_name: r.version,
    game_directory: i,
    assets_root: V,
    assets_index_name: W.id,
    auth_uuid: s.type === "offline" ? s.id.replace(/-/g, "") : s.id,
    auth_access_token: s.type === "offline" ? "0" : s.accessToken,
    clientid: "00000000402b5328",
    auth_xuid: "",
    user_type: s.type === "offline" ? "legacy" : "msa",
    version_type: l.type,
    user_properties: "{}"
    // add this
  }, ne = [];
  if ((Sn = l.arguments) != null && Sn.jvm)
    for (const X of l.arguments.jvm)
      typeof X == "string" ? ne.push(X) : X.rules && X.rules.every(($e) => {
        var xe;
        const Ee = (xe = $e.os) == null ? void 0 : xe.name;
        return Ee ? $e.action === "allow" ? Ee === p : Ee !== p : $e.action === "allow";
      }) && ne.push(...Array.isArray(X.value) ? X.value : [X.value]);
  else
    ne.push(`-Djava.library.path=${N}`, "-cp", $);
  const te = [];
  if ((Un = l.arguments) != null && Un.game)
    for (const X of l.arguments.game)
      typeof X == "string" && te.push(X);
  else l.minecraftArguments && te.push(...l.minecraftArguments.split(" "));
  Ce(e, `Memory: ${r.minMemory ?? o.java.minMemory}m - ${r.maxMemory ?? o.java.maxMemory}m`);
  const we = [
    `-Xms${r.minMemory ?? o.java.minMemory}m`,
    `-Xmx${r.maxMemory ?? o.java.maxMemory}m`
  ], ce = r.jvmArgs ?? o.java.jvmArgs ? (r.jvmArgs ?? o.java.jvmArgs).split(" ").filter(Boolean) : [];
  (St = o.tweaks) != null && St.useSystemGLFW && o.tweaks.glfwPath && ce.push(`-Dorg.lwjgl.glfw.libname=${o.tweaks.glfwPath}`), (qi = o.tweaks) != null && qi.useSystemOpenAL && o.tweaks.openALPath && ce.push(`-Dorg.lwjgl.openal.libname=${o.tweaks.openALPath}`), (zi = o.tweaks) != null && zi.onlineFixes && (ce.push("-Dminecraft.api.auth.host=https://nope.invalid"), ce.push("-Dminecraft.api.account.host=https://nope.invalid"), ce.push("-Dminecraft.api.session.host=https://nope.invalid"), ce.push("-Dminecraft.api.services.host=https://nope.invalid"));
  const De = r.windowWidth ?? o.minecraft.windowWidth, _ = r.windowHeight ?? o.minecraft.windowHeight, w = o.minecraft.startMaximized ? ["--fullscreen"] : ["--width", String(De), "--height", String(_)], k = g(E), I = [
    ...k < 23 ? ["--sun-misc-unsafe-memory-access=allow"] : [],
    ...k < 21 ? ["--enable-native-access=ALL-UNNAMED"] : []
  ], ge = [
    ...we,
    ...ce,
    `-DlibraryDirectory=${d}`,
    ...to(U, T),
    ...to(H, T),
    ...to(ne, T).filter((X) => !I.includes(X)),
    S,
    ...z.length > 0 && z.includes("--tweakClass") ? to(z, M) : [...to(te, M), ...C, ...z],
    ...w
  ];
  if (Ce(e, "Launching Minecraft!"), Ts(e, "launching"), (ns = o.commands) != null && ns.preLaunch) {
    const X = o.commands.preLaunch.replace("$INST_NAME", r.name).replace("$INST_ID", r.id).replace("$INST_DIR", D.join(oe.instances, r.id)).replace("$INST_MC_DIR", i).replace("$INST_JAVA", E);
    Ce(e, `Running pre-launch command: ${X}`), await new Promise((fe, $e) => {
      const [Ee, ...xe] = X.split(" "), rt = js(Ee, xe, { shell: !0 });
      rt.on("close", (Xe) => {
        Xe !== 0 ? $e(new Error(`Pre-launch command failed with code ${Xe}`)) : fe();
      }), rt.on("error", $e);
    });
  }
  const Ae = (o.envVars ?? []).reduce((X, { name: fe, value: $e }) => (fe && (X[fe] = $e), X), {});
  let Te = E, Ue = ge;
  if ((Vi = o.commands) != null && Vi.wrapper) {
    const X = o.commands.wrapper.split(" ");
    Te = X[0], Ue = [...X.slice(1), E, ...ge];
  }
  const Ne = js(Te, Ue, {
    cwd: i,
    env: { ...process.env, ...Ae }
  });
  Lr.set(e, Ne), (gr = Ne.stdout) == null || gr.on("data", (X) => {
    X.toString().split(`
`).filter((fe) => fe.trim()).forEach((fe) => Ce(e, fe));
  }), (Gi = Ne.stderr) == null || Gi.on("data", (X) => {
    X.toString().split(`
`).filter((fe) => fe.trim()).forEach((fe) => Ce(e, fe));
  }), Ne.on("spawn", () => {
    Oc.set(e, Date.now()), Ts(e, "running"), Ce(e, "✓ Minecraft process started"), o.minecraft.hideOnLaunch && ve.getAllWindows().filter((fe) => !fe.webContents.getURL().includes("console")).forEach((fe) => fe.hide());
    const X = zt.getAll().find((fe) => fe.id === e);
    X && W1(X.name, X.version, X.modLoader);
  }), Ne.on("close", (X) => {
    var fe, $e;
    if (Lr.delete(e), ug(), console.log("[Launcher] Process exited with code:", X), (fe = o.commands) != null && fe.postExit) {
      const Ee = o.commands.postExit.replace("$INST_NAME", r.name).replace("$INST_ID", r.id).replace("$INST_DIR", D.join(oe.instances, r.id)).replace("$INST_MC_DIR", i).replace("$INST_JAVA", E), [xe, ...rt] = Ee.split(" ");
      js(xe, rt, { shell: !0 });
    }
    if (o.minecraft.recordPlayTime) {
      const Ee = Date.now(), xe = Oc.get(e);
      if (xe) {
        const rt = Math.floor((Ee - xe) / 1e3);
        zt.updatePlayTime(e, rt);
      }
    }
    if (Oc.delete(e), o.minecraft.hideOnLaunch && ve.getAllWindows().filter((Ee) => !Ee.webContents.getURL().includes("console")).forEach((Ee) => Ee.show()), o.minecraft.hideConsoleOnExit && X === 0 && (($e = ve.getAllWindows().find((Ee) => Ee.webContents.getURL().includes("console"))) == null || $e.hide()), o.minecraft.quitOnClose) {
      Pe.quit();
      return;
    }
    if (X !== 0 && o.minecraft.showConsoleOnCrash) {
      const Ee = ve.getAllWindows().find((xe) => xe.webContents.getURL().includes(`instanceId=${e}`));
      Ee ? Ee.show() : Wd("open-console", { instanceId: e });
    }
    Wd("instances:updated", {});
  }), Ne.on("error", (X) => {
    Lr.delete(e), Ts(e, "crashed"), Ce(e, `Failed to start: ${X.message}`);
  });
}
function nI(e) {
  const t = Lr.get(e);
  t && (t.kill(), Lr.delete(e));
}
function Kd(e) {
  return Lr.has(e);
}
function rI(e, t) {
  const n = e.readUInt16BE(t);
  return t += 2, { value: e.slice(t, t + n).toString("utf8"), offset: t + n };
}
function Rc(e) {
  try {
    e = jo.gunzipSync(e);
  } catch {
  }
  const t = [];
  let n = 0;
  n++;
  const r = e.readUInt16BE(n);
  for (n += 2, n += r; n < e.length; ) {
    const i = e[n++];
    if (i === 0) break;
    const o = e.readUInt16BE(n);
    n += 2;
    const s = e.slice(n, n + o).toString("utf8");
    if (n += o, s === "servers" && i === 9) {
      e[n++];
      const a = e.readInt32BE(n);
      n += 4;
      for (let c = 0; c < a; c++) {
        const u = { name: "", ip: "", icon: "" };
        for (; n < e.length; ) {
          const l = e[n++];
          if (l === 0) break;
          const f = e.readUInt16BE(n);
          n += 2;
          const h = e.slice(n, n + f).toString("utf8");
          if (n += f, l === 8) {
            const d = rI(e, n);
            n = d.offset, h === "name" ? u.name = d.value : h === "ip" ? u.ip = d.value : h === "icon" && (u.icon = d.value);
          } else
            l === 1 ? n += 1 : l === 2 ? n += 2 : l === 3 ? n += 4 : l === 4 ? n += 8 : l === 5 ? n += 4 : l === 6 && (n += 8);
        }
        t.push(u);
      }
      break;
    } else if (i === 8) {
      const a = e.readUInt16BE(n);
      n += 2 + a;
    } else i === 1 ? n += 1 : i === 2 ? n += 2 : i === 3 ? n += 4 : i === 4 ? n += 8 : i === 5 ? n += 4 : i === 6 && (n += 8);
  }
  return t;
}
function Jd(e) {
  const t = (o) => {
    const s = Buffer.from(o, "utf8"), a = Buffer.alloc(2);
    return a.writeUInt16BE(s.length), Buffer.concat([a, s]);
  }, n = [];
  for (const o of e) {
    const s = Buffer.concat([Buffer.from([8]), t("name"), t(o.name)]), a = Buffer.concat([Buffer.from([8]), t("ip"), t(o.ip)]);
    n.push(Buffer.concat([s, a, Buffer.from([0])]));
  }
  const r = Buffer.alloc(5);
  r[0] = 10, r.writeInt32BE(e.length, 1);
  const i = Buffer.concat([
    Buffer.from([9]),
    t("servers"),
    r,
    ...n
  ]);
  return Buffer.concat([
    Buffer.from([10]),
    t(""),
    i,
    Buffer.from([0])
  ]);
}
function Yd(e) {
  return e === "forge" ? "1" : e === "fabric" ? "4" : e === "neoforge" ? "6" : e === "quilt" ? "5" : "0";
}
function br(e, t) {
  return new Promise((n, r) => {
    Et.get(e, { headers: { "x-api-key": t, Accept: "application/json" } }, (i) => {
      let o = "";
      i.on("data", (s) => o += s), i.on("end", () => {
        if (i.statusCode !== 200) return r(new Error(`HTTP ${i.statusCode}: ${o}`));
        try {
          n(JSON.parse(o));
        } catch (s) {
          r(new Error(`Invalid JSON: ${s.message}`));
        }
      });
    }).on("error", r);
  });
}
function iI() {
  re.handle("instances:get", () => zt.getAll()), re.handle("instances:create", (e, t) => {
    const n = zt.create(t);
    return ve.getAllWindows().forEach((r) => r.webContents.send("instances:updated")), n;
  }), re.handle("instances:delete", (e, t) => {
    zt.delete(t), ve.getAllWindows().forEach((n) => n.webContents.send("instances:updated"));
  }), re.handle("instances:copy", (e, t) => {
    const n = zt.copy(t);
    return ve.getAllWindows().forEach((r) => r.webContents.send("instances:updated")), n;
  }), re.handle("instances:update", (e, t) => {
    zt.update(t), ve.getAllWindows().forEach((n) => n.webContents.send("instances:updated"));
  }), re.handle("instances:launch", (e, t) => tI(t)), re.handle("instances:kill", (e, t) => {
    Kd(t) && nI(t);
  }), re.handle("instances:isRunning", (e, t) => Kd(t)), re.handle("instance:listFolder", async (e, t, n) => {
    const r = D.join(oe.instances, t, n);
    return L.existsSync(r) ? L.readdirSync(r) : [];
  }), re.handle("instance:openFolder", async (e, t, n) => {
    const r = D.join(oe.instances, t, n);
    L.existsSync(r) || L.mkdirSync(r, { recursive: !0 }), so.openPath(r);
  }), re.handle("instance:deleteFile", async (e, t, n) => {
    const r = D.join(oe.instances, t, n);
    L.existsSync(r) && L.unlinkSync(r);
  }), re.handle("instance:downloadMod", async (e, t, n, r) => {
    const i = D.join(oe.instances, t, "minecraft", "mods");
    L.existsSync(i) || L.mkdirSync(i, { recursive: !0 });
    const o = D.join(i, r);
    return await new Promise((s, a) => {
      const c = (u, l = 0) => {
        if (l > 5) return a(new Error("Too many redirects"));
        Et.get(u, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (f) => {
          if ([301, 302, 307, 308].includes(f.statusCode)) return c(f.headers.location, l + 1);
          if (f.statusCode !== 200) return a(new Error(`HTTP ${f.statusCode}`));
          const h = L.createWriteStream(o);
          f.pipe(h), h.on("finish", () => {
            h.close(), s();
          }), h.on("error", a);
        }).on("error", a);
      };
      c(n);
    }), r;
  }), re.handle("instance:curseforgeSearch", async (e, t, n, r, i, o) => {
    const s = Vt.store.services.curseforgeApiKey;
    if (!s) throw new Error("CurseForge API key not configured.");
    const a = new URLSearchParams({
      gameId: "432",
      searchFilter: t,
      gameVersion: n,
      classId: String(i),
      modLoaderType: Yd(r),
      index: String(o),
      pageSize: "20",
      sortField: "2",
      sortOrder: "desc"
    });
    return br(`https://api.curseforge.com/v1/mods/search?${a}`, s);
  }), re.handle("instance:curseforgeGetFiles", async (e, t, n, r) => {
    const i = Vt.store.services.curseforgeApiKey;
    if (!i) throw new Error("CurseForge API key not configured.");
    const o = new URLSearchParams({
      gameVersion: n,
      modLoaderType: Yd(r),
      pageSize: "20"
    });
    return br(`https://api.curseforge.com/v1/mods/${t}/files?${o}`, i);
  }), re.handle("instance:getServers", async (e, t) => {
    const n = D.join(oe.instances, t, "minecraft", "servers.dat");
    if (!L.existsSync(n)) return [];
    try {
      return Rc(L.readFileSync(n));
    } catch {
      return [];
    }
  }), re.handle("instance:addServer", async (e, t, n, r) => {
    const i = D.join(oe.instances, t, "minecraft", "servers.dat"), o = D.join(oe.instances, t, "minecraft");
    L.existsSync(o) || L.mkdirSync(o, { recursive: !0 });
    let s = [];
    if (L.existsSync(i))
      try {
        s = Rc(L.readFileSync(i));
      } catch {
      }
    s.push({ name: n, ip: r });
    const a = Jd(s);
    console.log("[servers.dat] First 4 bytes:", a[0].toString(16), a[1].toString(16), a[2].toString(16), a[3].toString(16)), L.writeFileSync(i, a);
  }), re.handle("instance:removeServer", async (e, t, n) => {
    const r = D.join(oe.instances, t, "minecraft", "servers.dat");
    if (L.existsSync(r))
      try {
        const i = Rc(L.readFileSync(r));
        i.splice(n, 1), L.writeFileSync(r, Jd(i));
      } catch {
      }
  }), re.handle("instance:downloadFile", async (e, t, n, r, i) => {
    const o = D.join(oe.instances, t, "minecraft", i);
    L.existsSync(o) || L.mkdirSync(o, { recursive: !0 });
    const s = D.join(o, r);
    return await new Promise((a, c) => {
      const u = (l, f = 0) => {
        if (f > 5) return c(new Error("Too many redirects"));
        Et.get(l, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (h) => {
          if ([301, 302, 307, 308].includes(h.statusCode)) return u(h.headers.location, f + 1);
          if (h.statusCode !== 200) return c(new Error(`HTTP ${h.statusCode}`));
          const d = L.createWriteStream(s);
          h.pipe(d), d.on("finish", () => {
            d.close(), a();
          }), d.on("error", c);
        }).on("error", c);
      };
      u(n);
    }), r;
  }), re.handle("instance:createShortcut", async (e, t) => {
    const n = zt.getAll().find((i) => i.id === t);
    if (!n) return;
    const { filePath: r } = await Ir.showSaveDialog({
      title: "Create Shortcut",
      defaultPath: D.join(Pe.getPath("desktop"), `${n.name}.lnk`),
      filters: [{ name: "Shortcut", extensions: ["lnk"] }]
    });
    r && (Pe.isPackaged ? so.writeShortcutLink(r, {
      target: process.execPath,
      description: `Launch ${n.name} via Fernlauncher`
    }) : Ir.showMessageBox({
      type: "info",
      message: "Shortcuts can only be created in the packaged app, not in dev mode."
    }));
  }), re.handle("instance:export", async (e, t) => {
    const n = zt.getAll().find((s) => s.id === t);
    if (!n) return;
    const { filePath: r } = await Ir.showSaveDialog({
      title: "Export Instance",
      defaultPath: `${n.name}.fernpack`,
      filters: [{ name: "Fernlauncher Pack", extensions: ["fernpack"] }]
    });
    if (!r) return;
    const i = D.join(oe.instances, t), o = new En();
    o.addLocalFolder(i), o.writeZip(r);
  }), re.handle("instance:import", async (e, t) => {
    const n = new En(t), r = n.readAsText("instance.json");
    if (!r) throw new Error("Invalid fernpack file");
    const i = JSON.parse(r), o = Date.now().toString(36) + Math.random().toString(36).slice(2);
    i.id = o, i.name = i.name + " (Imported)";
    const s = D.join(oe.instances, o);
    L.mkdirSync(s, { recursive: !0 }), n.extractAllTo(s, !0), L.writeFileSync(D.join(s, "instance.json"), JSON.stringify(i, null, 2)), ve.getAllWindows().forEach((a) => a.webContents.send("instances:updated"));
  }), re.handle("dialog:openFile", async (e, t) => Ir.showOpenDialog(t)), re.handle("instance:setIcon", async (e, t) => {
    const { filePaths: n } = await Ir.showOpenDialog({
      title: "Choose Instance Icon",
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp", "gif"] }],
      properties: ["openFile"]
    });
    if (!(n != null && n[0])) return null;
    const r = D.extname(n[0]), i = D.join(oe.instances, t), o = D.join(i, `icon${r}`);
    L.copyFileSync(n[0], o);
    const s = zt.getAll().find((a) => a.id === t);
    return s && (s.icon = `icon${r}`, zt.update(s), ve.getAllWindows().forEach((a) => a.webContents.send("instances:updated"))), o;
  }), re.handle("instance:getIconPath", (e, t, n) => D.join(oe.instances, t, n)), re.handle("instance:getIconData", async (e, t, n) => {
    const r = D.join(oe.instances, t, n);
    if (!L.existsSync(r)) return null;
    const i = L.readFileSync(r);
    return `data:image/${D.extname(n).slice(1).replace("jpg", "jpeg")};base64,${i.toString("base64")}`;
  }), re.handle("instance:getScreenshot", async (e, t, n) => {
    const r = D.join(oe.instances, t, "minecraft", "screenshots", n);
    if (!L.existsSync(r)) return null;
    const i = L.readFileSync(r);
    return `data:image/${D.extname(n).slice(1).replace("jpg", "jpeg")};base64,${i.toString("base64")}`;
  }), re.handle("instance:openFile", async (e, t, n) => {
    const r = D.join(oe.instances, t, n);
    so.openPath(r);
  }), re.handle("instance:readLog", async (e, t) => {
    const n = D.join(oe.instances, t, "minecraft", "logs", "latest.log");
    return L.existsSync(n) ? L.readFileSync(n, "utf-8") : "";
  }), re.handle("instance:watchLog", async (e, t) => {
    const n = D.join(oe.instances, t, "minecraft", "logs", "latest.log");
    if (!L.existsSync(n)) return;
    const r = ve.getAllWindows().find(
      (o) => o.webContents.getURL().includes(`instanceId=${t}`) && o.webContents.getURL().includes("instanceEditor")
    );
    if (!r) return;
    const i = L.watch(n, () => {
      if (!L.existsSync(n)) return;
      const o = L.readFileSync(n, "utf-8");
      r.webContents.send("instance:logUpdated", o);
    });
    r.on("closed", () => i.close());
  }), re.handle("instance:installModrinthModpack", async (e, t, n, r) => {
    var U, G;
    const i = await import("https"), o = ve.fromWebContents(e.sender), s = (z) => o == null ? void 0 : o.webContents.send("modpack:progress", z);
    s("Fetching modpack info...");
    const a = await new Promise((z, H) => {
      i.default.get(
        `https://api.modrinth.com/v2/version/${t}`,
        { headers: { "User-Agent": "Fernlaunch/1.0" } },
        (b) => {
          let B = "";
          b.on("data", (V) => B += V), b.on("end", () => z(JSON.parse(B)));
        }
      ).on("error", H);
    }), c = a.files.find((z) => z.primary) ?? a.files[0];
    s("Downloading modpack...");
    const u = D.join(oe.java, `temp_${Date.now()}.mrpack`);
    await new Promise((z, H) => {
      const b = (B, V = 0) => {
        if (V > 5) return H(new Error("Too many redirects"));
        i.default.get(B, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (Z) => {
          if ([301, 302, 307, 308].includes(Z.statusCode)) return b(Z.headers.location, V + 1);
          if (Z.statusCode !== 200) return H(new Error(`HTTP ${Z.statusCode}`));
          const F = L.createWriteStream(u);
          Z.pipe(F), F.on("finish", () => {
            F.close(), z();
          }), F.on("error", H);
        }).on("error", H);
      };
      b(c.url);
    });
    const l = new En(u), f = JSON.parse(l.readAsText("modrinth.index.json"));
    s(`Installing ${f.name}...`);
    const h = f.dependencies.minecraft, d = f.dependencies["fabric-loader"], m = f.dependencies["quilt-loader"], p = f.dependencies.forge, v = f.dependencies.neoforge, y = d ? "fabric" : m ? "quilt" : p ? "forge" : v ? "neoforge" : "none", g = d ?? m ?? p ?? v ?? "", E = zt.create({
      name: n || f.name,
      version: h,
      modLoader: y,
      modLoaderVersion: g,
      group: r,
      icon: "default"
    }), S = D.join(oe.instances, E.id, "minecraft", "mods");
    L.mkdirSync(S, { recursive: !0 });
    for (const z of l.getEntries())
      if (z.entryName.startsWith("overrides/")) {
        const H = D.join(oe.instances, E.id, "minecraft", z.entryName.replace("overrides/", ""));
        z.isDirectory ? L.mkdirSync(H, { recursive: !0 }) : (L.mkdirSync(D.dirname(H), { recursive: !0 }), l.extractEntryTo(z, D.dirname(H), !1, !0));
      }
    const C = [];
    for (const z of f.files ?? []) {
      if (((U = z.env) == null ? void 0 : U.client) === "unsupported") continue;
      const b = D.join(oe.instances, E.id, "minecraft", z.path);
      if (L.mkdirSync(D.dirname(b), { recursive: !0 }), s(`Downloading ${D.basename(z.path)}...`), (G = z.downloads) != null && G.length)
        try {
          await new Promise((B, V) => {
            const Z = (F, x = 0) => {
              if (x > 5) return V(new Error("Too many redirects"));
              i.default.get(F, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (W) => {
                if ([301, 302, 307, 308].includes(W.statusCode)) return Z(W.headers.location, x + 1);
                if (W.statusCode !== 200) return V(new Error(`HTTP ${W.statusCode}`));
                const q = L.createWriteStream(b);
                W.pipe(q), q.on("finish", () => {
                  q.close(), B();
                }), q.on("error", V);
              }).on("error", V);
            };
            Z(z.downloads[0]);
          });
        } catch {
          C.push({ name: D.basename(z.path), url: z.downloads[0] });
        }
      else
        C.push({ name: D.basename(z.path) });
    }
    return L.unlinkSync(u), ve.getAllWindows().forEach((z) => z.webContents.send("instances:updated")), { instance: E, manualFiles: C };
  }), re.handle("open:external", (e, t) => so.openExternal(t)), re.handle("instance:checkManualFiles", async (e, t, n, r) => {
    const i = [], o = D.join(oe.instances, t, "minecraft", "mods");
    L.mkdirSync(o, { recursive: !0 });
    for (const s of n) {
      const a = D.join(r, s);
      L.existsSync(a) && (L.copyFileSync(a, D.join(o, s)), i.push(s));
    }
    return i;
  }), re.handle("get:downloadsPath", () => Pe.getPath("downloads")), re.handle("instance:installCurseForgeModpack", async (e, t, n, r, i) => {
    var C, U, G, z, H;
    const o = ve.fromWebContents(e.sender), s = (b) => o == null ? void 0 : o.webContents.send("modpack:progress", b);
    s("Fetching modpack info...");
    const a = Vt.store.services.curseforgeApiKey, u = (await br(`https://api.curseforge.com/v1/mods/${n}/files/${t}`, a)).data;
    s("Downloading modpack...");
    const l = D.join(oe.java, `temp_${Date.now()}.zip`);
    if (!u.downloadUrl) throw new Error("This modpack file has no download URL (blocked by CurseForge).");
    await new Promise((b, B) => {
      const V = (Z, F = 0) => {
        if (F > 5) return B(new Error("Too many redirects"));
        Et.get(Z, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (x) => {
          if ([301, 302, 307, 308].includes(x.statusCode)) return V(x.headers.location, F + 1);
          if (x.statusCode !== 200) return B(new Error(`HTTP ${x.statusCode}`));
          const W = L.createWriteStream(l);
          x.pipe(W), W.on("finish", () => {
            W.close(), b();
          }), W.on("error", B);
        }).on("error", B);
      };
      V(u.downloadUrl);
    });
    const f = new En(l), h = JSON.parse(f.readAsText("manifest.json")), d = (C = h.minecraft) == null ? void 0 : C.version, m = ((z = (G = (U = h.minecraft) == null ? void 0 : U.modLoaders) == null ? void 0 : G.find((b) => b.primary)) == null ? void 0 : z.id) ?? "", p = m.startsWith("fabric-") ? "fabric" : m.startsWith("quilt-") ? "quilt" : m.startsWith("neoforge-") ? "neoforge" : m.startsWith("forge-") ? "forge" : "none", v = m.split("-").slice(1).join("-"), y = zt.create({
      name: r || h.name,
      version: d,
      modLoader: p,
      modLoaderVersion: v,
      group: i,
      icon: "default"
    }), g = D.join(oe.instances, y.id, "minecraft", "mods");
    L.mkdirSync(g, { recursive: !0 });
    for (const b of f.getEntries())
      if (b.entryName.startsWith("overrides/")) {
        const B = D.join(oe.instances, y.id, "minecraft", b.entryName.replace("overrides/", ""));
        b.isDirectory ? L.mkdirSync(B, { recursive: !0 }) : (L.mkdirSync(D.dirname(B), { recursive: !0 }), f.extractEntryTo(b, D.dirname(B), !1, !0));
      }
    L.unlinkSync(l);
    const E = [], S = h.files ?? [];
    for (const b of S)
      if (b.required !== !1) {
        s(`Fetching mod ${b.fileID}...`);
        try {
          const V = (await br(
            `https://api.curseforge.com/v1/mods/${b.projectID}/files/${b.fileID}`,
            a
          )).data, Z = D.join(g, V.fileName);
          if (V.downloadUrl)
            s(`Downloading ${V.fileName}...`), await new Promise((F, x) => {
              const W = (q, Y = 0) => {
                if (Y > 5) return x(new Error("Too many redirects"));
                Et.get(q, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (J) => {
                  if ([301, 302, 307, 308].includes(J.statusCode)) return W(J.headers.location, Y + 1);
                  if (J.statusCode !== 200) return x(new Error(`HTTP ${J.statusCode}`));
                  const j = L.createWriteStream(Z);
                  J.pipe(j), j.on("finish", () => {
                    j.close(), F();
                  }), j.on("error", x);
                }).on("error", x);
              };
              W(V.downloadUrl);
            });
          else
            try {
              const W = `https://www.curseforge.com/minecraft/mc-mods/${((H = (await br(`https://api.curseforge.com/v1/mods/${b.projectID}`, a)).data) == null ? void 0 : H.slug) ?? String(b.projectID)}/files/${b.fileID}`;
              E.push({ name: V.fileName, url: W });
            } catch {
              E.push({ name: V.fileName });
            }
        } catch (B) {
          console.warn(`Failed to get mod ${b.fileID}:`, B), E.push({ name: `mod-${b.fileID}.jar` });
        }
      }
    return ve.getAllWindows().forEach((b) => b.webContents.send("instances:updated")), { instance: y, manualFiles: E };
  }), re.handle("instance:cfModpackSearch", async (e, t, n) => {
    const r = Vt.store.services.curseforgeApiKey;
    if (!r) throw new Error("CurseForge API key not configured.");
    const i = new URLSearchParams({
      gameId: "432",
      classId: "4471",
      searchFilter: t,
      index: String(n),
      pageSize: "20",
      sortField: "2",
      sortOrder: "desc"
    });
    return br(`https://api.curseforge.com/v1/mods/search?${i}`, r);
  }), re.handle("instance:cfModpackFiles", async (e, t) => {
    const n = Vt.store.services.curseforgeApiKey;
    if (!n) throw new Error("CurseForge API key not configured.");
    const r = new URLSearchParams({
      pageSize: "20",
      sortField: "1",
      sortOrder: "desc"
    });
    return br(`https://api.curseforge.com/v1/mods/${t}/files?${r}`, n);
  });
}
function oI() {
  re.handle("accounts:get", () => Tr.getAll()), re.handle("accounts:addMicrosoft", async () => {
    const e = await Tr.addMicrosoft();
    return ve.getAllWindows().forEach((t) => {
      t.webContents.send("accounts:updated");
    }), e;
  }), re.handle("accounts:remove", (e, t) => {
    Tr.remove(t), ve.getAllWindows().forEach((n) => {
      n.webContents.send("accounts:updated");
    });
  }), re.handle("accounts:setActive", (e, t) => {
    console.log("[Accounts] Setting active:", t), Tr.setActive(t), ve.getAllWindows().forEach((n) => {
      n.webContents.send("accounts:updated");
    });
  }), re.handle("accounts:refresh", (e, t) => Tr.refresh(t)), re.handle("accounts:addOffline", (e, t) => {
    const n = Tr.addOffline(t);
    return ve.getAllWindows().forEach((r) => r.webContents.send("accounts:updated")), n;
  });
}
const sI = Ip(import.meta.url), aI = Np(sI), Xd = process.env.VITE_DEV_SERVER_URL;
function cI() {
  re.handle("java:detect", async () => new Promise((e) => {
    setImmediate(() => {
      e(na.detect());
    });
  })), re.handle("java:installs", () => na.getInstalled()), re.handle("java:download", () => {
    const e = new ve({
      width: 600,
      height: 500,
      title: "Install Java — Fernlauncher",
      center: !0,
      webPreferences: {
        preload: ze(aI, "../dist-electron/preload.cjs"),
        sandbox: !1
      }
    });
    e.setMenuBarVisibility(!1), Xd ? e.loadURL(Xd + "?window=javaDownload") : e.loadFile(ze(Pe.getAppPath(), "dist/index.html"), {
      query: { window: "javaDownload" }
    });
  }), re.handle("java:browse", async () => {
    const e = await Ir.showOpenDialog({
      title: "Select Java Executable",
      filters: [
        { name: "Java", extensions: process.platform === "win32" ? ["exe"] : ["*"] }
      ],
      properties: ["openFile"]
    });
    return e.canceled ? null : e.filePaths[0];
  }), re.handle("java:mojangVersions", async () => new Promise((e, t) => {
    Et.get("https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json", (r) => {
      let i = "";
      r.on("data", (o) => i += o), r.on("end", () => {
        try {
          const o = JSON.parse(i), s = process.platform === "win32" ? "windows-x64" : process.platform === "darwin" ? "mac-os" : "linux", a = o[s] ?? {}, c = [];
          for (const [u, l] of Object.entries(a)) {
            const f = l;
            if (f.length === 0) continue;
            const h = f[0];
            c.push({
              component: u,
              majorVersion: h.version.name.split(".")[0] === "1" ? 8 : parseInt(h.version.name.split(".")[0]),
              version: h.version.name,
              released: h.version.released ?? "",
              type: u.includes("jre") ? "jre" : "jdk"
            });
          }
          c.sort((u, l) => l.majorVersion - u.majorVersion), e(c);
        } catch (o) {
          t(o);
        }
      });
    }).on("error", t);
  })), re.handle("java:downloadMojang", async (e, t) => {
    var f;
    const n = process.platform === "win32" ? "windows-x64" : process.platform === "darwin" ? "mac-os" : "linux", o = ((await new Promise((h, d) => {
      Et.get("https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json", (m) => {
        let p = "";
        m.on("data", (v) => p += v), m.on("end", () => h(JSON.parse(p)));
      }).on("error", d);
    }))[n] ?? {})[t];
    if (!o || o.length === 0) throw new Error("No download found for " + t);
    const s = o[0].manifest.url, a = await new Promise((h, d) => {
      Et.get(s, (m) => {
        let p = "";
        m.on("data", (v) => p += v), m.on("end", () => h(JSON.parse(p)));
      }).on("error", d);
    }), c = D.join(oe.java, t);
    L.existsSync(c) || L.mkdirSync(c, { recursive: !0 });
    const u = Object.entries(a.files);
    let l = 0;
    for (const [h, d] of u) {
      const m = D.join(c, h);
      if (d.type === "directory") {
        L.existsSync(m) || L.mkdirSync(m, { recursive: !0 }), l++;
        continue;
      }
      if (d.type === "link") {
        try {
          const y = D.dirname(m);
          L.existsSync(y) || L.mkdirSync(y, { recursive: !0 }), L.existsSync(m) && L.unlinkSync(m), L.symlinkSync(d.target, m);
        } catch {
        }
        l++;
        continue;
      }
      const p = (f = d.downloads) == null ? void 0 : f.raw;
      if (!p) {
        l++;
        continue;
      }
      const v = D.dirname(m);
      L.existsSync(v) || L.mkdirSync(v, { recursive: !0 });
      try {
        await new Promise((y, g) => {
          const E = L.createWriteStream(m), S = Et.get(p.url, (C) => {
            if (C.statusCode !== 200) {
              E.close(), L.unlink(m, () => {
              }), g(new Error(`HTTP ${C.statusCode} for ${h}`));
              return;
            }
            C.pipe(E), E.on("finish", () => {
              if (E.close(), d.executable)
                try {
                  L.chmodSync(m, 493);
                } catch {
                }
              y();
            }), E.on("error", (U) => {
              L.unlink(m, () => {
              }), g(U);
            });
          });
          S.on("error", (C) => {
            E.close(), L.unlink(m, () => {
            }), g(C);
          }), S.setTimeout(3e4, () => {
            S.destroy(), g(new Error(`Timeout downloading ${h}`));
          });
        });
      } catch (y) {
        console.error(`Failed to download ${h}:`, y);
      }
      l++, ve.getAllWindows().forEach((y) => {
        y.webContents.send("java:downloadProgress", {
          component: t,
          done: l,
          total: u.length,
          percent: Math.round(l / u.length * 100)
        });
      });
    }
  });
}
function no(e) {
  return new Promise((t, n) => {
    Et.get(e, (r) => {
      let i = "";
      r.on("data", (o) => i += o), r.on("end", () => {
        try {
          t(JSON.parse(i));
        } catch (o) {
          n(o);
        }
      });
    }).on("error", n);
  });
}
function lI() {
  re.handle("versions:get", async () => (await no(
    "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json"
  )).versions.map((t) => ({
    id: t.id,
    type: t.type,
    releaseTime: t.releaseTime
  }))), re.handle("versions:fabric", async (e, t) => {
    try {
      return (await no(
        `https://meta.fabricmc.net/v2/versions/loader/${t}`
      )).map((r) => ({
        version: r.loader.version,
        stable: r.loader.stable
      }));
    } catch {
      return [];
    }
  }), re.handle("versions:quilt", async (e, t) => {
    try {
      return (await no(
        `https://meta.quiltmc.org/v3/versions/loader/${t}`
      )).map((r) => ({
        version: r.loader.version,
        stable: !0
      }));
    } catch {
      return [];
    }
  }), re.handle("versions:neoforge", async (e, t) => {
    try {
      const r = (await no(
        "https://maven.neoforged.net/api/maven/versions/releases/net/neoforged/neoforge"
      )).versions, i = t.split("."), o = i[1], s = i[2] ?? "0";
      return r.filter((c) => {
        const u = s === "0" ? `${o}.0.` : `${o}.${s}.`;
        return c.startsWith(u);
      }).reverse().map((c) => ({
        version: c,
        stable: !0
      }));
    } catch {
      return [];
    }
  }), re.handle("versions:forge", async (e, t) => {
    try {
      return ((await no(
        "https://files.minecraftforge.net/net/minecraftforge/forge/maven-metadata.json"
      ))[t] ?? []).reverse().map((i) => ({
        version: i,
        stable: !0
      }));
    } catch {
      return [];
    }
  });
}
var Xn = {}, Jr = {}, Rt = {};
Rt.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((n, r) => {
        t.push((i, o) => i != null ? r(i) : n(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Rt.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const n = t[t.length - 1];
    if (typeof n != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((r) => n(null, r), n);
  }, "name", { value: e.name });
};
var Wn = hv, uI = process.cwd, Ws = null, fI = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Ws || (Ws = uI.call(process)), Ws;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Zd = process.chdir;
  process.chdir = function(e) {
    Ws = null, Zd.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Zd);
}
var dI = hI;
function hI(e) {
  Wn.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = s(e.chownSync), e.fchownSync = s(e.fchownSync), e.lchownSync = s(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = a(e.stat), e.fstat = a(e.fstat), e.lstat = a(e.lstat), e.statSync = c(e.statSync), e.fstatSync = c(e.fstatSync), e.lstatSync = c(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(l, f, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(l, f, h, d) {
    d && process.nextTick(d);
  }, e.lchownSync = function() {
  }), fI === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(l) {
    function f(h, d, m) {
      var p = Date.now(), v = 0;
      l(h, d, function y(g) {
        if (g && (g.code === "EACCES" || g.code === "EPERM" || g.code === "EBUSY") && Date.now() - p < 6e4) {
          setTimeout(function() {
            e.stat(d, function(E, S) {
              E && E.code === "ENOENT" ? l(h, d, y) : m(g);
            });
          }, v), v < 100 && (v += 10);
          return;
        }
        m && m(g);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, l), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(l) {
    function f(h, d, m, p, v, y) {
      var g;
      if (y && typeof y == "function") {
        var E = 0;
        g = function(S, C, U) {
          if (S && S.code === "EAGAIN" && E < 10)
            return E++, l.call(e, h, d, m, p, v, g);
          y.apply(this, arguments);
        };
      }
      return l.call(e, h, d, m, p, v, g);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, l), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(l) {
    return function(f, h, d, m, p) {
      for (var v = 0; ; )
        try {
          return l.call(e, f, h, d, m, p);
        } catch (y) {
          if (y.code === "EAGAIN" && v < 10) {
            v++;
            continue;
          }
          throw y;
        }
    };
  }(e.readSync);
  function t(l) {
    l.lchmod = function(f, h, d) {
      l.open(
        f,
        Wn.O_WRONLY | Wn.O_SYMLINK,
        h,
        function(m, p) {
          if (m) {
            d && d(m);
            return;
          }
          l.fchmod(p, h, function(v) {
            l.close(p, function(y) {
              d && d(v || y);
            });
          });
        }
      );
    }, l.lchmodSync = function(f, h) {
      var d = l.openSync(f, Wn.O_WRONLY | Wn.O_SYMLINK, h), m = !0, p;
      try {
        p = l.fchmodSync(d, h), m = !1;
      } finally {
        if (m)
          try {
            l.closeSync(d);
          } catch {
          }
        else
          l.closeSync(d);
      }
      return p;
    };
  }
  function n(l) {
    Wn.hasOwnProperty("O_SYMLINK") && l.futimes ? (l.lutimes = function(f, h, d, m) {
      l.open(f, Wn.O_SYMLINK, function(p, v) {
        if (p) {
          m && m(p);
          return;
        }
        l.futimes(v, h, d, function(y) {
          l.close(v, function(g) {
            m && m(y || g);
          });
        });
      });
    }, l.lutimesSync = function(f, h, d) {
      var m = l.openSync(f, Wn.O_SYMLINK), p, v = !0;
      try {
        p = l.futimesSync(m, h, d), v = !1;
      } finally {
        if (v)
          try {
            l.closeSync(m);
          } catch {
          }
        else
          l.closeSync(m);
      }
      return p;
    }) : l.futimes && (l.lutimes = function(f, h, d, m) {
      m && process.nextTick(m);
    }, l.lutimesSync = function() {
    });
  }
  function r(l) {
    return l && function(f, h, d) {
      return l.call(e, f, h, function(m) {
        u(m) && (m = null), d && d.apply(this, arguments);
      });
    };
  }
  function i(l) {
    return l && function(f, h) {
      try {
        return l.call(e, f, h);
      } catch (d) {
        if (!u(d)) throw d;
      }
    };
  }
  function o(l) {
    return l && function(f, h, d, m) {
      return l.call(e, f, h, d, function(p) {
        u(p) && (p = null), m && m.apply(this, arguments);
      });
    };
  }
  function s(l) {
    return l && function(f, h, d) {
      try {
        return l.call(e, f, h, d);
      } catch (m) {
        if (!u(m)) throw m;
      }
    };
  }
  function a(l) {
    return l && function(f, h, d) {
      typeof h == "function" && (d = h, h = null);
      function m(p, v) {
        v && (v.uid < 0 && (v.uid += 4294967296), v.gid < 0 && (v.gid += 4294967296)), d && d.apply(this, arguments);
      }
      return h ? l.call(e, f, h, m) : l.call(e, f, m);
    };
  }
  function c(l) {
    return l && function(f, h) {
      var d = h ? l.call(e, f, h) : l.call(e, f);
      return d && (d.uid < 0 && (d.uid += 4294967296), d.gid < 0 && (d.gid += 4294967296)), d;
    };
  }
  function u(l) {
    if (!l || l.code === "ENOSYS")
      return !0;
    var f = !process.getuid || process.getuid() !== 0;
    return !!(f && (l.code === "EINVAL" || l.code === "EPERM"));
  }
}
var Qd = Mo.Stream, pI = mI;
function mI(e) {
  return {
    ReadStream: t,
    WriteStream: n
  };
  function t(r, i) {
    if (!(this instanceof t)) return new t(r, i);
    Qd.call(this);
    var o = this;
    this.path = r, this.fd = null, this.readable = !0, this.paused = !1, this.flags = "r", this.mode = 438, this.bufferSize = 64 * 1024, i = i || {};
    for (var s = Object.keys(i), a = 0, c = s.length; a < c; a++) {
      var u = s[a];
      this[u] = i[u];
    }
    if (this.encoding && this.setEncoding(this.encoding), this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.end === void 0)
        this.end = 1 / 0;
      else if (typeof this.end != "number")
        throw TypeError("end must be a Number");
      if (this.start > this.end)
        throw new Error("start must be <= end");
      this.pos = this.start;
    }
    if (this.fd !== null) {
      process.nextTick(function() {
        o._read();
      });
      return;
    }
    e.open(this.path, this.flags, this.mode, function(l, f) {
      if (l) {
        o.emit("error", l), o.readable = !1;
        return;
      }
      o.fd = f, o.emit("open", f), o._read();
    });
  }
  function n(r, i) {
    if (!(this instanceof n)) return new n(r, i);
    Qd.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
    for (var o = Object.keys(i), s = 0, a = o.length; s < a; s++) {
      var c = o[s];
      this[c] = i[c];
    }
    if (this.start !== void 0) {
      if (typeof this.start != "number")
        throw TypeError("start must be a Number");
      if (this.start < 0)
        throw new Error("start must be >= zero");
      this.pos = this.start;
    }
    this.busy = !1, this._queue = [], this.fd === null && (this._open = e.open, this._queue.push([this._open, this.path, this.flags, this.mode, void 0]), this.flush());
  }
}
var gI = vI, yI = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function vI(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: yI(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(n) {
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
  }), t;
}
var qe = L, wI = dI, EI = pI, _I = gI, Cs = xl, ft, oa;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (ft = Symbol.for("graceful-fs.queue"), oa = Symbol.for("graceful-fs.previous")) : (ft = "___graceful-fs.queue", oa = "___graceful-fs.previous");
function $I() {
}
function hg(e, t) {
  Object.defineProperty(e, ft, {
    get: function() {
      return t;
    }
  });
}
var Br = $I;
Cs.debuglog ? Br = Cs.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Br = function() {
  var e = Cs.format.apply(Cs, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!qe[ft]) {
  var SI = Nt[ft] || [];
  hg(qe, SI), qe.close = function(e) {
    function t(n, r) {
      return e.call(qe, n, function(i) {
        i || eh(), typeof r == "function" && r.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, oa, {
      value: e
    }), t;
  }(qe.close), qe.closeSync = function(e) {
    function t(n) {
      e.apply(qe, arguments), eh();
    }
    return Object.defineProperty(t, oa, {
      value: e
    }), t;
  }(qe.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Br(qe[ft]), Op.equal(qe[ft].length, 0);
  });
}
Nt[ft] || hg(Nt, qe[ft]);
var Dt = Ku(_I(qe));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !qe.__patched && (Dt = Ku(qe), qe.__patched = !0);
function Ku(e) {
  wI(e), e.gracefulify = Ku, e.createReadStream = C, e.createWriteStream = U;
  var t = e.readFile;
  e.readFile = n;
  function n(H, b, B) {
    return typeof b == "function" && (B = b, b = null), V(H, b, B);
    function V(Z, F, x, W) {
      return t(Z, F, function(q) {
        q && (q.code === "EMFILE" || q.code === "ENFILE") ? oi([V, [Z, F, x], q, W || Date.now(), Date.now()]) : typeof x == "function" && x.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = i;
  function i(H, b, B, V) {
    return typeof B == "function" && (V = B, B = null), Z(H, b, B, V);
    function Z(F, x, W, q, Y) {
      return r(F, x, W, function(J) {
        J && (J.code === "EMFILE" || J.code === "ENFILE") ? oi([Z, [F, x, W, q], J, Y || Date.now(), Date.now()]) : typeof q == "function" && q.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = s);
  function s(H, b, B, V) {
    return typeof B == "function" && (V = B, B = null), Z(H, b, B, V);
    function Z(F, x, W, q, Y) {
      return o(F, x, W, function(J) {
        J && (J.code === "EMFILE" || J.code === "ENFILE") ? oi([Z, [F, x, W, q], J, Y || Date.now(), Date.now()]) : typeof q == "function" && q.apply(this, arguments);
      });
    }
  }
  var a = e.copyFile;
  a && (e.copyFile = c);
  function c(H, b, B, V) {
    return typeof B == "function" && (V = B, B = 0), Z(H, b, B, V);
    function Z(F, x, W, q, Y) {
      return a(F, x, W, function(J) {
        J && (J.code === "EMFILE" || J.code === "ENFILE") ? oi([Z, [F, x, W, q], J, Y || Date.now(), Date.now()]) : typeof q == "function" && q.apply(this, arguments);
      });
    }
  }
  var u = e.readdir;
  e.readdir = f;
  var l = /^v[0-5]\./;
  function f(H, b, B) {
    typeof b == "function" && (B = b, b = null);
    var V = l.test(process.version) ? function(x, W, q, Y) {
      return u(x, Z(
        x,
        W,
        q,
        Y
      ));
    } : function(x, W, q, Y) {
      return u(x, W, Z(
        x,
        W,
        q,
        Y
      ));
    };
    return V(H, b, B);
    function Z(F, x, W, q) {
      return function(Y, J) {
        Y && (Y.code === "EMFILE" || Y.code === "ENFILE") ? oi([
          V,
          [F, x, W],
          Y,
          q || Date.now(),
          Date.now()
        ]) : (J && J.sort && J.sort(), typeof W == "function" && W.call(this, Y, J));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = EI(e);
    y = h.ReadStream, E = h.WriteStream;
  }
  var d = e.ReadStream;
  d && (y.prototype = Object.create(d.prototype), y.prototype.open = g);
  var m = e.WriteStream;
  m && (E.prototype = Object.create(m.prototype), E.prototype.open = S), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return y;
    },
    set: function(H) {
      y = H;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return E;
    },
    set: function(H) {
      E = H;
    },
    enumerable: !0,
    configurable: !0
  });
  var p = y;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return p;
    },
    set: function(H) {
      p = H;
    },
    enumerable: !0,
    configurable: !0
  });
  var v = E;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return v;
    },
    set: function(H) {
      v = H;
    },
    enumerable: !0,
    configurable: !0
  });
  function y(H, b) {
    return this instanceof y ? (d.apply(this, arguments), this) : y.apply(Object.create(y.prototype), arguments);
  }
  function g() {
    var H = this;
    z(H.path, H.flags, H.mode, function(b, B) {
      b ? (H.autoClose && H.destroy(), H.emit("error", b)) : (H.fd = B, H.emit("open", B), H.read());
    });
  }
  function E(H, b) {
    return this instanceof E ? (m.apply(this, arguments), this) : E.apply(Object.create(E.prototype), arguments);
  }
  function S() {
    var H = this;
    z(H.path, H.flags, H.mode, function(b, B) {
      b ? (H.destroy(), H.emit("error", b)) : (H.fd = B, H.emit("open", B));
    });
  }
  function C(H, b) {
    return new e.ReadStream(H, b);
  }
  function U(H, b) {
    return new e.WriteStream(H, b);
  }
  var G = e.open;
  e.open = z;
  function z(H, b, B, V) {
    return typeof B == "function" && (V = B, B = null), Z(H, b, B, V);
    function Z(F, x, W, q, Y) {
      return G(F, x, W, function(J, j) {
        J && (J.code === "EMFILE" || J.code === "ENFILE") ? oi([Z, [F, x, W, q], J, Y || Date.now(), Date.now()]) : typeof q == "function" && q.apply(this, arguments);
      });
    }
  }
  return e;
}
function oi(e) {
  Br("ENQUEUE", e[0].name, e[1]), qe[ft].push(e), Ju();
}
var Ns;
function eh() {
  for (var e = Date.now(), t = 0; t < qe[ft].length; ++t)
    qe[ft][t].length > 2 && (qe[ft][t][3] = e, qe[ft][t][4] = e);
  Ju();
}
function Ju() {
  if (clearTimeout(Ns), Ns = void 0, qe[ft].length !== 0) {
    var e = qe[ft].shift(), t = e[0], n = e[1], r = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Br("RETRY", t.name, n), t.apply(null, n);
    else if (Date.now() - i >= 6e4) {
      Br("TIMEOUT", t.name, n);
      var s = n.pop();
      typeof s == "function" && s.call(null, r);
    } else {
      var a = Date.now() - o, c = Math.max(o - i, 1), u = Math.min(c * 1.2, 100);
      a >= u ? (Br("RETRY", t.name, n), t.apply(null, n.concat([i]))) : qe[ft].push(e);
    }
    Ns === void 0 && (Ns = setTimeout(Ju, 0));
  }
}
(function(e) {
  const t = Rt.fromCallback, n = Dt, r = [
    "access",
    "appendFile",
    "chmod",
    "chown",
    "close",
    "copyFile",
    "fchmod",
    "fchown",
    "fdatasync",
    "fstat",
    "fsync",
    "ftruncate",
    "futimes",
    "lchmod",
    "lchown",
    "link",
    "lstat",
    "mkdir",
    "mkdtemp",
    "open",
    "opendir",
    "readdir",
    "readFile",
    "readlink",
    "realpath",
    "rename",
    "rm",
    "rmdir",
    "stat",
    "symlink",
    "truncate",
    "unlink",
    "utimes",
    "writeFile"
  ].filter((i) => typeof n[i] == "function");
  Object.assign(e, n), r.forEach((i) => {
    e[i] = t(n[i]);
  }), e.exists = function(i, o) {
    return typeof o == "function" ? n.exists(i, o) : new Promise((s) => n.exists(i, s));
  }, e.read = function(i, o, s, a, c, u) {
    return typeof u == "function" ? n.read(i, o, s, a, c, u) : new Promise((l, f) => {
      n.read(i, o, s, a, c, (h, d, m) => {
        if (h) return f(h);
        l({ bytesRead: d, buffer: m });
      });
    });
  }, e.write = function(i, o, ...s) {
    return typeof s[s.length - 1] == "function" ? n.write(i, o, ...s) : new Promise((a, c) => {
      n.write(i, o, ...s, (u, l, f) => {
        if (u) return c(u);
        a({ bytesWritten: l, buffer: f });
      });
    });
  }, typeof n.writev == "function" && (e.writev = function(i, o, ...s) {
    return typeof s[s.length - 1] == "function" ? n.writev(i, o, ...s) : new Promise((a, c) => {
      n.writev(i, o, ...s, (u, l, f) => {
        if (u) return c(u);
        a({ bytesWritten: l, buffers: f });
      });
    });
  }), typeof n.realpath.native == "function" ? e.realpath.native = t(n.realpath.native) : process.emitWarning(
    "fs.realpath.native is not a function. Is fs being monkey-patched?",
    "Warning",
    "fs-extra-WARN0003"
  );
})(Jr);
var Yu = {}, pg = {};
const bI = D;
pg.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(bI.parse(t).root, ""))) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw r.code = "EINVAL", r;
  }
};
const mg = Jr, { checkPath: gg } = pg, yg = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
Yu.makeDir = async (e, t) => (gg(e), mg.mkdir(e, {
  mode: yg(t),
  recursive: !0
}));
Yu.makeDirSync = (e, t) => (gg(e), mg.mkdirSync(e, {
  mode: yg(t),
  recursive: !0
}));
const AI = Rt.fromPromise, { makeDir: TI, makeDirSync: Dc } = Yu, Fc = AI(TI);
var $n = {
  mkdirs: Fc,
  mkdirsSync: Dc,
  // alias
  mkdirp: Fc,
  mkdirpSync: Dc,
  ensureDir: Fc,
  ensureDirSync: Dc
};
const CI = Rt.fromPromise, vg = Jr;
function NI(e) {
  return vg.access(e).then(() => !0).catch(() => !1);
}
var Yr = {
  pathExists: CI(NI),
  pathExistsSync: vg.existsSync
};
const Si = Dt;
function II(e, t, n, r) {
  Si.open(e, "r+", (i, o) => {
    if (i) return r(i);
    Si.futimes(o, t, n, (s) => {
      Si.close(o, (a) => {
        r && r(s || a);
      });
    });
  });
}
function PI(e, t, n) {
  const r = Si.openSync(e, "r+");
  return Si.futimesSync(r, t, n), Si.closeSync(r);
}
var wg = {
  utimesMillis: II,
  utimesMillisSync: PI
};
const Ci = Jr, ot = D, OI = xl;
function RI(e, t, n) {
  const r = n.dereference ? (i) => Ci.stat(i, { bigint: !0 }) : (i) => Ci.lstat(i, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function DI(e, t, n) {
  let r;
  const i = n.dereference ? (s) => Ci.statSync(s, { bigint: !0 }) : (s) => Ci.lstatSync(s, { bigint: !0 }), o = i(e);
  try {
    r = i(t);
  } catch (s) {
    if (s.code === "ENOENT") return { srcStat: o, destStat: null };
    throw s;
  }
  return { srcStat: o, destStat: r };
}
function FI(e, t, n, r, i) {
  OI.callbackify(RI)(e, t, r, (o, s) => {
    if (o) return i(o);
    const { srcStat: a, destStat: c } = s;
    if (c) {
      if (Go(a, c)) {
        const u = ot.basename(e), l = ot.basename(t);
        return n === "move" && u !== l && u.toLowerCase() === l.toLowerCase() ? i(null, { srcStat: a, destStat: c, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (a.isDirectory() && !c.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!a.isDirectory() && c.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return a.isDirectory() && Xu(e, t) ? i(new Error(Ha(e, t, n))) : i(null, { srcStat: a, destStat: c });
  });
}
function LI(e, t, n, r) {
  const { srcStat: i, destStat: o } = DI(e, t, r);
  if (o) {
    if (Go(i, o)) {
      const s = ot.basename(e), a = ot.basename(t);
      if (n === "move" && s !== a && s.toLowerCase() === a.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && Xu(e, t))
    throw new Error(Ha(e, t, n));
  return { srcStat: i, destStat: o };
}
function Eg(e, t, n, r, i) {
  const o = ot.resolve(ot.dirname(e)), s = ot.resolve(ot.dirname(n));
  if (s === o || s === ot.parse(s).root) return i();
  Ci.stat(s, { bigint: !0 }, (a, c) => a ? a.code === "ENOENT" ? i() : i(a) : Go(t, c) ? i(new Error(Ha(e, n, r))) : Eg(e, t, s, r, i));
}
function _g(e, t, n, r) {
  const i = ot.resolve(ot.dirname(e)), o = ot.resolve(ot.dirname(n));
  if (o === i || o === ot.parse(o).root) return;
  let s;
  try {
    s = Ci.statSync(o, { bigint: !0 });
  } catch (a) {
    if (a.code === "ENOENT") return;
    throw a;
  }
  if (Go(t, s))
    throw new Error(Ha(e, n, r));
  return _g(e, t, o, r);
}
function Go(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function Xu(e, t) {
  const n = ot.resolve(e).split(ot.sep).filter((i) => i), r = ot.resolve(t).split(ot.sep).filter((i) => i);
  return n.reduce((i, o, s) => i && r[s] === o, !0);
}
function Ha(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var ji = {
  checkPaths: FI,
  checkPathsSync: LI,
  checkParentPaths: Eg,
  checkParentPathsSync: _g,
  isSrcSubdir: Xu,
  areIdentical: Go
};
const Mt = Dt, bo = D, xI = $n.mkdirs, kI = Yr.pathExists, UI = wg.utimesMillis, Ao = ji;
function jI(e, t, n, r) {
  typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r = r || function() {
  }, n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), Ao.checkPaths(e, t, "copy", n, (i, o) => {
    if (i) return r(i);
    const { srcStat: s, destStat: a } = o;
    Ao.checkParentPaths(e, s, t, "copy", (c) => c ? r(c) : n.filter ? $g(th, a, e, t, n, r) : th(a, e, t, n, r));
  });
}
function th(e, t, n, r, i) {
  const o = bo.dirname(n);
  kI(o, (s, a) => {
    if (s) return i(s);
    if (a) return sa(e, t, n, r, i);
    xI(o, (c) => c ? i(c) : sa(e, t, n, r, i));
  });
}
function $g(e, t, n, r, i, o) {
  Promise.resolve(i.filter(n, r)).then((s) => s ? e(t, n, r, i, o) : o(), (s) => o(s));
}
function MI(e, t, n, r, i) {
  return r.filter ? $g(sa, e, t, n, r, i) : sa(e, t, n, r, i);
}
function sa(e, t, n, r, i) {
  (r.dereference ? Mt.stat : Mt.lstat)(t, (s, a) => s ? i(s) : a.isDirectory() ? WI(a, e, t, n, r, i) : a.isFile() || a.isCharacterDevice() || a.isBlockDevice() ? BI(a, e, t, n, r, i) : a.isSymbolicLink() ? YI(e, t, n, r, i) : a.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : a.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function BI(e, t, n, r, i, o) {
  return t ? HI(e, n, r, i, o) : Sg(e, n, r, i, o);
}
function HI(e, t, n, r, i) {
  if (r.overwrite)
    Mt.unlink(n, (o) => o ? i(o) : Sg(e, t, n, r, i));
  else return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i();
}
function Sg(e, t, n, r, i) {
  Mt.copyFile(t, n, (o) => o ? i(o) : r.preserveTimestamps ? qI(e.mode, t, n, i) : qa(n, e.mode, i));
}
function qI(e, t, n, r) {
  return zI(e) ? VI(n, e, (i) => i ? r(i) : nh(e, t, n, r)) : nh(e, t, n, r);
}
function zI(e) {
  return (e & 128) === 0;
}
function VI(e, t, n) {
  return qa(e, t | 128, n);
}
function nh(e, t, n, r) {
  GI(t, n, (i) => i ? r(i) : qa(n, e, r));
}
function qa(e, t, n) {
  return Mt.chmod(e, t, n);
}
function GI(e, t, n) {
  Mt.stat(e, (r, i) => r ? n(r) : UI(t, i.atime, i.mtime, n));
}
function WI(e, t, n, r, i, o) {
  return t ? bg(n, r, i, o) : KI(e.mode, n, r, i, o);
}
function KI(e, t, n, r, i) {
  Mt.mkdir(n, (o) => {
    if (o) return i(o);
    bg(t, n, r, (s) => s ? i(s) : qa(n, e, i));
  });
}
function bg(e, t, n, r) {
  Mt.readdir(e, (i, o) => i ? r(i) : Ag(o, e, t, n, r));
}
function Ag(e, t, n, r, i) {
  const o = e.pop();
  return o ? JI(e, o, t, n, r, i) : i();
}
function JI(e, t, n, r, i, o) {
  const s = bo.join(n, t), a = bo.join(r, t);
  Ao.checkPaths(s, a, "copy", i, (c, u) => {
    if (c) return o(c);
    const { destStat: l } = u;
    MI(l, s, a, i, (f) => f ? o(f) : Ag(e, n, r, i, o));
  });
}
function YI(e, t, n, r, i) {
  Mt.readlink(t, (o, s) => {
    if (o) return i(o);
    if (r.dereference && (s = bo.resolve(process.cwd(), s)), e)
      Mt.readlink(n, (a, c) => a ? a.code === "EINVAL" || a.code === "UNKNOWN" ? Mt.symlink(s, n, i) : i(a) : (r.dereference && (c = bo.resolve(process.cwd(), c)), Ao.isSrcSubdir(s, c) ? i(new Error(`Cannot copy '${s}' to a subdirectory of itself, '${c}'.`)) : e.isDirectory() && Ao.isSrcSubdir(c, s) ? i(new Error(`Cannot overwrite '${c}' with '${s}'.`)) : XI(s, n, i)));
    else
      return Mt.symlink(s, n, i);
  });
}
function XI(e, t, n) {
  Mt.unlink(t, (r) => r ? n(r) : Mt.symlink(e, t, n));
}
var ZI = jI;
const wt = Dt, To = D, QI = $n.mkdirsSync, eP = wg.utimesMillisSync, Co = ji;
function tP(e, t, n) {
  typeof n == "function" && (n = { filter: n }), n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: r, destStat: i } = Co.checkPathsSync(e, t, "copy", n);
  return Co.checkParentPathsSync(e, r, t, "copy"), nP(i, e, t, n);
}
function nP(e, t, n, r) {
  if (r.filter && !r.filter(t, n)) return;
  const i = To.dirname(n);
  return wt.existsSync(i) || QI(i), Tg(e, t, n, r);
}
function rP(e, t, n, r) {
  if (!(r.filter && !r.filter(t, n)))
    return Tg(e, t, n, r);
}
function Tg(e, t, n, r) {
  const o = (r.dereference ? wt.statSync : wt.lstatSync)(t);
  if (o.isDirectory()) return uP(o, e, t, n, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return iP(o, e, t, n, r);
  if (o.isSymbolicLink()) return hP(e, t, n, r);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function iP(e, t, n, r, i) {
  return t ? oP(e, n, r, i) : Cg(e, n, r, i);
}
function oP(e, t, n, r) {
  if (r.overwrite)
    return wt.unlinkSync(n), Cg(e, t, n, r);
  if (r.errorOnExist)
    throw new Error(`'${n}' already exists`);
}
function Cg(e, t, n, r) {
  return wt.copyFileSync(t, n), r.preserveTimestamps && sP(e.mode, t, n), Zu(n, e.mode);
}
function sP(e, t, n) {
  return aP(e) && cP(n, e), lP(t, n);
}
function aP(e) {
  return (e & 128) === 0;
}
function cP(e, t) {
  return Zu(e, t | 128);
}
function Zu(e, t) {
  return wt.chmodSync(e, t);
}
function lP(e, t) {
  const n = wt.statSync(e);
  return eP(t, n.atime, n.mtime);
}
function uP(e, t, n, r, i) {
  return t ? Ng(n, r, i) : fP(e.mode, n, r, i);
}
function fP(e, t, n, r) {
  return wt.mkdirSync(n), Ng(t, n, r), Zu(n, e);
}
function Ng(e, t, n) {
  wt.readdirSync(e).forEach((r) => dP(r, e, t, n));
}
function dP(e, t, n, r) {
  const i = To.join(t, e), o = To.join(n, e), { destStat: s } = Co.checkPathsSync(i, o, "copy", r);
  return rP(s, i, o, r);
}
function hP(e, t, n, r) {
  let i = wt.readlinkSync(t);
  if (r.dereference && (i = To.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = wt.readlinkSync(n);
    } catch (s) {
      if (s.code === "EINVAL" || s.code === "UNKNOWN") return wt.symlinkSync(i, n);
      throw s;
    }
    if (r.dereference && (o = To.resolve(process.cwd(), o)), Co.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (wt.statSync(n).isDirectory() && Co.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return pP(i, n);
  } else
    return wt.symlinkSync(i, n);
}
function pP(e, t) {
  return wt.unlinkSync(t), wt.symlinkSync(e, t);
}
var mP = tP;
const gP = Rt.fromCallback;
var Qu = {
  copy: gP(ZI),
  copySync: mP
};
const rh = Dt, Ig = D, Oe = Op, No = process.platform === "win32";
function Pg(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((n) => {
    e[n] = e[n] || rh[n], n = n + "Sync", e[n] = e[n] || rh[n];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function ef(e, t, n) {
  let r = 0;
  typeof t == "function" && (n = t, t = {}), Oe(e, "rimraf: missing path"), Oe.strictEqual(typeof e, "string", "rimraf: path should be a string"), Oe.strictEqual(typeof n, "function", "rimraf: callback function required"), Oe(t, "rimraf: invalid options argument provided"), Oe.strictEqual(typeof t, "object", "rimraf: options should be object"), Pg(t), ih(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && r < t.maxBusyTries) {
        r++;
        const s = r * 100;
        return setTimeout(() => ih(e, t, i), s);
      }
      o.code === "ENOENT" && (o = null);
    }
    n(o);
  });
}
function ih(e, t, n) {
  Oe(e), Oe(t), Oe(typeof n == "function"), t.lstat(e, (r, i) => {
    if (r && r.code === "ENOENT")
      return n(null);
    if (r && r.code === "EPERM" && No)
      return oh(e, t, r, n);
    if (i && i.isDirectory())
      return Ks(e, t, r, n);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return n(null);
        if (o.code === "EPERM")
          return No ? oh(e, t, o, n) : Ks(e, t, o, n);
        if (o.code === "EISDIR")
          return Ks(e, t, o, n);
      }
      return n(o);
    });
  });
}
function oh(e, t, n, r) {
  Oe(e), Oe(t), Oe(typeof r == "function"), t.chmod(e, 438, (i) => {
    i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (o, s) => {
      o ? r(o.code === "ENOENT" ? null : n) : s.isDirectory() ? Ks(e, t, n, r) : t.unlink(e, r);
    });
  });
}
function sh(e, t, n) {
  let r;
  Oe(e), Oe(t);
  try {
    t.chmodSync(e, 438);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw n;
  }
  try {
    r = t.statSync(e);
  } catch (i) {
    if (i.code === "ENOENT")
      return;
    throw n;
  }
  r.isDirectory() ? Js(e, t, n) : t.unlinkSync(e);
}
function Ks(e, t, n, r) {
  Oe(e), Oe(t), Oe(typeof r == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? yP(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
  });
}
function yP(e, t, n) {
  Oe(e), Oe(t), Oe(typeof n == "function"), t.readdir(e, (r, i) => {
    if (r) return n(r);
    let o = i.length, s;
    if (o === 0) return t.rmdir(e, n);
    i.forEach((a) => {
      ef(Ig.join(e, a), t, (c) => {
        if (!s) {
          if (c) return n(s = c);
          --o === 0 && t.rmdir(e, n);
        }
      });
    });
  });
}
function Og(e, t) {
  let n;
  t = t || {}, Pg(t), Oe(e, "rimraf: missing path"), Oe.strictEqual(typeof e, "string", "rimraf: path should be a string"), Oe(t, "rimraf: missing options"), Oe.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    n = t.lstatSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    r.code === "EPERM" && No && sh(e, t, r);
  }
  try {
    n && n.isDirectory() ? Js(e, t, null) : t.unlinkSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    if (r.code === "EPERM")
      return No ? sh(e, t, r) : Js(e, t, r);
    if (r.code !== "EISDIR")
      throw r;
    Js(e, t, r);
  }
}
function Js(e, t, n) {
  Oe(e), Oe(t);
  try {
    t.rmdirSync(e);
  } catch (r) {
    if (r.code === "ENOTDIR")
      throw n;
    if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM")
      vP(e, t);
    else if (r.code !== "ENOENT")
      throw r;
  }
}
function vP(e, t) {
  if (Oe(e), Oe(t), t.readdirSync(e).forEach((n) => Og(Ig.join(e, n), t)), No) {
    const n = Date.now();
    do
      try {
        return t.rmdirSync(e, t);
      } catch {
      }
    while (Date.now() - n < 500);
  } else
    return t.rmdirSync(e, t);
}
var wP = ef;
ef.sync = Og;
const aa = Dt, EP = Rt.fromCallback, Rg = wP;
function _P(e, t) {
  if (aa.rm) return aa.rm(e, { recursive: !0, force: !0 }, t);
  Rg(e, t);
}
function $P(e) {
  if (aa.rmSync) return aa.rmSync(e, { recursive: !0, force: !0 });
  Rg.sync(e);
}
var za = {
  remove: EP(_P),
  removeSync: $P
};
const SP = Rt.fromPromise, Dg = Jr, Fg = D, Lg = $n, xg = za, ah = SP(async function(t) {
  let n;
  try {
    n = await Dg.readdir(t);
  } catch {
    return Lg.mkdirs(t);
  }
  return Promise.all(n.map((r) => xg.remove(Fg.join(t, r))));
});
function ch(e) {
  let t;
  try {
    t = Dg.readdirSync(e);
  } catch {
    return Lg.mkdirsSync(e);
  }
  t.forEach((n) => {
    n = Fg.join(e, n), xg.removeSync(n);
  });
}
var bP = {
  emptyDirSync: ch,
  emptydirSync: ch,
  emptyDir: ah,
  emptydir: ah
};
const AP = Rt.fromCallback, kg = D, ir = Dt, Ug = $n;
function TP(e, t) {
  function n() {
    ir.writeFile(e, "", (r) => {
      if (r) return t(r);
      t();
    });
  }
  ir.stat(e, (r, i) => {
    if (!r && i.isFile()) return t();
    const o = kg.dirname(e);
    ir.stat(o, (s, a) => {
      if (s)
        return s.code === "ENOENT" ? Ug.mkdirs(o, (c) => {
          if (c) return t(c);
          n();
        }) : t(s);
      a.isDirectory() ? n() : ir.readdir(o, (c) => {
        if (c) return t(c);
      });
    });
  });
}
function CP(e) {
  let t;
  try {
    t = ir.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const n = kg.dirname(e);
  try {
    ir.statSync(n).isDirectory() || ir.readdirSync(n);
  } catch (r) {
    if (r && r.code === "ENOENT") Ug.mkdirsSync(n);
    else throw r;
  }
  ir.writeFileSync(e, "");
}
var NP = {
  createFile: AP(TP),
  createFileSync: CP
};
const IP = Rt.fromCallback, jg = D, er = Dt, Mg = $n, PP = Yr.pathExists, { areIdentical: Bg } = ji;
function OP(e, t, n) {
  function r(i, o) {
    er.link(i, o, (s) => {
      if (s) return n(s);
      n(null);
    });
  }
  er.lstat(t, (i, o) => {
    er.lstat(e, (s, a) => {
      if (s)
        return s.message = s.message.replace("lstat", "ensureLink"), n(s);
      if (o && Bg(a, o)) return n(null);
      const c = jg.dirname(t);
      PP(c, (u, l) => {
        if (u) return n(u);
        if (l) return r(e, t);
        Mg.mkdirs(c, (f) => {
          if (f) return n(f);
          r(e, t);
        });
      });
    });
  });
}
function RP(e, t) {
  let n;
  try {
    n = er.lstatSync(t);
  } catch {
  }
  try {
    const o = er.lstatSync(e);
    if (n && Bg(o, n)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const r = jg.dirname(t);
  return er.existsSync(r) || Mg.mkdirsSync(r), er.linkSync(e, t);
}
var DP = {
  createLink: IP(OP),
  createLinkSync: RP
};
const or = D, yo = Dt, FP = Yr.pathExists;
function LP(e, t, n) {
  if (or.isAbsolute(e))
    return yo.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), n(r)) : n(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = or.dirname(t), i = or.join(r, e);
    return FP(i, (o, s) => o ? n(o) : s ? n(null, {
      toCwd: i,
      toDst: e
    }) : yo.lstat(e, (a) => a ? (a.message = a.message.replace("lstat", "ensureSymlink"), n(a)) : n(null, {
      toCwd: e,
      toDst: or.relative(r, e)
    })));
  }
}
function xP(e, t) {
  let n;
  if (or.isAbsolute(e)) {
    if (n = yo.existsSync(e), !n) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const r = or.dirname(t), i = or.join(r, e);
    if (n = yo.existsSync(i), n)
      return {
        toCwd: i,
        toDst: e
      };
    if (n = yo.existsSync(e), !n) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: or.relative(r, e)
    };
  }
}
var kP = {
  symlinkPaths: LP,
  symlinkPathsSync: xP
};
const Hg = Dt;
function UP(e, t, n) {
  if (n = typeof t == "function" ? t : n, t = typeof t == "function" ? !1 : t, t) return n(null, t);
  Hg.lstat(e, (r, i) => {
    if (r) return n(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", n(null, t);
  });
}
function jP(e, t) {
  let n;
  if (t) return t;
  try {
    n = Hg.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var MP = {
  symlinkType: UP,
  symlinkTypeSync: jP
};
const BP = Rt.fromCallback, qg = D, an = Jr, zg = $n, HP = zg.mkdirs, qP = zg.mkdirsSync, Vg = kP, zP = Vg.symlinkPaths, VP = Vg.symlinkPathsSync, Gg = MP, GP = Gg.symlinkType, WP = Gg.symlinkTypeSync, KP = Yr.pathExists, { areIdentical: Wg } = ji;
function JP(e, t, n, r) {
  r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, an.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      an.stat(e),
      an.stat(t)
    ]).then(([s, a]) => {
      if (Wg(s, a)) return r(null);
      lh(e, t, n, r);
    }) : lh(e, t, n, r);
  });
}
function lh(e, t, n, r) {
  zP(e, t, (i, o) => {
    if (i) return r(i);
    e = o.toDst, GP(o.toCwd, n, (s, a) => {
      if (s) return r(s);
      const c = qg.dirname(t);
      KP(c, (u, l) => {
        if (u) return r(u);
        if (l) return an.symlink(e, t, a, r);
        HP(c, (f) => {
          if (f) return r(f);
          an.symlink(e, t, a, r);
        });
      });
    });
  });
}
function YP(e, t, n) {
  let r;
  try {
    r = an.lstatSync(t);
  } catch {
  }
  if (r && r.isSymbolicLink()) {
    const a = an.statSync(e), c = an.statSync(t);
    if (Wg(a, c)) return;
  }
  const i = VP(e, t);
  e = i.toDst, n = WP(i.toCwd, n);
  const o = qg.dirname(t);
  return an.existsSync(o) || qP(o), an.symlinkSync(e, t, n);
}
var XP = {
  createSymlink: BP(JP),
  createSymlinkSync: YP
};
const { createFile: uh, createFileSync: fh } = NP, { createLink: dh, createLinkSync: hh } = DP, { createSymlink: ph, createSymlinkSync: mh } = XP;
var ZP = {
  // file
  createFile: uh,
  createFileSync: fh,
  ensureFile: uh,
  ensureFileSync: fh,
  // link
  createLink: dh,
  createLinkSync: hh,
  ensureLink: dh,
  ensureLinkSync: hh,
  // symlink
  createSymlink: ph,
  createSymlinkSync: mh,
  ensureSymlink: ph,
  ensureSymlinkSync: mh
};
function QP(e, { EOL: t = `
`, finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
  const o = n ? t : "", s = JSON.stringify(e, r, i);
  if (s === void 0)
    throw new TypeError(`Converting ${typeof e} value to JSON is not supported`);
  return s.replace(/\n/g, t) + o;
}
function eO(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var tf = { stringify: QP, stripBom: eO };
let Ni;
try {
  Ni = Dt;
} catch {
  Ni = L;
}
const Va = Rt, { stringify: Kg, stripBom: Jg } = tf;
async function tO(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || Ni, r = "throws" in t ? t.throws : !0;
  let i = await Va.fromCallback(n.readFile)(e, t);
  i = Jg(i);
  let o;
  try {
    o = JSON.parse(i, t ? t.reviver : null);
  } catch (s) {
    if (r)
      throw s.message = `${e}: ${s.message}`, s;
    return null;
  }
  return o;
}
const nO = Va.fromPromise(tO);
function rO(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || Ni, r = "throws" in t ? t.throws : !0;
  try {
    let i = n.readFileSync(e, t);
    return i = Jg(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (r)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function iO(e, t, n = {}) {
  const r = n.fs || Ni, i = Kg(t, n);
  await Va.fromCallback(r.writeFile)(e, i, n);
}
const oO = Va.fromPromise(iO);
function sO(e, t, n = {}) {
  const r = n.fs || Ni, i = Kg(t, n);
  return r.writeFileSync(e, i, n);
}
var aO = {
  readFile: nO,
  readFileSync: rO,
  writeFile: oO,
  writeFileSync: sO
};
const Is = aO;
var cO = {
  // jsonfile exports
  readJson: Is.readFile,
  readJsonSync: Is.readFileSync,
  writeJson: Is.writeFile,
  writeJsonSync: Is.writeFileSync
};
const lO = Rt.fromCallback, vo = Dt, Yg = D, Xg = $n, uO = Yr.pathExists;
function fO(e, t, n, r) {
  typeof n == "function" && (r = n, n = "utf8");
  const i = Yg.dirname(e);
  uO(i, (o, s) => {
    if (o) return r(o);
    if (s) return vo.writeFile(e, t, n, r);
    Xg.mkdirs(i, (a) => {
      if (a) return r(a);
      vo.writeFile(e, t, n, r);
    });
  });
}
function dO(e, ...t) {
  const n = Yg.dirname(e);
  if (vo.existsSync(n))
    return vo.writeFileSync(e, ...t);
  Xg.mkdirsSync(n), vo.writeFileSync(e, ...t);
}
var nf = {
  outputFile: lO(fO),
  outputFileSync: dO
};
const { stringify: hO } = tf, { outputFile: pO } = nf;
async function mO(e, t, n = {}) {
  const r = hO(t, n);
  await pO(e, r, n);
}
var gO = mO;
const { stringify: yO } = tf, { outputFileSync: vO } = nf;
function wO(e, t, n) {
  const r = yO(t, n);
  vO(e, r, n);
}
var EO = wO;
const _O = Rt.fromPromise, Pt = cO;
Pt.outputJson = _O(gO);
Pt.outputJsonSync = EO;
Pt.outputJSON = Pt.outputJson;
Pt.outputJSONSync = Pt.outputJsonSync;
Pt.writeJSON = Pt.writeJson;
Pt.writeJSONSync = Pt.writeJsonSync;
Pt.readJSON = Pt.readJson;
Pt.readJSONSync = Pt.readJsonSync;
var $O = Pt;
const SO = Dt, El = D, bO = Qu.copy, Zg = za.remove, AO = $n.mkdirp, TO = Yr.pathExists, gh = ji;
function CO(e, t, n, r) {
  typeof n == "function" && (r = n, n = {}), n = n || {};
  const i = n.overwrite || n.clobber || !1;
  gh.checkPaths(e, t, "move", n, (o, s) => {
    if (o) return r(o);
    const { srcStat: a, isChangingCase: c = !1 } = s;
    gh.checkParentPaths(e, a, t, "move", (u) => {
      if (u) return r(u);
      if (NO(t)) return yh(e, t, i, c, r);
      AO(El.dirname(t), (l) => l ? r(l) : yh(e, t, i, c, r));
    });
  });
}
function NO(e) {
  const t = El.dirname(e);
  return El.parse(t).root === t;
}
function yh(e, t, n, r, i) {
  if (r) return Lc(e, t, n, i);
  if (n)
    return Zg(t, (o) => o ? i(o) : Lc(e, t, n, i));
  TO(t, (o, s) => o ? i(o) : s ? i(new Error("dest already exists.")) : Lc(e, t, n, i));
}
function Lc(e, t, n, r) {
  SO.rename(e, t, (i) => i ? i.code !== "EXDEV" ? r(i) : IO(e, t, n, r) : r());
}
function IO(e, t, n, r) {
  bO(e, t, {
    overwrite: n,
    errorOnExist: !0
  }, (o) => o ? r(o) : Zg(e, r));
}
var PO = CO;
const Qg = Dt, _l = D, OO = Qu.copySync, ey = za.removeSync, RO = $n.mkdirpSync, vh = ji;
function DO(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = vh.checkPathsSync(e, t, "move", n);
  return vh.checkParentPathsSync(e, i, t, "move"), FO(t) || RO(_l.dirname(t)), LO(e, t, r, o);
}
function FO(e) {
  const t = _l.dirname(e);
  return _l.parse(t).root === t;
}
function LO(e, t, n, r) {
  if (r) return xc(e, t, n);
  if (n)
    return ey(t), xc(e, t, n);
  if (Qg.existsSync(t)) throw new Error("dest already exists.");
  return xc(e, t, n);
}
function xc(e, t, n) {
  try {
    Qg.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return xO(e, t, n);
  }
}
function xO(e, t, n) {
  return OO(e, t, {
    overwrite: n,
    errorOnExist: !0
  }), ey(e);
}
var kO = DO;
const UO = Rt.fromCallback;
var jO = {
  move: UO(PO),
  moveSync: kO
}, pr = {
  // Export promiseified graceful-fs:
  ...Jr,
  // Export extra methods:
  ...Qu,
  ...bP,
  ...ZP,
  ...$O,
  ...$n,
  ...jO,
  ...nf,
  ...Yr,
  ...za
}, Xr = {}, cr = {}, et = {}, lr = {};
Object.defineProperty(lr, "__esModule", { value: !0 });
lr.CancellationError = lr.CancellationToken = void 0;
const MO = Rp;
class BO extends MO.EventEmitter {
  get cancelled() {
    return this._cancelled || this._parent != null && this._parent.cancelled;
  }
  set parent(t) {
    this.removeParentCancelHandler(), this._parent = t, this.parentCancelHandler = () => this.cancel(), this._parent.onCancel(this.parentCancelHandler);
  }
  // babel cannot compile ... correctly for super calls
  constructor(t) {
    super(), this.parentCancelHandler = null, this._parent = null, this._cancelled = !1, t != null && (this.parent = t);
  }
  cancel() {
    this._cancelled = !0, this.emit("cancel");
  }
  onCancel(t) {
    this.cancelled ? t() : this.once("cancel", t);
  }
  createPromise(t) {
    if (this.cancelled)
      return Promise.reject(new $l());
    const n = () => {
      if (r != null)
        try {
          this.removeListener("cancel", r), r = null;
        } catch {
        }
    };
    let r = null;
    return new Promise((i, o) => {
      let s = null;
      if (r = () => {
        try {
          s != null && (s(), s = null);
        } finally {
          o(new $l());
        }
      }, this.cancelled) {
        r();
        return;
      }
      this.onCancel(r), t(i, o, (a) => {
        s = a;
      });
    }).then((i) => (n(), i)).catch((i) => {
      throw n(), i;
    });
  }
  removeParentCancelHandler() {
    const t = this._parent;
    t != null && this.parentCancelHandler != null && (t.removeListener("cancel", this.parentCancelHandler), this.parentCancelHandler = null);
  }
  dispose() {
    try {
      this.removeParentCancelHandler();
    } finally {
      this.removeAllListeners(), this._parent = null;
    }
  }
}
lr.CancellationToken = BO;
class $l extends Error {
  constructor() {
    super("cancelled");
  }
}
lr.CancellationError = $l;
var Mi = {};
Object.defineProperty(Mi, "__esModule", { value: !0 });
Mi.newError = HO;
function HO(e, t) {
  const n = new Error(e);
  return n.code = t, n;
}
var It = {}, Sl = { exports: {} }, Ps = { exports: {} }, kc, wh;
function qO() {
  if (wh) return kc;
  wh = 1;
  var e = 1e3, t = e * 60, n = t * 60, r = n * 24, i = r * 7, o = r * 365.25;
  kc = function(l, f) {
    f = f || {};
    var h = typeof l;
    if (h === "string" && l.length > 0)
      return s(l);
    if (h === "number" && isFinite(l))
      return f.long ? c(l) : a(l);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" + JSON.stringify(l)
    );
  };
  function s(l) {
    if (l = String(l), !(l.length > 100)) {
      var f = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        l
      );
      if (f) {
        var h = parseFloat(f[1]), d = (f[2] || "ms").toLowerCase();
        switch (d) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return h * o;
          case "weeks":
          case "week":
          case "w":
            return h * i;
          case "days":
          case "day":
          case "d":
            return h * r;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return h * n;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return h * t;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return h * e;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return h;
          default:
            return;
        }
      }
    }
  }
  function a(l) {
    var f = Math.abs(l);
    return f >= r ? Math.round(l / r) + "d" : f >= n ? Math.round(l / n) + "h" : f >= t ? Math.round(l / t) + "m" : f >= e ? Math.round(l / e) + "s" : l + "ms";
  }
  function c(l) {
    var f = Math.abs(l);
    return f >= r ? u(l, f, r, "day") : f >= n ? u(l, f, n, "hour") : f >= t ? u(l, f, t, "minute") : f >= e ? u(l, f, e, "second") : l + " ms";
  }
  function u(l, f, h, d) {
    var m = f >= h * 1.5;
    return Math.round(l / h) + " " + d + (m ? "s" : "");
  }
  return kc;
}
var Uc, Eh;
function ty() {
  if (Eh) return Uc;
  Eh = 1;
  function e(t) {
    r.debug = r, r.default = r, r.coerce = u, r.disable = a, r.enable = o, r.enabled = c, r.humanize = qO(), r.destroy = l, Object.keys(t).forEach((f) => {
      r[f] = t[f];
    }), r.names = [], r.skips = [], r.formatters = {};
    function n(f) {
      let h = 0;
      for (let d = 0; d < f.length; d++)
        h = (h << 5) - h + f.charCodeAt(d), h |= 0;
      return r.colors[Math.abs(h) % r.colors.length];
    }
    r.selectColor = n;
    function r(f) {
      let h, d = null, m, p;
      function v(...y) {
        if (!v.enabled)
          return;
        const g = v, E = Number(/* @__PURE__ */ new Date()), S = E - (h || E);
        g.diff = S, g.prev = h, g.curr = E, h = E, y[0] = r.coerce(y[0]), typeof y[0] != "string" && y.unshift("%O");
        let C = 0;
        y[0] = y[0].replace(/%([a-zA-Z%])/g, (G, z) => {
          if (G === "%%")
            return "%";
          C++;
          const H = r.formatters[z];
          if (typeof H == "function") {
            const b = y[C];
            G = H.call(g, b), y.splice(C, 1), C--;
          }
          return G;
        }), r.formatArgs.call(g, y), (g.log || r.log).apply(g, y);
      }
      return v.namespace = f, v.useColors = r.useColors(), v.color = r.selectColor(f), v.extend = i, v.destroy = r.destroy, Object.defineProperty(v, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => d !== null ? d : (m !== r.namespaces && (m = r.namespaces, p = r.enabled(f)), p),
        set: (y) => {
          d = y;
        }
      }), typeof r.init == "function" && r.init(v), v;
    }
    function i(f, h) {
      const d = r(this.namespace + (typeof h > "u" ? ":" : h) + f);
      return d.log = this.log, d;
    }
    function o(f) {
      r.save(f), r.namespaces = f, r.names = [], r.skips = [];
      const h = (typeof f == "string" ? f : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
      for (const d of h)
        d[0] === "-" ? r.skips.push(d.slice(1)) : r.names.push(d);
    }
    function s(f, h) {
      let d = 0, m = 0, p = -1, v = 0;
      for (; d < f.length; )
        if (m < h.length && (h[m] === f[d] || h[m] === "*"))
          h[m] === "*" ? (p = m, v = d, m++) : (d++, m++);
        else if (p !== -1)
          m = p + 1, v++, d = v;
        else
          return !1;
      for (; m < h.length && h[m] === "*"; )
        m++;
      return m === h.length;
    }
    function a() {
      const f = [
        ...r.names,
        ...r.skips.map((h) => "-" + h)
      ].join(",");
      return r.enable(""), f;
    }
    function c(f) {
      for (const h of r.skips)
        if (s(f, h))
          return !1;
      for (const h of r.names)
        if (s(f, h))
          return !0;
      return !1;
    }
    function u(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    function l() {
      console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
    }
    return r.enable(r.load()), r;
  }
  return Uc = e, Uc;
}
var _h;
function zO() {
  return _h || (_h = 1, function(e, t) {
    t.formatArgs = r, t.save = i, t.load = o, t.useColors = n, t.storage = s(), t.destroy = /* @__PURE__ */ (() => {
      let c = !1;
      return () => {
        c || (c = !0, console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."));
      };
    })(), t.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function n() {
      if (typeof window < "u" && window.process && (window.process.type === "renderer" || window.process.__nwjs))
        return !0;
      if (typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/))
        return !1;
      let c;
      return typeof document < "u" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window < "u" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator < "u" && navigator.userAgent && (c = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(c[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator < "u" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function r(c) {
      if (c[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + c[0] + (this.useColors ? "%c " : " ") + "+" + e.exports.humanize(this.diff), !this.useColors)
        return;
      const u = "color: " + this.color;
      c.splice(1, 0, u, "color: inherit");
      let l = 0, f = 0;
      c[0].replace(/%[a-zA-Z%]/g, (h) => {
        h !== "%%" && (l++, h === "%c" && (f = l));
      }), c.splice(f, 0, u);
    }
    t.log = console.debug || console.log || (() => {
    });
    function i(c) {
      try {
        c ? t.storage.setItem("debug", c) : t.storage.removeItem("debug");
      } catch {
      }
    }
    function o() {
      let c;
      try {
        c = t.storage.getItem("debug") || t.storage.getItem("DEBUG");
      } catch {
      }
      return !c && typeof process < "u" && "env" in process && (c = process.env.DEBUG), c;
    }
    function s() {
      try {
        return localStorage;
      } catch {
      }
    }
    e.exports = ty()(t);
    const { formatters: a } = e.exports;
    a.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (u) {
        return "[UnexpectedJSONParseError]: " + u.message;
      }
    };
  }(Ps, Ps.exports)), Ps.exports;
}
var Os = { exports: {} }, jc, $h;
function VO() {
  return $h || ($h = 1, jc = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
    return r !== -1 && (i === -1 || r < i);
  }), jc;
}
var Mc, Sh;
function GO() {
  if (Sh) return Mc;
  Sh = 1;
  const e = va, t = Dp, n = VO(), { env: r } = process;
  let i;
  n("no-color") || n("no-colors") || n("color=false") || n("color=never") ? i = 0 : (n("color") || n("colors") || n("color=true") || n("color=always")) && (i = 1), "FORCE_COLOR" in r && (r.FORCE_COLOR === "true" ? i = 1 : r.FORCE_COLOR === "false" ? i = 0 : i = r.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(r.FORCE_COLOR, 10), 3));
  function o(c) {
    return c === 0 ? !1 : {
      level: c,
      hasBasic: !0,
      has256: c >= 2,
      has16m: c >= 3
    };
  }
  function s(c, u) {
    if (i === 0)
      return 0;
    if (n("color=16m") || n("color=full") || n("color=truecolor"))
      return 3;
    if (n("color=256"))
      return 2;
    if (c && !u && i === void 0)
      return 0;
    const l = i || 0;
    if (r.TERM === "dumb")
      return l;
    if (process.platform === "win32") {
      const f = e.release().split(".");
      return Number(f[0]) >= 10 && Number(f[2]) >= 10586 ? Number(f[2]) >= 14931 ? 3 : 2 : 1;
    }
    if ("CI" in r)
      return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((f) => f in r) || r.CI_NAME === "codeship" ? 1 : l;
    if ("TEAMCITY_VERSION" in r)
      return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(r.TEAMCITY_VERSION) ? 1 : 0;
    if (r.COLORTERM === "truecolor")
      return 3;
    if ("TERM_PROGRAM" in r) {
      const f = parseInt((r.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
      switch (r.TERM_PROGRAM) {
        case "iTerm.app":
          return f >= 3 ? 3 : 2;
        case "Apple_Terminal":
          return 2;
      }
    }
    return /-256(color)?$/i.test(r.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(r.TERM) || "COLORTERM" in r ? 1 : l;
  }
  function a(c) {
    const u = s(c, c && c.isTTY);
    return o(u);
  }
  return Mc = {
    supportsColor: a,
    stdout: o(s(!0, t.isatty(1))),
    stderr: o(s(!0, t.isatty(2)))
  }, Mc;
}
var bh;
function WO() {
  return bh || (bh = 1, function(e, t) {
    const n = Dp, r = xl;
    t.init = l, t.log = a, t.formatArgs = o, t.save = c, t.load = u, t.useColors = i, t.destroy = r.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = GO();
      h && (h.stderr || h).level >= 2 && (t.colors = [
        20,
        21,
        26,
        27,
        32,
        33,
        38,
        39,
        40,
        41,
        42,
        43,
        44,
        45,
        56,
        57,
        62,
        63,
        68,
        69,
        74,
        75,
        76,
        77,
        78,
        79,
        80,
        81,
        92,
        93,
        98,
        99,
        112,
        113,
        128,
        129,
        134,
        135,
        148,
        149,
        160,
        161,
        162,
        163,
        164,
        165,
        166,
        167,
        168,
        169,
        170,
        171,
        172,
        173,
        178,
        179,
        184,
        185,
        196,
        197,
        198,
        199,
        200,
        201,
        202,
        203,
        204,
        205,
        206,
        207,
        208,
        209,
        214,
        215,
        220,
        221
      ]);
    } catch {
    }
    t.inspectOpts = Object.keys(process.env).filter((h) => /^debug_/i.test(h)).reduce((h, d) => {
      const m = d.substring(6).toLowerCase().replace(/_([a-z])/g, (v, y) => y.toUpperCase());
      let p = process.env[d];
      return /^(yes|on|true|enabled)$/i.test(p) ? p = !0 : /^(no|off|false|disabled)$/i.test(p) ? p = !1 : p === "null" ? p = null : p = Number(p), h[m] = p, h;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function o(h) {
      const { namespace: d, useColors: m } = this;
      if (m) {
        const p = this.color, v = "\x1B[3" + (p < 8 ? p : "8;5;" + p), y = `  ${v};1m${d} \x1B[0m`;
        h[0] = y + h[0].split(`
`).join(`
` + y), h.push(v + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
      } else
        h[0] = s() + d + " " + h[0];
    }
    function s() {
      return t.inspectOpts.hideDate ? "" : (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function a(...h) {
      return process.stderr.write(r.formatWithOptions(t.inspectOpts, ...h) + `
`);
    }
    function c(h) {
      h ? process.env.DEBUG = h : delete process.env.DEBUG;
    }
    function u() {
      return process.env.DEBUG;
    }
    function l(h) {
      h.inspectOpts = {};
      const d = Object.keys(t.inspectOpts);
      for (let m = 0; m < d.length; m++)
        h.inspectOpts[d[m]] = t.inspectOpts[d[m]];
    }
    e.exports = ty()(t);
    const { formatters: f } = e.exports;
    f.o = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts).split(`
`).map((d) => d.trim()).join(" ");
    }, f.O = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts);
    };
  }(Os, Os.exports)), Os.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? Sl.exports = zO() : Sl.exports = WO();
var KO = Sl.exports, Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
Wo.ProgressCallbackTransform = void 0;
const JO = Mo;
class YO extends JO.Transform {
  constructor(t, n, r) {
    super(), this.total = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.total && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.total * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), r(null, t);
  }
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.total,
      delta: this.delta,
      transferred: this.total,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, t(null);
  }
}
Wo.ProgressCallbackTransform = YO;
Object.defineProperty(It, "__esModule", { value: !0 });
It.DigestTransform = It.HttpExecutor = It.HttpError = void 0;
It.createHttpError = Al;
It.parseJson = iR;
It.configureRequestOptionsFromUrl = ry;
It.configureRequestUrl = of;
It.safeGetHeader = bi;
It.configureRequestOptions = ca;
It.safeStringifyJson = la;
const XO = Oi, ZO = KO, QO = L, eR = Mo, bl = hr, tR = lr, Ah = Mi, nR = Wo, Ar = (0, ZO.default)("electron-builder");
function Al(e, t = null) {
  return new rf(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + la(e.headers), t);
}
const rR = /* @__PURE__ */ new Map([
  [429, "Too many requests"],
  [400, "Bad request"],
  [403, "Forbidden"],
  [404, "Not found"],
  [405, "Method not allowed"],
  [406, "Not acceptable"],
  [408, "Request timeout"],
  [413, "Request entity too large"],
  [500, "Internal server error"],
  [502, "Bad gateway"],
  [503, "Service unavailable"],
  [504, "Gateway timeout"],
  [505, "HTTP version not supported"]
]);
class rf extends Error {
  constructor(t, n = `HTTP error: ${rR.get(t) || t}`, r = null) {
    super(n), this.statusCode = t, this.description = r, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
It.HttpError = rf;
function iR(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class gi {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, n = new tR.CancellationToken(), r) {
    ca(t);
    const i = r == null ? void 0 : JSON.stringify(r), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      Ar(i);
      const { headers: s, ...a } = t;
      t = {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": o.length,
          ...s
        },
        ...a
      };
    }
    return this.doApiRequest(t, n, (s) => s.end(o));
  }
  doApiRequest(t, n, r, i = 0) {
    return Ar.enabled && Ar(`Request: ${la(t)}`), n.createPromise((o, s, a) => {
      const c = this.createRequest(t, (u) => {
        try {
          this.handleResponse(u, t, n, o, s, i, r);
        } catch (l) {
          s(l);
        }
      });
      this.addErrorAndTimeoutHandlers(c, s, t.timeout), this.addRedirectHandlers(c, t, s, i, (u) => {
        this.doApiRequest(u, n, r, i).then(o).catch(s);
      }), r(c, s), a(() => c.abort());
    });
  }
  // noinspection JSUnusedLocalSymbols
  // eslint-disable-next-line
  addRedirectHandlers(t, n, r, i, o) {
  }
  addErrorAndTimeoutHandlers(t, n, r = 60 * 1e3) {
    this.addTimeOutHandler(t, n, r), t.on("error", n), t.on("aborted", () => {
      n(new Error("Request has been aborted by the server"));
    });
  }
  handleResponse(t, n, r, i, o, s, a) {
    var c;
    if (Ar.enabled && Ar(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${la(n)}`), t.statusCode === 404) {
      o(Al(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const u = (c = t.statusCode) !== null && c !== void 0 ? c : 0, l = u >= 300 && u < 400, f = bi(t, "location");
    if (l && f != null) {
      if (s > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(gi.prepareRedirectUrlOptions(f, n), r, a, s).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", o), t.on("data", (d) => h += d), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const d = bi(t, "content-type"), m = d != null && (Array.isArray(d) ? d.find((p) => p.includes("json")) != null : d.includes("json"));
          o(Al(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

          Data:
          ${m ? JSON.stringify(JSON.parse(h)) : h}
          `));
        } else
          i(h.length === 0 ? null : h);
      } catch (d) {
        o(d);
      }
    });
  }
  async downloadToBuffer(t, n) {
    return await n.cancellationToken.createPromise((r, i, o) => {
      const s = [], a = {
        headers: n.headers || void 0,
        // because PrivateGitHubProvider requires HttpExecutor.prepareRedirectUrlOptions logic, so, we need to redirect manually
        redirect: "manual"
      };
      of(t, a), ca(a), this.doDownload(a, {
        destination: null,
        options: n,
        onCancel: o,
        callback: (c) => {
          c == null ? r(Buffer.concat(s)) : i(c);
        },
        responseHandler: (c, u) => {
          let l = 0;
          c.on("data", (f) => {
            if (l += f.length, l > 524288e3) {
              u(new Error("Maximum allowed size is 500 MB"));
              return;
            }
            s.push(f);
          }), c.on("end", () => {
            u(null);
          });
        }
      }, 0);
    });
  }
  doDownload(t, n, r) {
    const i = this.createRequest(t, (o) => {
      if (o.statusCode >= 400) {
        n.callback(new Error(`Cannot download "${t.protocol || "https:"}//${t.hostname}${t.path}", status ${o.statusCode}: ${o.statusMessage}`));
        return;
      }
      o.on("error", n.callback);
      const s = bi(o, "location");
      if (s != null) {
        r < this.maxRedirects ? this.doDownload(gi.prepareRedirectUrlOptions(s, t), n, r++) : n.callback(this.createMaxRedirectError());
        return;
      }
      n.responseHandler == null ? sR(n, o) : n.responseHandler(o, n.callback);
    });
    this.addErrorAndTimeoutHandlers(i, n.callback, t.timeout), this.addRedirectHandlers(i, t, n.callback, r, (o) => {
      this.doDownload(o, n, r++);
    }), i.end();
  }
  createMaxRedirectError() {
    return new Error(`Too many redirects (> ${this.maxRedirects})`);
  }
  addTimeOutHandler(t, n, r) {
    t.on("socket", (i) => {
      i.setTimeout(r, () => {
        t.abort(), n(new Error("Request timed out"));
      });
    });
  }
  static prepareRedirectUrlOptions(t, n) {
    const r = ry(t, { ...n }), i = r.headers;
    if (i != null && i.authorization) {
      const o = gi.reconstructOriginalUrl(n), s = ny(t, n);
      gi.isCrossOriginRedirect(o, s) && (Ar.enabled && Ar(`Given the cross-origin redirect (from ${o.host} to ${s.host}), the Authorization header will be stripped out.`), delete i.authorization);
    }
    return r;
  }
  static reconstructOriginalUrl(t) {
    const n = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const r = t.hostname, i = t.port ? `:${t.port}` : "", o = t.path || "/";
    return new bl.URL(`${n}//${r}${i}${o}`);
  }
  static isCrossOriginRedirect(t, n) {
    if (t.hostname.toLowerCase() !== n.hostname.toLowerCase())
      return !0;
    if (t.protocol === "http:" && // This can be replaced with `!originalUrl.port`, but for the sake of clarity.
    ["80", ""].includes(t.port) && n.protocol === "https:" && // This can be replaced with `!redirectUrl.port`, but for the sake of clarity.
    ["443", ""].includes(n.port))
      return !1;
    if (t.protocol !== n.protocol)
      return !0;
    const r = t.port, i = n.port;
    return r !== i;
  }
  static retryOnServerError(t, n = 3) {
    for (let r = 0; ; r++)
      try {
        return t();
      } catch (i) {
        if (r < n && (i instanceof rf && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
It.HttpExecutor = gi;
function ny(e, t) {
  try {
    return new bl.URL(e);
  } catch {
    const n = t.hostname, r = t.protocol || "https:", i = t.port ? `:${t.port}` : "", o = `${r}//${n}${i}`;
    return new bl.URL(e, o);
  }
}
function ry(e, t) {
  const n = ca(t), r = ny(e, t);
  return of(r, n), n;
}
function of(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class Tl extends eR.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, n = "sha512", r = "base64") {
    super(), this.expected = t, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, XO.createHash)(n);
  }
  // noinspection JSUnusedGlobalSymbols
  _transform(t, n, r) {
    this.digester.update(t), r(null, t);
  }
  // noinspection JSUnusedGlobalSymbols
  _flush(t) {
    if (this._actual = this.digester.digest(this.encoding), this.isValidateOnEnd)
      try {
        this.validate();
      } catch (n) {
        t(n);
        return;
      }
    t(null);
  }
  validate() {
    if (this._actual == null)
      throw (0, Ah.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, Ah.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
It.DigestTransform = Tl;
function oR(e, t, n) {
  return e != null && t != null && e !== t ? (n(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function bi(e, t) {
  const n = e.headers[t];
  return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
}
function sR(e, t) {
  if (!oR(bi(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const n = [];
  if (e.options.onProgress != null) {
    const s = bi(t, "content-length");
    s != null && n.push(new nR.ProgressCallbackTransform(parseInt(s, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const r = e.options.sha512;
  r != null ? n.push(new Tl(r, "sha512", r.length === 128 && !r.includes("+") && !r.includes("Z") && !r.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && n.push(new Tl(e.options.sha2, "sha256", "hex"));
  const i = (0, QO.createWriteStream)(e.destination);
  n.push(i);
  let o = t;
  for (const s of n)
    s.on("error", (a) => {
      i.close(), e.options.cancellationToken.cancelled || e.callback(a);
    }), o = o.pipe(s);
  i.on("finish", () => {
    i.close(e.callback);
  });
}
function ca(e, t, n) {
  n != null && (e.method = n), e.headers = { ...e.headers };
  const r = e.headers;
  return t != null && (r.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), r["User-Agent"] == null && (r["User-Agent"] = "electron-builder"), (n == null || n === "GET" || r["Cache-Control"] == null) && (r["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function la(e, t) {
  return JSON.stringify(e, (n, r) => n.endsWith("Authorization") || n.endsWith("authorization") || n.endsWith("Password") || n.endsWith("PASSWORD") || n.endsWith("Token") || n.includes("password") || n.includes("token") || t != null && t.has(n) ? "<stripped sensitive data>" : r, 2);
}
var Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
Ga.MemoLazy = void 0;
class aR {
  constructor(t, n) {
    this.selector = t, this.creator = n, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && iy(this.selected, t))
      return this._value;
    this.selected = t;
    const n = this.creator(t);
    return this.value = n, n;
  }
  set value(t) {
    this._value = t;
  }
}
Ga.MemoLazy = aR;
function iy(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((s) => iy(e[s], t[s]));
  }
  return e === t;
}
var Ko = {};
Object.defineProperty(Ko, "__esModule", { value: !0 });
Ko.githubUrl = cR;
Ko.githubTagPrefix = lR;
Ko.getS3LikeProviderBaseUrl = uR;
function cR(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function lR(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function uR(e) {
  const t = e.provider;
  if (t === "s3")
    return fR(e);
  if (t === "spaces")
    return dR(e);
  throw new Error(`Not supported provider: ${t}`);
}
function fR(e) {
  let t;
  if (e.accelerate == !0)
    t = `https://${e.bucket}.s3-accelerate.amazonaws.com`;
  else if (e.endpoint != null)
    t = `${e.endpoint}/${e.bucket}`;
  else if (e.bucket.includes(".")) {
    if (e.region == null)
      throw new Error(`Bucket name "${e.bucket}" includes a dot, but S3 region is missing`);
    e.region === "us-east-1" ? t = `https://s3.amazonaws.com/${e.bucket}` : t = `https://s3-${e.region}.amazonaws.com/${e.bucket}`;
  } else e.region === "cn-north-1" ? t = `https://${e.bucket}.s3.${e.region}.amazonaws.com.cn` : t = `https://${e.bucket}.s3.amazonaws.com`;
  return oy(t, e.path);
}
function oy(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function dR(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return oy(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var sf = {};
Object.defineProperty(sf, "__esModule", { value: !0 });
sf.retry = sy;
const hR = lr;
async function sy(e, t) {
  var n;
  const { retries: r, interval: i, backoff: o = 0, attempt: s = 0, shouldRetry: a, cancellationToken: c = new hR.CancellationToken() } = t;
  try {
    return await e();
  } catch (u) {
    if (await Promise.resolve((n = a == null ? void 0 : a(u)) !== null && n !== void 0 ? n : !0) && r > 0 && !c.cancelled)
      return await new Promise((l) => setTimeout(l, i + o * s)), await sy(e, { ...t, retries: r - 1, attempt: s + 1 });
    throw u;
  }
}
var af = {};
Object.defineProperty(af, "__esModule", { value: !0 });
af.parseDn = pR;
function pR(e) {
  let t = !1, n = null, r = "", i = 0;
  e = e.trim();
  const o = /* @__PURE__ */ new Map();
  for (let s = 0; s <= e.length; s++) {
    if (s === e.length) {
      n !== null && o.set(n, r);
      break;
    }
    const a = e[s];
    if (t) {
      if (a === '"') {
        t = !1;
        continue;
      }
    } else {
      if (a === '"') {
        t = !0;
        continue;
      }
      if (a === "\\") {
        s++;
        const c = parseInt(e.slice(s, s + 2), 16);
        Number.isNaN(c) ? r += e[s] : (s++, r += String.fromCharCode(c));
        continue;
      }
      if (n === null && a === "=") {
        n = r, r = "";
        continue;
      }
      if (a === "," || a === ";" || a === "+") {
        n !== null && o.set(n, r), n = null, r = "";
        continue;
      }
    }
    if (a === " " && !t) {
      if (r.length === 0)
        continue;
      if (s > i) {
        let c = s;
        for (; e[c] === " "; )
          c++;
        i = c;
      }
      if (i >= e.length || e[i] === "," || e[i] === ";" || n === null && e[i] === "=" || n !== null && e[i] === "+") {
        s = i - 1;
        continue;
      }
    }
    r += a;
  }
  return o;
}
var Ii = {};
Object.defineProperty(Ii, "__esModule", { value: !0 });
Ii.nil = Ii.UUID = void 0;
const ay = Oi, cy = Mi, mR = "options.name must be either a string or a Buffer", Th = (0, ay.randomBytes)(16);
Th[0] = Th[0] | 1;
const Ys = {}, _e = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  Ys[t] = e, _e[e] = t;
}
class Gr {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const n = Gr.check(t);
    if (!n)
      throw new Error("not a UUID");
    this.version = n.version, n.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, n) {
    return gR(t, "sha1", 80, n);
  }
  toString() {
    return this.ascii == null && (this.ascii = yR(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, n = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (Ys[t[14] + t[15]] & 240) >> 4,
        variant: Ch((Ys[t[19] + t[20]] & 224) >> 5),
        format: "ascii"
      } : !1;
    if (Buffer.isBuffer(t)) {
      if (t.length < n + 16)
        return !1;
      let r = 0;
      for (; r < 16 && t[n + r] === 0; r++)
        ;
      return r === 16 ? { version: void 0, variant: "nil", format: "binary" } : {
        version: (t[n + 6] & 240) >> 4,
        variant: Ch((t[n + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, cy.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const n = Buffer.allocUnsafe(16);
    let r = 0;
    for (let i = 0; i < 16; i++)
      n[i] = Ys[t[r++] + t[r++]], (i === 3 || i === 5 || i === 7 || i === 9) && (r += 1);
    return n;
  }
}
Ii.UUID = Gr;
Gr.OID = Gr.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Ch(e) {
  switch (e) {
    case 0:
    case 1:
    case 3:
      return "ncs";
    case 4:
    case 5:
      return "rfc4122";
    case 6:
      return "microsoft";
    default:
      return "future";
  }
}
var wo;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(wo || (wo = {}));
function gR(e, t, n, r, i = wo.ASCII) {
  const o = (0, ay.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, cy.newError)(mR, "ERR_INVALID_UUID_NAME");
  o.update(r), o.update(e);
  const a = o.digest();
  let c;
  switch (i) {
    case wo.BINARY:
      a[6] = a[6] & 15 | n, a[8] = a[8] & 63 | 128, c = a;
      break;
    case wo.OBJECT:
      a[6] = a[6] & 15 | n, a[8] = a[8] & 63 | 128, c = new Gr(a);
      break;
    default:
      c = _e[a[0]] + _e[a[1]] + _e[a[2]] + _e[a[3]] + "-" + _e[a[4]] + _e[a[5]] + "-" + _e[a[6] & 15 | n] + _e[a[7]] + "-" + _e[a[8] & 63 | 128] + _e[a[9]] + "-" + _e[a[10]] + _e[a[11]] + _e[a[12]] + _e[a[13]] + _e[a[14]] + _e[a[15]];
      break;
  }
  return c;
}
function yR(e) {
  return _e[e[0]] + _e[e[1]] + _e[e[2]] + _e[e[3]] + "-" + _e[e[4]] + _e[e[5]] + "-" + _e[e[6]] + _e[e[7]] + "-" + _e[e[8]] + _e[e[9]] + "-" + _e[e[10]] + _e[e[11]] + _e[e[12]] + _e[e[13]] + _e[e[14]] + _e[e[15]];
}
Ii.nil = new Gr("00000000-0000-0000-0000-000000000000");
var Jo = {}, ly = {};
(function(e) {
  (function(t) {
    t.parser = function(_, w) {
      return new r(_, w);
    }, t.SAXParser = r, t.SAXStream = f, t.createStream = u, t.MAX_BUFFER_LENGTH = 64 * 1024;
    var n = [
      "comment",
      "sgmlDecl",
      "textNode",
      "tagName",
      "doctype",
      "procInstName",
      "procInstBody",
      "entity",
      "attribName",
      "attribValue",
      "cdata",
      "script"
    ];
    t.EVENTS = [
      "text",
      "processinginstruction",
      "sgmldeclaration",
      "doctype",
      "comment",
      "opentagstart",
      "attribute",
      "opentag",
      "closetag",
      "opencdata",
      "cdata",
      "closecdata",
      "error",
      "end",
      "ready",
      "script",
      "opennamespace",
      "closenamespace"
    ];
    function r(_, w) {
      if (!(this instanceof r))
        return new r(_, w);
      var k = this;
      o(k), k.q = k.c = "", k.bufferCheckPosition = t.MAX_BUFFER_LENGTH, k.encoding = null, k.opt = w || {}, k.opt.lowercase = k.opt.lowercase || k.opt.lowercasetags, k.looseCase = k.opt.lowercase ? "toLowerCase" : "toUpperCase", k.opt.maxEntityCount = k.opt.maxEntityCount || 512, k.opt.maxEntityDepth = k.opt.maxEntityDepth || 4, k.entityCount = k.entityDepth = 0, k.tags = [], k.closed = k.closedRoot = k.sawRoot = !1, k.tag = k.error = null, k.strict = !!_, k.noscript = !!(_ || k.opt.noscript), k.state = b.BEGIN, k.strictEntities = k.opt.strictEntities, k.ENTITIES = k.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), k.attribList = [], k.opt.xmlns && (k.ns = Object.create(v)), k.opt.unquotedAttributeValues === void 0 && (k.opt.unquotedAttributeValues = !_), k.trackPosition = k.opt.position !== !1, k.trackPosition && (k.position = k.line = k.column = 0), V(k, "onready");
    }
    Object.create || (Object.create = function(_) {
      function w() {
      }
      w.prototype = _;
      var k = new w();
      return k;
    }), Object.keys || (Object.keys = function(_) {
      var w = [];
      for (var k in _) _.hasOwnProperty(k) && w.push(k);
      return w;
    });
    function i(_) {
      for (var w = Math.max(t.MAX_BUFFER_LENGTH, 10), k = 0, I = 0, ge = n.length; I < ge; I++) {
        var Ae = _[n[I]].length;
        if (Ae > w)
          switch (n[I]) {
            case "textNode":
              Y(_);
              break;
            case "cdata":
              q(_, "oncdata", _.cdata), _.cdata = "";
              break;
            case "script":
              q(_, "onscript", _.script), _.script = "";
              break;
            default:
              j(_, "Max buffer length exceeded: " + n[I]);
          }
        k = Math.max(k, Ae);
      }
      var Te = t.MAX_BUFFER_LENGTH - k;
      _.bufferCheckPosition = Te + _.position;
    }
    function o(_) {
      for (var w = 0, k = n.length; w < k; w++)
        _[n[w]] = "";
    }
    function s(_) {
      Y(_), _.cdata !== "" && (q(_, "oncdata", _.cdata), _.cdata = ""), _.script !== "" && (q(_, "onscript", _.script), _.script = "");
    }
    r.prototype = {
      end: function() {
        N(this);
      },
      write: De,
      resume: function() {
        return this.error = null, this;
      },
      close: function() {
        return this.write(null);
      },
      flush: function() {
        s(this);
      }
    };
    var a;
    try {
      a = require("stream").Stream;
    } catch {
      a = function() {
      };
    }
    a || (a = function() {
    });
    var c = t.EVENTS.filter(function(_) {
      return _ !== "error" && _ !== "end";
    });
    function u(_, w) {
      return new f(_, w);
    }
    function l(_, w) {
      if (_.length >= 2) {
        if (_[0] === 255 && _[1] === 254)
          return "utf-16le";
        if (_[0] === 254 && _[1] === 255)
          return "utf-16be";
      }
      return _.length >= 3 && _[0] === 239 && _[1] === 187 && _[2] === 191 ? "utf8" : _.length >= 4 ? _[0] === 60 && _[1] === 0 && _[2] === 63 && _[3] === 0 ? "utf-16le" : _[0] === 0 && _[1] === 60 && _[2] === 0 && _[3] === 63 ? "utf-16be" : "utf8" : w ? "utf8" : null;
    }
    function f(_, w) {
      if (!(this instanceof f))
        return new f(_, w);
      a.apply(this), this._parser = new r(_, w), this.writable = !0, this.readable = !0;
      var k = this;
      this._parser.onend = function() {
        k.emit("end");
      }, this._parser.onerror = function(I) {
        k.emit("error", I), k._parser.error = null;
      }, this._decoder = null, this._decoderBuffer = null, c.forEach(function(I) {
        Object.defineProperty(k, "on" + I, {
          get: function() {
            return k._parser["on" + I];
          },
          set: function(ge) {
            if (!ge)
              return k.removeAllListeners(I), k._parser["on" + I] = ge, ge;
            k.on(I, ge);
          },
          enumerable: !0,
          configurable: !1
        });
      });
    }
    f.prototype = Object.create(a.prototype, {
      constructor: {
        value: f
      }
    }), f.prototype._decodeBuffer = function(_, w) {
      if (this._decoderBuffer && (_ = Buffer.concat([this._decoderBuffer, _]), this._decoderBuffer = null), !this._decoder) {
        var k = l(_, w);
        if (!k)
          return this._decoderBuffer = _, "";
        this._parser.encoding = k, this._decoder = new TextDecoder(k);
      }
      return this._decoder.decode(_, { stream: !w });
    }, f.prototype.write = function(_) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(_))
        _ = this._decodeBuffer(_, !1);
      else if (this._decoderBuffer) {
        var w = this._decodeBuffer(Buffer.alloc(0), !0);
        w && (this._parser.write(w), this.emit("data", w));
      }
      return this._parser.write(_.toString()), this.emit("data", _), !0;
    }, f.prototype.end = function(_) {
      if (_ && _.length && this.write(_), this._decoderBuffer) {
        var w = this._decodeBuffer(Buffer.alloc(0), !0);
        w && (this._parser.write(w), this.emit("data", w));
      } else if (this._decoder) {
        var k = this._decoder.decode();
        k && (this._parser.write(k), this.emit("data", k));
      }
      return this._parser.end(), !0;
    }, f.prototype.on = function(_, w) {
      var k = this;
      return !k._parser["on" + _] && c.indexOf(_) !== -1 && (k._parser["on" + _] = function() {
        var I = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        I.splice(0, 0, _), k.emit.apply(k, I);
      }), a.prototype.on.call(k, _, w);
    };
    var h = "[CDATA[", d = "DOCTYPE", m = "http://www.w3.org/XML/1998/namespace", p = "http://www.w3.org/2000/xmlns/", v = { xml: m, xmlns: p }, y = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, g = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, E = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, S = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function C(_) {
      return _ === " " || _ === `
` || _ === "\r" || _ === "	";
    }
    function U(_) {
      return _ === '"' || _ === "'";
    }
    function G(_) {
      return _ === ">" || C(_);
    }
    function z(_, w) {
      return _.test(w);
    }
    function H(_, w) {
      return !z(_, w);
    }
    var b = 0;
    t.STATE = {
      BEGIN: b++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: b++,
      // leading whitespace
      TEXT: b++,
      // general stuff
      TEXT_ENTITY: b++,
      // &amp and such.
      OPEN_WAKA: b++,
      // <
      SGML_DECL: b++,
      // <!BLARG
      SGML_DECL_QUOTED: b++,
      // <!BLARG foo "bar
      DOCTYPE: b++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: b++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: b++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: b++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: b++,
      // <!-
      COMMENT: b++,
      // <!--
      COMMENT_ENDING: b++,
      // <!-- blah -
      COMMENT_ENDED: b++,
      // <!-- blah --
      CDATA: b++,
      // <![CDATA[ something
      CDATA_ENDING: b++,
      // ]
      CDATA_ENDING_2: b++,
      // ]]
      PROC_INST: b++,
      // <?hi
      PROC_INST_BODY: b++,
      // <?hi there
      PROC_INST_ENDING: b++,
      // <?hi "there" ?
      OPEN_TAG: b++,
      // <strong
      OPEN_TAG_SLASH: b++,
      // <strong /
      ATTRIB: b++,
      // <a
      ATTRIB_NAME: b++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: b++,
      // <a foo _
      ATTRIB_VALUE: b++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: b++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: b++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: b++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: b++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: b++,
      // <foo bar=&quot
      CLOSE_TAG: b++,
      // </a
      CLOSE_TAG_SAW_WHITE: b++,
      // </a   >
      SCRIPT: b++,
      // <script> ...
      SCRIPT_ENDING: b++
      // <script> ... <
    }, t.XML_ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'"
    }, t.ENTITIES = {
      amp: "&",
      gt: ">",
      lt: "<",
      quot: '"',
      apos: "'",
      AElig: 198,
      Aacute: 193,
      Acirc: 194,
      Agrave: 192,
      Aring: 197,
      Atilde: 195,
      Auml: 196,
      Ccedil: 199,
      ETH: 208,
      Eacute: 201,
      Ecirc: 202,
      Egrave: 200,
      Euml: 203,
      Iacute: 205,
      Icirc: 206,
      Igrave: 204,
      Iuml: 207,
      Ntilde: 209,
      Oacute: 211,
      Ocirc: 212,
      Ograve: 210,
      Oslash: 216,
      Otilde: 213,
      Ouml: 214,
      THORN: 222,
      Uacute: 218,
      Ucirc: 219,
      Ugrave: 217,
      Uuml: 220,
      Yacute: 221,
      aacute: 225,
      acirc: 226,
      aelig: 230,
      agrave: 224,
      aring: 229,
      atilde: 227,
      auml: 228,
      ccedil: 231,
      eacute: 233,
      ecirc: 234,
      egrave: 232,
      eth: 240,
      euml: 235,
      iacute: 237,
      icirc: 238,
      igrave: 236,
      iuml: 239,
      ntilde: 241,
      oacute: 243,
      ocirc: 244,
      ograve: 242,
      oslash: 248,
      otilde: 245,
      ouml: 246,
      szlig: 223,
      thorn: 254,
      uacute: 250,
      ucirc: 251,
      ugrave: 249,
      uuml: 252,
      yacute: 253,
      yuml: 255,
      copy: 169,
      reg: 174,
      nbsp: 160,
      iexcl: 161,
      cent: 162,
      pound: 163,
      curren: 164,
      yen: 165,
      brvbar: 166,
      sect: 167,
      uml: 168,
      ordf: 170,
      laquo: 171,
      not: 172,
      shy: 173,
      macr: 175,
      deg: 176,
      plusmn: 177,
      sup1: 185,
      sup2: 178,
      sup3: 179,
      acute: 180,
      micro: 181,
      para: 182,
      middot: 183,
      cedil: 184,
      ordm: 186,
      raquo: 187,
      frac14: 188,
      frac12: 189,
      frac34: 190,
      iquest: 191,
      times: 215,
      divide: 247,
      OElig: 338,
      oelig: 339,
      Scaron: 352,
      scaron: 353,
      Yuml: 376,
      fnof: 402,
      circ: 710,
      tilde: 732,
      Alpha: 913,
      Beta: 914,
      Gamma: 915,
      Delta: 916,
      Epsilon: 917,
      Zeta: 918,
      Eta: 919,
      Theta: 920,
      Iota: 921,
      Kappa: 922,
      Lambda: 923,
      Mu: 924,
      Nu: 925,
      Xi: 926,
      Omicron: 927,
      Pi: 928,
      Rho: 929,
      Sigma: 931,
      Tau: 932,
      Upsilon: 933,
      Phi: 934,
      Chi: 935,
      Psi: 936,
      Omega: 937,
      alpha: 945,
      beta: 946,
      gamma: 947,
      delta: 948,
      epsilon: 949,
      zeta: 950,
      eta: 951,
      theta: 952,
      iota: 953,
      kappa: 954,
      lambda: 955,
      mu: 956,
      nu: 957,
      xi: 958,
      omicron: 959,
      pi: 960,
      rho: 961,
      sigmaf: 962,
      sigma: 963,
      tau: 964,
      upsilon: 965,
      phi: 966,
      chi: 967,
      psi: 968,
      omega: 969,
      thetasym: 977,
      upsih: 978,
      piv: 982,
      ensp: 8194,
      emsp: 8195,
      thinsp: 8201,
      zwnj: 8204,
      zwj: 8205,
      lrm: 8206,
      rlm: 8207,
      ndash: 8211,
      mdash: 8212,
      lsquo: 8216,
      rsquo: 8217,
      sbquo: 8218,
      ldquo: 8220,
      rdquo: 8221,
      bdquo: 8222,
      dagger: 8224,
      Dagger: 8225,
      bull: 8226,
      hellip: 8230,
      permil: 8240,
      prime: 8242,
      Prime: 8243,
      lsaquo: 8249,
      rsaquo: 8250,
      oline: 8254,
      frasl: 8260,
      euro: 8364,
      image: 8465,
      weierp: 8472,
      real: 8476,
      trade: 8482,
      alefsym: 8501,
      larr: 8592,
      uarr: 8593,
      rarr: 8594,
      darr: 8595,
      harr: 8596,
      crarr: 8629,
      lArr: 8656,
      uArr: 8657,
      rArr: 8658,
      dArr: 8659,
      hArr: 8660,
      forall: 8704,
      part: 8706,
      exist: 8707,
      empty: 8709,
      nabla: 8711,
      isin: 8712,
      notin: 8713,
      ni: 8715,
      prod: 8719,
      sum: 8721,
      minus: 8722,
      lowast: 8727,
      radic: 8730,
      prop: 8733,
      infin: 8734,
      ang: 8736,
      and: 8743,
      or: 8744,
      cap: 8745,
      cup: 8746,
      int: 8747,
      there4: 8756,
      sim: 8764,
      cong: 8773,
      asymp: 8776,
      ne: 8800,
      equiv: 8801,
      le: 8804,
      ge: 8805,
      sub: 8834,
      sup: 8835,
      nsub: 8836,
      sube: 8838,
      supe: 8839,
      oplus: 8853,
      otimes: 8855,
      perp: 8869,
      sdot: 8901,
      lceil: 8968,
      rceil: 8969,
      lfloor: 8970,
      rfloor: 8971,
      lang: 9001,
      rang: 9002,
      loz: 9674,
      spades: 9824,
      clubs: 9827,
      hearts: 9829,
      diams: 9830
    }, Object.keys(t.ENTITIES).forEach(function(_) {
      var w = t.ENTITIES[_], k = typeof w == "number" ? String.fromCharCode(w) : w;
      t.ENTITIES[_] = k;
    });
    for (var B in t.STATE)
      t.STATE[t.STATE[B]] = B;
    b = t.STATE;
    function V(_, w, k) {
      _[w] && _[w](k);
    }
    function Z(_) {
      var w = _ && _.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
      return w ? w[2] : null;
    }
    function F(_) {
      return _ ? _.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
    }
    function x(_, w) {
      const k = F(_), I = F(w);
      return !k || !I ? !0 : I === "utf16" ? k === "utf16le" || k === "utf16be" : k === I;
    }
    function W(_, w) {
      if (!(!_.strict || !_.encoding || !w || w.name !== "xml")) {
        var k = Z(w.body);
        k && !x(_.encoding, k) && R(
          _,
          "XML declaration encoding " + k + " does not match detected stream encoding " + _.encoding.toUpperCase()
        );
      }
    }
    function q(_, w, k) {
      _.textNode && Y(_), V(_, w, k);
    }
    function Y(_) {
      _.textNode = J(_.opt, _.textNode), _.textNode && V(_, "ontext", _.textNode), _.textNode = "";
    }
    function J(_, w) {
      return _.trim && (w = w.trim()), _.normalize && (w = w.replace(/\s+/g, " ")), w;
    }
    function j(_, w) {
      return Y(_), _.trackPosition && (w += `
Line: ` + _.line + `
Column: ` + _.column + `
Char: ` + _.c), w = new Error(w), _.error = w, V(_, "onerror", w), _;
    }
    function N(_) {
      return _.sawRoot && !_.closedRoot && R(_, "Unclosed root tag"), _.state !== b.BEGIN && _.state !== b.BEGIN_WHITESPACE && _.state !== b.TEXT && j(_, "Unexpected end"), Y(_), _.c = "", _.closed = !0, V(_, "onend"), r.call(_, _.strict, _.opt), _;
    }
    function R(_, w) {
      if (typeof _ != "object" || !(_ instanceof r))
        throw new Error("bad call to strictFail");
      _.strict && j(_, w);
    }
    function O(_) {
      _.strict || (_.tagName = _.tagName[_.looseCase]());
      var w = _.tags[_.tags.length - 1] || _, k = _.tag = { name: _.tagName, attributes: {} };
      _.opt.xmlns && (k.ns = w.ns), _.attribList.length = 0, q(_, "onopentagstart", k);
    }
    function $(_, w) {
      var k = _.indexOf(":"), I = k < 0 ? ["", _] : _.split(":"), ge = I[0], Ae = I[1];
      return w && _ === "xmlns" && (ge = "xmlns", Ae = ""), { prefix: ge, local: Ae };
    }
    function T(_) {
      if (_.strict || (_.attribName = _.attribName[_.looseCase]()), _.attribList.indexOf(_.attribName) !== -1 || _.tag.attributes.hasOwnProperty(_.attribName)) {
        _.attribName = _.attribValue = "";
        return;
      }
      if (_.opt.xmlns) {
        var w = $(_.attribName, !0), k = w.prefix, I = w.local;
        if (k === "xmlns")
          if (I === "xml" && _.attribValue !== m)
            R(
              _,
              "xml: prefix must be bound to " + m + `
Actual: ` + _.attribValue
            );
          else if (I === "xmlns" && _.attribValue !== p)
            R(
              _,
              "xmlns: prefix must be bound to " + p + `
Actual: ` + _.attribValue
            );
          else {
            var ge = _.tag, Ae = _.tags[_.tags.length - 1] || _;
            ge.ns === Ae.ns && (ge.ns = Object.create(Ae.ns)), ge.ns[I] = _.attribValue;
          }
        _.attribList.push([_.attribName, _.attribValue]);
      } else
        _.tag.attributes[_.attribName] = _.attribValue, q(_, "onattribute", {
          name: _.attribName,
          value: _.attribValue
        });
      _.attribName = _.attribValue = "";
    }
    function M(_, w) {
      if (_.opt.xmlns) {
        var k = _.tag, I = $(_.tagName);
        k.prefix = I.prefix, k.local = I.local, k.uri = k.ns[I.prefix] || "", k.prefix && !k.uri && (R(
          _,
          "Unbound namespace prefix: " + JSON.stringify(_.tagName)
        ), k.uri = I.prefix);
        var ge = _.tags[_.tags.length - 1] || _;
        k.ns && ge.ns !== k.ns && Object.keys(k.ns).forEach(function(xt) {
          q(_, "onopennamespace", {
            prefix: xt,
            uri: k.ns[xt]
          });
        });
        for (var Ae = 0, Te = _.attribList.length; Ae < Te; Ae++) {
          var Ue = _.attribList[Ae], Ne = Ue[0], tt = Ue[1], Re = $(Ne, !0), nt = Re.prefix, pn = Re.local, Qt = nt === "" ? "" : k.ns[nt] || "", Lt = {
            name: Ne,
            value: tt,
            prefix: nt,
            local: pn,
            uri: Qt
          };
          nt && nt !== "xmlns" && !Qt && (R(
            _,
            "Unbound namespace prefix: " + JSON.stringify(nt)
          ), Lt.uri = nt), _.tag.attributes[Ne] = Lt, q(_, "onattribute", Lt);
        }
        _.attribList.length = 0;
      }
      _.tag.isSelfClosing = !!w, _.sawRoot = !0, _.tags.push(_.tag), q(_, "onopentag", _.tag), w || (!_.noscript && _.tagName.toLowerCase() === "script" ? _.state = b.SCRIPT : _.state = b.TEXT, _.tag = null, _.tagName = ""), _.attribName = _.attribValue = "", _.attribList.length = 0;
    }
    function ne(_) {
      if (!_.tagName) {
        R(_, "Weird empty close tag."), _.textNode += "</>", _.state = b.TEXT;
        return;
      }
      if (_.script) {
        if (_.tagName !== "script") {
          _.script += "</" + _.tagName + ">", _.tagName = "", _.state = b.SCRIPT;
          return;
        }
        q(_, "onscript", _.script), _.script = "";
      }
      var w = _.tags.length, k = _.tagName;
      _.strict || (k = k[_.looseCase]());
      for (var I = k; w--; ) {
        var ge = _.tags[w];
        if (ge.name !== I)
          R(_, "Unexpected close tag");
        else
          break;
      }
      if (w < 0) {
        R(_, "Unmatched closing tag: " + _.tagName), _.textNode += "</" + _.tagName + ">", _.state = b.TEXT;
        return;
      }
      _.tagName = k;
      for (var Ae = _.tags.length; Ae-- > w; ) {
        var Te = _.tag = _.tags.pop();
        _.tagName = _.tag.name, q(_, "onclosetag", _.tagName);
        var Ue = {};
        for (var Ne in Te.ns)
          Ue[Ne] = Te.ns[Ne];
        var tt = _.tags[_.tags.length - 1] || _;
        _.opt.xmlns && Te.ns !== tt.ns && Object.keys(Te.ns).forEach(function(Re) {
          var nt = Te.ns[Re];
          q(_, "onclosenamespace", { prefix: Re, uri: nt });
        });
      }
      w === 0 && (_.closedRoot = !0), _.tagName = _.attribValue = _.attribName = "", _.attribList.length = 0, _.state = b.TEXT;
    }
    function te(_) {
      var w = _.entity, k = w.toLowerCase(), I, ge = "";
      return _.ENTITIES[w] ? _.ENTITIES[w] : _.ENTITIES[k] ? _.ENTITIES[k] : (w = k, w.charAt(0) === "#" && (w.charAt(1) === "x" ? (w = w.slice(2), I = parseInt(w, 16), ge = I.toString(16)) : (w = w.slice(1), I = parseInt(w, 10), ge = I.toString(10))), w = w.replace(/^0+/, ""), isNaN(I) || ge.toLowerCase() !== w || I < 0 || I > 1114111 ? (R(_, "Invalid character entity"), "&" + _.entity + ";") : String.fromCodePoint(I));
    }
    function we(_, w) {
      w === "<" ? (_.state = b.OPEN_WAKA, _.startTagPosition = _.position) : C(w) || (R(_, "Non-whitespace before first tag."), _.textNode = w, _.state = b.TEXT);
    }
    function ce(_, w) {
      var k = "";
      return w < _.length && (k = _.charAt(w)), k;
    }
    function De(_) {
      var w = this;
      if (this.error)
        throw this.error;
      if (w.closed)
        return j(
          w,
          "Cannot write after close. Assign an onready handler."
        );
      if (_ === null)
        return N(w);
      typeof _ == "object" && (_ = _.toString());
      for (var k = 0, I = ""; I = ce(_, k++), w.c = I, !!I; )
        switch (w.trackPosition && (w.position++, I === `
` ? (w.line++, w.column = 0) : w.column++), w.state) {
          case b.BEGIN:
            if (w.state = b.BEGIN_WHITESPACE, I === "\uFEFF")
              continue;
            we(w, I);
            continue;
          case b.BEGIN_WHITESPACE:
            we(w, I);
            continue;
          case b.TEXT:
            if (w.sawRoot && !w.closedRoot) {
              for (var Ae = k - 1; I && I !== "<" && I !== "&"; )
                I = ce(_, k++), I && w.trackPosition && (w.position++, I === `
` ? (w.line++, w.column = 0) : w.column++);
              w.textNode += _.substring(Ae, k - 1);
            }
            I === "<" && !(w.sawRoot && w.closedRoot && !w.strict) ? (w.state = b.OPEN_WAKA, w.startTagPosition = w.position) : (!C(I) && (!w.sawRoot || w.closedRoot) && R(w, "Text data outside of root node."), I === "&" ? w.state = b.TEXT_ENTITY : w.textNode += I);
            continue;
          case b.SCRIPT:
            I === "<" ? w.state = b.SCRIPT_ENDING : w.script += I;
            continue;
          case b.SCRIPT_ENDING:
            I === "/" ? w.state = b.CLOSE_TAG : (w.script += "<" + I, w.state = b.SCRIPT);
            continue;
          case b.OPEN_WAKA:
            if (I === "!")
              w.state = b.SGML_DECL, w.sgmlDecl = "";
            else if (!C(I)) if (z(y, I))
              w.state = b.OPEN_TAG, w.tagName = I;
            else if (I === "/")
              w.state = b.CLOSE_TAG, w.tagName = "";
            else if (I === "?")
              w.state = b.PROC_INST, w.procInstName = w.procInstBody = "";
            else {
              if (R(w, "Unencoded <"), w.startTagPosition + 1 < w.position) {
                var ge = w.position - w.startTagPosition;
                I = new Array(ge).join(" ") + I;
              }
              w.textNode += "<" + I, w.state = b.TEXT;
            }
            continue;
          case b.SGML_DECL:
            if (w.sgmlDecl + I === "--") {
              w.state = b.COMMENT, w.comment = "", w.sgmlDecl = "";
              continue;
            }
            w.doctype && w.doctype !== !0 && w.sgmlDecl ? (w.state = b.DOCTYPE_DTD, w.doctype += "<!" + w.sgmlDecl + I, w.sgmlDecl = "") : (w.sgmlDecl + I).toUpperCase() === h ? (q(w, "onopencdata"), w.state = b.CDATA, w.sgmlDecl = "", w.cdata = "") : (w.sgmlDecl + I).toUpperCase() === d ? (w.state = b.DOCTYPE, (w.doctype || w.sawRoot) && R(
              w,
              "Inappropriately located doctype declaration"
            ), w.doctype = "", w.sgmlDecl = "") : I === ">" ? (q(w, "onsgmldeclaration", w.sgmlDecl), w.sgmlDecl = "", w.state = b.TEXT) : (U(I) && (w.state = b.SGML_DECL_QUOTED), w.sgmlDecl += I);
            continue;
          case b.SGML_DECL_QUOTED:
            I === w.q && (w.state = b.SGML_DECL, w.q = ""), w.sgmlDecl += I;
            continue;
          case b.DOCTYPE:
            I === ">" ? (w.state = b.TEXT, q(w, "ondoctype", w.doctype), w.doctype = !0) : (w.doctype += I, I === "[" ? w.state = b.DOCTYPE_DTD : U(I) && (w.state = b.DOCTYPE_QUOTED, w.q = I));
            continue;
          case b.DOCTYPE_QUOTED:
            w.doctype += I, I === w.q && (w.q = "", w.state = b.DOCTYPE);
            continue;
          case b.DOCTYPE_DTD:
            I === "]" ? (w.doctype += I, w.state = b.DOCTYPE) : I === "<" ? (w.state = b.OPEN_WAKA, w.startTagPosition = w.position) : U(I) ? (w.doctype += I, w.state = b.DOCTYPE_DTD_QUOTED, w.q = I) : w.doctype += I;
            continue;
          case b.DOCTYPE_DTD_QUOTED:
            w.doctype += I, I === w.q && (w.state = b.DOCTYPE_DTD, w.q = "");
            continue;
          case b.COMMENT:
            I === "-" ? w.state = b.COMMENT_ENDING : w.comment += I;
            continue;
          case b.COMMENT_ENDING:
            I === "-" ? (w.state = b.COMMENT_ENDED, w.comment = J(w.opt, w.comment), w.comment && q(w, "oncomment", w.comment), w.comment = "") : (w.comment += "-" + I, w.state = b.COMMENT);
            continue;
          case b.COMMENT_ENDED:
            I !== ">" ? (R(w, "Malformed comment"), w.comment += "--" + I, w.state = b.COMMENT) : w.doctype && w.doctype !== !0 ? w.state = b.DOCTYPE_DTD : w.state = b.TEXT;
            continue;
          case b.CDATA:
            for (var Ae = k - 1; I && I !== "]"; )
              I = ce(_, k++), I && w.trackPosition && (w.position++, I === `
` ? (w.line++, w.column = 0) : w.column++);
            w.cdata += _.substring(Ae, k - 1), I === "]" && (w.state = b.CDATA_ENDING);
            continue;
          case b.CDATA_ENDING:
            I === "]" ? w.state = b.CDATA_ENDING_2 : (w.cdata += "]" + I, w.state = b.CDATA);
            continue;
          case b.CDATA_ENDING_2:
            I === ">" ? (w.cdata && q(w, "oncdata", w.cdata), q(w, "onclosecdata"), w.cdata = "", w.state = b.TEXT) : I === "]" ? w.cdata += "]" : (w.cdata += "]]" + I, w.state = b.CDATA);
            continue;
          case b.PROC_INST:
            I === "?" ? w.state = b.PROC_INST_ENDING : C(I) ? w.state = b.PROC_INST_BODY : w.procInstName += I;
            continue;
          case b.PROC_INST_BODY:
            if (!w.procInstBody && C(I))
              continue;
            I === "?" ? w.state = b.PROC_INST_ENDING : w.procInstBody += I;
            continue;
          case b.PROC_INST_ENDING:
            if (I === ">") {
              const tt = {
                name: w.procInstName,
                body: w.procInstBody
              };
              W(w, tt), q(w, "onprocessinginstruction", tt), w.procInstName = w.procInstBody = "", w.state = b.TEXT;
            } else
              w.procInstBody += "?" + I, w.state = b.PROC_INST_BODY;
            continue;
          case b.OPEN_TAG:
            z(g, I) ? w.tagName += I : (O(w), I === ">" ? M(w) : I === "/" ? w.state = b.OPEN_TAG_SLASH : (C(I) || R(w, "Invalid character in tag name"), w.state = b.ATTRIB));
            continue;
          case b.OPEN_TAG_SLASH:
            I === ">" ? (M(w, !0), ne(w)) : (R(
              w,
              "Forward-slash in opening tag not followed by >"
            ), w.state = b.ATTRIB);
            continue;
          case b.ATTRIB:
            if (C(I))
              continue;
            I === ">" ? M(w) : I === "/" ? w.state = b.OPEN_TAG_SLASH : z(y, I) ? (w.attribName = I, w.attribValue = "", w.state = b.ATTRIB_NAME) : R(w, "Invalid attribute name");
            continue;
          case b.ATTRIB_NAME:
            I === "=" ? w.state = b.ATTRIB_VALUE : I === ">" ? (R(w, "Attribute without value"), w.attribValue = w.attribName, T(w), M(w)) : C(I) ? w.state = b.ATTRIB_NAME_SAW_WHITE : z(g, I) ? w.attribName += I : R(w, "Invalid attribute name");
            continue;
          case b.ATTRIB_NAME_SAW_WHITE:
            if (I === "=")
              w.state = b.ATTRIB_VALUE;
            else {
              if (C(I))
                continue;
              R(w, "Attribute without value"), w.tag.attributes[w.attribName] = "", w.attribValue = "", q(w, "onattribute", {
                name: w.attribName,
                value: ""
              }), w.attribName = "", I === ">" ? M(w) : z(y, I) ? (w.attribName = I, w.state = b.ATTRIB_NAME) : (R(w, "Invalid attribute name"), w.state = b.ATTRIB);
            }
            continue;
          case b.ATTRIB_VALUE:
            if (C(I))
              continue;
            U(I) ? (w.q = I, w.state = b.ATTRIB_VALUE_QUOTED) : (w.opt.unquotedAttributeValues || j(w, "Unquoted attribute value"), w.state = b.ATTRIB_VALUE_UNQUOTED, w.attribValue = I);
            continue;
          case b.ATTRIB_VALUE_QUOTED:
            if (I !== w.q) {
              I === "&" ? w.state = b.ATTRIB_VALUE_ENTITY_Q : w.attribValue += I;
              continue;
            }
            T(w), w.q = "", w.state = b.ATTRIB_VALUE_CLOSED;
            continue;
          case b.ATTRIB_VALUE_CLOSED:
            C(I) ? w.state = b.ATTRIB : I === ">" ? M(w) : I === "/" ? w.state = b.OPEN_TAG_SLASH : z(y, I) ? (R(w, "No whitespace between attributes"), w.attribName = I, w.attribValue = "", w.state = b.ATTRIB_NAME) : R(w, "Invalid attribute name");
            continue;
          case b.ATTRIB_VALUE_UNQUOTED:
            if (!G(I)) {
              I === "&" ? w.state = b.ATTRIB_VALUE_ENTITY_U : w.attribValue += I;
              continue;
            }
            T(w), I === ">" ? M(w) : w.state = b.ATTRIB;
            continue;
          case b.CLOSE_TAG:
            if (w.tagName)
              I === ">" ? ne(w) : z(g, I) ? w.tagName += I : w.script ? (w.script += "</" + w.tagName + I, w.tagName = "", w.state = b.SCRIPT) : (C(I) || R(w, "Invalid tagname in closing tag"), w.state = b.CLOSE_TAG_SAW_WHITE);
            else {
              if (C(I))
                continue;
              H(y, I) ? w.script ? (w.script += "</" + I, w.state = b.SCRIPT) : R(w, "Invalid tagname in closing tag.") : w.tagName = I;
            }
            continue;
          case b.CLOSE_TAG_SAW_WHITE:
            if (C(I))
              continue;
            I === ">" ? ne(w) : R(w, "Invalid characters in closing tag");
            continue;
          case b.TEXT_ENTITY:
          case b.ATTRIB_VALUE_ENTITY_Q:
          case b.ATTRIB_VALUE_ENTITY_U:
            var Te, Ue;
            switch (w.state) {
              case b.TEXT_ENTITY:
                Te = b.TEXT, Ue = "textNode";
                break;
              case b.ATTRIB_VALUE_ENTITY_Q:
                Te = b.ATTRIB_VALUE_QUOTED, Ue = "attribValue";
                break;
              case b.ATTRIB_VALUE_ENTITY_U:
                Te = b.ATTRIB_VALUE_UNQUOTED, Ue = "attribValue";
                break;
            }
            if (I === ";") {
              var Ne = te(w);
              w.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Ne) ? ((w.entityCount += 1) > w.opt.maxEntityCount && j(
                w,
                "Parsed entity count exceeds max entity count"
              ), (w.entityDepth += 1) > w.opt.maxEntityDepth && j(
                w,
                "Parsed entity depth exceeds max entity depth"
              ), w.entity = "", w.state = Te, w.write(Ne), w.entityDepth -= 1) : (w[Ue] += Ne, w.entity = "", w.state = Te);
            } else z(w.entity.length ? S : E, I) ? w.entity += I : (R(w, "Invalid character in entity name"), w[Ue] += "&" + w.entity + I, w.entity = "", w.state = Te);
            continue;
          default:
            throw new Error(w, "Unknown state: " + w.state);
        }
      return w.position >= w.bufferCheckPosition && i(w), w;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var _ = String.fromCharCode, w = Math.floor, k = function() {
        var I = 16384, ge = [], Ae, Te, Ue = -1, Ne = arguments.length;
        if (!Ne)
          return "";
        for (var tt = ""; ++Ue < Ne; ) {
          var Re = Number(arguments[Ue]);
          if (!isFinite(Re) || // `NaN`, `+Infinity`, or `-Infinity`
          Re < 0 || // not a valid Unicode code point
          Re > 1114111 || // not a valid Unicode code point
          w(Re) !== Re)
            throw RangeError("Invalid code point: " + Re);
          Re <= 65535 ? ge.push(Re) : (Re -= 65536, Ae = (Re >> 10) + 55296, Te = Re % 1024 + 56320, ge.push(Ae, Te)), (Ue + 1 === Ne || ge.length > I) && (tt += _.apply(null, ge), ge.length = 0);
        }
        return tt;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: k,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = k;
    }();
  })(e);
})(ly);
Object.defineProperty(Jo, "__esModule", { value: !0 });
Jo.XElement = void 0;
Jo.parseXml = _R;
const vR = ly, Rs = Mi;
class uy {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Rs.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!ER(t))
      throw (0, Rs.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const n = this.attributes === null ? null : this.attributes[t];
    if (n == null)
      throw (0, Rs.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return n;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, n = !1, r = null) {
    const i = this.elementOrNull(t, n);
    if (i === null)
      throw (0, Rs.newError)(r || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, n = !1) {
    if (this.elements === null)
      return null;
    for (const r of this.elements)
      if (Nh(r, t, n))
        return r;
    return null;
  }
  getElements(t, n = !1) {
    return this.elements === null ? [] : this.elements.filter((r) => Nh(r, t, n));
  }
  elementValueOrEmpty(t, n = !1) {
    const r = this.elementOrNull(t, n);
    return r === null ? "" : r.value;
  }
}
Jo.XElement = uy;
const wR = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function ER(e) {
  return wR.test(e);
}
function Nh(e, t, n) {
  const r = e.name;
  return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
}
function _R(e) {
  let t = null;
  const n = vR.parser(!0, {}), r = [];
  return n.onopentag = (i) => {
    const o = new uy(i.name);
    if (o.attributes = i.attributes, t === null)
      t = o;
    else {
      const s = r[r.length - 1];
      s.elements == null && (s.elements = []), s.elements.push(o);
    }
    r.push(o);
  }, n.onclosetag = () => {
    r.pop();
  }, n.ontext = (i) => {
    r.length > 0 && (r[r.length - 1].value = i);
  }, n.oncdata = (i) => {
    const o = r[r.length - 1];
    o.value = i, o.isCData = !0;
  }, n.onerror = (i) => {
    throw i;
  }, n.write(e), t;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CURRENT_APP_PACKAGE_FILE_NAME = e.CURRENT_APP_INSTALLER_FILE_NAME = e.XElement = e.parseXml = e.UUID = e.parseDn = e.retry = e.githubTagPrefix = e.githubUrl = e.getS3LikeProviderBaseUrl = e.ProgressCallbackTransform = e.MemoLazy = e.safeStringifyJson = e.safeGetHeader = e.parseJson = e.HttpExecutor = e.HttpError = e.DigestTransform = e.createHttpError = e.configureRequestUrl = e.configureRequestOptionsFromUrl = e.configureRequestOptions = e.newError = e.CancellationToken = e.CancellationError = void 0, e.asArray = f;
  var t = lr;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var n = Mi;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return n.newError;
  } });
  var r = It;
  Object.defineProperty(e, "configureRequestOptions", { enumerable: !0, get: function() {
    return r.configureRequestOptions;
  } }), Object.defineProperty(e, "configureRequestOptionsFromUrl", { enumerable: !0, get: function() {
    return r.configureRequestOptionsFromUrl;
  } }), Object.defineProperty(e, "configureRequestUrl", { enumerable: !0, get: function() {
    return r.configureRequestUrl;
  } }), Object.defineProperty(e, "createHttpError", { enumerable: !0, get: function() {
    return r.createHttpError;
  } }), Object.defineProperty(e, "DigestTransform", { enumerable: !0, get: function() {
    return r.DigestTransform;
  } }), Object.defineProperty(e, "HttpError", { enumerable: !0, get: function() {
    return r.HttpError;
  } }), Object.defineProperty(e, "HttpExecutor", { enumerable: !0, get: function() {
    return r.HttpExecutor;
  } }), Object.defineProperty(e, "parseJson", { enumerable: !0, get: function() {
    return r.parseJson;
  } }), Object.defineProperty(e, "safeGetHeader", { enumerable: !0, get: function() {
    return r.safeGetHeader;
  } }), Object.defineProperty(e, "safeStringifyJson", { enumerable: !0, get: function() {
    return r.safeStringifyJson;
  } });
  var i = Ga;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = Wo;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var s = Ko;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return s.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return s.githubUrl;
  } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
    return s.githubTagPrefix;
  } });
  var a = sf;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return a.retry;
  } });
  var c = af;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return c.parseDn;
  } });
  var u = Ii;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return u.UUID;
  } });
  var l = Jo;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return l.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return l.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(h) {
    return h == null ? [] : Array.isArray(h) ? h : [h];
  }
})(et);
var dt = {}, cf = {}, dn = {};
function fy(e) {
  return typeof e > "u" || e === null;
}
function $R(e) {
  return typeof e == "object" && e !== null;
}
function SR(e) {
  return Array.isArray(e) ? e : fy(e) ? [] : [e];
}
function bR(e, t) {
  var n, r, i, o;
  if (t)
    for (o = Object.keys(t), n = 0, r = o.length; n < r; n += 1)
      i = o[n], e[i] = t[i];
  return e;
}
function AR(e, t) {
  var n = "", r;
  for (r = 0; r < t; r += 1)
    n += e;
  return n;
}
function TR(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
dn.isNothing = fy;
dn.isObject = $R;
dn.toArray = SR;
dn.repeat = AR;
dn.isNegativeZero = TR;
dn.extend = bR;
function dy(e, t) {
  var n = "", r = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (n += 'in "' + e.mark.name + '" '), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += `

` + e.mark.snippet), r + " " + n) : r;
}
function Io(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = dy(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Io.prototype = Object.create(Error.prototype);
Io.prototype.constructor = Io;
Io.prototype.toString = function(t) {
  return this.name + ": " + dy(this, t);
};
var Yo = Io, lo = dn;
function Bc(e, t, n, r, i) {
  var o = "", s = "", a = Math.floor(i / 2) - 1;
  return r - t > a && (o = " ... ", t = r - a + o.length), n - r > a && (s = " ...", n = r + a - s.length), {
    str: o + e.slice(t, n).replace(/\t/g, "→") + s,
    pos: r - t + o.length
    // relative position
  };
}
function Hc(e, t) {
  return lo.repeat(" ", t - e.length) + e;
}
function CR(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var n = /\r?\n|\r|\0/g, r = [0], i = [], o, s = -1; o = n.exec(e.buffer); )
    i.push(o.index), r.push(o.index + o[0].length), e.position <= o.index && s < 0 && (s = r.length - 2);
  s < 0 && (s = r.length - 1);
  var a = "", c, u, l = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + l + 3);
  for (c = 1; c <= t.linesBefore && !(s - c < 0); c++)
    u = Bc(
      e.buffer,
      r[s - c],
      i[s - c],
      e.position - (r[s] - r[s - c]),
      f
    ), a = lo.repeat(" ", t.indent) + Hc((e.line - c + 1).toString(), l) + " | " + u.str + `
` + a;
  for (u = Bc(e.buffer, r[s], i[s], e.position, f), a += lo.repeat(" ", t.indent) + Hc((e.line + 1).toString(), l) + " | " + u.str + `
`, a += lo.repeat("-", t.indent + l + 3 + u.pos) + `^
`, c = 1; c <= t.linesAfter && !(s + c >= i.length); c++)
    u = Bc(
      e.buffer,
      r[s + c],
      i[s + c],
      e.position - (r[s] - r[s + c]),
      f
    ), a += lo.repeat(" ", t.indent) + Hc((e.line + c + 1).toString(), l) + " | " + u.str + `
`;
  return a.replace(/\n$/, "");
}
var NR = CR, Ih = Yo, IR = [
  "kind",
  "multi",
  "resolve",
  "construct",
  "instanceOf",
  "predicate",
  "represent",
  "representName",
  "defaultStyle",
  "styleAliases"
], PR = [
  "scalar",
  "sequence",
  "mapping"
];
function OR(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(n) {
    e[n].forEach(function(r) {
      t[String(r)] = n;
    });
  }), t;
}
function RR(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(n) {
    if (IR.indexOf(n) === -1)
      throw new Ih('Unknown option "' + n + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(n) {
    return n;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = OR(t.styleAliases || null), PR.indexOf(this.kind) === -1)
    throw new Ih('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Ft = RR, ro = Yo, qc = Ft;
function Ph(e, t) {
  var n = [];
  return e[t].forEach(function(r) {
    var i = n.length;
    n.forEach(function(o, s) {
      o.tag === r.tag && o.kind === r.kind && o.multi === r.multi && (i = s);
    }), n[i] = r;
  }), n;
}
function DR() {
  var e = {
    scalar: {},
    sequence: {},
    mapping: {},
    fallback: {},
    multi: {
      scalar: [],
      sequence: [],
      mapping: [],
      fallback: []
    }
  }, t, n;
  function r(i) {
    i.multi ? (e.multi[i.kind].push(i), e.multi.fallback.push(i)) : e[i.kind][i.tag] = e.fallback[i.tag] = i;
  }
  for (t = 0, n = arguments.length; t < n; t += 1)
    arguments[t].forEach(r);
  return e;
}
function Cl(e) {
  return this.extend(e);
}
Cl.prototype.extend = function(t) {
  var n = [], r = [];
  if (t instanceof qc)
    r.push(t);
  else if (Array.isArray(t))
    r = r.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (n = n.concat(t.implicit)), t.explicit && (r = r.concat(t.explicit));
  else
    throw new ro("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  n.forEach(function(o) {
    if (!(o instanceof qc))
      throw new ro("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new ro("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new ro("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), r.forEach(function(o) {
    if (!(o instanceof qc))
      throw new ro("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(Cl.prototype);
  return i.implicit = (this.implicit || []).concat(n), i.explicit = (this.explicit || []).concat(r), i.compiledImplicit = Ph(i, "implicit"), i.compiledExplicit = Ph(i, "explicit"), i.compiledTypeMap = DR(i.compiledImplicit, i.compiledExplicit), i;
};
var hy = Cl, FR = Ft, py = new FR("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), LR = Ft, my = new LR("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), xR = Ft, gy = new xR("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), kR = hy, yy = new kR({
  explicit: [
    py,
    my,
    gy
  ]
}), UR = Ft;
function jR(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function MR() {
  return null;
}
function BR(e) {
  return e === null;
}
var vy = new UR("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: jR,
  construct: MR,
  predicate: BR,
  represent: {
    canonical: function() {
      return "~";
    },
    lowercase: function() {
      return "null";
    },
    uppercase: function() {
      return "NULL";
    },
    camelcase: function() {
      return "Null";
    },
    empty: function() {
      return "";
    }
  },
  defaultStyle: "lowercase"
}), HR = Ft;
function qR(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function zR(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function VR(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var wy = new HR("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: qR,
  construct: zR,
  predicate: VR,
  represent: {
    lowercase: function(e) {
      return e ? "true" : "false";
    },
    uppercase: function(e) {
      return e ? "TRUE" : "FALSE";
    },
    camelcase: function(e) {
      return e ? "True" : "False";
    }
  },
  defaultStyle: "lowercase"
}), GR = dn, WR = Ft;
function KR(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function JR(e) {
  return 48 <= e && e <= 55;
}
function YR(e) {
  return 48 <= e && e <= 57;
}
function XR(e) {
  if (e === null) return !1;
  var t = e.length, n = 0, r = !1, i;
  if (!t) return !1;
  if (i = e[n], (i === "-" || i === "+") && (i = e[++n]), i === "0") {
    if (n + 1 === t) return !0;
    if (i = e[++n], i === "b") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (i !== "0" && i !== "1") return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "x") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!KR(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "o") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!JR(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; n < t; n++)
    if (i = e[n], i !== "_") {
      if (!YR(e.charCodeAt(n)))
        return !1;
      r = !0;
    }
  return !(!r || i === "_");
}
function ZR(e) {
  var t = e, n = 1, r;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
  if (r === "0") {
    if (t[1] === "b") return n * parseInt(t.slice(2), 2);
    if (t[1] === "x") return n * parseInt(t.slice(2), 16);
    if (t[1] === "o") return n * parseInt(t.slice(2), 8);
  }
  return n * parseInt(t, 10);
}
function QR(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !GR.isNegativeZero(e);
}
var Ey = new WR("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: XR,
  construct: ZR,
  predicate: QR,
  represent: {
    binary: function(e) {
      return e >= 0 ? "0b" + e.toString(2) : "-0b" + e.toString(2).slice(1);
    },
    octal: function(e) {
      return e >= 0 ? "0o" + e.toString(8) : "-0o" + e.toString(8).slice(1);
    },
    decimal: function(e) {
      return e.toString(10);
    },
    /* eslint-disable max-len */
    hexadecimal: function(e) {
      return e >= 0 ? "0x" + e.toString(16).toUpperCase() : "-0x" + e.toString(16).toUpperCase().slice(1);
    }
  },
  defaultStyle: "decimal",
  styleAliases: {
    binary: [2, "bin"],
    octal: [8, "oct"],
    decimal: [10, "dec"],
    hexadecimal: [16, "hex"]
  }
}), _y = dn, eD = Ft, tD = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function nD(e) {
  return !(e === null || !tD.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function rD(e) {
  var t, n;
  return t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
var iD = /^[-+]?[0-9]+e/;
function oD(e, t) {
  var n;
  if (isNaN(e))
    switch (t) {
      case "lowercase":
        return ".nan";
      case "uppercase":
        return ".NAN";
      case "camelcase":
        return ".NaN";
    }
  else if (Number.POSITIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return ".inf";
      case "uppercase":
        return ".INF";
      case "camelcase":
        return ".Inf";
    }
  else if (Number.NEGATIVE_INFINITY === e)
    switch (t) {
      case "lowercase":
        return "-.inf";
      case "uppercase":
        return "-.INF";
      case "camelcase":
        return "-.Inf";
    }
  else if (_y.isNegativeZero(e))
    return "-0.0";
  return n = e.toString(10), iD.test(n) ? n.replace("e", ".e") : n;
}
function sD(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || _y.isNegativeZero(e));
}
var $y = new eD("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: nD,
  construct: rD,
  predicate: sD,
  represent: oD,
  defaultStyle: "lowercase"
}), Sy = yy.extend({
  implicit: [
    vy,
    wy,
    Ey,
    $y
  ]
}), by = Sy, aD = Ft, Ay = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), Ty = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function cD(e) {
  return e === null ? !1 : Ay.exec(e) !== null || Ty.exec(e) !== null;
}
function lD(e) {
  var t, n, r, i, o, s, a, c = 0, u = null, l, f, h;
  if (t = Ay.exec(e), t === null && (t = Ty.exec(e)), t === null) throw new Error("Date resolve error");
  if (n = +t[1], r = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(n, r, i));
  if (o = +t[4], s = +t[5], a = +t[6], t[7]) {
    for (c = t[7].slice(0, 3); c.length < 3; )
      c += "0";
    c = +c;
  }
  return t[9] && (l = +t[10], f = +(t[11] || 0), u = (l * 60 + f) * 6e4, t[9] === "-" && (u = -u)), h = new Date(Date.UTC(n, r, i, o, s, a, c)), u && h.setTime(h.getTime() - u), h;
}
function uD(e) {
  return e.toISOString();
}
var Cy = new aD("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: cD,
  construct: lD,
  instanceOf: Date,
  represent: uD
}), fD = Ft;
function dD(e) {
  return e === "<<" || e === null;
}
var Ny = new fD("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: dD
}), hD = Ft, lf = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function pD(e) {
  if (e === null) return !1;
  var t, n, r = 0, i = e.length, o = lf;
  for (n = 0; n < i; n++)
    if (t = o.indexOf(e.charAt(n)), !(t > 64)) {
      if (t < 0) return !1;
      r += 6;
    }
  return r % 8 === 0;
}
function mD(e) {
  var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, o = lf, s = 0, a = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)), s = s << 6 | o.indexOf(r.charAt(t));
  return n = i % 4 * 6, n === 0 ? (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)) : n === 18 ? (a.push(s >> 10 & 255), a.push(s >> 2 & 255)) : n === 12 && a.push(s >> 4 & 255), new Uint8Array(a);
}
function gD(e) {
  var t = "", n = 0, r, i, o = e.length, s = lf;
  for (r = 0; r < o; r++)
    r % 3 === 0 && r && (t += s[n >> 18 & 63], t += s[n >> 12 & 63], t += s[n >> 6 & 63], t += s[n & 63]), n = (n << 8) + e[r];
  return i = o % 3, i === 0 ? (t += s[n >> 18 & 63], t += s[n >> 12 & 63], t += s[n >> 6 & 63], t += s[n & 63]) : i === 2 ? (t += s[n >> 10 & 63], t += s[n >> 4 & 63], t += s[n << 2 & 63], t += s[64]) : i === 1 && (t += s[n >> 2 & 63], t += s[n << 4 & 63], t += s[64], t += s[64]), t;
}
function yD(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var Iy = new hD("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: pD,
  construct: mD,
  predicate: yD,
  represent: gD
}), vD = Ft, wD = Object.prototype.hasOwnProperty, ED = Object.prototype.toString;
function _D(e) {
  if (e === null) return !0;
  var t = [], n, r, i, o, s, a = e;
  for (n = 0, r = a.length; n < r; n += 1) {
    if (i = a[n], s = !1, ED.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (wD.call(i, o))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function $D(e) {
  return e !== null ? e : [];
}
var Py = new vD("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: _D,
  construct: $D
}), SD = Ft, bD = Object.prototype.toString;
function AD(e) {
  if (e === null) return !0;
  var t, n, r, i, o, s = e;
  for (o = new Array(s.length), t = 0, n = s.length; t < n; t += 1) {
    if (r = s[t], bD.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
    o[t] = [i[0], r[i[0]]];
  }
  return !0;
}
function TD(e) {
  if (e === null) return [];
  var t, n, r, i, o, s = e;
  for (o = new Array(s.length), t = 0, n = s.length; t < n; t += 1)
    r = s[t], i = Object.keys(r), o[t] = [i[0], r[i[0]]];
  return o;
}
var Oy = new SD("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: AD,
  construct: TD
}), CD = Ft, ND = Object.prototype.hasOwnProperty;
function ID(e) {
  if (e === null) return !0;
  var t, n = e;
  for (t in n)
    if (ND.call(n, t) && n[t] !== null)
      return !1;
  return !0;
}
function PD(e) {
  return e !== null ? e : {};
}
var Ry = new CD("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: ID,
  construct: PD
}), uf = by.extend({
  implicit: [
    Cy,
    Ny
  ],
  explicit: [
    Iy,
    Py,
    Oy,
    Ry
  ]
}), Fr = dn, Dy = Yo, OD = NR, RD = uf, ur = Object.prototype.hasOwnProperty, ua = 1, Fy = 2, Ly = 3, fa = 4, zc = 1, DD = 2, Oh = 3, FD = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, LD = /[\x85\u2028\u2029]/, xD = /[,\[\]\{\}]/, xy = /^(?:!|!!|![a-z\-]+!)$/i, ky = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function Rh(e) {
  return Object.prototype.toString.call(e);
}
function _n(e) {
  return e === 10 || e === 13;
}
function Hr(e) {
  return e === 9 || e === 32;
}
function Bt(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function yi(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function kD(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function UD(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function jD(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Dh(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function MD(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function Uy(e, t, n) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: n
  }) : e[t] = n;
}
var jy = new Array(256), My = new Array(256);
for (var si = 0; si < 256; si++)
  jy[si] = Dh(si) ? 1 : 0, My[si] = Dh(si);
function BD(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || RD, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function By(e, t) {
  var n = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return n.snippet = OD(n), new Dy(t, n);
}
function ae(e, t) {
  throw By(e, t);
}
function da(e, t) {
  e.onWarning && e.onWarning.call(null, By(e, t));
}
var Fh = {
  YAML: function(t, n, r) {
    var i, o, s;
    t.version !== null && ae(t, "duplication of %YAML directive"), r.length !== 1 && ae(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(r[0]), i === null && ae(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), s = parseInt(i[2], 10), o !== 1 && ae(t, "unacceptable YAML version of the document"), t.version = r[0], t.checkLineBreaks = s < 2, s !== 1 && s !== 2 && da(t, "unsupported YAML version of the document");
  },
  TAG: function(t, n, r) {
    var i, o;
    r.length !== 2 && ae(t, "TAG directive accepts exactly two arguments"), i = r[0], o = r[1], xy.test(i) || ae(t, "ill-formed tag handle (first argument) of the TAG directive"), ur.call(t.tagMap, i) && ae(t, 'there is a previously declared suffix for "' + i + '" tag handle'), ky.test(o) || ae(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      ae(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function ar(e, t, n, r) {
  var i, o, s, a;
  if (t < n) {
    if (a = e.input.slice(t, n), r)
      for (i = 0, o = a.length; i < o; i += 1)
        s = a.charCodeAt(i), s === 9 || 32 <= s && s <= 1114111 || ae(e, "expected valid JSON character");
    else FD.test(a) && ae(e, "the stream contains non-printable characters");
    e.result += a;
  }
}
function Lh(e, t, n, r) {
  var i, o, s, a;
  for (Fr.isObject(n) || ae(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), s = 0, a = i.length; s < a; s += 1)
    o = i[s], ur.call(t, o) || (Uy(t, o, n[o]), r[o] = !0);
}
function vi(e, t, n, r, i, o, s, a, c) {
  var u, l;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), u = 0, l = i.length; u < l; u += 1)
      Array.isArray(i[u]) && ae(e, "nested arrays are not supported inside keys"), typeof i == "object" && Rh(i[u]) === "[object Object]" && (i[u] = "[object Object]");
  if (typeof i == "object" && Rh(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (u = 0, l = o.length; u < l; u += 1)
        Lh(e, t, o[u], n);
    else
      Lh(e, t, o, n);
  else
    !e.json && !ur.call(n, i) && ur.call(t, i) && (e.line = s || e.line, e.lineStart = a || e.lineStart, e.position = c || e.position, ae(e, "duplicated mapping key")), Uy(t, i, o), delete n[i];
  return t;
}
function ff(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : ae(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function Je(e, t, n) {
  for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Hr(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (_n(i))
      for (ff(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return n !== -1 && r !== 0 && e.lineIndent < n && da(e, "deficient indentation"), r;
}
function Wa(e) {
  var t = e.position, n;
  return n = e.input.charCodeAt(t), !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || Bt(n)));
}
function df(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Fr.repeat(`
`, t - 1));
}
function HD(e, t, n) {
  var r, i, o, s, a, c, u, l, f = e.kind, h = e.result, d;
  if (d = e.input.charCodeAt(e.position), Bt(d) || yi(d) || d === 35 || d === 38 || d === 42 || d === 33 || d === 124 || d === 62 || d === 39 || d === 34 || d === 37 || d === 64 || d === 96 || (d === 63 || d === 45) && (i = e.input.charCodeAt(e.position + 1), Bt(i) || n && yi(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = s = e.position, a = !1; d !== 0; ) {
    if (d === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Bt(i) || n && yi(i))
        break;
    } else if (d === 35) {
      if (r = e.input.charCodeAt(e.position - 1), Bt(r))
        break;
    } else {
      if (e.position === e.lineStart && Wa(e) || n && yi(d))
        break;
      if (_n(d))
        if (c = e.line, u = e.lineStart, l = e.lineIndent, Je(e, !1, -1), e.lineIndent >= t) {
          a = !0, d = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = c, e.lineStart = u, e.lineIndent = l;
          break;
        }
    }
    a && (ar(e, o, s, !1), df(e, e.line - c), o = s = e.position, a = !1), Hr(d) || (s = e.position + 1), d = e.input.charCodeAt(++e.position);
  }
  return ar(e, o, s, !1), e.result ? !0 : (e.kind = f, e.result = h, !1);
}
function qD(e, t) {
  var n, r, i;
  if (n = e.input.charCodeAt(e.position), n !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0; )
    if (n === 39)
      if (ar(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39)
        r = e.position, e.position++, i = e.position;
      else
        return !0;
    else _n(n) ? (ar(e, r, i, !0), df(e, Je(e, !1, t)), r = i = e.position) : e.position === e.lineStart && Wa(e) ? ae(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  ae(e, "unexpected end of the stream within a single quoted scalar");
}
function zD(e, t) {
  var n, r, i, o, s, a;
  if (a = e.input.charCodeAt(e.position), a !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (a = e.input.charCodeAt(e.position)) !== 0; ) {
    if (a === 34)
      return ar(e, n, e.position, !0), e.position++, !0;
    if (a === 92) {
      if (ar(e, n, e.position, !0), a = e.input.charCodeAt(++e.position), _n(a))
        Je(e, !1, t);
      else if (a < 256 && jy[a])
        e.result += My[a], e.position++;
      else if ((s = UD(a)) > 0) {
        for (i = s, o = 0; i > 0; i--)
          a = e.input.charCodeAt(++e.position), (s = kD(a)) >= 0 ? o = (o << 4) + s : ae(e, "expected hexadecimal character");
        e.result += MD(o), e.position++;
      } else
        ae(e, "unknown escape sequence");
      n = r = e.position;
    } else _n(a) ? (ar(e, n, r, !0), df(e, Je(e, !1, t)), n = r = e.position) : e.position === e.lineStart && Wa(e) ? ae(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
  }
  ae(e, "unexpected end of the stream within a double quoted scalar");
}
function VD(e, t) {
  var n = !0, r, i, o, s = e.tag, a, c = e.anchor, u, l, f, h, d, m = /* @__PURE__ */ Object.create(null), p, v, y, g;
  if (g = e.input.charCodeAt(e.position), g === 91)
    l = 93, d = !1, a = [];
  else if (g === 123)
    l = 125, d = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), g = e.input.charCodeAt(++e.position); g !== 0; ) {
    if (Je(e, !0, t), g = e.input.charCodeAt(e.position), g === l)
      return e.position++, e.tag = s, e.anchor = c, e.kind = d ? "mapping" : "sequence", e.result = a, !0;
    n ? g === 44 && ae(e, "expected the node content, but found ','") : ae(e, "missed comma between flow collection entries"), v = p = y = null, f = h = !1, g === 63 && (u = e.input.charCodeAt(e.position + 1), Bt(u) && (f = h = !0, e.position++, Je(e, !0, t))), r = e.line, i = e.lineStart, o = e.position, Pi(e, t, ua, !1, !0), v = e.tag, p = e.result, Je(e, !0, t), g = e.input.charCodeAt(e.position), (h || e.line === r) && g === 58 && (f = !0, g = e.input.charCodeAt(++e.position), Je(e, !0, t), Pi(e, t, ua, !1, !0), y = e.result), d ? vi(e, a, m, v, p, y, r, i, o) : f ? a.push(vi(e, null, m, v, p, y, r, i, o)) : a.push(p), Je(e, !0, t), g = e.input.charCodeAt(e.position), g === 44 ? (n = !0, g = e.input.charCodeAt(++e.position)) : n = !1;
  }
  ae(e, "unexpected end of the stream within a flow collection");
}
function GD(e, t) {
  var n, r, i = zc, o = !1, s = !1, a = t, c = 0, u = !1, l, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    r = !1;
  else if (f === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      zc === i ? i = f === 43 ? Oh : DD : ae(e, "repeat of a chomping mode identifier");
    else if ((l = jD(f)) >= 0)
      l === 0 ? ae(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? ae(e, "repeat of an indentation width identifier") : (a = t + l - 1, s = !0);
    else
      break;
  if (Hr(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (Hr(f));
    if (f === 35)
      do
        f = e.input.charCodeAt(++e.position);
      while (!_n(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (ff(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!s || e.lineIndent < a) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > a && (a = e.lineIndent), _n(f)) {
      c++;
      continue;
    }
    if (e.lineIndent < a) {
      i === Oh ? e.result += Fr.repeat(`
`, o ? 1 + c : c) : i === zc && o && (e.result += `
`);
      break;
    }
    for (r ? Hr(f) ? (u = !0, e.result += Fr.repeat(`
`, o ? 1 + c : c)) : u ? (u = !1, e.result += Fr.repeat(`
`, c + 1)) : c === 0 ? o && (e.result += " ") : e.result += Fr.repeat(`
`, c) : e.result += Fr.repeat(`
`, o ? 1 + c : c), o = !0, s = !0, c = 0, n = e.position; !_n(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    ar(e, n, e.position, !1);
  }
  return !0;
}
function xh(e, t) {
  var n, r = e.tag, i = e.anchor, o = [], s, a = !1, c;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), c = e.input.charCodeAt(e.position); c !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, ae(e, "tab characters must not be used in indentation")), !(c !== 45 || (s = e.input.charCodeAt(e.position + 1), !Bt(s)))); ) {
    if (a = !0, e.position++, Je(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), c = e.input.charCodeAt(e.position);
      continue;
    }
    if (n = e.line, Pi(e, t, Ly, !1, !0), o.push(e.result), Je(e, !0, -1), c = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && c !== 0)
      ae(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return a ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function WD(e, t, n) {
  var r, i, o, s, a, c, u = e.tag, l = e.anchor, f = {}, h = /* @__PURE__ */ Object.create(null), d = null, m = null, p = null, v = !1, y = !1, g;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), g = e.input.charCodeAt(e.position); g !== 0; ) {
    if (!v && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, ae(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), o = e.line, (g === 63 || g === 58) && Bt(r))
      g === 63 ? (v && (vi(e, f, h, d, m, null, s, a, c), d = m = p = null), y = !0, v = !0, i = !0) : v ? (v = !1, i = !0) : ae(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, g = r;
    else {
      if (s = e.line, a = e.lineStart, c = e.position, !Pi(e, n, Fy, !1, !0))
        break;
      if (e.line === o) {
        for (g = e.input.charCodeAt(e.position); Hr(g); )
          g = e.input.charCodeAt(++e.position);
        if (g === 58)
          g = e.input.charCodeAt(++e.position), Bt(g) || ae(e, "a whitespace character is expected after the key-value separator within a block mapping"), v && (vi(e, f, h, d, m, null, s, a, c), d = m = p = null), y = !0, v = !1, i = !1, d = e.tag, m = e.result;
        else if (y)
          ae(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = u, e.anchor = l, !0;
      } else if (y)
        ae(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = u, e.anchor = l, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (v && (s = e.line, a = e.lineStart, c = e.position), Pi(e, t, fa, !0, i) && (v ? m = e.result : p = e.result), v || (vi(e, f, h, d, m, p, s, a, c), d = m = p = null), Je(e, !0, -1), g = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && g !== 0)
      ae(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return v && vi(e, f, h, d, m, null, s, a, c), y && (e.tag = u, e.anchor = l, e.kind = "mapping", e.result = f), y;
}
function KD(e) {
  var t, n = !1, r = !1, i, o, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && ae(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (n = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (r = !0, i = "!!", s = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), s = e.input.charCodeAt(++e.position)) : ae(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !Bt(s); )
      s === 33 && (r ? ae(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), xy.test(i) || ae(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), s = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), xD.test(o) && ae(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !ky.test(o) && ae(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    ae(e, "tag name is malformed: " + o);
  }
  return n ? e.tag = o : ur.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : ae(e, 'undeclared tag handle "' + i + '"'), !0;
}
function JD(e) {
  var t, n;
  if (n = e.input.charCodeAt(e.position), n !== 38) return !1;
  for (e.anchor !== null && ae(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Bt(n) && !yi(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && ae(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function YD(e) {
  var t, n, r;
  if (r = e.input.charCodeAt(e.position), r !== 42) return !1;
  for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Bt(r) && !yi(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && ae(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), ur.call(e.anchorMap, n) || ae(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], Je(e, !0, -1), !0;
}
function Pi(e, t, n, r, i) {
  var o, s, a, c = 1, u = !1, l = !1, f, h, d, m, p, v;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = s = a = fa === n || Ly === n, r && Je(e, !0, -1) && (u = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1)
    for (; KD(e) || JD(e); )
      Je(e, !0, -1) ? (u = !0, a = o, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : a = !1;
  if (a && (a = u || i), (c === 1 || fa === n) && (ua === n || Fy === n ? p = t : p = t + 1, v = e.position - e.lineStart, c === 1 ? a && (xh(e, v) || WD(e, v, p)) || VD(e, p) ? l = !0 : (s && GD(e, p) || qD(e, p) || zD(e, p) ? l = !0 : YD(e) ? (l = !0, (e.tag !== null || e.anchor !== null) && ae(e, "alias node should not have any properties")) : HD(e, p, ua === n) && (l = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : c === 0 && (l = a && xh(e, v))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && ae(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, h = e.implicitTypes.length; f < h; f += 1)
      if (m = e.implicitTypes[f], m.resolve(e.result)) {
        e.result = m.construct(e.result), e.tag = m.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (ur.call(e.typeMap[e.kind || "fallback"], e.tag))
      m = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (m = null, d = e.typeMap.multi[e.kind || "fallback"], f = 0, h = d.length; f < h; f += 1)
        if (e.tag.slice(0, d[f].tag.length) === d[f].tag) {
          m = d[f];
          break;
        }
    m || ae(e, "unknown tag !<" + e.tag + ">"), e.result !== null && m.kind !== e.kind && ae(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + m.kind + '", not "' + e.kind + '"'), m.resolve(e.result, e.tag) ? (e.result = m.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : ae(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || l;
}
function XD(e) {
  var t = e.position, n, r, i, o = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (Je(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (o = !0, s = e.input.charCodeAt(++e.position), n = e.position; s !== 0 && !Bt(s); )
      s = e.input.charCodeAt(++e.position);
    for (r = e.input.slice(n, e.position), i = [], r.length < 1 && ae(e, "directive name must not be less than one character in length"); s !== 0; ) {
      for (; Hr(s); )
        s = e.input.charCodeAt(++e.position);
      if (s === 35) {
        do
          s = e.input.charCodeAt(++e.position);
        while (s !== 0 && !_n(s));
        break;
      }
      if (_n(s)) break;
      for (n = e.position; s !== 0 && !Bt(s); )
        s = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(n, e.position));
    }
    s !== 0 && ff(e), ur.call(Fh, r) ? Fh[r](e, r, i) : da(e, 'unknown document directive "' + r + '"');
  }
  if (Je(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, Je(e, !0, -1)) : o && ae(e, "directives end mark is expected"), Pi(e, e.lineIndent - 1, fa, !1, !0), Je(e, !0, -1), e.checkLineBreaks && LD.test(e.input.slice(t, e.position)) && da(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Wa(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, Je(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    ae(e, "end of the stream or a document separator is expected");
  else
    return;
}
function Hy(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var n = new BD(e, t), r = e.indexOf("\0");
  for (r !== -1 && (n.position = r, ae(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32; )
    n.lineIndent += 1, n.position += 1;
  for (; n.position < n.length - 1; )
    XD(n);
  return n.documents;
}
function ZD(e, t, n) {
  t !== null && typeof t == "object" && typeof n > "u" && (n = t, t = null);
  var r = Hy(e, n);
  if (typeof t != "function")
    return r;
  for (var i = 0, o = r.length; i < o; i += 1)
    t(r[i]);
}
function QD(e, t) {
  var n = Hy(e, t);
  if (n.length !== 0) {
    if (n.length === 1)
      return n[0];
    throw new Dy("expected a single document in the stream, but found more");
  }
}
cf.loadAll = ZD;
cf.load = QD;
var qy = {}, Ka = dn, Xo = Yo, eF = uf, zy = Object.prototype.toString, Vy = Object.prototype.hasOwnProperty, hf = 65279, tF = 9, Po = 10, nF = 13, rF = 32, iF = 33, oF = 34, Nl = 35, sF = 37, aF = 38, cF = 39, lF = 42, Gy = 44, uF = 45, ha = 58, fF = 61, dF = 62, hF = 63, pF = 64, Wy = 91, Ky = 93, mF = 96, Jy = 123, gF = 124, Yy = 125, $t = {};
$t[0] = "\\0";
$t[7] = "\\a";
$t[8] = "\\b";
$t[9] = "\\t";
$t[10] = "\\n";
$t[11] = "\\v";
$t[12] = "\\f";
$t[13] = "\\r";
$t[27] = "\\e";
$t[34] = '\\"';
$t[92] = "\\\\";
$t[133] = "\\N";
$t[160] = "\\_";
$t[8232] = "\\L";
$t[8233] = "\\P";
var yF = [
  "y",
  "Y",
  "yes",
  "Yes",
  "YES",
  "on",
  "On",
  "ON",
  "n",
  "N",
  "no",
  "No",
  "NO",
  "off",
  "Off",
  "OFF"
], vF = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function wF(e, t) {
  var n, r, i, o, s, a, c;
  if (t === null) return {};
  for (n = {}, r = Object.keys(t), i = 0, o = r.length; i < o; i += 1)
    s = r[i], a = String(t[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), c = e.compiledTypeMap.fallback[s], c && Vy.call(c.styleAliases, a) && (a = c.styleAliases[a]), n[s] = a;
  return n;
}
function EF(e) {
  var t, n, r;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    n = "x", r = 2;
  else if (e <= 65535)
    n = "u", r = 4;
  else if (e <= 4294967295)
    n = "U", r = 8;
  else
    throw new Xo("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + n + Ka.repeat("0", r - t.length) + t;
}
var _F = 1, Oo = 2;
function $F(e) {
  this.schema = e.schema || eF, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = Ka.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = wF(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? Oo : _F, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function kh(e, t) {
  for (var n = Ka.repeat(" ", t), r = 0, i = -1, o = "", s, a = e.length; r < a; )
    i = e.indexOf(`
`, r), i === -1 ? (s = e.slice(r), r = a) : (s = e.slice(r, i + 1), r = i + 1), s.length && s !== `
` && (o += n), o += s;
  return o;
}
function Il(e, t) {
  return `
` + Ka.repeat(" ", e.indent * t);
}
function SF(e, t) {
  var n, r, i;
  for (n = 0, r = e.implicitTypes.length; n < r; n += 1)
    if (i = e.implicitTypes[n], i.resolve(t))
      return !0;
  return !1;
}
function pa(e) {
  return e === rF || e === tF;
}
function Ro(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== hf || 65536 <= e && e <= 1114111;
}
function Uh(e) {
  return Ro(e) && e !== hf && e !== nF && e !== Po;
}
function jh(e, t, n) {
  var r = Uh(e), i = r && !pa(e);
  return (
    // ns-plain-safe
    (n ? (
      // c = flow-in
      r
    ) : r && e !== Gy && e !== Wy && e !== Ky && e !== Jy && e !== Yy) && e !== Nl && !(t === ha && !i) || Uh(t) && !pa(t) && e === Nl || t === ha && i
  );
}
function bF(e) {
  return Ro(e) && e !== hf && !pa(e) && e !== uF && e !== hF && e !== ha && e !== Gy && e !== Wy && e !== Ky && e !== Jy && e !== Yy && e !== Nl && e !== aF && e !== lF && e !== iF && e !== gF && e !== fF && e !== dF && e !== cF && e !== oF && e !== sF && e !== pF && e !== mF;
}
function AF(e) {
  return !pa(e) && e !== ha;
}
function uo(e, t) {
  var n = e.charCodeAt(t), r;
  return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function Xy(e) {
  var t = /^\n* /;
  return t.test(e);
}
var Zy = 1, Pl = 2, Qy = 3, e0 = 4, di = 5;
function TF(e, t, n, r, i, o, s, a) {
  var c, u = 0, l = null, f = !1, h = !1, d = r !== -1, m = -1, p = bF(uo(e, 0)) && AF(uo(e, e.length - 1));
  if (t || s)
    for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
      if (u = uo(e, c), !Ro(u))
        return di;
      p = p && jh(u, l, a), l = u;
    }
  else {
    for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
      if (u = uo(e, c), u === Po)
        f = !0, d && (h = h || // Foldable line = too long, and not more-indented.
        c - m - 1 > r && e[m + 1] !== " ", m = c);
      else if (!Ro(u))
        return di;
      p = p && jh(u, l, a), l = u;
    }
    h = h || d && c - m - 1 > r && e[m + 1] !== " ";
  }
  return !f && !h ? p && !s && !i(e) ? Zy : o === Oo ? di : Pl : n > 9 && Xy(e) ? di : s ? o === Oo ? di : Pl : h ? e0 : Qy;
}
function CF(e, t, n, r, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === Oo ? '""' : "''";
    if (!e.noCompatMode && (yF.indexOf(t) !== -1 || vF.test(t)))
      return e.quotingType === Oo ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, n), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), a = r || e.flowLevel > -1 && n >= e.flowLevel;
    function c(u) {
      return SF(e, u);
    }
    switch (TF(
      t,
      a,
      e.indent,
      s,
      c,
      e.quotingType,
      e.forceQuotes && !r,
      i
    )) {
      case Zy:
        return t;
      case Pl:
        return "'" + t.replace(/'/g, "''") + "'";
      case Qy:
        return "|" + Mh(t, e.indent) + Bh(kh(t, o));
      case e0:
        return ">" + Mh(t, e.indent) + Bh(kh(NF(t, s), o));
      case di:
        return '"' + IF(t) + '"';
      default:
        throw new Xo("impossible error: invalid scalar style");
    }
  }();
}
function Mh(e, t) {
  var n = Xy(e) ? String(t) : "", r = e[e.length - 1] === `
`, i = r && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : r ? "" : "-";
  return n + o + `
`;
}
function Bh(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function NF(e, t) {
  for (var n = /(\n+)([^\n]*)/g, r = function() {
    var u = e.indexOf(`
`);
    return u = u !== -1 ? u : e.length, n.lastIndex = u, Hh(e.slice(0, u), t);
  }(), i = e[0] === `
` || e[0] === " ", o, s; s = n.exec(e); ) {
    var a = s[1], c = s[2];
    o = c[0] === " ", r += a + (!i && !o && c !== "" ? `
` : "") + Hh(c, t), i = o;
  }
  return r;
}
function Hh(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var n = / [^ ]/g, r, i = 0, o, s = 0, a = 0, c = ""; r = n.exec(e); )
    a = r.index, a - i > t && (o = s > i ? s : a, c += `
` + e.slice(i, o), i = o + 1), s = a;
  return c += `
`, e.length - i > t && s > i ? c += e.slice(i, s) + `
` + e.slice(s + 1) : c += e.slice(i), c.slice(1);
}
function IF(e) {
  for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++)
    n = uo(e, i), r = $t[n], !r && Ro(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || EF(n);
  return t;
}
function PF(e, t, n) {
  var r = "", i = e.tag, o, s, a;
  for (o = 0, s = n.length; o < s; o += 1)
    a = n[o], e.replacer && (a = e.replacer.call(n, String(o), a)), (kn(e, t, a, !1, !1) || typeof a > "u" && kn(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
  e.tag = i, e.dump = "[" + r + "]";
}
function qh(e, t, n, r) {
  var i = "", o = e.tag, s, a, c;
  for (s = 0, a = n.length; s < a; s += 1)
    c = n[s], e.replacer && (c = e.replacer.call(n, String(s), c)), (kn(e, t + 1, c, !0, !0, !1, !0) || typeof c > "u" && kn(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += Il(e, t)), e.dump && Po === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function OF(e, t, n) {
  var r = "", i = e.tag, o = Object.keys(n), s, a, c, u, l;
  for (s = 0, a = o.length; s < a; s += 1)
    l = "", r !== "" && (l += ", "), e.condenseFlow && (l += '"'), c = o[s], u = n[c], e.replacer && (u = e.replacer.call(n, c, u)), kn(e, t, c, !1, !1) && (e.dump.length > 1024 && (l += "? "), l += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), kn(e, t, u, !1, !1) && (l += e.dump, r += l));
  e.tag = i, e.dump = "{" + r + "}";
}
function RF(e, t, n, r) {
  var i = "", o = e.tag, s = Object.keys(n), a, c, u, l, f, h;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new Xo("sortKeys must be a boolean or a function");
  for (a = 0, c = s.length; a < c; a += 1)
    h = "", (!r || i !== "") && (h += Il(e, t)), u = s[a], l = n[u], e.replacer && (l = e.replacer.call(n, u, l)), kn(e, t + 1, u, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && Po === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, f && (h += Il(e, t)), kn(e, t + 1, l, !0, f) && (e.dump && Po === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = o, e.dump = i || "{}";
}
function zh(e, t, n) {
  var r, i, o, s, a, c;
  for (i = n ? e.explicitTypes : e.implicitTypes, o = 0, s = i.length; o < s; o += 1)
    if (a = i[o], (a.instanceOf || a.predicate) && (!a.instanceOf || typeof t == "object" && t instanceof a.instanceOf) && (!a.predicate || a.predicate(t))) {
      if (n ? a.multi && a.representName ? e.tag = a.representName(t) : e.tag = a.tag : e.tag = "?", a.represent) {
        if (c = e.styleMap[a.tag] || a.defaultStyle, zy.call(a.represent) === "[object Function]")
          r = a.represent(t, c);
        else if (Vy.call(a.represent, c))
          r = a.represent[c](t, c);
        else
          throw new Xo("!<" + a.tag + '> tag resolver accepts not "' + c + '" style');
        e.dump = r;
      }
      return !0;
    }
  return !1;
}
function kn(e, t, n, r, i, o, s) {
  e.tag = null, e.dump = n, zh(e, n, !1) || zh(e, n, !0);
  var a = zy.call(e.dump), c = r, u;
  r && (r = e.flowLevel < 0 || e.flowLevel > t);
  var l = a === "[object Object]" || a === "[object Array]", f, h;
  if (l && (f = e.duplicates.indexOf(n), h = f !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (l && h && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), a === "[object Object]")
      r && Object.keys(e.dump).length !== 0 ? (RF(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (OF(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (a === "[object Array]")
      r && e.dump.length !== 0 ? (e.noArrayIndent && !s && t > 0 ? qh(e, t - 1, e.dump, i) : qh(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (PF(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && CF(e, e.dump, t, o, c);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new Xo("unacceptable kind of an object to dump " + a);
    }
    e.tag !== null && e.tag !== "?" && (u = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? u = "!" + u : u.slice(0, 18) === "tag:yaml.org,2002:" ? u = "!!" + u.slice(18) : u = "!<" + u + ">", e.dump = u + " " + e.dump);
  }
  return !0;
}
function DF(e, t) {
  var n = [], r = [], i, o;
  for (Ol(e, n, r), i = 0, o = r.length; i < o; i += 1)
    t.duplicates.push(n[r[i]]);
  t.usedDuplicates = new Array(o);
}
function Ol(e, t, n) {
  var r, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      n.indexOf(i) === -1 && n.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        Ol(e[i], t, n);
    else
      for (r = Object.keys(e), i = 0, o = r.length; i < o; i += 1)
        Ol(e[r[i]], t, n);
}
function FF(e, t) {
  t = t || {};
  var n = new $F(t);
  n.noRefs || DF(e, n);
  var r = e;
  return n.replacer && (r = n.replacer.call({ "": r }, "", r)), kn(n, 0, r, !0, !0) ? n.dump + `
` : "";
}
qy.dump = FF;
var t0 = cf, LF = qy;
function pf(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
dt.Type = Ft;
dt.Schema = hy;
dt.FAILSAFE_SCHEMA = yy;
dt.JSON_SCHEMA = Sy;
dt.CORE_SCHEMA = by;
dt.DEFAULT_SCHEMA = uf;
dt.load = t0.load;
dt.loadAll = t0.loadAll;
dt.dump = LF.dump;
dt.YAMLException = Yo;
dt.types = {
  binary: Iy,
  float: $y,
  map: gy,
  null: vy,
  pairs: Oy,
  set: Ry,
  timestamp: Cy,
  bool: wy,
  int: Ey,
  merge: Ny,
  omap: Py,
  seq: my,
  str: py
};
dt.safeLoad = pf("safeLoad", "load");
dt.safeLoadAll = pf("safeLoadAll", "loadAll");
dt.safeDump = pf("safeDump", "dump");
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
Ja.Lazy = void 0;
class xF {
  constructor(t) {
    this._value = null, this.creator = t;
  }
  get hasValue() {
    return this.creator == null;
  }
  get value() {
    if (this.creator == null)
      return this._value;
    const t = this.creator();
    return this.value = t, t;
  }
  set value(t) {
    this._value = t, this.creator = null;
  }
}
Ja.Lazy = xF;
var Zo = {}, ma = { exports: {} };
ma.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 1, o = 2, s = 9007199254740991, a = "[object Arguments]", c = "[object Array]", u = "[object AsyncFunction]", l = "[object Boolean]", f = "[object Date]", h = "[object Error]", d = "[object Function]", m = "[object GeneratorFunction]", p = "[object Map]", v = "[object Number]", y = "[object Null]", g = "[object Object]", E = "[object Promise]", S = "[object Proxy]", C = "[object RegExp]", U = "[object Set]", G = "[object String]", z = "[object Symbol]", H = "[object Undefined]", b = "[object WeakMap]", B = "[object ArrayBuffer]", V = "[object DataView]", Z = "[object Float32Array]", F = "[object Float64Array]", x = "[object Int8Array]", W = "[object Int16Array]", q = "[object Int32Array]", Y = "[object Uint8Array]", J = "[object Uint8ClampedArray]", j = "[object Uint16Array]", N = "[object Uint32Array]", R = /[\\^$.*+?()[\]{}|]/g, O = /^\[object .+?Constructor\]$/, $ = /^(?:0|[1-9]\d*)$/, T = {};
  T[Z] = T[F] = T[x] = T[W] = T[q] = T[Y] = T[J] = T[j] = T[N] = !0, T[a] = T[c] = T[B] = T[l] = T[V] = T[f] = T[h] = T[d] = T[p] = T[v] = T[g] = T[C] = T[U] = T[G] = T[b] = !1;
  var M = typeof Nt == "object" && Nt && Nt.Object === Object && Nt, ne = typeof self == "object" && self && self.Object === Object && self, te = M || ne || Function("return this")(), we = t && !t.nodeType && t, ce = we && !0 && e && !e.nodeType && e, De = ce && ce.exports === we, _ = De && M.process, w = function() {
    try {
      return _ && _.binding && _.binding("util");
    } catch {
    }
  }(), k = w && w.isTypedArray;
  function I(A, P) {
    for (var K = -1, ie = A == null ? 0 : A.length, Fe = 0, pe = []; ++K < ie; ) {
      var Ve = A[K];
      P(Ve, K, A) && (pe[Fe++] = Ve);
    }
    return pe;
  }
  function ge(A, P) {
    for (var K = -1, ie = P.length, Fe = A.length; ++K < ie; )
      A[Fe + K] = P[K];
    return A;
  }
  function Ae(A, P) {
    for (var K = -1, ie = A == null ? 0 : A.length; ++K < ie; )
      if (P(A[K], K, A))
        return !0;
    return !1;
  }
  function Te(A, P) {
    for (var K = -1, ie = Array(A); ++K < A; )
      ie[K] = P(K);
    return ie;
  }
  function Ue(A) {
    return function(P) {
      return A(P);
    };
  }
  function Ne(A, P) {
    return A.has(P);
  }
  function tt(A, P) {
    return A == null ? void 0 : A[P];
  }
  function Re(A) {
    var P = -1, K = Array(A.size);
    return A.forEach(function(ie, Fe) {
      K[++P] = [Fe, ie];
    }), K;
  }
  function nt(A, P) {
    return function(K) {
      return A(P(K));
    };
  }
  function pn(A) {
    var P = -1, K = Array(A.size);
    return A.forEach(function(ie) {
      K[++P] = ie;
    }), K;
  }
  var Qt = Array.prototype, Lt = Function.prototype, xt = Object.prototype, Sn = te["__core-js_shared__"], Un = Lt.toString, St = xt.hasOwnProperty, qi = function() {
    var A = /[^.]+$/.exec(Sn && Sn.keys && Sn.keys.IE_PROTO || "");
    return A ? "Symbol(src)_1." + A : "";
  }(), zi = xt.toString, ns = RegExp(
    "^" + Un.call(St).replace(R, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), Vi = De ? te.Buffer : void 0, gr = te.Symbol, Gi = te.Uint8Array, X = xt.propertyIsEnumerable, fe = Qt.splice, $e = gr ? gr.toStringTag : void 0, Ee = Object.getOwnPropertySymbols, xe = Vi ? Vi.isBuffer : void 0, rt = nt(Object.keys, Object), Xe = ei(te, "DataView"), bn = ei(te, "Map"), Qr = ei(te, "Promise"), oc = ei(te, "Set"), sc = ei(te, "WeakMap"), Wi = ei(Object, "create"), m0 = wr(Xe), g0 = wr(bn), y0 = wr(Qr), v0 = wr(oc), w0 = wr(sc), _f = gr ? gr.prototype : void 0, ac = _f ? _f.valueOf : void 0;
  function yr(A) {
    var P = -1, K = A == null ? 0 : A.length;
    for (this.clear(); ++P < K; ) {
      var ie = A[P];
      this.set(ie[0], ie[1]);
    }
  }
  function E0() {
    this.__data__ = Wi ? Wi(null) : {}, this.size = 0;
  }
  function _0(A) {
    var P = this.has(A) && delete this.__data__[A];
    return this.size -= P ? 1 : 0, P;
  }
  function $0(A) {
    var P = this.__data__;
    if (Wi) {
      var K = P[A];
      return K === r ? void 0 : K;
    }
    return St.call(P, A) ? P[A] : void 0;
  }
  function S0(A) {
    var P = this.__data__;
    return Wi ? P[A] !== void 0 : St.call(P, A);
  }
  function b0(A, P) {
    var K = this.__data__;
    return this.size += this.has(A) ? 0 : 1, K[A] = Wi && P === void 0 ? r : P, this;
  }
  yr.prototype.clear = E0, yr.prototype.delete = _0, yr.prototype.get = $0, yr.prototype.has = S0, yr.prototype.set = b0;
  function An(A) {
    var P = -1, K = A == null ? 0 : A.length;
    for (this.clear(); ++P < K; ) {
      var ie = A[P];
      this.set(ie[0], ie[1]);
    }
  }
  function A0() {
    this.__data__ = [], this.size = 0;
  }
  function T0(A) {
    var P = this.__data__, K = is(P, A);
    if (K < 0)
      return !1;
    var ie = P.length - 1;
    return K == ie ? P.pop() : fe.call(P, K, 1), --this.size, !0;
  }
  function C0(A) {
    var P = this.__data__, K = is(P, A);
    return K < 0 ? void 0 : P[K][1];
  }
  function N0(A) {
    return is(this.__data__, A) > -1;
  }
  function I0(A, P) {
    var K = this.__data__, ie = is(K, A);
    return ie < 0 ? (++this.size, K.push([A, P])) : K[ie][1] = P, this;
  }
  An.prototype.clear = A0, An.prototype.delete = T0, An.prototype.get = C0, An.prototype.has = N0, An.prototype.set = I0;
  function vr(A) {
    var P = -1, K = A == null ? 0 : A.length;
    for (this.clear(); ++P < K; ) {
      var ie = A[P];
      this.set(ie[0], ie[1]);
    }
  }
  function P0() {
    this.size = 0, this.__data__ = {
      hash: new yr(),
      map: new (bn || An)(),
      string: new yr()
    };
  }
  function O0(A) {
    var P = os(this, A).delete(A);
    return this.size -= P ? 1 : 0, P;
  }
  function R0(A) {
    return os(this, A).get(A);
  }
  function D0(A) {
    return os(this, A).has(A);
  }
  function F0(A, P) {
    var K = os(this, A), ie = K.size;
    return K.set(A, P), this.size += K.size == ie ? 0 : 1, this;
  }
  vr.prototype.clear = P0, vr.prototype.delete = O0, vr.prototype.get = R0, vr.prototype.has = D0, vr.prototype.set = F0;
  function rs(A) {
    var P = -1, K = A == null ? 0 : A.length;
    for (this.__data__ = new vr(); ++P < K; )
      this.add(A[P]);
  }
  function L0(A) {
    return this.__data__.set(A, r), this;
  }
  function x0(A) {
    return this.__data__.has(A);
  }
  rs.prototype.add = rs.prototype.push = L0, rs.prototype.has = x0;
  function jn(A) {
    var P = this.__data__ = new An(A);
    this.size = P.size;
  }
  function k0() {
    this.__data__ = new An(), this.size = 0;
  }
  function U0(A) {
    var P = this.__data__, K = P.delete(A);
    return this.size = P.size, K;
  }
  function j0(A) {
    return this.__data__.get(A);
  }
  function M0(A) {
    return this.__data__.has(A);
  }
  function B0(A, P) {
    var K = this.__data__;
    if (K instanceof An) {
      var ie = K.__data__;
      if (!bn || ie.length < n - 1)
        return ie.push([A, P]), this.size = ++K.size, this;
      K = this.__data__ = new vr(ie);
    }
    return K.set(A, P), this.size = K.size, this;
  }
  jn.prototype.clear = k0, jn.prototype.delete = U0, jn.prototype.get = j0, jn.prototype.has = M0, jn.prototype.set = B0;
  function H0(A, P) {
    var K = ss(A), ie = !K && rv(A), Fe = !K && !ie && cc(A), pe = !K && !ie && !Fe && Pf(A), Ve = K || ie || Fe || pe, it = Ve ? Te(A.length, String) : [], at = it.length;
    for (var je in A)
      St.call(A, je) && !(Ve && // Safari 9 has enumerable `arguments.length` in strict mode.
      (je == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      Fe && (je == "offset" || je == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      pe && (je == "buffer" || je == "byteLength" || je == "byteOffset") || // Skip index properties.
      Z0(je, at))) && it.push(je);
    return it;
  }
  function is(A, P) {
    for (var K = A.length; K--; )
      if (Tf(A[K][0], P))
        return K;
    return -1;
  }
  function q0(A, P, K) {
    var ie = P(A);
    return ss(A) ? ie : ge(ie, K(A));
  }
  function Ki(A) {
    return A == null ? A === void 0 ? H : y : $e && $e in Object(A) ? Y0(A) : nv(A);
  }
  function $f(A) {
    return Ji(A) && Ki(A) == a;
  }
  function Sf(A, P, K, ie, Fe) {
    return A === P ? !0 : A == null || P == null || !Ji(A) && !Ji(P) ? A !== A && P !== P : z0(A, P, K, ie, Sf, Fe);
  }
  function z0(A, P, K, ie, Fe, pe) {
    var Ve = ss(A), it = ss(P), at = Ve ? c : Mn(A), je = it ? c : Mn(P);
    at = at == a ? g : at, je = je == a ? g : je;
    var Ht = at == g, en = je == g, ht = at == je;
    if (ht && cc(A)) {
      if (!cc(P))
        return !1;
      Ve = !0, Ht = !1;
    }
    if (ht && !Ht)
      return pe || (pe = new jn()), Ve || Pf(A) ? bf(A, P, K, ie, Fe, pe) : K0(A, P, at, K, ie, Fe, pe);
    if (!(K & i)) {
      var Wt = Ht && St.call(A, "__wrapped__"), Kt = en && St.call(P, "__wrapped__");
      if (Wt || Kt) {
        var Bn = Wt ? A.value() : A, Tn = Kt ? P.value() : P;
        return pe || (pe = new jn()), Fe(Bn, Tn, K, ie, pe);
      }
    }
    return ht ? (pe || (pe = new jn()), J0(A, P, K, ie, Fe, pe)) : !1;
  }
  function V0(A) {
    if (!If(A) || ev(A))
      return !1;
    var P = Cf(A) ? ns : O;
    return P.test(wr(A));
  }
  function G0(A) {
    return Ji(A) && Nf(A.length) && !!T[Ki(A)];
  }
  function W0(A) {
    if (!tv(A))
      return rt(A);
    var P = [];
    for (var K in Object(A))
      St.call(A, K) && K != "constructor" && P.push(K);
    return P;
  }
  function bf(A, P, K, ie, Fe, pe) {
    var Ve = K & i, it = A.length, at = P.length;
    if (it != at && !(Ve && at > it))
      return !1;
    var je = pe.get(A);
    if (je && pe.get(P))
      return je == P;
    var Ht = -1, en = !0, ht = K & o ? new rs() : void 0;
    for (pe.set(A, P), pe.set(P, A); ++Ht < it; ) {
      var Wt = A[Ht], Kt = P[Ht];
      if (ie)
        var Bn = Ve ? ie(Kt, Wt, Ht, P, A, pe) : ie(Wt, Kt, Ht, A, P, pe);
      if (Bn !== void 0) {
        if (Bn)
          continue;
        en = !1;
        break;
      }
      if (ht) {
        if (!Ae(P, function(Tn, Er) {
          if (!Ne(ht, Er) && (Wt === Tn || Fe(Wt, Tn, K, ie, pe)))
            return ht.push(Er);
        })) {
          en = !1;
          break;
        }
      } else if (!(Wt === Kt || Fe(Wt, Kt, K, ie, pe))) {
        en = !1;
        break;
      }
    }
    return pe.delete(A), pe.delete(P), en;
  }
  function K0(A, P, K, ie, Fe, pe, Ve) {
    switch (K) {
      case V:
        if (A.byteLength != P.byteLength || A.byteOffset != P.byteOffset)
          return !1;
        A = A.buffer, P = P.buffer;
      case B:
        return !(A.byteLength != P.byteLength || !pe(new Gi(A), new Gi(P)));
      case l:
      case f:
      case v:
        return Tf(+A, +P);
      case h:
        return A.name == P.name && A.message == P.message;
      case C:
      case G:
        return A == P + "";
      case p:
        var it = Re;
      case U:
        var at = ie & i;
        if (it || (it = pn), A.size != P.size && !at)
          return !1;
        var je = Ve.get(A);
        if (je)
          return je == P;
        ie |= o, Ve.set(A, P);
        var Ht = bf(it(A), it(P), ie, Fe, pe, Ve);
        return Ve.delete(A), Ht;
      case z:
        if (ac)
          return ac.call(A) == ac.call(P);
    }
    return !1;
  }
  function J0(A, P, K, ie, Fe, pe) {
    var Ve = K & i, it = Af(A), at = it.length, je = Af(P), Ht = je.length;
    if (at != Ht && !Ve)
      return !1;
    for (var en = at; en--; ) {
      var ht = it[en];
      if (!(Ve ? ht in P : St.call(P, ht)))
        return !1;
    }
    var Wt = pe.get(A);
    if (Wt && pe.get(P))
      return Wt == P;
    var Kt = !0;
    pe.set(A, P), pe.set(P, A);
    for (var Bn = Ve; ++en < at; ) {
      ht = it[en];
      var Tn = A[ht], Er = P[ht];
      if (ie)
        var Of = Ve ? ie(Er, Tn, ht, P, A, pe) : ie(Tn, Er, ht, A, P, pe);
      if (!(Of === void 0 ? Tn === Er || Fe(Tn, Er, K, ie, pe) : Of)) {
        Kt = !1;
        break;
      }
      Bn || (Bn = ht == "constructor");
    }
    if (Kt && !Bn) {
      var as = A.constructor, cs = P.constructor;
      as != cs && "constructor" in A && "constructor" in P && !(typeof as == "function" && as instanceof as && typeof cs == "function" && cs instanceof cs) && (Kt = !1);
    }
    return pe.delete(A), pe.delete(P), Kt;
  }
  function Af(A) {
    return q0(A, sv, X0);
  }
  function os(A, P) {
    var K = A.__data__;
    return Q0(P) ? K[typeof P == "string" ? "string" : "hash"] : K.map;
  }
  function ei(A, P) {
    var K = tt(A, P);
    return V0(K) ? K : void 0;
  }
  function Y0(A) {
    var P = St.call(A, $e), K = A[$e];
    try {
      A[$e] = void 0;
      var ie = !0;
    } catch {
    }
    var Fe = zi.call(A);
    return ie && (P ? A[$e] = K : delete A[$e]), Fe;
  }
  var X0 = Ee ? function(A) {
    return A == null ? [] : (A = Object(A), I(Ee(A), function(P) {
      return X.call(A, P);
    }));
  } : av, Mn = Ki;
  (Xe && Mn(new Xe(new ArrayBuffer(1))) != V || bn && Mn(new bn()) != p || Qr && Mn(Qr.resolve()) != E || oc && Mn(new oc()) != U || sc && Mn(new sc()) != b) && (Mn = function(A) {
    var P = Ki(A), K = P == g ? A.constructor : void 0, ie = K ? wr(K) : "";
    if (ie)
      switch (ie) {
        case m0:
          return V;
        case g0:
          return p;
        case y0:
          return E;
        case v0:
          return U;
        case w0:
          return b;
      }
    return P;
  });
  function Z0(A, P) {
    return P = P ?? s, !!P && (typeof A == "number" || $.test(A)) && A > -1 && A % 1 == 0 && A < P;
  }
  function Q0(A) {
    var P = typeof A;
    return P == "string" || P == "number" || P == "symbol" || P == "boolean" ? A !== "__proto__" : A === null;
  }
  function ev(A) {
    return !!qi && qi in A;
  }
  function tv(A) {
    var P = A && A.constructor, K = typeof P == "function" && P.prototype || xt;
    return A === K;
  }
  function nv(A) {
    return zi.call(A);
  }
  function wr(A) {
    if (A != null) {
      try {
        return Un.call(A);
      } catch {
      }
      try {
        return A + "";
      } catch {
      }
    }
    return "";
  }
  function Tf(A, P) {
    return A === P || A !== A && P !== P;
  }
  var rv = $f(/* @__PURE__ */ function() {
    return arguments;
  }()) ? $f : function(A) {
    return Ji(A) && St.call(A, "callee") && !X.call(A, "callee");
  }, ss = Array.isArray;
  function iv(A) {
    return A != null && Nf(A.length) && !Cf(A);
  }
  var cc = xe || cv;
  function ov(A, P) {
    return Sf(A, P);
  }
  function Cf(A) {
    if (!If(A))
      return !1;
    var P = Ki(A);
    return P == d || P == m || P == u || P == S;
  }
  function Nf(A) {
    return typeof A == "number" && A > -1 && A % 1 == 0 && A <= s;
  }
  function If(A) {
    var P = typeof A;
    return A != null && (P == "object" || P == "function");
  }
  function Ji(A) {
    return A != null && typeof A == "object";
  }
  var Pf = k ? Ue(k) : G0;
  function sv(A) {
    return iv(A) ? H0(A) : W0(A);
  }
  function av() {
    return [];
  }
  function cv() {
    return !1;
  }
  e.exports = ov;
})(ma, ma.exports);
var kF = ma.exports;
Object.defineProperty(Zo, "__esModule", { value: !0 });
Zo.DownloadedUpdateHelper = void 0;
Zo.createTempUpdateFile = HF;
const UF = Oi, jF = L, Vh = kF, Cr = pr, Eo = D;
class MF {
  constructor(t) {
    this.cacheDir = t, this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, this._downloadedFileInfo = null;
  }
  get downloadedFileInfo() {
    return this._downloadedFileInfo;
  }
  get file() {
    return this._file;
  }
  get packageFile() {
    return this._packageFile;
  }
  get cacheDirForPendingUpdate() {
    return Eo.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, n, r, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Vh(this.versionInfo, n) && Vh(this.fileInfo.info, r.info) && await (0, Cr.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(r, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, n, r, i, o, s) {
    this._file = t, this._packageFile = n, this.versionInfo = r, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, s && await (0, Cr.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, Cr.emptyDir)(this.cacheDirForPendingUpdate);
    } catch {
    }
  }
  /**
   * Returns "update-info.json" which is created in the update cache directory's "pending" subfolder after the first update is downloaded.  If the update file does not exist then the cache is cleared and recreated.  If the update file exists then its properties are validated.
   * @param fileInfo
   * @param logger
   */
  async getValidCachedUpdateFile(t, n) {
    const r = this.getUpdateInfoFile();
    if (!await (0, Cr.pathExists)(r))
      return null;
    let o;
    try {
      o = await (0, Cr.readJson)(r);
    } catch (u) {
      let l = "No cached update info available";
      return u.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), l += ` (error on read: ${u.message})`), n.info(l), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return n.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return n.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const a = Eo.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, Cr.pathExists)(a))
      return n.info("Cached update file doesn't exist"), null;
    const c = await BF(a);
    return t.info.sha512 !== c ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, a);
  }
  getUpdateInfoFile() {
    return Eo.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
Zo.DownloadedUpdateHelper = MF;
function BF(e, t = "sha512", n = "base64", r) {
  return new Promise((i, o) => {
    const s = (0, UF.createHash)(t);
    s.on("error", o).setEncoding(n), (0, jF.createReadStream)(e, {
      ...r,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      s.end(), i(s.read());
    }).pipe(s, { end: !1 });
  });
}
async function HF(e, t, n) {
  let r = 0, i = Eo.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, Cr.unlink)(i), i;
    } catch (s) {
      if (s.code === "ENOENT")
        return i;
      n.warn(`Error on remove temp update file: ${s}`), i = Eo.join(t, `${r++}-${e}`);
    }
  return i;
}
var Ya = {}, mf = {};
Object.defineProperty(mf, "__esModule", { value: !0 });
mf.getAppCacheDir = zF;
const Vc = D, qF = va;
function zF() {
  const e = (0, qF.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Vc.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Vc.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Vc.join(e, ".cache"), t;
}
Object.defineProperty(Ya, "__esModule", { value: !0 });
Ya.ElectronAppAdapter = void 0;
const Gh = D, VF = mf;
class GF {
  constructor(t = Fn.app) {
    this.app = t;
  }
  whenReady() {
    return this.app.whenReady();
  }
  get version() {
    return this.app.getVersion();
  }
  get name() {
    return this.app.getName();
  }
  get isPackaged() {
    return this.app.isPackaged === !0;
  }
  get appUpdateConfigPath() {
    return this.isPackaged ? Gh.join(process.resourcesPath, "app-update.yml") : Gh.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, VF.getAppCacheDir)();
  }
  quit() {
    this.app.quit();
  }
  relaunch() {
    this.app.relaunch();
  }
  onQuit(t) {
    this.app.once("quit", (n, r) => t(r));
  }
}
Ya.ElectronAppAdapter = GF;
var n0 = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = n;
  const t = et;
  e.NET_SESSION_NAME = "electron-updater";
  function n() {
    return Fn.session.fromPartition(e.NET_SESSION_NAME, {
      cache: !1
    });
  }
  class r extends t.HttpExecutor {
    constructor(o) {
      super(), this.proxyLoginCallback = o, this.cachedSession = null;
    }
    async download(o, s, a) {
      return await a.cancellationToken.createPromise((c, u, l) => {
        const f = {
          headers: a.headers || void 0,
          redirect: "manual"
        };
        (0, t.configureRequestUrl)(o, f), (0, t.configureRequestOptions)(f), this.doDownload(f, {
          destination: s,
          options: a,
          onCancel: l,
          callback: (h) => {
            h == null ? c(s) : u(h);
          },
          responseHandler: null
        }, 0);
      });
    }
    createRequest(o, s) {
      o.headers && o.headers.Host && (o.host = o.headers.Host, delete o.headers.Host), this.cachedSession == null && (this.cachedSession = n());
      const a = Fn.net.request({
        ...o,
        session: this.cachedSession
      });
      return a.on("response", s), this.proxyLoginCallback != null && a.on("login", this.proxyLoginCallback), a;
    }
    addRedirectHandlers(o, s, a, c, u) {
      o.on("redirect", (l, f, h) => {
        o.abort(), c > this.maxRedirects ? a(this.createMaxRedirectError()) : u(t.HttpExecutor.prepareRedirectUrlOptions(h, s));
      });
    }
  }
  e.ElectronHttpExecutor = r;
})(n0);
var Qo = {}, hn = {};
Object.defineProperty(hn, "__esModule", { value: !0 });
hn.newBaseUrl = WF;
hn.newUrlFromBase = KF;
hn.getChannelFilename = JF;
const r0 = hr;
function WF(e) {
  const t = new r0.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function KF(e, t, n = !1) {
  const r = new r0.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? r.search = i : n && (r.search = `noCache=${Date.now().toString(32)}`), r;
}
function JF(e) {
  return `${e}.yml`;
}
var Ye = {}, YF = "[object Symbol]", i0 = /[\\^$.*+?()[\]{}|]/g, XF = RegExp(i0.source), ZF = typeof Nt == "object" && Nt && Nt.Object === Object && Nt, QF = typeof self == "object" && self && self.Object === Object && self, eL = ZF || QF || Function("return this")(), tL = Object.prototype, nL = tL.toString, Wh = eL.Symbol, Kh = Wh ? Wh.prototype : void 0, Jh = Kh ? Kh.toString : void 0;
function rL(e) {
  if (typeof e == "string")
    return e;
  if (oL(e))
    return Jh ? Jh.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function iL(e) {
  return !!e && typeof e == "object";
}
function oL(e) {
  return typeof e == "symbol" || iL(e) && nL.call(e) == YF;
}
function sL(e) {
  return e == null ? "" : rL(e);
}
function aL(e) {
  return e = sL(e), e && XF.test(e) ? e.replace(i0, "\\$&") : e;
}
var o0 = aL;
Object.defineProperty(Ye, "__esModule", { value: !0 });
Ye.Provider = void 0;
Ye.findFile = dL;
Ye.parseUpdateInfo = hL;
Ye.getFileList = s0;
Ye.resolveFiles = pL;
const fr = et, cL = dt, lL = hr, ga = hn, uL = o0;
class fL {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, n, r, i = null) {
    const o = (0, ga.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, ga.newUrlFromBase)(`${t.pathname.replace(new RegExp(uL(r), "g"), n)}.blockmap`, i ? new lL.URL(i) : t), o];
  }
  get isUseMultipleRangeRequest() {
    return this.runtimeOptions.isUseMultipleRangeRequest !== !1;
  }
  getChannelFilePrefix() {
    if (this.runtimeOptions.platform === "linux") {
      const t = process.env.TEST_UPDATER_ARCH || process.arch;
      return "-linux" + (t === "x64" ? "" : `-${t}`);
    } else
      return this.runtimeOptions.platform === "darwin" ? "-mac" : "";
  }
  // due to historical reasons for windows we use channel name without platform specifier
  getDefaultChannelName() {
    return this.getCustomChannelName("latest");
  }
  getCustomChannelName(t) {
    return `${t}${this.getChannelFilePrefix()}`;
  }
  get fileExtraDownloadHeaders() {
    return null;
  }
  setRequestHeaders(t) {
    this.requestHeaders = t;
  }
  /**
   * Method to perform API request only to resolve update info, but not to download update.
   */
  httpRequest(t, n, r) {
    return this.executor.request(this.createRequestOptions(t, n), r);
  }
  createRequestOptions(t, n) {
    const r = {};
    return this.requestHeaders == null ? n != null && (r.headers = n) : r.headers = n == null ? this.requestHeaders : { ...this.requestHeaders, ...n }, (0, fr.configureRequestUrl)(t, r), r;
  }
}
Ye.Provider = fL;
function dL(e, t, n) {
  var r;
  if (e.length === 0)
    throw (0, fr.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((s) => s.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), o = (r = i.find((s) => [s.url.pathname, s.info.url].some((a) => a.includes(process.arch)))) !== null && r !== void 0 ? r : i.shift();
  return o || (n == null ? e[0] : e.find((s) => !n.some((a) => s.url.pathname.toLowerCase().endsWith(`.${a.toLowerCase()}`))));
}
function hL(e, t, n) {
  if (e == null)
    throw (0, fr.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let r;
  try {
    r = (0, cL.load)(e);
  } catch (i) {
    throw (0, fr.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return r;
}
function s0(e) {
  const t = e.files;
  if (t != null && t.length > 0)
    return t;
  if (e.path != null)
    return [
      {
        url: e.path,
        sha2: e.sha2,
        sha512: e.sha512
      }
    ];
  throw (0, fr.newError)(`No files provided: ${(0, fr.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function pL(e, t, n = (r) => r) {
  const i = s0(e).map((a) => {
    if (a.sha2 == null && a.sha512 == null)
      throw (0, fr.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, fr.safeStringifyJson)(a)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, ga.newUrlFromBase)(n(a.url), t),
      info: a
    };
  }), o = e.packages, s = o == null ? null : o[process.arch] || o.ia32;
  return s != null && (i[0].packageInfo = {
    ...s,
    path: (0, ga.newUrlFromBase)(n(s.path), t).href
  }), i;
}
Object.defineProperty(Qo, "__esModule", { value: !0 });
Qo.GenericProvider = void 0;
const Yh = et, Gc = hn, Wc = Ye;
class mL extends Wc.Provider {
  constructor(t, n, r) {
    super(r), this.configuration = t, this.updater = n, this.baseUrl = (0, Gc.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, Gc.getChannelFilename)(this.channel), n = (0, Gc.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let r = 0; ; r++)
      try {
        return (0, Wc.parseUpdateInfo)(await this.httpRequest(n), t, n);
      } catch (i) {
        if (i instanceof Yh.HttpError && i.statusCode === 404)
          throw (0, Yh.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        if (i.code === "ECONNREFUSED" && r < 3) {
          await new Promise((o, s) => {
            try {
              setTimeout(o, 1e3 * r);
            } catch (a) {
              s(a);
            }
          });
          continue;
        }
        throw i;
      }
  }
  resolveFiles(t) {
    return (0, Wc.resolveFiles)(t, this.baseUrl);
  }
}
Qo.GenericProvider = mL;
var Xa = {}, Za = {};
Object.defineProperty(Za, "__esModule", { value: !0 });
Za.BitbucketProvider = void 0;
const Xh = et, Kc = hn, Jc = Ye;
class gL extends Jc.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, Kc.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new Xh.CancellationToken(), n = (0, Kc.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, Kc.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, void 0, t);
      return (0, Jc.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, Xh.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Jc.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: n } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${n}, channel: ${this.channel})`;
  }
}
Za.BitbucketProvider = gL;
var dr = {};
Object.defineProperty(dr, "__esModule", { value: !0 });
dr.GitHubProvider = dr.BaseGitHubProvider = void 0;
dr.computeReleaseNotes = c0;
const On = et, xr = Gu, yL = hr, wi = hn, Rl = Ye, Yc = /\/tag\/([^/]+)$/;
class a0 extends Rl.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, wi.newBaseUrl)((0, On.githubUrl)(t, n));
    const i = n === "github.com" ? "api.github.com" : n;
    this.baseApiUrl = (0, wi.newBaseUrl)((0, On.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const n = this.options.host;
    return n && !["github.com", "api.github.com"].includes(n) ? `/api/v3${t}` : t;
  }
}
dr.BaseGitHubProvider = a0;
class vL extends a0 {
  constructor(t, n, r) {
    super(t, "github.com", r), this.options = t, this.updater = n;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, n, r, i, o;
    const s = new On.CancellationToken(), a = await this.httpRequest((0, wi.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, s), c = (0, On.parseXml)(a);
    let u = c.element("entry", !1, "No published versions on GitHub"), l = null;
    try {
      if (this.updater.allowPrerelease) {
        const v = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((n = xr.prerelease(this.updater.currentVersion)) === null || n === void 0 ? void 0 : n[0]) || null;
        if (v === null)
          l = Yc.exec(u.element("link").attribute("href"))[1];
        else
          for (const y of c.getElements("entry")) {
            const g = Yc.exec(y.element("link").attribute("href"));
            if (g === null)
              continue;
            const E = g[1], S = ((r = xr.prerelease(E)) === null || r === void 0 ? void 0 : r[0]) || null, C = !v || ["alpha", "beta"].includes(v), U = S !== null && !["alpha", "beta"].includes(String(S));
            if (C && !U && !(v === "beta" && S === "alpha")) {
              l = E;
              break;
            }
            if (S && S === v) {
              l = E;
              break;
            }
          }
      } else {
        l = await this.getLatestTagName(s);
        for (const v of c.getElements("entry"))
          if (Yc.exec(v.element("link").attribute("href"))[1] === l) {
            u = v;
            break;
          }
      }
    } catch (v) {
      throw (0, On.newError)(`Cannot parse releases feed: ${v.stack || v.message},
XML:
${a}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (l == null)
      throw (0, On.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, h = "", d = "";
    const m = async (v) => {
      h = (0, wi.getChannelFilename)(v), d = (0, wi.newUrlFromBase)(this.getBaseDownloadPath(String(l), h), this.baseUrl);
      const y = this.createRequestOptions(d);
      try {
        return await this.executor.request(y, s);
      } catch (g) {
        throw g instanceof On.HttpError && g.statusCode === 404 ? (0, On.newError)(`Cannot find ${h} in the latest release artifacts (${d}): ${g.stack || g.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : g;
      }
    };
    try {
      let v = this.channel;
      this.updater.allowPrerelease && (!((i = xr.prerelease(l)) === null || i === void 0) && i[0]) && (v = this.getCustomChannelName(String((o = xr.prerelease(l)) === null || o === void 0 ? void 0 : o[0]))), f = await m(v);
    } catch (v) {
      if (this.updater.allowPrerelease)
        f = await m(this.getDefaultChannelName());
      else
        throw v;
    }
    const p = (0, Rl.parseUpdateInfo)(f, h, d);
    return p.releaseName == null && (p.releaseName = u.elementValueOrEmpty("title")), p.releaseNotes == null && (p.releaseNotes = c0(this.updater.currentVersion, this.updater.fullChangelog, c, u)), {
      tag: l,
      ...p
    };
  }
  async getLatestTagName(t) {
    const n = this.options, r = n.host == null || n.host === "github.com" ? (0, wi.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new yL.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(r, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, On.newError)(`Unable to find latest version on GitHub (${r}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, Rl.resolveFiles)(t, this.baseUrl, (n) => this.getBaseDownloadPath(t.tag, n.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, n) {
    return `${this.basePath}/download/${t}/${n}`;
  }
}
dr.GitHubProvider = vL;
function Zh(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function c0(e, t, n, r) {
  if (!t)
    return Zh(r);
  const i = [];
  for (const o of n.getElements("entry")) {
    const s = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    xr.valid(s) && xr.lt(e, s) && i.push({
      version: s,
      note: Zh(o)
    });
  }
  return i.sort((o, s) => xr.rcompare(o.version, s.version));
}
var Qa = {};
Object.defineProperty(Qa, "__esModule", { value: !0 });
Qa.GitLabProvider = void 0;
const bt = et, Xc = hr, wL = o0, Ds = hn, Zc = Ye;
class EL extends Zc.Provider {
  /**
   * Normalizes filenames by replacing spaces and underscores with dashes.
   *
   * This is a workaround to handle filename formatting differences between tools:
   * - electron-builder formats filenames like "test file.txt" as "test-file.txt"
   * - GitLab may provide asset URLs using underscores, such as "test_file.txt"
   *
   * Because of this mismatch, we can't reliably extract the correct filename from
   * the asset path without normalization. This function ensures consistent matching
   * across different filename formats by converting all spaces and underscores to dashes.
   *
   * @param filename The filename to normalize
   * @returns The normalized filename with spaces and underscores replaced by dashes
   */
  normalizeFilename(t) {
    return t.replace(/ |_/g, "-");
  }
  constructor(t, n, r) {
    super({
      ...r,
      // GitLab might not support multiple range requests efficiently
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.updater = n, this.cachedLatestVersion = null;
    const o = t.host || "gitlab.com";
    this.baseApiUrl = (0, Ds.newBaseUrl)(`https://${o}/api/v4`);
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = new bt.CancellationToken(), n = (0, Ds.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
    let r;
    try {
      const h = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, d = await this.httpRequest(n, h, t);
      if (!d)
        throw (0, bt.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      r = JSON.parse(d);
    } catch (h) {
      throw (0, bt.newError)(`Unable to find latest release on GitLab (${n}): ${h.stack || h.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    const i = r.tag_name;
    let o = null, s = "", a = null;
    const c = async (h) => {
      s = (0, Ds.getChannelFilename)(h);
      const d = r.assets.links.find((p) => p.name === s);
      if (!d)
        throw (0, bt.newError)(`Cannot find ${s} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      a = new Xc.URL(d.direct_asset_url);
      const m = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
      try {
        const p = await this.httpRequest(a, m, t);
        if (!p)
          throw (0, bt.newError)(`Empty response from ${a}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return p;
      } catch (p) {
        throw p instanceof bt.HttpError && p.statusCode === 404 ? (0, bt.newError)(`Cannot find ${s} in the latest release artifacts (${a}): ${p.stack || p.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : p;
      }
    };
    try {
      o = await c(this.channel);
    } catch (h) {
      if (this.channel !== this.getDefaultChannelName())
        o = await c(this.getDefaultChannelName());
      else
        throw h;
    }
    if (!o)
      throw (0, bt.newError)(`Unable to parse channel data from ${s}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const u = (0, Zc.parseUpdateInfo)(o, s, a);
    u.releaseName == null && (u.releaseName = r.name), u.releaseNotes == null && (u.releaseNotes = r.description || null);
    const l = /* @__PURE__ */ new Map();
    for (const h of r.assets.links)
      l.set(this.normalizeFilename(h.name), h.direct_asset_url);
    const f = {
      tag: i,
      assets: l,
      ...u
    };
    return this.cachedLatestVersion = f, f;
  }
  /**
   * Utility function to convert GitlabReleaseAsset to Map<string, string>
   * Maps asset names to their download URLs
   */
  convertAssetsToMap(t) {
    const n = /* @__PURE__ */ new Map();
    for (const r of t.links)
      n.set(this.normalizeFilename(r.name), r.direct_asset_url);
    return n;
  }
  /**
   * Find blockmap file URL in assets map for a specific filename
   */
  findBlockMapInAssets(t, n) {
    const r = [`${n}.blockmap`, `${this.normalizeFilename(n)}.blockmap`];
    for (const i of r) {
      const o = t.get(i);
      if (o)
        return new Xc.URL(o);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const n = new bt.CancellationToken(), r = [`v${t}`, t];
    for (const i of r) {
      const o = (0, Ds.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const s = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, a = await this.httpRequest(o, s, n);
        if (a)
          return JSON.parse(a);
      } catch (s) {
        if (s instanceof bt.HttpError && s.statusCode === 404)
          continue;
        throw (0, bt.newError)(`Unable to find release ${i} on GitLab (${o}): ${s.stack || s.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, bt.newError)(`Unable to find release with version ${t} (tried: ${r.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
  }
  setAuthHeaderForToken(t) {
    const n = {};
    return t != null && (t.startsWith("Bearer") ? n.authorization = t : n["PRIVATE-TOKEN"] = t), n;
  }
  /**
   * Get version info for blockmap files, using cache when possible
   */
  async getVersionInfoForBlockMap(t) {
    if (this.cachedLatestVersion && this.cachedLatestVersion.version === t)
      return this.cachedLatestVersion.assets;
    const n = await this.fetchReleaseInfoByVersion(t);
    return n && n.assets ? this.convertAssetsToMap(n.assets) : null;
  }
  /**
   * Find blockmap URLs from version assets
   */
  async findBlockMapUrlsFromAssets(t, n, r) {
    let i = null, o = null;
    const s = await this.getVersionInfoForBlockMap(n);
    s && (i = this.findBlockMapInAssets(s, r));
    const a = await this.getVersionInfoForBlockMap(t);
    if (a) {
      const c = r.replace(new RegExp(wL(n), "g"), t);
      o = this.findBlockMapInAssets(a, c);
    }
    return [o, i];
  }
  async getBlockMapFiles(t, n, r, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const o = t.pathname.split("/").pop() || "", [s, a] = await this.findBlockMapUrlsFromAssets(n, r, o);
      if (!a)
        throw (0, bt.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!s)
        throw (0, bt.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [s, a];
    } else
      return super.getBlockMapFiles(t, n, r, i);
  }
  resolveFiles(t) {
    return (0, Zc.getFileList)(t).map((n) => {
      const i = [
        n.url,
        // Original filename
        this.normalizeFilename(n.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((s) => t.assets.has(s)), o = i ? t.assets.get(i) : void 0;
      if (!o)
        throw (0, bt.newError)(`Cannot find asset "${n.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Xc.URL(o),
        info: n
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
Qa.GitLabProvider = EL;
var ec = {};
Object.defineProperty(ec, "__esModule", { value: !0 });
ec.KeygenProvider = void 0;
const Qh = et, Qc = hn, el = Ye;
class _L extends el.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, Qc.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Qh.CancellationToken(), n = (0, Qc.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, Qc.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, el.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, Qh.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, el.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: n, platform: r } = this.configuration;
    return `Keygen (account: ${t}, product: ${n}, platform: ${r}, channel: ${this.channel})`;
  }
}
ec.KeygenProvider = _L;
var tc = {};
Object.defineProperty(tc, "__esModule", { value: !0 });
tc.PrivateGitHubProvider = void 0;
const ai = et, $L = dt, SL = D, ep = hr, tp = hn, bL = dr, AL = Ye;
class TL extends bL.BaseGitHubProvider {
  constructor(t, n, r, i) {
    super(t, "api.github.com", i), this.updater = n, this.token = r;
  }
  createRequestOptions(t, n) {
    const r = super.createRequestOptions(t, n);
    return r.redirect = "manual", r;
  }
  async getLatestVersion() {
    const t = new ai.CancellationToken(), n = (0, tp.getChannelFilename)(this.getDefaultChannelName()), r = await this.getLatestVersionInfo(t), i = r.assets.find((a) => a.name === n);
    if (i == null)
      throw (0, ai.newError)(`Cannot find ${n} in the release ${r.html_url || r.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new ep.URL(i.url);
    let s;
    try {
      s = (0, $L.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (a) {
      throw a instanceof ai.HttpError && a.statusCode === 404 ? (0, ai.newError)(`Cannot find ${n} in the latest release artifacts (${o}): ${a.stack || a.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : a;
    }
    return s.assets = r.assets, s;
  }
  get fileExtraDownloadHeaders() {
    return this.configureHeaders("application/octet-stream");
  }
  configureHeaders(t) {
    return {
      accept: t,
      authorization: `token ${this.token}`
    };
  }
  async getLatestVersionInfo(t) {
    const n = this.updater.allowPrerelease;
    let r = this.basePath;
    n || (r = `${r}/latest`);
    const i = (0, tp.newUrlFromBase)(r, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return n ? o.find((s) => s.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, ai.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, AL.getFileList)(t).map((n) => {
      const r = SL.posix.basename(n.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === r);
      if (i == null)
        throw (0, ai.newError)(`Cannot find asset "${r}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new ep.URL(i.url),
        info: n
      };
    });
  }
}
tc.PrivateGitHubProvider = TL;
Object.defineProperty(Xa, "__esModule", { value: !0 });
Xa.isUrlProbablySupportMultiRangeRequests = l0;
Xa.createClient = RL;
const Fs = et, CL = Za, np = Qo, NL = dr, IL = Qa, PL = ec, OL = tc;
function l0(e) {
  return !e.includes("s3.amazonaws.com");
}
function RL(e, t, n) {
  if (typeof e == "string")
    throw (0, Fs.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const r = e.provider;
  switch (r) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new NL.GitHubProvider(i, t, n) : new OL.PrivateGitHubProvider(i, t, o, n);
    }
    case "bitbucket":
      return new CL.BitbucketProvider(e, t, n);
    case "gitlab":
      return new IL.GitLabProvider(e, t, n);
    case "keygen":
      return new PL.KeygenProvider(e, t, n);
    case "s3":
    case "spaces":
      return new np.GenericProvider({
        provider: "generic",
        url: (0, Fs.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...n,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new np.GenericProvider(i, t, {
        ...n,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && l0(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, Fs.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, n);
    }
    default:
      throw (0, Fs.newError)(`Unsupported provider: ${r}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var nc = {}, es = {}, Bi = {}, Zr = {};
Object.defineProperty(Zr, "__esModule", { value: !0 });
Zr.OperationKind = void 0;
Zr.computeOperations = DL;
var kr;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(kr || (Zr.OperationKind = kr = {}));
function DL(e, t, n) {
  const r = ip(e.files), i = ip(t.files);
  let o = null;
  const s = t.files[0], a = [], c = s.name, u = r.get(c);
  if (u == null)
    throw new Error(`no file ${c} in old blockmap`);
  const l = i.get(c);
  let f = 0;
  const { checksumToOffset: h, checksumToOldSize: d } = LL(r.get(c), u.offset, n);
  let m = s.offset;
  for (let p = 0; p < l.checksums.length; m += l.sizes[p], p++) {
    const v = l.sizes[p], y = l.checksums[p];
    let g = h.get(y);
    g != null && d.get(y) !== v && (n.warn(`Checksum ("${y}") matches, but size differs (old: ${d.get(y)}, new: ${v})`), g = void 0), g === void 0 ? (f++, o != null && o.kind === kr.DOWNLOAD && o.end === m ? o.end += v : (o = {
      kind: kr.DOWNLOAD,
      start: m,
      end: m + v
      // oldBlocks: null,
    }, rp(o, a, y, p))) : o != null && o.kind === kr.COPY && o.end === g ? o.end += v : (o = {
      kind: kr.COPY,
      start: g,
      end: g + v
      // oldBlocks: [checksum]
    }, rp(o, a, y, p));
  }
  return f > 0 && n.info(`File${s.name === "file" ? "" : " " + s.name} has ${f} changed blocks`), a;
}
const FL = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function rp(e, t, n, r) {
  if (FL && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((s, a) => s < a ? s : a);
      throw new Error(`operation (block index: ${r}, checksum: ${n}, kind: ${kr[e.kind]}) overlaps previous operation (checksum: ${n}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function LL(e, t, n) {
  const r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
  let o = t;
  for (let s = 0; s < e.checksums.length; s++) {
    const a = e.checksums[s], c = e.sizes[s], u = i.get(a);
    if (u === void 0)
      r.set(a, o), i.set(a, c);
    else if (n.debug != null) {
      const l = u === c ? "(same size)" : `(size: ${u}, this size: ${c})`;
      n.debug(`${a} duplicated in blockmap ${l}, it doesn't lead to broken differential downloader, just corresponding block will be skipped)`);
    }
    o += c;
  }
  return { checksumToOffset: r, checksumToOldSize: i };
}
function ip(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    t.set(n.name, n);
  return t;
}
Object.defineProperty(Bi, "__esModule", { value: !0 });
Bi.DataSplitter = void 0;
Bi.copyData = u0;
const Ls = et, xL = L, kL = Mo, UL = Zr, op = Buffer.from(`\r
\r
`);
var Zn;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(Zn || (Zn = {}));
function u0(e, t, n, r, i) {
  const o = (0, xL.createReadStream)("", {
    fd: n,
    autoClose: !1,
    start: e.start,
    // end is inclusive
    end: e.end - 1
  });
  o.on("error", r), o.once("end", i), o.pipe(t, {
    end: !1
  });
}
class jL extends kL.Writable {
  constructor(t, n, r, i, o, s, a, c) {
    super(), this.out = t, this.options = n, this.partIndexToTaskIndex = r, this.partIndexToLength = o, this.finishHandler = s, this.grandTotalBytes = a, this.onProgress = c, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = Zn.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
  }
  get isFinished() {
    return this.partIndex === this.partIndexToLength.length;
  }
  // noinspection JSUnusedGlobalSymbols
  _write(t, n, r) {
    if (this.isFinished) {
      console.error(`Trailing ignored data: ${t.length} bytes`);
      return;
    }
    this.handleData(t).then(() => {
      if (this.onProgress) {
        const i = Date.now();
        (i >= this.nextUpdate || this.transferred === this.grandTotalBytes) && this.grandTotalBytes && (i - this.start) / 1e3 && (this.nextUpdate = i + 1e3, this.onProgress({
          total: this.grandTotalBytes,
          delta: this.delta,
          transferred: this.transferred,
          percent: this.transferred / this.grandTotalBytes * 100,
          bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
        }), this.delta = 0);
      }
      r();
    }).catch(r);
  }
  async handleData(t) {
    let n = 0;
    if (this.ignoreByteCount !== 0 && this.remainingPartDataCount !== 0)
      throw (0, Ls.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const r = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= r, n = r;
    } else if (this.remainingPartDataCount > 0) {
      const r = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= r, await this.processPartData(t, 0, r), n = r;
    }
    if (n !== t.length) {
      if (this.readState === Zn.HEADER) {
        const r = this.searchHeaderListEnd(t, n);
        if (r === -1)
          return;
        n = r, this.readState = Zn.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === Zn.BODY)
          this.readState = Zn.INIT;
        else {
          this.partIndex++;
          let s = this.partIndexToTaskIndex.get(this.partIndex);
          if (s == null)
            if (this.isFinished)
              s = this.options.end;
            else
              throw (0, Ls.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const a = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (a < s)
            await this.copyExistingData(a, s);
          else if (a > s)
            throw (0, Ls.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (n = this.searchHeaderListEnd(t, n), n === -1) {
            this.readState = Zn.HEADER;
            return;
          }
        }
        const r = this.partIndexToLength[this.partIndex], i = n + r, o = Math.min(i, t.length);
        if (await this.processPartStarted(t, n, o), this.remainingPartDataCount = r - (o - n), this.remainingPartDataCount > 0)
          return;
        if (n = i + this.boundaryLength, n >= t.length) {
          this.ignoreByteCount = this.boundaryLength - (t.length - i);
          return;
        }
      }
    }
  }
  copyExistingData(t, n) {
    return new Promise((r, i) => {
      const o = () => {
        if (t === n) {
          r();
          return;
        }
        const s = this.options.tasks[t];
        if (s.kind !== UL.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        u0(s, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, n) {
    const r = t.indexOf(op, n);
    if (r !== -1)
      return r + op.length;
    const i = n === 0 ? t : t.slice(n);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Ls.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
    this.actualPartLength = 0;
  }
  processPartStarted(t, n, r) {
    return this.partIndex !== 0 && this.onPartEnd(), this.processPartData(t, n, r);
  }
  processPartData(t, n, r) {
    this.actualPartLength += r - n, this.transferred += r - n, this.delta += r - n;
    const i = this.out;
    return i.write(n === 0 && t.length === r ? t : t.slice(n, r)) ? Promise.resolve() : new Promise((o, s) => {
      i.on("error", s), i.once("drain", () => {
        i.removeListener("error", s), o();
      });
    });
  }
}
Bi.DataSplitter = jL;
var rc = {};
Object.defineProperty(rc, "__esModule", { value: !0 });
rc.executeTasksUsingMultipleRangeRequests = ML;
rc.checkIsRangesSupported = Fl;
const Dl = et, sp = Bi, ap = Zr;
function ML(e, t, n, r, i) {
  const o = (s) => {
    if (s >= t.length) {
      e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
      return;
    }
    const a = s + 1e3;
    BL(e, {
      tasks: t,
      start: s,
      end: Math.min(t.length, a),
      oldFileFd: r
    }, n, () => o(a), i);
  };
  return o;
}
function BL(e, t, n, r, i) {
  let o = "bytes=", s = 0, a = 0;
  const c = /* @__PURE__ */ new Map(), u = [];
  for (let h = t.start; h < t.end; h++) {
    const d = t.tasks[h];
    d.kind === ap.OperationKind.DOWNLOAD && (o += `${d.start}-${d.end - 1}, `, c.set(s, h), s++, u.push(d.end - d.start), a += d.end - d.start);
  }
  if (s <= 1) {
    const h = (d) => {
      if (d >= t.end) {
        r();
        return;
      }
      const m = t.tasks[d++];
      if (m.kind === ap.OperationKind.COPY)
        (0, sp.copyData)(m, n, t.oldFileFd, i, () => h(d));
      else {
        const p = e.createRequestOptions();
        p.headers.Range = `bytes=${m.start}-${m.end - 1}`;
        const v = e.httpExecutor.createRequest(p, (y) => {
          y.on("error", i), Fl(y, i) && (y.pipe(n, {
            end: !1
          }), y.once("end", () => h(d)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(v, i), v.end();
      }
    };
    h(t.start);
    return;
  }
  const l = e.createRequestOptions();
  l.headers.Range = o.substring(0, o.length - 2);
  const f = e.httpExecutor.createRequest(l, (h) => {
    if (!Fl(h, i))
      return;
    const d = (0, Dl.safeGetHeader)(h, "content-type"), m = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(d);
    if (m == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${d}"`));
      return;
    }
    const p = new sp.DataSplitter(n, t, c, m[1] || m[2], u, r, a, e.options.onProgress);
    p.on("error", i), h.pipe(p), h.on("end", () => {
      setTimeout(() => {
        f.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(f, i), f.end();
}
function Fl(e, t) {
  if (e.statusCode >= 400)
    return t((0, Dl.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const n = (0, Dl.safeGetHeader)(e, "accept-ranges");
    if (n == null || n === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var ic = {};
Object.defineProperty(ic, "__esModule", { value: !0 });
ic.ProgressDifferentialDownloadCallbackTransform = void 0;
const HL = Mo;
var Ei;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Ei || (Ei = {}));
class qL extends HL.Transform {
  constructor(t, n, r) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = Ei.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == Ei.COPY) {
      r(null, t);
      return;
    }
    this.transferred += t.length, this.delta += t.length;
    const i = Date.now();
    i >= this.nextUpdate && this.transferred !== this.expectedBytes && this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && (this.nextUpdate = i + 1e3, this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((i - this.start) / 1e3))
    }), this.delta = 0), r(null, t);
  }
  beginFileCopy() {
    this.operationType = Ei.COPY;
  }
  beginRangeDownload() {
    this.operationType = Ei.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
  }
  endRangeDownload() {
    this.transferred !== this.progressDifferentialDownloadInfo.grandTotal && this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: this.transferred / this.progressDifferentialDownloadInfo.grandTotal * 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    });
  }
  // Called when we are 100% done with the connection/download
  _flush(t) {
    if (this.cancellationToken.cancelled) {
      t(new Error("cancelled"));
      return;
    }
    this.onProgress({
      total: this.progressDifferentialDownloadInfo.grandTotal,
      delta: this.delta,
      transferred: this.transferred,
      percent: 100,
      bytesPerSecond: Math.round(this.transferred / ((Date.now() - this.start) / 1e3))
    }), this.delta = 0, this.transferred = 0, t(null);
  }
}
ic.ProgressDifferentialDownloadCallbackTransform = qL;
Object.defineProperty(es, "__esModule", { value: !0 });
es.DifferentialDownloader = void 0;
const io = et, tl = pr, zL = L, VL = Bi, GL = hr, xs = Zr, cp = rc, WL = ic;
class KL {
  // noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
  constructor(t, n, r) {
    this.blockAwareFileInfo = t, this.httpExecutor = n, this.options = r, this.fileMetadataBuffer = null, this.logger = r.logger;
  }
  createRequestOptions() {
    const t = {
      headers: {
        ...this.options.requestHeaders,
        accept: "*/*"
      }
    };
    return (0, io.configureRequestUrl)(this.options.newUrl, t), (0, io.configureRequestOptions)(t), t;
  }
  doDownload(t, n) {
    if (t.version !== n.version)
      throw new Error(`version is different (${t.version} - ${n.version}), full download is required`);
    const r = this.logger, i = (0, xs.computeOperations)(t, n, r);
    r.debug != null && r.debug(JSON.stringify(i, null, 2));
    let o = 0, s = 0;
    for (const c of i) {
      const u = c.end - c.start;
      c.kind === xs.OperationKind.DOWNLOAD ? o += u : s += u;
    }
    const a = this.blockAwareFileInfo.size;
    if (o + s + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== a)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${s}, newSize: ${a}`);
    return r.info(`Full: ${lp(a)}, To download: ${lp(o)} (${Math.round(o / (a / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const n = [], r = () => Promise.all(n.map((i) => (0, tl.close)(i.descriptor).catch((o) => {
      this.logger.error(`cannot close file "${i.path}": ${o}`);
    })));
    return this.doDownloadFile(t, n).then(r).catch((i) => r().catch((o) => {
      try {
        this.logger.error(`cannot close files: ${o}`);
      } catch (s) {
        try {
          console.error(s);
        } catch {
        }
      }
      throw i;
    }).then(() => {
      throw i;
    }));
  }
  async doDownloadFile(t, n) {
    const r = await (0, tl.open)(this.options.oldFile, "r");
    n.push({ descriptor: r, path: this.options.oldFile });
    const i = await (0, tl.open)(this.options.newFile, "w");
    n.push({ descriptor: i, path: this.options.newFile });
    const o = (0, zL.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((s, a) => {
      const c = [];
      let u;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const y = [];
        let g = 0;
        for (const S of t)
          S.kind === xs.OperationKind.DOWNLOAD && (y.push(S.end - S.start), g += S.end - S.start);
        const E = {
          expectedByteCounts: y,
          grandTotal: g
        };
        u = new WL.ProgressDifferentialDownloadCallbackTransform(E, this.options.cancellationToken, this.options.onProgress), c.push(u);
      }
      const l = new io.DigestTransform(this.blockAwareFileInfo.sha512);
      l.isValidateOnEnd = !1, c.push(l), o.on("finish", () => {
        o.close(() => {
          n.splice(1, 1);
          try {
            l.validate();
          } catch (y) {
            a(y);
            return;
          }
          s(void 0);
        });
      }), c.push(o);
      let f = null;
      for (const y of c)
        y.on("error", a), f == null ? f = y : f = f.pipe(y);
      const h = c[0];
      let d;
      if (this.options.isUseMultipleRangeRequest) {
        d = (0, cp.executeTasksUsingMultipleRangeRequests)(this, t, h, r, a), d(0);
        return;
      }
      let m = 0, p = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const v = this.createRequestOptions();
      v.redirect = "manual", d = (y) => {
        var g, E;
        if (y >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const S = t[y++];
        if (S.kind === xs.OperationKind.COPY) {
          u && u.beginFileCopy(), (0, VL.copyData)(S, h, r, a, () => d(y));
          return;
        }
        const C = `bytes=${S.start}-${S.end - 1}`;
        v.headers.range = C, (E = (g = this.logger) === null || g === void 0 ? void 0 : g.debug) === null || E === void 0 || E.call(g, `download range: ${C}`), u && u.beginRangeDownload();
        const U = this.httpExecutor.createRequest(v, (G) => {
          G.on("error", a), G.on("aborted", () => {
            a(new Error("response has been aborted by the server"));
          }), G.statusCode >= 400 && a((0, io.createHttpError)(G)), G.pipe(h, {
            end: !1
          }), G.once("end", () => {
            u && u.endRangeDownload(), ++m === 100 ? (m = 0, setTimeout(() => d(y), 1e3)) : d(y);
          });
        });
        U.on("redirect", (G, z, H) => {
          this.logger.info(`Redirect to ${JL(H)}`), p = H, (0, io.configureRequestUrl)(new GL.URL(p), v), U.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(U, a), U.end();
      }, d(0);
    });
  }
  async readRemoteBytes(t, n) {
    const r = Buffer.allocUnsafe(n + 1 - t), i = this.createRequestOptions();
    i.headers.range = `bytes=${t}-${n}`;
    let o = 0;
    if (await this.request(i, (s) => {
      s.copy(r, o), o += s.length;
    }), o !== r.length)
      throw new Error(`Received data length ${o} is not equal to expected ${r.length}`);
    return r;
  }
  request(t, n) {
    return new Promise((r, i) => {
      const o = this.httpExecutor.createRequest(t, (s) => {
        (0, cp.checkIsRangesSupported)(s, i) && (s.on("error", i), s.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), s.on("data", n), s.on("end", () => r()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
es.DifferentialDownloader = KL;
function lp(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function JL(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(nc, "__esModule", { value: !0 });
nc.GenericDifferentialDownloader = void 0;
const YL = es;
class XL extends YL.DifferentialDownloader {
  download(t, n) {
    return this.doDownload(t, n);
  }
}
nc.GenericDifferentialDownloader = XL;
var mr = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = r;
  const t = et;
  Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } }), e.DOWNLOAD_PROGRESS = "download-progress", e.UPDATE_DOWNLOADED = "update-downloaded";
  class n {
    constructor(o) {
      this.emitter = o;
    }
    /**
     * Emitted when an authenticating proxy is [asking for user credentials](https://github.com/electron/electron/blob/master/docs/api/client-request.md#event-login).
     */
    login(o) {
      r(this.emitter, "login", o);
    }
    progress(o) {
      r(this.emitter, e.DOWNLOAD_PROGRESS, o);
    }
    updateDownloaded(o) {
      r(this.emitter, e.UPDATE_DOWNLOADED, o);
    }
    updateCancelled(o) {
      r(this.emitter, "update-cancelled", o);
    }
  }
  e.UpdaterSignal = n;
  function r(i, o, s) {
    i.on(o, s);
  }
})(mr);
Object.defineProperty(cr, "__esModule", { value: !0 });
cr.NoOpLogger = cr.AppUpdater = void 0;
const At = et, ZL = Oi, QL = va, ex = Rp, rn = pr, tx = dt, nl = Ja, on = D, Nr = Gu, up = Zo, nx = Ya, fp = n0, rx = Qo, rl = Xa, il = jo, ix = nc, ci = mr;
class gf extends ex.EventEmitter {
  /**
   * Get the update channel. Doesn't return `channel` from the update configuration, only if was previously set.
   */
  get channel() {
    return this._channel;
  }
  /**
   * Set the update channel. Overrides `channel` in the update configuration.
   *
   * `allowDowngrade` will be automatically set to `true`. If this behavior is not suitable for you, simple set `allowDowngrade` explicitly after.
   */
  set channel(t) {
    if (this._channel != null) {
      if (typeof t != "string")
        throw (0, At.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, At.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
    }
    this._channel = t, this.allowDowngrade = !0;
  }
  /**
   *  Shortcut for explicitly adding auth tokens to request headers
   */
  addAuthHeader(t) {
    this.requestHeaders = Object.assign({}, this.requestHeaders, {
      authorization: t
    });
  }
  // noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  get netSession() {
    return (0, fp.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new f0();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new nl.Lazy(() => this.loadUpdateConfig());
  }
  /**
   * Allows developer to override default logic for determining if an update is supported.
   * The default logic compares the `UpdateInfo` minimum system version against the `os.release()` with `semver` package
   */
  get isUpdateSupported() {
    return this._isUpdateSupported;
  }
  set isUpdateSupported(t) {
    t && (this._isUpdateSupported = t);
  }
  /**
   * Allows developer to override default logic for determining if the user is below the rollout threshold.
   * The default logic compares the staging percentage with numerical representation of user ID.
   * An override can define custom logic, or bypass it if needed.
   */
  get isUserWithinRollout() {
    return this._isUserWithinRollout;
  }
  set isUserWithinRollout(t) {
    t && (this._isUserWithinRollout = t);
  }
  constructor(t, n) {
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new ci.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this._isUserWithinRollout = (o) => this.isStagingMatch(o), this.clientPromise = null, this.stagingUserIdPromise = new nl.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new nl.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), n == null ? (this.app = new nx.ElectronAppAdapter(), this.httpExecutor = new fp.ElectronHttpExecutor((o, s) => this.emit("login", o, s))) : (this.app = n, this.httpExecutor = null);
    const r = this.app.version, i = (0, Nr.parse)(r);
    if (i == null)
      throw (0, At.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = ox(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
  }
  //noinspection JSMethodCanBeStatic,JSUnusedGlobalSymbols
  getFeedURL() {
    return "Deprecated. Do not use it.";
  }
  /**
   * Configure update provider. If value is `string`, [GenericServerOptions](./publish.md#genericserveroptions) will be set with value as `url`.
   * @param options If you want to override configuration in the `app-update.yml`.
   */
  setFeedURL(t) {
    const n = this.createProviderRuntimeOptions();
    let r;
    typeof t == "string" ? r = new rx.GenericProvider({ provider: "generic", url: t }, this, {
      ...n,
      isUseMultipleRangeRequest: (0, rl.isUrlProbablySupportMultiRangeRequests)(t)
    }) : r = (0, rl.createClient)(t, this, n), this.clientPromise = Promise.resolve(r);
  }
  /**
   * Asks the server whether there is an update.
   * @returns null if the updater is disabled, otherwise info about the latest version
   */
  checkForUpdates() {
    if (!this.isUpdaterActive())
      return Promise.resolve(null);
    let t = this.checkForUpdatesPromise;
    if (t != null)
      return this._logger.info("Checking for update (already in progress)"), t;
    const n = () => this.checkForUpdatesPromise = null;
    return this._logger.info("Checking for update"), t = this.doCheckForUpdates().then((r) => (n(), r)).catch((r) => {
      throw n(), this.emit("error", r, `Cannot check for updates: ${(r.stack || r).toString()}`), r;
    }), this.checkForUpdatesPromise = t, t;
  }
  isUpdaterActive() {
    return this.app.isPackaged || this.forceDevUpdateConfig ? !0 : (this._logger.info("Skip checkForUpdates because application is not packed and dev update config is not forced"), !1);
  }
  // noinspection JSUnusedGlobalSymbols
  checkForUpdatesAndNotify(t) {
    return this.checkForUpdates().then((n) => n != null && n.downloadPromise ? (n.downloadPromise.then(() => {
      const r = gf.formatDownloadNotification(n.updateInfo.version, this.app.name, t);
      new Fn.Notification(r).show();
    }), n) : (this._logger.debug != null && this._logger.debug("checkForUpdatesAndNotify called, downloadPromise is null"), n));
  }
  static formatDownloadNotification(t, n, r) {
    return r == null && (r = {
      title: "A new update is ready to install",
      body: "{appName} version {version} has been downloaded and will be automatically installed on exit"
    }), r = {
      title: r.title.replace("{appName}", n).replace("{version}", t),
      body: r.body.replace("{appName}", n).replace("{version}", t)
    }, r;
  }
  async isStagingMatch(t) {
    const n = t.stagingPercentage;
    let r = n;
    if (r == null)
      return !0;
    if (r = parseInt(r, 10), isNaN(r))
      return this._logger.warn(`Staging percentage is NaN: ${n}`), !0;
    r = r / 100;
    const i = await this.stagingUserIdPromise.value, s = At.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${r}, percentage: ${s}, user id: ${i}`), s < r;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const n = (0, Nr.parse)(t.version);
    if (n == null)
      throw (0, At.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const r = this.currentVersion;
    if ((0, Nr.eq)(n, r) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const o = (0, Nr.gt)(n, r), s = (0, Nr.lt)(n, r);
    return o ? !0 : this.allowDowngrade && s;
  }
  checkIfUpdateSupported(t) {
    const n = t == null ? void 0 : t.minimumSystemVersion, r = (0, QL.release)();
    if (n)
      try {
        if ((0, Nr.lt)(r, n))
          return this._logger.info(`Current OS version ${r} is less than the minimum OS version required ${n} for version ${r}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${r}) with minimum OS version(${n}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((r) => (0, rl.createClient)(r, this, this.createProviderRuntimeOptions())));
    const t = await this.clientPromise, n = await this.stagingUserIdPromise.value;
    return t.setRequestHeaders(this.computeFinalHeaders({ "x-user-staging-id": n })), {
      info: await t.getLatestVersion(),
      provider: t
    };
  }
  createProviderRuntimeOptions() {
    return {
      isUseMultipleRangeRequest: !0,
      platform: this._testOnlyOptions == null ? process.platform : this._testOnlyOptions.platform,
      executor: this.httpExecutor
    };
  }
  async doCheckForUpdates() {
    this.emit("checking-for-update");
    const t = await this.getUpdateInfoAndProvider(), n = t.info;
    if (!await this.isUpdateAvailable(n))
      return this._logger.info(`Update for version ${this.currentVersion.format()} is not available (latest version: ${n.version}, downgrade is ${this.allowDowngrade ? "allowed" : "disallowed"}).`), this.emit("update-not-available", n), {
        isUpdateAvailable: !1,
        versionInfo: n,
        updateInfo: n
      };
    this.updateInfoAndProvider = t, this.onUpdateAvailable(n);
    const r = new At.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: n,
      updateInfo: n,
      cancellationToken: r,
      downloadPromise: this.autoDownload ? this.downloadUpdate(r) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, At.asArray)(t.files).map((n) => n.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new At.CancellationToken()) {
    const n = this.updateInfoAndProvider;
    if (n == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, At.asArray)(n.info.files).map((i) => i.url).join(", ")}`);
    const r = (i) => {
      if (!(i instanceof At.CancellationError))
        try {
          this.dispatchError(i);
        } catch (o) {
          this._logger.warn(`Cannot dispatch error event: ${o.stack || o}`);
        }
      return i;
    };
    return this.downloadPromise = this.doDownloadUpdate({
      updateInfoAndProvider: n,
      requestHeaders: this.computeRequestHeaders(n.provider),
      cancellationToken: t,
      disableWebInstaller: this.disableWebInstaller,
      disableDifferentialDownload: this.disableDifferentialDownload
    }).catch((i) => {
      throw r(i);
    }).finally(() => {
      this.downloadPromise = null;
    }), this.downloadPromise;
  }
  dispatchError(t) {
    this.emit("error", t, (t.stack || t).toString());
  }
  dispatchUpdateDownloaded(t) {
    this.emit(ci.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, tx.load)(await (0, rn.readFile)(this._appUpdateConfigPath, "utf-8"));
  }
  computeRequestHeaders(t) {
    const n = t.fileExtraDownloadHeaders;
    if (n != null) {
      const r = this.requestHeaders;
      return r == null ? n : {
        ...n,
        ...r
      };
    }
    return this.computeFinalHeaders({ accept: "*/*" });
  }
  async getOrCreateStagingUserId() {
    const t = on.join(this.app.userDataPath, ".updaterId");
    try {
      const r = await (0, rn.readFile)(t, "utf-8");
      if (At.UUID.check(r))
        return r;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${r}`);
    } catch (r) {
      r.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${r}`);
    }
    const n = At.UUID.v5((0, ZL.randomBytes)(4096), At.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${n}`);
    try {
      await (0, rn.outputFile)(t, n);
    } catch (r) {
      this._logger.warn(`Couldn't write out staging user ID: ${r}`);
    }
    return n;
  }
  /** @internal */
  get isAddNoCacheQuery() {
    const t = this.requestHeaders;
    if (t == null)
      return !0;
    for (const n of Object.keys(t)) {
      const r = n.toLowerCase();
      if (r === "authorization" || r === "private-token")
        return !1;
    }
    return !0;
  }
  async getOrCreateDownloadHelper() {
    let t = this.downloadedUpdateHelper;
    if (t == null) {
      const n = (await this.configOnDisk.value).updaterCacheDirName, r = this._logger;
      n == null && r.error("updaterCacheDirName is not specified in app-update.yml Was app build using at least electron-builder 20.34.0?");
      const i = on.join(this.app.baseCachePath, n || this.app.name);
      r.debug != null && r.debug(`updater cache dir: ${i}`), t = new up.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
    }
    return t;
  }
  async executeDownload(t) {
    const n = t.fileInfo, r = {
      headers: t.downloadUpdateOptions.requestHeaders,
      cancellationToken: t.downloadUpdateOptions.cancellationToken,
      sha2: n.info.sha2,
      sha512: n.info.sha512
    };
    this.listenerCount(ci.DOWNLOAD_PROGRESS) > 0 && (r.onProgress = (g) => this.emit(ci.DOWNLOAD_PROGRESS, g));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, s = n.packageInfo;
    function a() {
      const g = decodeURIComponent(t.fileInfo.url.pathname);
      return g.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? on.basename(g) : t.fileInfo.info.url;
    }
    const c = await this.getOrCreateDownloadHelper(), u = c.cacheDirForPendingUpdate;
    await (0, rn.mkdir)(u, { recursive: !0 });
    const l = a();
    let f = on.join(u, l);
    const h = s == null ? null : on.join(u, `package-${o}${on.extname(s.path) || ".7z"}`), d = async (g) => {
      await c.setDownloadedFile(f, h, i, n, l, g), await t.done({
        ...i,
        downloadedFile: f
      });
      const E = on.join(u, "current.blockmap");
      return await (0, rn.pathExists)(E) && await (0, rn.copyFile)(E, on.join(c.cacheDir, "current.blockmap")), h == null ? [f] : [f, h];
    }, m = this._logger, p = await c.validateDownloadedPath(f, i, n, m);
    if (p != null)
      return f = p, await d(!1);
    const v = async () => (await c.clear().catch(() => {
    }), await (0, rn.unlink)(f).catch(() => {
    })), y = await (0, up.createTempUpdateFile)(`temp-${l}`, u, m);
    try {
      await t.task(y, r, h, v), await (0, At.retry)(() => (0, rn.rename)(y, f), {
        retries: 60,
        interval: 500,
        shouldRetry: (g) => g instanceof Error && /^EBUSY:/.test(g.message) ? !0 : (m.warn(`Cannot rename temp file to final file: ${g.message || g.stack}`), !1)
      });
    } catch (g) {
      throw await v(), g instanceof At.CancellationError && (m.info("cancelled"), this.emit("update-cancelled", i)), g;
    }
    return m.info(`New version ${o} has been downloaded to ${f}`), await d(!0);
  }
  async differentialDownloadInstaller(t, n, r, i, o) {
    try {
      if (this._testOnlyOptions != null && !this._testOnlyOptions.isUseDifferentialDownload)
        return !0;
      const s = n.updateInfoAndProvider.provider, a = await s.getBlockMapFiles(t.url, this.app.version, n.updateInfoAndProvider.info.version, this.previousBlockmapBaseUrlOverride);
      this._logger.info(`Download block maps (old: "${a[0]}", new: ${a[1]})`);
      const c = async (m) => {
        const p = await this.httpExecutor.downloadToBuffer(m, {
          headers: n.requestHeaders,
          cancellationToken: n.cancellationToken
        });
        if (p == null || p.length === 0)
          throw new Error(`Blockmap "${m.href}" is empty`);
        try {
          return JSON.parse((0, il.gunzipSync)(p).toString());
        } catch (v) {
          throw new Error(`Cannot parse blockmap "${m.href}", error: ${v}`);
        }
      }, u = {
        newUrl: t.url,
        oldFile: on.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: s.isUseMultipleRangeRequest,
        requestHeaders: n.requestHeaders,
        cancellationToken: n.cancellationToken
      };
      this.listenerCount(ci.DOWNLOAD_PROGRESS) > 0 && (u.onProgress = (m) => this.emit(ci.DOWNLOAD_PROGRESS, m));
      const l = async (m, p) => {
        const v = on.join(p, "current.blockmap");
        await (0, rn.outputFile)(v, (0, il.gzipSync)(JSON.stringify(m)));
      }, f = async (m) => {
        const p = on.join(m, "current.blockmap");
        try {
          if (await (0, rn.pathExists)(p))
            return JSON.parse((0, il.gunzipSync)(await (0, rn.readFile)(p)).toString());
        } catch (v) {
          this._logger.warn(`Cannot parse blockmap "${p}", error: ${v}`);
        }
        return null;
      }, h = await c(a[1]);
      await l(h, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let d = await f(this.downloadedUpdateHelper.cacheDir);
      return d == null && (d = await c(a[0])), await new ix.GenericDifferentialDownloader(t.info, this.httpExecutor, u).download(d, h), !1;
    } catch (s) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), this._testOnlyOptions != null)
        throw s;
      return !0;
    }
  }
}
cr.AppUpdater = gf;
function ox(e) {
  const t = (0, Nr.prerelease)(e);
  return t != null && t.length > 0;
}
class f0 {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  info(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  warn(t) {
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  error(t) {
  }
}
cr.NoOpLogger = f0;
Object.defineProperty(Xr, "__esModule", { value: !0 });
Xr.BaseUpdater = void 0;
const dp = ya, sx = cr;
class ax extends sx.AppUpdater {
  constructor(t, n) {
    super(t, n), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, n = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? n : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Fn.autoUpdater.emit("before-quit-for-update"), this.app.quit();
    }) : this.quitAndInstallCalled = !1;
  }
  executeDownload(t) {
    return super.executeDownload({
      ...t,
      done: (n) => (this.dispatchUpdateDownloaded(n), this.addQuitHandler(), Promise.resolve())
    });
  }
  get installerPath() {
    return this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.file;
  }
  // must be sync (because quit even handler is not async)
  install(t = !1, n = !1) {
    if (this.quitAndInstallCalled)
      return this._logger.warn("install call ignored: quitAndInstallCalled is set to true"), !1;
    const r = this.downloadedUpdateHelper, i = this.installerPath, o = r == null ? null : r.downloadedFileInfo;
    if (i == null || o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    this.quitAndInstallCalled = !0;
    try {
      return this._logger.info(`Install: isSilent: ${t}, isForceRunAfter: ${n}`), this.doInstall({
        isSilent: t,
        isForceRunAfter: n,
        isAdminRightsRequired: o.isAdminRightsRequired
      });
    } catch (s) {
      return this.dispatchError(s), !1;
    }
  }
  addQuitHandler() {
    this.quitHandlerAdded || !this.autoInstallOnAppQuit || (this.quitHandlerAdded = !0, this.app.onQuit((t) => {
      if (this.quitAndInstallCalled) {
        this._logger.info("Update installer has already been triggered. Quitting application.");
        return;
      }
      if (!this.autoInstallOnAppQuit) {
        this._logger.info("Update will not be installed on quit because autoInstallOnAppQuit is set to false.");
        return;
      }
      if (t !== 0) {
        this._logger.info(`Update will be not installed on quit because application is quitting with exit code ${t}`);
        return;
      }
      this._logger.info("Auto install update on quit"), this.install(!0, !1);
    }));
  }
  spawnSyncLog(t, n = [], r = {}) {
    this._logger.info(`Executing: ${t} with args: ${n}`);
    const i = (0, dp.spawnSync)(t, n, {
      env: { ...process.env, ...r },
      encoding: "utf-8",
      shell: !0
    }), { error: o, status: s, stdout: a, stderr: c } = i;
    if (o != null)
      throw this._logger.error(c), o;
    if (s != null && s !== 0)
      throw this._logger.error(c), new Error(`Command ${t} exited with code ${s}`);
    return a.trim();
  }
  /**
   * This handles both node 8 and node 10 way of emitting error when spawning a process
   *   - node 8: Throws the error
   *   - node 10: Emit the error(Need to listen with on)
   */
  // https://github.com/electron-userland/electron-builder/issues/1129
  // Node 8 sends errors: https://nodejs.org/dist/latest-v8.x/docs/api/errors.html#errors_common_system_errors
  async spawnLog(t, n = [], r = void 0, i = "ignore") {
    return this._logger.info(`Executing: ${t} with args: ${n}`), new Promise((o, s) => {
      try {
        const a = { stdio: i, env: r, detached: !0 }, c = (0, dp.spawn)(t, n, a);
        c.on("error", (u) => {
          s(u);
        }), c.unref(), c.pid !== void 0 && o(!0);
      } catch (a) {
        s(a);
      }
    });
  }
}
Xr.BaseUpdater = ax;
var Do = {}, ts = {};
Object.defineProperty(ts, "__esModule", { value: !0 });
ts.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const li = pr, cx = es, lx = jo;
class ux extends cx.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, n = t.size, r = n - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(r, n - 1);
    const i = d0(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await fx(this.options.oldFile), i);
  }
}
ts.FileWithEmbeddedBlockMapDifferentialDownloader = ux;
function d0(e) {
  return JSON.parse((0, lx.inflateRawSync)(e).toString());
}
async function fx(e) {
  const t = await (0, li.open)(e, "r");
  try {
    const n = (await (0, li.fstat)(t)).size, r = Buffer.allocUnsafe(4);
    await (0, li.read)(t, r, 0, r.length, n - r.length);
    const i = Buffer.allocUnsafe(r.readUInt32BE(0));
    return await (0, li.read)(t, i, 0, i.length, n - r.length - i.length), await (0, li.close)(t), d0(i);
  } catch (n) {
    throw await (0, li.close)(t), n;
  }
}
Object.defineProperty(Do, "__esModule", { value: !0 });
Do.AppImageUpdater = void 0;
const hp = et, pp = ya, dx = pr, hx = L, oo = D, px = Xr, mx = ts, gx = Ye, mp = mr;
class yx extends px.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, gx.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const s = process.env.APPIMAGE;
        if (s == null)
          throw (0, hp.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(r, s, i, n, t)) && await this.httpExecutor.download(r.url, i, o), await (0, dx.chmod)(i, 493);
      }
    });
  }
  async downloadDifferential(t, n, r, i, o) {
    try {
      const s = {
        newUrl: t.url,
        oldFile: n,
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        requestHeaders: o.requestHeaders,
        cancellationToken: o.cancellationToken
      };
      return this.listenerCount(mp.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(mp.DOWNLOAD_PROGRESS, a)), await new mx.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, s).download(), !1;
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const n = process.env.APPIMAGE;
    if (n == null)
      throw (0, hp.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, hx.unlinkSync)(n);
    let r;
    const i = oo.basename(n), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    oo.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? r = n : r = oo.join(oo.dirname(n), oo.basename(o)), (0, pp.execFileSync)("mv", ["-f", o, r]), r !== n && this.emit("appimage-filename-updated", r);
    const s = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(r, [], s) : (s.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, pp.execFileSync)(r, [], { env: s })), !0;
  }
}
Do.AppImageUpdater = yx;
var Fo = {}, Hi = {};
Object.defineProperty(Hi, "__esModule", { value: !0 });
Hi.LinuxUpdater = void 0;
const vx = Xr;
class wx extends vx.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /**
   * Returns true if the current process is running as root.
   */
  isRunningAsRoot() {
    var t;
    return ((t = process.getuid) === null || t === void 0 ? void 0 : t.call(process)) === 0;
  }
  /**
   * Sanitizies the installer path for using with command line tools.
   */
  get installerPath() {
    var t, n;
    return (n = (t = super.installerPath) === null || t === void 0 ? void 0 : t.replace(/\\/g, "\\\\").replace(/ /g, "\\ ")) !== null && n !== void 0 ? n : null;
  }
  runCommandWithSudoIfNeeded(t) {
    if (this.isRunningAsRoot())
      return this._logger.info("Running as root, no need to use sudo"), this.spawnSyncLog(t[0], t.slice(1));
    const { name: n } = this.app, r = `"${n} would like to update"`, i = this.sudoWithArgs(r);
    this._logger.info(`Running as non-root user, using sudo to install: ${i}`);
    let o = '"';
    return (/pkexec/i.test(i[0]) || i[0] === "sudo") && (o = ""), this.spawnSyncLog(i[0], [...i.length > 1 ? i.slice(1) : [], `${o}/bin/bash`, "-c", `'${t.join(" ")}'${o}`]);
  }
  sudoWithArgs(t) {
    const n = this.determineSudoCommand(), r = [n];
    return /kdesudo/i.test(n) ? (r.push("--comment", t), r.push("-c")) : /gksudo/i.test(n) ? r.push("--message", t) : /pkexec/i.test(n) && r.push("--disable-internal-agent"), r;
  }
  hasCommand(t) {
    try {
      return this.spawnSyncLog("command", ["-v", t]), !0;
    } catch {
      return !1;
    }
  }
  determineSudoCommand() {
    const t = ["gksudo", "kdesudo", "pkexec", "beesu"];
    for (const n of t)
      if (this.hasCommand(n))
        return n;
    return "sudo";
  }
  /**
   * Detects the package manager to use based on the available commands.
   * Allows overriding the default behavior by setting the ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER environment variable.
   * If the environment variable is set, it will be used directly. (This is useful for testing each package manager logic path.)
   * Otherwise, it checks for the presence of the specified package manager commands in the order provided.
   * @param pms - An array of package manager commands to check for, in priority order.
   * @returns The detected package manager command or "unknown" if none are found.
   */
  detectPackageManager(t) {
    var n;
    const r = (n = process.env.ELECTRON_BUILDER_LINUX_PACKAGE_MANAGER) === null || n === void 0 ? void 0 : n.trim();
    if (r)
      return r;
    for (const i of t)
      if (this.hasCommand(i))
        return i;
    return this._logger.warn(`No package manager found in the list: ${t.join(", ")}. Defaulting to the first one: ${t[0]}`), t[0];
  }
}
Hi.LinuxUpdater = wx;
Object.defineProperty(Fo, "__esModule", { value: !0 });
Fo.DebUpdater = void 0;
const Ex = Ye, gp = mr, _x = Hi;
class yf extends _x.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, Ex.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(gp.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(gp.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    if (!this.hasCommand("dpkg") && !this.hasCommand("apt"))
      return this.dispatchError(new Error("Neither dpkg nor apt command found. Cannot install .deb package.")), !1;
    const r = ["dpkg", "apt"], i = this.detectPackageManager(r);
    try {
      yf.installWithCommandRunner(i, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (o) {
      return this.dispatchError(o), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, n, r, i) {
    var o;
    if (t === "dpkg")
      try {
        r(["dpkg", "-i", n]);
      } catch (s) {
        i.warn((o = s.message) !== null && o !== void 0 ? o : s), i.warn("dpkg installation failed, trying to fix broken dependencies with apt-get"), r(["apt-get", "install", "-f", "-y"]);
      }
    else if (t === "apt")
      i.warn("Using apt to install a local .deb. This may fail for unsigned packages unless properly configured."), r([
        "apt",
        "install",
        "-y",
        "--allow-unauthenticated",
        // needed for unsigned .debs
        "--allow-downgrades",
        // allow lower version installs
        "--allow-change-held-packages",
        n
      ]);
    else
      throw new Error(`Package manager ${t} not supported`);
  }
}
Fo.DebUpdater = yf;
var Lo = {};
Object.defineProperty(Lo, "__esModule", { value: !0 });
Lo.PacmanUpdater = void 0;
const yp = mr, $x = Ye, Sx = Hi;
class vf extends Sx.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, $x.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(yp.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(yp.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      vf.installWithCommandRunner(n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (r) {
      return this.dispatchError(r), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, n, r) {
    var i;
    try {
      n(["pacman", "-U", "--noconfirm", t]);
    } catch (o) {
      r.warn((i = o.message) !== null && i !== void 0 ? i : o), r.warn("pacman installation failed, attempting to update package database and retry");
      try {
        n(["pacman", "-Sy", "--noconfirm"]), n(["pacman", "-U", "--noconfirm", t]);
      } catch (s) {
        throw r.error("Retry after pacman -Sy failed"), s;
      }
    }
  }
}
Lo.PacmanUpdater = vf;
var xo = {};
Object.defineProperty(xo, "__esModule", { value: !0 });
xo.RpmUpdater = void 0;
const vp = mr, bx = Ye, Ax = Hi;
class wf extends Ax.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, bx.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(vp.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(vp.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const r = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(r);
    try {
      wf.installWithCommandRunner(i, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
    } catch (o) {
      return this.dispatchError(o), !1;
    }
    return t.isForceRunAfter && this.app.relaunch(), !0;
  }
  static installWithCommandRunner(t, n, r, i) {
    if (t === "zypper")
      return r(["zypper", "--non-interactive", "--no-refresh", "install", "--allow-unsigned-rpm", "-f", n]);
    if (t === "dnf")
      return r(["dnf", "install", "--nogpgcheck", "-y", n]);
    if (t === "yum")
      return r(["yum", "install", "--nogpgcheck", "-y", n]);
    if (t === "rpm")
      return i.warn("Installing with rpm only (no dependency resolution)."), r(["rpm", "-Uvh", "--replacepkgs", "--replacefiles", "--nodeps", n]);
    throw new Error(`Package manager ${t} not supported`);
  }
}
xo.RpmUpdater = wf;
var ko = {};
Object.defineProperty(ko, "__esModule", { value: !0 });
ko.MacUpdater = void 0;
const wp = et, ol = pr, Tx = L, Ep = D, Cx = pv, Nx = cr, Ix = Ye, _p = ya, $p = Oi;
class Px extends Nx.AppUpdater {
  constructor(t, n) {
    super(t, n), this.nativeUpdater = Fn.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (r) => {
      this._logger.warn(r), this.emit("error", r);
    }), this.nativeUpdater.on("update-downloaded", () => {
      this.squirrelDownloadedUpdate = !0, this.debug("nativeUpdater.update-downloaded");
    });
  }
  debug(t) {
    this._logger.debug != null && this._logger.debug(t);
  }
  closeServerIfExists() {
    this.server && (this.debug("Closing proxy server"), this.server.close((t) => {
      t && this.debug("proxy server wasn't already open, probably attempted closing again as a safety check before quit");
    }));
  }
  async doDownloadUpdate(t) {
    let n = t.updateInfoAndProvider.provider.resolveFiles(t.updateInfoAndProvider.info);
    const r = this._logger, i = "sysctl.proc_translated";
    let o = !1;
    try {
      this.debug("Checking for macOS Rosetta environment"), o = (0, _p.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), r.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      r.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let s = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, _p.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
      r.info(`Checked 'uname -a': arm64=${h}`), s = s || h;
    } catch (f) {
      r.warn(`uname shell command to check for arm64 failed: ${f}`);
    }
    s = s || process.arch === "arm64" || o;
    const a = (f) => {
      var h;
      return f.url.pathname.includes("arm64") || ((h = f.info.url) === null || h === void 0 ? void 0 : h.includes("arm64"));
    };
    s && n.some(a) ? n = n.filter((f) => s === a(f)) : n = n.filter((f) => !a(f));
    const c = (0, Ix.findFile)(n, "zip", ["pkg", "dmg"]);
    if (c == null)
      throw (0, wp.newError)(`ZIP file not provided: ${(0, wp.safeStringifyJson)(n)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const u = t.updateInfoAndProvider.provider, l = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: c,
      downloadUpdateOptions: t,
      task: async (f, h) => {
        const d = Ep.join(this.downloadedUpdateHelper.cacheDir, l), m = () => (0, ol.pathExistsSync)(d) ? !t.disableDifferentialDownload : (r.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let p = !0;
        m() && (p = await this.differentialDownloadInstaller(c, t, f, u, l)), p && await this.httpExecutor.download(c.url, f, h);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = Ep.join(this.downloadedUpdateHelper.cacheDir, l);
            await (0, ol.copyFile)(f.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(c, f);
      }
    });
  }
  async updateDownloaded(t, n) {
    var r;
    const i = n.downloadedFile, o = (r = t.info.size) !== null && r !== void 0 ? r : (await (0, ol.stat)(i)).size, s = this._logger, a = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${a})`), this.server = (0, Cx.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${a})`), this.server.on("close", () => {
      s.info(`Proxy server for native Squirrel.Mac is closed (${a})`);
    });
    const c = (u) => {
      const l = u.address();
      return typeof l == "string" ? l : `http://127.0.0.1:${l == null ? void 0 : l.port}`;
    };
    return await new Promise((u, l) => {
      const f = (0, $p.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${f}`, "ascii"), d = `/${(0, $p.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (m, p) => {
        const v = m.url;
        if (s.info(`${v} requested`), v === "/") {
          if (!m.headers.authorization || m.headers.authorization.indexOf("Basic ") === -1) {
            p.statusCode = 401, p.statusMessage = "Invalid Authentication Credentials", p.end(), s.warn("No authenthication info");
            return;
          }
          const E = m.headers.authorization.split(" ")[1], S = Buffer.from(E, "base64").toString("ascii"), [C, U] = S.split(":");
          if (C !== "autoupdater" || U !== f) {
            p.statusCode = 401, p.statusMessage = "Invalid Authentication Credentials", p.end(), s.warn("Invalid authenthication credentials");
            return;
          }
          const G = Buffer.from(`{ "url": "${c(this.server)}${d}" }`);
          p.writeHead(200, { "Content-Type": "application/json", "Content-Length": G.length }), p.end(G);
          return;
        }
        if (!v.startsWith(d)) {
          s.warn(`${v} requested, but not supported`), p.writeHead(404), p.end();
          return;
        }
        s.info(`${d} requested by Squirrel.Mac, pipe ${i}`);
        let y = !1;
        p.on("finish", () => {
          y || (this.nativeUpdater.removeListener("error", l), u([]));
        });
        const g = (0, Tx.createReadStream)(i);
        g.on("error", (E) => {
          try {
            p.end();
          } catch (S) {
            s.warn(`cannot end response: ${S}`);
          }
          y = !0, this.nativeUpdater.removeListener("error", l), l(new Error(`Cannot pipe "${i}": ${E}`));
        }), p.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), g.pipe(p);
      }), this.debug(`Proxy server for native Squirrel.Mac is starting to listen (${a})`), this.server.listen(0, "127.0.0.1", () => {
        this.debug(`Proxy server for native Squirrel.Mac is listening (address=${c(this.server)}, ${a})`), this.nativeUpdater.setFeedURL({
          url: c(this.server),
          headers: {
            "Cache-Control": "no-cache",
            Authorization: `Basic ${h.toString("base64")}`
          }
        }), this.dispatchUpdateDownloaded(n), this.autoInstallOnAppQuit ? (this.nativeUpdater.once("error", l), this.nativeUpdater.checkForUpdates()) : u([]);
      });
    });
  }
  handleUpdateDownloaded() {
    this.autoRunAppAfterInstall ? this.nativeUpdater.quitAndInstall() : this.app.quit(), this.closeServerIfExists();
  }
  quitAndInstall() {
    this.squirrelDownloadedUpdate ? this.handleUpdateDownloaded() : (this.nativeUpdater.on("update-downloaded", () => this.handleUpdateDownloaded()), this.autoInstallOnAppQuit || this.nativeUpdater.checkForUpdates());
  }
}
ko.MacUpdater = Px;
var Uo = {}, Ef = {};
Object.defineProperty(Ef, "__esModule", { value: !0 });
Ef.verifySignature = Rx;
const Sp = et, h0 = ya, Ox = va, bp = D;
function p0(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function Rx(e, t, n) {
  return new Promise((r, i) => {
    const o = t.replace(/'/g, "''");
    n.info(`Verifying signature ${o}`), (0, h0.execFile)(...p0(`"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`, 20 * 1e3), (s, a, c) => {
      var u;
      try {
        if (s != null || c) {
          sl(n, s, c, i), r(null);
          return;
        }
        const l = Dx(a);
        if (l.Status === 0) {
          try {
            const m = bp.normalize(l.Path), p = bp.normalize(t);
            if (n.info(`LiteralPath: ${m}. Update Path: ${p}`), m !== p) {
              sl(n, new Error(`LiteralPath of ${m} is different than ${p}`), c, i), r(null);
              return;
            }
          } catch (m) {
            n.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(u = m.message) !== null && u !== void 0 ? u : m.stack}`);
          }
          const h = (0, Sp.parseDn)(l.SignerCertificate.Subject);
          let d = !1;
          for (const m of e) {
            const p = (0, Sp.parseDn)(m);
            if (p.size ? d = Array.from(p.keys()).every((y) => p.get(y) === h.get(y)) : m === h.get("CN") && (n.warn(`Signature validated using only CN ${m}. Please add your full Distinguished Name (DN) to publisherNames configuration`), d = !0), d) {
              r(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(l, (h, d) => h === "RawData" ? void 0 : d, 2);
        n.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), r(f);
      } catch (l) {
        sl(n, l, null, i), r(null);
        return;
      }
    });
  });
}
function Dx(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const n = t.SignerCertificate;
  return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
}
function sl(e, t, n, r) {
  if (Fx()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || n}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, h0.execFileSync)(...p0("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && r(t), n && r(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${n}. Failing signature validation due to unknown stderr.`));
}
function Fx() {
  const e = Ox.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Uo, "__esModule", { value: !0 });
Uo.NsisUpdater = void 0;
const ks = et, Ap = D, Lx = Xr, xx = ts, Tp = mr, kx = Ye, Ux = pr, jx = Ef, Cp = hr;
class Mx extends Lx.BaseUpdater {
  constructor(t, n) {
    super(t, n), this._verifyUpdateCodeSignature = (r, i) => (0, jx.verifySignature)(r, i, this._logger);
  }
  /**
   * The verifyUpdateCodeSignature. You can pass [win-verify-signature](https://github.com/beyondkmp/win-verify-trust) or another custom verify function: ` (publisherName: string[], path: string) => Promise<string | null>`.
   * The default verify function uses [windowsExecutableCodeSignatureVerifier](https://github.com/electron-userland/electron-builder/blob/master/packages/electron-updater/src/windowsExecutableCodeSignatureVerifier.ts)
   */
  get verifyUpdateCodeSignature() {
    return this._verifyUpdateCodeSignature;
  }
  set verifyUpdateCodeSignature(t) {
    t && (this._verifyUpdateCodeSignature = t);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, kx.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: r,
      task: async (i, o, s, a) => {
        const c = r.packageInfo, u = c != null && s != null;
        if (u && t.disableWebInstaller)
          throw (0, ks.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !u && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (u || t.disableDifferentialDownload || await this.differentialDownloadInstaller(r, t, i, n, ks.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(r.url, i, o);
        const l = await this.verifySignature(i);
        if (l != null)
          throw await a(), (0, ks.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${l}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (u && await this.differentialDownloadWebPackage(t, c, s, n))
          try {
            await this.httpExecutor.download(new Cp.URL(c.path), s, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: c.sha512
            });
          } catch (f) {
            try {
              await (0, Ux.unlink)(s);
            } catch {
            }
            throw f;
          }
      }
    });
  }
  // $certificateInfo = (Get-AuthenticodeSignature 'xxx\yyy.exe'
  // | where {$_.Status.Equals([System.Management.Automation.SignatureStatus]::Valid) -and $_.SignerCertificate.Subject.Contains("CN=siemens.com")})
  // | Out-String ; if ($certificateInfo) { exit 0 } else { exit 1 }
  async verifySignature(t) {
    let n;
    try {
      if (n = (await this.configOnDisk.value).publisherName, n == null)
        return null;
    } catch (r) {
      if (r.code === "ENOENT")
        return null;
      throw r;
    }
    return await this._verifyUpdateCodeSignature(Array.isArray(n) ? n : [n], t);
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const r = ["--updated"];
    t.isSilent && r.push("/S"), t.isForceRunAfter && r.push("--force-run"), this.installDirectory && r.push(`/D=${this.installDirectory}`);
    const i = this.downloadedUpdateHelper == null ? null : this.downloadedUpdateHelper.packageFile;
    i != null && r.push(`--package-file=${i}`);
    const o = () => {
      this.spawnLog(Ap.join(process.resourcesPath, "elevate.exe"), [n].concat(r)).catch((s) => this.dispatchError(s));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(n, r).catch((s) => {
      const a = s.code;
      this._logger.info(`Cannot run installer: error code: ${a}, error message: "${s.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), a === "UNKNOWN" || a === "EACCES" ? o() : a === "ENOENT" ? Fn.shell.openPath(n).catch((c) => this.dispatchError(c)) : this.dispatchError(s);
    }), !0);
  }
  async differentialDownloadWebPackage(t, n, r, i) {
    if (n.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new Cp.URL(n.path),
        oldFile: Ap.join(this.downloadedUpdateHelper.cacheDir, ks.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: r,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(Tp.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(Tp.DOWNLOAD_PROGRESS, s)), await new xx.FileWithEmbeddedBlockMapDifferentialDownloader(n, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
Uo.NsisUpdater = Mx;
(function(e) {
  var t = Nt && Nt.__createBinding || (Object.create ? function(v, y, g, E) {
    E === void 0 && (E = g);
    var S = Object.getOwnPropertyDescriptor(y, g);
    (!S || ("get" in S ? !y.__esModule : S.writable || S.configurable)) && (S = { enumerable: !0, get: function() {
      return y[g];
    } }), Object.defineProperty(v, E, S);
  } : function(v, y, g, E) {
    E === void 0 && (E = g), v[E] = y[g];
  }), n = Nt && Nt.__exportStar || function(v, y) {
    for (var g in v) g !== "default" && !Object.prototype.hasOwnProperty.call(y, g) && t(y, v, g);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const r = pr, i = D;
  var o = Xr;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var s = cr;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return s.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return s.NoOpLogger;
  } });
  var a = Ye;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return a.Provider;
  } });
  var c = Do;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return c.AppImageUpdater;
  } });
  var u = Fo;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return u.DebUpdater;
  } });
  var l = Lo;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return l.PacmanUpdater;
  } });
  var f = xo;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var h = ko;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var d = Uo;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return d.NsisUpdater;
  } }), n(mr, e);
  let m;
  function p() {
    if (process.platform === "win32")
      m = new Uo.NsisUpdater();
    else if (process.platform === "darwin")
      m = new ko.MacUpdater();
    else {
      m = new Do.AppImageUpdater();
      try {
        const v = i.join(process.resourcesPath, "package-type");
        if (!(0, r.existsSync)(v))
          return m;
        switch ((0, r.readFileSync)(v).toString().trim()) {
          case "deb":
            m = new Fo.DebUpdater();
            break;
          case "rpm":
            m = new xo.RpmUpdater();
            break;
          case "pacman":
            m = new Lo.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (v) {
        console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", v.message);
      }
    }
    return m;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => m || p()
  });
})(Xn);
const Bx = Ip(import.meta.url), Wr = Np(Bx), _t = process.env.VITE_DEV_SERVER_URL;
function Hx() {
  const e = [
    oe.instances,
    oe.java,
    oe.icons,
    oe.skins,
    oe.mods,
    oe.logs
  ];
  for (const t of e)
    L.existsSync(t) || L.mkdirSync(t, { recursive: !0 });
}
function Us() {
  const e = new ve({
    width: 900,
    height: 600,
    minWidth: 750,
    minHeight: 500,
    frame: !0,
    title: "Fernlauncher",
    webPreferences: {
      preload: ze(Wr, "../dist-electron/preload.cjs"),
      sandbox: !1
    },
    icon: ze(Pe.getAppPath(), "public/iconreal.ico")
  });
  return e.setMenuBarVisibility(!1), _t ? (console.log("Main window loading URL:", _t), e.loadURL(_t)) : e.loadFile(ze(Pe.getAppPath(), "dist/index.html")), e;
}
function qx() {
  const e = new ve({
    width: 600,
    height: 450,
    resizable: !0,
    minWidth: 500,
    minHeight: 400,
    frame: !0,
    title: "Welcome to Fernlauncher",
    webPreferences: {
      preload: ze(Wr, "../dist-electron/preload.cjs"),
      sandbox: !1
    },
    icon: ze(Pe.getAppPath(), "public/iconreal.ico")
  });
  return e.setMenuBarVisibility(!1), _t ? (console.log("First launch loading URL:", _t), e.loadURL(_t + "?firstLaunch=true")) : e.loadFile(ze(Pe.getAppPath(), "dist/index.html"), {
    query: { firstLaunch: "true" }
  }), e;
}
function zx() {
  const e = new ve({
    width: 700,
    height: 580,
    minWidth: 600,
    minHeight: 500,
    title: "New Instance — Fernlauncher",
    center: !0,
    webPreferences: {
      preload: ze(Wr, "../dist-electron/preload.cjs"),
      sandbox: !1
    },
    icon: ze(Pe.getAppPath(), "public/iconreal.ico")
  });
  return e.setMenuBarVisibility(!1), _t ? e.loadURL(_t + "?window=newInstance") : e.loadFile(ze(Pe.getAppPath(), "dist/index.html"), {
    query: { window: "newInstance" }
  }), e;
}
async function Vx() {
  const { session: e } = await import("electron"), t = Vt.get("proxy");
  t.type === "none" ? await e.defaultSession.setProxy({ mode: "direct" }) : (t.type === "http" || t.type === "socks5") && await e.defaultSession.setProxy({
    proxyRules: `${t.type}://${t.address}:${t.port}`
  });
}
function Gx() {
  const e = new ve({
    width: 850,
    height: 580,
    minWidth: 700,
    minHeight: 500,
    title: "Settings — Fernlauncher",
    center: !0,
    webPreferences: {
      preload: ze(Wr, "../dist-electron/preload.cjs"),
      sandbox: !1
    },
    icon: ze(Pe.getAppPath(), "public/iconreal.ico")
  });
  return e.setMenuBarVisibility(!1), _t ? e.loadURL(_t + "?window=settings") : e.loadFile(ze(Pe.getAppPath(), "dist/index.html"), {
    query: { window: "settings" }
  }), e;
}
function Wx(e) {
  const t = new ve({
    width: 850,
    height: 600,
    minWidth: 700,
    minHeight: 400,
    title: "Console — Fernlauncher",
    center: !0,
    webPreferences: {
      preload: ze(Wr, "../dist-electron/preload.cjs"),
      sandbox: !1
    },
    icon: ze(Pe.getAppPath(), "public/iconreal.ico")
  });
  return t.setMenuBarVisibility(!1), J1(e, t), _t ? t.loadURL(_t + `?window=console&instanceId=${e}`) : t.loadFile(ze(Pe.getAppPath(), "dist/index.html"), {
    query: { window: "console", instanceId: e }
  }), t;
}
Pe.whenReady().then(async () => {
  if (await Vx(), e1(), iI(), oI(), cI(), lI(), Hx(), G1(), Pe.isPackaged && (Xn.autoUpdater.checkForUpdatesAndNotify(), Xn.autoUpdater.on("update-available", () => {
    var n;
    (n = ve.getAllWindows()[0]) == null || n.webContents.send("update:available");
  }), Xn.autoUpdater.on("update-downloaded", () => {
    var n;
    (n = ve.getAllWindows()[0]) == null || n.webContents.send("update:downloaded");
  }), Xn.autoUpdater.on("download-progress", (n) => {
    var r;
    (r = ve.getAllWindows()[0]) == null || r.webContents.send("update:progress", Math.round(n.percent));
  })), re.handle("update:install", () => {
    Xn.autoUpdater.quitAndInstall();
  }), re.handle("window:newInstance", () => {
    zx();
  }), re.handle("window:settings", () => {
    Gx();
  }), re.handle("window:console", (n, r) => {
    Wx(r);
  }), re.handle("instance:openEditor", (n, r) => {
    const i = new ve({
      width: 900,
      height: 650,
      title: "Edit Instance — Fernlauncher",
      center: !0,
      webPreferences: {
        preload: ze(Wr, "../dist-electron/preload.cjs"),
        sandbox: !1
      },
      icon: ze(Pe.getAppPath(), "public/iconreal.ico")
    });
    i.setMenuBarVisibility(!1), _t ? i.loadURL(_t + `?window=instanceEditor&instanceId=${r}`) : i.loadFile(ze(Pe.getAppPath(), "dist/index.html"), {
      query: { window: "instanceEditor", instanceId: r }
    });
  }), re.handle("launcher:openFolder", async (n, r) => {
    const o = {
      root: oe.appData,
      instances: oe.instances,
      mods: oe.mods,
      skins: oe.skins,
      java: oe.java,
      icons: oe.icons,
      logs: oe.logs,
      downloads: Pe.getPath("downloads")
    }[r];
    o && (L.existsSync(o) || L.mkdirSync(o, { recursive: !0 }), so.openPath(o));
  }), re.handle("launcher:clearMetadataCache", async () => {
    const { session: n } = await import("electron");
    await n.defaultSession.clearCache();
  }), re.handle("launcher:openAbout", () => {
    const n = new ve({
      width: 400,
      height: 380,
      title: "About Fernlauncher",
      resizable: !1,
      center: !0,
      webPreferences: {
        preload: ze(Wr, "../dist-electron/preload.cjs"),
        sandbox: !1
      },
      icon: ze(Pe.getAppPath(), "public/iconreal.ico")
    });
    n.setMenuBarVisibility(!1), _t ? n.loadURL(_t + "?window=about") : n.loadFile(ze(Pe.getAppPath(), "dist/index.html"), { query: { window: "about" } });
  }), re.handle("launcher:browseFolder", async (n, r) => {
    const i = await Ir.showOpenDialog({
      title: `Select ${r} folder`,
      properties: ["openDirectory"]
    });
    return i.canceled ? null : i.filePaths[0];
  }), re.handle("launcher:checkForUpdates", async () => {
    var n;
    Pe.isPackaged ? Xn.autoUpdater.checkForUpdates() : (n = ve.getAllWindows()[0]) == null || n.webContents.send("update:notAvailable");
  }), Xn.autoUpdater.on("update-not-available", () => {
    var n;
    (n = ve.getAllWindows()[0]) == null || n.webContents.send("update:notAvailable");
  }), re.handle("instance:contextMenu", (n, r) => {
    const i = ve.getFocusedWindow();
    if (!i) return;
    fv.buildFromTemplate([
      { label: "Launch", click: () => i.webContents.send("instance:action", { action: "launch", instanceId: r }) },
      { label: "Kill", click: () => i.webContents.send("instance:action", { action: "kill", instanceId: r }) },
      { type: "separator" },
      { label: "Rename", click: () => i.webContents.send("instance:action", { action: "rename", instanceId: r }) },
      { label: "Change Icon", click: () => i.webContents.send("instance:action", { action: "changeIcon", instanceId: r }) },
      { label: "Edit...", click: () => i.webContents.send("instance:action", { action: "edit", instanceId: r }) },
      { label: "Open Folder", click: () => i.webContents.send("instance:action", { action: "folder", instanceId: r }) },
      { type: "separator" },
      { label: "Export...", click: () => i.webContents.send("instance:action", { action: "export", instanceId: r }) },
      { label: "Copy", click: () => i.webContents.send("instance:action", { action: "copy", instanceId: r }) },
      { label: "Create Shortcut", click: () => i.webContents.send("instance:action", { action: "shortcut", instanceId: r }) },
      { type: "separator" },
      { label: "Delete", click: () => i.webContents.send("instance:action", { action: "delete", instanceId: r }) }
    ]).popup({ window: i });
  }), Vt.get("firstLaunch")) {
    const n = qx();
    re.once("first-launch-complete", () => {
      Vt.set("firstLaunch", !1), n.close(), Us();
    });
  } else
    Us();
  Pe.on("activate", () => {
    ve.getAllWindows().length === 0 && Us();
  });
  const t = process.argv.find((n) => n.startsWith("--instance"));
  if (t) {
    const n = t.split("=")[1] ?? process.argv[process.argv.indexOf(t) + 1], r = Us();
    r.webContents.once("did-finish-load", () => {
      setTimeout(() => {
        r.webContents.send("auto-launch-instance", n);
      }, 2e3);
    });
    return;
  }
});
Pe.on("window-all-closed", () => {
  K1(), process.platform !== "darwin" && Pe.quit();
});
