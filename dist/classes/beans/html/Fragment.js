"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fragment = void 0;
const html_1 = require("../../../components/html");
class Fragment extends html_1.HTML {
    constructor() {
        super(...arguments);
        this.tagName = 'FragmentTag$';
        // @ts-ignore
        this.isBlock = true;
        // @ts-ignore
        this.htmlType = 'DomElement';
        // @ts-ignore
        this.type = 'Fragment';
    }
    //@ts-ignore
    get name() {
        return this.tagName;
    }
    get closed() {
        return super.closed;
    }
    set closed(value) {
        this.tagName = 'div';
        super.closed = value;
    }
}
exports.Fragment = Fragment;
