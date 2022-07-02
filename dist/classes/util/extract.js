"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._call = exports.extractVars = void 0;
function extractVars(source, func, _$ = false, glob = null) {
    let ctx = {};
    let fn = Function(source);
    if (_$)
        fn.bind(_$);
    global.__GLOBAL__ = glob;
    ctx = Object.assign(ctx, fn.call(ctx));
    for (const key in ctx) {
        if (Object.prototype.hasOwnProperty.call(ctx, key)) {
            const value = ctx[key];
            func({ key: key, value: value });
        }
    }
}
exports.extractVars = extractVars;
function _call(global, src) {
    const _$ = global;
    return eval(src);
}
exports._call = _call;
