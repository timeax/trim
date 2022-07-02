"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLBase = void 0;
const __1 = require("..");
class HTMLBase extends __1.BaseNode {
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
}
exports.HTMLBase = HTMLBase;
