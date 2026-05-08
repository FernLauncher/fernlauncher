var k0 = Object.defineProperty;
var Ef = (e) => {
  throw TypeError(e);
};
var U0 = (e, t, n) => t in e ? k0(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n;
var Hi = (e, t, n) => U0(e, typeof t != "symbol" ? t + "" : t, n), ec = (e, t, n) => t.has(e) || Ef("Cannot " + n);
var he = (e, t, n) => (ec(e, t, "read from private field"), n ? n.call(e) : t.get(e)), Jt = (e, t, n) => t.has(e) ? Ef("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, n), Dt = (e, t, n, r) => (ec(e, t, "write to private field"), r ? r.call(e, n) : t.set(e, n), n), _n = (e, t, n) => (ec(e, t, "access private method"), n);
import In, { app as De, session as _f, ipcMain as oe, BrowserWindow as Ee, shell as Zi, dialog as br, Menu as j0 } from "electron";
import x, { dirname as yp, join as ze } from "path";
import ar, { fileURLToPath as vp } from "url";
import Ue from "node:process";
import Ce from "node:path";
import { promisify as dt, isDeepStrictEqual as $f } from "node:util";
import pe from "node:fs";
import qi from "node:crypto";
import Sf from "node:assert";
import wp from "node:os";
import "node:events";
import "node:stream";
import la, { execSync as Al, spawn as Rs } from "child_process";
import k from "fs";
import yt from "https";
import Po from "zlib";
import Si from "crypto";
import { Client as M0 } from "@xhayper/discord-rpc";
import B0 from "constants";
import Oo from "stream";
import Tl from "util";
import Ep from "assert";
import _p from "events";
import $p from "tty";
import ua from "os";
import H0 from "http";
const kr = (e) => {
  const t = typeof e;
  return e !== null && (t === "object" || t === "function");
}, Sp = /* @__PURE__ */ new Set([
  "__proto__",
  "prototype",
  "constructor"
]), bp = 1e6, q0 = (e) => e >= "0" && e <= "9";
function Ap(e) {
  if (e === "0")
    return !0;
  if (/^[1-9]\d*$/.test(e)) {
    const t = Number.parseInt(e, 10);
    return t <= Number.MAX_SAFE_INTEGER && t <= bp;
  }
  return !1;
}
function tc(e, t) {
  return Sp.has(e) ? !1 : (e && Ap(e) ? t.push(Number.parseInt(e, 10)) : t.push(e), !0);
}
function z0(e) {
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
        if (!tc(n, t))
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
          if ((n || r === "property") && !tc(n, t))
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
            !Number.isNaN(a) && Number.isFinite(a) && a >= 0 && a <= Number.MAX_SAFE_INTEGER && a <= bp && n === String(a) ? t.push(a) : t.push(n), n = "", r = "indexEnd";
          }
          break;
        }
        if (r === "indexEnd")
          throw new Error(`Invalid character '${s}' after an index at position ${o}`);
        n += s;
        break;
      }
      default: {
        if (r === "index" && !q0(s))
          throw new Error(`Invalid character '${s}' in an index at position ${o}`);
        if (r === "indexEnd")
          throw new Error(`Invalid character '${s}' after an index at position ${o}`);
        r === "start" && (r = "property"), n += s;
      }
    }
  }
  switch (i && (n += "\\"), r) {
    case "property": {
      if (!tc(n, t))
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
function fa(e) {
  if (typeof e == "string")
    return z0(e);
  if (Array.isArray(e)) {
    const t = [];
    for (const [n, r] of e.entries()) {
      if (typeof r != "string" && typeof r != "number")
        throw new TypeError(`Expected a string or number for path segment at index ${n}, got ${typeof r}`);
      if (typeof r == "number" && !Number.isFinite(r))
        throw new TypeError(`Path segment at index ${n} must be a finite number, got ${r}`);
      if (Sp.has(r))
        return [];
      typeof r == "string" && Ap(r) ? t.push(Number.parseInt(r, 10)) : t.push(r);
    }
    return t;
  }
  return [];
}
function bf(e, t, n) {
  if (!kr(e) || typeof t != "string" && !Array.isArray(t))
    return n === void 0 ? e : n;
  const r = fa(t);
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
function ts(e, t, n) {
  if (!kr(e) || typeof t != "string" && !Array.isArray(t))
    return e;
  const r = e, i = fa(t);
  if (i.length === 0)
    return e;
  for (let o = 0; o < i.length; o++) {
    const s = i[o];
    if (o === i.length - 1)
      e[s] = n;
    else if (!kr(e[s])) {
      const c = typeof i[o + 1] == "number";
      e[s] = c ? [] : {};
    }
    e = e[s];
  }
  return r;
}
function V0(e, t) {
  if (!kr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const n = fa(t);
  if (n.length === 0)
    return !1;
  for (let r = 0; r < n.length; r++) {
    const i = n[r];
    if (r === n.length - 1)
      return Object.hasOwn(e, i) ? (delete e[i], !0) : !1;
    if (e = e[i], !kr(e))
      return !1;
  }
}
function nc(e, t) {
  if (!kr(e) || typeof t != "string" && !Array.isArray(t))
    return !1;
  const n = fa(t);
  if (n.length === 0)
    return !1;
  for (const r of n) {
    if (!kr(e) || !(r in e))
      return !1;
    e = e[r];
  }
  return !0;
}
const Kn = wp.homedir(), Cl = wp.tmpdir(), { env: si } = Ue, G0 = (e) => {
  const t = Ce.join(Kn, "Library");
  return {
    data: Ce.join(t, "Application Support", e),
    config: Ce.join(t, "Preferences", e),
    cache: Ce.join(t, "Caches", e),
    log: Ce.join(t, "Logs", e),
    temp: Ce.join(Cl, e)
  };
}, W0 = (e) => {
  const t = si.APPDATA || Ce.join(Kn, "AppData", "Roaming"), n = si.LOCALAPPDATA || Ce.join(Kn, "AppData", "Local");
  return {
    // Data/config/cache/log are invented by me as Windows isn't opinionated about this
    data: Ce.join(n, e, "Data"),
    config: Ce.join(t, e, "Config"),
    cache: Ce.join(n, e, "Cache"),
    log: Ce.join(n, e, "Log"),
    temp: Ce.join(Cl, e)
  };
}, K0 = (e) => {
  const t = Ce.basename(Kn);
  return {
    data: Ce.join(si.XDG_DATA_HOME || Ce.join(Kn, ".local", "share"), e),
    config: Ce.join(si.XDG_CONFIG_HOME || Ce.join(Kn, ".config"), e),
    cache: Ce.join(si.XDG_CACHE_HOME || Ce.join(Kn, ".cache"), e),
    // https://wiki.debian.org/XDGBaseDirectorySpecification#state
    log: Ce.join(si.XDG_STATE_HOME || Ce.join(Kn, ".local", "state"), e),
    temp: Ce.join(Cl, t, e)
  };
};
function J0(e, { suffix: t = "nodejs" } = {}) {
  if (typeof e != "string")
    throw new TypeError(`Expected a string, got ${typeof e}`);
  return t && (e += `-${t}`), Ue.platform === "darwin" ? G0(e) : Ue.platform === "win32" ? W0(e) : K0(e);
}
const kn = (e, t) => {
  const { onError: n } = t;
  return function(...i) {
    return e.apply(void 0, i).catch(n);
  };
}, $n = (e, t) => {
  const { onError: n } = t;
  return function(...i) {
    try {
      return e.apply(void 0, i);
    } catch (o) {
      return n(o);
    }
  };
}, Y0 = 250, Un = (e, t) => {
  const { isRetriable: n } = t;
  return function(i) {
    const { timeout: o } = i, s = i.interval ?? Y0, a = Date.now() + o;
    return function c(...u) {
      return e.apply(void 0, u).catch((l) => {
        if (!n(l) || Date.now() >= a)
          throw l;
        const f = Math.round(s * Math.random());
        return f > 0 ? new Promise((d) => setTimeout(d, f)).then(() => c.apply(void 0, u)) : c.apply(void 0, u);
      });
    };
  };
}, jn = (e, t) => {
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
}, ai = {
  /* API */
  isChangeErrorOk: (e) => {
    if (!ai.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "ENOSYS" || !X0 && (t === "EINVAL" || t === "EPERM");
  },
  isNodeError: (e) => e instanceof Error,
  isRetriableError: (e) => {
    if (!ai.isNodeError(e))
      return !1;
    const { code: t } = e;
    return t === "EMFILE" || t === "ENFILE" || t === "EAGAIN" || t === "EBUSY" || t === "EACCESS" || t === "EACCES" || t === "EACCS" || t === "EPERM";
  },
  onChangeError: (e) => {
    if (!ai.isNodeError(e))
      throw e;
    if (!ai.isChangeErrorOk(e))
      throw e;
  }
}, ns = {
  onError: ai.onChangeError
}, jt = {
  onError: () => {
  }
}, X0 = Ue.getuid ? !Ue.getuid() : !1, ht = {
  isRetriable: ai.isRetriableError
}, pt = {
  attempt: {
    /* ASYNC */
    chmod: kn(dt(pe.chmod), ns),
    chown: kn(dt(pe.chown), ns),
    close: kn(dt(pe.close), jt),
    fsync: kn(dt(pe.fsync), jt),
    mkdir: kn(dt(pe.mkdir), jt),
    realpath: kn(dt(pe.realpath), jt),
    stat: kn(dt(pe.stat), jt),
    unlink: kn(dt(pe.unlink), jt),
    /* SYNC */
    chmodSync: $n(pe.chmodSync, ns),
    chownSync: $n(pe.chownSync, ns),
    closeSync: $n(pe.closeSync, jt),
    existsSync: $n(pe.existsSync, jt),
    fsyncSync: $n(pe.fsync, jt),
    mkdirSync: $n(pe.mkdirSync, jt),
    realpathSync: $n(pe.realpathSync, jt),
    statSync: $n(pe.statSync, jt),
    unlinkSync: $n(pe.unlinkSync, jt)
  },
  retry: {
    /* ASYNC */
    close: Un(dt(pe.close), ht),
    fsync: Un(dt(pe.fsync), ht),
    open: Un(dt(pe.open), ht),
    readFile: Un(dt(pe.readFile), ht),
    rename: Un(dt(pe.rename), ht),
    stat: Un(dt(pe.stat), ht),
    write: Un(dt(pe.write), ht),
    writeFile: Un(dt(pe.writeFile), ht),
    /* SYNC */
    closeSync: jn(pe.closeSync, ht),
    fsyncSync: jn(pe.fsyncSync, ht),
    openSync: jn(pe.openSync, ht),
    readFileSync: jn(pe.readFileSync, ht),
    renameSync: jn(pe.renameSync, ht),
    statSync: jn(pe.statSync, ht),
    writeSync: jn(pe.writeSync, ht),
    writeFileSync: jn(pe.writeFileSync, ht)
  }
}, Z0 = "utf8", Af = 438, Q0 = 511, ev = {}, tv = Ue.geteuid ? Ue.geteuid() : -1, nv = Ue.getegid ? Ue.getegid() : -1, rv = 1e3, iv = !!Ue.getuid;
Ue.getuid && Ue.getuid();
const Tf = 128, ov = (e) => e instanceof Error && "code" in e, Cf = (e) => typeof e == "string", rc = (e) => e === void 0, sv = Ue.platform === "linux", Tp = Ue.platform === "win32", Nl = ["SIGHUP", "SIGINT", "SIGTERM"];
Tp || Nl.push("SIGALRM", "SIGABRT", "SIGVTALRM", "SIGXCPU", "SIGXFSZ", "SIGUSR2", "SIGTRAP", "SIGSYS", "SIGQUIT", "SIGIOT");
sv && Nl.push("SIGIO", "SIGPOLL", "SIGPWR", "SIGSTKFLT");
class av {
  /* CONSTRUCTOR */
  constructor() {
    this.callbacks = /* @__PURE__ */ new Set(), this.exited = !1, this.exit = (t) => {
      if (!this.exited) {
        this.exited = !0;
        for (const n of this.callbacks)
          n();
        t && (Tp && t !== "SIGINT" && t !== "SIGTERM" && t !== "SIGKILL" ? Ue.kill(Ue.pid, "SIGTERM") : Ue.kill(Ue.pid, t));
      }
    }, this.hook = () => {
      Ue.once("exit", () => this.exit());
      for (const t of Nl)
        try {
          Ue.once(t, () => this.exit(t));
        } catch {
        }
    }, this.register = (t) => (this.callbacks.add(t), () => {
      this.callbacks.delete(t);
    }), this.hook();
  }
}
const cv = new av(), lv = cv.register, mt = {
  /* VARIABLES */
  store: {},
  // filePath => purge
  /* API */
  create: (e) => {
    const t = `000000${Math.floor(Math.random() * 16777215).toString(16)}`.slice(-6), i = `.tmp-${Date.now().toString().slice(-10)}${t}`;
    return `${e}${i}`;
  },
  get: (e, t, n = !0) => {
    const r = mt.truncate(t(e));
    return r in mt.store ? mt.get(e, t, n) : (mt.store[r] = n, [r, () => delete mt.store[r]]);
  },
  purge: (e) => {
    mt.store[e] && (delete mt.store[e], pt.attempt.unlink(e));
  },
  purgeSync: (e) => {
    mt.store[e] && (delete mt.store[e], pt.attempt.unlinkSync(e));
  },
  purgeSyncAll: () => {
    for (const e in mt.store)
      mt.purgeSync(e);
  },
  truncate: (e) => {
    const t = Ce.basename(e);
    if (t.length <= Tf)
      return e;
    const n = /^(\.?)(.*?)((?:\.[^.]+)?(?:\.tmp-\d{10}[a-f0-9]{6})?)$/.exec(t);
    if (!n)
      return e;
    const r = t.length - Tf;
    return `${e.slice(0, -t.length)}${n[1]}${n[2].slice(0, -r)}${n[3]}`;
  }
};
lv(mt.purgeSyncAll);
function Cp(e, t, n = ev) {
  if (Cf(n))
    return Cp(e, t, { encoding: n });
  const i = { timeout: n.timeout ?? rv };
  let o = null, s = null, a = null;
  try {
    const c = pt.attempt.realpathSync(e), u = !!c;
    e = c || e, [s, o] = mt.get(e, n.tmpCreate || mt.create, n.tmpPurge !== !1);
    const l = iv && rc(n.chown), f = rc(n.mode);
    if (u && (l || f)) {
      const h = pt.attempt.statSync(e);
      h && (n = { ...n }, l && (n.chown = { uid: h.uid, gid: h.gid }), f && (n.mode = h.mode));
    }
    if (!u) {
      const h = Ce.dirname(e);
      pt.attempt.mkdirSync(h, {
        mode: Q0,
        recursive: !0
      });
    }
    a = pt.retry.openSync(i)(s, "w", n.mode || Af), n.tmpCreated && n.tmpCreated(s), Cf(t) ? pt.retry.writeSync(i)(a, t, 0, n.encoding || Z0) : rc(t) || pt.retry.writeSync(i)(a, t, 0, t.length, 0), n.fsync !== !1 && (n.fsyncWait !== !1 ? pt.retry.fsyncSync(i)(a) : pt.attempt.fsync(a)), pt.retry.closeSync(i)(a), a = null, n.chown && (n.chown.uid !== tv || n.chown.gid !== nv) && pt.attempt.chownSync(s, n.chown.uid, n.chown.gid), n.mode && n.mode !== Af && pt.attempt.chmodSync(s, n.mode);
    try {
      pt.retry.renameSync(i)(s, e);
    } catch (h) {
      if (!ov(h) || h.code !== "ENAMETOOLONG")
        throw h;
      pt.retry.renameSync(i)(s, mt.truncate(e));
    }
    o(), s = null;
  } finally {
    a && pt.attempt.closeSync(a), s && mt.purge(s);
  }
}
var bt = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Il(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Xc = { exports: {} }, Pl = {}, Sn = {}, mr = {}, Ro = {}, ue = {}, fo = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
  class t {
  }
  e._CodeOrName = t, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
  class n extends t {
    constructor(y) {
      if (super(), !e.IDENTIFIER.test(y))
        throw new Error("CodeGen: name must be a valid identifier");
      this.str = y;
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
    constructor(y) {
      super(), this._items = typeof y == "string" ? [y] : y;
    }
    toString() {
      return this.str;
    }
    emptyStr() {
      if (this._items.length > 1)
        return !1;
      const y = this._items[0];
      return y === "" || y === '""';
    }
    get str() {
      var y;
      return (y = this._str) !== null && y !== void 0 ? y : this._str = this._items.reduce((_, S) => `${_}${S}`, "");
    }
    get names() {
      var y;
      return (y = this._names) !== null && y !== void 0 ? y : this._names = this._items.reduce((_, S) => (S instanceof n && (_[S.str] = (_[S.str] || 0) + 1), _), {});
    }
  }
  e._Code = r, e.nil = new r("");
  function i(E, ...y) {
    const _ = [E[0]];
    let S = 0;
    for (; S < y.length; )
      a(_, y[S]), _.push(E[++S]);
    return new r(_);
  }
  e._ = i;
  const o = new r("+");
  function s(E, ...y) {
    const _ = [d(E[0])];
    let S = 0;
    for (; S < y.length; )
      _.push(o), a(_, y[S]), _.push(o, d(E[++S]));
    return c(_), new r(_);
  }
  e.str = s;
  function a(E, y) {
    y instanceof r ? E.push(...y._items) : y instanceof n ? E.push(y) : E.push(f(y));
  }
  e.addCodeArg = a;
  function c(E) {
    let y = 1;
    for (; y < E.length - 1; ) {
      if (E[y] === o) {
        const _ = u(E[y - 1], E[y + 1]);
        if (_ !== void 0) {
          E.splice(y - 1, 3, _);
          continue;
        }
        E[y++] = "+";
      }
      y++;
    }
  }
  function u(E, y) {
    if (y === '""')
      return E;
    if (E === '""')
      return y;
    if (typeof E == "string")
      return y instanceof n || E[E.length - 1] !== '"' ? void 0 : typeof y != "string" ? `${E.slice(0, -1)}${y}"` : y[0] === '"' ? E.slice(0, -1) + y.slice(1) : void 0;
    if (typeof y == "string" && y[0] === '"' && !(E instanceof n))
      return `"${E}${y.slice(1)}`;
  }
  function l(E, y) {
    return y.emptyStr() ? E : E.emptyStr() ? y : s`${E}${y}`;
  }
  e.strConcat = l;
  function f(E) {
    return typeof E == "number" || typeof E == "boolean" || E === null ? E : d(Array.isArray(E) ? E.join(",") : E);
  }
  function h(E) {
    return new r(d(E));
  }
  e.stringify = h;
  function d(E) {
    return JSON.stringify(E).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
  }
  e.safeStringify = d;
  function m(E) {
    return typeof E == "string" && e.IDENTIFIER.test(E) ? new r(`.${E}`) : i`[${E}]`;
  }
  e.getProperty = m;
  function p(E) {
    if (typeof E == "string" && e.IDENTIFIER.test(E))
      return new r(`${E}`);
    throw new Error(`CodeGen: invalid export name: ${E}, use explicit $id name mapping`);
  }
  e.getEsmExportName = p;
  function w(E) {
    return new r(E.toString());
  }
  e.regexpCode = w;
})(fo);
var Zc = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
  const t = fo;
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
        const y = p.get(m);
        if (y)
          return y;
      } else
        p = this._values[d] = /* @__PURE__ */ new Map();
      p.set(m, h);
      const w = this._scope[d] || (this._scope[d] = []), E = w.length;
      return w[E] = l.ref, h.setValue(l, { property: d, itemIndex: E }), h;
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
        const w = f[m] = f[m] || /* @__PURE__ */ new Map();
        p.forEach((E) => {
          if (w.has(E))
            return;
          w.set(E, r.Started);
          let y = l(E);
          if (y) {
            const _ = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
            d = (0, t._)`${d}${_} ${E} = ${y};${this.opts._n}`;
          } else if (y = h == null ? void 0 : h(E))
            d = (0, t._)`${d}${y}${this.opts._n}`;
          else
            throw new n(E);
          w.set(E, r.Completed);
        });
      }
      return d;
    }
  }
  e.ValueScope = a;
})(Zc);
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
  const t = fo, n = Zc;
  var r = fo;
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
  var i = Zc;
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
    constructor($, T, H) {
      super(), this.varKind = $, this.name = T, this.rhs = H;
    }
    render({ es5: $, _n: T }) {
      const H = $ ? n.varKinds.var : this.varKind, ie = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
      return `${H} ${this.name}${ie};` + T;
    }
    optimizeNames($, T) {
      if ($[this.name.str])
        return this.rhs && (this.rhs = L(this.rhs, $, T)), this;
    }
    get names() {
      return this.rhs instanceof t._CodeOrName ? this.rhs.names : {};
    }
  }
  class a extends o {
    constructor($, T, H) {
      super(), this.lhs = $, this.rhs = T, this.sideEffects = H;
    }
    render({ _n: $ }) {
      return `${this.lhs} = ${this.rhs};` + $;
    }
    optimizeNames($, T) {
      if (!(this.lhs instanceof t.Name && !$[this.lhs.str] && !this.sideEffects))
        return this.rhs = L(this.rhs, $, T), this;
    }
    get names() {
      const $ = this.lhs instanceof t.Name ? {} : { ...this.lhs.names };
      return X($, this.rhs);
    }
  }
  class c extends a {
    constructor($, T, H, ie) {
      super($, H, ie), this.op = T;
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
      return this.code = L(this.code, $, T), this;
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
      return this.nodes.reduce((T, H) => T + H.render($), "");
    }
    optimizeNodes() {
      const { nodes: $ } = this;
      let T = $.length;
      for (; T--; ) {
        const H = $[T].optimizeNodes();
        Array.isArray(H) ? $.splice(T, 1, ...H) : H ? $[T] = H : $.splice(T, 1);
      }
      return $.length > 0 ? this : void 0;
    }
    optimizeNames($, T) {
      const { nodes: H } = this;
      let ie = H.length;
      for (; ie--; ) {
        const ne = H[ie];
        ne.optimizeNames($, T) || (U($, ne.names), H.splice(ie, 1));
      }
      return H.length > 0 ? this : void 0;
    }
    get names() {
      return this.nodes.reduce(($, T) => W($, T.names), {});
    }
  }
  class m extends d {
    render($) {
      return "{" + $._n + super.render($) + "}" + $._n;
    }
  }
  class p extends d {
  }
  class w extends m {
  }
  w.kind = "else";
  class E extends m {
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
        const H = T.optimizeNodes();
        T = this.else = Array.isArray(H) ? new w(H) : H;
      }
      if (T)
        return $ === !1 ? T instanceof E ? T : T.nodes : this.nodes.length ? this : new E(K($), T instanceof E ? [T] : T.nodes);
      if (!($ === !1 || !this.nodes.length))
        return this;
    }
    optimizeNames($, T) {
      var H;
      if (this.else = (H = this.else) === null || H === void 0 ? void 0 : H.optimizeNames($, T), !!(super.optimizeNames($, T) || this.else))
        return this.condition = L(this.condition, $, T), this;
    }
    get names() {
      const $ = super.names;
      return X($, this.condition), this.else && W($, this.else.names), $;
    }
  }
  E.kind = "if";
  class y extends m {
  }
  y.kind = "for";
  class _ extends y {
    constructor($) {
      super(), this.iteration = $;
    }
    render($) {
      return `for(${this.iteration})` + super.render($);
    }
    optimizeNames($, T) {
      if (super.optimizeNames($, T))
        return this.iteration = L(this.iteration, $, T), this;
    }
    get names() {
      return W(super.names, this.iteration.names);
    }
  }
  class S extends y {
    constructor($, T, H, ie) {
      super(), this.varKind = $, this.name = T, this.from = H, this.to = ie;
    }
    render($) {
      const T = $.es5 ? n.varKinds.var : this.varKind, { name: H, from: ie, to: ne } = this;
      return `for(${T} ${H}=${ie}; ${H}<${ne}; ${H}++)` + super.render($);
    }
    get names() {
      const $ = X(super.names, this.from);
      return X($, this.to);
    }
  }
  class C extends y {
    constructor($, T, H, ie) {
      super(), this.loop = $, this.varKind = T, this.name = H, this.iterable = ie;
    }
    render($) {
      return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render($);
    }
    optimizeNames($, T) {
      if (super.optimizeNames($, T))
        return this.iterable = L(this.iterable, $, T), this;
    }
    get names() {
      return W(super.names, this.iterable.names);
    }
  }
  class j extends m {
    constructor($, T, H) {
      super(), this.name = $, this.args = T, this.async = H;
    }
    render($) {
      return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render($);
    }
  }
  j.kind = "func";
  class V extends d {
    render($) {
      return "return " + super.render($);
    }
  }
  V.kind = "return";
  class G extends m {
    render($) {
      let T = "try" + super.render($);
      return this.catch && (T += this.catch.render($)), this.finally && (T += this.finally.render($)), T;
    }
    optimizeNodes() {
      var $, T;
      return super.optimizeNodes(), ($ = this.catch) === null || $ === void 0 || $.optimizeNodes(), (T = this.finally) === null || T === void 0 || T.optimizeNodes(), this;
    }
    optimizeNames($, T) {
      var H, ie;
      return super.optimizeNames($, T), (H = this.catch) === null || H === void 0 || H.optimizeNames($, T), (ie = this.finally) === null || ie === void 0 || ie.optimizeNames($, T), this;
    }
    get names() {
      const $ = super.names;
      return this.catch && W($, this.catch.names), this.finally && W($, this.finally.names), $;
    }
  }
  class q extends m {
    constructor($) {
      super(), this.error = $;
    }
    render($) {
      return `catch(${this.error})` + super.render($);
    }
  }
  q.kind = "catch";
  class b extends m {
    render($) {
      return "finally" + super.render($);
    }
  }
  b.kind = "finally";
  class M {
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
      const H = this._extScope.value($, T);
      return (this._values[H.prefix] || (this._values[H.prefix] = /* @__PURE__ */ new Set())).add(H), H;
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
    _def($, T, H, ie) {
      const ne = this._scope.toName(T);
      return H !== void 0 && ie && (this._constants[ne.str] = H), this._leafNode(new s($, ne, H)), ne;
    }
    // `const` declaration (`var` in es5 mode)
    const($, T, H) {
      return this._def(n.varKinds.const, $, T, H);
    }
    // `let` declaration with optional assignment (`var` in es5 mode)
    let($, T, H) {
      return this._def(n.varKinds.let, $, T, H);
    }
    // `var` declaration with optional assignment
    var($, T, H) {
      return this._def(n.varKinds.var, $, T, H);
    }
    // assignment code
    assign($, T, H) {
      return this._leafNode(new a($, T, H));
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
      for (const [H, ie] of $)
        T.length > 1 && T.push(","), T.push(H), (H !== ie || this.opts.es5) && (T.push(":"), (0, t.addCodeArg)(T, ie));
      return T.push("}"), new t._Code(T);
    }
    // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
    if($, T, H) {
      if (this._blockNode(new E($)), T && H)
        this.code(T).else().code(H).endIf();
      else if (T)
        this.code(T).endIf();
      else if (H)
        throw new Error('CodeGen: "else" body without "then" body');
      return this;
    }
    // `else if` clause - invalid without `if` or after `else` clauses
    elseIf($) {
      return this._elseNode(new E($));
    }
    // `else` clause - only valid after `if` or `else if` clauses
    else() {
      return this._elseNode(new w());
    }
    // end `if` statement (needed if gen.if was used only with condition)
    endIf() {
      return this._endBlockNode(E, w);
    }
    _for($, T) {
      return this._blockNode($), T && this.code(T).endFor(), this;
    }
    // a generic `for` clause (or statement if `forBody` is passed)
    for($, T) {
      return this._for(new _($), T);
    }
    // `for` statement for a range of values
    forRange($, T, H, ie, ne = this.opts.es5 ? n.varKinds.var : n.varKinds.let) {
      const ye = this._scope.toName($);
      return this._for(new S(ne, ye, T, H), () => ie(ye));
    }
    // `for-of` statement (in es5 mode replace with a normal for loop)
    forOf($, T, H, ie = n.varKinds.const) {
      const ne = this._scope.toName($);
      if (this.opts.es5) {
        const ye = T instanceof t.Name ? T : this.var("_arr", T);
        return this.forRange("_i", 0, (0, t._)`${ye}.length`, (le) => {
          this.var(ne, (0, t._)`${ye}[${le}]`), H(ne);
        });
      }
      return this._for(new C("of", ie, ne, T), () => H(ne));
    }
    // `for-in` statement.
    // With option `ownProperties` replaced with a `for-of` loop for object keys
    forIn($, T, H, ie = this.opts.es5 ? n.varKinds.var : n.varKinds.const) {
      if (this.opts.ownProperties)
        return this.forOf($, (0, t._)`Object.keys(${T})`, H);
      const ne = this._scope.toName($);
      return this._for(new C("in", ie, ne, T), () => H(ne));
    }
    // end `for` loop
    endFor() {
      return this._endBlockNode(y);
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
      const T = new V();
      if (this._blockNode(T), this.code($), T.nodes.length !== 1)
        throw new Error('CodeGen: "return" should have one node');
      return this._endBlockNode(V);
    }
    // `try` statement
    try($, T, H) {
      if (!T && !H)
        throw new Error('CodeGen: "try" without "catch" and "finally"');
      const ie = new G();
      if (this._blockNode(ie), this.code($), T) {
        const ne = this.name("e");
        this._currNode = ie.catch = new q(ne), T(ne);
      }
      return H && (this._currNode = ie.finally = new b(), this.code(H)), this._endBlockNode(q, b);
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
      const H = this._nodes.length - T;
      if (H < 0 || $ !== void 0 && H !== $)
        throw new Error(`CodeGen: wrong number of nodes: ${H} vs ${$} expected`);
      return this._nodes.length = T, this;
    }
    // `function` heading (or definition if funcBody is passed)
    func($, T = t.nil, H, ie) {
      return this._blockNode(new j($, T, H)), ie && this.code(ie).endFunc(), this;
    }
    // end function definition
    endFunc() {
      return this._endBlockNode(j);
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
      const H = this._currNode;
      if (H instanceof $ || T && H instanceof T)
        return this._nodes.pop(), this;
      throw new Error(`CodeGen: not in block "${T ? `${$.kind}/${T.kind}` : $.kind}"`);
    }
    _elseNode($) {
      const T = this._currNode;
      if (!(T instanceof E))
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
  e.CodeGen = M;
  function W(D, $) {
    for (const T in $)
      D[T] = (D[T] || 0) + ($[T] || 0);
    return D;
  }
  function X(D, $) {
    return $ instanceof t._CodeOrName ? W(D, $.names) : D;
  }
  function L(D, $, T) {
    if (D instanceof t.Name)
      return H(D);
    if (!ie(D))
      return D;
    return new t._Code(D._items.reduce((ne, ye) => (ye instanceof t.Name && (ye = H(ye)), ye instanceof t._Code ? ne.push(...ye._items) : ne.push(ye), ne), []));
    function H(ne) {
      const ye = T[ne.str];
      return ye === void 0 || $[ne.str] !== 1 ? ne : (delete $[ne.str], ye);
    }
    function ie(ne) {
      return ne instanceof t._Code && ne._items.some((ye) => ye instanceof t.Name && $[ye.str] === 1 && T[ye.str] !== void 0);
    }
  }
  function U(D, $) {
    for (const T in $)
      D[T] = (D[T] || 0) - ($[T] || 0);
  }
  function K(D) {
    return typeof D == "boolean" || typeof D == "number" || D === null ? !D : (0, t._)`!${F(D)}`;
  }
  e.not = K;
  const z = P(e.operators.AND);
  function Z(...D) {
    return D.reduce(z);
  }
  e.and = Z;
  const J = P(e.operators.OR);
  function B(...D) {
    return D.reduce(J);
  }
  e.or = B;
  function P(D) {
    return ($, T) => $ === t.nil ? T : T === t.nil ? $ : (0, t._)`${F($)} ${D} ${F(T)}`;
  }
  function F(D) {
    return D instanceof t.Name ? D : (0, t._)`(${D})`;
  }
})(ue);
var ee = {};
Object.defineProperty(ee, "__esModule", { value: !0 });
ee.checkStrictMode = ee.getErrorPath = ee.Type = ee.useFunc = ee.setEvaluated = ee.evaluatedPropsToName = ee.mergeEvaluated = ee.eachItem = ee.unescapeJsonPointer = ee.escapeJsonPointer = ee.escapeFragment = ee.unescapeFragment = ee.schemaRefOrVal = ee.schemaHasRulesButRef = ee.schemaHasRules = ee.checkUnknownRules = ee.alwaysValidSchema = ee.toHash = void 0;
const Re = ue, uv = fo;
function fv(e) {
  const t = {};
  for (const n of e)
    t[n] = !0;
  return t;
}
ee.toHash = fv;
function dv(e, t) {
  return typeof t == "boolean" ? t : Object.keys(t).length === 0 ? !0 : (Np(e, t), !Ip(t, e.self.RULES.all));
}
ee.alwaysValidSchema = dv;
function Np(e, t = e.schema) {
  const { opts: n, self: r } = e;
  if (!n.strictSchema || typeof t == "boolean")
    return;
  const i = r.RULES.keywords;
  for (const o in t)
    i[o] || Rp(e, `unknown keyword: "${o}"`);
}
ee.checkUnknownRules = Np;
function Ip(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const n in e)
    if (t[n])
      return !0;
  return !1;
}
ee.schemaHasRules = Ip;
function hv(e, t) {
  if (typeof e == "boolean")
    return !e;
  for (const n in e)
    if (n !== "$ref" && t.all[n])
      return !0;
  return !1;
}
ee.schemaHasRulesButRef = hv;
function pv({ topSchemaRef: e, schemaPath: t }, n, r, i) {
  if (!i) {
    if (typeof n == "number" || typeof n == "boolean")
      return n;
    if (typeof n == "string")
      return (0, Re._)`${n}`;
  }
  return (0, Re._)`${e}${t}${(0, Re.getProperty)(r)}`;
}
ee.schemaRefOrVal = pv;
function mv(e) {
  return Pp(decodeURIComponent(e));
}
ee.unescapeFragment = mv;
function gv(e) {
  return encodeURIComponent(Ol(e));
}
ee.escapeFragment = gv;
function Ol(e) {
  return typeof e == "number" ? `${e}` : e.replace(/~/g, "~0").replace(/\//g, "~1");
}
ee.escapeJsonPointer = Ol;
function Pp(e) {
  return e.replace(/~1/g, "/").replace(/~0/g, "~");
}
ee.unescapeJsonPointer = Pp;
function yv(e, t) {
  if (Array.isArray(e))
    for (const n of e)
      t(n);
  else
    t(e);
}
ee.eachItem = yv;
function Nf({ mergeNames: e, mergeToName: t, mergeValues: n, resultToName: r }) {
  return (i, o, s, a) => {
    const c = s === void 0 ? o : s instanceof Re.Name ? (o instanceof Re.Name ? e(i, o, s) : t(i, o, s), s) : o instanceof Re.Name ? (t(i, s, o), o) : n(o, s);
    return a === Re.Name && !(c instanceof Re.Name) ? r(i, c) : c;
  };
}
ee.mergeEvaluated = {
  props: Nf({
    mergeNames: (e, t, n) => e.if((0, Re._)`${n} !== true && ${t} !== undefined`, () => {
      e.if((0, Re._)`${t} === true`, () => e.assign(n, !0), () => e.assign(n, (0, Re._)`${n} || {}`).code((0, Re._)`Object.assign(${n}, ${t})`));
    }),
    mergeToName: (e, t, n) => e.if((0, Re._)`${n} !== true`, () => {
      t === !0 ? e.assign(n, !0) : (e.assign(n, (0, Re._)`${n} || {}`), Rl(e, n, t));
    }),
    mergeValues: (e, t) => e === !0 ? !0 : { ...e, ...t },
    resultToName: Op
  }),
  items: Nf({
    mergeNames: (e, t, n) => e.if((0, Re._)`${n} !== true && ${t} !== undefined`, () => e.assign(n, (0, Re._)`${t} === true ? true : ${n} > ${t} ? ${n} : ${t}`)),
    mergeToName: (e, t, n) => e.if((0, Re._)`${n} !== true`, () => e.assign(n, t === !0 ? !0 : (0, Re._)`${n} > ${t} ? ${n} : ${t}`)),
    mergeValues: (e, t) => e === !0 ? !0 : Math.max(e, t),
    resultToName: (e, t) => e.var("items", t)
  })
};
function Op(e, t) {
  if (t === !0)
    return e.var("props", !0);
  const n = e.var("props", (0, Re._)`{}`);
  return t !== void 0 && Rl(e, n, t), n;
}
ee.evaluatedPropsToName = Op;
function Rl(e, t, n) {
  Object.keys(n).forEach((r) => e.assign((0, Re._)`${t}${(0, Re.getProperty)(r)}`, !0));
}
ee.setEvaluated = Rl;
const If = {};
function vv(e, t) {
  return e.scopeValue("func", {
    ref: t,
    code: If[t.code] || (If[t.code] = new uv._Code(t.code))
  });
}
ee.useFunc = vv;
var Qc;
(function(e) {
  e[e.Num = 0] = "Num", e[e.Str = 1] = "Str";
})(Qc || (ee.Type = Qc = {}));
function wv(e, t, n) {
  if (e instanceof Re.Name) {
    const r = t === Qc.Num;
    return n ? r ? (0, Re._)`"[" + ${e} + "]"` : (0, Re._)`"['" + ${e} + "']"` : r ? (0, Re._)`"/" + ${e}` : (0, Re._)`"/" + ${e}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
  }
  return n ? (0, Re.getProperty)(e).toString() : "/" + Ol(e);
}
ee.getErrorPath = wv;
function Rp(e, t, n = e.opts.strictSchema) {
  if (n) {
    if (t = `strict mode: ${t}`, n === !0)
      throw new Error(t);
    e.self.logger.warn(t);
  }
}
ee.checkStrictMode = Rp;
var rs = {}, Pf;
function on() {
  if (Pf) return rs;
  Pf = 1, Object.defineProperty(rs, "__esModule", { value: !0 });
  const e = ue, t = {
    // validation function arguments
    data: new e.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    // null or array of validation errors
    errors: new e.Name("errors"),
    // counter of validation errors
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return rs.default = t, rs;
}
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
  const t = ue, n = ee, r = on();
  e.keywordError = {
    message: ({ keyword: w }) => (0, t.str)`must pass "${w}" keyword validation`
  }, e.keyword$DataError = {
    message: ({ keyword: w, schemaType: E }) => E ? (0, t.str)`"${w}" keyword must be ${E} ($data)` : (0, t.str)`"${w}" keyword is invalid ($data)`
  };
  function i(w, E = e.keywordError, y, _) {
    const { it: S } = w, { gen: C, compositeRule: j, allErrors: V } = S, G = f(w, E, y);
    _ ?? (j || V) ? c(C, G) : u(S, (0, t._)`[${G}]`);
  }
  e.reportError = i;
  function o(w, E = e.keywordError, y) {
    const { it: _ } = w, { gen: S, compositeRule: C, allErrors: j } = _, V = f(w, E, y);
    c(S, V), C || j || u(_, r.default.vErrors);
  }
  e.reportExtraError = o;
  function s(w, E) {
    w.assign(r.default.errors, E), w.if((0, t._)`${r.default.vErrors} !== null`, () => w.if(E, () => w.assign((0, t._)`${r.default.vErrors}.length`, E), () => w.assign(r.default.vErrors, null)));
  }
  e.resetErrorsCount = s;
  function a({ gen: w, keyword: E, schemaValue: y, data: _, errsCount: S, it: C }) {
    if (S === void 0)
      throw new Error("ajv implementation error");
    const j = w.name("err");
    w.forRange("i", S, r.default.errors, (V) => {
      w.const(j, (0, t._)`${r.default.vErrors}[${V}]`), w.if((0, t._)`${j}.instancePath === undefined`, () => w.assign((0, t._)`${j}.instancePath`, (0, t.strConcat)(r.default.instancePath, C.errorPath))), w.assign((0, t._)`${j}.schemaPath`, (0, t.str)`${C.errSchemaPath}/${E}`), C.opts.verbose && (w.assign((0, t._)`${j}.schema`, y), w.assign((0, t._)`${j}.data`, _));
    });
  }
  e.extendErrors = a;
  function c(w, E) {
    const y = w.const("err", E);
    w.if((0, t._)`${r.default.vErrors} === null`, () => w.assign(r.default.vErrors, (0, t._)`[${y}]`), (0, t._)`${r.default.vErrors}.push(${y})`), w.code((0, t._)`${r.default.errors}++`);
  }
  function u(w, E) {
    const { gen: y, validateName: _, schemaEnv: S } = w;
    S.$async ? y.throw((0, t._)`new ${w.ValidationError}(${E})`) : (y.assign((0, t._)`${_}.errors`, E), y.return(!1));
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
  function f(w, E, y) {
    const { createErrors: _ } = w.it;
    return _ === !1 ? (0, t._)`{}` : h(w, E, y);
  }
  function h(w, E, y = {}) {
    const { gen: _, it: S } = w, C = [
      d(S, y),
      m(w, y)
    ];
    return p(w, E, C), _.object(...C);
  }
  function d({ errorPath: w }, { instancePath: E }) {
    const y = E ? (0, t.str)`${w}${(0, n.getErrorPath)(E, n.Type.Str)}` : w;
    return [r.default.instancePath, (0, t.strConcat)(r.default.instancePath, y)];
  }
  function m({ keyword: w, it: { errSchemaPath: E } }, { schemaPath: y, parentSchema: _ }) {
    let S = _ ? E : (0, t.str)`${E}/${w}`;
    return y && (S = (0, t.str)`${S}${(0, n.getErrorPath)(y, n.Type.Str)}`), [l.schemaPath, S];
  }
  function p(w, { params: E, message: y }, _) {
    const { keyword: S, data: C, schemaValue: j, it: V } = w, { opts: G, propertyName: q, topSchemaRef: b, schemaPath: M } = V;
    _.push([l.keyword, S], [l.params, typeof E == "function" ? E(w) : E || (0, t._)`{}`]), G.messages && _.push([l.message, typeof y == "function" ? y(w) : y]), G.verbose && _.push([l.schema, j], [l.parentSchema, (0, t._)`${b}${M}`], [r.default.data, C]), q && _.push([l.propertyName, q]);
  }
})(Ro);
var Of;
function Ev() {
  if (Of) return mr;
  Of = 1, Object.defineProperty(mr, "__esModule", { value: !0 }), mr.boolOrEmptySchema = mr.topBoolOrEmptySchema = void 0;
  const e = Ro, t = ue, n = on(), r = {
    message: "boolean schema is false"
  };
  function i(a) {
    const { gen: c, schema: u, validateName: l } = a;
    u === !1 ? s(a, !1) : typeof u == "object" && u.$async === !0 ? c.return(n.default.data) : (c.assign((0, t._)`${l}.errors`, null), c.return(!0));
  }
  mr.topBoolOrEmptySchema = i;
  function o(a, c) {
    const { gen: u, schema: l } = a;
    l === !1 ? (u.var(c, !1), s(a)) : u.var(c, !0);
  }
  mr.boolOrEmptySchema = o;
  function s(a, c) {
    const { gen: u, data: l } = a, f = {
      gen: u,
      keyword: "false schema",
      data: l,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: a
    };
    (0, e.reportError)(f, r, void 0, c);
  }
  return mr;
}
var Qe = {}, Ur = {};
Object.defineProperty(Ur, "__esModule", { value: !0 });
Ur.getRules = Ur.isJSONType = void 0;
const _v = ["string", "number", "integer", "boolean", "null", "object", "array"], $v = new Set(_v);
function Sv(e) {
  return typeof e == "string" && $v.has(e);
}
Ur.isJSONType = Sv;
function bv() {
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
Ur.getRules = bv;
var bn = {}, Rf;
function Dp() {
  if (Rf) return bn;
  Rf = 1, Object.defineProperty(bn, "__esModule", { value: !0 }), bn.shouldUseRule = bn.shouldUseGroup = bn.schemaHasRulesForType = void 0;
  function e({ schema: r, self: i }, o) {
    const s = i.RULES.types[o];
    return s && s !== !0 && t(r, s);
  }
  bn.schemaHasRulesForType = e;
  function t(r, i) {
    return i.rules.some((o) => n(r, o));
  }
  bn.shouldUseGroup = t;
  function n(r, i) {
    var o;
    return r[i.keyword] !== void 0 || ((o = i.definition.implements) === null || o === void 0 ? void 0 : o.some((s) => r[s] !== void 0));
  }
  return bn.shouldUseRule = n, bn;
}
Object.defineProperty(Qe, "__esModule", { value: !0 });
Qe.reportTypeError = Qe.checkDataTypes = Qe.checkDataType = Qe.coerceAndCheckDataType = Qe.getJSONTypes = Qe.getSchemaTypes = Qe.DataType = void 0;
const Av = Ur, Tv = Dp(), Cv = Ro, ge = ue, Fp = ee;
var pi;
(function(e) {
  e[e.Correct = 0] = "Correct", e[e.Wrong = 1] = "Wrong";
})(pi || (Qe.DataType = pi = {}));
function Nv(e) {
  const t = Lp(e.type);
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
Qe.getSchemaTypes = Nv;
function Lp(e) {
  const t = Array.isArray(e) ? e : e ? [e] : [];
  if (t.every(Av.isJSONType))
    return t;
  throw new Error("type must be JSONType or JSONType[]: " + t.join(","));
}
Qe.getJSONTypes = Lp;
function Iv(e, t) {
  const { gen: n, data: r, opts: i } = e, o = Pv(t, i.coerceTypes), s = t.length > 0 && !(o.length === 0 && t.length === 1 && (0, Tv.schemaHasRulesForType)(e, t[0]));
  if (s) {
    const a = Dl(t, r, i.strictNumbers, pi.Wrong);
    n.if(a, () => {
      o.length ? Ov(e, t, o) : Fl(e);
    });
  }
  return s;
}
Qe.coerceAndCheckDataType = Iv;
const xp = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
function Pv(e, t) {
  return t ? e.filter((n) => xp.has(n) || t === "array" && n === "array") : [];
}
function Ov(e, t, n) {
  const { gen: r, data: i, opts: o } = e, s = r.let("dataType", (0, ge._)`typeof ${i}`), a = r.let("coerced", (0, ge._)`undefined`);
  o.coerceTypes === "array" && r.if((0, ge._)`${s} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => r.assign(i, (0, ge._)`${i}[0]`).assign(s, (0, ge._)`typeof ${i}`).if(Dl(t, i, o.strictNumbers), () => r.assign(a, i))), r.if((0, ge._)`${a} !== undefined`);
  for (const u of n)
    (xp.has(u) || u === "array" && o.coerceTypes === "array") && c(u);
  r.else(), Fl(e), r.endIf(), r.if((0, ge._)`${a} !== undefined`, () => {
    r.assign(i, a), Rv(e, a);
  });
  function c(u) {
    switch (u) {
      case "string":
        r.elseIf((0, ge._)`${s} == "number" || ${s} == "boolean"`).assign(a, (0, ge._)`"" + ${i}`).elseIf((0, ge._)`${i} === null`).assign(a, (0, ge._)`""`);
        return;
      case "number":
        r.elseIf((0, ge._)`${s} == "boolean" || ${i} === null
              || (${s} == "string" && ${i} && ${i} == +${i})`).assign(a, (0, ge._)`+${i}`);
        return;
      case "integer":
        r.elseIf((0, ge._)`${s} === "boolean" || ${i} === null
              || (${s} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(a, (0, ge._)`+${i}`);
        return;
      case "boolean":
        r.elseIf((0, ge._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(a, !1).elseIf((0, ge._)`${i} === "true" || ${i} === 1`).assign(a, !0);
        return;
      case "null":
        r.elseIf((0, ge._)`${i} === "" || ${i} === 0 || ${i} === false`), r.assign(a, null);
        return;
      case "array":
        r.elseIf((0, ge._)`${s} === "string" || ${s} === "number"
              || ${s} === "boolean" || ${i} === null`).assign(a, (0, ge._)`[${i}]`);
    }
  }
}
function Rv({ gen: e, parentData: t, parentDataProperty: n }, r) {
  e.if((0, ge._)`${t} !== undefined`, () => e.assign((0, ge._)`${t}[${n}]`, r));
}
function el(e, t, n, r = pi.Correct) {
  const i = r === pi.Correct ? ge.operators.EQ : ge.operators.NEQ;
  let o;
  switch (e) {
    case "null":
      return (0, ge._)`${t} ${i} null`;
    case "array":
      o = (0, ge._)`Array.isArray(${t})`;
      break;
    case "object":
      o = (0, ge._)`${t} && typeof ${t} == "object" && !Array.isArray(${t})`;
      break;
    case "integer":
      o = s((0, ge._)`!(${t} % 1) && !isNaN(${t})`);
      break;
    case "number":
      o = s();
      break;
    default:
      return (0, ge._)`typeof ${t} ${i} ${e}`;
  }
  return r === pi.Correct ? o : (0, ge.not)(o);
  function s(a = ge.nil) {
    return (0, ge.and)((0, ge._)`typeof ${t} == "number"`, a, n ? (0, ge._)`isFinite(${t})` : ge.nil);
  }
}
Qe.checkDataType = el;
function Dl(e, t, n, r) {
  if (e.length === 1)
    return el(e[0], t, n, r);
  let i;
  const o = (0, Fp.toHash)(e);
  if (o.array && o.object) {
    const s = (0, ge._)`typeof ${t} != "object"`;
    i = o.null ? s : (0, ge._)`!${t} || ${s}`, delete o.null, delete o.array, delete o.object;
  } else
    i = ge.nil;
  o.number && delete o.integer;
  for (const s in o)
    i = (0, ge.and)(i, el(s, t, n, r));
  return i;
}
Qe.checkDataTypes = Dl;
const Dv = {
  message: ({ schema: e }) => `must be ${e}`,
  params: ({ schema: e, schemaValue: t }) => typeof e == "string" ? (0, ge._)`{type: ${e}}` : (0, ge._)`{type: ${t}}`
};
function Fl(e) {
  const t = Fv(e);
  (0, Cv.reportError)(t, Dv);
}
Qe.reportTypeError = Fl;
function Fv(e) {
  const { gen: t, data: n, schema: r } = e, i = (0, Fp.schemaRefOrVal)(e, r, "type");
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
var zi = {}, Df;
function Lv() {
  if (Df) return zi;
  Df = 1, Object.defineProperty(zi, "__esModule", { value: !0 }), zi.assignDefaults = void 0;
  const e = ue, t = ee;
  function n(i, o) {
    const { properties: s, items: a } = i.schema;
    if (o === "object" && s)
      for (const c in s)
        r(i, c, s[c].default);
    else o === "array" && Array.isArray(a) && a.forEach((c, u) => r(i, u, c.default));
  }
  zi.assignDefaults = n;
  function r(i, o, s) {
    const { gen: a, compositeRule: c, data: u, opts: l } = i;
    if (s === void 0)
      return;
    const f = (0, e._)`${u}${(0, e.getProperty)(o)}`;
    if (c) {
      (0, t.checkStrictMode)(i, `default is ignored for: ${f}`);
      return;
    }
    let h = (0, e._)`${f} === undefined`;
    l.useDefaults === "empty" && (h = (0, e._)`${h} || ${f} === null || ${f} === ""`), a.if(h, (0, e._)`${f} = ${(0, e.stringify)(s)}`);
  }
  return zi;
}
var Yt = {}, we = {};
Object.defineProperty(we, "__esModule", { value: !0 });
we.validateUnion = we.validateArray = we.usePattern = we.callValidateCode = we.schemaProperties = we.allSchemaProperties = we.noPropertyInData = we.propertyInData = we.isOwnProperty = we.hasPropFunc = we.reportMissingProp = we.checkMissingProp = we.checkReportMissingProp = void 0;
const xe = ue, Ll = ee, Mn = on(), xv = ee;
function kv(e, t) {
  const { gen: n, data: r, it: i } = e;
  n.if(kl(n, r, t, i.opts.ownProperties), () => {
    e.setParams({ missingProperty: (0, xe._)`${t}` }, !0), e.error();
  });
}
we.checkReportMissingProp = kv;
function Uv({ gen: e, data: t, it: { opts: n } }, r, i) {
  return (0, xe.or)(...r.map((o) => (0, xe.and)(kl(e, t, o, n.ownProperties), (0, xe._)`${i} = ${o}`)));
}
we.checkMissingProp = Uv;
function jv(e, t) {
  e.setParams({ missingProperty: t }, !0), e.error();
}
we.reportMissingProp = jv;
function kp(e) {
  return e.scopeValue("func", {
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ref: Object.prototype.hasOwnProperty,
    code: (0, xe._)`Object.prototype.hasOwnProperty`
  });
}
we.hasPropFunc = kp;
function xl(e, t, n) {
  return (0, xe._)`${kp(e)}.call(${t}, ${n})`;
}
we.isOwnProperty = xl;
function Mv(e, t, n, r) {
  const i = (0, xe._)`${t}${(0, xe.getProperty)(n)} !== undefined`;
  return r ? (0, xe._)`${i} && ${xl(e, t, n)}` : i;
}
we.propertyInData = Mv;
function kl(e, t, n, r) {
  const i = (0, xe._)`${t}${(0, xe.getProperty)(n)} === undefined`;
  return r ? (0, xe.or)(i, (0, xe.not)(xl(e, t, n))) : i;
}
we.noPropertyInData = kl;
function Up(e) {
  return e ? Object.keys(e).filter((t) => t !== "__proto__") : [];
}
we.allSchemaProperties = Up;
function Bv(e, t) {
  return Up(t).filter((n) => !(0, Ll.alwaysValidSchema)(e, t[n]));
}
we.schemaProperties = Bv;
function Hv({ schemaCode: e, data: t, it: { gen: n, topSchemaRef: r, schemaPath: i, errorPath: o }, it: s }, a, c, u) {
  const l = u ? (0, xe._)`${e}, ${t}, ${r}${i}` : t, f = [
    [Mn.default.instancePath, (0, xe.strConcat)(Mn.default.instancePath, o)],
    [Mn.default.parentData, s.parentData],
    [Mn.default.parentDataProperty, s.parentDataProperty],
    [Mn.default.rootData, Mn.default.rootData]
  ];
  s.opts.dynamicRef && f.push([Mn.default.dynamicAnchors, Mn.default.dynamicAnchors]);
  const h = (0, xe._)`${l}, ${n.object(...f)}`;
  return c !== xe.nil ? (0, xe._)`${a}.call(${c}, ${h})` : (0, xe._)`${a}(${h})`;
}
we.callValidateCode = Hv;
const qv = (0, xe._)`new RegExp`;
function zv({ gen: e, it: { opts: t } }, n) {
  const r = t.unicodeRegExp ? "u" : "", { regExp: i } = t.code, o = i(n, r);
  return e.scopeValue("pattern", {
    key: o.toString(),
    ref: o,
    code: (0, xe._)`${i.code === "new RegExp" ? qv : (0, xv.useFunc)(e, i)}(${n}, ${r})`
  });
}
we.usePattern = zv;
function Vv(e) {
  const { gen: t, data: n, keyword: r, it: i } = e, o = t.name("valid");
  if (i.allErrors) {
    const a = t.let("valid", !0);
    return s(() => t.assign(a, !1)), a;
  }
  return t.var(o, !0), s(() => t.break()), o;
  function s(a) {
    const c = t.const("len", (0, xe._)`${n}.length`);
    t.forRange("i", 0, c, (u) => {
      e.subschema({
        keyword: r,
        dataProp: u,
        dataPropType: Ll.Type.Num
      }, o), t.if((0, xe.not)(o), a);
    });
  }
}
we.validateArray = Vv;
function Gv(e) {
  const { gen: t, schema: n, keyword: r, it: i } = e;
  if (!Array.isArray(n))
    throw new Error("ajv implementation error");
  if (n.some((c) => (0, Ll.alwaysValidSchema)(i, c)) && !i.opts.unevaluated)
    return;
  const s = t.let("valid", !1), a = t.name("_valid");
  t.block(() => n.forEach((c, u) => {
    const l = e.subschema({
      keyword: r,
      schemaProp: u,
      compositeRule: !0
    }, a);
    t.assign(s, (0, xe._)`${s} || ${a}`), e.mergeValidEvaluated(l, a) || t.if((0, xe.not)(s));
  })), e.result(s, () => e.reset(), () => e.error(!0));
}
we.validateUnion = Gv;
var Ff;
function Wv() {
  if (Ff) return Yt;
  Ff = 1, Object.defineProperty(Yt, "__esModule", { value: !0 }), Yt.validateKeywordUsage = Yt.validSchemaType = Yt.funcKeywordCode = Yt.macroKeywordCode = void 0;
  const e = ue, t = on(), n = we, r = Ro;
  function i(h, d) {
    const { gen: m, keyword: p, schema: w, parentSchema: E, it: y } = h, _ = d.macro.call(y.self, w, E, y), S = u(m, p, _);
    y.opts.validateSchema !== !1 && y.self.validateSchema(_, !0);
    const C = m.name("valid");
    h.subschema({
      schema: _,
      schemaPath: e.nil,
      errSchemaPath: `${y.errSchemaPath}/${p}`,
      topSchemaRef: S,
      compositeRule: !0
    }, C), h.pass(C, () => h.error(!0));
  }
  Yt.macroKeywordCode = i;
  function o(h, d) {
    var m;
    const { gen: p, keyword: w, schema: E, parentSchema: y, $data: _, it: S } = h;
    c(S, d);
    const C = !_ && d.compile ? d.compile.call(S.self, E, y, S) : d.validate, j = u(p, w, C), V = p.let("valid");
    h.block$data(V, G), h.ok((m = d.valid) !== null && m !== void 0 ? m : V);
    function G() {
      if (d.errors === !1)
        M(), d.modifying && s(h), W(() => h.error());
      else {
        const X = d.async ? q() : b();
        d.modifying && s(h), W(() => a(h, X));
      }
    }
    function q() {
      const X = p.let("ruleErrs", null);
      return p.try(() => M((0, e._)`await `), (L) => p.assign(V, !1).if((0, e._)`${L} instanceof ${S.ValidationError}`, () => p.assign(X, (0, e._)`${L}.errors`), () => p.throw(L))), X;
    }
    function b() {
      const X = (0, e._)`${j}.errors`;
      return p.assign(X, null), M(e.nil), X;
    }
    function M(X = d.async ? (0, e._)`await ` : e.nil) {
      const L = S.opts.passContext ? t.default.this : t.default.self, U = !("compile" in d && !_ || d.schema === !1);
      p.assign(V, (0, e._)`${X}${(0, n.callValidateCode)(h, j, L, U)}`, d.modifying);
    }
    function W(X) {
      var L;
      p.if((0, e.not)((L = d.valid) !== null && L !== void 0 ? L : V), X);
    }
  }
  Yt.funcKeywordCode = o;
  function s(h) {
    const { gen: d, data: m, it: p } = h;
    d.if(p.parentData, () => d.assign(m, (0, e._)`${p.parentData}[${p.parentDataProperty}]`));
  }
  function a(h, d) {
    const { gen: m } = h;
    m.if((0, e._)`Array.isArray(${d})`, () => {
      m.assign(t.default.vErrors, (0, e._)`${t.default.vErrors} === null ? ${d} : ${t.default.vErrors}.concat(${d})`).assign(t.default.errors, (0, e._)`${t.default.vErrors}.length`), (0, r.extendErrors)(h);
    }, () => h.error());
  }
  function c({ schemaEnv: h }, d) {
    if (d.async && !h.$async)
      throw new Error("async keyword in sync schema");
  }
  function u(h, d, m) {
    if (m === void 0)
      throw new Error(`keyword "${d}" failed to compile`);
    return h.scopeValue("keyword", typeof m == "function" ? { ref: m } : { ref: m, code: (0, e.stringify)(m) });
  }
  function l(h, d, m = !1) {
    return !d.length || d.some((p) => p === "array" ? Array.isArray(h) : p === "object" ? h && typeof h == "object" && !Array.isArray(h) : typeof h == p || m && typeof h > "u");
  }
  Yt.validSchemaType = l;
  function f({ schema: h, opts: d, self: m, errSchemaPath: p }, w, E) {
    if (Array.isArray(w.keyword) ? !w.keyword.includes(E) : w.keyword !== E)
      throw new Error("ajv implementation error");
    const y = w.dependencies;
    if (y != null && y.some((_) => !Object.prototype.hasOwnProperty.call(h, _)))
      throw new Error(`parent schema must have dependencies of ${E}: ${y.join(",")}`);
    if (w.validateSchema && !w.validateSchema(h[E])) {
      const S = `keyword "${E}" value is invalid at path "${p}": ` + m.errorsText(w.validateSchema.errors);
      if (d.validateSchema === "log")
        m.logger.error(S);
      else
        throw new Error(S);
    }
  }
  return Yt.validateKeywordUsage = f, Yt;
}
var An = {}, Lf;
function Kv() {
  if (Lf) return An;
  Lf = 1, Object.defineProperty(An, "__esModule", { value: !0 }), An.extendSubschemaMode = An.extendSubschemaData = An.getSubschema = void 0;
  const e = ue, t = ee;
  function n(o, { keyword: s, schemaProp: a, schema: c, schemaPath: u, errSchemaPath: l, topSchemaRef: f }) {
    if (s !== void 0 && c !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (s !== void 0) {
      const h = o.schema[s];
      return a === void 0 ? {
        schema: h,
        schemaPath: (0, e._)`${o.schemaPath}${(0, e.getProperty)(s)}`,
        errSchemaPath: `${o.errSchemaPath}/${s}`
      } : {
        schema: h[a],
        schemaPath: (0, e._)`${o.schemaPath}${(0, e.getProperty)(s)}${(0, e.getProperty)(a)}`,
        errSchemaPath: `${o.errSchemaPath}/${s}/${(0, t.escapeFragment)(a)}`
      };
    }
    if (c !== void 0) {
      if (u === void 0 || l === void 0 || f === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: c,
        schemaPath: u,
        topSchemaRef: f,
        errSchemaPath: l
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  An.getSubschema = n;
  function r(o, s, { dataProp: a, dataPropType: c, data: u, dataTypes: l, propertyName: f }) {
    if (u !== void 0 && a !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: h } = s;
    if (a !== void 0) {
      const { errorPath: m, dataPathArr: p, opts: w } = s, E = h.let("data", (0, e._)`${s.data}${(0, e.getProperty)(a)}`, !0);
      d(E), o.errorPath = (0, e.str)`${m}${(0, t.getErrorPath)(a, c, w.jsPropertySyntax)}`, o.parentDataProperty = (0, e._)`${a}`, o.dataPathArr = [...p, o.parentDataProperty];
    }
    if (u !== void 0) {
      const m = u instanceof e.Name ? u : h.let("data", u, !0);
      d(m), f !== void 0 && (o.propertyName = f);
    }
    l && (o.dataTypes = l);
    function d(m) {
      o.data = m, o.dataLevel = s.dataLevel + 1, o.dataTypes = [], s.definedProperties = /* @__PURE__ */ new Set(), o.parentData = s.data, o.dataNames = [...s.dataNames, m];
    }
  }
  An.extendSubschemaData = r;
  function i(o, { jtdDiscriminator: s, jtdMetadata: a, compositeRule: c, createErrors: u, allErrors: l }) {
    c !== void 0 && (o.compositeRule = c), u !== void 0 && (o.createErrors = u), l !== void 0 && (o.allErrors = l), o.jtdDiscriminator = s, o.jtdMetadata = a;
  }
  return An.extendSubschemaMode = i, An;
}
var ct = {}, jp = function e(t, n) {
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
}, Mp = { exports: {} }, Zn = Mp.exports = function(e, t, n) {
  typeof t == "function" && (n = t, t = {}), n = t.cb || n;
  var r = typeof n == "function" ? n : n.pre || function() {
  }, i = n.post || function() {
  };
  Ds(t, r, i, e, "", e);
};
Zn.keywords = {
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
Zn.arrayKeywords = {
  items: !0,
  allOf: !0,
  anyOf: !0,
  oneOf: !0
};
Zn.propsKeywords = {
  $defs: !0,
  definitions: !0,
  properties: !0,
  patternProperties: !0,
  dependencies: !0
};
Zn.skipKeywords = {
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
function Ds(e, t, n, r, i, o, s, a, c, u) {
  if (r && typeof r == "object" && !Array.isArray(r)) {
    t(r, i, o, s, a, c, u);
    for (var l in r) {
      var f = r[l];
      if (Array.isArray(f)) {
        if (l in Zn.arrayKeywords)
          for (var h = 0; h < f.length; h++)
            Ds(e, t, n, f[h], i + "/" + l + "/" + h, o, i, l, r, h);
      } else if (l in Zn.propsKeywords) {
        if (f && typeof f == "object")
          for (var d in f)
            Ds(e, t, n, f[d], i + "/" + l + "/" + Jv(d), o, i, l, r, d);
      } else (l in Zn.keywords || e.allKeys && !(l in Zn.skipKeywords)) && Ds(e, t, n, f, i + "/" + l, o, i, l, r);
    }
    n(r, i, o, s, a, c, u);
  }
}
function Jv(e) {
  return e.replace(/~/g, "~0").replace(/\//g, "~1");
}
var Yv = Mp.exports;
Object.defineProperty(ct, "__esModule", { value: !0 });
ct.getSchemaRefs = ct.resolveUrl = ct.normalizeId = ct._getFullPath = ct.getFullPath = ct.inlineRef = void 0;
const Xv = ee, Zv = jp, Qv = Yv, ew = /* @__PURE__ */ new Set([
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
function tw(e, t = !0) {
  return typeof e == "boolean" ? !0 : t === !0 ? !tl(e) : t ? Bp(e) <= t : !1;
}
ct.inlineRef = tw;
const nw = /* @__PURE__ */ new Set([
  "$ref",
  "$recursiveRef",
  "$recursiveAnchor",
  "$dynamicRef",
  "$dynamicAnchor"
]);
function tl(e) {
  for (const t in e) {
    if (nw.has(t))
      return !0;
    const n = e[t];
    if (Array.isArray(n) && n.some(tl) || typeof n == "object" && tl(n))
      return !0;
  }
  return !1;
}
function Bp(e) {
  let t = 0;
  for (const n in e) {
    if (n === "$ref")
      return 1 / 0;
    if (t++, !ew.has(n) && (typeof e[n] == "object" && (0, Xv.eachItem)(e[n], (r) => t += Bp(r)), t === 1 / 0))
      return 1 / 0;
  }
  return t;
}
function Hp(e, t = "", n) {
  n !== !1 && (t = mi(t));
  const r = e.parse(t);
  return qp(e, r);
}
ct.getFullPath = Hp;
function qp(e, t) {
  return e.serialize(t).split("#")[0] + "#";
}
ct._getFullPath = qp;
const rw = /#\/?$/;
function mi(e) {
  return e ? e.replace(rw, "") : "";
}
ct.normalizeId = mi;
function iw(e, t, n) {
  return n = mi(n), e.resolve(t, n);
}
ct.resolveUrl = iw;
const ow = /^[a-z_][-a-z0-9._]*$/i;
function sw(e, t) {
  if (typeof e == "boolean")
    return {};
  const { schemaId: n, uriResolver: r } = this.opts, i = mi(e[n] || t), o = { "": i }, s = Hp(r, i, !1), a = {}, c = /* @__PURE__ */ new Set();
  return Qv(e, { allKeys: !0 }, (f, h, d, m) => {
    if (m === void 0)
      return;
    const p = s + h;
    let w = o[m];
    typeof f[n] == "string" && (w = E.call(this, f[n])), y.call(this, f.$anchor), y.call(this, f.$dynamicAnchor), o[h] = w;
    function E(_) {
      const S = this.opts.uriResolver.resolve;
      if (_ = mi(w ? S(w, _) : _), c.has(_))
        throw l(_);
      c.add(_);
      let C = this.refs[_];
      return typeof C == "string" && (C = this.refs[C]), typeof C == "object" ? u(f, C.schema, _) : _ !== mi(p) && (_[0] === "#" ? (u(f, a[_], _), a[_] = f) : this.refs[_] = p), _;
    }
    function y(_) {
      if (typeof _ == "string") {
        if (!ow.test(_))
          throw new Error(`invalid anchor "${_}"`);
        E.call(this, `#${_}`);
      }
    }
  }), a;
  function u(f, h, d) {
    if (h !== void 0 && !Zv(f, h))
      throw l(d);
  }
  function l(f) {
    return new Error(`reference "${f}" resolves to more than one schema`);
  }
}
ct.getSchemaRefs = sw;
var xf;
function Do() {
  if (xf) return Sn;
  xf = 1, Object.defineProperty(Sn, "__esModule", { value: !0 }), Sn.getData = Sn.KeywordCxt = Sn.validateFunctionCode = void 0;
  const e = Ev(), t = Qe, n = Dp(), r = Qe, i = Lv(), o = Wv(), s = Kv(), a = ue, c = on(), u = ct, l = ee, f = Ro;
  function h(O) {
    if (C(O) && (V(O), S(O))) {
      w(O);
      return;
    }
    d(O, () => (0, e.topBoolOrEmptySchema)(O));
  }
  Sn.validateFunctionCode = h;
  function d({ gen: O, validateName: v, schema: g, schemaEnv: I, opts: N }, te) {
    N.code.es5 ? O.func(v, (0, a._)`${c.default.data}, ${c.default.valCxt}`, I.$async, () => {
      O.code((0, a._)`"use strict"; ${y(g, N)}`), p(O, N), O.code(te);
    }) : O.func(v, (0, a._)`${c.default.data}, ${m(N)}`, I.$async, () => O.code(y(g, N)).code(te));
  }
  function m(O) {
    return (0, a._)`{${c.default.instancePath}="", ${c.default.parentData}, ${c.default.parentDataProperty}, ${c.default.rootData}=${c.default.data}${O.dynamicRef ? (0, a._)`, ${c.default.dynamicAnchors}={}` : a.nil}}={}`;
  }
  function p(O, v) {
    O.if(c.default.valCxt, () => {
      O.var(c.default.instancePath, (0, a._)`${c.default.valCxt}.${c.default.instancePath}`), O.var(c.default.parentData, (0, a._)`${c.default.valCxt}.${c.default.parentData}`), O.var(c.default.parentDataProperty, (0, a._)`${c.default.valCxt}.${c.default.parentDataProperty}`), O.var(c.default.rootData, (0, a._)`${c.default.valCxt}.${c.default.rootData}`), v.dynamicRef && O.var(c.default.dynamicAnchors, (0, a._)`${c.default.valCxt}.${c.default.dynamicAnchors}`);
    }, () => {
      O.var(c.default.instancePath, (0, a._)`""`), O.var(c.default.parentData, (0, a._)`undefined`), O.var(c.default.parentDataProperty, (0, a._)`undefined`), O.var(c.default.rootData, c.default.data), v.dynamicRef && O.var(c.default.dynamicAnchors, (0, a._)`{}`);
    });
  }
  function w(O) {
    const { schema: v, opts: g, gen: I } = O;
    d(O, () => {
      g.$comment && v.$comment && X(O), b(O), I.let(c.default.vErrors, null), I.let(c.default.errors, 0), g.unevaluated && E(O), G(O), L(O);
    });
  }
  function E(O) {
    const { gen: v, validateName: g } = O;
    O.evaluated = v.const("evaluated", (0, a._)`${g}.evaluated`), v.if((0, a._)`${O.evaluated}.dynamicProps`, () => v.assign((0, a._)`${O.evaluated}.props`, (0, a._)`undefined`)), v.if((0, a._)`${O.evaluated}.dynamicItems`, () => v.assign((0, a._)`${O.evaluated}.items`, (0, a._)`undefined`));
  }
  function y(O, v) {
    const g = typeof O == "object" && O[v.schemaId];
    return g && (v.code.source || v.code.process) ? (0, a._)`/*# sourceURL=${g} */` : a.nil;
  }
  function _(O, v) {
    if (C(O) && (V(O), S(O))) {
      j(O, v);
      return;
    }
    (0, e.boolOrEmptySchema)(O, v);
  }
  function S({ schema: O, self: v }) {
    if (typeof O == "boolean")
      return !O;
    for (const g in O)
      if (v.RULES.all[g])
        return !0;
    return !1;
  }
  function C(O) {
    return typeof O.schema != "boolean";
  }
  function j(O, v) {
    const { schema: g, gen: I, opts: N } = O;
    N.$comment && g.$comment && X(O), M(O), W(O);
    const te = I.const("_errs", c.default.errors);
    G(O, te), I.var(v, (0, a._)`${te} === ${c.default.errors}`);
  }
  function V(O) {
    (0, l.checkUnknownRules)(O), q(O);
  }
  function G(O, v) {
    if (O.opts.jtd)
      return K(O, [], !1, v);
    const g = (0, t.getSchemaTypes)(O.schema), I = (0, t.coerceAndCheckDataType)(O, g);
    K(O, g, !I, v);
  }
  function q(O) {
    const { schema: v, errSchemaPath: g, opts: I, self: N } = O;
    v.$ref && I.ignoreKeywordsWithRef && (0, l.schemaHasRulesButRef)(v, N.RULES) && N.logger.warn(`$ref: keywords ignored in schema at path "${g}"`);
  }
  function b(O) {
    const { schema: v, opts: g } = O;
    v.default !== void 0 && g.useDefaults && g.strictSchema && (0, l.checkStrictMode)(O, "default is ignored in the schema root");
  }
  function M(O) {
    const v = O.schema[O.opts.schemaId];
    v && (O.baseId = (0, u.resolveUrl)(O.opts.uriResolver, O.baseId, v));
  }
  function W(O) {
    if (O.schema.$async && !O.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function X({ gen: O, schemaEnv: v, schema: g, errSchemaPath: I, opts: N }) {
    const te = g.$comment;
    if (N.$comment === !0)
      O.code((0, a._)`${c.default.self}.logger.log(${te})`);
    else if (typeof N.$comment == "function") {
      const fe = (0, a.str)`${I}/$comment`, _e = O.scopeValue("root", { ref: v.root });
      O.code((0, a._)`${c.default.self}.opts.$comment(${te}, ${fe}, ${_e}.schema)`);
    }
  }
  function L(O) {
    const { gen: v, schemaEnv: g, validateName: I, ValidationError: N, opts: te } = O;
    g.$async ? v.if((0, a._)`${c.default.errors} === 0`, () => v.return(c.default.data), () => v.throw((0, a._)`new ${N}(${c.default.vErrors})`)) : (v.assign((0, a._)`${I}.errors`, c.default.vErrors), te.unevaluated && U(O), v.return((0, a._)`${c.default.errors} === 0`));
  }
  function U({ gen: O, evaluated: v, props: g, items: I }) {
    g instanceof a.Name && O.assign((0, a._)`${v}.props`, g), I instanceof a.Name && O.assign((0, a._)`${v}.items`, I);
  }
  function K(O, v, g, I) {
    const { gen: N, schema: te, data: fe, allErrors: _e, opts: $e, self: ve } = O, { RULES: Ae } = ve;
    if (te.$ref && ($e.ignoreKeywordsWithRef || !(0, l.schemaHasRulesButRef)(te, Ae))) {
      N.block(() => ie(O, "$ref", Ae.all.$ref.definition));
      return;
    }
    $e.jtd || Z(O, v), N.block(() => {
      for (const Oe of Ae.rules)
        Ie(Oe);
      Ie(Ae.post);
    });
    function Ie(Oe) {
      (0, n.shouldUseGroup)(te, Oe) && (Oe.type ? (N.if((0, r.checkDataType)(Oe.type, fe, $e.strictNumbers)), z(O, Oe), v.length === 1 && v[0] === Oe.type && g && (N.else(), (0, r.reportTypeError)(O)), N.endIf()) : z(O, Oe), _e || N.if((0, a._)`${c.default.errors} === ${I || 0}`));
    }
  }
  function z(O, v) {
    const { gen: g, schema: I, opts: { useDefaults: N } } = O;
    N && (0, i.assignDefaults)(O, v.type), g.block(() => {
      for (const te of v.rules)
        (0, n.shouldUseRule)(I, te) && ie(O, te.keyword, te.definition, v.type);
    });
  }
  function Z(O, v) {
    O.schemaEnv.meta || !O.opts.strictTypes || (J(O, v), O.opts.allowUnionTypes || B(O, v), P(O, O.dataTypes));
  }
  function J(O, v) {
    if (v.length) {
      if (!O.dataTypes.length) {
        O.dataTypes = v;
        return;
      }
      v.forEach((g) => {
        D(O.dataTypes, g) || T(O, `type "${g}" not allowed by context "${O.dataTypes.join(",")}"`);
      }), $(O, v);
    }
  }
  function B(O, v) {
    v.length > 1 && !(v.length === 2 && v.includes("null")) && T(O, "use allowUnionTypes to allow union type keyword");
  }
  function P(O, v) {
    const g = O.self.RULES.all;
    for (const I in g) {
      const N = g[I];
      if (typeof N == "object" && (0, n.shouldUseRule)(O.schema, N)) {
        const { type: te } = N.definition;
        te.length && !te.some((fe) => F(v, fe)) && T(O, `missing type "${te.join(",")}" for keyword "${I}"`);
      }
    }
  }
  function F(O, v) {
    return O.includes(v) || v === "number" && O.includes("integer");
  }
  function D(O, v) {
    return O.includes(v) || v === "integer" && O.includes("number");
  }
  function $(O, v) {
    const g = [];
    for (const I of O.dataTypes)
      D(v, I) ? g.push(I) : v.includes("integer") && I === "number" && g.push("integer");
    O.dataTypes = g;
  }
  function T(O, v) {
    const g = O.schemaEnv.baseId + O.errSchemaPath;
    v += ` at "${g}" (strictTypes)`, (0, l.checkStrictMode)(O, v, O.opts.strictTypes);
  }
  class H {
    constructor(v, g, I) {
      if ((0, o.validateKeywordUsage)(v, g, I), this.gen = v.gen, this.allErrors = v.allErrors, this.keyword = I, this.data = v.data, this.schema = v.schema[I], this.$data = g.$data && v.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, l.schemaRefOrVal)(v, this.schema, I, this.$data), this.schemaType = g.schemaType, this.parentSchema = v.schema, this.params = {}, this.it = v, this.def = g, this.$data)
        this.schemaCode = v.gen.const("vSchema", le(this.$data, v));
      else if (this.schemaCode = this.schemaValue, !(0, o.validSchemaType)(this.schema, g.schemaType, g.allowUndefined))
        throw new Error(`${I} value must be ${JSON.stringify(g.schemaType)}`);
      ("code" in g ? g.trackErrors : g.errors !== !1) && (this.errsCount = v.gen.const("_errs", c.default.errors));
    }
    result(v, g, I) {
      this.failResult((0, a.not)(v), g, I);
    }
    failResult(v, g, I) {
      this.gen.if(v), I ? I() : this.error(), g ? (this.gen.else(), g(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(v, g) {
      this.failResult((0, a.not)(v), void 0, g);
    }
    fail(v) {
      if (v === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(v), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(v) {
      if (!this.$data)
        return this.fail(v);
      const { schemaCode: g } = this;
      this.fail((0, a._)`${g} !== undefined && (${(0, a.or)(this.invalid$data(), v)})`);
    }
    error(v, g, I) {
      if (g) {
        this.setParams(g), this._error(v, I), this.setParams({});
        return;
      }
      this._error(v, I);
    }
    _error(v, g) {
      (v ? f.reportExtraError : f.reportError)(this, this.def.error, g);
    }
    $dataError() {
      (0, f.reportError)(this, this.def.$dataError || f.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, f.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(v) {
      this.allErrors || this.gen.if(v);
    }
    setParams(v, g) {
      g ? Object.assign(this.params, v) : this.params = v;
    }
    block$data(v, g, I = a.nil) {
      this.gen.block(() => {
        this.check$data(v, I), g();
      });
    }
    check$data(v = a.nil, g = a.nil) {
      if (!this.$data)
        return;
      const { gen: I, schemaCode: N, schemaType: te, def: fe } = this;
      I.if((0, a.or)((0, a._)`${N} === undefined`, g)), v !== a.nil && I.assign(v, !0), (te.length || fe.validateSchema) && (I.elseIf(this.invalid$data()), this.$dataError(), v !== a.nil && I.assign(v, !1)), I.else();
    }
    invalid$data() {
      const { gen: v, schemaCode: g, schemaType: I, def: N, it: te } = this;
      return (0, a.or)(fe(), _e());
      function fe() {
        if (I.length) {
          if (!(g instanceof a.Name))
            throw new Error("ajv implementation error");
          const $e = Array.isArray(I) ? I : [I];
          return (0, a._)`${(0, r.checkDataTypes)($e, g, te.opts.strictNumbers, r.DataType.Wrong)}`;
        }
        return a.nil;
      }
      function _e() {
        if (N.validateSchema) {
          const $e = v.scopeValue("validate$data", { ref: N.validateSchema });
          return (0, a._)`!${$e}(${g})`;
        }
        return a.nil;
      }
    }
    subschema(v, g) {
      const I = (0, s.getSubschema)(this.it, v);
      (0, s.extendSubschemaData)(I, this.it, v), (0, s.extendSubschemaMode)(I, v);
      const N = { ...this.it, ...I, items: void 0, props: void 0 };
      return _(N, g), N;
    }
    mergeEvaluated(v, g) {
      const { it: I, gen: N } = this;
      I.opts.unevaluated && (I.props !== !0 && v.props !== void 0 && (I.props = l.mergeEvaluated.props(N, v.props, I.props, g)), I.items !== !0 && v.items !== void 0 && (I.items = l.mergeEvaluated.items(N, v.items, I.items, g)));
    }
    mergeValidEvaluated(v, g) {
      const { it: I, gen: N } = this;
      if (I.opts.unevaluated && (I.props !== !0 || I.items !== !0))
        return N.if(g, () => this.mergeEvaluated(v, a.Name)), !0;
    }
  }
  Sn.KeywordCxt = H;
  function ie(O, v, g, I) {
    const N = new H(O, g, v);
    "code" in g ? g.code(N, I) : N.$data && g.validate ? (0, o.funcKeywordCode)(N, g) : "macro" in g ? (0, o.macroKeywordCode)(N, g) : (g.compile || g.validate) && (0, o.funcKeywordCode)(N, g);
  }
  const ne = /^\/(?:[^~]|~0|~1)*$/, ye = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function le(O, { dataLevel: v, dataNames: g, dataPathArr: I }) {
    let N, te;
    if (O === "")
      return c.default.rootData;
    if (O[0] === "/") {
      if (!ne.test(O))
        throw new Error(`Invalid JSON-pointer: ${O}`);
      N = O, te = c.default.rootData;
    } else {
      const ve = ye.exec(O);
      if (!ve)
        throw new Error(`Invalid JSON-pointer: ${O}`);
      const Ae = +ve[1];
      if (N = ve[2], N === "#") {
        if (Ae >= v)
          throw new Error($e("property/index", Ae));
        return I[v - Ae];
      }
      if (Ae > v)
        throw new Error($e("data", Ae));
      if (te = g[v - Ae], !N)
        return te;
    }
    let fe = te;
    const _e = N.split("/");
    for (const ve of _e)
      ve && (te = (0, a._)`${te}${(0, a.getProperty)((0, l.unescapeJsonPointer)(ve))}`, fe = (0, a._)`${fe} && ${te}`);
    return fe;
    function $e(ve, Ae) {
      return `Cannot access ${ve} ${Ae} levels up, current level is ${v}`;
    }
  }
  return Sn.getData = le, Sn;
}
var bi = {};
Object.defineProperty(bi, "__esModule", { value: !0 });
class aw extends Error {
  constructor(t) {
    super("validation failed"), this.errors = t, this.ajv = this.validation = !0;
  }
}
bi.default = aw;
var Hr = {};
Object.defineProperty(Hr, "__esModule", { value: !0 });
const ic = ct;
class cw extends Error {
  constructor(t, n, r, i) {
    super(i || `can't resolve reference ${r} from id ${n}`), this.missingRef = (0, ic.resolveUrl)(t, n, r), this.missingSchema = (0, ic.normalizeId)((0, ic.getFullPath)(t, this.missingRef));
  }
}
Hr.default = cw;
var St = {};
Object.defineProperty(St, "__esModule", { value: !0 });
St.resolveSchema = St.getCompilingSchema = St.resolveRef = St.compileSchema = St.SchemaEnv = void 0;
const Xt = ue, lw = bi, gr = on(), nn = ct, kf = ee, uw = Do();
class da {
  constructor(t) {
    var n;
    this.refs = {}, this.dynamicAnchors = {};
    let r;
    typeof t.schema == "object" && (r = t.schema), this.schema = t.schema, this.schemaId = t.schemaId, this.root = t.root || this, this.baseId = (n = t.baseId) !== null && n !== void 0 ? n : (0, nn.normalizeId)(r == null ? void 0 : r[t.schemaId || "$id"]), this.schemaPath = t.schemaPath, this.localRefs = t.localRefs, this.meta = t.meta, this.$async = r == null ? void 0 : r.$async, this.refs = {};
  }
}
St.SchemaEnv = da;
function Ul(e) {
  const t = zp.call(this, e);
  if (t)
    return t;
  const n = (0, nn.getFullPath)(this.opts.uriResolver, e.root.baseId), { es5: r, lines: i } = this.opts.code, { ownProperties: o } = this.opts, s = new Xt.CodeGen(this.scope, { es5: r, lines: i, ownProperties: o });
  let a;
  e.$async && (a = s.scopeValue("Error", {
    ref: lw.default,
    code: (0, Xt._)`require("ajv/dist/runtime/validation_error").default`
  }));
  const c = s.scopeName("validate");
  e.validateName = c;
  const u = {
    gen: s,
    allErrors: this.opts.allErrors,
    data: gr.default.data,
    parentData: gr.default.parentData,
    parentDataProperty: gr.default.parentDataProperty,
    dataNames: [gr.default.data],
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
    this._compilations.add(e), (0, uw.validateFunctionCode)(u), s.optimize(this.opts.code.optimize);
    const f = s.toString();
    l = `${s.scopeRefs(gr.default.scope)}return ${f}`, this.opts.code.process && (l = this.opts.code.process(l, e));
    const d = new Function(`${gr.default.self}`, `${gr.default.scope}`, l)(this, this.scope.get());
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
St.compileSchema = Ul;
function fw(e, t, n) {
  var r;
  n = (0, nn.resolveUrl)(this.opts.uriResolver, t, n);
  const i = e.refs[n];
  if (i)
    return i;
  let o = pw.call(this, e, n);
  if (o === void 0) {
    const s = (r = e.localRefs) === null || r === void 0 ? void 0 : r[n], { schemaId: a } = this.opts;
    s && (o = new da({ schema: s, schemaId: a, root: e, baseId: t }));
  }
  if (o !== void 0)
    return e.refs[n] = dw.call(this, o);
}
St.resolveRef = fw;
function dw(e) {
  return (0, nn.inlineRef)(e.schema, this.opts.inlineRefs) ? e.schema : e.validate ? e : Ul.call(this, e);
}
function zp(e) {
  for (const t of this._compilations)
    if (hw(t, e))
      return t;
}
St.getCompilingSchema = zp;
function hw(e, t) {
  return e.schema === t.schema && e.root === t.root && e.baseId === t.baseId;
}
function pw(e, t) {
  let n;
  for (; typeof (n = this.refs[t]) == "string"; )
    t = n;
  return n || this.schemas[t] || ha.call(this, e, t);
}
function ha(e, t) {
  const n = this.opts.uriResolver.parse(t), r = (0, nn._getFullPath)(this.opts.uriResolver, n);
  let i = (0, nn.getFullPath)(this.opts.uriResolver, e.baseId, void 0);
  if (Object.keys(e.schema).length > 0 && r === i)
    return oc.call(this, n, e);
  const o = (0, nn.normalizeId)(r), s = this.refs[o] || this.schemas[o];
  if (typeof s == "string") {
    const a = ha.call(this, e, s);
    return typeof (a == null ? void 0 : a.schema) != "object" ? void 0 : oc.call(this, n, a);
  }
  if (typeof (s == null ? void 0 : s.schema) == "object") {
    if (s.validate || Ul.call(this, s), o === (0, nn.normalizeId)(t)) {
      const { schema: a } = s, { schemaId: c } = this.opts, u = a[c];
      return u && (i = (0, nn.resolveUrl)(this.opts.uriResolver, i, u)), new da({ schema: a, schemaId: c, root: e, baseId: i });
    }
    return oc.call(this, n, s);
  }
}
St.resolveSchema = ha;
const mw = /* @__PURE__ */ new Set([
  "properties",
  "patternProperties",
  "enum",
  "dependencies",
  "definitions"
]);
function oc(e, { baseId: t, schema: n, root: r }) {
  var i;
  if (((i = e.fragment) === null || i === void 0 ? void 0 : i[0]) !== "/")
    return;
  for (const a of e.fragment.slice(1).split("/")) {
    if (typeof n == "boolean")
      return;
    const c = n[(0, kf.unescapeFragment)(a)];
    if (c === void 0)
      return;
    n = c;
    const u = typeof n == "object" && n[this.opts.schemaId];
    !mw.has(a) && u && (t = (0, nn.resolveUrl)(this.opts.uriResolver, t, u));
  }
  let o;
  if (typeof n != "boolean" && n.$ref && !(0, kf.schemaHasRulesButRef)(n, this.RULES)) {
    const a = (0, nn.resolveUrl)(this.opts.uriResolver, t, n.$ref);
    o = ha.call(this, r, a);
  }
  const { schemaId: s } = this.opts;
  if (o = o || new da({ schema: n, schemaId: s, root: r, baseId: t }), o.schema !== o.root.schema)
    return o;
}
const gw = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", yw = "Meta-schema for $data reference (JSON AnySchema extension proposal)", vw = "object", ww = [
  "$data"
], Ew = {
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
}, _w = !1, $w = {
  $id: gw,
  description: yw,
  type: vw,
  required: ww,
  properties: Ew,
  additionalProperties: _w
};
var jl = {}, pa = { exports: {} };
const Sw = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), Vp = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
function Gp(e) {
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
const bw = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
function Uf(e) {
  return e.length = 0, !0;
}
function Aw(e, t, n) {
  if (e.length) {
    const r = Gp(e);
    if (r !== "")
      t.push(r);
    else
      return n.error = !0, !1;
    e.length = 0;
  }
  return !0;
}
function Tw(e) {
  let t = 0;
  const n = { error: !1, address: "", zone: "" }, r = [], i = [];
  let o = !1, s = !1, a = Aw;
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
        a = Uf;
      } else {
        i.push(u);
        continue;
      }
  }
  return i.length && (a === Uf ? n.zone = i.join("") : s ? r.push(i.join("")) : r.push(Gp(i))), n.address = r.join(""), n;
}
function Wp(e) {
  if (Cw(e, ":") < 2)
    return { host: e, isIPV6: !1 };
  const t = Tw(e);
  if (t.error)
    return { host: e, isIPV6: !1 };
  {
    let n = t.address, r = t.address;
    return t.zone && (n += "%" + t.zone, r += "%25" + t.zone), { host: n, isIPV6: !0, escapedHost: r };
  }
}
function Cw(e, t) {
  let n = 0;
  for (let r = 0; r < e.length; r++)
    e[r] === t && n++;
  return n;
}
function Nw(e) {
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
function Iw(e, t) {
  const n = t !== !0 ? escape : unescape;
  return e.scheme !== void 0 && (e.scheme = n(e.scheme)), e.userinfo !== void 0 && (e.userinfo = n(e.userinfo)), e.host !== void 0 && (e.host = n(e.host)), e.path !== void 0 && (e.path = n(e.path)), e.query !== void 0 && (e.query = n(e.query)), e.fragment !== void 0 && (e.fragment = n(e.fragment)), e;
}
function Pw(e) {
  const t = [];
  if (e.userinfo !== void 0 && (t.push(e.userinfo), t.push("@")), e.host !== void 0) {
    let n = unescape(e.host);
    if (!Vp(n)) {
      const r = Wp(n);
      r.isIPV6 === !0 ? n = `[${r.escapedHost}]` : n = e.host;
    }
    t.push(n);
  }
  return (typeof e.port == "number" || typeof e.port == "string") && (t.push(":"), t.push(String(e.port))), t.length ? t.join("") : void 0;
}
var Kp = {
  nonSimpleDomain: bw,
  recomposeAuthority: Pw,
  normalizeComponentEncoding: Iw,
  removeDotSegments: Nw,
  isIPv4: Vp,
  isUUID: Sw,
  normalizeIPv6: Wp
};
const { isUUID: Ow } = Kp, Rw = /([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-.:;=@]|%[\da-f]{2})+)/iu;
function Jp(e) {
  return e.secure === !0 ? !0 : e.secure === !1 ? !1 : e.scheme ? e.scheme.length === 3 && (e.scheme[0] === "w" || e.scheme[0] === "W") && (e.scheme[1] === "s" || e.scheme[1] === "S") && (e.scheme[2] === "s" || e.scheme[2] === "S") : !1;
}
function Yp(e) {
  return e.host || (e.error = e.error || "HTTP URIs must have a host."), e;
}
function Xp(e) {
  const t = String(e.scheme).toLowerCase() === "https";
  return (e.port === (t ? 443 : 80) || e.port === "") && (e.port = void 0), e.path || (e.path = "/"), e;
}
function Dw(e) {
  return e.secure = Jp(e), e.resourceName = (e.path || "/") + (e.query ? "?" + e.query : ""), e.path = void 0, e.query = void 0, e;
}
function Fw(e) {
  if ((e.port === (Jp(e) ? 443 : 80) || e.port === "") && (e.port = void 0), typeof e.secure == "boolean" && (e.scheme = e.secure ? "wss" : "ws", e.secure = void 0), e.resourceName) {
    const [t, n] = e.resourceName.split("?");
    e.path = t && t !== "/" ? t : void 0, e.query = n, e.resourceName = void 0;
  }
  return e.fragment = void 0, e;
}
function Lw(e, t) {
  if (!e.path)
    return e.error = "URN can not be parsed", e;
  const n = e.path.match(Rw);
  if (n) {
    const r = t.scheme || e.scheme || "urn";
    e.nid = n[1].toLowerCase(), e.nss = n[2];
    const i = `${r}:${t.nid || e.nid}`, o = Ml(i);
    e.path = void 0, o && (e = o.parse(e, t));
  } else
    e.error = e.error || "URN can not be parsed.";
  return e;
}
function xw(e, t) {
  if (e.nid === void 0)
    throw new Error("URN without nid cannot be serialized");
  const n = t.scheme || e.scheme || "urn", r = e.nid.toLowerCase(), i = `${n}:${t.nid || r}`, o = Ml(i);
  o && (e = o.serialize(e, t));
  const s = e, a = e.nss;
  return s.path = `${r || t.nid}:${a}`, t.skipEscape = !0, s;
}
function kw(e, t) {
  const n = e;
  return n.uuid = n.nss, n.nss = void 0, !t.tolerant && (!n.uuid || !Ow(n.uuid)) && (n.error = n.error || "UUID is not valid."), n;
}
function Uw(e) {
  const t = e;
  return t.nss = (e.uuid || "").toLowerCase(), t;
}
const Zp = (
  /** @type {SchemeHandler} */
  {
    scheme: "http",
    domainHost: !0,
    parse: Yp,
    serialize: Xp
  }
), jw = (
  /** @type {SchemeHandler} */
  {
    scheme: "https",
    domainHost: Zp.domainHost,
    parse: Yp,
    serialize: Xp
  }
), Fs = (
  /** @type {SchemeHandler} */
  {
    scheme: "ws",
    domainHost: !0,
    parse: Dw,
    serialize: Fw
  }
), Mw = (
  /** @type {SchemeHandler} */
  {
    scheme: "wss",
    domainHost: Fs.domainHost,
    parse: Fs.parse,
    serialize: Fs.serialize
  }
), Bw = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn",
    parse: Lw,
    serialize: xw,
    skipNormalize: !0
  }
), Hw = (
  /** @type {SchemeHandler} */
  {
    scheme: "urn:uuid",
    parse: kw,
    serialize: Uw,
    skipNormalize: !0
  }
), zs = (
  /** @type {Record<SchemeName, SchemeHandler>} */
  {
    http: Zp,
    https: jw,
    ws: Fs,
    wss: Mw,
    urn: Bw,
    "urn:uuid": Hw
  }
);
Object.setPrototypeOf(zs, null);
function Ml(e) {
  return e && (zs[
    /** @type {SchemeName} */
    e
  ] || zs[
    /** @type {SchemeName} */
    e.toLowerCase()
  ]) || void 0;
}
var qw = {
  SCHEMES: zs,
  getSchemeHandler: Ml
};
const { normalizeIPv6: zw, removeDotSegments: Qi, recomposeAuthority: Vw, normalizeComponentEncoding: is, isIPv4: Gw, nonSimpleDomain: Ww } = Kp, { SCHEMES: Kw, getSchemeHandler: Qp } = qw;
function Jw(e, t) {
  return typeof e == "string" ? e = /** @type {T} */
  hn(Pn(e, t), t) : typeof e == "object" && (e = /** @type {T} */
  Pn(hn(e, t), t)), e;
}
function Yw(e, t, n) {
  const r = n ? Object.assign({ scheme: "null" }, n) : { scheme: "null" }, i = em(Pn(e, r), Pn(t, r), r, !0);
  return r.skipEscape = !0, hn(i, r);
}
function em(e, t, n, r) {
  const i = {};
  return r || (e = Pn(hn(e, n), n), t = Pn(hn(t, n), n)), n = n || {}, !n.tolerant && t.scheme ? (i.scheme = t.scheme, i.userinfo = t.userinfo, i.host = t.host, i.port = t.port, i.path = Qi(t.path || ""), i.query = t.query) : (t.userinfo !== void 0 || t.host !== void 0 || t.port !== void 0 ? (i.userinfo = t.userinfo, i.host = t.host, i.port = t.port, i.path = Qi(t.path || ""), i.query = t.query) : (t.path ? (t.path[0] === "/" ? i.path = Qi(t.path) : ((e.userinfo !== void 0 || e.host !== void 0 || e.port !== void 0) && !e.path ? i.path = "/" + t.path : e.path ? i.path = e.path.slice(0, e.path.lastIndexOf("/") + 1) + t.path : i.path = t.path, i.path = Qi(i.path)), i.query = t.query) : (i.path = e.path, t.query !== void 0 ? i.query = t.query : i.query = e.query), i.userinfo = e.userinfo, i.host = e.host, i.port = e.port), i.scheme = e.scheme), i.fragment = t.fragment, i;
}
function Xw(e, t, n) {
  return typeof e == "string" ? (e = unescape(e), e = hn(is(Pn(e, n), !0), { ...n, skipEscape: !0 })) : typeof e == "object" && (e = hn(is(e, !0), { ...n, skipEscape: !0 })), typeof t == "string" ? (t = unescape(t), t = hn(is(Pn(t, n), !0), { ...n, skipEscape: !0 })) : typeof t == "object" && (t = hn(is(t, !0), { ...n, skipEscape: !0 })), e.toLowerCase() === t.toLowerCase();
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
  }, r = Object.assign({}, t), i = [], o = Qp(r.scheme || n.scheme);
  o && o.serialize && o.serialize(n, r), n.path !== void 0 && (r.skipEscape ? n.path = unescape(n.path) : (n.path = escape(n.path), n.scheme !== void 0 && (n.path = n.path.split("%3A").join(":")))), r.reference !== "suffix" && n.scheme && i.push(n.scheme, ":");
  const s = Vw(n);
  if (s !== void 0 && (r.reference !== "suffix" && i.push("//"), i.push(s), n.path && n.path[0] !== "/" && i.push("/")), n.path !== void 0) {
    let a = n.path;
    !r.absolutePath && (!o || !o.absolutePath) && (a = Qi(a)), s === void 0 && a[0] === "/" && a[1] === "/" && (a = "/%2F" + a.slice(2)), i.push(a);
  }
  return n.query !== void 0 && i.push("?", n.query), n.fragment !== void 0 && i.push("#", n.fragment), i.join("");
}
const Zw = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
function Pn(e, t) {
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
  const o = e.match(Zw);
  if (o) {
    if (r.scheme = o[1], r.userinfo = o[3], r.host = o[4], r.port = parseInt(o[5], 10), r.path = o[6] || "", r.query = o[7], r.fragment = o[8], isNaN(r.port) && (r.port = o[5]), r.host)
      if (Gw(r.host) === !1) {
        const c = zw(r.host);
        r.host = c.host.toLowerCase(), i = c.isIPV6;
      } else
        i = !0;
    r.scheme === void 0 && r.userinfo === void 0 && r.host === void 0 && r.port === void 0 && r.query === void 0 && !r.path ? r.reference = "same-document" : r.scheme === void 0 ? r.reference = "relative" : r.fragment === void 0 ? r.reference = "absolute" : r.reference = "uri", n.reference && n.reference !== "suffix" && n.reference !== r.reference && (r.error = r.error || "URI is not a " + n.reference + " reference.");
    const s = Qp(n.scheme || r.scheme);
    if (!n.unicodeSupport && (!s || !s.unicodeSupport) && r.host && (n.domainHost || s && s.domainHost) && i === !1 && Ww(r.host))
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
  SCHEMES: Kw,
  normalize: Jw,
  resolve: Yw,
  resolveComponent: em,
  equal: Xw,
  serialize: hn,
  parse: Pn
};
pa.exports = Bl;
pa.exports.default = Bl;
pa.exports.fastUri = Bl;
var Qw = pa.exports;
Object.defineProperty(jl, "__esModule", { value: !0 });
const tm = Qw;
tm.code = 'require("ajv/dist/runtime/uri").default';
jl.default = tm;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
  var t = Do();
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
  const r = bi, i = Hr, o = Ur, s = St, a = ue, c = ct, u = Qe, l = ee, f = $w, h = jl, d = (B, P) => new RegExp(B, P);
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
  ]), w = {
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
  }, E = {
    ignoreKeywordsWithRef: "",
    jsPropertySyntax: "",
    unicode: '"minLength"/"maxLength" account for unicode characters by default.'
  }, y = 200;
  function _(B) {
    var P, F, D, $, T, H, ie, ne, ye, le, O, v, g, I, N, te, fe, _e, $e, ve, Ae, Ie, Oe, un, Wt;
    const Ot = B.strict, Rt = (P = B.code) === null || P === void 0 ? void 0 : P.optimize, yn = Rt === !0 || Rt === void 0 ? 1 : Rt || 0, Dn = (D = (F = B.code) === null || F === void 0 ? void 0 : F.regExp) !== null && D !== void 0 ? D : d, Et = ($ = B.uriResolver) !== null && $ !== void 0 ? $ : h.default;
    return {
      strictSchema: (H = (T = B.strictSchema) !== null && T !== void 0 ? T : Ot) !== null && H !== void 0 ? H : !0,
      strictNumbers: (ne = (ie = B.strictNumbers) !== null && ie !== void 0 ? ie : Ot) !== null && ne !== void 0 ? ne : !0,
      strictTypes: (le = (ye = B.strictTypes) !== null && ye !== void 0 ? ye : Ot) !== null && le !== void 0 ? le : "log",
      strictTuples: (v = (O = B.strictTuples) !== null && O !== void 0 ? O : Ot) !== null && v !== void 0 ? v : "log",
      strictRequired: (I = (g = B.strictRequired) !== null && g !== void 0 ? g : Ot) !== null && I !== void 0 ? I : !1,
      code: B.code ? { ...B.code, optimize: yn, regExp: Dn } : { optimize: yn, regExp: Dn },
      loopRequired: (N = B.loopRequired) !== null && N !== void 0 ? N : y,
      loopEnum: (te = B.loopEnum) !== null && te !== void 0 ? te : y,
      meta: (fe = B.meta) !== null && fe !== void 0 ? fe : !0,
      messages: (_e = B.messages) !== null && _e !== void 0 ? _e : !0,
      inlineRefs: ($e = B.inlineRefs) !== null && $e !== void 0 ? $e : !0,
      schemaId: (ve = B.schemaId) !== null && ve !== void 0 ? ve : "$id",
      addUsedSchema: (Ae = B.addUsedSchema) !== null && Ae !== void 0 ? Ae : !0,
      validateSchema: (Ie = B.validateSchema) !== null && Ie !== void 0 ? Ie : !0,
      validateFormats: (Oe = B.validateFormats) !== null && Oe !== void 0 ? Oe : !0,
      unicodeRegExp: (un = B.unicodeRegExp) !== null && un !== void 0 ? un : !0,
      int32range: (Wt = B.int32range) !== null && Wt !== void 0 ? Wt : !0,
      uriResolver: Et
    };
  }
  class S {
    constructor(P = {}) {
      this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), P = this.opts = { ...P, ..._(P) };
      const { es5: F, lines: D } = this.opts.code;
      this.scope = new a.ValueScope({ scope: {}, prefixes: p, es5: F, lines: D }), this.logger = W(P.logger);
      const $ = P.validateFormats;
      P.validateFormats = !1, this.RULES = (0, o.getRules)(), C.call(this, w, P, "NOT SUPPORTED"), C.call(this, E, P, "DEPRECATED", "warn"), this._metaOpts = b.call(this), P.formats && G.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), P.keywords && q.call(this, P.keywords), typeof P.meta == "object" && this.addMetaSchema(P.meta), V.call(this), P.validateFormats = $;
    }
    _addVocabularies() {
      this.addKeyword("$async");
    }
    _addDefaultMetaSchema() {
      const { $data: P, meta: F, schemaId: D } = this.opts;
      let $ = f;
      D === "id" && ($ = { ...f }, $.id = $.$id, delete $.$id), F && P && this.addMetaSchema($, $[D], !1);
    }
    defaultMeta() {
      const { meta: P, schemaId: F } = this.opts;
      return this.opts.defaultMeta = typeof P == "object" ? P[F] || P : void 0;
    }
    validate(P, F) {
      let D;
      if (typeof P == "string") {
        if (D = this.getSchema(P), !D)
          throw new Error(`no schema with key or ref "${P}"`);
      } else
        D = this.compile(P);
      const $ = D(F);
      return "$async" in D || (this.errors = D.errors), $;
    }
    compile(P, F) {
      const D = this._addSchema(P, F);
      return D.validate || this._compileSchemaEnv(D);
    }
    compileAsync(P, F) {
      if (typeof this.opts.loadSchema != "function")
        throw new Error("options.loadSchema should be a function");
      const { loadSchema: D } = this.opts;
      return $.call(this, P, F);
      async function $(le, O) {
        await T.call(this, le.$schema);
        const v = this._addSchema(le, O);
        return v.validate || H.call(this, v);
      }
      async function T(le) {
        le && !this.getSchema(le) && await $.call(this, { $ref: le }, !0);
      }
      async function H(le) {
        try {
          return this._compileSchemaEnv(le);
        } catch (O) {
          if (!(O instanceof i.default))
            throw O;
          return ie.call(this, O), await ne.call(this, O.missingSchema), H.call(this, le);
        }
      }
      function ie({ missingSchema: le, missingRef: O }) {
        if (this.refs[le])
          throw new Error(`AnySchema ${le} is loaded but ${O} cannot be resolved`);
      }
      async function ne(le) {
        const O = await ye.call(this, le);
        this.refs[le] || await T.call(this, O.$schema), this.refs[le] || this.addSchema(O, le, F);
      }
      async function ye(le) {
        const O = this._loading[le];
        if (O)
          return O;
        try {
          return await (this._loading[le] = D(le));
        } finally {
          delete this._loading[le];
        }
      }
    }
    // Adds schema to the instance
    addSchema(P, F, D, $ = this.opts.validateSchema) {
      if (Array.isArray(P)) {
        for (const H of P)
          this.addSchema(H, void 0, D, $);
        return this;
      }
      let T;
      if (typeof P == "object") {
        const { schemaId: H } = this.opts;
        if (T = P[H], T !== void 0 && typeof T != "string")
          throw new Error(`schema ${H} must be string`);
      }
      return F = (0, c.normalizeId)(F || T), this._checkUnique(F), this.schemas[F] = this._addSchema(P, D, F, $, !0), this;
    }
    // Add schema that will be used to validate other schemas
    // options in META_IGNORE_OPTIONS are alway set to false
    addMetaSchema(P, F, D = this.opts.validateSchema) {
      return this.addSchema(P, F, !0, D), this;
    }
    //  Validate schema against its meta-schema
    validateSchema(P, F) {
      if (typeof P == "boolean")
        return !0;
      let D;
      if (D = P.$schema, D !== void 0 && typeof D != "string")
        throw new Error("$schema must be a string");
      if (D = D || this.opts.defaultMeta || this.defaultMeta(), !D)
        return this.logger.warn("meta-schema not available"), this.errors = null, !0;
      const $ = this.validate(D, P);
      if (!$ && F) {
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
    getSchema(P) {
      let F;
      for (; typeof (F = j.call(this, P)) == "string"; )
        P = F;
      if (F === void 0) {
        const { schemaId: D } = this.opts, $ = new s.SchemaEnv({ schema: {}, schemaId: D });
        if (F = s.resolveSchema.call(this, $, P), !F)
          return;
        this.refs[P] = F;
      }
      return F.validate || this._compileSchemaEnv(F);
    }
    // Remove cached schema(s).
    // If no parameter is passed all schemas but meta-schemas are removed.
    // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
    // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
    removeSchema(P) {
      if (P instanceof RegExp)
        return this._removeAllSchemas(this.schemas, P), this._removeAllSchemas(this.refs, P), this;
      switch (typeof P) {
        case "undefined":
          return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
        case "string": {
          const F = j.call(this, P);
          return typeof F == "object" && this._cache.delete(F.schema), delete this.schemas[P], delete this.refs[P], this;
        }
        case "object": {
          const F = P;
          this._cache.delete(F);
          let D = P[this.opts.schemaId];
          return D && (D = (0, c.normalizeId)(D), delete this.schemas[D], delete this.refs[D]), this;
        }
        default:
          throw new Error("ajv.removeSchema: invalid parameter");
      }
    }
    // add "vocabulary" - a collection of keywords
    addVocabulary(P) {
      for (const F of P)
        this.addKeyword(F);
      return this;
    }
    addKeyword(P, F) {
      let D;
      if (typeof P == "string")
        D = P, typeof F == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), F.keyword = D);
      else if (typeof P == "object" && F === void 0) {
        if (F = P, D = F.keyword, Array.isArray(D) && !D.length)
          throw new Error("addKeywords: keyword must be string or non-empty array");
      } else
        throw new Error("invalid addKeywords parameters");
      if (L.call(this, D, F), !F)
        return (0, l.eachItem)(D, (T) => U.call(this, T)), this;
      z.call(this, F);
      const $ = {
        ...F,
        type: (0, u.getJSONTypes)(F.type),
        schemaType: (0, u.getJSONTypes)(F.schemaType)
      };
      return (0, l.eachItem)(D, $.type.length === 0 ? (T) => U.call(this, T, $) : (T) => $.type.forEach((H) => U.call(this, T, $, H))), this;
    }
    getKeyword(P) {
      const F = this.RULES.all[P];
      return typeof F == "object" ? F.definition : !!F;
    }
    // Remove keyword
    removeKeyword(P) {
      const { RULES: F } = this;
      delete F.keywords[P], delete F.all[P];
      for (const D of F.rules) {
        const $ = D.rules.findIndex((T) => T.keyword === P);
        $ >= 0 && D.rules.splice($, 1);
      }
      return this;
    }
    // Add format
    addFormat(P, F) {
      return typeof F == "string" && (F = new RegExp(F)), this.formats[P] = F, this;
    }
    errorsText(P = this.errors, { separator: F = ", ", dataVar: D = "data" } = {}) {
      return !P || P.length === 0 ? "No errors" : P.map(($) => `${D}${$.instancePath} ${$.message}`).reduce(($, T) => $ + F + T);
    }
    $dataMetaSchema(P, F) {
      const D = this.RULES.all;
      P = JSON.parse(JSON.stringify(P));
      for (const $ of F) {
        const T = $.split("/").slice(1);
        let H = P;
        for (const ie of T)
          H = H[ie];
        for (const ie in D) {
          const ne = D[ie];
          if (typeof ne != "object")
            continue;
          const { $data: ye } = ne.definition, le = H[ie];
          ye && le && (H[ie] = J(le));
        }
      }
      return P;
    }
    _removeAllSchemas(P, F) {
      for (const D in P) {
        const $ = P[D];
        (!F || F.test(D)) && (typeof $ == "string" ? delete P[D] : $ && !$.meta && (this._cache.delete($.schema), delete P[D]));
      }
    }
    _addSchema(P, F, D, $ = this.opts.validateSchema, T = this.opts.addUsedSchema) {
      let H;
      const { schemaId: ie } = this.opts;
      if (typeof P == "object")
        H = P[ie];
      else {
        if (this.opts.jtd)
          throw new Error("schema must be object");
        if (typeof P != "boolean")
          throw new Error("schema must be object or boolean");
      }
      let ne = this._cache.get(P);
      if (ne !== void 0)
        return ne;
      D = (0, c.normalizeId)(H || D);
      const ye = c.getSchemaRefs.call(this, P, D);
      return ne = new s.SchemaEnv({ schema: P, schemaId: ie, meta: F, baseId: D, localRefs: ye }), this._cache.set(ne.schema, ne), T && !D.startsWith("#") && (D && this._checkUnique(D), this.refs[D] = ne), $ && this.validateSchema(P, !0), ne;
    }
    _checkUnique(P) {
      if (this.schemas[P] || this.refs[P])
        throw new Error(`schema with key or id "${P}" already exists`);
    }
    _compileSchemaEnv(P) {
      if (P.meta ? this._compileMetaSchema(P) : s.compileSchema.call(this, P), !P.validate)
        throw new Error("ajv implementation error");
      return P.validate;
    }
    _compileMetaSchema(P) {
      const F = this.opts;
      this.opts = this._metaOpts;
      try {
        s.compileSchema.call(this, P);
      } finally {
        this.opts = F;
      }
    }
  }
  S.ValidationError = r.default, S.MissingRefError = i.default, e.default = S;
  function C(B, P, F, D = "error") {
    for (const $ in B) {
      const T = $;
      T in P && this.logger[D](`${F}: option ${$}. ${B[T]}`);
    }
  }
  function j(B) {
    return B = (0, c.normalizeId)(B), this.schemas[B] || this.refs[B];
  }
  function V() {
    const B = this.opts.schemas;
    if (B)
      if (Array.isArray(B))
        this.addSchema(B);
      else
        for (const P in B)
          this.addSchema(B[P], P);
  }
  function G() {
    for (const B in this.opts.formats) {
      const P = this.opts.formats[B];
      P && this.addFormat(B, P);
    }
  }
  function q(B) {
    if (Array.isArray(B)) {
      this.addVocabulary(B);
      return;
    }
    this.logger.warn("keywords option as map is deprecated, pass array");
    for (const P in B) {
      const F = B[P];
      F.keyword || (F.keyword = P), this.addKeyword(F);
    }
  }
  function b() {
    const B = { ...this.opts };
    for (const P of m)
      delete B[P];
    return B;
  }
  const M = { log() {
  }, warn() {
  }, error() {
  } };
  function W(B) {
    if (B === !1)
      return M;
    if (B === void 0)
      return console;
    if (B.log && B.warn && B.error)
      return B;
    throw new Error("logger must implement log, warn and error methods");
  }
  const X = /^[a-z_$][a-z0-9_$:-]*$/i;
  function L(B, P) {
    const { RULES: F } = this;
    if ((0, l.eachItem)(B, (D) => {
      if (F.keywords[D])
        throw new Error(`Keyword ${D} is already defined`);
      if (!X.test(D))
        throw new Error(`Keyword ${D} has invalid name`);
    }), !!P && P.$data && !("code" in P || "validate" in P))
      throw new Error('$data keyword must have "code" or "validate" function');
  }
  function U(B, P, F) {
    var D;
    const $ = P == null ? void 0 : P.post;
    if (F && $)
      throw new Error('keyword with "post" flag cannot have "type"');
    const { RULES: T } = this;
    let H = $ ? T.post : T.rules.find(({ type: ne }) => ne === F);
    if (H || (H = { type: F, rules: [] }, T.rules.push(H)), T.keywords[B] = !0, !P)
      return;
    const ie = {
      keyword: B,
      definition: {
        ...P,
        type: (0, u.getJSONTypes)(P.type),
        schemaType: (0, u.getJSONTypes)(P.schemaType)
      }
    };
    P.before ? K.call(this, H, ie, P.before) : H.rules.push(ie), T.all[B] = ie, (D = P.implements) === null || D === void 0 || D.forEach((ne) => this.addKeyword(ne));
  }
  function K(B, P, F) {
    const D = B.rules.findIndex(($) => $.keyword === F);
    D >= 0 ? B.rules.splice(D, 0, P) : (B.rules.push(P), this.logger.warn(`rule ${F} is not defined`));
  }
  function z(B) {
    let { metaSchema: P } = B;
    P !== void 0 && (B.$data && this.opts.$data && (P = J(P)), B.validateSchema = this.compile(P, !0));
  }
  const Z = {
    $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
  };
  function J(B) {
    return { anyOf: [B, Z] };
  }
})(Pl);
var Hl = {}, ma = {}, ql = {};
Object.defineProperty(ql, "__esModule", { value: !0 });
const eE = {
  keyword: "id",
  code() {
    throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
  }
};
ql.default = eE;
var On = {};
Object.defineProperty(On, "__esModule", { value: !0 });
On.callRef = On.getValidate = void 0;
const tE = Hr, jf = we, Lt = ue, Jr = on(), Mf = St, os = ee, nE = {
  keyword: "$ref",
  schemaType: "string",
  code(e) {
    const { gen: t, schema: n, it: r } = e, { baseId: i, schemaEnv: o, validateName: s, opts: a, self: c } = r, { root: u } = o;
    if ((n === "#" || n === "#/") && i === u.baseId)
      return f();
    const l = Mf.resolveRef.call(c, u, i, n);
    if (l === void 0)
      throw new tE.default(r.opts.uriResolver, i, n);
    if (l instanceof Mf.SchemaEnv)
      return h(l);
    return d(l);
    function f() {
      if (o === u)
        return Ls(e, s, o, o.$async);
      const m = t.scopeValue("root", { ref: u });
      return Ls(e, (0, Lt._)`${m}.validate`, u, u.$async);
    }
    function h(m) {
      const p = nm(e, m);
      Ls(e, p, m, m.$async);
    }
    function d(m) {
      const p = t.scopeValue("schema", a.code.source === !0 ? { ref: m, code: (0, Lt.stringify)(m) } : { ref: m }), w = t.name("valid"), E = e.subschema({
        schema: m,
        dataTypes: [],
        schemaPath: Lt.nil,
        topSchemaRef: p,
        errSchemaPath: n
      }, w);
      e.mergeEvaluated(E), e.ok(w);
    }
  }
};
function nm(e, t) {
  const { gen: n } = e;
  return t.validate ? n.scopeValue("validate", { ref: t.validate }) : (0, Lt._)`${n.scopeValue("wrapper", { ref: t })}.validate`;
}
On.getValidate = nm;
function Ls(e, t, n, r) {
  const { gen: i, it: o } = e, { allErrors: s, schemaEnv: a, opts: c } = o, u = c.passContext ? Jr.default.this : Lt.nil;
  r ? l() : f();
  function l() {
    if (!a.$async)
      throw new Error("async schema referenced by sync schema");
    const m = i.let("valid");
    i.try(() => {
      i.code((0, Lt._)`await ${(0, jf.callValidateCode)(e, t, u)}`), d(t), s || i.assign(m, !0);
    }, (p) => {
      i.if((0, Lt._)`!(${p} instanceof ${o.ValidationError})`, () => i.throw(p)), h(p), s || i.assign(m, !1);
    }), e.ok(m);
  }
  function f() {
    e.result((0, jf.callValidateCode)(e, t, u), () => d(t), () => h(t));
  }
  function h(m) {
    const p = (0, Lt._)`${m}.errors`;
    i.assign(Jr.default.vErrors, (0, Lt._)`${Jr.default.vErrors} === null ? ${p} : ${Jr.default.vErrors}.concat(${p})`), i.assign(Jr.default.errors, (0, Lt._)`${Jr.default.vErrors}.length`);
  }
  function d(m) {
    var p;
    if (!o.opts.unevaluated)
      return;
    const w = (p = n == null ? void 0 : n.validate) === null || p === void 0 ? void 0 : p.evaluated;
    if (o.props !== !0)
      if (w && !w.dynamicProps)
        w.props !== void 0 && (o.props = os.mergeEvaluated.props(i, w.props, o.props));
      else {
        const E = i.var("props", (0, Lt._)`${m}.evaluated.props`);
        o.props = os.mergeEvaluated.props(i, E, o.props, Lt.Name);
      }
    if (o.items !== !0)
      if (w && !w.dynamicItems)
        w.items !== void 0 && (o.items = os.mergeEvaluated.items(i, w.items, o.items));
      else {
        const E = i.var("items", (0, Lt._)`${m}.evaluated.items`);
        o.items = os.mergeEvaluated.items(i, E, o.items, Lt.Name);
      }
  }
}
On.callRef = Ls;
On.default = nE;
Object.defineProperty(ma, "__esModule", { value: !0 });
const rE = ql, iE = On, oE = [
  "$schema",
  "$id",
  "$defs",
  "$vocabulary",
  { keyword: "$comment" },
  "definitions",
  rE.default,
  iE.default
];
ma.default = oE;
var ga = {}, zl = {};
Object.defineProperty(zl, "__esModule", { value: !0 });
const Vs = ue, Bn = Vs.operators, Gs = {
  maximum: { okStr: "<=", ok: Bn.LTE, fail: Bn.GT },
  minimum: { okStr: ">=", ok: Bn.GTE, fail: Bn.LT },
  exclusiveMaximum: { okStr: "<", ok: Bn.LT, fail: Bn.GTE },
  exclusiveMinimum: { okStr: ">", ok: Bn.GT, fail: Bn.LTE }
}, sE = {
  message: ({ keyword: e, schemaCode: t }) => (0, Vs.str)`must be ${Gs[e].okStr} ${t}`,
  params: ({ keyword: e, schemaCode: t }) => (0, Vs._)`{comparison: ${Gs[e].okStr}, limit: ${t}}`
}, aE = {
  keyword: Object.keys(Gs),
  type: "number",
  schemaType: "number",
  $data: !0,
  error: sE,
  code(e) {
    const { keyword: t, data: n, schemaCode: r } = e;
    e.fail$data((0, Vs._)`${n} ${Gs[t].fail} ${r} || isNaN(${n})`);
  }
};
zl.default = aE;
var Vl = {};
Object.defineProperty(Vl, "__esModule", { value: !0 });
const ro = ue, cE = {
  message: ({ schemaCode: e }) => (0, ro.str)`must be multiple of ${e}`,
  params: ({ schemaCode: e }) => (0, ro._)`{multipleOf: ${e}}`
}, lE = {
  keyword: "multipleOf",
  type: "number",
  schemaType: "number",
  $data: !0,
  error: cE,
  code(e) {
    const { gen: t, data: n, schemaCode: r, it: i } = e, o = i.opts.multipleOfPrecision, s = t.let("res"), a = o ? (0, ro._)`Math.abs(Math.round(${s}) - ${s}) > 1e-${o}` : (0, ro._)`${s} !== parseInt(${s})`;
    e.fail$data((0, ro._)`(${r} === 0 || (${s} = ${n}/${r}, ${a}))`);
  }
};
Vl.default = lE;
var Gl = {}, Wl = {};
Object.defineProperty(Wl, "__esModule", { value: !0 });
function rm(e) {
  const t = e.length;
  let n = 0, r = 0, i;
  for (; r < t; )
    n++, i = e.charCodeAt(r++), i >= 55296 && i <= 56319 && r < t && (i = e.charCodeAt(r), (i & 64512) === 56320 && r++);
  return n;
}
Wl.default = rm;
rm.code = 'require("ajv/dist/runtime/ucs2length").default';
Object.defineProperty(Gl, "__esModule", { value: !0 });
const Ar = ue, uE = ee, fE = Wl, dE = {
  message({ keyword: e, schemaCode: t }) {
    const n = e === "maxLength" ? "more" : "fewer";
    return (0, Ar.str)`must NOT have ${n} than ${t} characters`;
  },
  params: ({ schemaCode: e }) => (0, Ar._)`{limit: ${e}}`
}, hE = {
  keyword: ["maxLength", "minLength"],
  type: "string",
  schemaType: "number",
  $data: !0,
  error: dE,
  code(e) {
    const { keyword: t, data: n, schemaCode: r, it: i } = e, o = t === "maxLength" ? Ar.operators.GT : Ar.operators.LT, s = i.opts.unicode === !1 ? (0, Ar._)`${n}.length` : (0, Ar._)`${(0, uE.useFunc)(e.gen, fE.default)}(${n})`;
    e.fail$data((0, Ar._)`${s} ${o} ${r}`);
  }
};
Gl.default = hE;
var Kl = {};
Object.defineProperty(Kl, "__esModule", { value: !0 });
const pE = we, mE = ee, ci = ue, gE = {
  message: ({ schemaCode: e }) => (0, ci.str)`must match pattern "${e}"`,
  params: ({ schemaCode: e }) => (0, ci._)`{pattern: ${e}}`
}, yE = {
  keyword: "pattern",
  type: "string",
  schemaType: "string",
  $data: !0,
  error: gE,
  code(e) {
    const { gen: t, data: n, $data: r, schema: i, schemaCode: o, it: s } = e, a = s.opts.unicodeRegExp ? "u" : "";
    if (r) {
      const { regExp: c } = s.opts.code, u = c.code === "new RegExp" ? (0, ci._)`new RegExp` : (0, mE.useFunc)(t, c), l = t.let("valid");
      t.try(() => t.assign(l, (0, ci._)`${u}(${o}, ${a}).test(${n})`), () => t.assign(l, !1)), e.fail$data((0, ci._)`!${l}`);
    } else {
      const c = (0, pE.usePattern)(e, i);
      e.fail$data((0, ci._)`!${c}.test(${n})`);
    }
  }
};
Kl.default = yE;
var Jl = {};
Object.defineProperty(Jl, "__esModule", { value: !0 });
const io = ue, vE = {
  message({ keyword: e, schemaCode: t }) {
    const n = e === "maxProperties" ? "more" : "fewer";
    return (0, io.str)`must NOT have ${n} than ${t} properties`;
  },
  params: ({ schemaCode: e }) => (0, io._)`{limit: ${e}}`
}, wE = {
  keyword: ["maxProperties", "minProperties"],
  type: "object",
  schemaType: "number",
  $data: !0,
  error: vE,
  code(e) {
    const { keyword: t, data: n, schemaCode: r } = e, i = t === "maxProperties" ? io.operators.GT : io.operators.LT;
    e.fail$data((0, io._)`Object.keys(${n}).length ${i} ${r}`);
  }
};
Jl.default = wE;
var Yl = {};
Object.defineProperty(Yl, "__esModule", { value: !0 });
const Vi = we, oo = ue, EE = ee, _E = {
  message: ({ params: { missingProperty: e } }) => (0, oo.str)`must have required property '${e}'`,
  params: ({ params: { missingProperty: e } }) => (0, oo._)`{missingProperty: ${e}}`
}, $E = {
  keyword: "required",
  type: "object",
  schemaType: "array",
  $data: !0,
  error: _E,
  code(e) {
    const { gen: t, schema: n, schemaCode: r, data: i, $data: o, it: s } = e, { opts: a } = s;
    if (!o && n.length === 0)
      return;
    const c = n.length >= a.loopRequired;
    if (s.allErrors ? u() : l(), a.strictRequired) {
      const d = e.parentSchema.properties, { definedProperties: m } = e.it;
      for (const p of n)
        if ((d == null ? void 0 : d[p]) === void 0 && !m.has(p)) {
          const w = s.schemaEnv.baseId + s.errSchemaPath, E = `required property "${p}" is not defined at "${w}" (strictRequired)`;
          (0, EE.checkStrictMode)(s, E, s.opts.strictRequired);
        }
    }
    function u() {
      if (c || o)
        e.block$data(oo.nil, f);
      else
        for (const d of n)
          (0, Vi.checkReportMissingProp)(e, d);
    }
    function l() {
      const d = t.let("missing");
      if (c || o) {
        const m = t.let("valid", !0);
        e.block$data(m, () => h(d, m)), e.ok(m);
      } else
        t.if((0, Vi.checkMissingProp)(e, n, d)), (0, Vi.reportMissingProp)(e, d), t.else();
    }
    function f() {
      t.forOf("prop", r, (d) => {
        e.setParams({ missingProperty: d }), t.if((0, Vi.noPropertyInData)(t, i, d, a.ownProperties), () => e.error());
      });
    }
    function h(d, m) {
      e.setParams({ missingProperty: d }), t.forOf(d, r, () => {
        t.assign(m, (0, Vi.propertyInData)(t, i, d, a.ownProperties)), t.if((0, oo.not)(m), () => {
          e.error(), t.break();
        });
      }, oo.nil);
    }
  }
};
Yl.default = $E;
var Xl = {};
Object.defineProperty(Xl, "__esModule", { value: !0 });
const so = ue, SE = {
  message({ keyword: e, schemaCode: t }) {
    const n = e === "maxItems" ? "more" : "fewer";
    return (0, so.str)`must NOT have ${n} than ${t} items`;
  },
  params: ({ schemaCode: e }) => (0, so._)`{limit: ${e}}`
}, bE = {
  keyword: ["maxItems", "minItems"],
  type: "array",
  schemaType: "number",
  $data: !0,
  error: SE,
  code(e) {
    const { keyword: t, data: n, schemaCode: r } = e, i = t === "maxItems" ? so.operators.GT : so.operators.LT;
    e.fail$data((0, so._)`${n}.length ${i} ${r}`);
  }
};
Xl.default = bE;
var Zl = {}, Fo = {};
Object.defineProperty(Fo, "__esModule", { value: !0 });
const im = jp;
im.code = 'require("ajv/dist/runtime/equal").default';
Fo.default = im;
Object.defineProperty(Zl, "__esModule", { value: !0 });
const sc = Qe, at = ue, AE = ee, TE = Fo, CE = {
  message: ({ params: { i: e, j: t } }) => (0, at.str)`must NOT have duplicate items (items ## ${t} and ${e} are identical)`,
  params: ({ params: { i: e, j: t } }) => (0, at._)`{i: ${e}, j: ${t}}`
}, NE = {
  keyword: "uniqueItems",
  type: "array",
  schemaType: "boolean",
  $data: !0,
  error: CE,
  code(e) {
    const { gen: t, data: n, $data: r, schema: i, parentSchema: o, schemaCode: s, it: a } = e;
    if (!r && !i)
      return;
    const c = t.let("valid"), u = o.items ? (0, sc.getSchemaTypes)(o.items) : [];
    e.block$data(c, l, (0, at._)`${s} === false`), e.ok(c);
    function l() {
      const m = t.let("i", (0, at._)`${n}.length`), p = t.let("j");
      e.setParams({ i: m, j: p }), t.assign(c, !0), t.if((0, at._)`${m} > 1`, () => (f() ? h : d)(m, p));
    }
    function f() {
      return u.length > 0 && !u.some((m) => m === "object" || m === "array");
    }
    function h(m, p) {
      const w = t.name("item"), E = (0, sc.checkDataTypes)(u, w, a.opts.strictNumbers, sc.DataType.Wrong), y = t.const("indices", (0, at._)`{}`);
      t.for((0, at._)`;${m}--;`, () => {
        t.let(w, (0, at._)`${n}[${m}]`), t.if(E, (0, at._)`continue`), u.length > 1 && t.if((0, at._)`typeof ${w} == "string"`, (0, at._)`${w} += "_"`), t.if((0, at._)`typeof ${y}[${w}] == "number"`, () => {
          t.assign(p, (0, at._)`${y}[${w}]`), e.error(), t.assign(c, !1).break();
        }).code((0, at._)`${y}[${w}] = ${m}`);
      });
    }
    function d(m, p) {
      const w = (0, AE.useFunc)(t, TE.default), E = t.name("outer");
      t.label(E).for((0, at._)`;${m}--;`, () => t.for((0, at._)`${p} = ${m}; ${p}--;`, () => t.if((0, at._)`${w}(${n}[${m}], ${n}[${p}])`, () => {
        e.error(), t.assign(c, !1).break(E);
      })));
    }
  }
};
Zl.default = NE;
var Ql = {};
Object.defineProperty(Ql, "__esModule", { value: !0 });
const nl = ue, IE = ee, PE = Fo, OE = {
  message: "must be equal to constant",
  params: ({ schemaCode: e }) => (0, nl._)`{allowedValue: ${e}}`
}, RE = {
  keyword: "const",
  $data: !0,
  error: OE,
  code(e) {
    const { gen: t, data: n, $data: r, schemaCode: i, schema: o } = e;
    r || o && typeof o == "object" ? e.fail$data((0, nl._)`!${(0, IE.useFunc)(t, PE.default)}(${n}, ${i})`) : e.fail((0, nl._)`${o} !== ${n}`);
  }
};
Ql.default = RE;
var eu = {};
Object.defineProperty(eu, "__esModule", { value: !0 });
const eo = ue, DE = ee, FE = Fo, LE = {
  message: "must be equal to one of the allowed values",
  params: ({ schemaCode: e }) => (0, eo._)`{allowedValues: ${e}}`
}, xE = {
  keyword: "enum",
  schemaType: "array",
  $data: !0,
  error: LE,
  code(e) {
    const { gen: t, data: n, $data: r, schema: i, schemaCode: o, it: s } = e;
    if (!r && i.length === 0)
      throw new Error("enum must have non-empty array");
    const a = i.length >= s.opts.loopEnum;
    let c;
    const u = () => c ?? (c = (0, DE.useFunc)(t, FE.default));
    let l;
    if (a || r)
      l = t.let("valid"), e.block$data(l, f);
    else {
      if (!Array.isArray(i))
        throw new Error("ajv implementation error");
      const d = t.const("vSchema", o);
      l = (0, eo.or)(...i.map((m, p) => h(d, p)));
    }
    e.pass(l);
    function f() {
      t.assign(l, !1), t.forOf("v", o, (d) => t.if((0, eo._)`${u()}(${n}, ${d})`, () => t.assign(l, !0).break()));
    }
    function h(d, m) {
      const p = i[m];
      return typeof p == "object" && p !== null ? (0, eo._)`${u()}(${n}, ${d}[${m}])` : (0, eo._)`${n} === ${p}`;
    }
  }
};
eu.default = xE;
Object.defineProperty(ga, "__esModule", { value: !0 });
const kE = zl, UE = Vl, jE = Gl, ME = Kl, BE = Jl, HE = Yl, qE = Xl, zE = Zl, VE = Ql, GE = eu, WE = [
  // number
  kE.default,
  UE.default,
  // string
  jE.default,
  ME.default,
  // object
  BE.default,
  HE.default,
  // array
  qE.default,
  zE.default,
  // any
  { keyword: "type", schemaType: ["string", "array"] },
  { keyword: "nullable", schemaType: "boolean" },
  VE.default,
  GE.default
];
ga.default = WE;
var ya = {}, Ai = {};
Object.defineProperty(Ai, "__esModule", { value: !0 });
Ai.validateAdditionalItems = void 0;
const Tr = ue, rl = ee, KE = {
  message: ({ params: { len: e } }) => (0, Tr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Tr._)`{limit: ${e}}`
}, JE = {
  keyword: "additionalItems",
  type: "array",
  schemaType: ["boolean", "object"],
  before: "uniqueItems",
  error: KE,
  code(e) {
    const { parentSchema: t, it: n } = e, { items: r } = t;
    if (!Array.isArray(r)) {
      (0, rl.checkStrictMode)(n, '"additionalItems" is ignored when "items" is not an array of schemas');
      return;
    }
    om(e, r);
  }
};
function om(e, t) {
  const { gen: n, schema: r, data: i, keyword: o, it: s } = e;
  s.items = !0;
  const a = n.const("len", (0, Tr._)`${i}.length`);
  if (r === !1)
    e.setParams({ len: t.length }), e.pass((0, Tr._)`${a} <= ${t.length}`);
  else if (typeof r == "object" && !(0, rl.alwaysValidSchema)(s, r)) {
    const u = n.var("valid", (0, Tr._)`${a} <= ${t.length}`);
    n.if((0, Tr.not)(u), () => c(u)), e.ok(u);
  }
  function c(u) {
    n.forRange("i", t.length, a, (l) => {
      e.subschema({ keyword: o, dataProp: l, dataPropType: rl.Type.Num }, u), s.allErrors || n.if((0, Tr.not)(u), () => n.break());
    });
  }
}
Ai.validateAdditionalItems = om;
Ai.default = JE;
var tu = {}, Ti = {};
Object.defineProperty(Ti, "__esModule", { value: !0 });
Ti.validateTuple = void 0;
const Bf = ue, xs = ee, YE = we, XE = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "array", "boolean"],
  before: "uniqueItems",
  code(e) {
    const { schema: t, it: n } = e;
    if (Array.isArray(t))
      return sm(e, "additionalItems", t);
    n.items = !0, !(0, xs.alwaysValidSchema)(n, t) && e.ok((0, YE.validateArray)(e));
  }
};
function sm(e, t, n = e.schema) {
  const { gen: r, parentSchema: i, data: o, keyword: s, it: a } = e;
  l(i), a.opts.unevaluated && n.length && a.items !== !0 && (a.items = xs.mergeEvaluated.items(r, n.length, a.items));
  const c = r.name("valid"), u = r.const("len", (0, Bf._)`${o}.length`);
  n.forEach((f, h) => {
    (0, xs.alwaysValidSchema)(a, f) || (r.if((0, Bf._)`${u} > ${h}`, () => e.subschema({
      keyword: s,
      schemaProp: h,
      dataProp: h
    }, c)), e.ok(c));
  });
  function l(f) {
    const { opts: h, errSchemaPath: d } = a, m = n.length, p = m === f.minItems && (m === f.maxItems || f[t] === !1);
    if (h.strictTuples && !p) {
      const w = `"${s}" is ${m}-tuple, but minItems or maxItems/${t} are not specified or different at path "${d}"`;
      (0, xs.checkStrictMode)(a, w, h.strictTuples);
    }
  }
}
Ti.validateTuple = sm;
Ti.default = XE;
Object.defineProperty(tu, "__esModule", { value: !0 });
const ZE = Ti, QE = {
  keyword: "prefixItems",
  type: "array",
  schemaType: ["array"],
  before: "uniqueItems",
  code: (e) => (0, ZE.validateTuple)(e, "items")
};
tu.default = QE;
var nu = {};
Object.defineProperty(nu, "__esModule", { value: !0 });
const Hf = ue, e_ = ee, t_ = we, n_ = Ai, r_ = {
  message: ({ params: { len: e } }) => (0, Hf.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Hf._)`{limit: ${e}}`
}, i_ = {
  keyword: "items",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  error: r_,
  code(e) {
    const { schema: t, parentSchema: n, it: r } = e, { prefixItems: i } = n;
    r.items = !0, !(0, e_.alwaysValidSchema)(r, t) && (i ? (0, n_.validateAdditionalItems)(e, i) : e.ok((0, t_.validateArray)(e)));
  }
};
nu.default = i_;
var ru = {};
Object.defineProperty(ru, "__esModule", { value: !0 });
const Vt = ue, ss = ee, o_ = {
  message: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Vt.str)`must contain at least ${e} valid item(s)` : (0, Vt.str)`must contain at least ${e} and no more than ${t} valid item(s)`,
  params: ({ params: { min: e, max: t } }) => t === void 0 ? (0, Vt._)`{minContains: ${e}}` : (0, Vt._)`{minContains: ${e}, maxContains: ${t}}`
}, s_ = {
  keyword: "contains",
  type: "array",
  schemaType: ["object", "boolean"],
  before: "uniqueItems",
  trackErrors: !0,
  error: o_,
  code(e) {
    const { gen: t, schema: n, parentSchema: r, data: i, it: o } = e;
    let s, a;
    const { minContains: c, maxContains: u } = r;
    o.opts.next ? (s = c === void 0 ? 1 : c, a = u) : s = 1;
    const l = t.const("len", (0, Vt._)`${i}.length`);
    if (e.setParams({ min: s, max: a }), a === void 0 && s === 0) {
      (0, ss.checkStrictMode)(o, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
      return;
    }
    if (a !== void 0 && s > a) {
      (0, ss.checkStrictMode)(o, '"minContains" > "maxContains" is always invalid'), e.fail();
      return;
    }
    if ((0, ss.alwaysValidSchema)(o, n)) {
      let p = (0, Vt._)`${l} >= ${s}`;
      a !== void 0 && (p = (0, Vt._)`${p} && ${l} <= ${a}`), e.pass(p);
      return;
    }
    o.items = !0;
    const f = t.name("valid");
    a === void 0 && s === 1 ? d(f, () => t.if(f, () => t.break())) : s === 0 ? (t.let(f, !0), a !== void 0 && t.if((0, Vt._)`${i}.length > 0`, h)) : (t.let(f, !1), h()), e.result(f, () => e.reset());
    function h() {
      const p = t.name("_valid"), w = t.let("count", 0);
      d(p, () => t.if(p, () => m(w)));
    }
    function d(p, w) {
      t.forRange("i", 0, l, (E) => {
        e.subschema({
          keyword: "contains",
          dataProp: E,
          dataPropType: ss.Type.Num,
          compositeRule: !0
        }, p), w();
      });
    }
    function m(p) {
      t.code((0, Vt._)`${p}++`), a === void 0 ? t.if((0, Vt._)`${p} >= ${s}`, () => t.assign(f, !0).break()) : (t.if((0, Vt._)`${p} > ${a}`, () => t.assign(f, !1).break()), s === 1 ? t.assign(f, !0) : t.if((0, Vt._)`${p} >= ${s}`, () => t.assign(f, !0)));
    }
  }
};
ru.default = s_;
var va = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
  const t = ue, n = ee, r = we;
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
      const w = (0, r.propertyInData)(l, f, m, h.opts.ownProperties);
      c.setParams({
        property: m,
        depsCount: p.length,
        deps: p.join(", ")
      }), h.allErrors ? l.if(w, () => {
        for (const E of p)
          (0, r.checkReportMissingProp)(c, E);
      }) : (l.if((0, t._)`${w} && (${(0, r.checkMissingProp)(c, p, d)})`), (0, r.reportMissingProp)(c, d), l.else());
    }
  }
  e.validatePropertyDeps = s;
  function a(c, u = c.schema) {
    const { gen: l, data: f, keyword: h, it: d } = c, m = l.name("valid");
    for (const p in u)
      (0, n.alwaysValidSchema)(d, u[p]) || (l.if(
        (0, r.propertyInData)(l, f, p, d.opts.ownProperties),
        () => {
          const w = c.subschema({ keyword: h, schemaProp: p }, m);
          c.mergeValidEvaluated(w, m);
        },
        () => l.var(m, !0)
        // TODO var
      ), c.ok(m));
  }
  e.validateSchemaDeps = a, e.default = i;
})(va);
var iu = {};
Object.defineProperty(iu, "__esModule", { value: !0 });
const am = ue, a_ = ee, c_ = {
  message: "property name must be valid",
  params: ({ params: e }) => (0, am._)`{propertyName: ${e.propertyName}}`
}, l_ = {
  keyword: "propertyNames",
  type: "object",
  schemaType: ["object", "boolean"],
  error: c_,
  code(e) {
    const { gen: t, schema: n, data: r, it: i } = e;
    if ((0, a_.alwaysValidSchema)(i, n))
      return;
    const o = t.name("valid");
    t.forIn("key", r, (s) => {
      e.setParams({ propertyName: s }), e.subschema({
        keyword: "propertyNames",
        data: s,
        dataTypes: ["string"],
        propertyName: s,
        compositeRule: !0
      }, o), t.if((0, am.not)(o), () => {
        e.error(!0), i.allErrors || t.break();
      });
    }), e.ok(o);
  }
};
iu.default = l_;
var wa = {};
Object.defineProperty(wa, "__esModule", { value: !0 });
const as = we, en = ue, u_ = on(), cs = ee, f_ = {
  message: "must NOT have additional properties",
  params: ({ params: e }) => (0, en._)`{additionalProperty: ${e.additionalProperty}}`
}, d_ = {
  keyword: "additionalProperties",
  type: ["object"],
  schemaType: ["boolean", "object"],
  allowUndefined: !0,
  trackErrors: !0,
  error: f_,
  code(e) {
    const { gen: t, schema: n, parentSchema: r, data: i, errsCount: o, it: s } = e;
    if (!o)
      throw new Error("ajv implementation error");
    const { allErrors: a, opts: c } = s;
    if (s.props = !0, c.removeAdditional !== "all" && (0, cs.alwaysValidSchema)(s, n))
      return;
    const u = (0, as.allSchemaProperties)(r.properties), l = (0, as.allSchemaProperties)(r.patternProperties);
    f(), e.ok((0, en._)`${o} === ${u_.default.errors}`);
    function f() {
      t.forIn("key", i, (w) => {
        !u.length && !l.length ? m(w) : t.if(h(w), () => m(w));
      });
    }
    function h(w) {
      let E;
      if (u.length > 8) {
        const y = (0, cs.schemaRefOrVal)(s, r.properties, "properties");
        E = (0, as.isOwnProperty)(t, y, w);
      } else u.length ? E = (0, en.or)(...u.map((y) => (0, en._)`${w} === ${y}`)) : E = en.nil;
      return l.length && (E = (0, en.or)(E, ...l.map((y) => (0, en._)`${(0, as.usePattern)(e, y)}.test(${w})`))), (0, en.not)(E);
    }
    function d(w) {
      t.code((0, en._)`delete ${i}[${w}]`);
    }
    function m(w) {
      if (c.removeAdditional === "all" || c.removeAdditional && n === !1) {
        d(w);
        return;
      }
      if (n === !1) {
        e.setParams({ additionalProperty: w }), e.error(), a || t.break();
        return;
      }
      if (typeof n == "object" && !(0, cs.alwaysValidSchema)(s, n)) {
        const E = t.name("valid");
        c.removeAdditional === "failing" ? (p(w, E, !1), t.if((0, en.not)(E), () => {
          e.reset(), d(w);
        })) : (p(w, E), a || t.if((0, en.not)(E), () => t.break()));
      }
    }
    function p(w, E, y) {
      const _ = {
        keyword: "additionalProperties",
        dataProp: w,
        dataPropType: cs.Type.Str
      };
      y === !1 && Object.assign(_, {
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }), e.subschema(_, E);
    }
  }
};
wa.default = d_;
var ou = {};
Object.defineProperty(ou, "__esModule", { value: !0 });
const h_ = Do(), qf = we, ac = ee, zf = wa, p_ = {
  keyword: "properties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: n, parentSchema: r, data: i, it: o } = e;
    o.opts.removeAdditional === "all" && r.additionalProperties === void 0 && zf.default.code(new h_.KeywordCxt(o, zf.default, "additionalProperties"));
    const s = (0, qf.allSchemaProperties)(n);
    for (const f of s)
      o.definedProperties.add(f);
    o.opts.unevaluated && s.length && o.props !== !0 && (o.props = ac.mergeEvaluated.props(t, (0, ac.toHash)(s), o.props));
    const a = s.filter((f) => !(0, ac.alwaysValidSchema)(o, n[f]));
    if (a.length === 0)
      return;
    const c = t.name("valid");
    for (const f of a)
      u(f) ? l(f) : (t.if((0, qf.propertyInData)(t, i, f, o.opts.ownProperties)), l(f), o.allErrors || t.else().var(c, !0), t.endIf()), e.it.definedProperties.add(f), e.ok(c);
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
ou.default = p_;
var su = {};
Object.defineProperty(su, "__esModule", { value: !0 });
const Vf = we, ls = ue, Gf = ee, Wf = ee, m_ = {
  keyword: "patternProperties",
  type: "object",
  schemaType: "object",
  code(e) {
    const { gen: t, schema: n, data: r, parentSchema: i, it: o } = e, { opts: s } = o, a = (0, Vf.allSchemaProperties)(n), c = a.filter((p) => (0, Gf.alwaysValidSchema)(o, n[p]));
    if (a.length === 0 || c.length === a.length && (!o.opts.unevaluated || o.props === !0))
      return;
    const u = s.strictSchema && !s.allowMatchingProperties && i.properties, l = t.name("valid");
    o.props !== !0 && !(o.props instanceof ls.Name) && (o.props = (0, Wf.evaluatedPropsToName)(t, o.props));
    const { props: f } = o;
    h();
    function h() {
      for (const p of a)
        u && d(p), o.allErrors ? m(p) : (t.var(l, !0), m(p), t.if(l));
    }
    function d(p) {
      for (const w in u)
        new RegExp(p).test(w) && (0, Gf.checkStrictMode)(o, `property ${w} matches pattern ${p} (use allowMatchingProperties)`);
    }
    function m(p) {
      t.forIn("key", r, (w) => {
        t.if((0, ls._)`${(0, Vf.usePattern)(e, p)}.test(${w})`, () => {
          const E = c.includes(p);
          E || e.subschema({
            keyword: "patternProperties",
            schemaProp: p,
            dataProp: w,
            dataPropType: Wf.Type.Str
          }, l), o.opts.unevaluated && f !== !0 ? t.assign((0, ls._)`${f}[${w}]`, !0) : !E && !o.allErrors && t.if((0, ls.not)(l), () => t.break());
        });
      });
    }
  }
};
su.default = m_;
var au = {};
Object.defineProperty(au, "__esModule", { value: !0 });
const g_ = ee, y_ = {
  keyword: "not",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  code(e) {
    const { gen: t, schema: n, it: r } = e;
    if ((0, g_.alwaysValidSchema)(r, n)) {
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
au.default = y_;
var cu = {};
Object.defineProperty(cu, "__esModule", { value: !0 });
const v_ = we, w_ = {
  keyword: "anyOf",
  schemaType: "array",
  trackErrors: !0,
  code: v_.validateUnion,
  error: { message: "must match a schema in anyOf" }
};
cu.default = w_;
var lu = {};
Object.defineProperty(lu, "__esModule", { value: !0 });
const ks = ue, E_ = ee, __ = {
  message: "must match exactly one schema in oneOf",
  params: ({ params: e }) => (0, ks._)`{passingSchemas: ${e.passing}}`
}, $_ = {
  keyword: "oneOf",
  schemaType: "array",
  trackErrors: !0,
  error: __,
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
        (0, E_.alwaysValidSchema)(i, l) ? t.var(c, !0) : h = e.subschema({
          keyword: "oneOf",
          schemaProp: f,
          compositeRule: !0
        }, c), f > 0 && t.if((0, ks._)`${c} && ${s}`).assign(s, !1).assign(a, (0, ks._)`[${a}, ${f}]`).else(), t.if(c, () => {
          t.assign(s, !0), t.assign(a, f), h && e.mergeEvaluated(h, ks.Name);
        });
      });
    }
  }
};
lu.default = $_;
var uu = {};
Object.defineProperty(uu, "__esModule", { value: !0 });
const S_ = ee, b_ = {
  keyword: "allOf",
  schemaType: "array",
  code(e) {
    const { gen: t, schema: n, it: r } = e;
    if (!Array.isArray(n))
      throw new Error("ajv implementation error");
    const i = t.name("valid");
    n.forEach((o, s) => {
      if ((0, S_.alwaysValidSchema)(r, o))
        return;
      const a = e.subschema({ keyword: "allOf", schemaProp: s }, i);
      e.ok(i), e.mergeEvaluated(a);
    });
  }
};
uu.default = b_;
var fu = {};
Object.defineProperty(fu, "__esModule", { value: !0 });
const Ws = ue, cm = ee, A_ = {
  message: ({ params: e }) => (0, Ws.str)`must match "${e.ifClause}" schema`,
  params: ({ params: e }) => (0, Ws._)`{failingKeyword: ${e.ifClause}}`
}, T_ = {
  keyword: "if",
  schemaType: ["object", "boolean"],
  trackErrors: !0,
  error: A_,
  code(e) {
    const { gen: t, parentSchema: n, it: r } = e;
    n.then === void 0 && n.else === void 0 && (0, cm.checkStrictMode)(r, '"if" without "then" and "else" is ignored');
    const i = Kf(r, "then"), o = Kf(r, "else");
    if (!i && !o)
      return;
    const s = t.let("valid", !0), a = t.name("_valid");
    if (c(), e.reset(), i && o) {
      const l = t.let("ifClause");
      e.setParams({ ifClause: l }), t.if(a, u("then", l), u("else", l));
    } else i ? t.if(a, u("then")) : t.if((0, Ws.not)(a), u("else"));
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
        t.assign(s, a), e.mergeValidEvaluated(h, s), f ? t.assign(f, (0, Ws._)`${l}`) : e.setParams({ ifClause: l });
      };
    }
  }
};
function Kf(e, t) {
  const n = e.schema[t];
  return n !== void 0 && !(0, cm.alwaysValidSchema)(e, n);
}
fu.default = T_;
var du = {};
Object.defineProperty(du, "__esModule", { value: !0 });
const C_ = ee, N_ = {
  keyword: ["then", "else"],
  schemaType: ["object", "boolean"],
  code({ keyword: e, parentSchema: t, it: n }) {
    t.if === void 0 && (0, C_.checkStrictMode)(n, `"${e}" without "if" is ignored`);
  }
};
du.default = N_;
Object.defineProperty(ya, "__esModule", { value: !0 });
const I_ = Ai, P_ = tu, O_ = Ti, R_ = nu, D_ = ru, F_ = va, L_ = iu, x_ = wa, k_ = ou, U_ = su, j_ = au, M_ = cu, B_ = lu, H_ = uu, q_ = fu, z_ = du;
function V_(e = !1) {
  const t = [
    // any
    j_.default,
    M_.default,
    B_.default,
    H_.default,
    q_.default,
    z_.default,
    // object
    L_.default,
    x_.default,
    F_.default,
    k_.default,
    U_.default
  ];
  return e ? t.push(P_.default, R_.default) : t.push(I_.default, O_.default), t.push(D_.default), t;
}
ya.default = V_;
var hu = {}, Ci = {};
Object.defineProperty(Ci, "__esModule", { value: !0 });
Ci.dynamicAnchor = void 0;
const cc = ue, G_ = on(), Jf = St, W_ = On, K_ = {
  keyword: "$dynamicAnchor",
  schemaType: "string",
  code: (e) => lm(e, e.schema)
};
function lm(e, t) {
  const { gen: n, it: r } = e;
  r.schemaEnv.root.dynamicAnchors[t] = !0;
  const i = (0, cc._)`${G_.default.dynamicAnchors}${(0, cc.getProperty)(t)}`, o = r.errSchemaPath === "#" ? r.validateName : J_(e);
  n.if((0, cc._)`!${i}`, () => n.assign(i, o));
}
Ci.dynamicAnchor = lm;
function J_(e) {
  const { schemaEnv: t, schema: n, self: r } = e.it, { root: i, baseId: o, localRefs: s, meta: a } = t.root, { schemaId: c } = r.opts, u = new Jf.SchemaEnv({ schema: n, schemaId: c, root: i, baseId: o, localRefs: s, meta: a });
  return Jf.compileSchema.call(r, u), (0, W_.getValidate)(e, u);
}
Ci.default = K_;
var Ni = {};
Object.defineProperty(Ni, "__esModule", { value: !0 });
Ni.dynamicRef = void 0;
const Yf = ue, Y_ = on(), Xf = On, X_ = {
  keyword: "$dynamicRef",
  schemaType: "string",
  code: (e) => um(e, e.schema)
};
function um(e, t) {
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
      const u = n.let("_v", (0, Yf._)`${Y_.default.dynamicAnchors}${(0, Yf.getProperty)(o)}`);
      n.if(u, a(u, c), a(i.validateName, c));
    } else
      a(i.validateName, c)();
  }
  function a(c, u) {
    return u ? () => n.block(() => {
      (0, Xf.callRef)(e, c), n.let(u, !0);
    }) : () => (0, Xf.callRef)(e, c);
  }
}
Ni.dynamicRef = um;
Ni.default = X_;
var pu = {};
Object.defineProperty(pu, "__esModule", { value: !0 });
const Z_ = Ci, Q_ = ee, e$ = {
  keyword: "$recursiveAnchor",
  schemaType: "boolean",
  code(e) {
    e.schema ? (0, Z_.dynamicAnchor)(e, "") : (0, Q_.checkStrictMode)(e.it, "$recursiveAnchor: false is ignored");
  }
};
pu.default = e$;
var mu = {};
Object.defineProperty(mu, "__esModule", { value: !0 });
const t$ = Ni, n$ = {
  keyword: "$recursiveRef",
  schemaType: "string",
  code: (e) => (0, t$.dynamicRef)(e, e.schema)
};
mu.default = n$;
Object.defineProperty(hu, "__esModule", { value: !0 });
const r$ = Ci, i$ = Ni, o$ = pu, s$ = mu, a$ = [r$.default, i$.default, o$.default, s$.default];
hu.default = a$;
var gu = {}, yu = {};
Object.defineProperty(yu, "__esModule", { value: !0 });
const Zf = va, c$ = {
  keyword: "dependentRequired",
  type: "object",
  schemaType: "object",
  error: Zf.error,
  code: (e) => (0, Zf.validatePropertyDeps)(e)
};
yu.default = c$;
var vu = {};
Object.defineProperty(vu, "__esModule", { value: !0 });
const l$ = va, u$ = {
  keyword: "dependentSchemas",
  type: "object",
  schemaType: "object",
  code: (e) => (0, l$.validateSchemaDeps)(e)
};
vu.default = u$;
var wu = {};
Object.defineProperty(wu, "__esModule", { value: !0 });
const f$ = ee, d$ = {
  keyword: ["maxContains", "minContains"],
  type: "array",
  schemaType: "number",
  code({ keyword: e, parentSchema: t, it: n }) {
    t.contains === void 0 && (0, f$.checkStrictMode)(n, `"${e}" without "contains" is ignored`);
  }
};
wu.default = d$;
Object.defineProperty(gu, "__esModule", { value: !0 });
const h$ = yu, p$ = vu, m$ = wu, g$ = [h$.default, p$.default, m$.default];
gu.default = g$;
var Eu = {}, _u = {};
Object.defineProperty(_u, "__esModule", { value: !0 });
const qn = ue, Qf = ee, y$ = on(), v$ = {
  message: "must NOT have unevaluated properties",
  params: ({ params: e }) => (0, qn._)`{unevaluatedProperty: ${e.unevaluatedProperty}}`
}, w$ = {
  keyword: "unevaluatedProperties",
  type: "object",
  schemaType: ["boolean", "object"],
  trackErrors: !0,
  error: v$,
  code(e) {
    const { gen: t, schema: n, data: r, errsCount: i, it: o } = e;
    if (!i)
      throw new Error("ajv implementation error");
    const { allErrors: s, props: a } = o;
    a instanceof qn.Name ? t.if((0, qn._)`${a} !== true`, () => t.forIn("key", r, (f) => t.if(u(a, f), () => c(f)))) : a !== !0 && t.forIn("key", r, (f) => a === void 0 ? c(f) : t.if(l(a, f), () => c(f))), o.props = !0, e.ok((0, qn._)`${i} === ${y$.default.errors}`);
    function c(f) {
      if (n === !1) {
        e.setParams({ unevaluatedProperty: f }), e.error(), s || t.break();
        return;
      }
      if (!(0, Qf.alwaysValidSchema)(o, n)) {
        const h = t.name("valid");
        e.subschema({
          keyword: "unevaluatedProperties",
          dataProp: f,
          dataPropType: Qf.Type.Str
        }, h), s || t.if((0, qn.not)(h), () => t.break());
      }
    }
    function u(f, h) {
      return (0, qn._)`!${f} || !${f}[${h}]`;
    }
    function l(f, h) {
      const d = [];
      for (const m in f)
        f[m] === !0 && d.push((0, qn._)`${h} !== ${m}`);
      return (0, qn.and)(...d);
    }
  }
};
_u.default = w$;
var $u = {};
Object.defineProperty($u, "__esModule", { value: !0 });
const Cr = ue, ed = ee, E$ = {
  message: ({ params: { len: e } }) => (0, Cr.str)`must NOT have more than ${e} items`,
  params: ({ params: { len: e } }) => (0, Cr._)`{limit: ${e}}`
}, _$ = {
  keyword: "unevaluatedItems",
  type: "array",
  schemaType: ["boolean", "object"],
  error: E$,
  code(e) {
    const { gen: t, schema: n, data: r, it: i } = e, o = i.items || 0;
    if (o === !0)
      return;
    const s = t.const("len", (0, Cr._)`${r}.length`);
    if (n === !1)
      e.setParams({ len: o }), e.fail((0, Cr._)`${s} > ${o}`);
    else if (typeof n == "object" && !(0, ed.alwaysValidSchema)(i, n)) {
      const c = t.var("valid", (0, Cr._)`${s} <= ${o}`);
      t.if((0, Cr.not)(c), () => a(c, o)), e.ok(c);
    }
    i.items = !0;
    function a(c, u) {
      t.forRange("i", u, s, (l) => {
        e.subschema({ keyword: "unevaluatedItems", dataProp: l, dataPropType: ed.Type.Num }, c), i.allErrors || t.if((0, Cr.not)(c), () => t.break());
      });
    }
  }
};
$u.default = _$;
Object.defineProperty(Eu, "__esModule", { value: !0 });
const $$ = _u, S$ = $u, b$ = [$$.default, S$.default];
Eu.default = b$;
var Ea = {}, Su = {};
Object.defineProperty(Su, "__esModule", { value: !0 });
const Ke = ue, A$ = {
  message: ({ schemaCode: e }) => (0, Ke.str)`must match format "${e}"`,
  params: ({ schemaCode: e }) => (0, Ke._)`{format: ${e}}`
}, T$ = {
  keyword: "format",
  type: ["number", "string"],
  schemaType: "string",
  $data: !0,
  error: A$,
  code(e, t) {
    const { gen: n, data: r, $data: i, schema: o, schemaCode: s, it: a } = e, { opts: c, errSchemaPath: u, schemaEnv: l, self: f } = a;
    if (!c.validateFormats)
      return;
    i ? h() : d();
    function h() {
      const m = n.scopeValue("formats", {
        ref: f.formats,
        code: c.code.formats
      }), p = n.const("fDef", (0, Ke._)`${m}[${s}]`), w = n.let("fType"), E = n.let("format");
      n.if((0, Ke._)`typeof ${p} == "object" && !(${p} instanceof RegExp)`, () => n.assign(w, (0, Ke._)`${p}.type || "string"`).assign(E, (0, Ke._)`${p}.validate`), () => n.assign(w, (0, Ke._)`"string"`).assign(E, p)), e.fail$data((0, Ke.or)(y(), _()));
      function y() {
        return c.strictSchema === !1 ? Ke.nil : (0, Ke._)`${s} && !${E}`;
      }
      function _() {
        const S = l.$async ? (0, Ke._)`(${p}.async ? await ${E}(${r}) : ${E}(${r}))` : (0, Ke._)`${E}(${r})`, C = (0, Ke._)`(typeof ${E} == "function" ? ${S} : ${E}.test(${r}))`;
        return (0, Ke._)`${E} && ${E} !== true && ${w} === ${t} && !${C}`;
      }
    }
    function d() {
      const m = f.formats[o];
      if (!m) {
        y();
        return;
      }
      if (m === !0)
        return;
      const [p, w, E] = _(m);
      p === t && e.pass(S());
      function y() {
        if (c.strictSchema === !1) {
          f.logger.warn(C());
          return;
        }
        throw new Error(C());
        function C() {
          return `unknown format "${o}" ignored in schema at path "${u}"`;
        }
      }
      function _(C) {
        const j = C instanceof RegExp ? (0, Ke.regexpCode)(C) : c.code.formats ? (0, Ke._)`${c.code.formats}${(0, Ke.getProperty)(o)}` : void 0, V = n.scopeValue("formats", { key: o, ref: C, code: j });
        return typeof C == "object" && !(C instanceof RegExp) ? [C.type || "string", C.validate, (0, Ke._)`${V}.validate`] : ["string", C, V];
      }
      function S() {
        if (typeof m == "object" && !(m instanceof RegExp) && m.async) {
          if (!l.$async)
            throw new Error("async format in sync schema");
          return (0, Ke._)`await ${E}(${r})`;
        }
        return typeof w == "function" ? (0, Ke._)`${E}(${r})` : (0, Ke._)`${E}.test(${r})`;
      }
    }
  }
};
Su.default = T$;
Object.defineProperty(Ea, "__esModule", { value: !0 });
const C$ = Su, N$ = [C$.default];
Ea.default = N$;
var jr = {};
Object.defineProperty(jr, "__esModule", { value: !0 });
jr.contentVocabulary = jr.metadataVocabulary = void 0;
jr.metadataVocabulary = [
  "title",
  "description",
  "default",
  "deprecated",
  "readOnly",
  "writeOnly",
  "examples"
];
jr.contentVocabulary = [
  "contentMediaType",
  "contentEncoding",
  "contentSchema"
];
Object.defineProperty(Hl, "__esModule", { value: !0 });
const I$ = ma, P$ = ga, O$ = ya, R$ = hu, D$ = gu, F$ = Eu, L$ = Ea, td = jr, x$ = [
  R$.default,
  I$.default,
  P$.default,
  (0, O$.default)(!0),
  L$.default,
  td.metadataVocabulary,
  td.contentVocabulary,
  D$.default,
  F$.default
];
Hl.default = x$;
var _a = {}, $a = {};
Object.defineProperty($a, "__esModule", { value: !0 });
$a.DiscrError = void 0;
var nd;
(function(e) {
  e.Tag = "tag", e.Mapping = "mapping";
})(nd || ($a.DiscrError = nd = {}));
Object.defineProperty(_a, "__esModule", { value: !0 });
const ri = ue, il = $a, rd = St, k$ = Hr, U$ = ee, j$ = {
  message: ({ params: { discrError: e, tagName: t } }) => e === il.DiscrError.Tag ? `tag "${t}" must be string` : `value of tag "${t}" must be in oneOf`,
  params: ({ params: { discrError: e, tag: t, tagName: n } }) => (0, ri._)`{error: ${e}, tag: ${n}, tagValue: ${t}}`
}, M$ = {
  keyword: "discriminator",
  type: "object",
  schemaType: "object",
  error: j$,
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
    const c = t.let("valid", !1), u = t.const("tag", (0, ri._)`${n}${(0, ri.getProperty)(a)}`);
    t.if((0, ri._)`typeof ${u} == "string"`, () => l(), () => e.error(!1, { discrError: il.DiscrError.Tag, tag: u, tagName: a })), e.ok(c);
    function l() {
      const d = h();
      t.if(!1);
      for (const m in d)
        t.elseIf((0, ri._)`${u} === ${m}`), t.assign(c, f(d[m]));
      t.else(), e.error(!1, { discrError: il.DiscrError.Mapping, tag: u, tagName: a }), t.endIf();
    }
    function f(d) {
      const m = t.name("valid"), p = e.subschema({ keyword: "oneOf", schemaProp: d }, m);
      return e.mergeEvaluated(p, ri.Name), m;
    }
    function h() {
      var d;
      const m = {}, p = E(i);
      let w = !0;
      for (let S = 0; S < s.length; S++) {
        let C = s[S];
        if (C != null && C.$ref && !(0, U$.schemaHasRulesButRef)(C, o.self.RULES)) {
          const V = C.$ref;
          if (C = rd.resolveRef.call(o.self, o.schemaEnv.root, o.baseId, V), C instanceof rd.SchemaEnv && (C = C.schema), C === void 0)
            throw new k$.default(o.opts.uriResolver, o.baseId, V);
        }
        const j = (d = C == null ? void 0 : C.properties) === null || d === void 0 ? void 0 : d[a];
        if (typeof j != "object")
          throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${a}"`);
        w = w && (p || E(C)), y(j, S);
      }
      if (!w)
        throw new Error(`discriminator: "${a}" must be required`);
      return m;
      function E({ required: S }) {
        return Array.isArray(S) && S.includes(a);
      }
      function y(S, C) {
        if (S.const)
          _(S.const, C);
        else if (S.enum)
          for (const j of S.enum)
            _(j, C);
        else
          throw new Error(`discriminator: "properties/${a}" must have "const" or "enum"`);
      }
      function _(S, C) {
        if (typeof S != "string" || S in m)
          throw new Error(`discriminator: "${a}" values must be unique strings`);
        m[S] = C;
      }
    }
  }
};
_a.default = M$;
var bu = {};
const B$ = "https://json-schema.org/draft/2020-12/schema", H$ = "https://json-schema.org/draft/2020-12/schema", q$ = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0,
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0,
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0,
  "https://json-schema.org/draft/2020-12/vocab/validation": !0,
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0,
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0,
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, z$ = "meta", V$ = "Core and Validation specifications meta-schema", G$ = [
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
], W$ = [
  "object",
  "boolean"
], K$ = "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.", J$ = {
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
}, Y$ = {
  $schema: B$,
  $id: H$,
  $vocabulary: q$,
  $dynamicAnchor: z$,
  title: V$,
  allOf: G$,
  type: W$,
  $comment: K$,
  properties: J$
}, X$ = "https://json-schema.org/draft/2020-12/schema", Z$ = "https://json-schema.org/draft/2020-12/meta/applicator", Q$ = {
  "https://json-schema.org/draft/2020-12/vocab/applicator": !0
}, eS = "meta", tS = "Applicator vocabulary meta-schema", nS = [
  "object",
  "boolean"
], rS = {
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
}, iS = {
  schemaArray: {
    type: "array",
    minItems: 1,
    items: {
      $dynamicRef: "#meta"
    }
  }
}, oS = {
  $schema: X$,
  $id: Z$,
  $vocabulary: Q$,
  $dynamicAnchor: eS,
  title: tS,
  type: nS,
  properties: rS,
  $defs: iS
}, sS = "https://json-schema.org/draft/2020-12/schema", aS = "https://json-schema.org/draft/2020-12/meta/unevaluated", cS = {
  "https://json-schema.org/draft/2020-12/vocab/unevaluated": !0
}, lS = "meta", uS = "Unevaluated applicator vocabulary meta-schema", fS = [
  "object",
  "boolean"
], dS = {
  unevaluatedItems: {
    $dynamicRef: "#meta"
  },
  unevaluatedProperties: {
    $dynamicRef: "#meta"
  }
}, hS = {
  $schema: sS,
  $id: aS,
  $vocabulary: cS,
  $dynamicAnchor: lS,
  title: uS,
  type: fS,
  properties: dS
}, pS = "https://json-schema.org/draft/2020-12/schema", mS = "https://json-schema.org/draft/2020-12/meta/content", gS = {
  "https://json-schema.org/draft/2020-12/vocab/content": !0
}, yS = "meta", vS = "Content vocabulary meta-schema", wS = [
  "object",
  "boolean"
], ES = {
  contentEncoding: {
    type: "string"
  },
  contentMediaType: {
    type: "string"
  },
  contentSchema: {
    $dynamicRef: "#meta"
  }
}, _S = {
  $schema: pS,
  $id: mS,
  $vocabulary: gS,
  $dynamicAnchor: yS,
  title: vS,
  type: wS,
  properties: ES
}, $S = "https://json-schema.org/draft/2020-12/schema", SS = "https://json-schema.org/draft/2020-12/meta/core", bS = {
  "https://json-schema.org/draft/2020-12/vocab/core": !0
}, AS = "meta", TS = "Core vocabulary meta-schema", CS = [
  "object",
  "boolean"
], NS = {
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
}, IS = {
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
}, PS = {
  $schema: $S,
  $id: SS,
  $vocabulary: bS,
  $dynamicAnchor: AS,
  title: TS,
  type: CS,
  properties: NS,
  $defs: IS
}, OS = "https://json-schema.org/draft/2020-12/schema", RS = "https://json-schema.org/draft/2020-12/meta/format-annotation", DS = {
  "https://json-schema.org/draft/2020-12/vocab/format-annotation": !0
}, FS = "meta", LS = "Format vocabulary meta-schema for annotation results", xS = [
  "object",
  "boolean"
], kS = {
  format: {
    type: "string"
  }
}, US = {
  $schema: OS,
  $id: RS,
  $vocabulary: DS,
  $dynamicAnchor: FS,
  title: LS,
  type: xS,
  properties: kS
}, jS = "https://json-schema.org/draft/2020-12/schema", MS = "https://json-schema.org/draft/2020-12/meta/meta-data", BS = {
  "https://json-schema.org/draft/2020-12/vocab/meta-data": !0
}, HS = "meta", qS = "Meta-data vocabulary meta-schema", zS = [
  "object",
  "boolean"
], VS = {
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
}, GS = {
  $schema: jS,
  $id: MS,
  $vocabulary: BS,
  $dynamicAnchor: HS,
  title: qS,
  type: zS,
  properties: VS
}, WS = "https://json-schema.org/draft/2020-12/schema", KS = "https://json-schema.org/draft/2020-12/meta/validation", JS = {
  "https://json-schema.org/draft/2020-12/vocab/validation": !0
}, YS = "meta", XS = "Validation vocabulary meta-schema", ZS = [
  "object",
  "boolean"
], QS = {
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
}, eb = {
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
}, tb = {
  $schema: WS,
  $id: KS,
  $vocabulary: JS,
  $dynamicAnchor: YS,
  title: XS,
  type: ZS,
  properties: QS,
  $defs: eb
};
Object.defineProperty(bu, "__esModule", { value: !0 });
const nb = Y$, rb = oS, ib = hS, ob = _S, sb = PS, ab = US, cb = GS, lb = tb, ub = ["/properties"];
function fb(e) {
  return [
    nb,
    rb,
    ib,
    ob,
    sb,
    t(this, ab),
    cb,
    t(this, lb)
  ].forEach((n) => this.addMetaSchema(n, void 0, !1)), this;
  function t(n, r) {
    return e ? n.$dataMetaSchema(r, ub) : r;
  }
}
bu.default = fb;
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv2020 = void 0;
  const n = Pl, r = Hl, i = _a, o = bu, s = "https://json-schema.org/draft/2020-12/schema";
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
  var c = Do();
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
  var l = bi;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return l.default;
  } });
  var f = Hr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return f.default;
  } });
})(Xc, Xc.exports);
var db = Xc.exports, ol = { exports: {} }, fm = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
  function t(M, W) {
    return { validate: M, compare: W };
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
    uri: E,
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
    byte: _,
    // signed 32 bit integer
    int32: { type: "number", validate: j },
    // signed 64 bit integer
    int64: { type: "number", validate: V },
    // C-type float
    float: { type: "number", validate: G },
    // C-type double
    double: { type: "number", validate: G },
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
  function n(M) {
    return M % 4 === 0 && (M % 100 !== 0 || M % 400 === 0);
  }
  const r = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, i = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  function o(M) {
    const W = r.exec(M);
    if (!W)
      return !1;
    const X = +W[1], L = +W[2], U = +W[3];
    return L >= 1 && L <= 12 && U >= 1 && U <= (L === 2 && n(X) ? 29 : i[L]);
  }
  function s(M, W) {
    if (M && W)
      return M > W ? 1 : M < W ? -1 : 0;
  }
  const a = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
  function c(M) {
    return function(X) {
      const L = a.exec(X);
      if (!L)
        return !1;
      const U = +L[1], K = +L[2], z = +L[3], Z = L[4], J = L[5] === "-" ? -1 : 1, B = +(L[6] || 0), P = +(L[7] || 0);
      if (B > 23 || P > 59 || M && !Z)
        return !1;
      if (U <= 23 && K <= 59 && z < 60)
        return !0;
      const F = K - P * J, D = U - B * J - (F < 0 ? 1 : 0);
      return (D === 23 || D === -1) && (F === 59 || F === -1) && z < 61;
    };
  }
  function u(M, W) {
    if (!(M && W))
      return;
    const X = (/* @__PURE__ */ new Date("2020-01-01T" + M)).valueOf(), L = (/* @__PURE__ */ new Date("2020-01-01T" + W)).valueOf();
    if (X && L)
      return X - L;
  }
  function l(M, W) {
    if (!(M && W))
      return;
    const X = a.exec(M), L = a.exec(W);
    if (X && L)
      return M = X[1] + X[2] + X[3], W = L[1] + L[2] + L[3], M > W ? 1 : M < W ? -1 : 0;
  }
  const f = /t|\s/i;
  function h(M) {
    const W = c(M);
    return function(L) {
      const U = L.split(f);
      return U.length === 2 && o(U[0]) && W(U[1]);
    };
  }
  function d(M, W) {
    if (!(M && W))
      return;
    const X = new Date(M).valueOf(), L = new Date(W).valueOf();
    if (X && L)
      return X - L;
  }
  function m(M, W) {
    if (!(M && W))
      return;
    const [X, L] = M.split(f), [U, K] = W.split(f), z = s(X, U);
    if (z !== void 0)
      return z || u(L, K);
  }
  const p = /\/|:/, w = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
  function E(M) {
    return p.test(M) && w.test(M);
  }
  const y = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
  function _(M) {
    return y.lastIndex = 0, y.test(M);
  }
  const S = -2147483648, C = 2 ** 31 - 1;
  function j(M) {
    return Number.isInteger(M) && M <= C && M >= S;
  }
  function V(M) {
    return Number.isInteger(M);
  }
  function G() {
    return !0;
  }
  const q = /[^\\]\\Z/;
  function b(M) {
    if (q.test(M))
      return !1;
    try {
      return new RegExp(M), !0;
    } catch {
      return !1;
    }
  }
})(fm);
var dm = {}, sl = { exports: {} }, Au = {};
Object.defineProperty(Au, "__esModule", { value: !0 });
const hb = ma, pb = ga, mb = ya, gb = Ea, id = jr, yb = [
  hb.default,
  pb.default,
  (0, mb.default)(),
  gb.default,
  id.metadataVocabulary,
  id.contentVocabulary
];
Au.default = yb;
const vb = "http://json-schema.org/draft-07/schema#", wb = "http://json-schema.org/draft-07/schema#", Eb = "Core schema meta-schema", _b = {
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
}, $b = [
  "object",
  "boolean"
], Sb = {
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
}, bb = {
  $schema: vb,
  $id: wb,
  title: Eb,
  definitions: _b,
  type: $b,
  properties: Sb,
  default: !0
};
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 }), t.MissingRefError = t.ValidationError = t.CodeGen = t.Name = t.nil = t.stringify = t.str = t._ = t.KeywordCxt = t.Ajv = void 0;
  const n = Pl, r = Au, i = _a, o = bb, s = ["/properties"], a = "http://json-schema.org/draft-07/schema";
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
  var u = Do();
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
  var f = bi;
  Object.defineProperty(t, "ValidationError", { enumerable: !0, get: function() {
    return f.default;
  } });
  var h = Hr;
  Object.defineProperty(t, "MissingRefError", { enumerable: !0, get: function() {
    return h.default;
  } });
})(sl, sl.exports);
var Ab = sl.exports;
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
  const t = Ab, n = ue, r = n.operators, i = {
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
      p.$data ? w() : E();
      function w() {
        const _ = c.scopeValue("formats", {
          ref: m.formats,
          code: d.code.formats
        }), S = c.const("fmt", (0, n._)`${_}[${p.schemaCode}]`);
        a.fail$data((0, n.or)((0, n._)`typeof ${S} != "object"`, (0, n._)`${S} instanceof RegExp`, (0, n._)`typeof ${S}.compare != "function"`, y(S)));
      }
      function E() {
        const _ = p.schema, S = m.formats[_];
        if (!S || S === !0)
          return;
        if (typeof S != "object" || S instanceof RegExp || typeof S.compare != "function")
          throw new Error(`"${f}": format "${_}" does not define "compare" function`);
        const C = c.scopeValue("formats", {
          key: _,
          ref: S,
          code: d.code.formats ? (0, n._)`${d.code.formats}${(0, n.getProperty)(_)}` : void 0
        });
        a.fail$data(y(C));
      }
      function y(_) {
        return (0, n._)`${_}.compare(${u}, ${l}) ${i[f].fail} 0`;
      }
    },
    dependencies: ["format"]
  };
  const s = (a) => (a.addKeyword(e.formatLimitDefinition), a);
  e.default = s;
})(dm);
(function(e, t) {
  Object.defineProperty(t, "__esModule", { value: !0 });
  const n = fm, r = dm, i = ue, o = new i.Name("fullFormats"), s = new i.Name("fastFormats"), a = (u, l = { keywords: !0 }) => {
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
})(ol, ol.exports);
var Tb = ol.exports;
const Cb = /* @__PURE__ */ Il(Tb), Nb = (e, t, n, r) => {
  if (n === "length" || n === "prototype" || n === "arguments" || n === "caller")
    return;
  const i = Object.getOwnPropertyDescriptor(e, n), o = Object.getOwnPropertyDescriptor(t, n);
  !Ib(i, o) && r || Object.defineProperty(e, n, o);
}, Ib = function(e, t) {
  return e === void 0 || e.configurable || e.writable === t.writable && e.enumerable === t.enumerable && e.configurable === t.configurable && (e.writable || e.value === t.value);
}, Pb = (e, t) => {
  const n = Object.getPrototypeOf(t);
  n !== Object.getPrototypeOf(e) && Object.setPrototypeOf(e, n);
}, Ob = (e, t) => `/* Wrapped ${e}*/
${t}`, Rb = Object.getOwnPropertyDescriptor(Function.prototype, "toString"), Db = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name"), Fb = (e, t, n) => {
  const r = n === "" ? "" : `with ${n.trim()}() `, i = Ob.bind(null, r, t.toString());
  Object.defineProperty(i, "name", Db);
  const { writable: o, enumerable: s, configurable: a } = Rb;
  Object.defineProperty(e, "toString", { value: i, writable: o, enumerable: s, configurable: a });
};
function Lb(e, t, { ignoreNonConfigurable: n = !1 } = {}) {
  const { name: r } = e;
  for (const i of Reflect.ownKeys(t))
    Nb(e, t, i, n);
  return Pb(e, t), Fb(e, t, r), e;
}
const od = (e, t = {}) => {
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
  return Lb(u, e), u.cancel = () => {
    s && (clearTimeout(s), s = void 0), a && (clearTimeout(a), a = void 0);
  }, u;
};
var al = { exports: {} };
const xb = "2.0.0", hm = 256, kb = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */
9007199254740991, Ub = 16, jb = hm - 6, Mb = [
  "major",
  "premajor",
  "minor",
  "preminor",
  "patch",
  "prepatch",
  "prerelease"
];
var Sa = {
  MAX_LENGTH: hm,
  MAX_SAFE_COMPONENT_LENGTH: Ub,
  MAX_SAFE_BUILD_LENGTH: jb,
  MAX_SAFE_INTEGER: kb,
  RELEASE_TYPES: Mb,
  SEMVER_SPEC_VERSION: xb,
  FLAG_INCLUDE_PRERELEASE: 1,
  FLAG_LOOSE: 2
};
const Bb = typeof process == "object" && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...e) => console.error("SEMVER", ...e) : () => {
};
var ba = Bb;
(function(e, t) {
  const {
    MAX_SAFE_COMPONENT_LENGTH: n,
    MAX_SAFE_BUILD_LENGTH: r,
    MAX_LENGTH: i
  } = Sa, o = ba;
  t = e.exports = {};
  const s = t.re = [], a = t.safeRe = [], c = t.src = [], u = t.safeSrc = [], l = t.t = {};
  let f = 0;
  const h = "[a-zA-Z0-9-]", d = [
    ["\\s", 1],
    ["\\d", i],
    [h, r]
  ], m = (w) => {
    for (const [E, y] of d)
      w = w.split(`${E}*`).join(`${E}{0,${y}}`).split(`${E}+`).join(`${E}{1,${y}}`);
    return w;
  }, p = (w, E, y) => {
    const _ = m(E), S = f++;
    o(w, S, E), l[w] = S, c[S] = E, u[S] = _, s[S] = new RegExp(E, y ? "g" : void 0), a[S] = new RegExp(_, y ? "g" : void 0);
  };
  p("NUMERICIDENTIFIER", "0|[1-9]\\d*"), p("NUMERICIDENTIFIERLOOSE", "\\d+"), p("NONNUMERICIDENTIFIER", `\\d*[a-zA-Z-]${h}*`), p("MAINVERSION", `(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})\\.(${c[l.NUMERICIDENTIFIER]})`), p("MAINVERSIONLOOSE", `(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})\\.(${c[l.NUMERICIDENTIFIERLOOSE]})`), p("PRERELEASEIDENTIFIER", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIER]})`), p("PRERELEASEIDENTIFIERLOOSE", `(?:${c[l.NONNUMERICIDENTIFIER]}|${c[l.NUMERICIDENTIFIERLOOSE]})`), p("PRERELEASE", `(?:-(${c[l.PRERELEASEIDENTIFIER]}(?:\\.${c[l.PRERELEASEIDENTIFIER]})*))`), p("PRERELEASELOOSE", `(?:-?(${c[l.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${c[l.PRERELEASEIDENTIFIERLOOSE]})*))`), p("BUILDIDENTIFIER", `${h}+`), p("BUILD", `(?:\\+(${c[l.BUILDIDENTIFIER]}(?:\\.${c[l.BUILDIDENTIFIER]})*))`), p("FULLPLAIN", `v?${c[l.MAINVERSION]}${c[l.PRERELEASE]}?${c[l.BUILD]}?`), p("FULL", `^${c[l.FULLPLAIN]}$`), p("LOOSEPLAIN", `[v=\\s]*${c[l.MAINVERSIONLOOSE]}${c[l.PRERELEASELOOSE]}?${c[l.BUILD]}?`), p("LOOSE", `^${c[l.LOOSEPLAIN]}$`), p("GTLT", "((?:<|>)?=?)"), p("XRANGEIDENTIFIERLOOSE", `${c[l.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`), p("XRANGEIDENTIFIER", `${c[l.NUMERICIDENTIFIER]}|x|X|\\*`), p("XRANGEPLAIN", `[v=\\s]*(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:\\.(${c[l.XRANGEIDENTIFIER]})(?:${c[l.PRERELEASE]})?${c[l.BUILD]}?)?)?`), p("XRANGEPLAINLOOSE", `[v=\\s]*(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:\\.(${c[l.XRANGEIDENTIFIERLOOSE]})(?:${c[l.PRERELEASELOOSE]})?${c[l.BUILD]}?)?)?`), p("XRANGE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAIN]}$`), p("XRANGELOOSE", `^${c[l.GTLT]}\\s*${c[l.XRANGEPLAINLOOSE]}$`), p("COERCEPLAIN", `(^|[^\\d])(\\d{1,${n}})(?:\\.(\\d{1,${n}}))?(?:\\.(\\d{1,${n}}))?`), p("COERCE", `${c[l.COERCEPLAIN]}(?:$|[^\\d])`), p("COERCEFULL", c[l.COERCEPLAIN] + `(?:${c[l.PRERELEASE]})?(?:${c[l.BUILD]})?(?:$|[^\\d])`), p("COERCERTL", c[l.COERCE], !0), p("COERCERTLFULL", c[l.COERCEFULL], !0), p("LONETILDE", "(?:~>?)"), p("TILDETRIM", `(\\s*)${c[l.LONETILDE]}\\s+`, !0), t.tildeTrimReplace = "$1~", p("TILDE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAIN]}$`), p("TILDELOOSE", `^${c[l.LONETILDE]}${c[l.XRANGEPLAINLOOSE]}$`), p("LONECARET", "(?:\\^)"), p("CARETTRIM", `(\\s*)${c[l.LONECARET]}\\s+`, !0), t.caretTrimReplace = "$1^", p("CARET", `^${c[l.LONECARET]}${c[l.XRANGEPLAIN]}$`), p("CARETLOOSE", `^${c[l.LONECARET]}${c[l.XRANGEPLAINLOOSE]}$`), p("COMPARATORLOOSE", `^${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]})$|^$`), p("COMPARATOR", `^${c[l.GTLT]}\\s*(${c[l.FULLPLAIN]})$|^$`), p("COMPARATORTRIM", `(\\s*)${c[l.GTLT]}\\s*(${c[l.LOOSEPLAIN]}|${c[l.XRANGEPLAIN]})`, !0), t.comparatorTrimReplace = "$1$2$3", p("HYPHENRANGE", `^\\s*(${c[l.XRANGEPLAIN]})\\s+-\\s+(${c[l.XRANGEPLAIN]})\\s*$`), p("HYPHENRANGELOOSE", `^\\s*(${c[l.XRANGEPLAINLOOSE]})\\s+-\\s+(${c[l.XRANGEPLAINLOOSE]})\\s*$`), p("STAR", "(<|>)?=?\\s*\\*"), p("GTE0", "^\\s*>=\\s*0\\.0\\.0\\s*$"), p("GTE0PRE", "^\\s*>=\\s*0\\.0\\.0-0\\s*$");
})(al, al.exports);
var Lo = al.exports;
const Hb = Object.freeze({ loose: !0 }), qb = Object.freeze({}), zb = (e) => e ? typeof e != "object" ? Hb : e : qb;
var Tu = zb;
const sd = /^[0-9]+$/, pm = (e, t) => {
  if (typeof e == "number" && typeof t == "number")
    return e === t ? 0 : e < t ? -1 : 1;
  const n = sd.test(e), r = sd.test(t);
  return n && r && (e = +e, t = +t), e === t ? 0 : n && !r ? -1 : r && !n ? 1 : e < t ? -1 : 1;
}, Vb = (e, t) => pm(t, e);
var mm = {
  compareIdentifiers: pm,
  rcompareIdentifiers: Vb
};
const us = ba, { MAX_LENGTH: ad, MAX_SAFE_INTEGER: fs } = Sa, { safeRe: ds, t: hs } = Lo, Gb = Tu, { compareIdentifiers: lc } = mm;
let Wb = class fn {
  constructor(t, n) {
    if (n = Gb(n), t instanceof fn) {
      if (t.loose === !!n.loose && t.includePrerelease === !!n.includePrerelease)
        return t;
      t = t.version;
    } else if (typeof t != "string")
      throw new TypeError(`Invalid version. Must be a string. Got type "${typeof t}".`);
    if (t.length > ad)
      throw new TypeError(
        `version is longer than ${ad} characters`
      );
    us("SemVer", t, n), this.options = n, this.loose = !!n.loose, this.includePrerelease = !!n.includePrerelease;
    const r = t.trim().match(n.loose ? ds[hs.LOOSE] : ds[hs.FULL]);
    if (!r)
      throw new TypeError(`Invalid Version: ${t}`);
    if (this.raw = t, this.major = +r[1], this.minor = +r[2], this.patch = +r[3], this.major > fs || this.major < 0)
      throw new TypeError("Invalid major version");
    if (this.minor > fs || this.minor < 0)
      throw new TypeError("Invalid minor version");
    if (this.patch > fs || this.patch < 0)
      throw new TypeError("Invalid patch version");
    r[4] ? this.prerelease = r[4].split(".").map((i) => {
      if (/^[0-9]+$/.test(i)) {
        const o = +i;
        if (o >= 0 && o < fs)
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
    if (us("SemVer.compare", this.version, this.options, t), !(t instanceof fn)) {
      if (typeof t == "string" && t === this.version)
        return 0;
      t = new fn(t, this.options);
    }
    return t.version === this.version ? 0 : this.compareMain(t) || this.comparePre(t);
  }
  compareMain(t) {
    return t instanceof fn || (t = new fn(t, this.options)), this.major < t.major ? -1 : this.major > t.major ? 1 : this.minor < t.minor ? -1 : this.minor > t.minor ? 1 : this.patch < t.patch ? -1 : this.patch > t.patch ? 1 : 0;
  }
  comparePre(t) {
    if (t instanceof fn || (t = new fn(t, this.options)), this.prerelease.length && !t.prerelease.length)
      return -1;
    if (!this.prerelease.length && t.prerelease.length)
      return 1;
    if (!this.prerelease.length && !t.prerelease.length)
      return 0;
    let n = 0;
    do {
      const r = this.prerelease[n], i = t.prerelease[n];
      if (us("prerelease compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return lc(r, i);
    } while (++n);
  }
  compareBuild(t) {
    t instanceof fn || (t = new fn(t, this.options));
    let n = 0;
    do {
      const r = this.build[n], i = t.build[n];
      if (us("build compare", n, r, i), r === void 0 && i === void 0)
        return 0;
      if (i === void 0)
        return 1;
      if (r === void 0)
        return -1;
      if (r === i)
        continue;
      return lc(r, i);
    } while (++n);
  }
  // preminor will bump the version up to the next minor release, and immediately
  // down to pre-release. premajor and prepatch work the same way.
  inc(t, n, r) {
    if (t.startsWith("pre")) {
      if (!n && r === !1)
        throw new Error("invalid increment argument: identifier is empty");
      if (n) {
        const i = `-${n}`.match(this.options.loose ? ds[hs.PRERELEASELOOSE] : ds[hs.PRERELEASE]);
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
          r === !1 && (o = [n]), lc(this.prerelease[0], n) === 0 ? isNaN(this.prerelease[1]) && (this.prerelease = o) : this.prerelease = o;
        }
        break;
      }
      default:
        throw new Error(`invalid increment argument: ${t}`);
    }
    return this.raw = this.format(), this.build.length && (this.raw += `+${this.build.join(".")}`), this;
  }
};
var Ct = Wb;
const cd = Ct, Kb = (e, t, n = !1) => {
  if (e instanceof cd)
    return e;
  try {
    return new cd(e, t);
  } catch (r) {
    if (!n)
      return null;
    throw r;
  }
};
var Ii = Kb;
const Jb = Ii, Yb = (e, t) => {
  const n = Jb(e, t);
  return n ? n.version : null;
};
var Xb = Yb;
const Zb = Ii, Qb = (e, t) => {
  const n = Zb(e.trim().replace(/^[=v]+/, ""), t);
  return n ? n.version : null;
};
var eA = Qb;
const ld = Ct, tA = (e, t, n, r, i) => {
  typeof n == "string" && (i = r, r = n, n = void 0);
  try {
    return new ld(
      e instanceof ld ? e.version : e,
      n
    ).inc(t, r, i).version;
  } catch {
    return null;
  }
};
var nA = tA;
const ud = Ii, rA = (e, t) => {
  const n = ud(e, null, !0), r = ud(t, null, !0), i = n.compare(r);
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
var iA = rA;
const oA = Ct, sA = (e, t) => new oA(e, t).major;
var aA = sA;
const cA = Ct, lA = (e, t) => new cA(e, t).minor;
var uA = lA;
const fA = Ct, dA = (e, t) => new fA(e, t).patch;
var hA = dA;
const pA = Ii, mA = (e, t) => {
  const n = pA(e, t);
  return n && n.prerelease.length ? n.prerelease : null;
};
var gA = mA;
const fd = Ct, yA = (e, t, n) => new fd(e, n).compare(new fd(t, n));
var sn = yA;
const vA = sn, wA = (e, t, n) => vA(t, e, n);
var EA = wA;
const _A = sn, $A = (e, t) => _A(e, t, !0);
var SA = $A;
const dd = Ct, bA = (e, t, n) => {
  const r = new dd(e, n), i = new dd(t, n);
  return r.compare(i) || r.compareBuild(i);
};
var Cu = bA;
const AA = Cu, TA = (e, t) => e.sort((n, r) => AA(n, r, t));
var CA = TA;
const NA = Cu, IA = (e, t) => e.sort((n, r) => NA(r, n, t));
var PA = IA;
const OA = sn, RA = (e, t, n) => OA(e, t, n) > 0;
var Aa = RA;
const DA = sn, FA = (e, t, n) => DA(e, t, n) < 0;
var Nu = FA;
const LA = sn, xA = (e, t, n) => LA(e, t, n) === 0;
var gm = xA;
const kA = sn, UA = (e, t, n) => kA(e, t, n) !== 0;
var ym = UA;
const jA = sn, MA = (e, t, n) => jA(e, t, n) >= 0;
var Iu = MA;
const BA = sn, HA = (e, t, n) => BA(e, t, n) <= 0;
var Pu = HA;
const qA = gm, zA = ym, VA = Aa, GA = Iu, WA = Nu, KA = Pu, JA = (e, t, n, r) => {
  switch (t) {
    case "===":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e === n;
    case "!==":
      return typeof e == "object" && (e = e.version), typeof n == "object" && (n = n.version), e !== n;
    case "":
    case "=":
    case "==":
      return qA(e, n, r);
    case "!=":
      return zA(e, n, r);
    case ">":
      return VA(e, n, r);
    case ">=":
      return GA(e, n, r);
    case "<":
      return WA(e, n, r);
    case "<=":
      return KA(e, n, r);
    default:
      throw new TypeError(`Invalid operator: ${t}`);
  }
};
var vm = JA;
const YA = Ct, XA = Ii, { safeRe: ps, t: ms } = Lo, ZA = (e, t) => {
  if (e instanceof YA)
    return e;
  if (typeof e == "number" && (e = String(e)), typeof e != "string")
    return null;
  t = t || {};
  let n = null;
  if (!t.rtl)
    n = e.match(t.includePrerelease ? ps[ms.COERCEFULL] : ps[ms.COERCE]);
  else {
    const c = t.includePrerelease ? ps[ms.COERCERTLFULL] : ps[ms.COERCERTL];
    let u;
    for (; (u = c.exec(e)) && (!n || n.index + n[0].length !== e.length); )
      (!n || u.index + u[0].length !== n.index + n[0].length) && (n = u), c.lastIndex = u.index + u[1].length + u[2].length;
    c.lastIndex = -1;
  }
  if (n === null)
    return null;
  const r = n[2], i = n[3] || "0", o = n[4] || "0", s = t.includePrerelease && n[5] ? `-${n[5]}` : "", a = t.includePrerelease && n[6] ? `+${n[6]}` : "";
  return XA(`${r}.${i}.${o}${s}${a}`, t);
};
var QA = ZA;
class eT {
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
var tT = eT, uc, hd;
function an() {
  if (hd) return uc;
  hd = 1;
  const e = /\s+/g;
  class t {
    constructor(U, K) {
      if (K = i(K), U instanceof t)
        return U.loose === !!K.loose && U.includePrerelease === !!K.includePrerelease ? U : new t(U.raw, K);
      if (U instanceof o)
        return this.raw = U.value, this.set = [[U]], this.formatted = void 0, this;
      if (this.options = K, this.loose = !!K.loose, this.includePrerelease = !!K.includePrerelease, this.raw = U.trim().replace(e, " "), this.set = this.raw.split("||").map((z) => this.parseRange(z.trim())).filter((z) => z.length), !this.set.length)
        throw new TypeError(`Invalid SemVer Range: ${this.raw}`);
      if (this.set.length > 1) {
        const z = this.set[0];
        if (this.set = this.set.filter((Z) => !p(Z[0])), this.set.length === 0)
          this.set = [z];
        else if (this.set.length > 1) {
          for (const Z of this.set)
            if (Z.length === 1 && w(Z[0])) {
              this.set = [Z];
              break;
            }
        }
      }
      this.formatted = void 0;
    }
    get range() {
      if (this.formatted === void 0) {
        this.formatted = "";
        for (let U = 0; U < this.set.length; U++) {
          U > 0 && (this.formatted += "||");
          const K = this.set[U];
          for (let z = 0; z < K.length; z++)
            z > 0 && (this.formatted += " "), this.formatted += K[z].toString().trim();
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
    parseRange(U) {
      const z = ((this.options.includePrerelease && d) | (this.options.loose && m)) + ":" + U, Z = r.get(z);
      if (Z)
        return Z;
      const J = this.options.loose, B = J ? c[u.HYPHENRANGELOOSE] : c[u.HYPHENRANGE];
      U = U.replace(B, W(this.options.includePrerelease)), s("hyphen replace", U), U = U.replace(c[u.COMPARATORTRIM], l), s("comparator trim", U), U = U.replace(c[u.TILDETRIM], f), s("tilde trim", U), U = U.replace(c[u.CARETTRIM], h), s("caret trim", U);
      let P = U.split(" ").map((T) => y(T, this.options)).join(" ").split(/\s+/).map((T) => M(T, this.options));
      J && (P = P.filter((T) => (s("loose invalid filter", T, this.options), !!T.match(c[u.COMPARATORLOOSE])))), s("range list", P);
      const F = /* @__PURE__ */ new Map(), D = P.map((T) => new o(T, this.options));
      for (const T of D) {
        if (p(T))
          return [T];
        F.set(T.value, T);
      }
      F.size > 1 && F.has("") && F.delete("");
      const $ = [...F.values()];
      return r.set(z, $), $;
    }
    intersects(U, K) {
      if (!(U instanceof t))
        throw new TypeError("a Range is required");
      return this.set.some((z) => E(z, K) && U.set.some((Z) => E(Z, K) && z.every((J) => Z.every((B) => J.intersects(B, K)))));
    }
    // if ANY of the sets match ALL of its comparators, then pass
    test(U) {
      if (!U)
        return !1;
      if (typeof U == "string")
        try {
          U = new a(U, this.options);
        } catch {
          return !1;
        }
      for (let K = 0; K < this.set.length; K++)
        if (X(this.set[K], U, this.options))
          return !0;
      return !1;
    }
  }
  uc = t;
  const n = tT, r = new n(), i = Tu, o = Ta(), s = ba, a = Ct, {
    safeRe: c,
    t: u,
    comparatorTrimReplace: l,
    tildeTrimReplace: f,
    caretTrimReplace: h
  } = Lo, { FLAG_INCLUDE_PRERELEASE: d, FLAG_LOOSE: m } = Sa, p = (L) => L.value === "<0.0.0-0", w = (L) => L.value === "", E = (L, U) => {
    let K = !0;
    const z = L.slice();
    let Z = z.pop();
    for (; K && z.length; )
      K = z.every((J) => Z.intersects(J, U)), Z = z.pop();
    return K;
  }, y = (L, U) => (L = L.replace(c[u.BUILD], ""), s("comp", L, U), L = j(L, U), s("caret", L), L = S(L, U), s("tildes", L), L = G(L, U), s("xrange", L), L = b(L, U), s("stars", L), L), _ = (L) => !L || L.toLowerCase() === "x" || L === "*", S = (L, U) => L.trim().split(/\s+/).map((K) => C(K, U)).join(" "), C = (L, U) => {
    const K = U.loose ? c[u.TILDELOOSE] : c[u.TILDE];
    return L.replace(K, (z, Z, J, B, P) => {
      s("tilde", L, z, Z, J, B, P);
      let F;
      return _(Z) ? F = "" : _(J) ? F = `>=${Z}.0.0 <${+Z + 1}.0.0-0` : _(B) ? F = `>=${Z}.${J}.0 <${Z}.${+J + 1}.0-0` : P ? (s("replaceTilde pr", P), F = `>=${Z}.${J}.${B}-${P} <${Z}.${+J + 1}.0-0`) : F = `>=${Z}.${J}.${B} <${Z}.${+J + 1}.0-0`, s("tilde return", F), F;
    });
  }, j = (L, U) => L.trim().split(/\s+/).map((K) => V(K, U)).join(" "), V = (L, U) => {
    s("caret", L, U);
    const K = U.loose ? c[u.CARETLOOSE] : c[u.CARET], z = U.includePrerelease ? "-0" : "";
    return L.replace(K, (Z, J, B, P, F) => {
      s("caret", L, Z, J, B, P, F);
      let D;
      return _(J) ? D = "" : _(B) ? D = `>=${J}.0.0${z} <${+J + 1}.0.0-0` : _(P) ? J === "0" ? D = `>=${J}.${B}.0${z} <${J}.${+B + 1}.0-0` : D = `>=${J}.${B}.0${z} <${+J + 1}.0.0-0` : F ? (s("replaceCaret pr", F), J === "0" ? B === "0" ? D = `>=${J}.${B}.${P}-${F} <${J}.${B}.${+P + 1}-0` : D = `>=${J}.${B}.${P}-${F} <${J}.${+B + 1}.0-0` : D = `>=${J}.${B}.${P}-${F} <${+J + 1}.0.0-0`) : (s("no pr"), J === "0" ? B === "0" ? D = `>=${J}.${B}.${P}${z} <${J}.${B}.${+P + 1}-0` : D = `>=${J}.${B}.${P}${z} <${J}.${+B + 1}.0-0` : D = `>=${J}.${B}.${P} <${+J + 1}.0.0-0`), s("caret return", D), D;
    });
  }, G = (L, U) => (s("replaceXRanges", L, U), L.split(/\s+/).map((K) => q(K, U)).join(" ")), q = (L, U) => {
    L = L.trim();
    const K = U.loose ? c[u.XRANGELOOSE] : c[u.XRANGE];
    return L.replace(K, (z, Z, J, B, P, F) => {
      s("xRange", L, z, Z, J, B, P, F);
      const D = _(J), $ = D || _(B), T = $ || _(P), H = T;
      return Z === "=" && H && (Z = ""), F = U.includePrerelease ? "-0" : "", D ? Z === ">" || Z === "<" ? z = "<0.0.0-0" : z = "*" : Z && H ? ($ && (B = 0), P = 0, Z === ">" ? (Z = ">=", $ ? (J = +J + 1, B = 0, P = 0) : (B = +B + 1, P = 0)) : Z === "<=" && (Z = "<", $ ? J = +J + 1 : B = +B + 1), Z === "<" && (F = "-0"), z = `${Z + J}.${B}.${P}${F}`) : $ ? z = `>=${J}.0.0${F} <${+J + 1}.0.0-0` : T && (z = `>=${J}.${B}.0${F} <${J}.${+B + 1}.0-0`), s("xRange return", z), z;
    });
  }, b = (L, U) => (s("replaceStars", L, U), L.trim().replace(c[u.STAR], "")), M = (L, U) => (s("replaceGTE0", L, U), L.trim().replace(c[U.includePrerelease ? u.GTE0PRE : u.GTE0], "")), W = (L) => (U, K, z, Z, J, B, P, F, D, $, T, H) => (_(z) ? K = "" : _(Z) ? K = `>=${z}.0.0${L ? "-0" : ""}` : _(J) ? K = `>=${z}.${Z}.0${L ? "-0" : ""}` : B ? K = `>=${K}` : K = `>=${K}${L ? "-0" : ""}`, _(D) ? F = "" : _($) ? F = `<${+D + 1}.0.0-0` : _(T) ? F = `<${D}.${+$ + 1}.0-0` : H ? F = `<=${D}.${$}.${T}-${H}` : L ? F = `<${D}.${$}.${+T + 1}-0` : F = `<=${F}`, `${K} ${F}`.trim()), X = (L, U, K) => {
    for (let z = 0; z < L.length; z++)
      if (!L[z].test(U))
        return !1;
    if (U.prerelease.length && !K.includePrerelease) {
      for (let z = 0; z < L.length; z++)
        if (s(L[z].semver), L[z].semver !== o.ANY && L[z].semver.prerelease.length > 0) {
          const Z = L[z].semver;
          if (Z.major === U.major && Z.minor === U.minor && Z.patch === U.patch)
            return !0;
        }
      return !1;
    }
    return !0;
  };
  return uc;
}
var fc, pd;
function Ta() {
  if (pd) return fc;
  pd = 1;
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
  fc = t;
  const n = Tu, { safeRe: r, t: i } = Lo, o = vm, s = ba, a = Ct, c = an();
  return fc;
}
const nT = an(), rT = (e, t, n) => {
  try {
    t = new nT(t, n);
  } catch {
    return !1;
  }
  return t.test(e);
};
var Ca = rT;
const iT = an(), oT = (e, t) => new iT(e, t).set.map((n) => n.map((r) => r.value).join(" ").trim().split(" "));
var sT = oT;
const aT = Ct, cT = an(), lT = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new cT(t, n);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    o.test(s) && (!r || i.compare(s) === -1) && (r = s, i = new aT(r, n));
  }), r;
};
var uT = lT;
const fT = Ct, dT = an(), hT = (e, t, n) => {
  let r = null, i = null, o = null;
  try {
    o = new dT(t, n);
  } catch {
    return null;
  }
  return e.forEach((s) => {
    o.test(s) && (!r || i.compare(s) === 1) && (r = s, i = new fT(r, n));
  }), r;
};
var pT = hT;
const dc = Ct, mT = an(), md = Aa, gT = (e, t) => {
  e = new mT(e, t);
  let n = new dc("0.0.0");
  if (e.test(n) || (n = new dc("0.0.0-0"), e.test(n)))
    return n;
  n = null;
  for (let r = 0; r < e.set.length; ++r) {
    const i = e.set[r];
    let o = null;
    i.forEach((s) => {
      const a = new dc(s.semver.version);
      switch (s.operator) {
        case ">":
          a.prerelease.length === 0 ? a.patch++ : a.prerelease.push(0), a.raw = a.format();
        case "":
        case ">=":
          (!o || md(a, o)) && (o = a);
          break;
        case "<":
        case "<=":
          break;
        default:
          throw new Error(`Unexpected operation: ${s.operator}`);
      }
    }), o && (!n || md(n, o)) && (n = o);
  }
  return n && e.test(n) ? n : null;
};
var yT = gT;
const vT = an(), wT = (e, t) => {
  try {
    return new vT(e, t).range || "*";
  } catch {
    return null;
  }
};
var ET = wT;
const _T = Ct, wm = Ta(), { ANY: $T } = wm, ST = an(), bT = Ca, gd = Aa, yd = Nu, AT = Pu, TT = Iu, CT = (e, t, n, r) => {
  e = new _T(e, r), t = new ST(t, r);
  let i, o, s, a, c;
  switch (n) {
    case ">":
      i = gd, o = AT, s = yd, a = ">", c = ">=";
      break;
    case "<":
      i = yd, o = TT, s = gd, a = "<", c = "<=";
      break;
    default:
      throw new TypeError('Must provide a hilo val of "<" or ">"');
  }
  if (bT(e, t, r))
    return !1;
  for (let u = 0; u < t.set.length; ++u) {
    const l = t.set[u];
    let f = null, h = null;
    if (l.forEach((d) => {
      d.semver === $T && (d = new wm(">=0.0.0")), f = f || d, h = h || d, i(d.semver, f.semver, r) ? f = d : s(d.semver, h.semver, r) && (h = d);
    }), f.operator === a || f.operator === c || (!h.operator || h.operator === a) && o(e, h.semver))
      return !1;
    if (h.operator === c && s(e, h.semver))
      return !1;
  }
  return !0;
};
var Ou = CT;
const NT = Ou, IT = (e, t, n) => NT(e, t, ">", n);
var PT = IT;
const OT = Ou, RT = (e, t, n) => OT(e, t, "<", n);
var DT = RT;
const vd = an(), FT = (e, t, n) => (e = new vd(e, n), t = new vd(t, n), e.intersects(t, n));
var LT = FT;
const xT = Ca, kT = sn;
var UT = (e, t, n) => {
  const r = [];
  let i = null, o = null;
  const s = e.sort((l, f) => kT(l, f, n));
  for (const l of s)
    xT(l, t, n) ? (o = l, i || (i = l)) : (o && r.push([i, o]), o = null, i = null);
  i && r.push([i, null]);
  const a = [];
  for (const [l, f] of r)
    l === f ? a.push(l) : !f && l === s[0] ? a.push("*") : f ? l === s[0] ? a.push(`<=${f}`) : a.push(`${l} - ${f}`) : a.push(`>=${l}`);
  const c = a.join(" || "), u = typeof t.raw == "string" ? t.raw : String(t);
  return c.length < u.length ? c : t;
};
const wd = an(), Ru = Ta(), { ANY: hc } = Ru, Gi = Ca, Du = sn, jT = (e, t, n = {}) => {
  if (e === t)
    return !0;
  e = new wd(e, n), t = new wd(t, n);
  let r = !1;
  e: for (const i of e.set) {
    for (const o of t.set) {
      const s = BT(i, o, n);
      if (r = r || s !== null, s)
        continue e;
    }
    if (r)
      return !1;
  }
  return !0;
}, MT = [new Ru(">=0.0.0-0")], Ed = [new Ru(">=0.0.0")], BT = (e, t, n) => {
  if (e === t)
    return !0;
  if (e.length === 1 && e[0].semver === hc) {
    if (t.length === 1 && t[0].semver === hc)
      return !0;
    n.includePrerelease ? e = MT : e = Ed;
  }
  if (t.length === 1 && t[0].semver === hc) {
    if (n.includePrerelease)
      return !0;
    t = Ed;
  }
  const r = /* @__PURE__ */ new Set();
  let i, o;
  for (const d of e)
    d.operator === ">" || d.operator === ">=" ? i = _d(i, d, n) : d.operator === "<" || d.operator === "<=" ? o = $d(o, d, n) : r.add(d.semver);
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
    if (i && !Gi(d, String(i), n) || o && !Gi(d, String(o), n))
      return null;
    for (const m of t)
      if (!Gi(d, String(m), n))
        return !1;
    return !0;
  }
  let a, c, u, l, f = o && !n.includePrerelease && o.semver.prerelease.length ? o.semver : !1, h = i && !n.includePrerelease && i.semver.prerelease.length ? i.semver : !1;
  f && f.prerelease.length === 1 && o.operator === "<" && f.prerelease[0] === 0 && (f = !1);
  for (const d of t) {
    if (l = l || d.operator === ">" || d.operator === ">=", u = u || d.operator === "<" || d.operator === "<=", i) {
      if (h && d.semver.prerelease && d.semver.prerelease.length && d.semver.major === h.major && d.semver.minor === h.minor && d.semver.patch === h.patch && (h = !1), d.operator === ">" || d.operator === ">=") {
        if (a = _d(i, d, n), a === d && a !== i)
          return !1;
      } else if (i.operator === ">=" && !Gi(i.semver, String(d), n))
        return !1;
    }
    if (o) {
      if (f && d.semver.prerelease && d.semver.prerelease.length && d.semver.major === f.major && d.semver.minor === f.minor && d.semver.patch === f.patch && (f = !1), d.operator === "<" || d.operator === "<=") {
        if (c = $d(o, d, n), c === d && c !== o)
          return !1;
      } else if (o.operator === "<=" && !Gi(o.semver, String(d), n))
        return !1;
    }
    if (!d.operator && (o || i) && s !== 0)
      return !1;
  }
  return !(i && u && !o && s !== 0 || o && l && !i && s !== 0 || h || f);
}, _d = (e, t, n) => {
  if (!e)
    return t;
  const r = Du(e.semver, t.semver, n);
  return r > 0 ? e : r < 0 || t.operator === ">" && e.operator === ">=" ? t : e;
}, $d = (e, t, n) => {
  if (!e)
    return t;
  const r = Du(e.semver, t.semver, n);
  return r < 0 ? e : r > 0 || t.operator === "<" && e.operator === "<=" ? t : e;
};
var HT = jT;
const pc = Lo, Sd = Sa, qT = Ct, bd = mm, zT = Ii, VT = Xb, GT = eA, WT = nA, KT = iA, JT = aA, YT = uA, XT = hA, ZT = gA, QT = sn, eC = EA, tC = SA, nC = Cu, rC = CA, iC = PA, oC = Aa, sC = Nu, aC = gm, cC = ym, lC = Iu, uC = Pu, fC = vm, dC = QA, hC = Ta(), pC = an(), mC = Ca, gC = sT, yC = uT, vC = pT, wC = yT, EC = ET, _C = Ou, $C = PT, SC = DT, bC = LT, AC = UT, TC = HT;
var Fu = {
  parse: zT,
  valid: VT,
  clean: GT,
  inc: WT,
  diff: KT,
  major: JT,
  minor: YT,
  patch: XT,
  prerelease: ZT,
  compare: QT,
  rcompare: eC,
  compareLoose: tC,
  compareBuild: nC,
  sort: rC,
  rsort: iC,
  gt: oC,
  lt: sC,
  eq: aC,
  neq: cC,
  gte: lC,
  lte: uC,
  cmp: fC,
  coerce: dC,
  Comparator: hC,
  Range: pC,
  satisfies: mC,
  toComparators: gC,
  maxSatisfying: yC,
  minSatisfying: vC,
  minVersion: wC,
  validRange: EC,
  outside: _C,
  gtr: $C,
  ltr: SC,
  intersects: bC,
  simplifyRange: AC,
  subset: TC,
  SemVer: qT,
  re: pc.re,
  src: pc.src,
  tokens: pc.t,
  SEMVER_SPEC_VERSION: Sd.SEMVER_SPEC_VERSION,
  RELEASE_TYPES: Sd.RELEASE_TYPES,
  compareIdentifiers: bd.compareIdentifiers,
  rcompareIdentifiers: bd.rcompareIdentifiers
};
const Yr = /* @__PURE__ */ Il(Fu), CC = Object.prototype.toString, NC = "[object Uint8Array]", IC = "[object ArrayBuffer]";
function Em(e, t, n) {
  return e ? e.constructor === t ? !0 : CC.call(e) === n : !1;
}
function _m(e) {
  return Em(e, Uint8Array, NC);
}
function PC(e) {
  return Em(e, ArrayBuffer, IC);
}
function OC(e) {
  return _m(e) || PC(e);
}
function RC(e) {
  if (!_m(e))
    throw new TypeError(`Expected \`Uint8Array\`, got \`${typeof e}\``);
}
function DC(e) {
  if (!OC(e))
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof e}\``);
}
function mc(e, t) {
  if (e.length === 0)
    return new Uint8Array(0);
  t ?? (t = e.reduce((i, o) => i + o.length, 0));
  const n = new Uint8Array(t);
  let r = 0;
  for (const i of e)
    RC(i), n.set(i, r), r += i.length;
  return n;
}
const gs = {
  utf8: new globalThis.TextDecoder("utf8")
};
function ys(e, t = "utf8") {
  return DC(e), gs[t] ?? (gs[t] = new globalThis.TextDecoder(t)), gs[t].decode(e);
}
function FC(e) {
  if (typeof e != "string")
    throw new TypeError(`Expected \`string\`, got \`${typeof e}\``);
}
const LC = new globalThis.TextEncoder();
function gc(e) {
  return FC(e), LC.encode(e);
}
Array.from({ length: 256 }, (e, t) => t.toString(16).padStart(2, "0"));
const Ad = "aes-256-cbc", $m = /* @__PURE__ */ new Set([
  "aes-256-cbc",
  "aes-256-gcm",
  "aes-256-ctr"
]), xC = (e) => typeof e == "string" && $m.has(e), Tn = () => /* @__PURE__ */ Object.create(null), Td = (e) => e !== void 0, yc = (e, t) => {
  const n = /* @__PURE__ */ new Set([
    "undefined",
    "symbol",
    "function"
  ]), r = typeof t;
  if (n.has(r))
    throw new TypeError(`Setting a value of type \`${r}\` for key \`${e}\` is not allowed as it's not supported by JSON`);
}, zn = "__internal__", vc = `${zn}.migrations.version`;
var Yn, Xn, Rr, Ft, zt, Dr, Fr, vi, dn, it, Sm, bm, Am, Tm, Cm, Nm, Im, Pm;
class kC {
  constructor(t = {}) {
    Jt(this, it);
    Hi(this, "path");
    Hi(this, "events");
    Jt(this, Yn);
    Jt(this, Xn);
    Jt(this, Rr);
    Jt(this, Ft);
    Jt(this, zt, {});
    Jt(this, Dr, !1);
    Jt(this, Fr);
    Jt(this, vi);
    Jt(this, dn);
    Hi(this, "_deserialize", (t) => JSON.parse(t));
    Hi(this, "_serialize", (t) => JSON.stringify(t, void 0, "	"));
    const n = _n(this, it, Sm).call(this, t);
    Dt(this, Ft, n), _n(this, it, bm).call(this, n), _n(this, it, Tm).call(this, n), _n(this, it, Cm).call(this, n), this.events = new EventTarget(), Dt(this, Xn, n.encryptionKey), Dt(this, Rr, n.encryptionAlgorithm ?? Ad), this.path = _n(this, it, Nm).call(this, n), _n(this, it, Im).call(this, n), n.watch && this._watch();
  }
  get(t, n) {
    if (he(this, Ft).accessPropertiesByDotNotation)
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
      throw new TypeError(`Please don't use the ${zn} key, as it's used to manage this module internal operations.`);
    const { store: r } = this, i = (o, s) => {
      if (yc(o, s), he(this, Ft).accessPropertiesByDotNotation)
        ts(r, o, s);
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
    return he(this, Ft).accessPropertiesByDotNotation ? nc(this.store, t) : t in this.store;
  }
  appendToArray(t, n) {
    yc(t, n);
    const r = he(this, Ft).accessPropertiesByDotNotation ? this._get(t, []) : t in this.store ? this.store[t] : [];
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
      Td(he(this, zt)[n]) && this.set(n, he(this, zt)[n]);
  }
  delete(t) {
    const { store: n } = this;
    he(this, Ft).accessPropertiesByDotNotation ? V0(n, t) : delete n[t], this.store = n;
  }
  /**
      Delete all items.
  
      This resets known items to their default values, if defined by the `defaults` or `schema` option.
      */
  clear() {
    const t = Tn();
    for (const n of Object.keys(he(this, zt)))
      Td(he(this, zt)[n]) && (yc(n, he(this, zt)[n]), he(this, Ft).accessPropertiesByDotNotation ? ts(t, n, he(this, zt)[n]) : t[n] = he(this, zt)[n]);
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
      const n = pe.readFileSync(this.path, he(this, Xn) ? null : "utf8"), r = this._decryptData(n);
      return ((o) => {
        const s = this._deserialize(o);
        return he(this, Dr) || this._validate(s), Object.assign(Tn(), s);
      })(r);
    } catch (n) {
      if ((n == null ? void 0 : n.code) === "ENOENT")
        return this._ensureDirectory(), Tn();
      if (he(this, Ft).clearInvalidConfig) {
        const r = n;
        if (r.name === "SyntaxError" || (t = r.message) != null && t.startsWith("Config schema violation:") || r.message === "Failed to decrypt config data.")
          return Tn();
      }
      throw n;
    }
  }
  set store(t) {
    if (this._ensureDirectory(), !nc(t, zn))
      try {
        const n = pe.readFileSync(this.path, he(this, Xn) ? null : "utf8"), r = this._decryptData(n), i = this._deserialize(r);
        nc(i, zn) && ts(t, zn, bf(i, zn));
      } catch {
      }
    he(this, Dr) || this._validate(t), this._write(t), this.events.dispatchEvent(new Event("change"));
  }
  *[Symbol.iterator]() {
    for (const [t, n] of Object.entries(this.store))
      this._isReservedKeyPath(t) || (yield [t, n]);
  }
  /**
  Close the file watcher if one exists. This is useful in tests to prevent the process from hanging.
  */
  _closeWatcher() {
    he(this, Fr) && (he(this, Fr).close(), Dt(this, Fr, void 0)), he(this, vi) && (pe.unwatchFile(this.path), Dt(this, vi, !1)), Dt(this, dn, void 0);
  }
  _decryptData(t) {
    const n = he(this, Xn);
    if (!n)
      return typeof t == "string" ? t : ys(t);
    const r = he(this, Rr), i = r === "aes-256-gcm" ? 16 : 0, o = ":".codePointAt(0), s = typeof t == "string" ? t.codePointAt(16) : t[16];
    if (!(o !== void 0 && s === o)) {
      if (r === "aes-256-cbc")
        return typeof t == "string" ? t : ys(t);
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
    }, u = t.slice(0, 16), l = t.slice(17), f = typeof l == "string" ? gc(l) : l, h = (d) => {
      const { ciphertext: m, authenticationTag: p } = c(f), w = qi.pbkdf2Sync(n, d, 1e4, 32, "sha512"), E = qi.createDecipheriv(r, w, u);
      return p && E.setAuthTag(p), ys(mc([E.update(m), E.final()]));
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
      return typeof t == "string" ? t : ys(t);
    throw new Error("Failed to decrypt config data.");
  }
  _handleStoreChange(t) {
    let n = this.store;
    const r = () => {
      const i = n, o = this.store;
      $f(o, i) || (n = o, t.call(this, o, i));
    };
    return this.events.addEventListener("change", r), () => {
      this.events.removeEventListener("change", r);
    };
  }
  _handleValueChange(t, n) {
    let r = t();
    const i = () => {
      const o = r, s = t();
      $f(s, o) || (r = s, n.call(this, s, o));
    };
    return this.events.addEventListener("change", i), () => {
      this.events.removeEventListener("change", i);
    };
  }
  _validate(t) {
    if (!he(this, Yn) || he(this, Yn).call(this, t) || !he(this, Yn).errors)
      return;
    const r = he(this, Yn).errors.map(({ instancePath: i, message: o = "" }) => `\`${i.slice(1)}\` ${o}`);
    throw new Error("Config schema violation: " + r.join("; "));
  }
  _ensureDirectory() {
    pe.mkdirSync(Ce.dirname(this.path), { recursive: !0 });
  }
  _write(t) {
    let n = this._serialize(t);
    const r = he(this, Xn);
    if (r) {
      const i = qi.randomBytes(16), o = qi.pbkdf2Sync(r, i, 1e4, 32, "sha512"), s = qi.createCipheriv(he(this, Rr), o, i), a = mc([s.update(gc(n)), s.final()]), c = [i, gc(":"), a];
      he(this, Rr) === "aes-256-gcm" && c.push(s.getAuthTag()), n = mc(c);
    }
    if (Ue.env.SNAP)
      pe.writeFileSync(this.path, n, { mode: he(this, Ft).configFileMode });
    else
      try {
        Cp(this.path, n, { mode: he(this, Ft).configFileMode });
      } catch (i) {
        if ((i == null ? void 0 : i.code) === "EXDEV") {
          pe.writeFileSync(this.path, n, { mode: he(this, Ft).configFileMode });
          return;
        }
        throw i;
      }
  }
  _watch() {
    if (this._ensureDirectory(), pe.existsSync(this.path) || this._write(Tn()), Ue.platform === "win32" || Ue.platform === "darwin") {
      he(this, dn) ?? Dt(this, dn, od(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 100 }));
      const t = Ce.dirname(this.path), n = Ce.basename(this.path);
      Dt(this, Fr, pe.watch(t, { persistent: !1, encoding: "utf8" }, (r, i) => {
        i && i !== n || typeof he(this, dn) == "function" && he(this, dn).call(this);
      }));
    } else
      he(this, dn) ?? Dt(this, dn, od(() => {
        this.events.dispatchEvent(new Event("change"));
      }, { wait: 1e3 })), pe.watchFile(this.path, { persistent: !1 }, (t, n) => {
        typeof he(this, dn) == "function" && he(this, dn).call(this);
      }), Dt(this, vi, !0);
  }
  _migrate(t, n, r) {
    let i = this._get(vc, "0.0.0");
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
        c == null || c(this), this._set(vc, a), i = a, s = structuredClone(this.store);
      } catch (c) {
        this.store = s;
        const u = c instanceof Error ? c.message : String(c);
        throw new Error(`Something went wrong during the migration! Changes applied to the store until this failed migration will be restored. ${u}`);
      }
    (this._isVersionInRangeFormat(i) || !Yr.eq(i, n)) && this._set(vc, n);
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
    return t === zn || t.startsWith(`${zn}.`);
  }
  _isVersionInRangeFormat(t) {
    return Yr.clean(t) === null;
  }
  _shouldPerformMigration(t, n, r) {
    return this._isVersionInRangeFormat(t) ? n !== "0.0.0" && Yr.satisfies(n, t) ? !1 : Yr.satisfies(r, t) : !(Yr.lte(t, n) || Yr.gt(t, r));
  }
  _get(t, n) {
    return bf(this.store, t, n);
  }
  _set(t, n) {
    const { store: r } = this;
    ts(r, t, n), this.store = r;
  }
}
Yn = new WeakMap(), Xn = new WeakMap(), Rr = new WeakMap(), Ft = new WeakMap(), zt = new WeakMap(), Dr = new WeakMap(), Fr = new WeakMap(), vi = new WeakMap(), dn = new WeakMap(), it = new WeakSet(), Sm = function(t) {
  const n = {
    configName: "config",
    fileExtension: "json",
    projectSuffix: "nodejs",
    clearInvalidConfig: !1,
    accessPropertiesByDotNotation: !0,
    configFileMode: 438,
    ...t
  };
  if (n.encryptionAlgorithm ?? (n.encryptionAlgorithm = Ad), !xC(n.encryptionAlgorithm))
    throw new TypeError(`The \`encryptionAlgorithm\` option must be one of: ${[...$m].join(", ")}`);
  if (!n.cwd) {
    if (!n.projectName)
      throw new Error("Please specify the `projectName` option.");
    n.cwd = J0(n.projectName, { suffix: n.projectSuffix }).config;
  }
  return typeof n.fileExtension == "string" && (n.fileExtension = n.fileExtension.replace(/^\.+/, "")), n;
}, bm = function(t) {
  if (!(t.schema ?? t.ajvOptions ?? t.rootSchema))
    return;
  if (t.schema && typeof t.schema != "object")
    throw new TypeError("The `schema` option must be an object.");
  const n = Cb.default, r = new db.Ajv2020({
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
  Dt(this, Yn, r.compile(i)), _n(this, it, Am).call(this, t.schema);
}, Am = function(t) {
  const n = Object.entries(t ?? {});
  for (const [r, i] of n) {
    if (!i || typeof i != "object" || !Object.hasOwn(i, "default"))
      continue;
    const { default: o } = i;
    o !== void 0 && (he(this, zt)[r] = o);
  }
}, Tm = function(t) {
  t.defaults && Object.assign(he(this, zt), t.defaults);
}, Cm = function(t) {
  t.serialize && (this._serialize = t.serialize), t.deserialize && (this._deserialize = t.deserialize);
}, Nm = function(t) {
  const n = typeof t.fileExtension == "string" ? t.fileExtension : void 0, r = n ? `.${n}` : "";
  return Ce.resolve(t.cwd, `${t.configName ?? "config"}${r}`);
}, Im = function(t) {
  if (t.migrations) {
    _n(this, it, Pm).call(this, t), this._validate(this.store);
    return;
  }
  const n = this.store, r = Object.assign(Tn(), t.defaults ?? {}, n);
  this._validate(r);
  try {
    Sf.deepEqual(n, r);
  } catch {
    this.store = r;
  }
}, Pm = function(t) {
  const { migrations: n, projectVersion: r } = t;
  if (n) {
    if (!r)
      throw new Error("Please specify the `projectVersion` option.");
    Dt(this, Dr, !0);
    try {
      const i = this.store, o = Object.assign(Tn(), t.defaults ?? {}, i);
      try {
        Sf.deepEqual(i, o);
      } catch {
        this._write(o);
      }
      this._migrate(n, r, t.beforeEachMigration);
    } finally {
      Dt(this, Dr, !1);
    }
  }
};
const { app: Us, ipcMain: cl, shell: UC } = In;
let Cd = !1;
const Nd = () => {
  if (!cl || !Us)
    throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
  const e = {
    defaultCwd: Us.getPath("userData"),
    appVersion: Us.getVersion()
  };
  return Cd || (cl.on("electron-store-get-data", (t) => {
    t.returnValue = e;
  }), Cd = !0), e;
};
class jC extends kC {
  constructor(t) {
    let n, r;
    if (Ue.type === "renderer") {
      const i = In.ipcRenderer.sendSync("electron-store-get-data");
      if (!i)
        throw new Error("Electron Store: You need to call `.initRenderer()` from the main process.");
      ({ defaultCwd: n, appVersion: r } = i);
    } else cl && Us && ({ defaultCwd: n, appVersion: r } = Nd());
    t = {
      name: "config",
      ...t
    }, t.projectVersion || (t.projectVersion = r), t.cwd ? t.cwd = Ce.isAbsolute(t.cwd) ? t.cwd : Ce.join(n, t.cwd) : t.cwd = n, t.configName = t.name, delete t.name, super(t);
  }
  static initRenderer() {
    Nd();
  }
  async openInEditor() {
    const t = await UC.openPath(this.path);
    if (t)
      throw new Error(t);
  }
}
const MC = {
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
}, Bt = new jC({
  defaults: MC,
  name: "config"
}), Cn = De.getPath("userData"), ae = {
  appData: Cn,
  instances: x.join(Cn, "instances"),
  java: x.join(Cn, "java"),
  icons: x.join(Cn, "icons"),
  skins: x.join(Cn, "skins"),
  mods: x.join(Cn, "mods"),
  logs: x.join(Cn, "logs"),
  config: x.join(Cn, "config.json"),
  accounts: x.join(Cn, "accounts.json")
};
async function BC() {
  const e = Bt.get("proxy");
  e.type === "none" ? await _f.defaultSession.setProxy({ mode: "direct" }) : (e.type === "http" || e.type === "socks5") && await _f.defaultSession.setProxy({
    proxyRules: `${e.type}://${e.address}:${e.port}`
  });
}
function HC() {
  oe.handle("config:get", () => Bt.store), oe.handle("config:set", (e, t, n) => {
    Bt.set(t, n), t === "proxy" && BC(), Ee.getAllWindows().forEach((r) => {
      r.webContents.send("settings:updated");
    });
  });
}
var Pi = { exports: {} }, Om = {
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
}, Na = {};
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
})(Na);
const qC = k, Ze = x, Id = Om, zC = Na, VC = typeof process == "object" && process.platform === "win32", Pd = (e) => typeof e == "object" && e !== null, Rm = new Uint32Array(256).map((e, t) => {
  for (let n = 0; n < 8; n++)
    t & 1 ? t = 3988292384 ^ t >>> 1 : t >>>= 1;
  return t >>> 0;
});
function We(e) {
  this.sep = Ze.sep, this.fs = qC, Pd(e) && Pd(e.fs) && typeof e.fs.statSync == "function" && (this.fs = e.fs);
}
var GC = We;
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
        if (s && s.isFile()) throw zC.FILE_IN_THE_WAY(`"${i}"`);
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
  return Rm[(e ^ t) & 255] ^ e >>> 8;
};
We.crc32 = function(e) {
  typeof e == "string" && (e = Buffer.from(e, "utf8"));
  let t = e.length, n = -1;
  for (let r = 0; r < t; ) n = We.crc32update(n, e[r++]);
  return ~n >>> 0;
};
We.methodToString = function(e) {
  switch (e) {
    case Id.STORED:
      return "STORED (" + e + ")";
    case Id.DEFLATED:
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
We.isWin = VC;
We.crcTable = Rm;
const WC = x;
var KC = function(e, { fs: t }) {
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
  return n && t.existsSync(n) ? (i = t.statSync(n), r.directory = i.isDirectory(), r.mtime = i.mtime, r.atime = i.atime, r.executable = (73 & i.mode) !== 0, r.readonly = (128 & i.mode) === 0, r.hidden = WC.basename(n)[0] === ".") : console.warn("Invalid path: " + n), {
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
}, JC = {
  efs: !0,
  encode: (e) => Buffer.from(e, "utf8"),
  decode: (e) => e.toString("utf8")
};
Pi.exports = GC;
Pi.exports.Constants = Om;
Pi.exports.Errors = Na;
Pi.exports.FileAttr = KC;
Pi.exports.decoder = JC;
var xo = Pi.exports, Ia = {}, Vn = xo, re = Vn.Constants, YC = function() {
  var e = 20, t = 10, n = 0, r = 0, i = 0, o = 0, s = 0, a = 0, c = 0, u = 0, l = 0, f = 0, h = 0, d = 0, m = 0;
  e |= Vn.isWin ? 2560 : 768, n |= re.FLG_EFS;
  const p = {
    extraLen: 0
  }, w = (y) => Math.max(0, y) >>> 0, E = (y) => Math.max(0, y) & 255;
  return i = Vn.fromDate2DOS(/* @__PURE__ */ new Date()), {
    get made() {
      return e;
    },
    set made(y) {
      e = y;
    },
    get version() {
      return t;
    },
    set version(y) {
      t = y;
    },
    get flags() {
      return n;
    },
    set flags(y) {
      n = y;
    },
    get flags_efs() {
      return (n & re.FLG_EFS) > 0;
    },
    set flags_efs(y) {
      y ? n |= re.FLG_EFS : n &= ~re.FLG_EFS;
    },
    get flags_desc() {
      return (n & re.FLG_DESC) > 0;
    },
    set flags_desc(y) {
      y ? n |= re.FLG_DESC : n &= ~re.FLG_DESC;
    },
    get method() {
      return r;
    },
    set method(y) {
      switch (y) {
        case re.STORED:
          this.version = 10;
        case re.DEFLATED:
        default:
          this.version = 20;
      }
      r = y;
    },
    get time() {
      return Vn.fromDOS2Date(this.timeval);
    },
    set time(y) {
      y = new Date(y), this.timeval = Vn.fromDate2DOS(y);
    },
    get timeval() {
      return i;
    },
    set timeval(y) {
      i = w(y);
    },
    get timeHighByte() {
      return E(i >>> 8);
    },
    get crc() {
      return o;
    },
    set crc(y) {
      o = w(y);
    },
    get compressedSize() {
      return s;
    },
    set compressedSize(y) {
      s = w(y);
    },
    get size() {
      return a;
    },
    set size(y) {
      a = w(y);
    },
    get fileNameLength() {
      return c;
    },
    set fileNameLength(y) {
      c = y;
    },
    get extraLength() {
      return u;
    },
    set extraLength(y) {
      u = y;
    },
    get extraLocalLength() {
      return p.extraLen;
    },
    set extraLocalLength(y) {
      p.extraLen = y;
    },
    get commentLength() {
      return l;
    },
    set commentLength(y) {
      l = y;
    },
    get diskNumStart() {
      return f;
    },
    set diskNumStart(y) {
      f = w(y);
    },
    get inAttr() {
      return h;
    },
    set inAttr(y) {
      h = w(y);
    },
    get attr() {
      return d;
    },
    set attr(y) {
      d = w(y);
    },
    // get Unix file permissions
    get fileAttr() {
      return (d || 0) >> 16 & 4095;
    },
    get offset() {
      return m;
    },
    set offset(y) {
      m = w(y);
    },
    get encrypted() {
      return (n & re.FLG_ENC) === re.FLG_ENC;
    },
    get centralHeaderSize() {
      return re.CENHDR + c + u + l;
    },
    get realDataOffset() {
      return m + re.LOCHDR + p.fnameLen + p.extraLen;
    },
    get localHeader() {
      return p;
    },
    loadLocalHeaderFromBinary: function(y) {
      var _ = y.slice(m, m + re.LOCHDR);
      if (_.readUInt32LE(0) !== re.LOCSIG)
        throw Vn.Errors.INVALID_LOC();
      p.version = _.readUInt16LE(re.LOCVER), p.flags = _.readUInt16LE(re.LOCFLG), p.flags_desc = (p.flags & re.FLG_DESC) > 0, p.method = _.readUInt16LE(re.LOCHOW), p.time = _.readUInt32LE(re.LOCTIM), p.crc = _.readUInt32LE(re.LOCCRC), p.compressedSize = _.readUInt32LE(re.LOCSIZ), p.size = _.readUInt32LE(re.LOCLEN), p.fnameLen = _.readUInt16LE(re.LOCNAM), p.extraLen = _.readUInt16LE(re.LOCEXT);
      const S = m + re.LOCHDR + p.fnameLen, C = S + p.extraLen;
      return y.slice(S, C);
    },
    loadFromBinary: function(y) {
      if (y.length !== re.CENHDR || y.readUInt32LE(0) !== re.CENSIG)
        throw Vn.Errors.INVALID_CEN();
      e = y.readUInt16LE(re.CENVEM), t = y.readUInt16LE(re.CENVER), n = y.readUInt16LE(re.CENFLG), r = y.readUInt16LE(re.CENHOW), i = y.readUInt32LE(re.CENTIM), o = y.readUInt32LE(re.CENCRC), s = y.readUInt32LE(re.CENSIZ), a = y.readUInt32LE(re.CENLEN), c = y.readUInt16LE(re.CENNAM), u = y.readUInt16LE(re.CENEXT), l = y.readUInt16LE(re.CENCOM), f = y.readUInt16LE(re.CENDSK), h = y.readUInt16LE(re.CENATT), d = y.readUInt32LE(re.CENATX), m = y.readUInt32LE(re.CENOFF);
    },
    localHeaderToBinary: function() {
      var y = Buffer.alloc(re.LOCHDR);
      return y.writeUInt32LE(re.LOCSIG, 0), y.writeUInt16LE(t, re.LOCVER), y.writeUInt16LE(n, re.LOCFLG), y.writeUInt16LE(r, re.LOCHOW), y.writeUInt32LE(i, re.LOCTIM), y.writeUInt32LE(o, re.LOCCRC), y.writeUInt32LE(s, re.LOCSIZ), y.writeUInt32LE(a, re.LOCLEN), y.writeUInt16LE(c, re.LOCNAM), y.writeUInt16LE(p.extraLen, re.LOCEXT), y;
    },
    centralHeaderToBinary: function() {
      var y = Buffer.alloc(re.CENHDR + c + u + l);
      return y.writeUInt32LE(re.CENSIG, 0), y.writeUInt16LE(e, re.CENVEM), y.writeUInt16LE(t, re.CENVER), y.writeUInt16LE(n, re.CENFLG), y.writeUInt16LE(r, re.CENHOW), y.writeUInt32LE(i, re.CENTIM), y.writeUInt32LE(o, re.CENCRC), y.writeUInt32LE(s, re.CENSIZ), y.writeUInt32LE(a, re.CENLEN), y.writeUInt16LE(c, re.CENNAM), y.writeUInt16LE(u, re.CENEXT), y.writeUInt16LE(l, re.CENCOM), y.writeUInt16LE(f, re.CENDSK), y.writeUInt16LE(h, re.CENATT), y.writeUInt32LE(d, re.CENATX), y.writeUInt32LE(m, re.CENOFF), y;
    },
    toJSON: function() {
      const y = function(_) {
        return _ + " bytes";
      };
      return {
        made: e,
        version: t,
        flags: n,
        method: Vn.methodToString(r),
        time: this.time,
        crc: "0x" + o.toString(16).toUpperCase(),
        compressedSize: y(s),
        size: y(a),
        fileNameLength: y(c),
        extraLength: y(u),
        commentLength: y(l),
        diskNumStart: f,
        inAttr: h,
        attr: d,
        offset: m,
        centralHeaderSize: y(re.CENHDR + c + u + l)
      };
    },
    toString: function() {
      return JSON.stringify(this.toJSON(), null, "	");
    }
  };
}, ii = xo, Me = ii.Constants, XC = function() {
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
        throw ii.Errors.INVALID_END();
      o.readUInt32LE(0) === Me.ENDSIG ? (e = o.readUInt16LE(Me.ENDSUB), t = o.readUInt16LE(Me.ENDTOT), n = o.readUInt32LE(Me.ENDSIZ), r = o.readUInt32LE(Me.ENDOFF), i = o.readUInt16LE(Me.ENDCOM)) : (e = ii.readBigUInt64LE(o, Me.ZIP64SUB), t = ii.readBigUInt64LE(o, Me.ZIP64TOT), n = ii.readBigUInt64LE(o, Me.ZIP64SIZE), r = ii.readBigUInt64LE(o, Me.ZIP64OFF), i = 0);
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
Ia.EntryHeader = YC;
Ia.MainHeader = XC;
var Pa = {}, ZC = function(e) {
  var t = Po, n = { chunkSize: (parseInt(e.length / 1024) + 1) * 1024 };
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
const QC = +(process.versions ? process.versions.node : "").split(".")[0] || 0;
var eN = function(e, t) {
  var n = Po;
  const r = QC >= 15 && t > 0 ? { maxOutputLength: t } : {};
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
const { randomFillSync: Od } = Si, tN = Na, nN = new Uint32Array(256).map((e, t) => {
  for (let n = 0; n < 8; n++)
    t & 1 ? t = t >>> 1 ^ 3988292384 : t >>>= 1;
  return t >>> 0;
}), Dm = (e, t) => Math.imul(e, t) >>> 0, Rd = (e, t) => nN[(e ^ t) & 255] ^ e >>> 8, ho = () => typeof Od == "function" ? Od(Buffer.alloc(12)) : ho.node();
ho.node = () => {
  const e = Buffer.alloc(12), t = e.length;
  for (let n = 0; n < t; n++) e[n] = Math.random() * 256 & 255;
  return e;
};
const js = {
  genSalt: ho
};
function Oa(e) {
  const t = Buffer.isBuffer(e) ? e : Buffer.from(e);
  this.keys = new Uint32Array([305419896, 591751049, 878082192]);
  for (let n = 0; n < t.length; n++)
    this.updateKeys(t[n]);
}
Oa.prototype.updateKeys = function(e) {
  const t = this.keys;
  return t[0] = Rd(t[0], e), t[1] += t[0] & 255, t[1] = Dm(t[1], 134775813) + 1, t[2] = Rd(t[2], t[1] >>> 24), e;
};
Oa.prototype.next = function() {
  const e = (this.keys[2] | 2) >>> 0;
  return Dm(e, e ^ 1) >> 8 & 255;
};
function rN(e) {
  const t = new Oa(e);
  return function(n) {
    const r = Buffer.alloc(n.length);
    let i = 0;
    for (let o of n)
      r[i++] = t.updateKeys(o ^ t.next());
    return r;
  };
}
function iN(e) {
  const t = new Oa(e);
  return function(n, r, i = 0) {
    r || (r = Buffer.alloc(n.length));
    for (let o of n) {
      const s = t.next();
      r[i++] = o ^ s, t.updateKeys(o);
    }
    return r;
  };
}
function oN(e, t, n) {
  if (!e || !Buffer.isBuffer(e) || e.length < 12)
    return Buffer.alloc(0);
  const r = rN(n), i = r(e.slice(0, 12)), o = (t.flags & 8) === 8 ? t.timeHighByte : t.crc >>> 24;
  if (i[11] !== o)
    throw tN.WRONG_PASSWORD();
  return r(e.slice(12));
}
function sN(e) {
  Buffer.isBuffer(e) && e.length >= 12 ? js.genSalt = function() {
    return e.slice(0, 12);
  } : e === "node" ? js.genSalt = ho.node : js.genSalt = ho;
}
function aN(e, t, n, r = !1) {
  e == null && (e = Buffer.alloc(0)), Buffer.isBuffer(e) || (e = Buffer.from(e.toString()));
  const i = iN(n), o = js.genSalt();
  o[11] = t.crc >>> 24 & 255, r && (o[10] = t.crc >>> 16 & 255);
  const s = Buffer.alloc(e.length + 12);
  return i(o, s), i(e, s, 12);
}
var cN = { decrypt: oN, encrypt: aN, _salter: sN };
Pa.Deflater = ZC;
Pa.Inflater = eN;
Pa.ZipCrypto = cN;
var Ne = xo, lN = Ia, Ge = Ne.Constants, wc = Pa, Fm = function(e, t) {
  var n = new lN.EntryHeader(), r = Buffer.alloc(0), i = Buffer.alloc(0), o = !1, s = null, a = Buffer.alloc(0), c = Buffer.alloc(0), u = !0;
  const l = e, f = typeof l.decoder == "object" ? l.decoder : Ne.decoder;
  u = f.hasOwnProperty("efs") ? f.efs : !1;
  function h() {
    return !t || !(t instanceof Uint8Array) ? Buffer.alloc(0) : (c = n.loadLocalHeaderFromBinary(t), t.slice(n.realDataOffset, n.realDataOffset + n.compressedSize));
  }
  function d(_) {
    if (!n.flags_desc && !n.localHeader.flags_desc) {
      if (Ne.crc32(_) !== n.localHeader.crc)
        return !1;
    } else {
      const S = {}, C = n.realDataOffset + n.compressedSize;
      if (t.readUInt32LE(C) == Ge.LOCSIG || t.readUInt32LE(C) == Ge.CENSIG)
        throw Ne.Errors.DESCRIPTOR_NOT_EXIST();
      if (t.readUInt32LE(C) == Ge.EXTSIG)
        S.crc = t.readUInt32LE(C + Ge.EXTCRC), S.compressedSize = t.readUInt32LE(C + Ge.EXTSIZ), S.size = t.readUInt32LE(C + Ge.EXTLEN);
      else if (t.readUInt16LE(C + 12) === 19280)
        S.crc = t.readUInt32LE(C + Ge.EXTCRC - 4), S.compressedSize = t.readUInt32LE(C + Ge.EXTSIZ - 4), S.size = t.readUInt32LE(C + Ge.EXTLEN - 4);
      else
        throw Ne.Errors.DESCRIPTOR_UNKNOWN();
      if (S.compressedSize !== n.compressedSize || S.size !== n.size || S.crc !== n.crc)
        throw Ne.Errors.DESCRIPTOR_FAULTY();
      if (Ne.crc32(_) !== S.crc)
        return !1;
    }
    return !0;
  }
  function m(_, S, C) {
    if (typeof S > "u" && typeof _ == "string" && (C = _, _ = void 0), o)
      return _ && S && S(Buffer.alloc(0), Ne.Errors.DIRECTORY_CONTENT_ERROR()), Buffer.alloc(0);
    var j = h();
    if (j.length === 0)
      return _ && S && S(j), j;
    if (n.encrypted) {
      if (typeof C != "string" && !Buffer.isBuffer(C))
        throw Ne.Errors.INVALID_PASS_PARAM();
      j = wc.ZipCrypto.decrypt(j, n, C);
    }
    var V = Buffer.alloc(n.size);
    switch (n.method) {
      case Ne.Constants.STORED:
        if (j.copy(V), d(V))
          return _ && S && S(V), V;
        throw _ && S && S(V, Ne.Errors.BAD_CRC()), Ne.Errors.BAD_CRC();
      case Ne.Constants.DEFLATED:
        var G = new wc.Inflater(j, n.size);
        if (_)
          G.inflateAsync(function(q) {
            q.copy(q, 0), S && (d(q) ? S(q) : S(q, Ne.Errors.BAD_CRC()));
          });
        else {
          if (G.inflate(V).copy(V, 0), !d(V))
            throw Ne.Errors.BAD_CRC(`"${f.decode(r)}"`);
          return V;
        }
        break;
      default:
        throw _ && S && S(Buffer.alloc(0), Ne.Errors.UNKNOWN_METHOD()), Ne.Errors.UNKNOWN_METHOD();
    }
  }
  function p(_, S) {
    if ((!s || !s.length) && Buffer.isBuffer(t))
      return _ && S && S(h()), h();
    if (s.length && !o) {
      var C;
      switch (n.method) {
        case Ne.Constants.STORED:
          return n.compressedSize = n.size, C = Buffer.alloc(s.length), s.copy(C), _ && S && S(C), C;
        default:
        case Ne.Constants.DEFLATED:
          var j = new wc.Deflater(s);
          if (_)
            j.deflateAsync(function(G) {
              C = Buffer.alloc(G.length), n.compressedSize = G.length, G.copy(C), S && S(C);
            });
          else {
            var V = j.deflate();
            return n.compressedSize = V.length, V;
          }
          j = null;
          break;
      }
    } else if (_ && S)
      S(Buffer.alloc(0));
    else
      return Buffer.alloc(0);
  }
  function w(_, S) {
    return Ne.readBigUInt64LE(_, S);
  }
  function E(_) {
    try {
      for (var S = 0, C, j, V; S + 4 < _.length; )
        C = _.readUInt16LE(S), S += 2, j = _.readUInt16LE(S), S += 2, V = _.slice(S, S + j), S += j, Ge.ID_ZIP64 === C && y(V);
    } catch {
      throw Ne.Errors.EXTRA_FIELD_PARSE_ERROR();
    }
  }
  function y(_) {
    var S, C, j, V;
    _.length >= Ge.EF_ZIP64_SCOMP && (S = w(_, Ge.EF_ZIP64_SUNCOMP), n.size === Ge.EF_ZIP64_OR_32 && (n.size = S)), _.length >= Ge.EF_ZIP64_RHO && (C = w(_, Ge.EF_ZIP64_SCOMP), n.compressedSize === Ge.EF_ZIP64_OR_32 && (n.compressedSize = C)), _.length >= Ge.EF_ZIP64_DSN && (j = w(_, Ge.EF_ZIP64_RHO), n.offset === Ge.EF_ZIP64_OR_32 && (n.offset = j)), _.length >= Ge.EF_ZIP64_DSN + 4 && (V = _.readUInt32LE(Ge.EF_ZIP64_DSN), n.diskNumStart === Ge.EF_ZIP64_OR_16 && (n.diskNumStart = V));
  }
  return {
    get entryName() {
      return f.decode(r);
    },
    get rawEntryName() {
      return r;
    },
    set entryName(_) {
      r = Ne.toBuffer(_, f.encode);
      var S = r[r.length - 1];
      o = S === 47 || S === 92, n.fileNameLength = r.length;
    },
    get efs() {
      return typeof u == "function" ? u(this.entryName) : u;
    },
    get extra() {
      return a;
    },
    set extra(_) {
      a = _, n.extraLength = _.length, E(_);
    },
    get comment() {
      return f.decode(i);
    },
    set comment(_) {
      if (i = Ne.toBuffer(_, f.encode), n.commentLength = i.length, i.length > 65535) throw Ne.Errors.COMMENT_TOO_LONG();
    },
    get name() {
      var _ = f.decode(r);
      return o ? _.substr(_.length - 1).split("/").pop() : _.split("/").pop();
    },
    get isDirectory() {
      return o;
    },
    getCompressedData: function() {
      return p(!1, null);
    },
    getCompressedDataAsync: function(_) {
      p(!0, _);
    },
    setData: function(_) {
      s = Ne.toBuffer(_, Ne.decoder.encode), !o && s.length ? (n.size = s.length, n.method = Ne.Constants.DEFLATED, n.crc = Ne.crc32(_), n.changed = !0) : n.method = Ne.Constants.STORED;
    },
    getData: function(_) {
      return n.changed ? s : m(!1, null, _);
    },
    getDataAsync: function(_, S) {
      n.changed ? _(s) : m(!0, _, S);
    },
    set attr(_) {
      n.attr = _;
    },
    get attr() {
      return n.attr;
    },
    set header(_) {
      n.loadFromBinary(_);
    },
    get header() {
      return n;
    },
    packCentralHeader: function() {
      n.flags_efs = this.efs, n.extraLength = a.length;
      var _ = n.centralHeaderToBinary(), S = Ne.Constants.CENHDR;
      return r.copy(_, S), S += r.length, a.copy(_, S), S += n.extraLength, i.copy(_, S), _;
    },
    packLocalHeader: function() {
      let _ = 0;
      n.flags_efs = this.efs, n.extraLocalLength = c.length;
      const S = n.localHeaderToBinary(), C = Buffer.alloc(S.length + r.length + n.extraLocalLength);
      return S.copy(C, _), _ += S.length, r.copy(C, _), _ += r.length, c.copy(C, _), _ += c.length, C;
    },
    toJSON: function() {
      const _ = function(S) {
        return "<" + (S && S.length + " bytes buffer" || "null") + ">";
      };
      return {
        entryName: this.entryName,
        name: this.name,
        comment: this.comment,
        isDirectory: this.isDirectory,
        header: n.toJSON(),
        compressedData: _(t),
        data: _(s)
      };
    },
    toString: function() {
      return JSON.stringify(this.toJSON(), null, "	");
    }
  };
};
const Dd = Fm, uN = Ia, st = xo;
var fN = function(e, t) {
  var n = [], r = {}, i = Buffer.alloc(0), o = new uN.MainHeader(), s = !1;
  const a = /* @__PURE__ */ new Set(), c = t, { noSort: u, decoder: l } = c;
  e ? d(c.readEntries) : s = !0;
  function f() {
    const p = /* @__PURE__ */ new Set();
    for (const w of Object.keys(r)) {
      const E = w.split("/");
      if (E.pop(), !!E.length)
        for (let y = 0; y < E.length; y++) {
          const _ = E.slice(0, y + 1).join("/") + "/";
          p.add(_);
        }
    }
    for (const w of p)
      if (!(w in r)) {
        const E = new Dd(c);
        E.entryName = w, E.attr = 16, E.temporary = !0, n.push(E), r[E.entryName] = E, a.add(E);
      }
  }
  function h() {
    if (s = !0, r = {}, o.diskEntries > (e.length - o.offset) / st.Constants.CENHDR)
      throw st.Errors.DISK_ENTRY_TOO_LARGE();
    n = new Array(o.diskEntries);
    for (var p = o.offset, w = 0; w < n.length; w++) {
      var E = p, y = new Dd(c, e);
      y.header = e.slice(E, E += st.Constants.CENHDR), y.entryName = e.slice(E, E += y.header.fileNameLength), y.header.extraLength && (y.extra = e.slice(E, E += y.header.extraLength)), y.header.commentLength && (y.comment = e.slice(E, E + y.header.commentLength)), p += y.header.centralHeaderSize, n[w] = y, r[y.entryName] = y;
    }
    a.clear(), f();
  }
  function d(p) {
    var w = e.length - st.Constants.ENDHDR, E = Math.max(0, w - 65535), y = E, _ = e.length, S = -1, C = 0;
    for ((typeof c.trailingSpace == "boolean" ? c.trailingSpace : !1) && (E = 0), w; w >= y; w--)
      if (e[w] === 80) {
        if (e.readUInt32LE(w) === st.Constants.ENDSIG) {
          S = w, C = w, _ = w + st.Constants.ENDHDR, y = w - st.Constants.END64HDR;
          continue;
        }
        if (e.readUInt32LE(w) === st.Constants.END64SIG) {
          y = E;
          continue;
        }
        if (e.readUInt32LE(w) === st.Constants.ZIP64SIG) {
          S = w, _ = w + st.readBigUInt64LE(e, w + st.Constants.ZIP64SIZE) + st.Constants.ZIP64LEAD;
          break;
        }
      }
    if (S == -1) throw st.Errors.INVALID_FORMAT();
    o.loadFromBinary(e.slice(S, _)), o.commentLength && (i = e.slice(C + st.Constants.ENDHDR)), p && h();
  }
  function m() {
    n.length > 1 && !u && n.sort((p, w) => p.entryName.toLowerCase().localeCompare(w.entryName.toLowerCase()));
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
    deleteFile: function(p, w = !0) {
      s || h();
      const E = r[p];
      this.getEntryChildren(E, w).map((_) => _.entryName).forEach(this.deleteEntry);
    },
    /**
     * Removes the entry with the given name from the entry list.
     *
     * @param {string} entryName
     * @returns {void}
     */
    deleteEntry: function(p) {
      s || h();
      const w = r[p], E = n.indexOf(w);
      E >= 0 && (n.splice(E, 1), delete r[p], o.totalEntries = n.length);
    },
    /**
     *  Iterates and returns all nested files and directories of the given entry
     *
     * @param entry
     * @return Array
     */
    getEntryChildren: function(p, w = !0) {
      if (s || h(), typeof p == "object")
        if (p.isDirectory && w) {
          const E = [], y = p.entryName;
          for (const _ of n)
            _.entryName.startsWith(y) && E.push(_);
          return E;
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
        const w = this.getEntryChildren(p);
        return w.includes(p) ? w.length - 1 : w.length;
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
      const p = [], w = [];
      let E = 0, y = 0;
      o.size = 0, o.offset = 0;
      let _ = 0;
      for (const j of this.entries) {
        const V = j.getCompressedData();
        j.header.offset = y;
        const G = j.packLocalHeader(), q = G.length + V.length;
        y += q, p.push(G), p.push(V);
        const b = j.packCentralHeader();
        w.push(b), o.size += b.length, E += q + b.length, _++;
      }
      E += o.mainHeaderSize, o.offset = y, o.totalEntries = _, y = 0;
      const S = Buffer.alloc(E);
      for (const j of p)
        j.copy(S, y), y += j.length;
      for (const j of w)
        j.copy(S, y), y += j.length;
      const C = o.toBinary();
      return i && i.copy(C, st.Constants.ENDHDR), C.copy(S, y), e = S, s = !1, S;
    },
    toAsyncBuffer: function(p, w, E, y) {
      try {
        s || h(), m();
        const _ = [], S = [];
        let C = 0, j = 0, V = 0;
        o.size = 0, o.offset = 0;
        const G = function(q) {
          if (q.length > 0) {
            const b = q.shift(), M = b.entryName + b.extra.toString();
            E && E(M), b.getCompressedDataAsync(function(W) {
              y && y(M), b.header.offset = j;
              const X = b.packLocalHeader(), L = X.length + W.length;
              j += L, _.push(X), _.push(W);
              const U = b.packCentralHeader();
              S.push(U), o.size += U.length, C += L + U.length, V++, G(q);
            });
          } else {
            C += o.mainHeaderSize, o.offset = j, o.totalEntries = V, j = 0;
            const b = Buffer.alloc(C);
            _.forEach(function(W) {
              W.copy(b, j), j += W.length;
            }), S.forEach(function(W) {
              W.copy(b, j), j += W.length;
            });
            const M = o.toBinary();
            i && i.copy(M, st.Constants.ENDHDR), M.copy(b, j), e = b, s = !1, p(b);
          }
        };
        G(Array.from(this.entries));
      } catch (_) {
        w(_);
      }
    }
  };
};
const He = xo, Be = x, dN = Fm, hN = fN, yr = (...e) => He.findLast(e, (t) => typeof t == "boolean"), Fd = (...e) => He.findLast(e, (t) => typeof t == "string"), pN = (...e) => He.findLast(e, (t) => typeof t == "function"), mN = {
  // option "noSort" : if true it disables files sorting
  noSort: !1,
  // read entries during load (initial loading may be slower)
  readEntries: !1,
  // default method is none
  method: He.Constants.NONE,
  // file system
  fs: null
};
var gN = function(e, t) {
  let n = null;
  const r = Object.assign(/* @__PURE__ */ Object.create(null), mN);
  e && typeof e == "object" && (e instanceof Uint8Array || (Object.assign(r, e), e = r.input ? r.input : void 0, r.input && delete r.input), Buffer.isBuffer(e) && (n = e, r.method = He.Constants.BUFFER, e = void 0)), Object.assign(r, t);
  const i = new He(r);
  if ((typeof r.decoder != "object" || typeof r.decoder.encode != "function" || typeof r.decoder.decode != "function") && (r.decoder = He.decoder), e && typeof e == "string")
    if (i.fs.existsSync(e))
      r.method = He.Constants.FILE, r.filename = e, n = i.fs.readFileSync(e);
    else
      throw He.Errors.INVALID_FILENAME();
  const o = new hN(n, r), { canonical: s, sanitize: a, zipnamefix: c } = He;
  function u(d) {
    if (d && o) {
      var m;
      if (typeof d == "string" && (m = o.getEntry(Be.posix.normalize(d))), typeof d == "object" && typeof d.entryName < "u" && typeof d.header < "u" && (m = o.getEntry(d.entryName)), m)
        return m;
    }
    return null;
  }
  function l(d) {
    const { join: m, normalize: p, sep: w } = Be.posix;
    return m(Be.isAbsolute(d) ? "/" : ".", p(w + d.split("\\").join(w) + w));
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
        var w = p.getData();
        if (w && w.length)
          return w.toString(m || "utf8");
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
      var w = u(d);
      w ? w.getDataAsync(function(E, y) {
        if (y) {
          m(E, y);
          return;
        }
        E && E.length ? m(E.toString(p || "utf8")) : m("");
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
    addLocalFile: function(d, m, p, w) {
      if (i.fs.existsSync(d)) {
        m = m ? l(m) : "";
        const E = Be.win32.basename(Be.win32.normalize(d));
        m += p || E;
        const y = i.fs.statSync(d), _ = y.isFile() ? i.fs.readFileSync(d) : Buffer.alloc(0);
        y.isDirectory() && (m += i.sep), this.addFile(m, _, w, y);
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
      const p = Be.resolve(d.localPath), { comment: w } = d;
      let { zipPath: E, zipName: y } = d;
      const _ = this;
      i.fs.stat(p, function(S, C) {
        if (S) return m(S, !1);
        E = E ? l(E) : "";
        const j = Be.win32.basename(Be.win32.normalize(p));
        if (E += y || j, C.isFile())
          i.fs.readFile(p, function(V, G) {
            return V ? m(V, !1) : (_.addFile(E, G, w, C), setImmediate(m, void 0, !0));
          });
        else if (C.isDirectory())
          return E += i.sep, _.addFile(E, Buffer.alloc(0), w, C), setImmediate(m, void 0, !0);
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
        const w = i.findFiles(d), E = this;
        if (w.length)
          for (const y of w) {
            const _ = Be.join(m, h(d, y));
            p(_) && E.addLocalFile(y, Be.dirname(_));
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
    addLocalFolderAsync: function(d, m, p, w) {
      w = f(w), p = p ? l(p) : "", d = Be.normalize(d);
      var E = this;
      i.fs.open(d, "r", function(y) {
        if (y && y.code === "ENOENT")
          m(void 0, He.Errors.FILE_NOT_FOUND(d));
        else if (y)
          m(void 0, y);
        else {
          var _ = i.findFiles(d), S = -1, C = function() {
            if (S += 1, S < _.length) {
              var j = _[S], V = h(d, j).split("\\").join("/");
              V = V.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, ""), w(V) ? i.fs.stat(j, function(G, q) {
                G && m(void 0, G), q.isFile() ? i.fs.readFile(j, function(b, M) {
                  b ? m(void 0, b) : (E.addFile(p + V, M, "", q), C());
                }) : (E.addFile(p + V + "/", Buffer.alloc(0), "", q), C());
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
      let { zipPath: w, filter: E, namefix: y } = d;
      E instanceof RegExp ? E = /* @__PURE__ */ function(C) {
        return function(j) {
          return C.test(j);
        };
      }(E) : typeof E != "function" && (E = function() {
        return !0;
      }), w = w ? l(w) : "", y == "latin1" && (y = (C) => C.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "")), typeof y != "function" && (y = (C) => C);
      const _ = (C) => Be.join(w, y(h(localPath, C))), S = (C) => Be.win32.basename(Be.win32.normalize(y(C)));
      i.fs.open(localPath, "r", function(C) {
        C && C.code === "ENOENT" ? m(void 0, He.Errors.FILE_NOT_FOUND(localPath)) : C ? m(void 0, C) : i.findFilesAsync(localPath, function(j, V) {
          if (j) return m(j);
          V = V.filter((G) => E(_(G))), V.length || m(void 0, !1), setImmediate(
            V.reverse().reduce(function(G, q) {
              return function(b, M) {
                if (b || M === !1) return setImmediate(G, b, !1);
                p.addLocalFileAsync(
                  {
                    localPath: q,
                    zipPath: Be.dirname(_(q)),
                    zipName: S(q)
                  },
                  G
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
      return new Promise((p, w) => {
        this.addLocalFolderAsync2(Object.assign({ localPath: d }, m), (E, y) => {
          E && w(E), y && p(this);
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
    addFile: function(d, m, p, w) {
      d = c(d);
      let E = u(d);
      const y = E != null;
      y || (E = new dN(r), E.entryName = d), E.comment = p || "";
      const _ = typeof w == "object" && w instanceof i.fs.Stats;
      _ && (E.header.time = w.mtime);
      var S = E.isDirectory ? 16 : 0;
      let C = E.isDirectory ? 16384 : 32768;
      return _ ? C |= 4095 & w.mode : typeof w == "number" ? C |= 4095 & w : C |= E.isDirectory ? 493 : 420, S = (S | C << 16) >>> 0, E.attr = S, E.setData(m), y || o.setEntry(E), E;
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
    extractEntryTo: function(d, m, p, w, E, y) {
      w = yr(!1, w), E = yr(!1, E), p = yr(!0, p), y = Fd(E, y);
      var _ = u(d);
      if (!_)
        throw He.Errors.NO_ENTRY();
      var S = s(_.entryName), C = a(m, y && !_.isDirectory ? y : p ? S : Be.basename(S));
      if (_.isDirectory) {
        var j = o.getEntryChildren(_);
        return j.forEach(function(q) {
          if (q.isDirectory) return;
          var b = q.getData();
          if (!b)
            throw He.Errors.CANT_EXTRACT_FILE();
          var M = s(q.entryName), W = a(m, p ? M : Be.basename(M));
          const X = E ? q.header.fileAttr : void 0;
          i.writeFileTo(W, b, w, X);
        }), !0;
      }
      var V = _.getData(o.password);
      if (!V) throw He.Errors.CANT_EXTRACT_FILE();
      if (i.fs.existsSync(C) && !w)
        throw He.Errors.CANT_OVERRIDE();
      const G = E ? d.header.fileAttr : void 0;
      return i.writeFileTo(C, V, w, G), !0;
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
    extractAllTo: function(d, m, p, w) {
      if (p = yr(!1, p), w = Fd(p, w), m = yr(!1, m), !o) throw He.Errors.NO_ZIP();
      o.entries.forEach(function(E) {
        var y = a(d, s(E.entryName));
        if (E.isDirectory) {
          i.makeDir(y);
          return;
        }
        var _ = E.getData(w);
        if (!_)
          throw He.Errors.CANT_EXTRACT_FILE();
        const S = p ? E.header.fileAttr : void 0;
        i.writeFileTo(y, _, m, S);
        try {
          i.fs.utimesSync(y, E.header.time, E.header.time);
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
    extractAllToAsync: function(d, m, p, w) {
      if (w = pN(m, p, w), p = yr(!1, p), m = yr(!1, m), !w)
        return new Promise((C, j) => {
          this.extractAllToAsync(d, m, p, function(V) {
            V ? j(V) : C(this);
          });
        });
      if (!o) {
        w(He.Errors.NO_ZIP());
        return;
      }
      d = Be.resolve(d);
      const E = (C) => a(d, Be.normalize(s(C.entryName))), y = (C, j) => new Error(C + ': "' + j + '"'), _ = [], S = [];
      o.entries.forEach((C) => {
        C.isDirectory ? _.push(C) : S.push(C);
      });
      for (const C of _) {
        const j = E(C), V = p ? C.header.fileAttr : void 0;
        try {
          i.makeDir(j), V && i.fs.chmodSync(j, V), i.fs.utimesSync(j, C.header.time, C.header.time);
        } catch {
          w(y("Unable to create folder", j));
        }
      }
      S.reverse().reduce(function(C, j) {
        return function(V) {
          if (V)
            C(V);
          else {
            const G = Be.normalize(s(j.entryName)), q = a(d, G);
            j.getDataAsync(function(b, M) {
              if (M)
                C(M);
              else if (!b)
                C(He.Errors.CANT_EXTRACT_FILE());
              else {
                const W = p ? j.header.fileAttr : void 0;
                i.writeFileToAsync(q, b, m, W, function(X) {
                  X || C(y("Unable to write file", q)), i.fs.utimes(q, j.header.time, j.header.time, function(L) {
                    L ? C(y("Unable to set times", q)) : C();
                  });
                });
              }
            });
          }
        };
      }, w)();
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
          var w = i.writeFileTo(d, p, !0);
          typeof m == "function" && m(w ? null : new Error("failed"), "");
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
      const { overwrite: p, perm: w } = Object.assign({ overwrite: !0 }, m);
      return new Promise((E, y) => {
        !d && r.filename && (d = r.filename), d || y("ADM-ZIP: ZIP File Name Missing"), this.toBufferPromise().then((_) => {
          const S = (C) => C ? E(C) : y("ADM-ZIP: Wasn't able to write zip file");
          i.writeFileToAsync(d, _, p, w, S);
        }, y);
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
    toBuffer: function(d, m, p, w) {
      return typeof d == "function" ? (o.toAsyncBuffer(d, m, p, w), null) : o.compressToBuffer();
    }
  };
};
const pn = /* @__PURE__ */ Il(gN), yN = [
  "C:\\Program Files\\Java",
  "C:\\Program Files (x86)\\Java",
  "C:\\Program Files\\Eclipse Adoptium",
  "C:\\Program Files\\Microsoft",
  "C:\\Program Files\\Zulu",
  "C:\\Program Files\\BellSoft",
  "C:\\Program Files\\Amazon Corretto",
  "C:\\Program Files (x86)\\Common Files\\Oracle\\Java",
  "C:\\Program Files\\Common Files\\Oracle\\Java",
  process.env.APPDATA ? x.join(process.env.APPDATA, "PrismLauncher\\java") : "",
  process.env.LOCALAPPDATA ? x.join(process.env.LOCALAPPDATA, "Packages") : "",
  ae.java
], vN = [
  "/Library/Java/JavaVirtualMachines",
  "/usr/local/opt"
], wN = [
  "/usr/lib/jvm",
  "/usr/java"
], EN = "https://api.adoptium.net/v3";
function _N(e) {
  var t, n;
  try {
    const i = Al(`"${e}" -version 2>&1`, {
      timeout: 5e3,
      stdio: "pipe"
    }).toString().match(/version "([^"]+)"/);
    return i ? i[1] : null;
  } catch (r) {
    const o = (((t = r.stderr) == null ? void 0 : t.toString()) ?? ((n = r.stdout) == null ? void 0 : n.toString()) ?? "").match(/version "([^"]+)"/);
    return o ? o[1] : null;
  }
}
function $N(e) {
  try {
    const t = Al(`"${e}" -XshowSettings:all -version 2>&1`, { timeout: 5e3 }).toString();
    return t.includes("amd64") || t.includes("x86_64") ? "amd64" : t.includes("aarch64") || t.includes("arm64") ? "arm64" : t.includes("x86") ? "x86" : "amd64";
  } catch {
    return "amd64";
  }
}
function ll(e) {
  const t = [];
  if (!e || !k.existsSync(e)) return t;
  try {
    const n = k.readdirSync(e);
    for (const r of n) {
      const i = x.join(e, r);
      if (!k.statSync(i).isDirectory()) continue;
      const o = [
        x.join(i, "bin", "javaw.exe"),
        x.join(i, "bin", "java"),
        x.join(i, "jre", "bin", "javaw.exe"),
        x.join(i, "jre", "bin", "java"),
        x.join(i, "Contents", "Home", "bin", "java")
      ];
      for (const s of o)
        if (k.existsSync(s)) {
          const a = _N(s);
          if (a) {
            t.push({
              version: a,
              architecture: $N(s),
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
function SN(e) {
  const t = e.match(/^(\d{2,})\./);
  if (t && parseInt(t[1]) >= 26) return 25;
  const n = e.split("."), r = parseInt(n[1] ?? "0");
  return r >= 21 ? 21 : r >= 17 ? 17 : (r >= 13, 8);
}
function bN(e) {
  return new Promise((t, n) => {
    yt.get(e, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (r) => {
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
function AN(e, t, n) {
  return new Promise((r, i) => {
    k.mkdirSync(x.dirname(t), { recursive: !0 });
    const o = (s, a = 0) => {
      if (a > 5) return i(new Error("Too many redirects"));
      yt.get(s, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (c) => {
        if ([301, 302, 307, 308].includes(c.statusCode)) {
          const h = c.headers.location;
          return o(h.startsWith("http") ? h : new URL(h, s).toString(), a + 1);
        }
        if (c.statusCode !== 200) return i(new Error(`HTTP ${c.statusCode}`));
        const u = parseInt(c.headers["content-length"] ?? "0");
        let l = 0;
        const f = k.createWriteStream(t);
        c.on("data", (h) => {
          l += h.length, u && n && n(Math.round(l / u * 100));
        }), c.pipe(f), f.on("finish", () => {
          f.close(), r();
        }), f.on("error", (h) => {
          k.unlink(t, () => {
          }), i(h);
        });
      }).on("error", i);
    };
    o(e);
  });
}
async function TN(e, t) {
  try {
    const n = process.platform === "win32" ? "windows" : process.platform === "darwin" ? "mac" : "linux", r = process.arch === "arm64" ? "aarch64" : "x64", i = "jdk";
    t == null || t(`Fetching Java ${e} info...`);
    const o = await bN(
      `${EN}/assets/latest/${e}/hotspot?architecture=${r}&image_type=${i}&os=${n}&vendor=eclipse`
    );
    if (!(o != null && o.length))
      return t == null || t(`No Java ${e} release found`), null;
    const c = o[0].binary.package, u = c.link, l = c.name, f = x.join(ae.java, `java-${e}`), h = x.join(f, l);
    k.mkdirSync(f, { recursive: !0 }), t == null || t(`Downloading Java ${e}...`);
    let d = -1;
    if (await AN(u, h, (p) => {
      const w = Math.floor(p / 10) * 10;
      w > d && (d = w, t == null || t(`Downloading Java ${e}: ${w}%`));
    }), t == null || t(`Extracting Java ${e}...`), l.endsWith(".zip"))
      new pn(h).extractAllTo(f, !0);
    else if (l.endsWith(".tar.gz")) {
      const { execSync: p } = await import("child_process");
      p(`tar -xzf "${h}" -C "${f}"`);
    }
    k.unlinkSync(h);
    const m = ll(f);
    return m.length > 0 ? (t == null || t(`Java ${e} installed!`), m[0].path) : null;
  } catch (n) {
    return t == null || t(`Failed to auto-download Java ${e}: ${n}`), null;
  }
}
const Ks = {
  detect() {
    const e = process.platform, t = e === "win32" ? yN : e === "darwin" ? vN : wN, n = [], r = /* @__PURE__ */ new Set();
    for (const i of t) {
      const o = ll(i);
      for (const s of o)
        r.has(s.path) || (r.add(s.path), n.push(s));
    }
    return n.sort((i, o) => {
      const s = parseInt(i.version.split(".")[0]);
      return parseInt(o.version.split(".")[0]) - s;
    }), n.length > 0 && (n[0].isDefault = !0), n;
  },
  getInstalled() {
    const e = ae.java;
    return k.existsSync(e) ? ll(e) : [];
  },
  async getJavaForVersion(e, t) {
    const n = SN(e), r = this.getInstalled(), i = this.detect(), o = [...r, ...i], s = o.find((a) => {
      const c = a.version;
      return (c.startsWith("1.") ? parseInt(c.split(".")[1]) : parseInt(c.split(".")[0])) === n;
    });
    return console.log("[Java] Required major:", n, "| All versions:", o.map((a) => a.version)), s ? s.path : (t == null || t(`Java ${n} not found, downloading automatically...`), TN(n, t));
  }
}, Lu = "00000000402b5328", Ra = "https://login.live.com/oauth20_desktop.srf", CN = `https://login.live.com/oauth20_authorize.srf?client_id=${Lu}&response_type=code&redirect_uri=${encodeURIComponent(Ra)}&scope=XboxLive.signin%20offline_access`;
function ko(e, t, n) {
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
    }, a = yt.request(s, (c) => {
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
function NN(e, t) {
  return new Promise((n, r) => {
    const i = new URL(e), o = {
      hostname: i.hostname,
      path: i.pathname + i.search,
      method: "GET",
      headers: {
        Accept: "application/json",
        ...t
      }
    }, s = yt.request(o, (a) => {
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
async function IN(e) {
  const t = new URLSearchParams({
    client_id: Lu,
    code: e,
    grant_type: "authorization_code",
    redirect_uri: Ra
  }).toString(), n = await ko(
    "https://login.live.com/oauth20_token.srf",
    t,
    { "Content-Type": "application/x-www-form-urlencoded" }
  );
  if (!n.access_token) throw new Error("Failed to get Microsoft token: " + JSON.stringify(n));
  return n;
}
async function Lm(e) {
  const t = JSON.stringify({
    Properties: {
      AuthMethod: "RPS",
      SiteName: "user.auth.xboxlive.com",
      RpsTicket: `d=${e}`
    },
    RelyingParty: "http://auth.xboxlive.com",
    TokenType: "JWT"
  }), n = await ko(
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
async function xm(e) {
  const t = JSON.stringify({
    Properties: {
      SandboxId: "RETAIL",
      UserTokens: [e]
    },
    RelyingParty: "rp://api.minecraftservices.com/",
    TokenType: "JWT"
  }), n = await ko(
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
async function km(e, t) {
  const n = JSON.stringify({
    identityToken: `XBL3.0 x=${t};${e}`
  }), r = await ko(
    "https://api.minecraftservices.com/authentication/login_with_xbox",
    n,
    { "Content-Type": "application/json" }
  );
  if (!r.access_token) throw new Error("Failed to get Minecraft token");
  return r.access_token;
}
async function PN(e) {
  const t = await NN(
    "https://api.minecraftservices.com/minecraft/profile",
    { Authorization: `Bearer ${e}` }
  );
  if (!t.id) throw new Error("Failed to get Minecraft profile. Do you own Minecraft?");
  return { id: t.id, name: t.name };
}
async function ON() {
  return new Promise((e, t) => {
    const n = new Ee({
      width: 500,
      height: 650,
      title: "Sign in with Microsoft",
      webPreferences: {
        nodeIntegration: !1,
        contextIsolation: !0
      }
    });
    n.setMenuBarVisibility(!1), n.loadURL(CN);
    let r = !1;
    const i = async (o) => {
      if (!o.startsWith(Ra) || r) return;
      r = !0;
      const s = new URL(o), a = s.searchParams.get("code"), c = s.searchParams.get("error");
      if (c) {
        n.close(), t(new Error("Microsoft auth error: " + c));
        return;
      }
      if (a) {
        n.close();
        try {
          const u = await IN(a), l = await Lm(u.access_token), f = await xm(l.token), h = await km(f.token, f.uhs), d = await PN(h), m = {
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
async function RN(e) {
  const t = new URLSearchParams({
    client_id: Lu,
    refresh_token: e,
    grant_type: "refresh_token",
    redirect_uri: Ra
  }).toString(), n = await ko(
    "https://login.live.com/oauth20_token.srf",
    t,
    { "Content-Type": "application/x-www-form-urlencoded" }
  ), r = await Lm(n.access_token), i = await xm(r.token);
  return {
    accessToken: await km(i.token, i.uhs),
    refreshToken: n.refresh_token,
    expiresAt: new Date(Date.now() + 864e5).toISOString(),
    status: "ready"
  };
}
function vr() {
  try {
    if (!k.existsSync(ae.accounts)) return [];
    const e = k.readFileSync(ae.accounts, "utf-8");
    return JSON.parse(e);
  } catch {
    return [];
  }
}
function Xr(e) {
  k.writeFileSync(ae.accounts, JSON.stringify(e, null, 2));
}
const _r = {
  getAll() {
    return vr();
  },
  async addMicrosoft() {
    const e = await ON(), t = vr(), n = t.findIndex((r) => r.id === e.id);
    return n >= 0 ? t[n] = e : (t.length === 0 && (e.isActive = !0), t.push(e)), Xr(t), e;
  },
  remove(e) {
    const t = vr().filter((n) => n.id !== e);
    Xr(t);
  },
  setActive(e) {
    const t = vr().map((n) => ({ ...n, isActive: n.id === e }));
    Xr(t);
  },
  getActive() {
    return vr().find((e) => e.isActive) ?? null;
  },
  async refresh(e) {
    const t = vr(), n = t.find((r) => r.id === e);
    if (!n) throw new Error("Account not found");
    try {
      const r = await RN(n.refreshToken);
      Object.assign(n, r), Xr(t);
    } catch {
      n.status = "errored", Xr(t);
    }
  },
  addOffline(e) {
    const t = vr(), n = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (o, s) => {
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
    return i >= 0 ? t[i] = r : t.push(r), Xr(t), r;
  }
};
function Ld() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
function Ec(e) {
  try {
    const t = x.join(e, "instance.json");
    if (!k.existsSync(t)) return null;
    const n = k.readFileSync(t, "utf-8");
    return JSON.parse(n);
  } catch {
    return null;
  }
}
function vs(e) {
  const t = x.join(ae.instances, e.id);
  k.existsSync(t) || k.mkdirSync(t, { recursive: !0 }), k.writeFileSync(
    x.join(t, "instance.json"),
    JSON.stringify(e, null, 2)
  );
}
const Mt = {
  getAll() {
    if (!k.existsSync(ae.instances)) return [];
    const e = k.readdirSync(ae.instances), t = [];
    for (const n of e) {
      const r = x.join(ae.instances, n);
      if (!k.statSync(r).isDirectory()) continue;
      const i = Ec(r);
      i && t.push(i);
    }
    return t;
  },
  create(e) {
    const t = Ld(), n = {
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
    }, r = x.join(ae.instances, t);
    return k.mkdirSync(x.join(r, "minecraft"), { recursive: !0 }), vs(n), n;
  },
  delete(e) {
    const t = x.join(ae.instances, e);
    k.existsSync(t) && k.rmSync(t, { recursive: !0, force: !0 });
  },
  copy(e) {
    const t = x.join(ae.instances, e), n = Ec(t);
    if (!n) throw new Error(`Instance ${e} not found`);
    const r = Ld(), i = {
      ...n,
      id: r,
      name: n.name + " (Copy)",
      lastPlayed: null,
      totalPlayTime: 0,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    }, o = x.join(ae.instances, r);
    return k.mkdirSync(x.join(o, "minecraft"), { recursive: !0 }), vs(i), i;
  },
  launch(e) {
    console.log(`Launching instance ${e}`);
  },
  updatePlayTime(e, t) {
    const n = x.join(ae.instances, e), r = Ec(n);
    r && (r.lastPlayed = (/* @__PURE__ */ new Date()).toISOString(), r.totalPlayTime += t, vs(r));
  },
  update(e) {
    vs(e);
  }
}, DN = "1502041454829375651";
let rn = null, po = !1;
async function FN() {
  if (Bt.store.discordRpc)
    try {
      rn = new M0({
        clientId: DN,
        transport: { type: "ipc" }
      }), rn.on("ready", () => {
        po = !0, console.log("[Discord RPC] Connected"), Um();
      }), await rn.login();
    } catch (e) {
      console.log("[Discord RPC] Failed to connect:", e), rn = null, po = !1;
    }
}
function LN(e, t, n) {
  var r;
  if (!(!rn || !po))
    try {
      (r = rn.user) == null || r.setActivity({
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
function xN() {
  rn && (rn.destroy(), rn = null, po = !1);
}
function Um() {
  var e;
  if (!(!rn || !po))
    try {
      (e = rn.user) == null || e.setActivity({
        details: "In the launcher",
        largeImageKey: "fernlauncher",
        largeImageText: "Fernlauncher",
        instance: !1
      });
    } catch (t) {
      console.log("[Discord RPC] Failed to set idle activity:", t);
    }
}
const Ir = /* @__PURE__ */ new Map(), _c = /* @__PURE__ */ new Map(), Js = /* @__PURE__ */ new Map();
function kN(e, t) {
  Js.set(e, t), t.on("closed", () => Js.delete(e));
}
function Ys(e) {
  return new Promise((t, n) => {
    const r = (i, o = 0) => {
      if (o > 5) return n(new Error("Too many redirects"));
      yt.get(i, (s) => {
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
function Gt(e, t) {
  return new Promise((n, r) => {
    if (k.existsSync(t)) return n();
    k.mkdirSync(x.dirname(t), { recursive: !0 });
    const i = (o, s = 0) => {
      if (s > 5) return r(new Error("Too many redirects"));
      yt.get(o, (a) => {
        if ([301, 302, 307, 308].includes(a.statusCode)) {
          const u = a.headers.location;
          return u ? i(u.startsWith("http") ? u : new URL(u, o).toString(), s + 1) : r(new Error("Redirect with no location"));
        }
        if (a.statusCode !== 200) return r(new Error(`HTTP ${a.statusCode} for ${o}`));
        const c = k.createWriteStream(t);
        a.pipe(c), c.on("finish", () => {
          c.close(), n();
        }), c.on("error", (u) => {
          k.unlink(t, () => {
          }), r(u);
        });
      }).on("error", (a) => {
        k.unlink(t, () => {
        }), r(a);
      });
    };
    i(e);
  });
}
function Pe(e, t) {
  var n, r;
  console.log("[sendLog]", t.substring(0, 50), (n = new Error().stack) == null ? void 0 : n.split(`
`)[2]), (r = Js.get(e)) == null || r.webContents.send("instance:log", { instanceId: e, line: t });
}
function ws(e, t) {
  var n;
  (n = Js.get(e)) == null || n.webContents.send("instance:status", { instanceId: e, status: t });
}
function xd(e, t) {
  Ee.getAllWindows().forEach((n) => n.webContents.send(e, t));
}
async function UN(e, t, n, r) {
  const i = await Ys(`https://meta.fabricmc.net/v2/versions/loader/${e}/${t}/profile/json`);
  for (const o of i.libraries) {
    const [s, a, c] = o.name.split(":"), u = s.replace(/\./g, "/"), l = `${a}-${c}.jar`, f = x.join(r, u, a, c, l), h = o.url ? `${o.url}${u}/${a}/${c}/${l}` : `https://maven.fabricmc.net/${u}/${a}/${c}/${l}`;
    await Gt(h, f), n.unshift(f);
  }
  return i.mainClass;
}
async function jN(e, t, n, r) {
  const i = await Ys(`https://meta.quiltmc.org/v3/versions/loader/${e}/${t}/profile/json`);
  for (const o of i.libraries) {
    const [s, a, c] = o.name.split(":"), u = s.replace(/\./g, "/"), l = `${a}-${c}.jar`, f = x.join(r, u, a, c, l), h = o.url ? `${o.url}${u}/${a}/${c}/${l}` : `https://maven.quiltmc.org/repository/release/${u}/${a}/${c}/${l}`;
    await Gt(h, f), n.unshift(f);
  }
  return i.mainClass;
}
function jm(e) {
  const t = x.join(e, "launcher_profiles.json");
  k.existsSync(t) || k.writeFileSync(t, JSON.stringify({
    profiles: {},
    selectedProfile: null,
    clientToken: "fernlaunch",
    authenticationDatabase: {},
    launcherVersion: { name: "2.0", format: 21 }
  }, null, 2));
}
function Mm(e, t, n, r, i) {
  return new Promise((o, s) => {
    var u, l;
    const c = Rs(e, ["-jar", t, "--installClient", n], { cwd: n });
    (u = c.stdout) == null || u.on("data", (f) => console.log(`[${r}]`, f.toString().trim())), (l = c.stderr) == null || l.on("data", (f) => console.log(`[${r}]`, f.toString().trim())), c.on("close", (f) => {
      f === 0 ? o() : s(new Error(`${r} exited with code ${f}`));
    }), c.on("error", s);
  });
}
async function MN(e, t, n, r) {
  var E, y, _;
  const i = x.join(n, ".."), o = "https://maven.neoforged.net/releases", s = x.join(n, "net/neoforged/neoforge", t, `neoforge-${t}-installer.jar`), a = x.join(i, "versions", `neoforge-${t}`, `neoforge-${t}.json`);
  await Gt(`${o}/net/neoforged/neoforge/${t}/neoforge-${t}-installer.jar`, s);
  const c = x.join(i, "versions", e, `${e}.jar`), u = x.join(n, "net/minecraft/client", e, `client-${e}.jar`);
  k.existsSync(c) && !k.existsSync(u) && (k.mkdirSync(x.dirname(u), { recursive: !0 }), k.copyFileSync(c, u)), k.existsSync(a) || (jm(i), await Mm(r, s, i, "NeoForge Installer"));
  const l = JSON.parse(k.readFileSync(a, "utf-8")), f = [];
  for (const S of l.libraries ?? []) {
    if (!((E = S.downloads) != null && E.artifact)) continue;
    const C = S.downloads.artifact, j = x.join(n, C.path);
    await Gt(C.url, j), k.existsSync(j) && f.push(j);
  }
  const h = x.join(n, "net/neoforged/minecraft-client-patched", t, `minecraft-client-patched-${t}.jar`);
  if (k.existsSync(h)) {
    const S = new pn(h), C = S.getEntries().some((V) => V.entryName.includes("UndashedUuid")), j = S.getEntries().some((V) => V.entryName.includes("GameProfile"));
    console.log("[Patched client] UndashedUuid:", C, "| GameProfile:", j), console.log("[Patched client] authlib entries:", S.getEntries().filter((V) => V.entryName.includes("mojang/authlib") || V.entryName.includes("mojang/util")).map((V) => V.entryName).slice(0, 10));
  }
  const d = new pn(x.join(n, "net/neoforged/neoforge", t, `neoforge-${t}-universal.jar`)), m = d.getEntries().filter((S) => S.entryName.startsWith("META-INF") || S.entryName.includes("authlib") || S.entryName.includes("MANIFEST"));
  console.log("[Universal JAR entries]", m.map((S) => S.entryName));
  const p = d.readAsText("META-INF/MANIFEST.MF");
  console.log("[Universal MANIFEST]", p);
  const w = new pn(s);
  for (const S of w.getEntries())
    if (console.log("[Installer entry]", S.entryName), S.entryName.includes("authlib") && S.entryName.endsWith(".jar")) {
      const C = x.join(n, S.entryName.replace("maven/", ""));
      k.existsSync(C) || (k.mkdirSync(x.dirname(C), { recursive: !0 }), w.extractEntryTo(S, x.dirname(C), !1, !0)), f.includes(C) || f.unshift(C);
      break;
    }
  return {
    mainClass: l.mainClass ?? "net.neoforged.fml.startup.Client",
    gameArgs: (((y = l.arguments) == null ? void 0 : y.game) ?? []).filter((S) => typeof S == "string"),
    jvmArgs: (((_ = l.arguments) == null ? void 0 : _.jvm) ?? []).filter((S) => typeof S == "string"),
    neoClasspath: f
  };
}
async function BN(e, t, n, r, i) {
  var _, S, C, j, V;
  const o = x.join(r, ".."), s = t.includes(e) ? t : `${e}-${t}`, a = "https://maven.minecraftforge.net", c = x.join(r, "net/minecraftforge/forge", s, `forge-${s}-installer.jar`), u = x.join(o, "versions");
  await Gt(`${a}/net/minecraftforge/forge/${s}/forge-${s}-installer.jar`, c), jm(o), k.existsSync(u) || k.mkdirSync(u, { recursive: !0 });
  const l = t.split("-").pop(), f = () => k.readdirSync(u).find((G) => G.toLowerCase().includes("forge") && G.includes(l));
  let h = f();
  const d = new pn(c), p = "versionInfo" in JSON.parse(d.readAsText("install_profile.json"));
  if (console.log("[Forge] isOldInstaller:", p), !h)
    if (p) {
      const G = JSON.parse(d.readAsText("install_profile.json"));
      console.log("[Forge] install_profile keys:", Object.keys(G));
      const q = G.versionInfo, b = q.id, M = x.join(u, b);
      k.mkdirSync(M, { recursive: !0 }), k.writeFileSync(x.join(M, `${b}.json`), JSON.stringify(q, null, 2));
      for (const W of d.getEntries()) {
        if (!W.entryName.startsWith("maven/")) continue;
        const X = x.join(r, W.entryName.replace("maven/", ""));
        k.existsSync(X) || (k.mkdirSync(x.dirname(X), { recursive: !0 }), d.extractEntryTo(W, x.dirname(X), !1, !0));
      }
      for (const W of q.libraries ?? []) {
        if (W.clientreq === !1) continue;
        const X = W.name.split(":"), L = X[0].replace(/\./g, "/"), U = X[1], K = X[2], z = `${U}-${K}.jar`, Z = x.join(r, L, U, K, z);
        if (!k.existsSync(Z)) {
          const J = W.url ?? "https://libraries.minecraft.net/";
          try {
            await Gt(`${J}${L}/${U}/${K}/${z}`, Z);
          } catch {
            try {
              await Gt(`${a}/${L}/${U}/${K}/${z}`, Z);
            } catch {
              console.warn(`[Forge] Could not download library: ${W.name}`);
            }
          }
        }
      }
      h = f();
    } else
      await Mm(i, c, o, "Forge Installer"), h = f();
  const w = x.join(r, "net", "minecraftforge", "forge", s, `forge-${s}-universal.jar`);
  if (p) {
    if (!k.existsSync(w)) {
      const G = d.getEntries().find((q) => q.entryName.endsWith("-universal.jar"));
      if (G) {
        k.mkdirSync(x.dirname(w), { recursive: !0 }), d.extractEntryTo(G, x.dirname(w), !1, !0);
        const q = x.join(x.dirname(w), G.entryName);
        k.existsSync(q) && q !== w && k.renameSync(q, w);
      }
    }
    k.existsSync(w) && (n.push(w), console.log("[Forge] Added universal jar to classpath"));
  }
  if (!h) throw new Error("Could not find Forge version directory after installation");
  const E = x.join(u, h, `${h}.json`), y = JSON.parse(k.readFileSync(E, "utf-8"));
  if (p)
    for (const G of y.libraries ?? []) {
      const q = G.name.split(":"), b = q[0].replace(/\./g, "/"), M = q[1], W = q[2];
      if (b.includes("minecraftforge") && M === "forge") continue;
      const L = x.join(r, b, M, W, `${M}-${W}.jar`);
      k.existsSync(L) ? n.push(L) : console.warn(`[Forge] Missing lib: ${G.name}`);
    }
  if (!p) {
    for (const G of y.libraries ?? [])
      if ((S = (_ = G.downloads) == null ? void 0 : _.artifact) != null && S.path) {
        const q = x.join(r, G.downloads.artifact.path);
        k.existsSync(q) ? n.push(q) : console.warn("[Forge] Missing new forge lib:", G.name, q);
      }
    console.log("[Forge] New forge classpath entries:", n.filter((G) => G.includes("forge")));
  }
  if (!h) throw new Error("Could not find Forge version directory after installation");
  return console.log("[Forge] mainClass:", y.mainClass), console.log("[Forge] classpath forge entries:", n.filter((G) => G.includes("forge"))), {
    mainClass: y.mainClass ?? "net.minecraftforge.bootstrap.ForgeBootstrap",
    gameArgs: (C = y.arguments) != null && C.game ? y.arguments.game.filter((G) => typeof G == "string") : ((j = y.minecraftArguments) == null ? void 0 : j.split(" ")) ?? [],
    jvmArgs: [
      "-Dfml.ignoreInvalidMinecraftCertificates=true",
      "-Dfml.ignorePatchDiscrepancies=true",
      ...(((V = y.arguments) == null ? void 0 : V.jvm) ?? []).filter((G) => typeof G == "string")
    ]
  };
}
function HN() {
  return process.platform === "win32" ? "windows" : process.platform === "darwin" ? "osx" : "linux";
}
function Wi(e, t) {
  return e.map((n) => {
    for (const [r, i] of Object.entries(t))
      n = n.replace(new RegExp(`\\$\\{${r}\\}`, "g"), i);
    return n;
  });
}
async function qN(e) {
  var Ae, Ie, Oe, un, Wt, Ot, Rt, yn, Dn, Et, Li, xi, Ko, ki, ur, Ui;
  if (Ir.has(e)) throw new Error("Instance is already running!");
  const t = x.join(ae.instances, e), n = x.join(t, "instance.json");
  if (!k.existsSync(n)) throw new Error("Instance not found");
  const r = JSON.parse(k.readFileSync(n, "utf-8")), i = x.join(t, "minecraft"), o = Bt.store, s = _r.getActive();
  if (console.log("[Launch] Active account:", s == null ? void 0 : s.minecraftUsername, s == null ? void 0 : s.type), !s) throw new Error("No active account. Please log in first.");
  ws(e, "downloading"), Pe(e, "🌿 Fernlauncher starting..."), Pe(e, `Launching ${r.name} (${r.version})`), Pe(e, "Fetching version manifest...");
  const a = ((Ae = o.services) == null ? void 0 : Ae.metaServer) || "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json", u = (await Ys(a)).versions.find((Q) => Q.id === r.version);
  if (!u) throw new Error(`Version ${r.version} not found in manifest`);
  const l = await Ys(u.url), f = x.join(ae.appData, "versions", r.version);
  k.mkdirSync(f, { recursive: !0 }), Pe(e, "Downloading Minecraft client...");
  const h = x.join(f, `${r.version}.jar`);
  await Gt(l.downloads.client.url, h), Pe(e, "Downloading libraries...");
  const d = x.join(ae.appData, "libraries"), m = [], p = HN(), w = r.modLoader === "neoforge" || r.modLoader === "forge";
  for (const Q of l.libraries) {
    if (Q.rules && !Q.rules.every((ke) => {
      var Xe;
      const tt = (Xe = ke.os) == null ? void 0 : Xe.name;
      return tt ? ke.action === "allow" ? tt === p : tt !== p : ke.action === "allow";
    }))
      continue;
    const de = (Ie = Q.downloads) == null ? void 0 : Ie.artifact;
    if (!de || w && ((Oe = Q.name) != null && Oe.includes("log4j-slf4j"))) continue;
    const Te = x.join(d, de.path);
    await Gt(de.url, Te), m.push(Te);
  }
  r.modLoader !== "neoforge" && m.push(h), Pe(e, "Finding Java...");
  const E = (() => {
    const Q = parseInt(r.version.split(".")[1] ?? "0");
    return Q >= 21 ? 21 : Q >= 17 ? 17 : 8;
  })();
  function y(Q) {
    try {
      const Te = Al(`"${Q}" -version 2>&1`, { timeout: 5e3 }).toString().match(/version "([^"]+)"/);
      if (!Te) return 0;
      const Se = Te[1];
      return Se.startsWith("1.") ? parseInt(Se.split(".")[1]) : parseInt(Se.split(".")[0]);
    } catch {
      return 0;
    }
  }
  let _ = o.java.executable;
  if (_ && k.existsSync(_)) {
    const Q = y(_);
    Pe(e, `Configured Java version: ${Q}, required: ${E}`), Q !== E && (Pe(e, `Finding Java ${E}...`), _ = await Ks.getJavaForVersion(r.version, (de) => Pe(e, de)) ?? "");
  } else
    _ = await Ks.getJavaForVersion(r.version, (Q) => Pe(e, Q)) ?? "";
  if (!_ || !k.existsSync(_))
    throw new Error(`No Java ${E} found. Please install it in Settings → Java.`);
  let S = l.mainClass, C = [], j = [], V = [], G = [], q = [];
  if (r.modLoader === "fabric" && r.modLoaderVersion)
    Pe(e, "Applying Fabric loader..."), S = await UN(r.version, r.modLoaderVersion, m, d), Pe(e, `Fabric main class: ${S}`);
  else if (r.modLoader === "quilt" && r.modLoaderVersion)
    Pe(e, "Applying Quilt loader..."), S = await jN(r.version, r.modLoaderVersion, m, d), Pe(e, `Quilt main class: ${S}`);
  else if (r.modLoader === "neoforge" && r.modLoaderVersion) {
    Pe(e, "Applying NeoForge loader...");
    const Q = await MN(r.version, r.modLoaderVersion, d, _);
    S = Q.mainClass, C = Q.gameArgs, j = Q.jvmArgs, V = Q.neoClasspath, Pe(e, `NeoForge main class: ${S}`);
  } else if (r.modLoader === "forge" && r.modLoaderVersion) {
    Pe(e, "Applying Forge loader...");
    const Q = await BN(r.version, r.modLoaderVersion, m, d, _);
    S = Q.mainClass, G = Q.gameArgs, q = Q.jvmArgs, Pe(e, `Forge main class: ${S}`), console.log("[Old Forge] gameArgs:", Q.gameArgs), console.log("[Old Forge] jvmArgs:", Q.jvmArgs);
  }
  const b = /* @__PURE__ */ new Set(), M = [];
  for (const Q of [...V, ...m]) {
    const de = x.basename(Q);
    b.has(de) || (b.add(de), M.push(Q));
  }
  Pe(e, "Downloading assets...");
  const W = x.join(ae.appData, "assets"), X = x.join(W, "indexes"), L = x.join(W, "objects");
  k.mkdirSync(X, { recursive: !0 }), k.mkdirSync(L, { recursive: !0 });
  const U = ((un = o.services) == null ? void 0 : un.assetsServer) || "https://resources.download.minecraft.net/", K = l.assetIndex, z = x.join(X, `${K.id}.json`);
  await Gt(K.url, z);
  const Z = Object.entries(JSON.parse(k.readFileSync(z, "utf-8")).objects);
  let J = 0;
  const B = 64;
  for (let Q = 0; Q < Z.length; Q += B)
    await Promise.all(Z.slice(Q, Q + B).map(async ([, de]) => {
      const Te = de.hash, Se = Te.substring(0, 2), ke = x.join(L, Se, Te);
      k.existsSync(ke) || await Gt(`${U}${Se}/${Te}`, ke), J++;
      const tt = Math.round(J / Z.length * 100);
      (J % 50 === 0 || J === Z.length) && Pe(e, `Assets: ${J}/${Z.length} (${tt}%)`);
    }));
  Pe(e, "Building launch arguments...");
  const P = x.join(f, "natives");
  if (k.mkdirSync(P, { recursive: !0 }), k.mkdirSync(i, { recursive: !0 }), parseInt(r.version.split(".")[1] ?? "0") <= 12) {
    const Q = process.platform === "win32" ? "windows" : process.platform === "darwin" ? "osx" : "linux";
    for (const de of l.libraries) {
      if (!((Wt = de.natives) != null && Wt[Q]) || de.rules && !de.rules.every((Xe) => {
        var Wr;
        const vn = (Wr = Xe.os) == null ? void 0 : Wr.name;
        return vn ? Xe.action === "allow" ? vn === Q : vn !== Q : Xe.action === "allow";
      }))
        continue;
      const Te = de.natives[Q].replace("${arch}", "64"), Se = (Rt = (Ot = de.downloads) == null ? void 0 : Ot.classifiers) == null ? void 0 : Rt[Te];
      if (!Se) continue;
      const ke = x.join(d, Se.path);
      if (await Gt(Se.url, ke), k.existsSync(ke)) {
        const tt = new pn(ke);
        tt.getEntries().forEach((Xe) => {
          !Xe.isDirectory && (Xe.entryName.endsWith(".dll") || Xe.entryName.endsWith(".so") || Xe.entryName.endsWith(".dylib")) && tt.extractEntryTo(Xe, P, !1, !0);
        }), console.log("[Natives] Extracted from", Se.path);
      }
    }
    console.log("[Natives] dir after extraction:", k.readdirSync(P));
  }
  console.log("[Natives] dir contents:", k.readdirSync(P)), console.log("[Natives] lwjgl native jars:", l.libraries.filter((Q) => Q.natives).map((Q) => Q.name));
  const D = process.platform === "win32" ? ";" : ":", $ = M.join(D), T = {
    natives_directory: P,
    launcher_name: "Fernlauncher",
    launcher_version: "1.0.0",
    classpath: $,
    library_directory: d,
    classpath_separator: D
  }, H = {
    auth_player_name: s.minecraftUsername,
    version_name: r.version,
    game_directory: i,
    assets_root: W,
    assets_index_name: K.id,
    auth_uuid: s.type === "offline" ? s.id.replace(/-/g, "") : s.id,
    auth_access_token: s.type === "offline" ? "0" : s.accessToken,
    clientid: "00000000402b5328",
    auth_xuid: "",
    user_type: s.type === "offline" ? "legacy" : "msa",
    version_type: l.type,
    user_properties: "{}"
    // add this
  }, ie = [];
  if ((yn = l.arguments) != null && yn.jvm)
    for (const Q of l.arguments.jvm)
      typeof Q == "string" ? ie.push(Q) : Q.rules && Q.rules.every((Te) => {
        var ke;
        const Se = (ke = Te.os) == null ? void 0 : ke.name;
        return Se ? Te.action === "allow" ? Se === p : Se !== p : Te.action === "allow";
      }) && ie.push(...Array.isArray(Q.value) ? Q.value : [Q.value]);
  else
    ie.push(`-Djava.library.path=${P}`, "-cp", $);
  const ne = [];
  if ((Dn = l.arguments) != null && Dn.game)
    for (const Q of l.arguments.game)
      typeof Q == "string" && ne.push(Q);
  else l.minecraftArguments && ne.push(...l.minecraftArguments.split(" "));
  Pe(e, `Memory: ${r.minMemory ?? o.java.minMemory}m - ${r.maxMemory ?? o.java.maxMemory}m`);
  const ye = [
    `-Xms${r.minMemory ?? o.java.minMemory}m`,
    `-Xmx${r.maxMemory ?? o.java.maxMemory}m`
  ], le = r.jvmArgs ?? o.java.jvmArgs ? (r.jvmArgs ?? o.java.jvmArgs).split(" ").filter(Boolean) : [];
  (Et = o.tweaks) != null && Et.useSystemGLFW && o.tweaks.glfwPath && le.push(`-Dorg.lwjgl.glfw.libname=${o.tweaks.glfwPath}`), (Li = o.tweaks) != null && Li.useSystemOpenAL && o.tweaks.openALPath && le.push(`-Dorg.lwjgl.openal.libname=${o.tweaks.openALPath}`), (xi = o.tweaks) != null && xi.onlineFixes && (le.push("-Dminecraft.api.auth.host=https://nope.invalid"), le.push("-Dminecraft.api.account.host=https://nope.invalid"), le.push("-Dminecraft.api.session.host=https://nope.invalid"), le.push("-Dminecraft.api.services.host=https://nope.invalid"));
  const O = r.windowWidth ?? o.minecraft.windowWidth, v = r.windowHeight ?? o.minecraft.windowHeight, g = o.minecraft.startMaximized ? ["--fullscreen"] : ["--width", String(O), "--height", String(v)], I = y(_), N = [
    ...I < 23 ? ["--sun-misc-unsafe-memory-access=allow"] : [],
    ...I < 21 ? ["--enable-native-access=ALL-UNNAMED"] : []
  ], te = [
    ...ye,
    ...le,
    `-DlibraryDirectory=${d}`,
    ...Wi(j, T),
    ...Wi(q, T),
    ...Wi(ie, T).filter((Q) => !N.includes(Q)),
    S,
    ...G.length > 0 && G.includes("--tweakClass") ? Wi(G, H) : [...Wi(ne, H), ...C, ...G],
    ...g
  ];
  if (Pe(e, "Launching Minecraft!"), ws(e, "launching"), (Ko = o.commands) != null && Ko.preLaunch) {
    const Q = o.commands.preLaunch.replace("$INST_NAME", r.name).replace("$INST_ID", r.id).replace("$INST_DIR", x.join(ae.instances, r.id)).replace("$INST_MC_DIR", i).replace("$INST_JAVA", _);
    Pe(e, `Running pre-launch command: ${Q}`), await new Promise((de, Te) => {
      const [Se, ...ke] = Q.split(" "), tt = Rs(Se, ke, { shell: !0 });
      tt.on("close", (Xe) => {
        Xe !== 0 ? Te(new Error(`Pre-launch command failed with code ${Xe}`)) : de();
      }), tt.on("error", Te);
    });
  }
  const fe = (o.envVars ?? []).reduce((Q, { name: de, value: Te }) => (de && (Q[de] = Te), Q), {});
  let _e = _, $e = te;
  if ((ki = o.commands) != null && ki.wrapper) {
    const Q = o.commands.wrapper.split(" ");
    _e = Q[0], $e = [...Q.slice(1), _, ...te];
  }
  const ve = Rs(_e, $e, {
    cwd: i,
    env: { ...process.env, ...fe }
  });
  Ir.set(e, ve), (ur = ve.stdout) == null || ur.on("data", (Q) => {
    Q.toString().split(`
`).filter((de) => de.trim()).forEach((de) => Pe(e, de));
  }), (Ui = ve.stderr) == null || Ui.on("data", (Q) => {
    Q.toString().split(`
`).filter((de) => de.trim()).forEach((de) => Pe(e, de));
  }), ve.on("spawn", () => {
    _c.set(e, Date.now()), ws(e, "running"), Pe(e, "✓ Minecraft process started"), o.minecraft.hideOnLaunch && Ee.getAllWindows().filter((de) => !de.webContents.getURL().includes("console")).forEach((de) => de.hide());
    const Q = Mt.getAll().find((de) => de.id === e);
    Q && LN(Q.name, Q.version, Q.modLoader);
  }), ve.on("close", (Q) => {
    var de, Te;
    if (Ir.delete(e), Um(), console.log("[Launcher] Process exited with code:", Q), (de = o.commands) != null && de.postExit) {
      const Se = o.commands.postExit.replace("$INST_NAME", r.name).replace("$INST_ID", r.id).replace("$INST_DIR", x.join(ae.instances, r.id)).replace("$INST_MC_DIR", i).replace("$INST_JAVA", _), [ke, ...tt] = Se.split(" ");
      Rs(ke, tt, { shell: !0 });
    }
    if (o.minecraft.recordPlayTime) {
      const Se = Date.now(), ke = _c.get(e);
      if (ke) {
        const tt = Math.floor((Se - ke) / 1e3);
        Mt.updatePlayTime(e, tt);
      }
    }
    if (_c.delete(e), o.minecraft.hideOnLaunch && Ee.getAllWindows().filter((Se) => !Se.webContents.getURL().includes("console")).forEach((Se) => Se.show()), o.minecraft.hideConsoleOnExit && Q === 0 && ((Te = Ee.getAllWindows().find((Se) => Se.webContents.getURL().includes("console"))) == null || Te.hide()), o.minecraft.quitOnClose) {
      De.quit();
      return;
    }
    if (Q !== 0 && o.minecraft.showConsoleOnCrash) {
      const Se = Ee.getAllWindows().find((ke) => ke.webContents.getURL().includes(`instanceId=${e}`));
      Se ? Se.show() : xd("open-console", { instanceId: e });
    }
    xd("instances:updated", {});
  }), ve.on("error", (Q) => {
    Ir.delete(e), ws(e, "crashed"), Pe(e, `Failed to start: ${Q.message}`);
  });
}
function zN(e) {
  const t = Ir.get(e);
  t && (t.kill(), Ir.delete(e));
}
function kd(e) {
  return Ir.has(e);
}
function VN(e, t) {
  const n = e.readUInt16BE(t);
  return t += 2, { value: e.slice(t, t + n).toString("utf8"), offset: t + n };
}
function $c(e) {
  try {
    e = Po.gunzipSync(e);
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
            const d = VN(e, n);
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
function Ud(e) {
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
function jd(e) {
  return e === "forge" ? "1" : e === "fabric" ? "4" : e === "neoforge" ? "6" : e === "quilt" ? "5" : "0";
}
function wr(e, t) {
  return new Promise((n, r) => {
    yt.get(e, { headers: { "x-api-key": t, Accept: "application/json" } }, (i) => {
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
function GN() {
  oe.handle("instances:get", () => Mt.getAll()), oe.handle("instances:create", (e, t) => {
    const n = Mt.create(t);
    return Ee.getAllWindows().forEach((r) => r.webContents.send("instances:updated")), n;
  }), oe.handle("instances:delete", (e, t) => {
    Mt.delete(t), Ee.getAllWindows().forEach((n) => n.webContents.send("instances:updated"));
  }), oe.handle("instances:copy", (e, t) => {
    const n = Mt.copy(t);
    return Ee.getAllWindows().forEach((r) => r.webContents.send("instances:updated")), n;
  }), oe.handle("instances:update", (e, t) => {
    Mt.update(t), Ee.getAllWindows().forEach((n) => n.webContents.send("instances:updated"));
  }), oe.handle("instances:launch", (e, t) => qN(t)), oe.handle("instances:kill", (e, t) => {
    kd(t) && zN(t);
  }), oe.handle("instances:isRunning", (e, t) => kd(t)), oe.handle("instance:listFolder", async (e, t, n) => {
    const r = x.join(ae.instances, t, n);
    return k.existsSync(r) ? k.readdirSync(r) : [];
  }), oe.handle("instance:openFolder", async (e, t, n) => {
    const r = x.join(ae.instances, t, n);
    k.existsSync(r) || k.mkdirSync(r, { recursive: !0 }), Zi.openPath(r);
  }), oe.handle("instance:deleteFile", async (e, t, n) => {
    const r = x.join(ae.instances, t, n);
    k.existsSync(r) && k.unlinkSync(r);
  }), oe.handle("instance:downloadMod", async (e, t, n, r) => {
    const i = x.join(ae.instances, t, "minecraft", "mods");
    k.existsSync(i) || k.mkdirSync(i, { recursive: !0 });
    const o = x.join(i, r);
    return await new Promise((s, a) => {
      const c = (u, l = 0) => {
        if (l > 5) return a(new Error("Too many redirects"));
        yt.get(u, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (f) => {
          if ([301, 302, 307, 308].includes(f.statusCode)) return c(f.headers.location, l + 1);
          if (f.statusCode !== 200) return a(new Error(`HTTP ${f.statusCode}`));
          const h = k.createWriteStream(o);
          f.pipe(h), h.on("finish", () => {
            h.close(), s();
          }), h.on("error", a);
        }).on("error", a);
      };
      c(n);
    }), r;
  }), oe.handle("instance:curseforgeSearch", async (e, t, n, r, i, o) => {
    const s = Bt.store.services.curseforgeApiKey;
    if (!s) throw new Error("CurseForge API key not configured.");
    const a = new URLSearchParams({
      gameId: "432",
      searchFilter: t,
      gameVersion: n,
      classId: String(i),
      modLoaderType: jd(r),
      index: String(o),
      pageSize: "20",
      sortField: "2",
      sortOrder: "desc"
    });
    return wr(`https://api.curseforge.com/v1/mods/search?${a}`, s);
  }), oe.handle("instance:curseforgeGetFiles", async (e, t, n, r) => {
    const i = Bt.store.services.curseforgeApiKey;
    if (!i) throw new Error("CurseForge API key not configured.");
    const o = new URLSearchParams({
      gameVersion: n,
      modLoaderType: jd(r),
      pageSize: "20"
    });
    return wr(`https://api.curseforge.com/v1/mods/${t}/files?${o}`, i);
  }), oe.handle("instance:getServers", async (e, t) => {
    const n = x.join(ae.instances, t, "minecraft", "servers.dat");
    if (!k.existsSync(n)) return [];
    try {
      return $c(k.readFileSync(n));
    } catch {
      return [];
    }
  }), oe.handle("instance:addServer", async (e, t, n, r) => {
    const i = x.join(ae.instances, t, "minecraft", "servers.dat"), o = x.join(ae.instances, t, "minecraft");
    k.existsSync(o) || k.mkdirSync(o, { recursive: !0 });
    let s = [];
    if (k.existsSync(i))
      try {
        s = $c(k.readFileSync(i));
      } catch {
      }
    s.push({ name: n, ip: r });
    const a = Ud(s);
    console.log("[servers.dat] First 4 bytes:", a[0].toString(16), a[1].toString(16), a[2].toString(16), a[3].toString(16)), k.writeFileSync(i, a);
  }), oe.handle("instance:removeServer", async (e, t, n) => {
    const r = x.join(ae.instances, t, "minecraft", "servers.dat");
    if (k.existsSync(r))
      try {
        const i = $c(k.readFileSync(r));
        i.splice(n, 1), k.writeFileSync(r, Ud(i));
      } catch {
      }
  }), oe.handle("instance:downloadFile", async (e, t, n, r, i) => {
    const o = x.join(ae.instances, t, "minecraft", i);
    k.existsSync(o) || k.mkdirSync(o, { recursive: !0 });
    const s = x.join(o, r);
    return await new Promise((a, c) => {
      const u = (l, f = 0) => {
        if (f > 5) return c(new Error("Too many redirects"));
        yt.get(l, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (h) => {
          if ([301, 302, 307, 308].includes(h.statusCode)) return u(h.headers.location, f + 1);
          if (h.statusCode !== 200) return c(new Error(`HTTP ${h.statusCode}`));
          const d = k.createWriteStream(s);
          h.pipe(d), d.on("finish", () => {
            d.close(), a();
          }), d.on("error", c);
        }).on("error", c);
      };
      u(n);
    }), r;
  }), oe.handle("instance:createShortcut", async (e, t) => {
    const n = Mt.getAll().find((i) => i.id === t);
    if (!n) return;
    const { filePath: r } = await br.showSaveDialog({
      title: "Create Shortcut",
      defaultPath: x.join(De.getPath("desktop"), `${n.name}.lnk`),
      filters: [{ name: "Shortcut", extensions: ["lnk"] }]
    });
    r && (De.isPackaged ? Zi.writeShortcutLink(r, {
      target: process.execPath,
      description: `Launch ${n.name} via Fernlauncher`
    }) : br.showMessageBox({
      type: "info",
      message: "Shortcuts can only be created in the packaged app, not in dev mode."
    }));
  }), oe.handle("instance:export", async (e, t) => {
    const n = Mt.getAll().find((s) => s.id === t);
    if (!n) return;
    const { filePath: r } = await br.showSaveDialog({
      title: "Export Instance",
      defaultPath: `${n.name}.fernpack`,
      filters: [{ name: "Fernlauncher Pack", extensions: ["fernpack"] }]
    });
    if (!r) return;
    const i = x.join(ae.instances, t), o = new pn();
    o.addLocalFolder(i), o.writeZip(r);
  }), oe.handle("instance:import", async (e, t) => {
    const n = new pn(t), r = n.readAsText("instance.json");
    if (!r) throw new Error("Invalid fernpack file");
    const i = JSON.parse(r), o = Date.now().toString(36) + Math.random().toString(36).slice(2);
    i.id = o, i.name = i.name + " (Imported)";
    const s = x.join(ae.instances, o);
    k.mkdirSync(s, { recursive: !0 }), n.extractAllTo(s, !0), k.writeFileSync(x.join(s, "instance.json"), JSON.stringify(i, null, 2)), Ee.getAllWindows().forEach((a) => a.webContents.send("instances:updated"));
  }), oe.handle("dialog:openFile", async (e, t) => br.showOpenDialog(t)), oe.handle("instance:setIcon", async (e, t) => {
    const { filePaths: n } = await br.showOpenDialog({
      title: "Choose Instance Icon",
      filters: [{ name: "Images", extensions: ["png", "jpg", "jpeg", "webp", "gif"] }],
      properties: ["openFile"]
    });
    if (!(n != null && n[0])) return null;
    const r = x.extname(n[0]), i = x.join(ae.instances, t), o = x.join(i, `icon${r}`);
    k.copyFileSync(n[0], o);
    const s = Mt.getAll().find((a) => a.id === t);
    return s && (s.icon = `icon${r}`, Mt.update(s), Ee.getAllWindows().forEach((a) => a.webContents.send("instances:updated"))), o;
  }), oe.handle("instance:getIconPath", (e, t, n) => x.join(ae.instances, t, n)), oe.handle("instance:getIconData", async (e, t, n) => {
    const r = x.join(ae.instances, t, n);
    if (!k.existsSync(r)) return null;
    const i = k.readFileSync(r);
    return `data:image/${x.extname(n).slice(1).replace("jpg", "jpeg")};base64,${i.toString("base64")}`;
  }), oe.handle("instance:getScreenshot", async (e, t, n) => {
    const r = x.join(ae.instances, t, "minecraft", "screenshots", n);
    if (!k.existsSync(r)) return null;
    const i = k.readFileSync(r);
    return `data:image/${x.extname(n).slice(1).replace("jpg", "jpeg")};base64,${i.toString("base64")}`;
  }), oe.handle("instance:openFile", async (e, t, n) => {
    const r = x.join(ae.instances, t, n);
    Zi.openPath(r);
  }), oe.handle("instance:readLog", async (e, t) => {
    const n = x.join(ae.instances, t, "minecraft", "logs", "latest.log");
    return k.existsSync(n) ? k.readFileSync(n, "utf-8") : "";
  }), oe.handle("instance:watchLog", async (e, t) => {
    const n = x.join(ae.instances, t, "minecraft", "logs", "latest.log");
    if (!k.existsSync(n)) return;
    const r = Ee.getAllWindows().find(
      (o) => o.webContents.getURL().includes(`instanceId=${t}`) && o.webContents.getURL().includes("instanceEditor")
    );
    if (!r) return;
    const i = k.watch(n, () => {
      if (!k.existsSync(n)) return;
      const o = k.readFileSync(n, "utf-8");
      r.webContents.send("instance:logUpdated", o);
    });
    r.on("closed", () => i.close());
  }), oe.handle("instance:installModrinthModpack", async (e, t, n, r) => {
    var j, V;
    const i = await import("https"), o = Ee.fromWebContents(e.sender), s = (G) => o == null ? void 0 : o.webContents.send("modpack:progress", G);
    s("Fetching modpack info...");
    const a = await new Promise((G, q) => {
      i.default.get(
        `https://api.modrinth.com/v2/version/${t}`,
        { headers: { "User-Agent": "Fernlaunch/1.0" } },
        (b) => {
          let M = "";
          b.on("data", (W) => M += W), b.on("end", () => G(JSON.parse(M)));
        }
      ).on("error", q);
    }), c = a.files.find((G) => G.primary) ?? a.files[0];
    s("Downloading modpack...");
    const u = x.join(ae.java, `temp_${Date.now()}.mrpack`);
    await new Promise((G, q) => {
      const b = (M, W = 0) => {
        if (W > 5) return q(new Error("Too many redirects"));
        i.default.get(M, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (X) => {
          if ([301, 302, 307, 308].includes(X.statusCode)) return b(X.headers.location, W + 1);
          if (X.statusCode !== 200) return q(new Error(`HTTP ${X.statusCode}`));
          const L = k.createWriteStream(u);
          X.pipe(L), L.on("finish", () => {
            L.close(), G();
          }), L.on("error", q);
        }).on("error", q);
      };
      b(c.url);
    });
    const l = new pn(u), f = JSON.parse(l.readAsText("modrinth.index.json"));
    s(`Installing ${f.name}...`);
    const h = f.dependencies.minecraft, d = f.dependencies["fabric-loader"], m = f.dependencies["quilt-loader"], p = f.dependencies.forge, w = f.dependencies.neoforge, E = d ? "fabric" : m ? "quilt" : p ? "forge" : w ? "neoforge" : "none", y = d ?? m ?? p ?? w ?? "", _ = Mt.create({
      name: n || f.name,
      version: h,
      modLoader: E,
      modLoaderVersion: y,
      group: r,
      icon: "default"
    }), S = x.join(ae.instances, _.id, "minecraft", "mods");
    k.mkdirSync(S, { recursive: !0 });
    for (const G of l.getEntries())
      if (G.entryName.startsWith("overrides/")) {
        const q = x.join(ae.instances, _.id, "minecraft", G.entryName.replace("overrides/", ""));
        G.isDirectory ? k.mkdirSync(q, { recursive: !0 }) : (k.mkdirSync(x.dirname(q), { recursive: !0 }), l.extractEntryTo(G, x.dirname(q), !1, !0));
      }
    const C = [];
    for (const G of f.files ?? []) {
      if (((j = G.env) == null ? void 0 : j.client) === "unsupported") continue;
      const b = x.join(ae.instances, _.id, "minecraft", G.path);
      if (k.mkdirSync(x.dirname(b), { recursive: !0 }), s(`Downloading ${x.basename(G.path)}...`), (V = G.downloads) != null && V.length)
        try {
          await new Promise((M, W) => {
            const X = (L, U = 0) => {
              if (U > 5) return W(new Error("Too many redirects"));
              i.default.get(L, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (K) => {
                if ([301, 302, 307, 308].includes(K.statusCode)) return X(K.headers.location, U + 1);
                if (K.statusCode !== 200) return W(new Error(`HTTP ${K.statusCode}`));
                const z = k.createWriteStream(b);
                K.pipe(z), z.on("finish", () => {
                  z.close(), M();
                }), z.on("error", W);
              }).on("error", W);
            };
            X(G.downloads[0]);
          });
        } catch {
          C.push({ name: x.basename(G.path), url: G.downloads[0] });
        }
      else
        C.push({ name: x.basename(G.path) });
    }
    return k.unlinkSync(u), Ee.getAllWindows().forEach((G) => G.webContents.send("instances:updated")), { instance: _, manualFiles: C };
  }), oe.handle("open:external", (e, t) => Zi.openExternal(t)), oe.handle("instance:checkManualFiles", async (e, t, n, r) => {
    const i = [], o = x.join(ae.instances, t, "minecraft", "mods");
    k.mkdirSync(o, { recursive: !0 });
    for (const s of n) {
      const a = x.join(r, s);
      k.existsSync(a) && (k.copyFileSync(a, x.join(o, s)), i.push(s));
    }
    return i;
  }), oe.handle("get:downloadsPath", () => De.getPath("downloads")), oe.handle("instance:installCurseForgeModpack", async (e, t, n, r, i) => {
    var C, j, V, G, q;
    const o = Ee.fromWebContents(e.sender), s = (b) => o == null ? void 0 : o.webContents.send("modpack:progress", b);
    s("Fetching modpack info...");
    const a = Bt.store.services.curseforgeApiKey, u = (await wr(`https://api.curseforge.com/v1/mods/${n}/files/${t}`, a)).data;
    s("Downloading modpack...");
    const l = x.join(ae.java, `temp_${Date.now()}.zip`);
    if (!u.downloadUrl) throw new Error("This modpack file has no download URL (blocked by CurseForge).");
    await new Promise((b, M) => {
      const W = (X, L = 0) => {
        if (L > 5) return M(new Error("Too many redirects"));
        yt.get(X, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (U) => {
          if ([301, 302, 307, 308].includes(U.statusCode)) return W(U.headers.location, L + 1);
          if (U.statusCode !== 200) return M(new Error(`HTTP ${U.statusCode}`));
          const K = k.createWriteStream(l);
          U.pipe(K), K.on("finish", () => {
            K.close(), b();
          }), K.on("error", M);
        }).on("error", M);
      };
      W(u.downloadUrl);
    });
    const f = new pn(l), h = JSON.parse(f.readAsText("manifest.json")), d = (C = h.minecraft) == null ? void 0 : C.version, m = ((G = (V = (j = h.minecraft) == null ? void 0 : j.modLoaders) == null ? void 0 : V.find((b) => b.primary)) == null ? void 0 : G.id) ?? "", p = m.startsWith("fabric-") ? "fabric" : m.startsWith("quilt-") ? "quilt" : m.startsWith("neoforge-") ? "neoforge" : m.startsWith("forge-") ? "forge" : "none", w = m.split("-").slice(1).join("-"), E = Mt.create({
      name: r || h.name,
      version: d,
      modLoader: p,
      modLoaderVersion: w,
      group: i,
      icon: "default"
    }), y = x.join(ae.instances, E.id, "minecraft", "mods");
    k.mkdirSync(y, { recursive: !0 });
    for (const b of f.getEntries())
      if (b.entryName.startsWith("overrides/")) {
        const M = x.join(ae.instances, E.id, "minecraft", b.entryName.replace("overrides/", ""));
        b.isDirectory ? k.mkdirSync(M, { recursive: !0 }) : (k.mkdirSync(x.dirname(M), { recursive: !0 }), f.extractEntryTo(b, x.dirname(M), !1, !0));
      }
    k.unlinkSync(l);
    const _ = [], S = h.files ?? [];
    for (const b of S)
      if (b.required !== !1) {
        s(`Fetching mod ${b.fileID}...`);
        try {
          const W = (await wr(
            `https://api.curseforge.com/v1/mods/${b.projectID}/files/${b.fileID}`,
            a
          )).data, X = x.join(y, W.fileName);
          if (W.downloadUrl)
            s(`Downloading ${W.fileName}...`), await new Promise((L, U) => {
              const K = (z, Z = 0) => {
                if (Z > 5) return U(new Error("Too many redirects"));
                yt.get(z, { headers: { "User-Agent": "Fernlaunch/1.0" } }, (J) => {
                  if ([301, 302, 307, 308].includes(J.statusCode)) return K(J.headers.location, Z + 1);
                  if (J.statusCode !== 200) return U(new Error(`HTTP ${J.statusCode}`));
                  const B = k.createWriteStream(X);
                  J.pipe(B), B.on("finish", () => {
                    B.close(), L();
                  }), B.on("error", U);
                }).on("error", U);
              };
              K(W.downloadUrl);
            });
          else
            try {
              const K = `https://www.curseforge.com/minecraft/mc-mods/${((q = (await wr(`https://api.curseforge.com/v1/mods/${b.projectID}`, a)).data) == null ? void 0 : q.slug) ?? String(b.projectID)}/files/${b.fileID}`;
              _.push({ name: W.fileName, url: K });
            } catch {
              _.push({ name: W.fileName });
            }
        } catch (M) {
          console.warn(`Failed to get mod ${b.fileID}:`, M), _.push({ name: `mod-${b.fileID}.jar` });
        }
      }
    return Ee.getAllWindows().forEach((b) => b.webContents.send("instances:updated")), { instance: E, manualFiles: _ };
  }), oe.handle("instance:cfModpackSearch", async (e, t, n) => {
    const r = Bt.store.services.curseforgeApiKey;
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
    return wr(`https://api.curseforge.com/v1/mods/search?${i}`, r);
  }), oe.handle("instance:cfModpackFiles", async (e, t) => {
    const n = Bt.store.services.curseforgeApiKey;
    if (!n) throw new Error("CurseForge API key not configured.");
    const r = new URLSearchParams({
      pageSize: "20",
      sortField: "1",
      sortOrder: "desc"
    });
    return wr(`https://api.curseforge.com/v1/mods/${t}/files?${r}`, n);
  });
}
function WN() {
  oe.handle("accounts:get", () => _r.getAll()), oe.handle("accounts:addMicrosoft", async () => {
    const e = await _r.addMicrosoft();
    return Ee.getAllWindows().forEach((t) => {
      t.webContents.send("accounts:updated");
    }), e;
  }), oe.handle("accounts:remove", (e, t) => {
    _r.remove(t), Ee.getAllWindows().forEach((n) => {
      n.webContents.send("accounts:updated");
    });
  }), oe.handle("accounts:setActive", (e, t) => {
    console.log("[Accounts] Setting active:", t), _r.setActive(t), Ee.getAllWindows().forEach((n) => {
      n.webContents.send("accounts:updated");
    });
  }), oe.handle("accounts:refresh", (e, t) => _r.refresh(t)), oe.handle("accounts:addOffline", (e, t) => {
    const n = _r.addOffline(t);
    return Ee.getAllWindows().forEach((r) => r.webContents.send("accounts:updated")), n;
  });
}
const KN = vp(import.meta.url), JN = yp(KN), Md = process.env.VITE_DEV_SERVER_URL;
function YN() {
  oe.handle("java:detect", async () => new Promise((e) => {
    setImmediate(() => {
      e(Ks.detect());
    });
  })), oe.handle("java:installs", () => Ks.getInstalled()), oe.handle("java:download", () => {
    const e = new Ee({
      width: 600,
      height: 500,
      title: "Install Java — Fernlauncher",
      center: !0,
      webPreferences: {
        preload: ze(JN, "../dist-electron/preload.cjs"),
        sandbox: !1
      }
    });
    e.setMenuBarVisibility(!1), Md ? e.loadURL(Md + "?window=javaDownload") : e.loadFile(ze(De.getAppPath(), "dist/index.html"), {
      query: { window: "javaDownload" }
    });
  }), oe.handle("java:browse", async () => {
    const e = await br.showOpenDialog({
      title: "Select Java Executable",
      filters: [
        { name: "Java", extensions: process.platform === "win32" ? ["exe"] : ["*"] }
      ],
      properties: ["openFile"]
    });
    return e.canceled ? null : e.filePaths[0];
  }), oe.handle("java:mojangVersions", async () => new Promise((e, t) => {
    yt.get("https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json", (r) => {
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
  })), oe.handle("java:downloadMojang", async (e, t) => {
    var f;
    const n = process.platform === "win32" ? "windows-x64" : process.platform === "darwin" ? "mac-os" : "linux", o = ((await new Promise((h, d) => {
      yt.get("https://launchermeta.mojang.com/v1/products/java-runtime/2ec0cc96c44e5a76b9c8b7c39df7210883d12871/all.json", (m) => {
        let p = "";
        m.on("data", (w) => p += w), m.on("end", () => h(JSON.parse(p)));
      }).on("error", d);
    }))[n] ?? {})[t];
    if (!o || o.length === 0) throw new Error("No download found for " + t);
    const s = o[0].manifest.url, a = await new Promise((h, d) => {
      yt.get(s, (m) => {
        let p = "";
        m.on("data", (w) => p += w), m.on("end", () => h(JSON.parse(p)));
      }).on("error", d);
    }), c = x.join(ae.java, t);
    k.existsSync(c) || k.mkdirSync(c, { recursive: !0 });
    const u = Object.entries(a.files);
    let l = 0;
    for (const [h, d] of u) {
      const m = x.join(c, h);
      if (d.type === "directory") {
        k.existsSync(m) || k.mkdirSync(m, { recursive: !0 }), l++;
        continue;
      }
      if (d.type === "link") {
        try {
          const E = x.dirname(m);
          k.existsSync(E) || k.mkdirSync(E, { recursive: !0 }), k.existsSync(m) && k.unlinkSync(m), k.symlinkSync(d.target, m);
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
      const w = x.dirname(m);
      k.existsSync(w) || k.mkdirSync(w, { recursive: !0 });
      try {
        await new Promise((E, y) => {
          const _ = k.createWriteStream(m), S = yt.get(p.url, (C) => {
            if (C.statusCode !== 200) {
              _.close(), k.unlink(m, () => {
              }), y(new Error(`HTTP ${C.statusCode} for ${h}`));
              return;
            }
            C.pipe(_), _.on("finish", () => {
              if (_.close(), d.executable)
                try {
                  k.chmodSync(m, 493);
                } catch {
                }
              E();
            }), _.on("error", (j) => {
              k.unlink(m, () => {
              }), y(j);
            });
          });
          S.on("error", (C) => {
            _.close(), k.unlink(m, () => {
            }), y(C);
          }), S.setTimeout(3e4, () => {
            S.destroy(), y(new Error(`Timeout downloading ${h}`));
          });
        });
      } catch (E) {
        console.error(`Failed to download ${h}:`, E);
      }
      l++, Ee.getAllWindows().forEach((E) => {
        E.webContents.send("java:downloadProgress", {
          component: t,
          done: l,
          total: u.length,
          percent: Math.round(l / u.length * 100)
        });
      });
    }
  });
}
function Ki(e) {
  return new Promise((t, n) => {
    yt.get(e, (r) => {
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
function XN() {
  oe.handle("versions:get", async () => (await Ki(
    "https://launchermeta.mojang.com/mc/game/version_manifest_v2.json"
  )).versions.map((t) => ({
    id: t.id,
    type: t.type,
    releaseTime: t.releaseTime
  }))), oe.handle("versions:fabric", async (e, t) => {
    try {
      return (await Ki(
        `https://meta.fabricmc.net/v2/versions/loader/${t}`
      )).map((r) => ({
        version: r.loader.version,
        stable: r.loader.stable
      }));
    } catch {
      return [];
    }
  }), oe.handle("versions:quilt", async (e, t) => {
    try {
      return (await Ki(
        `https://meta.quiltmc.org/v3/versions/loader/${t}`
      )).map((r) => ({
        version: r.loader.version,
        stable: !0
      }));
    } catch {
      return [];
    }
  }), oe.handle("versions:neoforge", async (e, t) => {
    try {
      const r = (await Ki(
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
  }), oe.handle("versions:forge", async (e, t) => {
    try {
      return ((await Ki(
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
var Gn = {}, qr = {}, Nt = {};
Nt.fromCallback = function(e) {
  return Object.defineProperty(function(...t) {
    if (typeof t[t.length - 1] == "function") e.apply(this, t);
    else
      return new Promise((n, r) => {
        t.push((i, o) => i != null ? r(i) : n(o)), e.apply(this, t);
      });
  }, "name", { value: e.name });
};
Nt.fromPromise = function(e) {
  return Object.defineProperty(function(...t) {
    const n = t[t.length - 1];
    if (typeof n != "function") return e.apply(this, t);
    t.pop(), e.apply(this, t).then((r) => n(null, r), n);
  }, "name", { value: e.name });
};
var Hn = B0, ZN = process.cwd, Ms = null, QN = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
  return Ms || (Ms = ZN.call(process)), Ms;
};
try {
  process.cwd();
} catch {
}
if (typeof process.chdir == "function") {
  var Bd = process.chdir;
  process.chdir = function(e) {
    Ms = null, Bd.call(process, e);
  }, Object.setPrototypeOf && Object.setPrototypeOf(process.chdir, Bd);
}
var e1 = t1;
function t1(e) {
  Hn.hasOwnProperty("O_SYMLINK") && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./) && t(e), e.lutimes || n(e), e.chown = o(e.chown), e.fchown = o(e.fchown), e.lchown = o(e.lchown), e.chmod = r(e.chmod), e.fchmod = r(e.fchmod), e.lchmod = r(e.lchmod), e.chownSync = s(e.chownSync), e.fchownSync = s(e.fchownSync), e.lchownSync = s(e.lchownSync), e.chmodSync = i(e.chmodSync), e.fchmodSync = i(e.fchmodSync), e.lchmodSync = i(e.lchmodSync), e.stat = a(e.stat), e.fstat = a(e.fstat), e.lstat = a(e.lstat), e.statSync = c(e.statSync), e.fstatSync = c(e.fstatSync), e.lstatSync = c(e.lstatSync), e.chmod && !e.lchmod && (e.lchmod = function(l, f, h) {
    h && process.nextTick(h);
  }, e.lchmodSync = function() {
  }), e.chown && !e.lchown && (e.lchown = function(l, f, h, d) {
    d && process.nextTick(d);
  }, e.lchownSync = function() {
  }), QN === "win32" && (e.rename = typeof e.rename != "function" ? e.rename : function(l) {
    function f(h, d, m) {
      var p = Date.now(), w = 0;
      l(h, d, function E(y) {
        if (y && (y.code === "EACCES" || y.code === "EPERM" || y.code === "EBUSY") && Date.now() - p < 6e4) {
          setTimeout(function() {
            e.stat(d, function(_, S) {
              _ && _.code === "ENOENT" ? l(h, d, E) : m(y);
            });
          }, w), w < 100 && (w += 10);
          return;
        }
        m && m(y);
      });
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, l), f;
  }(e.rename)), e.read = typeof e.read != "function" ? e.read : function(l) {
    function f(h, d, m, p, w, E) {
      var y;
      if (E && typeof E == "function") {
        var _ = 0;
        y = function(S, C, j) {
          if (S && S.code === "EAGAIN" && _ < 10)
            return _++, l.call(e, h, d, m, p, w, y);
          E.apply(this, arguments);
        };
      }
      return l.call(e, h, d, m, p, w, y);
    }
    return Object.setPrototypeOf && Object.setPrototypeOf(f, l), f;
  }(e.read), e.readSync = typeof e.readSync != "function" ? e.readSync : /* @__PURE__ */ function(l) {
    return function(f, h, d, m, p) {
      for (var w = 0; ; )
        try {
          return l.call(e, f, h, d, m, p);
        } catch (E) {
          if (E.code === "EAGAIN" && w < 10) {
            w++;
            continue;
          }
          throw E;
        }
    };
  }(e.readSync);
  function t(l) {
    l.lchmod = function(f, h, d) {
      l.open(
        f,
        Hn.O_WRONLY | Hn.O_SYMLINK,
        h,
        function(m, p) {
          if (m) {
            d && d(m);
            return;
          }
          l.fchmod(p, h, function(w) {
            l.close(p, function(E) {
              d && d(w || E);
            });
          });
        }
      );
    }, l.lchmodSync = function(f, h) {
      var d = l.openSync(f, Hn.O_WRONLY | Hn.O_SYMLINK, h), m = !0, p;
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
    Hn.hasOwnProperty("O_SYMLINK") && l.futimes ? (l.lutimes = function(f, h, d, m) {
      l.open(f, Hn.O_SYMLINK, function(p, w) {
        if (p) {
          m && m(p);
          return;
        }
        l.futimes(w, h, d, function(E) {
          l.close(w, function(y) {
            m && m(E || y);
          });
        });
      });
    }, l.lutimesSync = function(f, h, d) {
      var m = l.openSync(f, Hn.O_SYMLINK), p, w = !0;
      try {
        p = l.futimesSync(m, h, d), w = !1;
      } finally {
        if (w)
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
      function m(p, w) {
        w && (w.uid < 0 && (w.uid += 4294967296), w.gid < 0 && (w.gid += 4294967296)), d && d.apply(this, arguments);
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
var Hd = Oo.Stream, n1 = r1;
function r1(e) {
  return {
    ReadStream: t,
    WriteStream: n
  };
  function t(r, i) {
    if (!(this instanceof t)) return new t(r, i);
    Hd.call(this);
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
    Hd.call(this), this.path = r, this.fd = null, this.writable = !0, this.flags = "w", this.encoding = "binary", this.mode = 438, this.bytesWritten = 0, i = i || {};
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
var i1 = s1, o1 = Object.getPrototypeOf || function(e) {
  return e.__proto__;
};
function s1(e) {
  if (e === null || typeof e != "object")
    return e;
  if (e instanceof Object)
    var t = { __proto__: o1(e) };
  else
    var t = /* @__PURE__ */ Object.create(null);
  return Object.getOwnPropertyNames(e).forEach(function(n) {
    Object.defineProperty(t, n, Object.getOwnPropertyDescriptor(e, n));
  }), t;
}
var qe = k, a1 = e1, c1 = n1, l1 = i1, Es = Tl, lt, Xs;
typeof Symbol == "function" && typeof Symbol.for == "function" ? (lt = Symbol.for("graceful-fs.queue"), Xs = Symbol.for("graceful-fs.previous")) : (lt = "___graceful-fs.queue", Xs = "___graceful-fs.previous");
function u1() {
}
function Bm(e, t) {
  Object.defineProperty(e, lt, {
    get: function() {
      return t;
    }
  });
}
var Lr = u1;
Es.debuglog ? Lr = Es.debuglog("gfs4") : /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && (Lr = function() {
  var e = Es.format.apply(Es, arguments);
  e = "GFS4: " + e.split(/\n/).join(`
GFS4: `), console.error(e);
});
if (!qe[lt]) {
  var f1 = bt[lt] || [];
  Bm(qe, f1), qe.close = function(e) {
    function t(n, r) {
      return e.call(qe, n, function(i) {
        i || qd(), typeof r == "function" && r.apply(this, arguments);
      });
    }
    return Object.defineProperty(t, Xs, {
      value: e
    }), t;
  }(qe.close), qe.closeSync = function(e) {
    function t(n) {
      e.apply(qe, arguments), qd();
    }
    return Object.defineProperty(t, Xs, {
      value: e
    }), t;
  }(qe.closeSync), /\bgfs4\b/i.test(process.env.NODE_DEBUG || "") && process.on("exit", function() {
    Lr(qe[lt]), Ep.equal(qe[lt].length, 0);
  });
}
bt[lt] || Bm(bt, qe[lt]);
var It = xu(l1(qe));
process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !qe.__patched && (It = xu(qe), qe.__patched = !0);
function xu(e) {
  a1(e), e.gracefulify = xu, e.createReadStream = C, e.createWriteStream = j;
  var t = e.readFile;
  e.readFile = n;
  function n(q, b, M) {
    return typeof b == "function" && (M = b, b = null), W(q, b, M);
    function W(X, L, U, K) {
      return t(X, L, function(z) {
        z && (z.code === "EMFILE" || z.code === "ENFILE") ? Zr([W, [X, L, U], z, K || Date.now(), Date.now()]) : typeof U == "function" && U.apply(this, arguments);
      });
    }
  }
  var r = e.writeFile;
  e.writeFile = i;
  function i(q, b, M, W) {
    return typeof M == "function" && (W = M, M = null), X(q, b, M, W);
    function X(L, U, K, z, Z) {
      return r(L, U, K, function(J) {
        J && (J.code === "EMFILE" || J.code === "ENFILE") ? Zr([X, [L, U, K, z], J, Z || Date.now(), Date.now()]) : typeof z == "function" && z.apply(this, arguments);
      });
    }
  }
  var o = e.appendFile;
  o && (e.appendFile = s);
  function s(q, b, M, W) {
    return typeof M == "function" && (W = M, M = null), X(q, b, M, W);
    function X(L, U, K, z, Z) {
      return o(L, U, K, function(J) {
        J && (J.code === "EMFILE" || J.code === "ENFILE") ? Zr([X, [L, U, K, z], J, Z || Date.now(), Date.now()]) : typeof z == "function" && z.apply(this, arguments);
      });
    }
  }
  var a = e.copyFile;
  a && (e.copyFile = c);
  function c(q, b, M, W) {
    return typeof M == "function" && (W = M, M = 0), X(q, b, M, W);
    function X(L, U, K, z, Z) {
      return a(L, U, K, function(J) {
        J && (J.code === "EMFILE" || J.code === "ENFILE") ? Zr([X, [L, U, K, z], J, Z || Date.now(), Date.now()]) : typeof z == "function" && z.apply(this, arguments);
      });
    }
  }
  var u = e.readdir;
  e.readdir = f;
  var l = /^v[0-5]\./;
  function f(q, b, M) {
    typeof b == "function" && (M = b, b = null);
    var W = l.test(process.version) ? function(U, K, z, Z) {
      return u(U, X(
        U,
        K,
        z,
        Z
      ));
    } : function(U, K, z, Z) {
      return u(U, K, X(
        U,
        K,
        z,
        Z
      ));
    };
    return W(q, b, M);
    function X(L, U, K, z) {
      return function(Z, J) {
        Z && (Z.code === "EMFILE" || Z.code === "ENFILE") ? Zr([
          W,
          [L, U, K],
          Z,
          z || Date.now(),
          Date.now()
        ]) : (J && J.sort && J.sort(), typeof K == "function" && K.call(this, Z, J));
      };
    }
  }
  if (process.version.substr(0, 4) === "v0.8") {
    var h = c1(e);
    E = h.ReadStream, _ = h.WriteStream;
  }
  var d = e.ReadStream;
  d && (E.prototype = Object.create(d.prototype), E.prototype.open = y);
  var m = e.WriteStream;
  m && (_.prototype = Object.create(m.prototype), _.prototype.open = S), Object.defineProperty(e, "ReadStream", {
    get: function() {
      return E;
    },
    set: function(q) {
      E = q;
    },
    enumerable: !0,
    configurable: !0
  }), Object.defineProperty(e, "WriteStream", {
    get: function() {
      return _;
    },
    set: function(q) {
      _ = q;
    },
    enumerable: !0,
    configurable: !0
  });
  var p = E;
  Object.defineProperty(e, "FileReadStream", {
    get: function() {
      return p;
    },
    set: function(q) {
      p = q;
    },
    enumerable: !0,
    configurable: !0
  });
  var w = _;
  Object.defineProperty(e, "FileWriteStream", {
    get: function() {
      return w;
    },
    set: function(q) {
      w = q;
    },
    enumerable: !0,
    configurable: !0
  });
  function E(q, b) {
    return this instanceof E ? (d.apply(this, arguments), this) : E.apply(Object.create(E.prototype), arguments);
  }
  function y() {
    var q = this;
    G(q.path, q.flags, q.mode, function(b, M) {
      b ? (q.autoClose && q.destroy(), q.emit("error", b)) : (q.fd = M, q.emit("open", M), q.read());
    });
  }
  function _(q, b) {
    return this instanceof _ ? (m.apply(this, arguments), this) : _.apply(Object.create(_.prototype), arguments);
  }
  function S() {
    var q = this;
    G(q.path, q.flags, q.mode, function(b, M) {
      b ? (q.destroy(), q.emit("error", b)) : (q.fd = M, q.emit("open", M));
    });
  }
  function C(q, b) {
    return new e.ReadStream(q, b);
  }
  function j(q, b) {
    return new e.WriteStream(q, b);
  }
  var V = e.open;
  e.open = G;
  function G(q, b, M, W) {
    return typeof M == "function" && (W = M, M = null), X(q, b, M, W);
    function X(L, U, K, z, Z) {
      return V(L, U, K, function(J, B) {
        J && (J.code === "EMFILE" || J.code === "ENFILE") ? Zr([X, [L, U, K, z], J, Z || Date.now(), Date.now()]) : typeof z == "function" && z.apply(this, arguments);
      });
    }
  }
  return e;
}
function Zr(e) {
  Lr("ENQUEUE", e[0].name, e[1]), qe[lt].push(e), ku();
}
var _s;
function qd() {
  for (var e = Date.now(), t = 0; t < qe[lt].length; ++t)
    qe[lt][t].length > 2 && (qe[lt][t][3] = e, qe[lt][t][4] = e);
  ku();
}
function ku() {
  if (clearTimeout(_s), _s = void 0, qe[lt].length !== 0) {
    var e = qe[lt].shift(), t = e[0], n = e[1], r = e[2], i = e[3], o = e[4];
    if (i === void 0)
      Lr("RETRY", t.name, n), t.apply(null, n);
    else if (Date.now() - i >= 6e4) {
      Lr("TIMEOUT", t.name, n);
      var s = n.pop();
      typeof s == "function" && s.call(null, r);
    } else {
      var a = Date.now() - o, c = Math.max(o - i, 1), u = Math.min(c * 1.2, 100);
      a >= u ? (Lr("RETRY", t.name, n), t.apply(null, n.concat([i]))) : qe[lt].push(e);
    }
    _s === void 0 && (_s = setTimeout(ku, 0));
  }
}
(function(e) {
  const t = Nt.fromCallback, n = It, r = [
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
})(qr);
var Uu = {}, Hm = {};
const d1 = x;
Hm.checkPath = function(t) {
  if (process.platform === "win32" && /[<>:"|?*]/.test(t.replace(d1.parse(t).root, ""))) {
    const r = new Error(`Path contains invalid characters: ${t}`);
    throw r.code = "EINVAL", r;
  }
};
const qm = qr, { checkPath: zm } = Hm, Vm = (e) => {
  const t = { mode: 511 };
  return typeof e == "number" ? e : { ...t, ...e }.mode;
};
Uu.makeDir = async (e, t) => (zm(e), qm.mkdir(e, {
  mode: Vm(t),
  recursive: !0
}));
Uu.makeDirSync = (e, t) => (zm(e), qm.mkdirSync(e, {
  mode: Vm(t),
  recursive: !0
}));
const h1 = Nt.fromPromise, { makeDir: p1, makeDirSync: Sc } = Uu, bc = h1(p1);
var gn = {
  mkdirs: bc,
  mkdirsSync: Sc,
  // alias
  mkdirp: bc,
  mkdirpSync: Sc,
  ensureDir: bc,
  ensureDirSync: Sc
};
const m1 = Nt.fromPromise, Gm = qr;
function g1(e) {
  return Gm.access(e).then(() => !0).catch(() => !1);
}
var zr = {
  pathExists: m1(g1),
  pathExistsSync: Gm.existsSync
};
const gi = It;
function y1(e, t, n, r) {
  gi.open(e, "r+", (i, o) => {
    if (i) return r(i);
    gi.futimes(o, t, n, (s) => {
      gi.close(o, (a) => {
        r && r(s || a);
      });
    });
  });
}
function v1(e, t, n) {
  const r = gi.openSync(e, "r+");
  return gi.futimesSync(r, t, n), gi.closeSync(r);
}
var Wm = {
  utimesMillis: y1,
  utimesMillisSync: v1
};
const wi = qr, rt = x, w1 = Tl;
function E1(e, t, n) {
  const r = n.dereference ? (i) => wi.stat(i, { bigint: !0 }) : (i) => wi.lstat(i, { bigint: !0 });
  return Promise.all([
    r(e),
    r(t).catch((i) => {
      if (i.code === "ENOENT") return null;
      throw i;
    })
  ]).then(([i, o]) => ({ srcStat: i, destStat: o }));
}
function _1(e, t, n) {
  let r;
  const i = n.dereference ? (s) => wi.statSync(s, { bigint: !0 }) : (s) => wi.lstatSync(s, { bigint: !0 }), o = i(e);
  try {
    r = i(t);
  } catch (s) {
    if (s.code === "ENOENT") return { srcStat: o, destStat: null };
    throw s;
  }
  return { srcStat: o, destStat: r };
}
function $1(e, t, n, r, i) {
  w1.callbackify(E1)(e, t, r, (o, s) => {
    if (o) return i(o);
    const { srcStat: a, destStat: c } = s;
    if (c) {
      if (Uo(a, c)) {
        const u = rt.basename(e), l = rt.basename(t);
        return n === "move" && u !== l && u.toLowerCase() === l.toLowerCase() ? i(null, { srcStat: a, destStat: c, isChangingCase: !0 }) : i(new Error("Source and destination must not be the same."));
      }
      if (a.isDirectory() && !c.isDirectory())
        return i(new Error(`Cannot overwrite non-directory '${t}' with directory '${e}'.`));
      if (!a.isDirectory() && c.isDirectory())
        return i(new Error(`Cannot overwrite directory '${t}' with non-directory '${e}'.`));
    }
    return a.isDirectory() && ju(e, t) ? i(new Error(Da(e, t, n))) : i(null, { srcStat: a, destStat: c });
  });
}
function S1(e, t, n, r) {
  const { srcStat: i, destStat: o } = _1(e, t, r);
  if (o) {
    if (Uo(i, o)) {
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
    throw new Error(Da(e, t, n));
  return { srcStat: i, destStat: o };
}
function Km(e, t, n, r, i) {
  const o = rt.resolve(rt.dirname(e)), s = rt.resolve(rt.dirname(n));
  if (s === o || s === rt.parse(s).root) return i();
  wi.stat(s, { bigint: !0 }, (a, c) => a ? a.code === "ENOENT" ? i() : i(a) : Uo(t, c) ? i(new Error(Da(e, n, r))) : Km(e, t, s, r, i));
}
function Jm(e, t, n, r) {
  const i = rt.resolve(rt.dirname(e)), o = rt.resolve(rt.dirname(n));
  if (o === i || o === rt.parse(o).root) return;
  let s;
  try {
    s = wi.statSync(o, { bigint: !0 });
  } catch (a) {
    if (a.code === "ENOENT") return;
    throw a;
  }
  if (Uo(t, s))
    throw new Error(Da(e, n, r));
  return Jm(e, t, o, r);
}
function Uo(e, t) {
  return t.ino && t.dev && t.ino === e.ino && t.dev === e.dev;
}
function ju(e, t) {
  const n = rt.resolve(e).split(rt.sep).filter((i) => i), r = rt.resolve(t).split(rt.sep).filter((i) => i);
  return n.reduce((i, o, s) => i && r[s] === o, !0);
}
function Da(e, t, n) {
  return `Cannot ${n} '${e}' to a subdirectory of itself, '${t}'.`;
}
var Oi = {
  checkPaths: $1,
  checkPathsSync: S1,
  checkParentPaths: Km,
  checkParentPathsSync: Jm,
  isSrcSubdir: ju,
  areIdentical: Uo
};
const xt = It, mo = x, b1 = gn.mkdirs, A1 = zr.pathExists, T1 = Wm.utimesMillis, go = Oi;
function C1(e, t, n, r) {
  typeof n == "function" && !r ? (r = n, n = {}) : typeof n == "function" && (n = { filter: n }), r = r || function() {
  }, n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0001"
  ), go.checkPaths(e, t, "copy", n, (i, o) => {
    if (i) return r(i);
    const { srcStat: s, destStat: a } = o;
    go.checkParentPaths(e, s, t, "copy", (c) => c ? r(c) : n.filter ? Ym(zd, a, e, t, n, r) : zd(a, e, t, n, r));
  });
}
function zd(e, t, n, r, i) {
  const o = mo.dirname(n);
  A1(o, (s, a) => {
    if (s) return i(s);
    if (a) return Zs(e, t, n, r, i);
    b1(o, (c) => c ? i(c) : Zs(e, t, n, r, i));
  });
}
function Ym(e, t, n, r, i, o) {
  Promise.resolve(i.filter(n, r)).then((s) => s ? e(t, n, r, i, o) : o(), (s) => o(s));
}
function N1(e, t, n, r, i) {
  return r.filter ? Ym(Zs, e, t, n, r, i) : Zs(e, t, n, r, i);
}
function Zs(e, t, n, r, i) {
  (r.dereference ? xt.stat : xt.lstat)(t, (s, a) => s ? i(s) : a.isDirectory() ? L1(a, e, t, n, r, i) : a.isFile() || a.isCharacterDevice() || a.isBlockDevice() ? I1(a, e, t, n, r, i) : a.isSymbolicLink() ? U1(e, t, n, r, i) : a.isSocket() ? i(new Error(`Cannot copy a socket file: ${t}`)) : a.isFIFO() ? i(new Error(`Cannot copy a FIFO pipe: ${t}`)) : i(new Error(`Unknown file: ${t}`)));
}
function I1(e, t, n, r, i, o) {
  return t ? P1(e, n, r, i, o) : Xm(e, n, r, i, o);
}
function P1(e, t, n, r, i) {
  if (r.overwrite)
    xt.unlink(n, (o) => o ? i(o) : Xm(e, t, n, r, i));
  else return r.errorOnExist ? i(new Error(`'${n}' already exists`)) : i();
}
function Xm(e, t, n, r, i) {
  xt.copyFile(t, n, (o) => o ? i(o) : r.preserveTimestamps ? O1(e.mode, t, n, i) : Fa(n, e.mode, i));
}
function O1(e, t, n, r) {
  return R1(e) ? D1(n, e, (i) => i ? r(i) : Vd(e, t, n, r)) : Vd(e, t, n, r);
}
function R1(e) {
  return (e & 128) === 0;
}
function D1(e, t, n) {
  return Fa(e, t | 128, n);
}
function Vd(e, t, n, r) {
  F1(t, n, (i) => i ? r(i) : Fa(n, e, r));
}
function Fa(e, t, n) {
  return xt.chmod(e, t, n);
}
function F1(e, t, n) {
  xt.stat(e, (r, i) => r ? n(r) : T1(t, i.atime, i.mtime, n));
}
function L1(e, t, n, r, i, o) {
  return t ? Zm(n, r, i, o) : x1(e.mode, n, r, i, o);
}
function x1(e, t, n, r, i) {
  xt.mkdir(n, (o) => {
    if (o) return i(o);
    Zm(t, n, r, (s) => s ? i(s) : Fa(n, e, i));
  });
}
function Zm(e, t, n, r) {
  xt.readdir(e, (i, o) => i ? r(i) : Qm(o, e, t, n, r));
}
function Qm(e, t, n, r, i) {
  const o = e.pop();
  return o ? k1(e, o, t, n, r, i) : i();
}
function k1(e, t, n, r, i, o) {
  const s = mo.join(n, t), a = mo.join(r, t);
  go.checkPaths(s, a, "copy", i, (c, u) => {
    if (c) return o(c);
    const { destStat: l } = u;
    N1(l, s, a, i, (f) => f ? o(f) : Qm(e, n, r, i, o));
  });
}
function U1(e, t, n, r, i) {
  xt.readlink(t, (o, s) => {
    if (o) return i(o);
    if (r.dereference && (s = mo.resolve(process.cwd(), s)), e)
      xt.readlink(n, (a, c) => a ? a.code === "EINVAL" || a.code === "UNKNOWN" ? xt.symlink(s, n, i) : i(a) : (r.dereference && (c = mo.resolve(process.cwd(), c)), go.isSrcSubdir(s, c) ? i(new Error(`Cannot copy '${s}' to a subdirectory of itself, '${c}'.`)) : e.isDirectory() && go.isSrcSubdir(c, s) ? i(new Error(`Cannot overwrite '${c}' with '${s}'.`)) : j1(s, n, i)));
    else
      return xt.symlink(s, n, i);
  });
}
function j1(e, t, n) {
  xt.unlink(t, (r) => r ? n(r) : xt.symlink(e, t, n));
}
var M1 = C1;
const gt = It, yo = x, B1 = gn.mkdirsSync, H1 = Wm.utimesMillisSync, vo = Oi;
function q1(e, t, n) {
  typeof n == "function" && (n = { filter: n }), n = n || {}, n.clobber = "clobber" in n ? !!n.clobber : !0, n.overwrite = "overwrite" in n ? !!n.overwrite : n.clobber, n.preserveTimestamps && process.arch === "ia32" && process.emitWarning(
    `Using the preserveTimestamps option in 32-bit node is not recommended;

	see https://github.com/jprichardson/node-fs-extra/issues/269`,
    "Warning",
    "fs-extra-WARN0002"
  );
  const { srcStat: r, destStat: i } = vo.checkPathsSync(e, t, "copy", n);
  return vo.checkParentPathsSync(e, r, t, "copy"), z1(i, e, t, n);
}
function z1(e, t, n, r) {
  if (r.filter && !r.filter(t, n)) return;
  const i = yo.dirname(n);
  return gt.existsSync(i) || B1(i), eg(e, t, n, r);
}
function V1(e, t, n, r) {
  if (!(r.filter && !r.filter(t, n)))
    return eg(e, t, n, r);
}
function eg(e, t, n, r) {
  const o = (r.dereference ? gt.statSync : gt.lstatSync)(t);
  if (o.isDirectory()) return Z1(o, e, t, n, r);
  if (o.isFile() || o.isCharacterDevice() || o.isBlockDevice()) return G1(o, e, t, n, r);
  if (o.isSymbolicLink()) return tI(e, t, n, r);
  throw o.isSocket() ? new Error(`Cannot copy a socket file: ${t}`) : o.isFIFO() ? new Error(`Cannot copy a FIFO pipe: ${t}`) : new Error(`Unknown file: ${t}`);
}
function G1(e, t, n, r, i) {
  return t ? W1(e, n, r, i) : tg(e, n, r, i);
}
function W1(e, t, n, r) {
  if (r.overwrite)
    return gt.unlinkSync(n), tg(e, t, n, r);
  if (r.errorOnExist)
    throw new Error(`'${n}' already exists`);
}
function tg(e, t, n, r) {
  return gt.copyFileSync(t, n), r.preserveTimestamps && K1(e.mode, t, n), Mu(n, e.mode);
}
function K1(e, t, n) {
  return J1(e) && Y1(n, e), X1(t, n);
}
function J1(e) {
  return (e & 128) === 0;
}
function Y1(e, t) {
  return Mu(e, t | 128);
}
function Mu(e, t) {
  return gt.chmodSync(e, t);
}
function X1(e, t) {
  const n = gt.statSync(e);
  return H1(t, n.atime, n.mtime);
}
function Z1(e, t, n, r, i) {
  return t ? ng(n, r, i) : Q1(e.mode, n, r, i);
}
function Q1(e, t, n, r) {
  return gt.mkdirSync(n), ng(t, n, r), Mu(n, e);
}
function ng(e, t, n) {
  gt.readdirSync(e).forEach((r) => eI(r, e, t, n));
}
function eI(e, t, n, r) {
  const i = yo.join(t, e), o = yo.join(n, e), { destStat: s } = vo.checkPathsSync(i, o, "copy", r);
  return V1(s, i, o, r);
}
function tI(e, t, n, r) {
  let i = gt.readlinkSync(t);
  if (r.dereference && (i = yo.resolve(process.cwd(), i)), e) {
    let o;
    try {
      o = gt.readlinkSync(n);
    } catch (s) {
      if (s.code === "EINVAL" || s.code === "UNKNOWN") return gt.symlinkSync(i, n);
      throw s;
    }
    if (r.dereference && (o = yo.resolve(process.cwd(), o)), vo.isSrcSubdir(i, o))
      throw new Error(`Cannot copy '${i}' to a subdirectory of itself, '${o}'.`);
    if (gt.statSync(n).isDirectory() && vo.isSrcSubdir(o, i))
      throw new Error(`Cannot overwrite '${o}' with '${i}'.`);
    return nI(i, n);
  } else
    return gt.symlinkSync(i, n);
}
function nI(e, t) {
  return gt.unlinkSync(t), gt.symlinkSync(e, t);
}
var rI = q1;
const iI = Nt.fromCallback;
var Bu = {
  copy: iI(M1),
  copySync: rI
};
const Gd = It, rg = x, Fe = Ep, wo = process.platform === "win32";
function ig(e) {
  [
    "unlink",
    "chmod",
    "stat",
    "lstat",
    "rmdir",
    "readdir"
  ].forEach((n) => {
    e[n] = e[n] || Gd[n], n = n + "Sync", e[n] = e[n] || Gd[n];
  }), e.maxBusyTries = e.maxBusyTries || 3;
}
function Hu(e, t, n) {
  let r = 0;
  typeof t == "function" && (n = t, t = {}), Fe(e, "rimraf: missing path"), Fe.strictEqual(typeof e, "string", "rimraf: path should be a string"), Fe.strictEqual(typeof n, "function", "rimraf: callback function required"), Fe(t, "rimraf: invalid options argument provided"), Fe.strictEqual(typeof t, "object", "rimraf: options should be object"), ig(t), Wd(e, t, function i(o) {
    if (o) {
      if ((o.code === "EBUSY" || o.code === "ENOTEMPTY" || o.code === "EPERM") && r < t.maxBusyTries) {
        r++;
        const s = r * 100;
        return setTimeout(() => Wd(e, t, i), s);
      }
      o.code === "ENOENT" && (o = null);
    }
    n(o);
  });
}
function Wd(e, t, n) {
  Fe(e), Fe(t), Fe(typeof n == "function"), t.lstat(e, (r, i) => {
    if (r && r.code === "ENOENT")
      return n(null);
    if (r && r.code === "EPERM" && wo)
      return Kd(e, t, r, n);
    if (i && i.isDirectory())
      return Bs(e, t, r, n);
    t.unlink(e, (o) => {
      if (o) {
        if (o.code === "ENOENT")
          return n(null);
        if (o.code === "EPERM")
          return wo ? Kd(e, t, o, n) : Bs(e, t, o, n);
        if (o.code === "EISDIR")
          return Bs(e, t, o, n);
      }
      return n(o);
    });
  });
}
function Kd(e, t, n, r) {
  Fe(e), Fe(t), Fe(typeof r == "function"), t.chmod(e, 438, (i) => {
    i ? r(i.code === "ENOENT" ? null : n) : t.stat(e, (o, s) => {
      o ? r(o.code === "ENOENT" ? null : n) : s.isDirectory() ? Bs(e, t, n, r) : t.unlink(e, r);
    });
  });
}
function Jd(e, t, n) {
  let r;
  Fe(e), Fe(t);
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
  r.isDirectory() ? Hs(e, t, n) : t.unlinkSync(e);
}
function Bs(e, t, n, r) {
  Fe(e), Fe(t), Fe(typeof r == "function"), t.rmdir(e, (i) => {
    i && (i.code === "ENOTEMPTY" || i.code === "EEXIST" || i.code === "EPERM") ? oI(e, t, r) : i && i.code === "ENOTDIR" ? r(n) : r(i);
  });
}
function oI(e, t, n) {
  Fe(e), Fe(t), Fe(typeof n == "function"), t.readdir(e, (r, i) => {
    if (r) return n(r);
    let o = i.length, s;
    if (o === 0) return t.rmdir(e, n);
    i.forEach((a) => {
      Hu(rg.join(e, a), t, (c) => {
        if (!s) {
          if (c) return n(s = c);
          --o === 0 && t.rmdir(e, n);
        }
      });
    });
  });
}
function og(e, t) {
  let n;
  t = t || {}, ig(t), Fe(e, "rimraf: missing path"), Fe.strictEqual(typeof e, "string", "rimraf: path should be a string"), Fe(t, "rimraf: missing options"), Fe.strictEqual(typeof t, "object", "rimraf: options should be object");
  try {
    n = t.lstatSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    r.code === "EPERM" && wo && Jd(e, t, r);
  }
  try {
    n && n.isDirectory() ? Hs(e, t, null) : t.unlinkSync(e);
  } catch (r) {
    if (r.code === "ENOENT")
      return;
    if (r.code === "EPERM")
      return wo ? Jd(e, t, r) : Hs(e, t, r);
    if (r.code !== "EISDIR")
      throw r;
    Hs(e, t, r);
  }
}
function Hs(e, t, n) {
  Fe(e), Fe(t);
  try {
    t.rmdirSync(e);
  } catch (r) {
    if (r.code === "ENOTDIR")
      throw n;
    if (r.code === "ENOTEMPTY" || r.code === "EEXIST" || r.code === "EPERM")
      sI(e, t);
    else if (r.code !== "ENOENT")
      throw r;
  }
}
function sI(e, t) {
  if (Fe(e), Fe(t), t.readdirSync(e).forEach((n) => og(rg.join(e, n), t)), wo) {
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
var aI = Hu;
Hu.sync = og;
const Qs = It, cI = Nt.fromCallback, sg = aI;
function lI(e, t) {
  if (Qs.rm) return Qs.rm(e, { recursive: !0, force: !0 }, t);
  sg(e, t);
}
function uI(e) {
  if (Qs.rmSync) return Qs.rmSync(e, { recursive: !0, force: !0 });
  sg.sync(e);
}
var La = {
  remove: cI(lI),
  removeSync: uI
};
const fI = Nt.fromPromise, ag = qr, cg = x, lg = gn, ug = La, Yd = fI(async function(t) {
  let n;
  try {
    n = await ag.readdir(t);
  } catch {
    return lg.mkdirs(t);
  }
  return Promise.all(n.map((r) => ug.remove(cg.join(t, r))));
});
function Xd(e) {
  let t;
  try {
    t = ag.readdirSync(e);
  } catch {
    return lg.mkdirsSync(e);
  }
  t.forEach((n) => {
    n = cg.join(e, n), ug.removeSync(n);
  });
}
var dI = {
  emptyDirSync: Xd,
  emptydirSync: Xd,
  emptyDir: Yd,
  emptydir: Yd
};
const hI = Nt.fromCallback, fg = x, Qn = It, dg = gn;
function pI(e, t) {
  function n() {
    Qn.writeFile(e, "", (r) => {
      if (r) return t(r);
      t();
    });
  }
  Qn.stat(e, (r, i) => {
    if (!r && i.isFile()) return t();
    const o = fg.dirname(e);
    Qn.stat(o, (s, a) => {
      if (s)
        return s.code === "ENOENT" ? dg.mkdirs(o, (c) => {
          if (c) return t(c);
          n();
        }) : t(s);
      a.isDirectory() ? n() : Qn.readdir(o, (c) => {
        if (c) return t(c);
      });
    });
  });
}
function mI(e) {
  let t;
  try {
    t = Qn.statSync(e);
  } catch {
  }
  if (t && t.isFile()) return;
  const n = fg.dirname(e);
  try {
    Qn.statSync(n).isDirectory() || Qn.readdirSync(n);
  } catch (r) {
    if (r && r.code === "ENOENT") dg.mkdirsSync(n);
    else throw r;
  }
  Qn.writeFileSync(e, "");
}
var gI = {
  createFile: hI(pI),
  createFileSync: mI
};
const yI = Nt.fromCallback, hg = x, Jn = It, pg = gn, vI = zr.pathExists, { areIdentical: mg } = Oi;
function wI(e, t, n) {
  function r(i, o) {
    Jn.link(i, o, (s) => {
      if (s) return n(s);
      n(null);
    });
  }
  Jn.lstat(t, (i, o) => {
    Jn.lstat(e, (s, a) => {
      if (s)
        return s.message = s.message.replace("lstat", "ensureLink"), n(s);
      if (o && mg(a, o)) return n(null);
      const c = hg.dirname(t);
      vI(c, (u, l) => {
        if (u) return n(u);
        if (l) return r(e, t);
        pg.mkdirs(c, (f) => {
          if (f) return n(f);
          r(e, t);
        });
      });
    });
  });
}
function EI(e, t) {
  let n;
  try {
    n = Jn.lstatSync(t);
  } catch {
  }
  try {
    const o = Jn.lstatSync(e);
    if (n && mg(o, n)) return;
  } catch (o) {
    throw o.message = o.message.replace("lstat", "ensureLink"), o;
  }
  const r = hg.dirname(t);
  return Jn.existsSync(r) || pg.mkdirsSync(r), Jn.linkSync(e, t);
}
var _I = {
  createLink: yI(wI),
  createLinkSync: EI
};
const er = x, ao = It, $I = zr.pathExists;
function SI(e, t, n) {
  if (er.isAbsolute(e))
    return ao.lstat(e, (r) => r ? (r.message = r.message.replace("lstat", "ensureSymlink"), n(r)) : n(null, {
      toCwd: e,
      toDst: e
    }));
  {
    const r = er.dirname(t), i = er.join(r, e);
    return $I(i, (o, s) => o ? n(o) : s ? n(null, {
      toCwd: i,
      toDst: e
    }) : ao.lstat(e, (a) => a ? (a.message = a.message.replace("lstat", "ensureSymlink"), n(a)) : n(null, {
      toCwd: e,
      toDst: er.relative(r, e)
    })));
  }
}
function bI(e, t) {
  let n;
  if (er.isAbsolute(e)) {
    if (n = ao.existsSync(e), !n) throw new Error("absolute srcpath does not exist");
    return {
      toCwd: e,
      toDst: e
    };
  } else {
    const r = er.dirname(t), i = er.join(r, e);
    if (n = ao.existsSync(i), n)
      return {
        toCwd: i,
        toDst: e
      };
    if (n = ao.existsSync(e), !n) throw new Error("relative srcpath does not exist");
    return {
      toCwd: e,
      toDst: er.relative(r, e)
    };
  }
}
var AI = {
  symlinkPaths: SI,
  symlinkPathsSync: bI
};
const gg = It;
function TI(e, t, n) {
  if (n = typeof t == "function" ? t : n, t = typeof t == "function" ? !1 : t, t) return n(null, t);
  gg.lstat(e, (r, i) => {
    if (r) return n(null, "file");
    t = i && i.isDirectory() ? "dir" : "file", n(null, t);
  });
}
function CI(e, t) {
  let n;
  if (t) return t;
  try {
    n = gg.lstatSync(e);
  } catch {
    return "file";
  }
  return n && n.isDirectory() ? "dir" : "file";
}
var NI = {
  symlinkType: TI,
  symlinkTypeSync: CI
};
const II = Nt.fromCallback, yg = x, tn = qr, vg = gn, PI = vg.mkdirs, OI = vg.mkdirsSync, wg = AI, RI = wg.symlinkPaths, DI = wg.symlinkPathsSync, Eg = NI, FI = Eg.symlinkType, LI = Eg.symlinkTypeSync, xI = zr.pathExists, { areIdentical: _g } = Oi;
function kI(e, t, n, r) {
  r = typeof n == "function" ? n : r, n = typeof n == "function" ? !1 : n, tn.lstat(t, (i, o) => {
    !i && o.isSymbolicLink() ? Promise.all([
      tn.stat(e),
      tn.stat(t)
    ]).then(([s, a]) => {
      if (_g(s, a)) return r(null);
      Zd(e, t, n, r);
    }) : Zd(e, t, n, r);
  });
}
function Zd(e, t, n, r) {
  RI(e, t, (i, o) => {
    if (i) return r(i);
    e = o.toDst, FI(o.toCwd, n, (s, a) => {
      if (s) return r(s);
      const c = yg.dirname(t);
      xI(c, (u, l) => {
        if (u) return r(u);
        if (l) return tn.symlink(e, t, a, r);
        PI(c, (f) => {
          if (f) return r(f);
          tn.symlink(e, t, a, r);
        });
      });
    });
  });
}
function UI(e, t, n) {
  let r;
  try {
    r = tn.lstatSync(t);
  } catch {
  }
  if (r && r.isSymbolicLink()) {
    const a = tn.statSync(e), c = tn.statSync(t);
    if (_g(a, c)) return;
  }
  const i = DI(e, t);
  e = i.toDst, n = LI(i.toCwd, n);
  const o = yg.dirname(t);
  return tn.existsSync(o) || OI(o), tn.symlinkSync(e, t, n);
}
var jI = {
  createSymlink: II(kI),
  createSymlinkSync: UI
};
const { createFile: Qd, createFileSync: eh } = gI, { createLink: th, createLinkSync: nh } = _I, { createSymlink: rh, createSymlinkSync: ih } = jI;
var MI = {
  // file
  createFile: Qd,
  createFileSync: eh,
  ensureFile: Qd,
  ensureFileSync: eh,
  // link
  createLink: th,
  createLinkSync: nh,
  ensureLink: th,
  ensureLinkSync: nh,
  // symlink
  createSymlink: rh,
  createSymlinkSync: ih,
  ensureSymlink: rh,
  ensureSymlinkSync: ih
};
function BI(e, { EOL: t = `
`, finalEOL: n = !0, replacer: r = null, spaces: i } = {}) {
  const o = n ? t : "", s = JSON.stringify(e, r, i);
  if (s === void 0)
    throw new TypeError(`Converting ${typeof e} value to JSON is not supported`);
  return s.replace(/\n/g, t) + o;
}
function HI(e) {
  return Buffer.isBuffer(e) && (e = e.toString("utf8")), e.replace(/^\uFEFF/, "");
}
var qu = { stringify: BI, stripBom: HI };
let Ei;
try {
  Ei = It;
} catch {
  Ei = k;
}
const xa = Nt, { stringify: $g, stripBom: Sg } = qu;
async function qI(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || Ei, r = "throws" in t ? t.throws : !0;
  let i = await xa.fromCallback(n.readFile)(e, t);
  i = Sg(i);
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
const zI = xa.fromPromise(qI);
function VI(e, t = {}) {
  typeof t == "string" && (t = { encoding: t });
  const n = t.fs || Ei, r = "throws" in t ? t.throws : !0;
  try {
    let i = n.readFileSync(e, t);
    return i = Sg(i), JSON.parse(i, t.reviver);
  } catch (i) {
    if (r)
      throw i.message = `${e}: ${i.message}`, i;
    return null;
  }
}
async function GI(e, t, n = {}) {
  const r = n.fs || Ei, i = $g(t, n);
  await xa.fromCallback(r.writeFile)(e, i, n);
}
const WI = xa.fromPromise(GI);
function KI(e, t, n = {}) {
  const r = n.fs || Ei, i = $g(t, n);
  return r.writeFileSync(e, i, n);
}
var JI = {
  readFile: zI,
  readFileSync: VI,
  writeFile: WI,
  writeFileSync: KI
};
const $s = JI;
var YI = {
  // jsonfile exports
  readJson: $s.readFile,
  readJsonSync: $s.readFileSync,
  writeJson: $s.writeFile,
  writeJsonSync: $s.writeFileSync
};
const XI = Nt.fromCallback, co = It, bg = x, Ag = gn, ZI = zr.pathExists;
function QI(e, t, n, r) {
  typeof n == "function" && (r = n, n = "utf8");
  const i = bg.dirname(e);
  ZI(i, (o, s) => {
    if (o) return r(o);
    if (s) return co.writeFile(e, t, n, r);
    Ag.mkdirs(i, (a) => {
      if (a) return r(a);
      co.writeFile(e, t, n, r);
    });
  });
}
function eP(e, ...t) {
  const n = bg.dirname(e);
  if (co.existsSync(n))
    return co.writeFileSync(e, ...t);
  Ag.mkdirsSync(n), co.writeFileSync(e, ...t);
}
var zu = {
  outputFile: XI(QI),
  outputFileSync: eP
};
const { stringify: tP } = qu, { outputFile: nP } = zu;
async function rP(e, t, n = {}) {
  const r = tP(t, n);
  await nP(e, r, n);
}
var iP = rP;
const { stringify: oP } = qu, { outputFileSync: sP } = zu;
function aP(e, t, n) {
  const r = oP(t, n);
  sP(e, r, n);
}
var cP = aP;
const lP = Nt.fromPromise, Tt = YI;
Tt.outputJson = lP(iP);
Tt.outputJsonSync = cP;
Tt.outputJSON = Tt.outputJson;
Tt.outputJSONSync = Tt.outputJsonSync;
Tt.writeJSON = Tt.writeJson;
Tt.writeJSONSync = Tt.writeJsonSync;
Tt.readJSON = Tt.readJson;
Tt.readJSONSync = Tt.readJsonSync;
var uP = Tt;
const fP = It, ul = x, dP = Bu.copy, Tg = La.remove, hP = gn.mkdirp, pP = zr.pathExists, oh = Oi;
function mP(e, t, n, r) {
  typeof n == "function" && (r = n, n = {}), n = n || {};
  const i = n.overwrite || n.clobber || !1;
  oh.checkPaths(e, t, "move", n, (o, s) => {
    if (o) return r(o);
    const { srcStat: a, isChangingCase: c = !1 } = s;
    oh.checkParentPaths(e, a, t, "move", (u) => {
      if (u) return r(u);
      if (gP(t)) return sh(e, t, i, c, r);
      hP(ul.dirname(t), (l) => l ? r(l) : sh(e, t, i, c, r));
    });
  });
}
function gP(e) {
  const t = ul.dirname(e);
  return ul.parse(t).root === t;
}
function sh(e, t, n, r, i) {
  if (r) return Ac(e, t, n, i);
  if (n)
    return Tg(t, (o) => o ? i(o) : Ac(e, t, n, i));
  pP(t, (o, s) => o ? i(o) : s ? i(new Error("dest already exists.")) : Ac(e, t, n, i));
}
function Ac(e, t, n, r) {
  fP.rename(e, t, (i) => i ? i.code !== "EXDEV" ? r(i) : yP(e, t, n, r) : r());
}
function yP(e, t, n, r) {
  dP(e, t, {
    overwrite: n,
    errorOnExist: !0
  }, (o) => o ? r(o) : Tg(e, r));
}
var vP = mP;
const Cg = It, fl = x, wP = Bu.copySync, Ng = La.removeSync, EP = gn.mkdirpSync, ah = Oi;
function _P(e, t, n) {
  n = n || {};
  const r = n.overwrite || n.clobber || !1, { srcStat: i, isChangingCase: o = !1 } = ah.checkPathsSync(e, t, "move", n);
  return ah.checkParentPathsSync(e, i, t, "move"), $P(t) || EP(fl.dirname(t)), SP(e, t, r, o);
}
function $P(e) {
  const t = fl.dirname(e);
  return fl.parse(t).root === t;
}
function SP(e, t, n, r) {
  if (r) return Tc(e, t, n);
  if (n)
    return Ng(t), Tc(e, t, n);
  if (Cg.existsSync(t)) throw new Error("dest already exists.");
  return Tc(e, t, n);
}
function Tc(e, t, n) {
  try {
    Cg.renameSync(e, t);
  } catch (r) {
    if (r.code !== "EXDEV") throw r;
    return bP(e, t, n);
  }
}
function bP(e, t, n) {
  return wP(e, t, {
    overwrite: n,
    errorOnExist: !0
  }), Ng(e);
}
var AP = _P;
const TP = Nt.fromCallback;
var CP = {
  move: TP(vP),
  moveSync: AP
}, cr = {
  // Export promiseified graceful-fs:
  ...qr,
  // Export extra methods:
  ...Bu,
  ...dI,
  ...MI,
  ...uP,
  ...gn,
  ...CP,
  ...zu,
  ...zr,
  ...La
}, Vr = {}, nr = {}, et = {}, rr = {};
Object.defineProperty(rr, "__esModule", { value: !0 });
rr.CancellationError = rr.CancellationToken = void 0;
const NP = _p;
class IP extends NP.EventEmitter {
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
      return Promise.reject(new dl());
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
          o(new dl());
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
rr.CancellationToken = IP;
class dl extends Error {
  constructor() {
    super("cancelled");
  }
}
rr.CancellationError = dl;
var Ri = {};
Object.defineProperty(Ri, "__esModule", { value: !0 });
Ri.newError = PP;
function PP(e, t) {
  const n = new Error(e);
  return n.code = t, n;
}
var At = {}, hl = { exports: {} }, Ss = { exports: {} }, Cc, ch;
function OP() {
  if (ch) return Cc;
  ch = 1;
  var e = 1e3, t = e * 60, n = t * 60, r = n * 24, i = r * 7, o = r * 365.25;
  Cc = function(l, f) {
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
  return Cc;
}
var Nc, lh;
function Ig() {
  if (lh) return Nc;
  lh = 1;
  function e(t) {
    r.debug = r, r.default = r, r.coerce = u, r.disable = a, r.enable = o, r.enabled = c, r.humanize = OP(), r.destroy = l, Object.keys(t).forEach((f) => {
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
      function w(...E) {
        if (!w.enabled)
          return;
        const y = w, _ = Number(/* @__PURE__ */ new Date()), S = _ - (h || _);
        y.diff = S, y.prev = h, y.curr = _, h = _, E[0] = r.coerce(E[0]), typeof E[0] != "string" && E.unshift("%O");
        let C = 0;
        E[0] = E[0].replace(/%([a-zA-Z%])/g, (V, G) => {
          if (V === "%%")
            return "%";
          C++;
          const q = r.formatters[G];
          if (typeof q == "function") {
            const b = E[C];
            V = q.call(y, b), E.splice(C, 1), C--;
          }
          return V;
        }), r.formatArgs.call(y, E), (y.log || r.log).apply(y, E);
      }
      return w.namespace = f, w.useColors = r.useColors(), w.color = r.selectColor(f), w.extend = i, w.destroy = r.destroy, Object.defineProperty(w, "enabled", {
        enumerable: !0,
        configurable: !1,
        get: () => d !== null ? d : (m !== r.namespaces && (m = r.namespaces, p = r.enabled(f)), p),
        set: (E) => {
          d = E;
        }
      }), typeof r.init == "function" && r.init(w), w;
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
      let d = 0, m = 0, p = -1, w = 0;
      for (; d < f.length; )
        if (m < h.length && (h[m] === f[d] || h[m] === "*"))
          h[m] === "*" ? (p = m, w = d, m++) : (d++, m++);
        else if (p !== -1)
          m = p + 1, w++, d = w;
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
  return Nc = e, Nc;
}
var uh;
function RP() {
  return uh || (uh = 1, function(e, t) {
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
    e.exports = Ig()(t);
    const { formatters: a } = e.exports;
    a.j = function(c) {
      try {
        return JSON.stringify(c);
      } catch (u) {
        return "[UnexpectedJSONParseError]: " + u.message;
      }
    };
  }(Ss, Ss.exports)), Ss.exports;
}
var bs = { exports: {} }, Ic, fh;
function DP() {
  return fh || (fh = 1, Ic = (e, t = process.argv) => {
    const n = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", r = t.indexOf(n + e), i = t.indexOf("--");
    return r !== -1 && (i === -1 || r < i);
  }), Ic;
}
var Pc, dh;
function FP() {
  if (dh) return Pc;
  dh = 1;
  const e = ua, t = $p, n = DP(), { env: r } = process;
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
  return Pc = {
    supportsColor: a,
    stdout: o(s(!0, t.isatty(1))),
    stderr: o(s(!0, t.isatty(2)))
  }, Pc;
}
var hh;
function LP() {
  return hh || (hh = 1, function(e, t) {
    const n = $p, r = Tl;
    t.init = l, t.log = a, t.formatArgs = o, t.save = c, t.load = u, t.useColors = i, t.destroy = r.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    ), t.colors = [6, 2, 3, 4, 5, 1];
    try {
      const h = FP();
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
      const m = d.substring(6).toLowerCase().replace(/_([a-z])/g, (w, E) => E.toUpperCase());
      let p = process.env[d];
      return /^(yes|on|true|enabled)$/i.test(p) ? p = !0 : /^(no|off|false|disabled)$/i.test(p) ? p = !1 : p === "null" ? p = null : p = Number(p), h[m] = p, h;
    }, {});
    function i() {
      return "colors" in t.inspectOpts ? !!t.inspectOpts.colors : n.isatty(process.stderr.fd);
    }
    function o(h) {
      const { namespace: d, useColors: m } = this;
      if (m) {
        const p = this.color, w = "\x1B[3" + (p < 8 ? p : "8;5;" + p), E = `  ${w};1m${d} \x1B[0m`;
        h[0] = E + h[0].split(`
`).join(`
` + E), h.push(w + "m+" + e.exports.humanize(this.diff) + "\x1B[0m");
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
    e.exports = Ig()(t);
    const { formatters: f } = e.exports;
    f.o = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts).split(`
`).map((d) => d.trim()).join(" ");
    }, f.O = function(h) {
      return this.inspectOpts.colors = this.useColors, r.inspect(h, this.inspectOpts);
    };
  }(bs, bs.exports)), bs.exports;
}
typeof process > "u" || process.type === "renderer" || process.browser === !0 || process.__nwjs ? hl.exports = RP() : hl.exports = LP();
var xP = hl.exports, jo = {};
Object.defineProperty(jo, "__esModule", { value: !0 });
jo.ProgressCallbackTransform = void 0;
const kP = Oo;
class UP extends kP.Transform {
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
jo.ProgressCallbackTransform = UP;
Object.defineProperty(At, "__esModule", { value: !0 });
At.DigestTransform = At.HttpExecutor = At.HttpError = void 0;
At.createHttpError = ml;
At.parseJson = GP;
At.configureRequestOptionsFromUrl = Og;
At.configureRequestUrl = Gu;
At.safeGetHeader = yi;
At.configureRequestOptions = ea;
At.safeStringifyJson = ta;
const jP = Si, MP = xP, BP = k, HP = Oo, pl = ar, qP = rr, ph = Ri, zP = jo, Er = (0, MP.default)("electron-builder");
function ml(e, t = null) {
  return new Vu(e.statusCode || -1, `${e.statusCode} ${e.statusMessage}` + (t == null ? "" : `
` + JSON.stringify(t, null, "  ")) + `
Headers: ` + ta(e.headers), t);
}
const VP = /* @__PURE__ */ new Map([
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
  constructor(t, n = `HTTP error: ${VP.get(t) || t}`, r = null) {
    super(n), this.statusCode = t, this.description = r, this.name = "HttpError", this.code = `HTTP_ERROR_${t}`;
  }
  isServerError() {
    return this.statusCode >= 500 && this.statusCode <= 599;
  }
}
At.HttpError = Vu;
function GP(e) {
  return e.then((t) => t == null || t.length === 0 ? null : JSON.parse(t));
}
class li {
  constructor() {
    this.maxRedirects = 10;
  }
  request(t, n = new qP.CancellationToken(), r) {
    ea(t);
    const i = r == null ? void 0 : JSON.stringify(r), o = i ? Buffer.from(i) : void 0;
    if (o != null) {
      Er(i);
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
    return Er.enabled && Er(`Request: ${ta(t)}`), n.createPromise((o, s, a) => {
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
    if (Er.enabled && Er(`Response: ${t.statusCode} ${t.statusMessage}, request options: ${ta(n)}`), t.statusCode === 404) {
      o(ml(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

Please double check that your authentication token is correct. Due to security reasons, actual status maybe not reported, but 404.
`));
      return;
    } else if (t.statusCode === 204) {
      i();
      return;
    }
    const u = (c = t.statusCode) !== null && c !== void 0 ? c : 0, l = u >= 300 && u < 400, f = yi(t, "location");
    if (l && f != null) {
      if (s > this.maxRedirects) {
        o(this.createMaxRedirectError());
        return;
      }
      this.doApiRequest(li.prepareRedirectUrlOptions(f, n), r, a, s).then(i).catch(o);
      return;
    }
    t.setEncoding("utf8");
    let h = "";
    t.on("error", o), t.on("data", (d) => h += d), t.on("end", () => {
      try {
        if (t.statusCode != null && t.statusCode >= 400) {
          const d = yi(t, "content-type"), m = d != null && (Array.isArray(d) ? d.find((p) => p.includes("json")) != null : d.includes("json"));
          o(ml(t, `method: ${n.method || "GET"} url: ${n.protocol || "https:"}//${n.hostname}${n.port ? `:${n.port}` : ""}${n.path}

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
      Gu(t, a), ea(a), this.doDownload(a, {
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
      const s = yi(o, "location");
      if (s != null) {
        r < this.maxRedirects ? this.doDownload(li.prepareRedirectUrlOptions(s, t), n, r++) : n.callback(this.createMaxRedirectError());
        return;
      }
      n.responseHandler == null ? KP(n, o) : n.responseHandler(o, n.callback);
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
    const r = Og(t, { ...n }), i = r.headers;
    if (i != null && i.authorization) {
      const o = li.reconstructOriginalUrl(n), s = Pg(t, n);
      li.isCrossOriginRedirect(o, s) && (Er.enabled && Er(`Given the cross-origin redirect (from ${o.host} to ${s.host}), the Authorization header will be stripped out.`), delete i.authorization);
    }
    return r;
  }
  static reconstructOriginalUrl(t) {
    const n = t.protocol || "https:";
    if (!t.hostname)
      throw new Error("Missing hostname in request options");
    const r = t.hostname, i = t.port ? `:${t.port}` : "", o = t.path || "/";
    return new pl.URL(`${n}//${r}${i}${o}`);
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
At.HttpExecutor = li;
function Pg(e, t) {
  try {
    return new pl.URL(e);
  } catch {
    const n = t.hostname, r = t.protocol || "https:", i = t.port ? `:${t.port}` : "", o = `${r}//${n}${i}`;
    return new pl.URL(e, o);
  }
}
function Og(e, t) {
  const n = ea(t), r = Pg(e, t);
  return Gu(r, n), n;
}
function Gu(e, t) {
  t.protocol = e.protocol, t.hostname = e.hostname, e.port ? t.port = e.port : t.port && delete t.port, t.path = e.pathname + e.search;
}
class gl extends HP.Transform {
  // noinspection JSUnusedGlobalSymbols
  get actual() {
    return this._actual;
  }
  constructor(t, n = "sha512", r = "base64") {
    super(), this.expected = t, this.algorithm = n, this.encoding = r, this._actual = null, this.isValidateOnEnd = !0, this.digester = (0, jP.createHash)(n);
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
      throw (0, ph.newError)("Not finished yet", "ERR_STREAM_NOT_FINISHED");
    if (this._actual !== this.expected)
      throw (0, ph.newError)(`${this.algorithm} checksum mismatch, expected ${this.expected}, got ${this._actual}`, "ERR_CHECKSUM_MISMATCH");
    return null;
  }
}
At.DigestTransform = gl;
function WP(e, t, n) {
  return e != null && t != null && e !== t ? (n(new Error(`checksum mismatch: expected ${t} but got ${e} (X-Checksum-Sha2 header)`)), !1) : !0;
}
function yi(e, t) {
  const n = e.headers[t];
  return n == null ? null : Array.isArray(n) ? n.length === 0 ? null : n[n.length - 1] : n;
}
function KP(e, t) {
  if (!WP(yi(t, "X-Checksum-Sha2"), e.options.sha2, e.callback))
    return;
  const n = [];
  if (e.options.onProgress != null) {
    const s = yi(t, "content-length");
    s != null && n.push(new zP.ProgressCallbackTransform(parseInt(s, 10), e.options.cancellationToken, e.options.onProgress));
  }
  const r = e.options.sha512;
  r != null ? n.push(new gl(r, "sha512", r.length === 128 && !r.includes("+") && !r.includes("Z") && !r.includes("=") ? "hex" : "base64")) : e.options.sha2 != null && n.push(new gl(e.options.sha2, "sha256", "hex"));
  const i = (0, BP.createWriteStream)(e.destination);
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
function ea(e, t, n) {
  n != null && (e.method = n), e.headers = { ...e.headers };
  const r = e.headers;
  return t != null && (r.authorization = t.startsWith("Basic") || t.startsWith("Bearer") ? t : `token ${t}`), r["User-Agent"] == null && (r["User-Agent"] = "electron-builder"), (n == null || n === "GET" || r["Cache-Control"] == null) && (r["Cache-Control"] = "no-cache"), e.protocol == null && process.versions.electron != null && (e.protocol = "https:"), e;
}
function ta(e, t) {
  return JSON.stringify(e, (n, r) => n.endsWith("Authorization") || n.endsWith("authorization") || n.endsWith("Password") || n.endsWith("PASSWORD") || n.endsWith("Token") || n.includes("password") || n.includes("token") || t != null && t.has(n) ? "<stripped sensitive data>" : r, 2);
}
var ka = {};
Object.defineProperty(ka, "__esModule", { value: !0 });
ka.MemoLazy = void 0;
class JP {
  constructor(t, n) {
    this.selector = t, this.creator = n, this.selected = void 0, this._value = void 0;
  }
  get hasValue() {
    return this._value !== void 0;
  }
  get value() {
    const t = this.selector();
    if (this._value !== void 0 && Rg(this.selected, t))
      return this._value;
    this.selected = t;
    const n = this.creator(t);
    return this.value = n, n;
  }
  set value(t) {
    this._value = t;
  }
}
ka.MemoLazy = JP;
function Rg(e, t) {
  if (typeof e == "object" && e !== null && (typeof t == "object" && t !== null)) {
    const i = Object.keys(e), o = Object.keys(t);
    return i.length === o.length && i.every((s) => Rg(e[s], t[s]));
  }
  return e === t;
}
var Mo = {};
Object.defineProperty(Mo, "__esModule", { value: !0 });
Mo.githubUrl = YP;
Mo.githubTagPrefix = XP;
Mo.getS3LikeProviderBaseUrl = ZP;
function YP(e, t = "github.com") {
  return `${e.protocol || "https"}://${e.host || t}`;
}
function XP(e) {
  var t;
  return e.tagNamePrefix ? e.tagNamePrefix : !((t = e.vPrefixedTagName) !== null && t !== void 0) || t ? "v" : "";
}
function ZP(e) {
  const t = e.provider;
  if (t === "s3")
    return QP(e);
  if (t === "spaces")
    return eO(e);
  throw new Error(`Not supported provider: ${t}`);
}
function QP(e) {
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
  return Dg(t, e.path);
}
function Dg(e, t) {
  return t != null && t.length > 0 && (t.startsWith("/") || (e += "/"), e += t), e;
}
function eO(e) {
  if (e.name == null)
    throw new Error("name is missing");
  if (e.region == null)
    throw new Error("region is missing");
  return Dg(`https://${e.name}.${e.region}.digitaloceanspaces.com`, e.path);
}
var Wu = {};
Object.defineProperty(Wu, "__esModule", { value: !0 });
Wu.retry = Fg;
const tO = rr;
async function Fg(e, t) {
  var n;
  const { retries: r, interval: i, backoff: o = 0, attempt: s = 0, shouldRetry: a, cancellationToken: c = new tO.CancellationToken() } = t;
  try {
    return await e();
  } catch (u) {
    if (await Promise.resolve((n = a == null ? void 0 : a(u)) !== null && n !== void 0 ? n : !0) && r > 0 && !c.cancelled)
      return await new Promise((l) => setTimeout(l, i + o * s)), await Fg(e, { ...t, retries: r - 1, attempt: s + 1 });
    throw u;
  }
}
var Ku = {};
Object.defineProperty(Ku, "__esModule", { value: !0 });
Ku.parseDn = nO;
function nO(e) {
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
var _i = {};
Object.defineProperty(_i, "__esModule", { value: !0 });
_i.nil = _i.UUID = void 0;
const Lg = Si, xg = Ri, rO = "options.name must be either a string or a Buffer", mh = (0, Lg.randomBytes)(16);
mh[0] = mh[0] | 1;
const qs = {}, be = [];
for (let e = 0; e < 256; e++) {
  const t = (e + 256).toString(16).substr(1);
  qs[t] = e, be[e] = t;
}
class Mr {
  constructor(t) {
    this.ascii = null, this.binary = null;
    const n = Mr.check(t);
    if (!n)
      throw new Error("not a UUID");
    this.version = n.version, n.format === "ascii" ? this.ascii = t : this.binary = t;
  }
  static v5(t, n) {
    return iO(t, "sha1", 80, n);
  }
  toString() {
    return this.ascii == null && (this.ascii = oO(this.binary)), this.ascii;
  }
  inspect() {
    return `UUID v${this.version} ${this.toString()}`;
  }
  static check(t, n = 0) {
    if (typeof t == "string")
      return t = t.toLowerCase(), /^[a-f0-9]{8}(-[a-f0-9]{4}){3}-([a-f0-9]{12})$/.test(t) ? t === "00000000-0000-0000-0000-000000000000" ? { version: void 0, variant: "nil", format: "ascii" } : {
        version: (qs[t[14] + t[15]] & 240) >> 4,
        variant: gh((qs[t[19] + t[20]] & 224) >> 5),
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
        variant: gh((t[n + 8] & 224) >> 5),
        format: "binary"
      };
    }
    throw (0, xg.newError)("Unknown type of uuid", "ERR_UNKNOWN_UUID_TYPE");
  }
  // read stringified uuid into a Buffer
  static parse(t) {
    const n = Buffer.allocUnsafe(16);
    let r = 0;
    for (let i = 0; i < 16; i++)
      n[i] = qs[t[r++] + t[r++]], (i === 3 || i === 5 || i === 7 || i === 9) && (r += 1);
    return n;
  }
}
_i.UUID = Mr;
Mr.OID = Mr.parse("6ba7b812-9dad-11d1-80b4-00c04fd430c8");
function gh(e) {
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
var lo;
(function(e) {
  e[e.ASCII = 0] = "ASCII", e[e.BINARY = 1] = "BINARY", e[e.OBJECT = 2] = "OBJECT";
})(lo || (lo = {}));
function iO(e, t, n, r, i = lo.ASCII) {
  const o = (0, Lg.createHash)(t);
  if (typeof e != "string" && !Buffer.isBuffer(e))
    throw (0, xg.newError)(rO, "ERR_INVALID_UUID_NAME");
  o.update(r), o.update(e);
  const a = o.digest();
  let c;
  switch (i) {
    case lo.BINARY:
      a[6] = a[6] & 15 | n, a[8] = a[8] & 63 | 128, c = a;
      break;
    case lo.OBJECT:
      a[6] = a[6] & 15 | n, a[8] = a[8] & 63 | 128, c = new Mr(a);
      break;
    default:
      c = be[a[0]] + be[a[1]] + be[a[2]] + be[a[3]] + "-" + be[a[4]] + be[a[5]] + "-" + be[a[6] & 15 | n] + be[a[7]] + "-" + be[a[8] & 63 | 128] + be[a[9]] + "-" + be[a[10]] + be[a[11]] + be[a[12]] + be[a[13]] + be[a[14]] + be[a[15]];
      break;
  }
  return c;
}
function oO(e) {
  return be[e[0]] + be[e[1]] + be[e[2]] + be[e[3]] + "-" + be[e[4]] + be[e[5]] + "-" + be[e[6]] + be[e[7]] + "-" + be[e[8]] + be[e[9]] + "-" + be[e[10]] + be[e[11]] + be[e[12]] + be[e[13]] + be[e[14]] + be[e[15]];
}
_i.nil = new Mr("00000000-0000-0000-0000-000000000000");
var Bo = {}, kg = {};
(function(e) {
  (function(t) {
    t.parser = function(v, g) {
      return new r(v, g);
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
    function r(v, g) {
      if (!(this instanceof r))
        return new r(v, g);
      var I = this;
      o(I), I.q = I.c = "", I.bufferCheckPosition = t.MAX_BUFFER_LENGTH, I.encoding = null, I.opt = g || {}, I.opt.lowercase = I.opt.lowercase || I.opt.lowercasetags, I.looseCase = I.opt.lowercase ? "toLowerCase" : "toUpperCase", I.opt.maxEntityCount = I.opt.maxEntityCount || 512, I.opt.maxEntityDepth = I.opt.maxEntityDepth || 4, I.entityCount = I.entityDepth = 0, I.tags = [], I.closed = I.closedRoot = I.sawRoot = !1, I.tag = I.error = null, I.strict = !!v, I.noscript = !!(v || I.opt.noscript), I.state = b.BEGIN, I.strictEntities = I.opt.strictEntities, I.ENTITIES = I.strictEntities ? Object.create(t.XML_ENTITIES) : Object.create(t.ENTITIES), I.attribList = [], I.opt.xmlns && (I.ns = Object.create(w)), I.opt.unquotedAttributeValues === void 0 && (I.opt.unquotedAttributeValues = !v), I.trackPosition = I.opt.position !== !1, I.trackPosition && (I.position = I.line = I.column = 0), W(I, "onready");
    }
    Object.create || (Object.create = function(v) {
      function g() {
      }
      g.prototype = v;
      var I = new g();
      return I;
    }), Object.keys || (Object.keys = function(v) {
      var g = [];
      for (var I in v) v.hasOwnProperty(I) && g.push(I);
      return g;
    });
    function i(v) {
      for (var g = Math.max(t.MAX_BUFFER_LENGTH, 10), I = 0, N = 0, te = n.length; N < te; N++) {
        var fe = v[n[N]].length;
        if (fe > g)
          switch (n[N]) {
            case "textNode":
              Z(v);
              break;
            case "cdata":
              z(v, "oncdata", v.cdata), v.cdata = "";
              break;
            case "script":
              z(v, "onscript", v.script), v.script = "";
              break;
            default:
              B(v, "Max buffer length exceeded: " + n[N]);
          }
        I = Math.max(I, fe);
      }
      var _e = t.MAX_BUFFER_LENGTH - I;
      v.bufferCheckPosition = _e + v.position;
    }
    function o(v) {
      for (var g = 0, I = n.length; g < I; g++)
        v[n[g]] = "";
    }
    function s(v) {
      Z(v), v.cdata !== "" && (z(v, "oncdata", v.cdata), v.cdata = ""), v.script !== "" && (z(v, "onscript", v.script), v.script = "");
    }
    r.prototype = {
      end: function() {
        P(this);
      },
      write: O,
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
    var c = t.EVENTS.filter(function(v) {
      return v !== "error" && v !== "end";
    });
    function u(v, g) {
      return new f(v, g);
    }
    function l(v, g) {
      if (v.length >= 2) {
        if (v[0] === 255 && v[1] === 254)
          return "utf-16le";
        if (v[0] === 254 && v[1] === 255)
          return "utf-16be";
      }
      return v.length >= 3 && v[0] === 239 && v[1] === 187 && v[2] === 191 ? "utf8" : v.length >= 4 ? v[0] === 60 && v[1] === 0 && v[2] === 63 && v[3] === 0 ? "utf-16le" : v[0] === 0 && v[1] === 60 && v[2] === 0 && v[3] === 63 ? "utf-16be" : "utf8" : g ? "utf8" : null;
    }
    function f(v, g) {
      if (!(this instanceof f))
        return new f(v, g);
      a.apply(this), this._parser = new r(v, g), this.writable = !0, this.readable = !0;
      var I = this;
      this._parser.onend = function() {
        I.emit("end");
      }, this._parser.onerror = function(N) {
        I.emit("error", N), I._parser.error = null;
      }, this._decoder = null, this._decoderBuffer = null, c.forEach(function(N) {
        Object.defineProperty(I, "on" + N, {
          get: function() {
            return I._parser["on" + N];
          },
          set: function(te) {
            if (!te)
              return I.removeAllListeners(N), I._parser["on" + N] = te, te;
            I.on(N, te);
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
    }), f.prototype._decodeBuffer = function(v, g) {
      if (this._decoderBuffer && (v = Buffer.concat([this._decoderBuffer, v]), this._decoderBuffer = null), !this._decoder) {
        var I = l(v, g);
        if (!I)
          return this._decoderBuffer = v, "";
        this._parser.encoding = I, this._decoder = new TextDecoder(I);
      }
      return this._decoder.decode(v, { stream: !g });
    }, f.prototype.write = function(v) {
      if (typeof Buffer == "function" && typeof Buffer.isBuffer == "function" && Buffer.isBuffer(v))
        v = this._decodeBuffer(v, !1);
      else if (this._decoderBuffer) {
        var g = this._decodeBuffer(Buffer.alloc(0), !0);
        g && (this._parser.write(g), this.emit("data", g));
      }
      return this._parser.write(v.toString()), this.emit("data", v), !0;
    }, f.prototype.end = function(v) {
      if (v && v.length && this.write(v), this._decoderBuffer) {
        var g = this._decodeBuffer(Buffer.alloc(0), !0);
        g && (this._parser.write(g), this.emit("data", g));
      } else if (this._decoder) {
        var I = this._decoder.decode();
        I && (this._parser.write(I), this.emit("data", I));
      }
      return this._parser.end(), !0;
    }, f.prototype.on = function(v, g) {
      var I = this;
      return !I._parser["on" + v] && c.indexOf(v) !== -1 && (I._parser["on" + v] = function() {
        var N = arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments);
        N.splice(0, 0, v), I.emit.apply(I, N);
      }), a.prototype.on.call(I, v, g);
    };
    var h = "[CDATA[", d = "DOCTYPE", m = "http://www.w3.org/XML/1998/namespace", p = "http://www.w3.org/2000/xmlns/", w = { xml: m, xmlns: p }, E = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, y = /[:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/, _ = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]/, S = /[#:_A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\u00B7\u0300-\u036F\u203F-\u2040.\d-]/;
    function C(v) {
      return v === " " || v === `
` || v === "\r" || v === "	";
    }
    function j(v) {
      return v === '"' || v === "'";
    }
    function V(v) {
      return v === ">" || C(v);
    }
    function G(v, g) {
      return v.test(g);
    }
    function q(v, g) {
      return !G(v, g);
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
    }, Object.keys(t.ENTITIES).forEach(function(v) {
      var g = t.ENTITIES[v], I = typeof g == "number" ? String.fromCharCode(g) : g;
      t.ENTITIES[v] = I;
    });
    for (var M in t.STATE)
      t.STATE[t.STATE[M]] = M;
    b = t.STATE;
    function W(v, g, I) {
      v[g] && v[g](I);
    }
    function X(v) {
      var g = v && v.match(/(?:^|\s)encoding\s*=\s*(['"])([^'"]+)\1/i);
      return g ? g[2] : null;
    }
    function L(v) {
      return v ? v.toLowerCase().replace(/[^a-z0-9]/g, "") : null;
    }
    function U(v, g) {
      const I = L(v), N = L(g);
      return !I || !N ? !0 : N === "utf16" ? I === "utf16le" || I === "utf16be" : I === N;
    }
    function K(v, g) {
      if (!(!v.strict || !v.encoding || !g || g.name !== "xml")) {
        var I = X(g.body);
        I && !U(v.encoding, I) && F(
          v,
          "XML declaration encoding " + I + " does not match detected stream encoding " + v.encoding.toUpperCase()
        );
      }
    }
    function z(v, g, I) {
      v.textNode && Z(v), W(v, g, I);
    }
    function Z(v) {
      v.textNode = J(v.opt, v.textNode), v.textNode && W(v, "ontext", v.textNode), v.textNode = "";
    }
    function J(v, g) {
      return v.trim && (g = g.trim()), v.normalize && (g = g.replace(/\s+/g, " ")), g;
    }
    function B(v, g) {
      return Z(v), v.trackPosition && (g += `
Line: ` + v.line + `
Column: ` + v.column + `
Char: ` + v.c), g = new Error(g), v.error = g, W(v, "onerror", g), v;
    }
    function P(v) {
      return v.sawRoot && !v.closedRoot && F(v, "Unclosed root tag"), v.state !== b.BEGIN && v.state !== b.BEGIN_WHITESPACE && v.state !== b.TEXT && B(v, "Unexpected end"), Z(v), v.c = "", v.closed = !0, W(v, "onend"), r.call(v, v.strict, v.opt), v;
    }
    function F(v, g) {
      if (typeof v != "object" || !(v instanceof r))
        throw new Error("bad call to strictFail");
      v.strict && B(v, g);
    }
    function D(v) {
      v.strict || (v.tagName = v.tagName[v.looseCase]());
      var g = v.tags[v.tags.length - 1] || v, I = v.tag = { name: v.tagName, attributes: {} };
      v.opt.xmlns && (I.ns = g.ns), v.attribList.length = 0, z(v, "onopentagstart", I);
    }
    function $(v, g) {
      var I = v.indexOf(":"), N = I < 0 ? ["", v] : v.split(":"), te = N[0], fe = N[1];
      return g && v === "xmlns" && (te = "xmlns", fe = ""), { prefix: te, local: fe };
    }
    function T(v) {
      if (v.strict || (v.attribName = v.attribName[v.looseCase]()), v.attribList.indexOf(v.attribName) !== -1 || v.tag.attributes.hasOwnProperty(v.attribName)) {
        v.attribName = v.attribValue = "";
        return;
      }
      if (v.opt.xmlns) {
        var g = $(v.attribName, !0), I = g.prefix, N = g.local;
        if (I === "xmlns")
          if (N === "xml" && v.attribValue !== m)
            F(
              v,
              "xml: prefix must be bound to " + m + `
Actual: ` + v.attribValue
            );
          else if (N === "xmlns" && v.attribValue !== p)
            F(
              v,
              "xmlns: prefix must be bound to " + p + `
Actual: ` + v.attribValue
            );
          else {
            var te = v.tag, fe = v.tags[v.tags.length - 1] || v;
            te.ns === fe.ns && (te.ns = Object.create(fe.ns)), te.ns[N] = v.attribValue;
          }
        v.attribList.push([v.attribName, v.attribValue]);
      } else
        v.tag.attributes[v.attribName] = v.attribValue, z(v, "onattribute", {
          name: v.attribName,
          value: v.attribValue
        });
      v.attribName = v.attribValue = "";
    }
    function H(v, g) {
      if (v.opt.xmlns) {
        var I = v.tag, N = $(v.tagName);
        I.prefix = N.prefix, I.local = N.local, I.uri = I.ns[N.prefix] || "", I.prefix && !I.uri && (F(
          v,
          "Unbound namespace prefix: " + JSON.stringify(v.tagName)
        ), I.uri = N.prefix);
        var te = v.tags[v.tags.length - 1] || v;
        I.ns && te.ns !== I.ns && Object.keys(I.ns).forEach(function(Rt) {
          z(v, "onopennamespace", {
            prefix: Rt,
            uri: I.ns[Rt]
          });
        });
        for (var fe = 0, _e = v.attribList.length; fe < _e; fe++) {
          var $e = v.attribList[fe], ve = $e[0], Ae = $e[1], Ie = $(ve, !0), Oe = Ie.prefix, un = Ie.local, Wt = Oe === "" ? "" : I.ns[Oe] || "", Ot = {
            name: ve,
            value: Ae,
            prefix: Oe,
            local: un,
            uri: Wt
          };
          Oe && Oe !== "xmlns" && !Wt && (F(
            v,
            "Unbound namespace prefix: " + JSON.stringify(Oe)
          ), Ot.uri = Oe), v.tag.attributes[ve] = Ot, z(v, "onattribute", Ot);
        }
        v.attribList.length = 0;
      }
      v.tag.isSelfClosing = !!g, v.sawRoot = !0, v.tags.push(v.tag), z(v, "onopentag", v.tag), g || (!v.noscript && v.tagName.toLowerCase() === "script" ? v.state = b.SCRIPT : v.state = b.TEXT, v.tag = null, v.tagName = ""), v.attribName = v.attribValue = "", v.attribList.length = 0;
    }
    function ie(v) {
      if (!v.tagName) {
        F(v, "Weird empty close tag."), v.textNode += "</>", v.state = b.TEXT;
        return;
      }
      if (v.script) {
        if (v.tagName !== "script") {
          v.script += "</" + v.tagName + ">", v.tagName = "", v.state = b.SCRIPT;
          return;
        }
        z(v, "onscript", v.script), v.script = "";
      }
      var g = v.tags.length, I = v.tagName;
      v.strict || (I = I[v.looseCase]());
      for (var N = I; g--; ) {
        var te = v.tags[g];
        if (te.name !== N)
          F(v, "Unexpected close tag");
        else
          break;
      }
      if (g < 0) {
        F(v, "Unmatched closing tag: " + v.tagName), v.textNode += "</" + v.tagName + ">", v.state = b.TEXT;
        return;
      }
      v.tagName = I;
      for (var fe = v.tags.length; fe-- > g; ) {
        var _e = v.tag = v.tags.pop();
        v.tagName = v.tag.name, z(v, "onclosetag", v.tagName);
        var $e = {};
        for (var ve in _e.ns)
          $e[ve] = _e.ns[ve];
        var Ae = v.tags[v.tags.length - 1] || v;
        v.opt.xmlns && _e.ns !== Ae.ns && Object.keys(_e.ns).forEach(function(Ie) {
          var Oe = _e.ns[Ie];
          z(v, "onclosenamespace", { prefix: Ie, uri: Oe });
        });
      }
      g === 0 && (v.closedRoot = !0), v.tagName = v.attribValue = v.attribName = "", v.attribList.length = 0, v.state = b.TEXT;
    }
    function ne(v) {
      var g = v.entity, I = g.toLowerCase(), N, te = "";
      return v.ENTITIES[g] ? v.ENTITIES[g] : v.ENTITIES[I] ? v.ENTITIES[I] : (g = I, g.charAt(0) === "#" && (g.charAt(1) === "x" ? (g = g.slice(2), N = parseInt(g, 16), te = N.toString(16)) : (g = g.slice(1), N = parseInt(g, 10), te = N.toString(10))), g = g.replace(/^0+/, ""), isNaN(N) || te.toLowerCase() !== g || N < 0 || N > 1114111 ? (F(v, "Invalid character entity"), "&" + v.entity + ";") : String.fromCodePoint(N));
    }
    function ye(v, g) {
      g === "<" ? (v.state = b.OPEN_WAKA, v.startTagPosition = v.position) : C(g) || (F(v, "Non-whitespace before first tag."), v.textNode = g, v.state = b.TEXT);
    }
    function le(v, g) {
      var I = "";
      return g < v.length && (I = v.charAt(g)), I;
    }
    function O(v) {
      var g = this;
      if (this.error)
        throw this.error;
      if (g.closed)
        return B(
          g,
          "Cannot write after close. Assign an onready handler."
        );
      if (v === null)
        return P(g);
      typeof v == "object" && (v = v.toString());
      for (var I = 0, N = ""; N = le(v, I++), g.c = N, !!N; )
        switch (g.trackPosition && (g.position++, N === `
` ? (g.line++, g.column = 0) : g.column++), g.state) {
          case b.BEGIN:
            if (g.state = b.BEGIN_WHITESPACE, N === "\uFEFF")
              continue;
            ye(g, N);
            continue;
          case b.BEGIN_WHITESPACE:
            ye(g, N);
            continue;
          case b.TEXT:
            if (g.sawRoot && !g.closedRoot) {
              for (var fe = I - 1; N && N !== "<" && N !== "&"; )
                N = le(v, I++), N && g.trackPosition && (g.position++, N === `
` ? (g.line++, g.column = 0) : g.column++);
              g.textNode += v.substring(fe, I - 1);
            }
            N === "<" && !(g.sawRoot && g.closedRoot && !g.strict) ? (g.state = b.OPEN_WAKA, g.startTagPosition = g.position) : (!C(N) && (!g.sawRoot || g.closedRoot) && F(g, "Text data outside of root node."), N === "&" ? g.state = b.TEXT_ENTITY : g.textNode += N);
            continue;
          case b.SCRIPT:
            N === "<" ? g.state = b.SCRIPT_ENDING : g.script += N;
            continue;
          case b.SCRIPT_ENDING:
            N === "/" ? g.state = b.CLOSE_TAG : (g.script += "<" + N, g.state = b.SCRIPT);
            continue;
          case b.OPEN_WAKA:
            if (N === "!")
              g.state = b.SGML_DECL, g.sgmlDecl = "";
            else if (!C(N)) if (G(E, N))
              g.state = b.OPEN_TAG, g.tagName = N;
            else if (N === "/")
              g.state = b.CLOSE_TAG, g.tagName = "";
            else if (N === "?")
              g.state = b.PROC_INST, g.procInstName = g.procInstBody = "";
            else {
              if (F(g, "Unencoded <"), g.startTagPosition + 1 < g.position) {
                var te = g.position - g.startTagPosition;
                N = new Array(te).join(" ") + N;
              }
              g.textNode += "<" + N, g.state = b.TEXT;
            }
            continue;
          case b.SGML_DECL:
            if (g.sgmlDecl + N === "--") {
              g.state = b.COMMENT, g.comment = "", g.sgmlDecl = "";
              continue;
            }
            g.doctype && g.doctype !== !0 && g.sgmlDecl ? (g.state = b.DOCTYPE_DTD, g.doctype += "<!" + g.sgmlDecl + N, g.sgmlDecl = "") : (g.sgmlDecl + N).toUpperCase() === h ? (z(g, "onopencdata"), g.state = b.CDATA, g.sgmlDecl = "", g.cdata = "") : (g.sgmlDecl + N).toUpperCase() === d ? (g.state = b.DOCTYPE, (g.doctype || g.sawRoot) && F(
              g,
              "Inappropriately located doctype declaration"
            ), g.doctype = "", g.sgmlDecl = "") : N === ">" ? (z(g, "onsgmldeclaration", g.sgmlDecl), g.sgmlDecl = "", g.state = b.TEXT) : (j(N) && (g.state = b.SGML_DECL_QUOTED), g.sgmlDecl += N);
            continue;
          case b.SGML_DECL_QUOTED:
            N === g.q && (g.state = b.SGML_DECL, g.q = ""), g.sgmlDecl += N;
            continue;
          case b.DOCTYPE:
            N === ">" ? (g.state = b.TEXT, z(g, "ondoctype", g.doctype), g.doctype = !0) : (g.doctype += N, N === "[" ? g.state = b.DOCTYPE_DTD : j(N) && (g.state = b.DOCTYPE_QUOTED, g.q = N));
            continue;
          case b.DOCTYPE_QUOTED:
            g.doctype += N, N === g.q && (g.q = "", g.state = b.DOCTYPE);
            continue;
          case b.DOCTYPE_DTD:
            N === "]" ? (g.doctype += N, g.state = b.DOCTYPE) : N === "<" ? (g.state = b.OPEN_WAKA, g.startTagPosition = g.position) : j(N) ? (g.doctype += N, g.state = b.DOCTYPE_DTD_QUOTED, g.q = N) : g.doctype += N;
            continue;
          case b.DOCTYPE_DTD_QUOTED:
            g.doctype += N, N === g.q && (g.state = b.DOCTYPE_DTD, g.q = "");
            continue;
          case b.COMMENT:
            N === "-" ? g.state = b.COMMENT_ENDING : g.comment += N;
            continue;
          case b.COMMENT_ENDING:
            N === "-" ? (g.state = b.COMMENT_ENDED, g.comment = J(g.opt, g.comment), g.comment && z(g, "oncomment", g.comment), g.comment = "") : (g.comment += "-" + N, g.state = b.COMMENT);
            continue;
          case b.COMMENT_ENDED:
            N !== ">" ? (F(g, "Malformed comment"), g.comment += "--" + N, g.state = b.COMMENT) : g.doctype && g.doctype !== !0 ? g.state = b.DOCTYPE_DTD : g.state = b.TEXT;
            continue;
          case b.CDATA:
            for (var fe = I - 1; N && N !== "]"; )
              N = le(v, I++), N && g.trackPosition && (g.position++, N === `
` ? (g.line++, g.column = 0) : g.column++);
            g.cdata += v.substring(fe, I - 1), N === "]" && (g.state = b.CDATA_ENDING);
            continue;
          case b.CDATA_ENDING:
            N === "]" ? g.state = b.CDATA_ENDING_2 : (g.cdata += "]" + N, g.state = b.CDATA);
            continue;
          case b.CDATA_ENDING_2:
            N === ">" ? (g.cdata && z(g, "oncdata", g.cdata), z(g, "onclosecdata"), g.cdata = "", g.state = b.TEXT) : N === "]" ? g.cdata += "]" : (g.cdata += "]]" + N, g.state = b.CDATA);
            continue;
          case b.PROC_INST:
            N === "?" ? g.state = b.PROC_INST_ENDING : C(N) ? g.state = b.PROC_INST_BODY : g.procInstName += N;
            continue;
          case b.PROC_INST_BODY:
            if (!g.procInstBody && C(N))
              continue;
            N === "?" ? g.state = b.PROC_INST_ENDING : g.procInstBody += N;
            continue;
          case b.PROC_INST_ENDING:
            if (N === ">") {
              const Ae = {
                name: g.procInstName,
                body: g.procInstBody
              };
              K(g, Ae), z(g, "onprocessinginstruction", Ae), g.procInstName = g.procInstBody = "", g.state = b.TEXT;
            } else
              g.procInstBody += "?" + N, g.state = b.PROC_INST_BODY;
            continue;
          case b.OPEN_TAG:
            G(y, N) ? g.tagName += N : (D(g), N === ">" ? H(g) : N === "/" ? g.state = b.OPEN_TAG_SLASH : (C(N) || F(g, "Invalid character in tag name"), g.state = b.ATTRIB));
            continue;
          case b.OPEN_TAG_SLASH:
            N === ">" ? (H(g, !0), ie(g)) : (F(
              g,
              "Forward-slash in opening tag not followed by >"
            ), g.state = b.ATTRIB);
            continue;
          case b.ATTRIB:
            if (C(N))
              continue;
            N === ">" ? H(g) : N === "/" ? g.state = b.OPEN_TAG_SLASH : G(E, N) ? (g.attribName = N, g.attribValue = "", g.state = b.ATTRIB_NAME) : F(g, "Invalid attribute name");
            continue;
          case b.ATTRIB_NAME:
            N === "=" ? g.state = b.ATTRIB_VALUE : N === ">" ? (F(g, "Attribute without value"), g.attribValue = g.attribName, T(g), H(g)) : C(N) ? g.state = b.ATTRIB_NAME_SAW_WHITE : G(y, N) ? g.attribName += N : F(g, "Invalid attribute name");
            continue;
          case b.ATTRIB_NAME_SAW_WHITE:
            if (N === "=")
              g.state = b.ATTRIB_VALUE;
            else {
              if (C(N))
                continue;
              F(g, "Attribute without value"), g.tag.attributes[g.attribName] = "", g.attribValue = "", z(g, "onattribute", {
                name: g.attribName,
                value: ""
              }), g.attribName = "", N === ">" ? H(g) : G(E, N) ? (g.attribName = N, g.state = b.ATTRIB_NAME) : (F(g, "Invalid attribute name"), g.state = b.ATTRIB);
            }
            continue;
          case b.ATTRIB_VALUE:
            if (C(N))
              continue;
            j(N) ? (g.q = N, g.state = b.ATTRIB_VALUE_QUOTED) : (g.opt.unquotedAttributeValues || B(g, "Unquoted attribute value"), g.state = b.ATTRIB_VALUE_UNQUOTED, g.attribValue = N);
            continue;
          case b.ATTRIB_VALUE_QUOTED:
            if (N !== g.q) {
              N === "&" ? g.state = b.ATTRIB_VALUE_ENTITY_Q : g.attribValue += N;
              continue;
            }
            T(g), g.q = "", g.state = b.ATTRIB_VALUE_CLOSED;
            continue;
          case b.ATTRIB_VALUE_CLOSED:
            C(N) ? g.state = b.ATTRIB : N === ">" ? H(g) : N === "/" ? g.state = b.OPEN_TAG_SLASH : G(E, N) ? (F(g, "No whitespace between attributes"), g.attribName = N, g.attribValue = "", g.state = b.ATTRIB_NAME) : F(g, "Invalid attribute name");
            continue;
          case b.ATTRIB_VALUE_UNQUOTED:
            if (!V(N)) {
              N === "&" ? g.state = b.ATTRIB_VALUE_ENTITY_U : g.attribValue += N;
              continue;
            }
            T(g), N === ">" ? H(g) : g.state = b.ATTRIB;
            continue;
          case b.CLOSE_TAG:
            if (g.tagName)
              N === ">" ? ie(g) : G(y, N) ? g.tagName += N : g.script ? (g.script += "</" + g.tagName + N, g.tagName = "", g.state = b.SCRIPT) : (C(N) || F(g, "Invalid tagname in closing tag"), g.state = b.CLOSE_TAG_SAW_WHITE);
            else {
              if (C(N))
                continue;
              q(E, N) ? g.script ? (g.script += "</" + N, g.state = b.SCRIPT) : F(g, "Invalid tagname in closing tag.") : g.tagName = N;
            }
            continue;
          case b.CLOSE_TAG_SAW_WHITE:
            if (C(N))
              continue;
            N === ">" ? ie(g) : F(g, "Invalid characters in closing tag");
            continue;
          case b.TEXT_ENTITY:
          case b.ATTRIB_VALUE_ENTITY_Q:
          case b.ATTRIB_VALUE_ENTITY_U:
            var _e, $e;
            switch (g.state) {
              case b.TEXT_ENTITY:
                _e = b.TEXT, $e = "textNode";
                break;
              case b.ATTRIB_VALUE_ENTITY_Q:
                _e = b.ATTRIB_VALUE_QUOTED, $e = "attribValue";
                break;
              case b.ATTRIB_VALUE_ENTITY_U:
                _e = b.ATTRIB_VALUE_UNQUOTED, $e = "attribValue";
                break;
            }
            if (N === ";") {
              var ve = ne(g);
              g.opt.unparsedEntities && !Object.values(t.XML_ENTITIES).includes(ve) ? ((g.entityCount += 1) > g.opt.maxEntityCount && B(
                g,
                "Parsed entity count exceeds max entity count"
              ), (g.entityDepth += 1) > g.opt.maxEntityDepth && B(
                g,
                "Parsed entity depth exceeds max entity depth"
              ), g.entity = "", g.state = _e, g.write(ve), g.entityDepth -= 1) : (g[$e] += ve, g.entity = "", g.state = _e);
            } else G(g.entity.length ? S : _, N) ? g.entity += N : (F(g, "Invalid character in entity name"), g[$e] += "&" + g.entity + N, g.entity = "", g.state = _e);
            continue;
          default:
            throw new Error(g, "Unknown state: " + g.state);
        }
      return g.position >= g.bufferCheckPosition && i(g), g;
    }
    /*! http://mths.be/fromcodepoint v0.1.0 by @mathias */
    String.fromCodePoint || function() {
      var v = String.fromCharCode, g = Math.floor, I = function() {
        var N = 16384, te = [], fe, _e, $e = -1, ve = arguments.length;
        if (!ve)
          return "";
        for (var Ae = ""; ++$e < ve; ) {
          var Ie = Number(arguments[$e]);
          if (!isFinite(Ie) || // `NaN`, `+Infinity`, or `-Infinity`
          Ie < 0 || // not a valid Unicode code point
          Ie > 1114111 || // not a valid Unicode code point
          g(Ie) !== Ie)
            throw RangeError("Invalid code point: " + Ie);
          Ie <= 65535 ? te.push(Ie) : (Ie -= 65536, fe = (Ie >> 10) + 55296, _e = Ie % 1024 + 56320, te.push(fe, _e)), ($e + 1 === ve || te.length > N) && (Ae += v.apply(null, te), te.length = 0);
        }
        return Ae;
      };
      Object.defineProperty ? Object.defineProperty(String, "fromCodePoint", {
        value: I,
        configurable: !0,
        writable: !0
      }) : String.fromCodePoint = I;
    }();
  })(e);
})(kg);
Object.defineProperty(Bo, "__esModule", { value: !0 });
Bo.XElement = void 0;
Bo.parseXml = lO;
const sO = kg, As = Ri;
class Ug {
  constructor(t) {
    if (this.name = t, this.value = "", this.attributes = null, this.isCData = !1, this.elements = null, !t)
      throw (0, As.newError)("Element name cannot be empty", "ERR_XML_ELEMENT_NAME_EMPTY");
    if (!cO(t))
      throw (0, As.newError)(`Invalid element name: ${t}`, "ERR_XML_ELEMENT_INVALID_NAME");
  }
  attribute(t) {
    const n = this.attributes === null ? null : this.attributes[t];
    if (n == null)
      throw (0, As.newError)(`No attribute "${t}"`, "ERR_XML_MISSED_ATTRIBUTE");
    return n;
  }
  removeAttribute(t) {
    this.attributes !== null && delete this.attributes[t];
  }
  element(t, n = !1, r = null) {
    const i = this.elementOrNull(t, n);
    if (i === null)
      throw (0, As.newError)(r || `No element "${t}"`, "ERR_XML_MISSED_ELEMENT");
    return i;
  }
  elementOrNull(t, n = !1) {
    if (this.elements === null)
      return null;
    for (const r of this.elements)
      if (yh(r, t, n))
        return r;
    return null;
  }
  getElements(t, n = !1) {
    return this.elements === null ? [] : this.elements.filter((r) => yh(r, t, n));
  }
  elementValueOrEmpty(t, n = !1) {
    const r = this.elementOrNull(t, n);
    return r === null ? "" : r.value;
  }
}
Bo.XElement = Ug;
const aO = new RegExp(/^[A-Za-z_][:A-Za-z0-9_-]*$/i);
function cO(e) {
  return aO.test(e);
}
function yh(e, t, n) {
  const r = e.name;
  return r === t || n === !0 && r.length === t.length && r.toLowerCase() === t.toLowerCase();
}
function lO(e) {
  let t = null;
  const n = sO.parser(!0, {}), r = [];
  return n.onopentag = (i) => {
    const o = new Ug(i.name);
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
  var t = rr;
  Object.defineProperty(e, "CancellationError", { enumerable: !0, get: function() {
    return t.CancellationError;
  } }), Object.defineProperty(e, "CancellationToken", { enumerable: !0, get: function() {
    return t.CancellationToken;
  } });
  var n = Ri;
  Object.defineProperty(e, "newError", { enumerable: !0, get: function() {
    return n.newError;
  } });
  var r = At;
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
  var i = ka;
  Object.defineProperty(e, "MemoLazy", { enumerable: !0, get: function() {
    return i.MemoLazy;
  } });
  var o = jo;
  Object.defineProperty(e, "ProgressCallbackTransform", { enumerable: !0, get: function() {
    return o.ProgressCallbackTransform;
  } });
  var s = Mo;
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
  var u = _i;
  Object.defineProperty(e, "UUID", { enumerable: !0, get: function() {
    return u.UUID;
  } });
  var l = Bo;
  Object.defineProperty(e, "parseXml", { enumerable: !0, get: function() {
    return l.parseXml;
  } }), Object.defineProperty(e, "XElement", { enumerable: !0, get: function() {
    return l.XElement;
  } }), e.CURRENT_APP_INSTALLER_FILE_NAME = "installer.exe", e.CURRENT_APP_PACKAGE_FILE_NAME = "package.7z";
  function f(h) {
    return h == null ? [] : Array.isArray(h) ? h : [h];
  }
})(et);
var ut = {}, Ju = {}, cn = {};
function jg(e) {
  return typeof e > "u" || e === null;
}
function uO(e) {
  return typeof e == "object" && e !== null;
}
function fO(e) {
  return Array.isArray(e) ? e : jg(e) ? [] : [e];
}
function dO(e, t) {
  var n, r, i, o;
  if (t)
    for (o = Object.keys(t), n = 0, r = o.length; n < r; n += 1)
      i = o[n], e[i] = t[i];
  return e;
}
function hO(e, t) {
  var n = "", r;
  for (r = 0; r < t; r += 1)
    n += e;
  return n;
}
function pO(e) {
  return e === 0 && Number.NEGATIVE_INFINITY === 1 / e;
}
cn.isNothing = jg;
cn.isObject = uO;
cn.toArray = fO;
cn.repeat = hO;
cn.isNegativeZero = pO;
cn.extend = dO;
function Mg(e, t) {
  var n = "", r = e.reason || "(unknown reason)";
  return e.mark ? (e.mark.name && (n += 'in "' + e.mark.name + '" '), n += "(" + (e.mark.line + 1) + ":" + (e.mark.column + 1) + ")", !t && e.mark.snippet && (n += `

` + e.mark.snippet), r + " " + n) : r;
}
function Eo(e, t) {
  Error.call(this), this.name = "YAMLException", this.reason = e, this.mark = t, this.message = Mg(this, !1), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : this.stack = new Error().stack || "";
}
Eo.prototype = Object.create(Error.prototype);
Eo.prototype.constructor = Eo;
Eo.prototype.toString = function(t) {
  return this.name + ": " + Mg(this, t);
};
var Ho = Eo, to = cn;
function Oc(e, t, n, r, i) {
  var o = "", s = "", a = Math.floor(i / 2) - 1;
  return r - t > a && (o = " ... ", t = r - a + o.length), n - r > a && (s = " ...", n = r + a - s.length), {
    str: o + e.slice(t, n).replace(/\t/g, "→") + s,
    pos: r - t + o.length
    // relative position
  };
}
function Rc(e, t) {
  return to.repeat(" ", t - e.length) + e;
}
function mO(e, t) {
  if (t = Object.create(t || null), !e.buffer) return null;
  t.maxLength || (t.maxLength = 79), typeof t.indent != "number" && (t.indent = 1), typeof t.linesBefore != "number" && (t.linesBefore = 3), typeof t.linesAfter != "number" && (t.linesAfter = 2);
  for (var n = /\r?\n|\r|\0/g, r = [0], i = [], o, s = -1; o = n.exec(e.buffer); )
    i.push(o.index), r.push(o.index + o[0].length), e.position <= o.index && s < 0 && (s = r.length - 2);
  s < 0 && (s = r.length - 1);
  var a = "", c, u, l = Math.min(e.line + t.linesAfter, i.length).toString().length, f = t.maxLength - (t.indent + l + 3);
  for (c = 1; c <= t.linesBefore && !(s - c < 0); c++)
    u = Oc(
      e.buffer,
      r[s - c],
      i[s - c],
      e.position - (r[s] - r[s - c]),
      f
    ), a = to.repeat(" ", t.indent) + Rc((e.line - c + 1).toString(), l) + " | " + u.str + `
` + a;
  for (u = Oc(e.buffer, r[s], i[s], e.position, f), a += to.repeat(" ", t.indent) + Rc((e.line + 1).toString(), l) + " | " + u.str + `
`, a += to.repeat("-", t.indent + l + 3 + u.pos) + `^
`, c = 1; c <= t.linesAfter && !(s + c >= i.length); c++)
    u = Oc(
      e.buffer,
      r[s + c],
      i[s + c],
      e.position - (r[s] - r[s + c]),
      f
    ), a += to.repeat(" ", t.indent) + Rc((e.line + c + 1).toString(), l) + " | " + u.str + `
`;
  return a.replace(/\n$/, "");
}
var gO = mO, vh = Ho, yO = [
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
], vO = [
  "scalar",
  "sequence",
  "mapping"
];
function wO(e) {
  var t = {};
  return e !== null && Object.keys(e).forEach(function(n) {
    e[n].forEach(function(r) {
      t[String(r)] = n;
    });
  }), t;
}
function EO(e, t) {
  if (t = t || {}, Object.keys(t).forEach(function(n) {
    if (yO.indexOf(n) === -1)
      throw new vh('Unknown option "' + n + '" is met in definition of "' + e + '" YAML type.');
  }), this.options = t, this.tag = e, this.kind = t.kind || null, this.resolve = t.resolve || function() {
    return !0;
  }, this.construct = t.construct || function(n) {
    return n;
  }, this.instanceOf = t.instanceOf || null, this.predicate = t.predicate || null, this.represent = t.represent || null, this.representName = t.representName || null, this.defaultStyle = t.defaultStyle || null, this.multi = t.multi || !1, this.styleAliases = wO(t.styleAliases || null), vO.indexOf(this.kind) === -1)
    throw new vh('Unknown kind "' + this.kind + '" is specified for "' + e + '" YAML type.');
}
var Pt = EO, Ji = Ho, Dc = Pt;
function wh(e, t) {
  var n = [];
  return e[t].forEach(function(r) {
    var i = n.length;
    n.forEach(function(o, s) {
      o.tag === r.tag && o.kind === r.kind && o.multi === r.multi && (i = s);
    }), n[i] = r;
  }), n;
}
function _O() {
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
function yl(e) {
  return this.extend(e);
}
yl.prototype.extend = function(t) {
  var n = [], r = [];
  if (t instanceof Dc)
    r.push(t);
  else if (Array.isArray(t))
    r = r.concat(t);
  else if (t && (Array.isArray(t.implicit) || Array.isArray(t.explicit)))
    t.implicit && (n = n.concat(t.implicit)), t.explicit && (r = r.concat(t.explicit));
  else
    throw new Ji("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
  n.forEach(function(o) {
    if (!(o instanceof Dc))
      throw new Ji("Specified list of YAML types (or a single Type object) contains a non-Type object.");
    if (o.loadKind && o.loadKind !== "scalar")
      throw new Ji("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
    if (o.multi)
      throw new Ji("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
  }), r.forEach(function(o) {
    if (!(o instanceof Dc))
      throw new Ji("Specified list of YAML types (or a single Type object) contains a non-Type object.");
  });
  var i = Object.create(yl.prototype);
  return i.implicit = (this.implicit || []).concat(n), i.explicit = (this.explicit || []).concat(r), i.compiledImplicit = wh(i, "implicit"), i.compiledExplicit = wh(i, "explicit"), i.compiledTypeMap = _O(i.compiledImplicit, i.compiledExplicit), i;
};
var Bg = yl, $O = Pt, Hg = new $O("tag:yaml.org,2002:str", {
  kind: "scalar",
  construct: function(e) {
    return e !== null ? e : "";
  }
}), SO = Pt, qg = new SO("tag:yaml.org,2002:seq", {
  kind: "sequence",
  construct: function(e) {
    return e !== null ? e : [];
  }
}), bO = Pt, zg = new bO("tag:yaml.org,2002:map", {
  kind: "mapping",
  construct: function(e) {
    return e !== null ? e : {};
  }
}), AO = Bg, Vg = new AO({
  explicit: [
    Hg,
    qg,
    zg
  ]
}), TO = Pt;
function CO(e) {
  if (e === null) return !0;
  var t = e.length;
  return t === 1 && e === "~" || t === 4 && (e === "null" || e === "Null" || e === "NULL");
}
function NO() {
  return null;
}
function IO(e) {
  return e === null;
}
var Gg = new TO("tag:yaml.org,2002:null", {
  kind: "scalar",
  resolve: CO,
  construct: NO,
  predicate: IO,
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
}), PO = Pt;
function OO(e) {
  if (e === null) return !1;
  var t = e.length;
  return t === 4 && (e === "true" || e === "True" || e === "TRUE") || t === 5 && (e === "false" || e === "False" || e === "FALSE");
}
function RO(e) {
  return e === "true" || e === "True" || e === "TRUE";
}
function DO(e) {
  return Object.prototype.toString.call(e) === "[object Boolean]";
}
var Wg = new PO("tag:yaml.org,2002:bool", {
  kind: "scalar",
  resolve: OO,
  construct: RO,
  predicate: DO,
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
}), FO = cn, LO = Pt;
function xO(e) {
  return 48 <= e && e <= 57 || 65 <= e && e <= 70 || 97 <= e && e <= 102;
}
function kO(e) {
  return 48 <= e && e <= 55;
}
function UO(e) {
  return 48 <= e && e <= 57;
}
function jO(e) {
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
          if (!xO(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
    if (i === "o") {
      for (n++; n < t; n++)
        if (i = e[n], i !== "_") {
          if (!kO(e.charCodeAt(n))) return !1;
          r = !0;
        }
      return r && i !== "_";
    }
  }
  if (i === "_") return !1;
  for (; n < t; n++)
    if (i = e[n], i !== "_") {
      if (!UO(e.charCodeAt(n)))
        return !1;
      r = !0;
    }
  return !(!r || i === "_");
}
function MO(e) {
  var t = e, n = 1, r;
  if (t.indexOf("_") !== -1 && (t = t.replace(/_/g, "")), r = t[0], (r === "-" || r === "+") && (r === "-" && (n = -1), t = t.slice(1), r = t[0]), t === "0") return 0;
  if (r === "0") {
    if (t[1] === "b") return n * parseInt(t.slice(2), 2);
    if (t[1] === "x") return n * parseInt(t.slice(2), 16);
    if (t[1] === "o") return n * parseInt(t.slice(2), 8);
  }
  return n * parseInt(t, 10);
}
function BO(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && e % 1 === 0 && !FO.isNegativeZero(e);
}
var Kg = new LO("tag:yaml.org,2002:int", {
  kind: "scalar",
  resolve: jO,
  construct: MO,
  predicate: BO,
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
}), Jg = cn, HO = Pt, qO = new RegExp(
  // 2.5e4, 2.5 and integers
  "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
);
function zO(e) {
  return !(e === null || !qO.test(e) || // Quick hack to not allow integers end with `_`
  // Probably should update regexp & check speed
  e[e.length - 1] === "_");
}
function VO(e) {
  var t, n;
  return t = e.replace(/_/g, "").toLowerCase(), n = t[0] === "-" ? -1 : 1, "+-".indexOf(t[0]) >= 0 && (t = t.slice(1)), t === ".inf" ? n === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY : t === ".nan" ? NaN : n * parseFloat(t, 10);
}
var GO = /^[-+]?[0-9]+e/;
function WO(e, t) {
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
  else if (Jg.isNegativeZero(e))
    return "-0.0";
  return n = e.toString(10), GO.test(n) ? n.replace("e", ".e") : n;
}
function KO(e) {
  return Object.prototype.toString.call(e) === "[object Number]" && (e % 1 !== 0 || Jg.isNegativeZero(e));
}
var Yg = new HO("tag:yaml.org,2002:float", {
  kind: "scalar",
  resolve: zO,
  construct: VO,
  predicate: KO,
  represent: WO,
  defaultStyle: "lowercase"
}), Xg = Vg.extend({
  implicit: [
    Gg,
    Wg,
    Kg,
    Yg
  ]
}), Zg = Xg, JO = Pt, Qg = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
), ey = new RegExp(
  "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
);
function YO(e) {
  return e === null ? !1 : Qg.exec(e) !== null || ey.exec(e) !== null;
}
function XO(e) {
  var t, n, r, i, o, s, a, c = 0, u = null, l, f, h;
  if (t = Qg.exec(e), t === null && (t = ey.exec(e)), t === null) throw new Error("Date resolve error");
  if (n = +t[1], r = +t[2] - 1, i = +t[3], !t[4])
    return new Date(Date.UTC(n, r, i));
  if (o = +t[4], s = +t[5], a = +t[6], t[7]) {
    for (c = t[7].slice(0, 3); c.length < 3; )
      c += "0";
    c = +c;
  }
  return t[9] && (l = +t[10], f = +(t[11] || 0), u = (l * 60 + f) * 6e4, t[9] === "-" && (u = -u)), h = new Date(Date.UTC(n, r, i, o, s, a, c)), u && h.setTime(h.getTime() - u), h;
}
function ZO(e) {
  return e.toISOString();
}
var ty = new JO("tag:yaml.org,2002:timestamp", {
  kind: "scalar",
  resolve: YO,
  construct: XO,
  instanceOf: Date,
  represent: ZO
}), QO = Pt;
function eR(e) {
  return e === "<<" || e === null;
}
var ny = new QO("tag:yaml.org,2002:merge", {
  kind: "scalar",
  resolve: eR
}), tR = Pt, Yu = `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=
\r`;
function nR(e) {
  if (e === null) return !1;
  var t, n, r = 0, i = e.length, o = Yu;
  for (n = 0; n < i; n++)
    if (t = o.indexOf(e.charAt(n)), !(t > 64)) {
      if (t < 0) return !1;
      r += 6;
    }
  return r % 8 === 0;
}
function rR(e) {
  var t, n, r = e.replace(/[\r\n=]/g, ""), i = r.length, o = Yu, s = 0, a = [];
  for (t = 0; t < i; t++)
    t % 4 === 0 && t && (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)), s = s << 6 | o.indexOf(r.charAt(t));
  return n = i % 4 * 6, n === 0 ? (a.push(s >> 16 & 255), a.push(s >> 8 & 255), a.push(s & 255)) : n === 18 ? (a.push(s >> 10 & 255), a.push(s >> 2 & 255)) : n === 12 && a.push(s >> 4 & 255), new Uint8Array(a);
}
function iR(e) {
  var t = "", n = 0, r, i, o = e.length, s = Yu;
  for (r = 0; r < o; r++)
    r % 3 === 0 && r && (t += s[n >> 18 & 63], t += s[n >> 12 & 63], t += s[n >> 6 & 63], t += s[n & 63]), n = (n << 8) + e[r];
  return i = o % 3, i === 0 ? (t += s[n >> 18 & 63], t += s[n >> 12 & 63], t += s[n >> 6 & 63], t += s[n & 63]) : i === 2 ? (t += s[n >> 10 & 63], t += s[n >> 4 & 63], t += s[n << 2 & 63], t += s[64]) : i === 1 && (t += s[n >> 2 & 63], t += s[n << 4 & 63], t += s[64], t += s[64]), t;
}
function oR(e) {
  return Object.prototype.toString.call(e) === "[object Uint8Array]";
}
var ry = new tR("tag:yaml.org,2002:binary", {
  kind: "scalar",
  resolve: nR,
  construct: rR,
  predicate: oR,
  represent: iR
}), sR = Pt, aR = Object.prototype.hasOwnProperty, cR = Object.prototype.toString;
function lR(e) {
  if (e === null) return !0;
  var t = [], n, r, i, o, s, a = e;
  for (n = 0, r = a.length; n < r; n += 1) {
    if (i = a[n], s = !1, cR.call(i) !== "[object Object]") return !1;
    for (o in i)
      if (aR.call(i, o))
        if (!s) s = !0;
        else return !1;
    if (!s) return !1;
    if (t.indexOf(o) === -1) t.push(o);
    else return !1;
  }
  return !0;
}
function uR(e) {
  return e !== null ? e : [];
}
var iy = new sR("tag:yaml.org,2002:omap", {
  kind: "sequence",
  resolve: lR,
  construct: uR
}), fR = Pt, dR = Object.prototype.toString;
function hR(e) {
  if (e === null) return !0;
  var t, n, r, i, o, s = e;
  for (o = new Array(s.length), t = 0, n = s.length; t < n; t += 1) {
    if (r = s[t], dR.call(r) !== "[object Object]" || (i = Object.keys(r), i.length !== 1)) return !1;
    o[t] = [i[0], r[i[0]]];
  }
  return !0;
}
function pR(e) {
  if (e === null) return [];
  var t, n, r, i, o, s = e;
  for (o = new Array(s.length), t = 0, n = s.length; t < n; t += 1)
    r = s[t], i = Object.keys(r), o[t] = [i[0], r[i[0]]];
  return o;
}
var oy = new fR("tag:yaml.org,2002:pairs", {
  kind: "sequence",
  resolve: hR,
  construct: pR
}), mR = Pt, gR = Object.prototype.hasOwnProperty;
function yR(e) {
  if (e === null) return !0;
  var t, n = e;
  for (t in n)
    if (gR.call(n, t) && n[t] !== null)
      return !1;
  return !0;
}
function vR(e) {
  return e !== null ? e : {};
}
var sy = new mR("tag:yaml.org,2002:set", {
  kind: "mapping",
  resolve: yR,
  construct: vR
}), Xu = Zg.extend({
  implicit: [
    ty,
    ny
  ],
  explicit: [
    ry,
    iy,
    oy,
    sy
  ]
}), Nr = cn, ay = Ho, wR = gO, ER = Xu, ir = Object.prototype.hasOwnProperty, na = 1, cy = 2, ly = 3, ra = 4, Fc = 1, _R = 2, Eh = 3, $R = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/, SR = /[\x85\u2028\u2029]/, bR = /[,\[\]\{\}]/, uy = /^(?:!|!!|![a-z\-]+!)$/i, fy = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
function _h(e) {
  return Object.prototype.toString.call(e);
}
function mn(e) {
  return e === 10 || e === 13;
}
function xr(e) {
  return e === 9 || e === 32;
}
function kt(e) {
  return e === 9 || e === 32 || e === 10 || e === 13;
}
function ui(e) {
  return e === 44 || e === 91 || e === 93 || e === 123 || e === 125;
}
function AR(e) {
  var t;
  return 48 <= e && e <= 57 ? e - 48 : (t = e | 32, 97 <= t && t <= 102 ? t - 97 + 10 : -1);
}
function TR(e) {
  return e === 120 ? 2 : e === 117 ? 4 : e === 85 ? 8 : 0;
}
function CR(e) {
  return 48 <= e && e <= 57 ? e - 48 : -1;
}
function $h(e) {
  return e === 48 ? "\0" : e === 97 ? "\x07" : e === 98 ? "\b" : e === 116 || e === 9 ? "	" : e === 110 ? `
` : e === 118 ? "\v" : e === 102 ? "\f" : e === 114 ? "\r" : e === 101 ? "\x1B" : e === 32 ? " " : e === 34 ? '"' : e === 47 ? "/" : e === 92 ? "\\" : e === 78 ? "" : e === 95 ? " " : e === 76 ? "\u2028" : e === 80 ? "\u2029" : "";
}
function NR(e) {
  return e <= 65535 ? String.fromCharCode(e) : String.fromCharCode(
    (e - 65536 >> 10) + 55296,
    (e - 65536 & 1023) + 56320
  );
}
function dy(e, t, n) {
  t === "__proto__" ? Object.defineProperty(e, t, {
    configurable: !0,
    enumerable: !0,
    writable: !0,
    value: n
  }) : e[t] = n;
}
var hy = new Array(256), py = new Array(256);
for (var Qr = 0; Qr < 256; Qr++)
  hy[Qr] = $h(Qr) ? 1 : 0, py[Qr] = $h(Qr);
function IR(e, t) {
  this.input = e, this.filename = t.filename || null, this.schema = t.schema || ER, this.onWarning = t.onWarning || null, this.legacy = t.legacy || !1, this.json = t.json || !1, this.listener = t.listener || null, this.implicitTypes = this.schema.compiledImplicit, this.typeMap = this.schema.compiledTypeMap, this.length = e.length, this.position = 0, this.line = 0, this.lineStart = 0, this.lineIndent = 0, this.firstTabInLine = -1, this.documents = [];
}
function my(e, t) {
  var n = {
    name: e.filename,
    buffer: e.input.slice(0, -1),
    // omit trailing \0
    position: e.position,
    line: e.line,
    column: e.position - e.lineStart
  };
  return n.snippet = wR(n), new ay(t, n);
}
function ce(e, t) {
  throw my(e, t);
}
function ia(e, t) {
  e.onWarning && e.onWarning.call(null, my(e, t));
}
var Sh = {
  YAML: function(t, n, r) {
    var i, o, s;
    t.version !== null && ce(t, "duplication of %YAML directive"), r.length !== 1 && ce(t, "YAML directive accepts exactly one argument"), i = /^([0-9]+)\.([0-9]+)$/.exec(r[0]), i === null && ce(t, "ill-formed argument of the YAML directive"), o = parseInt(i[1], 10), s = parseInt(i[2], 10), o !== 1 && ce(t, "unacceptable YAML version of the document"), t.version = r[0], t.checkLineBreaks = s < 2, s !== 1 && s !== 2 && ia(t, "unsupported YAML version of the document");
  },
  TAG: function(t, n, r) {
    var i, o;
    r.length !== 2 && ce(t, "TAG directive accepts exactly two arguments"), i = r[0], o = r[1], uy.test(i) || ce(t, "ill-formed tag handle (first argument) of the TAG directive"), ir.call(t.tagMap, i) && ce(t, 'there is a previously declared suffix for "' + i + '" tag handle'), fy.test(o) || ce(t, "ill-formed tag prefix (second argument) of the TAG directive");
    try {
      o = decodeURIComponent(o);
    } catch {
      ce(t, "tag prefix is malformed: " + o);
    }
    t.tagMap[i] = o;
  }
};
function tr(e, t, n, r) {
  var i, o, s, a;
  if (t < n) {
    if (a = e.input.slice(t, n), r)
      for (i = 0, o = a.length; i < o; i += 1)
        s = a.charCodeAt(i), s === 9 || 32 <= s && s <= 1114111 || ce(e, "expected valid JSON character");
    else $R.test(a) && ce(e, "the stream contains non-printable characters");
    e.result += a;
  }
}
function bh(e, t, n, r) {
  var i, o, s, a;
  for (Nr.isObject(n) || ce(e, "cannot merge mappings; the provided source object is unacceptable"), i = Object.keys(n), s = 0, a = i.length; s < a; s += 1)
    o = i[s], ir.call(t, o) || (dy(t, o, n[o]), r[o] = !0);
}
function fi(e, t, n, r, i, o, s, a, c) {
  var u, l;
  if (Array.isArray(i))
    for (i = Array.prototype.slice.call(i), u = 0, l = i.length; u < l; u += 1)
      Array.isArray(i[u]) && ce(e, "nested arrays are not supported inside keys"), typeof i == "object" && _h(i[u]) === "[object Object]" && (i[u] = "[object Object]");
  if (typeof i == "object" && _h(i) === "[object Object]" && (i = "[object Object]"), i = String(i), t === null && (t = {}), r === "tag:yaml.org,2002:merge")
    if (Array.isArray(o))
      for (u = 0, l = o.length; u < l; u += 1)
        bh(e, t, o[u], n);
    else
      bh(e, t, o, n);
  else
    !e.json && !ir.call(n, i) && ir.call(t, i) && (e.line = s || e.line, e.lineStart = a || e.lineStart, e.position = c || e.position, ce(e, "duplicated mapping key")), dy(t, i, o), delete n[i];
  return t;
}
function Zu(e) {
  var t;
  t = e.input.charCodeAt(e.position), t === 10 ? e.position++ : t === 13 ? (e.position++, e.input.charCodeAt(e.position) === 10 && e.position++) : ce(e, "a line break is expected"), e.line += 1, e.lineStart = e.position, e.firstTabInLine = -1;
}
function Je(e, t, n) {
  for (var r = 0, i = e.input.charCodeAt(e.position); i !== 0; ) {
    for (; xr(i); )
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
  return n !== -1 && r !== 0 && e.lineIndent < n && ia(e, "deficient indentation"), r;
}
function Ua(e) {
  var t = e.position, n;
  return n = e.input.charCodeAt(t), !!((n === 45 || n === 46) && n === e.input.charCodeAt(t + 1) && n === e.input.charCodeAt(t + 2) && (t += 3, n = e.input.charCodeAt(t), n === 0 || kt(n)));
}
function Qu(e, t) {
  t === 1 ? e.result += " " : t > 1 && (e.result += Nr.repeat(`
`, t - 1));
}
function PR(e, t, n) {
  var r, i, o, s, a, c, u, l, f = e.kind, h = e.result, d;
  if (d = e.input.charCodeAt(e.position), kt(d) || ui(d) || d === 35 || d === 38 || d === 42 || d === 33 || d === 124 || d === 62 || d === 39 || d === 34 || d === 37 || d === 64 || d === 96 || (d === 63 || d === 45) && (i = e.input.charCodeAt(e.position + 1), kt(i) || n && ui(i)))
    return !1;
  for (e.kind = "scalar", e.result = "", o = s = e.position, a = !1; d !== 0; ) {
    if (d === 58) {
      if (i = e.input.charCodeAt(e.position + 1), kt(i) || n && ui(i))
        break;
    } else if (d === 35) {
      if (r = e.input.charCodeAt(e.position - 1), kt(r))
        break;
    } else {
      if (e.position === e.lineStart && Ua(e) || n && ui(d))
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
    a && (tr(e, o, s, !1), Qu(e, e.line - c), o = s = e.position, a = !1), xr(d) || (s = e.position + 1), d = e.input.charCodeAt(++e.position);
  }
  return tr(e, o, s, !1), e.result ? !0 : (e.kind = f, e.result = h, !1);
}
function OR(e, t) {
  var n, r, i;
  if (n = e.input.charCodeAt(e.position), n !== 39)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, r = i = e.position; (n = e.input.charCodeAt(e.position)) !== 0; )
    if (n === 39)
      if (tr(e, r, e.position, !0), n = e.input.charCodeAt(++e.position), n === 39)
        r = e.position, e.position++, i = e.position;
      else
        return !0;
    else mn(n) ? (tr(e, r, i, !0), Qu(e, Je(e, !1, t)), r = i = e.position) : e.position === e.lineStart && Ua(e) ? ce(e, "unexpected end of the document within a single quoted scalar") : (e.position++, i = e.position);
  ce(e, "unexpected end of the stream within a single quoted scalar");
}
function RR(e, t) {
  var n, r, i, o, s, a;
  if (a = e.input.charCodeAt(e.position), a !== 34)
    return !1;
  for (e.kind = "scalar", e.result = "", e.position++, n = r = e.position; (a = e.input.charCodeAt(e.position)) !== 0; ) {
    if (a === 34)
      return tr(e, n, e.position, !0), e.position++, !0;
    if (a === 92) {
      if (tr(e, n, e.position, !0), a = e.input.charCodeAt(++e.position), mn(a))
        Je(e, !1, t);
      else if (a < 256 && hy[a])
        e.result += py[a], e.position++;
      else if ((s = TR(a)) > 0) {
        for (i = s, o = 0; i > 0; i--)
          a = e.input.charCodeAt(++e.position), (s = AR(a)) >= 0 ? o = (o << 4) + s : ce(e, "expected hexadecimal character");
        e.result += NR(o), e.position++;
      } else
        ce(e, "unknown escape sequence");
      n = r = e.position;
    } else mn(a) ? (tr(e, n, r, !0), Qu(e, Je(e, !1, t)), n = r = e.position) : e.position === e.lineStart && Ua(e) ? ce(e, "unexpected end of the document within a double quoted scalar") : (e.position++, r = e.position);
  }
  ce(e, "unexpected end of the stream within a double quoted scalar");
}
function DR(e, t) {
  var n = !0, r, i, o, s = e.tag, a, c = e.anchor, u, l, f, h, d, m = /* @__PURE__ */ Object.create(null), p, w, E, y;
  if (y = e.input.charCodeAt(e.position), y === 91)
    l = 93, d = !1, a = [];
  else if (y === 123)
    l = 125, d = !0, a = {};
  else
    return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = a), y = e.input.charCodeAt(++e.position); y !== 0; ) {
    if (Je(e, !0, t), y = e.input.charCodeAt(e.position), y === l)
      return e.position++, e.tag = s, e.anchor = c, e.kind = d ? "mapping" : "sequence", e.result = a, !0;
    n ? y === 44 && ce(e, "expected the node content, but found ','") : ce(e, "missed comma between flow collection entries"), w = p = E = null, f = h = !1, y === 63 && (u = e.input.charCodeAt(e.position + 1), kt(u) && (f = h = !0, e.position++, Je(e, !0, t))), r = e.line, i = e.lineStart, o = e.position, $i(e, t, na, !1, !0), w = e.tag, p = e.result, Je(e, !0, t), y = e.input.charCodeAt(e.position), (h || e.line === r) && y === 58 && (f = !0, y = e.input.charCodeAt(++e.position), Je(e, !0, t), $i(e, t, na, !1, !0), E = e.result), d ? fi(e, a, m, w, p, E, r, i, o) : f ? a.push(fi(e, null, m, w, p, E, r, i, o)) : a.push(p), Je(e, !0, t), y = e.input.charCodeAt(e.position), y === 44 ? (n = !0, y = e.input.charCodeAt(++e.position)) : n = !1;
  }
  ce(e, "unexpected end of the stream within a flow collection");
}
function FR(e, t) {
  var n, r, i = Fc, o = !1, s = !1, a = t, c = 0, u = !1, l, f;
  if (f = e.input.charCodeAt(e.position), f === 124)
    r = !1;
  else if (f === 62)
    r = !0;
  else
    return !1;
  for (e.kind = "scalar", e.result = ""; f !== 0; )
    if (f = e.input.charCodeAt(++e.position), f === 43 || f === 45)
      Fc === i ? i = f === 43 ? Eh : _R : ce(e, "repeat of a chomping mode identifier");
    else if ((l = CR(f)) >= 0)
      l === 0 ? ce(e, "bad explicit indentation width of a block scalar; it cannot be less than one") : s ? ce(e, "repeat of an indentation width identifier") : (a = t + l - 1, s = !0);
    else
      break;
  if (xr(f)) {
    do
      f = e.input.charCodeAt(++e.position);
    while (xr(f));
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
      i === Eh ? e.result += Nr.repeat(`
`, o ? 1 + c : c) : i === Fc && o && (e.result += `
`);
      break;
    }
    for (r ? xr(f) ? (u = !0, e.result += Nr.repeat(`
`, o ? 1 + c : c)) : u ? (u = !1, e.result += Nr.repeat(`
`, c + 1)) : c === 0 ? o && (e.result += " ") : e.result += Nr.repeat(`
`, c) : e.result += Nr.repeat(`
`, o ? 1 + c : c), o = !0, s = !0, c = 0, n = e.position; !mn(f) && f !== 0; )
      f = e.input.charCodeAt(++e.position);
    tr(e, n, e.position, !1);
  }
  return !0;
}
function Ah(e, t) {
  var n, r = e.tag, i = e.anchor, o = [], s, a = !1, c;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = o), c = e.input.charCodeAt(e.position); c !== 0 && (e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, ce(e, "tab characters must not be used in indentation")), !(c !== 45 || (s = e.input.charCodeAt(e.position + 1), !kt(s)))); ) {
    if (a = !0, e.position++, Je(e, !0, -1) && e.lineIndent <= t) {
      o.push(null), c = e.input.charCodeAt(e.position);
      continue;
    }
    if (n = e.line, $i(e, t, ly, !1, !0), o.push(e.result), Je(e, !0, -1), c = e.input.charCodeAt(e.position), (e.line === n || e.lineIndent > t) && c !== 0)
      ce(e, "bad indentation of a sequence entry");
    else if (e.lineIndent < t)
      break;
  }
  return a ? (e.tag = r, e.anchor = i, e.kind = "sequence", e.result = o, !0) : !1;
}
function LR(e, t, n) {
  var r, i, o, s, a, c, u = e.tag, l = e.anchor, f = {}, h = /* @__PURE__ */ Object.create(null), d = null, m = null, p = null, w = !1, E = !1, y;
  if (e.firstTabInLine !== -1) return !1;
  for (e.anchor !== null && (e.anchorMap[e.anchor] = f), y = e.input.charCodeAt(e.position); y !== 0; ) {
    if (!w && e.firstTabInLine !== -1 && (e.position = e.firstTabInLine, ce(e, "tab characters must not be used in indentation")), r = e.input.charCodeAt(e.position + 1), o = e.line, (y === 63 || y === 58) && kt(r))
      y === 63 ? (w && (fi(e, f, h, d, m, null, s, a, c), d = m = p = null), E = !0, w = !0, i = !0) : w ? (w = !1, i = !0) : ce(e, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line"), e.position += 1, y = r;
    else {
      if (s = e.line, a = e.lineStart, c = e.position, !$i(e, n, cy, !1, !0))
        break;
      if (e.line === o) {
        for (y = e.input.charCodeAt(e.position); xr(y); )
          y = e.input.charCodeAt(++e.position);
        if (y === 58)
          y = e.input.charCodeAt(++e.position), kt(y) || ce(e, "a whitespace character is expected after the key-value separator within a block mapping"), w && (fi(e, f, h, d, m, null, s, a, c), d = m = p = null), E = !0, w = !1, i = !1, d = e.tag, m = e.result;
        else if (E)
          ce(e, "can not read an implicit mapping pair; a colon is missed");
        else
          return e.tag = u, e.anchor = l, !0;
      } else if (E)
        ce(e, "can not read a block mapping entry; a multiline key may not be an implicit key");
      else
        return e.tag = u, e.anchor = l, !0;
    }
    if ((e.line === o || e.lineIndent > t) && (w && (s = e.line, a = e.lineStart, c = e.position), $i(e, t, ra, !0, i) && (w ? m = e.result : p = e.result), w || (fi(e, f, h, d, m, p, s, a, c), d = m = p = null), Je(e, !0, -1), y = e.input.charCodeAt(e.position)), (e.line === o || e.lineIndent > t) && y !== 0)
      ce(e, "bad indentation of a mapping entry");
    else if (e.lineIndent < t)
      break;
  }
  return w && fi(e, f, h, d, m, null, s, a, c), E && (e.tag = u, e.anchor = l, e.kind = "mapping", e.result = f), E;
}
function xR(e) {
  var t, n = !1, r = !1, i, o, s;
  if (s = e.input.charCodeAt(e.position), s !== 33) return !1;
  if (e.tag !== null && ce(e, "duplication of a tag property"), s = e.input.charCodeAt(++e.position), s === 60 ? (n = !0, s = e.input.charCodeAt(++e.position)) : s === 33 ? (r = !0, i = "!!", s = e.input.charCodeAt(++e.position)) : i = "!", t = e.position, n) {
    do
      s = e.input.charCodeAt(++e.position);
    while (s !== 0 && s !== 62);
    e.position < e.length ? (o = e.input.slice(t, e.position), s = e.input.charCodeAt(++e.position)) : ce(e, "unexpected end of the stream within a verbatim tag");
  } else {
    for (; s !== 0 && !kt(s); )
      s === 33 && (r ? ce(e, "tag suffix cannot contain exclamation marks") : (i = e.input.slice(t - 1, e.position + 1), uy.test(i) || ce(e, "named tag handle cannot contain such characters"), r = !0, t = e.position + 1)), s = e.input.charCodeAt(++e.position);
    o = e.input.slice(t, e.position), bR.test(o) && ce(e, "tag suffix cannot contain flow indicator characters");
  }
  o && !fy.test(o) && ce(e, "tag name cannot contain such characters: " + o);
  try {
    o = decodeURIComponent(o);
  } catch {
    ce(e, "tag name is malformed: " + o);
  }
  return n ? e.tag = o : ir.call(e.tagMap, i) ? e.tag = e.tagMap[i] + o : i === "!" ? e.tag = "!" + o : i === "!!" ? e.tag = "tag:yaml.org,2002:" + o : ce(e, 'undeclared tag handle "' + i + '"'), !0;
}
function kR(e) {
  var t, n;
  if (n = e.input.charCodeAt(e.position), n !== 38) return !1;
  for (e.anchor !== null && ce(e, "duplication of an anchor property"), n = e.input.charCodeAt(++e.position), t = e.position; n !== 0 && !kt(n) && !ui(n); )
    n = e.input.charCodeAt(++e.position);
  return e.position === t && ce(e, "name of an anchor node must contain at least one character"), e.anchor = e.input.slice(t, e.position), !0;
}
function UR(e) {
  var t, n, r;
  if (r = e.input.charCodeAt(e.position), r !== 42) return !1;
  for (r = e.input.charCodeAt(++e.position), t = e.position; r !== 0 && !kt(r) && !ui(r); )
    r = e.input.charCodeAt(++e.position);
  return e.position === t && ce(e, "name of an alias node must contain at least one character"), n = e.input.slice(t, e.position), ir.call(e.anchorMap, n) || ce(e, 'unidentified alias "' + n + '"'), e.result = e.anchorMap[n], Je(e, !0, -1), !0;
}
function $i(e, t, n, r, i) {
  var o, s, a, c = 1, u = !1, l = !1, f, h, d, m, p, w;
  if (e.listener !== null && e.listener("open", e), e.tag = null, e.anchor = null, e.kind = null, e.result = null, o = s = a = ra === n || ly === n, r && Je(e, !0, -1) && (u = !0, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)), c === 1)
    for (; xR(e) || kR(e); )
      Je(e, !0, -1) ? (u = !0, a = o, e.lineIndent > t ? c = 1 : e.lineIndent === t ? c = 0 : e.lineIndent < t && (c = -1)) : a = !1;
  if (a && (a = u || i), (c === 1 || ra === n) && (na === n || cy === n ? p = t : p = t + 1, w = e.position - e.lineStart, c === 1 ? a && (Ah(e, w) || LR(e, w, p)) || DR(e, p) ? l = !0 : (s && FR(e, p) || OR(e, p) || RR(e, p) ? l = !0 : UR(e) ? (l = !0, (e.tag !== null || e.anchor !== null) && ce(e, "alias node should not have any properties")) : PR(e, p, na === n) && (l = !0, e.tag === null && (e.tag = "?")), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : c === 0 && (l = a && Ah(e, w))), e.tag === null)
    e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
  else if (e.tag === "?") {
    for (e.result !== null && e.kind !== "scalar" && ce(e, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + e.kind + '"'), f = 0, h = e.implicitTypes.length; f < h; f += 1)
      if (m = e.implicitTypes[f], m.resolve(e.result)) {
        e.result = m.construct(e.result), e.tag = m.tag, e.anchor !== null && (e.anchorMap[e.anchor] = e.result);
        break;
      }
  } else if (e.tag !== "!") {
    if (ir.call(e.typeMap[e.kind || "fallback"], e.tag))
      m = e.typeMap[e.kind || "fallback"][e.tag];
    else
      for (m = null, d = e.typeMap.multi[e.kind || "fallback"], f = 0, h = d.length; f < h; f += 1)
        if (e.tag.slice(0, d[f].tag.length) === d[f].tag) {
          m = d[f];
          break;
        }
    m || ce(e, "unknown tag !<" + e.tag + ">"), e.result !== null && m.kind !== e.kind && ce(e, "unacceptable node kind for !<" + e.tag + '> tag; it should be "' + m.kind + '", not "' + e.kind + '"'), m.resolve(e.result, e.tag) ? (e.result = m.construct(e.result, e.tag), e.anchor !== null && (e.anchorMap[e.anchor] = e.result)) : ce(e, "cannot resolve a node with !<" + e.tag + "> explicit tag");
  }
  return e.listener !== null && e.listener("close", e), e.tag !== null || e.anchor !== null || l;
}
function jR(e) {
  var t = e.position, n, r, i, o = !1, s;
  for (e.version = null, e.checkLineBreaks = e.legacy, e.tagMap = /* @__PURE__ */ Object.create(null), e.anchorMap = /* @__PURE__ */ Object.create(null); (s = e.input.charCodeAt(e.position)) !== 0 && (Je(e, !0, -1), s = e.input.charCodeAt(e.position), !(e.lineIndent > 0 || s !== 37)); ) {
    for (o = !0, s = e.input.charCodeAt(++e.position), n = e.position; s !== 0 && !kt(s); )
      s = e.input.charCodeAt(++e.position);
    for (r = e.input.slice(n, e.position), i = [], r.length < 1 && ce(e, "directive name must not be less than one character in length"); s !== 0; ) {
      for (; xr(s); )
        s = e.input.charCodeAt(++e.position);
      if (s === 35) {
        do
          s = e.input.charCodeAt(++e.position);
        while (s !== 0 && !mn(s));
        break;
      }
      if (mn(s)) break;
      for (n = e.position; s !== 0 && !kt(s); )
        s = e.input.charCodeAt(++e.position);
      i.push(e.input.slice(n, e.position));
    }
    s !== 0 && Zu(e), ir.call(Sh, r) ? Sh[r](e, r, i) : ia(e, 'unknown document directive "' + r + '"');
  }
  if (Je(e, !0, -1), e.lineIndent === 0 && e.input.charCodeAt(e.position) === 45 && e.input.charCodeAt(e.position + 1) === 45 && e.input.charCodeAt(e.position + 2) === 45 ? (e.position += 3, Je(e, !0, -1)) : o && ce(e, "directives end mark is expected"), $i(e, e.lineIndent - 1, ra, !1, !0), Je(e, !0, -1), e.checkLineBreaks && SR.test(e.input.slice(t, e.position)) && ia(e, "non-ASCII line breaks are interpreted as content"), e.documents.push(e.result), e.position === e.lineStart && Ua(e)) {
    e.input.charCodeAt(e.position) === 46 && (e.position += 3, Je(e, !0, -1));
    return;
  }
  if (e.position < e.length - 1)
    ce(e, "end of the stream or a document separator is expected");
  else
    return;
}
function gy(e, t) {
  e = String(e), t = t || {}, e.length !== 0 && (e.charCodeAt(e.length - 1) !== 10 && e.charCodeAt(e.length - 1) !== 13 && (e += `
`), e.charCodeAt(0) === 65279 && (e = e.slice(1)));
  var n = new IR(e, t), r = e.indexOf("\0");
  for (r !== -1 && (n.position = r, ce(n, "null byte is not allowed in input")), n.input += "\0"; n.input.charCodeAt(n.position) === 32; )
    n.lineIndent += 1, n.position += 1;
  for (; n.position < n.length - 1; )
    jR(n);
  return n.documents;
}
function MR(e, t, n) {
  t !== null && typeof t == "object" && typeof n > "u" && (n = t, t = null);
  var r = gy(e, n);
  if (typeof t != "function")
    return r;
  for (var i = 0, o = r.length; i < o; i += 1)
    t(r[i]);
}
function BR(e, t) {
  var n = gy(e, t);
  if (n.length !== 0) {
    if (n.length === 1)
      return n[0];
    throw new ay("expected a single document in the stream, but found more");
  }
}
Ju.loadAll = MR;
Ju.load = BR;
var yy = {}, ja = cn, qo = Ho, HR = Xu, vy = Object.prototype.toString, wy = Object.prototype.hasOwnProperty, ef = 65279, qR = 9, _o = 10, zR = 13, VR = 32, GR = 33, WR = 34, vl = 35, KR = 37, JR = 38, YR = 39, XR = 42, Ey = 44, ZR = 45, oa = 58, QR = 61, eD = 62, tD = 63, nD = 64, _y = 91, $y = 93, rD = 96, Sy = 123, iD = 124, by = 125, wt = {};
wt[0] = "\\0";
wt[7] = "\\a";
wt[8] = "\\b";
wt[9] = "\\t";
wt[10] = "\\n";
wt[11] = "\\v";
wt[12] = "\\f";
wt[13] = "\\r";
wt[27] = "\\e";
wt[34] = '\\"';
wt[92] = "\\\\";
wt[133] = "\\N";
wt[160] = "\\_";
wt[8232] = "\\L";
wt[8233] = "\\P";
var oD = [
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
], sD = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
function aD(e, t) {
  var n, r, i, o, s, a, c;
  if (t === null) return {};
  for (n = {}, r = Object.keys(t), i = 0, o = r.length; i < o; i += 1)
    s = r[i], a = String(t[s]), s.slice(0, 2) === "!!" && (s = "tag:yaml.org,2002:" + s.slice(2)), c = e.compiledTypeMap.fallback[s], c && wy.call(c.styleAliases, a) && (a = c.styleAliases[a]), n[s] = a;
  return n;
}
function cD(e) {
  var t, n, r;
  if (t = e.toString(16).toUpperCase(), e <= 255)
    n = "x", r = 2;
  else if (e <= 65535)
    n = "u", r = 4;
  else if (e <= 4294967295)
    n = "U", r = 8;
  else
    throw new qo("code point within a string may not be greater than 0xFFFFFFFF");
  return "\\" + n + ja.repeat("0", r - t.length) + t;
}
var lD = 1, $o = 2;
function uD(e) {
  this.schema = e.schema || HR, this.indent = Math.max(1, e.indent || 2), this.noArrayIndent = e.noArrayIndent || !1, this.skipInvalid = e.skipInvalid || !1, this.flowLevel = ja.isNothing(e.flowLevel) ? -1 : e.flowLevel, this.styleMap = aD(this.schema, e.styles || null), this.sortKeys = e.sortKeys || !1, this.lineWidth = e.lineWidth || 80, this.noRefs = e.noRefs || !1, this.noCompatMode = e.noCompatMode || !1, this.condenseFlow = e.condenseFlow || !1, this.quotingType = e.quotingType === '"' ? $o : lD, this.forceQuotes = e.forceQuotes || !1, this.replacer = typeof e.replacer == "function" ? e.replacer : null, this.implicitTypes = this.schema.compiledImplicit, this.explicitTypes = this.schema.compiledExplicit, this.tag = null, this.result = "", this.duplicates = [], this.usedDuplicates = null;
}
function Th(e, t) {
  for (var n = ja.repeat(" ", t), r = 0, i = -1, o = "", s, a = e.length; r < a; )
    i = e.indexOf(`
`, r), i === -1 ? (s = e.slice(r), r = a) : (s = e.slice(r, i + 1), r = i + 1), s.length && s !== `
` && (o += n), o += s;
  return o;
}
function wl(e, t) {
  return `
` + ja.repeat(" ", e.indent * t);
}
function fD(e, t) {
  var n, r, i;
  for (n = 0, r = e.implicitTypes.length; n < r; n += 1)
    if (i = e.implicitTypes[n], i.resolve(t))
      return !0;
  return !1;
}
function sa(e) {
  return e === VR || e === qR;
}
function So(e) {
  return 32 <= e && e <= 126 || 161 <= e && e <= 55295 && e !== 8232 && e !== 8233 || 57344 <= e && e <= 65533 && e !== ef || 65536 <= e && e <= 1114111;
}
function Ch(e) {
  return So(e) && e !== ef && e !== zR && e !== _o;
}
function Nh(e, t, n) {
  var r = Ch(e), i = r && !sa(e);
  return (
    // ns-plain-safe
    (n ? (
      // c = flow-in
      r
    ) : r && e !== Ey && e !== _y && e !== $y && e !== Sy && e !== by) && e !== vl && !(t === oa && !i) || Ch(t) && !sa(t) && e === vl || t === oa && i
  );
}
function dD(e) {
  return So(e) && e !== ef && !sa(e) && e !== ZR && e !== tD && e !== oa && e !== Ey && e !== _y && e !== $y && e !== Sy && e !== by && e !== vl && e !== JR && e !== XR && e !== GR && e !== iD && e !== QR && e !== eD && e !== YR && e !== WR && e !== KR && e !== nD && e !== rD;
}
function hD(e) {
  return !sa(e) && e !== oa;
}
function no(e, t) {
  var n = e.charCodeAt(t), r;
  return n >= 55296 && n <= 56319 && t + 1 < e.length && (r = e.charCodeAt(t + 1), r >= 56320 && r <= 57343) ? (n - 55296) * 1024 + r - 56320 + 65536 : n;
}
function Ay(e) {
  var t = /^\n* /;
  return t.test(e);
}
var Ty = 1, El = 2, Cy = 3, Ny = 4, oi = 5;
function pD(e, t, n, r, i, o, s, a) {
  var c, u = 0, l = null, f = !1, h = !1, d = r !== -1, m = -1, p = dD(no(e, 0)) && hD(no(e, e.length - 1));
  if (t || s)
    for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
      if (u = no(e, c), !So(u))
        return oi;
      p = p && Nh(u, l, a), l = u;
    }
  else {
    for (c = 0; c < e.length; u >= 65536 ? c += 2 : c++) {
      if (u = no(e, c), u === _o)
        f = !0, d && (h = h || // Foldable line = too long, and not more-indented.
        c - m - 1 > r && e[m + 1] !== " ", m = c);
      else if (!So(u))
        return oi;
      p = p && Nh(u, l, a), l = u;
    }
    h = h || d && c - m - 1 > r && e[m + 1] !== " ";
  }
  return !f && !h ? p && !s && !i(e) ? Ty : o === $o ? oi : El : n > 9 && Ay(e) ? oi : s ? o === $o ? oi : El : h ? Ny : Cy;
}
function mD(e, t, n, r, i) {
  e.dump = function() {
    if (t.length === 0)
      return e.quotingType === $o ? '""' : "''";
    if (!e.noCompatMode && (oD.indexOf(t) !== -1 || sD.test(t)))
      return e.quotingType === $o ? '"' + t + '"' : "'" + t + "'";
    var o = e.indent * Math.max(1, n), s = e.lineWidth === -1 ? -1 : Math.max(Math.min(e.lineWidth, 40), e.lineWidth - o), a = r || e.flowLevel > -1 && n >= e.flowLevel;
    function c(u) {
      return fD(e, u);
    }
    switch (pD(
      t,
      a,
      e.indent,
      s,
      c,
      e.quotingType,
      e.forceQuotes && !r,
      i
    )) {
      case Ty:
        return t;
      case El:
        return "'" + t.replace(/'/g, "''") + "'";
      case Cy:
        return "|" + Ih(t, e.indent) + Ph(Th(t, o));
      case Ny:
        return ">" + Ih(t, e.indent) + Ph(Th(gD(t, s), o));
      case oi:
        return '"' + yD(t) + '"';
      default:
        throw new qo("impossible error: invalid scalar style");
    }
  }();
}
function Ih(e, t) {
  var n = Ay(e) ? String(t) : "", r = e[e.length - 1] === `
`, i = r && (e[e.length - 2] === `
` || e === `
`), o = i ? "+" : r ? "" : "-";
  return n + o + `
`;
}
function Ph(e) {
  return e[e.length - 1] === `
` ? e.slice(0, -1) : e;
}
function gD(e, t) {
  for (var n = /(\n+)([^\n]*)/g, r = function() {
    var u = e.indexOf(`
`);
    return u = u !== -1 ? u : e.length, n.lastIndex = u, Oh(e.slice(0, u), t);
  }(), i = e[0] === `
` || e[0] === " ", o, s; s = n.exec(e); ) {
    var a = s[1], c = s[2];
    o = c[0] === " ", r += a + (!i && !o && c !== "" ? `
` : "") + Oh(c, t), i = o;
  }
  return r;
}
function Oh(e, t) {
  if (e === "" || e[0] === " ") return e;
  for (var n = / [^ ]/g, r, i = 0, o, s = 0, a = 0, c = ""; r = n.exec(e); )
    a = r.index, a - i > t && (o = s > i ? s : a, c += `
` + e.slice(i, o), i = o + 1), s = a;
  return c += `
`, e.length - i > t && s > i ? c += e.slice(i, s) + `
` + e.slice(s + 1) : c += e.slice(i), c.slice(1);
}
function yD(e) {
  for (var t = "", n = 0, r, i = 0; i < e.length; n >= 65536 ? i += 2 : i++)
    n = no(e, i), r = wt[n], !r && So(n) ? (t += e[i], n >= 65536 && (t += e[i + 1])) : t += r || cD(n);
  return t;
}
function vD(e, t, n) {
  var r = "", i = e.tag, o, s, a;
  for (o = 0, s = n.length; o < s; o += 1)
    a = n[o], e.replacer && (a = e.replacer.call(n, String(o), a)), (Rn(e, t, a, !1, !1) || typeof a > "u" && Rn(e, t, null, !1, !1)) && (r !== "" && (r += "," + (e.condenseFlow ? "" : " ")), r += e.dump);
  e.tag = i, e.dump = "[" + r + "]";
}
function Rh(e, t, n, r) {
  var i = "", o = e.tag, s, a, c;
  for (s = 0, a = n.length; s < a; s += 1)
    c = n[s], e.replacer && (c = e.replacer.call(n, String(s), c)), (Rn(e, t + 1, c, !0, !0, !1, !0) || typeof c > "u" && Rn(e, t + 1, null, !0, !0, !1, !0)) && ((!r || i !== "") && (i += wl(e, t)), e.dump && _o === e.dump.charCodeAt(0) ? i += "-" : i += "- ", i += e.dump);
  e.tag = o, e.dump = i || "[]";
}
function wD(e, t, n) {
  var r = "", i = e.tag, o = Object.keys(n), s, a, c, u, l;
  for (s = 0, a = o.length; s < a; s += 1)
    l = "", r !== "" && (l += ", "), e.condenseFlow && (l += '"'), c = o[s], u = n[c], e.replacer && (u = e.replacer.call(n, c, u)), Rn(e, t, c, !1, !1) && (e.dump.length > 1024 && (l += "? "), l += e.dump + (e.condenseFlow ? '"' : "") + ":" + (e.condenseFlow ? "" : " "), Rn(e, t, u, !1, !1) && (l += e.dump, r += l));
  e.tag = i, e.dump = "{" + r + "}";
}
function ED(e, t, n, r) {
  var i = "", o = e.tag, s = Object.keys(n), a, c, u, l, f, h;
  if (e.sortKeys === !0)
    s.sort();
  else if (typeof e.sortKeys == "function")
    s.sort(e.sortKeys);
  else if (e.sortKeys)
    throw new qo("sortKeys must be a boolean or a function");
  for (a = 0, c = s.length; a < c; a += 1)
    h = "", (!r || i !== "") && (h += wl(e, t)), u = s[a], l = n[u], e.replacer && (l = e.replacer.call(n, u, l)), Rn(e, t + 1, u, !0, !0, !0) && (f = e.tag !== null && e.tag !== "?" || e.dump && e.dump.length > 1024, f && (e.dump && _o === e.dump.charCodeAt(0) ? h += "?" : h += "? "), h += e.dump, f && (h += wl(e, t)), Rn(e, t + 1, l, !0, f) && (e.dump && _o === e.dump.charCodeAt(0) ? h += ":" : h += ": ", h += e.dump, i += h));
  e.tag = o, e.dump = i || "{}";
}
function Dh(e, t, n) {
  var r, i, o, s, a, c;
  for (i = n ? e.explicitTypes : e.implicitTypes, o = 0, s = i.length; o < s; o += 1)
    if (a = i[o], (a.instanceOf || a.predicate) && (!a.instanceOf || typeof t == "object" && t instanceof a.instanceOf) && (!a.predicate || a.predicate(t))) {
      if (n ? a.multi && a.representName ? e.tag = a.representName(t) : e.tag = a.tag : e.tag = "?", a.represent) {
        if (c = e.styleMap[a.tag] || a.defaultStyle, vy.call(a.represent) === "[object Function]")
          r = a.represent(t, c);
        else if (wy.call(a.represent, c))
          r = a.represent[c](t, c);
        else
          throw new qo("!<" + a.tag + '> tag resolver accepts not "' + c + '" style');
        e.dump = r;
      }
      return !0;
    }
  return !1;
}
function Rn(e, t, n, r, i, o, s) {
  e.tag = null, e.dump = n, Dh(e, n, !1) || Dh(e, n, !0);
  var a = vy.call(e.dump), c = r, u;
  r && (r = e.flowLevel < 0 || e.flowLevel > t);
  var l = a === "[object Object]" || a === "[object Array]", f, h;
  if (l && (f = e.duplicates.indexOf(n), h = f !== -1), (e.tag !== null && e.tag !== "?" || h || e.indent !== 2 && t > 0) && (i = !1), h && e.usedDuplicates[f])
    e.dump = "*ref_" + f;
  else {
    if (l && h && !e.usedDuplicates[f] && (e.usedDuplicates[f] = !0), a === "[object Object]")
      r && Object.keys(e.dump).length !== 0 ? (ED(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (wD(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (a === "[object Array]")
      r && e.dump.length !== 0 ? (e.noArrayIndent && !s && t > 0 ? Rh(e, t - 1, e.dump, i) : Rh(e, t, e.dump, i), h && (e.dump = "&ref_" + f + e.dump)) : (vD(e, t, e.dump), h && (e.dump = "&ref_" + f + " " + e.dump));
    else if (a === "[object String]")
      e.tag !== "?" && mD(e, e.dump, t, o, c);
    else {
      if (a === "[object Undefined]")
        return !1;
      if (e.skipInvalid) return !1;
      throw new qo("unacceptable kind of an object to dump " + a);
    }
    e.tag !== null && e.tag !== "?" && (u = encodeURI(
      e.tag[0] === "!" ? e.tag.slice(1) : e.tag
    ).replace(/!/g, "%21"), e.tag[0] === "!" ? u = "!" + u : u.slice(0, 18) === "tag:yaml.org,2002:" ? u = "!!" + u.slice(18) : u = "!<" + u + ">", e.dump = u + " " + e.dump);
  }
  return !0;
}
function _D(e, t) {
  var n = [], r = [], i, o;
  for (_l(e, n, r), i = 0, o = r.length; i < o; i += 1)
    t.duplicates.push(n[r[i]]);
  t.usedDuplicates = new Array(o);
}
function _l(e, t, n) {
  var r, i, o;
  if (e !== null && typeof e == "object")
    if (i = t.indexOf(e), i !== -1)
      n.indexOf(i) === -1 && n.push(i);
    else if (t.push(e), Array.isArray(e))
      for (i = 0, o = e.length; i < o; i += 1)
        _l(e[i], t, n);
    else
      for (r = Object.keys(e), i = 0, o = r.length; i < o; i += 1)
        _l(e[r[i]], t, n);
}
function $D(e, t) {
  t = t || {};
  var n = new uD(t);
  n.noRefs || _D(e, n);
  var r = e;
  return n.replacer && (r = n.replacer.call({ "": r }, "", r)), Rn(n, 0, r, !0, !0) ? n.dump + `
` : "";
}
yy.dump = $D;
var Iy = Ju, SD = yy;
function tf(e, t) {
  return function() {
    throw new Error("Function yaml." + e + " is removed in js-yaml 4. Use yaml." + t + " instead, which is now safe by default.");
  };
}
ut.Type = Pt;
ut.Schema = Bg;
ut.FAILSAFE_SCHEMA = Vg;
ut.JSON_SCHEMA = Xg;
ut.CORE_SCHEMA = Zg;
ut.DEFAULT_SCHEMA = Xu;
ut.load = Iy.load;
ut.loadAll = Iy.loadAll;
ut.dump = SD.dump;
ut.YAMLException = Ho;
ut.types = {
  binary: ry,
  float: Yg,
  map: zg,
  null: Gg,
  pairs: oy,
  set: sy,
  timestamp: ty,
  bool: Wg,
  int: Kg,
  merge: ny,
  omap: iy,
  seq: qg,
  str: Hg
};
ut.safeLoad = tf("safeLoad", "load");
ut.safeLoadAll = tf("safeLoadAll", "loadAll");
ut.safeDump = tf("safeDump", "dump");
var Ma = {};
Object.defineProperty(Ma, "__esModule", { value: !0 });
Ma.Lazy = void 0;
class bD {
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
Ma.Lazy = bD;
var zo = {}, aa = { exports: {} };
aa.exports;
(function(e, t) {
  var n = 200, r = "__lodash_hash_undefined__", i = 1, o = 2, s = 9007199254740991, a = "[object Arguments]", c = "[object Array]", u = "[object AsyncFunction]", l = "[object Boolean]", f = "[object Date]", h = "[object Error]", d = "[object Function]", m = "[object GeneratorFunction]", p = "[object Map]", w = "[object Number]", E = "[object Null]", y = "[object Object]", _ = "[object Promise]", S = "[object Proxy]", C = "[object RegExp]", j = "[object Set]", V = "[object String]", G = "[object Symbol]", q = "[object Undefined]", b = "[object WeakMap]", M = "[object ArrayBuffer]", W = "[object DataView]", X = "[object Float32Array]", L = "[object Float64Array]", U = "[object Int8Array]", K = "[object Int16Array]", z = "[object Int32Array]", Z = "[object Uint8Array]", J = "[object Uint8ClampedArray]", B = "[object Uint16Array]", P = "[object Uint32Array]", F = /[\\^$.*+?()[\]{}|]/g, D = /^\[object .+?Constructor\]$/, $ = /^(?:0|[1-9]\d*)$/, T = {};
  T[X] = T[L] = T[U] = T[K] = T[z] = T[Z] = T[J] = T[B] = T[P] = !0, T[a] = T[c] = T[M] = T[l] = T[W] = T[f] = T[h] = T[d] = T[p] = T[w] = T[y] = T[C] = T[j] = T[V] = T[b] = !1;
  var H = typeof bt == "object" && bt && bt.Object === Object && bt, ie = typeof self == "object" && self && self.Object === Object && self, ne = H || ie || Function("return this")(), ye = t && !t.nodeType && t, le = ye && !0 && e && !e.nodeType && e, O = le && le.exports === ye, v = O && H.process, g = function() {
    try {
      return v && v.binding && v.binding("util");
    } catch {
    }
  }(), I = g && g.isTypedArray;
  function N(A, R) {
    for (var Y = -1, se = A == null ? 0 : A.length, Le = 0, me = []; ++Y < se; ) {
      var Ve = A[Y];
      R(Ve, Y, A) && (me[Le++] = Ve);
    }
    return me;
  }
  function te(A, R) {
    for (var Y = -1, se = R.length, Le = A.length; ++Y < se; )
      A[Le + Y] = R[Y];
    return A;
  }
  function fe(A, R) {
    for (var Y = -1, se = A == null ? 0 : A.length; ++Y < se; )
      if (R(A[Y], Y, A))
        return !0;
    return !1;
  }
  function _e(A, R) {
    for (var Y = -1, se = Array(A); ++Y < A; )
      se[Y] = R(Y);
    return se;
  }
  function $e(A) {
    return function(R) {
      return A(R);
    };
  }
  function ve(A, R) {
    return A.has(R);
  }
  function Ae(A, R) {
    return A == null ? void 0 : A[R];
  }
  function Ie(A) {
    var R = -1, Y = Array(A.size);
    return A.forEach(function(se, Le) {
      Y[++R] = [Le, se];
    }), Y;
  }
  function Oe(A, R) {
    return function(Y) {
      return A(R(Y));
    };
  }
  function un(A) {
    var R = -1, Y = Array(A.size);
    return A.forEach(function(se) {
      Y[++R] = se;
    }), Y;
  }
  var Wt = Array.prototype, Ot = Function.prototype, Rt = Object.prototype, yn = ne["__core-js_shared__"], Dn = Ot.toString, Et = Rt.hasOwnProperty, Li = function() {
    var A = /[^.]+$/.exec(yn && yn.keys && yn.keys.IE_PROTO || "");
    return A ? "Symbol(src)_1." + A : "";
  }(), xi = Rt.toString, Ko = RegExp(
    "^" + Dn.call(Et).replace(F, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
  ), ki = O ? ne.Buffer : void 0, ur = ne.Symbol, Ui = ne.Uint8Array, Q = Rt.propertyIsEnumerable, de = Wt.splice, Te = ur ? ur.toStringTag : void 0, Se = Object.getOwnPropertySymbols, ke = ki ? ki.isBuffer : void 0, tt = Oe(Object.keys, Object), Xe = Kr(ne, "DataView"), vn = Kr(ne, "Map"), Wr = Kr(ne, "Promise"), Ya = Kr(ne, "Set"), Xa = Kr(ne, "WeakMap"), ji = Kr(Object, "create"), qy = hr(Xe), zy = hr(vn), Vy = hr(Wr), Gy = hr(Ya), Wy = hr(Xa), lf = ur ? ur.prototype : void 0, Za = lf ? lf.valueOf : void 0;
  function fr(A) {
    var R = -1, Y = A == null ? 0 : A.length;
    for (this.clear(); ++R < Y; ) {
      var se = A[R];
      this.set(se[0], se[1]);
    }
  }
  function Ky() {
    this.__data__ = ji ? ji(null) : {}, this.size = 0;
  }
  function Jy(A) {
    var R = this.has(A) && delete this.__data__[A];
    return this.size -= R ? 1 : 0, R;
  }
  function Yy(A) {
    var R = this.__data__;
    if (ji) {
      var Y = R[A];
      return Y === r ? void 0 : Y;
    }
    return Et.call(R, A) ? R[A] : void 0;
  }
  function Xy(A) {
    var R = this.__data__;
    return ji ? R[A] !== void 0 : Et.call(R, A);
  }
  function Zy(A, R) {
    var Y = this.__data__;
    return this.size += this.has(A) ? 0 : 1, Y[A] = ji && R === void 0 ? r : R, this;
  }
  fr.prototype.clear = Ky, fr.prototype.delete = Jy, fr.prototype.get = Yy, fr.prototype.has = Xy, fr.prototype.set = Zy;
  function wn(A) {
    var R = -1, Y = A == null ? 0 : A.length;
    for (this.clear(); ++R < Y; ) {
      var se = A[R];
      this.set(se[0], se[1]);
    }
  }
  function Qy() {
    this.__data__ = [], this.size = 0;
  }
  function e0(A) {
    var R = this.__data__, Y = Yo(R, A);
    if (Y < 0)
      return !1;
    var se = R.length - 1;
    return Y == se ? R.pop() : de.call(R, Y, 1), --this.size, !0;
  }
  function t0(A) {
    var R = this.__data__, Y = Yo(R, A);
    return Y < 0 ? void 0 : R[Y][1];
  }
  function n0(A) {
    return Yo(this.__data__, A) > -1;
  }
  function r0(A, R) {
    var Y = this.__data__, se = Yo(Y, A);
    return se < 0 ? (++this.size, Y.push([A, R])) : Y[se][1] = R, this;
  }
  wn.prototype.clear = Qy, wn.prototype.delete = e0, wn.prototype.get = t0, wn.prototype.has = n0, wn.prototype.set = r0;
  function dr(A) {
    var R = -1, Y = A == null ? 0 : A.length;
    for (this.clear(); ++R < Y; ) {
      var se = A[R];
      this.set(se[0], se[1]);
    }
  }
  function i0() {
    this.size = 0, this.__data__ = {
      hash: new fr(),
      map: new (vn || wn)(),
      string: new fr()
    };
  }
  function o0(A) {
    var R = Xo(this, A).delete(A);
    return this.size -= R ? 1 : 0, R;
  }
  function s0(A) {
    return Xo(this, A).get(A);
  }
  function a0(A) {
    return Xo(this, A).has(A);
  }
  function c0(A, R) {
    var Y = Xo(this, A), se = Y.size;
    return Y.set(A, R), this.size += Y.size == se ? 0 : 1, this;
  }
  dr.prototype.clear = i0, dr.prototype.delete = o0, dr.prototype.get = s0, dr.prototype.has = a0, dr.prototype.set = c0;
  function Jo(A) {
    var R = -1, Y = A == null ? 0 : A.length;
    for (this.__data__ = new dr(); ++R < Y; )
      this.add(A[R]);
  }
  function l0(A) {
    return this.__data__.set(A, r), this;
  }
  function u0(A) {
    return this.__data__.has(A);
  }
  Jo.prototype.add = Jo.prototype.push = l0, Jo.prototype.has = u0;
  function Fn(A) {
    var R = this.__data__ = new wn(A);
    this.size = R.size;
  }
  function f0() {
    this.__data__ = new wn(), this.size = 0;
  }
  function d0(A) {
    var R = this.__data__, Y = R.delete(A);
    return this.size = R.size, Y;
  }
  function h0(A) {
    return this.__data__.get(A);
  }
  function p0(A) {
    return this.__data__.has(A);
  }
  function m0(A, R) {
    var Y = this.__data__;
    if (Y instanceof wn) {
      var se = Y.__data__;
      if (!vn || se.length < n - 1)
        return se.push([A, R]), this.size = ++Y.size, this;
      Y = this.__data__ = new dr(se);
    }
    return Y.set(A, R), this.size = Y.size, this;
  }
  Fn.prototype.clear = f0, Fn.prototype.delete = d0, Fn.prototype.get = h0, Fn.prototype.has = p0, Fn.prototype.set = m0;
  function g0(A, R) {
    var Y = Zo(A), se = !Y && O0(A), Le = !Y && !se && Qa(A), me = !Y && !se && !Le && vf(A), Ve = Y || se || Le || me, nt = Ve ? _e(A.length, String) : [], ot = nt.length;
    for (var je in A)
      Et.call(A, je) && !(Ve && // Safari 9 has enumerable `arguments.length` in strict mode.
      (je == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
      Le && (je == "offset" || je == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
      me && (je == "buffer" || je == "byteLength" || je == "byteOffset") || // Skip index properties.
      T0(je, ot))) && nt.push(je);
    return nt;
  }
  function Yo(A, R) {
    for (var Y = A.length; Y--; )
      if (pf(A[Y][0], R))
        return Y;
    return -1;
  }
  function y0(A, R, Y) {
    var se = R(A);
    return Zo(A) ? se : te(se, Y(A));
  }
  function Mi(A) {
    return A == null ? A === void 0 ? q : E : Te && Te in Object(A) ? b0(A) : P0(A);
  }
  function uf(A) {
    return Bi(A) && Mi(A) == a;
  }
  function ff(A, R, Y, se, Le) {
    return A === R ? !0 : A == null || R == null || !Bi(A) && !Bi(R) ? A !== A && R !== R : v0(A, R, Y, se, ff, Le);
  }
  function v0(A, R, Y, se, Le, me) {
    var Ve = Zo(A), nt = Zo(R), ot = Ve ? c : Ln(A), je = nt ? c : Ln(R);
    ot = ot == a ? y : ot, je = je == a ? y : je;
    var Ut = ot == y, Kt = je == y, ft = ot == je;
    if (ft && Qa(A)) {
      if (!Qa(R))
        return !1;
      Ve = !0, Ut = !1;
    }
    if (ft && !Ut)
      return me || (me = new Fn()), Ve || vf(A) ? df(A, R, Y, se, Le, me) : $0(A, R, ot, Y, se, Le, me);
    if (!(Y & i)) {
      var Ht = Ut && Et.call(A, "__wrapped__"), qt = Kt && Et.call(R, "__wrapped__");
      if (Ht || qt) {
        var xn = Ht ? A.value() : A, En = qt ? R.value() : R;
        return me || (me = new Fn()), Le(xn, En, Y, se, me);
      }
    }
    return ft ? (me || (me = new Fn()), S0(A, R, Y, se, Le, me)) : !1;
  }
  function w0(A) {
    if (!yf(A) || N0(A))
      return !1;
    var R = mf(A) ? Ko : D;
    return R.test(hr(A));
  }
  function E0(A) {
    return Bi(A) && gf(A.length) && !!T[Mi(A)];
  }
  function _0(A) {
    if (!I0(A))
      return tt(A);
    var R = [];
    for (var Y in Object(A))
      Et.call(A, Y) && Y != "constructor" && R.push(Y);
    return R;
  }
  function df(A, R, Y, se, Le, me) {
    var Ve = Y & i, nt = A.length, ot = R.length;
    if (nt != ot && !(Ve && ot > nt))
      return !1;
    var je = me.get(A);
    if (je && me.get(R))
      return je == R;
    var Ut = -1, Kt = !0, ft = Y & o ? new Jo() : void 0;
    for (me.set(A, R), me.set(R, A); ++Ut < nt; ) {
      var Ht = A[Ut], qt = R[Ut];
      if (se)
        var xn = Ve ? se(qt, Ht, Ut, R, A, me) : se(Ht, qt, Ut, A, R, me);
      if (xn !== void 0) {
        if (xn)
          continue;
        Kt = !1;
        break;
      }
      if (ft) {
        if (!fe(R, function(En, pr) {
          if (!ve(ft, pr) && (Ht === En || Le(Ht, En, Y, se, me)))
            return ft.push(pr);
        })) {
          Kt = !1;
          break;
        }
      } else if (!(Ht === qt || Le(Ht, qt, Y, se, me))) {
        Kt = !1;
        break;
      }
    }
    return me.delete(A), me.delete(R), Kt;
  }
  function $0(A, R, Y, se, Le, me, Ve) {
    switch (Y) {
      case W:
        if (A.byteLength != R.byteLength || A.byteOffset != R.byteOffset)
          return !1;
        A = A.buffer, R = R.buffer;
      case M:
        return !(A.byteLength != R.byteLength || !me(new Ui(A), new Ui(R)));
      case l:
      case f:
      case w:
        return pf(+A, +R);
      case h:
        return A.name == R.name && A.message == R.message;
      case C:
      case V:
        return A == R + "";
      case p:
        var nt = Ie;
      case j:
        var ot = se & i;
        if (nt || (nt = un), A.size != R.size && !ot)
          return !1;
        var je = Ve.get(A);
        if (je)
          return je == R;
        se |= o, Ve.set(A, R);
        var Ut = df(nt(A), nt(R), se, Le, me, Ve);
        return Ve.delete(A), Ut;
      case G:
        if (Za)
          return Za.call(A) == Za.call(R);
    }
    return !1;
  }
  function S0(A, R, Y, se, Le, me) {
    var Ve = Y & i, nt = hf(A), ot = nt.length, je = hf(R), Ut = je.length;
    if (ot != Ut && !Ve)
      return !1;
    for (var Kt = ot; Kt--; ) {
      var ft = nt[Kt];
      if (!(Ve ? ft in R : Et.call(R, ft)))
        return !1;
    }
    var Ht = me.get(A);
    if (Ht && me.get(R))
      return Ht == R;
    var qt = !0;
    me.set(A, R), me.set(R, A);
    for (var xn = Ve; ++Kt < ot; ) {
      ft = nt[Kt];
      var En = A[ft], pr = R[ft];
      if (se)
        var wf = Ve ? se(pr, En, ft, R, A, me) : se(En, pr, ft, A, R, me);
      if (!(wf === void 0 ? En === pr || Le(En, pr, Y, se, me) : wf)) {
        qt = !1;
        break;
      }
      xn || (xn = ft == "constructor");
    }
    if (qt && !xn) {
      var Qo = A.constructor, es = R.constructor;
      Qo != es && "constructor" in A && "constructor" in R && !(typeof Qo == "function" && Qo instanceof Qo && typeof es == "function" && es instanceof es) && (qt = !1);
    }
    return me.delete(A), me.delete(R), qt;
  }
  function hf(A) {
    return y0(A, F0, A0);
  }
  function Xo(A, R) {
    var Y = A.__data__;
    return C0(R) ? Y[typeof R == "string" ? "string" : "hash"] : Y.map;
  }
  function Kr(A, R) {
    var Y = Ae(A, R);
    return w0(Y) ? Y : void 0;
  }
  function b0(A) {
    var R = Et.call(A, Te), Y = A[Te];
    try {
      A[Te] = void 0;
      var se = !0;
    } catch {
    }
    var Le = xi.call(A);
    return se && (R ? A[Te] = Y : delete A[Te]), Le;
  }
  var A0 = Se ? function(A) {
    return A == null ? [] : (A = Object(A), N(Se(A), function(R) {
      return Q.call(A, R);
    }));
  } : L0, Ln = Mi;
  (Xe && Ln(new Xe(new ArrayBuffer(1))) != W || vn && Ln(new vn()) != p || Wr && Ln(Wr.resolve()) != _ || Ya && Ln(new Ya()) != j || Xa && Ln(new Xa()) != b) && (Ln = function(A) {
    var R = Mi(A), Y = R == y ? A.constructor : void 0, se = Y ? hr(Y) : "";
    if (se)
      switch (se) {
        case qy:
          return W;
        case zy:
          return p;
        case Vy:
          return _;
        case Gy:
          return j;
        case Wy:
          return b;
      }
    return R;
  });
  function T0(A, R) {
    return R = R ?? s, !!R && (typeof A == "number" || $.test(A)) && A > -1 && A % 1 == 0 && A < R;
  }
  function C0(A) {
    var R = typeof A;
    return R == "string" || R == "number" || R == "symbol" || R == "boolean" ? A !== "__proto__" : A === null;
  }
  function N0(A) {
    return !!Li && Li in A;
  }
  function I0(A) {
    var R = A && A.constructor, Y = typeof R == "function" && R.prototype || Rt;
    return A === Y;
  }
  function P0(A) {
    return xi.call(A);
  }
  function hr(A) {
    if (A != null) {
      try {
        return Dn.call(A);
      } catch {
      }
      try {
        return A + "";
      } catch {
      }
    }
    return "";
  }
  function pf(A, R) {
    return A === R || A !== A && R !== R;
  }
  var O0 = uf(/* @__PURE__ */ function() {
    return arguments;
  }()) ? uf : function(A) {
    return Bi(A) && Et.call(A, "callee") && !Q.call(A, "callee");
  }, Zo = Array.isArray;
  function R0(A) {
    return A != null && gf(A.length) && !mf(A);
  }
  var Qa = ke || x0;
  function D0(A, R) {
    return ff(A, R);
  }
  function mf(A) {
    if (!yf(A))
      return !1;
    var R = Mi(A);
    return R == d || R == m || R == u || R == S;
  }
  function gf(A) {
    return typeof A == "number" && A > -1 && A % 1 == 0 && A <= s;
  }
  function yf(A) {
    var R = typeof A;
    return A != null && (R == "object" || R == "function");
  }
  function Bi(A) {
    return A != null && typeof A == "object";
  }
  var vf = I ? $e(I) : E0;
  function F0(A) {
    return R0(A) ? g0(A) : _0(A);
  }
  function L0() {
    return [];
  }
  function x0() {
    return !1;
  }
  e.exports = D0;
})(aa, aa.exports);
var AD = aa.exports;
Object.defineProperty(zo, "__esModule", { value: !0 });
zo.DownloadedUpdateHelper = void 0;
zo.createTempUpdateFile = PD;
const TD = Si, CD = k, Fh = AD, $r = cr, uo = x;
class ND {
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
    return uo.join(this.cacheDir, "pending");
  }
  async validateDownloadedPath(t, n, r, i) {
    if (this.versionInfo != null && this.file === t && this.fileInfo != null)
      return Fh(this.versionInfo, n) && Fh(this.fileInfo.info, r.info) && await (0, $r.pathExists)(t) ? t : null;
    const o = await this.getValidCachedUpdateFile(r, i);
    return o === null ? null : (i.info(`Update has already been downloaded to ${t}).`), this._file = o, o);
  }
  async setDownloadedFile(t, n, r, i, o, s) {
    this._file = t, this._packageFile = n, this.versionInfo = r, this.fileInfo = i, this._downloadedFileInfo = {
      fileName: o,
      sha512: i.info.sha512,
      isAdminRightsRequired: i.info.isAdminRightsRequired === !0
    }, s && await (0, $r.outputJson)(this.getUpdateInfoFile(), this._downloadedFileInfo);
  }
  async clear() {
    this._file = null, this._packageFile = null, this.versionInfo = null, this.fileInfo = null, await this.cleanCacheDirForPendingUpdate();
  }
  async cleanCacheDirForPendingUpdate() {
    try {
      await (0, $r.emptyDir)(this.cacheDirForPendingUpdate);
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
    if (!await (0, $r.pathExists)(r))
      return null;
    let o;
    try {
      o = await (0, $r.readJson)(r);
    } catch (u) {
      let l = "No cached update info available";
      return u.code !== "ENOENT" && (await this.cleanCacheDirForPendingUpdate(), l += ` (error on read: ${u.message})`), n.info(l), null;
    }
    if (!((o == null ? void 0 : o.fileName) !== null))
      return n.warn("Cached update info is corrupted: no fileName, directory for cached update will be cleaned"), await this.cleanCacheDirForPendingUpdate(), null;
    if (t.info.sha512 !== o.sha512)
      return n.info(`Cached update sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${o.sha512}, expected: ${t.info.sha512}. Directory for cached update will be cleaned`), await this.cleanCacheDirForPendingUpdate(), null;
    const a = uo.join(this.cacheDirForPendingUpdate, o.fileName);
    if (!await (0, $r.pathExists)(a))
      return n.info("Cached update file doesn't exist"), null;
    const c = await ID(a);
    return t.info.sha512 !== c ? (n.warn(`Sha512 checksum doesn't match the latest available update. New update must be downloaded. Cached: ${c}, expected: ${t.info.sha512}`), await this.cleanCacheDirForPendingUpdate(), null) : (this._downloadedFileInfo = o, a);
  }
  getUpdateInfoFile() {
    return uo.join(this.cacheDirForPendingUpdate, "update-info.json");
  }
}
zo.DownloadedUpdateHelper = ND;
function ID(e, t = "sha512", n = "base64", r) {
  return new Promise((i, o) => {
    const s = (0, TD.createHash)(t);
    s.on("error", o).setEncoding(n), (0, CD.createReadStream)(e, {
      ...r,
      highWaterMark: 1024 * 1024
      /* better to use more memory but hash faster */
    }).on("error", o).on("end", () => {
      s.end(), i(s.read());
    }).pipe(s, { end: !1 });
  });
}
async function PD(e, t, n) {
  let r = 0, i = uo.join(t, e);
  for (let o = 0; o < 3; o++)
    try {
      return await (0, $r.unlink)(i), i;
    } catch (s) {
      if (s.code === "ENOENT")
        return i;
      n.warn(`Error on remove temp update file: ${s}`), i = uo.join(t, `${r++}-${e}`);
    }
  return i;
}
var Ba = {}, nf = {};
Object.defineProperty(nf, "__esModule", { value: !0 });
nf.getAppCacheDir = RD;
const Lc = x, OD = ua;
function RD() {
  const e = (0, OD.homedir)();
  let t;
  return process.platform === "win32" ? t = process.env.LOCALAPPDATA || Lc.join(e, "AppData", "Local") : process.platform === "darwin" ? t = Lc.join(e, "Library", "Caches") : t = process.env.XDG_CACHE_HOME || Lc.join(e, ".cache"), t;
}
Object.defineProperty(Ba, "__esModule", { value: !0 });
Ba.ElectronAppAdapter = void 0;
const Lh = x, DD = nf;
class FD {
  constructor(t = In.app) {
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
    return this.isPackaged ? Lh.join(process.resourcesPath, "app-update.yml") : Lh.join(this.app.getAppPath(), "dev-app-update.yml");
  }
  get userDataPath() {
    return this.app.getPath("userData");
  }
  get baseCachePath() {
    return (0, DD.getAppCacheDir)();
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
Ba.ElectronAppAdapter = FD;
var Py = {};
(function(e) {
  Object.defineProperty(e, "__esModule", { value: !0 }), e.ElectronHttpExecutor = e.NET_SESSION_NAME = void 0, e.getNetSession = n;
  const t = et;
  e.NET_SESSION_NAME = "electron-updater";
  function n() {
    return In.session.fromPartition(e.NET_SESSION_NAME, {
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
      const a = In.net.request({
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
})(Py);
var Vo = {}, ln = {};
Object.defineProperty(ln, "__esModule", { value: !0 });
ln.newBaseUrl = LD;
ln.newUrlFromBase = xD;
ln.getChannelFilename = kD;
const Oy = ar;
function LD(e) {
  const t = new Oy.URL(e);
  return t.pathname.endsWith("/") || (t.pathname += "/"), t;
}
function xD(e, t, n = !1) {
  const r = new Oy.URL(e, t), i = t.search;
  return i != null && i.length !== 0 ? r.search = i : n && (r.search = `noCache=${Date.now().toString(32)}`), r;
}
function kD(e) {
  return `${e}.yml`;
}
var Ye = {}, UD = "[object Symbol]", Ry = /[\\^$.*+?()[\]{}|]/g, jD = RegExp(Ry.source), MD = typeof bt == "object" && bt && bt.Object === Object && bt, BD = typeof self == "object" && self && self.Object === Object && self, HD = MD || BD || Function("return this")(), qD = Object.prototype, zD = qD.toString, xh = HD.Symbol, kh = xh ? xh.prototype : void 0, Uh = kh ? kh.toString : void 0;
function VD(e) {
  if (typeof e == "string")
    return e;
  if (WD(e))
    return Uh ? Uh.call(e) : "";
  var t = e + "";
  return t == "0" && 1 / e == -1 / 0 ? "-0" : t;
}
function GD(e) {
  return !!e && typeof e == "object";
}
function WD(e) {
  return typeof e == "symbol" || GD(e) && zD.call(e) == UD;
}
function KD(e) {
  return e == null ? "" : VD(e);
}
function JD(e) {
  return e = KD(e), e && jD.test(e) ? e.replace(Ry, "\\$&") : e;
}
var Dy = JD;
Object.defineProperty(Ye, "__esModule", { value: !0 });
Ye.Provider = void 0;
Ye.findFile = eF;
Ye.parseUpdateInfo = tF;
Ye.getFileList = Fy;
Ye.resolveFiles = nF;
const or = et, YD = ut, XD = ar, ca = ln, ZD = Dy;
class QD {
  constructor(t) {
    this.runtimeOptions = t, this.requestHeaders = null, this.executor = t.executor;
  }
  // By default, the blockmap file is in the same directory as the main file
  // But some providers may have a different blockmap file, so we need to override this method
  getBlockMapFiles(t, n, r, i = null) {
    const o = (0, ca.newUrlFromBase)(`${t.pathname}.blockmap`, t);
    return [(0, ca.newUrlFromBase)(`${t.pathname.replace(new RegExp(ZD(r), "g"), n)}.blockmap`, i ? new XD.URL(i) : t), o];
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
    return this.requestHeaders == null ? n != null && (r.headers = n) : r.headers = n == null ? this.requestHeaders : { ...this.requestHeaders, ...n }, (0, or.configureRequestUrl)(t, r), r;
  }
}
Ye.Provider = QD;
function eF(e, t, n) {
  var r;
  if (e.length === 0)
    throw (0, or.newError)("No files provided", "ERR_UPDATER_NO_FILES_PROVIDED");
  const i = e.filter((s) => s.url.pathname.toLowerCase().endsWith(`.${t.toLowerCase()}`)), o = (r = i.find((s) => [s.url.pathname, s.info.url].some((a) => a.includes(process.arch)))) !== null && r !== void 0 ? r : i.shift();
  return o || (n == null ? e[0] : e.find((s) => !n.some((a) => s.url.pathname.toLowerCase().endsWith(`.${a.toLowerCase()}`))));
}
function tF(e, t, n) {
  if (e == null)
    throw (0, or.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): rawData: null`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  let r;
  try {
    r = (0, YD.load)(e);
  } catch (i) {
    throw (0, or.newError)(`Cannot parse update info from ${t} in the latest release artifacts (${n}): ${i.stack || i.message}, rawData: ${e}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
  }
  return r;
}
function Fy(e) {
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
  throw (0, or.newError)(`No files provided: ${(0, or.safeStringifyJson)(e)}`, "ERR_UPDATER_NO_FILES_PROVIDED");
}
function nF(e, t, n = (r) => r) {
  const i = Fy(e).map((a) => {
    if (a.sha2 == null && a.sha512 == null)
      throw (0, or.newError)(`Update info doesn't contain nor sha256 neither sha512 checksum: ${(0, or.safeStringifyJson)(a)}`, "ERR_UPDATER_NO_CHECKSUM");
    return {
      url: (0, ca.newUrlFromBase)(n(a.url), t),
      info: a
    };
  }), o = e.packages, s = o == null ? null : o[process.arch] || o.ia32;
  return s != null && (i[0].packageInfo = {
    ...s,
    path: (0, ca.newUrlFromBase)(n(s.path), t).href
  }), i;
}
Object.defineProperty(Vo, "__esModule", { value: !0 });
Vo.GenericProvider = void 0;
const jh = et, xc = ln, kc = Ye;
class rF extends kc.Provider {
  constructor(t, n, r) {
    super(r), this.configuration = t, this.updater = n, this.baseUrl = (0, xc.newBaseUrl)(this.configuration.url);
  }
  get channel() {
    const t = this.updater.channel || this.configuration.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = (0, xc.getChannelFilename)(this.channel), n = (0, xc.newUrlFromBase)(t, this.baseUrl, this.updater.isAddNoCacheQuery);
    for (let r = 0; ; r++)
      try {
        return (0, kc.parseUpdateInfo)(await this.httpRequest(n), t, n);
      } catch (i) {
        if (i instanceof jh.HttpError && i.statusCode === 404)
          throw (0, jh.newError)(`Cannot find channel "${t}" update info: ${i.stack || i.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
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
    return (0, kc.resolveFiles)(t, this.baseUrl);
  }
}
Vo.GenericProvider = rF;
var Ha = {}, qa = {};
Object.defineProperty(qa, "__esModule", { value: !0 });
qa.BitbucketProvider = void 0;
const Mh = et, Uc = ln, jc = Ye;
class iF extends jc.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n;
    const { owner: i, slug: o } = t;
    this.baseUrl = (0, Uc.newBaseUrl)(`https://api.bitbucket.org/2.0/repositories/${i}/${o}/downloads`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "latest";
  }
  async getLatestVersion() {
    const t = new Mh.CancellationToken(), n = (0, Uc.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, Uc.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, void 0, t);
      return (0, jc.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, Mh.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, jc.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { owner: t, slug: n } = this.configuration;
    return `Bitbucket (owner: ${t}, slug: ${n}, channel: ${this.channel})`;
  }
}
qa.BitbucketProvider = iF;
var sr = {};
Object.defineProperty(sr, "__esModule", { value: !0 });
sr.GitHubProvider = sr.BaseGitHubProvider = void 0;
sr.computeReleaseNotes = xy;
const Nn = et, Pr = Fu, oF = ar, di = ln, $l = Ye, Mc = /\/tag\/([^/]+)$/;
class Ly extends $l.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      /* because GitHib uses S3 */
      isUseMultipleRangeRequest: !1
    }), this.options = t, this.baseUrl = (0, di.newBaseUrl)((0, Nn.githubUrl)(t, n));
    const i = n === "github.com" ? "api.github.com" : n;
    this.baseApiUrl = (0, di.newBaseUrl)((0, Nn.githubUrl)(t, i));
  }
  computeGithubBasePath(t) {
    const n = this.options.host;
    return n && !["github.com", "api.github.com"].includes(n) ? `/api/v3${t}` : t;
  }
}
sr.BaseGitHubProvider = Ly;
class sF extends Ly {
  constructor(t, n, r) {
    super(t, "github.com", r), this.options = t, this.updater = n;
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    var t, n, r, i, o;
    const s = new Nn.CancellationToken(), a = await this.httpRequest((0, di.newUrlFromBase)(`${this.basePath}.atom`, this.baseUrl), {
      accept: "application/xml, application/atom+xml, text/xml, */*"
    }, s), c = (0, Nn.parseXml)(a);
    let u = c.element("entry", !1, "No published versions on GitHub"), l = null;
    try {
      if (this.updater.allowPrerelease) {
        const w = ((t = this.updater) === null || t === void 0 ? void 0 : t.channel) || ((n = Pr.prerelease(this.updater.currentVersion)) === null || n === void 0 ? void 0 : n[0]) || null;
        if (w === null)
          l = Mc.exec(u.element("link").attribute("href"))[1];
        else
          for (const E of c.getElements("entry")) {
            const y = Mc.exec(E.element("link").attribute("href"));
            if (y === null)
              continue;
            const _ = y[1], S = ((r = Pr.prerelease(_)) === null || r === void 0 ? void 0 : r[0]) || null, C = !w || ["alpha", "beta"].includes(w), j = S !== null && !["alpha", "beta"].includes(String(S));
            if (C && !j && !(w === "beta" && S === "alpha")) {
              l = _;
              break;
            }
            if (S && S === w) {
              l = _;
              break;
            }
          }
      } else {
        l = await this.getLatestTagName(s);
        for (const w of c.getElements("entry"))
          if (Mc.exec(w.element("link").attribute("href"))[1] === l) {
            u = w;
            break;
          }
      }
    } catch (w) {
      throw (0, Nn.newError)(`Cannot parse releases feed: ${w.stack || w.message},
XML:
${a}`, "ERR_UPDATER_INVALID_RELEASE_FEED");
    }
    if (l == null)
      throw (0, Nn.newError)("No published versions on GitHub", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
    let f, h = "", d = "";
    const m = async (w) => {
      h = (0, di.getChannelFilename)(w), d = (0, di.newUrlFromBase)(this.getBaseDownloadPath(String(l), h), this.baseUrl);
      const E = this.createRequestOptions(d);
      try {
        return await this.executor.request(E, s);
      } catch (y) {
        throw y instanceof Nn.HttpError && y.statusCode === 404 ? (0, Nn.newError)(`Cannot find ${h} in the latest release artifacts (${d}): ${y.stack || y.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : y;
      }
    };
    try {
      let w = this.channel;
      this.updater.allowPrerelease && (!((i = Pr.prerelease(l)) === null || i === void 0) && i[0]) && (w = this.getCustomChannelName(String((o = Pr.prerelease(l)) === null || o === void 0 ? void 0 : o[0]))), f = await m(w);
    } catch (w) {
      if (this.updater.allowPrerelease)
        f = await m(this.getDefaultChannelName());
      else
        throw w;
    }
    const p = (0, $l.parseUpdateInfo)(f, h, d);
    return p.releaseName == null && (p.releaseName = u.elementValueOrEmpty("title")), p.releaseNotes == null && (p.releaseNotes = xy(this.updater.currentVersion, this.updater.fullChangelog, c, u)), {
      tag: l,
      ...p
    };
  }
  async getLatestTagName(t) {
    const n = this.options, r = n.host == null || n.host === "github.com" ? (0, di.newUrlFromBase)(`${this.basePath}/latest`, this.baseUrl) : new oF.URL(`${this.computeGithubBasePath(`/repos/${n.owner}/${n.repo}/releases`)}/latest`, this.baseApiUrl);
    try {
      const i = await this.httpRequest(r, { Accept: "application/json" }, t);
      return i == null ? null : JSON.parse(i).tag_name;
    } catch (i) {
      throw (0, Nn.newError)(`Unable to find latest version on GitHub (${r}), please ensure a production release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return `/${this.options.owner}/${this.options.repo}/releases`;
  }
  resolveFiles(t) {
    return (0, $l.resolveFiles)(t, this.baseUrl, (n) => this.getBaseDownloadPath(t.tag, n.replace(/ /g, "-")));
  }
  getBaseDownloadPath(t, n) {
    return `${this.basePath}/download/${t}/${n}`;
  }
}
sr.GitHubProvider = sF;
function Bh(e) {
  const t = e.elementValueOrEmpty("content");
  return t === "No content." ? "" : t;
}
function xy(e, t, n, r) {
  if (!t)
    return Bh(r);
  const i = [];
  for (const o of n.getElements("entry")) {
    const s = /\/tag\/v?([^/]+)$/.exec(o.element("link").attribute("href"))[1];
    Pr.valid(s) && Pr.lt(e, s) && i.push({
      version: s,
      note: Bh(o)
    });
  }
  return i.sort((o, s) => Pr.rcompare(o.version, s.version));
}
var za = {};
Object.defineProperty(za, "__esModule", { value: !0 });
za.GitLabProvider = void 0;
const _t = et, Bc = ar, aF = Dy, Ts = ln, Hc = Ye;
class cF extends Hc.Provider {
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
    this.baseApiUrl = (0, Ts.newBaseUrl)(`https://${o}/api/v4`);
  }
  get channel() {
    const t = this.updater.channel || this.options.channel;
    return t == null ? this.getDefaultChannelName() : this.getCustomChannelName(t);
  }
  async getLatestVersion() {
    const t = new _t.CancellationToken(), n = (0, Ts.newUrlFromBase)(`projects/${this.options.projectId}/releases/permalink/latest`, this.baseApiUrl);
    let r;
    try {
      const h = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, d = await this.httpRequest(n, h, t);
      if (!d)
        throw (0, _t.newError)("No latest release found", "ERR_UPDATER_NO_PUBLISHED_VERSIONS");
      r = JSON.parse(d);
    } catch (h) {
      throw (0, _t.newError)(`Unable to find latest release on GitLab (${n}): ${h.stack || h.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
    const i = r.tag_name;
    let o = null, s = "", a = null;
    const c = async (h) => {
      s = (0, Ts.getChannelFilename)(h);
      const d = r.assets.links.find((p) => p.name === s);
      if (!d)
        throw (0, _t.newError)(`Cannot find ${s} in the latest release assets`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
      a = new Bc.URL(d.direct_asset_url);
      const m = this.options.token ? { "PRIVATE-TOKEN": this.options.token } : void 0;
      try {
        const p = await this.httpRequest(a, m, t);
        if (!p)
          throw (0, _t.newError)(`Empty response from ${a}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
        return p;
      } catch (p) {
        throw p instanceof _t.HttpError && p.statusCode === 404 ? (0, _t.newError)(`Cannot find ${s} in the latest release artifacts (${a}): ${p.stack || p.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : p;
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
      throw (0, _t.newError)(`Unable to parse channel data from ${s}`, "ERR_UPDATER_INVALID_UPDATE_INFO");
    const u = (0, Hc.parseUpdateInfo)(o, s, a);
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
        return new Bc.URL(o);
    }
    return null;
  }
  async fetchReleaseInfoByVersion(t) {
    const n = new _t.CancellationToken(), r = [`v${t}`, t];
    for (const i of r) {
      const o = (0, Ts.newUrlFromBase)(`projects/${this.options.projectId}/releases/${encodeURIComponent(i)}`, this.baseApiUrl);
      try {
        const s = { "Content-Type": "application/json", ...this.setAuthHeaderForToken(this.options.token || null) }, a = await this.httpRequest(o, s, n);
        if (a)
          return JSON.parse(a);
      } catch (s) {
        if (s instanceof _t.HttpError && s.statusCode === 404)
          continue;
        throw (0, _t.newError)(`Unable to find release ${i} on GitLab (${o}): ${s.stack || s.message}`, "ERR_UPDATER_RELEASE_NOT_FOUND");
      }
    }
    throw (0, _t.newError)(`Unable to find release with version ${t} (tried: ${r.join(", ")}) on GitLab`, "ERR_UPDATER_RELEASE_NOT_FOUND");
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
      const c = r.replace(new RegExp(aF(n), "g"), t);
      o = this.findBlockMapInAssets(a, c);
    }
    return [o, i];
  }
  async getBlockMapFiles(t, n, r, i = null) {
    if (this.options.uploadTarget === "project_upload") {
      const o = t.pathname.split("/").pop() || "", [s, a] = await this.findBlockMapUrlsFromAssets(n, r, o);
      if (!a)
        throw (0, _t.newError)(`Cannot find blockmap file for ${r} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      if (!s)
        throw (0, _t.newError)(`Cannot find blockmap file for ${n} in GitLab assets`, "ERR_UPDATER_BLOCKMAP_FILE_NOT_FOUND");
      return [s, a];
    } else
      return super.getBlockMapFiles(t, n, r, i);
  }
  resolveFiles(t) {
    return (0, Hc.getFileList)(t).map((n) => {
      const i = [
        n.url,
        // Original filename
        this.normalizeFilename(n.url)
        // Normalized filename (spaces/underscores → dashes)
      ].find((s) => t.assets.has(s)), o = i ? t.assets.get(i) : void 0;
      if (!o)
        throw (0, _t.newError)(`Cannot find asset "${n.url}" in GitLab release assets. Available assets: ${Array.from(t.assets.keys()).join(", ")}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new Bc.URL(o),
        info: n
      };
    });
  }
  toString() {
    return `GitLab (projectId: ${this.options.projectId}, channel: ${this.channel})`;
  }
}
za.GitLabProvider = cF;
var Va = {};
Object.defineProperty(Va, "__esModule", { value: !0 });
Va.KeygenProvider = void 0;
const Hh = et, qc = ln, zc = Ye;
class lF extends zc.Provider {
  constructor(t, n, r) {
    super({
      ...r,
      isUseMultipleRangeRequest: !1
    }), this.configuration = t, this.updater = n, this.defaultHostname = "api.keygen.sh";
    const i = this.configuration.host || this.defaultHostname;
    this.baseUrl = (0, qc.newBaseUrl)(`https://${i}/v1/accounts/${this.configuration.account}/artifacts?product=${this.configuration.product}`);
  }
  get channel() {
    return this.updater.channel || this.configuration.channel || "stable";
  }
  async getLatestVersion() {
    const t = new Hh.CancellationToken(), n = (0, qc.getChannelFilename)(this.getCustomChannelName(this.channel)), r = (0, qc.newUrlFromBase)(n, this.baseUrl, this.updater.isAddNoCacheQuery);
    try {
      const i = await this.httpRequest(r, {
        Accept: "application/vnd.api+json",
        "Keygen-Version": "1.1"
      }, t);
      return (0, zc.parseUpdateInfo)(i, n, r);
    } catch (i) {
      throw (0, Hh.newError)(`Unable to find latest version on ${this.toString()}, please ensure release exists: ${i.stack || i.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  resolveFiles(t) {
    return (0, zc.resolveFiles)(t, this.baseUrl);
  }
  toString() {
    const { account: t, product: n, platform: r } = this.configuration;
    return `Keygen (account: ${t}, product: ${n}, platform: ${r}, channel: ${this.channel})`;
  }
}
Va.KeygenProvider = lF;
var Ga = {};
Object.defineProperty(Ga, "__esModule", { value: !0 });
Ga.PrivateGitHubProvider = void 0;
const ei = et, uF = ut, fF = x, qh = ar, zh = ln, dF = sr, hF = Ye;
class pF extends dF.BaseGitHubProvider {
  constructor(t, n, r, i) {
    super(t, "api.github.com", i), this.updater = n, this.token = r;
  }
  createRequestOptions(t, n) {
    const r = super.createRequestOptions(t, n);
    return r.redirect = "manual", r;
  }
  async getLatestVersion() {
    const t = new ei.CancellationToken(), n = (0, zh.getChannelFilename)(this.getDefaultChannelName()), r = await this.getLatestVersionInfo(t), i = r.assets.find((a) => a.name === n);
    if (i == null)
      throw (0, ei.newError)(`Cannot find ${n} in the release ${r.html_url || r.name}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND");
    const o = new qh.URL(i.url);
    let s;
    try {
      s = (0, uF.load)(await this.httpRequest(o, this.configureHeaders("application/octet-stream"), t));
    } catch (a) {
      throw a instanceof ei.HttpError && a.statusCode === 404 ? (0, ei.newError)(`Cannot find ${n} in the latest release artifacts (${o}): ${a.stack || a.message}`, "ERR_UPDATER_CHANNEL_FILE_NOT_FOUND") : a;
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
    const i = (0, zh.newUrlFromBase)(r, this.baseUrl);
    try {
      const o = JSON.parse(await this.httpRequest(i, this.configureHeaders("application/vnd.github.v3+json"), t));
      return n ? o.find((s) => s.prerelease) || o[0] : o;
    } catch (o) {
      throw (0, ei.newError)(`Unable to find latest version on GitHub (${i}), please ensure a production release exists: ${o.stack || o.message}`, "ERR_UPDATER_LATEST_VERSION_NOT_FOUND");
    }
  }
  get basePath() {
    return this.computeGithubBasePath(`/repos/${this.options.owner}/${this.options.repo}/releases`);
  }
  resolveFiles(t) {
    return (0, hF.getFileList)(t).map((n) => {
      const r = fF.posix.basename(n.url).replace(/ /g, "-"), i = t.assets.find((o) => o != null && o.name === r);
      if (i == null)
        throw (0, ei.newError)(`Cannot find asset "${r}" in: ${JSON.stringify(t.assets, null, 2)}`, "ERR_UPDATER_ASSET_NOT_FOUND");
      return {
        url: new qh.URL(i.url),
        info: n
      };
    });
  }
}
Ga.PrivateGitHubProvider = pF;
Object.defineProperty(Ha, "__esModule", { value: !0 });
Ha.isUrlProbablySupportMultiRangeRequests = ky;
Ha.createClient = EF;
const Cs = et, mF = qa, Vh = Vo, gF = sr, yF = za, vF = Va, wF = Ga;
function ky(e) {
  return !e.includes("s3.amazonaws.com");
}
function EF(e, t, n) {
  if (typeof e == "string")
    throw (0, Cs.newError)("Please pass PublishConfiguration object", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
  const r = e.provider;
  switch (r) {
    case "github": {
      const i = e, o = (i.private ? process.env.GH_TOKEN || process.env.GITHUB_TOKEN : null) || i.token;
      return o == null ? new gF.GitHubProvider(i, t, n) : new wF.PrivateGitHubProvider(i, t, o, n);
    }
    case "bitbucket":
      return new mF.BitbucketProvider(e, t, n);
    case "gitlab":
      return new yF.GitLabProvider(e, t, n);
    case "keygen":
      return new vF.KeygenProvider(e, t, n);
    case "s3":
    case "spaces":
      return new Vh.GenericProvider({
        provider: "generic",
        url: (0, Cs.getS3LikeProviderBaseUrl)(e),
        channel: e.channel || null
      }, t, {
        ...n,
        // https://github.com/minio/minio/issues/5285#issuecomment-350428955
        isUseMultipleRangeRequest: !1
      });
    case "generic": {
      const i = e;
      return new Vh.GenericProvider(i, t, {
        ...n,
        isUseMultipleRangeRequest: i.useMultipleRangeRequest !== !1 && ky(i.url)
      });
    }
    case "custom": {
      const i = e, o = i.updateProvider;
      if (!o)
        throw (0, Cs.newError)("Custom provider not specified", "ERR_UPDATER_INVALID_PROVIDER_CONFIGURATION");
      return new o(i, t, n);
    }
    default:
      throw (0, Cs.newError)(`Unsupported provider: ${r}`, "ERR_UPDATER_UNSUPPORTED_PROVIDER");
  }
}
var Wa = {}, Go = {}, Di = {}, Gr = {};
Object.defineProperty(Gr, "__esModule", { value: !0 });
Gr.OperationKind = void 0;
Gr.computeOperations = _F;
var Or;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(Or || (Gr.OperationKind = Or = {}));
function _F(e, t, n) {
  const r = Wh(e.files), i = Wh(t.files);
  let o = null;
  const s = t.files[0], a = [], c = s.name, u = r.get(c);
  if (u == null)
    throw new Error(`no file ${c} in old blockmap`);
  const l = i.get(c);
  let f = 0;
  const { checksumToOffset: h, checksumToOldSize: d } = SF(r.get(c), u.offset, n);
  let m = s.offset;
  for (let p = 0; p < l.checksums.length; m += l.sizes[p], p++) {
    const w = l.sizes[p], E = l.checksums[p];
    let y = h.get(E);
    y != null && d.get(E) !== w && (n.warn(`Checksum ("${E}") matches, but size differs (old: ${d.get(E)}, new: ${w})`), y = void 0), y === void 0 ? (f++, o != null && o.kind === Or.DOWNLOAD && o.end === m ? o.end += w : (o = {
      kind: Or.DOWNLOAD,
      start: m,
      end: m + w
      // oldBlocks: null,
    }, Gh(o, a, E, p))) : o != null && o.kind === Or.COPY && o.end === y ? o.end += w : (o = {
      kind: Or.COPY,
      start: y,
      end: y + w
      // oldBlocks: [checksum]
    }, Gh(o, a, E, p));
  }
  return f > 0 && n.info(`File${s.name === "file" ? "" : " " + s.name} has ${f} changed blocks`), a;
}
const $F = process.env.DIFFERENTIAL_DOWNLOAD_PLAN_BUILDER_VALIDATE_RANGES === "true";
function Gh(e, t, n, r) {
  if ($F && t.length !== 0) {
    const i = t[t.length - 1];
    if (i.kind === e.kind && e.start < i.end && e.start > i.start) {
      const o = [i.start, i.end, e.start, e.end].reduce((s, a) => s < a ? s : a);
      throw new Error(`operation (block index: ${r}, checksum: ${n}, kind: ${Or[e.kind]}) overlaps previous operation (checksum: ${n}):
abs: ${i.start} until ${i.end} and ${e.start} until ${e.end}
rel: ${i.start - o} until ${i.end - o} and ${e.start - o} until ${e.end - o}`);
    }
  }
  t.push(e);
}
function SF(e, t, n) {
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
function Wh(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e)
    t.set(n.name, n);
  return t;
}
Object.defineProperty(Di, "__esModule", { value: !0 });
Di.DataSplitter = void 0;
Di.copyData = Uy;
const Ns = et, bF = k, AF = Oo, TF = Gr, Kh = Buffer.from(`\r
\r
`);
var Wn;
(function(e) {
  e[e.INIT = 0] = "INIT", e[e.HEADER = 1] = "HEADER", e[e.BODY = 2] = "BODY";
})(Wn || (Wn = {}));
function Uy(e, t, n, r, i) {
  const o = (0, bF.createReadStream)("", {
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
class CF extends AF.Writable {
  constructor(t, n, r, i, o, s, a, c) {
    super(), this.out = t, this.options = n, this.partIndexToTaskIndex = r, this.partIndexToLength = o, this.finishHandler = s, this.grandTotalBytes = a, this.onProgress = c, this.start = Date.now(), this.nextUpdate = this.start + 1e3, this.transferred = 0, this.delta = 0, this.partIndex = -1, this.headerListBuffer = null, this.readState = Wn.INIT, this.ignoreByteCount = 0, this.remainingPartDataCount = 0, this.actualPartLength = 0, this.boundaryLength = i.length + 4, this.ignoreByteCount = this.boundaryLength - 2;
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
      throw (0, Ns.newError)("Internal error", "ERR_DATA_SPLITTER_BYTE_COUNT_MISMATCH");
    if (this.ignoreByteCount > 0) {
      const r = Math.min(this.ignoreByteCount, t.length);
      this.ignoreByteCount -= r, n = r;
    } else if (this.remainingPartDataCount > 0) {
      const r = Math.min(this.remainingPartDataCount, t.length);
      this.remainingPartDataCount -= r, await this.processPartData(t, 0, r), n = r;
    }
    if (n !== t.length) {
      if (this.readState === Wn.HEADER) {
        const r = this.searchHeaderListEnd(t, n);
        if (r === -1)
          return;
        n = r, this.readState = Wn.BODY, this.headerListBuffer = null;
      }
      for (; ; ) {
        if (this.readState === Wn.BODY)
          this.readState = Wn.INIT;
        else {
          this.partIndex++;
          let s = this.partIndexToTaskIndex.get(this.partIndex);
          if (s == null)
            if (this.isFinished)
              s = this.options.end;
            else
              throw (0, Ns.newError)("taskIndex is null", "ERR_DATA_SPLITTER_TASK_INDEX_IS_NULL");
          const a = this.partIndex === 0 ? this.options.start : this.partIndexToTaskIndex.get(this.partIndex - 1) + 1;
          if (a < s)
            await this.copyExistingData(a, s);
          else if (a > s)
            throw (0, Ns.newError)("prevTaskIndex must be < taskIndex", "ERR_DATA_SPLITTER_TASK_INDEX_ASSERT_FAILED");
          if (this.isFinished) {
            this.onPartEnd(), this.finishHandler();
            return;
          }
          if (n = this.searchHeaderListEnd(t, n), n === -1) {
            this.readState = Wn.HEADER;
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
        if (s.kind !== TF.OperationKind.COPY) {
          i(new Error("Task kind must be COPY"));
          return;
        }
        Uy(s, this.out, this.options.oldFileFd, i, () => {
          t++, o();
        });
      };
      o();
    });
  }
  searchHeaderListEnd(t, n) {
    const r = t.indexOf(Kh, n);
    if (r !== -1)
      return r + Kh.length;
    const i = n === 0 ? t : t.slice(n);
    return this.headerListBuffer == null ? this.headerListBuffer = i : this.headerListBuffer = Buffer.concat([this.headerListBuffer, i]), -1;
  }
  onPartEnd() {
    const t = this.partIndexToLength[this.partIndex - 1];
    if (this.actualPartLength !== t)
      throw (0, Ns.newError)(`Expected length: ${t} differs from actual: ${this.actualPartLength}`, "ERR_DATA_SPLITTER_LENGTH_MISMATCH");
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
Di.DataSplitter = CF;
var Ka = {};
Object.defineProperty(Ka, "__esModule", { value: !0 });
Ka.executeTasksUsingMultipleRangeRequests = NF;
Ka.checkIsRangesSupported = bl;
const Sl = et, Jh = Di, Yh = Gr;
function NF(e, t, n, r, i) {
  const o = (s) => {
    if (s >= t.length) {
      e.fileMetadataBuffer != null && n.write(e.fileMetadataBuffer), n.end();
      return;
    }
    const a = s + 1e3;
    IF(e, {
      tasks: t,
      start: s,
      end: Math.min(t.length, a),
      oldFileFd: r
    }, n, () => o(a), i);
  };
  return o;
}
function IF(e, t, n, r, i) {
  let o = "bytes=", s = 0, a = 0;
  const c = /* @__PURE__ */ new Map(), u = [];
  for (let h = t.start; h < t.end; h++) {
    const d = t.tasks[h];
    d.kind === Yh.OperationKind.DOWNLOAD && (o += `${d.start}-${d.end - 1}, `, c.set(s, h), s++, u.push(d.end - d.start), a += d.end - d.start);
  }
  if (s <= 1) {
    const h = (d) => {
      if (d >= t.end) {
        r();
        return;
      }
      const m = t.tasks[d++];
      if (m.kind === Yh.OperationKind.COPY)
        (0, Jh.copyData)(m, n, t.oldFileFd, i, () => h(d));
      else {
        const p = e.createRequestOptions();
        p.headers.Range = `bytes=${m.start}-${m.end - 1}`;
        const w = e.httpExecutor.createRequest(p, (E) => {
          E.on("error", i), bl(E, i) && (E.pipe(n, {
            end: !1
          }), E.once("end", () => h(d)));
        });
        e.httpExecutor.addErrorAndTimeoutHandlers(w, i), w.end();
      }
    };
    h(t.start);
    return;
  }
  const l = e.createRequestOptions();
  l.headers.Range = o.substring(0, o.length - 2);
  const f = e.httpExecutor.createRequest(l, (h) => {
    if (!bl(h, i))
      return;
    const d = (0, Sl.safeGetHeader)(h, "content-type"), m = /^multipart\/.+?\s*;\s*boundary=(?:"([^"]+)"|([^\s";]+))\s*$/i.exec(d);
    if (m == null) {
      i(new Error(`Content-Type "multipart/byteranges" is expected, but got "${d}"`));
      return;
    }
    const p = new Jh.DataSplitter(n, t, c, m[1] || m[2], u, r, a, e.options.onProgress);
    p.on("error", i), h.pipe(p), h.on("end", () => {
      setTimeout(() => {
        f.abort(), i(new Error("Response ends without calling any handlers"));
      }, 1e4);
    });
  });
  e.httpExecutor.addErrorAndTimeoutHandlers(f, i), f.end();
}
function bl(e, t) {
  if (e.statusCode >= 400)
    return t((0, Sl.createHttpError)(e)), !1;
  if (e.statusCode !== 206) {
    const n = (0, Sl.safeGetHeader)(e, "accept-ranges");
    if (n == null || n === "none")
      return t(new Error(`Server doesn't support Accept-Ranges (response code ${e.statusCode})`)), !1;
  }
  return !0;
}
var Ja = {};
Object.defineProperty(Ja, "__esModule", { value: !0 });
Ja.ProgressDifferentialDownloadCallbackTransform = void 0;
const PF = Oo;
var hi;
(function(e) {
  e[e.COPY = 0] = "COPY", e[e.DOWNLOAD = 1] = "DOWNLOAD";
})(hi || (hi = {}));
class OF extends PF.Transform {
  constructor(t, n, r) {
    super(), this.progressDifferentialDownloadInfo = t, this.cancellationToken = n, this.onProgress = r, this.start = Date.now(), this.transferred = 0, this.delta = 0, this.expectedBytes = 0, this.index = 0, this.operationType = hi.COPY, this.nextUpdate = this.start + 1e3;
  }
  _transform(t, n, r) {
    if (this.cancellationToken.cancelled) {
      r(new Error("cancelled"), null);
      return;
    }
    if (this.operationType == hi.COPY) {
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
    this.operationType = hi.COPY;
  }
  beginRangeDownload() {
    this.operationType = hi.DOWNLOAD, this.expectedBytes += this.progressDifferentialDownloadInfo.expectedByteCounts[this.index++];
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
Ja.ProgressDifferentialDownloadCallbackTransform = OF;
Object.defineProperty(Go, "__esModule", { value: !0 });
Go.DifferentialDownloader = void 0;
const Yi = et, Vc = cr, RF = k, DF = Di, FF = ar, Is = Gr, Xh = Ka, LF = Ja;
class xF {
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
    return (0, Yi.configureRequestUrl)(this.options.newUrl, t), (0, Yi.configureRequestOptions)(t), t;
  }
  doDownload(t, n) {
    if (t.version !== n.version)
      throw new Error(`version is different (${t.version} - ${n.version}), full download is required`);
    const r = this.logger, i = (0, Is.computeOperations)(t, n, r);
    r.debug != null && r.debug(JSON.stringify(i, null, 2));
    let o = 0, s = 0;
    for (const c of i) {
      const u = c.end - c.start;
      c.kind === Is.OperationKind.DOWNLOAD ? o += u : s += u;
    }
    const a = this.blockAwareFileInfo.size;
    if (o + s + (this.fileMetadataBuffer == null ? 0 : this.fileMetadataBuffer.length) !== a)
      throw new Error(`Internal error, size mismatch: downloadSize: ${o}, copySize: ${s}, newSize: ${a}`);
    return r.info(`Full: ${Zh(a)}, To download: ${Zh(o)} (${Math.round(o / (a / 100))}%)`), this.downloadFile(i);
  }
  downloadFile(t) {
    const n = [], r = () => Promise.all(n.map((i) => (0, Vc.close)(i.descriptor).catch((o) => {
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
    const r = await (0, Vc.open)(this.options.oldFile, "r");
    n.push({ descriptor: r, path: this.options.oldFile });
    const i = await (0, Vc.open)(this.options.newFile, "w");
    n.push({ descriptor: i, path: this.options.newFile });
    const o = (0, RF.createWriteStream)(this.options.newFile, { fd: i });
    await new Promise((s, a) => {
      const c = [];
      let u;
      if (!this.options.isUseMultipleRangeRequest && this.options.onProgress) {
        const E = [];
        let y = 0;
        for (const S of t)
          S.kind === Is.OperationKind.DOWNLOAD && (E.push(S.end - S.start), y += S.end - S.start);
        const _ = {
          expectedByteCounts: E,
          grandTotal: y
        };
        u = new LF.ProgressDifferentialDownloadCallbackTransform(_, this.options.cancellationToken, this.options.onProgress), c.push(u);
      }
      const l = new Yi.DigestTransform(this.blockAwareFileInfo.sha512);
      l.isValidateOnEnd = !1, c.push(l), o.on("finish", () => {
        o.close(() => {
          n.splice(1, 1);
          try {
            l.validate();
          } catch (E) {
            a(E);
            return;
          }
          s(void 0);
        });
      }), c.push(o);
      let f = null;
      for (const E of c)
        E.on("error", a), f == null ? f = E : f = f.pipe(E);
      const h = c[0];
      let d;
      if (this.options.isUseMultipleRangeRequest) {
        d = (0, Xh.executeTasksUsingMultipleRangeRequests)(this, t, h, r, a), d(0);
        return;
      }
      let m = 0, p = null;
      this.logger.info(`Differential download: ${this.options.newUrl}`);
      const w = this.createRequestOptions();
      w.redirect = "manual", d = (E) => {
        var y, _;
        if (E >= t.length) {
          this.fileMetadataBuffer != null && h.write(this.fileMetadataBuffer), h.end();
          return;
        }
        const S = t[E++];
        if (S.kind === Is.OperationKind.COPY) {
          u && u.beginFileCopy(), (0, DF.copyData)(S, h, r, a, () => d(E));
          return;
        }
        const C = `bytes=${S.start}-${S.end - 1}`;
        w.headers.range = C, (_ = (y = this.logger) === null || y === void 0 ? void 0 : y.debug) === null || _ === void 0 || _.call(y, `download range: ${C}`), u && u.beginRangeDownload();
        const j = this.httpExecutor.createRequest(w, (V) => {
          V.on("error", a), V.on("aborted", () => {
            a(new Error("response has been aborted by the server"));
          }), V.statusCode >= 400 && a((0, Yi.createHttpError)(V)), V.pipe(h, {
            end: !1
          }), V.once("end", () => {
            u && u.endRangeDownload(), ++m === 100 ? (m = 0, setTimeout(() => d(E), 1e3)) : d(E);
          });
        });
        j.on("redirect", (V, G, q) => {
          this.logger.info(`Redirect to ${kF(q)}`), p = q, (0, Yi.configureRequestUrl)(new FF.URL(p), w), j.followRedirect();
        }), this.httpExecutor.addErrorAndTimeoutHandlers(j, a), j.end();
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
        (0, Xh.checkIsRangesSupported)(s, i) && (s.on("error", i), s.on("aborted", () => {
          i(new Error("response has been aborted by the server"));
        }), s.on("data", n), s.on("end", () => r()));
      });
      this.httpExecutor.addErrorAndTimeoutHandlers(o, i), o.end();
    });
  }
}
Go.DifferentialDownloader = xF;
function Zh(e, t = " KB") {
  return new Intl.NumberFormat("en").format((e / 1024).toFixed(2)) + t;
}
function kF(e) {
  const t = e.indexOf("?");
  return t < 0 ? e : e.substring(0, t);
}
Object.defineProperty(Wa, "__esModule", { value: !0 });
Wa.GenericDifferentialDownloader = void 0;
const UF = Go;
class jF extends UF.DifferentialDownloader {
  download(t, n) {
    return this.doDownload(t, n);
  }
}
Wa.GenericDifferentialDownloader = jF;
var lr = {};
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
})(lr);
Object.defineProperty(nr, "__esModule", { value: !0 });
nr.NoOpLogger = nr.AppUpdater = void 0;
const $t = et, MF = Si, BF = ua, HF = _p, Zt = cr, qF = ut, Gc = Ma, Qt = x, Sr = Fu, Qh = zo, zF = Ba, ep = Py, VF = Vo, Wc = Ha, Kc = Po, GF = Wa, ti = lr;
class rf extends HF.EventEmitter {
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
        throw (0, $t.newError)(`Channel must be a string, but got: ${t}`, "ERR_UPDATER_INVALID_CHANNEL");
      if (t.length === 0)
        throw (0, $t.newError)("Channel must be not an empty string", "ERR_UPDATER_INVALID_CHANNEL");
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
    return (0, ep.getNetSession)();
  }
  /**
   * The logger. You can pass [electron-log](https://github.com/megahertz/electron-log), [winston](https://github.com/winstonjs/winston) or another logger with the following interface: `{ info(), warn(), error() }`.
   * Set it to `null` if you would like to disable a logging feature.
   */
  get logger() {
    return this._logger;
  }
  set logger(t) {
    this._logger = t ?? new jy();
  }
  // noinspection JSUnusedGlobalSymbols
  /**
   * test only
   * @private
   */
  set updateConfigPath(t) {
    this.clientPromise = null, this._appUpdateConfigPath = t, this.configOnDisk = new Gc.Lazy(() => this.loadUpdateConfig());
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
    super(), this.autoDownload = !0, this.autoInstallOnAppQuit = !0, this.autoRunAppAfterInstall = !0, this.allowPrerelease = !1, this.fullChangelog = !1, this.allowDowngrade = !1, this.disableWebInstaller = !1, this.disableDifferentialDownload = !1, this.forceDevUpdateConfig = !1, this.previousBlockmapBaseUrlOverride = null, this._channel = null, this.downloadedUpdateHelper = null, this.requestHeaders = null, this._logger = console, this.signals = new ti.UpdaterSignal(this), this._appUpdateConfigPath = null, this._isUpdateSupported = (o) => this.checkIfUpdateSupported(o), this._isUserWithinRollout = (o) => this.isStagingMatch(o), this.clientPromise = null, this.stagingUserIdPromise = new Gc.Lazy(() => this.getOrCreateStagingUserId()), this.configOnDisk = new Gc.Lazy(() => this.loadUpdateConfig()), this.checkForUpdatesPromise = null, this.downloadPromise = null, this.updateInfoAndProvider = null, this._testOnlyOptions = null, this.on("error", (o) => {
      this._logger.error(`Error: ${o.stack || o.message}`);
    }), n == null ? (this.app = new zF.ElectronAppAdapter(), this.httpExecutor = new ep.ElectronHttpExecutor((o, s) => this.emit("login", o, s))) : (this.app = n, this.httpExecutor = null);
    const r = this.app.version, i = (0, Sr.parse)(r);
    if (i == null)
      throw (0, $t.newError)(`App version is not a valid semver version: "${r}"`, "ERR_UPDATER_INVALID_VERSION");
    this.currentVersion = i, this.allowPrerelease = WF(i), t != null && (this.setFeedURL(t), typeof t != "string" && t.requestHeaders && (this.requestHeaders = t.requestHeaders));
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
    typeof t == "string" ? r = new VF.GenericProvider({ provider: "generic", url: t }, this, {
      ...n,
      isUseMultipleRangeRequest: (0, Wc.isUrlProbablySupportMultiRangeRequests)(t)
    }) : r = (0, Wc.createClient)(t, this, n), this.clientPromise = Promise.resolve(r);
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
      new In.Notification(r).show();
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
    const i = await this.stagingUserIdPromise.value, s = $t.UUID.parse(i).readUInt32BE(12) / 4294967295;
    return this._logger.info(`Staging percentage: ${r}, percentage: ${s}, user id: ${i}`), s < r;
  }
  computeFinalHeaders(t) {
    return this.requestHeaders != null && Object.assign(t, this.requestHeaders), t;
  }
  async isUpdateAvailable(t) {
    const n = (0, Sr.parse)(t.version);
    if (n == null)
      throw (0, $t.newError)(`This file could not be downloaded, or the latest version (from update server) does not have a valid semver version: "${t.version}"`, "ERR_UPDATER_INVALID_VERSION");
    const r = this.currentVersion;
    if ((0, Sr.eq)(n, r) || !await Promise.resolve(this.isUpdateSupported(t)) || !await Promise.resolve(this.isUserWithinRollout(t)))
      return !1;
    const o = (0, Sr.gt)(n, r), s = (0, Sr.lt)(n, r);
    return o ? !0 : this.allowDowngrade && s;
  }
  checkIfUpdateSupported(t) {
    const n = t == null ? void 0 : t.minimumSystemVersion, r = (0, BF.release)();
    if (n)
      try {
        if ((0, Sr.lt)(r, n))
          return this._logger.info(`Current OS version ${r} is less than the minimum OS version required ${n} for version ${r}`), !1;
      } catch (i) {
        this._logger.warn(`Failed to compare current OS version(${r}) with minimum OS version(${n}): ${(i.message || i).toString()}`);
      }
    return !0;
  }
  async getUpdateInfoAndProvider() {
    await this.app.whenReady(), this.clientPromise == null && (this.clientPromise = this.configOnDisk.value.then((r) => (0, Wc.createClient)(r, this, this.createProviderRuntimeOptions())));
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
    const r = new $t.CancellationToken();
    return {
      isUpdateAvailable: !0,
      versionInfo: n,
      updateInfo: n,
      cancellationToken: r,
      downloadPromise: this.autoDownload ? this.downloadUpdate(r) : null
    };
  }
  onUpdateAvailable(t) {
    this._logger.info(`Found version ${t.version} (url: ${(0, $t.asArray)(t.files).map((n) => n.url).join(", ")})`), this.emit("update-available", t);
  }
  /**
   * Start downloading update manually. You can use this method if `autoDownload` option is set to `false`.
   * @returns {Promise<Array<string>>} Paths to downloaded files.
   */
  downloadUpdate(t = new $t.CancellationToken()) {
    const n = this.updateInfoAndProvider;
    if (n == null) {
      const i = new Error("Please check update first");
      return this.dispatchError(i), Promise.reject(i);
    }
    if (this.downloadPromise != null)
      return this._logger.info("Downloading update (already in progress)"), this.downloadPromise;
    this._logger.info(`Downloading update from ${(0, $t.asArray)(n.info.files).map((i) => i.url).join(", ")}`);
    const r = (i) => {
      if (!(i instanceof $t.CancellationError))
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
    this.emit(ti.UPDATE_DOWNLOADED, t);
  }
  async loadUpdateConfig() {
    return this._appUpdateConfigPath == null && (this._appUpdateConfigPath = this.app.appUpdateConfigPath), (0, qF.load)(await (0, Zt.readFile)(this._appUpdateConfigPath, "utf-8"));
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
      if ($t.UUID.check(r))
        return r;
      this._logger.warn(`Staging user id file exists, but content was invalid: ${r}`);
    } catch (r) {
      r.code !== "ENOENT" && this._logger.warn(`Couldn't read staging user ID, creating a blank one: ${r}`);
    }
    const n = $t.UUID.v5((0, MF.randomBytes)(4096), $t.UUID.OID);
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
      r.debug != null && r.debug(`updater cache dir: ${i}`), t = new Qh.DownloadedUpdateHelper(i), this.downloadedUpdateHelper = t;
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
    this.listenerCount(ti.DOWNLOAD_PROGRESS) > 0 && (r.onProgress = (y) => this.emit(ti.DOWNLOAD_PROGRESS, y));
    const i = t.downloadUpdateOptions.updateInfoAndProvider.info, o = i.version, s = n.packageInfo;
    function a() {
      const y = decodeURIComponent(t.fileInfo.url.pathname);
      return y.toLowerCase().endsWith(`.${t.fileExtension.toLowerCase()}`) ? Qt.basename(y) : t.fileInfo.info.url;
    }
    const c = await this.getOrCreateDownloadHelper(), u = c.cacheDirForPendingUpdate;
    await (0, Zt.mkdir)(u, { recursive: !0 });
    const l = a();
    let f = Qt.join(u, l);
    const h = s == null ? null : Qt.join(u, `package-${o}${Qt.extname(s.path) || ".7z"}`), d = async (y) => {
      await c.setDownloadedFile(f, h, i, n, l, y), await t.done({
        ...i,
        downloadedFile: f
      });
      const _ = Qt.join(u, "current.blockmap");
      return await (0, Zt.pathExists)(_) && await (0, Zt.copyFile)(_, Qt.join(c.cacheDir, "current.blockmap")), h == null ? [f] : [f, h];
    }, m = this._logger, p = await c.validateDownloadedPath(f, i, n, m);
    if (p != null)
      return f = p, await d(!1);
    const w = async () => (await c.clear().catch(() => {
    }), await (0, Zt.unlink)(f).catch(() => {
    })), E = await (0, Qh.createTempUpdateFile)(`temp-${l}`, u, m);
    try {
      await t.task(E, r, h, w), await (0, $t.retry)(() => (0, Zt.rename)(E, f), {
        retries: 60,
        interval: 500,
        shouldRetry: (y) => y instanceof Error && /^EBUSY:/.test(y.message) ? !0 : (m.warn(`Cannot rename temp file to final file: ${y.message || y.stack}`), !1)
      });
    } catch (y) {
      throw await w(), y instanceof $t.CancellationError && (m.info("cancelled"), this.emit("update-cancelled", i)), y;
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
          return JSON.parse((0, Kc.gunzipSync)(p).toString());
        } catch (w) {
          throw new Error(`Cannot parse blockmap "${m.href}", error: ${w}`);
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
      this.listenerCount(ti.DOWNLOAD_PROGRESS) > 0 && (u.onProgress = (m) => this.emit(ti.DOWNLOAD_PROGRESS, m));
      const l = async (m, p) => {
        const w = Qt.join(p, "current.blockmap");
        await (0, Zt.outputFile)(w, (0, Kc.gzipSync)(JSON.stringify(m)));
      }, f = async (m) => {
        const p = Qt.join(m, "current.blockmap");
        try {
          if (await (0, Zt.pathExists)(p))
            return JSON.parse((0, Kc.gunzipSync)(await (0, Zt.readFile)(p)).toString());
        } catch (w) {
          this._logger.warn(`Cannot parse blockmap "${p}", error: ${w}`);
        }
        return null;
      }, h = await c(a[1]);
      await l(h, this.downloadedUpdateHelper.cacheDirForPendingUpdate);
      let d = await f(this.downloadedUpdateHelper.cacheDir);
      return d == null && (d = await c(a[0])), await new GF.GenericDifferentialDownloader(t.info, this.httpExecutor, u).download(d, h), !1;
    } catch (s) {
      if (this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), this._testOnlyOptions != null)
        throw s;
      return !0;
    }
  }
}
nr.AppUpdater = rf;
function WF(e) {
  const t = (0, Sr.prerelease)(e);
  return t != null && t.length > 0;
}
class jy {
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
nr.NoOpLogger = jy;
Object.defineProperty(Vr, "__esModule", { value: !0 });
Vr.BaseUpdater = void 0;
const tp = la, KF = nr;
class JF extends KF.AppUpdater {
  constructor(t, n) {
    super(t, n), this.quitAndInstallCalled = !1, this.quitHandlerAdded = !1;
  }
  quitAndInstall(t = !1, n = !1) {
    this._logger.info("Install on explicit quitAndInstall"), this.install(t, t ? n : this.autoRunAppAfterInstall) ? setImmediate(() => {
      In.autoUpdater.emit("before-quit-for-update"), this.app.quit();
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
    const i = (0, tp.spawnSync)(t, n, {
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
        const a = { stdio: i, env: r, detached: !0 }, c = (0, tp.spawn)(t, n, a);
        c.on("error", (u) => {
          s(u);
        }), c.unref(), c.pid !== void 0 && o(!0);
      } catch (a) {
        s(a);
      }
    });
  }
}
Vr.BaseUpdater = JF;
var bo = {}, Wo = {};
Object.defineProperty(Wo, "__esModule", { value: !0 });
Wo.FileWithEmbeddedBlockMapDifferentialDownloader = void 0;
const ni = cr, YF = Go, XF = Po;
class ZF extends YF.DifferentialDownloader {
  async download() {
    const t = this.blockAwareFileInfo, n = t.size, r = n - (t.blockMapSize + 4);
    this.fileMetadataBuffer = await this.readRemoteBytes(r, n - 1);
    const i = My(this.fileMetadataBuffer.slice(0, this.fileMetadataBuffer.length - 4));
    await this.doDownload(await QF(this.options.oldFile), i);
  }
}
Wo.FileWithEmbeddedBlockMapDifferentialDownloader = ZF;
function My(e) {
  return JSON.parse((0, XF.inflateRawSync)(e).toString());
}
async function QF(e) {
  const t = await (0, ni.open)(e, "r");
  try {
    const n = (await (0, ni.fstat)(t)).size, r = Buffer.allocUnsafe(4);
    await (0, ni.read)(t, r, 0, r.length, n - r.length);
    const i = Buffer.allocUnsafe(r.readUInt32BE(0));
    return await (0, ni.read)(t, i, 0, i.length, n - r.length - i.length), await (0, ni.close)(t), My(i);
  } catch (n) {
    throw await (0, ni.close)(t), n;
  }
}
Object.defineProperty(bo, "__esModule", { value: !0 });
bo.AppImageUpdater = void 0;
const np = et, rp = la, eL = cr, tL = k, Xi = x, nL = Vr, rL = Wo, iL = Ye, ip = lr;
class oL extends nL.BaseUpdater {
  constructor(t, n) {
    super(t, n);
  }
  isUpdaterActive() {
    return process.env.APPIMAGE == null && !this.forceDevUpdateConfig ? (process.env.SNAP == null ? this._logger.warn("APPIMAGE env is not defined, current application is not an AppImage") : this._logger.info("SNAP env is defined, updater is disabled"), !1) : super.isUpdaterActive();
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, iL.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "AppImage", ["rpm", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "AppImage",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        const s = process.env.APPIMAGE;
        if (s == null)
          throw (0, np.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
        (t.disableDifferentialDownload || await this.downloadDifferential(r, s, i, n, t)) && await this.httpExecutor.download(r.url, i, o), await (0, eL.chmod)(i, 493);
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
      return this.listenerCount(ip.DOWNLOAD_PROGRESS) > 0 && (s.onProgress = (a) => this.emit(ip.DOWNLOAD_PROGRESS, a)), await new rL.FileWithEmbeddedBlockMapDifferentialDownloader(t.info, this.httpExecutor, s).download(), !1;
    } catch (s) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${s.stack || s}`), process.platform === "linux";
    }
  }
  doInstall(t) {
    const n = process.env.APPIMAGE;
    if (n == null)
      throw (0, np.newError)("APPIMAGE env is not defined", "ERR_UPDATER_OLD_FILE_NOT_FOUND");
    (0, tL.unlinkSync)(n);
    let r;
    const i = Xi.basename(n), o = this.installerPath;
    if (o == null)
      return this.dispatchError(new Error("No update filepath provided, can't quit and install")), !1;
    Xi.basename(o) === i || !/\d+\.\d+\.\d+/.test(i) ? r = n : r = Xi.join(Xi.dirname(n), Xi.basename(o)), (0, rp.execFileSync)("mv", ["-f", o, r]), r !== n && this.emit("appimage-filename-updated", r);
    const s = {
      ...process.env,
      APPIMAGE_SILENT_INSTALL: "true"
    };
    return t.isForceRunAfter ? this.spawnLog(r, [], s) : (s.APPIMAGE_EXIT_AFTER_INSTALL = "true", (0, rp.execFileSync)(r, [], { env: s })), !0;
  }
}
bo.AppImageUpdater = oL;
var Ao = {}, Fi = {};
Object.defineProperty(Fi, "__esModule", { value: !0 });
Fi.LinuxUpdater = void 0;
const sL = Vr;
class aL extends sL.BaseUpdater {
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
Fi.LinuxUpdater = aL;
Object.defineProperty(Ao, "__esModule", { value: !0 });
Ao.DebUpdater = void 0;
const cL = Ye, op = lr, lL = Fi;
class of extends lL.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, cL.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "deb", ["AppImage", "rpm", "pacman"]);
    return this.executeDownload({
      fileExtension: "deb",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(op.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(op.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
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
Ao.DebUpdater = of;
var To = {};
Object.defineProperty(To, "__esModule", { value: !0 });
To.PacmanUpdater = void 0;
const sp = lr, uL = Ye, fL = Fi;
class sf extends fL.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, uL.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "pacman", ["AppImage", "deb", "rpm"]);
    return this.executeDownload({
      fileExtension: "pacman",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(sp.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(sp.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
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
To.PacmanUpdater = sf;
var Co = {};
Object.defineProperty(Co, "__esModule", { value: !0 });
Co.RpmUpdater = void 0;
const ap = lr, dL = Ye, hL = Fi;
class af extends hL.LinuxUpdater {
  constructor(t, n) {
    super(t, n);
  }
  /*** @private */
  doDownloadUpdate(t) {
    const n = t.updateInfoAndProvider.provider, r = (0, dL.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "rpm", ["AppImage", "deb", "pacman"]);
    return this.executeDownload({
      fileExtension: "rpm",
      fileInfo: r,
      downloadUpdateOptions: t,
      task: async (i, o) => {
        this.listenerCount(ap.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(ap.DOWNLOAD_PROGRESS, s)), await this.httpExecutor.download(r.url, i, o);
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
Co.RpmUpdater = af;
var No = {};
Object.defineProperty(No, "__esModule", { value: !0 });
No.MacUpdater = void 0;
const cp = et, Jc = cr, pL = k, lp = x, mL = H0, gL = nr, yL = Ye, up = la, fp = Si;
class vL extends gL.AppUpdater {
  constructor(t, n) {
    super(t, n), this.nativeUpdater = In.autoUpdater, this.squirrelDownloadedUpdate = !1, this.nativeUpdater.on("error", (r) => {
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
      this.debug("Checking for macOS Rosetta environment"), o = (0, up.execFileSync)("sysctl", [i], { encoding: "utf8" }).includes(`${i}: 1`), r.info(`Checked for macOS Rosetta environment (isRosetta=${o})`);
    } catch (f) {
      r.warn(`sysctl shell command to check for macOS Rosetta environment failed: ${f}`);
    }
    let s = !1;
    try {
      this.debug("Checking for arm64 in uname");
      const h = (0, up.execFileSync)("uname", ["-a"], { encoding: "utf8" }).includes("ARM");
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
    const c = (0, yL.findFile)(n, "zip", ["pkg", "dmg"]);
    if (c == null)
      throw (0, cp.newError)(`ZIP file not provided: ${(0, cp.safeStringifyJson)(n)}`, "ERR_UPDATER_ZIP_FILE_NOT_FOUND");
    const u = t.updateInfoAndProvider.provider, l = "update.zip";
    return this.executeDownload({
      fileExtension: "zip",
      fileInfo: c,
      downloadUpdateOptions: t,
      task: async (f, h) => {
        const d = lp.join(this.downloadedUpdateHelper.cacheDir, l), m = () => (0, Jc.pathExistsSync)(d) ? !t.disableDifferentialDownload : (r.info("Unable to locate previous update.zip for differential download (is this first install?), falling back to full download"), !1);
        let p = !0;
        m() && (p = await this.differentialDownloadInstaller(c, t, f, u, l)), p && await this.httpExecutor.download(c.url, f, h);
      },
      done: async (f) => {
        if (!t.disableDifferentialDownload)
          try {
            const h = lp.join(this.downloadedUpdateHelper.cacheDir, l);
            await (0, Jc.copyFile)(f.downloadedFile, h);
          } catch (h) {
            this._logger.warn(`Unable to copy file for caching for future differential downloads: ${h.message}`);
          }
        return this.updateDownloaded(c, f);
      }
    });
  }
  async updateDownloaded(t, n) {
    var r;
    const i = n.downloadedFile, o = (r = t.info.size) !== null && r !== void 0 ? r : (await (0, Jc.stat)(i)).size, s = this._logger, a = `fileToProxy=${t.url.href}`;
    this.closeServerIfExists(), this.debug(`Creating proxy server for native Squirrel.Mac (${a})`), this.server = (0, mL.createServer)(), this.debug(`Proxy server for native Squirrel.Mac is created (${a})`), this.server.on("close", () => {
      s.info(`Proxy server for native Squirrel.Mac is closed (${a})`);
    });
    const c = (u) => {
      const l = u.address();
      return typeof l == "string" ? l : `http://127.0.0.1:${l == null ? void 0 : l.port}`;
    };
    return await new Promise((u, l) => {
      const f = (0, fp.randomBytes)(64).toString("base64").replace(/\//g, "_").replace(/\+/g, "-"), h = Buffer.from(`autoupdater:${f}`, "ascii"), d = `/${(0, fp.randomBytes)(64).toString("hex")}.zip`;
      this.server.on("request", (m, p) => {
        const w = m.url;
        if (s.info(`${w} requested`), w === "/") {
          if (!m.headers.authorization || m.headers.authorization.indexOf("Basic ") === -1) {
            p.statusCode = 401, p.statusMessage = "Invalid Authentication Credentials", p.end(), s.warn("No authenthication info");
            return;
          }
          const _ = m.headers.authorization.split(" ")[1], S = Buffer.from(_, "base64").toString("ascii"), [C, j] = S.split(":");
          if (C !== "autoupdater" || j !== f) {
            p.statusCode = 401, p.statusMessage = "Invalid Authentication Credentials", p.end(), s.warn("Invalid authenthication credentials");
            return;
          }
          const V = Buffer.from(`{ "url": "${c(this.server)}${d}" }`);
          p.writeHead(200, { "Content-Type": "application/json", "Content-Length": V.length }), p.end(V);
          return;
        }
        if (!w.startsWith(d)) {
          s.warn(`${w} requested, but not supported`), p.writeHead(404), p.end();
          return;
        }
        s.info(`${d} requested by Squirrel.Mac, pipe ${i}`);
        let E = !1;
        p.on("finish", () => {
          E || (this.nativeUpdater.removeListener("error", l), u([]));
        });
        const y = (0, pL.createReadStream)(i);
        y.on("error", (_) => {
          try {
            p.end();
          } catch (S) {
            s.warn(`cannot end response: ${S}`);
          }
          E = !0, this.nativeUpdater.removeListener("error", l), l(new Error(`Cannot pipe "${i}": ${_}`));
        }), p.writeHead(200, {
          "Content-Type": "application/zip",
          "Content-Length": o
        }), y.pipe(p);
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
No.MacUpdater = vL;
var Io = {}, cf = {};
Object.defineProperty(cf, "__esModule", { value: !0 });
cf.verifySignature = EL;
const dp = et, By = la, wL = ua, hp = x;
function Hy(e, t) {
  return ['set "PSModulePath=" & chcp 65001 >NUL & powershell.exe', ["-NoProfile", "-NonInteractive", "-InputFormat", "None", "-Command", e], {
    shell: !0,
    timeout: t
  }];
}
function EL(e, t, n) {
  return new Promise((r, i) => {
    const o = t.replace(/'/g, "''");
    n.info(`Verifying signature ${o}`), (0, By.execFile)(...Hy(`"Get-AuthenticodeSignature -LiteralPath '${o}' | ConvertTo-Json -Compress"`, 20 * 1e3), (s, a, c) => {
      var u;
      try {
        if (s != null || c) {
          Yc(n, s, c, i), r(null);
          return;
        }
        const l = _L(a);
        if (l.Status === 0) {
          try {
            const m = hp.normalize(l.Path), p = hp.normalize(t);
            if (n.info(`LiteralPath: ${m}. Update Path: ${p}`), m !== p) {
              Yc(n, new Error(`LiteralPath of ${m} is different than ${p}`), c, i), r(null);
              return;
            }
          } catch (m) {
            n.warn(`Unable to verify LiteralPath of update asset due to missing data.Path. Skipping this step of validation. Message: ${(u = m.message) !== null && u !== void 0 ? u : m.stack}`);
          }
          const h = (0, dp.parseDn)(l.SignerCertificate.Subject);
          let d = !1;
          for (const m of e) {
            const p = (0, dp.parseDn)(m);
            if (p.size ? d = Array.from(p.keys()).every((E) => p.get(E) === h.get(E)) : m === h.get("CN") && (n.warn(`Signature validated using only CN ${m}. Please add your full Distinguished Name (DN) to publisherNames configuration`), d = !0), d) {
              r(null);
              return;
            }
          }
        }
        const f = `publisherNames: ${e.join(" | ")}, raw info: ` + JSON.stringify(l, (h, d) => h === "RawData" ? void 0 : d, 2);
        n.warn(`Sign verification failed, installer signed with incorrect certificate: ${f}`), r(f);
      } catch (l) {
        Yc(n, l, null, i), r(null);
        return;
      }
    });
  });
}
function _L(e) {
  const t = JSON.parse(e);
  delete t.PrivateKey, delete t.IsOSBinary, delete t.SignatureType;
  const n = t.SignerCertificate;
  return n != null && (delete n.Archived, delete n.Extensions, delete n.Handle, delete n.HasPrivateKey, delete n.SubjectName), t;
}
function Yc(e, t, n, r) {
  if ($L()) {
    e.warn(`Cannot execute Get-AuthenticodeSignature: ${t || n}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  try {
    (0, By.execFileSync)(...Hy("ConvertTo-Json test", 10 * 1e3));
  } catch (i) {
    e.warn(`Cannot execute ConvertTo-Json: ${i.message}. Ignoring signature validation due to unsupported powershell version. Please upgrade to powershell 3 or higher.`);
    return;
  }
  t != null && r(t), n && r(new Error(`Cannot execute Get-AuthenticodeSignature, stderr: ${n}. Failing signature validation due to unknown stderr.`));
}
function $L() {
  const e = wL.release();
  return e.startsWith("6.") && !e.startsWith("6.3");
}
Object.defineProperty(Io, "__esModule", { value: !0 });
Io.NsisUpdater = void 0;
const Ps = et, pp = x, SL = Vr, bL = Wo, mp = lr, AL = Ye, TL = cr, CL = cf, gp = ar;
class NL extends SL.BaseUpdater {
  constructor(t, n) {
    super(t, n), this._verifyUpdateCodeSignature = (r, i) => (0, CL.verifySignature)(r, i, this._logger);
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
    const n = t.updateInfoAndProvider.provider, r = (0, AL.findFile)(n.resolveFiles(t.updateInfoAndProvider.info), "exe");
    return this.executeDownload({
      fileExtension: "exe",
      downloadUpdateOptions: t,
      fileInfo: r,
      task: async (i, o, s, a) => {
        const c = r.packageInfo, u = c != null && s != null;
        if (u && t.disableWebInstaller)
          throw (0, Ps.newError)(`Unable to download new version ${t.updateInfoAndProvider.info.version}. Web Installers are disabled`, "ERR_UPDATER_WEB_INSTALLER_DISABLED");
        !u && !t.disableWebInstaller && this._logger.warn("disableWebInstaller is set to false, you should set it to true if you do not plan on using a web installer. This will default to true in a future version."), (u || t.disableDifferentialDownload || await this.differentialDownloadInstaller(r, t, i, n, Ps.CURRENT_APP_INSTALLER_FILE_NAME)) && await this.httpExecutor.download(r.url, i, o);
        const l = await this.verifySignature(i);
        if (l != null)
          throw await a(), (0, Ps.newError)(`New version ${t.updateInfoAndProvider.info.version} is not signed by the application owner: ${l}`, "ERR_UPDATER_INVALID_SIGNATURE");
        if (u && await this.differentialDownloadWebPackage(t, c, s, n))
          try {
            await this.httpExecutor.download(new gp.URL(c.path), s, {
              headers: t.requestHeaders,
              cancellationToken: t.cancellationToken,
              sha512: c.sha512
            });
          } catch (f) {
            try {
              await (0, TL.unlink)(s);
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
      this.spawnLog(pp.join(process.resourcesPath, "elevate.exe"), [n].concat(r)).catch((s) => this.dispatchError(s));
    };
    return t.isAdminRightsRequired ? (this._logger.info("isAdminRightsRequired is set to true, run installer using elevate.exe"), o(), !0) : (this.spawnLog(n, r).catch((s) => {
      const a = s.code;
      this._logger.info(`Cannot run installer: error code: ${a}, error message: "${s.message}", will be executed again using elevate if EACCES, and will try to use electron.shell.openItem if ENOENT`), a === "UNKNOWN" || a === "EACCES" ? o() : a === "ENOENT" ? In.shell.openPath(n).catch((c) => this.dispatchError(c)) : this.dispatchError(s);
    }), !0);
  }
  async differentialDownloadWebPackage(t, n, r, i) {
    if (n.blockMapSize == null)
      return !0;
    try {
      const o = {
        newUrl: new gp.URL(n.path),
        oldFile: pp.join(this.downloadedUpdateHelper.cacheDir, Ps.CURRENT_APP_PACKAGE_FILE_NAME),
        logger: this._logger,
        newFile: r,
        requestHeaders: this.requestHeaders,
        isUseMultipleRangeRequest: i.isUseMultipleRangeRequest,
        cancellationToken: t.cancellationToken
      };
      this.listenerCount(mp.DOWNLOAD_PROGRESS) > 0 && (o.onProgress = (s) => this.emit(mp.DOWNLOAD_PROGRESS, s)), await new bL.FileWithEmbeddedBlockMapDifferentialDownloader(n, this.httpExecutor, o).download();
    } catch (o) {
      return this._logger.error(`Cannot download differentially, fallback to full download: ${o.stack || o}`), process.platform === "win32";
    }
    return !1;
  }
}
Io.NsisUpdater = NL;
(function(e) {
  var t = bt && bt.__createBinding || (Object.create ? function(w, E, y, _) {
    _ === void 0 && (_ = y);
    var S = Object.getOwnPropertyDescriptor(E, y);
    (!S || ("get" in S ? !E.__esModule : S.writable || S.configurable)) && (S = { enumerable: !0, get: function() {
      return E[y];
    } }), Object.defineProperty(w, _, S);
  } : function(w, E, y, _) {
    _ === void 0 && (_ = y), w[_] = E[y];
  }), n = bt && bt.__exportStar || function(w, E) {
    for (var y in w) y !== "default" && !Object.prototype.hasOwnProperty.call(E, y) && t(E, w, y);
  };
  Object.defineProperty(e, "__esModule", { value: !0 }), e.NsisUpdater = e.MacUpdater = e.RpmUpdater = e.PacmanUpdater = e.DebUpdater = e.AppImageUpdater = e.Provider = e.NoOpLogger = e.AppUpdater = e.BaseUpdater = void 0;
  const r = cr, i = x;
  var o = Vr;
  Object.defineProperty(e, "BaseUpdater", { enumerable: !0, get: function() {
    return o.BaseUpdater;
  } });
  var s = nr;
  Object.defineProperty(e, "AppUpdater", { enumerable: !0, get: function() {
    return s.AppUpdater;
  } }), Object.defineProperty(e, "NoOpLogger", { enumerable: !0, get: function() {
    return s.NoOpLogger;
  } });
  var a = Ye;
  Object.defineProperty(e, "Provider", { enumerable: !0, get: function() {
    return a.Provider;
  } });
  var c = bo;
  Object.defineProperty(e, "AppImageUpdater", { enumerable: !0, get: function() {
    return c.AppImageUpdater;
  } });
  var u = Ao;
  Object.defineProperty(e, "DebUpdater", { enumerable: !0, get: function() {
    return u.DebUpdater;
  } });
  var l = To;
  Object.defineProperty(e, "PacmanUpdater", { enumerable: !0, get: function() {
    return l.PacmanUpdater;
  } });
  var f = Co;
  Object.defineProperty(e, "RpmUpdater", { enumerable: !0, get: function() {
    return f.RpmUpdater;
  } });
  var h = No;
  Object.defineProperty(e, "MacUpdater", { enumerable: !0, get: function() {
    return h.MacUpdater;
  } });
  var d = Io;
  Object.defineProperty(e, "NsisUpdater", { enumerable: !0, get: function() {
    return d.NsisUpdater;
  } }), n(lr, e);
  let m;
  function p() {
    if (process.platform === "win32")
      m = new Io.NsisUpdater();
    else if (process.platform === "darwin")
      m = new No.MacUpdater();
    else {
      m = new bo.AppImageUpdater();
      try {
        const w = i.join(process.resourcesPath, "package-type");
        if (!(0, r.existsSync)(w))
          return m;
        switch ((0, r.readFileSync)(w).toString().trim()) {
          case "deb":
            m = new Ao.DebUpdater();
            break;
          case "rpm":
            m = new Co.RpmUpdater();
            break;
          case "pacman":
            m = new To.PacmanUpdater();
            break;
          default:
            break;
        }
      } catch (w) {
        console.warn("Unable to detect 'package-type' for autoUpdater (rpm/deb/pacman support). If you'd like to expand support, please consider contributing to electron-builder", w.message);
      }
    }
    return m;
  }
  Object.defineProperty(e, "autoUpdater", {
    enumerable: !0,
    get: () => m || p()
  });
})(Gn);
const IL = vp(import.meta.url), Br = yp(IL), vt = process.env.VITE_DEV_SERVER_URL;
function PL() {
  const e = [
    ae.instances,
    ae.java,
    ae.icons,
    ae.skins,
    ae.mods,
    ae.logs
  ];
  for (const t of e)
    k.existsSync(t) || k.mkdirSync(t, { recursive: !0 });
}
function Os() {
  const e = new Ee({
    width: 900,
    height: 600,
    minWidth: 750,
    minHeight: 500,
    frame: !0,
    title: "Fernlauncher",
    webPreferences: {
      preload: ze(Br, "../dist-electron/preload.cjs"),
      sandbox: !1
    },
    icon: ze(De.getAppPath(), "public/iconreal.ico")
  });
  return e.setMenuBarVisibility(!1), vt ? (console.log("Main window loading URL:", vt), e.loadURL(vt)) : e.loadFile(ze(De.getAppPath(), "dist/index.html")), e;
}
function OL() {
  const e = new Ee({
    width: 600,
    height: 450,
    resizable: !0,
    minWidth: 500,
    minHeight: 400,
    frame: !0,
    title: "Welcome to Fernlauncher",
    webPreferences: {
      preload: ze(Br, "../dist-electron/preload.cjs"),
      sandbox: !1
    },
    icon: ze(De.getAppPath(), "public/iconreal.ico")
  });
  return e.setMenuBarVisibility(!1), vt ? (console.log("First launch loading URL:", vt), e.loadURL(vt + "?firstLaunch=true")) : e.loadFile(ze(De.getAppPath(), "dist/index.html"), {
    query: { firstLaunch: "true" }
  }), e;
}
function RL() {
  const e = new Ee({
    width: 700,
    height: 580,
    minWidth: 600,
    minHeight: 500,
    title: "New Instance — Fernlauncher",
    center: !0,
    webPreferences: {
      preload: ze(Br, "../dist-electron/preload.cjs"),
      sandbox: !1
    },
    icon: ze(De.getAppPath(), "public/iconreal.ico")
  });
  return e.setMenuBarVisibility(!1), vt ? e.loadURL(vt + "?window=newInstance") : e.loadFile(ze(De.getAppPath(), "dist/index.html"), {
    query: { window: "newInstance" }
  }), e;
}
async function DL() {
  const { session: e } = await import("electron"), t = Bt.get("proxy");
  t.type === "none" ? await e.defaultSession.setProxy({ mode: "direct" }) : (t.type === "http" || t.type === "socks5") && await e.defaultSession.setProxy({
    proxyRules: `${t.type}://${t.address}:${t.port}`
  });
}
function FL() {
  const e = new Ee({
    width: 850,
    height: 580,
    minWidth: 700,
    minHeight: 500,
    title: "Settings — Fernlauncher",
    center: !0,
    webPreferences: {
      preload: ze(Br, "../dist-electron/preload.cjs"),
      sandbox: !1
    },
    icon: ze(De.getAppPath(), "public/iconreal.ico")
  });
  return e.setMenuBarVisibility(!1), vt ? e.loadURL(vt + "?window=settings") : e.loadFile(ze(De.getAppPath(), "dist/index.html"), {
    query: { window: "settings" }
  }), e;
}
function LL(e) {
  const t = new Ee({
    width: 850,
    height: 600,
    minWidth: 700,
    minHeight: 400,
    title: "Console — Fernlauncher",
    center: !0,
    webPreferences: {
      preload: ze(Br, "../dist-electron/preload.cjs"),
      sandbox: !1
    },
    icon: ze(De.getAppPath(), "public/iconreal.ico")
  });
  return t.setMenuBarVisibility(!1), kN(e, t), vt ? t.loadURL(vt + `?window=console&instanceId=${e}`) : t.loadFile(ze(De.getAppPath(), "dist/index.html"), {
    query: { window: "console", instanceId: e }
  }), t;
}
De.whenReady().then(async () => {
  if (await DL(), HC(), GN(), WN(), YN(), XN(), PL(), FN(), De.isPackaged && (Gn.autoUpdater.checkForUpdatesAndNotify(), Gn.autoUpdater.on("update-available", () => {
    var n;
    (n = Ee.getAllWindows()[0]) == null || n.webContents.send("update:available");
  }), Gn.autoUpdater.on("update-downloaded", () => {
    var n;
    (n = Ee.getAllWindows()[0]) == null || n.webContents.send("update:downloaded");
  }), Gn.autoUpdater.on("download-progress", (n) => {
    var r;
    (r = Ee.getAllWindows()[0]) == null || r.webContents.send("update:progress", Math.round(n.percent));
  })), oe.handle("update:install", () => {
    Gn.autoUpdater.quitAndInstall();
  }), oe.handle("window:newInstance", () => {
    RL();
  }), oe.handle("window:settings", () => {
    FL();
  }), oe.handle("window:console", (n, r) => {
    LL(r);
  }), oe.handle("instance:openEditor", (n, r) => {
    const i = new Ee({
      width: 900,
      height: 650,
      title: "Edit Instance — Fernlauncher",
      center: !0,
      webPreferences: {
        preload: ze(Br, "../dist-electron/preload.cjs"),
        sandbox: !1
      },
      icon: ze(De.getAppPath(), "public/iconreal.ico")
    });
    i.setMenuBarVisibility(!1), vt ? i.loadURL(vt + `?window=instanceEditor&instanceId=${r}`) : i.loadFile(ze(De.getAppPath(), "dist/index.html"), {
      query: { window: "instanceEditor", instanceId: r }
    });
  }), oe.handle("launcher:openFolder", async (n, r) => {
    const o = {
      root: ae.appData,
      instances: ae.instances,
      mods: ae.mods,
      skins: ae.skins,
      java: ae.java,
      icons: ae.icons,
      logs: ae.logs,
      downloads: De.getPath("downloads")
    }[r];
    o && (k.existsSync(o) || k.mkdirSync(o, { recursive: !0 }), Zi.openPath(o));
  }), oe.handle("launcher:clearMetadataCache", async () => {
    const { session: n } = await import("electron");
    await n.defaultSession.clearCache();
  }), oe.handle("launcher:openAbout", () => {
    const n = new Ee({
      width: 400,
      height: 380,
      title: "About Fernlauncher",
      resizable: !1,
      center: !0,
      webPreferences: {
        preload: ze(Br, "../dist-electron/preload.cjs"),
        sandbox: !1
      },
      icon: ze(De.getAppPath(), "public/iconreal.ico")
    });
    n.setMenuBarVisibility(!1), vt ? n.loadURL(vt + "?window=about") : n.loadFile(ze(De.getAppPath(), "dist/index.html"), { query: { window: "about" } });
  }), oe.handle("launcher:browseFolder", async (n, r) => {
    const i = await br.showOpenDialog({
      title: `Select ${r} folder`,
      properties: ["openDirectory"]
    });
    return i.canceled ? null : i.filePaths[0];
  }), oe.handle("launcher:checkForUpdates", async () => {
    var n;
    De.isPackaged ? Gn.autoUpdater.checkForUpdates() : (n = Ee.getAllWindows()[0]) == null || n.webContents.send("update:notAvailable");
  }), Gn.autoUpdater.on("update-not-available", () => {
    var n;
    (n = Ee.getAllWindows()[0]) == null || n.webContents.send("update:notAvailable");
  }), oe.handle("instance:contextMenu", (n, r) => {
    const i = Ee.getFocusedWindow();
    if (!i) return;
    j0.buildFromTemplate([
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
  }), Bt.get("firstLaunch")) {
    const n = OL();
    oe.once("first-launch-complete", () => {
      Bt.set("firstLaunch", !1), n.close(), Os();
    });
  } else
    Os();
  De.on("activate", () => {
    Ee.getAllWindows().length === 0 && Os();
  });
  const t = process.argv.find((n) => n.startsWith("--instance"));
  if (t) {
    const n = t.split("=")[1] ?? process.argv[process.argv.indexOf(t) + 1], r = Os();
    r.webContents.once("did-finish-load", () => {
      setTimeout(() => {
        r.webContents.send("auto-launch-instance", n);
      }, 2e3);
    });
    return;
  }
});
De.on("window-all-closed", () => {
  xN(), process.platform !== "darwin" && De.quit();
});
