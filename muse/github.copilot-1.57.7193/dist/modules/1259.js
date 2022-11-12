var r,
  o = this && this.__extends || (r = Object.setPrototypeOf || {
    __proto__: []
  } instanceof Array && function (e, t) {
    e.__proto__ = t;
  } || function (e, t) {
    for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
  }, function (e, t) {
    function n() {
      this.constructor = e;
    }
    r(e, t);
    e.prototype = null === t ? Object.create(t) : (n.prototype = t.prototype, new n());
  }),
  i = require(7625),
  s = require(731),
  a = require(8723),
  c = require(5282),
  l = function (e) {
    function t() {
      return null !== e && e.apply(this, arguments) || this;
    }
    o(t, e);
    t.prototype.trackNodeHttpRequestSync = function (e) {
      e && e.request && e.response && e.duration ? s.trackRequestSync(this, e) : c.warn("trackNodeHttpRequestSync requires NodeHttpRequestTelemetry object with request, response and duration specified.");
    };
    t.prototype.trackNodeHttpRequest = function (e) {
      (e.duration || e.error) && c.warn("trackNodeHttpRequest will ignore supplied duration and error parameters. These values are collected from the request and response objects.");
      e && e.request && e.response ? s.trackRequest(this, e) : c.warn("trackNodeHttpRequest requires NodeHttpRequestTelemetry object with request and response specified.");
    };
    t.prototype.trackNodeHttpDependency = function (e) {
      e && e.request ? a.trackRequest(this, e) : c.warn("trackNodeHttpDependency requires NodeHttpDependencyTelemetry object with request specified.");
    };
    return t;
  }(i);
module.exports = l;