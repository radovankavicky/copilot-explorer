var r, o, i, s, a, c, l, u;
module.exports = (u = require(8249), require(4938), require(34), o = (r = u).x64, i = o.Word, s = o.WordArray, a = r.algo, c = a.SHA512, l = a.SHA384 = c.extend({
  _doReset: function () {
    this._hash = new s.init([new i.init(3418070365, 3238371032), new i.init(1654270250, 914150663), new i.init(2438529370, 812702999), new i.init(355462360, 4144912697), new i.init(1731405415, 4290775857), new i.init(2394180231, 1750603025), new i.init(3675008525, 1694076839), new i.init(1203062813, 3204075428)]);
  },
  _doFinalize: function () {
    var e = c._doFinalize.call(this);
    e.sigBytes -= 16;
    return e;
  }
}), r.SHA384 = c._createHelper(l), r.HmacSHA384 = c._createHmacHelper(l), u.SHA384);