if (process.addAsyncListener) throw new Error("Don't require polyfill unless needed");
var r = require(6372),
  o = require(2249),
  i = r.wrap,
  s = r.massWrap,
  a = require(9090),
  c = require(3837),
  l = o.gte(process.version, "6.0.0"),
  u = o.gte(process.version, "7.0.0"),
  d = o.gte(process.version, "8.0.0"),
  p = o.gte(process.version, "11.0.0"),
  h = require(1808);
function f(e) {
  return function () {
    this.on("connection", function (e) {
      e._handle && (e._handle.onread = a(e._handle.onread));
    });
    try {
      return e.apply(this, arguments);
    } finally {
      this._handle && this._handle.onconnection && (this._handle.onconnection = a(this._handle.onconnection));
    }
  };
}
function m(e) {
  if (e && e._handle) {
    var t = e._handle;
    t._originalOnread || (t._originalOnread = t.onread);
    t.onread = a(t._originalOnread);
  }
}
u && !h._normalizeArgs ? h._normalizeArgs = function (e) {
  if (0 === e.length) return [{}, null];
  var t,
    n,
    r = e[0],
    o = {};
  "object" == typeof r && null !== r ? o = r : "string" == typeof (t = r) && !1 === (n = t, (n = Number(n)) >= 0 && n) ? o.path = r : (o.port = r, e.length > 1 && "string" == typeof e[1] && (o.host = e[1]));
  var i = e[e.length - 1];
  return "function" != typeof i ? [o, null] : [o, i];
} : u || h._normalizeConnectArgs || (h._normalizeConnectArgs = function (e) {
  var t,
    n = {};
  "object" == typeof e[0] && null !== e[0] ? n = e[0] : "string" == typeof e[0] && !1 === (t = e[0], (t = Number(t)) >= 0 && t) ? n.path = e[0] : (n.port = e[0], "string" == typeof e[1] && (n.host = e[1]));
  var r = e[e.length - 1];
  return "function" == typeof r ? [n, r] : [n];
});
"_setUpListenHandle" in h.Server.prototype ? i(h.Server.prototype, "_setUpListenHandle", f) : i(h.Server.prototype, "_listen2", f);
i(h.Socket.prototype, "connect", function (e) {
  return function () {
    var t;
    (t = d && Array.isArray(arguments[0]) && Object.getOwnPropertySymbols(arguments[0]).length > 0 ? arguments[0] : u ? h._normalizeArgs(arguments) : h._normalizeConnectArgs(arguments))[1] && (t[1] = a(t[1]));
    var n = e.apply(this, t);
    m(this);
    return n;
  };
});
var g = require(3685);
i(g.Agent.prototype, "addRequest", function (e) {
  return function (t) {
    var n = t.onSocket;
    t.onSocket = a(function (e) {
      m(e);
      return n.apply(this, arguments);
    });
    return e.apply(this, arguments);
  };
});
var _ = require(2081);
function y(e) {
  Array.isArray(e.stdio) && e.stdio.forEach(function (e) {
    e && e._handle && (e._handle.onread = a(e._handle.onread), i(e._handle, "close", N));
  });
  e._handle && (e._handle.onexit = a(e._handle.onexit));
}
_.ChildProcess ? i(_.ChildProcess.prototype, "spawn", function (e) {
  return function () {
    var t = e.apply(this, arguments);
    y(this);
    return t;
  };
}) : s(_, ["execFile", "fork", "spawn"], function (e) {
  return function () {
    var t = e.apply(this, arguments);
    y(t);
    return t;
  };
});
process._fatalException || (process._originalNextTick = process.nextTick);
var v = [];
process._nextDomainTick && v.push("_nextDomainTick");
process._tickDomainCallback && v.push("_tickDomainCallback");
s(process, v, O);
i(process, "nextTick", N);
var b = ["setTimeout", "setInterval"];
global.setImmediate && b.push("setImmediate");
var w = require(9512),
  x = global.setTimeout === w.setTimeout;
s(w, b, N);
x && s(global, b, N);
var E = require(9523);
s(E, ["lookup", "resolve", "resolve4", "resolve6", "resolveCname", "resolveMx", "resolveNs", "resolveTxt", "resolveSrv", "reverse"], O);
E.resolveNaptr && i(E, "resolveNaptr", O);
var C,
  S,
  T = require(7147);
s(T, ["watch", "rename", "truncate", "chown", "fchown", "chmod", "fchmod", "stat", "lstat", "fstat", "link", "symlink", "readlink", "realpath", "unlink", "rmdir", "mkdir", "readdir", "close", "open", "utimes", "futimes", "fsync", "write", "read", "readFile", "writeFile", "appendFile", "watchFile", "unwatchFile", "exists"], O);
T.lchown && i(T, "lchown", O);
T.lchmod && i(T, "lchmod", O);
T.ftruncate && i(T, "ftruncate", O);
try {
  C = require(9796);
} catch (e) {}
if (C && C.Deflate && C.Deflate.prototype) {
  var k = Object.getPrototypeOf(C.Deflate.prototype);
  k._transform ? i(k, "_transform", O) : k.write && k.flush && k.end && s(k, ["write", "flush", "end"], O);
}
try {
  S = require(6113);
} catch (e) {}
if (S) {
  var I = ["pbkdf2", "randomBytes"];
  p || I.push("pseudoRandomBytes");
  s(S, I, O);
}
var P = !!global.Promise && "function Promise() { [native code] }" === Promise.toString() && "function toString() { [native code] }" === Promise.toString.toString();
if (P) {
  var A = process.addAsyncListener({
    create: function () {
      P = !1;
    }
  });
  global.Promise.resolve(!0).then(function () {
    P = !1;
  });
  process.removeAsyncListener(A);
}
function O(e) {
  var t = function () {
    var t,
      n = arguments.length - 1;
    if ("function" == typeof arguments[n]) {
      t = Array(arguments.length);
      for (var r = 0; r < arguments.length - 1; r++) t[r] = arguments[r];
      t[n] = a(arguments[n]);
    }
    return e.apply(this, t || arguments);
  };
  switch (e.length) {
    case 1:
      return function (n) {
        return 1 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof n && (n = a(n)), e.call(this, n));
      };
    case 2:
      return function (n, r) {
        return 2 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof r && (r = a(r)), e.call(this, n, r));
      };
    case 3:
      return function (n, r, o) {
        return 3 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof o && (o = a(o)), e.call(this, n, r, o));
      };
    case 4:
      return function (n, r, o, i) {
        return 4 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof i && (i = a(i)), e.call(this, n, r, o, i));
      };
    case 5:
      return function (n, r, o, i, s) {
        return 5 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof s && (s = a(s)), e.call(this, n, r, o, i, s));
      };
    case 6:
      return function (n, r, o, i, s, c) {
        return 6 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof c && (c = a(c)), e.call(this, n, r, o, i, s, c));
      };
    default:
      return t;
  }
}
function N(e) {
  var t = function () {
    var t;
    if ("function" == typeof arguments[0]) {
      (t = Array(arguments.length))[0] = a(arguments[0]);
      for (var n = 1; n < arguments.length; n++) t[n] = arguments[n];
    }
    return e.apply(this, t || arguments);
  };
  switch (e.length) {
    case 1:
      return function (n) {
        return 1 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof n && (n = a(n)), e.call(this, n));
      };
    case 2:
      return function (n, r) {
        return 2 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof n && (n = a(n)), e.call(this, n, r));
      };
    case 3:
      return function (n, r, o) {
        return 3 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof n && (n = a(n)), e.call(this, n, r, o));
      };
    case 4:
      return function (n, r, o, i) {
        return 4 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof n && (n = a(n)), e.call(this, n, r, o, i));
      };
    case 5:
      return function (n, r, o, i, s) {
        return 5 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof n && (n = a(n)), e.call(this, n, r, o, i, s));
      };
    case 6:
      return function (n, r, o, i, s, c) {
        return 6 !== arguments.length ? t.apply(this, arguments) : ("function" == typeof n && (n = a(n)), e.call(this, n, r, o, i, s, c));
      };
    default:
      return t;
  }
}
P && function () {
  var e = global.Promise;
  function t(n) {
    if (!(this instanceof t)) return e(n);
    if ("function" != typeof n) return new e(n);
    var o,
      i,
      s = new e(function (e, t) {
        o = this;
        i = [function (t) {
          r(s, !1);
          return e(t);
        }, function (e) {
          r(s, !1);
          return t(e);
        }];
      });
    s.__proto__ = t.prototype;
    try {
      n.apply(o, i);
    } catch (e) {
      i[1](e);
    }
    return s;
  }
  function r(e, t) {
    e.__asl_wrapper && !t || (e.__asl_wrapper = a(o));
  }
  function o(t, n, i, s) {
    var a;
    try {
      return {
        returnVal: a = n.call(t, i),
        error: !1
      };
    } catch (e) {
      return {
        errorVal: e,
        error: !0
      };
    } finally {
      a instanceof e ? s.__asl_wrapper = function () {
        return (a.__asl_wrapper || o).apply(this, arguments);
      } : r(s, !0);
    }
  }
  function s(e) {
    return function () {
      var t = this,
        n = e.apply(t, Array.prototype.map.call(arguments, r));
      n.__asl_wrapper = function (e, r, i, s) {
        return t.__asl_wrapper ? (t.__asl_wrapper(e, function () {}, null, n), n.__asl_wrapper(e, r, i, s)) : o(e, r, i, s);
      };
      return n;
      function r(e) {
        return "function" != typeof e ? e : a(function (r) {
          var i = (t.__asl_wrapper || o)(this, e, r, n);
          if (i.error) throw i.errorVal;
          return i.returnVal;
        });
      }
    };
  }
  c.inherits(t, e);
  i(e.prototype, "then", s);
  e.prototype.chain && i(e.prototype, "chain", s);
  l ? global.Promise = require(8286)(e, r) : (["all", "race", "reject", "resolve", "accept", "defer"].forEach(function (n) {
    "function" == typeof e[n] && (t[n] = e[n]);
  }), global.Promise = t);
}();