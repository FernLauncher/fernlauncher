var ov = Object.defineProperty;
var Af = (e) => {
  throw TypeError(e);
};
var sv = (e, t, n) => t in e ? ov(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Ui = (e, t, n) => sv(e, typeof t != "symbol" ? t + "" : t, n), Xa = (e, t, n) => t.has(e) || Af("Cannot " + n);
var ue = (e, t, n) => (Xa(e, t, "read from private field"), n ? n.call(e) : t.get(e)), Yt = (e, t, n) => t.has(e) ? Af("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), Ft = (e, t, n, r) => (Xa(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n), En = (e, t, n) => (Xa(e, t, "access private method"), n);
import Tn, { app as Le, ipcMain as ie, BrowserWindow as _e, shell as Ki, dialog as Zr } from "electron";
import k, { dirname as _p, join as ze } from "path";
import rr, { fileURLToPath as wp } from "url";
import xe from "node:process";
import Se from "node:path";
import { promisify as pt, isDeepStrictEqual as Tf } from "node:util";
import fe from "node:fs";
import ji from "node:crypto";
import Cf from "node:assert";
import $p from "node:os";
import "node:events";
import "node:stream";
import ra, { execSync as Sl, spawn as Sp } from "child_process";
import x from "fs";
import _t from "https";
import To from "zlib";
import wi from "crypto";
import av from "constants";
import Co from "stream";
import bl from "util";
import bp from "assert";
import Ap from "events";
import Tp from "tty";
import ia from "os";
import cv from "http";
const Rr = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, Cp = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), Np = 1e6, lv = (e) => e >= "0" && e <= "9";
function Ip(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= Np;
  }
  return !1;
}
function Za(e, t) {
  return Cp.has(e) ? !1 : (e && Ip(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function uv(e) {
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
        if (!Za(n, t))
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
          if ((n || r === "property") && !Za(n, t))
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
            !Number.isNaN(a) && Number.isFinite(a) && a >= 0 && a <= Number.MAX_SAFE_INTEGER && a <= Np && n === String(a) ? t.push(a) : t.push(n), n = "", r = "indexEnd";
          }
          break;
        }
        if (r === "indexEnd")
          throw new Error(`Invalid character '${s}' after an index at position ${o}`);
        n += s;
        break;
      }
      default: {
        if (r === "index" && !lv(s))
          throw new Error(`Invalid character '${s}' in an index at position ${o}`);
        if (r === "indexEnd")
          throw new Error(`Invalid character '${s}' after an index at position ${o}`);
        r === "start" && (r = "property"), n += s;
      }
    }
  }
  switch (i && (n += "\\"), r) {
    case "property": {
      if (!Za(n, t))
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
function oa(e) {
  if (typeof e == "string")
    return uv(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [n, r] of e.entries()) {
      if (typeof r != "string" && typeof r != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${n}, got ${typeof r}`);
      if (typeof r == "number" && !Number.isFinite(r))
        throw new TypeError(`Path segment at index ${n} must be a finite number, got ${r}`);
      if (Cp.has(r))
        return [];
      typeof r == "string" && Ip(r) ? t.push(Number.parseInt(r, 10)) : t.push(r);
    }
    return t;
  }
  return [];
}
function Nf(e, t, n) {
  if (!Rr(e) || typeof t != "string" && !Array.isArray(t))
    return n === void 0 ? e : n;
  const r = oa(t);
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
function Yo(e, t, n) {
  if (!Rr(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const r = e, i = oa(t);
  if (i.length === 0)
    return e;
  for (let o = 0; o < i.length; o++) {
    const s = i[o];
    if (o === i.length - 1)
      e[s] = n;
    else if (!Rr(e[s])) {
      const c = typeof i[o + 1] == "number";
      e[s] = c ? [] : {};
    }
    e = e[s];
  }
  return r;
}
function fv(e, t) {
  if (!Rr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const n = oa(t);
  if (n.length === 0)
    return !1;
  for (let r = 0; r < n.length; r++) {
    const i = n[r];
    if (r === n.length - 1)
      return Object.hasOwn(e, i) ? (delete e[i], !0) : !1;
    if (e = e[i], !Rr(e))
      return !1;
  }
}
function Qa(e, t) {
  if (!Rr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const n = oa(t);
  if (n.length === 0)
    return !1;
  for (const r of n) {
    if (!Rr(e) || !(r in e))
      return !1;
    e = e[r];
  }
  return !0;
}
const qn = $p.homedir(), Al = $p.tmpdir(), { env: ri } = xe, dv = (e) => {
  const t = Se.join(qn, "Library");
  return {
    data: Se.join(t, "Application Support", e),
    config: Se.join(t, "Preferences", e),
    cache: Se.join(t, "Caches", e),
    log: Se.join(t, "Logs", e),
    temp: Se.join(Al, e)
  };
}, hv = (e) => {
  const t = ri.APPDATA || Se.join(qn, "AppData", "Roaming"), n = ri.LOCALAPPDATA || Se.join(qn, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: Se.join(n, e, "Data"),
    config: Se.join(t, e, "Config"),
    cache: Se.join(n, e, "Cache"),
    log: Se.join(n, e, "Log"),
    temp: Se.join(Al, e)
  };
}, pv = (e) => {
  const t = Se.basename(qn);
  return {
    data: Se.join(ri.XDG_DATA_HOME || Se.join(qn, ".local", "share"), e),
    config: Se.join(ri.XDG_CONFIG_HOME || Se.join(qn, ".config"), e),
    cache: Se.join(ri.XDG_CACHE_HOME || Se.join(qn, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: Se.join(ri.XDG_STATE_HOME || Se.join(qn, ".local", "state"), e),
    temp: Se.join(Al, t, e)
  };
};
function mv(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), xe.platform === "darwin" ? dv(e) : xe.platform === "win32" ? hv(e) : pv(e);
}
const Dn = (e, t) => {
  const { onError: n } = t;
  return function(...i) {
    return e.apply(void 0, i).catch(n);
  };
}, _n = (e, t) => {
  const { onError: n } = t;
  return function(...i) {
    try {
      return e.apply(void 0, i);
    } catch (o) {
      return n(o);
    }
  };
}, gv = 250, Fn = (e, t) => {
  const { isRetriable: n } = t;
  return function(i) {
    const { timeout: o } = i, s = i.interval ?? gv, a = Date.now() + o;
    return function c(...u) {
      return e.apply(void 0, u).catch((l) => {
        if (!n(l) || Date.now() >= a)
          throw l;
        const f = Math.round(s * Math.random());
        return f > 0 ? new Promise((d) => setTimeout(d, f)).then(() => c.apply(void 0, u)) : c.apply(void 0, u);
      });
    };
  };
}, Ln = (e, t) => {
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
}, ii = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!ii.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !yv && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!ii.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!ii.isNodeError(e))
      throw e;
    if (!ii.isChangeErrorOk(e))
      throw e;
  }
}, Xo = {
  onError: ii.onChangeError
}, Mt = {
  onError: () => {
  }
}, yv = xe.getuid ? !xe.getuid() : !1, mt = {
  isRetriable: ii.isRetriableError
}, yt = {
  attempt: {
    /* ASYNC */
    chmod: Dn(pt(fe.chmod), Xo),
    chown: Dn(pt(fe.chown), Xo),
    close: Dn(pt(fe.close), Mt),
    fsync: Dn(pt(fe.fsync), Mt),
    mkdir: Dn(pt(fe.mkdir), Mt),
    realpath: Dn(pt(fe.realpath), Mt),
    stat: Dn(pt(fe.stat), Mt),
    unlink: Dn(pt(fe.unlink), Mt),
    /* SYNC */
    chmodSync: _n(fe.chmodSync, Xo),
    chownSync: _n(fe.chownSync, Xo),
    closeSync: _n(fe.closeSync, Mt),
    existsSync: _n(fe.existsSync, Mt),
    fsyncSync: _n(fe.fsync, Mt),
    mkdirSync: _n(fe.mkdirSync, Mt),
    realpathSync: _n(fe.realpathSync, Mt),
    statSync: _n(fe.statSync, Mt),
    unlinkSync: _n(fe.unlinkSync, Mt)
  },
  retry: {
    /* ASYNC */
    close: Fn(pt(fe.close), mt),
    fsync: Fn(pt(fe.fsync), mt),
    open: Fn(pt(fe.open), mt),
    readFile: Fn(pt(fe.readFile), mt),
    rename: Fn(pt(fe.rename), mt),
    stat: Fn(pt(fe.stat), mt),
    write: Fn(pt(fe.write), mt),
    writeFile: Fn(pt(fe.writeFile), mt),
    /* SYNC */
    closeSync: Ln(fe.closeSync, mt),
    fsyncSync: Ln(fe.fsyncSync, mt),
    openSync: Ln(fe.openSync, mt),
    readFileSync: Ln(fe.readFileSync, mt),
    renameSync: Ln(fe.renameSync, mt),
    statSync: Ln(fe.statSync, mt),
    writeSync: Ln(fe.writeSync, mt),
    writeFileSync: Ln(fe.writeFileSync, mt)
  }
}, vv = "utf8", If = 438, Ev = 511, _v = {}, wv = xe.geteuid ? xe.geteuid() : -1, $v = xe.getegid ? xe.getegid() : -1, Sv = 1e3, bv = !!xe.getuid;
xe.getuid && xe.getuid();
const Pf = 128, Av = (e) => e instanceof Error && "code" in e, Of = (e) => typeof e == "string", ec = (e) => e === void 0, Tv = xe.platform === "linux", Pp = xe.platform === "win32", Tl = ["SIGHUP", "SIGINT", "SIGTERM"];
Pp || Tl.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
Tv && Tl.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class Cv {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const n of this.callbacks)
          n();
        t && (Pp && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? xe.kill(xe.pid, "SIGTERM") : xe.kill(xe.pid, t));
      }
    }, this.hook = () => {
      xe.once("exit", () => this.exit());
      for (const t of Tl)
        try {
          xe.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const Nv = new Cv(), Iv = Nv.register, vt = {
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
    if (t.length <= Pf)
      return e;
    const n = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!n)
      return e;
    const r = t.length - Pf;
    return `${e.slice(0, -t.length)}${n[1]}${n[2].slice(0, -r)}${n[3]}`;
  }
};
Iv(vt.purgeSyncAll);
function Op(e, t, n = _v) {
  if (Of(n))
    return Op(e, t, { encoding: n });
  const i = { timeout: n.timeout ?? Sv };
  let o = null, s = null, a = null;
  try {
    const c = yt.attempt.realpathSync(e), u = !!c;
    e = c || e, [s, o] = vt.get(e, n.tmpCreate || vt.create, n.tmpPurge !== !1);
    const l = bv && ec(n.chown), f = ec(n.mode);
    if (u && (l || f)) {
      const h = yt.attempt.statSync(e);
      h && (n = { ...n }, l && (n.chown = { uid: h.uid, gid: h.gid }), f && (n.mode = h.mode));
    }
    if (!u) {
      const h = Se.dirname(e);
      yt.attempt.mkdirSync(h, {
        mode: Ev,
        recursive: !0
      });
    }
    a = yt.retry.openSync(i)(s, "w", n.mode || If), n.tmpCreated && n.tmpCreated(s), Of(t) ? yt.retry.writeSync(i)(a, t, 0, n.encoding || vv) : ec(t) || yt.retry.writeSync(i)(a, t, 0, t.length, 0), n.fsync !== !1 && (n.fsyncWait !== !1 ? yt.retry.fsyncSync(i)(a) : yt.attempt.fsync(a)), yt.retry.closeSync(i)(a), a = null, n.chown && (n.chown.uid !== wv || n.chown.gid !== $v) && yt.attempt.chownSync(s, n.chown.uid, n.chown.gid), n.mode && n.mode !== If && yt.attempt.chmodSync(s, n.mode);
    try {
      yt.retry.renameSync(i)(s, e);
    } catch (h) {
      if (!Av(h) || h.code !== "ENAMETOOLONG")
        throw h;
      yt.retry.renameSync(i)(s, vt.truncate(e));
    }
    o(), s = null;
  } finally {
    a && yt.attempt.closeSync(a), s && vt.purge(s);
  }
}
var Ct = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Cl(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Jc = { exports: {} }, Nl = {}, Kt = {}, gi = {}, No = {}, le = {}, co = {};
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
      return (g = this._str) !== null && g !== void 0 ? g : this._str = this._items.reduce((w, A) => `${w}${A}`, "");
    }
    get names() {
      var g;
      return (g = this._names) !== null && g !== void 0 ? g : this._names = this._items.reduce((w, A) => (A instanceof n && (w[A.str] = (w[A.str] || 0) + 1), w), {});
    }
  }
  e._Code = r, e.nil = new r("");
  function i(y, ...g) {
    const w = [y[0]];
    let A = 0;
    for (; A < g.length; )
      a(w, g[A]), w.push(y[++A]);
    return new r(w);
  }
  e._ = i;
  const o = new r("+");
  function s(y, ...g) {
    const w = [d(y[0])];
    let A = 0;
    for (; A < g.length; )
      w.push(o), a(w, g[A]), w.push(o, d(y[++A]));
    return c(w), new r(w);
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
        const w = u(y[g - 1], y[g + 1]);
        if (w !== void 0) {
          y.splice(g - 1, 3, w);
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
})(co);
var Yc = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = co;
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
            const w = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            d = (0, t._)`${d}${w} ${y} = ${g};${this.opts._n}`;
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
})(Yc);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = co, n = Yc;
  var r = co;
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
  var i = Yc;
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
      const M = $ ? n.varKinds.var : this.varKind, re = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${M} ${this.name}${re};` + T;
    }
    optimizeNames($, T) {
      if ($[this.name.str])
        return this.rhs && (this.rhs = D(this.rhs, $, T)), this;
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
        return this.rhs = D(this.rhs, $, T), this;
    }
    get names() {
      const $ = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return Z($, this.rhs);
    }
  }
  class c extends a {
    constructor($, T, M, re) {
      super($, M, re), this.op = T;
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
      return this.code = D(this.code, $, T), this;
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
      let re = M.length;
      for (; re--; ) {
        const te = M[re];
        te.optimizeNames($, T) || (L($, te.names), M.splice(re, 1));
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
        return $ === !1 ? T instanceof y ? T : T.nodes : this.nodes.length ? this : new y(G($), T instanceof y ? [T] : T.nodes);
      if (!($ === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames($, T) {
      var M;
      if (this.else = (M = this.else) === null || M === void 0 ? void 0 : M.optimizeNames($, T), !!(super.optimizeNames($, T) || this.else))
        return this.condition = D(this.condition, $, T), this;
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
  class w extends g {
    constructor($) {
      super(), this.iteration = $;
    }
    render($) {
      return `for(${this.iteration})` + super.render($);
    }
    optimizeNames($, T) {
      if (super.optimizeNames($, T))
        return this.iteration = D(this.iteration, $, T), this;
    }
    get names() {
      return V(super.names, this.iteration.names);
    }
  }
  class A extends g {
    constructor($, T, M, re) {
      super(), this.varKind = $, this.name = T, this.from = M, this.to = re;
    }
    render($) {
      const T = $.es5 ? n.varKinds.var : this.varKind, { name: M, from: re, to: te } = this;
      return `for(${T} ${M}=${re}; ${M}<${te}; ${M}++)` + super.render($);
    }
    get names() {
      const $ = Z(super.names, this.from);
      return Z($, this.to);
    }
  }
  class C extends g {
    constructor($, T, M, re) {
      super(), this.loop = $, this.varKind = T, this.name = M, this.iterable = re;
    }
    render($) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render($);
    }
    optimizeNames($, T) {
      if (super.optimizeNames($, T))
        return this.iterable = D(this.iterable, $, T), this;
    }
    get names() {
      return V(super.names, this.iterable.names);
    }
  }
  class F extends m {
    constructor($, T, M) {
      super(), this.name = $, this.args = T, this.async = M;
    }
    render($) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render($);
    }
  }
  F.kind = "func";
  class q extends d {
    render($) {
      return "return " + super.render($);
    }
  }
  q.kind = "return";
  class K extends m {
    render($) {
      let T = "try" + super.render($);
      return this.catch && (T += this.catch.render($)), this.finally && (T += this.finally.render($)), T;
    }
    optimizeNodes() {
      var $, T;
      return super.optimizeNodes(), ($ = this.catch) === null || $ === void 0 || $.optimizeNodes(), (T = this.finally) === null || T === void 0 || T.optimizeNodes(), this;
    }
    optimizeNames($, T) {
      var M, re;
      return super.optimizeNames($, T), (M = this.catch) === null || M === void 0 || M.optimizeNames($, T), (re = this.finally) === null || re === void 0 || re.optimizeNames($, T), this;
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
  class S extends m {
    render($) {
      return "finally" + super.render($);
    }
  }
  S.kind = "finally";
  class j {
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
    _def($, T, M, re) {
      const te = this._scope.toName(T);
      return M !== void 0 && re && (this._constants[te.str] = M), this._leafNode(new s($, te, M)), te;
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
      for (const [M, re] of $)
        T.length > 1 && T.push(","), T.push(M), (M !== re || this.opts.es5) && (T.push(":"), (0, t.addCodeArg)(T, re));
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
      return this._for(new w($), T);
    }
    // `for` statement for a range of values
    forRange($, T, M, re, te = this.opts.es5 ? n.varKinds.var : n.varKinds.let) {
      const ye = this._scope.toName($);
      return this._for(new A(te, ye, T, M), () => re(ye));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf($, T, M, re = n.varKinds.const) {
      const te = this._scope.toName($);
      if (this.opts.es5) {
        const ye = T instanceof t.Name ? T : this.var("_arr", T);
        return this.forRange("_i", 0, (0, t._)`${ye}.length`, (pe) => {
          this.var(te, (0, t._)`${ye}[${pe}]`), M(te);
        });
      }
      return this._for(new C("of", re, te, T), () => M(te));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn($, T, M, re = this.opts.es5 ? n.varKinds.var : n.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf($, (0, t._)`Object.keys(${T})`, M);
      const te = this._scope.toName($);
      return this._for(new C("in", re, te, T), () => M(te));
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
      const T = new q();
      if (this._blockNode(T), this.code($), T.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(q);
    }
    // `try` statement
    try($, T, M) {
      if (!T && !M)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const re = new K();
      if (this._blockNode(re), this.code($), T) {
        const te = this.name("e");
        this._currNode = re.catch = new H(te), T(te);
      }
      return M && (this._currNode = re.finally = new S(), this.code(M)), this._endBlockNode(H, S);
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
    func($, T = t.nil, M, re) {
      return this._blockNode(new F($, T, M)), re && this.code(re).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(F);
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
  e.CodeGen = j;
  function V(O, $) {
    for (const T in $)
      O[T] = (O[T] || 0) + ($[T] || 0);
    return O;
  }
  function Z(O, $) {
    return $ instanceof t._CodeOrName ? V(O, $.names) : O;
  }
  function D(O, $, T) {
    if (O instanceof t.Name)
      return M(O);
    if (!re(O))
      return O;
    return new t._Code(O._items.reduce((te, ye) => (ye instanceof t.Name && (ye = M(ye)), ye instanceof t._Code ? te.push(...ye._items) : te.push(ye), te), []));
    function M(te) {
      const ye = T[te.str];
      return ye === void 0 || $[te.str] !== 1 ? te : (delete $[te.str], ye);
    }
    function re(te) {
      return te instanceof t._Code && te._items.some((ye) => ye instanceof t.Name && $[ye.str] === 1 && T[ye.str] !== void 0);
    }
  }
  function L(O, $) {
    for (const T in $)
      O[T] = (O[T] || 0) - ($[T] || 0);
  }
  function G(O) {
    return typeof O == "boolean" || typeof O == "number" || O === null ? !O : (0, t._)`!${R(O)}`;
  }
  e.not = G;
  const z = N(e.operators.AND);
  function Y(...O) {
    return O.reduce(z);
  }
  e.and = Y;
  const J = N(e.operators.OR);
  function B(...O) {
    return O.reduce(J);
  }
  e.or = B;
  function N(O) {
    return ($, T) => $ === t.nil ? T : T === t.nil ? $ : (0, t._)`${R($)} ${O} ${R(T)}`;
  }
  function R(O) {
    return O instanceof t.Name ? O : (0, t._)`(${O})`;
  }
})(le);
var Q = {};
Object.defineProperty(Q, "__esModule", { value: !0 });
Q.checkStrictMode = Q.getErrorPath = Q.Type = Q.useFunc = Q.setEvaluated = Q.evaluatedPropsToName = Q.mergeEvaluated = Q.eachItem = Q.unescapeJsonPointer = Q.escapeJsonPointer = Q.escapeFragment = Q.unescapeFragment = Q.schemaRefOrVal = Q.schemaHasRulesButRef = Q.schemaHasRules = Q.checkUnknownRules = Q.alwaysValidSchema = Q.toHash = void 0;
const Ie = le, Pv = co;
function Ov(e) {
  const t = {};
  for (const n of e)
    t[n] = !0;
  return t;
}
Q.toHash = Ov;
function Rv(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Rp(e, t), !Dp(t, e.self.RULES.all));
}
Q.alwaysValidSchema = Rv;
function Rp(e, t = e.schema) {
  const { opts: n, self: r } = e;
  if (!n.strictSchema || typeof t == "boolean")
    return;
  const i = r.RULES.keywords;
  for (const o in t)
    i[o] || xp(e, `unknown keyword: "${o}"`);
}
Q.checkUnknownRules = Rp;
function Dp(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const n in e)
    if (t[n])
      return !0;
  return !1;
}
Q.schemaHasRules = Dp;
function Dv(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const n in e)
    if (n !== "$ref" && t.all[n])
      return !0;
  return !1;
}
Q.schemaHasRulesButRef = Dv;
function Fv({ topSchemaRef: e, schemaPath: t }, n, r, i) {
  if (!i) {
    if (typeof n == "number" || typeof n == "boolean")
      return n;
    if (typeof n == "string")
      return (0, Ie._)`${n}`;
  }
  return (0, Ie._)`${e}${t}${(0, Ie.getProperty)(r)}`;
}
Q.schemaRefOrVal = Fv;
function Lv(e) {
  return Fp(decodeURIComponent(e));
}
Q.unescapeFragment = Lv;
function xv(e) {
  return encodeURIComponent(Il(e));
}
Q.escapeFragment = xv;
function Il(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
Q.escapeJsonPointer = Il;
function Fp(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
Q.unescapeJsonPointer = Fp;
function kv(e, t) {
  if (Array.isArray(e))
    for (const n of e)
      t(n);
  else
    t(e);
}
Q.eachItem = kv;
function Rf({ mergeNames: e, mergeToName: t, mergeValues: n, resultToName: r }) {
  return (i, o, s, a) => {
    const c = s === void 0 ? o : s instanceof Ie.Name ? (o instanceof Ie.Name ? e(i, o, s) : t(i, o, s), s) : o instanceof Ie.Name ? (t(i, s, o), o) : n(o, s);
    return a === Ie.Name && !(c instanceof Ie.Name) ? r(i, c) : c;
  };
}
Q.mergeEvaluated = {
  props: Rf({
    mergeNames: (e, t, n) => e.if((0, Ie._)`${n} !== true && ${t} !== undefined`, () => {
      e.if((0, Ie._)`${t} === true`, () => e.assign(n, !0), () => e.assign(n, (0, Ie._)`${n} || {}`).code((0, Ie._)`Object.assign(${n}, ${t})`));
    }),
    mergeToName: (e, t, n) => e.if((0, Ie._)`${n} !== true`, () => {
      t === !0 ? e.assign(n, !0) : (e.assign(n, (0, Ie._)`${n} || {}`), Pl(e, n, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Lp
  }),
  items: Rf({
    mergeNames: (e, t, n) => e.if((0, Ie._)`${n} !== true && ${t} !== undefined`, () => e.assign(n, (0, Ie._)`${t} === true ? true : ${n} > ${t} ? ${n} : ${t}`)),
    mergeToName: (e, t, n) => e.if((0, Ie._)`${n} !== true`, () => e.assign(n, t === !0 ? !0 : (0, Ie._)`${n} > ${t} ? ${n} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Lp(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const n = e.var("props", (0, Ie._)`{}`);
  return t !== void 0 && Pl(e, n, t), n;
}
Q.evaluatedPropsToName = Lp;
function Pl(e, t, n) {
  Object.keys(n).forEach((r) => e.assign((0, Ie._)`${t}${(0, Ie.getProperty)(r)}`, !0));
}
Q.setEvaluated = Pl;
const Df = {};
function Uv(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: Df[t.code] || (Df[t.code] = new Pv._Code(t.code))
  });
}
Q.useFunc = Uv;
var Xc;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Xc || (Q.Type = Xc = {}));
function jv(e, t, n) {
  if (e instanceof Ie.Name) {
    const r = t === Xc.Num;
    return n ? r ? (0, Ie._)`"[" + ${e} + "]"` : (0, Ie._)`"['" + ${e} + "']"` : r ? (0, Ie._)`"/" + ${e}` : (0, Ie._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return n ? (0, Ie.getProperty)(e).toString() : "/" + Il(e);
}
Q.getErrorPath = jv;
function xp(e, t, n = e.opts.strictSchema) {
  if (n) {
    if (t = `strict mode: ${t}`, n === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
Q.checkStrictMode = xp;
var Ht = {};
Object.defineProperty(Ht, "__esModule", { value: !0 });
const gt = le, Mv = {
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
Ht.default = Mv;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = le, n = Q, r = Ht;
  e.keywordError = {
    message: ({ keyword: v }) => (0, t.str)`must pass "${v}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: v, schemaType: y }) => y ? (0, t.str)`"${v}" keyword must be ${y} ($data)` : (0, t.str)`"${v}" keyword is invalid ($data)`
  };
  function i(v, y = e.keywordError, g, w) {
    const { it: A } = v, { gen: C, compositeRule: F, allErrors: q } = A, K = f(v, y, g);
    w ?? (F || q) ? c(C, K) : u(A, (0, t._)`[${K}]`);
  }
  e.reportError = i;
  function o(v, y = e.keywordError, g) {
    const { it: w } = v, { gen: A, compositeRule: C, allErrors: F } = w, q = f(v, y, g);
    c(A, q), C || F || u(w, r.default.vErrors);
  }
  e.reportExtraError = o;
  function s(v, y) {
    v.assign(r.default.errors, y), v.if((0, t._)`${r.default.vErrors} !== null`, () => v.if(y, () => v.assign((0, t._)`${r.default.vErrors}.length`, y), () => v.assign(r.default.vErrors, null)));
  }
  e.resetErrorsCount = s;
  function a({ gen: v, keyword: y, schemaValue: g, data: w, errsCount: A, it: C }) {
    if (A === void 0)
      throw new Error("ajv implementation error");
    const F = v.name("err");
    v.forRange("i", A, r.default.errors, (q) => {
      v.const(F, (0, t._)`${r.default.vErrors}[${q}]`), v.if((0, t._)`${F}.instancePath === undefined`, () => v.assign((0, t._)`${F}.instancePath`, (0, t.strConcat)(r.default.instancePath, C.errorPath))), v.assign((0, t._)`${F}.schemaPath`, (0, t.str)`${C.errSchemaPath}/${y}`), C.opts.verbose && (v.assign((0, t._)`${F}.schema`, g), v.assign((0, t._)`${F}.data`, w));
    });
  }
  e.extendErrors = a;
  function c(v, y) {
    const g = v.const("err", y);
    v.if((0, t._)`${r.default.vErrors} === null`, () => v.assign(r.default.vErrors, (0, t._)`[${g}]`), (0, t._)`${r.default.vErrors}.push(${g})`), v.code((0, t._)`${r.default.errors}++`);
  }
  function u(v, y) {
    const { gen: g, validateName: w, schemaEnv: A } = v;
    A.$async ? g.throw((0, t._)`new ${v.ValidationError}(${y})`) : (g.assign((0, t._)`${w}.errors`, y), g.return(!1));
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
    const { createErrors: w } = v.it;
    return w === !1 ? (0, t._)`{}` : h(v, y, g);
  }
  function h(v, y, g = {}) {
    const { gen: w, it: A } = v, C = [
      d(A, g),
      m(v, g)
    ];
    return p(v, y, C), w.object(...C);
  }
  function d({ errorPath: v }, { instancePath: y }) {
    const g = y ? (0, t.str)`${v}${(0, n.getErrorPath)(y, n.Type.Str)}` : v;
    return [r.default.instancePath, (0, t.strConcat)(r.default.instancePath, g)];
  }
  function m({ keyword: v, it: { errSchemaPath: y } }, { schemaPath: g, parentSchema: w }) {
    let A = w ? y : (0, t.str)`${y}/${v}`;
    return g && (A = (0, t.str)`${A}${(0, n.getErrorPath)(g, n.Type.Str)}`), [l.schemaPath, A];
  }
  function p(v, { params: y, message: g }, w) {
    const { keyword: A, data: C, schemaValue: F, it: q } = v, { opts: K, propertyName: H, topSchemaRef: S, schemaPath: j } = q;
    w.push([l.keyword, A], [l.params, typeof y == "function" ? y(v) : y || (0, t._)`{}`]), K.messages && w.push([l.message, typeof g == "function" ? g(v) : g]), K.verbose && w.push([l.schema, F], [l.parentSchema, (0, t._)`${S}${j}`], [r.default.data, C]), H && w.push([l.propertyName, H]);
  }
})(No);
Object.defineProperty(gi, "__esModule", { value: !0 });
gi.boolOrEmptySchema = gi.topBoolOrEmptySchema = void 0;
const Bv = No, Hv = le, qv = Ht, zv = {
  message: "boolean schema is false"
};
function Vv(e) {
  const { gen: t, schema: n, validateName: r } = e;
  n === !1 ? kp(e, !1) : typeof n == "object" && n.$async === !0 ? t.return(qv.default.data) : (t.assign((0, Hv._)`${r}.errors`, null), t.return(!0));
}
gi.topBoolOrEmptySchema = Vv;
function Gv(e, t) {
  const { gen: n, schema: r } = e;
  r === !1 ? (n.var(t, !1), kp(e)) : n.var(t, !0);
}
gi.boolOrEmptySchema = Gv;
function kp(e, t) {
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
  (0, Bv.reportError)(i, zv, void 0, t);
}
var Ze = {}, Dr = {};
Object.defineProperty(Dr, "__esModule", { value: !0 });
Dr.getRules = Dr.isJSONType = void 0;
const Wv = ["string", "number", "integer", "boolean", "null", "object", "array"], Kv = new Set(Wv);
function Jv(e) {
  return typeof e == "string" && Kv.has(e);
}
Dr.isJSONType = Jv;
function Yv() {
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
Dr.getRules = Yv;
var bn = {};
Object.defineProperty(bn, "__esModule", { value: !0 });
bn.shouldUseRule = bn.shouldUseGroup = bn.schemaHasRulesForType = void 0;
function Xv({ schema: e, self: t }, n) {
  const r = t.RULES.types[n];
  return r && r !== !0 && Up(e, r);
}
bn.schemaHasRulesForType = Xv;
function Up(e, t) {
  return t.rules.some((n) => jp(e, n));
}
bn.shouldUseGroup = Up;
function jp(e, t) {
  var n;
  return e[t.keyword] !== void 0 || ((n = t.definition.implements) === null || n === void 0 ? void 0 : n.some((r) => e[r] !== void 0));
}
bn.shouldUseRule = jp;
Object.defineProperty(Ze, "__esModule", { value: !0 });
Ze.reportTypeError = Ze.checkDataTypes = Ze.checkDataType = Ze.coerceAndCheckDataType = Ze.getJSONTypes = Ze.getSchemaTypes = Ze.DataType = void 0;
const Zv = Dr, Qv = bn, eE = No, he = le, Mp = Q;
var fi;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(fi || (Ze.DataType = fi = {}));
function tE(e) {
  const t = Bp(e.type);
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
Ze.getSchemaTypes = tE;
function Bp(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(Zv.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Ze.getJSONTypes = Bp;
function nE(e, t) {
  const { gen: n, data: r, opts: i } = e, o = rE(t, i.coerceTypes), s = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, Qv.schemaHasRulesForType)(e, t[0]));
  if (s) {
    const a = Ol(t, r, i.strictNumbers, fi.Wrong);
    n.if(a, () => {
      o.length ? iE(e, t, o) : Rl(e);
    });
  }
  return s;
}
Ze.coerceAndCheckDataType = nE;
const Hp = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function rE(e, t) {
  return t ? e.filter((n) => Hp.has(n) || t === "array" && n === "array") : [];
}
function iE(e, t, n) {
  const { gen: r, data: i, opts: o } = e, s = r.let("dataType", (0, he._)`typeof ${i}`), a = r.let("coerced", (0, he._)`undefined`);
  o.coerceTypes === "array" && r.if((0, he._)`${s} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => r.assign(i, (0, he._)`${i}[0]`).assign(s, (0, he._)`typeof ${i}`).if(Ol(t, i, o.strictNumbers), () => r.assign(a, i))), r.if((0, he._)`${a} !== undefined`);
  for (const u of n)
    (Hp.has(u) || u === "array" && o.coerceTypes === "array") && c(u);
  r.else(), Rl(e), r.endIf(), r.if((0, he._)`${a} !== undefined`, () => {
    r.assign(i, a), oE(e, a);
  });
  function c(u) {
    switch (u) {
      case "string":
        r.elseIf((0, he._)`${s} == "number" || ${s} == "boolean"`).assign(a, (0, he._)`"" + ${i}`).elseIf((0, he._)`${i} === null`).assign(a, (0, he._)`""`);
        return;
      case "number":
        r.elseIf((0, he._)`${s} == "boolean" || ${i} === null
              || (${s} == "string" && ${i} && ${i} == +${i})`).assign(a, (0, he._)`+${i}`);
        return;
      case "integer":
        r.elseIf((0, he._)`${s} === "boolean" || ${i} === null
              || (${s} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(a, (0, he._)`+${i}`);
        return;
      case "boolean":
        r.elseIf((0, he._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(a, !1).elseIf((0, he._)`${i} === "true" || ${i} === 1`).assign(a, !0);
        return;
      case "null":
        r.elseIf((0, he._)`${i} === "" || ${i} === 0 || ${i} === false`), r.assign(a, null);
        return;
      case "array":
        r.elseIf((0, he._)`${s} === "string" || ${s} === "number"
              || ${s} === "boolean" || ${i} === null`).assign(a, (0, he._)`[${i}]`);
    }
  }
}
function oE({ gen: e, parentData: t, parentDataProperty: n }, r) {
  e.if((0, he._)`${t} !== undefined`, () => e.assign((0, he._)`${t}[${n}]`, r));
}
function Zc(e, t, n, r = fi.Correct) {
  const i = r === fi.Correct ? he.operators.EQ : he.operators.NEQ;
  let o;
  switch (e) {
    case "null":
      return (0, he._)`${t} ${i} null`;
    case "array":
      o = (0, he._)`Array.isArray(${t})`;
      break;
    case "object":
      o = (0, he._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      o = s((0, he._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      o = s();
      break;
    default:
      return (0, he._)`typeof ${t} ${i} ${e}`;
  }
  return r === fi.Correct ? o : (0, he.not)(o);
  function s(a = he.nil) {
    return (0, he.and)((0, he._)`typeof ${t} == "number"`, a, n ? (0, he._)`isFinite(${t})` : he.nil);
  }
}
Ze.checkDataType = Zc;
function Ol(e, t, n, r) {
  if (e.length === 1)
    return Zc(e[0], t, n, r);
  let i;
  const o = (0, Mp.toHash)(e);
  if (o.array && o.object) {
    const s = (0, he._)`typeof ${t} != "object"`;
    i = o.null ? s : (0, he._)`!${t} || ${s}`, delete o.null, delete o.array, delete o.object;
  } else
    i = he.nil;
  o.number && delete o.integer;
  for (const s in o)
    i = (0, he.and)(i, Zc(s, t, n, r));
  return i;
}
Ze.checkDataTypes = Ol;
const sE = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, he._)`{type: ${e}}` : (0, he._)`{type: ${t}}`
};
function Rl(e) {
  const t = aE(e);
  (0, eE.reportError)(t, sE);
}
Ze.reportTypeError = Rl;
function aE(e) {
  const { gen: t, data: n, schema: r } = e, i = (0, Mp.schemaRefOrVal)(e, r, "type");
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
var sa = {};
Object.defineProperty(sa, "__esModule", { value: !0 });
sa.assignDefaults = void 0;
const qr = le, cE = Q;
function lE(e, t) {
  const { properties: n, items: r } = e.schema;
  if (t === "object" && n)
    for (const i in n)
      Ff(e, i, n[i].default);
  else t === "array" && Array.isArray(r) && r.forEach((i, o) => Ff(e, o, i.default));
}
sa.assignDefaults = lE;
function Ff(e, t, n) {
  const { gen: r, compositeRule: i, data: o, opts: s } = e;
  if (n === void 0)
    return;
  const a = (0, qr._)`${o}${(0, qr.getProperty)(t)}`;
  if (i) {
    (0, cE.checkStrictMode)(e, `default is ignored for: ${a}`);
    return;
  }
  let c = (0, qr._)`${a} === undefined`;
  s.useDefaults === "empty" && (c = (0, qr._)`${c} || ${a} === null || ${a} === ""`), r.if(c, (0, qr._)`${a} = ${(0, qr.stringify)(n)}`);
}
var dn = {}, ge = {};
Object.defineProperty(ge, "__esModule", { value: !0 });
ge.validateUnion = ge.validateArray = ge.usePattern = ge.callValidateCode = ge.schemaProperties = ge.allSchemaProperties = ge.noPropertyInData = ge.propertyInData = ge.isOwnProperty = ge.hasPropFunc = ge.reportMissingProp = ge.checkMissingProp = ge.checkReportMissingProp = void 0;
const Fe = le, Dl = Q, xn = Ht, uE = Q;
function fE(e, t) {
  const { gen: n, data: r, it: i } = e;
  n.if(Ll(n, r, t, i.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, Fe._)`${t}` }, !0), e.error();
  });
}
ge.checkReportMissingProp = fE;
function dE({ gen: e, data: t, it: { opts: n } }, r, i) {
  return (0, Fe.or)(...r.map((o) => (0, Fe.and)(Ll(e, t, o, n.ownProperties), (0, Fe._)`${i} = ${o}`)));
}
ge.checkMissingProp = dE;
function hE(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
ge.reportMissingProp = hE;
function qp(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, Fe._)`Object.prototype.hasOwnProperty`
  });
}
ge.hasPropFunc = qp;
function Fl(e, t, n) {
  return (0, Fe._)`${qp(e)}.call(${t}, ${n})`;
}
ge.isOwnProperty = Fl;
function pE(e, t, n, r) {
  const i = (0, Fe._)`${t}${(0, Fe.getProperty)(n)} !== undefined`;
  return r ? (0, Fe._)`${i} && ${Fl(e, t, n)}` : i;
}
ge.propertyInData = pE;
function Ll(e, t, n, r) {
  const i = (0, Fe._)`${t}${(0, Fe.getProperty)(n)} === undefined`;
  return r ? (0, Fe.or)(i, (0, Fe.not)(Fl(e, t, n))) : i;
}
ge.noPropertyInData = Ll;
function zp(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
ge.allSchemaProperties = zp;
function mE(e, t) {
  return zp(t).filter((n) => !(0, Dl.alwaysValidSchema)(e, t[n]));
}
ge.schemaProperties = mE;
function gE({ schemaCode: e, data: t, it: { gen: n, topSchemaRef: r, schemaPath: i, errorPath: o }, it: s }, a, c, u) {
  const l = u ? (0, Fe._)`${e}, ${t}, ${r}${i}` : t, f = [
    [xn.default.instancePath, (0, Fe.strConcat)(xn.default.instancePath, o)],
    [xn.default.parentData, s.parentData],
    [xn.default.parentDataProperty, s.parentDataProperty],
    [xn.default.rootData, xn.default.rootData]
  ];
  s.opts.dynamicRef && f.push([xn.default.dynamicAnchors, xn.default.dynamicAnchors]);
  const h = (0, Fe._)`${l}, ${n.object(...f)}`;
  return c !== Fe.nil ? (0, Fe._)`${a}.call(${c}, ${h})` : (0, Fe._)`${a}(${h})`;
}
ge.callValidateCode = gE;
const yE = (0, Fe._)`new RegExp`;
function vE({ gen: e, it: { opts: t } }, n) {
  const r = t.unicodeRegExp ? "u" : "", { regExp: i } = t.code, o = i(n, r);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, Fe._)`${i.code === "new RegExp" ? yE : (0, uE.useFunc)(e, i)}(${n}, ${r})`
  });
}
ge.usePattern = vE;
function EE(e) {
  const { gen: t, data: n, keyword: r, it: i } = e, o = t.name("valid");
  if (i.allErrors) {
    const a = t.let("valid", !0);
    return s(() => t.assign(a, !1)), a;
  }
  return t.var(o, !0), s(() => t.break()), o;
  function s(a) {
    const c = t.const("len", (0, Fe._)`${n}.length`);
    t.forRange("i", 0, c, (u) => {
      e.subschema({
        keyword: r,
        dataProp: u,
        dataPropType: Dl.Type.Num
      }, o), t.if((0, Fe.not)(o), a);
    });
  }
}
ge.validateArray = EE;
function _E(e) {
  const { gen: t, schema: n, keyword: r, it: i } = e;
  if (!Array.isArray(n))
    throw new Error("ajv implementation error");
  if (n.some((c) => (0, Dl.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
    return;
  const s = t.let("valid", !1), a = t.name("_valid");
  t.block(() => n.forEach((c, u) => {
    const l = e.subschema({
      keyword: r,
      schemaProp: u,
      compositeRule: !0
    }, a);
    t.assign(s, (0, Fe._)`${s} || ${a}`), e.mergeValidEvaluated(l, a) || t.if((0, Fe.not)(s));
  })), e.result(s, () => e.reset(), () => e.error(!0));
}
ge.validateUnion = _E;
Object.defineProperty(dn, "__esModule", { value: !0 });
dn.validateKeywordUsage = dn.validSchemaType = dn.funcKeywordCode = dn.macroKeywordCode = void 0;
const At = le, Er = Ht, wE = ge, $E = No;
function SE(e, t) {
  const { gen: n, keyword: r, schema: i, parentSchema: o, it: s } = e, a = t.macro.call(s.self, i, o, s), c = Vp(n, r, a);
  s.opts.validateSchema !== !1 && s.self.validateSchema(a, !0);
  const u = n.name("valid");
  e.subschema({
    schema: a,
    schemaPath: At.nil,
    errSchemaPath: `${s.errSchemaPath}/${r}`,
    topSchemaRef: c,
    compositeRule: !0
  }, u), e.pass(u, () => e.error(!0));
}
dn.macroKeywordCode = SE;
function bE(e, t) {
  var n;
  const { gen: r, keyword: i, schema: o, parentSchema: s, $data: a, it: c } = e;
  TE(c, t);
  const u = !a && t.compile ? t.compile.call(c.self, o, s, c) : t.validate, l = Vp(r, i, u), f = r.let("valid");
  e.block$data(f, h), e.ok((n = t.valid) !== null && n !== void 0 ? n : f);
  function h() {
    if (t.errors === !1)
      p(), t.modifying && Lf(e), v(() => e.error());
    else {
      const y = t.async ? d() : m();
      t.modifying && Lf(e), v(() => AE(e, y));
    }
  }
  function d() {
    const y = r.let("ruleErrs", null);
    return r.try(() => p((0, At._)`await `), (g) => r.assign(f, !1).if((0, At._)`${g} instanceof ${c.ValidationError}`, () => r.assign(y, (0, At._)`${g}.errors`), () => r.throw(g))), y;
  }
  function m() {
    const y = (0, At._)`${l}.errors`;
    return r.assign(y, null), p(At.nil), y;
  }
  function p(y = t.async ? (0, At._)`await ` : At.nil) {
    const g = c.opts.passContext ? Er.default.this : Er.default.self, w = !("compile" in t && !a || t.schema === !1);
    r.assign(f, (0, At._)`${y}${(0, wE.callValidateCode)(e, l, g, w)}`, t.modifying);
  }
  function v(y) {
    var g;
    r.if((0, At.not)((g = t.valid) !== null && g !== void 0 ? g : f), y);
  }
}
dn.funcKeywordCode = bE;
function Lf(e) {
  const { gen: t, data: n, it: r } = e;
  t.if(r.parentData, () => t.assign(n, (0, At._)`${r.parentData}[${r.parentDataProperty}]`));
}
function AE(e, t) {
  const { gen: n } = e;
  n.if((0, At._)`Array.isArray(${t})`, () => {
    n.assign(Er.default.vErrors, (0, At._)`${Er.default.vErrors} === null ? ${t} : ${Er.default.vErrors}.concat(${t})`).assign(Er.default.errors, (0, At._)`${Er.default.vErrors}.length`), (0, $E.extendErrors)(e);
  }, () => e.error());
}
function TE({ schemaEnv: e }, t) {
  if (t.async && !e.$async)
    throw new Error("async keyword in sync schema");
}
function Vp(e, t, n) {
  if (n === void 0)
    throw new Error(`keyword "${t}" failed to compile`);
  return e.scopeValue("keyword", typeof n == "function" ? { ref: n } : { ref: n, code: (0, At.stringify)(n) });
}
function CE(e, t, n = !1) {
  return !t.length || t.some((r) => r === "array" ? Array.isArray(e) : r === "object" ? e && typeof e == "object" && !Array.isArray(e) : typeof e == r || n && typeof e > "u");
}
dn.validSchemaType = CE;
function NE({ schema: e, opts: t, self: n, errSchemaPath: r }, i, o) {
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
dn.validateKeywordUsage = NE;
var Yn = {};
Object.defineProperty(Yn, "__esModule", { value: !0 });
Yn.extendSubschemaMode = Yn.extendSubschemaData = Yn.getSubschema = void 0;
const un = le, Gp = Q;
function IE(e, { keyword: t, schemaProp: n, schema: r, schemaPath: i, errSchemaPath: o, topSchemaRef: s }) {
  if (t !== void 0 && r !== void 0)
    throw new Error('both "keyword" and "schema" passed, only one allowed');
  if (t !== void 0) {
    const a = e.schema[t];
    return n === void 0 ? {
      schema: a,
      schemaPath: (0, un._)`${e.schemaPath}${(0, un.getProperty)(t)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}`
    } : {
      schema: a[n],
      schemaPath: (0, un._)`${e.schemaPath}${(0, un.getProperty)(t)}${(0, un.getProperty)(n)}`,
      errSchemaPath: `${e.errSchemaPath}/${t}/${(0, Gp.escapeFragment)(n)}`
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
Yn.getSubschema = IE;
function PE(e, t, { dataProp: n, dataPropType: r, data: i, dataTypes: o, propertyName: s }) {
  if (i !== void 0 && n !== void 0)
    throw new Error('both "data" and "dataProp" passed, only one allowed');
  const { gen: a } = t;
  if (n !== void 0) {
    const { errorPath: u, dataPathArr: l, opts: f } = t, h = a.let("data", (0, un._)`${t.data}${(0, un.getProperty)(n)}`, !0);
    c(h), e.errorPath = (0, un.str)`${u}${(0, Gp.getErrorPath)(n, r, f.jsPropertySyntax)}`, e.parentDataProperty = (0, un._)`${n}`, e.dataPathArr = [...l, e.parentDataProperty];
  }
  if (i !== void 0) {
    const u = i instanceof un.Name ? i : a.let("data", i, !0);
    c(u), s !== void 0 && (e.propertyName = s);
  }
  o && (e.dataTypes = o);
  function c(u) {
    e.data = u, e.dataLevel = t.dataLevel + 1, e.dataTypes = [], t.definedProperties = /* @__PURE__ */ new Set(), e.parentData = t.data, e.dataNames = [...t.dataNames, u];
  }
}
Yn.extendSubschemaData = PE;
function OE(e, { jtdDiscriminator: t, jtdMetadata: n, compositeRule: r, createErrors: i, allErrors: o }) {
  r !== void 0 && (e.compositeRule = r), i !== void 0 && (e.createErrors = i), o !== void 0 && (e.allErrors = o), e.jtdDiscriminator = t, e.jtdMetadata = n;
}
Yn.extendSubschemaMode = OE;
var ct = {}, Wp = function e(t, n) {
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
}, Kp = { exports: {} }, Wn = Kp.exports = function(e, t, n) {
  typeof t == "function" && (n = t, t = {}), n = t.cb || n;
  var r = typeof n == "function" ? n : n.pre || function() {
  }, i = n.post || function() {
  };
  Ts(t, r, i, e, "", e);
};
Wn.keywords = {
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
Wn.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Wn.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Wn.skipKeywords = {
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
function Ts(e, t, n, r, i, o, s, a, c, u) {
  if (r && typeof r == "object" && !Array.isArray(r)) {
    t(r, i, o, s, a, c, u);
    for (var l in r) {
      var f = r[l];
      if (Array.isArray(f)) {
        if (l in Wn.arrayKeywords)
          for (var h = 0; h < f.length; h++)
            Ts(e, t, n, f[h], i + "/" + l + "/" + h, o, i, l, r, h);
      } else if (l in Wn.propsKeywords) {
        if (f && typeof f == "object")
          for (var d in f)
            Ts(e, t, n, f[d], i + "/" + l + "/" + RE(d), o, i, l, r, d);
      } else (l in Wn.keywords || e.allKeys && !(l in Wn.skipKeywords)) && Ts(e, t, n, f, i + "/" + l, o, i, l, r);
    }
    n(r, i, o, s, a, c, u);
  }
}
function RE(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var DE = Kp.exports;
Object.defineProperty(ct, "__esModule", { value: !0 });
ct.getSchemaRefs = ct.resolveUrl = ct.normalizeId = ct._getFullPath = ct.getFullPath = ct.inlineRef = void 0;
const FE = Q, LE = Wp, xE = DE, kE = /* @__PURE__ */ new Set([
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
function UE(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !Qc(e) : t ? Jp(e) <= t : !1;
}
ct.inlineRef = UE;
const jE = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function Qc(e) {
  for (const t in e) {
    if (jE.has(t))
      return !0;
    const n = e[t];
    if (Array.isArray(n) && n.some(Qc) || typeof n == "object" && Qc(n))
      return !0;
  }
  return !1;
}
function Jp(e) {
  let t = 0;
  for (const n in e) {
    if (n === "$ref")
      return 1 / 0;
    if (t++, !kE.has(n) && (typeof e[n] == "object" && (0, FE.eachItem)(e[n], (r) => t += Jp(r)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Yp(e, t = "", n) {
  n !== !1 && (t = di(t));
  const r = e.parse(t);
  return Xp(e, r);
}
ct.getFullPath = Yp;
function Xp(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
ct._getFullPath = Xp;
const ME = /#\/?$/;
function di(e) {
  return e ? e.replace(ME, "") : "";
}
ct.normalizeId = di;
function BE(e, t, n) {
  return n = di(n), e.resolve(t, n);
}
ct.resolveUrl = BE;
const HE = /^[a-z_][-a-z0-9._]*$/i;
function qE(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: n, uriResolver: r } = this.opts, i = di(e[n] || t), o = { "": i }, s = Yp(r, i, !1), a = {}, c = /* @__PURE__ */ new Set();
  return xE(e, { allKeys: !0 }, (f, h, d, m) => {
    if (m === void 0)
      return;
    const p = s + h;
    let v = o[m];
    typeof f[n] == "string" && (v = y.call(this, f[n])), g.call(this, f.$anchor), g.call(this, f.$dynamicAnchor), o[h] = v;
    function y(w) {
      const A = this.opts.uriResolver.resolve;
      if (w = di(v ? A(v, w) : w), c.has(w))
        throw l(w);
      c.add(w);
      let C = this.refs[w];
      return typeof C == "string" && (C = this.refs[C]), typeof C == "object" ? u(f, C.schema, w) : w !== di(p) && (w[0] === "#" ? (u(f, a[w], w), a[w] = f) : this.refs[w] = p), w;
    }
    function g(w) {
      if (typeof w == "string") {
        if (!HE.test(w))
          throw new Error(`invalid anchor "${w}"`);
        y.call(this, `#${w}`);
      }
    }
  }), a;
  function u(f, h, d) {
    if (h !== void 0 && !LE(f, h))
      throw l(d);
  }
  function l(f) {
    return new Error(`reference "${f}" resolves to more than one schema`);
  }
}
ct.getSchemaRefs = qE;
Object.defineProperty(Kt, "__esModule", { value: !0 });
Kt.getData = Kt.KeywordCxt = Kt.validateFunctionCode = void 0;
const Zp = gi, xf = Ze, xl = bn, ks = Ze, zE = sa, Qi = dn, tc = Yn, se = le, ce = Ht, VE = ct, An = Q, Mi = No;
function GE(e) {
  if (tm(e) && (nm(e), em(e))) {
    JE(e);
    return;
  }
  Qp(e, () => (0, Zp.topBoolOrEmptySchema)(e));
}
Kt.validateFunctionCode = GE;
function Qp({ gen: e, validateName: t, schema: n, schemaEnv: r, opts: i }, o) {
  i.code.es5 ? e.func(t, (0, se._)`${ce.default.data}, ${ce.default.valCxt}`, r.$async, () => {
    e.code((0, se._)`"use strict"; ${kf(n, i)}`), KE(e, i), e.code(o);
  }) : e.func(t, (0, se._)`${ce.default.data}, ${WE(i)}`, r.$async, () => e.code(kf(n, i)).code(o));
}
function WE(e) {
  return (0, se._)`{${ce.default.instancePath}="", ${ce.default.parentData}, ${ce.default.parentDataProperty}, ${ce.default.rootData}=${ce.default.data}${e.dynamicRef ? (0, se._)`, ${ce.default.dynamicAnchors}={}` : se.nil}}={}`;
}
function KE(e, t) {
  e.if(ce.default.valCxt, () => {
    e.var(ce.default.instancePath, (0, se._)`${ce.default.valCxt}.${ce.default.instancePath}`), e.var(ce.default.parentData, (0, se._)`${ce.default.valCxt}.${ce.default.parentData}`), e.var(ce.default.parentDataProperty, (0, se._)`${ce.default.valCxt}.${ce.default.parentDataProperty}`), e.var(ce.default.rootData, (0, se._)`${ce.default.valCxt}.${ce.default.rootData}`), t.dynamicRef && e.var(ce.default.dynamicAnchors, (0, se._)`${ce.default.valCxt}.${ce.default.dynamicAnchors}`);
  }, () => {
    e.var(ce.default.instancePath, (0, se._)`""`), e.var(ce.default.parentData, (0, se._)`undefined`), e.var(ce.default.parentDataProperty, (0, se._)`undefined`), e.var(ce.default.rootData, ce.default.data), t.dynamicRef && e.var(ce.default.dynamicAnchors, (0, se._)`{}`);
  });
}
function JE(e) {
  const { schema: t, opts: n, gen: r } = e;
  Qp(e, () => {
    n.$comment && t.$comment && im(e), e_(e), r.let(ce.default.vErrors, null), r.let(ce.default.errors, 0), n.unevaluated && YE(e), rm(e), r_(e);
  });
}
function YE(e) {
  const { gen: t, validateName: n } = e;
  e.evaluated = t.const("evaluated", (0, se._)`${n}.evaluated`), t.if((0, se._)`${e.evaluated}.dynamicProps`, () => t.assign((0, se._)`${e.evaluated}.props`, (0, se._)`undefined`)), t.if((0, se._)`${e.evaluated}.dynamicItems`, () => t.assign((0, se._)`${e.evaluated}.items`, (0, se._)`undefined`));
}
function kf(e, t) {
  const n = typeof e == "object" && e[t.schemaId];
  return n && (t.code.source || t.code.process) ? (0, se._)`/*# sourceURL=${n} */` : se.nil;
}
function XE(e, t) {
  if (tm(e) && (nm(e), em(e))) {
    ZE(e, t);
    return;
  }
  (0, Zp.boolOrEmptySchema)(e, t);
}
function em({ schema: e, self: t }) {
  if (typeof e == "boolean")
    return !e;
  for (const n in e)
    if (t.RULES.all[n])
      return !0;
  return !1;
}
function tm(e) {
  return typeof e.schema != "boolean";
}
function ZE(e, t) {
  const { schema: n, gen: r, opts: i } = e;
  i.$comment && n.$comment && im(e), t_(e), n_(e);
  const o = r.const("_errs", ce.default.errors);
  rm(e, o), r.var(t, (0, se._)`${o} === ${ce.default.errors}`);
}
function nm(e) {
  (0, An.checkUnknownRules)(e), QE(e);
}
function rm(e, t) {
  if (e.opts.jtd)
    return Uf(e, [], !1, t);
  const n = (0, xf.getSchemaTypes)(e.schema), r = (0, xf.coerceAndCheckDataType)(e, n);
  Uf(e, n, !r, t);
}
function QE(e) {
  const { schema: t, errSchemaPath: n, opts: r, self: i } = e;
  t.$ref && r.ignoreKeywordsWithRef && (0, An.schemaHasRulesButRef)(t, i.RULES) && i.logger.warn(`$ref: keywords ignored in schema at path "${n}"`);
}
function e_(e) {
  const { schema: t, opts: n } = e;
  t.default !== void 0 && n.useDefaults && n.strictSchema && (0, An.checkStrictMode)(e, "default is ignored in the schema root");
}
function t_(e) {
  const t = e.schema[e.opts.schemaId];
  t && (e.baseId = (0, VE.resolveUrl)(e.opts.uriResolver, e.baseId, t));
}
function n_(e) {
  if (e.schema.$async && !e.schemaEnv.$async)
    throw new Error("async schema in sync schema");
}
function im({ gen: e, schemaEnv: t, schema: n, errSchemaPath: r, opts: i }) {
  const o = n.$comment;
  if (i.$comment === !0)
    e.code((0, se._)`${ce.default.self}.logger.log(${o})`);
  else if (typeof i.$comment == "function") {
    const s = (0, se.str)`${r}/$comment`, a = e.scopeValue("root", { ref: t.root });
    e.code((0, se._)`${ce.default.self}.opts.$comment(${o}, ${s}, ${a}.schema)`);
  }
}
function r_(e) {
  const { gen: t, schemaEnv: n, validateName: r, ValidationError: i, opts: o } = e;
  n.$async ? t.if((0, se._)`${ce.default.errors} === 0`, () => t.return(ce.default.data), () => t.throw((0, se._)`new ${i}(${ce.default.vErrors})`)) : (t.assign((0, se._)`${r}.errors`, ce.default.vErrors), o.unevaluated && i_(e), t.return((0, se._)`${ce.default.errors} === 0`));
}
function i_({ gen: e, evaluated: t, props: n, items: r }) {
  n instanceof se.Name && e.assign((0, se._)`${t}.props`, n), r instanceof se.Name && e.assign((0, se._)`${t}.items`, r);
}
function Uf(e, t, n, r) {
  const { gen: i, schema: o, data: s, allErrors: a, opts: c, self: u } = e, { RULES: l } = u;
  if (o.$ref && (c.ignoreKeywordsWithRef || !(0, An.schemaHasRulesButRef)(o, l))) {
    i.block(() => am(e, "$ref", l.all.$ref.definition));
    return;
  }
  c.jtd || o_(e, t), i.block(() => {
    for (const h of l.rules)
      f(h);
    f(l.post);
  });
  function f(h) {
    (0, xl.shouldUseGroup)(o, h) && (h.type ? (i.if((0, ks.checkDataType)(h.type, s, c.strictNumbers)), jf(e, h), t.length === 1 && t[0] === h.type && n && (i.else(), (0, ks.reportTypeError)(e)), i.endIf()) : jf(e, h), a || i.if((0, se._)`${ce.default.errors} === ${r || 0}`));
  }
}
function jf(e, t) {
  const { gen: n, schema: r, opts: { useDefaults: i } } = e;
  i && (0, zE.assignDefaults)(e, t.type), n.block(() => {
    for (const o of t.rules)
      (0, xl.shouldUseRule)(r, o) && am(e, o.keyword, o.definition, t.type);
  });
}
function o_(e, t) {
  e.schemaEnv.meta || !e.opts.strictTypes || (s_(e, t), e.opts.allowUnionTypes || a_(e, t), c_(e, e.dataTypes));
}
function s_(e, t) {
  if (t.length) {
    if (!e.dataTypes.length) {
      e.dataTypes = t;
      return;
    }
    t.forEach((n) => {
      om(e.dataTypes, n) || kl(e, `type "${n}" not allowed by context "${e.dataTypes.join(",")}"`);
    }), u_(e, t);
  }
}
function a_(e, t) {
  t.length > 1 && !(t.length === 2 && t.includes("null")) && kl(e, "use allowUnionTypes to allow union type keyword");
}
function c_(e, t) {
  const n = e.self.RULES.all;
  for (const r in n) {
    const i = n[r];
    if (typeof i == "object" && (0, xl.shouldUseRule)(e.schema, i)) {
      const { type: o } = i.definition;
      o.length && !o.some((s) => l_(t, s)) && kl(e, `missing type "${o.join(",")}" for keyword "${r}"`);
    }
  }
}
function l_(e, t) {
  return e.includes(t) || t === "number" && e.includes("integer");
}
function om(e, t) {
  return e.includes(t) || t === "integer" && e.includes("number");
}
function u_(e, t) {
  const n = [];
  for (const r of e.dataTypes)
    om(t, r) ? n.push(r) : t.includes("integer") && r === "number" && n.push("integer");
  e.dataTypes = n;
}
function kl(e, t) {
  const n = e.schemaEnv.baseId + e.errSchemaPath;
  t += ` at "${n}" (strictTypes)`, (0, An.checkStrictMode)(e, t, e.opts.strictTypes);
}
class sm {
  constructor(t, n, r) {
    if ((0, Qi.validateKeywordUsage)(t, n, r), this.gen = t.gen, this.allErrors = t.allErrors, this.keyword = r, this.data = t.data, this.schema = t.schema[r], this.$data = n.$data && t.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, An.schemaRefOrVal)(t, this.schema, r, this.$data), this.schemaType = n.schemaType, this.parentSchema = t.schema, this.params = {}, this.it = t, this.def = n, this.$data)
      this.schemaCode = t.gen.const("vSchema", cm(this.$data, t));
    else if (this.schemaCode = this.schemaValue, !(0, Qi.validSchemaType)(this.schema, n.schemaType, n.allowUndefined))
      throw new Error(`${r} value must be ${JSON.stringify(n.schemaType)}`);
    ("code" in n ? n.trackErrors : n.errors !== !1) && (this.errsCount = t.gen.const("_errs", ce.default.errors));
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
    (t ? Mi.reportExtraError : Mi.reportError)(this, this.def.error, n);
  }
  $dataError() {
    (0, Mi.reportError)(this, this.def.$dataError || Mi.keyword$DataError);
  }
  reset() {
    if (this.errsCount === void 0)
      throw new Error('add "trackErrors" to keyword definition');
    (0, Mi.resetErrorsCount)(this.gen, this.errsCount);
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
        return (0, se._)`${(0, ks.checkDataTypes)(c, n, o.opts.strictNumbers, ks.DataType.Wrong)}`;
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
    const r = (0, tc.getSubschema)(this.it, t);
    (0, tc.extendSubschemaData)(r, this.it, t), (0, tc.extendSubschemaMode)(r, t);
    const i = { ...this.it, ...r, items: void 0, props: void 0 };
    return XE(i, n), i;
  }
  mergeEvaluated(t, n) {
    const { it: r, gen: i } = this;
    r.opts.unevaluated && (r.props !== !0 && t.props !== void 0 && (r.props = An.mergeEvaluated.props(i, t.props, r.props, n)), r.items !== !0 && t.items !== void 0 && (r.items = An.mergeEvaluated.items(i, t.items, r.items, n)));
  }
  mergeValidEvaluated(t, n) {
    const { it: r, gen: i } = this;
    if (r.opts.unevaluated && (r.props !== !0 || r.items !== !0))
      return i.if(n, () => this.mergeEvaluated(t, se.Name)), !0;
  }
}
Kt.KeywordCxt = sm;
function am(e, t, n, r) {
  const i = new sm(e, n, t);
  "code" in n ? n.code(i, r) : i.$data && n.validate ? (0, Qi.funcKeywordCode)(i, n) : "macro" in n ? (0, Qi.macroKeywordCode)(i, n) : (n.compile || n.validate) && (0, Qi.funcKeywordCode)(i, n);
}
const f_ = /^\/(?:[^~]|~0|~1)*$/, d_ = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
function cm(e, { dataLevel: t, dataNames: n, dataPathArr: r }) {
  let i, o;
  if (e === "")
    return ce.default.rootData;
  if (e[0] === "/") {
    if (!f_.test(e))
      throw new Error(`Invalid JSON-pointer: ${e}`);
    i = e, o = ce.default.rootData;
  } else {
    const u = d_.exec(e);
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
    u && (o = (0, se._)`${o}${(0, se.getProperty)((0, An.unescapeJsonPointer)(u))}`, s = (0, se._)`${s} && ${o}`);
  return s;
  function c(u, l) {
    return `Cannot access ${u} ${l} levels up, current level is ${t}`;
  }
}
Kt.getData = cm;
var $i = {};
Object.defineProperty($i, "__esModule", { value: !0 });
class h_ extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
$i.default = h_;
var kr = {};
Object.defineProperty(kr, "__esModule", { value: !0 });
const nc = ct;
class p_ extends Error {
  constructor(t, n, r, i) {
    super(i || `can't resolve reference ${r} from id ${n}`), this.missingRef = (0, nc.resolveUrl)(t, n, r), this.missingSchema = (0, nc.normalizeId)((0, nc.getFullPath)(t, this.missingRef));
  }
}
kr.default = p_;
var Tt = {};
Object.defineProperty(Tt, "__esModule", { value: !0 });
Tt.resolveSchema = Tt.getCompilingSchema = Tt.resolveRef = Tt.compileSchema = Tt.SchemaEnv = void 0;
const Xt = le, m_ = $i, fr = Ht, nn = ct, Mf = Q, g_ = Kt;
class aa {
  constructor(t) {
    var n;
    this.refs = {}, this.dynamicAnchors = {};
    let r;
    typeof t.schema == "object" && (r = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (n = t.baseId) !== null && n !== void 0 ? n : (0, nn.normalizeId)(r == null ? void 0 : r[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = r == null ? void 0 : r.$async, this.refs = {};
  }
}
Tt.SchemaEnv = aa;
function Ul(e) {
  const t = lm.call(this, e);
  if (t)
    return t;
  const n = (0, nn.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: r, lines: i } = this.opts.code, { ownProperties: o } = this.opts, s = new Xt.CodeGen(this.scope, { es5: r, lines: i, ownProperties: o });
  let a;
  e.$async && (a = s.scopeValue("Error", {
    ref: m_.default,
    code: (0, Xt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = s.scopeName("validate");
  e.validateName = c;
  const u = {
    gen: s,
    allErrors: this.opts.allErrors,
    data: fr.default.data,
    parentData: fr.default.parentData,
    parentDataProperty: fr.default.parentDataProperty,
    dataNames: [fr.default.data],
    dataPathArr: [Xt.nil],
    // TODO can its length be used as dataLevel if nil is removed?
    dataLevel: 0,
    dataTypes: [],
    definedProperties: /* @__PURE__ */ new Set(),
    topSchemaRef: s.scopeValue("schema", this.opts.code.source === !0 ? { ref: e.schema, code: (0, Xt.stringify)(e.schema) } : { ref: e.schema }),
    validateName: c,
    ValidationError: a,
    schema: e.schema,
    schemaEnv: e,
    rootId: n,
    baseId: e.baseId || n,
    schemaPath: Xt.nil,
    errSchemaPath: e.schemaPath || (this.opts.jtd ? "" : "#"),
    errorPath: (0, Xt._)`""`,
    opts: this.opts,
    self: this
  };
  let l;
  try {
    this._compilations.add(e), (0, g_.validateFunctionCode)(u), s.optimize(this.opts.code.optimize);
    const f = s.toString();
    l = `${s.scopeRefs(fr.default.scope)}return ${f}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const d = new Function(`${fr.default.self}`, `${fr.default.scope}`, l)(this, this.scope.get());
    if (this.scope.value(c, { ref: d }), d.errors = null, d.schema = e.schema, d.schemaEnv = e, e.$async && (d.$async = !0), this.opts.code.source === !0 && (d.source = { validateName: c, validateCode: f, scopeValues: s._values }), this.opts.unevaluated) {
      const { props: m, items: p } = u;
      d.evaluated = {
        props: m instanceof Xt.Name ? void 0 : m,
        items: p instanceof Xt.Name ? void 0 : p,
        dynamicProps: m instanceof Xt.Name,
        dynamicItems: p instanceof Xt.Name
      }, d.source && (d.source.evaluated = (0, Xt.stringify)(d.evaluated));
    }
    return e.validate = d, e;
  } catch (f) {
    throw delete e.validate, delete e.validateName, l && this.logger.error("Error compiling schema, function code:", l), f;
  } finally {
    this._compilations.delete(e);
  }
}
Tt.compileSchema = Ul;
function y_(e, t, n) {
  var r;
  n = (0, nn.resolveUrl)(this.opts.uriResolver, t, n);
  const i = e.refs[n];
  if (i)
    return i;
  let o = __.call(this, e, n);
  if (o === void 0) {
    const s = (r = e.localRefs) === null || r === void 0 ? void 0 : r[n], { schemaId: a } = this.opts;
    s && (o = new aa({ schema: s, schemaId: a, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[n] = v_.call(this, o);
}
Tt.resolveRef = y_;
function v_(e) {
  return (0, nn.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Ul.call(this, e);
}
function lm(e) {
  for (const t of this._compilations)
    if (E_(t, e))
      return t;
}
Tt.getCompilingSchema = lm;
function E_(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function __(e, t) {
  let n;
  for (; typeof (n = this.refs[t]) == "string"; )
    t = n;
  return n || this.schemas[t] || ca.call(this, e, t);
}
function ca(e, t) {
  const n = this.opts.uriResolver.parse(t), r = (0, nn._getFullPath)(this.opts.uriResolver, n);
  let i = (0, nn.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && r === i)
    return rc.call(this, n, e);
  const o = (0, nn.normalizeId)(r), s = this.refs[o] || this.schemas[o];
  if (typeof s == "string") {
    const a = ca.call(this, e, s);
    return typeof (a == null ? void 0 : a.schema) != "object" ? void 0 : rc.call(this, n, a);
  }
  if (typeof (s == null ? void 0 : s.schema) == "object") {
    if (s.validate || Ul.call(this, s), o === (0, nn.normalizeId)(t)) {
      const { schema: a } = s, { schemaId: c } = this.opts, u = a[c];
      return u && (i = (0, nn.resolveUrl)(this.opts.uriResolver, i, u)), new aa({ schema: a, schemaId: c, root: e, baseId: i });
    }
    return rc.call(this, n, s);
  }
}
Tt.resolveSchema = ca;
const w_ = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function rc(e, { baseId: t, schema: n, root: r }) {
  var i;
  if (((i = e.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const a of e.fragment.slice(1).split("/")) {
    if (typeof n == "boolean")
      return;
    const c = n[(0, Mf.unescapeFragment)(a)];
    if (c === void 0)
      return;
    n = c;
    const u = typeof n == "object" && n[this.opts.schemaId];
    !w_.has(a) && u && (t = (0, nn.resolveUrl)(this.opts.uriResolver, t, u));
  }
  let o;
  if (typeof n != "boolean" && n.$ref && !(0, Mf.schemaHasRulesButRef)(n, this.RULES)) {
    const a = (0, nn.resolveUrl)(this.opts.uriResolver, t, n.$ref);
    o = ca.call(this, r, a);
  }
  const { schemaId: s } = this.opts;
  if (o = o || new aa({ schema: n, schemaId: s, root: r, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const $_ = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", S_ = "Meta-schema for $data reference (JSON AnySchema extension proposal)", b_ = "object", A_ = [
  "$data"
], T_ = {
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
}, C_ = !1, N_ = {
  $id: $_,
  description: S_,
  type: b_,
  required: A_,
  properties: T_,
  additionalProperties: C_
};
var jl = {}, la = { exports: {} };
const I_ = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), um = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
function fm(e) {
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
const P_ = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function Bf(e) {
  return e.length = 0, !0;
}
function O_(e, t, n) {
  if (e.length) {
    const r = fm(e);
    if (r !== "")
      t.push(r);
    else
      return n.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function R_(e) {
  let t = 0;
  const n = { error: !1, address: "", zone: "" }, r = [], i = [];
  let o = !1, s = !1, a = O_;
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
        a = Bf;
      } else {
        i.push(u);
        continue;
      }
  }
  return i.length && (a === Bf ? n.zone = i.join("") : s ? r.push(i.join("")) : r.push(fm(i))), n.address = r.join(""), n;
}
function dm(e) {
  if (D_(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = R_(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let n = t.address, r = t.address;
    return t.zone && (n += "%" + t.zone, r += "%25" + t.zone), { host: n, isIPV6: !0, escapedHost: r };
  }
}
function D_(e, t) {
  let n = 0;
  for (let r = 0; r < e.length; r++)
    e[r] === t && n++;
  return n;
}
function F_(e) {
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
function L_(e, t) {
  const n = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = n(e.scheme)), e.userinfo !== void 0 && (e.userinfo = n(e.userinfo)), e.host !== void 0 && (e.host = n(e.host)), e.path !== void 0 && (e.path = n(e.path)), e.query !== void 0 && (e.query = n(e.query)), e.fragment !== void 0 && (e.fragment = n(e.fragment)), e;
}
function x_(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let n = unescape(e.host);
    if (!um(n)) {
      const r = dm(n);
      r.isIPV6 === !0 ? n = `[${r.escapedHost}]` : n = e.host;
    }
    t.push(n);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var hm = {
  nonSimpleDomain: P_,
  recomposeAuthority: x_,
  normalizeComponentEncoding: L_,
  removeDotSegments: F_,
  isIPv4: um,
  isUUID: I_,
  normalizeIPv6: dm
};
const { isUUID: k_ } = hm, U_ = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function pm(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function mm(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function gm(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function j_(e) {
  return e.secure = pm(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function M_(e) {
  if ((e.port === (pm(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, n] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = n, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function B_(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const n = e.path.match(U_);
  if (n) {
    const r = t.scheme || e.scheme || "urn";
    e.nid = n[1].toLowerCase(), e.nss = n[2];
    const i = `${r}:${t.nid || e.nid}`, o = Ml(i);
    e.path = void 0, o && (e = o.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function H_(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const n = t.scheme || e.scheme || "urn", r = e.nid.toLowerCase(), i = `${n}:${t.nid || r}`, o = Ml(i);
  o && (e = o.serialize(e, t));
  const s = e, a = e.nss;
  return s.path = `${r || t.nid}:${a}`, t.skipEscape = !0, s;
}
function q_(e, t) {
  const n = e;
  return n.uuid = n.nss, n.nss = void 0, !t.tolerant && (!n.uuid || !k_(n.uuid)) && (n.error = n.error || "UUID is not valid."), n;
}
function z_(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const ym = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: mm,
    serialize: gm
  }
), V_ = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: ym.domainHost,
    parse: mm,
    serialize: gm
  }
), Cs = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: j_,
    serialize: M_
  }
), G_ = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: Cs.domainHost,
    parse: Cs.parse,
    serialize: Cs.serialize
  }
), W_ = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: B_,
    serialize: H_,
    skipNormalize: !0
  }
), K_ = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: q_,
    serialize: z_,
    skipNormalize: !0
  }
), Us = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: ym,
    https: V_,
    ws: Cs,
    wss: G_,
    urn: W_,
    "urn:uuid": K_
  }
);
Object.setPrototypeOf(Us, null);
function Ml(e) {
  return e && (Us[
    /** @type {SchemeName} */
    e
  ] || Us[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var J_ = {
  SCHEMES: Us,
  getSchemeHandler: Ml
};
const { normalizeIPv6: Y_, removeDotSegments: Ji, recomposeAuthority: X_, normalizeComponentEncoding: Zo, isIPv4: Z_, nonSimpleDomain: Q_ } = hm, { SCHEMES: ew, getSchemeHandler: vm } = J_;
function tw(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  hn(Cn(e, t), t) : typeof e == "object" && (e = /** @type {T} */
  Cn(hn(e, t), t)), e;
}
function nw(e, t, n) {
  const r = n ? Object.assign({ scheme: "null" }, n) : { scheme: "null" }, i = Em(Cn(e, r), Cn(t, r), r, !0);
  return r.skipEscape = !0, hn(i, r);
}
function Em(e, t, n, r) {
  const i = {};
  return r || (e = Cn(hn(e, n), n), t = Cn(hn(t, n), n)), n = n || {}, !n.tolerant && t.scheme ? (i.scheme = t.scheme, i.userinfo = t.userinfo, i.host = t.host, i.port = t.port, i.path = Ji(t.path || ""), i.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (i.userinfo = t.userinfo, i.host = t.host, i.port = t.port, i.path = Ji(t.path || ""), i.query = t.query) : (t.path ? (t.path[0] === "/" ? i.path = Ji(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? i.path = "/" + t.path : e.path ? i.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : i.path = t.path, i.path = Ji(i.path)), i.query = t.query) : (i.path = e.path, t.query !== void 0 ? i.query = t.query : i.query = e.query), i.userinfo = e.userinfo, i.host = e.host, i.port = e.port), i.scheme = e.scheme), i.fragment = t.fragment, i;
}
function rw(e, t, n) {
  return typeof e == "string" ? (e = unescape(e), e = hn(Zo(Cn(e, n), !0), { ...n, skipEscape: !0 })) : typeof e == "object" && (e = hn(Zo(e, !0), { ...n, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = hn(Zo(Cn(t, n), !0), { ...n, skipEscape: !0 })) : typeof t == "object" && (t = hn(Zo(t, !0), { ...n, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
}
function hn(e, t) {
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
  }, r = Object.assign({}, t), i = [], o = vm(r.scheme || n.scheme);
  o && o.serialize && o.serialize(n, r), n.path !== void 0 && (r.skipEscape ? n.path = unescape(n.path) : (n.path = escape(n.path), n.scheme !== void 0 && (n.path = n.path.split("%3A").join(":")))), r.reference !== "suffix" && n.scheme && i.push(n.scheme, ":");
  const s = X_(n);
  if (s !== void 0 && (r.reference !== "suffix" && i.push("//"), i.push(s), n.path && n.path[0] !== "/" && i.push("/")), n.path !== void 0) {
    let a = n.path;
    !r.absolutePath && (!o || !o.absolutePath) && (a = Ji(a)), s === void 0 && a[0] === "/" && a[1] === "/" && (a = "/%2F" + a.slice(2)), i.push(a);
  }
  return n.query !== void 0 && i.push("?", n.query), n.fragment !== void 0 && i.push("#", n.fragment), i.join("");
}
const iw = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Cn(e, t) {
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
  const o = e.match(iw);
  if (o) {
    if (r.scheme = o[1], r.userinfo = o[3], r.host = o[4], r.port = parseInt(o[5], 10), r.path = o[6] || "", r.query = o[7], r.fragment = o[8], isNaN(r.port) && (r.port = o[5]), r.host)
      if (Z_(r.host) === !1) {
        const c = Y_(r.host);
        r.host = c.host.toLowerCase(), i = c.isIPV6;
      } else
        i = !0;
    r.scheme === void 0 && r.userinfo === void 0 && r.host === void 0 && r.port === void 0 && r.query === void 0 && !r.path ? r.reference = "same-document" : r.scheme === void 0 ? r.reference = "relative" : r.fragment === void 0 ? r.reference = "absolute" : r.reference = "uri", n.reference && n.reference !== "suffix" && n.reference !== r.reference && (r.error = r.error || "URI is not a " + n.reference + " reference.");
    const s = vm(n.scheme || r.scheme);
    if (!n.unicodeSupport && (!s || !s.unicodeSupport) && r.host && (n.domainHost || s && s.domainHost) && i === !1 && Q_(r.host))
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
const Bl = {
  SCHEMES: ew,
  normalize: tw,
  resolve: nw,
  resolveComponent: Em,
  equal: rw,
  serialize: hn,
  parse: Cn
};
la.exports = Bl;
la.exports.default = Bl;
la.exports.fastUri = Bl;
var ow = la.exports;
Object.defineProperty(jl, "__esModule", { value: !0 });
const _m = ow;
_m.code = 'require("ajv/dist/runtime/uri").default';
jl.default = _m;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Kt;
  Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
    return t.KeywordCxt;
  } });
  var n = le;
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
  const r = $i, i = kr, o = Dr, s = Tt, a = le, c = ct, u = Ze, l = Q, f = N_, h = jl, d = (B, N) => new RegExp(B, N);
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
  function w(B) {
    var N, R, O, $, T, M, re, te, ye, pe, Re, _, E, U, I, me, be, Te, ke, Ue, et, Oe, X, ve, Ee;
    const we = B.strict, Ce = (N = B.code) === null || N === void 0 ? void 0 : N.optimize, ft = Ce === !0 || Ce === void 0 ? 1 : Ce || 0, tt = (O = (R = B.code) === null || R === void 0 ? void 0 : R.regExp) !== null && O !== void 0 ? O : d, dt = ($ = B.uriResolver) !== null && $ !== void 0 ? $ : h.default;
    return {
      strictSchema: (M = (T = B.strictSchema) !== null && T !== void 0 ? T : we) !== null && M !== void 0 ? M : !0,
      strictNumbers: (te = (re = B.strictNumbers) !== null && re !== void 0 ? re : we) !== null && te !== void 0 ? te : !0,
      strictTypes: (pe = (ye = B.strictTypes) !== null && ye !== void 0 ? ye : we) !== null && pe !== void 0 ? pe : "log",
      strictTuples: (_ = (Re = B.strictTuples) !== null && Re !== void 0 ? Re : we) !== null && _ !== void 0 ? _ : "log",
      strictRequired: (U = (E = B.strictRequired) !== null && E !== void 0 ? E : we) !== null && U !== void 0 ? U : !1,
      code: B.code ? { ...B.code, optimize: ft, regExp: tt } : { optimize: ft, regExp: tt },
      loopRequired: (I = B.loopRequired) !== null && I !== void 0 ? I : g,
      loopEnum: (me = B.loopEnum) !== null && me !== void 0 ? me : g,
      meta: (be = B.meta) !== null && be !== void 0 ? be : !0,
      messages: (Te = B.messages) !== null && Te !== void 0 ? Te : !0,
      inlineRefs: (ke = B.inlineRefs) !== null && ke !== void 0 ? ke : !0,
      schemaId: (Ue = B.schemaId) !== null && Ue !== void 0 ? Ue : "$id",
      addUsedSchema: (et = B.addUsedSchema) !== null && et !== void 0 ? et : !0,
      validateSchema: (Oe = B.validateSchema) !== null && Oe !== void 0 ? Oe : !0,
      validateFormats: (X = B.validateFormats) !== null && X !== void 0 ? X : !0,
      unicodeRegExp: (ve = B.unicodeRegExp) !== null && ve !== void 0 ? ve : !0,
      int32range: (Ee = B.int32range) !== null && Ee !== void 0 ? Ee : !0,
      uriResolver: dt
    };
  }
  class A {
    constructor(N = {}) {
      this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), N = this.opts = { ...N, ...w(N) };
      const { es5: R, lines: O } = this.opts.code;
      this.scope = new a.ValueScope({ scope: {}, prefixes: p, es5: R, lines: O }), this.logger = V(N.logger);
      const $ = N.validateFormats;
      N.validateFormats = !1, this.RULES = (0, o.getRules)(), C.call(this, v, N, "NOT SUPPORTED"), C.call(this, y, N, "DEPRECATED", "warn"), this._metaOpts = S.call(this), N.formats && K.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), N.keywords && H.call(this, N.keywords), typeof N.meta == "object" && this.addMetaSchema(N.meta), q.call(this), N.validateFormats = $;
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
      async function $(pe, Re) {
        await T.call(this, pe.$schema);
        const _ = this._addSchema(pe, Re);
        return _.validate || M.call(this, _);
      }
      async function T(pe) {
        pe && !this.getSchema(pe) && await $.call(this, { $ref: pe }, !0);
      }
      async function M(pe) {
        try {
          return this._compileSchemaEnv(pe);
        } catch (Re) {
          if (!(Re instanceof i.default))
            throw Re;
          return re.call(this, Re), await te.call(this, Re.missingSchema), M.call(this, pe);
        }
      }
      function re({ missingSchema: pe, missingRef: Re }) {
        if (this.refs[pe])
          throw new Error(`AnySchema ${pe} is loaded but ${Re} cannot be resolved`);
      }
      async function te(pe) {
        const Re = await ye.call(this, pe);
        this.refs[pe] || await T.call(this, Re.$schema), this.refs[pe] || this.addSchema(Re, pe, R);
      }
      async function ye(pe) {
        const Re = this._loading[pe];
        if (Re)
          return Re;
        try {
          return await (this._loading[pe] = O(pe));
        } finally {
          delete this._loading[pe];
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
      for (; typeof (R = F.call(this, N)) == "string"; )
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
          const R = F.call(this, N);
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
      if (D.call(this, O, R), !R)
        return (0, l.eachItem)(O, (T) => L.call(this, T)), this;
      z.call(this, R);
      const $ = {
        ...R,
        type: (0, u.getJSONTypes)(R.type),
        schemaType: (0, u.getJSONTypes)(R.schemaType)
      };
      return (0, l.eachItem)(O, $.type.length === 0 ? (T) => L.call(this, T, $) : (T) => $.type.forEach((M) => L.call(this, T, $, M))), this;
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
        for (const re of T)
          M = M[re];
        for (const re in O) {
          const te = O[re];
          if (typeof te != "object")
            continue;
          const { $data: ye } = te.definition, pe = M[re];
          ye && pe && (M[re] = J(pe));
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
      const { schemaId: re } = this.opts;
      if (typeof N == "object")
        M = N[re];
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
      const ye = c.getSchemaRefs.call(this, N, O);
      return te = new s.SchemaEnv({ schema: N, schemaId: re, meta: R, baseId: O, localRefs: ye }), this._cache.set(te.schema, te), T && !O.startsWith("#") && (O && this._checkUnique(O), this.refs[O] = te), $ && this.validateSchema(N, !0), te;
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
  A.ValidationError = r.default, A.MissingRefError = i.default, e.default = A;
  function C(B, N, R, O = "error") {
    for (const $ in B) {
      const T = $;
      T in N && this.logger[O](`${R}: option ${$}. ${B[T]}`);
    }
  }
  function F(B) {
    return B = (0, c.normalizeId)(B), this.schemas[B] || this.refs[B];
  }
  function q() {
    const B = this.opts.schemas;
    if (B)
      if (Array.isArray(B))
        this.addSchema(B);
      else
        for (const N in B)
          this.addSchema(B[N], N);
  }
  function K() {
    for (const B in this.opts.formats) {
      const N = this.opts.formats[B];
      N && this.addFormat(B, N);
    }
  }
  function H(B) {
    if (Array.isArray(B)) {
      this.addVocabulary(B);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const N in B) {
      const R = B[N];
      R.keyword || (R.keyword = N), this.addKeyword(R);
    }
  }
  function S() {
    const B = { ...this.opts };
    for (const N of m)
      delete B[N];
    return B;
  }
  const j = { log() {
  }, warn() {
  }, error() {
  } };
  function V(B) {
    if (B === !1)
      return j;
    if (B === void 0)
      return console;
    if (B.log && B.warn && B.error)
      return B;
    throw new Error("logger must implement log, warn and error methods");
  }
  const Z = /^[a-z_$][a-z0-9_$:-]*$/i;
  function D(B, N) {
    const { RULES: R } = this;
    if ((0, l.eachItem)(B, (O) => {
      if (R.keywords[O])
        throw new Error(`Keyword ${O} is already defined`);
      if (!Z.test(O))
        throw new Error(`Keyword ${O} has invalid name`);
    }), !!N && N.$data && !("code" in N || "validate" in N))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function L(B, N, R) {
    var O;
    const $ = N == null ? void 0 : N.post;
    if (R && $)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: T } = this;
    let M = $ ? T.post : T.rules.find(({ type: te }) => te === R);
    if (M || (M = { type: R, rules: [] }, T.rules.push(M)), T.keywords[B] = !0, !N)
      return;
    const re = {
      keyword: B,
      definition: {
        ...N,
        type: (0, u.getJSONTypes)(N.type),
        schemaType: (0, u.getJSONTypes)(N.schemaType)
      }
    };
    N.before ? G.call(this, M, re, N.before) : M.rules.push(re), T.all[B] = re, (O = N.implements) === null || O === void 0 || O.forEach((te) => this.addKeyword(te));
  }
  function G(B, N, R) {
    const O = B.rules.findIndex(($) => $.keyword === R);
    O >= 0 ? B.rules.splice(O, 0, N) : (B.rules.push(N), this.logger.warn(`rule ${R} is not defined`));
  }
  function z(B) {
    let { metaSchema: N } = B;
    N !== void 0 && (B.$data && this.opts.$data && (N = J(N)), B.validateSchema = this.compile(N, !0));
  }
  const Y = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function J(B) {
    return { anyOf: [B, Y] };
  }
})(Nl);
var Hl = {}, ua = {}, ql = {};
Object.defineProperty(ql, "__esModule", { value: !0 });
const sw = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
ql.default = sw;
var Nn = {};
Object.defineProperty(Nn, "__esModule", { value: !0 });
Nn.callRef = Nn.getValidate = void 0;
const aw = kr, Hf = ge, xt = le, zr = Ht, qf = Tt, Qo = Q, cw = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: n, it: r } = e, { baseId: i, schemaEnv: o, validateName: s, opts: a, self: c } = r, { root: u } = o;
    if ((n === "#" || n === "#/") && i === u.baseId)
      return f();
    const l = qf.resolveRef.call(c, u, i, n);
    if (l === void 0)
      throw new aw.default(r.opts.uriResolver, i, n);
    if (l instanceof qf.SchemaEnv)
      return h(l);
    return d(l);
    function f() {
      if (o === u)
        return Ns(e, s, o, o.$async);
      const m = t.scopeValue("root", { ref: u });
      return Ns(e, (0, xt._)`${m}.validate`, u, u.$async);
    }
    function h(m) {
      const p = wm(e, m);
      Ns(e, p, m, m.$async);
    }
    function d(m) {
      const p = t.scopeValue("schema", a.code.source === !0 ? { ref: m, code: (0, xt.stringify)(m) } : { ref: m }), v = t.name("valid"), y = e.subschema({
        schema: m,
        dataTypes: [],
        schemaPath: xt.nil,
        topSchemaRef: p,
        errSchemaPath: n
      }, v);
      e.mergeEvaluated(y), e.ok(v);
    }
  }
};
function wm(e, t) {
  const { gen: n } = e;
  return t.validate ? n.scopeValue("validate", { ref: t.validate }) : (0, xt._)`${n.scopeValue("wrapper", { ref: t })}.validate`;
}
Nn.getValidate = wm;
function Ns(e, t, n, r) {
  const { gen: i, it: o } = e, { allErrors: s, schemaEnv: a, opts: c } = o, u = c.passContext ? zr.default.this : xt.nil;
  r ? l() : f();
  function l() {
    if (!a.$async)
      throw new Error("async schema referenced by sync schema");
    const m = i.let("valid");
    i.try(() => {
      i.code((0, xt._)`await ${(0, Hf.callValidateCode)(e, t, u)}`), d(t), s || i.assign(m, !0);
    }, (p) => {
      i.if((0, xt._)`!(${p} instanceof ${o.ValidationError})`, () => i.throw(p)), h(p), s || i.assign(m, !1);
    }), e.ok(m);
  }
  function f() {
    e.result((0, Hf.callValidateCode)(e, t, u), () => d(t), () => h(t));
  }
  function h(m) {
    const p = (0, xt._)`${m}.errors`;
    i.assign(zr.default.vErrors, (0, xt._)`${zr.default.vErrors} === null ? ${p} : ${zr.default.vErrors}.concat(${p})`), i.assign(zr.default.errors, (0, xt._)`${zr.default.vErrors}.length`);
  }
  function d(m) {
    var p;
    if (!o.opts.unevaluated)
      return;
    const v = (p = n == null ? void 0 : n.validate) === null || p === void 0 ? void 0 : p.evaluated;
    if (o.props !== !0)
      if (v && !v.dynamicProps)
        v.props !== void 0 && (o.props = Qo.mergeEvaluated.props(i, v.props, o.props));
      else {
        const y = i.var("props", (0, xt._)`${m}.evaluated.props`);
        o.props = Qo.mergeEvaluated.props(i, y, o.props, xt.Name);
      }
    if (o.items !== !0)
      if (v && !v.dynamicItems)
        v.items !== void 0 && (o.items = Qo.mergeEvaluated.items(i, v.items, o.items));
      else {
        const y = i.var("items", (0, xt._)`${m}.evaluated.items`);
        o.items = Qo.mergeEvaluated.items(i, y, o.items, xt.Name);
      }
  }
}
Nn.callRef = Ns;
Nn.default = cw;
Object.defineProperty(ua, "__esModule", { value: !0 });
const lw = ql, uw = Nn, fw = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  lw.default,
  uw.default
];
ua.default = fw;
var fa = {}, zl = {};
Object.defineProperty(zl, "__esModule", { value: !0 });
const js = le, kn = js.operators, Ms = {
  maximum: { okStr: "<=", ok: kn.LTE, fail: kn.GT },
  minimum: { okStr: ">=", ok: kn.GTE, fail: kn.LT },
  exclusiveMaximum: { okStr: "<", ok: kn.LT, fail: kn.GTE },
  exclusiveMinimum: { okStr: ">", ok: kn.GT, fail: kn.LTE }
}, dw = {
  message: ({ keyword: e, schemaCode: t }) => (0, js.str)`must be ${Ms[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, js._)`{comparison: ${Ms[e].okStr}, limit: ${t}}`
}, hw = {
  keyword: Object.keys(Ms),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: dw,
  code(e) {
    const { keyword: t, data: n, schemaCode: r } = e;
    e.fail$data((0, js._)`${n} ${Ms[t].fail} ${r} || isNaN(${n})`);
  }
};
zl.default = hw;
var Vl = {};
Object.defineProperty(Vl, "__esModule", { value: !0 });
const eo = le, pw = {
  message: ({ schemaCode: e }) => (0, eo.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, eo._)`{multipleOf: ${e}}`
}, mw = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: pw,
  code(e) {
    const { gen: t, data: n, schemaCode: r, it: i } = e, o = i.opts.multipleOfPrecision, s = t.let("res"), a = o ? (0, eo._)`Math.abs(Math.round(${s}) - ${s}) > 1e-${o}` : (0, eo._)`${s} !== parseInt(${s})`;
    e.fail$data((0, eo._)`(${r} === 0 || (${s} = ${n}/${r}, ${a}))`);
  }
};
Vl.default = mw;
var Gl = {}, Wl = {};
Object.defineProperty(Wl, "__esModule", { value: !0 });
function $m(e) {
  const t = e.length;
  let n = 0, r = 0, i;
  for (; r < t; )
    n++, i = e.charCodeAt(r++), i >= 55296 && i <= 56319 && r < t && (i = e.charCodeAt(r), (i & 64512) === 56320 && r++);
  return n;
}
Wl.default = $m;
$m.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Gl, "__esModule", { value: !0 });
const _r = le, gw = Q, yw = Wl, vw = {
  message({ keyword: e, schemaCode: t }) {
    const n = e === "maxLength" ? "more" : "fewer";
    return (0, _r.str)`must NOT have ${n} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, _r._)`{limit: ${e}}`
}, Ew = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: vw,
  code(e) {
    const { keyword: t, data: n, schemaCode: r, it: i } = e, o = t === "maxLength" ? _r.operators.GT : _r.operators.LT, s = i.opts.unicode === !1 ? (0, _r._)`${n}.length` : (0, _r._)`${(0, gw.useFunc)(e.gen, yw.default)}(${n})`;
    e.fail$data((0, _r._)`${s} ${o} ${r}`);
  }
};
Gl.default = Ew;
var Kl = {};
Object.defineProperty(Kl, "__esModule", { value: !0 });
const _w = ge, ww = Q, oi = le, $w = {
  message: ({ schemaCode: e }) => (0, oi.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, oi._)`{pattern: ${e}}`
}, Sw = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: $w,
  code(e) {
    const { gen: t, data: n, $data: r, schema: i, schemaCode: o, it: s } = e, a = s.opts.unicodeRegExp ? "u" : "";
    if (r) {
      const { regExp: c } = s.opts.code, u = c.code === "new RegExp" ? (0, oi._)`new RegExp` : (0, ww.useFunc)(t, c), l = t.let("valid");
      t.try(() => t.assign(l, (0, oi._)`${u}(${o}, ${a}).test(${n})`), () => t.assign(l, !1)), e.fail$data((0, oi._)`!${l}`);
    } else {
      const c = (0, _w.usePattern)(e, i);
      e.fail$data((0, oi._)`!${c}.test(${n})`);
    }
  }
};
Kl.default = Sw;
var Jl = {};
Object.defineProperty(Jl, "__esModule", { value: !0 });
const to = le, bw = {
  message({ keyword: e, schemaCode: t }) {
    const n = e === "maxProperties" ? "more" : "fewer";
    return (0, to.str)`must NOT have ${n} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, to._)`{limit: ${e}}`
}, Aw = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: bw,
  code(e) {
    const { keyword: t, data: n, schemaCode: r } = e, i = t === "maxProperties" ? to.operators.GT : to.operators.LT;
    e.fail$data((0, to._)`Object.keys(${n}).length ${i} ${r}`);
  }
};
Jl.default = Aw;
var Yl = {};
Object.defineProperty(Yl, "__esModule", { value: !0 });
const Bi = ge, no = le, Tw = Q, Cw = {
  message: ({ params: { missingProperty: e } }) => (0, no.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, no._)`{missingProperty: ${e}}`
}, Nw = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: Cw,
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
          (0, Tw.checkStrictMode)(s, y, s.opts.strictRequired);
        }
    }
    function u() {
      if (c || o)
        e.block$data(no.nil, f);
      else
        for (const d of n)
          (0, Bi.checkReportMissingProp)(e, d);
    }
    function l() {
      const d = t.let("missing");
      if (c || o) {
        const m = t.let("valid", !0);
        e.block$data(m, () => h(d, m)), e.ok(m);
      } else
        t.if((0, Bi.checkMissingProp)(e, n, d)), (0, Bi.reportMissingProp)(e, d), t.else();
    }
    function f() {
      t.forOf("prop", r, (d) => {
        e.setParams({ missingProperty: d }), t.if((0, Bi.noPropertyInData)(t, i, d, a.ownProperties), () => e.error());
      });
    }
    function h(d, m) {
      e.setParams({ missingProperty: d }), t.forOf(d, r, () => {
        t.assign(m, (0, Bi.propertyInData)(t, i, d, a.ownProperties)), t.if((0, no.not)(m), () => {
          e.error(), t.break();
        });
      }, no.nil);
    }
  }
};
Yl.default = Nw;
var Xl = {};
Object.defineProperty(Xl, "__esModule", { value: !0 });
const ro = le, Iw = {
  message({ keyword: e, schemaCode: t }) {
    const n = e === "maxItems" ? "more" : "fewer";
    return (0, ro.str)`must NOT have ${n} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, ro._)`{limit: ${e}}`
}, Pw = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: Iw,
  code(e) {
    const { keyword: t, data: n, schemaCode: r } = e, i = t === "maxItems" ? ro.operators.GT : ro.operators.LT;
    e.fail$data((0, ro._)`${n}.length ${i} ${r}`);
  }
};
Xl.default = Pw;
var Zl = {}, Io = {};
Object.defineProperty(Io, "__esModule", { value: !0 });
const Sm = Wp;
Sm.code = 'require("ajv/dist/runtime/equal").default';
Io.default = Sm;
Object.defineProperty(Zl, "__esModule", { value: !0 });
const ic = Ze, at = le, Ow = Q, Rw = Io, Dw = {
  message: ({ params: { i: e, j: t } }) => (0, at.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, at._)`{i: ${e}, j: ${t}}`
}, Fw = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: Dw,
  code(e) {
    const { gen: t, data: n, $data: r, schema: i, parentSchema: o, schemaCode: s, it: a } = e;
    if (!r && !i)
      return;
    const c = t.let("valid"), u = o.items ? (0, ic.getSchemaTypes)(o.items) : [];
    e.block$data(c, l, (0, at._)`${s} === false`), e.ok(c);
    function l() {
      const m = t.let("i", (0, at._)`${n}.length`), p = t.let("j");
      e.setParams({ i: m, j: p }), t.assign(c, !0), t.if((0, at._)`${m} > 1`, () => (f() ? h : d)(m, p));
    }
    function f() {
      return u.length > 0 && !u.some((m) => m === "object" || m === "array");
    }
    function h(m, p) {
      const v = t.name("item"), y = (0, ic.checkDataTypes)(u, v, a.opts.strictNumbers, ic.DataType.Wrong), g = t.const("indices", (0, at._)`{}`);
      t.for((0, at._)`;${m}--;`, () => {
        t.let(v, (0, at._)`${n}[${m}]`), t.if(y, (0, at._)`continue`), u.length > 1 && t.if((0, at._)`typeof ${v} == "string"`, (0, at._)`${v} += "_"`), t.if((0, at._)`typeof ${g}[${v}] == "number"`, () => {
          t.assign(p, (0, at._)`${g}[${v}]`), e.error(), t.assign(c, !1).break();
        }).code((0, at._)`${g}[${v}] = ${m}`);
      });
    }
    function d(m, p) {
      const v = (0, Ow.useFunc)(t, Rw.default), y = t.name("outer");
      t.label(y).for((0, at._)`;${m}--;`, () => t.for((0, at._)`${p} = ${m}; ${p}--;`, () => t.if((0, at._)`${v}(${n}[${m}], ${n}[${p}])`, () => {
        e.error(), t.assign(c, !1).break(y);
      })));
    }
  }
};
Zl.default = Fw;
var Ql = {};
Object.defineProperty(Ql, "__esModule", { value: !0 });
const el = le, Lw = Q, xw = Io, kw = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, el._)`{allowedValue: ${e}}`
}, Uw = {
  keyword: "const",
  $data: !0,
  error: kw,
  code(e) {
    const { gen: t, data: n, $data: r, schemaCode: i, schema: o } = e;
    r || o && typeof o == "object" ? e.fail$data((0, el._)`!${(0, Lw.useFunc)(t, xw.default)}(${n}, ${i})`) : e.fail((0, el._)`${o} !== ${n}`);
  }
};
Ql.default = Uw;
var eu = {};
Object.defineProperty(eu, "__esModule", { value: !0 });
const Yi = le, jw = Q, Mw = Io, Bw = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, Yi._)`{allowedValues: ${e}}`
}, Hw = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: Bw,
  code(e) {
    const { gen: t, data: n, $data: r, schema: i, schemaCode: o, it: s } = e;
    if (!r && i.length === 0)
      throw new Error("enum must have non-empty array");
    const a = i.length >= s.opts.loopEnum;
    let c;
    const u = () => c ?? (c = (0, jw.useFunc)(t, Mw.default));
    let l;
    if (a || r)
      l = t.let("valid"), e.block$data(l, f);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const d = t.const("vSchema", o);
      l = (0, Yi.or)(...i.map((m, p) => h(d, p)));
    }
    e.pass(l);
    function f() {
      t.assign(l, !1), t.forOf("v", o, (d) => t.if((0, Yi._)`${u()}(${n}, ${d})`, () => t.assign(l, !0).break()));
    }
    function h(d, m) {
      const p = i[m];
      return typeof p == "object" && p !== null ? (0, Yi._)`${u()}(${n}, ${d}[${m}])` : (0, Yi._)`${n} === ${p}`;
    }
  }
};
eu.default = Hw;
Object.defineProperty(fa, "__esModule", { value: !0 });
const qw = zl, zw = Vl, Vw = Gl, Gw = Kl, Ww = Jl, Kw = Yl, Jw = Xl, Yw = Zl, Xw = Ql, Zw = eu, Qw = [
  // number
  qw.default,
  zw.default,
  // string
  Vw.default,
  Gw.default,
  // object
  Ww.default,
  Kw.default,
  // array
  Jw.default,
  Yw.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  Xw.default,
  Zw.default
];
fa.default = Qw;
var da = {}, Si = {};
Object.defineProperty(Si, "__esModule", { value: !0 });
Si.validateAdditionalItems = void 0;
const wr = le, tl = Q, e$ = {
  message: ({ params: { len: e } }) => (0, wr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, wr._)`{limit: ${e}}`
}, t$ = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: e$,
  code(e) {
    const { parentSchema: t, it: n } = e, { items: r } = t;
    if (!Array.isArray(r)) {
      (0, tl.checkStrictMode)(n, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    bm(e, r);
  }
};
function bm(e, t) {
  const { gen: n, schema: r, data: i, keyword: o, it: s } = e;
  s.items = !0;
  const a = n.const("len", (0, wr._)`${i}.length`);
  if (r === !1)
    e.setParams({ len: t.length }), e.pass((0, wr._)`${a} <= ${t.length}`);
  else if (typeof r == "object" && !(0, tl.alwaysValidSchema)(s, r)) {
    const u = n.var("valid", (0, wr._)`${a} <= ${t.length}`);
    n.if((0, wr.not)(u), () => c(u)), e.ok(u);
  }
  function c(u) {
    n.forRange("i", t.length, a, (l) => {
      e.subschema({ keyword: o, dataProp: l, dataPropType: tl.Type.Num }, u), s.allErrors || n.if((0, wr.not)(u), () => n.break());
    });
  }
}
Si.validateAdditionalItems = bm;
Si.default = t$;
var tu = {}, bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
bi.validateTuple = void 0;
const zf = le, Is = Q, n$ = ge, r$ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: n } = e;
    if (Array.isArray(t))
      return Am(e, "additionalItems", t);
    n.items = !0, !(0, Is.alwaysValidSchema)(n, t) && e.ok((0, n$.validateArray)(e));
  }
};
function Am(e, t, n = e.schema) {
  const { gen: r, parentSchema: i, data: o, keyword: s, it: a } = e;
  l(i), a.opts.unevaluated && n.length && a.items !== !0 && (a.items = Is.mergeEvaluated.items(r, n.length, a.items));
  const c = r.name("valid"), u = r.const("len", (0, zf._)`${o}.length`);
  n.forEach((f, h) => {
    (0, Is.alwaysValidSchema)(a, f) || (r.if((0, zf._)`${u} > ${h}`, () => e.subschema({
      keyword: s,
      schemaProp: h,
      dataProp: h
    }, c)), e.ok(c));
  });
  function l(f) {
    const { opts: h, errSchemaPath: d } = a, m = n.length, p = m === f.minItems && (m === f.maxItems || f[t] === !1);
    if (h.strictTuples && !p) {
      const v = `"${s}" is ${m}-tuple, but minItems or maxItems/${t} are not specified or different at path "${d}"`;
      (0, Is.checkStrictMode)(a, v, h.strictTuples);
    }
  }
}
bi.validateTuple = Am;
bi.default = r$;
Object.defineProperty(tu, "__esModule", { value: !0 });
const i$ = bi, o$ = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, i$.validateTuple)(e, "items")
};
tu.default = o$;
var nu = {};
Object.defineProperty(nu, "__esModule", { value: !0 });
const Vf = le, s$ = Q, a$ = ge, c$ = Si, l$ = {
  message: ({ params: { len: e } }) => (0, Vf.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Vf._)`{limit: ${e}}`
}, u$ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: l$,
  code(e) {
    const { schema: t, parentSchema: n, it: r } = e, { prefixItems: i } = n;
    r.items = !0, !(0, s$.alwaysValidSchema)(r, t) && (i ? (0, c$.validateAdditionalItems)(e, i) : e.ok((0, a$.validateArray)(e)));
  }
};
nu.default = u$;
var ru = {};
Object.defineProperty(ru, "__esModule", { value: !0 });
const Wt = le, es = Q, f$ = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Wt.str)`must contain at least ${e} valid item(s)` : (0, Wt.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Wt._)`{minContains: ${e}}` : (0, Wt._)`{minContains: ${e}, maxContains: ${t}}`
}, d$ = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: f$,
  code(e) {
    const { gen: t, schema: n, parentSchema: r, data: i, it: o } = e;
    let s, a;
    const { minContains: c, maxContains: u } = r;
    o.opts.next ? (s = c === void 0 ? 1 : c, a = u) : s = 1;
    const l = t.const("len", (0, Wt._)`${i}.length`);
    if (e.setParams({ min: s, max: a }), a === void 0 && s === 0) {
      (0, es.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (a !== void 0 && s > a) {
      (0, es.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, es.alwaysValidSchema)(o, n)) {
      let p = (0, Wt._)`${l} >= ${s}`;
      a !== void 0 && (p = (0, Wt._)`${p} && ${l} <= ${a}`), e.pass(p);
      return;
    }
    o.items = !0;
    const f = t.name("valid");
    a === void 0 && s === 1 ? d(f, () => t.if(f, () => t.break())) : s === 0 ? (t.let(f, !0), a !== void 0 && t.if((0, Wt._)`${i}.length > 0`, h)) : (t.let(f, !1), h()), e.result(f, () => e.reset());
    function h() {
      const p = t.name("_valid"), v = t.let("count", 0);
      d(p, () => t.if(p, () => m(v)));
    }
    function d(p, v) {
      t.forRange("i", 0, l, (y) => {
        e.subschema({
          keyword: "contains",
          dataProp: y,
          dataPropType: es.Type.Num,
          compositeRule: !0
        }, p), v();
      });
    }
    function m(p) {
      t.code((0, Wt._)`${p}++`), a === void 0 ? t.if((0, Wt._)`${p} >= ${s}`, () => t.assign(f, !0).break()) : (t.if((0, Wt._)`${p} > ${a}`, () => t.assign(f, !1).break()), s === 1 ? t.assign(f, !0) : t.if((0, Wt._)`${p} >= ${s}`, () => t.assign(f, !0)));
    }
  }
};
ru.default = d$;
var ha = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = le, n = Q, r = ge;
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
})(ha);
var iu = {};
Object.defineProperty(iu, "__esModule", { value: !0 });
const Tm = le, h$ = Q, p$ = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, Tm._)`{propertyName: ${e.propertyName}}`
}, m$ = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: p$,
  code(e) {
    const { gen: t, schema: n, data: r, it: i } = e;
    if ((0, h$.alwaysValidSchema)(i, n))
      return;
    const o = t.name("valid");
    t.forIn("key", r, (s) => {
      e.setParams({ propertyName: s }), e.subschema({
        keyword: "propertyNames",
        data: s,
        dataTypes: ["string"],
        propertyName: s,
        compositeRule: !0
      }, o), t.if((0, Tm.not)(o), () => {
        e.error(!0), i.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
iu.default = m$;
var pa = {};
Object.defineProperty(pa, "__esModule", { value: !0 });
const ts = ge, en = le, g$ = Ht, ns = Q, y$ = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, en._)`{additionalProperty: ${e.additionalProperty}}`
}, v$ = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: y$,
  code(e) {
    const { gen: t, schema: n, parentSchema: r, data: i, errsCount: o, it: s } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: a, opts: c } = s;
    if (s.props = !0, c.removeAdditional !== "all" && (0, ns.alwaysValidSchema)(s, n))
      return;
    const u = (0, ts.allSchemaProperties)(r.properties), l = (0, ts.allSchemaProperties)(r.patternProperties);
    f(), e.ok((0, en._)`${o} === ${g$.default.errors}`);
    function f() {
      t.forIn("key", i, (v) => {
        !u.length && !l.length ? m(v) : t.if(h(v), () => m(v));
      });
    }
    function h(v) {
      let y;
      if (u.length > 8) {
        const g = (0, ns.schemaRefOrVal)(s, r.properties, "properties");
        y = (0, ts.isOwnProperty)(t, g, v);
      } else u.length ? y = (0, en.or)(...u.map((g) => (0, en._)`${v} === ${g}`)) : y = en.nil;
      return l.length && (y = (0, en.or)(y, ...l.map((g) => (0, en._)`${(0, ts.usePattern)(e, g)}.test(${v})`))), (0, en.not)(y);
    }
    function d(v) {
      t.code((0, en._)`delete ${i}[${v}]`);
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
      if (typeof n == "object" && !(0, ns.alwaysValidSchema)(s, n)) {
        const y = t.name("valid");
        c.removeAdditional === "failing" ? (p(v, y, !1), t.if((0, en.not)(y), () => {
          e.reset(), d(v);
        })) : (p(v, y), a || t.if((0, en.not)(y), () => t.break()));
      }
    }
    function p(v, y, g) {
      const w = {
        keyword: "additionalProperties",
        dataProp: v,
        dataPropType: ns.Type.Str
      };
      g === !1 && Object.assign(w, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(w, y);
    }
  }
};
pa.default = v$;
var ou = {};
Object.defineProperty(ou, "__esModule", { value: !0 });
const E$ = Kt, Gf = ge, oc = Q, Wf = pa, _$ = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: n, parentSchema: r, data: i, it: o } = e;
    o.opts.removeAdditional === "all" && r.additionalProperties === void 0 && Wf.default.code(new E$.KeywordCxt(o, Wf.default, "additionalProperties"));
    const s = (0, Gf.allSchemaProperties)(n);
    for (const f of s)
      o.definedProperties.add(f);
    o.opts.unevaluated && s.length && o.props !== !0 && (o.props = oc.mergeEvaluated.props(t, (0, oc.toHash)(s), o.props));
    const a = s.filter((f) => !(0, oc.alwaysValidSchema)(o, n[f]));
    if (a.length === 0)
      return;
    const c = t.name("valid");
    for (const f of a)
      u(f) ? l(f) : (t.if((0, Gf.propertyInData)(t, i, f, o.opts.ownProperties)), l(f), o.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(f), e.ok(c);
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
ou.default = _$;
var su = {};
Object.defineProperty(su, "__esModule", { value: !0 });
const Kf = ge, rs = le, Jf = Q, Yf = Q, w$ = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: n, data: r, parentSchema: i, it: o } = e, { opts: s } = o, a = (0, Kf.allSchemaProperties)(n), c = a.filter((p) => (0, Jf.alwaysValidSchema)(o, n[p]));
    if (a.length === 0 || c.length === a.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const u = s.strictSchema && !s.allowMatchingProperties && i.properties, l = t.name("valid");
    o.props !== !0 && !(o.props instanceof rs.Name) && (o.props = (0, Yf.evaluatedPropsToName)(t, o.props));
    const { props: f } = o;
    h();
    function h() {
      for (const p of a)
        u && d(p), o.allErrors ? m(p) : (t.var(l, !0), m(p), t.if(l));
    }
    function d(p) {
      for (const v in u)
        new RegExp(p).test(v) && (0, Jf.checkStrictMode)(o, `property ${v} matches pattern ${p} (use allowMatchingProperties)`);
    }
    function m(p) {
      t.forIn("key", r, (v) => {
        t.if((0, rs._)`${(0, Kf.usePattern)(e, p)}.test(${v})`, () => {
          const y = c.includes(p);
          y || e.subschema({
            keyword: "patternProperties",
            schemaProp: p,
            dataProp: v,
            dataPropType: Yf.Type.Str
          }, l), o.opts.unevaluated && f !== !0 ? t.assign((0, rs._)`${f}[${v}]`, !0) : !y && !o.allErrors && t.if((0, rs.not)(l), () => t.break());
        });
      });
    }
  }
};
su.default = w$;
var au = {};
Object.defineProperty(au, "__esModule", { value: !0 });
const $$ = Q, S$ = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: n, it: r } = e;
    if ((0, $$.alwaysValidSchema)(r, n)) {
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
au.default = S$;
var cu = {};
Object.defineProperty(cu, "__esModule", { value: !0 });
const b$ = ge, A$ = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: b$.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
cu.default = A$;
var lu = {};
Object.defineProperty(lu, "__esModule", { value: !0 });
const Ps = le, T$ = Q, C$ = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, Ps._)`{passingSchemas: ${e.passing}}`
}, N$ = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: C$,
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
        (0, T$.alwaysValidSchema)(i, l) ? t.var(c, !0) : h = e.subschema({
          keyword: "oneOf",
          schemaProp: f,
          compositeRule: !0
        }, c), f > 0 && t.if((0, Ps._)`${c} && ${s}`).assign(s, !1).assign(a, (0, Ps._)`[${a}, ${f}]`).else(), t.if(c, () => {
          t.assign(s, !0), t.assign(a, f), h && e.mergeEvaluated(h, Ps.Name);
        });
      });
    }
  }
};
lu.default = N$;
var uu = {};
Object.defineProperty(uu, "__esModule", { value: !0 });
const I$ = Q, P$ = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: n, it: r } = e;
    if (!Array.isArray(n))
      throw new Error("ajv implementation error");
    const i = t.name("valid");
    n.forEach((o, s) => {
      if ((0, I$.alwaysValidSchema)(r, o))
        return;
      const a = e.subschema({ keyword: "allOf", schemaProp: s }, i);
      e.ok(i), e.mergeEvaluated(a);
    });
  }
};
uu.default = P$;
var fu = {};
Object.defineProperty(fu, "__esModule", { value: !0 });
const Bs = le, Cm = Q, O$ = {
  message: ({ params: e }) => (0, Bs.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Bs._)`{failingKeyword: ${e.ifClause}}`
}, R$ = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: O$,
  code(e) {
    const { gen: t, parentSchema: n, it: r } = e;
    n.then === void 0 && n.else === void 0 && (0, Cm.checkStrictMode)(r, '"if" without "then" and "else" is ignored');
    const i = Xf(r, "then"), o = Xf(r, "else");
    if (!i && !o)
      return;
    const s = t.let("valid", !0), a = t.name("_valid");
    if (c(), e.reset(), i && o) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(a, u("then", l), u("else", l));
    } else i ? t.if(a, u("then")) : t.if((0, Bs.not)(a), u("else"));
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
        t.assign(s, a), e.mergeValidEvaluated(h, s), f ? t.assign(f, (0, Bs._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function Xf(e, t) {
  const n = e.schema[t];
  return n !== void 0 && !(0, Cm.alwaysValidSchema)(e, n);
}
fu.default = R$;
var du = {};
Object.defineProperty(du, "__esModule", { value: !0 });
const D$ = Q, F$ = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: n }) {
    t.if === void 0 && (0, D$.checkStrictMode)(n, `"${e}" without "if" is ignored`);
  }
};
du.default = F$;
Object.defineProperty(da, "__esModule", { value: !0 });
const L$ = Si, x$ = tu, k$ = bi, U$ = nu, j$ = ru, M$ = ha, B$ = iu, H$ = pa, q$ = ou, z$ = su, V$ = au, G$ = cu, W$ = lu, K$ = uu, J$ = fu, Y$ = du;
function X$(e = !1) {
  const t = [
    // any
    V$.default,
    G$.default,
    W$.default,
    K$.default,
    J$.default,
    Y$.default,
    // object
    B$.default,
    H$.default,
    M$.default,
    q$.default,
    z$.default
  ];
  return e ? t.push(x$.default, U$.default) : t.push(L$.default, k$.default), t.push(j$.default), t;
}
da.default = X$;
var hu = {}, Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.dynamicAnchor = void 0;
const sc = le, Z$ = Ht, Zf = Tt, Q$ = Nn, eS = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => Nm(e, e.schema)
};
function Nm(e, t) {
  const { gen: n, it: r } = e;
  r.schemaEnv.root.dynamicAnchors[t] = !0;
  const i = (0, sc._)`${Z$.default.dynamicAnchors}${(0, sc.getProperty)(t)}`, o = r.errSchemaPath === "#" ? r.validateName : tS(e);
  n.if((0, sc._)`!${i}`, () => n.assign(i, o));
}
Ai.dynamicAnchor = Nm;
function tS(e) {
  const { schemaEnv: t, schema: n, self: r } = e.it, { root: i, baseId: o, localRefs: s, meta: a } = t.root, { schemaId: c } = r.opts, u = new Zf.SchemaEnv({ schema: n, schemaId: c, root: i, baseId: o, localRefs: s, meta: a });
  return Zf.compileSchema.call(r, u), (0, Q$.getValidate)(e, u);
}
Ai.default = eS;
var Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.dynamicRef = void 0;
const Qf = le, nS = Ht, ed = Nn, rS = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => Im(e, e.schema)
};
function Im(e, t) {
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
      const u = n.let("_v", (0, Qf._)`${nS.default.dynamicAnchors}${(0, Qf.getProperty)(o)}`);
      n.if(u, a(u, c), a(i.validateName, c));
    } else
      a(i.validateName, c)();
  }
  function a(c, u) {
    return u ? () => n.block(() => {
      (0, ed.callRef)(e, c), n.let(u, !0);
    }) : () => (0, ed.callRef)(e, c);
  }
}
Ti.dynamicRef = Im;
Ti.default = rS;
var pu = {};
Object.defineProperty(pu, "__esModule", { value: !0 });
const iS = Ai, oS = Q, sS = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, iS.dynamicAnchor)(e, "") : (0, oS.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
pu.default = sS;
var mu = {};
Object.defineProperty(mu, "__esModule", { value: !0 });
const aS = Ti, cS = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, aS.dynamicRef)(e, e.schema)
};
mu.default = cS;
Object.defineProperty(hu, "__esModule", { value: !0 });
const lS = Ai, uS = Ti, fS = pu, dS = mu, hS = [lS.default, uS.default, fS.default, dS.default];
hu.default = hS;
var gu = {}, yu = {};
Object.defineProperty(yu, "__esModule", { value: !0 });
const td = ha, pS = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: td.error,
  code: (e) => (0, td.validatePropertyDeps)(e)
};
yu.default = pS;
var vu = {};
Object.defineProperty(vu, "__esModule", { value: !0 });
const mS = ha, gS = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, mS.validateSchemaDeps)(e)
};
vu.default = gS;
var Eu = {};
Object.defineProperty(Eu, "__esModule", { value: !0 });
const yS = Q, vS = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: n }) {
    t.contains === void 0 && (0, yS.checkStrictMode)(n, `"${e}" without "contains" is ignored`);
  }
};
Eu.default = vS;
Object.defineProperty(gu, "__esModule", { value: !0 });
const ES = yu, _S = vu, wS = Eu, $S = [ES.default, _S.default, wS.default];
gu.default = $S;
var _u = {}, wu = {};
Object.defineProperty(wu, "__esModule", { value: !0 });
const jn = le, nd = Q, SS = Ht, bS = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, jn._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, AS = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: bS,
  code(e) {
    const { gen: t, schema: n, data: r, errsCount: i, it: o } = e;
    if (!i)
      throw new Error("ajv implementation error");
    const { allErrors: s, props: a } = o;
    a instanceof jn.Name ? t.if((0, jn._)`${a} !== true`, () => t.forIn("key", r, (f) => t.if(u(a, f), () => c(f)))) : a !== !0 && t.forIn("key", r, (f) => a === void 0 ? c(f) : t.if(l(a, f), () => c(f))), o.props = !0, e.ok((0, jn._)`${i} === ${SS.default.errors}`);
    function c(f) {
      if (n === !1) {
        e.setParams({ unevaluatedProperty: f }), e.error(), s || t.break();
        return;
      }
      if (!(0, nd.alwaysValidSchema)(o, n)) {
        const h = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: f,
          dataPropType: nd.Type.Str
        }, h), s || t.if((0, jn.not)(h), () => t.break());
      }
    }
    function u(f, h) {
      return (0, jn._)`!${f} || !${f}[${h}]`;
    }
    function l(f, h) {
      const d = [];
      for (const m in f)
        f[m] === !0 && d.push((0, jn._)`${h} !== ${m}`);
      return (0, jn.and)(...d);
    }
  }
};
wu.default = AS;
var $u = {};
Object.defineProperty($u, "__esModule", { value: !0 });
const $r = le, rd = Q, TS = {
  message: ({ params: { len: e } }) => (0, $r.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, $r._)`{limit: ${e}}`
}, CS = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: TS,
  code(e) {
    const { gen: t, schema: n, data: r, it: i } = e, o = i.items || 0;
    if (o === !0)
      return;
    const s = t.const("len", (0, $r._)`${r}.length`);
    if (n === !1)
      e.setParams({ len: o }), e.fail((0, $r._)`${s} > ${o}`);
    else if (typeof n == "object" && !(0, rd.alwaysValidSchema)(i, n)) {
      const c = t.var("valid", (0, $r._)`${s} <= ${o}`);
      t.if((0, $r.not)(c), () => a(c, o)), e.ok(c);
    }
    i.items = !0;
    function a(c, u) {
      t.forRange("i", u, s, (l) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: rd.Type.Num }, c), i.allErrors || t.if((0, $r.not)(c), () => t.break());
      });
    }
  }
};
$u.default = CS;
Object.defineProperty(_u, "__esModule", { value: !0 });
const NS = wu, IS = $u, PS = [NS.default, IS.default];
_u.default = PS;
var ma = {}, Su = {};
Object.defineProperty(Su, "__esModule", { value: !0 });
const Ke = le, OS = {
  message: ({ schemaCode: e }) => (0, Ke.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, Ke._)`{format: ${e}}`
}, RS = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: OS,
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
      n.if((0, Ke._)`typeof ${p} == "object" && !(${p} instanceof RegExp)`, () => n.assign(v, (0, Ke._)`${p}.type || "string"`).assign(y, (0, Ke._)`${p}.validate`), () => n.assign(v, (0, Ke._)`"string"`).assign(y, p)), e.fail$data((0, Ke.or)(g(), w()));
      function g() {
        return c.strictSchema === !1 ? Ke.nil : (0, Ke._)`${s} && !${y}`;
      }
      function w() {
        const A = l.$async ? (0, Ke._)`(${p}.async ? await ${y}(${r}) : ${y}(${r}))` : (0, Ke._)`${y}(${r})`, C = (0, Ke._)`(typeof ${y} == "function" ? ${A} : ${y}.test(${r}))`;
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
      const [p, v, y] = w(m);
      p === t && e.pass(A());
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
      function w(C) {
        const F = C instanceof RegExp ? (0, Ke.regexpCode)(C) : c.code.formats ? (0, Ke._)`${c.code.formats}${(0, Ke.getProperty)(o)}` : void 0, q = n.scopeValue("formats", { key: o, ref: C, code: F });
        return typeof C == "object" && !(C instanceof RegExp) ? [C.type || "string", C.validate, (0, Ke._)`${q}.validate`] : ["string", C, q];
      }
      function A() {
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
Su.default = RS;
Object.defineProperty(ma, "__esModule", { value: !0 });
const DS = Su, FS = [DS.default];
ma.default = FS;
var Fr = {};
Object.defineProperty(Fr, "__esModule", { value: !0 });
Fr.contentVocabulary = Fr.metadataVocabulary = void 0;
Fr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
Fr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Hl, "__esModule", { value: !0 });
const LS = ua, xS = fa, kS = da, US = hu, jS = gu, MS = _u, BS = ma, id = Fr, HS = [
  US.default,
  LS.default,
  xS.default,
  (0, kS.default)(!0),
  BS.default,
  id.metadataVocabulary,
  id.contentVocabulary,
  jS.default,
  MS.default
];
Hl.default = HS;
var ga = {}, ya = {};
Object.defineProperty(ya, "__esModule", { value: !0 });
ya.DiscrError = void 0;
var od;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(od || (ya.DiscrError = od = {}));
Object.defineProperty(ga, "__esModule", { value: !0 });
const Qr = le, nl = ya, sd = Tt, qS = kr, zS = Q, VS = {
  message: ({ params: { discrError: e, tagName: t } }) => e === nl.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: n } }) => (0, Qr._)`{error: ${e}, tag: ${n}, tagValue: ${t}}`
}, GS = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: VS,
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
    const c = t.let("valid", !1), u = t.const("tag", (0, Qr._)`${n}${(0, Qr.getProperty)(a)}`);
    t.if((0, Qr._)`typeof ${u} == "string"`, () => l(), () => e.error(!1, { discrError: nl.DiscrError.Tag, tag: u, tagName: a })), e.ok(c);
    function l() {
      const d = h();
      t.if(!1);
      for (const m in d)
        t.elseIf((0, Qr._)`${u} === ${m}`), t.assign(c, f(d[m]));
      t.else(), e.error(!1, { discrError: nl.DiscrError.Mapping, tag: u, tagName: a }), t.endIf();
    }
    function f(d) {
      const m = t.name("valid"), p = e.subschema({ keyword: "oneOf", schemaProp: d }, m);
      return e.mergeEvaluated(p, Qr.Name), m;
    }
    function h() {
      var d;
      const m = {}, p = y(i);
      let v = !0;
      for (let A = 0; A < s.length; A++) {
        let C = s[A];
        if (C != null && C.$ref && !(0, zS.schemaHasRulesButRef)(C, o.self.RULES)) {
          const q = C.$ref;
          if (C = sd.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, q), C instanceof sd.SchemaEnv && (C = C.schema), C === void 0)
            throw new qS.default(o.opts.uriResolver, o.baseId, q);
        }
        const F = (d = C == null ? void 0 : C.properties) === null || d === void 0 ? void 0 : d[a];
        if (typeof F != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${a}"`);
        v = v && (p || y(C)), g(F, A);
      }
      if (!v)
        throw new Error(`discriminator: "${a}" must be required`);
      return m;
      function y({ required: A }) {
        return Array.isArray(A) && A.includes(a);
      }
      function g(A, C) {
        if (A.const)
          w(A.const, C);
        else if (A.enum)
          for (const F of A.enum)
            w(F, C);
        else
          throw new Error(`discriminator: "properties/${a}" must have "const" or "enum"`);
      }
      function w(A, C) {
        if (typeof A != "string" || A in m)
          throw new Error(`discriminator: "${a}" values must be unique strings`);
        m[A] = C;
      }
    }
  }
};
ga.default = GS;
var bu = {};
const WS = "https://json-schema.org/draft/2020-12/schema", KS = "https://json-schema.org/draft/2020-12/schema", JS = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, YS = "meta", XS = "Core and Validation specifications meta-schema", ZS = [
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
], QS = [
  "object",
  "boolean"
], eb = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", tb = {
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
}, nb = {
  $schema: WS,
  $id: KS,
  $vocabulary: JS,
  $dynamicAnchor: YS,
  title: XS,
  allOf: ZS,
  type: QS,
  $comment: eb,
  properties: tb
}, rb = "https://json-schema.org/draft/2020-12/schema", ib = "https://json-schema.org/draft/2020-12/meta/applicator", ob = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, sb = "meta", ab = "Applicator vocabulary meta-schema", cb = [
  "object",
  "boolean"
], lb = {
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
}, ub = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, fb = {
  $schema: rb,
  $id: ib,
  $vocabulary: ob,
  $dynamicAnchor: sb,
  title: ab,
  type: cb,
  properties: lb,
  $defs: ub
}, db = "https://json-schema.org/draft/2020-12/schema", hb = "https://json-schema.org/draft/2020-12/meta/unevaluated", pb = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, mb = "meta", gb = "Unevaluated applicator vocabulary meta-schema", yb = [
  "object",
  "boolean"
], vb = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, Eb = {
  $schema: db,
  $id: hb,
  $vocabulary: pb,
  $dynamicAnchor: mb,
  title: gb,
  type: yb,
  properties: vb
}, _b = "https://json-schema.org/draft/2020-12/schema", wb = "https://json-schema.org/draft/2020-12/meta/content", $b = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, Sb = "meta", bb = "Content vocabulary meta-schema", Ab = [
  "object",
  "boolean"
], Tb = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, Cb = {
  $schema: _b,
  $id: wb,
  $vocabulary: $b,
  $dynamicAnchor: Sb,
  title: bb,
  type: Ab,
  properties: Tb
}, Nb = "https://json-schema.org/draft/2020-12/schema", Ib = "https://json-schema.org/draft/2020-12/meta/core", Pb = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, Ob = "meta", Rb = "Core vocabulary meta-schema", Db = [
  "object",
  "boolean"
], Fb = {
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
}, Lb = {
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
}, xb = {
  $schema: Nb,
  $id: Ib,
  $vocabulary: Pb,
  $dynamicAnchor: Ob,
  title: Rb,
  type: Db,
  properties: Fb,
  $defs: Lb
}, kb = "https://json-schema.org/draft/2020-12/schema", Ub = "https://json-schema.org/draft/2020-12/meta/format-annotation", jb = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, Mb = "meta", Bb = "Format vocabulary meta-schema for annotation results", Hb = [
  "object",
  "boolean"
], qb = {
  format: {
    type: "string"
  }
}, zb = {
  $schema: kb,
  $id: Ub,
  $vocabulary: jb,
  $dynamicAnchor: Mb,
  title: Bb,
  type: Hb,
  properties: qb
}, Vb = "https://json-schema.org/draft/2020-12/schema", Gb = "https://json-schema.org/draft/2020-12/meta/meta-data", Wb = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, Kb = "meta", Jb = "Meta-data vocabulary meta-schema", Yb = [
  "object",
  "boolean"
], Xb = {
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
}, Zb = {
  $schema: Vb,
  $id: Gb,
  $vocabulary: Wb,
  $dynamicAnchor: Kb,
  title: Jb,
  type: Yb,
  properties: Xb
}, Qb = "https://json-schema.org/draft/2020-12/schema", eA = "https://json-schema.org/draft/2020-12/meta/validation", tA = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, nA = "meta", rA = "Validation vocabulary meta-schema", iA = [
  "object",
  "boolean"
], oA = {
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
}, sA = {
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
}, aA = {
  $schema: Qb,
  $id: eA,
  $vocabulary: tA,
  $dynamicAnchor: nA,
  title: rA,
  type: iA,
  properties: oA,
  $defs: sA
};
Object.defineProperty(bu, "__esModule", { value: !0 });
const cA = nb, lA = fb, uA = Eb, fA = Cb, dA = xb, hA = zb, pA = Zb, mA = aA, gA = ["/properties"];
function yA(e) {
  return [
    cA,
    lA,
    uA,
    fA,
    dA,
    t(this, hA),
    pA,
    t(this, mA)
  ].forEach((n) => this.addMetaSchema(n, void 0, !1)), this;
  function t(n, r) {
    return e ? n.$dataMetaSchema(r, gA) : r;
  }
}
bu.default = yA;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const n = Nl, r = Hl, i = ga, o = bu, s = "https://json-schema.org/draft/2020-12/schema";
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
  var c = Kt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return c.KeywordCxt;
  } });
  var u = le;
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
  var l = $i;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return l.default;
  } });
  var f = kr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return f.default;
  } });
})(Jc, Jc.exports);
var vA = Jc.exports, rl = { exports: {} }, Pm = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(j, V) {
    return { validate: j, compare: V };
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
    regex: S,
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
    byte: w,
    // signed 32 bit integer
    int32: { type: "number", validate: F },
    // signed 64 bit integer
    int64: { type: "number", validate: q },
    // C-type float
    float: { type: "number", validate: K },
    // C-type double
    double: { type: "number", validate: K },
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
  function n(j) {
    return j % 4 === 0 && (j % 100 !== 0 || j % 400 === 0);
  }
  const r = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, i = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function o(j) {
    const V = r.exec(j);
    if (!V)
      return !1;
    const Z = +V[1], D = +V[2], L = +V[3];
    return D >= 1 && D <= 12 && L >= 1 && L <= (D === 2 && n(Z) ? 29 : i[D]);
  }
  function s(j, V) {
    if (j && V)
      return j > V ? 1 : j < V ? -1 : 0;
  }
  const a = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(j) {
    return function(Z) {
      const D = a.exec(Z);
      if (!D)
        return !1;
      const L = +D[1], G = +D[2], z = +D[3], Y = D[4], J = D[5] === "-" ? -1 : 1, B = +(D[6] || 0), N = +(D[7] || 0);
      if (B > 23 || N > 59 || j && !Y)
        return !1;
      if (L <= 23 && G <= 59 && z < 60)
        return !0;
      const R = G - N * J, O = L - B * J - (R < 0 ? 1 : 0);
      return (O === 23 || O === -1) && (R === 59 || R === -1) && z < 61;
    };
  }
  function u(j, V) {
    if (!(j && V))
      return;
    const Z = (/* @__PURE__ */ new Date("2020-01-01T" + j)).valueOf(), D = (/* @__PURE__ */ new Date("2020-01-01T" + V)).valueOf();
    if (Z && D)
      return Z - D;
  }
  function l(j, V) {
    if (!(j && V))
      return;
    const Z = a.exec(j), D = a.exec(V);
    if (Z && D)
      return j = Z[1] + Z[2] + Z[3], V = D[1] + D[2] + D[3], j > V ? 1 : j < V ? -1 : 0;
  }
  const f = /t|\s/i;
  function h(j) {
    const V = c(j);
    return function(D) {
      const L = D.split(f);
      return L.length === 2 && o(L[0]) && V(L[1]);
    };
  }
  function d(j, V) {
    if (!(j && V))
      return;
    const Z = new Date(j).valueOf(), D = new Date(V).valueOf();
    if (Z && D)
      return Z - D;
  }
  function m(j, V) {
    if (!(j && V))
      return;
    const [Z, D] = j.split(f), [L, G] = V.split(f), z = s(Z, L);
    if (z !== void 0)
      return z || u(D, G);
  }
  const p = /\/|:/, v = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function y(j) {
    return p.test(j) && v.test(j);
  }
  const g = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function w(j) {
    return g.lastIndex = 0, g.test(j);
  }
  const A = -2147483648, C = 2 ** 31 - 1;
  function F(j) {
    return Number.isInteger(j) && j <= C && j >= A;
  }
  function q(j) {
    return Number.isInteger(j);
  }
  function K() {
    return !0;
  }
  const H = /[^\\]\\Z/;
  function S(j) {
    if (H.test(j))
      return !1;
    try {
      return new RegExp(j), !0;
    } catch {
      return !1;
    }
  }
})(Pm);
var Om = {}, il = { exports: {} }, Au = {};
Object.defineProperty(Au, "__esModule", { value: !0 });
const EA = ua, _A = fa, wA = da, $A = ma, ad = Fr, SA = [
  EA.default,
  _A.default,
  (0, wA.default)(),
  $A.default,
  ad.metadataVocabulary,
  ad.contentVocabulary
];
Au.default = SA;
const bA = "http://json-schema.org/draft-07/schema#", AA = "http://json-schema.org/draft-07/schema#", TA = "Core schema meta-schema", CA = {
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
}, NA = [
  "object",
  "boolean"
], IA = {
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
}, PA = {
  $schema: bA,
  $id: AA,
  title: TA,
  definitions: CA,
  type: NA,
  properties: IA,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const n = Nl, r = Au, i = ga, o = PA, s = ["/properties"], a = "http://json-schema.org/draft-07/schema";
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
  var u = Kt;
  Object.defineProperty(t, "KeywordCxt", { enumerable: !0, get: function() {
    return u.KeywordCxt;
  } });
  var l = le;
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
  var f = $i;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return f.default;
  } });
  var h = kr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(il, il.exports);
var OA = il.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = OA, n = le, r = n.operators, i = {
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
        const w = c.scopeValue("formats", {
          ref: m.formats,
          code: d.code.formats
        }), A = c.const("fmt", (0, n._)`${w}[${p.schemaCode}]`);
        a.fail$data((0, n.or)((0, n._)`typeof ${A} != "object"`, (0, n._)`${A} instanceof RegExp`, (0, n._)`typeof ${A}.compare != "function"`, g(A)));
      }
      function y() {
        const w = p.schema, A = m.formats[w];
        if (!A || A === !0)
          return;
        if (typeof A != "object" || A instanceof RegExp || typeof A.compare != "function")
          throw new Error(`"${f}": format "${w}" does not define "compare" function`);
        const C = c.scopeValue("formats", {
          key: w,
          ref: A,
          code: d.code.formats ? (0, n._)`${d.code.formats}${(0, n.getProperty)(w)}` : void 0
        });
        a.fail$data(g(C));
      }
      function g(w) {
        return (0, n._)`${w}.compare(${u}, ${l}) ${i[f].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const s = (a) => (a.addKeyword(e.formatLimitDefinition), a);
  e.default = s;
})(Om);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const n = Pm, r = Om, i = le, o = new i.Name("fullFormats"), s = new i.Name("fastFormats"), a = (u, l = { keywords: !0 }) => {
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
})(rl, rl.exports);
var RA = rl.exports;
const DA = /* @__PURE__ */ Cl(RA), FA = (e, t, n, r) => {
  if (n === "length" || n === "prototype" || n === "arguments" || n === "caller")
    return;
  const i = Object.getOwnPropertyDescriptor(e, n), o = Object.getOwnPropertyDescriptor(t, n);
  !LA(i, o) && r || Object.defineProperty(e, n, o);
}, LA = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, xA = (e, t) => {
  const n = Object.getPrototypeOf(t);
  n !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, n);
}, kA = (e, t) => `/* Wrapped ${e}*/
${t}`, UA = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), jA = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), MA = (e, t, n) => {
  const r = n === "" ? "" : `with ${n.trim()}() `, i = kA.bind(null, r, t.toString());
  Object.defineProperty(i, "name", jA);
  const { writable: o, enumerable: s, configurable: a } = UA;
  Object.defineProperty(e, "toString", { value: i, writable: o, enumerable: s, configurable: a });
};
function BA(e, t, { ignoreNonConfigurable: n = !1 } = {}) {
  const { name: r } = e;
  for (const i of Reflect.ownKeys(t))
    FA(e, t, i, n);
  return xA(e, t), MA(e, t, r), e;
}
const cd = (e, t = {}) => {
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
  return BA(u, e), u.cancel = () => {
    s && (clearTimeout(s), s = void 0), a && (clearTimeout(a), a = void 0);
  }, u;
};
var ol = { exports: {} };
const HA = "2.0.0", Rm = 256, qA = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, zA = 16, VA = Rm - 6, GA = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var va = {
  MAX_LENGTH: Rm,
  MAX_SAFE_COMPONENT_LENGTH: zA,
  MAX_SAFE_BUILD_LENGTH: VA,
  MAX_SAFE_INTEGER: qA,
  RELEASE_TYPES: GA,
  SEMVER_SPEC_VERSION: HA,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const WA = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var Ea = WA;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: r,
    MAX_LENGTH: i
  } = va, o = Ea;
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
    const w = m(y), A = f++;
    o(v, A, y), l[v] = A, c[A] = y, u[A] = w, s[A] = new RegExp(y, g ? "g" : void 0), a[A] = new RegExp(w, g ? "g" : void 0);
  };
  p("NUMERICIDENTIFIER", "0|[1-9]\\d*"), p("NUMERICIDENTIFIERLOOSE", "\\d+"), p("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), p("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), p("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), p("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), p("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), p("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), p("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), p("BUILDIDENTIFIER", `${h}+`), p("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), p("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), p("FULL", `^${c[l.FULLPLAIN]}$`), p("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), p("LOOSE", `^${c[l.LOOSEPLAIN]}$`), p("GTLT", "((?:<|>)?=?)"), p("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), p("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), p("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), p("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), p("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), p("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), p("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), p("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), p("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), p("COERCERTL", c[l.COERCE], !0), p("COERCERTLFULL", c[l.COERCEFULL], !0), p("LONETILDE", "(?:~>?)"), p("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", p("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), p("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), p("LONECARET", "(?:\\^)"), p("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", p("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), p("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), p("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), p("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), p("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", p("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), p("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), p("STAR", "(<|>)?=?\\s*\\*"), p("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), p("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(ol, ol.exports);
var Po = ol.exports;
const KA = Object.freeze({ loose: !0 }), JA = Object.freeze({}), YA = (e) => e ? typeof e != "object" ? KA : e : JA;
var Tu = YA;
const ld = /^[0-9]+$/, Dm = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const n = ld.test(e), r = ld.test(t);
  return n && r && (e = +e, t = +t), e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}, XA = (e, t) => Dm(t, e);
var Fm = {
  compareIdentifiers: Dm,
  rcompareIdentifiers: XA
};
const is = Ea, { MAX_LENGTH: ud, MAX_SAFE_INTEGER: os } = va, { safeRe: ss, t: as } = Po, ZA = Tu, { compareIdentifiers: ac } = Fm;
let QA = class cn {
  constructor(t, n) {
    if (n = ZA(n), t instanceof cn) {
      if (t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > ud)
      throw new TypeError(
        `version is longer than ${ud} characters`
      );
    is("SemVer", t, n), this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease;
    const r = t.trim().match(n.loose ? ss[as.LOOSE] : ss[as.FULL]);
    if (!r)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > os || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > os || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > os || this.patch < 0)
      throw new TypeError("Invalid patch version");
    r[4] ? this.prerelease = r[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < os)
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
    if (is("SemVer.compare", this.version, this.options, t), !(t instanceof cn)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new cn(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof cn || (t = new cn(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof cn || (t = new cn(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let n = 0;
    do {
      const r = this.prerelease[n], i = t.prerelease[n];
      if (is("prerelease compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return ac(r, i);
    } while (++n);
  }
  compareBuild(t) {
    t instanceof cn || (t = new cn(t, this.options));
    let n = 0;
    do {
      const r = this.build[n], i = t.build[n];
      if (is("build compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return ac(r, i);
    } while (++n);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, n, r) {
    if (t.startsWith("pre")) {
      if (!n && r === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (n) {
        const i = `-${n}`.match(this.options.loose ? ss[as.PRERELEASELOOSE] : ss[as.PRERELEASE]);
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
          r === !1 && (o = [n]), ac(this.prerelease[0], n) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Pt = QA;
const fd = Pt, eT = (e, t, n = !1) => {
  if (e instanceof fd)
    return e;
  try {
    return new fd(e, t);
  } catch (r) {
    if (!n)
      return null;
    throw r;
  }
};
var Ci = eT;
const tT = Ci, nT = (e, t) => {
  const n = tT(e, t);
  return n ? n.version : null;
};
var rT = nT;
const iT = Ci, oT = (e, t) => {
  const n = iT(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
var sT = oT;
const dd = Pt, aT = (e, t, n, r, i) => {
  typeof n == "string" && (i = r, r = n, n = void 0);
  try {
    return new dd(
      e instanceof dd ? e.version : e,
      n
    ).inc(t, r, i).version;
  } catch {
    return null;
  }
};
var cT = aT;
const hd = Ci, lT = (e, t) => {
  const n = hd(e, null, !0), r = hd(t, null, !0), i = n.compare(r);
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
var uT = lT;
const fT = Pt, dT = (e, t) => new fT(e, t).major;
var hT = dT;
const pT = Pt, mT = (e, t) => new pT(e, t).minor;
var gT = mT;
const yT = Pt, vT = (e, t) => new yT(e, t).patch;
var ET = vT;
const _T = Ci, wT = (e, t) => {
  const n = _T(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
var $T = wT;
const pd = Pt, ST = (e, t, n) => new pd(e, n).compare(new pd(t, n));
var rn = ST;
const bT = rn, AT = (e, t, n) => bT(t, e, n);
var TT = AT;
const CT = rn, NT = (e, t) => CT(e, t, !0);
var IT = NT;
const md = Pt, PT = (e, t, n) => {
  const r = new md(e, n), i = new md(t, n);
  return r.compare(i) || r.compareBuild(i);
};
var Cu = PT;
const OT = Cu, RT = (e, t) => e.sort((n, r) => OT(n, r, t));
var DT = RT;
const FT = Cu, LT = (e, t) => e.sort((n, r) => FT(r, n, t));
var xT = LT;
const kT = rn, UT = (e, t, n) => kT(e, t, n) > 0;
var _a = UT;
const jT = rn, MT = (e, t, n) => jT(e, t, n) < 0;
var Nu = MT;
const BT = rn, HT = (e, t, n) => BT(e, t, n) === 0;
var Lm = HT;
const qT = rn, zT = (e, t, n) => qT(e, t, n) !== 0;
var xm = zT;
const VT = rn, GT = (e, t, n) => VT(e, t, n) >= 0;
var Iu = GT;
const WT = rn, KT = (e, t, n) => WT(e, t, n) <= 0;
var Pu = KT;
const JT = Lm, YT = xm, XT = _a, ZT = Iu, QT = Nu, eC = Pu, tC = (e, t, n, r) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e === n;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e !== n;
    case "":
    case "=":
    case "==":
      return JT(e, n, r);
    case "!=":
      return YT(e, n, r);
    case ">":
      return XT(e, n, r);
    case ">=":
      return ZT(e, n, r);
    case "<":
      return QT(e, n, r);
    case "<=":
      return eC(e, n, r);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var km = tC;
const nC = Pt, rC = Ci, { safeRe: cs, t: ls } = Po, iC = (e, t) => {
  if (e instanceof nC)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let n = null;
  if (!t.rtl)
    n = e.match(t.includePrerelease ? cs[ls.COERCEFULL] : cs[ls.COERCE]);
  else {
    const c = t.includePrerelease ? cs[ls.COERCERTLFULL] : cs[ls.COERCERTL];
    let u;
    for (; (u = c.exec(e)) && (!n || n.index + n[0].length !== e.length); )
      (!n || u.index + u[0].length !== n.index + n[0].length) && (n = u), c.lastIndex = u.index + u[1].length + u[2].length;
    c.lastIndex = -1;
  }
  if (n === null)
    return null;
  const r = n[2], i = n[3] || "0", o = n[4] || "0", s = t.includePrerelease && n[5] ? `-${n[5]}` : "", a = t.includePrerelease && n[6] ? `+${n[6]}` : "";
  return rC(`${r}.${i}.${o}${s}${a}`, t);
};
var oC = iC;
class sC {
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
var aC = sC, cc, gd;
function on() {
  if (gd) return cc;
  gd = 1;
  const e = /\s+/g;
  class t {
    constructor(L, G) {
      if (G = i(G), L instanceof t)
        return L.loose === !!G.loose && L.includePrerelease === !!G.includePrerelease ? L : new t(L.raw, G);
      if (L instanceof o)
        return this.raw = L.value, this.set = [[L]], this.formatted = void 0, this;
      if (this.options = G, this.loose = !!G.loose, this.includePrerelease = !!G.includePrerelease, this.raw = L.trim().replace(e, " "), this.set = this.raw.split("||").map((z) => this.parseRange(z.trim())).filter((z) => z.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const z = this.set[0];
        if (this.set = this.set.filter((Y) => !p(Y[0])), this.set.length === 0)
          this.set = [z];
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
        for (let L = 0; L < this.set.length; L++) {
          L > 0 && (this.formatted += "||");
          const G = this.set[L];
          for (let z = 0; z < G.length; z++)
            z > 0 && (this.formatted += " "), this.formatted += G[z].toString().trim();
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
    parseRange(L) {
      const z = ((this.options.includePrerelease && d) | (this.options.loose && m)) + ":" + L, Y = r.get(z);
      if (Y)
        return Y;
      const J = this.options.loose, B = J ? c[u.HYPHENRANGELOOSE] : c[u.HYPHENRANGE];
      L = L.replace(B, V(this.options.includePrerelease)), s("hyphen replace", L), L = L.replace(c[u.COMPARATORTRIM], l), s("comparator trim", L), L = L.replace(c[u.TILDETRIM], f), s("tilde trim", L), L = L.replace(c[u.CARETTRIM], h), s("caret trim", L);
      let N = L.split(" ").map((T) => g(T, this.options)).join(" ").split(/\s+/).map((T) => j(T, this.options));
      J && (N = N.filter((T) => (s("loose invalid filter", T, this.options), !!T.match(c[u.COMPARATORLOOSE])))), s("range list", N);
      const R = /* @__PURE__ */ new Map(), O = N.map((T) => new o(T, this.options));
      for (const T of O) {
        if (p(T))
          return [T];
        R.set(T.value, T);
      }
      R.size > 1 && R.has("") && R.delete("");
      const $ = [...R.values()];
      return r.set(z, $), $;
    }
    intersects(L, G) {
      if (!(L instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((z) => y(z, G) && L.set.some((Y) => y(Y, G) && z.every((J) => Y.every((B) => J.intersects(B, G)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(L) {
      if (!L)
        return !1;
      if (typeof L == "string")
        try {
          L = new a(L, this.options);
        } catch {
          return !1;
        }
      for (let G = 0; G < this.set.length; G++)
        if (Z(this.set[G], L, this.options))
          return !0;
      return !1;
    }
  }
  cc = t;
  const n = aC, r = new n(), i = Tu, o = wa(), s = Ea, a = Pt, {
    safeRe: c,
    t: u,
    comparatorTrimReplace: l,
    tildeTrimReplace: f,
    caretTrimReplace: h
  } = Po, { FLAG_INCLUDE_PRERELEASE: d, FLAG_LOOSE: m } = va, p = (D) => D.value === "<0.0.0-0", v = (D) => D.value === "", y = (D, L) => {
    let G = !0;
    const z = D.slice();
    let Y = z.pop();
    for (; G && z.length; )
      G = z.every((J) => Y.intersects(J, L)), Y = z.pop();
    return G;
  }, g = (D, L) => (D = D.replace(c[u.BUILD], ""), s("comp", D, L), D = F(D, L), s("caret", D), D = A(D, L), s("tildes", D), D = K(D, L), s("xrange", D), D = S(D, L), s("stars", D), D), w = (D) => !D || D.toLowerCase() === "x" || D === "*", A = (D, L) => D.trim().split(/\s+/).map((G) => C(G, L)).join(" "), C = (D, L) => {
    const G = L.loose ? c[u.TILDELOOSE] : c[u.TILDE];
    return D.replace(G, (z, Y, J, B, N) => {
      s("tilde", D, z, Y, J, B, N);
      let R;
      return w(Y) ? R = "" : w(J) ? R = `>=${Y}.0.0 <${+Y + 1}.0.0-0` : w(B) ? R = `>=${Y}.${J}.0 <${Y}.${+J + 1}.0-0` : N ? (s("replaceTilde pr", N), R = `>=${Y}.${J}.${B}-${N} <${Y}.${+J + 1}.0-0`) : R = `>=${Y}.${J}.${B} <${Y}.${+J + 1}.0-0`, s("tilde return", R), R;
    });
  }, F = (D, L) => D.trim().split(/\s+/).map((G) => q(G, L)).join(" "), q = (D, L) => {
    s("caret", D, L);
    const G = L.loose ? c[u.CARETLOOSE] : c[u.CARET], z = L.includePrerelease ? "-0" : "";
    return D.replace(G, (Y, J, B, N, R) => {
      s("caret", D, Y, J, B, N, R);
      let O;
      return w(J) ? O = "" : w(B) ? O = `>=${J}.0.0${z} <${+J + 1}.0.0-0` : w(N) ? J === "0" ? O = `>=${J}.${B}.0${z} <${J}.${+B + 1}.0-0` : O = `>=${J}.${B}.0${z} <${+J + 1}.0.0-0` : R ? (s("replaceCaret pr", R), J === "0" ? B === "0" ? O = `>=${J}.${B}.${N}-${R} <${J}.${B}.${+N + 1}-0` : O = `>=${J}.${B}.${N}-${R} <${J}.${+B + 1}.0-0` : O = `>=${J}.${B}.${N}-${R} <${+J + 1}.0.0-0`) : (s("no pr"), J === "0" ? B === "0" ? O = `>=${J}.${B}.${N}${z} <${J}.${B}.${+N + 1}-0` : O = `>=${J}.${B}.${N}${z} <${J}.${+B + 1}.0-0` : O = `>=${J}.${B}.${N} <${+J + 1}.0.0-0`), s("caret return", O), O;
    });
  }, K = (D, L) => (s("replaceXRanges", D, L), D.split(/\s+/).map((G) => H(G, L)).join(" ")), H = (D, L) => {
    D = D.trim();
    const G = L.loose ? c[u.XRANGELOOSE] : c[u.XRANGE];
    return D.replace(G, (z, Y, J, B, N, R) => {
      s("xRange", D, z, Y, J, B, N, R);
      const O = w(J), $ = O || w(B), T = $ || w(N), M = T;
      return Y === "=" && M && (Y = ""), R = L.includePrerelease ? "-0" : "", O ? Y === ">" || Y === "<" ? z = "<0.0.0-0" : z = "*" : Y && M ? ($ && (B = 0), N = 0, Y === ">" ? (Y = ">=", $ ? (J = +J + 1, B = 0, N = 0) : (B = +B + 1, N = 0)) : Y === "<=" && (Y = "<", $ ? J = +J + 1 : B = +B + 1), Y === "<" && (R = "-0"), z = `${Y + J}.${B}.${N}${R}`) : $ ? z = `>=${J}.0.0${R} <${+J + 1}.0.0-0` : T && (z = `>=${J}.${B}.0${R} <${J}.${+B + 1}.0-0`), s("xRange return", z), z;
    });
  }, S = (D, L) => (s("replaceStars", D, L), D.trim().replace(c[u.STAR], "")), j = (D, L) => (s("replaceGTE0", D, L), D.trim().replace(c[L.includePrerelease ? u.GTE0PRE : u.GTE0], "")), V = (D) => (L, G, z, Y, J, B, N, R, O, $, T, M) => (w(z) ? G = "" : w(Y) ? G = `>=${z}.0.0${D ? "-0" : ""}` : w(J) ? G = `>=${z}.${Y}.0${D ? "-0" : ""}` : B ? G = `>=${G}` : G = `>=${G}${D ? "-0" : ""}`, w(O) ? R = "" : w($) ? R = `<${+O + 1}.0.0-0` : w(T) ? R = `<${O}.${+$ + 1}.0-0` : M ? R = `<=${O}.${$}.${T}-${M}` : D ? R = `<${O}.${$}.${+T + 1}-0` : R = `<=${R}`, `${G} ${R}`.trim()), Z = (D, L, G) => {
    for (let z = 0; z < D.length; z++)
      if (!D[z].test(L))
        return !1;
    if (L.prerelease.length && !G.includePrerelease) {
      for (let z = 0; z < D.length; z++)
        if (s(D[z].semver), D[z].semver !== o.ANY && D[z].semver.prerelease.length > 0) {
          const Y = D[z].semver;
          if (Y.major === L.major && Y.minor === L.minor && Y.patch === L.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return cc;
}
var lc, yd;
function wa() {
  if (yd) return lc;
  yd = 1;
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
  lc = t;
  const n = Tu, { safeRe: r, t: i } = Po, o = km, s = Ea, a = Pt, c = on();
  return lc;
}
const cC = on(), lC = (e, t, n) => {
  try {
    t = new cC(t, n);
  } catch {
    return !1;
  }
  return t.test(e);
};
var $a = lC;
const uC = on(), fC = (e, t) => new uC(e, t).set.map((n) => n.map((r) => r.value).join(" ").trim().split(" "));
var dC = fC;
const hC = Pt, pC = on(), mC = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new pC(t, n);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    o.test(s) && (!r || i.compare(s) === -1) && (r = s, i = new hC(r, n));
  }), r;
};
var gC = mC;
const yC = Pt, vC = on(), EC = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new vC(t, n);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    o.test(s) && (!r || i.compare(s) === 1) && (r = s, i = new yC(r, n));
  }), r;
};
var _C = EC;
const uc = Pt, wC = on(), vd = _a, $C = (e, t) => {
  e = new wC(e, t);
  let n = new uc("0.0.0");
  if (e.test(n) || (n = new uc("0.0.0-0"), e.test(n)))
    return n;
  n = null;
  for (let r = 0; r < e.set.length; ++r) {
    const i = e.set[r];
    let o = null;
    i.forEach((s) => {
      const a = new uc(s.semver.version);
      switch (s.operator) {
        case ">":
          a.prerelease.length === 0 ? a.patch++ : a.prerelease.push(0), a.raw = a.format();
        case "":
        case ">=":
          (!o || vd(a, o)) && (o = a);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${s.operator}`);
      }
    }), o && (!n || vd(n, o)) && (n = o);
  }
  return n && e.test(n) ? n : null;
};
var SC = $C;
const bC = on(), AC = (e, t) => {
  try {
    return new bC(e, t).range || "*";
  } catch {
    return null;
  }
};
var TC = AC;
const CC = Pt, Um = wa(), { ANY: NC } = Um, IC = on(), PC = $a, Ed = _a, _d = Nu, OC = Pu, RC = Iu, DC = (e, t, n, r) => {
  e = new CC(e, r), t = new IC(t, r);
  let i, o, s, a, c;
  switch (n) {
    case ">":
      i = Ed, o = OC, s = _d, a = ">", c = ">=";
      break;
    case "<":
      i = _d, o = RC, s = Ed, a = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (PC(e, t, r))
    return !1;
  for (let u = 0; u < t.set.length; ++u) {
    const l = t.set[u];
    let f = null, h = null;
    if (l.forEach((d) => {
      d.semver === NC && (d = new Um(">=0.0.0")), f = f || d, h = h || d, i(d.semver, f.semver, r) ? f = d : s(d.semver, h.semver, r) && (h = d);
    }), f.operator === a || f.operator === c || (!h.operator || h.operator === a) && o(e, h.semver))
      return !1;
    if (h.operator === c && s(e, h.semver))
      return !1;
  }
  return !0;
};
var Ou = DC;
const FC = Ou, LC = (e, t, n) => FC(e, t, ">", n);
var xC = LC;
const kC = Ou, UC = (e, t, n) => kC(e, t, "<", n);
var jC = UC;
const wd = on(), MC = (e, t, n) => (e = new wd(e, n), t = new wd(t, n), e.intersects(t, n));
var BC = MC;
const HC = $a, qC = rn;
var zC = (e, t, n) => {
  const r = [];
  let i = null, o = null;
  const s = e.sort((l, f) => qC(l, f, n));
  for (const l of s)
    HC(l, t, n) ? (o = l, i || (i = l)) : (o && r.push([i, o]), o = null, i = null);
  i && r.push([i, null]);
  const a = [];
  for (const [l, f] of r)
    l === f ? a.push(l) : !f && l === s[0] ? a.push("*") : f ? l === s[0] ? a.push(`<=${f}`) : a.push(`${l} - ${f}`) : a.push(`>=${l}`);
  const c = a.join(" || "), u = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < u.length ? c : t;
};
const $d = on(), Ru = wa(), { ANY: fc } = Ru, Hi = $a, Du = rn, VC = (e, t, n = {}) => {
  if (e === t)
    return !0;
  e = new $d(e, n), t = new $d(t, n);
  let r = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const s = WC(i, o, n);
      if (r = r || s !== null, s)
        continue e;
    }
    if (r)
      return !1;
  }
  return !0;
}, GC = [new Ru(">=0.0.0-0")], Sd = [new Ru(">=0.0.0")], WC = (e, t, n) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === fc) {
    if (t.length === 1 && t[0].semver === fc)
      return !0;
    n.includePrerelease ? e = GC : e = Sd;
  }
  if (t.length === 1 && t[0].semver === fc) {
    if (n.includePrerelease)
      return !0;
    t = Sd;
  }
  const r = /* @__PURE__ */ new Set();
  let i, o;
  for (const d of e)
    d.operator === ">" || d.operator === ">=" ? i = bd(i, d, n) : d.operator === "<" || d.operator === "<=" ? o = Ad(o, d, n) : r.add(d.semver);
  if (r.size > 1)
    return null;
  let s;
  if (i && o) {
    if (s = Du(i.semver, o.semver, n), s > 0)
      return null;
    if (s === 0 && (i.operator !== ">=" || o.operator !== "<="))
      return null;
  }
  for (const d of r) {
    if (i && !Hi(d, String(i), n) || o && !Hi(d, String(o), n))
      return null;
    for (const m of t)
      if (!Hi(d, String(m), n))
        return !1;
    return !0;
  }
  let a, c, u, l, f = o && !n.includePrerelease && o.semver.prerelease.length ? o.semver : !1, h = i && !n.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const d of t) {
    if (l = l || d.operator === ">" || d.operator === ">=", u = u || d.operator === "<" || d.operator === "<=", i) {
      if (h && d.semver.prerelease && d.semver.prerelease.length && d.semver.major === h.major && d.semver.minor === h.minor && d.semver.patch === h.patch && (h = !1), d.operator === ">" || d.operator === ">=") {
        if (a = bd(i, d, n), a === d && a !== i)
          return !1;
      } else if (i.operator === ">=" && !Hi(i.semver, String(d), n))
        return !1;
    }
    if (o) {
      if (f && d.semver.prerelease && d.semver.prerelease.length && d.semver.major === f.major && d.semver.minor === f.minor && d.semver.patch === f.patch && (f = !1), d.operator === "<" || d.operator === "<=") {
        if (c = Ad(o, d, n), c === d && c !== o)
          return !1;
      } else if (o.operator === "<=" && !Hi(o.semver, String(d), n))
        return !1;
    }
    if (!d.operator && (o || i) && s !== 0)
      return !1;
  }
  return !(i && u && !o && s !== 0 || o && l && !i && s !== 0 || h || f);
}, bd = (e, t, n) => {
  if (!e)
    return t;
  const r = Du(e.semver, t.semver, n);
  return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, Ad = (e, t, n) => {
  if (!e)
    return t;
  const r = Du(e.semver, t.semver, n);
  return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var KC = VC;
const dc = Po, Td = va, JC = Pt, Cd = Fm, YC = Ci, XC = rT, ZC = sT, QC = cT, eN = uT, tN = hT, nN = gT, rN = ET, iN = $T, oN = rn, sN = TT, aN = IT, cN = Cu, lN = DT, uN = xT, fN = _a, dN = Nu, hN = Lm, pN = xm, mN = Iu, gN = Pu, yN = km, vN = oC, EN = wa(), _N = on(), wN = $a, $N = dC, SN = gC, bN = _C, AN = SC, TN = TC, CN = Ou, NN = xC, IN = jC, PN = BC, ON = zC, RN = KC;
var Fu = {
  parse: YC,
  valid: XC,
  clean: ZC,
  inc: QC,
  diff: eN,
  major: tN,
  minor: nN,
  patch: rN,
  prerelease: iN,
  compare: oN,
  rcompare: sN,
  compareLoose: aN,
  compareBuild: cN,
  sort: lN,
  rsort: uN,
  gt: fN,
  lt: dN,
  eq: hN,
  neq: pN,
  gte: mN,
  lte: gN,
  cmp: yN,
  coerce: vN,
  Comparator: EN,
  Range: _N,
  satisfies: wN,
  toComparators: $N,
  maxSatisfying: SN,
  minSatisfying: bN,
  minVersion: AN,
  validRange: TN,
  outside: CN,
  gtr: NN,
  ltr: IN,
  intersects: PN,
  simplifyRange: ON,
  subset: RN,
  SemVer: JC,
  re: dc.re,
  src: dc.src,
  tokens: dc.t,
  SEMVER_SPEC_VERSION: Td.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Td.RELEASE_TYPES,
  compareIdentifiers: Cd.compareIdentifiers,
  rcompareIdentifiers: Cd.rcompareIdentifiers
};
const Vr = /* @__PURE__ */ Cl(Fu), DN = Object.prototype.toString, FN = "[object Uint8Array]", LN = "[object ArrayBuffer]";
function jm(e, t, n) {
  return e ? e.constructor === t ? !0 : DN.call(e) === n : !1;
}
function Mm(e) {
  return jm(e, Uint8Array, FN);
}
function xN(e) {
  return jm(e, ArrayBuffer, LN);
}
function kN(e) {
  return Mm(e) || xN(e);
}
function UN(e) {
  if (!Mm(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function jN(e) {
  if (!kN(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function hc(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((i, o) => i + o.length, 0));
  const n = new Uint8Array(t);
  let r = 0;
  for (const i of e)
    UN(i), n.set(i, r), r += i.length;
  return n;
}
const us = {
  utf8: new globalThis.TextDecoder("utf8")
};
function fs(e, t = "utf8") {
  return jN(e), us[t] ?? (us[t] = new globalThis.TextDecoder(t)), us[t].decode(e);
}
function MN(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const BN = new globalThis.TextEncoder();
function pc(e) {
  return MN(e), BN.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const Nd = "aes-256-cbc", Bm = /* @__PURE__ */ new Set([
  "aes-256-cbc",
  "aes-256-gcm",
  "aes-256-ctr"
]), HN = (e) => typeof e == "string" && Bm.has(e), wn = () => /* @__PURE__ */ Object.create(null), Id = (e) => e !== void 0, mc = (e, t) => {
  const n = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), r = typeof t;
  if (n.has(r))
    throw new TypeError(`Setting a value of type \`${r}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, Mn = "__internal__", gc = `${Mn}.migrations.version`;
var Vn, Gn, Cr, Lt, Gt, Nr, Ir, mi, ln, it, Hm, qm, zm, Vm, Gm, Wm, Km, Jm;
class qN {
  constructor(t = {}) {
    Yt(this, it);
    Ui(this, "path");
    Ui(this, "events");
    Yt(this, Vn);
    Yt(this, Gn);
    Yt(this, Cr);
    Yt(this, Lt);
    Yt(this, Gt, {});
    Yt(this, Nr, !1);
    Yt(this, Ir);
    Yt(this, mi);
    Yt(this, ln);
    Ui(this, "_deserialize", (t) => JSON.parse(t));
    Ui(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const n = En(this, it, Hm).call(this, t);
    Ft(this, Lt, n), En(this, it, qm).call(this, n), En(this, it, Vm).call(this, n), En(this, it, Gm).call(this, n), this.events = new EventTarget(), Ft(this, Gn, n.encryptionKey), Ft(this, Cr, n.encryptionAlgorithm ?? Nd), this.path = En(this, it, Wm).call(this, n), En(this, it, Km).call(this, n), n.watch && this._watch();
  }
  get(t, n) {
    if (ue(this, Lt).accessPropertiesByDotNotation)
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
      throw new TypeError(`Please don't use the ${Mn} key, as it's used to manage this module internal operations.`);
    const { store: r } = this, i = (o, s) => {
      if (mc(o, s), ue(this, Lt).accessPropertiesByDotNotation)
        Yo(r, o, s);
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
    return ue(this, Lt).accessPropertiesByDotNotation ? Qa(this.store, t) : t in this.store;
  }
  appendToArray(t, n) {
    mc(t, n);
    const r = ue(this, Lt).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
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
      Id(ue(this, Gt)[n]) && this.set(n, ue(this, Gt)[n]);
  }
  delete(t) {
    const { store: n } = this;
    ue(this, Lt).accessPropertiesByDotNotation ? fv(n, t) : delete n[t], this.store = n;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = wn();
    for (const n of Object.keys(ue(this, Gt)))
      Id(ue(this, Gt)[n]) && (mc(n, ue(this, Gt)[n]), ue(this, Lt).accessPropertiesByDotNotation ? Yo(t, n, ue(this, Gt)[n]) : t[n] = ue(this, Gt)[n]);
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
      const n = fe.readFileSync(this.path, ue(this, Gn) ? null : "utf8"), r = this._decryptData(n);
      return ((o) => {
        const s = this._deserialize(o);
        return ue(this, Nr) || this._validate(s), Object.assign(wn(), s);
      })(r);
    } catch (n) {
      if ((n == null ? void 0 : n.code) === "ENOENT")
        return this._ensureDirectory(), wn();
      if (ue(this, Lt).clearInvalidConfig) {
        const r = n;
        if (r.name === "SyntaxError" || (t = r.message) != null && t.startsWith("Config schema violation:") || r.message === "Failed to decrypt config data.")
          return wn();
      }
      throw n;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !Qa(t, Mn))
      try {
        const n = fe.readFileSync(this.path, ue(this, Gn) ? null : "utf8"), r = this._decryptData(n), i = this._deserialize(r);
        Qa(i, Mn) && Yo(t, Mn, Nf(i, Mn));
      } catch {
      }
    ue(this, Nr) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, n] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, n]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    ue(this, Ir) && (ue(this, Ir).close(), Ft(this, Ir, void 0)), ue(this, mi) && (fe.unwatchFile(this.path), Ft(this, mi, !1)), Ft(this, ln, void 0);
  }
  _decryptData(t) {
    const n = ue(this, Gn);
    if (!n)
      return typeof t == "string" ? t : fs(t);
    const r = ue(this, Cr), i = r === "aes-256-gcm" ? 16 : 0, o = ":".codePointAt(0), s = typeof t == "string" ? t.codePointAt(16) : t[16];
    if (!(o !== void 0 && s === o)) {
      if (r === "aes-256-cbc")
        return typeof t == "string" ? t : fs(t);
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
    }, u = t.slice(0, 16), l = t.slice(17), f = typeof l == "string" ? pc(l) : l, h = (d) => {
      const { ciphertext: m, authenticationTag: p } = c(f), v = ji.pbkdf2Sync(n, d, 1e4, 32, "sha512"), y = ji.createDecipheriv(r, v, u);
      return p && y.setAuthTag(p), fs(hc([y.update(m), y.final()]));
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
      return typeof t == "string" ? t : fs(t);
    throw new Error("Failed to decrypt config data.");
  }
  _handleStoreChange(t) {
    let n = this.store;
    const r = () => {
      const i = n, o = this.store;
      Tf(o, i) || (n = o, t.call(this, o, i));
    };
    return this.events.addEventListener("change", r), () => {
      this.events.removeEventListener("change", r);
    };
  }
  _handleValueChange(t, n) {
    let r = t();
    const i = () => {
      const o = r, s = t();
      Tf(s, o) || (r = s, n.call(this, s, o));
    };
    return this.events.addEventListener("change", i), () => {
      this.events.removeEventListener("change", i);
    };
  }
  _validate(t) {
    if (!ue(this, Vn) || ue(this, Vn).call(this, t) || !ue(this, Vn).errors)
      return;
    const r = ue(this, Vn).errors.map(({ instancePath: i, message: o = "" }) => `\`${i.slice(1)}\` ${o}`);
    throw new Error("Config schema violation: " + r.join("; "));
  }
  _ensureDirectory() {
    fe.mkdirSync(Se.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let n = this._serialize(t);
    const r = ue(this, Gn);
    if (r) {
      const i = ji.randomBytes(16), o = ji.pbkdf2Sync(r, i, 1e4, 32, "sha512"), s = ji.createCipheriv(ue(this, Cr), o, i), a = hc([s.update(pc(n)), s.final()]), c = [i, pc(":"), a];
      ue(this, Cr) === "aes-256-gcm" && c.push(s.getAuthTag()), n = hc(c);
    }
    if (xe.env.SNAP)
      fe.writeFileSync(this.path, n, { mode: ue(this, Lt).configFileMode });
    else
      try {
        Op(this.path, n, { mode: ue(this, Lt).configFileMode });
      } catch (i) {
        if ((i == null ? void 0 : i.code) === "EXDEV") {
          fe.writeFileSync(this.path, n, { mode: ue(this, Lt).configFileMode });
          return;
        }
        throw i;
      }
  }
  _watch() {
    if (this._ensureDirectory(), fe.existsSync(this.path) || this._write(wn()), xe.platform === "win32" || xe.platform === "darwin") {
      ue(this, ln) ?? Ft(this, ln, cd(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = Se.dirname(this.path), n = Se.basename(this.path);
      Ft(this, Ir, fe.watch(t, { persistent: !1, encoding: "utf8" }, (r, i) => {
        i && i !== n || typeof ue(this, ln) == "function" && ue(this, ln).call(this);
      }));
    } else
      ue(this, ln) ?? Ft(this, ln, cd(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), fe.watchFile(this.path, { persistent: !1 }, (t, n) => {
        typeof ue(this, ln) == "function" && ue(this, ln).call(this);
      }), Ft(this, mi, !0);
  }
  _migrate(t, n, r) {
    let i = this._get(gc, "0.0.0");
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
        c == null || c(this), this._set(gc, a), i = a, s = structuredClone(this.store);
      } catch (c) {
        this.store = s;
        const u = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${u}`);
      }
    (this._isVersionInRangeFormat(i) || !Vr.eq(i, n)) && this._set(gc, n);
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
    return t === Mn || t.startsWith(`${Mn}.`);
  }
  _isVersionInRangeFormat(t) {
    return Vr.clean(t) === null;
  }
  _shouldPerformMigration(t, n, r) {
    return this._isVersionInRangeFormat(t) ? n !== "0.0.0" && Vr.satisfies(n, t) ? !1 : Vr.satisfies(r, t) : !(Vr.lte(t, n) || Vr.gt(t, r));
  }
  _get(t, n) {
    return Nf(this.store, t, n);
  }
  _set(t, n) {
    const { store: r } = this;
    Yo(r, t, n), this.store = r;
  }
}
Vn = new WeakMap(), Gn = new WeakMap(), Cr = new WeakMap(), Lt = new WeakMap(), Gt = new WeakMap(), Nr = new WeakMap(), Ir = new WeakMap(), mi = new WeakMap(), ln = new WeakMap(), it = new WeakSet(), Hm = function(t) {
  const n = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (n.encryptionAlgorithm ?? (n.encryptionAlgorithm = Nd), !HN(n.encryptionAlgorithm))
    throw new TypeError(`The \`encryptionAlgorithm\` option must be one of: ${[...Bm].join(", ")}`);
  if (!n.cwd) {
    if (!n.projectName)
      throw new Error("Please specify the `projectName` option.");
    n.cwd = mv(n.projectName, { suffix: n.projectSuffix }).config;
  }
  return typeof n.fileExtension == "string" && (n.fileExtension = n.fileExtension.replace(/^\.+/, "")), n;
}, qm = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const n = DA.default, r = new vA.Ajv2020({
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
  Ft(this, Vn, r.compile(i)), En(this, it, zm).call(this, t.schema);
}, zm = function(t) {
  const n = Object.entries(t ?? {});
  for (const [r, i] of n) {
    if (!i || typeof i != "object" || !Object.hasOwn(i, "default"))
      continue;
    const { default: o } = i;
    o !== void 0 && (ue(this, Gt)[r] = o);
  }
}, Vm = function(t) {
  t.defaults && Object.assign(ue(this, Gt), t.defaults);
}, Gm = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, Wm = function(t) {
  const n = typeof t.fileExtension == "string" ? t.fileExtension : void 0, r = n ? `.${n}` : "";
  return Se.resolve(t.cwd, `${t.configName ?? "config"}${r}`);
}, Km = function(t) {
  if (t.migrations) {
    En(this, it, Jm).call(this, t), this._validate(this.store);
    return;
  }
  const n = this.store, r = Object.assign(wn(), t.defaults ?? {}, n);
  this._validate(r);
  try {
    Cf.deepEqual(n, r);
  } catch {
    this.store = r;
  }
}, Jm = function(t) {
  const { migrations: n, projectVersion: r } = t;
  if (n) {
    if (!r)
      throw new Error("Please specify the `projectVersion` option.");
    Ft(this, Nr, !0);
    try {
      const i = this.store, o = Object.assign(wn(), t.defaults ?? {}, i);
      try {
        Cf.deepEqual(i, o);
      } catch {
        this._write(o);
      }
      this._migrate(n, r, t.beforeEachMigration);
    } finally {
      Ft(this, Nr, !1);
    }
  }
};
const { app: Os, ipcMain: sl, shell: zN } = Tn;
let Pd = !1;
const Od = () => {
  if (!sl || !Os)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: Os.getPath("userData"),
    appVersion: Os.getVersion()
  };
  return Pd || (sl.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Pd = !0), e;
};
class VN extends qN {
  constructor(t) {
    let n, r;
    if (xe.type === "renderer") {
      const i = Tn.ipcRenderer.sendSync("electron-store-get-data");
      if (!i)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: n, appVersion: r } = i);
    } else sl && Os && ({ defaultCwd: n, appVersion: r } = Od());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = r), t.cwd ? t.cwd = Se.isAbsolute(t.cwd) ? t.cwd : Se.join(n, t.cwd) : t.cwd = n, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    Od();
  }
  async openInEditor() {
    const t = await zN.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const GN = {
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
    showConsoleOnLaunch: !1,
    showConsoleOnCrash: !0,
    hideConsoleOnExit: !1,
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
  }
}, fn = new VN({
  defaults: GN,
  name: "config"
}), $n = Le.getPath("userData"), oe = {
  appData: $n,
  instances: k.join($n, "instances"),
  java: k.join($n, "java"),
  icons: k.join($n, "icons"),
  skins: k.join($n, "skins"),
  mods: k.join($n, "mods"),
  logs: k.join($n, "logs"),
  config: k.join($n, "config.json"),
  accounts: k.join($n, "accounts.json")
};
function WN() {
  ie.handle("config:get", () => fn.store), ie.handle("config:set", (e, t, n) => {
    fn.set(t, n);
  });
}
var Ni = { exports: {} }, Ym = {
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
}, Sa = {};
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
})(Sa);
const KN = x, Xe = k, Rd = Ym, JN = Sa, YN = typeof process == "object" && process.platform === "win32", Dd = (e) => typeof e == "object" && e !== null, Xm = new Uint32Array(256).map((e, t) => {
  for (let n = 0; n < 8; n++)
    t & 1 ? t = 3988292384 ^ t >>> 1 : t >>>= 1;
  return t >>> 0;
});
function We(e) {
  this.sep = Xe.sep, this.fs = KN, Dd(e) && Dd(e.fs) && typeof e.fs.statSync == "function" && (this.fs = e.fs);
}
var XN = We;
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
        if (s && s.isFile()) throw JN.FILE_IN_THE_WAY(`"${i}"`);
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
  var s = Xe.dirname(e);
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
      var u = Xe.dirname(e);
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
      const c = Xe.join(r, a), u = t.fs.statSync(c);
      s.push(Xe.normalize(c) + (u.isDirectory() ? t.sep : "")), u.isDirectory() && o && (s = s.concat(n(c, i, o)));
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
      a = Xe.join(e, a), n.fs.stat(a, function(c, u) {
        if (c) return t(c);
        u && (r.push(Xe.normalize(a) + (u.isDirectory() ? n.sep : "")), u.isDirectory() ? n.findFilesAsync(a, function(l, f) {
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
  return Xm[(e ^ t) & 255] ^ e >>> 8;
};
We.crc32 = function(e) {
  typeof e == "string" && (e = Buffer.from(e, "utf8"));
  let t = e.length, n = -1;
  for (let r = 0; r < t; ) n = We.crc32update(n, e[r++]);
  return ~n >>> 0;
};
We.methodToString = function(e) {
  switch (e) {
    case Rd.STORED:
      return "STORED (" + e + ")";
    case Rd.DEFLATED:
      return "DEFLATED (" + e + ")";
    default:
      return "UNSUPPORTED (" + e + ")";
  }
};
We.canonical = function(e) {
  if (!e) return "";
  const t = Xe.posix.normalize("/" + e.split("\\").join("/"));
  return Xe.join(".", t);
};
We.zipnamefix = function(e) {
  if (!e) return "";
  const t = Xe.posix.normalize("/" + e.split("\\").join("/"));
  return Xe.posix.join(".", t);
};
We.findLast = function(e, t) {
  if (!Array.isArray(e)) throw new TypeError("arr is not array");
  const n = e.length >>> 0;
  for (let r = n - 1; r >= 0; r--)
    if (t(e[r], r, e))
      return e[r];
};
We.sanitize = function(e, t) {
  e = Xe.resolve(Xe.normalize(e));
  for (var n = t.split("/"), r = 0, i = n.length; r < i; r++) {
    var o = Xe.normalize(Xe.join(e, n.slice(r, i).join(Xe.sep)));
    if (o.indexOf(e) === 0)
      return o;
  }
  return Xe.normalize(Xe.join(e, Xe.basename(t)));
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
We.isWin = YN;
We.crcTable = Xm;
const ZN = k;
var QN = function(e, { fs: t }) {
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
  return n && t.existsSync(n) ? (i = t.statSync(n), r.directory = i.isDirectory(), r.mtime = i.mtime, r.atime = i.atime, r.executable = (73 & i.mode) !== 0, r.readonly = (128 & i.mode) === 0, r.hidden = ZN.basename(n)[0] === ".") : console.warn("Invalid path: " + n), {
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
}, e1 = {
  efs: !0,
  encode: (e) => Buffer.from(e, "utf8"),
  decode: (e) => e.toString("utf8")
};
Ni.exports = XN;
Ni.exports.Constants = Ym;
Ni.exports.Errors = Sa;
Ni.exports.FileAttr = QN;
Ni.exports.decoder = e1;
var Oo = Ni.exports, ba = {}, Bn = Oo, ee = Bn.Constants, t1 = function() {
  var e = 20, t = 10, n = 0, r = 0, i = 0, o = 0, s = 0, a = 0, c = 0, u = 0, l = 0, f = 0, h = 0, d = 0, m = 0;
  e |= Bn.isWin ? 2560 : 768, n |= ee.FLG_EFS;
  const p = {
    extraLen: 0
  }, v = (g) => Math.max(0, g) >>> 0, y = (g) => Math.max(0, g) & 255;
  return i = Bn.fromDate2DOS(/* @__PURE__ */ new Date()), {
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
      return Bn.fromDOS2Date(this.timeval);
    },
    set time(g) {
      g = new Date(g), this.timeval = Bn.fromDate2DOS(g);
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
      var w = g.slice(m, m + ee.LOCHDR);
      if (w.readUInt32LE(0) !== ee.LOCSIG)
        throw Bn.Errors.INVALID_LOC();
      p.version = w.readUInt16LE(ee.LOCVER), p.flags = w.readUInt16LE(ee.LOCFLG), p.flags_desc = (p.flags & ee.FLG_DESC) > 0, p.method = w.readUInt16LE(ee.LOCHOW), p.time = w.readUInt32LE(ee.LOCTIM), p.crc = w.readUInt32LE(ee.LOCCRC), p.compressedSize = w.readUInt32LE(ee.LOCSIZ), p.size = w.readUInt32LE(ee.LOCLEN), p.fnameLen = w.readUInt16LE(ee.LOCNAM), p.extraLen = w.readUInt16LE(ee.LOCEXT);
      const A = m + ee.LOCHDR + p.fnameLen, C = A + p.extraLen;
      return g.slice(A, C);
    },
    loadFromBinary: function(g) {
      if (g.length !== ee.CENHDR || g.readUInt32LE(0) !== ee.CENSIG)
        throw Bn.Errors.INVALID_CEN();
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
      const g = function(w) {
        return w + " bytes";
      };
      return {
        made: e,
        version: t,
        flags: n,
        method: Bn.methodToString(r),
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
}, ei = Oo, Me = ei.Constants, n1 = function() {
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
        throw ei.Errors.INVALID_END();
      o.readUInt32LE(0) === Me.ENDSIG ? (e = o.readUInt16LE(Me.ENDSUB), t = o.readUInt16LE(Me.ENDTOT), n = o.readUInt32LE(Me.ENDSIZ), r = o.readUInt32LE(Me.ENDOFF), i = o.readUInt16LE(Me.ENDCOM)) : (e = ei.readBigUInt64LE(o, Me.ZIP64SUB), t = ei.readBigUInt64LE(o, Me.ZIP64TOT), n = ei.readBigUInt64LE(o, Me.ZIP64SIZE), r = ei.readBigUInt64LE(o, Me.ZIP64OFF), i = 0);
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
ba.EntryHeader = t1;
ba.MainHeader = n1;
var Aa = {}, r1 = function(e) {
  var t = To, n = { chunkSize: (parseInt(e.length / 1024) + 1) * 1024 };
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
const i1 = +(process.versions ? process.versions.node : "").split(".")[0] || 0;
var o1 = function(e, t) {
  var n = To;
  const r = i1 >= 15 && t > 0 ? { maxOutputLength: t } : {};
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
const { randomFillSync: Fd } = wi, s1 = Sa, a1 = new Uint32Array(256).map((e, t) => {
  for (let n = 0; n < 8; n++)
    t & 1 ? t = t >>> 1 ^ 3988292384 : t >>>= 1;
  return t >>> 0;
}), Zm = (e, t) => Math.imul(e, t) >>> 0, Ld = (e, t) => a1[(e ^ t) & 255] ^ e >>> 8, lo = () => typeof Fd == "function" ? Fd(Buffer.alloc(12)) : lo.node();
lo.node = () => {
  const e = Buffer.alloc(12), t = e.length;
  for (let n = 0; n < t; n++) e[n] = Math.random() * 256 & 255;
  return e;
};
const Rs = {
  genSalt: lo
};
function Ta(e) {
  const t = Buffer.isBuffer(e) ? e : Buffer.from(e);
  this.keys = new Uint32Array([305419896, 591751049, 878082192]);
  for (let n = 0; n < t.length; n++)
    this.updateKeys(t[n]);
}
Ta.prototype.updateKeys = function(e) {
  const t = this.keys;
  return t[0] = Ld(t[0], e), t[1] += t[0] & 255, t[1] = Zm(t[1], 134775813) + 1, t[2] = Ld(t[2], t[1] >>> 24), e;
};
Ta.prototype.next = function() {
  const e = (this.keys[2] | 2) >>> 0;
  return Zm(e, e ^ 1) >> 8 & 255;
};
function c1(e) {
  const t = new Ta(e);
  return function(n) {
    const r = Buffer.alloc(n.length);
    let i = 0;
    for (let o of n)
      r[i++] = t.updateKeys(o ^ t.next());
    return r;
  };
}
function l1(e) {
  const t = new Ta(e);
  return function(n, r, i = 0) {
    r || (r = Buffer.alloc(n.length));
    for (let o of n) {
      const s = t.next();
      r[i++] = o ^ s, t.updateKeys(o);
    }
    return r;
  };
}
function u1(e, t, n) {
  if (!e || !Buffer.isBuffer(e) || e.length < 12)
    return Buffer.alloc(0);
  const r = c1(n), i = r(e.slice(0, 12)), o = (t.flags & 8) === 8 ? t.timeHighByte : t.crc >>> 24;
  if (i[11] !== o)
    throw s1.WRONG_PASSWORD();
  return r(e.slice(12));
}
function f1(e) {
  Buffer.isBuffer(e) && e.length >= 12 ? Rs.genSalt = function() {
    return e.slice(0, 12);
  } : e === "node" ? Rs.genSalt = lo.node : Rs.genSalt = lo;
}
function d1(e, t, n, r = !1) {
  e == null && (e = Buffer.alloc(0)), Buffer.isBuffer(e) || (e = Buffer.from(e.toString()));
  const i = l1(n), o = Rs.genSalt();
  o[11] = t.crc >>> 24 & 255, r && (o[10] = t.crc >>> 16 & 255);
  const s = Buffer.alloc(e.length + 12);
  return i(o, s), i(e, s, 12);
}
var h1 = { decrypt: u1, encrypt: d1, _salter: f1 };
Aa.Deflater = r1;
Aa.Inflater = o1;
Aa.ZipCrypto = h1;
var Ae = Oo, p1 = ba, Ge = Ae.Constants, yc = Aa, Qm = function(e, t) {
  var n = new p1.EntryHeader(), r = Buffer.alloc(0), i = Buffer.alloc(0), o = !1, s = null, a = Buffer.alloc(0), c = Buffer.alloc(0), u = !0;
  const l = e, f = typeof l.decoder == "object" ? l.decoder : Ae.decoder;
  u = f.hasOwnProperty("efs") ? f.efs : !1;
  function h() {
    return !t || !(t instanceof Uint8Array) ? Buffer.alloc(0) : (c = n.loadLocalHeaderFromBinary(t), t.slice(n.realDataOffset, n.realDataOffset + n.compressedSize));
  }
  function d(w) {
    if (!n.flags_desc && !n.localHeader.flags_desc) {
      if (Ae.crc32(w) !== n.localHeader.crc)
        return !1;
    } else {
      const A = {}, C = n.realDataOffset + n.compressedSize;
      if (t.readUInt32LE(C) == Ge.LOCSIG || t.readUInt32LE(C) == Ge.CENSIG)
        throw Ae.Errors.DESCRIPTOR_NOT_EXIST();
      if (t.readUInt32LE(C) == Ge.EXTSIG)
        A.crc = t.readUInt32LE(C + Ge.EXTCRC), A.compressedSize = t.readUInt32LE(C + Ge.EXTSIZ), A.size = t.readUInt32LE(C + Ge.EXTLEN);
      else if (t.readUInt16LE(C + 12) === 19280)
        A.crc = t.readUInt32LE(C + Ge.EXTCRC - 4), A.compressedSize = t.readUInt32LE(C + Ge.EXTSIZ - 4), A.size = t.readUInt32LE(C + Ge.EXTLEN - 4);
      else
        throw Ae.Errors.DESCRIPTOR_UNKNOWN();
      if (A.compressedSize !== n.compressedSize || A.size !== n.size || A.crc !== n.crc)
        throw Ae.Errors.DESCRIPTOR_FAULTY();
      if (Ae.crc32(w) !== A.crc)
        return !1;
    }
    return !0;
  }
  function m(w, A, C) {
    if (typeof A > "u" && typeof w == "string" && (C = w, w = void 0), o)
      return w && A && A(Buffer.alloc(0), Ae.Errors.DIRECTORY_CONTENT_ERROR()), Buffer.alloc(0);
    var F = h();
    if (F.length === 0)
      return w && A && A(F), F;
    if (n.encrypted) {
      if (typeof C != "string" && !Buffer.isBuffer(C))
        throw Ae.Errors.INVALID_PASS_PARAM();
      F = yc.ZipCrypto.decrypt(F, n, C);
    }
    var q = Buffer.alloc(n.size);
    switch (n.method) {
      case Ae.Constants.STORED:
        if (F.copy(q), d(q))
          return w && A && A(q), q;
        throw w && A && A(q, Ae.Errors.BAD_CRC()), Ae.Errors.BAD_CRC();
      case Ae.Constants.DEFLATED:
        var K = new yc.Inflater(F, n.size);
        if (w)
          K.inflateAsync(function(H) {
            H.copy(H, 0), A && (d(H) ? A(H) : A(H, Ae.Errors.BAD_CRC()));
          });
        else {
          if (K.inflate(q).copy(q, 0), !d(q))
            throw Ae.Errors.BAD_CRC(`"${f.decode(r)}"`);
          return q;
        }
        break;
      default:
        throw w && A && A(Buffer.alloc(0), Ae.Errors.UNKNOWN_METHOD()), Ae.Errors.UNKNOWN_METHOD();
    }
  }
  function p(w, A) {
    if ((!s || !s.length) && Buffer.isBuffer(t))
      return w && A && A(h()), h();
    if (s.length && !o) {
      var C;
      switch (n.method) {
        case Ae.Constants.STORED:
          return n.compressedSize = n.size, C = Buffer.alloc(s.length), s.copy(C), w && A && A(C), C;
        default:
        case Ae.Constants.DEFLATED:
          var F = new yc.Deflater(s);
          if (w)
            F.deflateAsync(function(K) {
              C = Buffer.alloc(K.length), n.compressedSize = K.length, K.copy(C), A && A(C);
            });
          else {
            var q = F.deflate();
            return n.compressedSize = q.length, q;
          }
          F = null;
          break;
      }
    } else if (w && A)
      A(Buffer.alloc(0));
    else
      return Buffer.alloc(0);
  }
  function v(w, A) {
    return Ae.readBigUInt64LE(w, A);
  }
  function y(w) {
    try {
      for (var A = 0, C, F, q; A + 4 < w.length; )
        C = w.readUInt16LE(A), A += 2, F = w.readUInt16LE(A), A += 2, q = w.slice(A, A + F), A += F, Ge.ID_ZIP64 === C && g(q);
    } catch {
      throw Ae.Errors.EXTRA_FIELD_PARSE_ERROR();
    }
  }
  function g(w) {
    var A, C, F, q;
    w.length >= Ge.EF_ZIP64_SCOMP && (A = v(w, Ge.EF_ZIP64_SUNCOMP), n.size === Ge.EF_ZIP64_OR_32 && (n.size = A)), w.length >= Ge.EF_ZIP64_RHO && (C = v(w, Ge.EF_ZIP64_SCOMP), n.compressedSize === Ge.EF_ZIP64_OR_32 && (n.compressedSize = C)), w.length >= Ge.EF_ZIP64_DSN && (F = v(w, Ge.EF_ZIP64_RHO), n.offset === Ge.EF_ZIP64_OR_32 && (n.offset = F)), w.length >= Ge.EF_ZIP64_DSN + 4 && (q = w.readUInt32LE(Ge.EF_ZIP64_DSN), n.diskNumStart === Ge.EF_ZIP64_OR_16 && (n.diskNumStart = q));
  }
  return {
    get entryName() {
      return f.decode(r);
    },
    get rawEntryName() {
      return r;
    },
    set entryName(w) {
      r = Ae.toBuffer(w, f.encode);
      var A = r[r.length - 1];
      o = A === 47 || A === 92, n.fileNameLength = r.length;
    },
    get efs() {
      return typeof u == "function" ? u(this.entryName) : u;
    },
    get extra() {
      return a;
    },
    set extra(w) {
      a = w, n.extraLength = w.length, y(w);
    },
    get comment() {
      return f.decode(i);
    },
    set comment(w) {
      if (i = Ae.toBuffer(w, f.encode), n.commentLength = i.length, i.length > 65535) throw Ae.Errors.COMMENT_TOO_LONG();
    },
    get name() {
      var w = f.decode(r);
      return o ? w.substr(w.length - 1).split("/").pop() : w.split("/").pop();
    },
    get isDirectory() {
      return o;
    },
    getCompressedData: function() {
      return p(!1, null);
    },
    getCompressedDataAsync: function(w) {
      p(!0, w);
    },
    setData: function(w) {
      s = Ae.toBuffer(w, Ae.decoder.encode), !o && s.length ? (n.size = s.length, n.method = Ae.Constants.DEFLATED, n.crc = Ae.crc32(w), n.changed = !0) : n.method = Ae.Constants.STORED;
    },
    getData: function(w) {
      return n.changed ? s : m(!1, null, w);
    },
    getDataAsync: function(w, A) {
      n.changed ? w(s) : m(!0, w, A);
    },
    set attr(w) {
      n.attr = w;
    },
    get attr() {
      return n.attr;
    },
    set header(w) {
      n.loadFromBinary(w);
    },
    get header() {
      return n;
    },
    packCentralHeader: function() {
      n.flags_efs = this.efs, n.extraLength = a.length;
      var w = n.centralHeaderToBinary(), A = Ae.Constants.CENHDR;
      return r.copy(w, A), A += r.length, a.copy(w, A), A += n.extraLength, i.copy(w, A), w;
    },
    packLocalHeader: function() {
      let w = 0;
      n.flags_efs = this.efs, n.extraLocalLength = c.length;
      const A = n.localHeaderToBinary(), C = Buffer.alloc(A.length + r.length + n.extraLocalLength);
      return A.copy(C, w), w += A.length, r.copy(C, w), w += r.length, c.copy(C, w), w += c.length, C;
    },
    toJSON: function() {
      const w = function(A) {
        return "<" + (A && A.length + " bytes buffer" || "null") + ">";
      };
      return {
        entryName: this.entryName,
        name: this.name,
        comment: this.comment,
        isDirectory: this.isDirectory,
        header: n.toJSON(),
        compressedData: w(t),
        data: w(s)
      };
    },
    toString: function() {
      return JSON.stringify(this.toJSON(), null, "	");
    }
  };
};
const xd = Qm, m1 = ba, st = Oo;
var g1 = function(e, t) {
  var n = [], r = {}, i = Buffer.alloc(0), o = new m1.MainHeader(), s = !1;
  const a = /* @__PURE__ */ new Set(), c = t, { noSort: u, decoder: l } = c;
  e ? d(c.readEntries) : s = !0;
  function f() {
    const p = /* @__PURE__ */ new Set();
    for (const v of Object.keys(r)) {
      const y = v.split("/");
      if (y.pop(), !!y.length)
        for (let g = 0; g < y.length; g++) {
          const w = y.slice(0, g + 1).join("/") + "/";
          p.add(w);
        }
    }
    for (const v of p)
      if (!(v in r)) {
        const y = new xd(c);
        y.entryName = v, y.attr = 16, y.temporary = !0, n.push(y), r[y.entryName] = y, a.add(y);
      }
  }
  function h() {
    if (s = !0, r = {}, o.diskEntries > (e.length - o.offset) / st.Constants.CENHDR)
      throw st.Errors.DISK_ENTRY_TOO_LARGE();
    n = new Array(o.diskEntries);
    for (var p = o.offset, v = 0; v < n.length; v++) {
      var y = p, g = new xd(c, e);
      g.header = e.slice(y, y += st.Constants.CENHDR), g.entryName = e.slice(y, y += g.header.fileNameLength), g.header.extraLength && (g.extra = e.slice(y, y += g.header.extraLength)), g.header.commentLength && (g.comment = e.slice(y, y + g.header.commentLength)), p += g.header.centralHeaderSize, n[v] = g, r[g.entryName] = g;
    }
    a.clear(), f();
  }
  function d(p) {
    var v = e.length - st.Constants.ENDHDR, y = Math.max(0, v - 65535), g = y, w = e.length, A = -1, C = 0;
    for ((typeof c.trailingSpace == "boolean" ? c.trailingSpace : !1) && (y = 0), v; v >= g; v--)
      if (e[v] === 80) {
        if (e.readUInt32LE(v) === st.Constants.ENDSIG) {
          A = v, C = v, w = v + st.Constants.ENDHDR, g = v - st.Constants.END64HDR;
          continue;
        }
        if (e.readUInt32LE(v) === st.Constants.END64SIG) {
          g = y;
          continue;
        }
        if (e.readUInt32LE(v) === st.Constants.ZIP64SIG) {
          A = v, w = v + st.readBigUInt64LE(e, v + st.Constants.ZIP64SIZE) + st.Constants.ZIP64LEAD;
          break;
        }
      }
    if (A == -1) throw st.Errors.INVALID_FORMAT();
    o.loadFromBinary(e.slice(A, w)), o.commentLength && (i = e.slice(C + st.Constants.ENDHDR)), p && h();
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
      i = st.toBuffer(p, l.encode), o.commentLength = i.length;
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
      this.getEntryChildren(y, v).map((w) => w.entryName).forEach(this.deleteEntry);
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
          for (const w of n)
            w.entryName.startsWith(g) && y.push(w);
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
      let w = 0;
      for (const F of this.entries) {
        const q = F.getCompressedData();
        F.header.offset = g;
        const K = F.packLocalHeader(), H = K.length + q.length;
        g += H, p.push(K), p.push(q);
        const S = F.packCentralHeader();
        v.push(S), o.size += S.length, y += H + S.length, w++;
      }
      y += o.mainHeaderSize, o.offset = g, o.totalEntries = w, g = 0;
      const A = Buffer.alloc(y);
      for (const F of p)
        F.copy(A, g), g += F.length;
      for (const F of v)
        F.copy(A, g), g += F.length;
      const C = o.toBinary();
      return i && i.copy(C, st.Constants.ENDHDR), C.copy(A, g), e = A, s = !1, A;
    },
    toAsyncBuffer: function(p, v, y, g) {
      try {
        s || h(), m();
        const w = [], A = [];
        let C = 0, F = 0, q = 0;
        o.size = 0, o.offset = 0;
        const K = function(H) {
          if (H.length > 0) {
            const S = H.shift(), j = S.entryName + S.extra.toString();
            y && y(j), S.getCompressedDataAsync(function(V) {
              g && g(j), S.header.offset = F;
              const Z = S.packLocalHeader(), D = Z.length + V.length;
              F += D, w.push(Z), w.push(V);
              const L = S.packCentralHeader();
              A.push(L), o.size += L.length, C += D + L.length, q++, K(H);
            });
          } else {
            C += o.mainHeaderSize, o.offset = F, o.totalEntries = q, F = 0;
            const S = Buffer.alloc(C);
            w.forEach(function(V) {
              V.copy(S, F), F += V.length;
            }), A.forEach(function(V) {
              V.copy(S, F), F += V.length;
            });
            const j = o.toBinary();
            i && i.copy(j, st.Constants.ENDHDR), j.copy(S, F), e = S, s = !1, p(S);
          }
        };
        K(Array.from(this.entries));
      } catch (w) {
        v(w);
      }
    }
  };
};
const He = Oo, Be = k, y1 = Qm, v1 = g1, dr = (...e) => He.findLast(e, (t) => typeof t == "boolean"), kd = (...e) => He.findLast(e, (t) => typeof t == "string"), E1 = (...e) => He.findLast(e, (t) => typeof t == "function"), _1 = {
  // option "noSort" : if true it disables files sorting
  noSort: !1,
  // read entries during load (initial loading may be slower)
  readEntries: !1,
  // default method is none
  method: He.Constants.NONE,
  // file system
  fs: null
};
var w1 = function(e, t) {
  let n = null;
  const r = Object.assign(/* @__PURE__ */ Object.create(null), _1);
  e && typeof e == "object" && (e instanceof Uint8Array || (Object.assign(r, e), e = r.input ? r.input : void 0, r.input && delete r.input), Buffer.isBuffer(e) && (n = e, r.method = He.Constants.BUFFER, e = void 0)), Object.assign(r, t);
  const i = new He(r);
  if ((typeof r.decoder != "object" || typeof r.decoder.encode != "function" || typeof r.decoder.decode != "function") && (r.decoder = He.decoder), e && typeof e == "string")
    if (i.fs.existsSync(e))
      r.method = He.Constants.FILE, r.filename = e, n = i.fs.readFileSync(e);
    else
      throw He.Errors.INVALID_FILENAME();
  const o = new v1(n, r), { canonical: s, sanitize: a, zipnamefix: c } = He;
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
        const g = i.fs.statSync(d), w = g.isFile() ? i.fs.readFileSync(d) : Buffer.alloc(0);
        g.isDirectory() && (m += i.sep), this.addFile(m, w, v, g);
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
      const w = this;
      i.fs.stat(p, function(A, C) {
        if (A) return m(A, !1);
        y = y ? l(y) : "";
        const F = Be.win32.basename(Be.win32.normalize(p));
        if (y += g || F, C.isFile())
          i.fs.readFile(p, function(q, K) {
            return q ? m(q, !1) : (w.addFile(y, K, v, C), setImmediate(m, void 0, !0));
          });
        else if (C.isDirectory())
          return y += i.sep, w.addFile(y, Buffer.alloc(0), v, C), setImmediate(m, void 0, !0);
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
            const w = Be.join(m, h(d, g));
            p(w) && y.addLocalFile(g, Be.dirname(w));
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
          var w = i.findFiles(d), A = -1, C = function() {
            if (A += 1, A < w.length) {
              var F = w[A], q = h(d, F).split("\\").join("/");
              q = q.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, ""), v(q) ? i.fs.stat(F, function(K, H) {
                K && m(void 0, K), H.isFile() ? i.fs.readFile(F, function(S, j) {
                  S ? m(void 0, S) : (y.addFile(p + q, j, "", H), C());
                }) : (y.addFile(p + q + "/", Buffer.alloc(0), "", H), C());
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
        return function(F) {
          return C.test(F);
        };
      }(y) : typeof y != "function" && (y = function() {
        return !0;
      }), v = v ? l(v) : "", g == "latin1" && (g = (C) => C.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "")), typeof g != "function" && (g = (C) => C);
      const w = (C) => Be.join(v, g(h(localPath, C))), A = (C) => Be.win32.basename(Be.win32.normalize(g(C)));
      i.fs.open(localPath, "r", function(C) {
        C && C.code === "ENOENT" ? m(void 0, He.Errors.FILE_NOT_FOUND(localPath)) : C ? m(void 0, C) : i.findFilesAsync(localPath, function(F, q) {
          if (F) return m(F);
          q = q.filter((K) => y(w(K))), q.length || m(void 0, !1), setImmediate(
            q.reverse().reduce(function(K, H) {
              return function(S, j) {
                if (S || j === !1) return setImmediate(K, S, !1);
                p.addLocalFileAsync(
                  {
                    localPath: H,
                    zipPath: Be.dirname(w(H)),
                    zipName: A(H)
                  },
                  K
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
      g || (y = new y1(r), y.entryName = d), y.comment = p || "";
      const w = typeof v == "object" && v instanceof i.fs.Stats;
      w && (y.header.time = v.mtime);
      var A = y.isDirectory ? 16 : 0;
      let C = y.isDirectory ? 16384 : 32768;
      return w ? C |= 4095 & v.mode : typeof v == "number" ? C |= 4095 & v : C |= y.isDirectory ? 493 : 420, A = (A | C << 16) >>> 0, y.attr = A, y.setData(m), g || o.setEntry(y), y;
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
      v = dr(!1, v), y = dr(!1, y), p = dr(!0, p), g = kd(y, g);
      var w = u(d);
      if (!w)
        throw He.Errors.NO_ENTRY();
      var A = s(w.entryName), C = a(m, g && !w.isDirectory ? g : p ? A : Be.basename(A));
      if (w.isDirectory) {
        var F = o.getEntryChildren(w);
        return F.forEach(function(H) {
          if (H.isDirectory) return;
          var S = H.getData();
          if (!S)
            throw He.Errors.CANT_EXTRACT_FILE();
          var j = s(H.entryName), V = a(m, p ? j : Be.basename(j));
          const Z = y ? H.header.fileAttr : void 0;
          i.writeFileTo(V, S, v, Z);
        }), !0;
      }
      var q = w.getData(o.password);
      if (!q) throw He.Errors.CANT_EXTRACT_FILE();
      if (i.fs.existsSync(C) && !v)
        throw He.Errors.CANT_OVERRIDE();
      const K = y ? d.header.fileAttr : void 0;
      return i.writeFileTo(C, q, v, K), !0;
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
      if (p = dr(!1, p), v = kd(p, v), m = dr(!1, m), !o) throw He.Errors.NO_ZIP();
      o.entries.forEach(function(y) {
        var g = a(d, s(y.entryName));
        if (y.isDirectory) {
          i.makeDir(g);
          return;
        }
        var w = y.getData(v);
        if (!w)
          throw He.Errors.CANT_EXTRACT_FILE();
        const A = p ? y.header.fileAttr : void 0;
        i.writeFileTo(g, w, m, A);
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
      if (v = E1(m, p, v), p = dr(!1, p), m = dr(!1, m), !v)
        return new Promise((C, F) => {
          this.extractAllToAsync(d, m, p, function(q) {
            q ? F(q) : C(this);
          });
        });
      if (!o) {
        v(He.Errors.NO_ZIP());
        return;
      }
      d = Be.resolve(d);
      const y = (C) => a(d, Be.normalize(s(C.entryName))), g = (C, F) => new Error(C + ': "' + F + '"'), w = [], A = [];
      o.entries.forEach((C) => {
        C.isDirectory ? w.push(C) : A.push(C);
      });
      for (const C of w) {
        const F = y(C), q = p ? C.header.fileAttr : void 0;
        try {
          i.makeDir(F), q && i.fs.chmodSync(F, q), i.fs.utimesSync(F, C.header.time, C.header.time);
        } catch {
          v(g("Unable to create folder", F));
        }
      }
      A.reverse().reduce(function(C, F) {
        return function(q) {
          if (q)
            C(q);
          else {
            const K = Be.normalize(s(F.entryName)), H = a(d, K);
            F.getDataAsync(function(S, j) {
              if (j)
                C(j);
              else if (!S)
                C(He.Errors.CANT_EXTRACT_FILE());
              else {
                const V = p ? F.header.fileAttr : void 0;
                i.writeFileToAsync(H, S, m, V, function(Z) {
                  Z || C(g("Unable to write file", H)), i.fs.utimes(H, F.header.time, F.header.time, function(D) {
                    D ? C(g("Unable to set times", H)) : C();
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
        !d && r.filename && (d = r.filename), d || g("ADM-ZIP: ZIP File Name Missing"), this.toBufferPromise().then((w) => {
          const A = (C) => C ? y(C) : g("ADM-ZIP: Wasn't able to write zip file");
          i.writeFileToAsync(d, w, p, v, A);
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
const pn = /* @__PURE__ */ Cl(w1), $1 = [
  "C:\\Program Files\\Java",
  "C:\\Program Files (x86)\\Java",
  "C:\\Program Files\\Eclipse Adoptium",
  "C:\\Program Files\\Microsoft",
  "C:\\Program Files\\Zulu",
  "C:\\Program Files\\BellSoft",
  "C:\\Program Files\\Amazon Corretto",
  "C:\\Program Files (x86)\\Common Files\\Oracle\\Java",
  "C:\\Program Files\\Common Files\\Oracle\\Java",
  process.env.APPDATA ? k.join(process.env.APPDATA, "PrismLauncher\\java") : "",
  process.env.LOCALAPPDATA ? k.join(process.env.LOCALAPPDATA, "Packages") : "",
  oe.java
], S1 = [
  "/Library/Java/JavaVirtualMachines",
  "/usr/local/opt"
], b1 = [
  "/usr/lib/jvm",
  "/usr/java"
], A1 = "https://api.adoptium.net/v3";
function T1(e) {
  var t, n;
  try {
    const i = Sl(`"${e}" -version 2>&1`, {
      timeout: 5e3,
      stdio: "pipe"
    }).toString().match(/version "([^"]+)"/);
    return i ? i[1] : null;
  } catch (r) {
    const o = (((t = r.stderr) == null ? void 0 : t.toString()) ?? ((n = r.stdout) == null ? void 0 : n.toString()) ?? "").match(/version "([^"]+)"/);
    return o ? o[1] : null;
  }
}
function C1(e) {
  try {
    const t = Sl(`"${e}" -XshowSettings:all -version 2>&1`, { timeout: 5e3 }).toString();
    return t.includes("amd64") || t.includes("x86_64") ? "amd64" : t.includes("aarch64") || t.includes("arm64") ? "arm64" : t.includes("x86") ? "x86" : "amd64";
  } catch {
    return "amd64";
  }
}
function al(e) {
  const t = [];
  if (!e || !x.existsSync(e)) return t;
  try {
    const n = x.readdirSync(e);
    for (const r of n) {
      const i = k.join(e, r);
      if (!x.statSync(i).isDirectory()) continue;
      const o = [
        k.join(i, "bin", "javaw.exe"),
        k.join(i, "bin", "java"),
        k.join(i, "jre", "bin", "javaw.exe"),
        k.join(i, "jre", "bin", "java"),
        k.join(i, "Contents", "Home", "bin", "java")
      ];
      for (const s of o)
        if (x.existsSync(s)) {
          const a = T1(s);
          if (a) {
            t.push({
              version: a,
              architecture: C1(s),
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
function N1(e) {
  const t = e.split("."), n = parseInt(t[1] ?? "0");
  return parseInt(t[2] ?? "0"), n >= 21 ? 21 : n >= 18 || n >= 17 ? 17 : 8;
}
function I1(e) {
  return new Promise((t, n) => {
    _t.get(e, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (r) => {
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
function P1(e, t, n) {
  return new Promise((r, i) => {
    x.mkdirSync(k.dirname(t), { recursive: !0 });
    const o = (s, a = 0) => {
      if (a > 5) return i(new Error("Too many redirects"));
      _t.get(s, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (c) => {
        if ([301, 302, 307, 308].includes(c.statusCode)) {
          const h = c.headers.location;
          return o(h.startsWith("http") ? h : new URL(h, s).toString(), a + 1);
        }
        if (c.statusCode !== 200) return i(new Error(`HTTP ${c.statusCode}`));
        const u = parseInt(c.headers["content-length"] ?? "0");
        let l = 0;
        const f = x.createWriteStream(t);
        c.on("data", (h) => {
          l += h.length, u && n && n(Math.round(l / u * 100));
        }), c.pipe(f), f.on("finish", () => {
          f.close(), r();
        }), f.on("error", (h) => {
          x.unlink(t, () => {
          }), i(h);
        });
      }).on("error", i);
    };
    o(e);
  });
}
async function O1(e, t) {
  try {
    const n = process.platform === "win32" ? "windows" : process.platform === "darwin" ? "mac" : "linux", r = process.arch === "arm64" ? "aarch64" : "x64", i = "jdk";
    t == null || t(`Fetching Java ${e} info...`);
    const o = await I1(
      `${A1}/assets/latest/${e}/hotspot?architecture=${r}&image_type=${i}&os=${n}&vendor=eclipse`
    );
    if (!(o != null && o.length))
      return t == null || t(`No Java ${e} release found`), null;
    const c = o[0].binary.package, u = c.link, l = c.name, f = k.join(oe.java, `java-${e}`), h = k.join(f, l);
    if (x.mkdirSync(f, { recursive: !0 }), t == null || t(`Downloading Java ${e}...`), await P1(u, h, (m) => {
      t == null || t(`Downloading Java ${e}: ${m}%`);
    }), t == null || t(`Extracting Java ${e}...`), l.endsWith(".zip"))
      new pn(h).extractAllTo(f, !0);
    else if (l.endsWith(".tar.gz")) {
      const { execSync: m } = await import("child_process");
      m(`tar -xzf "${h}" -C "${f}"`);
    }
    x.unlinkSync(h);
    const d = al(f);
    return d.length > 0 ? (t == null || t(`Java ${e} installed!`), d[0].path) : null;
  } catch (n) {
    return t == null || t(`Failed to auto-download Java ${e}: ${n}`), null;
  }
}
const Hs = {
  detect() {
    const e = process.platform, t = e === "win32" ? $1 : e === "darwin" ? S1 : b1, n = [], r = /* @__PURE__ */ new Set();
    for (const i of t) {
      const o = al(i);
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
    return x.existsSync(e) ? al(e) : [];
  },
  async getJavaForVersion(e, t) {
    const n = N1(e), r = this.getInstalled(), i = this.detect(), o = [...r, ...i], s = o.find((a) => {
      const c = a.version;
      return (c.startsWith("1.") ? parseInt(c.split(".")[1]) : parseInt(c.split(".")[0])) === n;
    });
    return console.log("[Java] Required major:", n, "| All versions:", o.map((a) => a.version)), s ? s.path : (t == null || t(`Java ${n} not found, downloading automatically...`), O1(n, t));
  }
}, Lu = "00000000402b5328", Ca = "https://login.live.com/oauth20_desktop.srf", R1 = `https://login.live.com/oauth20_authorize.srf?client_id=${Lu}&response_type=code&redirect_uri=${encodeURIComponent(Ca)}&scope=XboxLive.signin%20offline_access`;
function Ro(e, t, n) {
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
    }, a = _t.request(s, (c) => {
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
function D1(e, t) {
  return new Promise((n, r) => {
    const i = new URL(e), o = {
      hostname: i.hostname,
      path: i.pathname + i.search,
      method: "GET",
      headers: {
        Accept: "application/json",
        ...t
      }
    }, s = _t.request(o, (a) => {
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
async function F1(e) {
  const t = new URLSearchParams({
    client_id: Lu,
    code: e,
    grant_type: "authorization_code",
    redirect_uri: Ca
  }).toString(), n = await Ro(
    "https://login.live.com/oauth20_token.srf",
    t,
    { "Content-Type": "application/x-www-form-urlencoded" }
  );
  if (!n.access_token) throw new Error("Failed to get Microsoft token: " + JSON.stringify(n));
  return n;
}
async function eg(e) {
  const t = JSON.stringify({
    Properties: {
      AuthMethod: "RPS",
      SiteName: "user.auth.xboxlive.com",
      RpsTicket: `d=${e}`
    },
    RelyingParty: "http://auth.xboxlive.com",
    TokenType: "JWT"
  }), n = await Ro(
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
async function tg(e) {
  const t = JSON.stringify({
    Properties: {
      SandboxId: "RETAIL",
      UserTokens: [e]
    },
    RelyingParty: "rp://api.minecraftservices.com/",
    TokenType: "JWT"
  }), n = await Ro(
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
async function ng(e, t) {
  const n = JSON.stringify({
    identityToken: `XBL3.0 x=${t};${e}`
  }), r = await Ro(
    "https://api.minecraftservices.com/authentication/login_with_xbox",
    n,
    { "Content-Type": "application/json" }
  );
  if (!r.access_token) throw new Error("Failed to get Minecraft token");
  return r.access_token;
}
async function L1(e) {
  const t = await D1(
    "https://api.minecraftservices.com/minecraft/profile",
    { Authorization: `Bearer ${e}` }
  );
  if (!t.id) throw new Error("Failed to get Minecraft profile. Do you own Minecraft?");
  return { id: t.id, name: t.name };
}
async function x1() {
  return new Promise((e, t) => {
    const n = new _e({
      width: 500,
      height: 650,
      title: "Sign in with Microsoft",
      webPreferences: {
        nodeIntegration: !1,
        contextIsolation: !0
      }
    });
    n.setMenuBarVisibility(!1), n.loadURL(R1);
    let r = !1;
    const i = async (o) => {
      if (!o.startsWith(Ca) || r) return;
      r = !0;
      const s = new URL(o), a = s.searchParams.get("code"), c = s.searchParams.get("error");
      if (c) {
        n.close(), t(new Error("Microsoft auth error: " + c));
        return;
      }
      if (a) {
        n.close();
        try {
          const u = await F1(a), l = await eg(u.access_token), f = await tg(l.token), h = await ng(f.token, f.uhs), d = await L1(h), m = {
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
async function k1(e) {
  const t = new URLSearchParams({
    client_id: Lu,
    refresh_token: e,
    grant_type: "refresh_token",
    redirect_uri: Ca
  }).toString(), n = await Ro(
    "https://login.live.com/oauth20_token.srf",
    t,
    { "Content-Type": "application/x-www-form-urlencoded" }
  ), r = await eg(n.access_token), i = await tg(r.token);
  return {
    accessToken: await ng(i.token, i.uhs),
    refreshToken: n.refresh_token,
    expiresAt: new Date(Date.now() + 864e5).toISOString(),
    status: "ready"
  };
}
function hr() {
  try {
    if (!x.existsSync(oe.accounts)) return [];
    const e = x.readFileSync(oe.accounts, "utf-8");
    return JSON.parse(e);
  } catch {
    return [];
  }
}
function Gr(e) {
  x.writeFileSync(oe.accounts, JSON.stringify(e, null, 2));
}
const gr = {
  getAll() {
    return hr();
  },
  async addMicrosoft() {
    const e = await x1(), t = hr(), n = t.findIndex((r) => r.id === e.id);
    return n >= 0 ? t[n] = e : (t.length === 0 && (e.isActive = !0), t.push(e)), Gr(t), e;
  },
  remove(e) {
    const t = hr().filter((n) => n.id !== e);
    Gr(t);
  },
  setActive(e) {
    const t = hr().map((n) => ({ ...n, isActive: n.id === e }));
    Gr(t);
  },
  getActive() {
    return hr().find((e) => e.isActive) ?? null;
  },
  async refresh(e) {
    const t = hr(), n = t.find((r) => r.id === e);
    if (!n) throw new Error("Account not found");
    try {
      const r = await k1(n.refreshToken);
      Object.assign(n, r), Gr(t);
    } catch {
      n.status = "errored", Gr(t);
    }
  },
  addOffline(e) {
    const t = hr(), n = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (o, s) => {
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
    return i >= 0 ? t[i] = r : t.push(r), Gr(t), r;
  }
};
function Ud() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
function vc(e) {
  try {
    const t = k.join(e, "instance.json");
    if (!x.existsSync(t)) return null;
    const n = x.readFileSync(t, "utf-8");
    return JSON.parse(n);
  } catch {
    return null;
  }
}
function ds(e) {
  const t = k.join(oe.instances, e.id);
  x.existsSync(t) || x.mkdirSync(t, { recursive: !0 }), x.writeFileSync(
    k.join(t, "instance.json"),
    JSON.stringify(e, null, 2)
  );
}
const Vt = {
  getAll() {
    if (!x.existsSync(oe.instances)) return [];
    const e = x.readdirSync(oe.instances), t = [];
    for (const n of e) {
      const r = k.join(oe.instances, n);
      if (!x.statSync(r).isDirectory()) continue;
      const i = vc(r);
      i && t.push(i);
    }
    return t;
  },
  create(e) {
    const t = Ud(), n = {
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
    }, r = k.join(oe.instances, t);
    return x.mkdirSync(k.join(r, "minecraft"), { recursive: !0 }), ds(n), n;
  },
  delete(e) {
    const t = k.join(oe.instances, e);
    x.existsSync(t) && x.rmSync(t, { recursive: !0, force: !0 });
  },
  copy(e) {
    const t = k.join(oe.instances, e), n = vc(t);
    if (!n) throw new Error(`Instance ${e} not found`);
    const r = Ud(), i = {
      ...n,
      id: r,
      name: n.name + " (Copy)",
      lastPlayed: null,
      totalPlayTime: 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }, o = k.join(oe.instances, r);
    return x.mkdirSync(k.join(o, "minecraft"), { recursive: !0 }), ds(i), i;
  },
  launch(e) {
    console.log(`Launching instance ${e}`);
  },
  updatePlayTime(e, t) {
    const n = k.join(oe.instances, e), r = vc(n);
    r && (r.lastPlayed = (/* @__PURE__ */ new Date()).toISOString(), r.totalPlayTime += t, ds(r));
  },
  update(e) {
    ds(e);
  }
}, br = /* @__PURE__ */ new Map(), Ec = /* @__PURE__ */ new Map(), qs = /* @__PURE__ */ new Map();
function U1(e, t) {
  qs.set(e, t), t.on("closed", () => qs.delete(e));
}
function zs(e) {
  return new Promise((t, n) => {
    const r = (i, o = 0) => {
      if (o > 5) return n(new Error("Too many redirects"));
      _t.get(i, (s) => {
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
function Bt(e, t) {
  return new Promise((n, r) => {
    if (x.existsSync(t)) return n();
    x.mkdirSync(k.dirname(t), { recursive: !0 });
    const i = (o, s = 0) => {
      if (s > 5) return r(new Error("Too many redirects"));
      _t.get(o, (a) => {
        if ([301, 302, 307, 308].includes(a.statusCode)) {
          const u = a.headers.location;
          return u ? i(u.startsWith("http") ? u : new URL(u, o).toString(), s + 1) : r(new Error("Redirect with no location"));
        }
        if (a.statusCode !== 200) return r(new Error(`HTTP ${a.statusCode} for ${o}`));
        const c = x.createWriteStream(t);
        a.pipe(c), c.on("finish", () => {
          c.close(), n();
        }), c.on("error", (u) => {
          x.unlink(t, () => {
          }), r(u);
        });
      }).on("error", (a) => {
        x.unlink(t, () => {
        }), r(a);
      });
    };
    i(e);
  });
}
function Ne(e, t) {
  var n;
  (n = qs.get(e)) == null || n.webContents.send("instance:log", { instanceId: e, line: t });
}
function hs(e, t) {
  var n;
  (n = qs.get(e)) == null || n.webContents.send("instance:status", { instanceId: e, status: t });
}
function jd(e, t) {
  _e.getAllWindows().forEach((n) => n.webContents.send(e, t));
}
async function j1(e, t, n, r) {
  const i = await zs(`https://meta.fabricmc.net/v2/versions/loader/${e}/${t}/profile/json`);
  for (const o of i.libraries) {
    const [s, a, c] = o.name.split(":"), u = s.replace(/\./g, "/"), l = `${a}-${c}.jar`, f = k.join(r, u, a, c, l), h = o.url ? `${o.url}${u}/${a}/${c}/${l}` : `https://maven.fabricmc.net/${u}/${a}/${c}/${l}`;
    await Bt(h, f), n.unshift(f);
  }
  return i.mainClass;
}
async function M1(e, t, n, r) {
  const i = await zs(`https://meta.quiltmc.org/v3/versions/loader/${e}/${t}/profile/json`);
  for (const o of i.libraries) {
    const [s, a, c] = o.name.split(":"), u = s.replace(/\./g, "/"), l = `${a}-${c}.jar`, f = k.join(r, u, a, c, l), h = o.url ? `${o.url}${u}/${a}/${c}/${l}` : `https://maven.quiltmc.org/repository/release/${u}/${a}/${c}/${l}`;
    await Bt(h, f), n.unshift(f);
  }
  return i.mainClass;
}
function rg(e) {
  const t = k.join(e, "launcher_profiles.json");
  x.existsSync(t) || x.writeFileSync(t, JSON.stringify({
    profiles: {},
    selectedProfile: null,
    clientToken: "fernlaunch",
    authenticationDatabase: {},
    launcherVersion: { name: "2.0", format: 21 }
  }, null, 2));
}
function ig(e, t, n, r, i) {
  return new Promise((o, s) => {
    var u, l;
    const c = Sp(e, ["-jar", t, "--installClient", n], { cwd: n });
    (u = c.stdout) == null || u.on("data", (f) => console.log(`[${r}]`, f.toString().trim())), (l = c.stderr) == null || l.on("data", (f) => console.log(`[${r}]`, f.toString().trim())), c.on("close", (f) => {
      f === 0 ? o() : s(new Error(`${r} exited with code ${f}`));
    }), c.on("error", s);
  });
}
async function B1(e, t, n, r) {
  var y, g, w;
  const i = k.join(n, ".."), o = "https://maven.neoforged.net/releases", s = k.join(n, "net/neoforged/neoforge", t, `neoforge-${t}-installer.jar`), a = k.join(i, "versions", `neoforge-${t}`, `neoforge-${t}.json`);
  await Bt(`${o}/net/neoforged/neoforge/${t}/neoforge-${t}-installer.jar`, s);
  const c = k.join(i, "versions", e, `${e}.jar`), u = k.join(n, "net/minecraft/client", e, `client-${e}.jar`);
  x.existsSync(c) && !x.existsSync(u) && (x.mkdirSync(k.dirname(u), { recursive: !0 }), x.copyFileSync(c, u)), x.existsSync(a) || (rg(i), await ig(r, s, i, "NeoForge Installer"));
  const l = JSON.parse(x.readFileSync(a, "utf-8")), f = [];
  for (const A of l.libraries ?? []) {
    if (!((y = A.downloads) != null && y.artifact)) continue;
    const C = A.downloads.artifact, F = k.join(n, C.path);
    await Bt(C.url, F), x.existsSync(F) && f.push(F);
  }
  const h = k.join(n, "net/neoforged/minecraft-client-patched", t, `minecraft-client-patched-${t}.jar`);
  if (x.existsSync(h)) {
    const A = new pn(h), C = A.getEntries().some((q) => q.entryName.includes("UndashedUuid")), F = A.getEntries().some((q) => q.entryName.includes("GameProfile"));
    console.log("[Patched client] UndashedUuid:", C, "| GameProfile:", F), console.log("[Patched client] authlib entries:", A.getEntries().filter((q) => q.entryName.includes("mojang/authlib") || q.entryName.includes("mojang/util")).map((q) => q.entryName).slice(0, 10));
  }
  const d = new pn(k.join(n, "net/neoforged/neoforge", t, `neoforge-${t}-universal.jar`)), m = d.getEntries().filter((A) => A.entryName.startsWith("META-INF") || A.entryName.includes("authlib") || A.entryName.includes("MANIFEST"));
  console.log("[Universal JAR entries]", m.map((A) => A.entryName));
  const p = d.readAsText("META-INF/MANIFEST.MF");
  console.log("[Universal MANIFEST]", p);
  const v = new pn(s);
  for (const A of v.getEntries())
    if (console.log("[Installer entry]", A.entryName), A.entryName.includes("authlib") && A.entryName.endsWith(".jar")) {
      const C = k.join(n, A.entryName.replace("maven/", ""));
      x.existsSync(C) || (x.mkdirSync(k.dirname(C), { recursive: !0 }), v.extractEntryTo(A, k.dirname(C), !1, !0)), f.includes(C) || f.unshift(C);
      break;
    }
  return {
    mainClass: l.mainClass ?? "net.neoforged.fml.startup.Client",
    gameArgs: (((g = l.arguments) == null ? void 0 : g.game) ?? []).filter((A) => typeof A == "string"),
    jvmArgs: (((w = l.arguments) == null ? void 0 : w.jvm) ?? []).filter((A) => typeof A == "string"),
    neoClasspath: f
  };
}
async function H1(e, t, n, r, i) {
  var y, g, w, A;
  const o = k.join(r, ".."), s = t.includes(e) ? t : `${e}-${t}`, a = "https://maven.minecraftforge.net", c = k.join(r, "net/minecraftforge/forge", s, `forge-${s}-installer.jar`), u = k.join(o, "versions");
  await Bt(`${a}/net/minecraftforge/forge/${s}/forge-${s}-installer.jar`, c), rg(o), x.existsSync(u) || x.mkdirSync(u, { recursive: !0 });
  const l = t.split("-").pop(), f = () => x.readdirSync(u).find((C) => C.toLowerCase().includes("forge") && C.includes(l));
  let h = f();
  const d = new pn(c), m = d.getEntries().some((C) => C.entryName.includes("SimpleInstaller"));
  if (!h)
    if (m) {
      const F = JSON.parse(d.readAsText("install_profile.json")).versionInfo, q = F.id, K = k.join(u, q);
      x.mkdirSync(K, { recursive: !0 }), x.writeFileSync(k.join(K, `${q}.json`), JSON.stringify(F, null, 2));
      for (const H of d.getEntries()) {
        if (!H.entryName.startsWith("maven/")) continue;
        const S = k.join(r, H.entryName.replace("maven/", ""));
        x.existsSync(S) || (x.mkdirSync(k.dirname(S), { recursive: !0 }), d.extractEntryTo(H, k.dirname(S), !1, !0));
      }
      for (const H of F.libraries ?? []) {
        if (H.clientreq === !1) continue;
        const S = H.name.split(":"), j = S[0].replace(/\./g, "/"), V = S[1], Z = S[2], D = `${V}-${Z}.jar`, L = k.join(r, j, V, Z, D);
        if (!x.existsSync(L)) {
          const G = H.url ?? "https://libraries.minecraft.net/";
          try {
            await Bt(`${G}${j}/${V}/${Z}/${D}`, L);
          } catch {
            try {
              await Bt(`${a}/${j}/${V}/${Z}/${D}`, L);
            } catch {
              console.warn(`[Forge] Could not download library: ${H.name}`);
            }
          }
        }
      }
      h = f();
    } else
      await ig(i, c, o, "Forge Installer"), h = f();
  if (!h) throw new Error("Could not find Forge version directory after installation");
  const p = k.join(u, h, `${h}.json`), v = JSON.parse(x.readFileSync(p, "utf-8"));
  if (m)
    for (const C of v.libraries ?? []) {
      const F = C.name.split(":"), q = F[0].replace(/\./g, "/"), K = F[1], H = F[2], S = q.includes("minecraftforge") && K === "forge", j = S ? `${K}-${H}-universal.jar` : `${K}-${H}.jar`, V = k.join(r, q, K, H, j);
      if (!x.existsSync(V) && !S) {
        const Z = [
          C.url ? `${C.url}${q}/${K}/${H}/${j}` : null,
          `https://libraries.minecraft.net/${q}/${K}/${H}/${j}`,
          `https://maven.minecraftforge.net/${q}/${K}/${H}/${j}`
        ].filter(Boolean);
        for (const D of Z)
          try {
            await Bt(D, V);
            break;
          } catch {
            console.warn(`[Forge] Failed: ${D}`);
          }
      }
      x.existsSync(V) ? n.unshift(V) : console.warn(`[Forge] Missing lib: ${C.name}`);
    }
  return console.log("[Forge versionProfile libs]", JSON.stringify((y = v.libraries) == null ? void 0 : y.slice(0, 3), null, 2)), {
    mainClass: v.mainClass ?? "net.minecraftforge.bootstrap.ForgeBootstrap",
    gameArgs: (g = v.arguments) != null && g.game ? v.arguments.game.filter((C) => typeof C == "string") : ((w = v.minecraftArguments) == null ? void 0 : w.split(" ")) ?? [],
    jvmArgs: (((A = v.arguments) == null ? void 0 : A.jvm) ?? []).filter((C) => typeof C == "string")
  };
}
function q1() {
  return process.platform === "win32" ? "windows" : process.platform === "darwin" ? "osx" : "linux";
}
function qi(e, t) {
  return e.map((n) => {
    for (const [r, i] of Object.entries(t))
      n = n.replace(new RegExp(`\\$\\{${r}\\}`, "g"), i);
    return n;
  });
}
async function z1(e) {
  var U, I, me, be, Te, ke, Ue, et, Oe;
  if (br.has(e)) throw new Error("Instance is already running!");
  const t = k.join(oe.instances, e), n = k.join(t, "instance.json");
  if (!x.existsSync(n)) throw new Error("Instance not found");
  const r = JSON.parse(x.readFileSync(n, "utf-8")), i = k.join(t, "minecraft"), o = fn.store, s = gr.getActive();
  if (console.log("[Launch] Active account:", s == null ? void 0 : s.minecraftUsername, s == null ? void 0 : s.type), !s) throw new Error("No active account. Please log in first.");
  hs(e, "downloading"), Ne(e, "🌿 Fernlauncher starting..."), Ne(e, `Launching ${r.name} (${r.version})`), Ne(e, "Fetching version manifest...");
  const c = (await zs("https://launchermeta.mojang.com/mc/game/version_manifest_v2.json")).versions.find((X) => X.id === r.version);
  if (!c) throw new Error(`Version ${r.version} not found in manifest`);
  const u = await zs(c.url), l = k.join(oe.appData, "versions", r.version);
  x.mkdirSync(l, { recursive: !0 }), Ne(e, "Downloading Minecraft client...");
  const f = k.join(l, `${r.version}.jar`);
  await Bt(u.downloads.client.url, f), Ne(e, "Downloading libraries...");
  const h = k.join(oe.appData, "libraries"), d = [], m = q1(), p = r.modLoader === "neoforge" || r.modLoader === "forge";
  for (const X of u.libraries) {
    if (X.rules && !X.rules.every((Ce) => {
      var tt;
      const ft = (tt = Ce.os) == null ? void 0 : tt.name;
      return ft ? Ce.action === "allow" ? ft === m : ft !== m : Ce.action === "allow";
    }))
      continue;
    const ve = (U = X.downloads) == null ? void 0 : U.artifact;
    if (!ve || p && ((I = X.name) != null && I.includes("log4j-slf4j"))) continue;
    const Ee = k.join(h, ve.path);
    await Bt(ve.url, Ee), d.push(Ee);
  }
  r.modLoader !== "neoforge" && d.push(f), Ne(e, "Finding Java...");
  const v = (() => {
    const X = parseInt(r.version.split(".")[1] ?? "0");
    return X >= 21 ? 21 : X >= 17 ? 17 : 8;
  })();
  function y(X) {
    try {
      const Ee = Sl(`"${X}" -version 2>&1`, { timeout: 5e3 }).toString().match(/version "([^"]+)"/);
      if (!Ee) return 0;
      const we = Ee[1];
      return we.startsWith("1.") ? parseInt(we.split(".")[1]) : parseInt(we.split(".")[0]);
    } catch {
      return 0;
    }
  }
  let g = o.java.executable;
  if (g && x.existsSync(g)) {
    const X = y(g);
    Ne(e, `Configured Java version: ${X}, required: ${v}`), X !== v && (Ne(e, `Finding Java ${v}...`), g = await Hs.getJavaForVersion(r.version, (ve) => Ne(e, ve)) ?? "");
  } else
    g = await Hs.getJavaForVersion(r.version, (X) => Ne(e, X)) ?? "";
  if (!g || !x.existsSync(g))
    throw new Error(`No Java ${v} found. Please install it in Settings → Java.`);
  let w = u.mainClass, A = [], C = [], F = [], q = [], K = [];
  if (r.modLoader === "fabric" && r.modLoaderVersion)
    Ne(e, "Applying Fabric loader..."), w = await j1(r.version, r.modLoaderVersion, d, h), Ne(e, `Fabric main class: ${w}`);
  else if (r.modLoader === "quilt" && r.modLoaderVersion)
    Ne(e, "Applying Quilt loader..."), w = await M1(r.version, r.modLoaderVersion, d, h), Ne(e, `Quilt main class: ${w}`);
  else if (r.modLoader === "neoforge" && r.modLoaderVersion) {
    Ne(e, "Applying NeoForge loader...");
    const X = await B1(r.version, r.modLoaderVersion, h, g);
    w = X.mainClass, A = X.gameArgs, C = X.jvmArgs, F = X.neoClasspath, Ne(e, `NeoForge main class: ${w}`);
  } else if (r.modLoader === "forge" && r.modLoaderVersion) {
    Ne(e, "Applying Forge loader...");
    const X = await H1(r.version, r.modLoaderVersion, d, h, g);
    w = X.mainClass, q = X.gameArgs, K = X.jvmArgs, Ne(e, `Forge main class: ${w}`), console.log("[Old Forge] gameArgs:", X.gameArgs), console.log("[Old Forge] jvmArgs:", X.jvmArgs);
  }
  const H = /* @__PURE__ */ new Set(), S = [];
  for (const X of [...F, ...d]) {
    const ve = k.basename(X);
    H.has(ve) || (H.add(ve), S.push(X));
  }
  Ne(e, "Downloading assets...");
  const j = k.join(oe.appData, "assets"), V = k.join(j, "indexes"), Z = k.join(j, "objects");
  x.mkdirSync(V, { recursive: !0 }), x.mkdirSync(Z, { recursive: !0 });
  const D = u.assetIndex, L = k.join(V, `${D.id}.json`);
  await Bt(D.url, L);
  const G = Object.entries(JSON.parse(x.readFileSync(L, "utf-8")).objects);
  let z = 0;
  const Y = 64;
  for (let X = 0; X < G.length; X += Y)
    await Promise.all(G.slice(X, X + Y).map(async ([, ve]) => {
      const Ee = ve.hash, we = Ee.substring(0, 2), Ce = k.join(Z, we, Ee);
      x.existsSync(Ce) || await Bt(`https://resources.download.minecraft.net/${we}/${Ee}`, Ce), z++;
      const ft = Math.round(z / G.length * 100);
      (z % 50 === 0 || z === G.length) && Ne(e, `Assets: ${z}/${G.length} (${ft}%)`);
    }));
  Ne(e, "Building launch arguments...");
  const J = k.join(l, "natives");
  if (x.mkdirSync(J, { recursive: !0 }), x.mkdirSync(i, { recursive: !0 }), parseInt(r.version.split(".")[1] ?? "0") <= 12) {
    const X = process.platform === "win32" ? "windows" : process.platform === "darwin" ? "osx" : "linux";
    for (const ve of u.libraries) {
      if (!((me = ve.natives) != null && me[X]) || ve.rules && !ve.rules.every((tt) => {
        var Di;
        const dt = (Di = tt.os) == null ? void 0 : Di.name;
        return dt ? tt.action === "allow" ? dt === X : dt !== X : tt.action === "allow";
      }))
        continue;
      const Ee = ve.natives[X].replace("${arch}", "64"), we = (Te = (be = ve.downloads) == null ? void 0 : be.classifiers) == null ? void 0 : Te[Ee];
      if (!we) continue;
      const Ce = k.join(h, we.path);
      if (await Bt(we.url, Ce), x.existsSync(Ce)) {
        const ft = new pn(Ce);
        ft.getEntries().forEach((tt) => {
          !tt.isDirectory && (tt.entryName.endsWith(".dll") || tt.entryName.endsWith(".so") || tt.entryName.endsWith(".dylib")) && ft.extractEntryTo(tt, J, !1, !0);
        }), console.log("[Natives] Extracted from", we.path);
      }
    }
    console.log("[Natives] dir after extraction:", x.readdirSync(J));
  }
  console.log("[Natives] dir contents:", x.readdirSync(J)), console.log("[Natives] lwjgl native jars:", u.libraries.filter((X) => X.natives).map((X) => X.name));
  const N = process.platform === "win32" ? ";" : ":", R = S.join(N), O = {
    natives_directory: J,
    launcher_name: "Fernlauncher",
    launcher_version: "1.0.0",
    classpath: R,
    library_directory: h,
    classpath_separator: N
  }, $ = {
    auth_player_name: s.minecraftUsername,
    version_name: r.version,
    game_directory: i,
    assets_root: j,
    assets_index_name: D.id,
    auth_uuid: s.type === "offline" ? s.id.replace(/-/g, "") : s.id,
    auth_access_token: s.type === "offline" ? "0" : s.accessToken,
    clientid: "00000000402b5328",
    auth_xuid: "",
    user_type: s.type === "offline" ? "legacy" : "msa",
    version_type: u.type,
    user_properties: "{}"
    // add this
  }, T = [];
  if ((ke = u.arguments) != null && ke.jvm)
    for (const X of u.arguments.jvm)
      typeof X == "string" ? T.push(X) : X.rules && X.rules.every((Ee) => {
        var Ce;
        const we = (Ce = Ee.os) == null ? void 0 : Ce.name;
        return we ? Ee.action === "allow" ? we === m : we !== m : Ee.action === "allow";
      }) && T.push(...Array.isArray(X.value) ? X.value : [X.value]);
  else
    T.push(`-Djava.library.path=${J}`, "-cp", R);
  const M = [];
  if ((Ue = u.arguments) != null && Ue.game)
    for (const X of u.arguments.game)
      typeof X == "string" && M.push(X);
  else u.minecraftArguments && M.push(...u.minecraftArguments.split(" "));
  Ne(e, `Memory: ${r.minMemory ?? o.java.minMemory}m - ${r.maxMemory ?? o.java.maxMemory}m`);
  const re = [
    `-Xms${r.minMemory ?? o.java.minMemory}m`,
    `-Xmx${r.maxMemory ?? o.java.maxMemory}m`
  ], te = r.jvmArgs ?? o.java.jvmArgs ? (r.jvmArgs ?? o.java.jvmArgs).split(" ").filter(Boolean) : [], ye = r.windowWidth ?? o.minecraft.windowWidth, pe = r.windowHeight ?? o.minecraft.windowHeight, Re = o.minecraft.startMaximized ? ["--fullscreen"] : ["--width", String(ye), "--height", String(pe)], _ = [
    ...re,
    ...te,
    `-DlibraryDirectory=${h}`,
    ...qi(C, O),
    ...qi(K, O),
    ...qi(T, O),
    w,
    // For old Forge, forgeGameArgs already contains all game args including --tweakClass
    // For new Forge/NeoForge, use vanilla gameArgs + mod loader args
    ...q.length > 0 && q.includes("--tweakClass") ? qi(q, $) : [...qi(M, $), ...A, ...q],
    ...Re
  ];
  Ne(e, "Launching Minecraft!"), hs(e, "launching");
  const E = Sp(g, _, {
    cwd: i,
    env: { ...process.env }
  });
  br.set(e, E), (et = E.stdout) == null || et.on("data", (X) => {
    X.toString().split(`
`).filter((ve) => ve.trim()).forEach((ve) => Ne(e, ve));
  }), (Oe = E.stderr) == null || Oe.on("data", (X) => {
    X.toString().split(`
`).filter((ve) => ve.trim()).forEach((ve) => Ne(e, ve));
  }), E.on("spawn", () => {
    Ec.set(e, Date.now()), hs(e, "running"), Ne(e, "✓ Minecraft process started"), o.minecraft.hideOnLaunch && _e.getAllWindows().filter((X) => !X.webContents.getURL().includes("console")).forEach((X) => X.hide());
  }), E.on("close", (X) => {
    var ve;
    if (br.delete(e), o.minecraft.recordPlayTime) {
      const Ee = Date.now(), we = Ec.get(e);
      if (we) {
        const Ce = Math.floor((Ee - we) / 1e3);
        Vt.updatePlayTime(e, Ce);
      }
    }
    if (Ec.delete(e), o.minecraft.hideOnLaunch && _e.getAllWindows().filter((Ee) => !Ee.webContents.getURL().includes("console")).forEach((Ee) => Ee.show()), o.minecraft.hideConsoleOnExit && X === 0 && ((ve = _e.getAllWindows().find((Ee) => Ee.webContents.getURL().includes("console"))) == null || ve.hide()), o.minecraft.quitOnClose) {
      Le.quit();
      return;
    }
    if (X !== 0 && o.minecraft.showConsoleOnCrash) {
      const Ee = _e.getAllWindows().find((we) => we.webContents.getURL().includes(`instanceId=${e}`));
      Ee ? Ee.show() : jd("open-console", { instanceId: e });
    }
    jd("instances:updated", {});
  }), E.on("error", (X) => {
    br.delete(e), hs(e, "crashed"), Ne(e, `Failed to start: ${X.message}`);
  });
}
function V1(e) {
  const t = br.get(e);
  t && (t.kill(), br.delete(e));
}
function G1(e) {
  return br.has(e);
}
function W1(e, t) {
  const n = e.readUInt16BE(t);
  return t += 2, { value: e.slice(t, t + n).toString("utf8"), offset: t + n };
}
function _c(e) {
  try {
    e = To.gunzipSync(e);
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
            const d = W1(e, n);
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
function Md(e) {
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
function Bd(e) {
  return e === "forge" ? "1" : e === "fabric" ? "4" : e === "neoforge" ? "6" : e === "quilt" ? "5" : "0";
}
function pr(e, t) {
  return new Promise((n, r) => {
    _t.get(e, { headers: { "x-api-key": t, Accept: "application/json" } }, (i) => {
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
function K1() {
  ie.handle("instances:get", () => Vt.getAll()), ie.handle("instances:create", (e, t) => {
    const n = Vt.create(t);
    return _e.getAllWindows().forEach((r) => r.webContents.send("instances:updated")), n;
  }), ie.handle("instances:delete", (e, t) => {
    Vt.delete(t), _e.getAllWindows().forEach((n) => n.webContents.send("instances:updated"));
  }), ie.handle("instances:copy", (e, t) => {
    const n = Vt.copy(t);
    return _e.getAllWindows().forEach((r) => r.webContents.send("instances:updated")), n;
  }), ie.handle("instances:update", (e, t) => {
    Vt.update(t), _e.getAllWindows().forEach((n) => n.webContents.send("instances:updated"));
  }), ie.handle("instances:launch", (e, t) => z1(t)), ie.handle("instances:kill", (e, t) => V1(t)), ie.handle("instances:isRunning", (e, t) => G1(t)), ie.handle("instance:listFolder", async (e, t, n) => {
    const r = k.join(oe.instances, t, n);
    return x.existsSync(r) ? x.readdirSync(r) : [];
  }), ie.handle("instance:openFolder", async (e, t, n) => {
    const r = k.join(oe.instances, t, n);
    x.existsSync(r) || x.mkdirSync(r, { recursive: !0 }), Ki.openPath(r);
  }), ie.handle("instance:deleteFile", async (e, t, n) => {
    const r = k.join(oe.instances, t, n);
    x.existsSync(r) && x.unlinkSync(r);
  }), ie.handle("instance:downloadMod", async (e, t, n, r) => {
    const i = k.join(oe.instances, t, "minecraft", "mods");
    x.existsSync(i) || x.mkdirSync(i, { recursive: !0 });
    const o = k.join(i, r);
    return await new Promise((s, a) => {
      const c = (u, l = 0) => {
        if (l > 5) return a(new Error("Too many redirects"));
        _t.get(u, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (f) => {
          if ([301, 302, 307, 308].includes(f.statusCode)) return c(f.headers.location, l + 1);
          if (f.statusCode !== 200) return a(new Error(`HTTP ${f.statusCode}`));
          const h = x.createWriteStream(o);
          f.pipe(h), h.on("finish", () => {
            h.close(), s();
          }), h.on("error", a);
        }).on("error", a);
      };
      c(n);
    }), r;
  }), ie.handle("instance:curseforgeSearch", async (e, t, n, r, i, o) => {
    const s = fn.store.services.curseforgeApiKey;
    if (!s) throw new Error("CurseForge API key not configured.");
    const a = new URLSearchParams({
      gameId: "432",
      searchFilter: t,
      gameVersion: n,
      classId: String(i),
      modLoaderType: Bd(r),
      index: String(o),
      pageSize: "20",
      sortField: "2",
      sortOrder: "desc"
    });
    return pr(`https://api.curseforge.com/v1/mods/search?${a}`, s);
  }), ie.handle("instance:curseforgeGetFiles", async (e, t, n, r) => {
    const i = fn.store.services.curseforgeApiKey;
    if (!i) throw new Error("CurseForge API key not configured.");
    const o = new URLSearchParams({
      gameVersion: n,
      modLoaderType: Bd(r),
      pageSize: "20"
    });
    return pr(`https://api.curseforge.com/v1/mods/${t}/files?${o}`, i);
  }), ie.handle("instance:getServers", async (e, t) => {
    const n = k.join(oe.instances, t, "minecraft", "servers.dat");
    if (!x.existsSync(n)) return [];
    try {
      return _c(x.readFileSync(n));
    } catch {
      return [];
    }
  }), ie.handle("instance:addServer", async (e, t, n, r) => {
    const i = k.join(oe.instances, t, "minecraft", "servers.dat"), o = k.join(oe.instances, t, "minecraft");
    x.existsSync(o) || x.mkdirSync(o, { recursive: !0 });
    let s = [];
    if (x.existsSync(i))
      try {
        s = _c(x.readFileSync(i));
      } catch {
      }
    s.push({ name: n, ip: r });
    const a = Md(s);
    console.log("[servers.dat] First 4 bytes:", a[0].toString(16), a[1].toString(16), a[2].toString(16), a[3].toString(16)), x.writeFileSync(i, a);
  }), ie.handle("instance:removeServer", async (e, t, n) => {
    const r = k.join(oe.instances, t, "minecraft", "servers.dat");
    if (x.existsSync(r))
      try {
        const i = _c(x.readFileSync(r));
        i.splice(n, 1), x.writeFileSync(r, Md(i));
      } catch {
      }
  }), ie.handle("instance:downloadFile", async (e, t, n, r, i) => {
    const o = k.join(oe.instances, t, "minecraft", i);
    x.existsSync(o) || x.mkdirSync(o, { recursive: !0 });
    const s = k.join(o, r);
    return await new Promise((a, c) => {
      const u = (l, f = 0) => {
        if (f > 5) return c(new Error("Too many redirects"));
        _t.get(l, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (h) => {
          if ([301, 302, 307, 308].includes(h.statusCode)) return u(h.headers.location, f + 1);
          if (h.statusCode !== 200) return c(new Error(`HTTP ${h.statusCode}`));
          const d = x.createWriteStream(s);
          h.pipe(d), d.on("finish", () => {
            d.close(), a();
          }), d.on("error", c);
        }).on("error", c);
      };
      u(n);
    }), r;
  }), ie.handle("instance:createShortcut", async (e, t) => {
    const n = Vt.getAll().find((i) => i.id === t);
    if (!n) return;
    const { filePath: r } = await Zr.showSaveDialog({
      title: "Create Shortcut",
      defaultPath: k.join(Le.getPath("desktop"), `${n.name}.lnk`),
      filters: [{ name: "Shortcut", extensions: ["lnk"] }]
    });
    r && (Le.isPackaged ? Ki.writeShortcutLink(r, {
      target: process.execPath,
      description: `Launch ${n.name} via Fernlauncher`
    }) : Zr.showMessageBox({
      type: "info",
      message: "Shortcuts can only be created in the packaged app, not in dev mode."
    }));
  }), ie.handle("instance:export", async (e, t) => {
    const n = Vt.getAll().find((s) => s.id === t);
    if (!n) return;
    const { filePath: r } = await Zr.showSaveDialog({
      title: "Export Instance",
      defaultPath: `${n.name}.fernpack`,
      filters: [{ name: "Fernlauncher Pack", extensions: ["fernpack"] }]
    });
    if (!r) return;
    const i = k.join(oe.instances, t), o = new pn();
    o.addLocalFolder(i), o.writeZip(r);
  }), ie.handle("instance:import", async (e, t) => {
    const n = new pn(t), r = n.readAsText("instance.json");
    if (!r) throw new Error("Invalid fernpack file");
    const i = JSON.parse(r), o = Date.now().toString(36) + Math.random().toString(36).slice(2);
    i.id = o, i.name = i.name + " (Imported)";
    const s = k.join(oe.instances, o);
    x.mkdirSync(s, { recursive: !0 }), n.extractAllTo(s, !0), x.writeFileSync(k.join(s, "instance.json"), JSON.stringify(i, null, 2)), _e.getAllWindows().forEach((a) => a.webContents.send("instances:updated"));
  }), ie.handle("dialog:openFile", async (e, t) => Zr.showOpenDialog(t)), ie.handle("instance:setIcon", async (e, t) => {
    const { filePaths: n } = await Zr.showOpenDialog({
      title: "Choose Instance Icon",
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp", "gif"] }],
      properties: ["openFile"]
    });
    if (!(n != null && n[0])) return null;
    const r = k.extname(n[0]), i = k.join(oe.instances, t), o = k.join(i, `icon${r}`);
    x.copyFileSync(n[0], o);
    const s = Vt.getAll().find((a) => a.id === t);
    return s && (s.icon = `icon${r}`, Vt.update(s), _e.getAllWindows().forEach((a) => a.webContents.send("instances:updated"))), o;
  }), ie.handle("instance:getIconPath", (e, t, n) => k.join(oe.instances, t, n)), ie.handle("instance:getIconData", async (e, t, n) => {
    const r = k.join(oe.instances, t, n);
    if (!x.existsSync(r)) return null;
    const i = x.readFileSync(r);
    return `data:image/${k.extname(n).slice(1).replace("jpg", "jpeg")};base64,${i.toString("base64")}`;
  }), ie.handle("instance:getScreenshot", async (e, t, n) => {
    const r = k.join(oe.instances, t, "minecraft", "screenshots", n);
    if (!x.existsSync(r)) return null;
    const i = x.readFileSync(r);
    return `data:image/${k.extname(n).slice(1).replace("jpg", "jpeg")};base64,${i.toString("base64")}`;
  }), ie.handle("instance:openFile", async (e, t, n) => {
    const r = k.join(oe.instances, t, n);
    Ki.openPath(r);
  }), ie.handle("instance:readLog", async (e, t) => {
    const n = k.join(oe.instances, t, "minecraft", "logs", "latest.log");
    return x.existsSync(n) ? x.readFileSync(n, "utf-8") : "";
  }), ie.handle("instance:watchLog", async (e, t) => {
    const n = k.join(oe.instances, t, "minecraft", "logs", "latest.log");
    if (!x.existsSync(n)) return;
    const r = _e.getAllWindows().find(
      (o) => o.webContents.getURL().includes(`instanceId=${t}`) && o.webContents.getURL().includes("instanceEditor")
    );
    if (!r) return;
    const i = x.watch(n, () => {
      if (!x.existsSync(n)) return;
      const o = x.readFileSync(n, "utf-8");
      r.webContents.send("instance:logUpdated", o);
    });
    r.on("closed", () => i.close());
  }), ie.handle("instance:installModrinthModpack", async (e, t, n, r) => {
    var F, q;
    const i = await import("https"), o = _e.fromWebContents(e.sender), s = (K) => o == null ? void 0 : o.webContents.send("modpack:progress", K);
    s("Fetching modpack info...");
    const a = await new Promise((K, H) => {
      i.default.get(
        `https://api.modrinth.com/v2/version/${t}`,
        { headers: { "User-Agent": "Fernlaunch/1.0" } },
        (S) => {
          let j = "";
          S.on("data", (V) => j += V), S.on("end", () => K(JSON.parse(j)));
        }
      ).on("error", H);
    }), c = a.files.find((K) => K.primary) ?? a.files[0];
    s("Downloading modpack...");
    const u = k.join(oe.java, `temp_${Date.now()}.mrpack`);
    await new Promise((K, H) => {
      const S = (j, V = 0) => {
        if (V > 5) return H(new Error("Too many redirects"));
        i.default.get(j, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (Z) => {
          if ([301, 302, 307, 308].includes(Z.statusCode)) return S(Z.headers.location, V + 1);
          if (Z.statusCode !== 200) return H(new Error(`HTTP ${Z.statusCode}`));
          const D = x.createWriteStream(u);
          Z.pipe(D), D.on("finish", () => {
            D.close(), K();
          }), D.on("error", H);
        }).on("error", H);
      };
      S(c.url);
    });
    const l = new pn(u), f = JSON.parse(l.readAsText("modrinth.index.json"));
    s(`Installing ${f.name}...`);
    const h = f.dependencies.minecraft, d = f.dependencies["fabric-loader"], m = f.dependencies["quilt-loader"], p = f.dependencies.forge, v = f.dependencies.neoforge, y = d ? "fabric" : m ? "quilt" : p ? "forge" : v ? "neoforge" : "none", g = d ?? m ?? p ?? v ?? "", w = Vt.create({
      name: n || f.name,
      version: h,
      modLoader: y,
      modLoaderVersion: g,
      group: r,
      icon: "default"
    }), A = k.join(oe.instances, w.id, "minecraft", "mods");
    x.mkdirSync(A, { recursive: !0 });
    for (const K of l.getEntries())
      if (K.entryName.startsWith("overrides/")) {
        const H = k.join(oe.instances, w.id, "minecraft", K.entryName.replace("overrides/", ""));
        K.isDirectory ? x.mkdirSync(H, { recursive: !0 }) : (x.mkdirSync(k.dirname(H), { recursive: !0 }), l.extractEntryTo(K, k.dirname(H), !1, !0));
      }
    const C = [];
    for (const K of f.files ?? []) {
      if (((F = K.env) == null ? void 0 : F.client) === "unsupported") continue;
      const S = k.join(oe.instances, w.id, "minecraft", K.path);
      if (x.mkdirSync(k.dirname(S), { recursive: !0 }), s(`Downloading ${k.basename(K.path)}...`), (q = K.downloads) != null && q.length)
        try {
          await new Promise((j, V) => {
            const Z = (D, L = 0) => {
              if (L > 5) return V(new Error("Too many redirects"));
              i.default.get(D, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (G) => {
                if ([301, 302, 307, 308].includes(G.statusCode)) return Z(G.headers.location, L + 1);
                if (G.statusCode !== 200) return V(new Error(`HTTP ${G.statusCode}`));
                const z = x.createWriteStream(S);
                G.pipe(z), z.on("finish", () => {
                  z.close(), j();
                }), z.on("error", V);
              }).on("error", V);
            };
            Z(K.downloads[0]);
          });
        } catch {
          C.push({ name: k.basename(K.path), url: K.downloads[0] });
        }
      else
        C.push({ name: k.basename(K.path) });
    }
    return x.unlinkSync(u), _e.getAllWindows().forEach((K) => K.webContents.send("instances:updated")), { instance: w, manualFiles: C };
  }), ie.handle("open:external", (e, t) => Ki.openExternal(t)), ie.handle("instance:checkManualFiles", async (e, t, n, r) => {
    const i = [], o = k.join(oe.instances, t, "minecraft", "mods");
    x.mkdirSync(o, { recursive: !0 });
    for (const s of n) {
      const a = k.join(r, s);
      x.existsSync(a) && (x.copyFileSync(a, k.join(o, s)), i.push(s));
    }
    return i;
  }), ie.handle("get:downloadsPath", () => Le.getPath("downloads")), ie.handle("instance:installCurseForgeModpack", async (e, t, n, r, i) => {
    var C, F, q, K, H;
    const o = _e.fromWebContents(e.sender), s = (S) => o == null ? void 0 : o.webContents.send("modpack:progress", S);
    s("Fetching modpack info...");
    const a = fn.store.services.curseforgeApiKey, u = (await pr(`https://api.curseforge.com/v1/mods/${n}/files/${t}`, a)).data;
    s("Downloading modpack...");
    const l = k.join(oe.java, `temp_${Date.now()}.zip`);
    if (!u.downloadUrl) throw new Error("This modpack file has no download URL (blocked by CurseForge).");
    await new Promise((S, j) => {
      const V = (Z, D = 0) => {
        if (D > 5) return j(new Error("Too many redirects"));
        _t.get(Z, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (L) => {
          if ([301, 302, 307, 308].includes(L.statusCode)) return V(L.headers.location, D + 1);
          if (L.statusCode !== 200) return j(new Error(`HTTP ${L.statusCode}`));
          const G = x.createWriteStream(l);
          L.pipe(G), G.on("finish", () => {
            G.close(), S();
          }), G.on("error", j);
        }).on("error", j);
      };
      V(u.downloadUrl);
    });
    const f = new pn(l), h = JSON.parse(f.readAsText("manifest.json")), d = (C = h.minecraft) == null ? void 0 : C.version, m = ((K = (q = (F = h.minecraft) == null ? void 0 : F.modLoaders) == null ? void 0 : q.find((S) => S.primary)) == null ? void 0 : K.id) ?? "", p = m.startsWith("fabric-") ? "fabric" : m.startsWith("quilt-") ? "quilt" : m.startsWith("neoforge-") ? "neoforge" : m.startsWith("forge-") ? "forge" : "none", v = m.split("-").slice(1).join("-"), y = Vt.create({
      name: r || h.name,
      version: d,
      modLoader: p,
      modLoaderVersion: v,
      group: i,
      icon: "default"
    }), g = k.join(oe.instances, y.id, "minecraft", "mods");
    x.mkdirSync(g, { recursive: !0 });
    for (const S of f.getEntries())
      if (S.entryName.startsWith("overrides/")) {
        const j = k.join(oe.instances, y.id, "minecraft", S.entryName.replace("overrides/", ""));
        S.isDirectory ? x.mkdirSync(j, { recursive: !0 }) : (x.mkdirSync(k.dirname(j), { recursive: !0 }), f.extractEntryTo(S, k.dirname(j), !1, !0));
      }
    x.unlinkSync(l);
    const w = [], A = h.files ?? [];
    for (const S of A)
      if (S.required !== !1) {
        s(`Fetching mod ${S.fileID}...`);
        try {
          const V = (await pr(
            `https://api.curseforge.com/v1/mods/${S.projectID}/files/${S.fileID}`,
            a
          )).data, Z = k.join(g, V.fileName);
          if (V.downloadUrl)
            s(`Downloading ${V.fileName}...`), await new Promise((D, L) => {
              const G = (z, Y = 0) => {
                if (Y > 5) return L(new Error("Too many redirects"));
                _t.get(z, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (J) => {
                  if ([301, 302, 307, 308].includes(J.statusCode)) return G(J.headers.location, Y + 1);
                  if (J.statusCode !== 200) return L(new Error(`HTTP ${J.statusCode}`));
                  const B = x.createWriteStream(Z);
                  J.pipe(B), B.on("finish", () => {
                    B.close(), D();
                  }), B.on("error", L);
                }).on("error", L);
              };
              G(V.downloadUrl);
            });
          else
            try {
              const G = `https://www.curseforge.com/minecraft/mc-mods/${((H = (await pr(`https://api.curseforge.com/v1/mods/${S.projectID}`, a)).data) == null ? void 0 : H.slug) ?? String(S.projectID)}/files/${S.fileID}`;
              w.push({ name: V.fileName, url: G });
            } catch {
              w.push({ name: V.fileName });
            }
        } catch (j) {
          console.warn(`Failed to get mod ${S.fileID}:`, j), w.push({ name: `mod-${S.fileID}.jar` });
        }
      }
    return _e.getAllWindows().forEach((S) => S.webContents.send("instances:updated")), { instance: y, manualFiles: w };
  }), ie.handle("instance:cfModpackSearch", async (e, t, n) => {
    const r = fn.store.services.curseforgeApiKey;
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
    return pr(`https://api.curseforge.com/v1/mods/search?${i}`, r);
  }), ie.handle("instance:cfModpackFiles", async (e, t) => {
    const n = fn.store.services.curseforgeApiKey;
    if (!n) throw new Error("CurseForge API key not configured.");
    const r = new URLSearchParams({
      pageSize: "20",
      sortField: "1",
      sortOrder: "desc"
    });
    return pr(`https://api.curseforge.com/v1/mods/${t}/files?${r}`, n);
  });
}
function J1() {
  ie.handle("accounts:get", () => gr.getAll()), ie.handle("accounts:addMicrosoft", async () => {
    const e = await gr.addMicrosoft();
    return _e.getAllWindows().forEach((t) => {
      t.webContents.send("accounts:updated");
    }), e;
  }), ie.handle("accounts:remove", (e, t) => {
    gr.remove(t), _e.getAllWindows().forEach((n) => {
      n.webContents.send("accounts:updated");
    });
  }), ie.handle("accounts:setActive", (e, t) => {
    console.log("[Accounts] Setting active:", t), gr.setActive(t), _e.getAllWindows().forEach((n) => {
      n.webContents.send("accounts:updated");
    });
  }), ie.handle("accounts:refresh", (e, t) => gr.refresh(t)), ie.handle("accounts:addOffline", (e, t) => {
    const n = gr.addOffline(t);
    return _e.getAllWindows().forEach((r) => r.webContents.send("accounts:updated")), n;
  });
}
const Y1 = wp(import.meta.url), Hd = _p(Y1), qd = process.env.VITE_DEV_SERVER_URL;
function X1() {
  ie.handle("java:detect", async () => new Promise((e) => {
    setImmediate(() => {
      e(Hs.detect());
    });
  })), ie.handle("java:installs", () => Hs.getInstalled()), ie.handle("java:download", () => {
    const e = new _e({
      width: 600,
      height: 500,
      title: "Install Java — Fernlauncher",
      center: !0,
      webPreferences: {
        preload: ze(Hd, "../dist-electron/preload.cjs"),
        sandbox: !1
      }
    });
    e.setMenuBarVisibility(!1), qd ? e.loadURL(qd + "?window=javaDownload") : e.loadFile(ze(Hd, "../../dist/index.html"), {
      query: { window: "javaDownload" }
    });
  }), ie.handle("java:browse", async () => {
    const e = await Zr.showOpenDialog({
      title: "Select Java Executable",
      filters: [
        { name: "Java", extensions: process.platform === "win32" ? ["exe"] : ["*"] }
      ],
      properties: ["openFile"]
    });
    return e.canceled ? null : e.filePaths[0];
  }), ie.handle("java:mojangVersions", async () => new Promise((e, t) => {
    _t.get("https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json", (r) => {
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
  })), ie.handle("java:downloadMojang", async (e, t) => {
    var f;
    const n = process.platform === "win32" ? "windows-x64" : process.platform === "darwin" ? "mac-os" : "linux", o = ((await new Promise((h, d) => {
      _t.get("https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json", (m) => {
        let p = "";
        m.on("data", (v) => p += v), m.on("end", () => h(JSON.parse(p)));
      }).on("error", d);
    }))[n] ?? {})[t];
    if (!o || o.length === 0) throw new Error("No download found for " + t);
    const s = o[0].manifest.url, a = await new Promise((h, d) => {
      _t.get(s, (m) => {
        let p = "";
        m.on("data", (v) => p += v), m.on("end", () => h(JSON.parse(p)));
      }).on("error", d);
    }), c = k.join(oe.java, t);
    x.existsSync(c) || x.mkdirSync(c, { recursive: !0 });
    const u = Object.entries(a.files);
    let l = 0;
    for (const [h, d] of u) {
      const m = k.join(c, h);
      if (d.type === "directory") {
        x.existsSync(m) || x.mkdirSync(m, { recursive: !0 }), l++;
        continue;
      }
      if (d.type === "link") {
        try {
          const y = k.dirname(m);
          x.existsSync(y) || x.mkdirSync(y, { recursive: !0 }), x.existsSync(m) && x.unlinkSync(m), x.symlinkSync(d.target, m);
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
      const v = k.dirname(m);
      x.existsSync(v) || x.mkdirSync(v, { recursive: !0 });
      try {
        await new Promise((y, g) => {
          const w = x.createWriteStream(m), A = _t.get(p.url, (C) => {
            if (C.statusCode !== 200) {
              w.close(), x.unlink(m, () => {
              }), g(new Error(`HTTP ${C.statusCode} for ${h}`));
              return;
            }
            C.pipe(w), w.on("finish", () => {
              if (w.close(), d.executable)
                try {
                  x.chmodSync(m, 493);
                } catch {
                }
              y();
            }), w.on("error", (F) => {
              x.unlink(m, () => {
              }), g(F);
            });
          });
          A.on("error", (C) => {
            w.close(), x.unlink(m, () => {
            }), g(C);
          }), A.setTimeout(3e4, () => {
            A.destroy(), g(new Error(`Timeout downloading ${h}`));
          });
        });
      } catch (y) {
        console.error(`Failed to download ${h}:`, y);
      }
      l++, _e.getAllWindows().forEach((y) => {
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
function zi(e) {
  return new Promise((t, n) => {
    _t.get(e, (r) => {
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
function Z1() {
  ie.handle("versions:get", async () => (await zi(
    "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json"
  )).versions.map((t) => ({
    id: t.id,
    type: t.type,
    releaseTime: t.releaseTime
  }))), ie.handle("versions:fabric", async (e, t) => {
    try {
      return (await zi(
        `https://meta.fabricmc.net/v2/versions/loader/${t}`
      )).map((r) => ({
        version: r.loader.version,
        stable: r.loader.stable
      }));
    } catch {
      return [];
    }
  }), ie.handle("versions:quilt", async (e, t) => {
    try {
      return (await zi(
        `https://meta.quiltmc.org/v3/versions/loader/${t}`
      )).map((r) => ({
        version: r.loader.version,
        stable: !0
      }));
    } catch {
      return [];
    }
  }), ie.handle("versions:neoforge", async (e, t) => {
    try {
      const r = (await zi(
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
  }), ie.handle("versions:forge", async (e, t) => {
    try {
      return ((await zi(
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
var ti = {}, Ur = {}, Ot = {};
Ot.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((n, r) => {
        t.push((i, o) => i != null ? r(i) : n(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Ot.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const n = t[t.length - 1];
    if (typeof n != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((r) => n(null, r), n);
  }, "name", { value: e.name });
};
var Un = av, Q1 = process.cwd, Ds = null, eI = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Ds || (Ds = Q1.call(process)), Ds;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var zd = process.chdir;
  process.chdir = function(e) {
    Ds = null, zd.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, zd);
}
var tI = nI;
function nI(e) {
  Un.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = s(e.chownSync), e.fchownSync = s(e.fchownSync), e.lchownSync = s(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = a(e.stat), e.fstat = a(e.fstat), e.lstat = a(e.lstat), e.statSync = c(e.statSync), e.fstatSync = c(e.fstatSync), e.lstatSync = c(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(l, f, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(l, f, h, d) {
    d && process.nextTick(d);
  }, e.lchownSync = function() {
  }), eI === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(l) {
    function f(h, d, m) {
      var p = Date.now(), v = 0;
      l(h, d, function y(g) {
        if (g && (g.code === "EACCES" || g.code === "EPERM" || g.code === "EBUSY") && Date.now() - p < 6e4) {
          setTimeout(function() {
            e.stat(d, function(w, A) {
              w && w.code === "ENOENT" ? l(h, d, y) : m(g);
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
        var w = 0;
        g = function(A, C, F) {
          if (A && A.code === "EAGAIN" && w < 10)
            return w++, l.call(e, h, d, m, p, v, g);
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
        Un.O_WRONLY | Un.O_SYMLINK,
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
      var d = l.openSync(f, Un.O_WRONLY | Un.O_SYMLINK, h), m = !0, p;
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
    Un.hasOwnProperty("O_SYMLINK") && l.futimes ? (l.lutimes = function(f, h, d, m) {
      l.open(f, Un.O_SYMLINK, function(p, v) {
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
      var m = l.openSync(f, Un.O_SYMLINK), p, v = !0;
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
var Vd = Co.Stream, rI = iI;
function iI(e) {
  return {
    ReadStream: t,
    WriteStream: n
  };
  function t(r, i) {
    if (!(this instanceof t)) return new t(r, i);
    Vd.call(this);
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
    Vd.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
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
var oI = aI, sI = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function aI(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: sI(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(n) {
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
  }), t;
}
var qe = x, cI = tI, lI = rI, uI = oI, ps = bl, lt, Vs;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (lt = Symbol.for("graceful-fs.queue"), Vs = Symbol.for("graceful-fs.previous")) : (lt = "___graceful-fs.queue", Vs = "___graceful-fs.previous");
function fI() {
}
function og(e, t) {
  Object.defineProperty(e, lt, {
    get: function() {
      return t;
    }
  });
}
var Pr = fI;
ps.debuglog ? Pr = ps.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Pr = function() {
  var e = ps.format.apply(ps, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!qe[lt]) {
  var dI = Ct[lt] || [];
  og(qe, dI), qe.close = function(e) {
    function t(n, r) {
      return e.call(qe, n, function(i) {
        i || Gd(), typeof r == "function" && r.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Vs, {
      value: e
    }), t;
  }(qe.close), qe.closeSync = function(e) {
    function t(n) {
      e.apply(qe, arguments), Gd();
    }
    return Object.defineProperty(t, Vs, {
      value: e
    }), t;
  }(qe.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Pr(qe[lt]), bp.equal(qe[lt].length, 0);
  });
}
Ct[lt] || og(Ct, qe[lt]);
var Rt = xu(uI(qe));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !qe.__patched && (Rt = xu(qe), qe.__patched = !0);
function xu(e) {
  cI(e), e.gracefulify = xu, e.createReadStream = C, e.createWriteStream = F;
  var t = e.readFile;
  e.readFile = n;
  function n(H, S, j) {
    return typeof S == "function" && (j = S, S = null), V(H, S, j);
    function V(Z, D, L, G) {
      return t(Z, D, function(z) {
        z && (z.code === "EMFILE" || z.code === "ENFILE") ? Wr([V, [Z, D, L], z, G || Date.now(), Date.now()]) : typeof L == "function" && L.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = i;
  function i(H, S, j, V) {
    return typeof j == "function" && (V = j, j = null), Z(H, S, j, V);
    function Z(D, L, G, z, Y) {
      return r(D, L, G, function(J) {
        J && (J.code === "EMFILE" || J.code === "ENFILE") ? Wr([Z, [D, L, G, z], J, Y || Date.now(), Date.now()]) : typeof z == "function" && z.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = s);
  function s(H, S, j, V) {
    return typeof j == "function" && (V = j, j = null), Z(H, S, j, V);
    function Z(D, L, G, z, Y) {
      return o(D, L, G, function(J) {
        J && (J.code === "EMFILE" || J.code === "ENFILE") ? Wr([Z, [D, L, G, z], J, Y || Date.now(), Date.now()]) : typeof z == "function" && z.apply(this, arguments);
      });
    }
  }
  var a = e.copyFile;
  a && (e.copyFile = c);
  function c(H, S, j, V) {
    return typeof j == "function" && (V = j, j = 0), Z(H, S, j, V);
    function Z(D, L, G, z, Y) {
      return a(D, L, G, function(J) {
        J && (J.code === "EMFILE" || J.code === "ENFILE") ? Wr([Z, [D, L, G, z], J, Y || Date.now(), Date.now()]) : typeof z == "function" && z.apply(this, arguments);
      });
    }
  }
  var u = e.readdir;
  e.readdir = f;
  var l = /^v[0-5]\./;
  function f(H, S, j) {
    typeof S == "function" && (j = S, S = null);
    var V = l.test(process.version) ? function(L, G, z, Y) {
      return u(L, Z(
        L,
        G,
        z,
        Y
      ));
    } : function(L, G, z, Y) {
      return u(L, G, Z(
        L,
        G,
        z,
        Y
      ));
    };
    return V(H, S, j);
    function Z(D, L, G, z) {
      return function(Y, J) {
        Y && (Y.code === "EMFILE" || Y.code === "ENFILE") ? Wr([
          V,
          [D, L, G],
          Y,
          z || Date.now(),
          Date.now()
        ]) : (J && J.sort && J.sort(), typeof G == "function" && G.call(this, Y, J));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = lI(e);
    y = h.ReadStream, w = h.WriteStream;
  }
  var d = e.ReadStream;
  d && (y.prototype = Object.create(d.prototype), y.prototype.open = g);
  var m = e.WriteStream;
  m && (w.prototype = Object.create(m.prototype), w.prototype.open = A), Object.defineProperty(e, "ReadStream", {
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
      return w;
    },
    set: function(H) {
      w = H;
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
  var v = w;
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
  function y(H, S) {
    return this instanceof y ? (d.apply(this, arguments), this) : y.apply(Object.create(y.prototype), arguments);
  }
  function g() {
    var H = this;
    K(H.path, H.flags, H.mode, function(S, j) {
      S ? (H.autoClose && H.destroy(), H.emit("error", S)) : (H.fd = j, H.emit("open", j), H.read());
    });
  }
  function w(H, S) {
    return this instanceof w ? (m.apply(this, arguments), this) : w.apply(Object.create(w.prototype), arguments);
  }
  function A() {
    var H = this;
    K(H.path, H.flags, H.mode, function(S, j) {
      S ? (H.destroy(), H.emit("error", S)) : (H.fd = j, H.emit("open", j));
    });
  }
  function C(H, S) {
    return new e.ReadStream(H, S);
  }
  function F(H, S) {
    return new e.WriteStream(H, S);
  }
  var q = e.open;
  e.open = K;
  function K(H, S, j, V) {
    return typeof j == "function" && (V = j, j = null), Z(H, S, j, V);
    function Z(D, L, G, z, Y) {
      return q(D, L, G, function(J, B) {
        J && (J.code === "EMFILE" || J.code === "ENFILE") ? Wr([Z, [D, L, G, z], J, Y || Date.now(), Date.now()]) : typeof z == "function" && z.apply(this, arguments);
      });
    }
  }
  return e;
}
function Wr(e) {
  Pr("ENQUEUE", e[0].name, e[1]), qe[lt].push(e), ku();
}
var ms;
function Gd() {
  for (var e = Date.now(), t = 0; t < qe[lt].length; ++t)
    qe[lt][t].length > 2 && (qe[lt][t][3] = e, qe[lt][t][4] = e);
  ku();
}
function ku() {
  if (clearTimeout(ms), ms = void 0, qe[lt].length !== 0) {
    var e = qe[lt].shift(), t = e[0], n = e[1], r = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Pr("RETRY", t.name, n), t.apply(null, n);
    else if (Date.now() - i >= 6e4) {
      Pr("TIMEOUT", t.name, n);
      var s = n.pop();
      typeof s == "function" && s.call(null, r);
    } else {
      var a = Date.now() - o, c = Math.max(o - i, 1), u = Math.min(c * 1.2, 100);
      a >= u ? (Pr("RETRY", t.name, n), t.apply(null, n.concat([i]))) : qe[lt].push(e);
    }
    ms === void 0 && (ms = setTimeout(ku, 0));
  }
}
(function(e) {
  const t = Ot.fromCallback, n = Rt, r = [
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
})(Ur);
var Uu = {}, sg = {};
const hI = k;
sg.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(hI.parse(t).root, ""))) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw r.code = "EINVAL", r;
  }
};
const ag = Ur, { checkPath: cg } = sg, lg = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
Uu.makeDir = async (e, t) => (cg(e), ag.mkdir(e, {
  mode: lg(t),
  recursive: !0
}));
Uu.makeDirSync = (e, t) => (cg(e), ag.mkdirSync(e, {
  mode: lg(t),
  recursive: !0
}));
const pI = Ot.fromPromise, { makeDir: mI, makeDirSync: wc } = Uu, $c = pI(mI);
var gn = {
  mkdirs: $c,
  mkdirsSync: wc,
  // alias
  mkdirp: $c,
  mkdirpSync: wc,
  ensureDir: $c,
  ensureDirSync: wc
};
const gI = Ot.fromPromise, ug = Ur;
function yI(e) {
  return ug.access(e).then(() => !0).catch(() => !1);
}
var jr = {
  pathExists: gI(yI),
  pathExistsSync: ug.existsSync
};
const hi = Rt;
function vI(e, t, n, r) {
  hi.open(e, "r+", (i, o) => {
    if (i) return r(i);
    hi.futimes(o, t, n, (s) => {
      hi.close(o, (a) => {
        r && r(s || a);
      });
    });
  });
}
function EI(e, t, n) {
  const r = hi.openSync(e, "r+");
  return hi.futimesSync(r, t, n), hi.closeSync(r);
}
var fg = {
  utimesMillis: vI,
  utimesMillisSync: EI
};
const yi = Ur, rt = k, _I = bl;
function wI(e, t, n) {
  const r = n.dereference ? (i) => yi.stat(i, { bigint: !0 }) : (i) => yi.lstat(i, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function $I(e, t, n) {
  let r;
  const i = n.dereference ? (s) => yi.statSync(s, { bigint: !0 }) : (s) => yi.lstatSync(s, { bigint: !0 }), o = i(e);
  try {
    r = i(t);
  } catch (s) {
    if (s.code === "ENOENT") return { srcStat: o, destStat: null };
    throw s;
  }
  return { srcStat: o, destStat: r };
}
function SI(e, t, n, r, i) {
  _I.callbackify(wI)(e, t, r, (o, s) => {
    if (o) return i(o);
    const { srcStat: a, destStat: c } = s;
    if (c) {
      if (Do(a, c)) {
        const u = rt.basename(e), l = rt.basename(t);
        return n === "move" && u !== l && u.toLowerCase() === l.toLowerCase() ? i(null, { srcStat: a, destStat: c, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (a.isDirectory() && !c.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!a.isDirectory() && c.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return a.isDirectory() && ju(e, t) ? i(new Error(Na(e, t, n))) : i(null, { srcStat: a, destStat: c });
  });
}
function bI(e, t, n, r) {
  const { srcStat: i, destStat: o } = $I(e, t, r);
  if (o) {
    if (Do(i, o)) {
      const s = rt.basename(e), a = rt.basename(t);
      if (n === "move" && s !== a && s.toLowerCase() === a.toLowerCase())
        return { srcStat: i, destStat: o, isChangingCase: !0 };
      throw new Error("Source and destination must not be the same.");
    }
    if (i.isDirectory() && !o.isDirectory())
      throw new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`);
    if (!i.isDirectory() && o.isDirectory())
      throw new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`);
  }
  if (i.isDirectory() && ju(e, t))
    throw new Error(Na(e, t, n));
  return { srcStat: i, destStat: o };
}
function dg(e, t, n, r, i) {
  const o = rt.resolve(rt.dirname(e)), s = rt.resolve(rt.dirname(n));
  if (s === o || s === rt.parse(s).root) return i();
  yi.stat(s, { bigint: !0 }, (a, c) => a ? a.code === "ENOENT" ? i() : i(a) : Do(t, c) ? i(new Error(Na(e, n, r))) : dg(e, t, s, r, i));
}
function hg(e, t, n, r) {
  const i = rt.resolve(rt.dirname(e)), o = rt.resolve(rt.dirname(n));
  if (o === i || o === rt.parse(o).root) return;
  let s;
  try {
    s = yi.statSync(o, { bigint: !0 });
  } catch (a) {
    if (a.code === "ENOENT") return;
    throw a;
  }
  if (Do(t, s))
    throw new Error(Na(e, n, r));
  return hg(e, t, o, r);
}
function Do(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function ju(e, t) {
  const n = rt.resolve(e).split(rt.sep).filter((i) => i), r = rt.resolve(t).split(rt.sep).filter((i) => i);
  return n.reduce((i, o, s) => i && r[s] === o, !0);
}
function Na(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var Ii = {
  checkPaths: SI,
  checkPathsSync: bI,
  checkParentPaths: dg,
  checkParentPathsSync: hg,
  isSrcSubdir: ju,
  areIdentical: Do
};
const kt = Rt, uo = k, AI = gn.mkdirs, TI = jr.pathExists, CI = fg.utimesMillis, fo = Ii;
function NI(e, t, n, r) {
  typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r = r || function() {
  }, n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), fo.checkPaths(e, t, "copy", n, (i, o) => {
    if (i) return r(i);
    const { srcStat: s, destStat: a } = o;
    fo.checkParentPaths(e, s, t, "copy", (c) => c ? r(c) : n.filter ? pg(Wd, a, e, t, n, r) : Wd(a, e, t, n, r));
  });
}
function Wd(e, t, n, r, i) {
  const o = uo.dirname(n);
  TI(o, (s, a) => {
    if (s) return i(s);
    if (a) return Gs(e, t, n, r, i);
    AI(o, (c) => c ? i(c) : Gs(e, t, n, r, i));
  });
}
function pg(e, t, n, r, i, o) {
  Promise.resolve(i.filter(n, r)).then((s) => s ? e(t, n, r, i, o) : o(), (s) => o(s));
}
function II(e, t, n, r, i) {
  return r.filter ? pg(Gs, e, t, n, r, i) : Gs(e, t, n, r, i);
}
function Gs(e, t, n, r, i) {
  (r.dereference ? kt.stat : kt.lstat)(t, (s, a) => s ? i(s) : a.isDirectory() ? xI(a, e, t, n, r, i) : a.isFile() || a.isCharacterDevice() || a.isBlockDevice() ? PI(a, e, t, n, r, i) : a.isSymbolicLink() ? jI(e, t, n, r, i) : a.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : a.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function PI(e, t, n, r, i, o) {
  return t ? OI(e, n, r, i, o) : mg(e, n, r, i, o);
}
function OI(e, t, n, r, i) {
  if (r.overwrite)
    kt.unlink(n, (o) => o ? i(o) : mg(e, t, n, r, i));
  else return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i();
}
function mg(e, t, n, r, i) {
  kt.copyFile(t, n, (o) => o ? i(o) : r.preserveTimestamps ? RI(e.mode, t, n, i) : Ia(n, e.mode, i));
}
function RI(e, t, n, r) {
  return DI(e) ? FI(n, e, (i) => i ? r(i) : Kd(e, t, n, r)) : Kd(e, t, n, r);
}
function DI(e) {
  return (e & 128) === 0;
}
function FI(e, t, n) {
  return Ia(e, t | 128, n);
}
function Kd(e, t, n, r) {
  LI(t, n, (i) => i ? r(i) : Ia(n, e, r));
}
function Ia(e, t, n) {
  return kt.chmod(e, t, n);
}
function LI(e, t, n) {
  kt.stat(e, (r, i) => r ? n(r) : CI(t, i.atime, i.mtime, n));
}
function xI(e, t, n, r, i, o) {
  return t ? gg(n, r, i, o) : kI(e.mode, n, r, i, o);
}
function kI(e, t, n, r, i) {
  kt.mkdir(n, (o) => {
    if (o) return i(o);
    gg(t, n, r, (s) => s ? i(s) : Ia(n, e, i));
  });
}
function gg(e, t, n, r) {
  kt.readdir(e, (i, o) => i ? r(i) : yg(o, e, t, n, r));
}
function yg(e, t, n, r, i) {
  const o = e.pop();
  return o ? UI(e, o, t, n, r, i) : i();
}
function UI(e, t, n, r, i, o) {
  const s = uo.join(n, t), a = uo.join(r, t);
  fo.checkPaths(s, a, "copy", i, (c, u) => {
    if (c) return o(c);
    const { destStat: l } = u;
    II(l, s, a, i, (f) => f ? o(f) : yg(e, n, r, i, o));
  });
}
function jI(e, t, n, r, i) {
  kt.readlink(t, (o, s) => {
    if (o) return i(o);
    if (r.dereference && (s = uo.resolve(process.cwd(), s)), e)
      kt.readlink(n, (a, c) => a ? a.code === "EINVAL" || a.code === "UNKNOWN" ? kt.symlink(s, n, i) : i(a) : (r.dereference && (c = uo.resolve(process.cwd(), c)), fo.isSrcSubdir(s, c) ? i(new Error(`Cannot copy '${s}' to a subdirectory of itself, '${c}'.`)) : e.isDirectory() && fo.isSrcSubdir(c, s) ? i(new Error(`Cannot overwrite '${c}' with '${s}'.`)) : MI(s, n, i)));
    else
      return kt.symlink(s, n, i);
  });
}
function MI(e, t, n) {
  kt.unlink(t, (r) => r ? n(r) : kt.symlink(e, t, n));
}
var BI = NI;
const Et = Rt, ho = k, HI = gn.mkdirsSync, qI = fg.utimesMillisSync, po = Ii;
function zI(e, t, n) {
  typeof n == "function" && (n = { filter: n }), n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: r, destStat: i } = po.checkPathsSync(e, t, "copy", n);
  return po.checkParentPathsSync(e, r, t, "copy"), VI(i, e, t, n);
}
function VI(e, t, n, r) {
  if (r.filter && !r.filter(t, n)) return;
  const i = ho.dirname(n);
  return Et.existsSync(i) || HI(i), vg(e, t, n, r);
}
function GI(e, t, n, r) {
  if (!(r.filter && !r.filter(t, n)))
    return vg(e, t, n, r);
}
function vg(e, t, n, r) {
  const o = (r.dereference ? Et.statSync : Et.lstatSync)(t);
  if (o.isDirectory()) return QI(o, e, t, n, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return WI(o, e, t, n, r);
  if (o.isSymbolicLink()) return nP(e, t, n, r);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function WI(e, t, n, r, i) {
  return t ? KI(e, n, r, i) : Eg(e, n, r, i);
}
function KI(e, t, n, r) {
  if (r.overwrite)
    return Et.unlinkSync(n), Eg(e, t, n, r);
  if (r.errorOnExist)
    throw new Error(`'${n}' already exists`);
}
function Eg(e, t, n, r) {
  return Et.copyFileSync(t, n), r.preserveTimestamps && JI(e.mode, t, n), Mu(n, e.mode);
}
function JI(e, t, n) {
  return YI(e) && XI(n, e), ZI(t, n);
}
function YI(e) {
  return (e & 128) === 0;
}
function XI(e, t) {
  return Mu(e, t | 128);
}
function Mu(e, t) {
  return Et.chmodSync(e, t);
}
function ZI(e, t) {
  const n = Et.statSync(e);
  return qI(t, n.atime, n.mtime);
}
function QI(e, t, n, r, i) {
  return t ? _g(n, r, i) : eP(e.mode, n, r, i);
}
function eP(e, t, n, r) {
  return Et.mkdirSync(n), _g(t, n, r), Mu(n, e);
}
function _g(e, t, n) {
  Et.readdirSync(e).forEach((r) => tP(r, e, t, n));
}
function tP(e, t, n, r) {
  const i = ho.join(t, e), o = ho.join(n, e), { destStat: s } = po.checkPathsSync(i, o, "copy", r);
  return GI(s, i, o, r);
}
function nP(e, t, n, r) {
  let i = Et.readlinkSync(t);
  if (r.dereference && (i = ho.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = Et.readlinkSync(n);
    } catch (s) {
      if (s.code === "EINVAL" || s.code === "UNKNOWN") return Et.symlinkSync(i, n);
      throw s;
    }
    if (r.dereference && (o = ho.resolve(process.cwd(), o)), po.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (Et.statSync(n).isDirectory() && po.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return rP(i, n);
  } else
    return Et.symlinkSync(i, n);
}
function rP(e, t) {
  return Et.unlinkSync(t), Et.symlinkSync(e, t);
}
var iP = zI;
const oP = Ot.fromCallback;
var Bu = {
  copy: oP(BI),
  copySync: iP
};
const Jd = Rt, wg = k, Pe = bp, mo = process.platform === "win32";
function $g(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((n) => {
    e[n] = e[n] || Jd[n], n = n + "Sync", e[n] = e[n] || Jd[n];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function Hu(e, t, n) {
  let r = 0;
  typeof t == "function" && (n = t, t = {}), Pe(e, "rimraf: missing path"), Pe.strictEqual(typeof e, "string", "rimraf: path should be a string"), Pe.strictEqual(typeof n, "function", "rimraf: callback function required"), Pe(t, "rimraf: invalid options argument provided"), Pe.strictEqual(typeof t, "object", "rimraf: options should be object"), $g(t), Yd(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && r < t.maxBusyTries) {
        r++;
        const s = r * 100;
        return setTimeout(() => Yd(e, t, i), s);
      }
      o.code === "ENOENT" && (o = null);
    }
    n(o);
  });
}
function Yd(e, t, n) {
  Pe(e), Pe(t), Pe(typeof n == "function"), t.lstat(e, (r, i) => {
    if (r && r.code === "ENOENT")
      return n(null);
    if (r && r.code === "EPERM" && mo)
      return Xd(e, t, r, n);
    if (i && i.isDirectory())
      return Fs(e, t, r, n);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return n(null);
        if (o.code === "EPERM")
          return mo ? Xd(e, t, o, n) : Fs(e, t, o, n);
        if (o.code === "EISDIR")
          return Fs(e, t, o, n);
      }
      return n(o);
    });
  });
}
function Xd(e, t, n, r) {
  Pe(e), Pe(t), Pe(typeof r == "function"), t.chmod(e, 438, (i) => {
    i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (o, s) => {
      o ? r(o.code === "ENOENT" ? null : n) : s.isDirectory() ? Fs(e, t, n, r) : t.unlink(e, r);
    });
  });
}
function Zd(e, t, n) {
  let r;
  Pe(e), Pe(t);
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
  r.isDirectory() ? Ls(e, t, n) : t.unlinkSync(e);
}
function Fs(e, t, n, r) {
  Pe(e), Pe(t), Pe(typeof r == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? sP(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
  });
}
function sP(e, t, n) {
  Pe(e), Pe(t), Pe(typeof n == "function"), t.readdir(e, (r, i) => {
    if (r) return n(r);
    let o = i.length, s;
    if (o === 0) return t.rmdir(e, n);
    i.forEach((a) => {
      Hu(wg.join(e, a), t, (c) => {
        if (!s) {
          if (c) return n(s = c);
          --o === 0 && t.rmdir(e, n);
        }
      });
    });
  });
}
function Sg(e, t) {
  let n;
  t = t || {}, $g(t), Pe(e, "rimraf: missing path"), Pe.strictEqual(typeof e, "string", "rimraf: path should be a string"), Pe(t, "rimraf: missing options"), Pe.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    n = t.lstatSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    r.code === "EPERM" && mo && Zd(e, t, r);
  }
  try {
    n && n.isDirectory() ? Ls(e, t, null) : t.unlinkSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    if (r.code === "EPERM")
      return mo ? Zd(e, t, r) : Ls(e, t, r);
    if (r.code !== "EISDIR")
      throw r;
    Ls(e, t, r);
  }
}
function Ls(e, t, n) {
  Pe(e), Pe(t);
  try {
    t.rmdirSync(e);
  } catch (r) {
    if (r.code === "ENOTDIR")
      throw n;
    if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM")
      aP(e, t);
    else if (r.code !== "ENOENT")
      throw r;
  }
}
function aP(e, t) {
  if (Pe(e), Pe(t), t.readdirSync(e).forEach((n) => Sg(wg.join(e, n), t)), mo) {
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
var cP = Hu;
Hu.sync = Sg;
const Ws = Rt, lP = Ot.fromCallback, bg = cP;
function uP(e, t) {
  if (Ws.rm) return Ws.rm(e, { recursive: !0, force: !0 }, t);
  bg(e, t);
}
function fP(e) {
  if (Ws.rmSync) return Ws.rmSync(e, { recursive: !0, force: !0 });
  bg.sync(e);
}
var Pa = {
  remove: lP(uP),
  removeSync: fP
};
const dP = Ot.fromPromise, Ag = Ur, Tg = k, Cg = gn, Ng = Pa, Qd = dP(async function(t) {
  let n;
  try {
    n = await Ag.readdir(t);
  } catch {
    return Cg.mkdirs(t);
  }
  return Promise.all(n.map((r) => Ng.remove(Tg.join(t, r))));
});
function eh(e) {
  let t;
  try {
    t = Ag.readdirSync(e);
  } catch {
    return Cg.mkdirsSync(e);
  }
  t.forEach((n) => {
    n = Tg.join(e, n), Ng.removeSync(n);
  });
}
var hP = {
  emptyDirSync: eh,
  emptydirSync: eh,
  emptyDir: Qd,
  emptydir: Qd
};
const pP = Ot.fromCallback, Ig = k, Kn = Rt, Pg = gn;
function mP(e, t) {
  function n() {
    Kn.writeFile(e, "", (r) => {
      if (r) return t(r);
      t();
    });
  }
  Kn.stat(e, (r, i) => {
    if (!r && i.isFile()) return t();
    const o = Ig.dirname(e);
    Kn.stat(o, (s, a) => {
      if (s)
        return s.code === "ENOENT" ? Pg.mkdirs(o, (c) => {
          if (c) return t(c);
          n();
        }) : t(s);
      a.isDirectory() ? n() : Kn.readdir(o, (c) => {
        if (c) return t(c);
      });
    });
  });
}
function gP(e) {
  let t;
  try {
    t = Kn.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const n = Ig.dirname(e);
  try {
    Kn.statSync(n).isDirectory() || Kn.readdirSync(n);
  } catch (r) {
    if (r && r.code === "ENOENT") Pg.mkdirsSync(n);
    else throw r;
  }
  Kn.writeFileSync(e, "");
}
var yP = {
  createFile: pP(mP),
  createFileSync: gP
};
const vP = Ot.fromCallback, Og = k, zn = Rt, Rg = gn, EP = jr.pathExists, { areIdentical: Dg } = Ii;
function _P(e, t, n) {
  function r(i, o) {
    zn.link(i, o, (s) => {
      if (s) return n(s);
      n(null);
    });
  }
  zn.lstat(t, (i, o) => {
    zn.lstat(e, (s, a) => {
      if (s)
        return s.message = s.message.replace("lstat", "ensureLink"), n(s);
      if (o && Dg(a, o)) return n(null);
      const c = Og.dirname(t);
      EP(c, (u, l) => {
        if (u) return n(u);
        if (l) return r(e, t);
        Rg.mkdirs(c, (f) => {
          if (f) return n(f);
          r(e, t);
        });
      });
    });
  });
}
function wP(e, t) {
  let n;
  try {
    n = zn.lstatSync(t);
  } catch {
  }
  try {
    const o = zn.lstatSync(e);
    if (n && Dg(o, n)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const r = Og.dirname(t);
  return zn.existsSync(r) || Rg.mkdirsSync(r), zn.linkSync(e, t);
}
var $P = {
  createLink: vP(_P),
  createLinkSync: wP
};
const Jn = k, io = Rt, SP = jr.pathExists;
function bP(e, t, n) {
  if (Jn.isAbsolute(e))
    return io.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), n(r)) : n(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = Jn.dirname(t), i = Jn.join(r, e);
    return SP(i, (o, s) => o ? n(o) : s ? n(null, {
      toCwd: i,
      toDst: e
    }) : io.lstat(e, (a) => a ? (a.message = a.message.replace("lstat", "ensureSymlink"), n(a)) : n(null, {
      toCwd: e,
      toDst: Jn.relative(r, e)
    })));
  }
}
function AP(e, t) {
  let n;
  if (Jn.isAbsolute(e)) {
    if (n = io.existsSync(e), !n) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const r = Jn.dirname(t), i = Jn.join(r, e);
    if (n = io.existsSync(i), n)
      return {
        toCwd: i,
        toDst: e
      };
    if (n = io.existsSync(e), !n) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: Jn.relative(r, e)
    };
  }
}
var TP = {
  symlinkPaths: bP,
  symlinkPathsSync: AP
};
const Fg = Rt;
function CP(e, t, n) {
  if (n = typeof t == "function" ? t : n, t = typeof t == "function" ? !1 : t, t) return n(null, t);
  Fg.lstat(e, (r, i) => {
    if (r) return n(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", n(null, t);
  });
}
function NP(e, t) {
  let n;
  if (t) return t;
  try {
    n = Fg.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var IP = {
  symlinkType: CP,
  symlinkTypeSync: NP
};
const PP = Ot.fromCallback, Lg = k, tn = Ur, xg = gn, OP = xg.mkdirs, RP = xg.mkdirsSync, kg = TP, DP = kg.symlinkPaths, FP = kg.symlinkPathsSync, Ug = IP, LP = Ug.symlinkType, xP = Ug.symlinkTypeSync, kP = jr.pathExists, { areIdentical: jg } = Ii;
function UP(e, t, n, r) {
  r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, tn.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      tn.stat(e),
      tn.stat(t)
    ]).then(([s, a]) => {
      if (jg(s, a)) return r(null);
      th(e, t, n, r);
    }) : th(e, t, n, r);
  });
}
function th(e, t, n, r) {
  DP(e, t, (i, o) => {
    if (i) return r(i);
    e = o.toDst, LP(o.toCwd, n, (s, a) => {
      if (s) return r(s);
      const c = Lg.dirname(t);
      kP(c, (u, l) => {
        if (u) return r(u);
        if (l) return tn.symlink(e, t, a, r);
        OP(c, (f) => {
          if (f) return r(f);
          tn.symlink(e, t, a, r);
        });
      });
    });
  });
}
function jP(e, t, n) {
  let r;
  try {
    r = tn.lstatSync(t);
  } catch {
  }
  if (r && r.isSymbolicLink()) {
    const a = tn.statSync(e), c = tn.statSync(t);
    if (jg(a, c)) return;
  }
  const i = FP(e, t);
  e = i.toDst, n = xP(i.toCwd, n);
  const o = Lg.dirname(t);
  return tn.existsSync(o) || RP(o), tn.symlinkSync(e, t, n);
}
var MP = {
  createSymlink: PP(UP),
  createSymlinkSync: jP
};
const { createFile: nh, createFileSync: rh } = yP, { createLink: ih, createLinkSync: oh } = $P, { createSymlink: sh, createSymlinkSync: ah } = MP;
var BP = {
  // file
  createFile: nh,
  createFileSync: rh,
  ensureFile: nh,
  ensureFileSync: rh,
  // link
  createLink: ih,
  createLinkSync: oh,
  ensureLink: ih,
  ensureLinkSync: oh,
  // symlink
  createSymlink: sh,
  createSymlinkSync: ah,
  ensureSymlink: sh,
  ensureSymlinkSync: ah
};
function HP(e, { EOL: t = `
`, finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
  const o = n ? t : "", s = JSON.stringify(e, r, i);
  if (s === void 0)
    throw new TypeError(`Converting ${typeof e} value to JSON is not supported`);
  return s.replace(/\n/g, t) + o;
}
function qP(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var qu = { stringify: HP, stripBom: qP };
let vi;
try {
  vi = Rt;
} catch {
  vi = x;
}
const Oa = Ot, { stringify: Mg, stripBom: Bg } = qu;
async function zP(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || vi, r = "throws" in t ? t.throws : !0;
  let i = await Oa.fromCallback(n.readFile)(e, t);
  i = Bg(i);
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
const VP = Oa.fromPromise(zP);
function GP(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || vi, r = "throws" in t ? t.throws : !0;
  try {
    let i = n.readFileSync(e, t);
    return i = Bg(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (r)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function WP(e, t, n = {}) {
  const r = n.fs || vi, i = Mg(t, n);
  await Oa.fromCallback(r.writeFile)(e, i, n);
}
const KP = Oa.fromPromise(WP);
function JP(e, t, n = {}) {
  const r = n.fs || vi, i = Mg(t, n);
  return r.writeFileSync(e, i, n);
}
var YP = {
  readFile: VP,
  readFileSync: GP,
  writeFile: KP,
  writeFileSync: JP
};
const gs = YP;
var XP = {
  // jsonfile exports
  readJson: gs.readFile,
  readJsonSync: gs.readFileSync,
  writeJson: gs.writeFile,
  writeJsonSync: gs.writeFileSync
};
const ZP = Ot.fromCallback, oo = Rt, Hg = k, qg = gn, QP = jr.pathExists;
function eO(e, t, n, r) {
  typeof n == "function" && (r = n, n = "utf8");
  const i = Hg.dirname(e);
  QP(i, (o, s) => {
    if (o) return r(o);
    if (s) return oo.writeFile(e, t, n, r);
    qg.mkdirs(i, (a) => {
      if (a) return r(a);
      oo.writeFile(e, t, n, r);
    });
  });
}
function tO(e, ...t) {
  const n = Hg.dirname(e);
  if (oo.existsSync(n))
    return oo.writeFileSync(e, ...t);
  qg.mkdirsSync(n), oo.writeFileSync(e, ...t);
}
var zu = {
  outputFile: ZP(eO),
  outputFileSync: tO
};
const { stringify: nO } = qu, { outputFile: rO } = zu;
async function iO(e, t, n = {}) {
  const r = nO(t, n);
  await rO(e, r, n);
}
var oO = iO;
const { stringify: sO } = qu, { outputFileSync: aO } = zu;
function cO(e, t, n) {
  const r = sO(t, n);
  aO(e, r, n);
}
var lO = cO;
const uO = Ot.fromPromise, It = XP;
It.outputJson = uO(oO);
It.outputJsonSync = lO;
It.outputJSON = It.outputJson;
It.outputJSONSync = It.outputJsonSync;
It.writeJSON = It.writeJson;
It.writeJSONSync = It.writeJsonSync;
It.readJSON = It.readJson;
It.readJSONSync = It.readJsonSync;
var fO = It;
const dO = Rt, cl = k, hO = Bu.copy, zg = Pa.remove, pO = gn.mkdirp, mO = jr.pathExists, ch = Ii;
function gO(e, t, n, r) {
  typeof n == "function" && (r = n, n = {}), n = n || {};
  const i = n.overwrite || n.clobber || !1;
  ch.checkPaths(e, t, "move", n, (o, s) => {
    if (o) return r(o);
    const { srcStat: a, isChangingCase: c = !1 } = s;
    ch.checkParentPaths(e, a, t, "move", (u) => {
      if (u) return r(u);
      if (yO(t)) return lh(e, t, i, c, r);
      pO(cl.dirname(t), (l) => l ? r(l) : lh(e, t, i, c, r));
    });
  });
}
function yO(e) {
  const t = cl.dirname(e);
  return cl.parse(t).root === t;
}
function lh(e, t, n, r, i) {
  if (r) return Sc(e, t, n, i);
  if (n)
    return zg(t, (o) => o ? i(o) : Sc(e, t, n, i));
  mO(t, (o, s) => o ? i(o) : s ? i(new Error("dest already exists.")) : Sc(e, t, n, i));
}
function Sc(e, t, n, r) {
  dO.rename(e, t, (i) => i ? i.code !== "EXDEV" ? r(i) : vO(e, t, n, r) : r());
}
function vO(e, t, n, r) {
  hO(e, t, {
    overwrite: n,
    errorOnExist: !0
  }, (o) => o ? r(o) : zg(e, r));
}
var EO = gO;
const Vg = Rt, ll = k, _O = Bu.copySync, Gg = Pa.removeSync, wO = gn.mkdirpSync, uh = Ii;
function $O(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = uh.checkPathsSync(e, t, "move", n);
  return uh.checkParentPathsSync(e, i, t, "move"), SO(t) || wO(ll.dirname(t)), bO(e, t, r, o);
}
function SO(e) {
  const t = ll.dirname(e);
  return ll.parse(t).root === t;
}
function bO(e, t, n, r) {
  if (r) return bc(e, t, n);
  if (n)
    return Gg(t), bc(e, t, n);
  if (Vg.existsSync(t)) throw new Error("dest already exists.");
  return bc(e, t, n);
}
function bc(e, t, n) {
  try {
    Vg.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return AO(e, t, n);
  }
}
function AO(e, t, n) {
  return _O(e, t, {
    overwrite: n,
    errorOnExist: !0
  }), Gg(e);
}
var TO = $O;
const CO = Ot.fromCallback;
var NO = {
  move: CO(EO),
  moveSync: TO
}, ir = {
  // Export promiseified graceful-fs:
  ...Ur,
  // Export extra methods:
  ...Bu,
  ...hP,
  ...BP,
  ...fO,
  ...gn,
  ...NO,
  ...zu,
  ...jr,
  ...Pa
}, Mr = {}, Zn = {}, Qe = {}, Qn = {};
Object.defineProperty(Qn, "__esModule", { value: !0 });
Qn.CancellationError = Qn.CancellationToken = void 0;
const IO = Ap;
class PO extends IO.EventEmitter {
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
      return Promise.reject(new ul());
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
          o(new ul());
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
Qn.CancellationToken = PO;
class ul extends Error {
  constructor() {
    super("cancelled");
  }
}
Qn.CancellationError = ul;
var Pi = {};
Object.defineProperty(Pi, "__esModule", { value: !0 });
Pi.newError = OO;
function OO(e, t) {
  const n = new Error(e);
  return n.code = t, n;
}
var Nt = {}, fl = { exports: {} }, ys = { exports: {} }, Ac, fh;
function RO() {
  if (fh) return Ac;
  fh = 1;
  var e = 1e3, t = e * 60, n = t * 60, r = n * 24, i = r * 7, o = r * 365.25;
  Ac = function(l, f) {
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
  return Ac;
}
var Tc, dh;
function Wg() {
  if (dh) return Tc;
  dh = 1;
  function e(t) {
    r.debug = r, r.default = r, r.coerce = u, r.disable = a, r.enable = o, r.enabled = c, r.humanize = RO(), r.destroy = l, Object.keys(t).forEach((f) => {
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
        const g = v, w = Number(/* @__PURE__ */ new Date()), A = w - (h || w);
        g.diff = A, g.prev = h, g.curr = w, h = w, y[0] = r.coerce(y[0]), typeof y[0] != "string" && y.unshift("%O");
        let C = 0;
        y[0] = y[0].replace(/%([a-zA-Z%])/g, (q, K) => {
          if (q === "%%")
            return "%";
          C++;
          const H = r.formatters[K];
          if (typeof H == "function") {
            const S = y[C];
            q = H.call(g, S), y.splice(C, 1), C--;
          }
          return q;
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
  return Tc = e, Tc;
}
var hh;
function DO() {
  return hh || (hh = 1, function(e, t) {
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
    e.exports = Wg()(t);
    const { formatters: a } = e.exports;
    a.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (u) {
        return "[UnexpectedJSONParseError]: " + u.message;
      }
    };
  }(ys, ys.exports)), ys.exports;
}
var vs = { exports: {} }, Cc, ph;
function FO() {
  return ph || (ph = 1, Cc = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
    return r !== -1 && (i === -1 || r < i);
  }), Cc;
}
var Nc, mh;
function LO() {
  if (mh) return Nc;
  mh = 1;
  const e = ia, t = Tp, n = FO(), { env: r } = process;
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
  return Nc = {
    supportsColor: a,
    stdout: o(s(!0, t.isatty(1))),
    stderr: o(s(!0, t.isatty(2)))
  }, Nc;
}
var gh;
function xO() {
  return gh || (gh = 1, function(e, t) {
    const n = Tp, r = bl;
    t.init = l, t.log = a, t.formatArgs = o, t.save = c, t.load = u, t.useColors = i, t.destroy = r.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = LO();
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
    e.exports = Wg()(t);
    const { formatters: f } = e.exports;
    f.o = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts).split(`
`).map((d) => d.trim()).join(" ");
    }, f.O = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts);
    };
  }(vs, vs.exports)), vs.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? fl.exports = DO() : fl.exports = xO();
var kO = fl.exports, Fo = {};
Object.defineProperty(Fo, "__esModule", { value: !0 });
Fo.ProgressCallbackTransform = void 0;
const UO = Co;
class jO extends UO.Transform {
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
Fo.ProgressCallbackTransform = jO;
Object.defineProperty(Nt, "__esModule", { value: !0 });
Nt.DigestTransform = Nt.HttpExecutor = Nt.HttpError = void 0;
Nt.createHttpError = hl;
Nt.parseJson = WO;
Nt.configureRequestOptionsFromUrl = Jg;
Nt.configureRequestUrl = Gu;
Nt.safeGetHeader = pi;
Nt.configureRequestOptions = Ks;
Nt.safeStringifyJson = Js;
const MO = wi, BO = kO, HO = x, qO = Co, dl = rr, zO = Qn, yh = Pi, VO = Fo, mr = (0, BO.default)("electron-builder");
function hl(e, t = null) {
  return new Vu(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + Js(e.headers), t);
}
const GO = /* @__PURE__ */ new Map([
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
class Vu extends Error {
  constructor(t, n = `HTTP error: ${GO.get(t) || t}`, r = null) {
    super(n), this.statusCode = t, this.description = r, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
Nt.HttpError = Vu;
function WO(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class si {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, n = new zO.CancellationToken(), r) {
    Ks(t);
    const i = r == null ? void 0 : JSON.stringify(r), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      mr(i);
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
    return mr.enabled && mr(`Request: ${Js(t)}`), n.createPromise((o, s, a) => {
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
    if (mr.enabled && mr(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${Js(n)}`), t.statusCode === 404) {
      o(hl(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const u = (c = t.statusCode) !== null && c !== void 0 ? c : 0, l = u >= 300 && u < 400, f = pi(t, "location");
    if (l && f != null) {
      if (s > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(si.prepareRedirectUrlOptions(f, n), r, a, s).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", o), t.on("data", (d) => h += d), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const d = pi(t, "content-type"), m = d != null && (Array.isArray(d) ? d.find((p) => p.includes("json")) != null : d.includes("json"));
          o(hl(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

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
      Gu(t, a), Ks(a), this.doDownload(a, {
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
      const s = pi(o, "location");
      if (s != null) {
        r < this.maxRedirects ? this.doDownload(si.prepareRedirectUrlOptions(s, t), n, r++) : n.callback(this.createMaxRedirectError());
        return;
      }
      n.responseHandler == null ? JO(n, o) : n.responseHandler(o, n.callback);
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
    const r = Jg(t, { ...n }), i = r.headers;
    if (i != null && i.authorization) {
      const o = si.reconstructOriginalUrl(n), s = Kg(t, n);
      si.isCrossOriginRedirect(o, s) && (mr.enabled && mr(`Given the cross-origin redirect (from ${o.host} to ${s.host}), the Authorization header will be stripped out.`), delete i.authorization);
    }
    return r;
  }
  static reconstructOriginalUrl(t) {
    const n = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const r = t.hostname, i = t.port ? `:${t.port}` : "", o = t.path || "/";
    return new dl.URL(`${n}//${r}${i}${o}`);
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
        if (r < n && (i instanceof Vu && i.isServerError() || i.code === "EPIPE"))
          continue;
        throw i;
      }
  }
}
Nt.HttpExecutor = si;
function Kg(e, t) {
  try {
    return new dl.URL(e);
  } catch {
    const n = t.hostname, r = t.protocol || "https:", i = t.port ? `:${t.port}` : "", o = `${r}//${n}${i}`;
    return new dl.URL(e, o);
  }
}
function Jg(e, t) {
  const n = Ks(t), r = Kg(e, t);
  return Gu(r, n), n;
}
function Gu(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class pl extends qO.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, n = "sha512", r = "base64") {
    super(), this.expected = t, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, MO.createHash)(n);
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
      throw (0, yh.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, yh.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
Nt.DigestTransform = pl;
function KO(e, t, n) {
  return e != null && t != null && e !== t ? (n(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function pi(e, t) {
  const n = e.headers[t];
  return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
}
function JO(e, t) {
  if (!KO(pi(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const n = [];
  if (e.options.onProgress != null) {
    const s = pi(t, "content-length");
    s != null && n.push(new VO.ProgressCallbackTransform(parseInt(s, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const r = e.options.sha512;
  r != null ? n.push(new pl(r, "sha512", r.length === 128 && !r.includes("+") && !r.includes("Z") && !r.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && n.push(new pl(e.options.sha2, "sha256", "hex"));
  const i = (0, HO.createWriteStream)(e.destination);
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
function Ks(e, t, n) {
  n != null && (e.method = n), e.headers = { ...e.headers };
  const r = e.headers;
  return t != null && (r.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), r["User-Agent"] == null && (r["User-Agent"] = "electron-builder"), (n == null || n === "GET" || r["Cache-Control"] == null) && (r["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function Js(e, t) {
  return JSON.stringify(e, (n, r) => n.endsWith("Authorization") || n.endsWith("authorization") || n.endsWith("Password") || n.endsWith("PASSWORD") || n.endsWith("Token") || n.includes("password") || n.includes("token") || t != null && t.has(n) ? "<stripped sensitive data>" : r, 2);
}
var Ra = {};
Object.defineProperty(Ra, "__esModule", { value: !0 });
Ra.MemoLazy = void 0;
class YO {
  constructor(t, n) {
    this.selector = t, this.creator = n, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && Yg(this.selected, t))
      return this._value;
    this.selected = t;
    const n = this.creator(t);
    return this.value = n, n;
  }
  set value(t) {
    this._value = t;
  }
}
Ra.MemoLazy = YO;
function Yg(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((s) => Yg(e[s], t[s]));
  }
  return e === t;
}
var Lo = {};
Object.defineProperty(Lo, "__esModule", { value: !0 });
Lo.githubUrl = XO;
Lo.githubTagPrefix = ZO;
Lo.getS3LikeProviderBaseUrl = QO;
function XO(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function ZO(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function QO(e) {
  const t = e.provider;
  if (t === "s3")
    return eR(e);
  if (t === "spaces")
    return tR(e);
  throw new Error(`Not supported provider: ${t}`);
}
function eR(e) {
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
  return Xg(t, e.path);
}
function Xg(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function tR(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Xg(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Wu = {};
Object.defineProperty(Wu, "__esModule", { value: !0 });
Wu.retry = Zg;
const nR = Qn;
async function Zg(e, t) {
  var n;
  const { retries: r, interval: i, backoff: o = 0, attempt: s = 0, shouldRetry: a, cancellationToken: c = new nR.CancellationToken() } = t;
  try {
    return await e();
  } catch (u) {
    if (await Promise.resolve((n = a == null ? void 0 : a(u)) !== null && n !== void 0 ? n : !0) && r > 0 && !c.cancelled)
      return await new Promise((l) => setTimeout(l, i + o * s)), await Zg(e, { ...t, retries: r - 1, attempt: s + 1 });
    throw u;
  }
}
var Ku = {};
Object.defineProperty(Ku, "__esModule", { value: !0 });
Ku.parseDn = rR;
function rR(e) {
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
var Ei = {};
Object.defineProperty(Ei, "__esModule", { value: !0 });
Ei.nil = Ei.UUID = void 0;
const Qg = wi, ey = Pi, iR = "options.name must be either a string or a Buffer", vh = (0, Qg.randomBytes)(16);
vh[0] = vh[0] | 1;
const xs = {}, $e = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  xs[t] = e, $e[e] = t;
}
class Lr {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const n = Lr.check(t);
    if (!n)
      throw new Error("not a UUID");
    this.version = n.version, n.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, n) {
    return oR(t, "sha1", 80, n);
  }
  toString() {
    return this.ascii == null && (this.ascii = sR(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, n = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (xs[t[14] + t[15]] & 240) >> 4,
        variant: Eh((xs[t[19] + t[20]] & 224) >> 5),
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
        variant: Eh((t[n + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, ey.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const n = Buffer.allocUnsafe(16);
    let r = 0;
    for (let i = 0; i < 16; i++)
      n[i] = xs[t[r++] + t[r++]], (i === 3 || i === 5 || i === 7 || i === 9) && (r += 1);
    return n;
  }
}
Ei.UUID = Lr;
Lr.OID = Lr.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function Eh(e) {
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
var so;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(so || (so = {}));
function oR(e, t, n, r, i = so.ASCII) {
  const o = (0, Qg.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, ey.newError)(iR, "ERR_INVALID_UUID_NAME");
  o.update(r), o.update(e);
  const a = o.digest();
  let c;
  switch (i) {
    case so.BINARY:
      a[6] = a[6] & 15 | n, a[8] = a[8] & 63 | 128, c = a;
      break;
    case so.OBJECT:
      a[6] = a[6] & 15 | n, a[8] = a[8] & 63 | 128, c = new Lr(a);
      break;
    default:
      c = $e[a[0]] + $e[a[1]] + $e[a[2]] + $e[a[3]] + "-" + $e[a[4]] + $e[a[5]] + "-" + $e[a[6] & 15 | n] + $e[a[7]] + "-" + $e[a[8] & 63 | 128] + $e[a[9]] + "-" + $e[a[10]] + $e[a[11]] + $e[a[12]] + $e[a[13]] + $e[a[14]] + $e[a[15]];
      break;
  }
  return c;
}
function sR(e) {
  return $e[e[0]] + $e[e[1]] + $e[e[2]] + $e[e[3]] + "-" + $e[e[4]] + $e[e[5]] + "-" + $e[e[6]] + $e[e[7]] + "-" + $e[e[8]] + $e[e[9]] + "-" + $e[e[10]] + $e[e[11]] + $e[e[12]] + $e[e[13]] + $e[e[14]] + $e[e[15]];
}
Ei.nil = new Lr("00000000-0000-0000-0000-000000000000");
var xo = {}, ty = {};
(function(e) {
  (function(t) {
    t.parser = function(_, E) {
      return new r(_, E);
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
    function r(_, E) {
      if (!(this instanceof r))
        return new r(_, E);
      var U = this;
      o(U), U.q = U.c = "", U.bufferCheckPosition = t.MAX_BUFFER_LENGTH, U.encoding = null, U.opt = E || {}, U.opt.lowercase = U.opt.lowercase || U.opt.lowercasetags, U.looseCase = U.opt.lowercase ? "toLowerCase" : "toUpperCase", U.opt.maxEntityCount = U.opt.maxEntityCount || 512, U.opt.maxEntityDepth = U.opt.maxEntityDepth || 4, U.entityCount = U.entityDepth = 0, U.tags = [], U.closed = U.closedRoot = U.sawRoot = !1, U.tag = U.error = null, U.strict = !!_, U.noscript = !!(_ || U.opt.noscript), U.state = S.BEGIN, U.strictEntities = U.opt.strictEntities, U.ENTITIES = U.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), U.attribList = [], U.opt.xmlns && (U.ns = Object.create(v)), U.opt.unquotedAttributeValues === void 0 && (U.opt.unquotedAttributeValues = !_), U.trackPosition = U.opt.position !== !1, U.trackPosition && (U.position = U.line = U.column = 0), V(U, "onready");
    }
    Object.create || (Object.create = function(_) {
      function E() {
      }
      E.prototype = _;
      var U = new E();
      return U;
    }), Object.keys || (Object.keys = function(_) {
      var E = [];
      for (var U in _) _.hasOwnProperty(U) && E.push(U);
      return E;
    });
    function i(_) {
      for (var E = Math.max(t.MAX_BUFFER_LENGTH, 10), U = 0, I = 0, me = n.length; I < me; I++) {
        var be = _[n[I]].length;
        if (be > E)
          switch (n[I]) {
            case "textNode":
              Y(_);
              break;
            case "cdata":
              z(_, "oncdata", _.cdata), _.cdata = "";
              break;
            case "script":
              z(_, "onscript", _.script), _.script = "";
              break;
            default:
              B(_, "Max buffer length exceeded: " + n[I]);
          }
        U = Math.max(U, be);
      }
      var Te = t.MAX_BUFFER_LENGTH - U;
      _.bufferCheckPosition = Te + _.position;
    }
    function o(_) {
      for (var E = 0, U = n.length; E < U; E++)
        _[n[E]] = "";
    }
    function s(_) {
      Y(_), _.cdata !== "" && (z(_, "oncdata", _.cdata), _.cdata = ""), _.script !== "" && (z(_, "onscript", _.script), _.script = "");
    }
    r.prototype = {
      end: function() {
        N(this);
      },
      write: Re,
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
    function u(_, E) {
      return new f(_, E);
    }
    function l(_, E) {
      if (_.length >= 2) {
        if (_[0] === 255 && _[1] === 254)
          return "utf-16le";
        if (_[0] === 254 && _[1] === 255)
          return "utf-16be";
      }
      return _.length >= 3 && _[0] === 239 && _[1] === 187 && _[2] === 191 ? "utf8" : _.length >= 4 ? _[0] === 60 && _[1] === 0 && _[2] === 63 && _[3] === 0 ? "utf-16le" : _[0] === 0 && _[1] === 60 && _[2] === 0 && _[3] === 63 ? "utf-16be" : "utf8" : E ? "utf8" : null;
    }
    function f(_, E) {
      if (!(this instanceof f))
        return new f(_, E);
      a.apply(this), this._parser = new r(_, E), this.writable = !0, this.readable = !0;
      var U = this;
      this._parser.onend = function() {
        U.emit("end");
      }, this._parser.onerror = function(I) {
        U.emit("error", I), U._parser.error = null;
      }, this._decoder = null, this._decoderBuffer = null, c.forEach(function(I) {
        Object.defineProperty(U, "on" + I, {
          get: function() {
            return U._parser["on" + I];
          },
          set: function(me) {
            if (!me)
              return U.removeAllListeners(I), U._parser["on" + I] = me, me;
            U.on(I, me);
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
    }), f.prototype._decodeBuffer = function(_, E) {
      if (this._decoderBuffer && (_ = Buffer.concat([this._decoderBuffer, _]), this._decoderBuffer = null), !this._decoder) {
        var U = l(_, E);
        if (!U)
          return this._decoderBuffer = _, "";
        this._parser.encoding = U, this._decoder = new TextDecoder(U);
      }
      return this._decoder.decode(_, { stream: !E });
    }, f.prototype.write = function(_) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(_))
        _ = this._decodeBuffer(_, !1);
      else if (this._decoderBuffer) {
        var E = this._decodeBuffer(Buffer.alloc(0), !0);
        E && (this._parser.write(E), this.emit("data", E));
      }
      return this._parser.write(_.toString()), this.emit("data", _), !0;
    }, f.prototype.end = function(_) {
      if (_ && _.length && this.write(_), this._decoderBuffer) {
        var E = this._decodeBuffer(Buffer.alloc(0), !0);
        E && (this._parser.write(E), this.emit("data", E));
      } else if (this._decoder) {
        var U = this._decoder.decode();
        U && (this._parser.write(U), this.emit("data", U));
      }
      return this._parser.end(), !0;
    }, f.prototype.on = function(_, E) {
      var U = this;
      return !U._parser["on" + _] && c.indexOf(_) !== -1 && (U._parser["on" + _] = function() {
        var I = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        I.splice(0, 0, _), U.emit.apply(U, I);
      }), a.prototype.on.call(U, _, E);
    };
    var h = "[CDATA[", d = "DOCTYPE", m = "http://www.w3.org/XML/1998/namespace", p = "http://www.w3.org/2000/xmlns/", v = { xml: m, xmlns: p }, y = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, g = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, w = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, A = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function C(_) {
      return _ === " " || _ === `
` || _ === "\r" || _ === "	";
    }
    function F(_) {
      return _ === '"' || _ === "'";
    }
    function q(_) {
      return _ === ">" || C(_);
    }
    function K(_, E) {
      return _.test(E);
    }
    function H(_, E) {
      return !K(_, E);
    }
    var S = 0;
    t.STATE = {
      BEGIN: S++,
      // leading byte order mark or whitespace
      BEGIN_WHITESPACE: S++,
      // leading whitespace
      TEXT: S++,
      // general stuff
      TEXT_ENTITY: S++,
      // &amp and such.
      OPEN_WAKA: S++,
      // <
      SGML_DECL: S++,
      // <!BLARG
      SGML_DECL_QUOTED: S++,
      // <!BLARG foo "bar
      DOCTYPE: S++,
      // <!DOCTYPE
      DOCTYPE_QUOTED: S++,
      // <!DOCTYPE "//blah
      DOCTYPE_DTD: S++,
      // <!DOCTYPE "//blah" [ ...
      DOCTYPE_DTD_QUOTED: S++,
      // <!DOCTYPE "//blah" [ "foo
      COMMENT_STARTING: S++,
      // <!-
      COMMENT: S++,
      // <!--
      COMMENT_ENDING: S++,
      // <!-- blah -
      COMMENT_ENDED: S++,
      // <!-- blah --
      CDATA: S++,
      // <![CDATA[ something
      CDATA_ENDING: S++,
      // ]
      CDATA_ENDING_2: S++,
      // ]]
      PROC_INST: S++,
      // <?hi
      PROC_INST_BODY: S++,
      // <?hi there
      PROC_INST_ENDING: S++,
      // <?hi "there" ?
      OPEN_TAG: S++,
      // <strong
      OPEN_TAG_SLASH: S++,
      // <strong /
      ATTRIB: S++,
      // <a
      ATTRIB_NAME: S++,
      // <a foo
      ATTRIB_NAME_SAW_WHITE: S++,
      // <a foo _
      ATTRIB_VALUE: S++,
      // <a foo=
      ATTRIB_VALUE_QUOTED: S++,
      // <a foo="bar
      ATTRIB_VALUE_CLOSED: S++,
      // <a foo="bar"
      ATTRIB_VALUE_UNQUOTED: S++,
      // <a foo=bar
      ATTRIB_VALUE_ENTITY_Q: S++,
      // <foo bar="&quot;"
      ATTRIB_VALUE_ENTITY_U: S++,
      // <foo bar=&quot
      CLOSE_TAG: S++,
      // </a
      CLOSE_TAG_SAW_WHITE: S++,
      // </a   >
      SCRIPT: S++,
      // <script> ...
      SCRIPT_ENDING: S++
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
      var E = t.ENTITIES[_], U = typeof E == "number" ? String.fromCharCode(E) : E;
      t.ENTITIES[_] = U;
    });
    for (var j in t.STATE)
      t.STATE[t.STATE[j]] = j;
    S = t.STATE;
    function V(_, E, U) {
      _[E] && _[E](U);
    }
    function Z(_) {
      var E = _ && _.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
      return E ? E[2] : null;
    }
    function D(_) {
      return _ ? _.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
    }
    function L(_, E) {
      const U = D(_), I = D(E);
      return !U || !I ? !0 : I === "utf16" ? U === "utf16le" || U === "utf16be" : U === I;
    }
    function G(_, E) {
      if (!(!_.strict || !_.encoding || !E || E.name !== "xml")) {
        var U = Z(E.body);
        U && !L(_.encoding, U) && R(
          _,
          "XML declaration encoding " + U + " does not match detected stream encoding " + _.encoding.toUpperCase()
        );
      }
    }
    function z(_, E, U) {
      _.textNode && Y(_), V(_, E, U);
    }
    function Y(_) {
      _.textNode = J(_.opt, _.textNode), _.textNode && V(_, "ontext", _.textNode), _.textNode = "";
    }
    function J(_, E) {
      return _.trim && (E = E.trim()), _.normalize && (E = E.replace(/\s+/g, " ")), E;
    }
    function B(_, E) {
      return Y(_), _.trackPosition && (E += `
Line: ` + _.line + `
Column: ` + _.column + `
Char: ` + _.c), E = new Error(E), _.error = E, V(_, "onerror", E), _;
    }
    function N(_) {
      return _.sawRoot && !_.closedRoot && R(_, "Unclosed root tag"), _.state !== S.BEGIN && _.state !== S.BEGIN_WHITESPACE && _.state !== S.TEXT && B(_, "Unexpected end"), Y(_), _.c = "", _.closed = !0, V(_, "onend"), r.call(_, _.strict, _.opt), _;
    }
    function R(_, E) {
      if (typeof _ != "object" || !(_ instanceof r))
        throw new Error("bad call to strictFail");
      _.strict && B(_, E);
    }
    function O(_) {
      _.strict || (_.tagName = _.tagName[_.looseCase]());
      var E = _.tags[_.tags.length - 1] || _, U = _.tag = { name: _.tagName, attributes: {} };
      _.opt.xmlns && (U.ns = E.ns), _.attribList.length = 0, z(_, "onopentagstart", U);
    }
    function $(_, E) {
      var U = _.indexOf(":"), I = U < 0 ? ["", _] : _.split(":"), me = I[0], be = I[1];
      return E && _ === "xmlns" && (me = "xmlns", be = ""), { prefix: me, local: be };
    }
    function T(_) {
      if (_.strict || (_.attribName = _.attribName[_.looseCase]()), _.attribList.indexOf(_.attribName) !== -1 || _.tag.attributes.hasOwnProperty(_.attribName)) {
        _.attribName = _.attribValue = "";
        return;
      }
      if (_.opt.xmlns) {
        var E = $(_.attribName, !0), U = E.prefix, I = E.local;
        if (U === "xmlns")
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
            var me = _.tag, be = _.tags[_.tags.length - 1] || _;
            me.ns === be.ns && (me.ns = Object.create(be.ns)), me.ns[I] = _.attribValue;
          }
        _.attribList.push([_.attribName, _.attribValue]);
      } else
        _.tag.attributes[_.attribName] = _.attribValue, z(_, "onattribute", {
          name: _.attribName,
          value: _.attribValue
        });
      _.attribName = _.attribValue = "";
    }
    function M(_, E) {
      if (_.opt.xmlns) {
        var U = _.tag, I = $(_.tagName);
        U.prefix = I.prefix, U.local = I.local, U.uri = U.ns[I.prefix] || "", U.prefix && !U.uri && (R(
          _,
          "Unbound namespace prefix: " + JSON.stringify(_.tagName)
        ), U.uri = I.prefix);
        var me = _.tags[_.tags.length - 1] || _;
        U.ns && me.ns !== U.ns && Object.keys(U.ns).forEach(function(Ce) {
          z(_, "onopennamespace", {
            prefix: Ce,
            uri: U.ns[Ce]
          });
        });
        for (var be = 0, Te = _.attribList.length; be < Te; be++) {
          var ke = _.attribList[be], Ue = ke[0], et = ke[1], Oe = $(Ue, !0), X = Oe.prefix, ve = Oe.local, Ee = X === "" ? "" : U.ns[X] || "", we = {
            name: Ue,
            value: et,
            prefix: X,
            local: ve,
            uri: Ee
          };
          X && X !== "xmlns" && !Ee && (R(
            _,
            "Unbound namespace prefix: " + JSON.stringify(X)
          ), we.uri = X), _.tag.attributes[Ue] = we, z(_, "onattribute", we);
        }
        _.attribList.length = 0;
      }
      _.tag.isSelfClosing = !!E, _.sawRoot = !0, _.tags.push(_.tag), z(_, "onopentag", _.tag), E || (!_.noscript && _.tagName.toLowerCase() === "script" ? _.state = S.SCRIPT : _.state = S.TEXT, _.tag = null, _.tagName = ""), _.attribName = _.attribValue = "", _.attribList.length = 0;
    }
    function re(_) {
      if (!_.tagName) {
        R(_, "Weird empty close tag."), _.textNode += "</>", _.state = S.TEXT;
        return;
      }
      if (_.script) {
        if (_.tagName !== "script") {
          _.script += "</" + _.tagName + ">", _.tagName = "", _.state = S.SCRIPT;
          return;
        }
        z(_, "onscript", _.script), _.script = "";
      }
      var E = _.tags.length, U = _.tagName;
      _.strict || (U = U[_.looseCase]());
      for (var I = U; E--; ) {
        var me = _.tags[E];
        if (me.name !== I)
          R(_, "Unexpected close tag");
        else
          break;
      }
      if (E < 0) {
        R(_, "Unmatched closing tag: " + _.tagName), _.textNode += "</" + _.tagName + ">", _.state = S.TEXT;
        return;
      }
      _.tagName = U;
      for (var be = _.tags.length; be-- > E; ) {
        var Te = _.tag = _.tags.pop();
        _.tagName = _.tag.name, z(_, "onclosetag", _.tagName);
        var ke = {};
        for (var Ue in Te.ns)
          ke[Ue] = Te.ns[Ue];
        var et = _.tags[_.tags.length - 1] || _;
        _.opt.xmlns && Te.ns !== et.ns && Object.keys(Te.ns).forEach(function(Oe) {
          var X = Te.ns[Oe];
          z(_, "onclosenamespace", { prefix: Oe, uri: X });
        });
      }
      E === 0 && (_.closedRoot = !0), _.tagName = _.attribValue = _.attribName = "", _.attribList.length = 0, _.state = S.TEXT;
    }
    function te(_) {
      var E = _.entity, U = E.toLowerCase(), I, me = "";
      return _.ENTITIES[E] ? _.ENTITIES[E] : _.ENTITIES[U] ? _.ENTITIES[U] : (E = U, E.charAt(0) === "#" && (E.charAt(1) === "x" ? (E = E.slice(2), I = parseInt(E, 16), me = I.toString(16)) : (E = E.slice(1), I = parseInt(E, 10), me = I.toString(10))), E = E.replace(/^0+/, ""), isNaN(I) || me.toLowerCase() !== E || I < 0 || I > 1114111 ? (R(_, "Invalid character entity"), "&" + _.entity + ";") : String.fromCodePoint(I));
    }
    function ye(_, E) {
      E === "<" ? (_.state = S.OPEN_WAKA, _.startTagPosition = _.position) : C(E) || (R(_, "Non-whitespace before first tag."), _.textNode = E, _.state = S.TEXT);
    }
    function pe(_, E) {
      var U = "";
      return E < _.length && (U = _.charAt(E)), U;
    }
    function Re(_) {
      var E = this;
      if (this.error)
        throw this.error;
      if (E.closed)
        return B(
          E,
          "Cannot write after close. Assign an onready handler."
        );
      if (_ === null)
        return N(E);
      typeof _ == "object" && (_ = _.toString());
      for (var U = 0, I = ""; I = pe(_, U++), E.c = I, !!I; )
        switch (E.trackPosition && (E.position++, I === `
` ? (E.line++, E.column = 0) : E.column++), E.state) {
          case S.BEGIN:
            if (E.state = S.BEGIN_WHITESPACE, I === "\uFEFF")
              continue;
            ye(E, I);
            continue;
          case S.BEGIN_WHITESPACE:
            ye(E, I);
            continue;
          case S.TEXT:
            if (E.sawRoot && !E.closedRoot) {
              for (var be = U - 1; I && I !== "<" && I !== "&"; )
                I = pe(_, U++), I && E.trackPosition && (E.position++, I === `
` ? (E.line++, E.column = 0) : E.column++);
              E.textNode += _.substring(be, U - 1);
            }
            I === "<" && !(E.sawRoot && E.closedRoot && !E.strict) ? (E.state = S.OPEN_WAKA, E.startTagPosition = E.position) : (!C(I) && (!E.sawRoot || E.closedRoot) && R(E, "Text data outside of root node."), I === "&" ? E.state = S.TEXT_ENTITY : E.textNode += I);
            continue;
          case S.SCRIPT:
            I === "<" ? E.state = S.SCRIPT_ENDING : E.script += I;
            continue;
          case S.SCRIPT_ENDING:
            I === "/" ? E.state = S.CLOSE_TAG : (E.script += "<" + I, E.state = S.SCRIPT);
            continue;
          case S.OPEN_WAKA:
            if (I === "!")
              E.state = S.SGML_DECL, E.sgmlDecl = "";
            else if (!C(I)) if (K(y, I))
              E.state = S.OPEN_TAG, E.tagName = I;
            else if (I === "/")
              E.state = S.CLOSE_TAG, E.tagName = "";
            else if (I === "?")
              E.state = S.PROC_INST, E.procInstName = E.procInstBody = "";
            else {
              if (R(E, "Unencoded <"), E.startTagPosition + 1 < E.position) {
                var me = E.position - E.startTagPosition;
                I = new Array(me).join(" ") + I;
              }
              E.textNode += "<" + I, E.state = S.TEXT;
            }
            continue;
          case S.SGML_DECL:
            if (E.sgmlDecl + I === "--") {
              E.state = S.COMMENT, E.comment = "", E.sgmlDecl = "";
              continue;
            }
            E.doctype && E.doctype !== !0 && E.sgmlDecl ? (E.state = S.DOCTYPE_DTD, E.doctype += "<!" + E.sgmlDecl + I, E.sgmlDecl = "") : (E.sgmlDecl + I).toUpperCase() === h ? (z(E, "onopencdata"), E.state = S.CDATA, E.sgmlDecl = "", E.cdata = "") : (E.sgmlDecl + I).toUpperCase() === d ? (E.state = S.DOCTYPE, (E.doctype || E.sawRoot) && R(
              E,
              "Inappropriately located doctype declaration"
            ), E.doctype = "", E.sgmlDecl = "") : I === ">" ? (z(E, "onsgmldeclaration", E.sgmlDecl), E.sgmlDecl = "", E.state = S.TEXT) : (F(I) && (E.state = S.SGML_DECL_QUOTED), E.sgmlDecl += I);
            continue;
          case S.SGML_DECL_QUOTED:
            I === E.q && (E.state = S.SGML_DECL, E.q = ""), E.sgmlDecl += I;
            continue;
          case S.DOCTYPE:
            I === ">" ? (E.state = S.TEXT, z(E, "ondoctype", E.doctype), E.doctype = !0) : (E.doctype += I, I === "[" ? E.state = S.DOCTYPE_DTD : F(I) && (E.state = S.DOCTYPE_QUOTED, E.q = I));
            continue;
          case S.DOCTYPE_QUOTED:
            E.doctype += I, I === E.q && (E.q = "", E.state = S.DOCTYPE);
            continue;
          case S.DOCTYPE_DTD:
            I === "]" ? (E.doctype += I, E.state = S.DOCTYPE) : I === "<" ? (E.state = S.OPEN_WAKA, E.startTagPosition = E.position) : F(I) ? (E.doctype += I, E.state = S.DOCTYPE_DTD_QUOTED, E.q = I) : E.doctype += I;
            continue;
          case S.DOCTYPE_DTD_QUOTED:
            E.doctype += I, I === E.q && (E.state = S.DOCTYPE_DTD, E.q = "");
            continue;
          case S.COMMENT:
            I === "-" ? E.state = S.COMMENT_ENDING : E.comment += I;
            continue;
          case S.COMMENT_ENDING:
            I === "-" ? (E.state = S.COMMENT_ENDED, E.comment = J(E.opt, E.comment), E.comment && z(E, "oncomment", E.comment), E.comment = "") : (E.comment += "-" + I, E.state = S.COMMENT);
            continue;
          case S.COMMENT_ENDED:
            I !== ">" ? (R(E, "Malformed comment"), E.comment += "--" + I, E.state = S.COMMENT) : E.doctype && E.doctype !== !0 ? E.state = S.DOCTYPE_DTD : E.state = S.TEXT;
            continue;
          case S.CDATA:
            for (var be = U - 1; I && I !== "]"; )
              I = pe(_, U++), I && E.trackPosition && (E.position++, I === `
` ? (E.line++, E.column = 0) : E.column++);
            E.cdata += _.substring(be, U - 1), I === "]" && (E.state = S.CDATA_ENDING);
            continue;
          case S.CDATA_ENDING:
            I === "]" ? E.state = S.CDATA_ENDING_2 : (E.cdata += "]" + I, E.state = S.CDATA);
            continue;
          case S.CDATA_ENDING_2:
            I === ">" ? (E.cdata && z(E, "oncdata", E.cdata), z(E, "onclosecdata"), E.cdata = "", E.state = S.TEXT) : I === "]" ? E.cdata += "]" : (E.cdata += "]]" + I, E.state = S.CDATA);
            continue;
          case S.PROC_INST:
            I === "?" ? E.state = S.PROC_INST_ENDING : C(I) ? E.state = S.PROC_INST_BODY : E.procInstName += I;
            continue;
          case S.PROC_INST_BODY:
            if (!E.procInstBody && C(I))
              continue;
            I === "?" ? E.state = S.PROC_INST_ENDING : E.procInstBody += I;
            continue;
          case S.PROC_INST_ENDING:
            if (I === ">") {
              const et = {
                name: E.procInstName,
                body: E.procInstBody
              };
              G(E, et), z(E, "onprocessinginstruction", et), E.procInstName = E.procInstBody = "", E.state = S.TEXT;
            } else
              E.procInstBody += "?" + I, E.state = S.PROC_INST_BODY;
            continue;
          case S.OPEN_TAG:
            K(g, I) ? E.tagName += I : (O(E), I === ">" ? M(E) : I === "/" ? E.state = S.OPEN_TAG_SLASH : (C(I) || R(E, "Invalid character in tag name"), E.state = S.ATTRIB));
            continue;
          case S.OPEN_TAG_SLASH:
            I === ">" ? (M(E, !0), re(E)) : (R(
              E,
              "Forward-slash in opening tag not followed by >"
            ), E.state = S.ATTRIB);
            continue;
          case S.ATTRIB:
            if (C(I))
              continue;
            I === ">" ? M(E) : I === "/" ? E.state = S.OPEN_TAG_SLASH : K(y, I) ? (E.attribName = I, E.attribValue = "", E.state = S.ATTRIB_NAME) : R(E, "Invalid attribute name");
            continue;
          case S.ATTRIB_NAME:
            I === "=" ? E.state = S.ATTRIB_VALUE : I === ">" ? (R(E, "Attribute without value"), E.attribValue = E.attribName, T(E), M(E)) : C(I) ? E.state = S.ATTRIB_NAME_SAW_WHITE : K(g, I) ? E.attribName += I : R(E, "Invalid attribute name");
            continue;
          case S.ATTRIB_NAME_SAW_WHITE:
            if (I === "=")
              E.state = S.ATTRIB_VALUE;
            else {
              if (C(I))
                continue;
              R(E, "Attribute without value"), E.tag.attributes[E.attribName] = "", E.attribValue = "", z(E, "onattribute", {
                name: E.attribName,
                value: ""
              }), E.attribName = "", I === ">" ? M(E) : K(y, I) ? (E.attribName = I, E.state = S.ATTRIB_NAME) : (R(E, "Invalid attribute name"), E.state = S.ATTRIB);
            }
            continue;
          case S.ATTRIB_VALUE:
            if (C(I))
              continue;
            F(I) ? (E.q = I, E.state = S.ATTRIB_VALUE_QUOTED) : (E.opt.unquotedAttributeValues || B(E, "Unquoted attribute value"), E.state = S.ATTRIB_VALUE_UNQUOTED, E.attribValue = I);
            continue;
          case S.ATTRIB_VALUE_QUOTED:
            if (I !== E.q) {
              I === "&" ? E.state = S.ATTRIB_VALUE_ENTITY_Q : E.attribValue += I;
              continue;
            }
            T(E), E.q = "", E.state = S.ATTRIB_VALUE_CLOSED;
            continue;
          case S.ATTRIB_VALUE_CLOSED:
            C(I) ? E.state = S.ATTRIB : I === ">" ? M(E) : I === "/" ? E.state = S.OPEN_TAG_SLASH : K(y, I) ? (R(E, "No whitespace between attributes"), E.attribName = I, E.attribValue = "", E.state = S.ATTRIB_NAME) : R(E, "Invalid attribute name");
            continue;
          case S.ATTRIB_VALUE_UNQUOTED:
            if (!q(I)) {
              I === "&" ? E.state = S.ATTRIB_VALUE_ENTITY_U : E.attribValue += I;
              continue;
            }
            T(E), I === ">" ? M(E) : E.state = S.ATTRIB;
            continue;
          case S.CLOSE_TAG:
            if (E.tagName)
              I === ">" ? re(E) : K(g, I) ? E.tagName += I : E.script ? (E.script += "</" + E.tagName + I, E.tagName = "", E.state = S.SCRIPT) : (C(I) || R(E, "Invalid tagname in closing tag"), E.state = S.CLOSE_TAG_SAW_WHITE);
            else {
              if (C(I))
                continue;
              H(y, I) ? E.script ? (E.script += "</" + I, E.state = S.SCRIPT) : R(E, "Invalid tagname in closing tag.") : E.tagName = I;
            }
            continue;
          case S.CLOSE_TAG_SAW_WHITE:
            if (C(I))
              continue;
            I === ">" ? re(E) : R(E, "Invalid characters in closing tag");
            continue;
          case S.TEXT_ENTITY:
          case S.ATTRIB_VALUE_ENTITY_Q:
          case S.ATTRIB_VALUE_ENTITY_U:
            var Te, ke;
            switch (E.state) {
              case S.TEXT_ENTITY:
                Te = S.TEXT, ke = "textNode";
                break;
              case S.ATTRIB_VALUE_ENTITY_Q:
                Te = S.ATTRIB_VALUE_QUOTED, ke = "attribValue";
                break;
              case S.ATTRIB_VALUE_ENTITY_U:
                Te = S.ATTRIB_VALUE_UNQUOTED, ke = "attribValue";
                break;
            }
            if (I === ";") {
              var Ue = te(E);
              E.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(Ue) ? ((E.entityCount += 1) > E.opt.maxEntityCount && B(
                E,
                "Parsed entity count exceeds max entity count"
              ), (E.entityDepth += 1) > E.opt.maxEntityDepth && B(
                E,
                "Parsed entity depth exceeds max entity depth"
              ), E.entity = "", E.state = Te, E.write(Ue), E.entityDepth -= 1) : (E[ke] += Ue, E.entity = "", E.state = Te);
            } else K(E.entity.length ? A : w, I) ? E.entity += I : (R(E, "Invalid character in entity name"), E[ke] += "&" + E.entity + I, E.entity = "", E.state = Te);
            continue;
          default:
            throw new Error(E, "Unknown state: " + E.state);
        }
      return E.position >= E.bufferCheckPosition && i(E), E;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var _ = String.fromCharCode, E = Math.floor, U = function() {
        var I = 16384, me = [], be, Te, ke = -1, Ue = arguments.length;
        if (!Ue)
          return "";
        for (var et = ""; ++ke < Ue; ) {
          var Oe = Number(arguments[ke]);
          if (!isFinite(Oe) || // `NaN`, `+Infinity`, or `-Infinity`
          Oe < 0 || // not a valid Unicode code point
          Oe > 1114111 || // not a valid Unicode code point
          E(Oe) !== Oe)
            throw RangeError("Invalid code point: " + Oe);
          Oe <= 65535 ? me.push(Oe) : (Oe -= 65536, be = (Oe >> 10) + 55296, Te = Oe % 1024 + 56320, me.push(be, Te)), (ke + 1 === Ue || me.length > I) && (et += _.apply(null, me), me.length = 0);
        }
        return et;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: U,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = U;
    }();
  })(e);
})(ty);
Object.defineProperty(xo, "__esModule", { value: !0 });
xo.XElement = void 0;
xo.parseXml = uR;
const aR = ty, Es = Pi;
class ny {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, Es.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!lR(t))
      throw (0, Es.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const n = this.attributes === null ? null : this.attributes[t];
    if (n == null)
      throw (0, Es.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return n;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, n = !1, r = null) {
    const i = this.elementOrNull(t, n);
    if (i === null)
      throw (0, Es.newError)(r || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, n = !1) {
    if (this.elements === null)
      return null;
    for (const r of this.elements)
      if (_h(r, t, n))
        return r;
    return null;
  }
  getElements(t, n = !1) {
    return this.elements === null ? [] : this.elements.filter((r) => _h(r, t, n));
  }
  elementValueOrEmpty(t, n = !1) {
    const r = this.elementOrNull(t, n);
    return r === null ? "" : r.value;
  }
}
xo.XElement = ny;
const cR = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function lR(e) {
  return cR.test(e);
}
function _h(e, t, n) {
  const r = e.name;
  return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
}
function uR(e) {
  let t = null;
  const n = aR.parser(!0, {}), r = [];
  return n.onopentag = (i) => {
    const o = new ny(i.name);
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
  var t = Qn;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var n = Pi;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return n.newError;
  } });
  var r = Nt;
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
  var i = Ra;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = Fo;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var s = Lo;
  Object.defineProperty(e, "getS3LikeProviderBaseUrl", { enumerable: !0, get: function() {
    return s.getS3LikeProviderBaseUrl;
  } }), Object.defineProperty(e, "githubUrl", { enumerable: !0, get: function() {
    return s.githubUrl;
  } }), Object.defineProperty(e, "githubTagPrefix", { enumerable: !0, get: function() {
    return s.githubTagPrefix;
  } });
  var a = Wu;
  Object.defineProperty(e, "retry", { enumerable: !0, get: function() {
    return a.retry;
  } });
  var c = Ku;
  Object.defineProperty(e, "parseDn", { enumerable: !0, get: function() {
    return c.parseDn;
  } });
  var u = Ei;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return u.UUID;
  } });
  var l = xo;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return l.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return l.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(h) {
    return h == null ? [] : Array.isArray(h) ? h : [h];
  }
})(Qe);
var ut = {}, Ju = {}, sn = {};
function ry(e) {
  return typeof e > "u" || e === null;
}
function fR(e) {
  return typeof e == "object" && e !== null;
}
function dR(e) {
  return Array.isArray(e) ? e : ry(e) ? [] : [e];
}
function hR(e, t) {
  var n, r, i, o;
  if (t)
    for (o = Object.keys(t), n = 0, r = o.length; n < r; n += 1)
      i = o[n], e[i] = t[i];
  return e;
}
function pR(e, t) {
  var n = "", r;
  for (r = 0; r < t; r += 1)
    n += e;
  return n;
}
function mR(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
sn.isNothing = ry;
sn.isObject = fR;
sn.toArray = dR;
sn.repeat = pR;
sn.isNegativeZero = mR;
sn.extend = hR;
function iy(e, t) {
  var n = "", r = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (n += 'in "' + e.mark.name + '" '), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += `

` + e.mark.snippet), r + " " + n) : r;
}
function go(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = iy(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
go.prototype = Object.create(Error.prototype);
go.prototype.constructor = go;
go.prototype.toString = function(t) {
  return this.name + ": " + iy(this, t);
};
var ko = go, Xi = sn;
function Ic(e, t, n, r, i) {
  var o = "", s = "", a = Math.floor(i / 2) - 1;
  return r - t > a && (o = " ... ", t = r - a + o.length), n - r > a && (s = " ...", n = r + a - s.length), {
    str: o + e.slice(t, n).replace(/\t/g, "→") + s,
    pos: r - t + o.length
    // relative position
  };
}
function Pc(e, t) {
  return Xi.repeat(" ", t - e.length) + e;
}
function gR(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var n = /\r?\n|\r|\0/g, r = [0], i = [], o, s = -1; o = n.exec(e.buffer); )
    i.push(o.index), r.push(o.index + o[0].length), e.position <= o.index && s < 0 && (s = r.length - 2);
  s < 0 && (s = r.length - 1);
  var a = "", c, u, l = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + l + 3);
  for (c = 1; c <= t.linesBefore && !(s - c < 0); c++)
    u = Ic(
      e.buffer,
      r[s - c],
      i[s - c],
      e.position - (r[s] - r[s - c]),
      f
    ), a = Xi.repeat(" ", t.indent) + Pc((e.line - c + 1).toString(), l) + " | " + u.str + `
` + a;
  for (u = Ic(e.buffer, r[s], i[s], e.position, f), a += Xi.repeat(" ", t.indent) + Pc((e.line + 1).toString(), l) + " | " + u.str + `
`, a += Xi.repeat("-", t.indent + l + 3 + u.pos) + `^
`, c = 1; c <= t.linesAfter && !(s + c >= i.length); c++)
    u = Ic(
      e.buffer,
      r[s + c],
      i[s + c],
      e.position - (r[s] - r[s + c]),
      f
    ), a += Xi.repeat(" ", t.indent) + Pc((e.line + c + 1).toString(), l) + " | " + u.str + `
`;
  return a.replace(/\n$/, "");
}
var yR = gR, wh = ko, vR = [
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
], ER = [
  "scalar",
  "sequence",
  "mapping"
];
function _R(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(n) {
    e[n].forEach(function(r) {
      t[String(r)] = n;
    });
  }), t;
}
function wR(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(n) {
    if (vR.indexOf(n) === -1)
      throw new wh('Unknown option "' + n + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(n) {
    return n;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = _R(t.styleAliases || null), ER.indexOf(this.kind) === -1)
    throw new wh('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Dt = wR, Vi = ko, Oc = Dt;
function $h(e, t) {
  var n = [];
  return e[t].forEach(function(r) {
    var i = n.length;
    n.forEach(function(o, s) {
      o.tag === r.tag && o.kind === r.kind && o.multi === r.multi && (i = s);
    }), n[i] = r;
  }), n;
}
function $R() {
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
function ml(e) {
  return this.extend(e);
}
ml.prototype.extend = function(t) {
  var n = [], r = [];
  if (t instanceof Oc)
    r.push(t);
  else if (Array.isArray(t))
    r = r.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (n = n.concat(t.implicit)), t.explicit && (r = r.concat(t.explicit));
  else
    throw new Vi("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  n.forEach(function(o) {
    if (!(o instanceof Oc))
      throw new Vi("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new Vi("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new Vi("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), r.forEach(function(o) {
    if (!(o instanceof Oc))
      throw new Vi("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(ml.prototype);
  return i.implicit = (this.implicit || []).concat(n), i.explicit = (this.explicit || []).concat(r), i.compiledImplicit = $h(i, "implicit"), i.compiledExplicit = $h(i, "explicit"), i.compiledTypeMap = $R(i.compiledImplicit, i.compiledExplicit), i;
};
var oy = ml, SR = Dt, sy = new SR("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), bR = Dt, ay = new bR("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), AR = Dt, cy = new AR("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), TR = oy, ly = new TR({
  explicit: [
    sy,
    ay,
    cy
  ]
}), CR = Dt;
function NR(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function IR() {
  return null;
}
function PR(e) {
  return e === null;
}
var uy = new CR("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: NR,
  construct: IR,
  predicate: PR,
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
}), OR = Dt;
function RR(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function DR(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function FR(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var fy = new OR("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: RR,
  construct: DR,
  predicate: FR,
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
}), LR = sn, xR = Dt;
function kR(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function UR(e) {
  return 48 <= e && e <= 55;
}
function jR(e) {
  return 48 <= e && e <= 57;
}
function MR(e) {
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
          if (!kR(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "o") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!UR(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; n < t; n++)
    if (i = e[n], i !== "_") {
      if (!jR(e.charCodeAt(n)))
        return !1;
      r = !0;
    }
  return !(!r || i === "_");
}
function BR(e) {
  var t = e, n = 1, r;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
  if (r === "0") {
    if (t[1] === "b") return n * parseInt(t.slice(2), 2);
    if (t[1] === "x") return n * parseInt(t.slice(2), 16);
    if (t[1] === "o") return n * parseInt(t.slice(2), 8);
  }
  return n * parseInt(t, 10);
}
function HR(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !LR.isNegativeZero(e);
}
var dy = new xR("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: MR,
  construct: BR,
  predicate: HR,
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
}), hy = sn, qR = Dt, zR = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function VR(e) {
  return !(e === null || !zR.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function GR(e) {
  var t, n;
  return t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
var WR = /^[-+]?[0-9]+e/;
function KR(e, t) {
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
  else if (hy.isNegativeZero(e))
    return "-0.0";
  return n = e.toString(10), WR.test(n) ? n.replace("e", ".e") : n;
}
function JR(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || hy.isNegativeZero(e));
}
var py = new qR("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: VR,
  construct: GR,
  predicate: JR,
  represent: KR,
  defaultStyle: "lowercase"
}), my = ly.extend({
  implicit: [
    uy,
    fy,
    dy,
    py
  ]
}), gy = my, YR = Dt, yy = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), vy = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function XR(e) {
  return e === null ? !1 : yy.exec(e) !== null || vy.exec(e) !== null;
}
function ZR(e) {
  var t, n, r, i, o, s, a, c = 0, u = null, l, f, h;
  if (t = yy.exec(e), t === null && (t = vy.exec(e)), t === null) throw new Error("Date resolve error");
  if (n = +t[1], r = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(n, r, i));
  if (o = +t[4], s = +t[5], a = +t[6], t[7]) {
    for (c = t[7].slice(0, 3); c.length < 3; )
      c += "0";
    c = +c;
  }
  return t[9] && (l = +t[10], f = +(t[11] || 0), u = (l * 60 + f) * 6e4, t[9] === "-" && (u = -u)), h = new Date(Date.UTC(n, r, i, o, s, a, c)), u && h.setTime(h.getTime() - u), h;
}
function QR(e) {
  return e.toISOString();
}
var Ey = new YR("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: XR,
  construct: ZR,
  instanceOf: Date,
  represent: QR
}), eD = Dt;
function tD(e) {
  return e === "<<" || e === null;
}
var _y = new eD("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: tD
}), nD = Dt, Yu = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function rD(e) {
  if (e === null) return !1;
  var t, n, r = 0, i = e.length, o = Yu;
  for (n = 0; n < i; n++)
    if (t = o.indexOf(e.charAt(n)), !(t > 64)) {
      if (t < 0) return !1;
      r += 6;
    }
  return r % 8 === 0;
}
function iD(e) {
  var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, o = Yu, s = 0, a = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)), s = s << 6 | o.indexOf(r.charAt(t));
  return n = i % 4 * 6, n === 0 ? (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)) : n === 18 ? (a.push(s >> 10 & 255), a.push(s >> 2 & 255)) : n === 12 && a.push(s >> 4 & 255), new Uint8Array(a);
}
function oD(e) {
  var t = "", n = 0, r, i, o = e.length, s = Yu;
  for (r = 0; r < o; r++)
    r % 3 === 0 && r && (t += s[n >> 18 & 63], t += s[n >> 12 & 63], t += s[n >> 6 & 63], t += s[n & 63]), n = (n << 8) + e[r];
  return i = o % 3, i === 0 ? (t += s[n >> 18 & 63], t += s[n >> 12 & 63], t += s[n >> 6 & 63], t += s[n & 63]) : i === 2 ? (t += s[n >> 10 & 63], t += s[n >> 4 & 63], t += s[n << 2 & 63], t += s[64]) : i === 1 && (t += s[n >> 2 & 63], t += s[n << 4 & 63], t += s[64], t += s[64]), t;
}
function sD(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var wy = new nD("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: rD,
  construct: iD,
  predicate: sD,
  represent: oD
}), aD = Dt, cD = Object.prototype.hasOwnProperty, lD = Object.prototype.toString;
function uD(e) {
  if (e === null) return !0;
  var t = [], n, r, i, o, s, a = e;
  for (n = 0, r = a.length; n < r; n += 1) {
    if (i = a[n], s = !1, lD.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (cD.call(i, o))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function fD(e) {
  return e !== null ? e : [];
}
var $y = new aD("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: uD,
  construct: fD
}), dD = Dt, hD = Object.prototype.toString;
function pD(e) {
  if (e === null) return !0;
  var t, n, r, i, o, s = e;
  for (o = new Array(s.length), t = 0, n = s.length; t < n; t += 1) {
    if (r = s[t], hD.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
    o[t] = [i[0], r[i[0]]];
  }
  return !0;
}
function mD(e) {
  if (e === null) return [];
  var t, n, r, i, o, s = e;
  for (o = new Array(s.length), t = 0, n = s.length; t < n; t += 1)
    r = s[t], i = Object.keys(r), o[t] = [i[0], r[i[0]]];
  return o;
}
var Sy = new dD("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: pD,
  construct: mD
}), gD = Dt, yD = Object.prototype.hasOwnProperty;
function vD(e) {
  if (e === null) return !0;
  var t, n = e;
  for (t in n)
    if (yD.call(n, t) && n[t] !== null)
      return !1;
  return !0;
}
function ED(e) {
  return e !== null ? e : {};
}
var by = new gD("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: vD,
  construct: ED
}), Xu = gy.extend({
  implicit: [
    Ey,
    _y
  ],
  explicit: [
    wy,
    $y,
    Sy,
    by
  ]
}), Sr = sn, Ay = ko, _D = yR, wD = Xu, er = Object.prototype.hasOwnProperty, Ys = 1, Ty = 2, Cy = 3, Xs = 4, Rc = 1, $D = 2, Sh = 3, SD = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, bD = /[\x85\u2028\u2029]/, AD = /[,\[\]\{\}]/, Ny = /^(?:!|!!|![a-z\-]+!)$/i, Iy = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function bh(e) {
  return Object.prototype.toString.call(e);
}
function mn(e) {
  return e === 10 || e === 13;
}
function Or(e) {
  return e === 9 || e === 32;
}
function Ut(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function ai(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function TD(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function CD(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function ND(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function Ah(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function ID(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function Py(e, t, n) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: n
  }) : e[t] = n;
}
var Oy = new Array(256), Ry = new Array(256);
for (var Kr = 0; Kr < 256; Kr++)
  Oy[Kr] = Ah(Kr) ? 1 : 0, Ry[Kr] = Ah(Kr);
function PD(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || wD, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function Dy(e, t) {
  var n = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return n.snippet = _D(n), new Ay(t, n);
}
function ae(e, t) {
  throw Dy(e, t);
}
function Zs(e, t) {
  e.onWarning && e.onWarning.call(null, Dy(e, t));
}
var Th = {
  YAML: function(t, n, r) {
    var i, o, s;
    t.version !== null && ae(t, "duplication of %YAML directive"), r.length !== 1 && ae(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(r[0]), i === null && ae(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), s = parseInt(i[2], 10), o !== 1 && ae(t, "unacceptable YAML version of the document"), t.version = r[0], t.checkLineBreaks = s < 2, s !== 1 && s !== 2 && Zs(t, "unsupported YAML version of the document");
  },
  TAG: function(t, n, r) {
    var i, o;
    r.length !== 2 && ae(t, "TAG directive accepts exactly two arguments"), i = r[0], o = r[1], Ny.test(i) || ae(t, "ill-formed tag handle (first argument) of the TAG directive"), er.call(t.tagMap, i) && ae(t, 'there is a previously declared suffix for "' + i + '" tag handle'), Iy.test(o) || ae(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      ae(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function Xn(e, t, n, r) {
  var i, o, s, a;
  if (t < n) {
    if (a = e.input.slice(t, n), r)
      for (i = 0, o = a.length; i < o; i += 1)
        s = a.charCodeAt(i), s === 9 || 32 <= s && s <= 1114111 || ae(e, "expected valid JSON character");
    else SD.test(a) && ae(e, "the stream contains non-printable characters");
    e.result += a;
  }
}
function Ch(e, t, n, r) {
  var i, o, s, a;
  for (Sr.isObject(n) || ae(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), s = 0, a = i.length; s < a; s += 1)
    o = i[s], er.call(t, o) || (Py(t, o, n[o]), r[o] = !0);
}
function ci(e, t, n, r, i, o, s, a, c) {
  var u, l;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), u = 0, l = i.length; u < l; u += 1)
      Array.isArray(i[u]) && ae(e, "nested arrays are not supported inside keys"), typeof i == "object" && bh(i[u]) === "[object Object]" && (i[u] = "[object Object]");
  if (typeof i == "object" && bh(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (u = 0, l = o.length; u < l; u += 1)
        Ch(e, t, o[u], n);
    else
      Ch(e, t, o, n);
  else
    !e.json && !er.call(n, i) && er.call(t, i) && (e.line = s || e.line, e.lineStart = a || e.lineStart, e.position = c || e.position, ae(e, "duplicated mapping key")), Py(t, i, o), delete n[i];
  return t;
}
function Zu(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : ae(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function Je(e, t, n) {
  for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; Or(i); )
      i === 9 && e.firstTabInLine === -1 && (e.firstTabInLine = e.position), i = e.input.charCodeAt(++e.position);
    if (t && i === 35)
      do
        i = e.input.charCodeAt(++e.position);
      while (i !== 10 && i !== 13 && i !== 0);
    if (mn(i))
      for (Zu(e), i = e.input.charCodeAt(e.position), r++, e.lineIndent = 0; i === 32; )
        e.lineIndent++, i = e.input.charCodeAt(++e.position);
    else
      break;
  }
  return n !== -1 && r !== 0 && e.lineIndent < n && Zs(e, "deficient indentation"), r;
}
function Da(e) {
  var t = e.position, n;
  return n = e.input.charCodeAt(t), !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || Ut(n)));
}
function Qu(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Sr.repeat(`
`, t - 1));
}
function OD(e, t, n) {
  var r, i, o, s, a, c, u, l, f = e.kind, h = e.result, d;
  if (d = e.input.charCodeAt(e.position), Ut(d) || ai(d) || d === 35 || d === 38 || d === 42 || d === 33 || d === 124 || d === 62 || d === 39 || d === 34 || d === 37 || d === 64 || d === 96 || (d === 63 || d === 45) && (i = e.input.charCodeAt(e.position + 1), Ut(i) || n && ai(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = s = e.position, a = !1; d !== 0; ) {
    if (d === 58) {
      if (i = e.input.charCodeAt(e.position + 1), Ut(i) || n && ai(i))
        break;
    } else if (d === 35) {
      if (r = e.input.charCodeAt(e.position - 1), Ut(r))
        break;
    } else {
      if (e.position === e.lineStart && Da(e) || n && ai(d))
        break;
      if (mn(d))
        if (c = e.line, u = e.lineStart, l = e.lineIndent, Je(e, !1, -1), e.lineIndent >= t) {
          a = !0, d = e.input.charCodeAt(e.position);
          continue;
        } else {
          e.position = s, e.line = c, e.lineStart = u, e.lineIndent = l;
          break;
        }
    }
    a && (Xn(e, o, s, !1), Qu(e, e.line - c), o = s = e.position, a = !1), Or(d) || (s = e.position + 1), d = e.input.charCodeAt(++e.position);
  }
  return Xn(e, o, s, !1), e.result ? !0 : (e.kind = f, e.result = h, !1);
}
function RD(e, t) {
  var n, r, i;
  if (n = e.input.charCodeAt(e.position), n !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0; )
    if (n === 39)
      if (Xn(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39)
        r = e.position, e.position++, i = e.position;
      else
        return !0;
    else mn(n) ? (Xn(e, r, i, !0), Qu(e, Je(e, !1, t)), r = i = e.position) : e.position === e.lineStart && Da(e) ? ae(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  ae(e, "unexpected end of the stream within a single quoted scalar");
}
function DD(e, t) {
  var n, r, i, o, s, a;
  if (a = e.input.charCodeAt(e.position), a !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (a = e.input.charCodeAt(e.position)) !== 0; ) {
    if (a === 34)
      return Xn(e, n, e.position, !0), e.position++, !0;
    if (a === 92) {
      if (Xn(e, n, e.position, !0), a = e.input.charCodeAt(++e.position), mn(a))
        Je(e, !1, t);
      else if (a < 256 && Oy[a])
        e.result += Ry[a], e.position++;
      else if ((s = CD(a)) > 0) {
        for (i = s, o = 0; i > 0; i--)
          a = e.input.charCodeAt(++e.position), (s = TD(a)) >= 0 ? o = (o << 4) + s : ae(e, "expected hexadecimal character");
        e.result += ID(o), e.position++;
      } else
        ae(e, "unknown escape sequence");
      n = r = e.position;
    } else mn(a) ? (Xn(e, n, r, !0), Qu(e, Je(e, !1, t)), n = r = e.position) : e.position === e.lineStart && Da(e) ? ae(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
  }
  ae(e, "unexpected end of the stream within a double quoted scalar");
}
function FD(e, t) {
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
    n ? g === 44 && ae(e, "expected the node content, but found ','") : ae(e, "missed comma between flow collection entries"), v = p = y = null, f = h = !1, g === 63 && (u = e.input.charCodeAt(e.position + 1), Ut(u) && (f = h = !0, e.position++, Je(e, !0, t))), r = e.line, i = e.lineStart, o = e.position, _i(e, t, Ys, !1, !0), v = e.tag, p = e.result, Je(e, !0, t), g = e.input.charCodeAt(e.position), (h || e.line === r) && g === 58 && (f = !0, g = e.input.charCodeAt(++e.position), Je(e, !0, t), _i(e, t, Ys, !1, !0), y = e.result), d ? ci(e, a, m, v, p, y, r, i, o) : f ? a.push(ci(e, null, m, v, p, y, r, i, o)) : a.push(p), Je(e, !0, t), g = e.input.charCodeAt(e.position), g === 44 ? (n = !0, g = e.input.charCodeAt(++e.position)) : n = !1;
  }
  ae(e, "unexpected end of the stream within a flow collection");
}
function LD(e, t) {
  var n, r, i = Rc, o = !1, s = !1, a = t, c = 0, u = !1, l, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    r = !1;
  else if (f === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      Rc === i ? i = f === 43 ? Sh : $D : ae(e, "repeat of a chomping mode identifier");
    else if ((l = ND(f)) >= 0)
      l === 0 ? ae(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? ae(e, "repeat of an indentation width identifier") : (a = t + l - 1, s = !0);
    else
      break;
  if (Or(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (Or(f));
    if (f === 35)
      do
        f = e.input.charCodeAt(++e.position);
      while (!mn(f) && f !== 0);
  }
  for (; f !== 0; ) {
    for (Zu(e), e.lineIndent = 0, f = e.input.charCodeAt(e.position); (!s || e.lineIndent < a) && f === 32; )
      e.lineIndent++, f = e.input.charCodeAt(++e.position);
    if (!s && e.lineIndent > a && (a = e.lineIndent), mn(f)) {
      c++;
      continue;
    }
    if (e.lineIndent < a) {
      i === Sh ? e.result += Sr.repeat(`
`, o ? 1 + c : c) : i === Rc && o && (e.result += `
`);
      break;
    }
    for (r ? Or(f) ? (u = !0, e.result += Sr.repeat(`
`, o ? 1 + c : c)) : u ? (u = !1, e.result += Sr.repeat(`
`, c + 1)) : c === 0 ? o && (e.result += " ") : e.result += Sr.repeat(`
`, c) : e.result += Sr.repeat(`
`, o ? 1 + c : c), o = !0, s = !0, c = 0, n = e.position; !mn(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    Xn(e, n, e.position, !1);
  }
  return !0;
}
function Nh(e, t) {
  var n, r = e.tag, i = e.anchor, o = [], s, a = !1, c;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), c = e.input.charCodeAt(e.position); c !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, ae(e, "tab characters must not be used in indentation")), !(c !== 45 || (s = e.input.charCodeAt(e.position + 1), !Ut(s)))); ) {
    if (a = !0, e.position++, Je(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), c = e.input.charCodeAt(e.position);
      continue;
    }
    if (n = e.line, _i(e, t, Cy, !1, !0), o.push(e.result), Je(e, !0, -1), c = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && c !== 0)
      ae(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return a ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function xD(e, t, n) {
  var r, i, o, s, a, c, u = e.tag, l = e.anchor, f = {}, h = /* @__PURE__ */ Object.create(null), d = null, m = null, p = null, v = !1, y = !1, g;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), g = e.input.charCodeAt(e.position); g !== 0; ) {
    if (!v && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, ae(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), o = e.line, (g === 63 || g === 58) && Ut(r))
      g === 63 ? (v && (ci(e, f, h, d, m, null, s, a, c), d = m = p = null), y = !0, v = !0, i = !0) : v ? (v = !1, i = !0) : ae(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, g = r;
    else {
      if (s = e.line, a = e.lineStart, c = e.position, !_i(e, n, Ty, !1, !0))
        break;
      if (e.line === o) {
        for (g = e.input.charCodeAt(e.position); Or(g); )
          g = e.input.charCodeAt(++e.position);
        if (g === 58)
          g = e.input.charCodeAt(++e.position), Ut(g) || ae(e, "a whitespace character is expected after the key-value separator within a block mapping"), v && (ci(e, f, h, d, m, null, s, a, c), d = m = p = null), y = !0, v = !1, i = !1, d = e.tag, m = e.result;
        else if (y)
          ae(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = u, e.anchor = l, !0;
      } else if (y)
        ae(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = u, e.anchor = l, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (v && (s = e.line, a = e.lineStart, c = e.position), _i(e, t, Xs, !0, i) && (v ? m = e.result : p = e.result), v || (ci(e, f, h, d, m, p, s, a, c), d = m = p = null), Je(e, !0, -1), g = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && g !== 0)
      ae(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return v && ci(e, f, h, d, m, null, s, a, c), y && (e.tag = u, e.anchor = l, e.kind = "mapping", e.result = f), y;
}
function kD(e) {
  var t, n = !1, r = !1, i, o, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && ae(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (n = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (r = !0, i = "!!", s = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), s = e.input.charCodeAt(++e.position)) : ae(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !Ut(s); )
      s === 33 && (r ? ae(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), Ny.test(i) || ae(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), s = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), AD.test(o) && ae(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !Iy.test(o) && ae(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    ae(e, "tag name is malformed: " + o);
  }
  return n ? e.tag = o : er.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : ae(e, 'undeclared tag handle "' + i + '"'), !0;
}
function UD(e) {
  var t, n;
  if (n = e.input.charCodeAt(e.position), n !== 38) return !1;
  for (e.anchor !== null && ae(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !Ut(n) && !ai(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && ae(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function jD(e) {
  var t, n, r;
  if (r = e.input.charCodeAt(e.position), r !== 42) return !1;
  for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !Ut(r) && !ai(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && ae(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), er.call(e.anchorMap, n) || ae(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], Je(e, !0, -1), !0;
}
function _i(e, t, n, r, i) {
  var o, s, a, c = 1, u = !1, l = !1, f, h, d, m, p, v;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = s = a = Xs === n || Cy === n, r && Je(e, !0, -1) && (u = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1)
    for (; kD(e) || UD(e); )
      Je(e, !0, -1) ? (u = !0, a = o, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : a = !1;
  if (a && (a = u || i), (c === 1 || Xs === n) && (Ys === n || Ty === n ? p = t : p = t + 1, v = e.position - e.lineStart, c === 1 ? a && (Nh(e, v) || xD(e, v, p)) || FD(e, p) ? l = !0 : (s && LD(e, p) || RD(e, p) || DD(e, p) ? l = !0 : jD(e) ? (l = !0, (e.tag !== null || e.anchor !== null) && ae(e, "alias node should not have any properties")) : OD(e, p, Ys === n) && (l = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : c === 0 && (l = a && Nh(e, v))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && ae(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, h = e.implicitTypes.length; f < h; f += 1)
      if (m = e.implicitTypes[f], m.resolve(e.result)) {
        e.result = m.construct(e.result), e.tag = m.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (er.call(e.typeMap[e.kind || "fallback"], e.tag))
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
function MD(e) {
  var t = e.position, n, r, i, o = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (Je(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (o = !0, s = e.input.charCodeAt(++e.position), n = e.position; s !== 0 && !Ut(s); )
      s = e.input.charCodeAt(++e.position);
    for (r = e.input.slice(n, e.position), i = [], r.length < 1 && ae(e, "directive name must not be less than one character in length"); s !== 0; ) {
      for (; Or(s); )
        s = e.input.charCodeAt(++e.position);
      if (s === 35) {
        do
          s = e.input.charCodeAt(++e.position);
        while (s !== 0 && !mn(s));
        break;
      }
      if (mn(s)) break;
      for (n = e.position; s !== 0 && !Ut(s); )
        s = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(n, e.position));
    }
    s !== 0 && Zu(e), er.call(Th, r) ? Th[r](e, r, i) : Zs(e, 'unknown document directive "' + r + '"');
  }
  if (Je(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, Je(e, !0, -1)) : o && ae(e, "directives end mark is expected"), _i(e, e.lineIndent - 1, Xs, !1, !0), Je(e, !0, -1), e.checkLineBreaks && bD.test(e.input.slice(t, e.position)) && Zs(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Da(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, Je(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    ae(e, "end of the stream or a document separator is expected");
  else
    return;
}
function Fy(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var n = new PD(e, t), r = e.indexOf("\0");
  for (r !== -1 && (n.position = r, ae(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32; )
    n.lineIndent += 1, n.position += 1;
  for (; n.position < n.length - 1; )
    MD(n);
  return n.documents;
}
function BD(e, t, n) {
  t !== null && typeof t == "object" && typeof n > "u" && (n = t, t = null);
  var r = Fy(e, n);
  if (typeof t != "function")
    return r;
  for (var i = 0, o = r.length; i < o; i += 1)
    t(r[i]);
}
function HD(e, t) {
  var n = Fy(e, t);
  if (n.length !== 0) {
    if (n.length === 1)
      return n[0];
    throw new Ay("expected a single document in the stream, but found more");
  }
}
Ju.loadAll = BD;
Ju.load = HD;
var Ly = {}, Fa = sn, Uo = ko, qD = Xu, xy = Object.prototype.toString, ky = Object.prototype.hasOwnProperty, ef = 65279, zD = 9, yo = 10, VD = 13, GD = 32, WD = 33, KD = 34, gl = 35, JD = 37, YD = 38, XD = 39, ZD = 42, Uy = 44, QD = 45, Qs = 58, eF = 61, tF = 62, nF = 63, rF = 64, jy = 91, My = 93, iF = 96, By = 123, oF = 124, Hy = 125, $t = {};
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
var sF = [
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
], aF = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function cF(e, t) {
  var n, r, i, o, s, a, c;
  if (t === null) return {};
  for (n = {}, r = Object.keys(t), i = 0, o = r.length; i < o; i += 1)
    s = r[i], a = String(t[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), c = e.compiledTypeMap.fallback[s], c && ky.call(c.styleAliases, a) && (a = c.styleAliases[a]), n[s] = a;
  return n;
}
function lF(e) {
  var t, n, r;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    n = "x", r = 2;
  else if (e <= 65535)
    n = "u", r = 4;
  else if (e <= 4294967295)
    n = "U", r = 8;
  else
    throw new Uo("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + n + Fa.repeat("0", r - t.length) + t;
}
var uF = 1, vo = 2;
function fF(e) {
  this.schema = e.schema || qD, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = Fa.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = cF(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? vo : uF, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Ih(e, t) {
  for (var n = Fa.repeat(" ", t), r = 0, i = -1, o = "", s, a = e.length; r < a; )
    i = e.indexOf(`
`, r), i === -1 ? (s = e.slice(r), r = a) : (s = e.slice(r, i + 1), r = i + 1), s.length && s !== `
` && (o += n), o += s;
  return o;
}
function yl(e, t) {
  return `
` + Fa.repeat(" ", e.indent * t);
}
function dF(e, t) {
  var n, r, i;
  for (n = 0, r = e.implicitTypes.length; n < r; n += 1)
    if (i = e.implicitTypes[n], i.resolve(t))
      return !0;
  return !1;
}
function ea(e) {
  return e === GD || e === zD;
}
function Eo(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== ef || 65536 <= e && e <= 1114111;
}
function Ph(e) {
  return Eo(e) && e !== ef && e !== VD && e !== yo;
}
function Oh(e, t, n) {
  var r = Ph(e), i = r && !ea(e);
  return (
    // ns-plain-safe
    (n ? (
      // c = flow-in
      r
    ) : r && e !== Uy && e !== jy && e !== My && e !== By && e !== Hy) && e !== gl && !(t === Qs && !i) || Ph(t) && !ea(t) && e === gl || t === Qs && i
  );
}
function hF(e) {
  return Eo(e) && e !== ef && !ea(e) && e !== QD && e !== nF && e !== Qs && e !== Uy && e !== jy && e !== My && e !== By && e !== Hy && e !== gl && e !== YD && e !== ZD && e !== WD && e !== oF && e !== eF && e !== tF && e !== XD && e !== KD && e !== JD && e !== rF && e !== iF;
}
function pF(e) {
  return !ea(e) && e !== Qs;
}
function Zi(e, t) {
  var n = e.charCodeAt(t), r;
  return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function qy(e) {
  var t = /^\n* /;
  return t.test(e);
}
var zy = 1, vl = 2, Vy = 3, Gy = 4, ni = 5;
function mF(e, t, n, r, i, o, s, a) {
  var c, u = 0, l = null, f = !1, h = !1, d = r !== -1, m = -1, p = hF(Zi(e, 0)) && pF(Zi(e, e.length - 1));
  if (t || s)
    for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
      if (u = Zi(e, c), !Eo(u))
        return ni;
      p = p && Oh(u, l, a), l = u;
    }
  else {
    for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
      if (u = Zi(e, c), u === yo)
        f = !0, d && (h = h || // Foldable line = too long, and not more-indented.
        c - m - 1 > r && e[m + 1] !== " ", m = c);
      else if (!Eo(u))
        return ni;
      p = p && Oh(u, l, a), l = u;
    }
    h = h || d && c - m - 1 > r && e[m + 1] !== " ";
  }
  return !f && !h ? p && !s && !i(e) ? zy : o === vo ? ni : vl : n > 9 && qy(e) ? ni : s ? o === vo ? ni : vl : h ? Gy : Vy;
}
function gF(e, t, n, r, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === vo ? '""' : "''";
    if (!e.noCompatMode && (sF.indexOf(t) !== -1 || aF.test(t)))
      return e.quotingType === vo ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, n), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), a = r || e.flowLevel > -1 && n >= e.flowLevel;
    function c(u) {
      return dF(e, u);
    }
    switch (mF(
      t,
      a,
      e.indent,
      s,
      c,
      e.quotingType,
      e.forceQuotes && !r,
      i
    )) {
      case zy:
        return t;
      case vl:
        return "'" + t.replace(/'/g, "''") + "'";
      case Vy:
        return "|" + Rh(t, e.indent) + Dh(Ih(t, o));
      case Gy:
        return ">" + Rh(t, e.indent) + Dh(Ih(yF(t, s), o));
      case ni:
        return '"' + vF(t) + '"';
      default:
        throw new Uo("impossible error: invalid scalar style");
    }
  }();
}
function Rh(e, t) {
  var n = qy(e) ? String(t) : "", r = e[e.length - 1] === `
`, i = r && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : r ? "" : "-";
  return n + o + `
`;
}
function Dh(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function yF(e, t) {
  for (var n = /(\n+)([^\n]*)/g, r = function() {
    var u = e.indexOf(`
`);
    return u = u !== -1 ? u : e.length, n.lastIndex = u, Fh(e.slice(0, u), t);
  }(), i = e[0] === `
` || e[0] === " ", o, s; s = n.exec(e); ) {
    var a = s[1], c = s[2];
    o = c[0] === " ", r += a + (!i && !o && c !== "" ? `
` : "") + Fh(c, t), i = o;
  }
  return r;
}
function Fh(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var n = / [^ ]/g, r, i = 0, o, s = 0, a = 0, c = ""; r = n.exec(e); )
    a = r.index, a - i > t && (o = s > i ? s : a, c += `
` + e.slice(i, o), i = o + 1), s = a;
  return c += `
`, e.length - i > t && s > i ? c += e.slice(i, s) + `
` + e.slice(s + 1) : c += e.slice(i), c.slice(1);
}
function vF(e) {
  for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++)
    n = Zi(e, i), r = $t[n], !r && Eo(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || lF(n);
  return t;
}
function EF(e, t, n) {
  var r = "", i = e.tag, o, s, a;
  for (o = 0, s = n.length; o < s; o += 1)
    a = n[o], e.replacer && (a = e.replacer.call(n, String(o), a)), (In(e, t, a, !1, !1) || typeof a > "u" && In(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
  e.tag = i, e.dump = "[" + r + "]";
}
function Lh(e, t, n, r) {
  var i = "", o = e.tag, s, a, c;
  for (s = 0, a = n.length; s < a; s += 1)
    c = n[s], e.replacer && (c = e.replacer.call(n, String(s), c)), (In(e, t + 1, c, !0, !0, !1, !0) || typeof c > "u" && In(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += yl(e, t)), e.dump && yo === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function _F(e, t, n) {
  var r = "", i = e.tag, o = Object.keys(n), s, a, c, u, l;
  for (s = 0, a = o.length; s < a; s += 1)
    l = "", r !== "" && (l += ", "), e.condenseFlow && (l += '"'), c = o[s], u = n[c], e.replacer && (u = e.replacer.call(n, c, u)), In(e, t, c, !1, !1) && (e.dump.length > 1024 && (l += "? "), l += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), In(e, t, u, !1, !1) && (l += e.dump, r += l));
  e.tag = i, e.dump = "{" + r + "}";
}
function wF(e, t, n, r) {
  var i = "", o = e.tag, s = Object.keys(n), a, c, u, l, f, h;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new Uo("sortKeys must be a boolean or a function");
  for (a = 0, c = s.length; a < c; a += 1)
    h = "", (!r || i !== "") && (h += yl(e, t)), u = s[a], l = n[u], e.replacer && (l = e.replacer.call(n, u, l)), In(e, t + 1, u, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && yo === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, f && (h += yl(e, t)), In(e, t + 1, l, !0, f) && (e.dump && yo === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = o, e.dump = i || "{}";
}
function xh(e, t, n) {
  var r, i, o, s, a, c;
  for (i = n ? e.explicitTypes : e.implicitTypes, o = 0, s = i.length; o < s; o += 1)
    if (a = i[o], (a.instanceOf || a.predicate) && (!a.instanceOf || typeof t == "object" && t instanceof a.instanceOf) && (!a.predicate || a.predicate(t))) {
      if (n ? a.multi && a.representName ? e.tag = a.representName(t) : e.tag = a.tag : e.tag = "?", a.represent) {
        if (c = e.styleMap[a.tag] || a.defaultStyle, xy.call(a.represent) === "[object Function]")
          r = a.represent(t, c);
        else if (ky.call(a.represent, c))
          r = a.represent[c](t, c);
        else
          throw new Uo("!<" + a.tag + '> tag resolver accepts not "' + c + '" style');
        e.dump = r;
      }
      return !0;
    }
  return !1;
}
function In(e, t, n, r, i, o, s) {
  e.tag = null, e.dump = n, xh(e, n, !1) || xh(e, n, !0);
  var a = xy.call(e.dump), c = r, u;
  r && (r = e.flowLevel < 0 || e.flowLevel > t);
  var l = a === "[object Object]" || a === "[object Array]", f, h;
  if (l && (f = e.duplicates.indexOf(n), h = f !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (l && h && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), a === "[object Object]")
      r && Object.keys(e.dump).length !== 0 ? (wF(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (_F(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (a === "[object Array]")
      r && e.dump.length !== 0 ? (e.noArrayIndent && !s && t > 0 ? Lh(e, t - 1, e.dump, i) : Lh(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (EF(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && gF(e, e.dump, t, o, c);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new Uo("unacceptable kind of an object to dump " + a);
    }
    e.tag !== null && e.tag !== "?" && (u = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? u = "!" + u : u.slice(0, 18) === "tag:yaml.org,2002:" ? u = "!!" + u.slice(18) : u = "!<" + u + ">", e.dump = u + " " + e.dump);
  }
  return !0;
}
function $F(e, t) {
  var n = [], r = [], i, o;
  for (El(e, n, r), i = 0, o = r.length; i < o; i += 1)
    t.duplicates.push(n[r[i]]);
  t.usedDuplicates = new Array(o);
}
function El(e, t, n) {
  var r, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      n.indexOf(i) === -1 && n.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        El(e[i], t, n);
    else
      for (r = Object.keys(e), i = 0, o = r.length; i < o; i += 1)
        El(e[r[i]], t, n);
}
function SF(e, t) {
  t = t || {};
  var n = new fF(t);
  n.noRefs || $F(e, n);
  var r = e;
  return n.replacer && (r = n.replacer.call({ "": r }, "", r)), In(n, 0, r, !0, !0) ? n.dump + `
` : "";
}
Ly.dump = SF;
var Wy = Ju, bF = Ly;
function tf(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
ut.Type = Dt;
ut.Schema = oy;
ut.FAILSAFE_SCHEMA = ly;
ut.JSON_SCHEMA = my;
ut.CORE_SCHEMA = gy;
ut.DEFAULT_SCHEMA = Xu;
ut.load = Wy.load;
ut.loadAll = Wy.loadAll;
ut.dump = bF.dump;
ut.YAMLException = ko;
ut.types = {
  binary: wy,
  float: py,
  map: cy,
  null: uy,
  pairs: Sy,
  set: by,
  timestamp: Ey,
  bool: fy,
  int: dy,
  merge: _y,
  omap: $y,
  seq: ay,
  str: sy
};
ut.safeLoad = tf("safeLoad", "load");
ut.safeLoadAll = tf("safeLoadAll", "loadAll");
ut.safeDump = tf("safeDump", "dump");
var La = {};
Object.defineProperty(La, "__esModule", { value: !0 });
La.Lazy = void 0;
class AF {
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
La.Lazy = AF;
var jo = {}, ta = { exports: {} };
ta.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 1, o = 2, s = 9007199254740991, a = "[object Arguments]", c = "[object Array]", u = "[object AsyncFunction]", l = "[object Boolean]", f = "[object Date]", h = "[object Error]", d = "[object Function]", m = "[object GeneratorFunction]", p = "[object Map]", v = "[object Number]", y = "[object Null]", g = "[object Object]", w = "[object Promise]", A = "[object Proxy]", C = "[object RegExp]", F = "[object Set]", q = "[object String]", K = "[object Symbol]", H = "[object Undefined]", S = "[object WeakMap]", j = "[object ArrayBuffer]", V = "[object DataView]", Z = "[object Float32Array]", D = "[object Float64Array]", L = "[object Int8Array]", G = "[object Int16Array]", z = "[object Int32Array]", Y = "[object Uint8Array]", J = "[object Uint8ClampedArray]", B = "[object Uint16Array]", N = "[object Uint32Array]", R = /[\\^$.*+?()[\]{}|]/g, O = /^\[object .+?Constructor\]$/, $ = /^(?:0|[1-9]\d*)$/, T = {};
  T[Z] = T[D] = T[L] = T[G] = T[z] = T[Y] = T[J] = T[B] = T[N] = !0, T[a] = T[c] = T[j] = T[l] = T[V] = T[f] = T[h] = T[d] = T[p] = T[v] = T[g] = T[C] = T[F] = T[q] = T[S] = !1;
  var M = typeof Ct == "object" && Ct && Ct.Object === Object && Ct, re = typeof self == "object" && self && self.Object === Object && self, te = M || re || Function("return this")(), ye = t && !t.nodeType && t, pe = ye && !0 && e && !e.nodeType && e, Re = pe && pe.exports === ye, _ = Re && M.process, E = function() {
    try {
      return _ && _.binding && _.binding("util");
    } catch {
    }
  }(), U = E && E.isTypedArray;
  function I(b, P) {
    for (var W = -1, ne = b == null ? 0 : b.length, De = 0, de = []; ++W < ne; ) {
      var Ve = b[W];
      P(Ve, W, b) && (de[De++] = Ve);
    }
    return de;
  }
  function me(b, P) {
    for (var W = -1, ne = P.length, De = b.length; ++W < ne; )
      b[De + W] = P[W];
    return b;
  }
  function be(b, P) {
    for (var W = -1, ne = b == null ? 0 : b.length; ++W < ne; )
      if (P(b[W], W, b))
        return !0;
    return !1;
  }
  function Te(b, P) {
    for (var W = -1, ne = Array(b); ++W < b; )
      ne[W] = P(W);
    return ne;
  }
  function ke(b) {
    return function(P) {
      return b(P);
    };
  }
  function Ue(b, P) {
    return b.has(P);
  }
  function et(b, P) {
    return b == null ? void 0 : b[P];
  }
  function Oe(b) {
    var P = -1, W = Array(b.size);
    return b.forEach(function(ne, De) {
      W[++P] = [De, ne];
    }), W;
  }
  function X(b, P) {
    return function(W) {
      return b(P(W));
    };
  }
  function ve(b) {
    var P = -1, W = Array(b.size);
    return b.forEach(function(ne) {
      W[++P] = ne;
    }), W;
  }
  var Ee = Array.prototype, we = Function.prototype, Ce = Object.prototype, ft = te["__core-js_shared__"], tt = we.toString, dt = Ce.hasOwnProperty, Di = function() {
    var b = /[^.]+$/.exec(ft && ft.keys && ft.keys.IE_PROTO || "");
    return b ? "Symbol(src)_1." + b : "";
  }(), lf = Ce.toString, a0 = RegExp(
    "^" + tt.call(dt).replace(R, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), uf = Re ? te.Buffer : void 0, qo = te.Symbol, ff = te.Uint8Array, df = Ce.propertyIsEnumerable, c0 = Ee.splice, sr = qo ? qo.toStringTag : void 0, hf = Object.getOwnPropertySymbols, l0 = uf ? uf.isBuffer : void 0, u0 = X(Object.keys, Object), Va = Hr(te, "DataView"), Fi = Hr(te, "Map"), Ga = Hr(te, "Promise"), Wa = Hr(te, "Set"), Ka = Hr(te, "WeakMap"), Li = Hr(Object, "create"), f0 = lr(Va), d0 = lr(Fi), h0 = lr(Ga), p0 = lr(Wa), m0 = lr(Ka), pf = qo ? qo.prototype : void 0, Ja = pf ? pf.valueOf : void 0;
  function ar(b) {
    var P = -1, W = b == null ? 0 : b.length;
    for (this.clear(); ++P < W; ) {
      var ne = b[P];
      this.set(ne[0], ne[1]);
    }
  }
  function g0() {
    this.__data__ = Li ? Li(null) : {}, this.size = 0;
  }
  function y0(b) {
    var P = this.has(b) && delete this.__data__[b];
    return this.size -= P ? 1 : 0, P;
  }
  function v0(b) {
    var P = this.__data__;
    if (Li) {
      var W = P[b];
      return W === r ? void 0 : W;
    }
    return dt.call(P, b) ? P[b] : void 0;
  }
  function E0(b) {
    var P = this.__data__;
    return Li ? P[b] !== void 0 : dt.call(P, b);
  }
  function _0(b, P) {
    var W = this.__data__;
    return this.size += this.has(b) ? 0 : 1, W[b] = Li && P === void 0 ? r : P, this;
  }
  ar.prototype.clear = g0, ar.prototype.delete = y0, ar.prototype.get = v0, ar.prototype.has = E0, ar.prototype.set = _0;
  function yn(b) {
    var P = -1, W = b == null ? 0 : b.length;
    for (this.clear(); ++P < W; ) {
      var ne = b[P];
      this.set(ne[0], ne[1]);
    }
  }
  function w0() {
    this.__data__ = [], this.size = 0;
  }
  function $0(b) {
    var P = this.__data__, W = Vo(P, b);
    if (W < 0)
      return !1;
    var ne = P.length - 1;
    return W == ne ? P.pop() : c0.call(P, W, 1), --this.size, !0;
  }
  function S0(b) {
    var P = this.__data__, W = Vo(P, b);
    return W < 0 ? void 0 : P[W][1];
  }
  function b0(b) {
    return Vo(this.__data__, b) > -1;
  }
  function A0(b, P) {
    var W = this.__data__, ne = Vo(W, b);
    return ne < 0 ? (++this.size, W.push([b, P])) : W[ne][1] = P, this;
  }
  yn.prototype.clear = w0, yn.prototype.delete = $0, yn.prototype.get = S0, yn.prototype.has = b0, yn.prototype.set = A0;
  function cr(b) {
    var P = -1, W = b == null ? 0 : b.length;
    for (this.clear(); ++P < W; ) {
      var ne = b[P];
      this.set(ne[0], ne[1]);
    }
  }
  function T0() {
    this.size = 0, this.__data__ = {
      hash: new ar(),
      map: new (Fi || yn)(),
      string: new ar()
    };
  }
  function C0(b) {
    var P = Go(this, b).delete(b);
    return this.size -= P ? 1 : 0, P;
  }
  function N0(b) {
    return Go(this, b).get(b);
  }
  function I0(b) {
    return Go(this, b).has(b);
  }
  function P0(b, P) {
    var W = Go(this, b), ne = W.size;
    return W.set(b, P), this.size += W.size == ne ? 0 : 1, this;
  }
  cr.prototype.clear = T0, cr.prototype.delete = C0, cr.prototype.get = N0, cr.prototype.has = I0, cr.prototype.set = P0;
  function zo(b) {
    var P = -1, W = b == null ? 0 : b.length;
    for (this.__data__ = new cr(); ++P < W; )
      this.add(b[P]);
  }
  function O0(b) {
    return this.__data__.set(b, r), this;
  }
  function R0(b) {
    return this.__data__.has(b);
  }
  zo.prototype.add = zo.prototype.push = O0, zo.prototype.has = R0;
  function Pn(b) {
    var P = this.__data__ = new yn(b);
    this.size = P.size;
  }
  function D0() {
    this.__data__ = new yn(), this.size = 0;
  }
  function F0(b) {
    var P = this.__data__, W = P.delete(b);
    return this.size = P.size, W;
  }
  function L0(b) {
    return this.__data__.get(b);
  }
  function x0(b) {
    return this.__data__.has(b);
  }
  function k0(b, P) {
    var W = this.__data__;
    if (W instanceof yn) {
      var ne = W.__data__;
      if (!Fi || ne.length < n - 1)
        return ne.push([b, P]), this.size = ++W.size, this;
      W = this.__data__ = new cr(ne);
    }
    return W.set(b, P), this.size = W.size, this;
  }
  Pn.prototype.clear = D0, Pn.prototype.delete = F0, Pn.prototype.get = L0, Pn.prototype.has = x0, Pn.prototype.set = k0;
  function U0(b, P) {
    var W = Wo(b), ne = !W && Q0(b), De = !W && !ne && Ya(b), de = !W && !ne && !De && Sf(b), Ve = W || ne || De || de, nt = Ve ? Te(b.length, String) : [], ot = nt.length;
    for (var je in b)
      dt.call(b, je) && !(Ve && // Safari 9 has enumerable `arguments.length` in strict mode.
      (je == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      De && (je == "offset" || je == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      de && (je == "buffer" || je == "byteLength" || je == "byteOffset") || // Skip index properties.
      K0(je, ot))) && nt.push(je);
    return nt;
  }
  function Vo(b, P) {
    for (var W = b.length; W--; )
      if (Ef(b[W][0], P))
        return W;
    return -1;
  }
  function j0(b, P, W) {
    var ne = P(b);
    return Wo(b) ? ne : me(ne, W(b));
  }
  function xi(b) {
    return b == null ? b === void 0 ? H : y : sr && sr in Object(b) ? G0(b) : Z0(b);
  }
  function mf(b) {
    return ki(b) && xi(b) == a;
  }
  function gf(b, P, W, ne, De) {
    return b === P ? !0 : b == null || P == null || !ki(b) && !ki(P) ? b !== b && P !== P : M0(b, P, W, ne, gf, De);
  }
  function M0(b, P, W, ne, De, de) {
    var Ve = Wo(b), nt = Wo(P), ot = Ve ? c : On(b), je = nt ? c : On(P);
    ot = ot == a ? g : ot, je = je == a ? g : je;
    var jt = ot == g, Jt = je == g, ht = ot == je;
    if (ht && Ya(b)) {
      if (!Ya(P))
        return !1;
      Ve = !0, jt = !1;
    }
    if (ht && !jt)
      return de || (de = new Pn()), Ve || Sf(b) ? yf(b, P, W, ne, De, de) : z0(b, P, ot, W, ne, De, de);
    if (!(W & i)) {
      var qt = jt && dt.call(b, "__wrapped__"), zt = Jt && dt.call(P, "__wrapped__");
      if (qt || zt) {
        var Rn = qt ? b.value() : b, vn = zt ? P.value() : P;
        return de || (de = new Pn()), De(Rn, vn, W, ne, de);
      }
    }
    return ht ? (de || (de = new Pn()), V0(b, P, W, ne, De, de)) : !1;
  }
  function B0(b) {
    if (!$f(b) || Y0(b))
      return !1;
    var P = _f(b) ? a0 : O;
    return P.test(lr(b));
  }
  function H0(b) {
    return ki(b) && wf(b.length) && !!T[xi(b)];
  }
  function q0(b) {
    if (!X0(b))
      return u0(b);
    var P = [];
    for (var W in Object(b))
      dt.call(b, W) && W != "constructor" && P.push(W);
    return P;
  }
  function yf(b, P, W, ne, De, de) {
    var Ve = W & i, nt = b.length, ot = P.length;
    if (nt != ot && !(Ve && ot > nt))
      return !1;
    var je = de.get(b);
    if (je && de.get(P))
      return je == P;
    var jt = -1, Jt = !0, ht = W & o ? new zo() : void 0;
    for (de.set(b, P), de.set(P, b); ++jt < nt; ) {
      var qt = b[jt], zt = P[jt];
      if (ne)
        var Rn = Ve ? ne(zt, qt, jt, P, b, de) : ne(qt, zt, jt, b, P, de);
      if (Rn !== void 0) {
        if (Rn)
          continue;
        Jt = !1;
        break;
      }
      if (ht) {
        if (!be(P, function(vn, ur) {
          if (!Ue(ht, ur) && (qt === vn || De(qt, vn, W, ne, de)))
            return ht.push(ur);
        })) {
          Jt = !1;
          break;
        }
      } else if (!(qt === zt || De(qt, zt, W, ne, de))) {
        Jt = !1;
        break;
      }
    }
    return de.delete(b), de.delete(P), Jt;
  }
  function z0(b, P, W, ne, De, de, Ve) {
    switch (W) {
      case V:
        if (b.byteLength != P.byteLength || b.byteOffset != P.byteOffset)
          return !1;
        b = b.buffer, P = P.buffer;
      case j:
        return !(b.byteLength != P.byteLength || !de(new ff(b), new ff(P)));
      case l:
      case f:
      case v:
        return Ef(+b, +P);
      case h:
        return b.name == P.name && b.message == P.message;
      case C:
      case q:
        return b == P + "";
      case p:
        var nt = Oe;
      case F:
        var ot = ne & i;
        if (nt || (nt = ve), b.size != P.size && !ot)
          return !1;
        var je = Ve.get(b);
        if (je)
          return je == P;
        ne |= o, Ve.set(b, P);
        var jt = yf(nt(b), nt(P), ne, De, de, Ve);
        return Ve.delete(b), jt;
      case K:
        if (Ja)
          return Ja.call(b) == Ja.call(P);
    }
    return !1;
  }
  function V0(b, P, W, ne, De, de) {
    var Ve = W & i, nt = vf(b), ot = nt.length, je = vf(P), jt = je.length;
    if (ot != jt && !Ve)
      return !1;
    for (var Jt = ot; Jt--; ) {
      var ht = nt[Jt];
      if (!(Ve ? ht in P : dt.call(P, ht)))
        return !1;
    }
    var qt = de.get(b);
    if (qt && de.get(P))
      return qt == P;
    var zt = !0;
    de.set(b, P), de.set(P, b);
    for (var Rn = Ve; ++Jt < ot; ) {
      ht = nt[Jt];
      var vn = b[ht], ur = P[ht];
      if (ne)
        var bf = Ve ? ne(ur, vn, ht, P, b, de) : ne(vn, ur, ht, b, P, de);
      if (!(bf === void 0 ? vn === ur || De(vn, ur, W, ne, de) : bf)) {
        zt = !1;
        break;
      }
      Rn || (Rn = ht == "constructor");
    }
    if (zt && !Rn) {
      var Ko = b.constructor, Jo = P.constructor;
      Ko != Jo && "constructor" in b && "constructor" in P && !(typeof Ko == "function" && Ko instanceof Ko && typeof Jo == "function" && Jo instanceof Jo) && (zt = !1);
    }
    return de.delete(b), de.delete(P), zt;
  }
  function vf(b) {
    return j0(b, nv, W0);
  }
  function Go(b, P) {
    var W = b.__data__;
    return J0(P) ? W[typeof P == "string" ? "string" : "hash"] : W.map;
  }
  function Hr(b, P) {
    var W = et(b, P);
    return B0(W) ? W : void 0;
  }
  function G0(b) {
    var P = dt.call(b, sr), W = b[sr];
    try {
      b[sr] = void 0;
      var ne = !0;
    } catch {
    }
    var De = lf.call(b);
    return ne && (P ? b[sr] = W : delete b[sr]), De;
  }
  var W0 = hf ? function(b) {
    return b == null ? [] : (b = Object(b), I(hf(b), function(P) {
      return df.call(b, P);
    }));
  } : rv, On = xi;
  (Va && On(new Va(new ArrayBuffer(1))) != V || Fi && On(new Fi()) != p || Ga && On(Ga.resolve()) != w || Wa && On(new Wa()) != F || Ka && On(new Ka()) != S) && (On = function(b) {
    var P = xi(b), W = P == g ? b.constructor : void 0, ne = W ? lr(W) : "";
    if (ne)
      switch (ne) {
        case f0:
          return V;
        case d0:
          return p;
        case h0:
          return w;
        case p0:
          return F;
        case m0:
          return S;
      }
    return P;
  });
  function K0(b, P) {
    return P = P ?? s, !!P && (typeof b == "number" || $.test(b)) && b > -1 && b % 1 == 0 && b < P;
  }
  function J0(b) {
    var P = typeof b;
    return P == "string" || P == "number" || P == "symbol" || P == "boolean" ? b !== "__proto__" : b === null;
  }
  function Y0(b) {
    return !!Di && Di in b;
  }
  function X0(b) {
    var P = b && b.constructor, W = typeof P == "function" && P.prototype || Ce;
    return b === W;
  }
  function Z0(b) {
    return lf.call(b);
  }
  function lr(b) {
    if (b != null) {
      try {
        return tt.call(b);
      } catch {
      }
      try {
        return b + "";
      } catch {
      }
    }
    return "";
  }
  function Ef(b, P) {
    return b === P || b !== b && P !== P;
  }
  var Q0 = mf(/* @__PURE__ */ function() {
    return arguments;
  }()) ? mf : function(b) {
    return ki(b) && dt.call(b, "callee") && !df.call(b, "callee");
  }, Wo = Array.isArray;
  function ev(b) {
    return b != null && wf(b.length) && !_f(b);
  }
  var Ya = l0 || iv;
  function tv(b, P) {
    return gf(b, P);
  }
  function _f(b) {
    if (!$f(b))
      return !1;
    var P = xi(b);
    return P == d || P == m || P == u || P == A;
  }
  function wf(b) {
    return typeof b == "number" && b > -1 && b % 1 == 0 && b <= s;
  }
  function $f(b) {
    var P = typeof b;
    return b != null && (P == "object" || P == "function");
  }
  function ki(b) {
    return b != null && typeof b == "object";
  }
  var Sf = U ? ke(U) : H0;
  function nv(b) {
    return ev(b) ? U0(b) : q0(b);
  }
  function rv() {
    return [];
  }
  function iv() {
    return !1;
  }
  e.exports = tv;
})(ta, ta.exports);
var TF = ta.exports;
Object.defineProperty(jo, "__esModule", { value: !0 });
jo.DownloadedUpdateHelper = void 0;
jo.createTempUpdateFile = OF;
const CF = wi, NF = x, kh = TF, yr = ir, ao = k;
class IF {
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
    return ao.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, n, r, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return kh(this.versionInfo, n) && kh(this.fileInfo.info, r.info) && await (0, yr.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(r, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, n, r, i, o, s) {
    this._file = t, this._packageFile = n, this.versionInfo = r, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, s && await (0, yr.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, yr.emptyDir)(this.cacheDirForPendingUpdate);
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
    if (!await (0, yr.pathExists)(r))
      return null;
    let o;
    try {
      o = await (0, yr.readJson)(r);
    } catch (u) {
      let l = "No cached update info available";
      return u.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), l += ` (error on read: ${u.message})`), n.info(l), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return n.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return n.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const a = ao.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, yr.pathExists)(a))
      return n.info("Cached update file doesn't exist"), null;
    const c = await PF(a);
    return t.info.sha512 !== c ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, a);
  }
  getUpdateInfoFile() {
    return ao.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
jo.DownloadedUpdateHelper = IF;
function PF(e, t = "sha512", n = "base64", r) {
  return new Promise((i, o) => {
    const s = (0, CF.createHash)(t);
    s.on("error", o).setEncoding(n), (0, NF.createReadStream)(e, {
      ...r,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      s.end(), i(s.read());
    }).pipe(s, { end: !1 });
  });
}
async function OF(e, t, n) {
  let r = 0, i = ao.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, yr.unlink)(i), i;
    } catch (s) {
      if (s.code === "ENOENT")
        return i;
      n.warn(`Error on remove temp update file: ${s}`), i = ao.join(t, `${r++}-${e}`);
    }
  return i;
}
var xa = {}, nf = {};
Object.defineProperty(nf, "__esModule", { value: !0 });
nf.getAppCacheDir = DF;
const Dc = k, RF = ia;
function DF() {
  const e = (0, RF.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Dc.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Dc.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Dc.join(e, ".cache"), t;
}
Object.defineProperty(xa, "__esModule", { value: !0 });
xa.ElectronAppAdapter = void 0;
const Uh = k, FF = nf;
class LF {
  constructor(t = Tn.app) {
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
    return this.isPackaged ? Uh.join(process.resourcesPath, "app-update.yml") : Uh.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, FF.getAppCacheDir)();
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
xa.ElectronAppAdapter = LF;
var Ky = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = n;
  const t = Qe;
  e.NET_SESSION_NAME = "electron-updater";
  function n() {
    return Tn.session.fromPartition(e.NET_SESSION_NAME, {
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
      const a = Tn.net.request({
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
})(Ky);
var Mo = {}, an = {};
Object.defineProperty(an, "__esModule", { value: !0 });
an.newBaseUrl = xF;
an.newUrlFromBase = kF;
an.getChannelFilename = UF;
const Jy = rr;
function xF(e) {
  const t = new Jy.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function kF(e, t, n = !1) {
  const r = new Jy.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? r.search = i : n && (r.search = `noCache=${Date.now().toString(32)}`), r;
}
function UF(e) {
  return `${e}.yml`;
}
var Ye = {}, jF = "[object Symbol]", Yy = /[\\^$.*+?()[\]{}|]/g, MF = RegExp(Yy.source), BF = typeof Ct == "object" && Ct && Ct.Object === Object && Ct, HF = typeof self == "object" && self && self.Object === Object && self, qF = BF || HF || Function("return this")(), zF = Object.prototype, VF = zF.toString, jh = qF.Symbol, Mh = jh ? jh.prototype : void 0, Bh = Mh ? Mh.toString : void 0;
function GF(e) {
  if (typeof e == "string")
    return e;
  if (KF(e))
    return Bh ? Bh.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function WF(e) {
  return !!e && typeof e == "object";
}
function KF(e) {
  return typeof e == "symbol" || WF(e) && VF.call(e) == jF;
}
function JF(e) {
  return e == null ? "" : GF(e);
}
function YF(e) {
  return e = JF(e), e && MF.test(e) ? e.replace(Yy, "\\$&") : e;
}
var Xy = YF;
Object.defineProperty(Ye, "__esModule", { value: !0 });
Ye.Provider = void 0;
Ye.findFile = tL;
Ye.parseUpdateInfo = nL;
Ye.getFileList = Zy;
Ye.resolveFiles = rL;
const tr = Qe, XF = ut, ZF = rr, na = an, QF = Xy;
class eL {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, n, r, i = null) {
    const o = (0, na.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, na.newUrlFromBase)(`${t.pathname.replace(new RegExp(QF(r), "g"), n)}.blockmap`, i ? new ZF.URL(i) : t), o];
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
    return this.requestHeaders == null ? n != null && (r.headers = n) : r.headers = n == null ? this.requestHeaders : { ...this.requestHeaders, ...n }, (0, tr.configureRequestUrl)(t, r), r;
  }
}
Ye.Provider = eL;
function tL(e, t, n) {
  var r;
  if (e.length === 0)
    throw (0, tr.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((s) => s.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), o = (r = i.find((s) => [s.url.pathname, s.info.url].some((a) => a.includes(process.arch)))) !== null && r !== void 0 ? r : i.shift();
  return o || (n == null ? e[0] : e.find((s) => !n.some((a) => s.url.pathname.toLowerCase().endsWith(`.${a.toLowerCase()}`))));
}
function nL(e, t, n) {
  if (e == null)
    throw (0, tr.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let r;
  try {
    r = (0, XF.load)(e);
  } catch (i) {
    throw (0, tr.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return r;
}
function Zy(e) {
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
  throw (0, tr.newError)(`No files provided: ${(0, tr.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function rL(e, t, n = (r) => r) {
  const i = Zy(e).map((a) => {
    if (a.sha2 == null && a.sha512 == null)
      throw (0, tr.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, tr.safeStringifyJson)(a)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, na.newUrlFromBase)(n(a.url), t),
      info: a
    };
  }), o = e.packages, s = o == null ? null : o[process.arch] || o.ia32;
  return s != null && (i[0].packageInfo = {
    ...s,
    path: (0, na.newUrlFromBase)(n(s.path), t).href
  }), i;
}
Object.defineProperty(Mo, "__esModule", { value: !0 });
Mo.GenericProvider = void 0;
const Hh = Qe, Fc = an, Lc = Ye;
class iL extends Lc.Provider {
  constructor(t, n, r) {
    super(r), this.configuration = t, this.updater = n, this.baseUrl = (0, Fc.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, Fc.getChannelFilename)(this.channel), n = (0, Fc.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let r = 0; ; r++)
      try {
        return (0, Lc.parseUpdateInfo)(await this.httpRequest(n), t, n);
      } catch (i) {
        if (i instanceof Hh.HttpError && i.statusCode === 404)
          throw (0, Hh.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
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
    return (0, Lc.resolveFiles)(t, this.baseUrl);
  }
}
Mo.GenericProvider = iL;
var ka = {}, Ua = {};
Object.defineProperty(Ua, "__esModule", { value: !0 });
Ua.BitbucketProvider = void 0;
const qh = Qe, xc = an, kc = Ye;
class oL extends kc.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, xc.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new qh.CancellationToken(), n = (0, xc.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, xc.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, void 0, t);
      return (0, kc.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, qh.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, kc.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: n } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${n}, channel: ${this.channel})`;
  }
}
Ua.BitbucketProvider = oL;
var nr = {};
Object.defineProperty(nr, "__esModule", { value: !0 });
nr.GitHubProvider = nr.BaseGitHubProvider = void 0;
nr.computeReleaseNotes = e0;
const Sn = Qe, Ar = Fu, sL = rr, li = an, _l = Ye, Uc = /\/tag\/([^/]+)$/;
class Qy extends _l.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, li.newBaseUrl)((0, Sn.githubUrl)(t, n));
    const i = n === "github.com" ? "api.github.com" : n;
    this.baseApiUrl = (0, li.newBaseUrl)((0, Sn.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const n = this.options.host;
    return n && !["github.com", "api.github.com"].includes(n) ? `/api/v3${t}` : t;
  }
}
nr.BaseGitHubProvider = Qy;
class aL extends Qy {
  constructor(t, n, r) {
    super(t, "github.com", r), this.options = t, this.updater = n;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, n, r, i, o;
    const s = new Sn.CancellationToken(), a = await this.httpRequest((0, li.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, s), c = (0, Sn.parseXml)(a);
    let u = c.element("entry", !1, "No published versions on GitHub"), l = null;
    try {
      if (this.updater.allowPrerelease) {
        const v = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((n = Ar.prerelease(this.updater.currentVersion)) === null || n === void 0 ? void 0 : n[0]) || null;
        if (v === null)
          l = Uc.exec(u.element("link").attribute("href"))[1];
        else
          for (const y of c.getElements("entry")) {
            const g = Uc.exec(y.element("link").attribute("href"));
            if (g === null)
              continue;
            const w = g[1], A = ((r = Ar.prerelease(w)) === null || r === void 0 ? void 0 : r[0]) || null, C = !v || ["alpha", "beta"].includes(v), F = A !== null && !["alpha", "beta"].includes(String(A));
            if (C && !F && !(v === "beta" && A === "alpha")) {
              l = w;
              break;
            }
            if (A && A === v) {
              l = w;
              break;
            }
          }
      } else {
        l = await this.getLatestTagName(s);
        for (const v of c.getElements("entry"))
          if (Uc.exec(v.element("link").attribute("href"))[1] === l) {
            u = v;
            break;
          }
      }
    } catch (v) {
      throw (0, Sn.newError)(`Cannot parse releases feed: ${v.stack || v.message},
XML:
${a}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (l == null)
      throw (0, Sn.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, h = "", d = "";
    const m = async (v) => {
      h = (0, li.getChannelFilename)(v), d = (0, li.newUrlFromBase)(this.getBaseDownloadPath(String(l), h), this.baseUrl);
      const y = this.createRequestOptions(d);
      try {
        return await this.executor.request(y, s);
      } catch (g) {
        throw g instanceof Sn.HttpError && g.statusCode === 404 ? (0, Sn.newError)(`Cannot find ${h} in the latest release artifacts (${d}): ${g.stack || g.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : g;
      }
    };
    try {
      let v = this.channel;
      this.updater.allowPrerelease && (!((i = Ar.prerelease(l)) === null || i === void 0) && i[0]) && (v = this.getCustomChannelName(String((o = Ar.prerelease(l)) === null || o === void 0 ? void 0 : o[0]))), f = await m(v);
    } catch (v) {
      if (this.updater.allowPrerelease)
        f = await m(this.getDefaultChannelName());
      else
        throw v;
    }
    const p = (0, _l.parseUpdateInfo)(f, h, d);
    return p.releaseName == null && (p.releaseName = u.elementValueOrEmpty("title")), p.releaseNotes == null && (p.releaseNotes = e0(this.updater.currentVersion, this.updater.fullChangelog, c, u)), {
      tag: l,
      ...p
    };
  }
  async getLatestTagName(t) {
    const n = this.options, r = n.host == null || n.host === "github.com" ? (0, li.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new sL.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(r, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, Sn.newError)(`Unable to find latest version on GitHub (${r}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, _l.resolveFiles)(t, this.baseUrl, (n) => this.getBaseDownloadPath(t.tag, n.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, n) {
    return `${this.basePath}/download/${t}/${n}`;
  }
}
nr.GitHubProvider = aL;
function zh(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function e0(e, t, n, r) {
  if (!t)
    return zh(r);
  const i = [];
  for (const o of n.getElements("entry")) {
    const s = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    Ar.valid(s) && Ar.lt(e, s) && i.push({
      version: s,
      note: zh(o)
    });
  }
  return i.sort((o, s) => Ar.rcompare(o.version, s.version));
}
var ja = {};
Object.defineProperty(ja, "__esModule", { value: !0 });
ja.GitLabProvider = void 0;
const St = Qe, jc = rr, cL = Xy, _s = an, Mc = Ye;
class lL extends Mc.Provider {
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
    this.baseApiUrl = (0, _s.newBaseUrl)(`https://${o}/api/v4`);
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = new St.CancellationToken(), n = (0, _s.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
    let r;
    try {
      const h = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, d = await this.httpRequest(n, h, t);
      if (!d)
        throw (0, St.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      r = JSON.parse(d);
    } catch (h) {
      throw (0, St.newError)(`Unable to find latest release on GitLab (${n}): ${h.stack || h.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    const i = r.tag_name;
    let o = null, s = "", a = null;
    const c = async (h) => {
      s = (0, _s.getChannelFilename)(h);
      const d = r.assets.links.find((p) => p.name === s);
      if (!d)
        throw (0, St.newError)(`Cannot find ${s} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      a = new jc.URL(d.direct_asset_url);
      const m = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
      try {
        const p = await this.httpRequest(a, m, t);
        if (!p)
          throw (0, St.newError)(`Empty response from ${a}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return p;
      } catch (p) {
        throw p instanceof St.HttpError && p.statusCode === 404 ? (0, St.newError)(`Cannot find ${s} in the latest release artifacts (${a}): ${p.stack || p.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : p;
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
      throw (0, St.newError)(`Unable to parse channel data from ${s}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const u = (0, Mc.parseUpdateInfo)(o, s, a);
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
        return new jc.URL(o);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const n = new St.CancellationToken(), r = [`v${t}`, t];
    for (const i of r) {
      const o = (0, _s.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const s = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, a = await this.httpRequest(o, s, n);
        if (a)
          return JSON.parse(a);
      } catch (s) {
        if (s instanceof St.HttpError && s.statusCode === 404)
          continue;
        throw (0, St.newError)(`Unable to find release ${i} on GitLab (${o}): ${s.stack || s.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, St.newError)(`Unable to find release with version ${t} (tried: ${r.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
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
      const c = r.replace(new RegExp(cL(n), "g"), t);
      o = this.findBlockMapInAssets(a, c);
    }
    return [o, i];
  }
  async getBlockMapFiles(t, n, r, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const o = t.pathname.split("/").pop() || "", [s, a] = await this.findBlockMapUrlsFromAssets(n, r, o);
      if (!a)
        throw (0, St.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!s)
        throw (0, St.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [s, a];
    } else
      return super.getBlockMapFiles(t, n, r, i);
  }
  resolveFiles(t) {
    return (0, Mc.getFileList)(t).map((n) => {
      const i = [
        n.url,
        // Original filename
        this.normalizeFilename(n.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((s) => t.assets.has(s)), o = i ? t.assets.get(i) : void 0;
      if (!o)
        throw (0, St.newError)(`Cannot find asset "${n.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new jc.URL(o),
        info: n
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
ja.GitLabProvider = lL;
var Ma = {};
Object.defineProperty(Ma, "__esModule", { value: !0 });
Ma.KeygenProvider = void 0;
const Vh = Qe, Bc = an, Hc = Ye;
class uL extends Hc.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, Bc.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Vh.CancellationToken(), n = (0, Bc.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, Bc.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, Hc.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, Vh.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, Hc.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: n, platform: r } = this.configuration;
    return `Keygen (account: ${t}, product: ${n}, platform: ${r}, channel: ${this.channel})`;
  }
}
Ma.KeygenProvider = uL;
var Ba = {};
Object.defineProperty(Ba, "__esModule", { value: !0 });
Ba.PrivateGitHubProvider = void 0;
const Jr = Qe, fL = ut, dL = k, Gh = rr, Wh = an, hL = nr, pL = Ye;
class mL extends hL.BaseGitHubProvider {
  constructor(t, n, r, i) {
    super(t, "api.github.com", i), this.updater = n, this.token = r;
  }
  createRequestOptions(t, n) {
    const r = super.createRequestOptions(t, n);
    return r.redirect = "manual", r;
  }
  async getLatestVersion() {
    const t = new Jr.CancellationToken(), n = (0, Wh.getChannelFilename)(this.getDefaultChannelName()), r = await this.getLatestVersionInfo(t), i = r.assets.find((a) => a.name === n);
    if (i == null)
      throw (0, Jr.newError)(`Cannot find ${n} in the release ${r.html_url || r.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new Gh.URL(i.url);
    let s;
    try {
      s = (0, fL.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (a) {
      throw a instanceof Jr.HttpError && a.statusCode === 404 ? (0, Jr.newError)(`Cannot find ${n} in the latest release artifacts (${o}): ${a.stack || a.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : a;
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
    const i = (0, Wh.newUrlFromBase)(r, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return n ? o.find((s) => s.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, Jr.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, pL.getFileList)(t).map((n) => {
      const r = dL.posix.basename(n.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === r);
      if (i == null)
        throw (0, Jr.newError)(`Cannot find asset "${r}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Gh.URL(i.url),
        info: n
      };
    });
  }
}
Ba.PrivateGitHubProvider = mL;
Object.defineProperty(ka, "__esModule", { value: !0 });
ka.isUrlProbablySupportMultiRangeRequests = t0;
ka.createClient = wL;
const ws = Qe, gL = Ua, Kh = Mo, yL = nr, vL = ja, EL = Ma, _L = Ba;
function t0(e) {
  return !e.includes("s3.amazonaws.com");
}
function wL(e, t, n) {
  if (typeof e == "string")
    throw (0, ws.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const r = e.provider;
  switch (r) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new yL.GitHubProvider(i, t, n) : new _L.PrivateGitHubProvider(i, t, o, n);
    }
    case "bitbucket":
      return new gL.BitbucketProvider(e, t, n);
    case "gitlab":
      return new vL.GitLabProvider(e, t, n);
    case "keygen":
      return new EL.KeygenProvider(e, t, n);
    case "s3":
    case "spaces":
      return new Kh.GenericProvider({
        provider: "generic",
        url: (0, ws.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...n,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new Kh.GenericProvider(i, t, {
        ...n,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && t0(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, ws.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, n);
    }
    default:
      throw (0, ws.newError)(`Unsupported provider: ${r}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Ha = {}, Bo = {}, Oi = {}, Br = {};
Object.defineProperty(Br, "__esModule", { value: !0 });
Br.OperationKind = void 0;
Br.computeOperations = $L;
var Tr;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Tr || (Br.OperationKind = Tr = {}));
function $L(e, t, n) {
  const r = Yh(e.files), i = Yh(t.files);
  let o = null;
  const s = t.files[0], a = [], c = s.name, u = r.get(c);
  if (u == null)
    throw new Error(`no file ${c} in old blockmap`);
  const l = i.get(c);
  let f = 0;
  const { checksumToOffset: h, checksumToOldSize: d } = bL(r.get(c), u.offset, n);
  let m = s.offset;
  for (let p = 0; p < l.checksums.length; m += l.sizes[p], p++) {
    const v = l.sizes[p], y = l.checksums[p];
    let g = h.get(y);
    g != null && d.get(y) !== v && (n.warn(`Checksum ("${y}") matches, but size differs (old: ${d.get(y)}, new: ${v})`), g = void 0), g === void 0 ? (f++, o != null && o.kind === Tr.DOWNLOAD && o.end === m ? o.end += v : (o = {
      kind: Tr.DOWNLOAD,
      start: m,
      end: m + v
      // oldBlocks: null,
    }, Jh(o, a, y, p))) : o != null && o.kind === Tr.COPY && o.end === g ? o.end += v : (o = {
      kind: Tr.COPY,
      start: g,
      end: g + v
      // oldBlocks: [checksum]
    }, Jh(o, a, y, p));
  }
  return f > 0 && n.info(`File${s.name === "file" ? "" : " " + s.name} has ${f} changed blocks`), a;
}
const SL = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Jh(e, t, n, r) {
  if (SL && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((s, a) => s < a ? s : a);
      throw new Error(`operation (block index: ${r}, checksum: ${n}, kind: ${Tr[e.kind]}) overlaps previous operation (checksum: ${n}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function bL(e, t, n) {
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
function Yh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    t.set(n.name, n);
  return t;
}
Object.defineProperty(Oi, "__esModule", { value: !0 });
Oi.DataSplitter = void 0;
Oi.copyData = n0;
const $s = Qe, AL = x, TL = Co, CL = Br, Xh = Buffer.from(`\r
\r
`);
var Hn;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(Hn || (Hn = {}));
function n0(e, t, n, r, i) {
  const o = (0, AL.createReadStream)("", {
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
class NL extends TL.Writable {
  constructor(t, n, r, i, o, s, a, c) {
    super(), this.out = t, this.options = n, this.partIndexToTaskIndex = r, this.partIndexToLength = o, this.finishHandler = s, this.grandTotalBytes = a, this.onProgress = c, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = Hn.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
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
      throw (0, $s.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const r = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= r, n = r;
    } else if (this.remainingPartDataCount > 0) {
      const r = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= r, await this.processPartData(t, 0, r), n = r;
    }
    if (n !== t.length) {
      if (this.readState === Hn.HEADER) {
        const r = this.searchHeaderListEnd(t, n);
        if (r === -1)
          return;
        n = r, this.readState = Hn.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === Hn.BODY)
          this.readState = Hn.INIT;
        else {
          this.partIndex++;
          let s = this.partIndexToTaskIndex.get(this.partIndex);
          if (s == null)
            if (this.isFinished)
              s = this.options.end;
            else
              throw (0, $s.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const a = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (a < s)
            await this.copyExistingData(a, s);
          else if (a > s)
            throw (0, $s.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (n = this.searchHeaderListEnd(t, n), n === -1) {
            this.readState = Hn.HEADER;
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
        if (s.kind !== CL.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        n0(s, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, n) {
    const r = t.indexOf(Xh, n);
    if (r !== -1)
      return r + Xh.length;
    const i = n === 0 ? t : t.slice(n);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, $s.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
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
Oi.DataSplitter = NL;
var qa = {};
Object.defineProperty(qa, "__esModule", { value: !0 });
qa.executeTasksUsingMultipleRangeRequests = IL;
qa.checkIsRangesSupported = $l;
const wl = Qe, Zh = Oi, Qh = Br;
function IL(e, t, n, r, i) {
  const o = (s) => {
    if (s >= t.length) {
      e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
      return;
    }
    const a = s + 1e3;
    PL(e, {
      tasks: t,
      start: s,
      end: Math.min(t.length, a),
      oldFileFd: r
    }, n, () => o(a), i);
  };
  return o;
}
function PL(e, t, n, r, i) {
  let o = "bytes=", s = 0, a = 0;
  const c = /* @__PURE__ */ new Map(), u = [];
  for (let h = t.start; h < t.end; h++) {
    const d = t.tasks[h];
    d.kind === Qh.OperationKind.DOWNLOAD && (o += `${d.start}-${d.end - 1}, `, c.set(s, h), s++, u.push(d.end - d.start), a += d.end - d.start);
  }
  if (s <= 1) {
    const h = (d) => {
      if (d >= t.end) {
        r();
        return;
      }
      const m = t.tasks[d++];
      if (m.kind === Qh.OperationKind.COPY)
        (0, Zh.copyData)(m, n, t.oldFileFd, i, () => h(d));
      else {
        const p = e.createRequestOptions();
        p.headers.Range = `bytes=${m.start}-${m.end - 1}`;
        const v = e.httpExecutor.createRequest(p, (y) => {
          y.on("error", i), $l(y, i) && (y.pipe(n, {
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
    if (!$l(h, i))
      return;
    const d = (0, wl.safeGetHeader)(h, "content-type"), m = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(d);
    if (m == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${d}"`));
      return;
    }
    const p = new Zh.DataSplitter(n, t, c, m[1] || m[2], u, r, a, e.options.onProgress);
    p.on("error", i), h.pipe(p), h.on("end", () => {
      setTimeout(() => {
        f.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(f, i), f.end();
}
function $l(e, t) {
  if (e.statusCode >= 400)
    return t((0, wl.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const n = (0, wl.safeGetHeader)(e, "accept-ranges");
    if (n == null || n === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var za = {};
Object.defineProperty(za, "__esModule", { value: !0 });
za.ProgressDifferentialDownloadCallbackTransform = void 0;
const OL = Co;
var ui;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(ui || (ui = {}));
class RL extends OL.Transform {
  constructor(t, n, r) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = ui.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == ui.COPY) {
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
    this.operationType = ui.COPY;
  }
  beginRangeDownload() {
    this.operationType = ui.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
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
za.ProgressDifferentialDownloadCallbackTransform = RL;
Object.defineProperty(Bo, "__esModule", { value: !0 });
Bo.DifferentialDownloader = void 0;
const Gi = Qe, qc = ir, DL = x, FL = Oi, LL = rr, Ss = Br, ep = qa, xL = za;
class kL {
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
    return (0, Gi.configureRequestUrl)(this.options.newUrl, t), (0, Gi.configureRequestOptions)(t), t;
  }
  doDownload(t, n) {
    if (t.version !== n.version)
      throw new Error(`version is different (${t.version} - ${n.version}), full download is required`);
    const r = this.logger, i = (0, Ss.computeOperations)(t, n, r);
    r.debug != null && r.debug(JSON.stringify(i, null, 2));
    let o = 0, s = 0;
    for (const c of i) {
      const u = c.end - c.start;
      c.kind === Ss.OperationKind.DOWNLOAD ? o += u : s += u;
    }
    const a = this.blockAwareFileInfo.size;
    if (o + s + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== a)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${s}, newSize: ${a}`);
    return r.info(`Full: ${tp(a)}, To download: ${tp(o)} (${Math.round(o / (a / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const n = [], r = () => Promise.all(n.map((i) => (0, qc.close)(i.descriptor).catch((o) => {
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
    const r = await (0, qc.open)(this.options.oldFile, "r");
    n.push({ descriptor: r, path: this.options.oldFile });
    const i = await (0, qc.open)(this.options.newFile, "w");
    n.push({ descriptor: i, path: this.options.newFile });
    const o = (0, DL.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((s, a) => {
      const c = [];
      let u;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const y = [];
        let g = 0;
        for (const A of t)
          A.kind === Ss.OperationKind.DOWNLOAD && (y.push(A.end - A.start), g += A.end - A.start);
        const w = {
          expectedByteCounts: y,
          grandTotal: g
        };
        u = new xL.ProgressDifferentialDownloadCallbackTransform(w, this.options.cancellationToken, this.options.onProgress), c.push(u);
      }
      const l = new Gi.DigestTransform(this.blockAwareFileInfo.sha512);
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
        d = (0, ep.executeTasksUsingMultipleRangeRequests)(this, t, h, r, a), d(0);
        return;
      }
      let m = 0, p = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const v = this.createRequestOptions();
      v.redirect = "manual", d = (y) => {
        var g, w;
        if (y >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const A = t[y++];
        if (A.kind === Ss.OperationKind.COPY) {
          u && u.beginFileCopy(), (0, FL.copyData)(A, h, r, a, () => d(y));
          return;
        }
        const C = `bytes=${A.start}-${A.end - 1}`;
        v.headers.range = C, (w = (g = this.logger) === null || g === void 0 ? void 0 : g.debug) === null || w === void 0 || w.call(g, `download range: ${C}`), u && u.beginRangeDownload();
        const F = this.httpExecutor.createRequest(v, (q) => {
          q.on("error", a), q.on("aborted", () => {
            a(new Error("response has been aborted by the server"));
          }), q.statusCode >= 400 && a((0, Gi.createHttpError)(q)), q.pipe(h, {
            end: !1
          }), q.once("end", () => {
            u && u.endRangeDownload(), ++m === 100 ? (m = 0, setTimeout(() => d(y), 1e3)) : d(y);
          });
        });
        F.on("redirect", (q, K, H) => {
          this.logger.info(`Redirect to ${UL(H)}`), p = H, (0, Gi.configureRequestUrl)(new LL.URL(p), v), F.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(F, a), F.end();
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
        (0, ep.checkIsRangesSupported)(s, i) && (s.on("error", i), s.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), s.on("data", n), s.on("end", () => r()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
Bo.DifferentialDownloader = kL;
function tp(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function UL(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Ha, "__esModule", { value: !0 });
Ha.GenericDifferentialDownloader = void 0;
const jL = Bo;
class ML extends jL.DifferentialDownloader {
  download(t, n) {
    return this.doDownload(t, n);
  }
}
Ha.GenericDifferentialDownloader = ML;
var or = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.UpdaterSignal = e.UPDATE_DOWNLOADED = e.DOWNLOAD_PROGRESS = e.CancellationToken = void 0, e.addHandler = r;
  const t = Qe;
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
})(or);
Object.defineProperty(Zn, "__esModule", { value: !0 });
Zn.NoOpLogger = Zn.AppUpdater = void 0;
const bt = Qe, BL = wi, HL = ia, qL = Ap, Zt = ir, zL = ut, zc = La, Qt = k, vr = Fu, np = jo, VL = xa, rp = Ky, GL = Mo, Vc = ka, Gc = To, WL = Ha, Yr = or;
class rf extends qL.EventEmitter {
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
        throw (0, bt.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, bt.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
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
    return (0, rp.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new r0();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new zc.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new Yr.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this._isUserWithinRollout = (o) => this.isStagingMatch(o), this.clientPromise = null, this.stagingUserIdPromise = new zc.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new zc.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), n == null ? (this.app = new VL.ElectronAppAdapter(), this.httpExecutor = new rp.ElectronHttpExecutor((o, s) => this.emit("login", o, s))) : (this.app = n, this.httpExecutor = null);
    const r = this.app.version, i = (0, vr.parse)(r);
    if (i == null)
      throw (0, bt.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = KL(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? r = new GL.GenericProvider({ provider: "generic", url: t }, this, {
      ...n,
      isUseMultipleRangeRequest: (0, Vc.isUrlProbablySupportMultiRangeRequests)(t)
    }) : r = (0, Vc.createClient)(t, this, n), this.clientPromise = Promise.resolve(r);
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
      const r = rf.formatDownloadNotification(n.updateInfo.version, this.app.name, t);
      new Tn.Notification(r).show();
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
    const i = await this.stagingUserIdPromise.value, s = bt.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${r}, percentage: ${s}, user id: ${i}`), s < r;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const n = (0, vr.parse)(t.version);
    if (n == null)
      throw (0, bt.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const r = this.currentVersion;
    if ((0, vr.eq)(n, r) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const o = (0, vr.gt)(n, r), s = (0, vr.lt)(n, r);
    return o ? !0 : this.allowDowngrade && s;
  }
  checkIfUpdateSupported(t) {
    const n = t == null ? void 0 : t.minimumSystemVersion, r = (0, HL.release)();
    if (n)
      try {
        if ((0, vr.lt)(r, n))
          return this._logger.info(`Current OS version ${r} is less than the minimum OS version required ${n} for version ${r}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${r}) with minimum OS version(${n}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((r) => (0, Vc.createClient)(r, this, this.createProviderRuntimeOptions())));
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
    const r = new bt.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: n,
      updateInfo: n,
      cancellationToken: r,
      downloadPromise: this.autoDownload ? this.downloadUpdate(r) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, bt.asArray)(t.files).map((n) => n.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new bt.CancellationToken()) {
    const n = this.updateInfoAndProvider;
    if (n == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, bt.asArray)(n.info.files).map((i) => i.url).join(", ")}`);
    const r = (i) => {
      if (!(i instanceof bt.CancellationError))
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
    this.emit(Yr.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, zL.load)(await (0, Zt.readFile)(this._appUpdateConfigPath, "utf-8"));
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
    const t = Qt.join(this.app.userDataPath, ".updaterId");
    try {
      const r = await (0, Zt.readFile)(t, "utf-8");
      if (bt.UUID.check(r))
        return r;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${r}`);
    } catch (r) {
      r.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${r}`);
    }
    const n = bt.UUID.v5((0, BL.randomBytes)(4096), bt.UUID.OID);
    this._logger.info(`Generated new staging user ID: ${n}`);
    try {
      await (0, Zt.outputFile)(t, n);
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
      const i = Qt.join(this.app.baseCachePath, n || this.app.name);
      r.debug != null && r.debug(`updater cache dir: ${i}`), t = new np.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
    this.listenerCount(Yr.DOWNLOAD_PROGRESS) > 0 && (r.onProgress = (g) => this.emit(Yr.DOWNLOAD_PROGRESS, g));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, s = n.packageInfo;
    function a() {
      const g = decodeURIComponent(t.fileInfo.url.pathname);
      return g.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? Qt.basename(g) : t.fileInfo.info.url;
    }
    const c = await this.getOrCreateDownloadHelper(), u = c.cacheDirForPendingUpdate;
    await (0, Zt.mkdir)(u, { recursive: !0 });
    const l = a();
    let f = Qt.join(u, l);
    const h = s == null ? null : Qt.join(u, `package-${o}${Qt.extname(s.path) || ".7z"}`), d = async (g) => {
      await c.setDownloadedFile(f, h, i, n, l, g), await t.done({
        ...i,
        downloadedFile: f
      });
      const w = Qt.join(u, "current.blockmap");
      return await (0, Zt.pathExists)(w) && await (0, Zt.copyFile)(w, Qt.join(c.cacheDir, "current.blockmap")), h == null ? [f] : [f, h];
    }, m = this._logger, p = await c.validateDownloadedPath(f, i, n, m);
    if (p != null)
      return f = p, await d(!1);
    const v = async () => (await c.clear().catch(() => {
    }), await (0, Zt.unlink)(f).catch(() => {
    })), y = await (0, np.createTempUpdateFile)(`temp-${l}`, u, m);
    try {
      await t.task(y, r, h, v), await (0, bt.retry)(() => (0, Zt.rename)(y, f), {
        retries: 60,
        interval: 500,
        shouldRetry: (g) => g instanceof Error && /^EBUSY:/.test(g.message) ? !0 : (m.warn(`Cannot rename temp file to final file: ${g.message || g.stack}`), !1)
      });
    } catch (g) {
      throw await v(), g instanceof bt.CancellationError && (m.info("cancelled"), this.emit("update-cancelled", i)), g;
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
          return JSON.parse((0, Gc.gunzipSync)(p).toString());
        } catch (v) {
          throw new Error(`Cannot parse blockmap "${m.href}", error: ${v}`);
        }
      }, u = {
        newUrl: t.url,
        oldFile: Qt.join(this.downloadedUpdateHelper.cacheDir, o),
        logger: this._logger,
        newFile: r,
        isUseMultipleRangeRequest: s.isUseMultipleRangeRequest,
        requestHeaders: n.requestHeaders,
        cancellationToken: n.cancellationToken
      };
      this.listenerCount(Yr.DOWNLOAD_PROGRESS) > 0 && (u.onProgress = (m) => this.emit(Yr.DOWNLOAD_PROGRESS, m));
      const l = async (m, p) => {
        const v = Qt.join(p, "current.blockmap");
        await (0, Zt.outputFile)(v, (0, Gc.gzipSync)(JSON.stringify(m)));
      }, f = async (m) => {
        const p = Qt.join(m, "current.blockmap");
        try {
          if (await (0, Zt.pathExists)(p))
            return JSON.parse((0, Gc.gunzipSync)(await (0, Zt.readFile)(p)).toString());
        } catch (v) {
          this._logger.warn(`Cannot parse blockmap "${p}", error: ${v}`);
        }
        return null;
      }, h = await c(a[1]);
      await l(h, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let d = await f(this.downloadedUpdateHelper.cacheDir);
      return d == null && (d = await c(a[0])), await new WL.GenericDifferentialDownloader(t.info, this.httpExecutor, u).download(d, h), !1;
    } catch (s) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), this._testOnlyOptions != null)
        throw s;
      return !0;
    }
  }
}
Zn.AppUpdater = rf;
function KL(e) {
  const t = (0, vr.prerelease)(e);
  return t != null && t.length > 0;
}
class r0 {
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
Zn.NoOpLogger = r0;
Object.defineProperty(Mr, "__esModule", { value: !0 });
Mr.BaseUpdater = void 0;
const ip = ra, JL = Zn;
class YL extends JL.AppUpdater {
  constructor(t, n) {
    super(t, n), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, n = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? n : this.autoRunAppAfterInstall) ? setImmediate(() => {
      Tn.autoUpdater.emit("before-quit-for-update"), this.app.quit();
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
    const i = (0, ip.spawnSync)(t, n, {
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
        const a = { stdio: i, env: r, detached: !0 }, c = (0, ip.spawn)(t, n, a);
        c.on("error", (u) => {
          s(u);
        }), c.unref(), c.pid !== void 0 && o(!0);
      } catch (a) {
        s(a);
      }
    });
  }
}
Mr.BaseUpdater = YL;
var _o = {}, Ho = {};
Object.defineProperty(Ho, "__esModule", { value: !0 });
Ho.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const Xr = ir, XL = Bo, ZL = To;
class QL extends XL.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, n = t.size, r = n - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(r, n - 1);
    const i = i0(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await ex(this.options.oldFile), i);
  }
}
Ho.FileWithEmbeddedBlockMapDifferentialDownloader = QL;
function i0(e) {
  return JSON.parse((0, ZL.inflateRawSync)(e).toString());
}
async function ex(e) {
  const t = await (0, Xr.open)(e, "r");
  try {
    const n = (await (0, Xr.fstat)(t)).size, r = Buffer.allocUnsafe(4);
    await (0, Xr.read)(t, r, 0, r.length, n - r.length);
    const i = Buffer.allocUnsafe(r.readUInt32BE(0));
    return await (0, Xr.read)(t, i, 0, i.length, n - r.length - i.length), await (0, Xr.close)(t), i0(i);
  } catch (n) {
    throw await (0, Xr.close)(t), n;
  }
}
Object.defineProperty(_o, "__esModule", { value: !0 });
_o.AppImageUpdater = void 0;
const op = Qe, sp = ra, tx = ir, nx = x, Wi = k, rx = Mr, ix = Ho, ox = Ye, ap = or;
class sx extends rx.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, ox.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const s = process.env.APPIMAGE;
        if (s == null)
          throw (0, op.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(r, s, i, n, t)) && await this.httpExecutor.download(r.url, i, o), await (0, tx.chmod)(i, 493);
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
      return this.listenerCount(ap.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(ap.DOWNLOAD_PROGRESS, a)), await new ix.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, s).download(), !1;
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const n = process.env.APPIMAGE;
    if (n == null)
      throw (0, op.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, nx.unlinkSync)(n);
    let r;
    const i = Wi.basename(n), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    Wi.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? r = n : r = Wi.join(Wi.dirname(n), Wi.basename(o)), (0, sp.execFileSync)("mv", ["-f", o, r]), r !== n && this.emit("appimage-filename-updated", r);
    const s = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(r, [], s) : (s.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, sp.execFileSync)(r, [], { env: s })), !0;
  }
}
_o.AppImageUpdater = sx;
var wo = {}, Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
Ri.LinuxUpdater = void 0;
const ax = Mr;
class cx extends ax.BaseUpdater {
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
Ri.LinuxUpdater = cx;
Object.defineProperty(wo, "__esModule", { value: !0 });
wo.DebUpdater = void 0;
const lx = Ye, cp = or, ux = Ri;
class of extends ux.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, lx.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(cp.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(cp.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
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
      of.installWithCommandRunner(i, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
wo.DebUpdater = of;
var $o = {};
Object.defineProperty($o, "__esModule", { value: !0 });
$o.PacmanUpdater = void 0;
const lp = or, fx = Ye, dx = Ri;
class sf extends dx.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, fx.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(lp.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(lp.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    try {
      sf.installWithCommandRunner(n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
$o.PacmanUpdater = sf;
var So = {};
Object.defineProperty(So, "__esModule", { value: !0 });
So.RpmUpdater = void 0;
const up = or, hx = Ye, px = Ri;
class af extends px.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, hx.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(up.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(up.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
      }
    });
  }
  doInstall(t) {
    const n = this.installerPath;
    if (n == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    const r = ["zypper", "dnf", "yum", "rpm"], i = this.detectPackageManager(r);
    try {
      af.installWithCommandRunner(i, n, this.runCommandWithSudoIfNeeded.bind(this), this._logger);
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
So.RpmUpdater = af;
var bo = {};
Object.defineProperty(bo, "__esModule", { value: !0 });
bo.MacUpdater = void 0;
const fp = Qe, Wc = ir, mx = x, dp = k, gx = cv, yx = Zn, vx = Ye, hp = ra, pp = wi;
class Ex extends yx.AppUpdater {
  constructor(t, n) {
    super(t, n), this.nativeUpdater = Tn.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (r) => {
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
      this.debug("Checking for macOS Rosetta environment"), o = (0, hp.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), r.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      r.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let s = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, hp.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
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
    const c = (0, vx.findFile)(n, "zip", ["pkg", "dmg"]);
    if (c == null)
      throw (0, fp.newError)(`ZIP file not provided: ${(0, fp.safeStringifyJson)(n)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const u = t.updateInfoAndProvider.provider, l = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: c,
      downloadUpdateOptions: t,
      task: async (f, h) => {
        const d = dp.join(this.downloadedUpdateHelper.cacheDir, l), m = () => (0, Wc.pathExistsSync)(d) ? !t.disableDifferentialDownload : (r.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let p = !0;
        m() && (p = await this.differentialDownloadInstaller(c, t, f, u, l)), p && await this.httpExecutor.download(c.url, f, h);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = dp.join(this.downloadedUpdateHelper.cacheDir, l);
            await (0, Wc.copyFile)(f.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(c, f);
      }
    });
  }
  async updateDownloaded(t, n) {
    var r;
    const i = n.downloadedFile, o = (r = t.info.size) !== null && r !== void 0 ? r : (await (0, Wc.stat)(i)).size, s = this._logger, a = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${a})`), this.server = (0, gx.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${a})`), this.server.on("close", () => {
      s.info(`Proxy server for native Squirrel.Mac is closed (${a})`);
    });
    const c = (u) => {
      const l = u.address();
      return typeof l == "string" ? l : `http://127.0.0.1:${l == null ? void 0 : l.port}`;
    };
    return await new Promise((u, l) => {
      const f = (0, pp.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${f}`, "ascii"), d = `/${(0, pp.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (m, p) => {
        const v = m.url;
        if (s.info(`${v} requested`), v === "/") {
          if (!m.headers.authorization || m.headers.authorization.indexOf("Basic ") === -1) {
            p.statusCode = 401, p.statusMessage = "Invalid Authentication Credentials", p.end(), s.warn("No authenthication info");
            return;
          }
          const w = m.headers.authorization.split(" ")[1], A = Buffer.from(w, "base64").toString("ascii"), [C, F] = A.split(":");
          if (C !== "autoupdater" || F !== f) {
            p.statusCode = 401, p.statusMessage = "Invalid Authentication Credentials", p.end(), s.warn("Invalid authenthication credentials");
            return;
          }
          const q = Buffer.from(`{ "url": "${c(this.server)}${d}" }`);
          p.writeHead(200, { "Content-Type": "application/json", "Content-Length": q.length }), p.end(q);
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
        const g = (0, mx.createReadStream)(i);
        g.on("error", (w) => {
          try {
            p.end();
          } catch (A) {
            s.warn(`cannot end response: ${A}`);
          }
          y = !0, this.nativeUpdater.removeListener("error", l), l(new Error(`Cannot pipe "${i}": ${w}`));
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
bo.MacUpdater = Ex;
var Ao = {}, cf = {};
Object.defineProperty(cf, "__esModule", { value: !0 });
cf.verifySignature = wx;
const mp = Qe, o0 = ra, _x = ia, gp = k;
function s0(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function wx(e, t, n) {
  return new Promise((r, i) => {
    const o = t.replace(/'/g, "''");
    n.info(`Verifying signature ${o}`), (0, o0.execFile)(...s0(`"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`, 20 * 1e3), (s, a, c) => {
      var u;
      try {
        if (s != null || c) {
          Kc(n, s, c, i), r(null);
          return;
        }
        const l = $x(a);
        if (l.Status === 0) {
          try {
            const m = gp.normalize(l.Path), p = gp.normalize(t);
            if (n.info(`LiteralPath: ${m}. Update Path: ${p}`), m !== p) {
              Kc(n, new Error(`LiteralPath of ${m} is different than ${p}`), c, i), r(null);
              return;
            }
          } catch (m) {
            n.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(u = m.message) !== null && u !== void 0 ? u : m.stack}`);
          }
          const h = (0, mp.parseDn)(l.SignerCertificate.Subject);
          let d = !1;
          for (const m of e) {
            const p = (0, mp.parseDn)(m);
            if (p.size ? d = Array.from(p.keys()).every((y) => p.get(y) === h.get(y)) : m === h.get("CN") && (n.warn(`Signature validated using only CN ${m}. Please add your full Distinguished Name (DN) to publisherNames configuration`), d = !0), d) {
              r(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(l, (h, d) => h === "RawData" ? void 0 : d, 2);
        n.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), r(f);
      } catch (l) {
        Kc(n, l, null, i), r(null);
        return;
      }
    });
  });
}
function $x(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const n = t.SignerCertificate;
  return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
}
function Kc(e, t, n, r) {
  if (Sx()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || n}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, o0.execFileSync)(...s0("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && r(t), n && r(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${n}. Failing signature validation due to unknown stderr.`));
}
function Sx() {
  const e = _x.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Ao, "__esModule", { value: !0 });
Ao.NsisUpdater = void 0;
const bs = Qe, yp = k, bx = Mr, Ax = Ho, vp = or, Tx = Ye, Cx = ir, Nx = cf, Ep = rr;
class Ix extends bx.BaseUpdater {
  constructor(t, n) {
    super(t, n), this._verifyUpdateCodeSignature = (r, i) => (0, Nx.verifySignature)(r, i, this._logger);
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
    const n = t.updateInfoAndProvider.provider, r = (0, Tx.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: r,
      task: async (i, o, s, a) => {
        const c = r.packageInfo, u = c != null && s != null;
        if (u && t.disableWebInstaller)
          throw (0, bs.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !u && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (u || t.disableDifferentialDownload || await this.differentialDownloadInstaller(r, t, i, n, bs.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(r.url, i, o);
        const l = await this.verifySignature(i);
        if (l != null)
          throw await a(), (0, bs.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${l}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (u && await this.differentialDownloadWebPackage(t, c, s, n))
          try {
            await this.httpExecutor.download(new Ep.URL(c.path), s, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: c.sha512
            });
          } catch (f) {
            try {
              await (0, Cx.unlink)(s);
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
      this.spawnLog(yp.join(process.resourcesPath, "elevate.exe"), [n].concat(r)).catch((s) => this.dispatchError(s));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(n, r).catch((s) => {
      const a = s.code;
      this._logger.info(`Cannot run installer: error code: ${a}, error message: "${s.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), a === "UNKNOWN" || a === "EACCES" ? o() : a === "ENOENT" ? Tn.shell.openPath(n).catch((c) => this.dispatchError(c)) : this.dispatchError(s);
    }), !0);
  }
  async differentialDownloadWebPackage(t, n, r, i) {
    if (n.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new Ep.URL(n.path),
        oldFile: yp.join(this.downloadedUpdateHelper.cacheDir, bs.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: r,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(vp.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(vp.DOWNLOAD_PROGRESS, s)), await new Ax.FileWithEmbeddedBlockMapDifferentialDownloader(n, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
Ao.NsisUpdater = Ix;
(function(e) {
  var t = Ct && Ct.__createBinding || (Object.create ? function(v, y, g, w) {
    w === void 0 && (w = g);
    var A = Object.getOwnPropertyDescriptor(y, g);
    (!A || ("get" in A ? !y.__esModule : A.writable || A.configurable)) && (A = { enumerable: !0, get: function() {
      return y[g];
    } }), Object.defineProperty(v, w, A);
  } : function(v, y, g, w) {
    w === void 0 && (w = g), v[w] = y[g];
  }), n = Ct && Ct.__exportStar || function(v, y) {
    for (var g in v) g !== "default" && !Object.prototype.hasOwnProperty.call(y, g) && t(y, v, g);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const r = ir, i = k;
  var o = Mr;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var s = Zn;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return s.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return s.NoOpLogger;
  } });
  var a = Ye;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return a.Provider;
  } });
  var c = _o;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return c.AppImageUpdater;
  } });
  var u = wo;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return u.DebUpdater;
  } });
  var l = $o;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return l.PacmanUpdater;
  } });
  var f = So;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var h = bo;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var d = Ao;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return d.NsisUpdater;
  } }), n(or, e);
  let m;
  function p() {
    if (process.platform === "win32")
      m = new Ao.NsisUpdater();
    else if (process.platform === "darwin")
      m = new bo.MacUpdater();
    else {
      m = new _o.AppImageUpdater();
      try {
        const v = i.join(process.resourcesPath, "package-type");
        if (!(0, r.existsSync)(v))
          return m;
        switch ((0, r.readFileSync)(v).toString().trim()) {
          case "deb":
            m = new wo.DebUpdater();
            break;
          case "rpm":
            m = new So.RpmUpdater();
            break;
          case "pacman":
            m = new $o.PacmanUpdater();
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
})(ti);
const Px = wp(import.meta.url), xr = _p(Px), wt = process.env.VITE_DEV_SERVER_URL;
function Ox() {
  const e = [
    oe.instances,
    oe.java,
    oe.icons,
    oe.skins,
    oe.mods,
    oe.logs
  ];
  for (const t of e)
    x.existsSync(t) || x.mkdirSync(t, { recursive: !0 });
}
function As() {
  const e = new _e({
    width: 900,
    height: 600,
    minWidth: 750,
    minHeight: 500,
    frame: !0,
    title: "Fernlauncher",
    webPreferences: {
      preload: ze(xr, "../dist-electron/preload.cjs"),
      sandbox: !1
    },
    icon: ze(Le.getAppPath(), "public/iconreal.ico")
  });
  return e.setMenuBarVisibility(!1), wt ? (console.log("Main window loading URL:", wt), e.loadURL(wt)) : e.loadFile(ze(Le.getAppPath(), "dist/index.html")), e;
}
function Rx() {
  const e = new _e({
    width: 600,
    height: 450,
    resizable: !0,
    minWidth: 500,
    minHeight: 400,
    frame: !0,
    title: "Welcome to Fernlauncher",
    webPreferences: {
      preload: ze(xr, "../dist-electron/preload.cjs"),
      sandbox: !1
    },
    icon: ze(Le.getAppPath(), "public/iconreal.ico")
  });
  return e.setMenuBarVisibility(!1), wt ? (console.log("First launch loading URL:", wt), e.loadURL(wt + "?firstLaunch=true")) : e.loadFile(ze(Le.getAppPath(), "dist/index.html"), {
    query: { firstLaunch: "true" }
  }), e;
}
function Dx() {
  const e = new _e({
    width: 700,
    height: 580,
    minWidth: 600,
    minHeight: 500,
    title: "New Instance — Fernlauncher",
    center: !0,
    webPreferences: {
      preload: ze(xr, "../dist-electron/preload.cjs"),
      sandbox: !1
    },
    icon: ze(Le.getAppPath(), "public/iconreal.ico")
  });
  return e.setMenuBarVisibility(!1), wt ? e.loadURL(wt + "?window=newInstance") : e.loadFile(ze(Le.getAppPath(), "dist/index.html"), {
    query: { window: "newInstance" }
  }), e;
}
function Fx() {
  const e = new _e({
    width: 850,
    height: 580,
    minWidth: 700,
    minHeight: 500,
    title: "Settings — Fernlauncher",
    center: !0,
    webPreferences: {
      preload: ze(xr, "../dist-electron/preload.cjs"),
      sandbox: !1
    },
    icon: ze(Le.getAppPath(), "public/iconreal.ico")
  });
  return e.setMenuBarVisibility(!1), wt ? e.loadURL(wt + "?window=settings") : e.loadFile(ze(Le.getAppPath(), "dist/index.html"), {
    query: { window: "settings" }
  }), e;
}
function Lx(e) {
  const t = new _e({
    width: 850,
    height: 600,
    minWidth: 700,
    minHeight: 400,
    title: "Console — Fernlauncher",
    center: !0,
    webPreferences: {
      preload: ze(xr, "../dist-electron/preload.cjs"),
      sandbox: !1
    },
    icon: ze(Le.getAppPath(), "public/iconreal.ico")
  });
  return t.setMenuBarVisibility(!1), U1(e, t), wt ? t.loadURL(wt + `?window=console&instanceId=${e}`) : t.loadFile(ze(Le.getAppPath(), "dist/index.html"), {
    query: { window: "console", instanceId: e }
  }), t;
}
Le.whenReady().then(() => {
  if (WN(), K1(), J1(), X1(), Z1(), Ox(), Le.isPackaged && (ti.autoUpdater.checkForUpdatesAndNotify(), ti.autoUpdater.on("update-available", () => {
    var n;
    (n = _e.getAllWindows()[0]) == null || n.webContents.send("update:available");
  }), ti.autoUpdater.on("update-downloaded", () => {
    var n;
    (n = _e.getAllWindows()[0]) == null || n.webContents.send("update:downloaded");
  }), ti.autoUpdater.on("download-progress", (n) => {
    var r;
    (r = _e.getAllWindows()[0]) == null || r.webContents.send("update:progress", Math.round(n.percent));
  })), ie.handle("update:install", () => {
    ti.autoUpdater.quitAndInstall();
  }), ie.handle("window:newInstance", () => {
    Dx();
  }), ie.handle("window:settings", () => {
    Fx();
  }), ie.handle("window:console", (n, r) => {
    Lx(r);
  }), ie.handle("instance:openEditor", (n, r) => {
    const i = new _e({
      width: 900,
      height: 650,
      title: "Edit Instance — Fernlauncher",
      center: !0,
      webPreferences: {
        preload: ze(xr, "../dist-electron/preload.cjs"),
        sandbox: !1
      },
      icon: ze(Le.getAppPath(), "public/iconreal.ico")
    });
    i.setMenuBarVisibility(!1), wt ? i.loadURL(wt + `?window=instanceEditor&instanceId=${r}`) : i.loadFile(ze(Le.getAppPath(), "dist/index.html"), {
      query: { window: "instanceEditor", instanceId: r }
    });
  }), ie.handle("launcher:openFolder", async (n, r) => {
    const o = {
      root: oe.appData,
      instances: oe.instances,
      mods: oe.mods,
      skins: oe.skins,
      java: oe.java,
      icons: oe.icons,
      logs: oe.logs
    }[r];
    o && (x.existsSync(o) || x.mkdirSync(o, { recursive: !0 }), Ki.openPath(o));
  }), ie.handle("launcher:clearMetadataCache", async () => {
    const { session: n } = await import("electron");
    await n.defaultSession.clearCache();
  }), ie.handle("launcher:openAbout", () => {
    const n = new _e({
      width: 400,
      height: 380,
      title: "About Fernlauncher",
      resizable: !1,
      center: !0,
      webPreferences: {
        preload: ze(xr, "../dist-electron/preload.cjs"),
        sandbox: !1
      },
      icon: ze(Le.getAppPath(), "public/iconreal.ico")
    });
    n.setMenuBarVisibility(!1), wt ? n.loadURL(wt + "?window=about") : n.loadFile(ze(Le.getAppPath(), "dist/index.html"), { query: { window: "about" } });
  }), fn.get("firstLaunch")) {
    const n = Rx();
    ie.once("first-launch-complete", () => {
      fn.set("firstLaunch", !1), n.close(), As();
    });
  } else
    As();
  Le.on("activate", () => {
    _e.getAllWindows().length === 0 && As();
  });
  const t = process.argv.find((n) => n.startsWith("--instance"));
  if (t) {
    const n = t.split("=")[1] ?? process.argv[process.argv.indexOf(t) + 1], r = As();
    r.webContents.once("did-finish-load", () => {
      setTimeout(() => {
        r.webContents.send("auto-launch-instance", n);
      }, 2e3);
    });
    return;
  }
});
Le.on("window-all-closed", () => {
  process.platform !== "darwin" && Le.quit();
});
