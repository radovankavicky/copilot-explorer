(() => {
	var e = {
			271: (e, t, n) => {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.defaultFileSystem = t.FileSystem = void 0;
				const r = n(747);
				t.FileSystem = class {}, t.defaultFileSystem = {
					readFile: e => r.promises.readFile(e),
					mtime: async e => (await r.promises.stat(e)).mtimeMs,
					async stat(e) {
						const t = await r.promises.stat(e);
						return {
							ctime: t.ctimeMs,
							mtime: t.mtimeMs,
							size: t.size
						}
					}
				}
			},
			876: (e, t) => {
				"use strict";

				function n(e) {
					return "virtual" === e.type
				}

				function r(e) {
					return "top" === e.type
				}
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.duplicateTree = t.cutTreeAfterLine = t.isTop = t.isVirtual = t.isLine = t.isBlank = t.topNode = t.blankNode = t.lineNode = t.virtualNode = void 0, t.virtualNode = function(e, t, n) {
					return {
						type: "virtual",
						indentation: e,
						subs: t,
						label: n
					}
				}, t.lineNode = function(e, t, n, r, s) {
					if ("" === n) throw new Error("Cannot create a line node with an empty source line");
					return {
						type: "line",
						indentation: e,
						lineNumber: t,
						sourceLine: n,
						subs: r,
						label: s
					}
				}, t.blankNode = function(e) {
					return {
						type: "blank",
						lineNumber: e,
						subs: []
					}
				}, t.topNode = function(e) {
					return {
						type: "top",
						indentation: -1,
						subs: null != e ? e : []
					}
				}, t.isBlank = function(e) {
					return "blank" === e.type
				}, t.isLine = function(e) {
					return "line" === e.type
				}, t.isVirtual = n, t.isTop = r, t.cutTreeAfterLine = function(e, t) {
					! function e(s) {
						if (!n(s) && !r(s) && s.lineNumber === t) return s.subs = [], !0;
						for (let t = 0; t < s.subs.length; t++)
							if (e(s.subs[t])) return s.subs = s.subs.slice(0, t + 1), !0;
						return !1
					}(e)
				}, t.duplicateTree = function(e) {
					return JSON.parse(JSON.stringify(e))
				}
			},
			617: (e, t, n) => {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.rebuildTree = t.foldTree = t.visitTreeConditionally = t.visitTree = t.resetLineNumbers = t.mapLabels = t.clearLabelsIf = t.clearLabels = void 0;
				const r = n(876);

				function s(e, t, n) {
					! function e(r) {
						"topDown" === n && t(r), r.subs.forEach((t => {
							e(t)
						})), "bottomUp" === n && t(r)
					}(e)
				}
				t.clearLabels = function(e) {
					return s(e, (e => {
						e.label = void 0
					}), "bottomUp"), e
				}, t.clearLabelsIf = function(e, t) {
					return s(e, (e => {
						e.label = e.label ? t(e.label) ? void 0 : e.label : void 0
					}), "bottomUp"), e
				}, t.mapLabels = function e(t, n) {
					switch (t.type) {
						case "line":
						case "virtual":
							const r = t.subs.map((t => e(t, n)));
							return {
								...t, subs: r, label: t.label ? n(t.label) : void 0
							};
						case "blank":
							return {
								...t, label: t.label ? n(t.label) : void 0
							};
						case "top":
							return {
								...t, subs: t.subs.map((t => e(t, n))), label: t.label ? n(t.label) : void 0
							}
					}
				}, t.resetLineNumbers = function(e) {
					let t = 0;
					s(e, (function(e) {
						r.isVirtual(e) || r.isTop(e) || (e.lineNumber = t, t++)
					}), "topDown")
				}, t.visitTree = s, t.visitTreeConditionally = function(e, t, n) {
					! function e(r) {
						if ("topDown" === n && !t(r)) return !1;
						let s = !0;
						return r.subs.forEach((t => {
							s = s && e(t)
						})), "bottomUp" === n && (s = s && t(r)), s
					}(e)
				}, t.foldTree = function(e, t, n, r) {
					let i = t;
					return s(e, (function(e) {
						i = n(e, i)
					}), r), i
				}, t.rebuildTree = function(e, t, n) {
					const s = e => {
							if (void 0 !== n && n(e)) return e; {
								const n = e.subs.map(s).filter((e => void 0 !== e));
								return e.subs = n, t(e)
							}
						},
						i = s(e);
					return void 0 !== i ? i : r.topNode()
				}
			},
			469: (e, t, n) => {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.parseTree = t.registerLanguageSpecificParser = t.flattenVirtual = t.groupBlocks = t.combineClosersAndOpeners = t.buildLabelRules = t.labelVirtualInherited = t.labelLines = t.parseRaw = void 0;
				const r = n(876),
					s = n(617);

				function i(e) {
					const t = e.split("\n"),
						n = t.map((e => e.match(/^\s*/)[0].length)),
						s = t.map((e => e.trimLeft()));

					function i(e) {
						const [t, i] = o(e + 1, n[e]);
						return [r.lineNode(n[e], e, s[e], t), i]
					}

					function o(e, t) {
						let o;
						const a = [];
						let l, c = e;
						for (; c < s.length && ("" === s[c] || n[c] > t);)
							if ("" === s[c]) void 0 === l && (l = c), c += 1;
							else {
								if (void 0 !== l) {
									for (let e = l; e < c; e++) a.push(r.blankNode(e));
									l = void 0
								} [o, c] = i(c), a.push(o)
							} return void 0 !== l && (c = l), [a, c]
					}
					const [a, l] = o(0, -1);
					let c = l;
					for (; c < s.length && "" === s[c];) a.push(r.blankNode(c)), c += 1;
					if (c < s.length) throw new Error(`Parsing did not go to end of file. Ended at ${c} out of ${s.length}`);
					return r.topNode(a)
				}

				function o(e, t) {
					s.visitTree(e, (function(e) {
						if (r.isLine(e)) {
							const n = t.find((t => t.matches(e.sourceLine)));
							n && (e.label = n.label)
						}
					}), "bottomUp")
				}

				function a(e) {
					return Object.keys(e).map((t => {
						let n;
						return n = e[t].test ? n => e[t].test(n) : e[t], {
							matches: n,
							label: t
						}
					}))
				}

				function l(e) {
					const t = s.rebuildTree(e, (function(e) {
						if (0 === e.subs.length || -1 === e.subs.findIndex((e => "closer" === e.label || "opener" === e.label))) return e;
						const t = [];
						let n;
						for (let s = 0; s < e.subs.length; s++) {
							const i = e.subs[s],
								o = e.subs[s - 1];
							if ("opener" === i.label && void 0 !== o && r.isLine(o)) o.subs.push(i), i.subs.forEach((e => o.subs.push(e))), i.subs = [];
							else if ("closer" === i.label && void 0 !== n && (r.isLine(i) || r.isVirtual(i)) && i.indentation >= n.indentation) {
								let e = t.length - 1;
								for (; e > 0 && r.isBlank(t[e]);) e -= 1;
								if (n.subs.push(...t.splice(e + 1)), i.subs.length > 0) {
									const e = n.subs.findIndex((e => "newVirtual" !== e.label)),
										t = n.subs.slice(0, e),
										s = n.subs.slice(e),
										o = s.length > 0 ? [r.virtualNode(i.indentation, s, "newVirtual")] : [];
									n.subs = [...t, ...o, i]
								} else n.subs.push(i)
							} else t.push(i), r.isBlank(i) || (n = i)
						}
						return e.subs = t, e
					}));
					return s.clearLabelsIf(e, (e => "newVirtual" === e)), t
				}
				t.parseRaw = i, t.labelLines = o, t.labelVirtualInherited = function(e) {
					s.visitTree(e, (function(e) {
						if (r.isVirtual(e) && void 0 === e.label) {
							const t = e.subs.filter((e => !r.isBlank(e)));
							1 === t.length && (e.label = t[0].label)
						}
					}), "bottomUp")
				}, t.buildLabelRules = a, t.combineClosersAndOpeners = l, t.groupBlocks = function(e, t = r.isBlank, n) {
					return s.rebuildTree(e, (function(e) {
						if (e.subs.length <= 1) return e;
						const s = [];
						let i, o = [],
							a = !1;

						function l(e = !1) {
							if (void 0 !== i && (s.length > 0 || !e)) {
								const e = r.virtualNode(i, o, n);
								s.push(e)
							} else o.forEach((e => s.push(e)))
						}
						for (let n = 0; n < e.subs.length; n++) {
							const s = e.subs[n],
								c = t(s);
							!c && a && (l(), o = []), a = c, o.push(s), r.isBlank(s) || (i = null != i ? i : s.indentation)
						}
						return l(!0), e.subs = s, e
					}))
				}, t.flattenVirtual = function(e) {
					return s.rebuildTree(e, (function(e) {
						return r.isVirtual(e) && void 0 === e.label && e.subs.length <= 1 ? 0 === e.subs.length ? void 0 : e.subs[0] : (1 === e.subs.length && r.isVirtual(e.subs[0]) && void 0 === e.subs[0].label && (e.subs = e.subs[0].subs), e)
					}))
				};
				const c = a({
						opener: /^[\[({]/,
						closer: /^[\])}]/
					}),
					u = {};
				t.registerLanguageSpecificParser = function(e, t) {
					u[e] = t
				}, t.parseTree = function(e, t) {
					const n = i(e),
						r = u[null != t ? t : ""];
					return r ? r(n) : (o(n, c), l(n))
				}
			},
			250: (e, t, n) => {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.getWindowsDelineations = void 0;
				const r = n(469),
					s = n(617);
				t.getWindowsDelineations = function(e, t, n, i) {
					if (e.length < n || 0 == i) return [];
					const o = [],
						a = s.clearLabels(r.parseTree(e.join("\n"), t));
					return s.visitTree(a, (e => {
						if ("blank" === e.type) return void(e.label = {
							totalLength: 1,
							firstLineAfter: e.lineNumber + 1
						});
						let t = "line" === e.type ? 1 : 0,
							r = "line" === e.type ? e.lineNumber + 1 : NaN;

						function s(n) {
							return -1 == n ? r - t : e.subs[n].label.firstLineAfter - e.subs[n].label.totalLength
						}

						function a(t, n) {
							return 0 == t ? n + 1 : e.subs[t - 1].label.firstLineAfter
						}
						let l = "line" === e.type ? -1 : 0,
							c = "line" === e.type ? 1 : 0,
							u = 0;
						for (let _ = 0; _ < e.subs.length; _++) {
							for (; l >= 0 && l < e.subs.length && "blank" === e.subs[l].type;) c -= e.subs[l].label.totalLength, l++;
							if ("blank" !== e.subs[_].type && (u = _), r = e.subs[_].label.firstLineAfter, t += e.subs[_].label.totalLength, c += e.subs[_].label.totalLength, c > i) {
								const t = s(l),
									r = a(_, t),
									d = u == _ ? r : a(u, t);
								for (n <= r - t && o.push([t, d]); c > i;) c -= -1 == l ? "line" == e.type ? 1 : 0 : e.subs[l].label.totalLength, l++
							}
						}
						if (l < e.subs.length) {
							const t = s(l),
								i = r,
								a = -1 == l ? i : e.subs[u].label.firstLineAfter;
							n <= i - t && o.push([t, a])
						}
						e.label = {
							totalLength: t,
							firstLineAfter: r
						}
					}), "bottomUp"), o.sort(((e, t) => e[0] - t[0] || e[1] - t[1])).filter(((e, t, n) => 0 == t || e[0] != n[t - 1][0] || e[1] != n[t - 1][1]))
				}
			},
			417: (e, t) => {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.getPathMarker = t.getLanguageMarker = t.comment = t.hasLanguageMarker = t.languageCommentMarkers = void 0, t.languageCommentMarkers = {
					abap: {
						start: '"',
						end: ""
					},
					bat: {
						start: "REM",
						end: ""
					},
					bibtex: {
						start: "%",
						end: ""
					},
					blade: {
						start: "#",
						end: ""
					},
					c: {
						start: "//",
						end: ""
					},
					clojure: {
						start: ";",
						end: ""
					},
					coffeescript: {
						start: "//",
						end: ""
					},
					cpp: {
						start: "//",
						end: ""
					},
					csharp: {
						start: "//",
						end: ""
					},
					css: {
						start: "/*",
						end: "*/"
					},
					dart: {
						start: "//",
						end: ""
					},
					dockerfile: {
						start: "#",
						end: ""
					},
					elixir: {
						start: "#",
						end: ""
					},
					erb: {
						start: "<%#",
						end: "%>"
					},
					erlang: {
						start: "%",
						end: ""
					},
					fsharp: {
						start: "//",
						end: ""
					},
					go: {
						start: "//",
						end: ""
					},
					groovy: {
						start: "//",
						end: ""
					},
					haml: {
						start: "-#",
						end: ""
					},
					handlebars: {
						start: "{{!",
						end: "}}"
					},
					haskell: {
						start: "--",
						end: ""
					},
					html: {
						start: "\x3c!--",
						end: "--\x3e"
					},
					ini: {
						start: ";",
						end: ""
					},
					java: {
						start: "//",
						end: ""
					},
					javascript: {
						start: "//",
						end: ""
					},
					javascriptreact: {
						start: "//",
						end: ""
					},
					jsonc: {
						start: "//",
						end: ""
					},
					jsx: {
						start: "//",
						end: ""
					},
					julia: {
						start: "#",
						end: ""
					},
					kotlin: {
						start: "//",
						end: ""
					},
					latex: {
						start: "%",
						end: ""
					},
					less: {
						start: "//",
						end: ""
					},
					lua: {
						start: "--",
						end: ""
					},
					makefile: {
						start: "#",
						end: ""
					},
					markdown: {
						start: "[]: #",
						end: ""
					},
					"objective-c": {
						start: "//",
						end: ""
					},
					"objective-cpp": {
						start: "//",
						end: ""
					},
					perl: {
						start: "#",
						end: ""
					},
					php: {
						start: "//",
						end: ""
					},
					powershell: {
						start: "#",
						end: ""
					},
					pug: {
						start: "//",
						end: ""
					},
					python: {
						start: "#",
						end: ""
					},
					ql: {
						start: "//",
						end: ""
					},
					r: {
						start: "#",
						end: ""
					},
					razor: {
						start: "\x3c!--",
						end: "--\x3e"
					},
					ruby: {
						start: "#",
						end: ""
					},
					rust: {
						start: "//",
						end: ""
					},
					sass: {
						start: "//",
						end: ""
					},
					scala: {
						start: "//",
						end: ""
					},
					scss: {
						start: "//",
						end: ""
					},
					shellscript: {
						start: "#",
						end: ""
					},
					slim: {
						start: "/",
						end: ""
					},
					solidity: {
						start: "//",
						end: ""
					},
					sql: {
						start: "--",
						end: ""
					},
					stylus: {
						start: "//",
						end: ""
					},
					svelte: {
						start: "\x3c!--",
						end: "--\x3e"
					},
					swift: {
						start: "//",
						end: ""
					},
					terraform: {
						start: "#",
						end: ""
					},
					tex: {
						start: "%",
						end: ""
					},
					typescript: {
						start: "//",
						end: ""
					},
					typescriptreact: {
						start: "//",
						end: ""
					},
					vb: {
						start: "'",
						end: ""
					},
					verilog: {
						start: "//",
						end: ""
					},
					"vue-html": {
						start: "\x3c!--",
						end: "--\x3e"
					},
					vue: {
						start: "//",
						end: ""
					},
					xml: {
						start: "\x3c!--",
						end: "--\x3e"
					},
					xsl: {
						start: "\x3c!--",
						end: "--\x3e"
					},
					yaml: {
						start: "#",
						end: ""
					}
				};
				const n = ["php", "plaintext"],
					r = {
						html: "<!DOCTYPE html>",
						python: "#!/usr/bin/env python3",
						ruby: "#!/usr/bin/env ruby",
						shellscript: "#!/bin/sh",
						yaml: "# YAML data"
					};

				function s({
					source: e
				}) {
					return e.startsWith("#!") || e.startsWith("<!DOCTYPE")
				}

				function i(e, n) {
					const r = t.languageCommentMarkers[n];
					if (r) {
						const t = "" == r.end ? "" : " " + r.end;
						return `${r.start} ${e}${t}`
					}
					return ""
				}
				t.hasLanguageMarker = s, t.comment = i, t.getLanguageMarker = function(e) {
					const {
						languageId: t
					} = e;
					return -1 !== n.indexOf(t) || s(e) ? "" : t in r ? r[t] : i(`Language: ${t}`, t)
				}, t.getPathMarker = function(e) {
					return e.relativePath ? i(`Path: ${e.relativePath}`, e.languageId) : ""
				}
			},
			563: function(e, t, n) {
				"use strict";
				var r = this && this.__createBinding || (Object.create ? function(e, t, n, r) {
						void 0 === r && (r = n), Object.defineProperty(e, r, {
							enumerable: !0,
							get: function() {
								return t[n]
							}
						})
					} : function(e, t, n, r) {
						void 0 === r && (r = n), e[r] = t[n]
					}),
					s = this && this.__exportStar || function(e, t) {
						for (var n in e) "default" === n || Object.prototype.hasOwnProperty.call(t, n) || r(t, e, n)
					};
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.createWorker = t.FileSystem = t.comment = t.languageCommentMarkers = void 0;
				const i = n(622),
					o = n(13);
				s(n(306), t), s(n(610), t), s(n(312), t), s(n(94), t);
				var a = n(417);
				Object.defineProperty(t, "languageCommentMarkers", {
					enumerable: !0,
					get: function() {
						return a.languageCommentMarkers
					}
				}), Object.defineProperty(t, "comment", {
					enumerable: !0,
					get: function() {
						return a.comment
					}
				});
				var l = n(271);
				Object.defineProperty(t, "FileSystem", {
					enumerable: !0,
					get: function() {
						return l.FileSystem
					}
				}), t.createWorker = function() {
					return new o.Worker(i.resolve(__dirname, "..", "dist", "worker.js"))
				}
			},
			179: (e, t, n) => {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.extractLocalImportContext = t.getDocComment = void 0;
				const r = n(622),
					s = n(306);

				function i(e, t) {
					var n;
					let s = null === (n = t.namedChild(1)) || void 0 === n ? void 0 : n.text.slice(1, -1);
					if (!s || !s.startsWith(".")) return null;
					if ("" === r.extname(s)) s += ".ts";
					else if (".ts" !== r.extname(s)) return null;
					return r.join(r.dirname(e), s)
				}

				function o(e) {
					var t, n, r, s, i;
					let o = [];
					if ("import_clause" === (null === (t = e.namedChild(0)) || void 0 === t ? void 0 : t.type)) {
						let t = e.namedChild(0);
						if ("named_imports" === (null === (n = null == t ? void 0 : t.namedChild(0)) || void 0 === n ? void 0 : n.type)) {
							let e = t.namedChild(0);
							for (let t of null !== (r = null == e ? void 0 : e.namedChildren) && void 0 !== r ? r : [])
								if ("import_specifier" === t.type) {
									const e = null === (s = t.childForFieldName("name")) || void 0 === s ? void 0 : s.text;
									if (e) {
										const n = null === (i = t.childForFieldName("alias")) || void 0 === i ? void 0 : i.text;
										o.push({
											name: e,
											alias: n
										})
									}
								}
						}
					}
					return o
				}
				const a = new Map;

				function l(e, t) {
					var n, r;
					let s = null !== (r = null === (n = null == t ? void 0 : t.childForFieldName("name")) || void 0 === n ? void 0 : n.text) && void 0 !== r ? r : "";
					switch (null == t ? void 0 : t.type) {
						case "ambient_declaration":
							return l(e, t.namedChild(0));
						case "interface_declaration":
						case "enum_declaration":
						case "type_alias_declaration":
							return {
								name: s, decl: t.text
							};
						case "function_declaration":
						case "function_signature":
							return {
								name: s, decl: c(e, t)
							};
						case "class_declaration": {
							let n = function(e, t) {
									let n = t.childForFieldName("body");
									if (n) return n.namedChildren.map((t => _(e, t))).filter((e => e))
								}(e, t),
								r = "";
							if (n) {
								let s = t.childForFieldName("body");
								r = `declare ${e.substring(t.startIndex,s.startIndex+1)}`, r += n.map((e => "\n" + e)).join(""), r += "\n}"
							}
							return {
								name: s,
								decl: r
							}
						}
					}
					return {
						name: s,
						decl: ""
					}
				}

				function c(e, t) {
					var n, r, s;
					const i = null !== (r = null === (n = t.childForFieldName("return_type")) || void 0 === n ? void 0 : n.endIndex) && void 0 !== r ? r : null === (s = t.childForFieldName("parameters")) || void 0 === s ? void 0 : s.endIndex;
					if (void 0 !== i) {
						let n = e.substring(t.startIndex, i) + ";";
						return "function_declaration" === t.type || "function_signature" === t.type ? "declare " + n : n
					}
					return ""
				}

				function u(e, t) {
					const n = s.getFirstPrecedingComment(t);
					return n ? e.substring(n.startIndex, t.startIndex) : ""
				}

				function _(e, t) {
					var n, r, i, o, a;
					if ("accessibility_modifier" === (null === (n = null == t ? void 0 : t.firstChild) || void 0 === n ? void 0 : n.type) && "private" === t.firstChild.text) return "";
					const l = s.getFirstPrecedingComment(t),
						d = null !== (r = function(e, t) {
							let n = t.startIndex - 1;
							for (; n >= 0 && (" " === e[n] || "\t" === e[n]);) n--;
							if (n < 0 || "\n" === e[n]) return e.substring(n + 1, t.startIndex)
						}(e, null != l ? l : t)) && void 0 !== r ? r : "  ",
						f = u(e, t);
					switch (t.type) {
						case "ambient_declaration":
							const n = t.namedChild(0);
							return n ? d + f + _(e, n) : "";
						case "method_definition":
						case "method_signature":
							return d + f + c(e, t);
						case "public_field_definition": {
							let n = null !== (o = null === (i = t.childForFieldName("type")) || void 0 === i ? void 0 : i.endIndex) && void 0 !== o ? o : null === (a = t.childForFieldName("name")) || void 0 === a ? void 0 : a.endIndex;
							if (void 0 !== n) return d + f + e.substring(t.startIndex, n) + ";"
						}
					}
					return ""
				}
				async function d(e, t, n) {
					let r = new Map,
						i = -1;
					try {
						i = await n.mtime(e)
					} catch {
						return r
					}
					let o = a.get(e);
					if (o && o.mtime === i) return o.exports;
					if ("typescript" === t) {
						let i = null;
						try {
							let o = (await n.readFile(e)).toString();
							i = await s.parseTree(t, o);
							for (let e of s.queryExports(t, i.rootNode))
								for (let t of e.captures) {
									let e = t.node;
									if ("export_statement" === e.type) {
										let t = e.childForFieldName("declaration");
										if (null == t ? void 0 : t.hasError()) continue;
										let {
											name: n,
											decl: s
										} = l(o, t);
										if (n) {
											s = u(o, e) + s;
											let t = r.get(n);
											t || (t = [], r.set(n, t)), t.push(s)
										}
									}
								}
						} catch {} finally {
							i && i.delete()
						}
					}
					if (a.size > 2e3)
						for (let e of a.keys())
							if (a.delete(e), r.size <= 1e3) break;
					return a.set(e, {
						mtime: i,
						exports: r
					}), r
				}
				t.getDocComment = u;
				const f = /^\s*import\s*(type|)\s*\{[^}]*\}\s*from\s*['"]\./gm;
				t.extractLocalImportContext = async function(e, t) {
					let {
						source: n,
						uri: r,
						languageId: a
					} = e;
					return t && "typescript" === a ? async function(e, t, n) {
						let r = "typescript",
							a = [];
						const l = function(e) {
							let t, n = -1;
							f.lastIndex = -1;
							do {
								t = f.exec(e), t && (n = f.lastIndex + t.length)
							} while (t);
							if (-1 === n) return -1;
							const r = e.indexOf("\n", n);
							return -1 !== r ? r : e.length
						}(e);
						if (-1 === l) return a;
						e = e.substring(0, l);
						let c = await s.parseTree(r, e);
						try {
							for (let e of function(e) {
									let t = [];
									for (let n of e.namedChildren) "import_statement" === n.type && t.push(n);
									return t
								}(c.rootNode)) {
								let s = i(t, e);
								if (!s) continue;
								let l = o(e);
								if (0 === l.length) continue;
								let c = await d(s, r, n);
								for (let e of l) c.has(e.name) && a.push(...c.get(e.name))
							}
						} finally {
							c.delete()
						}
						return a
					}(n, r, t): []
				}
			},
			306: (e, t, n) => {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.getFunctionPositions = t.getFirstPrecedingComment = t.isFunctionDefinition = t.isFunction = t.getAncestorWithSiblingFunctions = t.queryPythonIsDocstring = t.queryGlobalVars = t.queryExports = t.queryImports = t.queryFunctions = t.getBlockCloseToken = t.parsesWithoutError = t.parseTree = t.getLanguage = t.languageIdToWasmLanguage = t.isSupportedLanguageId = t.WASMLanguage = void 0;
				const r = n(622),
					s = n(87),
					i = n(87);
				var o;
				! function(e) {
					e.Python = "python", e.JavaScript = "javascript", e.TypeScript = "typescript", e.Go = "go", e.Ruby = "ruby"
				}(o = t.WASMLanguage || (t.WASMLanguage = {}));
				const a = {
					python: o.Python,
					javascript: o.JavaScript,
					javascriptreact: o.JavaScript,
					jsx: o.JavaScript,
					typescript: o.TypeScript,
					typescriptreact: o.TypeScript,
					go: o.Go,
					ruby: o.Ruby
				};

				function l(e) {
					if (!(e in a)) throw new Error(`Unrecognized language: ${e}`);
					return a[e]
				}
				t.isSupportedLanguageId = function(e) {
					return e in a
				}, t.languageIdToWasmLanguage = l;
				const c = {
						python: [
							["(function_definition body: (block\n             (expression_statement (string))? @docstring) @body) @function"],
							['(ERROR ("def" (identifier) (parameters))) @function']
						],
						javascript: [
							["[\n            (function body: (statement_block) @body)\n            (function_declaration body: (statement_block) @body)\n            (generator_function body: (statement_block) @body)\n            (generator_function_declaration body: (statement_block) @body)\n            (method_definition body: (statement_block) @body)\n          ] @function"]
						],
						typescript: [
							["[\n            (function body: (statement_block) @body)\n            (function_declaration body: (statement_block) @body)\n            (generator_function body: (statement_block) @body)\n            (generator_function_declaration body: (statement_block) @body)\n            (method_definition body: (statement_block) @body)\n          ] @function"]
						],
						go: [
							["[\n            (function_declaration body: (block) @body)\n            (method_declaration body: (block) @body)\n          ] @function"]
						],
						ruby: [
							['[\n            (method name: (_) parameters: (method_parameters)? @params [(_)+ "end"] @body)\n            (singleton_method name: (_) parameters: (method_parameters)? @params [(_)+ "end"] @body)\n          ] @function']
						]
					},
					u = '(variable_declarator value: (call_expression function: ((identifier) @req (#eq? @req "require"))))',
					_ = `\n    (lexical_declaration ${u}+)\n    (variable_declaration ${u}+)\n`,
					d = {
						python: [
							["(module (future_import_statement) @import)"],
							["(module (import_statement) @import)"],
							["(module (import_from_statement) @import)"]
						],
						javascript: [
							[`(program [ ${_} ] @import)`],
							["(program [ (import_statement) ] @import)"]
						],
						typescript: [
							[`(program [ ${_} ] @import)`],
							["(program [ (import_statement) (import_alias) ] @import)"]
						],
						go: [],
						ruby: []
					},
					f = {
						python: [],
						javascript: [
							["(program (export_statement) @export)"]
						],
						typescript: [
							["(program (export_statement) @export)"]
						],
						go: [],
						ruby: []
					},
					p = {
						python: [
							["(module (global_statement) @globalVar)"],
							["(module (expression_statement) @globalVar)"]
						],
						javascript: [],
						typescript: [],
						go: [],
						ruby: []
					},
					h = {
						python: new Set(["function_definition"]),
						javascript: new Set(["function", "function_declaration", "generator_function", "generator_function_declaration", "method_definition", "arrow_function"]),
						typescript: new Set(["function", "function_declaration", "generator_function", "generator_function_declaration", "method_definition", "arrow_function"]),
						go: new Set(["function_declaration", "method_declaration"]),
						ruby: new Set(["method", "singleton_method"])
					},
					m = {
						python: e => {
							var t;
							return "module" === e.type || "block" === e.type && "class_definition" === (null === (t = e.parent) || void 0 === t ? void 0 : t.type)
						},
						javascript: e => "program" === e.type || "class_body" === e.type,
						typescript: e => "program" === e.type || "class_body" === e.type,
						go: e => "source_file" === e.type,
						ruby: e => "program" === e.type || "class" === e.type
					},
					g = new Map;
				async function y(e) {
					const t = l(e);
					if (!g.has(t)) {
						const e = await async function(e) {
							await s.init();
							const t = r.resolve(__dirname, "..", "dist", `tree-sitter-${e}.wasm`);
							return i.Language.load(t)
						}(t);
						g.set(t, e)
					}
					return g.get(t)
				}
				async function b(e, t) {
					let n = await y(e);
					const r = new s;
					r.setLanguage(n);
					const i = r.parse(t);
					return r.delete(), i
				}

				function w(e, t) {
					const n = [];
					for (const r of e) {
						if (!r[1]) {
							const e = t.tree.getLanguage();
							r[1] = e.query(r[0])
						}
						n.push(...r[1].matches(t))
					}
					return n
				}

				function v(e, t) {
					return w(c[l(e)], t)
				}
				t.getLanguage = y, t.parseTree = b, t.parsesWithoutError = async function(e, t) {
					const n = await b(e, t),
						r = !n.rootNode.hasError();
					return n.delete(), r
				}, t.getBlockCloseToken = function(e) {
					switch (l(e)) {
						case o.Python:
							return null;
						case o.JavaScript:
						case o.TypeScript:
						case o.Go:
							return "}";
						case o.Ruby:
							return "end"
					}
				}, t.queryFunctions = v, t.queryImports = function(e, t) {
					return w(d[l(e)], t)
				}, t.queryExports = function(e, t) {
					return w(f[l(e)], t)
				}, t.queryGlobalVars = function(e, t) {
					return w(p[l(e)], t)
				};
				const x = ["[\n    (class_definition (block (expression_statement (string))))\n    (function_definition (block (expression_statement (string))))\n]"];

				function E(e, t) {
					return h[l(e)].has(t.type)
				}
				t.queryPythonIsDocstring = function(e) {
					return 1 == w([x], e).length
				}, t.getAncestorWithSiblingFunctions = function(e, t) {
					const n = m[l(e)];
					for (; t.parent;) {
						if (n(t.parent)) return t;
						t = t.parent
					}
					return t.parent ? t : null
				}, t.isFunction = E, t.isFunctionDefinition = function(e, t) {
					switch (l(e)) {
						case o.Python:
						case o.Go:
						case o.Ruby:
							return E(e, t);
						case o.JavaScript:
						case o.TypeScript:
							if ("function_declaration" === t.type || "generator_function_declaration" === t.type || "method_definition" === t.type) return !0;
							if ("lexical_declaration" === t.type || "variable_declaration" === t.type) {
								if (t.namedChildCount > 1) return !1;
								let n = t.namedChild(0);
								if (null == n) return !1;
								let r = n.namedChild(1);
								return null !== r && E(e, r)
							}
							if ("expression_statement" === t.type) {
								let n = t.namedChild(0);
								if ("assignment_expression" === (null == n ? void 0 : n.type)) {
									let t = n.namedChild(1);
									return null !== t && E(e, t)
								}
							}
							return !1
					}
				}, t.getFirstPrecedingComment = function(e) {
					var t;
					let n = e;
					for (;
						"comment" === (null === (t = n.previousSibling) || void 0 === t ? void 0 : t.type);) {
						let e = n.previousSibling;
						if (e.endPosition.row < n.startPosition.row - 1) break;
						n = e
					}
					return "comment" === (null == n ? void 0 : n.type) ? n : null
				}, t.getFunctionPositions = async function(e, t) {
					return v(e, (await b(e, t)).rootNode).map((e => {
						const t = e.captures.find((e => "function" === e.name)).node;
						return {
							startIndex: t.startIndex,
							endIndex: t.endIndex
						}
					}))
				}
			},
			610: (e, t, n) => {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.getNodeStart = t.isBlockBodyFinished = t.isEmptyBlockStart = t.getBlockParser = void 0;
				const r = n(306);
				class s {
					constructor(e, t, n) {
						this.languageId = e, this.nodeMatch = t, this.nodeTypesWithBlockOrStmtChild = n
					}
					async getNodeMatchAtPosition(e, t, n) {
						const s = await r.parseTree(this.languageId, e);
						try {
							let e = s.rootNode.descendantForIndex(t);
							for (; e;) {
								const t = this.nodeMatch[e.type];
								if (t) {
									if (!this.nodeTypesWithBlockOrStmtChild.has(e.type)) break;
									const n = this.nodeTypesWithBlockOrStmtChild.get(e.type),
										r = "" == n ? e.namedChildren[0] : e.childForFieldName(n);
									if ((null == r ? void 0 : r.type) == t) break
								}
								e = e.parent
							}
							if (!e) return;
							return n(e)
						} finally {
							s.delete()
						}
					}
					getNextBlockAtPosition(e, t, n) {
						return this.getNodeMatchAtPosition(e, t, (e => {
							let t = e.children.reverse().find((t => t.type == this.nodeMatch[e.type]));
							if (t) {
								if ("python" == this.languageId && t.parent) {
									const e = ":" == t.parent.type ? t.parent.parent : t.parent;
									let n = null == e ? void 0 : e.nextSibling;
									for (; n && "comment" == n.type;) {
										const r = n.startPosition.row == t.endPosition.row && n.startPosition.column >= t.endPosition.column,
											s = n.startPosition.row > e.endPosition.row && n.startPosition.column > e.startPosition.column;
										if (!r && !s) break;
										t = n, n = n.nextSibling
									}
								}
								if (!(t.endIndex >= t.tree.rootNode.endIndex - 1 && (t.hasError() || t.parent.hasError()))) return n(t)
							}
						}))
					}
					async isBlockBodyFinished(e, t, n) {
						const r = (e + t).trimEnd(),
							s = await this.getNextBlockAtPosition(r, n, (e => e.endIndex));
						if (void 0 !== s && s < r.length) {
							const t = s - e.length;
							return t > 0 ? t : void 0
						}
					}
					getNodeStart(e, t) {
						const n = e.trimEnd();
						return this.getNodeMatchAtPosition(n, t, (e => e.startIndex))
					}
				}
				class i extends s {
					constructor(e, t, n, r, s) {
						super(e, r, s), this.blockEmptyMatch = t, this.lineMatch = n
					}
					isBlockStart(e) {
						return this.lineMatch.test(e.trimStart())
					}
					async isBlockBodyEmpty(e, t) {
						const n = await this.getNextBlockAtPosition(e, t, (n => {
							n.startIndex < t && (t = n.startIndex);
							let r = e.substring(t, n.endIndex).trim();
							return "" == r || r.replace(/\s/g, "") == this.blockEmptyMatch
						}));
						return void 0 === n || n
					}
					async isEmptyBlockStart(e, t) {
						return t = o(e, t), this.isBlockStart(function(e, t) {
							const n = e.lastIndexOf("\n", t - 1);
							let r = e.indexOf("\n", t);
							return r < 0 && (r = e.length), e.slice(n + 1, r)
						}(e, t)) && this.isBlockBodyEmpty(e, t)
					}
				}

				function o(e, t) {
					let n = t;
					for (; n > 0 && /\s/.test(e.charAt(n - 1));) n--;
					return n
				}

				function a(e, t) {
					const n = e.startIndex,
						r = e.startIndex - e.startPosition.column,
						s = t.substring(r, n);
					if (/^\s*$/.test(s)) return s
				}

				function l(e, t, n) {
					if (t.startPosition.row <= e.startPosition.row) return !1;
					const r = a(e, n),
						s = a(t, n);
					return void 0 !== r && void 0 !== s && r.startsWith(s)
				}
				class c extends s {
					constructor(e, t, n, r, s, i, o) {
						super(e, t, n), this.startKeywords = r, this.blockNodeType = s, this.emptyStatementType = i, this.curlyBraceLanguage = o
					}
					isBlockEmpty(e, t) {
						var n, s;
						let i = e.text.trim();
						return this.curlyBraceLanguage && (i.startsWith("{") && (i = i.slice(1)), i.endsWith("}") && (i = i.slice(0, -1)), i = i.trim()), 0 == i.length || !("python" != this.languageId || "class_definition" != (null === (n = e.parent) || void 0 === n ? void 0 : n.type) && "function_definition" != (null === (s = e.parent) || void 0 === s ? void 0 : s.type) || 1 != e.children.length || !r.queryPythonIsDocstring(e.parent))
					}
					async isEmptyBlockStart(e, t) {
						var n, s, i;
						if (t > e.length) throw new RangeError("Invalid offset");
						for (let n = t; n < e.length && "\n" != e.charAt(n); n++)
							if (/\S/.test(e.charAt(n))) return !1;
						t = o(e, t);
						const a = await r.parseTree(this.languageId, e);
						try {
							const r = a.rootNode.descendantForIndex(t - 1);
							if (null == r) return !1;
							if (this.curlyBraceLanguage && "}" == r.type) return !1;
							if (("javascript" == this.languageId || "typescript" == this.languageId) && r.parent && "object" == r.parent.type && "{" == r.parent.text.trim()) return !0;
							if ("typescript" == this.languageId) {
								let n = r;
								for (; n.parent;) {
									if ("function_signature" == n.type || "method_signature" == n.type) {
										const s = r.nextSibling;
										return !!(s && n.hasError() && l(n, s, e)) || !n.children.find((e => ";" == e.type)) && n.endIndex <= t
									}
									n = n.parent
								}
							}
							let o = null,
								c = null,
								u = null,
								_ = r;
							for (; null != _;) {
								if (_.type == this.blockNodeType) {
									c = _;
									break
								}
								if (this.nodeMatch[_.type]) {
									u = _;
									break
								}
								if ("ERROR" == _.type) {
									o = _;
									break
								}
								_ = _.parent
							}
							if (null != c) {
								if (!c.parent || !this.nodeMatch[c.parent.type]) return !1;
								if ("python" == this.languageId) {
									const e = c.previousSibling;
									if (null != e && e.hasError() && (e.text.startsWith('"""') || e.text.startsWith("'''"))) return !0
								}
								return this.isBlockEmpty(c, t)
							}
							if (null != o) {
								if ("module" == (null === (n = o.previousSibling) || void 0 === n ? void 0 : n.type) || "internal_module" == (null === (s = o.previousSibling) || void 0 === s ? void 0 : s.type)) return !0;
								const e = [...o.children].reverse(),
									a = e.find((e => this.startKeywords.includes(e.type)));
								let l = e.find((e => e.type == this.blockNodeType));
								if (a) {
									switch (this.languageId) {
										case "python": {
											"try" == a.type && "identifier" == r.type && r.text.length > 4 && (l = null === (i = e.find((e => e.hasError()))) || void 0 === i ? void 0 : i.children.find((e => "block" == e.type)));
											const t = e.find((e => ":" == e.type));
											if (t && a.endIndex <= t.startIndex && t.nextSibling) {
												if ("def" == a.type) {
													const e = t.nextSibling;
													if ('"' == e.type || "'" == e.type) return !0;
													if ("ERROR" == e.type && ('"""' == e.text || "'''" == e.text)) return !0
												}
												return !1
											}
											break
										}
										case "javascript": {
											const t = e.find((e => "formal_parameters" == e.type));
											if ("class" == a.type && t) return !0;
											const n = e.find((e => "{" == e.type));
											if (n && n.startIndex > a.endIndex && null != n.nextSibling) return !1;
											if (e.find((e => "do" == e.type)) && "while" == a.type) return !1;
											if ("=>" == a.type && a.nextSibling && "{" != a.nextSibling.type) return !1;
											break
										}
										case "typescript": {
											const t = e.find((e => "{" == e.type));
											if (t && t.startIndex > a.endIndex && null != t.nextSibling) return !1;
											if (e.find((e => "do" == e.type)) && "while" == a.type) return !1;
											if ("=>" == a.type && a.nextSibling && "{" != a.nextSibling.type) return !1;
											break
										}
									}
									return !(l && l.startIndex > a.endIndex) || this.isBlockEmpty(l, t)
								}
							}
							if (null != u) {
								const e = this.nodeMatch[u.type],
									n = u.children.slice().reverse().find((t => t.type == e));
								if (n) return this.isBlockEmpty(n, t);
								if (this.nodeTypesWithBlockOrStmtChild.has(u.type)) {
									const e = this.nodeTypesWithBlockOrStmtChild.get(u.type),
										t = "" == e ? u.children[0] : u.childForFieldName(e);
									if (t && t.type != this.blockNodeType && t.type != this.emptyStatementType) return !1
								}
								return !0
							}
							return !1
						} finally {
							a.delete()
						}
					}
				}
				const u = {
					python: new c("python", {
						class_definition: "block",
						elif_clause: "block",
						else_clause: "block",
						except_clause: "block",
						finally_clause: "block",
						for_statement: "block",
						function_definition: "block",
						if_statement: "block",
						try_statement: "block",
						while_statement: "block",
						with_statement: "block"
					}, new Map, ["def", "class", "if", "elif", "else", "for", "while", "try", "except", "finally", "with"], "block", null, !1),
					javascript: new c("javascript", {
						arrow_function: "statement_block",
						catch_clause: "statement_block",
						do_statement: "statement_block",
						else_clause: "statement_block",
						finally_clause: "statement_block",
						for_in_statement: "statement_block",
						for_statement: "statement_block",
						function: "statement_block",
						function_declaration: "statement_block",
						generator_function: "statement_block",
						generator_function_declaration: "statement_block",
						if_statement: "statement_block",
						method_definition: "statement_block",
						try_statement: "statement_block",
						while_statement: "statement_block",
						with_statement: "statement_block",
						class: "class_body",
						class_declaration: "class_body"
					}, new Map([
						["arrow_function", "body"],
						["do_statement", "body"],
						["else_clause", ""],
						["for_in_statement", "body"],
						["for_statement", "body"],
						["if_statement", "consequence"],
						["while_statement", "body"],
						["with_statement", "body"]
					]), ["=>", "try", "catch", "finally", "do", "for", "if", "else", "while", "with", "function", "function*", "class"], "statement_block", "empty_statement", !0),
					typescript: new c("typescript", {
						ambient_declaration: "statement_block",
						arrow_function: "statement_block",
						catch_clause: "statement_block",
						do_statement: "statement_block",
						else_clause: "statement_block",
						finally_clause: "statement_block",
						for_in_statement: "statement_block",
						for_statement: "statement_block",
						function: "statement_block",
						function_declaration: "statement_block",
						generator_function: "statement_block",
						generator_function_declaration: "statement_block",
						if_statement: "statement_block",
						internal_module: "statement_block",
						method_definition: "statement_block",
						module: "statement_block",
						try_statement: "statement_block",
						while_statement: "statement_block",
						abstract_class_declaration: "class_body",
						class: "class_body",
						class_declaration: "class_body"
					}, new Map([
						["arrow_function", "body"],
						["do_statement", "body"],
						["else_clause", ""],
						["for_in_statement", "body"],
						["for_statement", "body"],
						["if_statement", "consequence"],
						["while_statement", "body"],
						["with_statement", "body"]
					]), ["declare", "=>", "try", "catch", "finally", "do", "for", "if", "else", "while", "with", "function", "function*", "class"], "statement_block", "empty_statement", !0),
					go: new i("go", "{}", /\b(func|if|else|for)\b/, {
						communication_case: "block",
						default_case: "block",
						expression_case: "block",
						for_statement: "block",
						func_literal: "block",
						function_declaration: "block",
						if_statement: "block",
						labeled_statement: "block",
						method_declaration: "block",
						type_case: "block"
					}, new Map),
					ruby: new i("ruby", "end", /\b(BEGIN|END|case|class|def|do|else|elsif|for|if|module|unless|until|while)\b|->/, {
						begin_block: "}",
						block: "}",
						end_block: "}",
						lambda: "block",
						for: "do",
						until: "do",
						while: "do",
						case: "end",
						do: "end",
						if: "end",
						method: "end",
						module: "end",
						unless: "end",
						do_block: "end"
					}, new Map)
				};

				function _(e) {
					return u[r.languageIdToWasmLanguage(e)]
				}
				t.getBlockParser = _, t.isEmptyBlockStart = async function(e, t, n) {
					return !!r.isSupportedLanguageId(e) && _(e).isEmptyBlockStart(t, n)
				}, t.isBlockBodyFinished = async function(e, t, n, s) {
					if (r.isSupportedLanguageId(e)) return _(e).isBlockBodyFinished(t, n, s)
				}, t.getNodeStart = async function(e, t, n) {
					if (r.isSupportedLanguageId(e)) return _(e).getNodeStart(t, n)
				}
			},
			312: (e, t, n) => {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.getPrompt = t.newLineEnded = t.normalizeLanguageId = t.PromptOptions = t.SuffixStartMode = t.SuffixMatchOption = t.SuffixOption = t.LineEndingOptions = t.LocalImportContextOption = t.SnippetSelectionOption = t.NeighboringTabsPositionOption = t.NeighboringTabsOption = t.SiblingOption = t.PathMarkerOption = t.LanguageMarkerOption = t.TOKENS_RESERVED_FOR_SUFFIX_ENCODING = t.MAX_EDIT_DISTANCE_LENGTH = t.MAX_PROMPT_LENGTH = void 0;
				const r = n(417),
					s = n(179),
					i = n(125),
					o = n(670),
					a = n(94),
					l = n(456),
					c = n(395);
				let u = {
					text: "",
					tokens: []
				};
				var _, d, f, p, h, m, g, y, b, w, v;
				t.MAX_PROMPT_LENGTH = 1500, t.MAX_EDIT_DISTANCE_LENGTH = 50, t.TOKENS_RESERVED_FOR_SUFFIX_ENCODING = 5,
					function(e) {
						e.NoMarker = "nomarker", e.Top = "top", e.Always = "always"
					}(_ = t.LanguageMarkerOption || (t.LanguageMarkerOption = {})),
					function(e) {
						e.NoMarker = "nomarker", e.Top = "top", e.Always = "always"
					}(d = t.PathMarkerOption || (t.PathMarkerOption = {})),
					function(e) {
						e.NoSiblings = "nosiblings", e.SiblingsOverContext = "siblingabove", e.ContextOverSiblings = "contextabove"
					}(f = t.SiblingOption || (t.SiblingOption = {})),
					function(e) {
						e.None = "none", e.Conservative = "conservative", e.Medium = "medium", e.Eager = "eager", e.EagerButLittle = "eagerButLittle"
					}(p = t.NeighboringTabsOption || (t.NeighboringTabsOption = {})),
					function(e) {
						e.TopOfText = "top", e.DirectlyAboveCursor = "aboveCursor", e.AfterSiblings = "afterSiblings"
					}(h = t.NeighboringTabsPositionOption || (t.NeighboringTabsPositionOption = {})),
					function(e) {
						e.BestMatch = "bestMatch", e.TopK = "topK"
					}(m = t.SnippetSelectionOption || (t.SnippetSelectionOption = {})),
					function(e) {
						e.NoContext = "nocontext", e.Declarations = "declarations"
					}(g = t.LocalImportContextOption || (t.LocalImportContextOption = {})),
					function(e) {
						e.ConvertToUnix = "unix", e.KeepOriginal = "keep"
					}(y = t.LineEndingOptions || (t.LineEndingOptions = {})), (v = t.SuffixOption || (t.SuffixOption = {})).None = "none", v.FifteenPercent = "fifteenPercent",
					function(e) {
						e.Equal = "equal", e.Levenshtein = "levenshteineditdistance"
					}(b = t.SuffixMatchOption || (t.SuffixMatchOption = {})),
					function(e) {
						e.Cursor = "cursor", e.CursorTrimStart = "cursortrimstart", e.SiblingBlock = "siblingblock", e.SiblingBlockTrimStart = "siblingblocktrimstart"
					}(w = t.SuffixStartMode || (t.SuffixStartMode = {}));
				class x {
					constructor(e, n) {
						if (this.fs = e, this.maxPromptLength = t.MAX_PROMPT_LENGTH, this.languageMarker = _.Top, this.pathMarker = d.Top, this.includeSiblingFunctions = f.ContextOverSiblings, this.localImportContext = g.Declarations, this.neighboringTabs = p.Eager, this.neighboringTabsPosition = h.TopOfText, this.lineEnding = y.ConvertToUnix, this.suffixPercent = 0, this.suffixStartMode = w.Cursor, this.suffixMatchThreshold = 0, this.suffixMatchCriteria = b.Levenshtein, this.fimSuffixLengthThreshold = 0, n)
							for (const e in n) this[e] = n[e];
						if (this.suffixPercent < 0 || this.suffixPercent > 100) throw new Error(`suffixPercent must be between 0 and 100, but was ${this.suffixPercent}`);
						if (this.suffixPercent > 0 && this.includeSiblingFunctions != f.NoSiblings) throw new Error(`Invalid option combination. Cannot set suffixPercent > 0 (${this.suffixPercent}) and includeSiblingFunctions ${this.includeSiblingFunctions}`);
						if (this.suffixMatchThreshold < 0 || this.suffixMatchThreshold > 100) throw new Error(`suffixMatchThreshold must be at between 0 and 100, but was ${this.suffixMatchThreshold}`);
						if (this.fimSuffixLengthThreshold < -1) throw new Error(`fimSuffixLengthThreshold must be at least -1, but was ${this.fimSuffixLengthThreshold}`);
						if (null != this.indentationMinLength && null != this.indentationMaxLength && this.indentationMinLength > this.indentationMaxLength) throw new Error(`indentationMinLength must be less than or equal to indentationMaxLength, but was ${this.indentationMinLength} and ${this.indentationMaxLength}`);
						if (this.snippetSelection === m.TopK && void 0 === this.snippetSelectionK) throw new Error("snippetSelectionK must be defined.");
						if (this.snippetSelection === m.TopK && this.snippetSelectionK && this.snippetSelectionK <= 0) throw new Error(`snippetSelectionK must be greater than 0, but was ${this.snippetSelectionK}`)
					}
				}
				t.PromptOptions = x;
				const E = {
					javascriptreact: "javascript",
					jsx: "javascript",
					typescriptreact: "typescript",
					jade: "pug",
					cshtml: "razor"
				};

				function k(e) {
					var t;
					return e = e.toLowerCase(), null !== (t = E[e]) && void 0 !== t ? t : e
				}

				function S(e) {
					return "" == e || e.endsWith("\n") ? e : e + "\n"
				}
				t.normalizeLanguageId = k, t.newLineEnded = S, t.getPrompt = async function(e, n, m = {}, y = []) {
					var v;
					const E = new x(e, m);
					let I = !1;
					const {
						source: P,
						offset: N
					} = n;
					if (N < 0 || N > P.length) throw new Error(`Offset ${N} is out of range.`);
					n.languageId = k(n.languageId);
					const M = new l.Priorities,
						L = M.justBelow(l.Priorities.TOP),
						T = E.languageMarker == _.Always ? M.justBelow(l.Priorities.TOP) : M.justBelow(L),
						A = E.pathMarker == d.Always ? M.justBelow(l.Priorities.TOP) : M.justBelow(L),
						C = E.includeSiblingFunctions == f.ContextOverSiblings ? M.justBelow(L) : M.justAbove(L),
						O = M.justBelow(L, C),
						F = M.justBelow(O),
						j = new l.PromptWishlist(E.lineEnding);
					let B, R;
					if (E.languageMarker != _.NoMarker) {
						const e = S(r.getLanguageMarker(n));
						B = j.append(e, l.PromptElementKind.LanguageMarker, T)
					}
					if (E.pathMarker != d.NoMarker) {
						const e = S(r.getPathMarker(n));
						e.length > 0 && (R = j.append(e, l.PromptElementKind.PathMarker, A))
					}
					if (E.localImportContext != g.NoContext)
						for (const e of await s.extractLocalImportContext(n, E.fs)) j.append(S(e), l.PromptElementKind.ImportedFile, O);
					const W = E.neighboringTabs == p.None || 0 == y.length ? [] : await i.getNeighborSnippets(n, y, E.neighboringTabs, E.indentationMinLength, E.indentationMaxLength, E.snippetSelectionOption, E.snippetSelectionK);

					function q() {
						W.forEach((e => j.append(e.snippet, l.PromptElementKind.SimilarFile, F, a.tokenLength(e.snippet), e.score)))
					}
					E.neighboringTabsPosition == h.TopOfText && q();
					const D = [];
					let z;
					if (E.includeSiblingFunctions == f.NoSiblings) z = P.substring(0, N);
					else {
						const {
							siblings: e,
							beforeInsertion: t,
							afterInsertion: r
						} = await o.getSiblingFunctions(n);
						j.appendLineForLine(t, l.PromptElementKind.BeforeCursor, L).forEach((e => D.push(e)));
						let s = C;
						e.forEach((e => {
							j.append(e, l.PromptElementKind.AfterCursor, s), s = M.justBelow(s)
						})), E.neighboringTabsPosition == h.AfterSiblings && q(), z = r
					}
					if (E.neighboringTabsPosition == h.DirectlyAboveCursor) {
						const e = z.lastIndexOf("\n") + 1,
							t = z.substring(0, e),
							n = z.substring(e);
						j.appendLineForLine(t, l.PromptElementKind.BeforeCursor, L).forEach((e => D.push(e))), q(), n.length > 0 && (D.push(j.append(n, l.PromptElementKind.AfterCursor, L)), D.length > 1 && j.require(D[D.length - 2], D[D.length - 1]))
					} else j.appendLineForLine(z, l.PromptElementKind.BeforeCursor, L).forEach((e => D.push(e)));
					_.Top == E.languageMarker && D.length > 0 && void 0 !== B && j.require(B, D[0]), d.Top == E.pathMarker && D.length > 0 && void 0 !== R && (B ? j.require(R, B) : j.require(R, D[0])), void 0 !== B && void 0 !== R && j.exclude(R, B);
					let U = P.slice(N);
					if (0 == E.suffixPercent || U.length <= E.fimSuffixLengthThreshold) return j.fulfill(E.maxPromptLength); {
						let e = n.offset;
						E.suffixStartMode !== w.Cursor && E.suffixStartMode !== w.CursorTrimStart && (e = await o.getSiblingFunctionStart(n));
						const r = E.maxPromptLength - t.TOKENS_RESERVED_FOR_SUFFIX_ENCODING;
						let s = Math.floor(r * (100 - E.suffixPercent) / 100),
							i = j.fulfill(s);
						const l = r - i.prefixLength;
						let _ = P.slice(e);
						E.suffixStartMode != w.SiblingBlockTrimStart && E.suffixStartMode != w.CursorTrimStart || (_ = _.trimStart());
						const d = a.takeFirstTokens(_, l);
						return d.tokens.length <= l - 3 && (s = r - d.tokens.length, i = j.fulfill(s)), E.suffixMatchCriteria == b.Equal ? d.tokens.length === u.tokens.length && d.tokens.every(((e, t) => e === u.tokens[t])) && (I = !0) : E.suffixMatchCriteria == b.Levenshtein && d.tokens.length > 0 && E.suffixMatchThreshold > 0 && 100 * (null === (v = c.findEditDistanceScore(d.tokens.slice(0, t.MAX_EDIT_DISTANCE_LENGTH), u.tokens.slice(0, t.MAX_EDIT_DISTANCE_LENGTH))) || void 0 === v ? void 0 : v.score) < E.suffixMatchThreshold * Math.min(t.MAX_EDIT_DISTANCE_LENGTH, d.tokens.length) && (I = !0), !0 === I && u.tokens.length <= l ? (u.tokens.length <= l - 3 && (s = r - u.tokens.length, i = j.fulfill(s)), i.suffix = u.text, i.suffixLength = u.tokens.length) : (i.suffix = d.text, i.suffixLength = d.tokens.length, u = d), i
					}
				}
			},
			670: (e, t, n) => {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.getSiblingFunctionStart = t.getSiblingFunctions = void 0;
				const r = n(312),
					s = n(306);
				t.getSiblingFunctions = async function({
					source: e,
					offset: t,
					languageId: n
				}) {
					var i, o;
					const a = [];
					let l = "",
						c = e.substring(0, t);
					if (s.isSupportedLanguageId(n)) {
						const u = await s.parseTree(n, e);
						try {
							let _ = t;
							for (; _ >= 0 && /\s/.test(e[_]);) _--;
							const d = u.rootNode.descendantForIndex(_),
								f = s.getAncestorWithSiblingFunctions(n, d);
							if (f) {
								const u = s.getFirstPrecedingComment(f),
									_ = null !== (i = null == u ? void 0 : u.startIndex) && void 0 !== i ? i : f.startIndex;
								let d, p = 0;
								for (;
									" " == (d = e[_ - p - 1]) || "\t" == d;) p++;
								const h = e.substring(_ - p, _);
								for (let i = f.nextSibling; i; i = i.nextSibling)
									if (s.isFunctionDefinition(n, i)) {
										const n = s.getFirstPrecedingComment(i),
											l = null !== (o = null == n ? void 0 : n.startIndex) && void 0 !== o ? o : i.startIndex;
										if (l < t) continue;
										const c = e.substring(l, i.endIndex),
											u = r.newLineEnded(c) + "\n" + h;
										a.push(u)
									} l = e.substring(0, _), c = e.substring(_, t)
							}
						} finally {
							u.delete()
						}
					}
					return {
						siblings: a,
						beforeInsertion: l,
						afterInsertion: c
					}
				}, t.getSiblingFunctionStart = async function({
					source: e,
					offset: t,
					languageId: n
				}) {
					var r;
					if (s.isSupportedLanguageId(n)) {
						const i = await s.parseTree(n, e);
						try {
							let o = t;
							for (; o >= 0 && /\s/.test(e[o]);) o--;
							const a = i.rootNode.descendantForIndex(o),
								l = s.getAncestorWithSiblingFunctions(n, a);
							if (l) {
								for (let e = l.nextSibling; e; e = e.nextSibling)
									if (s.isFunctionDefinition(n, e)) {
										const n = s.getFirstPrecedingComment(e),
											i = null !== (r = null == n ? void 0 : n.startIndex) && void 0 !== r ? r : e.startIndex;
										if (i < t) continue;
										return i
									} if (l.endIndex >= t) return l.endIndex
							}
						} finally {
							i.delete()
						}
					}
					return t
				}
			},
			404: (e, t, n) => {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.computeScore = t.IndentationBasedJaccardMatcher = t.FixedWindowSizeJaccardMatcher = void 0;
				const r = n(250),
					s = n(467);
				class i extends s.WindowedMatcher {
					constructor(e, t) {
						super(e), this.windowLength = t
					}
					id() {
						return "fixed:" + this.windowLength
					}
					getWindowsDelineations(e) {
						const t = [],
							n = e.length;
						for (let e = 0; 0 == e || e < n - this.windowLength; e++) {
							const r = Math.min(e + this.windowLength, n);
							t.push([e, r])
						}
						return t
					}
					trimDocument(e) {
						return e.source.slice(0, e.offset).split("\n").slice(-this.windowLength).join("\n")
					}
					similarityScore(e, t) {
						return a(e, t)
					}
				}
				t.FixedWindowSizeJaccardMatcher = i, i.FACTORY = e => ({
					to: t => new i(t, e)
				});
				class o extends s.WindowedMatcher {
					constructor(e, t, n) {
						super(e), this.indentationMinLength = t, this.indentationMaxLength = n, this.languageId = e.languageId
					}
					id() {
						return `indent:${this.indentationMinLength}:${this.indentationMaxLength}:${this.languageId}`
					}
					getWindowsDelineations(e) {
						return r.getWindowsDelineations(e, this.languageId, this.indentationMinLength, this.indentationMaxLength)
					}
					trimDocument(e) {
						return e.source.slice(0, e.offset).split("\n").slice(-this.indentationMaxLength).join("\n")
					}
					similarityScore(e, t) {
						return a(e, t)
					}
				}

				function a(e, t) {
					const n = new Set;
					return e.forEach((e => {
						t.has(e) && n.add(e)
					})), n.size / (e.size + t.size - n.size)
				}
				t.IndentationBasedJaccardMatcher = o, o.FACTORY = (e, t) => ({
					to: n => new o(n, e, t)
				}), t.computeScore = a
			},
			125: (e, t, n) => {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.getNeighborSnippets = t.neighborOptionToSelection = void 0;
				const r = n(417),
					s = n(404);

				function i(e) {
					return [e.relativePath ? "Compare this snippet from " + e.relativePath + ":" : "Compare this snippet:"].concat(e.snippet.split("\n"))
				}
				t.neighborOptionToSelection = {
					none: {
						matcherFactory: s.FixedWindowSizeJaccardMatcher.FACTORY(1),
						threshold: -1,
						numberOfSnippets: 0
					},
					conservative: {
						matcherFactory: s.FixedWindowSizeJaccardMatcher.FACTORY(10),
						threshold: .3,
						numberOfSnippets: 1
					},
					medium: {
						matcherFactory: s.FixedWindowSizeJaccardMatcher.FACTORY(20),
						threshold: .1,
						numberOfSnippets: 2
					},
					eager: {
						matcherFactory: s.FixedWindowSizeJaccardMatcher.FACTORY(60),
						threshold: 0,
						numberOfSnippets: 4
					},
					eagerButLittle: {
						matcherFactory: s.FixedWindowSizeJaccardMatcher.FACTORY(10),
						threshold: 0,
						numberOfSnippets: 1
					}
				}, t.getNeighborSnippets = async function(e, n, o, a, l, c, u) {
					const _ = t.neighborOptionToSelection[o],
						d = function(e, n, r, i) {
							const o = {
								...t.neighborOptionToSelection[n]
							};
							return void 0 !== r && void 0 !== i && (o.matcherFactory = s.IndentationBasedJaccardMatcher.FACTORY(r, i)), o.matcherFactory.to(e)
						}(e, o, a, l);
					return n.filter((e => e.source.length < 1e4 && e.source.length > 0)).slice(0, 20).reduce(((e, t) => e.concat(d.findMatches(t, c, u).map((e => ({
						relativePath: t.relativePath,
						...e
					}))))), []).filter((e => e.score && e.snippet && e.score > _.threshold)).sort(((e, t) => e.score - t.score)).slice(-_.numberOfSnippets).map((t => ({
						score: t.score,
						snippet: i(t).map((t => r.comment(t, e.languageId) + "\n")).join(""),
						startLine: t.startLine,
						endLine: t.endLine
					})))
				}
			},
			467: (e, t, n) => {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.splitIntoWords = t.WindowedMatcher = t.SortOptions = void 0;
				const r = n(312);
				var s;
				! function(e) {
					e.Ascending = "ascending", e.Descending = "descending", e.None = "none"
				}(s = t.SortOptions || (t.SortOptions = {}));
				class i {
					constructor(e) {
						var t;
						this.stopsForLanguage = null !== (t = u.get(e.languageId)) && void 0 !== t ? t : c
					}
					tokenize(e) {
						return new Set(a(e).filter((e => !this.stopsForLanguage.has(e))))
					}
				}
				const o = new class {
					constructor(e) {
						this.keys = [], this.cache = {}, this.size = e
					}
					put(e, t) {
						var n;
						if (this.cache[e] = t, this.keys.length > this.size) {
							this.keys.push(e);
							const t = null !== (n = this.keys.shift()) && void 0 !== n ? n : "";
							delete this.cache[t]
						}
					}
					get(e) {
						return this.cache[e]
					}
				}(20);

				function a(e) {
					return e.split(/[^a-zA-Z0-9]/).filter((e => e.length > 0))
				}
				t.WindowedMatcher = class {
					constructor(e) {
						this.tokenizer = new i(e), this.referenceTokens = this.tokenizer.tokenize(this.trimDocument(e))
					}
					sortScoredSnippets(e, t = s.Descending) {
						return t == s.Ascending ? e.sort(((e, t) => e.score > t.score ? 1 : -1)) : t == s.Descending ? e.sort(((e, t) => e.score > t.score ? -1 : 1)) : e
					}
					retrieveAllSnippets(e, t = s.Descending) {
						var n;
						const r = [];
						if (0 === e.source.length || 0 === this.referenceTokens.size) return r;
						const i = e.source.split("\n"),
							a = this.id() + ":" + e.source,
							l = null !== (n = o.get(a)) && void 0 !== n ? n : [],
							c = 0 == l.length,
							u = c ? i.map(this.tokenizer.tokenize, this.tokenizer) : [];
						for (const [e, [t, n]] of this.getWindowsDelineations(i).entries()) {
							if (c) {
								const e = new Set;
								u.slice(t, n).forEach((t => t.forEach(e.add, e))), l.push(e)
							}
							const s = l[e],
								i = this.similarityScore(s, this.referenceTokens);
							r.push({
								score: i,
								startLine: t,
								endLine: n
							})
						}
						return c && o.put(a, l), this.sortScoredSnippets(r, t)
					}
					findMatches(e, t = r.SnippetSelectionOption.BestMatch, n) {
						if (t == r.SnippetSelectionOption.BestMatch) {
							const t = this.findBestMatch(e);
							return t ? [t] : []
						}
						return t == r.SnippetSelectionOption.TopK && this.findTopKMatches(e, n) || []
					}
					findBestMatch(e) {
						if (0 === e.source.length || 0 === this.referenceTokens.size) return;
						const t = e.source.split("\n"),
							n = this.retrieveAllSnippets(e, s.Descending);
						return 0 !== n.length && 0 !== n[0].score ? {
							snippet: t.slice(n[0].startLine, n[0].endLine).join("\n"),
							...n[0]
						} : void 0
					}
					findTopKMatches(e, t = 1) {
						if (0 === e.source.length || 0 === this.referenceTokens.size || t < 1) return;
						const n = e.source.split("\n"),
							r = this.retrieveAllSnippets(e, s.Descending);
						if (0 === r.length || 0 === r[0].score) return;
						const i = [r[0]];
						for (let e = 1; e < r.length && i.length < t; e++) - 1 == i.findIndex((t => r[e].startLine < t.endLine && r[e].endLine > t.startLine)) && i.push(r[e]);
						return i.map((e => ({
							snippet: n.slice(e.startLine, e.endLine).join("\n"),
							...e
						})))
					}
				}, t.splitIntoWords = a;
				const l = new Set(["we", "our", "you", "it", "its", "they", "them", "their", "this", "that", "these", "those", "is", "are", "was", "were", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "can", "don", "t", "s", "will", "would", "should", "what", "which", "who", "when", "where", "why", "how", "a", "an", "the", "and", "or", "not", "no", "but", "because", "as", "until", "again", "further", "then", "once", "here", "there", "all", "any", "both", "each", "few", "more", "most", "other", "some", "such", "above", "below", "to", "during", "before", "after", "of", "at", "by", "about", "between", "into", "through", "from", "up", "down", "in", "out", "on", "off", "over", "under", "only", "own", "same", "so", "than", "too", "very", "just", "now"]),
					c = new Set(["if", "then", "else", "for", "while", "with", "def", "function", "return", "TODO", "import", "try", "catch", "raise", "finally", "repeat", "switch", "case", "match", "assert", "continue", "break", "const", "class", "enum", "struct", "static", "new", "super", "this", "var", ...l]),
					u = new Map([])
			},
			395: (e, t, n) => {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.findEditDistanceScore = void 0;
				const r = n(94);
				t.findEditDistanceScore = function(e, t) {
					if ("string" == typeof e && (e = r.tokenize(e)), "string" == typeof t && (t = r.tokenize(t)), 0 === e.length || 0 === t.length) return {
						score: e.length + t.length
					};
					const n = Array.from({
						length: e.length
					}).map((() => Array.from({
						length: t.length
					}).map((() => 0))));
					for (let t = 0; t < e.length; t++) n[t][0] = t;
					for (let e = 0; e < t.length; e++) n[0][e] = e;
					for (let r = 0; r < t.length; r++)
						for (let s = 0; s < e.length; s++) n[s][r] = Math.min((0 == s ? r : n[s - 1][r]) + 1, (0 == r ? s : n[s][r - 1]) + 1, (0 == s || 0 == r ? Math.max(s, r) : n[s - 1][r - 1]) + (e[s] == t[r] ? 0 : 1));
					return {
						score: n[e.length - 1][t.length - 1]
					}
				}
			},
			456: (e, t, n) => {
				"use strict";
				Object.defineProperty(t, "__esModule", {
					value: !0
				}), t.Priorities = t.PromptWishlist = t.PromptElementRanges = t.PromptChoices = t.PromptBackground = t.PromptElementKind = void 0;
				const r = n(312),
					s = n(94);
				var i;
				! function(e) {
					e.BeforeCursor = "BeforeCursor", e.AfterCursor = "AfterCursor", e.SimilarFile = "SimilarFile", e.ImportedFile = "ImportedFile", e.LanguageMarker = "LanguageMarker", e.PathMarker = "PathMarker"
				}(i = t.PromptElementKind || (t.PromptElementKind = {}));
				class o {
					constructor() {
						this.used = new Map, this.unused = new Map
					}
					markUsed(e) {
						this.IsNeighboringTab(e) && this.used.set(e.id, this.convert(e))
					}
					undoMarkUsed(e) {
						this.IsNeighboringTab(e) && this.used.delete(e.id)
					}
					markUnused(e) {
						this.IsNeighboringTab(e) && this.unused.set(e.id, this.convert(e))
					}
					convert(e) {
						return {
							score: e.score.toFixed(4),
							length: e.text.length
						}
					}
					IsNeighboringTab(e) {
						return e.kind == i.SimilarFile
					}
				}
				t.PromptBackground = o;
				class a {
					constructor() {
						this.used = new Map, this.unused = new Map
					}
					markUsed(e) {
						this.used.set(e.kind, (this.used.get(e.kind) || 0) + e.tokens)
					}
					undoMarkUsed(e) {
						this.used.set(e.kind, (this.used.get(e.kind) || 0) - e.tokens)
					}
					markUnused(e) {
						this.unused.set(e.kind, (this.used.get(e.kind) || 0) + e.tokens)
					}
				}
				t.PromptChoices = a;
				class l {
					constructor(e) {
						this.ranges = new Array;
						let t, n = 0;
						for (const {
								element: r
							} of e) 0 !== r.text.length && (t === i.BeforeCursor && r.kind === i.BeforeCursor ? this.ranges[this.ranges.length - 1].end += r.text.length : this.ranges.push({
							kind: r.kind,
							start: n,
							end: n + r.text.length
						}), t = r.kind, n += r.text.length)
					}
				}
				t.PromptElementRanges = l, t.PromptWishlist = class {
					constructor(e) {
						this.content = [], this.lineEndingOption = e
					}
					getContent() {
						return [...this.content]
					}
					convertLineEndings(e) {
						return this.lineEndingOption === r.LineEndingOptions.ConvertToUnix && (e = e.replace(/\r\n/g, "\n").replace(/\r/g, "\n")), e
					}
					append(e, t, n, r = s.tokenLength(e), i = NaN) {
						e = this.convertLineEndings(e);
						const o = this.content.length;
						return this.content.push({
							id: o,
							text: e,
							kind: t,
							priority: n,
							tokens: r,
							requires: [],
							excludes: [],
							score: i
						}), o
					}
					appendLineForLine(e, t, n) {
						const r = (e = this.convertLineEndings(e)).split("\n");
						for (let e = 0; e < r.length - 1; e++) r[e] += "\n";
						const s = [];
						r.forEach(((e, t) => {
							"\n" === e && s.length > 0 && !s[s.length - 1].endsWith("\n\n") ? s[s.length - 1] += "\n" : s.push(e)
						}));
						const i = [];
						return s.forEach(((e, r) => {
							"" !== e && (i.push(this.append(e, t, n)), r > 0 && (this.content[this.content.length - 2].requires = [this.content[this.content.length - 1]]))
						})), i
					}
					require(e, t) {
						const n = this.content.find((t => t.id === e)),
							r = this.content.find((e => e.id === t));
						n && r && n.requires.push(r)
					}
					exclude(e, t) {
						const n = this.content.find((t => t.id === e)),
							r = this.content.find((e => e.id === t));
						n && r && n.excludes.push(r)
					}
					fulfill(e) {
						const t = new a,
							n = new o,
							r = this.content.map(((e, t) => ({
								element: e,
								index: t
							})));
						r.sort(((e, t) => e.element.priority === t.element.priority ? t.index - e.index : t.element.priority - e.element.priority));
						const i = new Set,
							c = new Set;
						let u;
						const _ = [];
						let d = e;
						r.forEach((e => {
							var r;
							const s = e.element,
								o = e.index;
							if (d >= 0 && (d > 0 || void 0 === u) && s.requires.every((e => i.has(e.id))) && !c.has(s.id)) {
								let a = s.tokens;
								const l = null === (r = function(e, t) {
									let n, r = 1 / 0;
									for (const s of e) s.index > t && s.index < r && (n = s, r = s.index);
									return n
								}(_, o)) || void 0 === r ? void 0 : r.element;
								s.text.endsWith("\n\n") && l && !l.text.match(/^\s/) && a++, d >= a ? (d -= a, i.add(s.id), s.excludes.forEach((e => c.add(e.id))), t.markUsed(s), n.markUsed(s), _.push(e)) : u = null != u ? u : e
							} else t.markUnused(s), n.markUnused(s)
						})), _.sort(((e, t) => e.index - t.index));
						let f = _.reduce(((e, t) => e + t.element.text), ""),
							p = s.tokenLength(f);
						for (; p > e;) {
							_.sort(((e, t) => t.element.priority === e.element.priority ? t.index - e.index : t.element.priority - e.element.priority));
							const e = _.pop();
							e && (t.undoMarkUsed(e.element), t.markUnused(e.element), n.undoMarkUsed(e.element), n.markUnused(e.element), u = void 0), _.sort(((e, t) => e.index - t.index)), f = _.reduce(((e, t) => e + t.element.text), ""), p = s.tokenLength(f)
						}
						const h = [..._];
						if (void 0 !== u) {
							h.push(u), h.sort(((e, t) => e.index - t.index));
							const r = h.reduce(((e, t) => e + t.element.text), ""),
								i = s.tokenLength(r);
							if (i <= e) {
								t.markUsed(u.element), n.markUsed(u.element);
								const e = new l(h);
								return {
									prefix: r,
									suffix: "",
									prefixLength: i,
									suffixLength: 0,
									promptChoices: t,
									promptBackground: n,
									promptElementRanges: e
								}
							}
							t.markUnused(u.element), n.markUnused(u.element)
						}
						const m = new l(_);
						return {
							prefix: f,
							suffix: "",
							prefixLength: p,
							suffixLength: 0,
							promptChoices: t,
							promptBackground: n,
							promptElementRanges: m
						}
					}
				};
				class c {
					constructor() {
						this.registeredPriorities = [0, 1]
					}
					register(e) {
						if (e > c.TOP || e < c.BOTTOM) throw new Error("Priority must be between 0 and 1");
						return this.registeredPriorities.push(e), e
					}
					justAbove(...e) {
						const t = Math.max(...e),
							n = Math.min(...this.registeredPriorities.filter((e => e > t)));
						return this.register((n + t) / 2)
					}
					justBelow(...e) {
						const t = Math.min(...e),
							n = Math.max(...this.registeredPriorities.filter((e => e < t)));
						return this.register((n + t) / 2)
					}
					between(e, t) {
						if (this.registeredPriorities.some((n => n > e && n < t)) || !this.registeredPriorities.includes(e) || !this.registeredPriorities.includes(t)) throw new Error("Priorities must be adjacent in the list of priorities");
						return this.register((e + t) / 2)
					}
				}
				t.Priorities = c, c.TOP = 1, c.BOTTOM = 0
			},
			87: (e, t, n) => {
				var r, s, i = void 0 !== i ? i : {};
				void 0 === (s = "function" == typeof(r = function() {
					var t, r = {};
					for (t in i) i.hasOwnProperty(t) && (r[t] = i[t]);
					var s, o, a = [],
						l = "./this.program",
						c = function(e, t) {
							throw t
						},
						u = !1,
						_ = !1;
					u = "object" == typeof window, _ = "function" == typeof importScripts, s = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node, o = !u && !s && !_;
					var d, f, p, h, m, g = "";
					s ? (g = _ ? n(622).dirname(g) + "/" : __dirname + "/", d = function(e, t) {
						return h || (h = n(747)), m || (m = n(622)), e = m.normalize(e), h.readFileSync(e, t ? null : "utf8")
					}, p = function(e) {
						var t = d(e, !0);
						return t.buffer || (t = new Uint8Array(t)), T(t.buffer), t
					}, process.argv.length > 1 && (l = process.argv[1].replace(/\\/g, "/")), a = process.argv.slice(2), e.exports = i, c = function(e) {
						process.exit(e)
					}, i.inspect = function() {
						return "[Emscripten Module object]"
					}) : o ? ("undefined" != typeof read && (d = function(e) {
						return read(e)
					}), p = function(e) {
						var t;
						return "function" == typeof readbuffer ? new Uint8Array(readbuffer(e)) : (T("object" == typeof(t = read(e, "binary"))), t)
					}, "undefined" != typeof scriptArgs ? a = scriptArgs : void 0 !== arguments && (a = arguments), "function" == typeof quit && (c = function(e) {
						quit(e)
					}), "undefined" != typeof print && ("undefined" == typeof console && (console = {}), console.log = print, console.warn = console.error = "undefined" != typeof printErr ? printErr : print)) : (u || _) && (_ ? g = self.location.href : "undefined" != typeof document && document.currentScript && (g = document.currentScript.src), g = 0 !== g.indexOf("blob:") ? g.substr(0, g.lastIndexOf("/") + 1) : "", d = function(e) {
						var t = new XMLHttpRequest;
						return t.open("GET", e, !1), t.send(null), t.responseText
					}, _ && (p = function(e) {
						var t = new XMLHttpRequest;
						return t.open("GET", e, !1), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response)
					}), f = function(e, t, n) {
						var r = new XMLHttpRequest;
						r.open("GET", e, !0), r.responseType = "arraybuffer", r.onload = function() {
							200 == r.status || 0 == r.status && r.response ? t(r.response) : n()
						}, r.onerror = n, r.send(null)
					}), i.print || console.log.bind(console);
					var y = i.printErr || console.warn.bind(console);
					for (t in r) r.hasOwnProperty(t) && (i[t] = r[t]);
					r = null, i.arguments && (a = i.arguments), i.thisProgram && (l = i.thisProgram), i.quit && (c = i.quit);
					var b, w = 16,
						v = [];

					function x(e, t) {
						if (!b) {
							b = new WeakMap;
							for (var n = 0; n < H.length; n++) {
								var r = H.get(n);
								r && b.set(r, n)
							}
						}
						if (b.has(e)) return b.get(e);
						var s = function() {
							if (v.length) return v.pop();
							try {
								H.grow(1)
							} catch (e) {
								if (!(e instanceof RangeError)) throw e;
								throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH."
							}
							return H.length - 1
						}();
						try {
							H.set(s, e)
						} catch (n) {
							if (!(n instanceof TypeError)) throw n;
							var i = function(e, t) {
								if ("function" == typeof WebAssembly.Function) {
									for (var n = {
											i: "i32",
											j: "i64",
											f: "f32",
											d: "f64"
										}, r = {
											parameters: [],
											results: "v" == t[0] ? [] : [n[t[0]]]
										}, s = 1; s < t.length; ++s) r.parameters.push(n[t[s]]);
									return new WebAssembly.Function(r, e)
								}
								var i = [1, 0, 1, 96],
									o = t.slice(0, 1),
									a = t.slice(1),
									l = {
										i: 127,
										j: 126,
										f: 125,
										d: 124
									};
								for (i.push(a.length), s = 0; s < a.length; ++s) i.push(l[a[s]]);
								"v" == o ? i.push(0) : i = i.concat([1, l[o]]), i[1] = i.length - 2;
								var c = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0].concat(i, [2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0])),
									u = new WebAssembly.Module(c);
								return new WebAssembly.Instance(u, {
									e: {
										f: e
									}
								}).exports.f
							}(e, t);
							H.set(s, i)
						}
						return b.set(e, s), s
					}
					var E, k = function(e) {},
						S = i.dynamicLibraries || [];
					i.wasmBinary && (E = i.wasmBinary);
					var I, P = i.noExitRuntime || !0;

					function N(e, t, n, r) {
						switch ("*" === (n = n || "i8").charAt(n.length - 1) && (n = "i32"), n) {
							case "i1":
							case "i8":
								C[e >> 0] = t;
								break;
							case "i16":
								F[e >> 1] = t;
								break;
							case "i32":
								j[e >> 2] = t;
								break;
							case "i64":
								de = [t >>> 0, (_e = t, +Math.abs(_e) >= 1 ? _e > 0 ? (0 | Math.min(+Math.floor(_e / 4294967296), 4294967295)) >>> 0 : ~~+Math.ceil((_e - +(~~_e >>> 0)) / 4294967296) >>> 0 : 0)], j[e >> 2] = de[0], j[e + 4 >> 2] = de[1];
								break;
							case "float":
								B[e >> 2] = t;
								break;
							case "double":
								R[e >> 3] = t;
								break;
							default:
								oe("invalid type for setValue: " + n)
						}
					}

					function M(e, t, n) {
						switch ("*" === (t = t || "i8").charAt(t.length - 1) && (t = "i32"), t) {
							case "i1":
							case "i8":
								return C[e >> 0];
							case "i16":
								return F[e >> 1];
							case "i32":
							case "i64":
								return j[e >> 2];
							case "float":
								return B[e >> 2];
							case "double":
								return R[e >> 3];
							default:
								oe("invalid type for getValue: " + t)
						}
						return null
					}
					"object" != typeof WebAssembly && oe("no native wasm support detected");
					var L = !1;

					function T(e, t) {
						e || oe("Assertion failed: " + t)
					}
					var A, C, O, F, j, B, R, W = 1,
						q = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0;

					function D(e, t, n) {
						for (var r = t + n, s = t; e[s] && !(s >= r);) ++s;
						if (s - t > 16 && e.subarray && q) return q.decode(e.subarray(t, s));
						for (var i = ""; t < s;) {
							var o = e[t++];
							if (128 & o) {
								var a = 63 & e[t++];
								if (192 != (224 & o)) {
									var l = 63 & e[t++];
									if ((o = 224 == (240 & o) ? (15 & o) << 12 | a << 6 | l : (7 & o) << 18 | a << 12 | l << 6 | 63 & e[t++]) < 65536) i += String.fromCharCode(o);
									else {
										var c = o - 65536;
										i += String.fromCharCode(55296 | c >> 10, 56320 | 1023 & c)
									}
								} else i += String.fromCharCode((31 & o) << 6 | a)
							} else i += String.fromCharCode(o)
						}
						return i
					}

					function z(e, t) {
						return e ? D(O, e, t) : ""
					}

					function U(e, t, n, r) {
						if (!(r > 0)) return 0;
						for (var s = n, i = n + r - 1, o = 0; o < e.length; ++o) {
							var a = e.charCodeAt(o);
							if (a >= 55296 && a <= 57343 && (a = 65536 + ((1023 & a) << 10) | 1023 & e.charCodeAt(++o)), a <= 127) {
								if (n >= i) break;
								t[n++] = a
							} else if (a <= 2047) {
								if (n + 1 >= i) break;
								t[n++] = 192 | a >> 6, t[n++] = 128 | 63 & a
							} else if (a <= 65535) {
								if (n + 2 >= i) break;
								t[n++] = 224 | a >> 12, t[n++] = 128 | a >> 6 & 63, t[n++] = 128 | 63 & a
							} else {
								if (n + 3 >= i) break;
								t[n++] = 240 | a >> 18, t[n++] = 128 | a >> 12 & 63, t[n++] = 128 | a >> 6 & 63, t[n++] = 128 | 63 & a
							}
						}
						return t[n] = 0, n - s
					}

					function $(e, t, n) {
						return U(e, O, t, n)
					}

					function K(e) {
						for (var t = 0, n = 0; n < e.length; ++n) {
							var r = e.charCodeAt(n);
							r >= 55296 && r <= 57343 && (r = 65536 + ((1023 & r) << 10) | 1023 & e.charCodeAt(++n)), r <= 127 ? ++t : t += r <= 2047 ? 2 : r <= 65535 ? 3 : 4
						}
						return t
					}

					function Z(e) {
						var t = K(e) + 1,
							n = Ze(t);
						return U(e, C, n, t), n
					}

					function G(e) {
						A = e, i.HEAP8 = C = new Int8Array(e), i.HEAP16 = F = new Int16Array(e), i.HEAP32 = j = new Int32Array(e), i.HEAPU8 = O = new Uint8Array(e), i.HEAPU16 = new Uint16Array(e), i.HEAPU32 = new Uint32Array(e), i.HEAPF32 = B = new Float32Array(e), i.HEAPF64 = R = new Float64Array(e)
					}
					var V = i.INITIAL_MEMORY || 33554432;
					(I = i.wasmMemory ? i.wasmMemory : new WebAssembly.Memory({
						initial: V / 65536,
						maximum: 32768
					})) && (A = I.buffer), V = A.byteLength, G(A);
					var H = new WebAssembly.Table({
							initial: 13,
							element: "anyfunc"
						}),
						J = [],
						X = [],
						Y = [],
						Q = [],
						ee = !1,
						te = 0,
						ne = null,
						re = null;

					function se(e) {
						te++, i.monitorRunDependencies && i.monitorRunDependencies(te)
					}

					function ie(e) {
						if (te--, i.monitorRunDependencies && i.monitorRunDependencies(te), 0 == te && (null !== ne && (clearInterval(ne), ne = null), re)) {
							var t = re;
							re = null, t()
						}
					}

					function oe(e) {
						throw i.onAbort && i.onAbort(e), y(e += ""), L = !0, e = "abort(" + e + "). Build with -s ASSERTIONS=1 for more info.", new WebAssembly.RuntimeError(e)
					}
					i.preloadedImages = {}, i.preloadedAudios = {}, i.preloadedWasm = {};
					var ae = "data:application/octet-stream;base64,";

					function le(e) {
						return e.startsWith(ae)
					}

					function ce(e) {
						return e.startsWith("file://")
					}
					var ue, _e, de, fe = "tree-sitter.wasm";

					function pe(e) {
						try {
							if (e == fe && E) return new Uint8Array(E);
							if (p) return p(e);
							throw "both async and sync fetching of the wasm failed"
						} catch (e) {
							oe(e)
						}
					}
					le(fe) || (ue = fe, fe = i.locateFile ? i.locateFile(ue, g) : g + ue);
					var he = {},
						me = {
							get: function(e, t) {
								return he[t] || (he[t] = new WebAssembly.Global({
									value: "i32",
									mutable: !0
								})), he[t]
							}
						};

					function ge(e) {
						for (; e.length > 0;) {
							var t = e.shift();
							if ("function" != typeof t) {
								var n = t.func;
								"number" == typeof n ? void 0 === t.arg ? H.get(n)() : H.get(n)(t.arg) : n(void 0 === t.arg ? null : t.arg)
							} else t(i)
						}
					}

					function ye(e) {
						var t = 0;

						function n() {
							for (var n = 0, r = 1;;) {
								var s = e[t++];
								if (n += (127 & s) * r, r *= 128, !(128 & s)) break
							}
							return n
						}
						if (e instanceof WebAssembly.Module) {
							var r = WebAssembly.Module.customSections(e, "dylink");
							T(0 != r.length, "need dylink section"), e = new Int8Array(r[0])
						} else T(1836278016 == new Uint32Array(new Uint8Array(e.subarray(0, 24)).buffer)[0], "need to see wasm magic number"), T(0 === e[8], "need the dylink section to be first"), t = 9, n(), T(6 === e[t]), T(e[++t] === "d".charCodeAt(0)), T(e[++t] === "y".charCodeAt(0)), T(e[++t] === "l".charCodeAt(0)), T(e[++t] === "i".charCodeAt(0)), T(e[++t] === "n".charCodeAt(0)), T(e[++t] === "k".charCodeAt(0)), t++;
						var s = {};
						s.memorySize = n(), s.memoryAlign = n(), s.tableSize = n(), s.tableAlign = n();
						var i = n();
						s.neededDynlibs = [];
						for (var o = 0; o < i; ++o) {
							var a = n(),
								l = e.subarray(t, t + a);
							t += a;
							var c = D(l, 0);
							s.neededDynlibs.push(c)
						}
						return s
					}
					var be = 0;

					function we() {
						return P || be > 0
					}
					var ve = {
						nextHandle: 1,
						loadedLibs: {},
						loadedLibNames: {}
					};

					function xe(e, t, n) {
						return e.includes("j") ? function(e, t, n) {
							var r = i["dynCall_" + e];
							return n && n.length ? r.apply(null, [t].concat(n)) : r.call(null, t)
						}(e, t, n) : H.get(t).apply(null, n)
					}
					var Ee = 5250832;

					function ke(e) {
						return ["__cpp_exception", "__wasm_apply_data_relocs", "__dso_handle", "__set_stack_limits"].includes(e)
					}

					function Se(e, t) {
						var n = {};
						for (var r in e) {
							var s = e[r];
							"object" == typeof s && (s = s.value), "number" == typeof s && (s += t), n[r] = s
						}
						return function(e) {
							for (var t in e)
								if (!ke(t)) {
									var n = !1,
										r = e[t];
									t.startsWith("orig$") && (t = t.split("$")[1], n = !0), he[t] || (he[t] = new WebAssembly.Global({
										value: "i32",
										mutable: !0
									})), (n || 0 == he[t].value) && ("function" == typeof r ? he[t].value = x(r) : "number" == typeof r ? he[t].value = r : y("unhandled export type for `" + t + "`: " + typeof r))
								}
						}(n), n
					}

					function Ie(e) {
						return 0 == e.indexOf("dynCall_") || ["stackAlloc", "stackSave", "stackRestore"].includes(e) ? e : "_" + e
					}

					function Pe(e, t) {
						var n, r;
						return t && (n = i.asm["orig$" + e]), n || (n = i.asm[e]), !n && t && (n = i["_orig$" + e]), n || (n = i[Ie(e)]), !n && e.startsWith("invoke_") && (r = e.split("_")[1], n = function() {
							var e = $e();
							try {
								return xe(r, arguments[0], Array.prototype.slice.call(arguments, 1))
							} catch (t) {
								if (Ke(e), t !== t + 0 && "longjmp" !== t) throw t;
								Ge(1, 0)
							}
						}), n
					}

					function Ne(e, t) {
						var n = ye(e);

						function r() {
							var r = Math.pow(2, n.memoryAlign);
							r = Math.max(r, w);
							var s, i, o, a = (s = function(e) {
									if (ee) return ze(e);
									var t = Ee,
										n = t + e + 15 & -16;
									return Ee = n, he.__heap_base.value = n, t
								}(n.memorySize + r), (i = r) || (i = w), Math.ceil(s / i) * i),
								l = H.length;
							H.grow(n.tableSize);
							for (var c = a; c < a + n.memorySize; c++) C[c] = 0;
							for (c = l; c < l + n.tableSize; c++) H.set(c, null);
							var u = new Proxy(De, {
									get: function(e, t) {
										switch (t) {
											case "__memory_base":
												return a;
											case "__table_base":
												return l
										}
										return t in e ? e[t] : e[t] = function() {
											return n || (n = function(e) {
												var t = Pe(e, !1);
												return t || (t = o[e]), t
											}(t)), n.apply(null, arguments)
										};
										var n
									}
								}),
								_ = {
									"GOT.mem": new Proxy(De, me),
									"GOT.func": new Proxy(De, me),
									env: u,
									wasi_snapshot_preview1: u
								};

							function d(e) {
								for (var r = 0; r < n.tableSize; r++) {
									var s = H.get(l + r);
									s && b.set(s, l + r)
								}
								o = Se(e.exports, a), t.allowUndefined || Te();
								var i = o.__wasm_call_ctors;
								return i || (i = o.__post_instantiate), i && (ee ? i() : X.push(i)), o
							}
							if (t.loadAsync) {
								if (e instanceof WebAssembly.Module) {
									var f = new WebAssembly.Instance(e, _);
									return Promise.resolve(d(f))
								}
								return WebAssembly.instantiate(e, _).then((function(e) {
									return d(e.instance)
								}))
							}
							var p = e instanceof WebAssembly.Module ? e : new WebAssembly.Module(e);
							return d(f = new WebAssembly.Instance(p, _))
						}
						return t.loadAsync ? n.neededDynlibs.reduce((function(e, n) {
							return e.then((function() {
								return Le(n, t)
							}))
						}), Promise.resolve()).then((function() {
							return r()
						})) : (n.neededDynlibs.forEach((function(e) {
							Le(e, t)
						})), r())
					}

					function Me(e, t) {
						for (var n in e)
							if (e.hasOwnProperty(n)) {
								De.hasOwnProperty(n) || (De[n] = e[n]);
								var r = Ie(n);
								i.hasOwnProperty(r) || (i[r] = e[n])
							}
					}

					function Le(e, t) {
						"__main__" != e || ve.loadedLibNames[e] || (ve.loadedLibs[-1] = {
							refcount: 1 / 0,
							name: "__main__",
							module: i.asm,
							global: !0
						}, ve.loadedLibNames.__main__ = -1), t = t || {
							global: !0,
							nodelete: !0
						};
						var n, r = ve.loadedLibNames[e];
						if (r) return n = ve.loadedLibs[r], t.global && !n.global && (n.global = !0, "loading" !== n.module && Me(n.module)), t.nodelete && n.refcount !== 1 / 0 && (n.refcount = 1 / 0), n.refcount++, t.loadAsync ? Promise.resolve(r) : r;

						function s(e) {
							if (t.fs) {
								var n = t.fs.readFile(e, {
									encoding: "binary"
								});
								return n instanceof Uint8Array || (n = new Uint8Array(n)), t.loadAsync ? Promise.resolve(n) : n
							}
							return t.loadAsync ? (r = e, fetch(r, {
								credentials: "same-origin"
							}).then((function(e) {
								if (!e.ok) throw "failed to load binary file at '" + r + "'";
								return e.arrayBuffer()
							})).then((function(e) {
								return new Uint8Array(e)
							}))) : p(e);
							var r
						}

						function o() {
							if (void 0 !== i.preloadedWasm && void 0 !== i.preloadedWasm[e]) {
								var n = i.preloadedWasm[e];
								return t.loadAsync ? Promise.resolve(n) : n
							}
							return t.loadAsync ? s(e).then((function(e) {
								return Ne(e, t)
							})) : Ne(s(e), t)
						}

						function a(e) {
							n.global && Me(e), n.module = e
						}
						return r = ve.nextHandle++, n = {
							refcount: t.nodelete ? 1 / 0 : 1,
							name: e,
							module: "loading",
							global: t.global
						}, ve.loadedLibNames[e] = r, ve.loadedLibs[r] = n, t.loadAsync ? o().then((function(e) {
							return a(e), r
						})) : (a(o()), r)
					}

					function Te() {
						for (var e in he)
							if (0 == he[e].value) {
								var t = Pe(e, !0);
								"function" == typeof t ? he[e].value = x(t, t.sig) : "number" == typeof t ? he[e].value = t : T(!1, "bad export type for `" + e + "`: " + typeof t)
							}
					}
					i.___heap_base = Ee;
					var Ae, Ce = new WebAssembly.Global({
						value: "i32",
						mutable: !0
					}, 5250832);

					function Oe() {
						oe()
					}
					i._abort = Oe, Oe.sig = "v", Ae = s ? function() {
						var e = process.hrtime();
						return 1e3 * e[0] + e[1] / 1e6
					} : "undefined" != typeof dateNow ? dateNow : function() {
						return performance.now()
					};
					var Fe = !0;

					function je(e, t) {
						var n;
						if (0 === e) n = Date.now();
						else {
							if (1 !== e && 4 !== e || !Fe) return 28, j[Ue() >> 2] = 28, -1;
							n = Ae()
						}
						return j[t >> 2] = n / 1e3 | 0, j[t + 4 >> 2] = n % 1e3 * 1e3 * 1e3 | 0, 0
					}

					function Be(e) {
						try {
							return I.grow(e - A.byteLength + 65535 >>> 16), G(I.buffer), 1
						} catch (e) {}
					}

					function Re(e) {
						Xe(e)
					}

					function We(e) {
						k(e)
					}
					je.sig = "iii", Re.sig = "vi", We.sig = "vi";
					var qe, De = {
							__heap_base: Ee,
							__indirect_function_table: H,
							__memory_base: 1024,
							__stack_pointer: Ce,
							__table_base: 1,
							abort: Oe,
							clock_gettime: je,
							emscripten_memcpy_big: function(e, t, n) {
								O.copyWithin(e, t, t + n)
							},
							emscripten_resize_heap: function(e) {
								var t, n = O.length;
								if ((e >>>= 0) > 2147483648) return !1;
								for (var r = 1; r <= 4; r *= 2) {
									var s = n * (1 + .2 / r);
									if (s = Math.min(s, e + 100663296), Be(Math.min(2147483648, ((t = Math.max(e, s)) % 65536 > 0 && (t += 65536 - t % 65536), t)))) return !0
								}
								return !1
							},
							exit: Re,
							memory: I,
							setTempRet0: We,
							tree_sitter_log_callback: function(e, t) {
								if (pt) {
									const n = z(t);
									pt(n, 0 !== e)
								}
							},
							tree_sitter_parse_callback: function(e, t, n, r, s) {
								var i = ft(t, {
									row: n,
									column: r
								});
								"string" == typeof i ? (N(s, i.length, "i32"), function(e, t, n) {
									if (void 0 === n && (n = 2147483647), n < 2) return 0;
									for (var r = (n -= 2) < 2 * e.length ? n / 2 : e.length, s = 0; s < r; ++s) {
										var i = e.charCodeAt(s);
										F[t >> 1] = i, t += 2
									}
									F[t >> 1] = 0
								}(i, e, 10240)) : N(s, 0, "i32")
							}
						},
						ze = (function() {
							var e = {
								env: De,
								wasi_snapshot_preview1: De,
								"GOT.mem": new Proxy(De, me),
								"GOT.func": new Proxy(De, me)
							};

							function t(e, t) {
								var n = e.exports;
								n = Se(n, 1024), i.asm = n;
								var r, s = ye(t);
								s.neededDynlibs && (S = s.neededDynlibs.concat(S)), r = i.asm.__wasm_call_ctors, X.unshift(r), ie()
							}

							function n(e) {
								t(e.instance, e.module)
							}

							function r(t) {
								return function() {
									if (!E && (u || _)) {
										if ("function" == typeof fetch && !ce(fe)) return fetch(fe, {
											credentials: "same-origin"
										}).then((function(e) {
											if (!e.ok) throw "failed to load wasm binary file at '" + fe + "'";
											return e.arrayBuffer()
										})).catch((function() {
											return pe(fe)
										}));
										if (f) return new Promise((function(e, t) {
											f(fe, (function(t) {
												e(new Uint8Array(t))
											}), t)
										}))
									}
									return Promise.resolve().then((function() {
										return pe(fe)
									}))
								}().then((function(t) {
									return WebAssembly.instantiate(t, e)
								})).then(t, (function(e) {
									y("failed to asynchronously prepare wasm: " + e), oe(e)
								}))
							}
							if (se(), i.instantiateWasm) try {
								return i.instantiateWasm(e, t)
							} catch (e) {
								return y("Module.instantiateWasm callback failed with error: " + e), !1
							}
							E || "function" != typeof WebAssembly.instantiateStreaming || le(fe) || ce(fe) || "function" != typeof fetch ? r(n) : fetch(fe, {
								credentials: "same-origin"
							}).then((function(t) {
								return WebAssembly.instantiateStreaming(t, e).then(n, (function(e) {
									return y("wasm streaming compile failed: " + e), y("falling back to ArrayBuffer instantiation"), r(n)
								}))
							}))
						}(), i.___wasm_call_ctors = function() {
							return (i.___wasm_call_ctors = i.asm.__wasm_call_ctors).apply(null, arguments)
						}, i._malloc = function() {
							return (ze = i._malloc = i.asm.malloc).apply(null, arguments)
						}),
						Ue = (i._ts_language_symbol_count = function() {
							return (i._ts_language_symbol_count = i.asm.ts_language_symbol_count).apply(null, arguments)
						}, i._ts_language_version = function() {
							return (i._ts_language_version = i.asm.ts_language_version).apply(null, arguments)
						}, i._ts_language_field_count = function() {
							return (i._ts_language_field_count = i.asm.ts_language_field_count).apply(null, arguments)
						}, i._ts_language_symbol_name = function() {
							return (i._ts_language_symbol_name = i.asm.ts_language_symbol_name).apply(null, arguments)
						}, i._ts_language_symbol_for_name = function() {
							return (i._ts_language_symbol_for_name = i.asm.ts_language_symbol_for_name).apply(null, arguments)
						}, i._ts_language_symbol_type = function() {
							return (i._ts_language_symbol_type = i.asm.ts_language_symbol_type).apply(null, arguments)
						}, i._ts_language_field_name_for_id = function() {
							return (i._ts_language_field_name_for_id = i.asm.ts_language_field_name_for_id).apply(null, arguments)
						}, i._memcpy = function() {
							return (i._memcpy = i.asm.memcpy).apply(null, arguments)
						}, i._free = function() {
							return (i._free = i.asm.free).apply(null, arguments)
						}, i._calloc = function() {
							return (i._calloc = i.asm.calloc).apply(null, arguments)
						}, i._ts_parser_delete = function() {
							return (i._ts_parser_delete = i.asm.ts_parser_delete).apply(null, arguments)
						}, i._ts_parser_reset = function() {
							return (i._ts_parser_reset = i.asm.ts_parser_reset).apply(null, arguments)
						}, i._ts_parser_set_language = function() {
							return (i._ts_parser_set_language = i.asm.ts_parser_set_language).apply(null, arguments)
						}, i._ts_parser_timeout_micros = function() {
							return (i._ts_parser_timeout_micros = i.asm.ts_parser_timeout_micros).apply(null, arguments)
						}, i._ts_parser_set_timeout_micros = function() {
							return (i._ts_parser_set_timeout_micros = i.asm.ts_parser_set_timeout_micros).apply(null, arguments)
						}, i._memcmp = function() {
							return (i._memcmp = i.asm.memcmp).apply(null, arguments)
						}, i._ts_query_new = function() {
							return (i._ts_query_new = i.asm.ts_query_new).apply(null, arguments)
						}, i._ts_query_delete = function() {
							return (i._ts_query_delete = i.asm.ts_query_delete).apply(null, arguments)
						}, i._iswspace = function() {
							return (i._iswspace = i.asm.iswspace).apply(null, arguments)
						}, i._iswalnum = function() {
							return (i._iswalnum = i.asm.iswalnum).apply(null, arguments)
						}, i._ts_query_pattern_count = function() {
							return (i._ts_query_pattern_count = i.asm.ts_query_pattern_count).apply(null, arguments)
						}, i._ts_query_capture_count = function() {
							return (i._ts_query_capture_count = i.asm.ts_query_capture_count).apply(null, arguments)
						}, i._ts_query_string_count = function() {
							return (i._ts_query_string_count = i.asm.ts_query_string_count).apply(null, arguments)
						}, i._ts_query_capture_name_for_id = function() {
							return (i._ts_query_capture_name_for_id = i.asm.ts_query_capture_name_for_id).apply(null, arguments)
						}, i._ts_query_string_value_for_id = function() {
							return (i._ts_query_string_value_for_id = i.asm.ts_query_string_value_for_id).apply(null, arguments)
						}, i._ts_query_predicates_for_pattern = function() {
							return (i._ts_query_predicates_for_pattern = i.asm.ts_query_predicates_for_pattern).apply(null, arguments)
						}, i._ts_tree_copy = function() {
							return (i._ts_tree_copy = i.asm.ts_tree_copy).apply(null, arguments)
						}, i._ts_tree_delete = function() {
							return (i._ts_tree_delete = i.asm.ts_tree_delete).apply(null, arguments)
						}, i._ts_init = function() {
							return (i._ts_init = i.asm.ts_init).apply(null, arguments)
						}, i._ts_parser_new_wasm = function() {
							return (i._ts_parser_new_wasm = i.asm.ts_parser_new_wasm).apply(null, arguments)
						}, i._ts_parser_enable_logger_wasm = function() {
							return (i._ts_parser_enable_logger_wasm = i.asm.ts_parser_enable_logger_wasm).apply(null, arguments)
						}, i._ts_parser_parse_wasm = function() {
							return (i._ts_parser_parse_wasm = i.asm.ts_parser_parse_wasm).apply(null, arguments)
						}, i._ts_language_type_is_named_wasm = function() {
							return (i._ts_language_type_is_named_wasm = i.asm.ts_language_type_is_named_wasm).apply(null, arguments)
						}, i._ts_language_type_is_visible_wasm = function() {
							return (i._ts_language_type_is_visible_wasm = i.asm.ts_language_type_is_visible_wasm).apply(null, arguments)
						}, i._ts_tree_root_node_wasm = function() {
							return (i._ts_tree_root_node_wasm = i.asm.ts_tree_root_node_wasm).apply(null, arguments)
						}, i._ts_tree_edit_wasm = function() {
							return (i._ts_tree_edit_wasm = i.asm.ts_tree_edit_wasm).apply(null, arguments)
						}, i._ts_tree_get_changed_ranges_wasm = function() {
							return (i._ts_tree_get_changed_ranges_wasm = i.asm.ts_tree_get_changed_ranges_wasm).apply(null, arguments)
						}, i._ts_tree_cursor_new_wasm = function() {
							return (i._ts_tree_cursor_new_wasm = i.asm.ts_tree_cursor_new_wasm).apply(null, arguments)
						}, i._ts_tree_cursor_delete_wasm = function() {
							return (i._ts_tree_cursor_delete_wasm = i.asm.ts_tree_cursor_delete_wasm).apply(null, arguments)
						}, i._ts_tree_cursor_reset_wasm = function() {
							return (i._ts_tree_cursor_reset_wasm = i.asm.ts_tree_cursor_reset_wasm).apply(null, arguments)
						}, i._ts_tree_cursor_goto_first_child_wasm = function() {
							return (i._ts_tree_cursor_goto_first_child_wasm = i.asm.ts_tree_cursor_goto_first_child_wasm).apply(null, arguments)
						}, i._ts_tree_cursor_goto_next_sibling_wasm = function() {
							return (i._ts_tree_cursor_goto_next_sibling_wasm = i.asm.ts_tree_cursor_goto_next_sibling_wasm).apply(null, arguments)
						}, i._ts_tree_cursor_goto_parent_wasm = function() {
							return (i._ts_tree_cursor_goto_parent_wasm = i.asm.ts_tree_cursor_goto_parent_wasm).apply(null, arguments)
						}, i._ts_tree_cursor_current_node_type_id_wasm = function() {
							return (i._ts_tree_cursor_current_node_type_id_wasm = i.asm.ts_tree_cursor_current_node_type_id_wasm).apply(null, arguments)
						}, i._ts_tree_cursor_current_node_is_named_wasm = function() {
							return (i._ts_tree_cursor_current_node_is_named_wasm = i.asm.ts_tree_cursor_current_node_is_named_wasm).apply(null, arguments)
						}, i._ts_tree_cursor_current_node_is_missing_wasm = function() {
							return (i._ts_tree_cursor_current_node_is_missing_wasm = i.asm.ts_tree_cursor_current_node_is_missing_wasm).apply(null, arguments)
						}, i._ts_tree_cursor_current_node_id_wasm = function() {
							return (i._ts_tree_cursor_current_node_id_wasm = i.asm.ts_tree_cursor_current_node_id_wasm).apply(null, arguments)
						}, i._ts_tree_cursor_start_position_wasm = function() {
							return (i._ts_tree_cursor_start_position_wasm = i.asm.ts_tree_cursor_start_position_wasm).apply(null, arguments)
						}, i._ts_tree_cursor_end_position_wasm = function() {
							return (i._ts_tree_cursor_end_position_wasm = i.asm.ts_tree_cursor_end_position_wasm).apply(null, arguments)
						}, i._ts_tree_cursor_start_index_wasm = function() {
							return (i._ts_tree_cursor_start_index_wasm = i.asm.ts_tree_cursor_start_index_wasm).apply(null, arguments)
						}, i._ts_tree_cursor_end_index_wasm = function() {
							return (i._ts_tree_cursor_end_index_wasm = i.asm.ts_tree_cursor_end_index_wasm).apply(null, arguments)
						}, i._ts_tree_cursor_current_field_id_wasm = function() {
							return (i._ts_tree_cursor_current_field_id_wasm = i.asm.ts_tree_cursor_current_field_id_wasm).apply(null, arguments)
						}, i._ts_tree_cursor_current_node_wasm = function() {
							return (i._ts_tree_cursor_current_node_wasm = i.asm.ts_tree_cursor_current_node_wasm).apply(null, arguments)
						}, i._ts_node_symbol_wasm = function() {
							return (i._ts_node_symbol_wasm = i.asm.ts_node_symbol_wasm).apply(null, arguments)
						}, i._ts_node_child_count_wasm = function() {
							return (i._ts_node_child_count_wasm = i.asm.ts_node_child_count_wasm).apply(null, arguments)
						}, i._ts_node_named_child_count_wasm = function() {
							return (i._ts_node_named_child_count_wasm = i.asm.ts_node_named_child_count_wasm).apply(null, arguments)
						}, i._ts_node_child_wasm = function() {
							return (i._ts_node_child_wasm = i.asm.ts_node_child_wasm).apply(null, arguments)
						}, i._ts_node_named_child_wasm = function() {
							return (i._ts_node_named_child_wasm = i.asm.ts_node_named_child_wasm).apply(null, arguments)
						}, i._ts_node_child_by_field_id_wasm = function() {
							return (i._ts_node_child_by_field_id_wasm = i.asm.ts_node_child_by_field_id_wasm).apply(null, arguments)
						}, i._ts_node_next_sibling_wasm = function() {
							return (i._ts_node_next_sibling_wasm = i.asm.ts_node_next_sibling_wasm).apply(null, arguments)
						}, i._ts_node_prev_sibling_wasm = function() {
							return (i._ts_node_prev_sibling_wasm = i.asm.ts_node_prev_sibling_wasm).apply(null, arguments)
						}, i._ts_node_next_named_sibling_wasm = function() {
							return (i._ts_node_next_named_sibling_wasm = i.asm.ts_node_next_named_sibling_wasm).apply(null, arguments)
						}, i._ts_node_prev_named_sibling_wasm = function() {
							return (i._ts_node_prev_named_sibling_wasm = i.asm.ts_node_prev_named_sibling_wasm).apply(null, arguments)
						}, i._ts_node_parent_wasm = function() {
							return (i._ts_node_parent_wasm = i.asm.ts_node_parent_wasm).apply(null, arguments)
						}, i._ts_node_descendant_for_index_wasm = function() {
							return (i._ts_node_descendant_for_index_wasm = i.asm.ts_node_descendant_for_index_wasm).apply(null, arguments)
						}, i._ts_node_named_descendant_for_index_wasm = function() {
							return (i._ts_node_named_descendant_for_index_wasm = i.asm.ts_node_named_descendant_for_index_wasm).apply(null, arguments)
						}, i._ts_node_descendant_for_position_wasm = function() {
							return (i._ts_node_descendant_for_position_wasm = i.asm.ts_node_descendant_for_position_wasm).apply(null, arguments)
						}, i._ts_node_named_descendant_for_position_wasm = function() {
							return (i._ts_node_named_descendant_for_position_wasm = i.asm.ts_node_named_descendant_for_position_wasm).apply(null, arguments)
						}, i._ts_node_start_point_wasm = function() {
							return (i._ts_node_start_point_wasm = i.asm.ts_node_start_point_wasm).apply(null, arguments)
						}, i._ts_node_end_point_wasm = function() {
							return (i._ts_node_end_point_wasm = i.asm.ts_node_end_point_wasm).apply(null, arguments)
						}, i._ts_node_start_index_wasm = function() {
							return (i._ts_node_start_index_wasm = i.asm.ts_node_start_index_wasm).apply(null, arguments)
						}, i._ts_node_end_index_wasm = function() {
							return (i._ts_node_end_index_wasm = i.asm.ts_node_end_index_wasm).apply(null, arguments)
						}, i._ts_node_to_string_wasm = function() {
							return (i._ts_node_to_string_wasm = i.asm.ts_node_to_string_wasm).apply(null, arguments)
						}, i._ts_node_children_wasm = function() {
							return (i._ts_node_children_wasm = i.asm.ts_node_children_wasm).apply(null, arguments)
						}, i._ts_node_named_children_wasm = function() {
							return (i._ts_node_named_children_wasm = i.asm.ts_node_named_children_wasm).apply(null, arguments)
						}, i._ts_node_descendants_of_type_wasm = function() {
							return (i._ts_node_descendants_of_type_wasm = i.asm.ts_node_descendants_of_type_wasm).apply(null, arguments)
						}, i._ts_node_is_named_wasm = function() {
							return (i._ts_node_is_named_wasm = i.asm.ts_node_is_named_wasm).apply(null, arguments)
						}, i._ts_node_has_changes_wasm = function() {
							return (i._ts_node_has_changes_wasm = i.asm.ts_node_has_changes_wasm).apply(null, arguments)
						}, i._ts_node_has_error_wasm = function() {
							return (i._ts_node_has_error_wasm = i.asm.ts_node_has_error_wasm).apply(null, arguments)
						}, i._ts_node_is_missing_wasm = function() {
							return (i._ts_node_is_missing_wasm = i.asm.ts_node_is_missing_wasm).apply(null, arguments)
						}, i._ts_query_matches_wasm = function() {
							return (i._ts_query_matches_wasm = i.asm.ts_query_matches_wasm).apply(null, arguments)
						}, i._ts_query_captures_wasm = function() {
							return (i._ts_query_captures_wasm = i.asm.ts_query_captures_wasm).apply(null, arguments)
						}, i._iswalpha = function() {
							return (i._iswalpha = i.asm.iswalpha).apply(null, arguments)
						}, i._iswdigit = function() {
							return (i._iswdigit = i.asm.iswdigit).apply(null, arguments)
						}, i._iswlower = function() {
							return (i._iswlower = i.asm.iswlower).apply(null, arguments)
						}, i._towupper = function() {
							return (i._towupper = i.asm.towupper).apply(null, arguments)
						}, i._memchr = function() {
							return (i._memchr = i.asm.memchr).apply(null, arguments)
						}, i.___errno_location = function() {
							return (Ue = i.___errno_location = i.asm.__errno_location).apply(null, arguments)
						}),
						$e = (i._strlen = function() {
							return (i._strlen = i.asm.strlen).apply(null, arguments)
						}, i.stackSave = function() {
							return ($e = i.stackSave = i.asm.stackSave).apply(null, arguments)
						}),
						Ke = i.stackRestore = function() {
							return (Ke = i.stackRestore = i.asm.stackRestore).apply(null, arguments)
						},
						Ze = i.stackAlloc = function() {
							return (Ze = i.stackAlloc = i.asm.stackAlloc).apply(null, arguments)
						},
						Ge = i._setThrew = function() {
							return (Ge = i._setThrew = i.asm.setThrew).apply(null, arguments)
						};

					function Ve(e) {
						this.name = "ExitStatus", this.message = "Program terminated with exit(" + e + ")", this.status = e
					}
					i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = function() {
						return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm = i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE6__initEPKcm).apply(null, arguments)
					}, i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = function() {
						return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev = i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEED2Ev).apply(null, arguments)
					}, i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = function() {
						return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm = i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9__grow_byEmmmmmm).apply(null, arguments)
					}, i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = function() {
						return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm = i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE7reserveEm).apply(null, arguments)
					}, i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = function() {
						return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc = i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE9push_backEc).apply(null, arguments)
					}, i.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = function() {
						return (i.__ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm = i.asm._ZNKSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEE4copyEPcmm).apply(null, arguments)
					}, i.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = function() {
						return (i.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev = i.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEED2Ev).apply(null, arguments)
					}, i.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = function() {
						return (i.__ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw = i.asm._ZNSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEE9push_backEw).apply(null, arguments)
					}, i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_ = function() {
						return (i.__ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_ = i.asm._ZNSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEC1ERKS5_).apply(null, arguments)
					}, i.__ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv = function() {
						return (i.__ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv = i.asm._ZNKSt3__220__vector_base_commonILb1EE20__throw_length_errorEv).apply(null, arguments)
					}, i.__Znwm = function() {
						return (i.__Znwm = i.asm._Znwm).apply(null, arguments)
					}, i.__ZdlPv = function() {
						return (i.__ZdlPv = i.asm._ZdlPv).apply(null, arguments)
					}, i._orig$ts_parser_timeout_micros = function() {
						return (i._orig$ts_parser_timeout_micros = i.asm.orig$ts_parser_timeout_micros).apply(null, arguments)
					}, i._orig$ts_parser_set_timeout_micros = function() {
						return (i._orig$ts_parser_set_timeout_micros = i.asm.orig$ts_parser_set_timeout_micros).apply(null, arguments)
					}, i._TRANSFER_BUFFER = 7296, i.___THREW__ = 7932, i.___threwValue = 7936, i.___cxa_new_handler = 7928, i.allocate = function(e, t) {
						var n;
						return n = t == W ? Ze(e.length) : ze(e.length), e.subarray || e.slice ? O.set(e, n) : O.set(new Uint8Array(e), n), n
					}, re = function e() {
						qe || Je(), qe || (re = e)
					};
					var He = !1;

					function Je(e) {
						function t() {
							qe || (qe = !0, i.calledRun = !0, L || (ee = !0, ge(X), ge(Y), i.onRuntimeInitialized && i.onRuntimeInitialized(), Ye && function(e) {
								var t = i._main;
								if (t) {
									var n = (e = e || []).length + 1,
										r = Ze(4 * (n + 1));
									j[r >> 2] = Z(l);
									for (var s = 1; s < n; s++) j[(r >> 2) + s] = Z(e[s - 1]);
									j[(r >> 2) + n] = 0;
									try {
										Xe(t(n, r), !0)
									} catch (e) {
										if (e instanceof Ve) return;
										if ("unwind" == e) return;
										var o = e;
										e && "object" == typeof e && e.stack && (o = [e, e.stack]), y("exception thrown: " + o), c(1, e)
									}
								}
							}(e), function() {
								if (i.postRun)
									for ("function" == typeof i.postRun && (i.postRun = [i.postRun]); i.postRun.length;) e = i.postRun.shift(), Q.unshift(e);
								var e;
								ge(Q)
							}()))
						}
						e = e || a, te > 0 || !He && (function() {
							if (S.length) {
								if (!p) return se(), void S.reduce((function(e, t) {
									return e.then((function() {
										return Le(t, {
											loadAsync: !0,
											global: !0,
											nodelete: !0,
											allowUndefined: !0
										})
									}))
								}), Promise.resolve()).then((function() {
									ie(), Te()
								}));
								S.forEach((function(e) {
									Le(e, {
										global: !0,
										nodelete: !0,
										allowUndefined: !0
									})
								})), Te()
							} else Te()
						}(), He = !0, te > 0) || (function() {
							if (i.preRun)
								for ("function" == typeof i.preRun && (i.preRun = [i.preRun]); i.preRun.length;) e = i.preRun.shift(), J.unshift(e);
							var e;
							ge(J)
						}(), te > 0 || (i.setStatus ? (i.setStatus("Running..."), setTimeout((function() {
							setTimeout((function() {
								i.setStatus("")
							}), 1), t()
						}), 1)) : t()))
					}

					function Xe(e, t) {
						t && we() && 0 === e || (we() || (i.onExit && i.onExit(e), L = !0), c(e, new Ve(e)))
					}
					if (i.run = Je, i.preInit)
						for ("function" == typeof i.preInit && (i.preInit = [i.preInit]); i.preInit.length > 0;) i.preInit.pop()();
					var Ye = !0;
					i.noInitialRun && (Ye = !1), Je();
					const Qe = i,
						et = {},
						tt = 4,
						nt = 5 * tt,
						rt = 2 * tt,
						st = 2 * tt + 2 * rt,
						it = {
							row: 0,
							column: 0
						},
						ot = /[\w-.]*/g,
						at = 1,
						lt = 2,
						ct = /^_?tree_sitter_\w+/;
					var ut, _t, dt, ft, pt, ht = new Promise((e => {
						i.onRuntimeInitialized = e
					})).then((() => {
						dt = Qe._ts_init(), ut = M(dt, "i32"), _t = M(dt + tt, "i32")
					}));
					class mt {
						static init() {
							return ht
						}
						constructor() {
							if (null == dt) throw new Error("You must first call Parser.init() and wait for it to resolve.");
							Qe._ts_parser_new_wasm(), this[0] = M(dt, "i32"), this[1] = M(dt + tt, "i32")
						}
						delete() {
							Qe._ts_parser_delete(this[0]), Qe._free(this[1]), this[0] = 0, this[1] = 0
						}
						setLanguage(e) {
							let t;
							if (e) {
								if (e.constructor !== wt) throw new Error("Argument must be a Language"); {
									t = e[0];
									const n = Qe._ts_language_version(t);
									if (n < _t || ut < n) throw new Error(`Incompatible language version ${n}. Compatibility range ${_t} through ${ut}.`)
								}
							} else t = 0, e = null;
							return this.language = e, Qe._ts_parser_set_language(this[0], t), this
						}
						getLanguage() {
							return this.language
						}
						parse(e, t, n) {
							if ("string" == typeof e) ft = (t, n, r) => e.slice(t, r);
							else {
								if ("function" != typeof e) throw new Error("Argument must be a string or a function");
								ft = e
							}
							this.logCallback ? (pt = this.logCallback, Qe._ts_parser_enable_logger_wasm(this[0], 1)) : (pt = null, Qe._ts_parser_enable_logger_wasm(this[0], 0));
							let r = 0,
								s = 0;
							if (n && n.includedRanges) {
								r = n.includedRanges.length;
								let e = s = Qe._calloc(r, st);
								for (let t = 0; t < r; t++) At(e, n.includedRanges[t]), e += st
							}
							const i = Qe._ts_parser_parse_wasm(this[0], this[1], t ? t[0] : 0, s, r);
							if (!i) throw ft = null, pt = null, new Error("Parsing failed");
							const o = new gt(et, i, this.language, ft);
							return ft = null, pt = null, o
						}
						reset() {
							Qe._ts_parser_reset(this[0])
						}
						setTimeoutMicros(e) {
							Qe._ts_parser_set_timeout_micros(this[0], e)
						}
						getTimeoutMicros() {
							return Qe._ts_parser_timeout_micros(this[0])
						}
						setLogger(e) {
							if (e) {
								if ("function" != typeof e) throw new Error("Logger callback must be a function")
							} else e = null;
							return this.logCallback = e, this
						}
						getLogger() {
							return this.logCallback
						}
					}
					class gt {
						constructor(e, t, n, r) {
							kt(e), this[0] = t, this.language = n, this.textCallback = r
						}
						copy() {
							const e = Qe._ts_tree_copy(this[0]);
							return new gt(et, e, this.language, this.textCallback)
						}
						delete() {
							Qe._ts_tree_delete(this[0]), this[0] = 0
						}
						edit(e) {
							! function(e) {
								let t = dt;
								Lt(t, e.startPosition), Lt(t += rt, e.oldEndPosition), Lt(t += rt, e.newEndPosition), N(t += rt, e.startIndex, "i32"), N(t += tt, e.oldEndIndex, "i32"), N(t += tt, e.newEndIndex, "i32"), t += tt
							}(e), Qe._ts_tree_edit_wasm(this[0])
						}
						get rootNode() {
							return Qe._ts_tree_root_node_wasm(this[0]), Pt(this)
						}
						getLanguage() {
							return this.language
						}
						walk() {
							return this.rootNode.walk()
						}
						getChangedRanges(e) {
							if (e.constructor !== gt) throw new TypeError("Argument must be a Tree");
							Qe._ts_tree_get_changed_ranges_wasm(this[0], e[0]);
							const t = M(dt, "i32"),
								n = M(dt + tt, "i32"),
								r = new Array(t);
							if (t > 0) {
								let e = n;
								for (let n = 0; n < t; n++) r[n] = Ct(e), e += st;
								Qe._free(n)
							}
							return r
						}
					}
					class yt {
						constructor(e, t) {
							kt(e), this.tree = t
						}
						get typeId() {
							return It(this), Qe._ts_node_symbol_wasm(this.tree[0])
						}
						get type() {
							return this.tree.language.types[this.typeId] || "ERROR"
						}
						get endPosition() {
							return It(this), Qe._ts_node_end_point_wasm(this.tree[0]), Tt(dt)
						}
						get endIndex() {
							return It(this), Qe._ts_node_end_index_wasm(this.tree[0])
						}
						get text() {
							return xt(this.tree, this.startIndex, this.endIndex)
						}
						isNamed() {
							return It(this), 1 === Qe._ts_node_is_named_wasm(this.tree[0])
						}
						hasError() {
							return It(this), 1 === Qe._ts_node_has_error_wasm(this.tree[0])
						}
						hasChanges() {
							return It(this), 1 === Qe._ts_node_has_changes_wasm(this.tree[0])
						}
						isMissing() {
							return It(this), 1 === Qe._ts_node_is_missing_wasm(this.tree[0])
						}
						equals(e) {
							return this.id === e.id
						}
						child(e) {
							return It(this), Qe._ts_node_child_wasm(this.tree[0], e), Pt(this.tree)
						}
						namedChild(e) {
							return It(this), Qe._ts_node_named_child_wasm(this.tree[0], e), Pt(this.tree)
						}
						childForFieldId(e) {
							return It(this), Qe._ts_node_child_by_field_id_wasm(this.tree[0], e), Pt(this.tree)
						}
						childForFieldName(e) {
							const t = this.tree.language.fields.indexOf(e);
							if (-1 !== t) return this.childForFieldId(t)
						}
						get childCount() {
							return It(this), Qe._ts_node_child_count_wasm(this.tree[0])
						}
						get namedChildCount() {
							return It(this), Qe._ts_node_named_child_count_wasm(this.tree[0])
						}
						get firstChild() {
							return this.child(0)
						}
						get firstNamedChild() {
							return this.namedChild(0)
						}
						get lastChild() {
							return this.child(this.childCount - 1)
						}
						get lastNamedChild() {
							return this.namedChild(this.namedChildCount - 1)
						}
						get children() {
							if (!this._children) {
								It(this), Qe._ts_node_children_wasm(this.tree[0]);
								const e = M(dt, "i32"),
									t = M(dt + tt, "i32");
								if (this._children = new Array(e), e > 0) {
									let n = t;
									for (let t = 0; t < e; t++) this._children[t] = Pt(this.tree, n), n += nt;
									Qe._free(t)
								}
							}
							return this._children
						}
						get namedChildren() {
							if (!this._namedChildren) {
								It(this), Qe._ts_node_named_children_wasm(this.tree[0]);
								const e = M(dt, "i32"),
									t = M(dt + tt, "i32");
								if (this._namedChildren = new Array(e), e > 0) {
									let n = t;
									for (let t = 0; t < e; t++) this._namedChildren[t] = Pt(this.tree, n), n += nt;
									Qe._free(t)
								}
							}
							return this._namedChildren
						}
						descendantsOfType(e, t, n) {
							Array.isArray(e) || (e = [e]), t || (t = it), n || (n = it);
							const r = [],
								s = this.tree.language.types;
							for (let t = 0, n = s.length; t < n; t++) e.includes(s[t]) && r.push(t);
							const i = Qe._malloc(tt * r.length);
							for (let e = 0, t = r.length; e < t; e++) N(i + e * tt, r[e], "i32");
							It(this), Qe._ts_node_descendants_of_type_wasm(this.tree[0], i, r.length, t.row, t.column, n.row, n.column);
							const o = M(dt, "i32"),
								a = M(dt + tt, "i32"),
								l = new Array(o);
							if (o > 0) {
								let e = a;
								for (let t = 0; t < o; t++) l[t] = Pt(this.tree, e), e += nt
							}
							return Qe._free(a), Qe._free(i), l
						}
						get nextSibling() {
							return It(this), Qe._ts_node_next_sibling_wasm(this.tree[0]), Pt(this.tree)
						}
						get previousSibling() {
							return It(this), Qe._ts_node_prev_sibling_wasm(this.tree[0]), Pt(this.tree)
						}
						get nextNamedSibling() {
							return It(this), Qe._ts_node_next_named_sibling_wasm(this.tree[0]), Pt(this.tree)
						}
						get previousNamedSibling() {
							return It(this), Qe._ts_node_prev_named_sibling_wasm(this.tree[0]), Pt(this.tree)
						}
						get parent() {
							return It(this), Qe._ts_node_parent_wasm(this.tree[0]), Pt(this.tree)
						}
						descendantForIndex(e, t = e) {
							if ("number" != typeof e || "number" != typeof t) throw new Error("Arguments must be numbers");
							It(this);
							let n = dt + nt;
							return N(n, e, "i32"), N(n + tt, t, "i32"), Qe._ts_node_descendant_for_index_wasm(this.tree[0]), Pt(this.tree)
						}
						namedDescendantForIndex(e, t = e) {
							if ("number" != typeof e || "number" != typeof t) throw new Error("Arguments must be numbers");
							It(this);
							let n = dt + nt;
							return N(n, e, "i32"), N(n + tt, t, "i32"), Qe._ts_node_named_descendant_for_index_wasm(this.tree[0]), Pt(this.tree)
						}
						descendantForPosition(e, t = e) {
							if (!St(e) || !St(t)) throw new Error("Arguments must be {row, column} objects");
							It(this);
							let n = dt + nt;
							return Lt(n, e), Lt(n + rt, t), Qe._ts_node_descendant_for_position_wasm(this.tree[0]), Pt(this.tree)
						}
						namedDescendantForPosition(e, t = e) {
							if (!St(e) || !St(t)) throw new Error("Arguments must be {row, column} objects");
							It(this);
							let n = dt + nt;
							return Lt(n, e), Lt(n + rt, t), Qe._ts_node_named_descendant_for_position_wasm(this.tree[0]), Pt(this.tree)
						}
						walk() {
							return It(this), Qe._ts_tree_cursor_new_wasm(this.tree[0]), new bt(et, this.tree)
						}
						toString() {
							It(this);
							const e = Qe._ts_node_to_string_wasm(this.tree[0]),
								t = function(e) {
									for (var t = "";;) {
										var n = O[e++ >> 0];
										if (!n) return t;
										t += String.fromCharCode(n)
									}
								}(e);
							return Qe._free(e), t
						}
					}
					class bt {
						constructor(e, t) {
							kt(e), this.tree = t, Mt(this)
						}
						delete() {
							Nt(this), Qe._ts_tree_cursor_delete_wasm(this.tree[0]), this[0] = this[1] = this[2] = 0
						}
						reset(e) {
							It(e), Nt(this, dt + nt), Qe._ts_tree_cursor_reset_wasm(this.tree[0]), Mt(this)
						}
						get nodeType() {
							return this.tree.language.types[this.nodeTypeId] || "ERROR"
						}
						get nodeTypeId() {
							return Nt(this), Qe._ts_tree_cursor_current_node_type_id_wasm(this.tree[0])
						}
						get nodeId() {
							return Nt(this), Qe._ts_tree_cursor_current_node_id_wasm(this.tree[0])
						}
						get nodeIsNamed() {
							return Nt(this), 1 === Qe._ts_tree_cursor_current_node_is_named_wasm(this.tree[0])
						}
						get nodeIsMissing() {
							return Nt(this), 1 === Qe._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0])
						}
						get nodeText() {
							Nt(this);
							const e = Qe._ts_tree_cursor_start_index_wasm(this.tree[0]),
								t = Qe._ts_tree_cursor_end_index_wasm(this.tree[0]);
							return xt(this.tree, e, t)
						}
						get startPosition() {
							return Nt(this), Qe._ts_tree_cursor_start_position_wasm(this.tree[0]), Tt(dt)
						}
						get endPosition() {
							return Nt(this), Qe._ts_tree_cursor_end_position_wasm(this.tree[0]), Tt(dt)
						}
						get startIndex() {
							return Nt(this), Qe._ts_tree_cursor_start_index_wasm(this.tree[0])
						}
						get endIndex() {
							return Nt(this), Qe._ts_tree_cursor_end_index_wasm(this.tree[0])
						}
						currentNode() {
							return Nt(this), Qe._ts_tree_cursor_current_node_wasm(this.tree[0]), Pt(this.tree)
						}
						currentFieldId() {
							return Nt(this), Qe._ts_tree_cursor_current_field_id_wasm(this.tree[0])
						}
						currentFieldName() {
							return this.tree.language.fields[this.currentFieldId()]
						}
						gotoFirstChild() {
							Nt(this);
							const e = Qe._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
							return Mt(this), 1 === e
						}
						gotoNextSibling() {
							Nt(this);
							const e = Qe._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
							return Mt(this), 1 === e
						}
						gotoParent() {
							Nt(this);
							const e = Qe._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
							return Mt(this), 1 === e
						}
					}
					class wt {
						constructor(e, t) {
							kt(e), this[0] = t, this.types = new Array(Qe._ts_language_symbol_count(this[0]));
							for (let e = 0, t = this.types.length; e < t; e++) Qe._ts_language_symbol_type(this[0], e) < 2 && (this.types[e] = z(Qe._ts_language_symbol_name(this[0], e)));
							this.fields = new Array(Qe._ts_language_field_count(this[0]) + 1);
							for (let e = 0, t = this.fields.length; e < t; e++) {
								const t = Qe._ts_language_field_name_for_id(this[0], e);
								this.fields[e] = 0 !== t ? z(t) : null
							}
						}
						get version() {
							return Qe._ts_language_version(this[0])
						}
						get fieldCount() {
							return this.fields.length - 1
						}
						fieldIdForName(e) {
							const t = this.fields.indexOf(e);
							return -1 !== t ? t : null
						}
						fieldNameForId(e) {
							return this.fields[e] || null
						}
						idForNodeType(e, t) {
							const n = K(e),
								r = Qe._malloc(n + 1);
							$(e, r, n + 1);
							const s = Qe._ts_language_symbol_for_name(this[0], r, n, t);
							return Qe._free(r), s || null
						}
						get nodeTypeCount() {
							return Qe._ts_language_symbol_count(this[0])
						}
						nodeTypeForId(e) {
							const t = Qe._ts_language_symbol_name(this[0], e);
							return t ? z(t) : null
						}
						nodeTypeIsNamed(e) {
							return !!Qe._ts_language_type_is_named_wasm(this[0], e)
						}
						nodeTypeIsVisible(e) {
							return !!Qe._ts_language_type_is_visible_wasm(this[0], e)
						}
						query(e) {
							const t = K(e),
								n = Qe._malloc(t + 1);
							$(e, n, t + 1);
							const r = Qe._ts_query_new(this[0], n, t, dt, dt + tt);
							if (!r) {
								const t = M(dt + tt, "i32"),
									r = z(n, M(dt, "i32")).length,
									s = e.substr(r, 100).split("\n")[0];
								let i, o = s.match(ot)[0];
								switch (t) {
									case 2:
										i = new RangeError(`Bad node name '${o}'`);
										break;
									case 3:
										i = new RangeError(`Bad field name '${o}'`);
										break;
									case 4:
										i = new RangeError(`Bad capture name @${o}`);
										break;
									case 5:
										i = new TypeError(`Bad pattern structure at offset ${r}: '${s}'...`), o = "";
										break;
									default:
										i = new SyntaxError(`Bad syntax at offset ${r}: '${s}'...`), o = ""
								}
								throw i.index = r, i.length = o.length, Qe._free(n), i
							}
							const s = Qe._ts_query_string_count(r),
								i = Qe._ts_query_capture_count(r),
								o = Qe._ts_query_pattern_count(r),
								a = new Array(i),
								l = new Array(s);
							for (let e = 0; e < i; e++) {
								const t = Qe._ts_query_capture_name_for_id(r, e, dt),
									n = M(dt, "i32");
								a[e] = z(t, n)
							}
							for (let e = 0; e < s; e++) {
								const t = Qe._ts_query_string_value_for_id(r, e, dt),
									n = M(dt, "i32");
								l[e] = z(t, n)
							}
							const c = new Array(o),
								u = new Array(o),
								_ = new Array(o),
								d = new Array(o),
								f = new Array(o);
							for (let e = 0; e < o; e++) {
								const t = Qe._ts_query_predicates_for_pattern(r, e, dt),
									n = M(dt, "i32");
								d[e] = [], f[e] = [];
								const s = [];
								let i = t;
								for (let t = 0; t < n; t++) {
									const t = M(i, "i32"),
										n = M(i += tt, "i32");
									if (i += tt, t === at) s.push({
										type: "capture",
										name: a[n]
									});
									else if (t === lt) s.push({
										type: "string",
										value: l[n]
									});
									else if (s.length > 0) {
										if ("string" !== s[0].type) throw new Error("Predicates must begin with a literal value");
										const t = s[0].value;
										let n = !0;
										switch (t) {
											case "not-eq?":
												n = !1;
											case "eq?":
												if (3 !== s.length) throw new Error("Wrong number of arguments to `#eq?` predicate. Expected 2, got " + (s.length - 1));
												if ("capture" !== s[1].type) throw new Error(`First argument of \`#eq?\` predicate must be a capture. Got "${s[1].value}"`);
												if ("capture" === s[2].type) {
													const t = s[1].name,
														r = s[2].name;
													f[e].push((function(e) {
														let s, i;
														for (const n of e) n.name === t && (s = n.node), n.name === r && (i = n.node);
														return s.text === i.text === n
													}))
												} else {
													const t = s[1].name,
														r = s[2].value;
													f[e].push((function(e) {
														for (const s of e)
															if (s.name === t) return s.node.text === r === n;
														return !1
													}))
												}
												break;
											case "not-match?":
												n = !1;
											case "match?":
												if (3 !== s.length) throw new Error(`Wrong number of arguments to \`#match?\` predicate. Expected 2, got ${s.length-1}.`);
												if ("capture" !== s[1].type) throw new Error(`First argument of \`#match?\` predicate must be a capture. Got "${s[1].value}".`);
												if ("string" !== s[2].type) throw new Error(`Second argument of \`#match?\` predicate must be a string. Got @${s[2].value}.`);
												const r = s[1].name,
													i = new RegExp(s[2].value);
												f[e].push((function(e) {
													for (const t of e)
														if (t.name === r) return i.test(t.node.text) === n;
													return !1
												}));
												break;
											case "set!":
												if (s.length < 2 || s.length > 3) throw new Error(`Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${s.length-1}.`);
												if (s.some((e => "string" !== e.type))) throw new Error('Arguments to `#set!` predicate must be a strings.".');
												c[e] || (c[e] = {}), c[e][s[1].value] = s[2] ? s[2].value : null;
												break;
											case "is?":
											case "is-not?":
												if (s.length < 2 || s.length > 3) throw new Error(`Wrong number of arguments to \`#${t}\` predicate. Expected 1 or 2. Got ${s.length-1}.`);
												if (s.some((e => "string" !== e.type))) throw new Error(`Arguments to \`#${t}\` predicate must be a strings.".`);
												const o = "is?" === t ? u : _;
												o[e] || (o[e] = {}), o[e][s[1].value] = s[2] ? s[2].value : null;
												break;
											default:
												d[e].push({
													operator: t,
													operands: s.slice(1)
												})
										}
										s.length = 0
									}
								}
								Object.freeze(c[e]), Object.freeze(u[e]), Object.freeze(_[e])
							}
							return Qe._free(n), new vt(et, r, a, f, d, Object.freeze(c), Object.freeze(u), Object.freeze(_))
						}
						static load(e) {
							let t;
							if (e instanceof Uint8Array) t = Promise.resolve(e);
							else {
								const r = e;
								if ("undefined" != typeof process && process.versions && process.versions.node) {
									const e = n(747);
									t = Promise.resolve(e.readFileSync(r))
								} else t = fetch(r).then((e => e.arrayBuffer().then((t => {
									if (e.ok) return new Uint8Array(t); {
										const n = new TextDecoder("utf-8").decode(t);
										throw new Error(`Language.load failed with status ${e.status}.\n\n${n}`)
									}
								}))))
							}
							const r = "function" == typeof loadSideModule ? loadSideModule : Ne;
							return t.then((e => r(e, {
								loadAsync: !0
							}))).then((e => {
								const t = Object.keys(e),
									n = t.find((e => ct.test(e) && !e.includes("external_scanner_")));
								n || console.log(`Couldn't find language function in WASM file. Symbols:\n${JSON.stringify(t,null,2)}`);
								const r = e[n]();
								return new wt(et, r)
							}))
						}
					}
					class vt {
						constructor(e, t, n, r, s, i, o, a) {
							kt(e), this[0] = t, this.captureNames = n, this.textPredicates = r, this.predicates = s, this.setProperties = i, this.assertedProperties = o, this.refutedProperties = a, this.exceededMatchLimit = !1
						}
						delete() {
							Qe._ts_query_delete(this[0]), this[0] = 0
						}
						matches(e, t, n) {
							t || (t = it), n || (n = it), It(e), Qe._ts_query_matches_wasm(this[0], e.tree[0], t.row, t.column, n.row, n.column);
							const r = M(dt, "i32"),
								s = M(dt + tt, "i32"),
								i = M(dt + 2 * tt, "i32"),
								o = new Array(r);
							this.exceededMatchLimit = !!i;
							let a = 0,
								l = s;
							for (let t = 0; t < r; t++) {
								const n = M(l, "i32"),
									r = M(l += tt, "i32");
								l += tt;
								const s = new Array(r);
								if (l = Et(this, e.tree, l, s), this.textPredicates[n].every((e => e(s)))) {
									o[a++] = {
										pattern: n,
										captures: s
									};
									const e = this.setProperties[n];
									e && (o[t].setProperties = e);
									const r = this.assertedProperties[n];
									r && (o[t].assertedProperties = r);
									const i = this.refutedProperties[n];
									i && (o[t].refutedProperties = i)
								}
							}
							return o.length = a, Qe._free(s), o
						}
						captures(e, t, n) {
							t || (t = it), n || (n = it), It(e), Qe._ts_query_captures_wasm(this[0], e.tree[0], t.row, t.column, n.row, n.column);
							const r = M(dt, "i32"),
								s = M(dt + tt, "i32"),
								i = M(dt + 2 * tt, "i32"),
								o = [];
							this.exceededMatchLimit = !!i;
							const a = [];
							let l = s;
							for (let t = 0; t < r; t++) {
								const t = M(l, "i32"),
									n = M(l += tt, "i32"),
									r = M(l += tt, "i32");
								if (l += tt, a.length = n, l = Et(this, e.tree, l, a), this.textPredicates[t].every((e => e(a)))) {
									const e = a[r],
										n = this.setProperties[t];
									n && (e.setProperties = n);
									const s = this.assertedProperties[t];
									s && (e.assertedProperties = s);
									const i = this.refutedProperties[t];
									i && (e.refutedProperties = i), o.push(e)
								}
							}
							return Qe._free(s), o
						}
						predicatesForPattern(e) {
							return this.predicates[e]
						}
						didExceedMatchLimit() {
							return this.exceededMatchLimit
						}
					}

					function xt(e, t, n) {
						const r = n - t;
						let s = e.textCallback(t, null, n);
						for (t += s.length; t < n;) {
							const r = e.textCallback(t, null, n);
							if (!(r && r.length > 0)) break;
							t += r.length, s += r
						}
						return t > n && (s = s.slice(0, r)), s
					}

					function Et(e, t, n, r) {
						for (let s = 0, i = r.length; s < i; s++) {
							const i = M(n, "i32"),
								o = Pt(t, n += tt);
							n += nt, r[s] = {
								name: e.captureNames[i],
								node: o
							}
						}
						return n
					}

					function kt(e) {
						if (e !== et) throw new Error("Illegal constructor")
					}

					function St(e) {
						return e && "number" == typeof e.row && "number" == typeof e.column
					}

					function It(e) {
						let t = dt;
						N(t, e.id, "i32"), N(t += tt, e.startIndex, "i32"), N(t += tt, e.startPosition.row, "i32"), N(t += tt, e.startPosition.column, "i32"), N(t += tt, e[0], "i32")
					}

					function Pt(e, t = dt) {
						const n = M(t, "i32");
						if (0 === n) return null;
						const r = M(t += tt, "i32"),
							s = M(t += tt, "i32"),
							i = M(t += tt, "i32"),
							o = M(t += tt, "i32"),
							a = new yt(et, e);
						return a.id = n, a.startIndex = r, a.startPosition = {
							row: s,
							column: i
						}, a[0] = o, a
					}

					function Nt(e, t = dt) {
						N(t + 0 * tt, e[0], "i32"), N(t + 1 * tt, e[1], "i32"), N(t + 2 * tt, e[2], "i32")
					}

					function Mt(e) {
						e[0] = M(dt + 0 * tt, "i32"), e[1] = M(dt + 1 * tt, "i32"), e[2] = M(dt + 2 * tt, "i32")
					}

					function Lt(e, t) {
						N(e, t.row, "i32"), N(e + tt, t.column, "i32")
					}

					function Tt(e) {
						return {
							row: M(e, "i32"),
							column: M(e + tt, "i32")
						}
					}

					function At(e, t) {
						Lt(e, t.startPosition), Lt(e += rt, t.endPosition), N(e += rt, t.startIndex, "i32"), N(e += tt, t.endIndex, "i32"), e += tt
					}

					function Ct(e) {
						const t = {};
						return t.startPosition = Tt(e), e += rt, t.endPosition = Tt(e), e += rt, t.startIndex = M(e, "i32"), e += tt, t.endIndex = M(e, "i32"), t
					}
					return mt.Language = wt, mt.Parser = mt, mt
				}) ? r.apply(t, []) : r) || (e.exports = s)
			},
			94: (e, t, n) => {
				const r = n(747),
					s = n(622),
					i = (e, t) => Array.from(Array(t).keys()).slice(e),
					o = e => e.charCodeAt(0),
					a = new TextDecoder("utf-8"),
					l = e => a.decode(new Uint8Array(e));

				function c(e) {
					const t = new Set;
					let n = e[0];
					for (let r = 1; r < e.length; r++) {
						const s = e[r];
						t.add([n, s]), n = s
					}
					return t
				}
				const u = new TextEncoder("utf-8");
				const _ = /'s|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+/gu;
				let d = !1;
				const f = {};
				let p, h = {},
					m = new Map,
					g = new Map;
				const y = new Map;

				function b() {
					if (d) return;
					h = JSON.parse(r.readFileSync(s.resolve(__dirname, "..", "dist", "tokenizer.json"))), Object.keys(h).map((e => {
						f[h[e]] = e
					}));
					const e = r.readFileSync(s.resolve(__dirname, "..", "dist", "vocab.bpe"), "utf-8").split("\n"),
						t = e.slice(1, e.length - 1).map((e => e.split(/(\s+)/).filter((function(e) {
							return e.trim().length > 0
						}))));
					p = ((e, t) => {
							const n = {};
							return e.map(((r, s) => {
								n[e[s]] = t[s]
							})), n
						})(t, i(0, t.length)),
						function(e) {
							const t = i(o("!"), o("~") + 1).concat(i(o("¡"), o("¬") + 1), i(o("®"), o("ÿ") + 1));
							let n = t.slice(),
								r = 0;
							for (let e = 0; e < 256; e++) t.includes(e) || (t.push(e), n.push(256 + r), r += 1);
							n = n.map((e => (e => String.fromCharCode(e))(e)));
							for (let r = 0; r < t.length; r++) e.set(t[r], n[r])
						}(m), m.forEach((function(e, t, n) {
							g.set(e, t)
						})), d = !0
				}

				function w(e) {
					if (y.has(e)) return y.get(e);
					let t = (r = e, Array.from(u.encode(r))).map((e => m.get(e))),
						n = c(t);
					var r;
					if (!n) return t.map((e => h[e]));
					for (;;) {
						const e = {};
						Array.from(n).map((t => {
							const n = p[t];
							e[isNaN(n) ? 1e11 : n] = t
						}));
						const r = e[Math.min(...Object.keys(e).map((e => parseInt(e))))];
						if (!(r in p)) break;
						const s = r[0],
							i = r[1];
						let o = [],
							a = 0;
						for (; a < t.length;) {
							const e = t.indexOf(s, a);
							if (-1 === e) {
								Array.prototype.push.apply(o, t.slice(a));
								break
							}
							Array.prototype.push.apply(o, t.slice(a, e)), a = e, t[a] === s && a < t.length - 1 && t[a + 1] === i ? (o.push(s + i), a += 2) : (o.push(t[a]), a += 1)
						}
						if (t = o, 1 === t.length) break;
						n = c(t)
					}
					return tokens = t.map((e => h[e])), y.set(e, tokens), tokens
				}

				function v(e) {
					b();
					let t = [];
					const n = Array.from(e.matchAll(_)).map((e => e[0]));
					for (let e of n) {
						const n = w(e);
						Array.prototype.push.apply(t, n)
					}
					return t
				}

				function x(e, t) {
					if (t <= 0) return "";
					let n = Math.min(e.length, 4 * t),
						r = e.slice(-n),
						s = v(r);
					for (; s.length < t + 2 && n < e.length;) n = Math.min(e.length, n + 1 * t), r = e.slice(-n), s = v(r);
					return s.length < t ? e : (s = s.slice(-t), E(s))
				}

				function E(e) {
					b();
					let t = e.map((e => f[e])).join("");
					return t = l(t.split("").map((e => g.get(e)))), t
				}
				e.exports = {
					prepareTokenizer: b,
					tokenize: v,
					tokenize_strings: function(e) {
						return v(e).map((e => l(f[e].split("").map((e => g.get(e))))))
					},
					tokenLength: function(e) {
						return v(e).length
					},
					takeLastTokens: x,
					takeLastLinesTokens: function(e, t) {
						const n = x(e, t);
						if (n.length === e.length || "\n" === e[e.length - n.length - 1]) return n;
						let r = n.indexOf("\n");
						return n.substring(r + 1)
					},
					takeFirstTokens: function(e, t) {
						if (t <= 0) return {
							text: "",
							tokens: []
						};
						let n = Math.min(e.length, 4 * t),
							r = e.slice(0, n),
							s = v(r);
						for (; s.length < t + 2 && n < e.length;) n = Math.min(e.length, n + 1 * t), r = e.slice(0, n), s = v(r);
						return s.length < t ? {
							text: e,
							tokens: s
						} : (s = s.slice(0, t), {
							text: E(s),
							tokens: s
						})
					},
					detokenize: E
				}
			},
			747: e => {
				"use strict";
				e.exports = require("fs")
			},
			622: e => {
				"use strict";
				e.exports = require("path")
			},
			13: e => {
				"use strict";
				e.exports = require("worker_threads")
			}
		},
		t = {};

	function n(r) {
		var s = t[r];
		if (void 0 !== s) return s.exports;
		var i = t[r] = {
			exports: {}
		};
		return e[r].call(i.exports, i, i.exports, n), i.exports
	}(() => {
		const e = n(563),
			{
				parentPort: t
			} = n(13),
			{
				defaultFileSystem: r
			} = n(271);
		t.on("message", (async ({
			id: n,
			fn: s,
			args: i
		}) => {
			try {
				if ("getPrompt" === s) {
					let s = await e.getPrompt(r, ...i);
					t.postMessage({
						id: n,
						res: s
					})
				} else {
					let r = await e[s](...i);
					t.postMessage({
						id: n,
						res: r
					})
				}
			} catch (e) {
				t.postMessage({
					id: n,
					err: e
				})
			}
		}))
	})(), module.exports = {}
})();
//# sourceMappingURL=worker.js.map